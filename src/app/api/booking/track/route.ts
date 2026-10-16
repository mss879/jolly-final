import { createPublicClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { bookingContext, formError, isObject, readJson, unavailable, uuid } from "@/lib/public-forms";
import { overLimit, tooManyRequests } from "@/lib/rate-limit";

/* POST /api/booking/track — the reserve form, while it's being filled in.
   Saves field values as the visitor goes and records the interaction
   events behind the booking analytics. Also receives sendBeacon calls. */
export async function POST(request: Request) {
  // generous: the form sends a small batch every second or so while in use
  if (overLimit(request, "booking-track", 600, 10 * 60_000)) return tooManyRequests(60);
  const body = await readJson(request);
  const session = uuid(body?.session);
  if (!body || !session) return Response.json({ error: "Invalid request." }, { status: 400 });

  const supabase = createPublicClient();
  if (!supabase) return unavailable();

  const { error } = await supabase.rpc("track_booking", {
    p_session_id: session,
    p_events: (Array.isArray(body.events) ? body.events.slice(0, 100) : []) as Json,
    p_fields: (isObject(body.fields) ? body.fields : {}) as Json,
    p_context: bookingContext(body.context, request),
  });
  if (error) return formError(error);

  return new Response(null, { status: 204 });
}
