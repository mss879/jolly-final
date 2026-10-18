import "server-only";

/* Per-visitor limits for the public form endpoints and the admin sign-in: a
   fixed window per address, counted in this server instance's memory. It
   stops one visitor (or one script) from flooding the forms and using up the
   database's site-wide caps, which would lock real guests out. On serverless
   hosting each instance counts on its own, so this is the first line; a host
   rule (Vercel Firewall rate limiting on /api/*) is the stronger second. */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
const MAX_TRACKED = 20_000;

/* The visitor's address as the host reports it. Vercel sets x-real-ip and
   overwrites x-forwarded-for, so neither can be faked from the browser there.
   IPv6 is counted per /64, the block one household or phone is given, so
   rotating through it doesn't reset the count. */
function clientKey(headers: Headers) {
  const ip = headers.get("x-real-ip")?.trim() || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return ip.includes(":") ? ip.split(":").slice(0, 4).join(":") : ip;
}

/* True when this request goes over `limit` in the current window. */
export function overLimit(source: Request | Headers, bucket: string, limit: number, windowMs: number) {
  const now = Date.now();
  const key = `${bucket}:${clientKey(source instanceof Headers ? source : source.headers)}`;
  const current = windows.get(key);
  if (current && current.resetAt > now) {
    current.count += 1;
    return current.count > limit;
  }
  windows.delete(key);
  if (windows.size >= MAX_TRACKED) {
    for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    // still full: let go of the oldest entries rather than everyone's counts
    for (const k of windows.keys()) {
      if (windows.size < MAX_TRACKED * 0.9) break;
      windows.delete(k);
    }
  }
  windows.set(key, { count: 1, resetAt: now + windowMs });
  return false;
}

/* Only this site's own pages may post to the form endpoints. Browsers label
   every request with where it came from (Sec-Fetch-Site, Origin), so a form
   or script on another website, firing from its visitors' browsers, is
   turned away. Scripts outside a browser don't send these headers; the
   per-visitor limit above covers them. */
export function fromThisSite(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = request.headers.get("origin");
  if (origin && origin !== "null") {
    try {
      return new URL(origin).host === request.headers.get("host");
    } catch {
      return false;
    }
  }
  return true;
}

export function tooManyRequests(retryAfterSeconds: number) {
  return Response.json(
    { error: "Too many requests. Please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

export const notFromThisSite = () => Response.json({ error: "Invalid request." }, { status: 403 });
