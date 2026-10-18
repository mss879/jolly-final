"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteChat, markChatHandled, pollChat, replyToChat, setChatMode } from "@/lib/admin/actions/chats";
import { formatDateTime, relativeTime } from "@/lib/admin/format";
import {
  ONLINE_WINDOW_MS,
  visitorLabel,
  type ActionResult,
  type AdminChatMessage,
  type ChatDetail,
  type ChatUpdate,
} from "@/lib/admin/types";
import type { ChatBlock } from "@/lib/chat/types";
import ChatBlockView from "@/components/chat/ChatBlocks";
import RichText from "@/components/chat/RichText";
import { ConfirmDialog } from "./Dialog";
import Icon from "./icons";
import { Badge, ContactLinks, btnGhost, btnPrimary, btnSecondary } from "./ui";

/* One conversation in /admin/chats: the transcript as the visitor saw it
   (cards included), kept live by checking every few seconds, with the
   controls to take over from the AI, reply, and hand back. */

const POLL_MS = 4000;
const noop = () => {};

const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "numeric", minute: "2-digit", hour12: true });

function AdminBlock({ block }: { block: ChatBlock }) {
  if (block.type === "choices") {
    return <p className="text-[0.75rem] text-ink-500">Quick replies offered: {block.options.join(" · ")}</p>;
  }
  return <ChatBlockView block={block} interactive={false} onSend={noop} onEdit={noop} />;
}

