import type { Metadata } from "next";
import InquiriesView from "@/components/admin/InquiriesView";
import { getInquiries, getInquiry } from "@/lib/admin/queries";
import { isUuid } from "@/lib/admin/validate";

export const metadata: Metadata = { title: "Inquiries" };

type SearchParams = Promise<{ view?: string; page?: string; id?: string }>;

export default async function InquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const view = params.view === "archived" ? "archived" : "inbox";
  const requestedPage = Math.max(1, Math.floor(Number(params.page)) || 1);
  const selectedId = isUuid(params.id) ? params.id : null;

  const [{ inquiries, page, pages, counts, now }, selected] = await Promise.all([
    getInquiries(view, requestedPage),
    selectedId ? getInquiry(selectedId) : null,
  ]);

  return (
    <InquiriesView
      view={view}
      page={page}
      pages={pages}
      counts={counts}
      inquiries={inquiries}
      selected={selected}
      now={now}
    />
  );
}
