"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ResponsiveImage from "@/components/ResponsiveImage";
import Link from "next/link";
import { HERO_SLIDES, type HeroSlide, type PartnerLogo } from "@/lib/data";

/* Slides live in src/lib/data.ts (HERO_SLIDES) — array order is display
   order, so a launch/offer slide can be promoted by moving it to index 0. */
const SLIDES = HERO_SLIDES;
const DURATION = 7500;
/* One <h1> for the page: the first headline slide's. The others are styled
   the same but are not headings. */
const H1_SLIDE = SLIDES.findIndex((s) => !s.imageOnly && !("logos" in s));

/* Existing venue art switches at 1024px; new phone variants at 768px. */
function SlideImage({ s, preload, className }: { s: HeroSlide; preload: boolean; className: string }) {
  return (
    <ResponsiveImage
      src={s.image}
      mobileSrc={s.mobileImage}
      mobileBreakpoint={s.mobileBreakpoint ?? 1024}
      desktopOnly={s.desktopOnly}
      alt={s.alt}
      preload={preload}
      className={className}
    />
  );
}

/* "Find Us At": the heading and venue logos in white tiles. Phones and
   tablets get a coded wall (client, Oct 2026: no photo behind the logos
   there) — cream, a soft gold light and the brand mark as a watermark, with
   the tiles in rows of three. Desktop keeps the photo and stacks the heading
   and tiles on the right, beside the cart. */
