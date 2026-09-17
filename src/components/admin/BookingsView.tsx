import Link from "next/link";
import { bookingFieldLabel } from "@/lib/booking-fields";
import { formatDateTime, formatDay, formatTime, relativeTime } from "@/lib/admin/format";
import type { BookingView } from "@/lib/admin/queries";
import { ACTIVE_WINDOW_MS, BOOKING_STATUS, type BookingSummary } from "@/lib/admin/types";
import Icon from "./icons";
import { Badge, Card, EmptyState, Pagination } from "./ui";

export const BOOKING_VIEWS: { view: BookingView; label: string; empty: string }[] = [
  { view: "pending", label: "Awaiting confirmation", empty: "Nothing is waiting for a decision." },
  { view: "confirmed", label: "Confirmed", empty: "Confirmed bookings will appear here and on the calendar." },
  {
    view: "incomplete",
    label: "Incomplete",
    empty: "Visitors who leave their name or number without finishing the form show up here.",
  },
  { view: "closed", label: "Declined & cancelled", empty: "Nothing declined or cancelled." },
  { view: "all", label: "All requests", empty: "No booking requests yet." },
];

export function bookingsHref(view: BookingView, page = 1) {
  const q = new URLSearchParams();
  if (view !== "pending") q.set("view", view);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return `/admin/bookings${s ? `?${s}` : ""}`;
}

export function BookingStatusBadge({ booking, now }: { booking: Pick<BookingSummary, "status" | "lastActivityAt">; now: number }) {
  if (booking.status === "in_progress" && now - new Date(booking.lastActivityAt).getTime() < ACTIVE_WINDOW_MS) {
    return <Badge tone="info">Filling in now</Badge>;
  }
  const meta = BOOKING_STATUS[booking.status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

function eventLine(b: BookingSummary) {
  if (b.status === "confirmed" && b.confirmedDate) {
    const time = formatTime(b.confirmedTime);
    return `${formatDay(b.confirmedDate)}${time ? ` · ${time}` : ""}`;
  }
  return b.eventDate ? formatDay(b.eventDate) : "Date to be decided";
}

export default function BookingsView({
  view,
  page,
  pages,
  counts,
  bookings,
  now,
}: {
  view: BookingView;
  page: number;
  pages: number;
  counts: Record<BookingView, number>;
  bookings: BookingSummary[];
  now: number;
}) {
  const meta = BOOKING_VIEWS.find((v) => v.view === view) ?? BOOKING_VIEWS[0];

  return (
    <>
      <nav aria-label="Booking filters" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-2">
          {BOOKING_VIEWS.map((v) => {
            const active = v.view === view;
            return (
              <li key={v.view}>
                <Link
                  href={bookingsHref(v.view)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-btn border px-3 py-1.5 text-[0.8rem] transition-colors ${
                    active
                      ? "border-plum-900 bg-plum-900 font-semibold text-cream-100"
                      : "border-gold-200 bg-cream-50 text-ink-700 hover:border-gold-400"
                  }`}
                >
                  {v.label}
                  <span className={`text-[0.7rem] tabular-nums ${active ? "text-cream-100/80" : "text-ink-500"}`}>
                    {counts[v.view]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Card className="mt-5" bodyClassName="">
        {bookings.length === 0 ? (
          <EmptyState title={`No ${meta.label.toLowerCase()} bookings`}>{meta.empty}</EmptyState>
        ) : (
          <>
            {/* Wide screens: table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-gold-200/70 text-[0.68rem] tracking-[0.12em] text-ink-500 uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Guest</th>
                  <th className="px-3 py-3 font-semibold">Event</th>
                  <th className="px-3 py-3 text-right font-semibold">Guests</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">{view === "incomplete" ? "Last active" : "Received"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-200/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="group relative transition-colors hover:bg-cream-200/40">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/bookings/${b.id}`} className="font-semibold text-plum-900 after:absolute after:inset-0">
                        {b.name ?? "Name not given"}
                      </Link>
                      <p className="mt-0.5 text-[0.75rem] text-ink-500">{b.phone ?? b.email ?? "—"}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="text-ink-900">{b.eventType ?? "—"}</p>
                      <p className="mt-0.5 text-[0.75rem] text-ink-500">{eventLine(b)}</p>
                    </td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{b.guests ?? "—"}</td>
                    <td className="px-3 py-3.5">
                      <BookingStatusBadge booking={b} now={now} />
                      {b.status === "in_progress" && b.lastField && (
                        <p className="mt-1 text-[0.72rem] text-ink-500">Stopped at {bookingFieldLabel(b.lastField).toLowerCase()}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[0.8rem] whitespace-nowrap text-ink-500">
                      {b.status === "in_progress" || !b.submittedAt
                        ? relativeTime(b.lastActivityAt, now)
                        : formatDateTime(b.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Narrow screens: cards */}
            <ul className="divide-y divide-gold-200/60 md:hidden">
              {bookings.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="flex items-start justify-between gap-3 px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-plum-900">{b.name ?? "Name not given"}</p>
                      <p className="mt-0.5 text-[0.78rem] text-ink-700">
                        {b.eventType ?? "Event"} · {eventLine(b)}
                      </p>
                      <div className="mt-2">
                        <BookingStatusBadge booking={b} now={now} />
                      </div>
                    </div>
                    <Icon name="right" className="mt-1 h-4 w-4 shrink-0 text-ink-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <Pagination page={page} pages={pages} hrefFor={(p) => bookingsHref(view, p)} />
      </Card>
    </>
  );
}
