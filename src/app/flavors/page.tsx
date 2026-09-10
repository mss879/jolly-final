import type { Metadata } from "next";
import FlavorsExplorer from "@/components/FlavorsExplorer";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Flavours",
  description:
    "Fresh, seasonal flavours — island fruits, silky classics, rich chocolates and dairy-free creamy sorbets from Jolly's Creamery, with a texture somewhere between gelato and ice cream.",
};

export default function FlavorsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-6 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 left-[-12rem] h-[26rem] w-[26rem] bg-gold-200/40 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker="Our Flavours"
            title={
              <>
                Fresh, seasonal,
                <span className="italic text-gold-600"> made to feel good</span>
              </>
            }
            copy="Real fruit, fresh cream and a texture somewhere between gelato and ice cream — plus dairy-free creamy sorbets, so every guest gets a scoop."
          />
        </div>
      </section>

      <FlavorsExplorer />

      <section className="container-luxe pb-4">
        <Reveal>
          <div className="border border-gold-200/70 bg-cream-200/60 px-8 py-10 text-center">
            <p className="font-display text-xl text-plum-900 italic sm:text-2xl">
              Building your event menu?
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-700">
              Most events carry a handful of flavours. We&apos;ll help you balance
              island fruit, chocolate and classics — with dairy-free sorbets so
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
