"use client";

import { useEffect, useRef, useState } from "react";

/* Tracks an element's width so SVG charts render crisp at any size. */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/* A round axis maximum with whole-number steps. */
export function niceScale(max: number, ticks = 4) {
  const rough = Math.max(max, 1) / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const residual = rough / magnitude;
  const step = Math.max(1, (residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10) * magnitude);
  return { max: step * ticks, step };
}

export function Legend({ items }: { items: { label: string; color: string; value?: string; shape?: "line" | "square" }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.75rem] text-ink-700">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          {item.shape === "line" ? (
            <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: item.color }} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: item.color }} />
          )}
          {item.label}
          {item.value && <span className="font-semibold text-ink-900">{item.value}</span>}
        </li>
      ))}
    </ul>
  );
}

export function Tooltip({
  x,
  y,
  width,
  children,
}: {
  x: number;
  y: number;
  width: number;
  children: React.ReactNode;
}) {
  const flip = x > width - 180;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-36 border border-gold-200 bg-cream-50 px-3 py-2 text-[0.75rem] shadow-card"
      style={{ left: flip ? undefined : x + 12, right: flip ? width - x + 12 : undefined, top: Math.max(0, y) }}
    >
      {children}
    </div>
  );
}

export function TooltipRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="flex-1 text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900 tabular-nums">{value}</span>
    </div>
  );
}

/* Every chart has a plain table twin. */
export function TableToggle({ children, label = "Show as table" }: { children: React.ReactNode; label?: string }) {
  return (
    <details className="group mt-3">
      <summary className="cursor-pointer text-[0.75rem] font-semibold text-ink-500 hover:text-plum-900">{label}</summary>
      <div className="mt-2 max-h-72 overflow-auto">{children}</div>
    </details>
  );
}
