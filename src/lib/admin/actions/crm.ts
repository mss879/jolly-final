"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth";
import type { ActionResult } from "../types";
import { actionError, isDay, isUuid } from "../validate";

/* The New Leads stage is protected in the database itself (trigger +
   functions), so these actions only need to shape and validate input. */

function stageName(value: string) {
  const name = value.trim();
  return name.length >= 1 && name.length <= 40 ? name : null;
}

export async function createStage(value: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const name = stageName(value);
  if (!name) return { ok: false, error: "Stage names need 1–40 characters." };

  const { data: last } = await supabase
    .from("crm_stages")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from("crm_stages").insert({ name, position: (last?.position ?? 0) + 1 });
  if (error) return { ok: false, error: actionError(error, "That stage couldn't be added.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function renameStage(id: string, value: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const name = stageName(value);
  if (!isUuid(id)) return { ok: false, error: "Unknown stage." };
  if (!name) return { ok: false, error: "Stage names need 1–40 characters." };

  const { error } = await supabase.from("crm_stages").update({ name }).eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That stage couldn't be renamed.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteStage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown stage." };

  const { error } = await supabase.rpc("crm_delete_stage", { p_stage_id: id });
  if (error) return { ok: false, error: actionError(error, "That stage couldn't be deleted.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* `ids` is the new left-to-right order of every stage except New Leads. */
export async function reorderStages(ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!Array.isArray(ids) || !ids.every(isUuid)) return { ok: false, error: "Unknown stage." };

  const { error } = await supabase.rpc("crm_reorder_stages", { p_stage_ids: ids });
  if (error) return { ok: false, error: actionError(error, "The stages couldn't be reordered.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

/* Drag and drop: the board already shows the move, so no re-render. */
export async function moveLead(leadId: string, stageId: string, index: number): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(leadId) || !isUuid(stageId) || !Number.isInteger(index) || index < 0) {
    return { ok: false, error: "That move didn't make sense — refresh and try again." };
  }

  const { error } = await supabase.rpc("crm_move_lead", { p_lead_id: leadId, p_stage_id: stageId, p_index: index });
  if (error) return { ok: false, error: actionError(error, "That move didn't save — the card went back.") };
  return { ok: true };
}

export type LeadInput = {
  id?: string;
  stageId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: string;
  valueLkr: string;
  notes: string;
};

const optional = (value: string, max: number) => value.trim().slice(0, max) || null;

export async function saveLead(input: LeadInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const name = input.name.trim();
  if (!name || name.length > 120) return { ok: false, error: "Add a name (up to 120 characters)." };
  if (!isUuid(input.stageId)) return { ok: false, error: "Pick a stage." };
  if (input.eventDate && !isDay(input.eventDate)) return { ok: false, error: "That event date isn't valid." };

  const guests = input.guests.trim() ? Number(input.guests) : null;
  if (guests !== null && (!Number.isInteger(guests) || guests < 1 || guests > 100000)) {
    return { ok: false, error: "Guests should be a whole number." };
  }
  const value = input.valueLkr.trim() ? Number(input.valueLkr.replace(/,/g, "")) : null;
  if (value !== null && (!Number.isFinite(value) || value < 0 || value >= 1e10)) {
    return { ok: false, error: "The value should be a positive amount in rupees." };
  }

  const row = {
    stage_id: input.stageId,
    name,
    email: optional(input.email, 254),
    phone: optional(input.phone, 40),
    event_type: optional(input.eventType, 60),
    event_date: input.eventDate || null,
    guests,
    value_lkr: value,
    notes: optional(input.notes, 10000),
  };

  if (input.id) {
    if (!isUuid(input.id)) return { ok: false, error: "Unknown lead." };
    const { data: current } = await supabase.from("crm_leads").select("stage_id").eq("id", input.id).maybeSingle();
    if (!current) return { ok: false, error: "That lead no longer exists." };

    const { stage_id: stageId, ...fields } = row;
    const { error } = await supabase.from("crm_leads").update(fields).eq("id", input.id);
    if (error) return { ok: false, error: actionError(error) };
    // Changing the stage from the form puts the card at the top of its new column.
    if (stageId !== current.stage_id) {
      const moved = await supabase.rpc("crm_move_lead", { p_lead_id: input.id, p_stage_id: stageId, p_index: 0 });
      if (moved.error) return { ok: false, error: actionError(moved.error) };
    }
  } else {
    const { error } = await supabase.from("crm_leads").insert({ ...row, source: "manual" });
    if (error) return { ok: false, error: actionError(error, "That lead couldn't be added.") };
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown lead." };

  const { error } = await supabase.from("crm_leads").delete().eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That lead couldn't be deleted.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}
