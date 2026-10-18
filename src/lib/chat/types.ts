import type { CartKey } from "@/lib/data";

/* Shapes shared by the chat widget, /api/chat and the admin's Chats page. */

export type ChatRole = "user" | "assistant" | "agent" | "system";
export type ChatMode = "ai" | "human";

/* The reserve form's fields, as the concierge gathers them. Keys match the
   bookings table (and src/lib/booking-fields.ts). */
export type BookingDraft = {
  name?: string;
  phone?: string;
  email?: string;
  event_type?: string;
  event_date?: string; // YYYY-MM-DD
  guests?: string;
  venue?: string;
  cart?: string;
  flavours?: string[];
  custom_flavour?: string;
  message?: string;
};

/* What the chat draws under a message. Only the site's own code writes
   these (the AI's tools), never the model's text. */
export type ChatBlock =
  | { type: "flavours"; slugs: string[]; pick: boolean }
  | { type: "carts"; highlight: CartKey | null }
  | { type: "choices"; options: string[] }
  | { type: "booking-draft"; draft: BookingDraft; missing: string[] }
  | { type: "booking-sent"; draft: BookingDraft }
  | { type: "lead-saved" }
  | { type: "handover" };

export type ChatMessage = {
  id: number;
  role: ChatRole;
  content: string;
  blocks: ChatBlock[];
  createdAt: string;
};

/* GET /api/chat and POST /api/chat answer with this. */
export type ChatFeed = {
  mode: ChatMode;
  messages: ChatMessage[];
};

export const CHAT_MAX_LENGTH = 1000;
