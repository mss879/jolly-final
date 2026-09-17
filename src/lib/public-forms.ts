import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";

/* Shared plumbing for the public form endpoints under /api. The database
   functions do the real validation; this layer just shapes the request. */

type JsonObject = Record<string, unknown>;

export function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJson(request: Request): Promise<JsonObject | null> {
  try {
    const raw = await request.text();
    if (raw.length > 64_000) return null;
    const data: unknown = JSON.parse(raw);
    return isObject(data) ? data : null;
  } catch {
    return null;
  }
}

export function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function uuid(value: unknown) {
  return typeof value === "string" && UUID.test(value) ? value : null;
}

/* Validation (PT400) and rate-limit (PT429) messages are written for
   visitors in the migration; anything else stays generic. */
export function formError(error: PostgrestError) {
  if (error.code === "PT400" || error.code === "PT429") {
    return Response.json({ error: error.message }, { status: error.code === "PT400" ? 400 : 429 });
  }
  console.error(`[forms] ${error.code}: ${error.message}`);
  return Response.json({ error: "We couldn't save that just now." }, { status: 503 });
}

export const unavailable = () => Response.json({ error: "Saving is switched off." }, { status: 503 });

function parseUrl(value: string | null, base?: string) {
  if (!value) return null;
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
}

/* Where a booking visitor came from: a utm_source tag, another site's
   hostname, or the on-site page that sent them to /reserve (e.g. "/services"). */
function trafficSource(referrer: string | null, landing: string | null, host: string | null) {
  const utm = parseUrl(landing, "https://site.invalid")?.searchParams.get("utm_source")?.trim();
  if (utm) return utm.toLowerCase().slice(0, 120);

  const ref = parseUrl(referrer);
  if (!ref || !/^https?:$/.test(ref.protocol)) return null;
  if (host && ref.host === host) return ref.pathname.slice(0, 120);
  return ref.hostname.replace(/^(www|m|l|lm)\./, "").slice(0, 120);
}

export function bookingContext(value: unknown, request: Request) {
  const ctx = isObject(value) ? value : {};
  const device = ctx.device === "mobile" || ctx.device === "tablet" || ctx.device === "desktop" ? ctx.device : null;
  const landing = text(ctx.landing);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return {
    device,
    source: trafficSource(text(ctx.referrer), landing, host),
    landing_path: landing?.startsWith("/") ? landing.slice(0, 300) : null,
  };
}
