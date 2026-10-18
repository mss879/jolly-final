import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";
import type { BookingDraft, ChatBlock, ChatMessage, ChatMode, ChatRole } from "./types";

/* Reads the chat_* functions' JSON answers (supabase/migrations/
   20261018120000_ai_chat.sql) into the shapes the code uses. */

export type ChatClient = SupabaseClient<Database>;

/* What chat_sessions.booking_draft holds: the answers so far, and when the
   visitor was last shown them as a summary card. */
export type StoredDraft = { fields: BookingDraft; preparedAt: string | null };

export type ChatState = {
  exists: boolean;
  mode: ChatMode;
  draft: StoredDraft;
  bookingSent: boolean;
  leadSaved: boolean;
  messages: ChatMessage[];
};

const ROLES: ChatRole[] = ["user", "assistant", "agent", "system"];

type Obj = Record<string, unknown>;
const isObj = (value: unknown): value is Obj => typeof value === "object" && value !== null && !Array.isArray(value);

export function toBlocks(value: unknown): ChatBlock[] {
  return Array.isArray(value) ? (value.filter((b) => isObj(b) && typeof b.type === "string") as ChatBlock[]) : [];
}

export function toMessage(value: unknown): ChatMessage | null {
  if (!isObj(value) || typeof value.id !== "number" || !ROLES.includes(value.role as ChatRole)) return null;
  return {
    id: value.id,
    role: value.role as ChatRole,
    content: typeof value.content === "string" ? value.content : "",
    blocks: toBlocks(value.blocks),
    createdAt: typeof value.created_at === "string" ? value.created_at : new Date().toISOString(),
  };
}

export function toDraft(value: unknown): StoredDraft {
  if (!isObj(value) || !isObj(value.fields)) return { fields: {}, preparedAt: null };
  return {
    fields: value.fields as BookingDraft,
    preparedAt: typeof value.prepared_at === "string" ? value.prepared_at : null,
  };
}

export function toState(data: Json | null): ChatState {
  const d = isObj(data) ? data : {};
  return {
    exists: d.exists === true,
    mode: d.mode === "human" ? "human" : "ai",
    draft: toDraft(d.booking_draft),
    bookingSent: d.booking_sent === true,
    leadSaved: d.lead_saved === true,
    messages: Array.isArray(d.messages) ? d.messages.map(toMessage).filter((m): m is ChatMessage => m !== null) : [],
  };
}

/* chat_append's answer: the conversation's mode, and the message as saved
   (null when an AI reply was dropped because a person took over). */
export function toAppended(data: Json | null) {
  const d = isObj(data) ? data : {};
  return { mode: (d.mode === "human" ? "human" : "ai") as ChatMode, message: toMessage(d.message) };
}

export function storedDraft(draft: StoredDraft): Json {
  return { fields: draft.fields as Json, prepared_at: draft.preparedAt };
}
