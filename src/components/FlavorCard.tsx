import Image from "next/image";
import type { Flavor } from "@/lib/data";
import Reveal from "./Reveal";

/* Three non-box treatments (client disliked the boxed card). The site uses
   DEFAULT_FLAVOR_VARIANT; all three are shown side by side on the internal
   /preview/flavour-cards route so the client can pick. */
export type FlavorCardVariant = "float" | "circle" | "editorial";
export const DEFAULT_FLAVOR_VARIANT: FlavorCardVariant = "float";

/* Grid wrapper classes that pair with each variant. */
export const FLAVOR_GRID: Record<FlavorCardVariant, string> = {
  float: "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
  circle: "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
  editorial: "grid gap-x-10 md:grid-cols-2",
};

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

export default function FlavorCard({
  flavor,
  index = 0,
  variant = DEFAULT_FLAVOR_VARIANT,
  priority = false,
}: {
  flavor: Flavor;
  index?: number;
  variant?: FlavorCardVariant;
  priority?: boolean; // the first row on the Flavours page, the biggest thing on a phone's first screen
}) {
  const scoop = (size: string, motion: string) => (
    <div className={`reveal-pop relative ${size} transition-transform duration-700 ${EASE} ${motion}`}>
      <Image
        src={flavor.image}
        alt={`${flavor.name} scoop`}
        fill
        preload={priority}
        sizes="(min-width: 640px) 176px, 160px"
        className="object-contain"
      />
    </div>
  );

  if (variant === "editorial") {
    return (
      <Reveal delay={(index % 2) * 110}>
        <article className="group grid grid-cols-[6.5rem_1fr] items-center gap-5 border-b border-gold-300/70 py-7 sm:grid-cols-[8rem_1fr] sm:gap-7">
          {scoop("h-24 w-24 sm:h-32 sm:w-32", "group-hover:scale-105 group-hover:-rotate-6")}
          <div>
            <span className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold-700 uppercase">
              {flavor.category}
            </span>
            <h3 className="mt-2 font-display text-xl leading-tight font-semibold text-plum-900 transition-colors duration-500 group-hover:text-gold-600">
              {flavor.name}
            </h3>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-500">{flavor.description}</p>
          </div>
        </article>
      </Reveal>
    );
  }

  if (variant === "circle") {
    return (
      <Reveal delay={(index % 3) * 110}>
        <article className="group flex h-full flex-col items-center px-4 text-center">
          <div
            className={`relative flex h-44 w-44 items-center justify-center rounded-full bg-cream-50 shadow-[0_20px_40px_-24px_rgba(50,0,75,0.28)] ring-1 ring-gold-300/80 transition-all duration-700 ${EASE} before:absolute before:inset-2 before:rounded-full before:border before:border-gold-300/50 group-hover:shadow-gold group-hover:ring-gold-500`}
          >
            {scoop("h-36 w-36 -translate-y-3", "group-hover:-translate-y-5 group-hover:-rotate-3")}
          </div>
          <span className="mt-6 text-[0.6rem] font-semibold tracking-[0.22em] text-gold-700 uppercase">
            {flavor.category}
          </span>
          <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-plum-900">{flavor.name}</h3>
          <p className="mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-ink-500">{flavor.description}</p>
        </article>
      </Reveal>
    );
  }

  // "float" — the default: no box and no glow, just the scoop on the cream
  // (the client asked for the purple glow behind the scoops to go)
  return (
    <Reveal delay={(index % 3) * 110}>
      <article className="group relative flex h-full flex-col items-center px-4 pt-4 text-center">
        {scoop("h-40 w-40 sm:h-44 sm:w-44", "group-hover:-translate-y-2 group-hover:-rotate-3")}
        <span className="mt-6 text-[0.6rem] font-semibold tracking-[0.22em] text-gold-700 uppercase">
          {flavor.category}
        </span>
        <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-plum-900">{flavor.name}</h3>
        <p className="mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-ink-500">{flavor.description}</p>
      </article>
    </Reveal>
  );
}
