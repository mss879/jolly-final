import type { ChatMode } from "@/lib/chat/types";

/* The visitor's conversation, remembered in this browser so it carries on
   across pages and visits. The id is their key to it on the server. */

const KEY = "jolly-chat";

export type StoredChat = { id: string; mode: ChatMode };

export function readChat(): StoredChat | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<StoredChat> | null;
    return value && typeof value.id === "string" ? { id: value.id, mode: value.mode === "human" ? "human" : "ai" } : null;
  } catch {
    return null;
  }
}

export function writeChat(value: StoredChat | null) {
  try {
    if (value) localStorage.setItem(KEY, JSON.stringify(value));
    else localStorage.removeItem(KEY);
  } catch {
    // private mode or storage blocked: the chat still works for this page
  }
}

export function newChatId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function deviceType() {
  const w = window.innerWidth;
  return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

/* sessionStorage, for the once-a-visit help bubble. */
export function sessionValue(key: string, value?: string) {
  try {
    if (value === undefined) return sessionStorage.getItem(key);
    sessionStorage.setItem(key, value);
    return value;
  } catch {
    return null;
  }
}
