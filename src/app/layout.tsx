import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import { INDEXABLE, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

/* Defaults for every page. Each public page sets its own title, description,
   canonical URL and link preview through pageMetadata() (src/lib/seo.ts).
   Icons come from the files beside this layout (favicon.ico, icon.png,
   apple-icon.png) and the web manifest from manifest.ts. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jolly's Creamery · Ice Cream Carts for Weddings & Events in Sri Lanka",
    template: "%s · Jolly's Creamery",
  },
  description:
    "Styled ice cream carts with a live host for weddings, corporate events and parties across Sri Lanka. At Shangri-La and Hilton Colombo. You're about to feel good.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    title: "Jolly's Creamery · You're about to feel good",
    description:
      "Elegant décor, live scoops, joyful memories. Ice cream carts for weddings, corporate events and private parties across Sri Lanka.",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  robots: INDEXABLE
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#FFFBE9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={`${fraunces.variable} ${poppins.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
