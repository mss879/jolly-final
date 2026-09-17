"use client";

import { useState } from "react";
import { formatDay } from "@/lib/admin/format";
import { Legend, TableToggle, Tooltip, TooltipRow, niceScale, useWidth } from "./shared";
import { VIZ, tableCls } from "./viz";

/* Multi-line chart over days with a crosshair that snaps to the nearest day. */
export type TrendSeries = { key: string; label: string; color: string };

const PLOT_H = 190;
const AXIS_H = 26;
const LEFT = 34;
const RIGHT = 12;
const TOP = 10;

export default function TrendChart<T extends { day: string }>({
  data,
  series,
  label,
}: {
  data: (T & Record<string, number | string>)[];
  series: TrendSeries[];
  label: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const values = (key: string) => data.map((d) => Number(d[key]) || 0);
  const peak = Math.max(0, ...series.flatMap((s) => values(s.key)));
  const { max, step } = niceScale(peak);
  const innerW = Math.max(0, width - LEFT - RIGHT);
  const x = (i: number) => LEFT + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => TOP + PLOT_H - (v / max) * PLOT_H;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 70))));

  function pick(clientX: number, rect: DOMRect) {
    const rel = clientX - rect.left - LEFT;
    const i = Math.round((rel / Math.max(innerW, 1)) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  }

  return (
    <figure>
      <Legend
        items={series.map((s) => ({
          label: s.label,
          color: s.color,
          shape: "line",
          value: String(values(s.key).reduce((a, b) => a + b, 0)),
        }))}
      />
      <div ref={ref} className="relative mt-3" style={{ height: TOP + PLOT_H + AXIS_H }}>
        {width > 0 && (
          <svg
            width={width}
            height={TOP + PLOT_H + AXIS_H}
            role="img"
            aria-label={label}
            tabIndex={0}
            className="outline-none focus-visible:ring-2 focus-visible:ring-plum-700"
            onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
            onPointerLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setHover((h) => Math.min(data.length - 1, (h ?? -1) + 1));
              if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? data.length) - 1));
            }}
          >
            {Array.from({ length: max / step + 1 }, (_, i) => i * step).map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={width - RIGHT} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? VIZ.baseline : VIZ.grid} />
                <text x={LEFT - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-ink-500 text-[10px] tabular-nums">
                  {tick}
                </text>
              </g>
            ))}
            {data.map((d, i) =>
              i % labelEvery === 0 ? (
                <text key={d.day} x={x(i)} y={TOP + PLOT_H + 17} textAnchor="middle" className="fill-ink-500 text-[10px]">
                  {formatDay(d.day, false).replace(/^\w+ /, "")}
                </text>
              ) : null,
            )}
            {series.map((s) => (
              <polyline
                key={s.key}
                points={values(s.key)
                  .map((v, i) => `${x(i)},${y(v)}`)
                  .join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {hover !== null && (
              <g>
                <line x1={x(hover)} x2={x(hover)} y1={TOP} y2={TOP + PLOT_H} stroke={VIZ.baseline} />
                {series.map((s) => (
                  <circle
                    key={s.key}
                    cx={x(hover)}
                    cy={y(values(s.key)[hover])}
                    r={4}
                    fill={s.color}
                    stroke={VIZ.surface}
                    strokeWidth={2}
                  />
                ))}
              </g>
            )}
          </svg>
        )}
        {hover !== null && data[hover] && (
          <Tooltip x={x(hover)} y={TOP} width={width}>
            <p className="mb-1 font-semibold text-ink-900">{formatDay(data[hover].day)}</p>
            {series.map((s) => (
              <TooltipRow key={s.key} color={s.color} label={s.label} value={String(values(s.key)[hover])} />
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
