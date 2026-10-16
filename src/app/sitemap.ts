import type { MetadataRoute } from "next";
import { SERVICES, serviceHref } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

/* /sitemap.xml: every public page. The admin, the API and /preview are left
   out on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...SERVICES.map((s) => page(serviceHref(s.slug), 0.8)),
    page("/reserve", 0.9),
    page("/flavors", 0.8),
    page("/reviews", 0.7, "weekly"),
    page("/about", 0.6),
    page("/contact", 0.6),
    page("/franchise", 0.5),
  ];
}
