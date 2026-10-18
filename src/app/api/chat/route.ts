import { createFormsClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { formError, readJson, text, unavailable, uuid } from "@/lib/public-forms";
import { fromThisSite, notFromThisSite, overLimit, tooManyRequests } from "@/lib/rate-limit";
import { conciergeConfigured, runConcierge } from "@/lib/chat/concierge";
import { toAppended, toState, type ChatClient } from "@/lib/chat/store";
import { CHAT_MAX_LENGTH, type ChatBlock, type ChatFeed, type ChatMessage } from "@/lib/chat/types";
import { CONTACT } from "@/lib/data";

/* /api/chat — the website's chat widget.
   POST  { session, message, page, device }: saves the visitor's message and,
         unless a team member has taken over, answers it with the AI
         concierge. Returns the new messages.
   GET   ?after=… with the session in an X-Chat-Session header: messages
         since `after` (all recent ones when 0), so team replies reach the
         widget while it's open. The id stays out of URLs and request logs.
   Everything is saved in Supabase (chat_sessions, chat_messages) and shows
   up in /admin/chats. */

// An AI turn with a couple of tool calls usually takes 2–8 seconds.
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "private, no-store" };
const feed = (body: ChatFeed) => Response.json(body, { headers: NO_STORE });

/* A card number typed into the chat is never saved or sent to the AI. Only
   digit runs that pass the card checksum (Luhn) are removed, so phone
   numbers and dates are left alone. */
function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    sum += d;
  }
  return sum % 10 === 0;
}

function withoutCardNumbers(text: string) {
  return text.replace(/\b\d(?:[ -]?\d){12,18}\b/g, (match) =>
    luhn(match.replace(/\D/g, "")) ? "[card number removed]" : match,
  );
}

function pagePath(value: unknown) {
  const path = text(value);
  return path && path.startsWith("/") && !path.startsWith("//") ? path.slice(0, 300) : null;
}

function deviceOf(value: unknown) {
  return value === "mobile" || value === "tablet" || value === "desktop" ? value : null;
}

const FALLBACK = `Sorry, I can't answer properly just now. I've let the team know and they'll reply right here, or you can [message us on WhatsApp](${CONTACT.whatsappHref}) or call ${CONTACT.phone}.`;

let warnedNoKey = false;

function describe(error: unknown) {
  const e = error as { name?: string; message?: string; statusCode?: number } | null;
  const text = `${e?.name ?? "Error"}${e?.statusCode ? ` ${e.statusCode}` : ""}: ${e?.message ?? String(error)}`;
  return text.replace(/sk-[A-Za-z0-9_*.-]{6,}/g, "sk-[redacted]").slice(0, 300);
}

/* The concierge's reply. When the AI can't answer, the team is alerted
   instead, so no visitor is left without a response. */
async function answer(supabase: ChatClient, session: string, page: string | null, device: string | null, startedAt: string) {
  const handOff = async (reason: string) => {
    const { error } = await supabase.rpc("chat_update", { p_session_id: session, p_fields: { handover: reason } });
    if (error) console.error(`[chat] chat_update ${error.code}: ${error.message}`);
    return { text: FALLBACK, blocks: [{ type: "handover" }] as ChatBlock[] };
  };

  if (!conciergeConfigured()) {
    if (!warnedNoKey) {
      warnedNoKey = true;
      console.error("[chat] OPENAI_API_KEY is not set: the concierge hands every chat to the team.");
    }
    return handOff("The AI is switched off (no OpenAI key). Please reply.");
  }

  const history = await supabase.rpc("chat_feed", { p_session_id: session, p_after: 0, p_limit: 40 });
  if (history.error) {
    console.error(`[chat] chat_feed ${history.error.code}: ${history.error.message}`);
    return handOff("The AI couldn't read this chat. Please reply.");
  }

  try {
    const reply = await runConcierge({ client: supabase, session, state: toState(history.data), page, device, startedAt });
    if (!reply.text && !reply.blocks.length) return handOff("The AI gave an empty answer. Please reply.");
    return reply;
  } catch (error) {
    // One line, no conversation text: the error object carries the whole prompt.
    console.error(`[chat] AI reply failed: ${describe(error)}`);
    return handOff("The AI couldn't answer (technical problem). Please reply.");
  }
}

export async function POST(request: Request) {
  if (!fromThisSite(request)) return notFromThisSite();
  if (overLimit(request, "chat", 40, 10 * 60_000)) return tooManyRequests(120);
  const body = await readJson(request);
  const session = uuid(body?.session);
  const raw = text(body?.message)?.trim().slice(0, CHAT_MAX_LENGTH);
  const message = raw ? withoutCardNumbers(raw) : null;
  if (!body || !session || !message) return Response.json({ error: "Invalid request." }, { status: 400 });

  const supabase = createFormsClient();
  if (!supabase) return unavailable();

  const page = pagePath(body.page);
  const device = deviceOf(body.device);
  const startedAt = new Date().toISOString();

  const sent = await supabase.rpc("chat_append", {
    p_session_id: session,
    p_role: "user",
    p_content: message,
    p_context: { page, device, user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null },
  });
  if (sent.error) return formError(sent.error);
  const visitor = toAppended(sent.data);
  const messages: ChatMessage[] = visitor.message ? [visitor.message] : [];

  // A team member is in charge: they answer from /admin/chats.
  if (visitor.mode === "human") return feed({ mode: "human", messages });

  const reply = await answer(supabase, session, page, device, startedAt);
  const saved = await supabase.rpc("chat_append", {
    p_session_id: session,
    p_role: "assistant",
    p_content: reply.text,
    p_blocks: reply.blocks as Json,
  });
  if (saved.error) {
    console.error(`[chat] chat_append ${saved.error.code}: ${saved.error.message}`);
    return feed({ mode: "ai", messages });
  }

  // A null message: a team member took over while the AI was writing.
  const ai = toAppended(saved.data);
  if (ai.message) messages.push(ai.message);
  return feed({ mode: ai.mode, messages });
}

export async function GET(request: Request) {
  if (!fromThisSite(request)) return notFromThisSite();
  if (overLimit(request, "chat-feed", 600, 10 * 60_000)) return tooManyRequests(60);
  const url = new URL(request.url);
  const session = uuid(request.headers.get("x-chat-session"));
  const after = Math.max(0, Math.floor(Number(url.searchParams.get("after")) || 0));
  if (!session) return Response.json({ error: "Invalid request." }, { status: 400 });

  const supabase = createFormsClient();
  if (!supabase) return unavailable();

  const { data, error } = await supabase.rpc("chat_feed", { p_session_id: session, p_after: after, p_limit: after ? 60 : 80 });
  if (error) return formError(error);
  const state = toState(data);
  return feed({ mode: state.mode, messages: state.messages });
}
