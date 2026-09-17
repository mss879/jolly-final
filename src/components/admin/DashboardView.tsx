import Link from "next/link";
import { bookingFieldLabel } from "@/lib/booking-fields";
import { formatDay, formatLkr, formatNumber, formatPercent, formatTime, relativeTime } from "@/lib/admin/format";
import type { DashboardData } from "@/lib/admin/queries";
import { BookingStatusBadge } from "./BookingsView";
import BarList from "./charts/BarList";
import StackedColumns from "./charts/StackedColumns";
import { VIZ } from "./charts/viz";
import Icon, { type IconName } from "./icons";
import { Card, CardLink, EmptyState, PageHeader, StatTile } from "./ui";

/* The dashboard: what needs doing now, then how the last 30 days went across
   inquiries, bookings, the CRM pipeline and the booking form. */

function AttentionTile({
  href,
  icon,
  count,
  label,
  clear,
}: {
  href: string;
  icon: IconName;
  count: number;
  label: string;
  clear: string;
}) {
  const busy = count > 0;
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 border px-5 py-4 transition-colors ${
        busy ? "border-plum-200 bg-cream-50 hover:border-plum-700" : "border-gold-200/70 bg-cream-50/60 hover:border-gold-400"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          busy ? "bg-plum-900 text-cream-100" : "bg-cream-200 text-ink-500"
        }`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1.6rem] leading-none font-semibold text-plum-900">{count}</span>
        <span className="mt-1 block text-[0.8rem] text-ink-700">{busy ? label : clear}</span>
      </span>
      <Icon name="arrow" className="h-4 w-4 text-ink-500 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const { now, today, attention, kpis, activity, upcoming, latestInquiries, latestRequests, pipeline, form } = data;
  const period = "vs previous 30 days";
  const pipelineLeads = pipeline.reduce((sum, s) => sum + s.leads, 0);
  const pipelineValue = pipeline.reduce((sum, s) => sum + s.value, 0);
  const worstField = form.fields.reduce<(typeof form.fields)[number] | null>(
    (top, f) => (f.dropped > (top?.dropped ?? 0) ? f : top),
    null,
  );

  return (
    <>
      <PageHeader title="Dashboard" description={formatDay(today)} />

      <section aria-label="Needs attention" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AttentionTile
          href="/admin/inquiries"
          icon="inbox"
          count={attention.newInquiries}
          label={attention.newInquiries === 1 ? "New inquiry to read" : "New inquiries to read"}
          clear="No unread inquiries"
        />
        <AttentionTile
          href="/admin/bookings"
          icon="clock"
          count={attention.pendingBookings}
          label="Bookings awaiting confirmation"
          clear="No bookings waiting"
        />
        <AttentionTile
          href="/admin/bookings?view=incomplete"
          icon="phone"
          count={attention.incompleteBookings}
          label="Unfinished bookings this week"
          clear="No unfinished bookings this week"
        />
      </section>

      <h2 className="mt-9 mb-3 text-[0.72rem] font-semibold tracking-[0.14em] text-ink-500 uppercase">Last 30 days</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Inquiries"
          value={formatNumber(kpis.inquiries.value)}
          delta={{ change: kpis.inquiries.change, period }}
          href="/admin/inquiries"
        />
        <StatTile
          label="Booking requests"
          value={formatNumber(kpis.requests.value)}
          delta={{ change: kpis.requests.change, period }}
          href="/admin/bookings?view=all"
        />
        <StatTile
          label="Bookings confirmed"
          value={formatNumber(kpis.confirmed.value)}
          delta={{ change: kpis.confirmed.change, period }}
          href="/admin/bookings?view=confirmed"
        />
        <StatTile
          label="Booking form conversion"
          value={kpis.conversion.value === null ? "—" : `${Math.round(kpis.conversion.value * 100)}%`}
          delta={{ change: kpis.conversion.change, period, unit: " pts" }}
          href="/admin/bookings/analytics"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="New enquiries per day" className="lg:col-span-2">
          <StackedColumns
            data={activity}
            label="Inquiries and booking requests per day over the last 30 days"
            series={[
              { key: "inquiries", label: "Inquiries", color: VIZ.series[0] },
              { key: "requests", label: "Booking requests", color: VIZ.series[1] },
            ]}
          />
        </Card>

        <Card title="Upcoming events" action={<CardLink href="/admin/calendar">Calendar</CardLink>} bodyClassName="">
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing booked yet">Confirmed bookings will line up here.</EmptyState>
          ) : (
            <ul className="divide-y divide-gold-200/60">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/bookings/${e.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-cream-200/40">
                    <span className="flex w-12 shrink-0 flex-col items-center border border-gold-200 bg-cream-100 py-1 leading-none">
                      <span className="text-[0.6rem] font-semibold tracking-[0.1em] text-gold-700 uppercase">
                        {formatDay(e.confirmedDate!, false).split(" ")[2]}
                      </span>
                      <span className="mt-0.5 text-lg font-semibold text-plum-900">{Number(e.confirmedDate!.slice(8))}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-900">{e.name ?? "Booking"}</span>
                      <span className="block truncate text-[0.75rem] text-ink-500">
                        {[formatDay(e.confirmedDate!, false).split(" ")[0], formatTime(e.confirmedTime), e.eventType]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Pipeline" action={<CardLink href="/admin/crm">Open CRM</CardLink>}>
          <p className="mb-4 text-sm text-ink-700">
            {formatNumber(pipelineLeads)} {pipelineLeads === 1 ? "lead" : "leads"}
            {pipelineValue > 0 && <> · {formatLkr(pipelineValue)} estimated</>}
          </p>
          <BarList
            rows={pipeline.map((s) => ({
              key: s.id,
              label: s.name,
              value: s.leads,
              display: String(s.leads),
              detail: s.value > 0 ? `${formatLkr(s.value)} estimated` : undefined,
            }))}
            emptyLabel="No leads yet — move an inquiry or booking into the CRM"
          />
        </Card>

        <Card title="Booking form" action={<CardLink href="/admin/bookings/analytics">Analytics</CardLink>}>
          {form.totals.views === 0 ? (
            <EmptyState title="No visits yet">Visits to the reserve page will show up here.</EmptyState>
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-700">
                {formatPercent(form.totals.submitted, form.totals.views)} of visitors sent a booking ·{" "}
                {formatPercent(form.totals.abandoned, form.totals.started)} dropout rate
              </p>
              <BarList
                max={form.totals.views}
                rows={[
                  { key: "views", label: "Opened the form", value: form.totals.views, color: VIZ.funnel[0] },
                  { key: "started", label: "Started filling in", value: form.totals.started, color: VIZ.funnel[1] },
                  { key: "submitted", label: "Sent the booking", value: form.totals.submitted, color: VIZ.funnel[2] },
                ].map((r) => ({ ...r, display: `${formatNumber(r.value)} · ${formatPercent(r.value, form.totals.views)}` }))}
              />
              {worstField && (
                <p className="mt-4 border-t border-gold-200/60 pt-3 text-[0.8rem] text-ink-700">
                  Most drop-offs happen at <strong className="text-plum-900">{bookingFieldLabel(worstField.field).toLowerCase()}</strong>{" "}
                  ({formatNumber(worstField.dropped)} of {formatNumber(form.totals.abandoned)}).
                </p>
              )}
            </>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Latest inquiries" action={<CardLink href="/admin/inquiries">Inbox</CardLink>} bodyClassName="">
          {latestInquiries.length === 0 ? (
            <EmptyState title="No inquiries yet">Messages from the contact page land here.</EmptyState>
          ) : (
            <ul className="divide-y divide-gold-200/60">
              {latestInquiries.map((q) => (
                <li key={q.id}>
                  <Link href={`/admin/inquiries?id=${q.id}`} className="block px-5 py-3 hover:bg-cream-200/40">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={`truncate text-sm ${q.status === "new" ? "font-semibold text-plum-900" : "text-ink-900"}`}>
                        {q.name}
                      </span>
                      <span className="shrink-0 text-[0.72rem] text-ink-500">{relativeTime(q.createdAt, now)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[0.78rem] text-ink-500">{q.message}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Latest booking requests" action={<CardLink href="/admin/bookings?view=all">All requests</CardLink>} bodyClassName="">
          {latestRequests.length === 0 ? (
            <EmptyState title="No booking requests yet">Requests from the reserve page land here.</EmptyState>
          ) : (
            <ul className="divide-y divide-gold-200/60">
              {latestRequests.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-cream-200/40">
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink-900">{b.name ?? "Name not given"}</span>
                      <span className="block truncate text-[0.75rem] text-ink-500">
                        {[b.eventType, b.eventDate ? formatDay(b.eventDate, false) : null].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <BookingStatusBadge booking={b} now={now} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
