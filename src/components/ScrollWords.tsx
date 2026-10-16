"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/* A line that lights up word by word as it scrolls up the screen. The page
   only writes one custom property (--p, 0 → 1) per frame; each word works out
   its own opacity from it in CSS. Starts fully lit, so it reads without
   JavaScript and stays lit for reduced motion. */
export default function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = false;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the line's top reaches 85% down the screen, 1 as its bottom passes 40%
      const p = (vh * 0.85 - r.top) / (vh * 0.45 + r.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        if (active) onScroll();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );

    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className} style={{ "--p": 1 } as CSSProperties}>
      {words.map((w, i) => (
        <span
          key={i}
          className="transition-opacity duration-300"
          style={{ opacity: `clamp(0.2, calc(var(--p) * ${words.length + 1} - ${i}), 1)` }}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
