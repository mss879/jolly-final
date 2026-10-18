import "server-only";
import { createHash } from "node:crypto";
import { generateText, isStepCount, tool, type ModelMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { CARTS, CONTACT, EVENT_TYPES, FLAVORS, type Flavor } from "@/lib/data";
import {
  bookingFields,
  colomboToday,
  fieldLabel,
  longDate,
  matchCart,
  matchFlavour,
  mergeDraft,
  missingFields,
  summariseDraft,
} from "./booking";
import { CONCIERGE_INSTRUCTIONS, conversationNotes } from "./knowledge";
import { storedDraft, type ChatClient, type ChatState } from "./store";
import type { ChatBlock, ChatMessage } from "./types";

/* Jolly's Concierge: one AI turn. The model answers from the knowledge base
   in knowledge.ts and acts through the tools below. Tools that show things
   add "blocks" (flavour cards, cart colours, the booking summary) that the
   chat draws under the reply; tools that save things write to Supabase
   through the same functions the website's forms use. */

const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";

let provider: ReturnType<typeof createOpenAI> | null = null;
function model() {
  provider ??= createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Optional, for a proxy or gateway in front of OpenAI.
    baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
  });
  return provider(MODEL);
}

export const conciergeConfigured = () => Boolean(process.env.OPENAI_API_KEY?.trim());

export type ConciergeTurn = {
  client: ChatClient;
  session: string;
  state: ChatState;
  page: string | null;
  device: string | null;
  startedAt: string; // when this request began (ISO)
};

/* What earlier replies showed, so the model knows without seeing the cards. */
function blockNote(block: ChatBlock) {
  switch (block.type) {
    case "flavours": {
      const names = block.slugs.map((slug) => FLAVORS.find((f) => f.slug === slug)?.name).filter(Boolean);
      return `flavour cards for ${names.join(", ")}${block.pick ? " (tap to pick)" : ""}`;
    }
    case "carts":
      return "the three cart colours";
    case "choices":
      return `quick replies: ${block.options.join(" / ")}`;
    case "booking-draft":
      return "the reservation summary card";
    case "booking-sent":
      return "confirmation that the reservation request was sent";
    case "lead-saved":
      return "confirmation that their details went to the team";
    case "handover":
      return "a note that the team has been asked to join";
    default:
      return null;
  }
}

function toModelMessages(messages: ChatMessage[]): ModelMessage[] {
  return messages.flatMap((m): ModelMessage[] => {
    if (m.role === "user") return [{ role: "user", content: m.content }];
    if (m.role === "agent") return [{ role: "assistant", content: `Team member: ${m.content}` }];
    if (m.role !== "assistant") return [];
    const notes = m.blocks.map(blockNote).filter(Boolean);
    const content = [m.content, notes.length ? `[Shown: ${notes.join("; ")}]` : ""].filter(Boolean).join("\n\n");
    return content ? [{ role: "assistant", content }] : [];
  });
}

const GROUPS = ["all", "dairy-free", "Sorbet", "Fruity", "Classic", "Chocolate", "Seasonal"] as const;
const CART_NAMES = CARTS.map((c) => c.name) as [string, ...string[]];

/* "Can I talk to a person?" A visitor asking this always reaches the team,
   even if the model answers without calling request_human. */
const WANTS_PERSON =
  /\b(?:(?:speak|talk|chat)\s+(?:to|with)\s+(?:a\s+|an\s+|the\s+|your\s+|some)?(?:real\s+|actual\s+)?(?:person|human|someone|somebody|agent|team|staff|manager|owner)|human\s+agent|customer\s+(?:service|support)|call\s+me\s+back)\b/i;

/* The brand never uses em dashes; the model sometimes does anyway. */
function houseStyle(text: string) {
  return text
    .trim()
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/,\s*([.,!?])/g, "$1");
}

function friendlyFailure(action: string) {
  return `${action} couldn't go through because of a technical problem. Apologise briefly and suggest WhatsApp (${CONTACT.whatsappHref}) or calling ${CONTACT.phone}. The team can also see this chat.`;
}

