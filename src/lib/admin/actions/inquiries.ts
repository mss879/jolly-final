"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth";
import type { ActionResult } from "../types";
import { actionError, isUuid } from "../validate";

const STATUSES = ["new", "read", "archived"] as const;
type InquiryStatus = (typeof STATUSES)[number];

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id) || !STATUSES.includes(status)) return { ok: false, error: "Unknown inquiry." };

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) return { ok: false, error: actionError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* Opening a new inquiry marks it read. */
export async function markInquiryRead(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown inquiry." };

  const { error } = await supabase.from("inquiries").update({ status: "read" }).eq("id", id).eq("status", "new");
  if (error) return { ok: false, error: actionError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown inquiry." };

  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That inquiry couldn't be deleted.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* Copies the inquiry into the CRM's New Leads stage; returns the lead id. */
export async function moveInquiryToCrm(id: string): Promise<ActionResult<string>> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown inquiry." };

  const { data, error } = await supabase.rpc("crm_lead_from_inquiry", { p_inquiry_id: id });
  if (error || !data) return { ok: false, error: actionError(error, "That inquiry couldn't be moved to the CRM.") };

  revalidatePath("/admin", "layout");
  return { ok: true, data };
}
