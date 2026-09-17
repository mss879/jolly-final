import Link from "next/link";
import { addDays, formatDay, formatMonth, formatTime } from "@/lib/admin/format";
import type { CalendarData } from "@/lib/admin/queries";
import type { BookingSummary } from "@/lib/admin/types";
import Icon from "./icons";
import { Card, EmptyState, PageHeader, btnSecondary } from "./ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS = 3;

function monthHref(month: string) {
  return `/admin/calendar?month=${month}`;
}

function title(b: BookingSummary) {
  return b.name ?? b.eventType ?? "Booking";
}

export default function CalendarView({ month, today, data }: { month: string; today: string; data: CalendarData }) {
  const days: string[] = [];
  for (let d = data.gridStart; d <= data.gridEnd; d = addDays(d, 1)) days.push(d);

  const byDay = new Map<string, BookingSummary[]>();
  for (const event of data.events) {
    if (!event.confirmedDate) continue;
    byDay.set(event.confirmedDate, [...(byDay.get(event.confirmedDate) ?? []), event]);
  }
  const thisMonth = data.events.filter((e) => e.confirmedDate?.startsWith(month));

  const prev = addDays(`${month}-01`, -1).slice(0, 7);
  const next = addDays(`${month}-01`, 32).slice(0, 7);
  const currentMonth = today.slice(0, 7);

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Confirmed bookings only — requests appear here once you confirm them."
        actions={
          <>
            <Link href={monthHref(prev)} className={btnSecondary} aria-label="Previous month">
              <Icon name="left" />
            </Link>
            {month !== currentMonth && (
              <Link href={monthHref(currentMonth)} className={btnSecondary}>
                Today
              </Link>
            )}
            <Link href={monthHref(next)} className={btnSecondary} aria-label="Next month">
              <Icon name="right" />
            </Link>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-plum-900">{formatMonth(month)}</h2>
        {data.pending > 0 && (
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 rounded-btn border border-amber-200 bg-amber-50 px-3 py-1.5 text-[0.8rem] text-amber-900 hover:border-amber-400"
          >
            <Icon name="clock" className="h-3.5 w-3.5" />
            {data.pending} {data.pending === 1 ? "request is" : "requests are"} waiting for confirmation
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <Card bodyClassName="">
        <div className="grid grid-cols-7 border-b border-gold-200/70 text-center text-[0.68rem] font-semibold tracking-[0.12em] text-ink-500 uppercase">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5">
              <span className="sm:hidden">{d[0]}</span>
              <span className="hidden sm:inline">{d}</span>
            </div>
          ))}
        </div>
        <ol className="grid grid-cols-7">
          {days.map((day, i) => {
            const events = byDay.get(day) ?? [];
            const inMonth = day.startsWith(month);
            const isToday = day === today;
            return (
              <li
                key={day}
                className={`min-h-16 border-gold-200/60 p-1 sm:min-h-28 sm:p-1.5 ${i % 7 ? "border-l" : ""} ${
                  i >= 7 ? "border-t" : ""
                } ${inMonth ? "" : "bg-cream-200/40"}`}
              >
                <div className="flex items-center justify-between px-0.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] tabular-nums ${
                      isToday ? "bg-plum-900 font-semibold text-cream-100" : inMonth ? "text-ink-900" : "text-ink-500/70"
                    }`}
                  >
                    {Number(day.slice(8))}
                  </span>
                  {events.length > 0 && (
                    <span className="text-[0.65rem] font-semibold text-plum-700 sm:hidden">{events.length}</span>
                  )}
                </div>
                <ul className="mt-1 hidden flex-col gap-1 sm:flex">
                  {events.slice(0, MAX_CHIPS).map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/admin/bookings/${e.id}`}
                        className="block truncate border-l-2 border-plum-700 bg-plum-100 px-1.5 py-1 text-[0.7rem] leading-tight text-plum-900 hover:bg-plum-200"
                        title={`${title(e)}${e.eventType ? ` · ${e.eventType}` : ""}${e.guests ? ` · ${e.guests} guests` : ""}`}
                      >
                        {formatTime(e.confirmedTime) && (
                          <span className="font-semibold">{formatTime(e.confirmedTime)} </span>
                        )}
                        {title(e)}
                      </Link>
                    </li>
                  ))}
                  {events.length > MAX_CHIPS && (
                    <li className="px-1.5 text-[0.68rem] text-ink-500">+{events.length - MAX_CHIPS} more</li>
                  )}
                </ul>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card title={`Events in ${formatMonth(month)}`} className="mt-6" bodyClassName="">
        {thisMonth.length === 0 ? (
          <EmptyState title="Nothing booked this month">Confirm a request and it will appear on this calendar.</EmptyState>
        ) : (
          <ul className="divide-y divide-gold-200/60">
            {thisMonth.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/bookings/${e.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-cream-200/40">
                  <span className="w-24 shrink-0 text-[0.8rem] font-semibold text-plum-900">
                    {formatDay(e.confirmedDate!, false)}
                    {formatTime(e.confirmedTime) && (
                      <span className="block text-[0.72rem] font-normal text-ink-500">{formatTime(e.confirmedTime)}</span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink-900">{title(e)}</span>
                    <span className="block truncate text-[0.75rem] text-ink-500">
                      {[e.eventType, e.guests ? `${e.guests} guests` : null].filter(Boolean).join(" · ") || "Details in the booking"}
                    </span>
                  </span>
                  <Icon name="right" className="h-4 w-4 shrink-0 text-ink-500" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