function LogoWall({ heading, tagline, logos }: { heading: string; tagline?: string; logos: PartnerLogo[] }) {
  return (
    <div className="container-wide relative flex h-full flex-col justify-center pt-20 pb-14 lg:max-w-none lg:items-end lg:gap-8 lg:pt-20 lg:pb-0 lg:pr-[6vw]">
      <div className="text-center lg:w-[28rem] xl:w-[34rem] 2xl:w-[38rem]">
        <p className="kicker mb-4 flex items-center justify-center gap-3 lg:hidden">
          <span aria-hidden className="h-px w-8 bg-gold-400" />
          Our venue partners
          <span aria-hidden className="h-px w-8 bg-gold-400" />
        </p>
        <h2 className="heading-display text-[2.4rem] sm:text-5xl xl:text-6xl">{heading}</h2>
        <span aria-hidden className="mx-auto mt-3 block h-px w-44 bg-gold-400/80 sm:w-64 lg:mt-5 lg:w-full" />
        {tagline && (
          <p className="mx-auto mt-4 max-w-[19rem] text-[0.9rem] leading-relaxed text-ink-700 sm:max-w-sm sm:text-base lg:hidden">
            {tagline}
          </p>
        )}
      </div>
      <ul className="mx-auto mt-9 grid w-full max-w-sm grid-cols-6 gap-3 sm:mt-12 sm:max-w-md sm:gap-4 lg:mx-0 lg:mt-0 lg:w-[28rem] lg:max-w-none lg:grid-cols-4 lg:gap-3 xl:w-[34rem] xl:gap-4 2xl:w-[38rem]">
        {logos.map((l, i) => (
          <li
            key={l.name}
            // rows of three below lg: the last pair sits centred (grid of six, each tile two wide)
            className={`col-span-2 flex items-center justify-center rounded-card bg-white p-2.5 shadow-card ring-1 ring-gold-200/60 sm:p-3 lg:col-span-1 lg:rounded-card lg:p-2 lg:ring-gold-200/50 ${
              i === 6 ? "col-start-2 lg:col-start-auto" : ""
            }`}
          >
            <Image
              src={l.src}
              alt={l.name}
              width={324}
              height={272}
              sizes="(min-width: 1536px) 140px, (min-width: 1280px) 124px, (min-width: 1024px) 104px, (min-width: 640px) 136px, 30vw"
              className="h-auto w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Slides after the first load their photos once the page has finished
  // loading, so they don't compete with the first slide for bandwidth.
  const [restReady, setRestReady] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((i: number) => {
    setRestReady(true);
    setActive((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    let idle = 0;
    const ready = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      idle = w.requestIdleCallback ? w.requestIdleCallback(() => setRestReady(true), { timeout: 2500 }) : window.setTimeout(() => setRestReady(true), 600);
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => {
      window.removeEventListener("load", ready);
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
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
      // a sideways swipe changes slide on touch screens
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
      }}
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
              {(i === 0 || restReady) && (
                <SlideImage
                  s={s}
                  preload={i === 0}
                  className={`object-cover ${s.objectPos} ${on && !s.imageOnly ? "animate-kenburns" : ""}`}
                />
              )}
              {s.desktopOnly && (
                // the coded backdrop below lg: brand cream, a warm gold light
                // top right, a faint plum glow bottom left, the mark as a watermark
                <div aria-hidden className="absolute inset-0 bg-cream-100 lg:hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(70%_45%_at_88%_6%,rgba(224,198,127,0.42),transparent_70%),radial-gradient(60%_40%_at_8%_96%,rgba(229,214,239,0.7),transparent_70%)]" />
                  <Image
                    src="/images/brand/logo.png"
                    alt=""
                    width={921}
                    height={1305}
                    sizes="320px"
                    className="absolute right-3 -bottom-8 h-auto w-52 opacity-[0.04] sm:w-64"
                  />
                </div>
              )}
              {s.imageOnly ? (
                // cream veil across the top only, so the logo and navbar read
                // as clearly as on the other slides
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cream-100 from-30% via-cream-100/70 via-60% to-transparent" />
              ) : "logos" in s ? (
                <>
                  {/* desktop only (the coded wall below lg is cream already):
                      a top veil for the navbar and a cream wash behind the
                      heading on the right */}
                  <div className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-cream-100 from-30% via-cream-100/70 via-60% to-transparent lg:block" />
                  <div className="absolute inset-y-0 right-0 hidden w-3/5 bg-gradient-to-l from-cream-100/90 from-25% via-cream-100/55 via-60% to-transparent lg:block" />
                  <LogoWall heading={s.heading} tagline={s.tagline} logos={s.logos} />
                </>
              ) : (
                <>
                  {/* cream veil for typography. Desktop: a left-to-right wash,
                      the copy sits beside the cart. Below md the portrait photo
                      shows and the copy sits over it, so the wash runs top to
                      bottom instead: clear over the host and the bride in the
                      upper third, solid behind the headline and buttons. */}
                  <div className="absolute inset-0 hidden bg-gradient-to-r from-cream-100 from-[18%] via-cream-100/72 via-[46%] to-transparent to-[78%] md:block" />
                  <div className="absolute inset-0 bg-gradient-to-b from-cream-100/10 from-[26%] via-cream-100/85 via-[40%] to-cream-100 md:hidden" />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cream-100 via-cream-100/60 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream-100/85 to-transparent" />
                </>
              )}
            </div>
          );
        })}

        {/* copy */}
        <div className="container-wide relative flex h-full flex-col justify-center">
          <div className="relative max-w-4xl pt-16">
            {SLIDES.map((s, i) => {
              if (s.imageOnly || "logos" in s) return null;
              const on = i === active;
              const Headline = i === H1_SLIDE ? "h1" : "p";
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
                  <Headline className="heading-display text-[2.15rem] leading-[1.06] text-balance sm:text-[3.25rem] lg:text-6xl xl:text-[3.85rem]">
                    <span className="block">{s.line1}</span>
                    <span className="mt-2 block italic text-gold-600">{s.line2}</span>
                  </Headline>
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

        {/* Phones use one compact row; desktop keeps its stacked bars and arrows. */}
        <div role="group" aria-label="Slide navigation" className="absolute right-4 bottom-4 z-10 flex items-center gap-2 md:right-10 md:bottom-8 md:gap-6">
          <p className="font-display text-[0.65rem] tracking-[0.12em] text-plum-900 tabular-nums md:text-sm md:tracking-[0.2em]">
            <span className="text-lg font-semibold md:text-2xl">{String(active + 1).padStart(2, "0")}</span>
            <span className="mx-1 text-gold-500 md:mx-2">/</span>
            {String(SLIDES.length).padStart(2, "0")}
          </p>
          <div className="flex items-center md:flex-col">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => go(i)}
                // Small visual marks retain taller touch targets on phones.
                className="group flex h-11 w-7 items-center justify-center md:block md:h-auto md:w-auto md:py-[10.5px]"
              >
                <span className="relative block h-[2px] w-4 overflow-hidden rounded-full bg-gold-200 md:h-[3px] md:w-14">
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
                </span>
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-4 md:flex">
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
      </div>
    </section>
  );
}
