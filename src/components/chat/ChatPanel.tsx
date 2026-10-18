"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import { CONTACT } from "@/lib/data";
import { CHAT_MAX_LENGTH, type ChatFeed, type ChatMessage, type ChatMode } from "@/lib/chat/types";
import { WhatsAppGlyph } from "@/components/SocialLinks";
import ChatBlockView from "./ChatBlocks";
import RichText from "./RichText";
import { deviceType, newChatId, readChat, writeChat } from "./storage";

/* The chat window. Loaded only once the visitor first opens the chat (or
   when a team member is talking to them), then kept mounted so the
   conversation survives closing and reopening.

   Messages go to /api/chat, which saves them and answers with the AI
   concierge. While the window is open it also checks for new messages every
   few seconds, which is how a team member's replies arrive after they take
   over from /admin/chats. On a phone it fills the screen; from 640px up it
   is a panel above the launcher. */

const STARTERS = ["Reserve a cart for my event", "Show me the flavours", "What cart colours are there?", "Talk to the team"];

type Props = {
  open: boolean;
  onClose: () => void;
  onUnread: (count: number) => void;
};

function Avatar({ team = false }: { team?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-50 ring-1 ${team ? "ring-gold-500" : "ring-plum-900/25"}`}
    >
      <Image src="/images/brand/logo.png" alt="" width={14} height={20} className="h-[1.1rem] w-auto" />
    </span>
  );
}

const bubbleText = "text-[0.88rem] leading-relaxed sm:text-[0.86rem]";

export default function ChatPanel({ open, onClose, onUnread }: Props) {
  // The conversation this browser already had, if any.
  const [saved] = useState(readChat);
  const [session, setSession] = useState<string | null>(saved?.id ?? null);
  const [mode, setMode] = useState<ChatMode>(saved?.mode ?? "ai");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const lastId = useRef(0);
  const unread = useRef(0);
  const openRef = useRef(open);
  const sendingRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrolledTo = useRef(0);

  /* Adds messages from the server, skipping any already shown. While the
     window is closed, replies from the team count as unread. */
  const merge = useCallback(
    (incoming: ChatMessage[]) => {
      const fresh = incoming.filter((m) => m.id > lastId.current);
      if (!fresh.length) return;
      lastId.current = Math.max(...fresh.map((m) => m.id));
      setMessages((current) => {
        const seen = new Set(current.map((m) => m.id));
        return [...current, ...fresh.filter((m) => !seen.has(m.id))].sort((a, b) => a.id - b.id);
      });
      if (!openRef.current) {
        const replies = fresh.filter((m) => m.role === "agent").length;
        if (replies) {
          unread.current += replies;
          onUnread(unread.current);
        }
      }
    },
    [onUnread],
  );

  const applyMode = useCallback((next: ChatMode, id: string) => {
    setMode(next);
    writeChat({ id, mode: next });
  }, []);

  const fetchFeed = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/chat?after=${lastId.current}`, { cache: "no-store", headers: { "X-Chat-Session": id } });
        if (!res.ok) return;
        const data = (await res.json()) as ChatFeed;
        // a send may have started while this was in the air; it brings its own copy
        if (sendingRef.current) return;
        merge(data.messages);
        applyMode(data.mode, id);
      } catch {
        // offline for a moment: the next check catches up
      }
    },
    [merge, applyMode],
  );

  // Pick up where it left off.
  useEffect(() => {
    if (saved) fetchFeed(saved.id);
  }, [saved, fetchFeed]);

  // Check for new messages: often while a person is chatting, now and then
  // otherwise, and only in the background when a person has taken over.
  useEffect(() => {
    if (!session) return;
    const every = open ? (mode === "human" ? 3000 : 5000) : mode === "human" ? 12000 : 0;
    if (!every) return;
    const timer = setInterval(() => {
      if (!document.hidden && !sendingRef.current) fetchFeed(session);
    }, every);
    return () => clearInterval(timer);
  }, [session, open, mode, fetchFeed]);

  useEffect(() => {
    openRef.current = open;
    if (!open) return;
    unread.current = 0;
    onUnread(0);
    if (session) fetchFeed(session);
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
    // A keyboard popping up on a phone isn't wanted; on a computer, start typing straight away.
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
    // Full-screen on a phone: the page behind stays put.
    if (window.matchMedia("(max-width: 639px)").matches) {
      const html = document.documentElement;
      const before = html.style.overflow;
      html.style.overflow = "hidden";
      return () => {
        html.style.overflow = before;
      };
    }
  }, [open, session, onUnread, fetchFeed]);

  /* Follow the conversation. A long reply is shown from its start rather
     than its end, so it reads top-down. */
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (pending !== null || sending) {
      list.scrollTop = list.scrollHeight;
      return;
    }
    const last = messages[messages.length - 1];
    if (!last || last.id === scrolledTo.current) return;
    scrolledTo.current = last.id;
    const el = list.querySelector<HTMLElement>(`[data-id="${last.id}"]`);
    if (el && last.role !== "user" && el.offsetHeight > list.clientHeight * 0.75) {
      list.scrollTop = el.offsetTop - 12;
    } else {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages, pending, sending]);

  // The text box grows with what's typed, up to a few lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  async function send(raw: string) {
    const text = raw.trim().slice(0, CHAT_MAX_LENGTH);
    if (!text || sendingRef.current) return;
    let id = session;
    if (!id) {
      id = newChatId();
      setSession(id);
      writeChat({ id, mode: "ai" });
    }

    sendingRef.current = true;
    setSending(true);
    setPending(text);
    setError(null);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: id, message: text, page: window.location.pathname, device: deviceType() }),
      });
      const data = (await res.json().catch(() => null)) as (ChatFeed & { error?: string }) | null;
      if (!res.ok || !data) {
        setError(data?.error ?? "That didn't send. Please try again.");
        setInput(text);
        return;
      }
      merge(data.messages);
      applyMode(data.mode, id);
    } catch {
      setError("You seem to be offline. Check your connection and try again.");
      setInput(text);
    } finally {
      sendingRef.current = false;
      setSending(false);
      setPending(null);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  }

  function editBooking() {
    setInput("I'd like to change ");
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  function startOver() {
    writeChat(null);
    setSession(null);
    setMessages([]);
    setMode("ai");
    setError(null);
    lastId.current = 0;
    scrolledTo.current = 0;
  }

  const human = mode === "human";
  const latest = messages[messages.length - 1];

  return (
    <section
      role="dialog"
      aria-label="Chat with Jolly's"
      aria-hidden={!open}
      inert={!open}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      className={`fixed inset-0 z-[70] flex flex-col overflow-hidden bg-cream-100 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:inset-auto sm:right-6 sm:bottom-[6.5rem] sm:h-[min(40rem,calc(100dvh-8.5rem))] sm:w-[24.5rem] sm:origin-bottom-right sm:rounded-card sm:border sm:border-gold-200 sm:shadow-[0_30px_80px_-30px_rgba(50,0,75,0.5)] ${
        open ? "visible translate-y-0 opacity-100 sm:scale-100" : "invisible translate-y-6 opacity-0 sm:translate-y-3 sm:scale-95"
      }`}
    >
      {/* Header */}
      <header className="flex items-center gap-3 bg-plum-900 px-4 pt-[max(0.8rem,env(safe-area-inset-top))] pb-3 text-cream-100">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-50 ring-2 ring-gold-400/70">
          <Image src="/images/brand/logo.png" alt="" width={20} height={28} className="h-7 w-auto" />
          <span aria-hidden className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-plum-900 bg-emerald-400" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.05rem] leading-tight font-semibold">{human ? "Jolly's team" : "Jolly's Concierge"}</p>
          <p className="mt-0.5 truncate text-[0.7rem] text-cream-100/70">
            {human ? "A team member is with you" : "AI concierge · replies in seconds"}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={startOver}
              title="Start a new chat"
              className="flex h-9 w-9 items-center justify-center rounded-full text-cream-100/75 transition-colors hover:bg-plum-800 hover:text-cream-100"
            >
              <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
              </svg>
              <span className="sr-only">Start a new chat</span>
            </button>
          )}
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp us"
            className="flex h-9 w-9 items-center justify-center rounded-full text-cream-100/75 transition-colors hover:bg-plum-800 hover:text-cream-100"
          >
            <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="currentColor" aria-hidden>
              <WhatsAppGlyph />
            </svg>
            <span className="sr-only">WhatsApp us</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-cream-100/75 transition-colors hover:bg-plum-800 hover:text-cream-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
            <span className="sr-only">Close the chat</span>
          </button>
        </div>
      </header>

      {/* Conversation */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="relative flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
      >
        {/* The greeting is always first; the suggestions only until the first message. */}
        <div className="flex gap-2.5">
          <Avatar />
          <div className="min-w-0 flex-1">
            <div className={`w-fit max-w-full rounded-[1rem] rounded-tl-[0.3rem] border border-gold-200/80 bg-cream-50 px-3.5 py-2.5 text-ink-900 ${bubbleText}`}>
              <p>
                Hello 😊 I&apos;m Jolly&apos;s concierge. Ask me anything, from flavours and cart colours to checking your date and
                reserving a cart for your event.
              </p>
            </div>
            {messages.length === 0 && pending === null && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-btn border border-gold-300 bg-cream-50 px-3 py-1.5 text-[0.76rem] font-medium text-plum-900 transition-colors hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {messages.map((m) => {
          if (m.role === "system") {
            return (
              <p key={m.id} data-id={m.id} className="chat-msg-in flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.04em] text-ink-500">
                <span aria-hidden className="h-px flex-1 bg-gold-200" />
                <span className="max-w-[80%] text-center">{m.content}</span>
                <span aria-hidden className="h-px flex-1 bg-gold-200" />
              </p>
            );
          }
          if (m.role === "user") {
            return (
              <div key={m.id} data-id={m.id} className="chat-msg-in flex justify-end">
                <p className={`max-w-[85%] rounded-[1rem] rounded-br-[0.3rem] bg-plum-900 px-3.5 py-2.5 break-words whitespace-pre-wrap text-cream-100 ${bubbleText}`}>
                  {m.content}
                </p>
              </div>
            );
          }
          const team = m.role === "agent";
          // Cards answer only in the latest reply, and not while a person is in charge.
          const interactive = m === latest && m.role === "assistant" && !human && !sending;
          return (
            <div key={m.id} data-id={m.id} className="chat-msg-in flex gap-2.5">
              <Avatar team={team} />
              <div className="min-w-0 flex-1 space-y-2">
                {team && <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-gold-700 uppercase">Jolly&apos;s team</p>}
                {m.content && (
                  <div
                    className={`w-fit max-w-full rounded-[1rem] rounded-tl-[0.3rem] border px-3.5 py-2.5 text-ink-900 ${bubbleText} ${
                      team ? "border-gold-400/70 bg-gold-200/30" : "border-gold-200/80 bg-cream-50"
                    }`}
                  >
                    <RichText text={m.content} />
                  </div>
                )}
                {m.blocks.map((block, i) => (
                  <ChatBlockView key={`${block.type}-${i}`} block={block} interactive={interactive} onSend={send} onEdit={editBooking} />
                ))}
              </div>
            </div>
          );
        })}

        {pending !== null && (
          <div className="chat-msg-in flex justify-end">
            <p className={`max-w-[85%] rounded-[1rem] rounded-br-[0.3rem] bg-plum-900/85 px-3.5 py-2.5 break-words whitespace-pre-wrap text-cream-100 ${bubbleText}`}>
              {pending}
            </p>
          </div>
        )}

        {sending && !human && (
          <div className="chat-msg-in flex items-center gap-2.5" aria-label="Jolly's concierge is typing">
            <Avatar />
            <span className="flex gap-1 rounded-[1rem] rounded-tl-[0.3rem] border border-gold-200/80 bg-cream-50 px-3.5 py-3.5">
              <span className="chat-dot h-1.5 w-1.5 rounded-full bg-plum-700" />
              <span className="chat-dot h-1.5 w-1.5 rounded-full bg-plum-700" />
              <span className="chat-dot h-1.5 w-1.5 rounded-full bg-plum-700" />
            </span>
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="border-t border-gold-200/70 bg-cream-50 px-3 pt-3 pb-[max(0.7rem,env(safe-area-inset-bottom))]">
        {error && (
          <p role="alert" className="mb-2 px-1 text-[0.76rem] text-rose-700">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2 rounded-card border border-gold-200 bg-white/80 py-1.5 pr-1.5 pl-3.5 transition-shadow focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-300/40">
          <label htmlFor="chat-input" className="sr-only">
            Your message
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={CHAT_MAX_LENGTH}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={human ? "Write to the team…" : "Ask me anything…"}
            className="max-h-28 min-h-[2.25rem] flex-1 resize-none bg-transparent py-1.5 text-base leading-snug text-ink-900 outline-none placeholder:text-ink-500/70 sm:text-[0.88rem]"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-900 text-cream-100 transition-colors hover:bg-plum-800 disabled:opacity-35"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
            <span className="sr-only">Send</span>
          </button>
        </div>
        <a
          href="https://www.arcai.agency"
          target="_blank"
          rel="noopener"
          className="group mx-auto mt-1.5 flex w-fit items-center gap-1 text-[0.56rem] leading-none text-ink-500/60 transition-colors hover:text-ink-500"
        >
          Powered by
          <Image
            src="/images/brand/arc-ai-logo-dark.png"
            alt="Arc AI"
            width={39}
            height={9}
            className="h-[9px] w-auto opacity-50 grayscale transition-[opacity,filter] group-hover:opacity-100 group-hover:grayscale-0"
          />
        </a>
      </form>
    </section>
  );
}