export async function runConcierge(turn: ConciergeTurn) {
  const { client, session, state, page, device, startedAt } = turn;
  const blocks: ChatBlock[] = [];
  // One block of each kind per reply: a later call replaces an earlier one.
  const put = (block: ChatBlock) => {
    const i = blocks.findIndex((b) => b.type === block.type);
    if (i >= 0) blocks.splice(i, 1);
    blocks.push(block);
  };

  // Flags the chat for the team in /admin/chats.
  const askForPerson = async (reason: string) => {
    const { error } = await client.rpc("chat_update", { p_session_id: session, p_fields: { handover: reason.slice(0, 300) } });
    if (error) {
      console.error(`[chat] chat_update ${error.code}: ${error.message}`);
      return false;
    }
    put({ type: "handover" });
    return true;
  };

  const tools = {
    show_flavours: tool({
      description:
        "Show flavour cards (a photo of each scoop and its name) in the chat. Use it whenever flavours come up, and with pick: true when the visitor is choosing flavours for their event.",
      inputSchema: z.object({
        group: z.enum(GROUPS).optional().describe("Which flavours to show. Ignored when names is given."),
        names: z
          .array(z.string())
          .max(15)
          .optional()
          .describe("Flavour names to show instead of a group, for example your recommendations."),
        pick: z.boolean().optional().describe("true when they're choosing flavours for their event: they can tap cards to pick."),
      }),
      execute: async ({ group, names, pick }) => {
        let list: Flavor[] = [];
        if (names?.length) {
          for (const name of names) {
            const f = matchFlavour(name);
            if (f && !list.includes(f)) list.push(f);
          }
        } else if (group === "dairy-free") list = FLAVORS.filter((f) => f.dairyFree);
        else if (group && group !== "all") list = FLAVORS.filter((f) => f.category === group);
        if (!list.length) list = FLAVORS;
        put({ type: "flavours", slugs: list.map((f) => f.slug), pick: Boolean(pick) });
        return { shown: list.map((f) => f.name) };
      },
    }),

    show_carts: tool({
      description: "Show the three cart colours, with photos, in the chat. The visitor can tap one to choose it.",
      inputSchema: z.object({
        highlight: z.enum(CART_NAMES).optional().describe("A colour to highlight, if they've mentioned one."),
      }),
      execute: async ({ highlight }) => {
        put({ type: "carts", highlight: highlight ? (matchCart(highlight)?.key ?? null) : null });
        return { shown: CART_NAMES };
      },
    }),

    offer_choices: tool({
      description: "Show two to five quick-reply buttons under your message, for a simple choice such as the occasion.",
      inputSchema: z.object({
        options: z.array(z.string().min(1).max(40)).min(2).max(5),
      }),
      execute: async ({ options }) => {
        const unique = [...new Set(options.map((o) => o.trim()).filter(Boolean))].slice(0, 5);
        if (unique.length >= 2) put({ type: "choices", options: unique });
        return { shown: unique };
      },
    }),

    prepare_booking: tool({
      description:
        "Save the reservation details gathered so far and show the visitor a summary card to check. Pass only fields you have; pass an empty string to clear one. Call it once you have their name, phone, email and occasion, and again whenever details change.",
      inputSchema: z.object({
        name: z.string().optional(),
        phone: z.string().optional().describe("Phone or WhatsApp number"),
        email: z.string().optional(),
        event_type: z.string().optional().describe(`One of: ${EVENT_TYPES.join(", ")}`),
        event_date: z.string().optional().describe("YYYY-MM-DD"),
        guests: z.number().int().optional().describe("Estimated number of guests"),
        venue: z.string().optional().describe("Venue name or area"),
        cart: z.string().optional().describe(CART_NAMES.join(", ")),
        flavours: z.array(z.string()).optional().describe("Flavour names from the menu"),
        custom_flavour: z.string().optional().describe("Flavours they'd like made specially (minimum 500 cups)"),
        message: z.string().optional().describe("Anything else for the team: theme, colours, timings"),
      }),
      execute: async (input) => {
        if (state.bookingSent) {
          return { ready: false, error: "A reservation from this chat has already been sent. For changes, call request_human." };
        }
        const { draft, missing, problems } = mergeDraft(state.draft.fields, input);
        // Ready when the card shows everything a request needs. Values that
        // didn't pass (problems) were left off it, so the card is still what
        // gets sent; the model raises them with the visitor.
        const ready = missing.length === 0;
        const unchanged = JSON.stringify(draft) === JSON.stringify(state.draft.fields);
        // The summary they confirm must be one they saw in an earlier reply.
        state.draft = { fields: draft, preparedAt: ready ? (unchanged && state.draft.preparedAt) || startedAt : null };

        const { error } = await client.rpc("chat_update", {
          p_session_id: session,
          p_fields: {
            booking_draft: storedDraft(state.draft),
            visitor_name: draft.name ?? null,
            visitor_email: draft.email ?? null,
            visitor_phone: draft.phone ?? null,
          },
        });
        if (error) console.error(`[chat] chat_update ${error.code}: ${error.message}`);

        put({ type: "booking-draft", draft, missing: missing.map(fieldLabel) });
        return {
          ready,
          missing: missing.map(fieldLabel),
          problems,
          date: draft.event_date ? longDate(draft.event_date) : null,
          next: ready
            ? `They now see a summary card. ${problems.length ? "Mention the problems briefly. " : ""}Ask them to check it and confirm. Call submit_booking only after they confirm in their next message.`
            : "Ask for what's missing, then call prepare_booking again.",
        };
      },
    }),

    submit_booking: tool({
      description:
        "Send the reservation request on the summary card to the team. Only call this after the visitor has seen the summary card and clearly confirmed it.",
      inputSchema: z.object({}),
      execute: async () => {
        if (state.bookingSent) return { ok: false, error: "Already sent. Don't send it again." };
        const { fields, preparedAt } = state.draft;
        const missing = missingFields(fields);
        if (missing.length) return { ok: false, error: `Still needed: ${missing.map(fieldLabel).join(", ")}.` };
        if (!preparedAt) return { ok: false, error: "Call prepare_booking first so they can check the summary." };
        if (preparedAt >= startedAt) {
          return { ok: false, error: "They haven't confirmed this summary yet. Ask them to check the card and confirm." };
        }

        const { error } = await client.rpc("submit_booking", {
          p_session_id: session,
          p_fields: bookingFields(fields),
          p_context: { source: "AI chat", landing_path: page, device },
        });
        if (error) {
          if (error.code === "PT400" || error.code === "PT429") return { ok: false, error: error.message };
          console.error(`[chat] submit_booking ${error.code}: ${error.message}`);
          return { ok: false, error: friendlyFailure("The reservation") };
        }
        state.bookingSent = true;
        put({ type: "booking-sent", draft: fields });
        return {
          ok: true,
          next: "Thank them warmly. The team will reply within one working day with availability, a flavour menu and a styled cart proposal.",
        };
      },
    }),

    save_lead: tool({
      description:
        "Pass an interested visitor's details to the team's CRM so they can follow up. For people who aren't reserving now. Ask their permission first. Needs a name and a phone number or email.",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        interest: z.enum(EVENT_TYPES).optional().describe("What they're interested in"),
        event_date: z.string().optional().describe("YYYY-MM-DD, if they have a date"),
        guests: z.number().int().optional(),
        notes: z.string().describe("One or two lines for the team: what they want, any details, and how or when to reach them."),
      }),
      execute: async ({ name, phone, email, interest, event_date, guests, notes }) => {
        const { error } = await client.rpc("chat_capture_lead", {
          p_session_id: session,
          p_fields: {
            name,
            phone: phone ?? null,
            email: email ?? null,
            event_type: interest ?? null,
            event_date: event_date ?? null,
            guests: guests ? String(guests) : null,
            notes,
          },
        });
        if (error) {
          if (error.code === "PT400" || error.code === "PT429") return { ok: false, error: error.message };
          console.error(`[chat] chat_capture_lead ${error.code}: ${error.message}`);
          return { ok: false, error: friendlyFailure("Saving their details") };
        }
        state.leadSaved = true;
        put({ type: "lead-saved" });
        return { ok: true, next: "Let them know the team will be in touch." };
      },
    }),

    request_human: tool({
      description:
        "Ask a member of the Jolly's team to join this chat. Use it when the visitor asks for a person, has a complaint, or needs something you can't answer.",
      inputSchema: z.object({
        reason: z.string().describe("For the team, in a few words: why they need a person."),
      }),
      execute: async ({ reason }) => {
        if (!(await askForPerson(reason))) return { ok: false, error: friendlyFailure("Alerting the team") };
        return {
          ok: true,
          next: `Tell them a team member will reply right here in this chat, and they can also call or WhatsApp ${CONTACT.phone}.`,
        };
      },
    }),
  };

  const notes = conversationNotes({
    today: longDate(colomboToday()),
    page,
    bookingSent: state.bookingSent,
    leadSaved: state.leadSaved,
    draftSummary: state.bookingSent ? null : summariseDraft(state.draft.fields),
    teamJoined: state.messages.some((m) => m.role === "agent"),
  });

  const result = await generateText({
    model: model(),
    instructions: `${CONCIERGE_INSTRUCTIONS}\n\n${notes}`,
    messages: toModelMessages(state.messages),
    tools,
    stopWhen: isStepCount(6),
    reasoning: "low",
    maxOutputTokens: 1500,
    maxRetries: 1,
    timeout: 45_000,
    providerOptions: {
      openai: {
        textVerbosity: "low",
        parallelToolCalls: false,
        // Nothing is kept on OpenAI's side; reasoning travels between steps encrypted.
        store: false,
        include: ["reasoning.encrypted_content"],
        reasoningSummary: null,
        // Lets OpenAI tell visitors apart for abuse checks without learning who they are.
        safetyIdentifier: createHash("sha256").update(`jolly-chat:${session}`).digest("hex").slice(0, 32),
      },
    },
  });

  const asked = [...state.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (WANTS_PERSON.test(asked) && !blocks.some((b) => b.type === "handover")) {
    await askForPerson(`Asked for a person: "${asked.slice(0, 200)}"`);
  }

  // Quick replies always come last, under everything else.
  blocks.sort((a, b) => Number(a.type === "choices") - Number(b.type === "choices"));
  return { text: houseStyle(result.text), blocks };
}
