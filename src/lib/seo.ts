import type { Metadata } from "next";
import { BRAND_BLURB, CONTACT } from "./data";

/* The live address. Canonical links, the sitemap, robots.txt and the
   structured data all build on it. NEXT_PUBLIC_SITE_URL can point a staging
   copy elsewhere. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.jollyscreamery.com").replace(/\/+$/, "");
export const SITE_NAME = "Jolly's Creamery";

/* Only the production deployment may be indexed: Vercel preview builds (and
   any host that sets SITE_INDEXING=off) tell crawlers to stay away. */
export const INDEXABLE =
  process.env.SITE_INDEXING !== "off" && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "The Jolly's Creamery logo beside a Vanilla Cream cart at a candlelit garden wedding",
};

/* Title, description, canonical URL and link previews for one page. `title`
   goes through the root template ("Reviews · Jolly's Creamery") unless
   `absoluteTitle` is set. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}

/* Cuts a description to a search-snippet length at a word boundary. */
export function snippet(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

const BUSINESS_ID = `${SITE_URL}/#business`;

/* The business, the website and how they relate: one graph, on every public
   page (see SiteChrome). */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "IceCreamShop",
        "@id": BUSINESS_ID,
        name: SITE_NAME,
        alternateName: "Jolly's on Wheels",
        description: BRAND_BLURB,
        slogan: CONTACT.tagline,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icons/icon-512.png`,
        image: `${SITE_URL}${OG_IMAGE.url}`,
        telephone: CONTACT.phone.replace(/\s+/g, ""),
        email: CONTACT.email,
        foundingDate: "2017",
        address: {
          "@type": "PostalAddress",
          streetAddress: "17 Polhengoda Terrace",
          addressLocality: "Colombo",
          postalCode: "00500",
          addressRegion: "Western Province",
          addressCountry: "LK",
        },
        areaServed: { "@type": "Country", name: "Sri Lanka" },
        sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.tiktok, CONTACT.linkedin],
        hasMenu: `${SITE_URL}/flavors`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: "en-GB",
        publisher: { "@id": BUSINESS_ID },
        creator: { "@type": "Organization", name: "Arc AI", url: "https://www.arcai.agency" },
      },
    ],
  };
}

/* Breadcrumb trail for a page below the homepage. */
export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "/" : t.path}`,
    })),
  };
}

export const businessRef = { "@id": BUSINESS_ID };
