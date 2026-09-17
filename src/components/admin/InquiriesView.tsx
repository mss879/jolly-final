import Link from "next/link";
import { formatDateTime, relativeTime } from "@/lib/admin/format";
import type { InquirySummary } from "@/lib/admin/types";
import Icon from "./icons";
import InquiryActions from "./InquiryActions";
import { Badge, Card, ContactLinks, EmptyState, PageHeader, Pagination, Tabs } from "./ui";

type Props = {
  view: "inbox" | "archived";
  page: number;
  pages: number;
  counts: { inbox: number; archived: number };
  inquiries: InquirySummary[];
  selected: InquirySummary | null;
  now: number;
};

function href(params: { view: Props["view"]; page?: number; id?: string }) {
  const q = new URLSearchParams();
  if (params.view === "archived") q.set("view", "archived");
  if (params.page && params.page > 1) q.set("page", String(params.page));
  if (params.id) q.set("id", params.id);
  const s = q.toString();
  return `/admin/inquiries${s ? `?${s}` : ""}`;
}

export default function InquiriesView({ view, page, pages, counts, inquiries, selected, now }: Props) {
  const listHref = href({ view, page });

  return (
    <>
      <PageHeader title="Inquiries" description="Messages from the contact form. Move the promising ones into the CRM." />
      <Tabs
        label="Inquiry folders"
        items={[
          { href: href({ view: "inbox" }), label: "Inbox", count: counts.inbox, active: view === "inbox" },
          { href: href({ view: "archived" }), label: "Archived", count: counts.archived, active: view === "archived" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* List — hidden on small screens while a message is open */}
        <Card className={selected ? "hidden lg:block" : ""} bodyClassName="">
          {inquiries.length === 0 ? (
            <EmptyState title={view === "archived" ? "Nothing archived" : "No inquiries yet"}>
              {view === "archived"
                ? "Archived messages will wait here."
                : "Messages sent from the contact page will appear here."}
            </EmptyState>
          ) : (
            <ul className="divide-y divide-gold-200/60">
              {inquiries.map((inquiry) => {
                const active = selected?.id === inquiry.id;
                const unread = inquiry.status === "new";
                return (
                  <li key={inquiry.id}>
                    <Link
                      href={href({ view, page, id: inquiry.id })}
                      aria-current={active ? "true" : undefined}
                      className={`block px-5 py-3.5 transition-colors ${
                        active ? "bg-cream-200/80" : "hover:bg-cream-200/40"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span
                          className={`flex min-w-0 items-center gap-2 text-sm ${
                            unread ? "font-semibold text-plum-900" : "text-ink-900"
                          }`}
                        >
                          {unread && (
                            <>
                              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-plum-700" />
                              <span className="sr-only">New: </span>
                            </>
                          )}
                          <span className="truncate">{inquiry.name}</span>
                        </span>
                        <time dateTime={inquiry.createdAt} className="shrink-0 text-[0.72rem] text-ink-500">
                          {relativeTime(inquiry.createdAt, now)}
                        </time>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[0.8rem] leading-snug text-ink-500">{inquiry.message}</p>
                      {inquiry.leadId && (
                        <span className="mt-2 inline-block">
                          <Badge tone="info">In CRM</Badge>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <Pagination page={page} pages={pages} hrefFor={(p) => href({ view, page: p })} />
        </Card>

        {/* Detail */}
        {selected ? (
          <Card bodyClassName="p-6">
            <Link href={listHref} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-plum-900 lg:hidden">
              <Icon name="back" /> All inquiries
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-plum-900">{selected.name}</h2>
                <p className="mt-1 text-[0.8rem] text-ink-500">Received {formatDateTime(selected.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                {selected.status === "archived" && <Badge tone="neutral">Archived</Badge>}
                {selected.leadId && <Badge tone="info">In CRM</Badge>}
              </div>
            </div>
            <div className="mt-5">
              <ContactLinks phone={selected.phone} email={selected.email} />
            </div>
            <p className="mt-6 border-t border-gold-200/60 pt-6 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-ink-900">
              {selected.message}
            </p>
            <div className="mt-8 border-t border-gold-200/60 pt-5">
              <InquiryActions inquiry={selected} listHref={listHref} />
            </div>
          </Card>
        ) : (
          <Card className="hidden lg:block">
            <EmptyState title="Pick a message">Choose an inquiry on the left to read it and decide what&apos;s next.</EmptyState>
          </Card>
        )}
      </div>
    </>
  );
}
