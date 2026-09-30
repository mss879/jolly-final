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

const nextConfig: NextConfig = {
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
  },
  images: {
    remotePatterns: [
      // Reviewers' profile pictures, from the live Google reviews
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      ...(supabaseOrigin ? [{ ...supabaseOrigin, pathname: "/storage/v1/object/public/event-photos/**" }] : []),
    ],
  },
  async redirects() {
    return [
      // "Testimonials" was renamed "Reviews" — keep old preview links alive.
      { source: "/testimonials", destination: "/reviews", permanent: true },
    ];
  },
};

export default nextConfig;
