"use client";

import { useState } from "react";
import FlavorCard, { DEFAULT_FLAVOR_VARIANT, FLAVOR_GRID, type FlavorCardVariant } from "./FlavorCard";
import { FLAVORS } from "@/lib/data";

/* "Sorbet" and "Dairy Free" returned the same items, so they're one filter. */
const FILTERS = ["All", "Classic", "Fruity", "Chocolate", "Dairy-Free Sorbets"] as const;

export default function FlavorsExplorer({ variant = DEFAULT_FLAVOR_VARIANT }: { variant?: FlavorCardVariant }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const list = FLAVORS.filter((f) => {
    if (filter === "All") return true;
    if (filter === "Dairy-Free Sorbets") return f.dairyFree || f.category === "Sorbet";
    return f.category === filter;
  });

  return (
    <section className="container-luxe pt-10 pb-16">
      <div className="flex flex-wrap items-center gap-2.5" role="tablist" aria-label="Filter flavours">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`rounded-btn border px-5 py-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-all duration-300 ${
                active
                  ? "border-plum-900 bg-plum-900 text-cream-100 shadow-soft"
                  : "border-gold-300 bg-cream-50 text-ink-700 hover:border-gold-500 hover:text-plum-900"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className={`mt-12 ${FLAVOR_GRID[variant]}`}>
        {list.map((f, i) => (
          <FlavorCard key={`${filter}-${f.slug}`} flavor={f} index={i} variant={variant} />
        ))}
      </div>
      <p className="mt-8 text-[0.72rem] tracking-[0.18em] text-ink-500 uppercase">
        Seasonal menu — flavours change with what&apos;s fresh
      </p>
    </section>
  );
}
