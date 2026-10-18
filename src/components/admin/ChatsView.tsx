import Link from "next/link";
import { relativeTime } from "@/lib/admin/format";
import type { ChatView } from "@/lib/admin/queries";
import { ONLINE_WINDOW_MS, visitorLabel, type ChatSummary, type ChatUpdate } from "@/lib/admin/types";
import AutoRefresh from "./AutoRefresh";
import ChatThread from "./ChatThread";
import { Badge, Card, EmptyState, PageHeader, Pagination, Tabs } from "./ui";

type Props = {
  view: ChatView;
  page: number;
  pages: number;
  counts: Record<ChatView, number>;
  chats: ChatSummary[];
  selected: ChatUpdate | null;
  now: number;
};

function href(params: { view: ChatView; page?: number; id?: string }) {
  const q = new URLSearchParams();
  if (params.view !== "all") q.set("view", params.view);
  if (params.page && params.page > 1) q.set("page", String(params.page));
  if (params.id) q.set("id", params.id);
  const s = q.toString();
  return `/admin/chats${s ? `?${s}` : ""}`;
}

const PREVIEW_PREFIX = { user: "", assistant: "AI: ", agent: "Team: " } as const;

export default function ChatsView({ view, page, pages, counts, chats, selected, now }: Props) {
  const listHref = href({ view, page });

  return (
    <>
      <PageHeader
        title="Chats"
        description="Every conversation with the AI concierge on the website. Take over any chat to reply yourself."
      />
      <Tabs
        label="Chat folders"
        items={[
          { href: href({ view: "all" }), label: "All", count: counts.all, active: view === "all" },
          { href: href({ view: "attention" }), label: "Needs you", count: counts.attention, active: view === "attention" },
          { href: href({ view: "human" }), label: "Team in charge", count: counts.human, active: view === "human" },
        ]}
      />
      {/* New conversations and messages appear without reloading. */}
      <AutoRefresh every={15_000} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card className={selected ? "hidden lg:block" : ""} bodyClassName="">
          {chats.length === 0 ? (
            <EmptyState title={view === "all" ? "No chats yet" : view === "attention" ? "Nothing needs you" : "No chats with the team"}>
              {view === "all"
                ? "Conversations from the chat on the website will appear here."
                : view === "attention"
                  ? "Chats where a visitor asks for a person, or writes while the team is in charge, land here."
                  : "Chats you've taken over from the AI appear here."}
            </EmptyState>
          ) : (
            <ul className="divide-y divide-gold-200/60">
              {chats.map((chat) => {
                const active = selected?.chat.id === chat.id;
                const online = now - Date.parse(chat.visitorSeenAt) < ONLINE_WINDOW_MS;
                return (
                  <li key={chat.id}>
                    <Link
                      href={href({ view, page, id: chat.id })}
                      aria-current={active ? "true" : undefined}
                      className={`block px-5 py-3.5 transition-colors ${active ? "bg-cream-200/80" : "hover:bg-cream-200/40"}`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={`flex min-w-0 items-center gap-2 text-sm ${chat.attention ? "font-semibold text-plum-900" : "text-ink-900"}`}>
                          {online && (
                            <span title="Online now" className="h-2 w-2 shrink-0 rounded-full bg-emerald-500">
                              <span className="sr-only">Online now: </span>
                            </span>
                          )}
                          <span className="truncate">{visitorLabel(chat)}</span>
                        </span>
                        <time dateTime={chat.lastMessageAt} className="shrink-0 text-[0.72rem] text-ink-500">
                          {relativeTime(chat.lastMessageAt, now)}
                        </time>
                      </div>
                      {chat.preview && (
                        <p className="mt-1 line-clamp-2 text-[0.8rem] leading-snug text-ink-500">
                          {chat.lastRole ? PREVIEW_PREFIX[chat.lastRole] : ""}
                          {chat.preview}
                        </p>
                      )}
                      {(chat.attention || chat.mode === "human" || chat.hasBooking || chat.hasLead) && (
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {chat.attention && <Badge tone="warning">Needs you</Badge>}
                          {chat.mode === "human" && <Badge tone="info">Team in charge</Badge>}
                          {chat.hasBooking && <Badge tone="good">Booking sent</Badge>}
                          {chat.hasLead && <Badge tone="neutral">In CRM</Badge>}
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

        {selected ? (
          <ChatThread key={selected.chat.id} initial={selected} listHref={listHref} />
        ) : (
          <Card className="hidden lg:block">
            <EmptyState title="Pick a chat">
              Choose a conversation on the left to read it, take over from the AI, or reply.
            </EmptyState>
          </Card>
        )}
      </div>
    </>
  );
}
