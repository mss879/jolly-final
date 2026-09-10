"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONTACT, HERO_SLIDES, SMILEY } from "@/lib/data";

/* Slides live in src/lib/data.ts (HERO_SLIDES) — array order is display
   order, so a launch/offer slide can be promoted by moving it to index 0. */
const SLIDES = HERO_SLIDES;
const DURATION = 7500;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), DURATION);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, active]);

  return (
    <section
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
        {/* full-bleed banners */}
        {SLIDES.map((s, i) => {
          const on = i === active;
          return (
            <div
              key={s.key}
              aria-hidden={!on}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{ opacity: on ? 1 : 0 }}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                preload={i === 0}
                sizes="100vw"
                className={`object-cover ${s.objectPos} ${on ? "animate-kenburns" : ""}`}
              />
              {/* cream veil for typography */}
              <div className="absolute inset-0 bg-gradient-to-r from-cream-100 from-[18%] via-cream-100/72 via-[46%] to-transparent to-[78%]" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cream-100 via-cream-100/60 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream-100/85 to-transparent" />
              <div className="absolute inset-0 bg-cream-100/45 sm:bg-transparent" />
            </div>
          );
        })}

        {/* copy */}
        <div className="container-luxe relative flex h-full flex-col justify-center">
          <div className="relative max-w-4xl pt-16">
            {SLIDES.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.key}
                  aria-hidden={!on}
                  className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${on ? "relative" : "absolute inset-0"}`}
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "translateY(0)" : "translateY(30px)",
                    pointerEvents: on ? "auto" : "none",
                    transitionDelay: on ? "250ms" : "0ms",
                  }}
                >
                  {s.badge && (
                    <span className="mb-4 inline-block rounded-btn border border-gold-400/80 bg-cream-50/80 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.2em] text-plum-900 uppercase">
                      {s.badge}
                    </span>
                  )}
                  <p className="kicker flex items-center gap-4">
                    <span className="h-px w-10 bg-gold-500" />
                    {s.kicker}
                  </p>
                  <h1 className="heading-display mt-6 text-[2.15rem] leading-[1.06] text-balance sm:text-[3.25rem] lg:text-6xl xl:text-[3.85rem]">
                    <span className="block">{s.line1}</span>
                    <span className="mt-2 block italic text-gold-600">{s.line2}</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-ink-700 sm:text-base">
                    {s.copy}
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-5">
                    <Link
                      href={s.cta.href}
                      tabIndex={on ? 0 : -1}
                      className="rounded-btn bg-plum-900 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
                    >
                      {s.cta.label}
                    </Link>
                    <Link
                      href={s.cta2.href}
                      tabIndex={on ? 0 : -1}
                      className="rounded-btn border border-gold-500 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
                    >
                      {s.cta2.label}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* slide index + controls — bottom right */}
        <div className="absolute right-5 bottom-8 z-10 flex items-center gap-6 sm:right-10">
          <p className="font-display text-sm tracking-[0.2em] text-plum-900">
            <span className="text-2xl font-semibold">{String(active + 1).padStart(2, "0")}</span>
            <span className="mx-2 text-gold-500">/</span>
            {String(SLIDES.length).padStart(2, "0")}
          </p>
          <div className="flex flex-col gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => go(i)}
                className="group relative h-[3px] w-14 overflow-hidden bg-gold-200"
              >
                {i === active && (
                  <span
                    key={`bar-${active}-${paused ? "p" : "r"}`}
                    className="absolute inset-y-0 left-0 bg-plum-900"
                    style={{
                      animation: paused ? "none" : `hero-progress ${DURATION}ms linear forwards`,
                      width: paused ? "100%" : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className="p-1 text-plum-900 transition-all duration-300 hover:-translate-x-0.5 hover:text-gold-600"
            >
              <svg viewBox="0 0 32 24" className="h-5 w-8" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M10 5l-7 7 7 7M3 12h28" /></svg>
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className="p-1 text-plum-900 transition-all duration-300 hover:translate-x-0.5 hover:text-gold-600"
            >
              <svg viewBox="0 0 32 24" className="h-5 w-8" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M22 5l7 7-7 7M29 12H1" /></svg>
            </button>
          </div>
        </div>

        {/* tagline watermark */}
        <p className="pointer-events-none absolute bottom-8 left-5 z-10 hidden font-display text-sm tracking-[0.08em] text-plum-900/60 italic lg:block sm:left-10">
          {CONTACT.tagline} <span aria-hidden className="not-italic">{SMILEY}</span>
        </p>
      </div>
    </section>
  );
}
