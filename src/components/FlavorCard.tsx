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

function DairyFreePill({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-btn border border-plum-200 bg-plum-100 px-3 py-1 text-[0.58rem] font-bold tracking-[0.14em] text-plum-900 uppercase ${className}`}
    >
      Dairy Free
    </span>
  );
}

export default function FlavorCard({
  flavor,
  index = 0,
  variant = DEFAULT_FLAVOR_VARIANT,
}: {
  flavor: Flavor;
  index?: number;
  variant?: FlavorCardVariant;
}) {
  const scoop = (size: string, motion: string) => (
    <div className={`relative ${size} transition-transform duration-700 ${EASE} ${motion}`}>
      <Image
        src={flavor.image}
        alt={`${flavor.name} scoop`}
        fill
        sizes="200px"
        className="object-contain drop-shadow-[0_26px_26px_rgba(50,0,75,0.22)]"
      />
    </div>
  );

  if (variant === "editorial") {
    return (
      <Reveal delay={(index % 2) * 90}>
        <article className="group grid grid-cols-[6.5rem_1fr] items-center gap-5 border-b border-gold-300/70 py-7 sm:grid-cols-[8rem_1fr] sm:gap-7">
          {scoop("h-24 w-24 sm:h-32 sm:w-32", "group-hover:scale-105 group-hover:-rotate-6")}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[0.6rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">
                {flavor.category}
              </span>
              {flavor.dairyFree && <DairyFreePill />}
            </div>
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
      <Reveal delay={(index % 3) * 90}>
        <article className="group flex h-full flex-col items-center px-4 text-center">
          <div
            className={`relative flex h-44 w-44 items-center justify-center rounded-full bg-cream-50 shadow-[0_20px_40px_-24px_rgba(50,0,75,0.28)] ring-1 ring-gold-300/80 transition-all duration-700 ${EASE} before:absolute before:inset-2 before:rounded-full before:border before:border-gold-300/50 group-hover:shadow-gold group-hover:ring-gold-500`}
          >
            {scoop("h-36 w-36 -translate-y-3", "group-hover:-translate-y-5 group-hover:-rotate-3")}
          </div>
          <span className="mt-6 text-[0.6rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">
            {flavor.category}
          </span>
          <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-plum-900">{flavor.name}</h3>
          <p className="mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-ink-500">{flavor.description}</p>
          {flavor.dairyFree && <DairyFreePill className="mt-3" />}
        </article>
      </Reveal>
    );
  }

  // "float" — the default: no box, the scoop floats on the cream with a soft shadow beneath
  return (
    <Reveal delay={(index % 3) * 90}>
      <article className="group relative flex h-full flex-col items-center px-4 pt-4 text-center">
        <div className="relative">
          {scoop("h-40 w-40 sm:h-44 sm:w-44", "group-hover:-translate-y-2 group-hover:-rotate-3")}
          <span
            aria-hidden
            className={`absolute inset-x-10 -bottom-1 h-5 rounded-[100%] bg-plum-900/15 blur-md transition-all duration-700 ${EASE} group-hover:inset-x-12 group-hover:bg-plum-900/10`}
          />
        </div>
        <span className="mt-6 text-[0.6rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">
          {flavor.category}
        </span>
        <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-plum-900">{flavor.name}</h3>
        <p className="mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-ink-500">{flavor.description}</p>
        {flavor.dairyFree && <DairyFreePill className="mt-3" />}
      </article>
    </Reveal>
  );
}
