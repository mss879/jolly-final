import Link from "next/link";
import { BOOKING_FIELDS, bookingFieldLabel } from "@/lib/booking-fields";
import { formatDuration, formatNumber, formatPercent, percent } from "@/lib/admin/format";
import { ANALYTICS_RANGES, type AnalyticsRange, type FormAnalytics } from "@/lib/admin/types";
import BarList from "./charts/BarList";
import TrendChart from "./charts/TrendChart";
import { VIZ, tableCls } from "./charts/viz";
import { Card, EmptyState, StatTile } from "./ui";

/* Booking-form analytics: where visitors stop, how far they get, and which
   fields slow them down. Numbers come from booking_form_analytics(). */

function sourceLabel(source: string) {
  if (source === "direct") return "Direct visit";
  if (source.startsWith("/")) return `Site: ${source === "/" ? "Home" : source}`;
  return source;
}

function Breakdown({ title, rows }: { title: string; rows: { label: string; views: number; started: number; submitted: number }[] }) {
  return (
    <Card title={title} bodyClassName="px-5 pt-3 pb-5">
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-500">No visits yet</p>
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th />
              <th className="text-right">Views</th>
              <th className="text-right">Sent</th>
              <th className="w-[38%]">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rate = percent(r.submitted, r.views) ?? 0;
              return (
                <tr key={r.label}>
                  <td className="max-w-[10rem] truncate">{r.label}</td>
                  <td className="text-right tabular-nums">{formatNumber(r.views)}</td>
                  <td className="text-right tabular-nums">{formatNumber(r.submitted)}</td>
                  <td>
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 flex-1 bg-cream-200">
                        <span className="block h-full" style={{ width: `${rate}%`, backgroundColor: VIZ.accent }} />
                      </span>
                      <span className="w-9 text-right text-[0.75rem] tabular-nums">{rate}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export default function AnalyticsView({ range, data }: { range: AnalyticsRange; data: FormAnalytics }) {
  const { totals, fields } = data;
  const period = `in the last ${range} days`;

  const filters = (
    <nav aria-label="Date range" className="flex flex-wrap gap-2">
      {ANALYTICS_RANGES.map((days) => (
        <Link
          key={days}
          href={`/admin/bookings/analytics?range=${days}`}
          aria-current={days === range ? "page" : undefined}
          className={`rounded-btn border px-3 py-1.5 text-[0.8rem] transition-colors ${
            days === range
              ? "border-plum-900 bg-plum-900 font-semibold text-cream-100"
              : "border-gold-200 bg-cream-50 text-ink-700 hover:border-gold-400"
          }`}
        >
          Last {days} days
        </Link>
      ))}
    </nav>
  );

  if (totals.views === 0) {
    return (
      <>
        {filters}
        <Card className="mt-5">
          <EmptyState title="No visits to the booking form yet">
            As soon as someone opens the reserve page, you&apos;ll see how far they get and where they stop — {period}.
          </EmptyState>
        </Card>
      </>
    );
  }

  // Where abandoned visitors stopped
  const dropRows = fields.map((f) => ({
    key: f.field,
    label: bookingFieldLabel(f.field),
    value: f.dropped,
    display: `${f.dropped} · ${formatPercent(f.dropped, totals.abandoned)}`,
    detail: `${f.dropped} of ${f.reached} who reached this field left here · avg. ${formatDuration(f.avg_ms === null ? null : f.avg_ms / 1000)} in it`,
  }));
  const worst = dropRows.reduce<(typeof dropRows)[number] | null>((top, r) => (r.value > (top?.value ?? 0) ? r : top), null);

  // How far visitors get, as a funnel
  const steps = [
    { key: "viewed", label: "Opened the form", value: totals.views },
    { key: "started", label: "Started filling in", value: totals.started },
    ...fields.map((f) => ({ key: f.field, label: `Reached ${bookingFieldLabel(f.field).toLowerCase()}`, value: f.reached })),
    { key: "submitted", label: "Sent the booking", value: totals.submitted },
  ];
  let biggestLoss = { key: "", loss: 0 };
  steps.forEach((s, i) => {
    const loss = i === 0 ? 0 : steps[i - 1].value - s.value;
    if (loss > biggestLoss.loss) biggestLoss = { key: s.key, loss };
  });
  const funnelRows = steps.map((s, i) => ({
    ...s,
    badge: s.key === biggestLoss.key ? "Biggest drop" : undefined,
    display: `${formatNumber(s.value)} · ${formatPercent(s.value, totals.views)}`,
    detail: i > 0 ? `${formatNumber(Math.max(0, steps[i - 1].value - s.value))} fewer than the step before` : undefined,
  }));

  return (
    <>
      {filters}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label="Form views" value={formatNumber(totals.views)} hint={period} />
        <StatTile
          label="Started filling in"
          value={formatNumber(totals.started)}
          hint={`${formatPercent(totals.started, totals.views)} of views`}
        />
        <StatTile
          label="Bookings sent"
          value={formatNumber(totals.submitted)}
          hint={`${formatPercent(totals.submitted, totals.views)} of views`}
        />
        <StatTile
          label="Dropout rate"
          value={formatPercent(totals.abandoned, totals.started)}
          hint={`${formatNumber(totals.abandoned)} left part-way${totals.in_progress ? ` · ${totals.in_progress} filling in now` : ""}`}
        />
        <StatTile
          label="Time to send"
          value={formatDuration(totals.median_seconds_to_submit)}
          hint="median, first field to send"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Where visitors leave the form">
          <p className="mb-4 text-sm text-ink-700">
            {worst ? (
              <>
                Most people who give up stop at <strong className="text-plum-900">{worst.label.toLowerCase()}</strong> —{" "}
                {formatPercent(worst.value, totals.abandoned)} of the {formatNumber(totals.abandoned)} who left part-way.
              </>
            ) : (
              "Nobody has left the form part-way in this period."
            )}
          </p>
          <BarList rows={dropRows} emphasis={worst?.key ?? null} emptyLabel="No drop-offs in this period" />
        </Card>

        <Card title="How far visitors get">
          <p className="mb-4 text-sm text-ink-700">
            {formatPercent(totals.submitted, totals.views)} of visitors who open the form send a booking.
            {biggestLoss.loss > 0 && (
              <>
                {" "}
                The biggest fall comes at &ldquo;
                <strong className="text-plum-900">{steps.find((s) => s.key === biggestLoss.key)?.label}</strong>&rdquo; —{" "}
                {formatNumber(biggestLoss.loss)} fewer visitors than the step before.
              </>
            )}
          </p>
          <BarList
            rows={funnelRows}
            max={totals.views}
            emphasis={biggestLoss.key || null}
          />
        </Card>
      </div>

      <Card title="Field by field" className="mt-6" bodyClassName="overflow-x-auto px-5 pt-3 pb-5">
        <table className={`${tableCls} min-w-[40rem]`}>
          <thead>
            <tr>
              <th>Field</th>
              <th className="text-right">Reached</th>
              <th className="text-right">Filled in</th>
              <th className="text-right">Left here</th>
              <th className="text-right">Drop-off at field</th>
              <th className="text-right">Avg. time</th>
              <th className="text-right">Blocked a send</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.field} className={worst?.key === f.field ? "bg-plum-100/50" : undefined}>
                <td className="font-medium text-ink-900">{bookingFieldLabel(f.field)}</td>
                <td className="text-right tabular-nums">{formatNumber(f.reached)}</td>
                <td className="text-right tabular-nums">{formatNumber(f.filled)}</td>
                <td className="text-right tabular-nums">{formatNumber(f.dropped)}</td>
                <td className="text-right tabular-nums">{formatPercent(f.dropped, f.reached)}</td>
                <td className="text-right tabular-nums">{formatDuration(f.avg_ms === null ? null : f.avg_ms / 1000)}</td>
                <td className="text-right tabular-nums">{f.errors ? formatNumber(f.errors) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-500">
          Fields in form order ({BOOKING_FIELDS.length}). &ldquo;Reached&rdquo; counts visitors who got at least that far down
          the form; &ldquo;left here&rdquo; is where people who gave up last typed. A visit counts as abandoned after 30
          minutes without activity. &ldquo;Blocked a send&rdquo; means the field stopped someone pressing send — usually a
          missing or mistyped required answer.
        </p>
      </Card>

      <Card title="Visits per day" className="mt-6">
        <TrendChart
          data={data.daily}
          label={`Form views, starts and sent bookings per day ${period}`}
          series={[
            { key: "views", label: "Opened", color: VIZ.funnel[0] },
            { key: "started", label: "Started", color: VIZ.funnel[1] },
            { key: "submitted", label: "Sent", color: VIZ.funnel[2] },
          ]}
        />
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Breakdown
          title="Devices"
          rows={data.devices.map((d) => ({ ...d, label: d.device === "unknown" ? "Unknown" : d.device[0].toUpperCase() + d.device.slice(1) }))}
        />
        <Breakdown title="Where visitors came from" rows={data.sources.map((s) => ({ ...s, label: sourceLabel(s.source) }))} />
      </div>
    </>
  );
}
