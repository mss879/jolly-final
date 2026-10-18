"use server";

import { revalidatePath } from "next/cache";
import { requireVerifiedAdmin } from "../auth";
import { getChat } from "../queries";
import type { ActionResult, ChatUpdate } from "../types";
import { actionError, isUuid } from "../validate";

/* Taking over, replying and handing back go through the database's admin
   functions (supabase/migrations/20261018120000_ai_chat.sql), which also
   post the notice the visitor sees. */

/* The open conversation checks in every few seconds for new messages. */
export async function pollChat(id: string, after: number): Promise<ActionResult<ChatUpdate>> {
  if (!isUuid(id) || !Number.isSafeInteger(after) || after < 0) return { ok: false, error: "Unknown chat." };
  const update = await getChat(id, after);
  if (!update) return { ok: false, error: "This chat has been deleted." };
  return { ok: true, data: update };
}

/* Replying also takes over: the AI stops answering this visitor. */
export async function replyToChat(id: string, text: string): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  const content = typeof text === "string" ? text.trim() : "";
  if (!isUuid(id)) return { ok: false, error: "Unknown chat." };
  if (!content) return { ok: false, error: "Write a reply first." };
  if (content.length > 4000) return { ok: false, error: "Keep replies under 4,000 characters." };

  const { error } = await supabase.rpc("chat_admin_reply", { p_session_id: id, p_content: content });
  if (error) return { ok: false, error: actionError(error, "That reply didn't send — please try again.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* "human" pauses the AI so the team can talk; "ai" hands the chat back. */
export async function setChatMode(id: string, mode: "ai" | "human"): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  if (!isUuid(id) || (mode !== "ai" && mode !== "human")) return { ok: false, error: "Unknown chat." };

  const { error } = await supabase.rpc("chat_admin_set_mode", { p_session_id: id, p_mode: mode });
  if (error) return { ok: false, error: actionError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* Clears "needs you" without replying, e.g. after calling the visitor. */
export async function markChatHandled(id: string): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown chat." };

  const { error } = await supabase.from("chat_sessions").update({ attention: false }).eq("id", id);
  if (error) return { ok: false, error: actionError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* Deletes the conversation and its messages. A booking or CRM lead it
   created stays. */
export async function deleteChat(id: string): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown chat." };

  const { error } = await supabase.from("chat_sessions").delete().eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That chat couldn't be deleted.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}
