import type { Metadata } from "next";
import FlavorCard, { FLAVOR_GRID, type FlavorCardVariant } from "@/components/FlavorCard";
import { FLAVORS } from "@/lib/data";

/* Internal preview for the client call — not linked from the site, not indexed. */
export const metadata: Metadata = {
  title: "Flavour card options",
  robots: { index: false, follow: false },
};

const SAMPLE = ["passion-fruit-sorbet", "double-chocolate", "salted-caramel-peanuts"];

const OPTIONS: { v: FlavorCardVariant; label: string; name: string; why: string; recommended?: boolean }[] = [
  {
    v: "float",
    label: "Option A",
    name: "Floating scoop",
    why: "No box at all — the scoop floats on the cream with a soft shadow beneath it. Closest to the round, floating look of the previous site.",
    recommended: true,
  },
  {
    v: "circle",
    label: "Option B",
    name: "Gold-ringed disc",
    why: "A soft circular cream disc with a hairline gold ring; the scoop peeks above it. Rounded, but still premium.",
  },
  {
    v: "editorial",
    label: "Option C",
    name: "Editorial menu row",
    why: "A menu-style row — scoop on the left, name and notes on the right, gold hairlines between. Reads like a tasting menu.",
  },
];

export default function FlavourCardPreview() {
  const sample = SAMPLE.flatMap((slug) => FLAVORS.filter((f) => f.slug === slug));

  return (
    <>
      <section className="container-luxe pt-44 pb-10 sm:pt-52">
        <p className="kicker">Internal preview — not linked from the site</p>
        <h1 className="heading-display mt-5 text-4xl sm:text-5xl">Flavour card options</h1>
        <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-ink-700">
          Three non-box treatments for the flavour cards, shown with the same three flavours.
          Pick one and it is applied to the homepage preview and the Flavours page.
        </p>
      </section>

      {OPTIONS.map((o, i) => (
        <section key={o.v} className={`py-16 ${i % 2 ? "bg-cream-50" : "bg-cream-100"}`}>
          <div className="container-luxe">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold-300/70 pb-6">
              <div>
                <p className="kicker flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  {o.label}
                </p>
                <h2 className="heading-display mt-3 text-3xl">{o.name}</h2>
                <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-ink-700">{o.why}</p>
              </div>
              {o.recommended && (
                <span className="rounded-btn border border-gold-400 bg-cream-50 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-gold-700 uppercase">
                  Recommended
                </span>
              )}
            </div>
            <div className={`mt-12 ${FLAVOR_GRID[o.v]}`}>
              {sample.map((f, j) => (
                <FlavorCard key={f.slug} flavor={f} index={j} variant={o.v} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