function Message({ m }: { m: AdminChatMessage }) {
  const time = timeFmt.format(new Date(m.createdAt));
  if (m.role === "system") {
    return (
      <p className="flex items-center gap-3 text-[0.72rem] text-ink-500">
        <span aria-hidden className="h-px flex-1 bg-gold-200" />
        <span className="text-center">
          {m.content} <span className="text-ink-500/70">· {time}</span>
        </span>
        <span aria-hidden className="h-px flex-1 bg-gold-200" />
      </p>
    );
  }

  const visitor = m.role === "user";
  const team = m.role === "agent";
  const label = visitor ? "Visitor" : team ? `Team · ${m.author ?? "A team member"}` : "AI concierge";
  return (
    <div className={`flex flex-col gap-1.5 ${visitor ? "items-start" : "items-end"}`}>
      <p className="text-[0.66rem] font-semibold tracking-[0.1em] text-ink-500 uppercase">
        {label} <span className="font-normal tracking-normal normal-case">· {time}</span>
      </p>
      {m.content && (
        <div
          className={`max-w-[85%] rounded-card px-3.5 py-2.5 text-[0.88rem] leading-relaxed ${
            visitor
              ? "rounded-tl-[0.3rem] bg-cream-200 text-ink-900"
              : team
                ? "rounded-tr-[0.3rem] bg-plum-900 text-cream-100"
                : "rounded-tr-[0.3rem] border border-plum-200 bg-plum-100/70 text-ink-900"
          }`}
        >
          {m.role === "assistant" ? <RichText text={m.content} /> : <p className="break-words whitespace-pre-wrap">{m.content}</p>}
        </div>
      )}
      {m.blocks.length > 0 && (
        <div className="w-full max-w-[24rem] space-y-2">
          {m.blocks.map((block, i) => (
            <AdminBlock key={`${block.type}-${i}`} block={block} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatThread({ initial, listHref }: { initial: ChatUpdate; listHref: string }) {
  const router = useRouter();
  const [chat, setChat] = useState<ChatDetail>(initial.chat);
  const [messages, setMessages] = useState<AdminChatMessage[]>(initial.messages);
  const [now, setNow] = useState(() => Date.now());
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const lastId = useRef(initial.messages.at(-1)?.id ?? 0);
  const listRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const result = await pollChat(chat.id, lastId.current);
    if (!result.ok || !result.data) return;
    const { chat: latest, messages: incoming } = result.data;
    const fresh = incoming.filter((m) => m.id > lastId.current);
    setChat(latest);
    setNow(Date.now());
    if (fresh.length) {
      lastId.current = fresh[fresh.length - 1].id;
      setMessages((current) => [...current, ...fresh]);
    }
  }, [chat.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) refresh().catch(() => {});
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  function run(action: () => Promise<ActionResult>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      after?.();
      await refresh();
    });
  }

  function send(e?: FormEvent) {
    e?.preventDefault();
    const text = reply.trim();
    if (!text || pending) return;
    run(() => replyToChat(chat.id, text), () => setReply(""));
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  const human = chat.mode === "human";
  const online = now - Date.parse(chat.visitorSeenAt) < ONLINE_WINDOW_MS;

  return (
    <section className="flex flex-col border border-gold-200/70 bg-cream-50 lg:h-[calc(100dvh-13rem)] lg:min-h-[36rem]">
      {/* Who, and what came of it */}
      <header className="border-b border-gold-200/60 px-5 py-4">
        <Link href={listHref} className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-plum-900 lg:hidden">
          <Icon name="back" /> All chats
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold text-plum-900">{visitorLabel(chat)}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.78rem] text-ink-500">
              {online ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-500" /> Online now
                </span>
              ) : (
                <span>Last seen {relativeTime(chat.visitorSeenAt, now)}</span>
              )}
              <span aria-hidden>·</span>
              <span>Started {formatDateTime(chat.createdAt)}</span>
              {chat.device && (
                <>
                  <span aria-hidden>·</span>
                  <span className="capitalize">{chat.device}</span>
                </>
              )}
              {chat.lastPage && (
                <>
                  <span aria-hidden>·</span>
                  <span className="break-all">on {chat.lastPage === "/" ? "Home" : chat.lastPage}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {chat.attention && <Badge tone="warning">Needs you</Badge>}
            <Badge tone={human ? "info" : "neutral"}>{human ? "Team in charge" : "AI answering"}</Badge>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              title="Delete chat"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-btn text-ink-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <Icon name="trash" />
              <span className="sr-only">Delete chat</span>
            </button>
          </div>
        </div>

        {(chat.visitorPhone || chat.visitorEmail) && (
          <div className="mt-3">
            <ContactLinks phone={chat.visitorPhone} email={chat.visitorEmail} />
          </div>
        )}

        {chat.attention && chat.handoverReason && (
          <p className="mt-3 rounded-btn bg-amber-50 px-3 py-2 text-[0.8rem] text-amber-900 ring-1 ring-amber-200 ring-inset">
            {chat.handoverReason}
          </p>
        )}

        {(chat.bookingId || chat.leadId) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chat.bookingId && (
              <Link href={`/admin/bookings/${chat.bookingId}`} className={btnSecondary}>
                <Icon name="bookings" /> Open the booking
              </Link>
            )}
            {chat.leadId && (
              <Link href={`/admin/crm?lead=${chat.leadId}`} className={btnSecondary}>
                <Icon name="board" /> Open in CRM
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Transcript */}
      <div ref={listRef} role="log" aria-label="Conversation" className="max-h-[60vh] min-h-[18rem] flex-1 space-y-5 overflow-y-auto px-5 py-5 lg:max-h-none">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-ink-500">No messages yet.</p>
        ) : (
          messages.map((m) => <Message key={m.id} m={m} />)
        )}
      </div>

      {/* Take over, reply, hand back */}
      <footer className="border-t border-gold-200/60 px-5 py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.8rem] text-ink-700">
            {human ? (
              <>
                <strong className="font-semibold text-plum-900">You&apos;re in charge.</strong> The AI is paused for this visitor.
              </>
            ) : (
              <>
                <strong className="font-semibold text-plum-900">The AI is answering.</strong> Replying takes over from it.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {chat.attention && (
              <button type="button" disabled={pending} onClick={() => run(() => markChatHandled(chat.id))} className={btnGhost}>
                <Icon name="check" /> Mark as handled
              </button>
            )}
            {human ? (
              <button type="button" disabled={pending} onClick={() => run(() => setChatMode(chat.id, "ai"))} className={btnSecondary}>
                <Icon name="sparkle" /> Hand back to the AI
              </button>
            ) : (
              <button type="button" disabled={pending} onClick={() => run(() => setChatMode(chat.id, "human"))} className={btnSecondary}>
                <Icon name="person" /> Take over
              </button>
            )}
          </div>
        </div>

        <form onSubmit={send} className="flex items-end gap-2">
          <label htmlFor="chat-reply" className="sr-only">
            Reply to {visitorLabel(chat)}
          </label>
          <textarea
            id="chat-reply"
            rows={2}
            maxLength={4000}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={human ? "Write a reply… (Enter sends, Shift + Enter for a new line)" : "Write a reply… (this pauses the AI)"}
            className="min-h-[2.75rem] flex-1 resize-y rounded-btn border border-gold-200 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-500/60 focus:border-gold-400 focus:ring-2 focus:ring-gold-300/40"
          />
          <button type="submit" disabled={pending || !reply.trim()} className={btnPrimary}>
            <Icon name="send" /> Send
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-3 text-sm text-rose-700">
            {error}
          </p>
        )}
      </footer>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() =>
          run(
            () => deleteChat(chat.id),
            () => {
              setConfirming(false);
              router.replace(listHref);
            },
          )
        }
        title="Delete this chat?"
        description={
          chat.bookingId || chat.leadId
            ? "The conversation is removed for good. Its booking and CRM lead stay."
            : "The conversation is removed for good."
        }
        confirmLabel="Delete chat"
        pending={pending}
        error={confirming ? error : null}
        danger
      />
    </section>
  );
}
