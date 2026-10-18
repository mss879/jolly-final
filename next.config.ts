import type { NextConfig } from "next";

/* Event photos are served from the Supabase project's public Storage bucket. */
const supabaseOrigin = (() => {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return { protocol: url.protocol === "http:" ? ("http" as const) : ("https" as const), hostname: url.hostname, port: url.port };
  } catch {
    return null;
  }
})();

/* Content Security Policy, for production builds (dev needs eval for fast
   refresh). Next's bootstrap scripts and the site's styles are inline, so
   both allow 'unsafe-inline'; everything else is locked to this site, plus
   the Supabase project for event photos. Nothing is loaded from any other
   origin, and other sites may not frame these pages. */
const supabaseSource = supabaseOrigin
  ? `${supabaseOrigin.protocol}://${supabaseOrigin.hostname}${supabaseOrigin.port ? `:${supabaseOrigin.port}` : ""}`
  : "";
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseSource}`,
  "font-src 'self' data:",
  "connect-src 'self'", // the browser never talks to Supabase directly
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
]
  .map((d) => d.trim())
  .join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    /* The admin pages are all dynamic, so by default Next re-fetches every
       segment on every navigation and caches nothing on the client. Holding
       them briefly makes moving back and forth between menu items instant.
       Every server action calls revalidatePath("/admin", "layout"), so an
       edit still clears this straight away. */
    staleTimes: { dynamic: 30, static: 300 },
    /* Event photos are uploaded one per action. The admin shrinks them to
       at most 2000px first, so this is headroom, not the usual size. */
    serverActions: { bodySizeLimit: "6mb" },
    /* The CSS (Tailwind, about 17 KB compressed) goes inside each page
       instead of a separate file, so a first visit renders without waiting
       on one more request. */
    inlineCss: true,
  },
  images: {
    // WebP only. AVIF was tried (Oct 2026): it is smaller, but the encoder
    // hung on some scoop images at some sizes, leaving them blank.
    remotePatterns: [
      ...(supabaseOrigin ? [{ ...supabaseOrigin, pathname: "/storage/v1/object/public/event-photos/**" }] : []),
    ],
  },
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
        ],
      },
      // Never indexed, whatever a crawler is told elsewhere; the admin's pages
      // also carry a noindex meta tag and need a signed-in admin.
      { source: "/admin", headers: noindex },
      { source: "/admin/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
      { source: "/preview/:path*", headers: noindex },
    ];
  },
  async redirects() {
    return [
      // "Testimonials" was renamed "Reviews" — keep old preview links alive.
      { source: "/testimonials", destination: "/reviews", permanent: true },
      // British spelling, as the site writes it
      { source: "/flavours", destination: "/flavors", permanent: true },

      // The WordPress site this replaces (its sitemap, Oct 2026), so indexed
      // links and bookmarks land somewhere useful.
      { source: "/shop/:path*", destination: "/flavors", permanent: true },
      { source: "/product/:path*", destination: "/flavors", permanent: true },
      { source: "/product-category/:path*", destination: "/flavors", permanent: true },
      { source: "/cart", destination: "/reserve", permanent: true },
      { source: "/checkout", destination: "/reserve", permanent: true },
      { source: "/my-account/:path*", destination: "/", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/header", destination: "/", permanent: true },
      { source: "/footer", destination: "/", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      // The old social-links page, likely behind printed QR codes: kept
      // temporary so it can be pointed elsewhere later.
      { source: "/smqr", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
