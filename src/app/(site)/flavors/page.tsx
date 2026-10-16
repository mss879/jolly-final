import type { Metadata } from "next";
import FlavorsExplorer from "@/components/FlavorsExplorer";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { FLAVORS } from "@/lib/data";
import { SITE_URL, breadcrumbs, businessRef, pageMetadata } from "@/lib/seo";

/* The flavour list as a menu, for search engines. */
const MENU = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: "Jolly's Creamery flavours",
  url: `${SITE_URL}/flavors`,
  provider: businessRef,
  hasMenuItem: FLAVORS.map((f) => ({
    "@type": "MenuItem",
    name: f.name,
    description: f.description,
    image: `${SITE_URL}${f.image}`,
  })),
};

export const metadata: Metadata = pageMetadata({
  title: "Our Flavours",
  description:
    "Fresh, seasonal flavours from Jolly's Creamery: island fruits, silky classics, rich chocolates and dairy-free sorbets, somewhere between gelato and ice cream.",
  path: "/flavors",
});

export default function FlavorsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbs([{ name: "Our Flavours", path: "/flavors" }]), MENU]} />
      <section className="relative overflow-hidden pt-44 pb-6 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 left-[-12rem] h-[26rem] w-[26rem] bg-gold-200/40 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            as="h1"
            kicker="Our Flavours"
            title={
              <>
                Fresh, seasonal,
                <span className="italic text-gold-600"> made to feel good</span>
              </>
            }
            copy="Real fruit, fresh cream and a texture somewhere between gelato and ice cream, plus dairy-free creamy sorbets, so every guest gets a scoop."
          />
        </div>
      </section>

      <FlavorsExplorer />

      <section className="container-luxe pb-4">
        <Reveal>
          <div className="rounded-card border border-gold-200/70 bg-cream-200/60 px-8 py-10 text-center">
            <p className="font-display text-xl text-plum-900 italic sm:text-2xl">
              Building your event menu?
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-700">
              Most events carry a handful of flavours. We&apos;ll help you balance
              island fruit, chocolate and classics, with dairy-free sorbets so
              every guest gets a scoop.
            </p>
            <Link
              href="/reserve"
              className="group mt-6 inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.18em] text-plum-900 uppercase"
            >
              Plan my menu
              <span className="inline-block h-px w-6 bg-gold-500 transition-all duration-300 group-hover:w-10" />
            </Link>
          </div>
        </Reveal>
      </section>

    </>
  );
}
