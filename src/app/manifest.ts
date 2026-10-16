import type { MetadataRoute } from "next";
import { BRAND_BLURB } from "@/lib/data";

/* /manifest.webmanifest: name, colours and icons for "Add to Home Screen". */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jolly's Creamery",
    short_name: "Jolly's",
    description: BRAND_BLURB,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFBE9",
    theme_color: "#FFFBE9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
