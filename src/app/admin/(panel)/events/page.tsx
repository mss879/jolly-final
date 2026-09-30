import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/admin/icons";
import { Badge, EmptyState, PageHeader, btnPrimary } from "@/components/admin/ui";
import { formatDay } from "@/lib/admin/format";
import { getEvents } from "@/lib/admin/queries";
import { eventPhotoUrl } from "@/lib/event-photos";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents();
  const shown = events.filter((e) => e.published).length;

  const newButton = (
    <Link href="/admin/events/new" className={btnPrimary}>
      <Icon name="plus" />
      New event
    </Link>
  );

  return (
    <>
      <PageHeader
        title="Events"
        description={
          events.length
            ? `${shown} of ${events.length} shown under “Recent events” on the Reviews page.`
            : "Recent events you've served, with photos — shown on the Reviews page."
        }
        actions={newButton}
      />

      {events.length === 0 ? (
        <div className="border border-gold-200/70 bg-cream-50">
          <EmptyState title="No events yet" action={newButton}>
            Add a wedding, gala or party you&apos;ve served — a title, a few photos and a line about it.
          </EmptyState>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => (
            <li key={e.id}>
              <Link
                href={`/admin/events/${e.id}`}
                className="group flex h-full flex-col border border-gold-200/70 bg-cream-50 transition-colors hover:border-plum-900"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
                  {e.photos[0] ? (
                    <Image src={eventPhotoUrl(e.photos[0])} alt="" fill sizes="(min-width: 1280px) 22rem, 45vw" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-ink-500">
                      <Icon name="photo" className="h-8 w-8" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-plum-900 group-hover:text-gold-700">{e.title}</p>
                    {e.published ? <Badge tone="good">On website</Badge> : <Badge tone="muted">Hidden</Badge>}
                  </div>
                  <p className="text-[0.78rem] text-ink-500">
                    {[e.eventType, e.eventDate ? formatDay(e.eventDate) : null, e.location].filter(Boolean).join(" · ") ||
                      "No details yet"}
                  </p>
                  <p className="mt-auto text-[0.72rem] text-ink-500">
                    {e.photos.length} photo{e.photos.length === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
