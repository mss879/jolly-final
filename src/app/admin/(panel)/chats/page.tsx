import type { Metadata } from "next";
import ChatsView from "@/components/admin/ChatsView";
import { getChat, getChats, type ChatView } from "@/lib/admin/queries";
import { isUuid } from "@/lib/admin/validate";

export const metadata: Metadata = { title: "Chats" };

type SearchParams = Promise<{ view?: string; page?: string; id?: string }>;

const VIEWS: ChatView[] = ["all", "attention", "human"];

export default async function ChatsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const view = VIEWS.find((v) => v === params.view) ?? "all";
  const requestedPage = Math.max(1, Math.floor(Number(params.page)) || 1);
  const selectedId = isUuid(params.id) ? params.id : null;

  const [{ chats, page, pages, counts, now }, selected] = await Promise.all([
    getChats(view, requestedPage),
    selectedId ? getChat(selectedId) : null,
  ]);

  return <ChatsView view={view} page={page} pages={pages} counts={counts} chats={chats} selected={selected} now={now} />;
}
