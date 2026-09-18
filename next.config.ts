import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* The admin pages are all dynamic, so by default Next re-fetches every
       segment on every navigation and caches nothing on the client. Holding
       them briefly makes moving back and forth between menu items instant.
       Every server action calls revalidatePath("/admin", "layout"), so an
       edit still clears this straight away. */
    staleTimes: { dynamic: 30, static: 300 },
  },
  async redirects() {
    return [
      // "Testimonials" was renamed "Honest Reviews" — keep old preview links alive.
      { source: "/testimonials", destination: "/reviews", permanent: true },
    ];
  },
};

export default nextConfig;
