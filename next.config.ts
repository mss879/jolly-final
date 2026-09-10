import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // "Testimonials" was renamed "Honest Reviews" — keep old preview links alive.
      { source: "/testimonials", destination: "/reviews", permanent: true },
    ];
  },
};

export default nextConfig;
