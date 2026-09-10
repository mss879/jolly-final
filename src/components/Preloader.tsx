"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SMILEY } from "@/lib/data";

/* Animated brand preloader — "You're about to feel good".
   Plays on every page load/refresh, lifts away like a curtain. */
export default function Preloader() {
  const [phase, setPhase] = useState<"boot" | "play" | "lift" | "done">("boot");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    document.documentElement.style.overflow = "hidden";
    const liftAt = reduced ? 900 : 2500;
    const doneAt = liftAt + (reduced ? 300 : 950);
    timers.push(setTimeout(() => setPhase("play"), 30));
    timers.push(setTimeout(() => setPhase("lift"), liftAt));
    timers.push(
      setTimeout(() => {
        setPhase("done");
        document.documentElement.style.overflow = "";
      }, doneAt),
    );
    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const playing = phase === "play" || phase === "lift";
  const words = ["You’re", "about", "to"];

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream-100 transition-transform duration-[950ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: phase === "lift" ? "translateY(-100%)" : "translateY(0)" }}
    >
      {/* soft gold glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_50%_42%,rgba(210,172,85,0.16),transparent_70%)]" />

      <div
        className="relative mb-8 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          opacity: playing ? 1 : 0,
          transform: playing ? "scale(1)" : "scale(0.85)",
        }}
      >
        <Image
          src="/images/brand/logo-purple.png"
          alt=""
          width={92}
          height={92}
          preload
          className="h-[72px] w-auto object-contain sm:h-[92px]"
        />
      </div>

      <p className="flex gap-[0.35em] overflow-hidden font-display text-[1.4rem] leading-none text-plum-900/85 sm:text-3xl md:text-[2.4rem]">
        {words.map((w, i) => (
          <span
            key={w}
            className="inline-block transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              transitionDelay: `${200 + i * 130}ms`,
              opacity: playing ? 1 : 0,
              transform: playing ? "translateY(0)" : "translateY(120%)",
            }}
          >
            {w}
          </span>
        ))}
      </p>

      <div className="mt-2 overflow-hidden px-[0.4em] pb-[0.2em] sm:mt-3">
        <h1
          className="font-display text-[16vw] leading-[1.05] font-medium text-plum-900 italic transition-all duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] sm:text-7xl md:text-8xl"
          style={{
            transitionDelay: "620ms",
            opacity: playing ? 1 : 0,
            transform: playing ? "translateY(0)" : "translateY(105%)",
          }}
        >
          feel good
          <span
            aria-hidden
            className={`ml-[0.15em] inline-block align-baseline text-[0.55em] not-italic ${
              playing ? "animate-pop [animation-delay:1250ms]" : "opacity-0"
            }`}
          >
            {SMILEY}
          </span>
        </h1>
      </div>

      <div
        className="mt-8 h-px bg-gold-400 transition-all duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          transitionDelay: "1050ms",
          width: playing ? "9rem" : "0rem",
          opacity: playing ? 1 : 0,
        }}
      />
    </div>
  );
}
