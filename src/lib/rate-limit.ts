import "server-only";

/* Per-visitor limits for the public form endpoints: a fixed window per IP,
   counted in this server instance's memory. It stops one visitor (or one
   script) from flooding the forms and using up the database's site-wide caps,
   which would lock real guests out. On serverless hosting each instance counts
   on its own, so this is the first line; a host rule (Vercel Firewall rate
   limiting on /api/*) is the stronger second. */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
const MAX_TRACKED = 20_000;

/* The visitor's address as the host reports it. Vercel sets x-real-ip and
   overwrites x-forwarded-for, so neither can be faked from the browser there. */
function clientIp(request: Request) {
  const h = request.headers;
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/* True when this request goes over `limit` in the current window. */
export function overLimit(request: Request, bucket: string, limit: number, windowMs: number) {
  const now = Date.now();
  const key = `${bucket}:${clientIp(request)}`;
  const current = windows.get(key);
  if (current && current.resetAt > now) {
    current.count += 1;
    return current.count > limit;
  }
  if (windows.size >= MAX_TRACKED) {
    for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    if (windows.size >= MAX_TRACKED) windows.clear();
  }
  windows.set(key, { count: 1, resetAt: now + windowMs });
  return false;
}

export function tooManyRequests(retryAfterSeconds: number) {
  return Response.json(
    { error: "Too many requests. Please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
