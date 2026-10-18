"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* One observer for every Reveal on the page (the Reviews page alone has 150+),
   and each element is let go the moment it has played. */
let shared: IntersectionObserver | null = null;
function observer() {
  shared ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("reveal-in");
        shared?.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  return shared;
}

/* Fades content up once it scrolls into view. Inside it, a .reveal-pop child
   (the flavour scoops) settles in a beat later with a little scale and turn,
   and a .reveal-zoom frame lets its photo ease back from a slight zoom. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.classList.contains("reveal-in")) return;
    const io = observer();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal-init ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      // the early reveal script (root layout) may already have added reveal-in
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
