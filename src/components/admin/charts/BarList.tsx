"use client";

import { useState } from "react";
import { VIZ } from "./viz";

/* Horizontal bars with the value at the tip. With `emphasis`, one row wears
   the accent colour and the rest recede — used to point at the single step
   that matters (e.g. where most visitors give up). */
export type BarRow = {
  key: string;
  label: string;
  value: number;
  display?: string; // label at the bar tip; defaults to the value
  detail?: React.ReactNode; // shown on hover / focus
  badge?: string; // short text flag beside the label, e.g. "Biggest drop"
  color?: string;
};

export default function BarList({
  rows,
  max,
  emphasis,
  emptyLabel = "No data yet",
}: {
  rows: BarRow[];
  max?: number;
  emphasis?: string | null;
  emptyLabel?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const top = max ?? Math.max(0, ...rows.map((r) => r.value));

  if (!rows.length || top === 0) return <p className="py-6 text-center text-sm text-ink-500">{emptyLabel}</p>;

  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row) => {
        const emphasised = emphasis === row.key;
        const color = row.color ?? (emphasis === undefined ? VIZ.accent : emphasised ? VIZ.accent : VIZ.context);
        const share = Math.max(0, Math.min(1, row.value / top));
        const open = active === row.key;
        return (
          <li
            key={row.key}
            tabIndex={row.detail ? 0 : undefined}
            onPointerEnter={() => setActive(row.key)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(row.key)}
            onBlur={() => setActive(null)}
            className="rounded-btn outline-none focus-visible:ring-2 focus-visible:ring-plum-700"
          >
            <div className="flex items-baseline justify-between gap-3 text-[0.8rem]">
              <span className={`min-w-0 truncate ${emphasised ? "font-semibold text-plum-900" : "text-ink-700"}`}>
                {row.label}
                {row.badge && <span className="ml-2 text-[0.7rem] font-semibold text-gold-700">{row.badge}</span>}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2.5 flex-1">
                <div
                  className="h-full rounded-r-[4px] transition-[width] duration-500"
                  style={{ width: `${share * 100}%`, minWidth: row.value > 0 ? 3 : 0, backgroundColor: color }}
                />
              </div>
              <span className="w-20 shrink-0 text-right text-[0.78rem] font-semibold text-ink-900 tabular-nums">
                {row.display ?? row.value}
              </span>
            </div>
            {open && row.detail && <div className="mt-1.5 text-[0.75rem] text-ink-500">{row.detail}</div>}
          </li>
        );
      })}
    </ul>
  );
}
