import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import EventEditor from "@/components/admin/EventEditor";
import Icon from "@/components/admin/icons";
import { PageHeader } from "@/components/admin/ui";
import { requireVerifiedAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New event" };

/* The id is chosen here so photos can upload into the event's folder
   before its first save. */
export default async function NewEventPage() {
  await requireVerifiedAdmin();
  const event = {
    id: randomUUID(),
    title: "",
    eventType: null,
    eventDate: null,
    location: null,
    summary: null,
    photos: [],
    published: false,
    updatedAt: new Date().toISOString(),
  };

  return (
    <>
      <Link href="/admin/events" className="mb-3 inline-flex items-center gap-1.5 text-[0.78rem] text-ink-500 hover:text-plum-900">
        <Icon name="back" className="h-3.5 w-3.5" />
        Events
      </Link>
      <PageHeader title="New event" description="Add the details and photos, then choose whether it shows on the website." />
      <EventEditor event={event} isNew />
    </>
  );
}
