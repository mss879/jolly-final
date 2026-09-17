import { createPublicClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import { bookingContext, formError, isObject, readJson, text, unavailable, uuid } from "@/lib/public-forms";

/* POST /api/booking/submit — the reserve form's final send. The booking
   becomes "awaiting confirmation" in /admin/bookings. */
export async function POST(request: Request) {
  const body = await readJson(request);
  const session = uuid(body?.session);
  if (!body || !session || !isObject(body.fields)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // A field people never see: if it's filled in, a bot sent this.
  if (text(body.website)) return Response.json({ ok: true });

  const supabase = createPublicClient();
  if (!supabase) return unavailable();

  const { error } = await supabase.rpc("submit_booking", {
    p_session_id: session,
    p_fields: body.fields as Json,
    p_context: bookingContext(body.context, request),
  });
  if (error) return formError(error);

  return Response.json({ ok: true });
}
