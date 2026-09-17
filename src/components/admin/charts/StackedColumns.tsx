"use client";

import { useState } from "react";
import { formatDay } from "@/lib/admin/format";
import { Legend, TableToggle, Tooltip, TooltipRow, niceScale, useWidth } from "./shared";
import { VIZ, tableCls } from "./viz";

/* Stacked daily columns: thin bars, 2px surface gap between segments,
   rounded data-end on the top segment only. */
export type ColumnSeries = { key: string; label: string; color: string };

const PLOT_H = 170;
const AXIS_H = 26;
const LEFT = 30;
const RIGHT = 8;
const TOP = 8;
const GAP = 2;

export default function StackedColumns<T extends { day: string }>({
  data,
  series,
  label,
}: {
  data: (T & Record<string, number | string>)[];
  series: ColumnSeries[];
  label: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const totals = data.map((d) => series.reduce((sum, s) => sum + (Number(d[s.key]) || 0), 0));
  const { max, step } = niceScale(Math.max(0, ...totals));
  const innerW = Math.max(0, width - LEFT - RIGHT);
  const slot = data.length ? innerW / data.length : 0;
  const barW = Math.max(3, Math.min(24, slot * 0.62));
  const y = (v: number) => TOP + PLOT_H - (v / max) * PLOT_H;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 64))));

  return (
    <figure>
      <Legend
        items={series.map((s) => ({
          label: s.label,
          color: s.color,
          value: String(data.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0)),
        }))}
      />
      <div ref={ref} className="relative mt-3" style={{ height: TOP + PLOT_H + AXIS_H }}>
        {width > 0 && (
          <svg width={width} height={TOP + PLOT_H + AXIS_H} role="img" aria-label={label} onPointerLeave={() => setHover(null)}>
            {Array.from({ length: max / step + 1 }, (_, i) => i * step).map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={width - RIGHT} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? VIZ.baseline : VIZ.grid} />
                <text x={LEFT - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-ink-500 text-[10px] tabular-nums">
                  {tick}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = LEFT + slot * i + slot / 2;
              let base = 0;
              const segments = series
                .map((s) => ({ s, v: Number(d[s.key]) || 0 }))
                .filter(({ v }) => v > 0)
                .map(({ s, v }, index, list) => {
                  const top = y(base + v);
                  const bottom = y(base) - (index > 0 ? GAP : 0);
                  base += v;
                  const h = Math.max(0, bottom - top);
                  const isTop = index === list.length - 1;
                  const r = isTop ? Math.min(4, barW / 2, h) : 0;
                  const x0 = cx - barW / 2;
                  // Rounded top corners only; square where the bar meets its base.
                  const path = `M${x0},${bottom} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x0 + barW - r} Q${x0 + barW},${top} ${x0 + barW},${top + r} V${bottom} Z`;
                  return <path key={s.key} d={path} fill={s.color} opacity={hover === null || hover === i ? 1 : 0.55} />;
                });
              return (
                <g key={d.day}>
                  {segments}
                  <rect
                    x={LEFT + slot * i}
                    y={TOP}
                    width={slot}
                    height={PLOT_H}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${formatDay(d.day)}: ${series.map((s) => `${s.label} ${d[s.key]}`).join(", ")}`}
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className="outline-none"
                  />
                  {i % labelEvery === 0 && (
                    <text x={cx} y={TOP + PLOT_H + 17} textAnchor="middle" className="fill-ink-500 text-[10px]">
                      {formatDay(d.day, false).replace(/^\w+ /, "")}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
        {hover !== null && data[hover] && (
          <Tooltip x={LEFT + slot * hover + slot / 2} y={TOP} width={width}>
            <p className="mb-1 font-semibold text-ink-900">{formatDay(data[hover].day)}</p>
            {series.map((s) => (
              <TooltipRow key={s.key} color={s.color} label={s.label} value={String(data[hover][s.key])} />
            ))}
          </Tooltip>
        )}
      </div>
      <TableToggle>
        <table className={tableCls}>
          <thead>
            <tr>
              <th>Day</th>
              {series.map((s) => (
                <th key={s.key} className="text-right">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.day}>
                <td>{formatDay(d.day)}</td>
                {series.map((s) => (
                  <td key={s.key} className="text-right tabular-nums">
                    {d[s.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </figure>
  );
}
