"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { EVENT_PHOTO_BUCKET, EVENT_PHOTO_PATH, MAX_EVENT_PHOTOS } from "@/lib/event-photos";
import { requireVerifiedAdmin } from "../auth";
import type { ActionResult } from "../types";
import { actionError, isDay, isUuid } from "../validate";

/* Recent events for the Reviews page. Photos go to the event-photos bucket
   under "<event id>/", one upload per call; the event row keeps their paths
   in display order. Saving tidies the folder, so photos taken out of an
   event (or uploaded and never saved) don't linger in storage. */

export type EventInput = {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  summary: string;
  photos: string[];
  published: boolean;
};

const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePath("/reviews");
}

const text = (value: unknown, max: number) => {
  const v = typeof value === "string" ? value.trim() : "";
  return v ? v.slice(0, max) : null;
};

export async function uploadEventPhoto(form: FormData): Promise<ActionResult<string>> {
  const { supabase } = await requireVerifiedAdmin();
  const eventId = form.get("eventId");
  const file = form.get("photo");
  if (!isUuid(eventId)) return { ok: false, error: "Unknown event." };
  if (!(file instanceof File) || !PHOTO_TYPES[file.type]) return { ok: false, error: "Use a JPG, PNG or WebP photo." };
  if (file.size > MAX_PHOTO_BYTES) return { ok: false, error: "That photo is too large — keep it under 5 MB." };

  const path = `${eventId.toLowerCase()}/${randomUUID()}.${PHOTO_TYPES[file.type]}`;
  const { error } = await supabase.storage
    .from(EVENT_PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) {
    console.error(`[admin] photo upload: ${error.message}`);
    return { ok: false, error: "That photo didn't upload — please try again." };
  }
  return { ok: true, data: path };
}

/* Removes whatever is in the event's folder that isn't in `keep`. */
async function tidyPhotos(supabase: Awaited<ReturnType<typeof requireVerifiedAdmin>>["supabase"], id: string, keep: string[]) {
  const bucket = supabase.storage.from(EVENT_PHOTO_BUCKET);
  const { data, error } = await bucket.list(id, { limit: 1000 });
  if (error || !data) return;
  const stale = data.map((f) => `${id}/${f.name}`).filter((p) => !keep.includes(p));
  if (stale.length) {
    const removed = await bucket.remove(stale);
    if (removed.error) console.error(`[admin] photo cleanup: ${removed.error.message}`);
  }
}

export async function saveEvent(input: EventInput): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  if (!isUuid(input?.id)) return { ok: false, error: "Unknown event." };
  const id = input.id.toLowerCase();

  const title = text(input.title, 120);
  if (!title) return { ok: false, error: "Give the event a title." };
  const eventDate = input.eventDate ? input.eventDate : null;
  if (eventDate !== null && !isDay(eventDate)) return { ok: false, error: "That date isn't valid." };

  const photos = Array.isArray(input.photos) ? [...new Set(input.photos)] : [];
  if (photos.length > MAX_EVENT_PHOTOS) return { ok: false, error: `Keep it to ${MAX_EVENT_PHOTOS} photos or fewer.` };
  if (!photos.every((p) => typeof p === "string" && EVENT_PHOTO_PATH.test(p) && p.startsWith(`${id}/`))) {
    return { ok: false, error: "One of the photos wasn't recognised — remove it and upload it again." };
  }
  const published = input.published === true;
  if (published && photos.length === 0) return { ok: false, error: "Add at least one photo before showing it on the website." };

  const { error } = await supabase.from("recent_events").upsert({
    id,
    title,
    event_type: text(input.eventType, 60),
    event_date: eventDate,
    location: text(input.location, 120),
    summary: text(input.summary, 1200),
    photos,
    published,
  });
  if (error) return { ok: false, error: actionError(error) };

  await tidyPhotos(supabase, id, photos);
  refresh();
  return { ok: true };
}

export async function setEventPublished(id: string, published: boolean): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown event." };

  if (published) {
    const { data } = await supabase.from("recent_events").select("photos").eq("id", id).maybeSingle();
    if (!data?.photos.length) return { ok: false, error: "Add at least one photo before showing it on the website." };
  }
  const { error } = await supabase.from("recent_events").update({ published }).eq("id", id);
  if (error) return { ok: false, error: actionError(error) };

  refresh();
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const { supabase } = await requireVerifiedAdmin();
  if (!isUuid(id)) return { ok: false, error: "Unknown event." };

  const { error } = await supabase.from("recent_events").delete().eq("id", id);
  if (error) return { ok: false, error: actionError(error, "That event couldn't be deleted.") };

  await tidyPhotos(supabase, id.toLowerCase(), []);
  refresh();
  return { ok: true };
}
