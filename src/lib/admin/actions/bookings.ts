"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";
import type { ActionResult } from "../types";
import { actionError, isDay, isUuid } from "../validate";

/* Confirming puts the booking on the calendar. Also used to reschedule a
   booking that's already confirmed. */
export async function confirmBooking(id: string, day: string, time: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown booking." };
  if (!isDay(day)) return { ok: false, error: "Choose the event date." };
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { ok: false, error: "That time isn't valid." };

  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed", confirmed_date: day, confirmed_time: time || null })
    .eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That booking couldn't be confirmed.") };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

const MANUAL_STATUSES = ["pending", "declined", "cancelled"] as const;

/* Decline a request, cancel a confirmed booking, or reopen either. */
export async function setBookingStatus(
  id: string,
  status: (typeof MANUAL_STATUSES)[number],
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id) || !MANUAL_STATUSES.includes(status)) return { ok: false, error: "Unknown booking." };

  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { ok: false, error: actionError(error) };

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function saveBookingNotes(id: string, notes: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown booking." };

  const { error } = await supabase
    .from("bookings")
    .update({ admin_notes: notes.trim().slice(0, 10000) || null })
    .eq("id", id);
  if (error) return { ok: false, error: actionError(error, "Those notes didn't save.") };

  revalidatePath("/admin/bookings", "layout");
  return { ok: true };
}

export async function moveBookingToCrm(id: string): Promise<ActionResult<string>> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown booking." };

  const { data, error } = await supabase.rpc("crm_lead_from_booking", { p_booking_id: id });
  if (error || !data) return { ok: false, error: actionError(error, "That booking couldn't be added to the CRM.") };

  revalidatePath("/admin", "layout");
  return { ok: true, data };
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown booking." };

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That booking couldn't be deleted.") };

  revalidatePath("/admin", "layout");
  redirect("/admin/bookings");
}
