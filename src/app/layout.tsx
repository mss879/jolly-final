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
  weight: ["400", "500", "600"], // 300 was unused
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

const EARLY_REVEALS = `(function(){if(!("IntersectionObserver"in window))return;var d=document.documentElement;function lifted(){return d.hasAttribute("data-preloaded")||d.dataset.preloaderLifted!==undefined||!document.getElementById("preloader")}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;if(t.classList.contains("unveil")){if(t.hasAttribute("data-after-preloader")&&!lifted())return;t.classList.add("is-in")}else t.classList.add("reveal-in");io.unobserve(t)})},{threshold:0.12,rootMargin:"0px 0px -40px 0px"});document.querySelectorAll(".reveal-init,.unveil").forEach(function(el){io.observe(el)})})();`;

export const viewport: Viewport = {
  themeColor: "#FFFBE9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the script below may add data-preloaded first
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before the first paint: the brand preloader plays once per
            visit (see Preloader.tsx), not on every refresh. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("jolly-preloaded"))document.documentElement.setAttribute("data-preloaded","")}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        {/* Starts the scroll reveals (Reveal, Unveil) as soon as the page is
            parsed, without waiting for React to load: content near the top
            animates in straight away, which keeps Largest Contentful Paint
            fast. The components still handle anything rendered later. */}
        <script dangerouslySetInnerHTML={{ __html: EARLY_REVEALS }} />
      </body>
    </html>
  );
}
