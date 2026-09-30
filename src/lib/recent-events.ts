import "server-only";
import { eventPhotoUrl } from "./event-photos";
import { isMissingSchema } from "./supabase/config";
import { createPublicClient } from "./supabase/server";

/* Recent events for the Reviews page — written and published in
   /admin/events (supabase/migrations/20260930120000_recent_events.sql). */

export type PublicEvent = {
  id: string;
  title: string;
  eventType: string | null;
  eventDate: string | null;
  location: string | null;
  summary: string | null;
  photos: string[]; // URLs; the first is the cover
};

/* Never throws: if Supabase isn't reachable, or the migration hasn't been
   run yet, the section simply doesn't show. */
export async function getPublishedEvents(limit = 24): Promise<PublicEvent[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.rpc("published_events", { p_limit: limit }, { get: true });
    if (error) {
      // Before the migration is run the function doesn't exist yet — not an error worth shouting about.
      if (!isMissingSchema(error)) console.error(`[recent-events] ${error.code}: ${error.message}`);
      return [];
    }
    return (data ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      eventType: e.event_type,
      eventDate: e.event_date,
      location: e.location,
      summary: e.summary,
      photos: (e.photos ?? []).map(eventPhotoUrl),
    }));
  } catch (error) {
    console.error("[recent-events]", error);
    return [];
  }
}
