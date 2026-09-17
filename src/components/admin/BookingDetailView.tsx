import Link from "next/link";
import { bookingFieldLabel } from "@/lib/booking-fields";
import { formatDateTime, formatDay, formatTime, relativeTime } from "@/lib/admin/format";
import type { BookingDetail } from "@/lib/admin/queries";
import BookingActions, { BookingNotes } from "./BookingActions";
import { BookingStatusBadge } from "./BookingsView";
import Icon from "./icons";
import { Card, ContactLinks, Field } from "./ui";

function sourceLabel(source: string | null) {
  if (!source) return "Direct visit";
  if (source.startsWith("/")) return `From the site: ${source === "/" ? "Home" : source}`;
  return source;
}

export default function BookingDetailView({ detail }: { detail: BookingDetail }) {
  const { booking: b, leadId, confirmedBy, now } = detail;
  const time = formatTime(b.confirmed_time);

  return (
    <>
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-plum-900">
        <Icon name="back" /> All bookings
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <Card bodyClassName="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-plum-900">{b.name ?? "Name not given"}</h2>
                <p className="mt-1 text-[0.8rem] text-ink-500">
                  {b.submitted_at
                    ? `Sent ${formatDateTime(b.submitted_at)}`
                    : `Started ${formatDateTime(b.started_at)} · last active ${relativeTime(b.last_activity_at, now)}`}
                </p>
              </div>
              <BookingStatusBadge booking={{ status: b.status, lastActivityAt: b.last_activity_at }} now={now} />
            </div>

            {b.status === "in_progress" && (
              <p className="mt-4 border-l-2 border-gold-400 bg-cream-200/50 px-4 py-3 text-sm text-ink-700">
                This visitor didn&apos;t finish the form
                {b.last_field ? ` — they stopped at ${bookingFieldLabel(b.last_field).toLowerCase()}` : ""}. Everything
                they typed is below.
              </p>
            )}

            {b.status === "confirmed" && b.confirmed_date && (
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-emerald-600 bg-emerald-50/60 px-4 py-3 text-sm text-ink-900">
                <span>
                  On the calendar for <strong>{formatDay(b.confirmed_date)}</strong>
                  {time ? ` at ${time}` : ""}
                </span>
                <Link
                  href={`/admin/calendar?month=${b.confirmed_date.slice(0, 7)}`}
                  className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-plum-900 hover:text-gold-700"
                >
                  Open calendar <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
              </p>
            )}

            <div className="mt-6 border-t border-gold-200/60 pt-5">
              <BookingActions
                id={b.id}
                status={b.status}
                requestedDate={b.event_date}
                confirmedDate={b.confirmed_date}
                confirmedTime={b.confirmed_time}
                leadId={leadId}
              />
            </div>
          </Card>

          <Card title="The event">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Contact">
                <ContactLinks phone={b.phone} email={b.email} />
              </Field>
              <Field label="Event type">{b.event_type ?? "—"}</Field>
              <Field label="Requested date">
                {b.event_date ? formatDay(b.event_date) : "Not chosen"}
                {b.confirmed_date && b.event_date && b.confirmed_date !== b.event_date && (
                  <span className="block text-[0.75rem] text-ink-500">Confirmed for {formatDay(b.confirmed_date)}</span>
                )}
              </Field>
              <Field label="Guests">{b.guests ?? "—"}</Field>
              <Field label="Venue">{b.venue ?? "—"}</Field>
              <Field label="Cart colour">{b.cart ?? "—"}</Field>
              <div className="sm:col-span-2">
                <Field label="Flavours">
                  {b.flavours.length || b.custom_flavour ? (
                    <span className="flex flex-wrap gap-1.5">
                      {b.flavours.map((f) => (
                        <span key={f} className="rounded-btn border border-gold-200 bg-cream-100 px-2 py-0.5 text-[0.75rem]">
                          {f}
                        </span>
                      ))}
                      {b.custom_flavour && (
                        <span className="rounded-btn border border-plum-200 bg-plum-100 px-2 py-0.5 text-[0.75rem] text-plum-900">
                          Custom: {b.custom_flavour}
                        </span>
                      )}
                    </span>
                  ) : (
                    "None picked"
                  )}
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="About the event">
                  <span className="whitespace-pre-wrap">{b.message ?? "—"}</span>
                </Field>
              </div>
            </dl>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Team notes">
            <BookingNotes id={b.id} notes={b.admin_notes} />
          </Card>
          <Card title="Where it came from">
            <dl className="flex flex-col gap-4">
              <Field label="Source">{sourceLabel(b.source)}</Field>
              <Field label="Device">{b.device ? b.device[0].toUpperCase() + b.device.slice(1) : "Unknown"}</Field>
              {b.landing_path && (
                <Field label="Landing page">
                  <span className="break-all">{b.landing_path}</span>
                </Field>
              )}
              <Field label="Started">{formatDateTime(b.started_at)}</Field>
              {b.confirmed_at && (
                <Field label="Confirmed">
                  {formatDateTime(b.confirmed_at)}
                  {confirmedBy && <span className="block text-[0.75rem] break-all text-ink-500">by {confirmedBy}</span>}
                </Field>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
