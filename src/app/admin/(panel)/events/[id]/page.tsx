import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventEditor from "@/components/admin/EventEditor";
import Icon from "@/components/admin/icons";
import { PageHeader } from "@/components/admin/ui";
import { getEvent } from "@/lib/admin/queries";
import { isUuid } from "@/lib/admin/validate";

export const metadata: Metadata = { title: "Event" };

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <>
      <Link href="/admin/events" className="mb-3 inline-flex items-center gap-1.5 text-[0.78rem] text-ink-500 hover:text-plum-900">
        <Icon name="back" className="h-3.5 w-3.5" />
        Events
      </Link>
      <PageHeader title={event.title} />
      <EventEditor event={event} isNew={false} justSaved={saved === "1"} />
    </>
  );
}
