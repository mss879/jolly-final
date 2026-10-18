"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Marks its wrapper `is-in` once it scrolls into view, which plays the story
   animations inside it: masked lines (.mask), image wipes (.wipe), fades
   (.fade) and drawn rules (.draw-x / .draw-y), all in globals.css. A child
   staggers itself with an inline `--delay`.
   With `afterPreloader`, a fresh page load waits for the brand preloader to
   lift, so the opening isn't played behind it. */
export default function Unveil({
  children,
  className = "",
  as: Tag = "div",
  afterPreloader = false,
  threshold = 0.18,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "figure" | "ol";
  afterPreloader?: boolean;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    let ready =
      !afterPreloader ||
      !document.getElementById("preloader") ||
      document.documentElement.hasAttribute("data-preloaded") ||
      document.documentElement.dataset.preloaderLifted !== undefined;

    const play = () => {
      if (seen && ready) el.classList.add("is-in");
    };
    const onLift = () => {
      ready = true;
      play();
    };
    if (!ready) window.addEventListener("preloader:lift", onLift, { once: true });

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        seen = true;
        io.disconnect();
        play();
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("preloader:lift", onLift);
    };
  }, [afterPreloader, threshold]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`unveil ${className}`}
      data-after-preloader={afterPreloader ? "" : undefined}
      // the early reveal script (root layout) may already have added is-in
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
