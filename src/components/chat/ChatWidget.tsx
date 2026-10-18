"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { readChat, sessionValue } from "./storage";

/* The chat launcher: a round button with the Jolly's logo at the bottom
   right. It stays out of the way while the page's opening section (the
   home hero) fills the screen, and glides in with a soft pulse as soon as
   the visitor starts scrolling past it.
   After a while on the site, a "need a hand?" bubble springs out of it, once
   per visit. The chat window itself (ChatPanel) only loads when needed.
   Rendered in the browser only (ChatLauncher), so it can read the
   visitor's saved conversation straight away. */

const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });
const preloadPanel = () => void import("./ChatPanel");

const NUDGE_AFTER_MS = 30_000; // time on the site, across pages, before the bubble
const NUDGE_FOR_MS = 20_000;
const ARRIVED = "jolly-chat-arrived";
const NUDGED = "jolly-chat-nudged";

type Nudge = "waiting" | "due" | "showing" | "done";

/* The page's first section: the hero on Home, the title block elsewhere. */
function firstSection() {
  const main = document.querySelector("main");
  return main ? (Array.from(main.children).find((el) => el.tagName !== "SCRIPT") as HTMLElement | undefined) : undefined;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  // A conversation the team has joined keeps listening for their replies.
  const [loaded, setLoaded] = useState(() => readChat()?.mode === "human");
  const [armed, setArmed] = useState(loaded); // the launcher has been needed at least once
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  // The bubble is for first-timers: not once dismissed this visit, nor after a chat.
  const [nudge, setNudge] = useState<Nudge>(() => (sessionValue(NUDGED) || readChat() ? "done" : "waiting"));

  // Hidden while the first section fills the screen; shown as soon as the
  // visitor starts scrolling past it.
  useEffect(() => {
    let limit = 0;
    let frame = 0;
    const measure = () => {
      limit = Math.max(120, (firstSection()?.offsetHeight ?? 600) * 0.2);
    };
    const check = () => {
      frame = 0;
      setPast(window.scrollY > limit);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // The bubble is due after a while on the site, counted across pages.
  useEffect(() => {
    if (nudge !== "waiting") return;
    const arrived = Number(sessionValue(ARRIVED)) || Number(sessionValue(ARRIVED, String(Date.now())));
    const timer = setTimeout(() => setNudge((n) => (n === "waiting" ? "due" : n)), Math.max(0, arrived + NUDGE_AFTER_MS - Date.now()));
    return () => clearTimeout(timer);
  }, [nudge]);

  const visible = past || open || unread > 0;
  // Mounted the first time it's needed, then kept for its exit animation.
  if (visible && !armed) setArmed(true);

  // It appears the next time the launcher is on screen, then leaves on its own.
  if (nudge === "due" && past && !open) setNudge("showing");
  useEffect(() => {
    if (nudge !== "showing") return;
    sessionValue(NUDGED, "1");
    const timer = setTimeout(() => setNudge("done"), NUDGE_FOR_MS);
    return () => clearTimeout(timer);
  }, [nudge]);

  const openChat = useCallback(() => {
    setLoaded(true);
    setOpen(true);
    setNudge("done");
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  if (!armed && !loaded) return null;

  return (
    <>
      {loaded && <ChatPanel open={open} onClose={closeChat} onUnread={setUnread} />}

      <div
        className={`fixed right-4 bottom-4 z-30 transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:right-6 sm:bottom-6 ${
          visible ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-5 scale-75 opacity-0"
        } ${open ? "max-sm:invisible max-sm:opacity-0" : ""}`}
      >
        {/* "Need a hand?": sits right above the launcher, its tail pointing at the logo */}
        {nudge === "showing" && visible && !open && (
          <div className="chat-bubble-in absolute right-0 bottom-[calc(100%+0.9rem)] w-[min(17.5rem,calc(100vw-2rem))]">
            <button
              type="button"
              onClick={openChat}
              className="chat-shine relative block w-full overflow-hidden rounded-card border border-gold-300 bg-cream-50 py-3.5 pr-9 pl-4 text-left shadow-[0_18px_40px_-18px_rgba(50,0,75,0.45)] transition-colors hover:border-plum-900"
            >
              <span className="flex items-center gap-1.5 text-[0.58rem] font-semibold tracking-[0.2em] text-gold-700 uppercase">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Jolly&apos;s Concierge
              </span>
              <span className="mt-1.5 block font-display text-[1.08rem] leading-snug font-semibold text-plum-900">
                Hi there 😊 Need a hand?
              </span>
              <span className="mt-1 block text-[0.8rem] leading-snug text-ink-700">
                Ask me anything, from flavours and cart colours to checking your date.
              </span>
            </button>
            <span
              aria-hidden
              className="absolute right-[1.625rem] -bottom-[0.4rem] h-3 w-3 rotate-45 border-r border-b border-gold-300 bg-cream-50"
            />
            <button
              type="button"
              onClick={() => setNudge("done")}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-cream-200 hover:text-plum-900"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => (open ? closeChat() : openChat())}
          onPointerEnter={preloadPanel}
          onFocus={preloadPanel}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-plum-900 shadow-[0_14px_34px_-12px_rgba(50,0,75,0.55)] transition-[transform,background-color] duration-300 hover:scale-[1.06] active:scale-95 ${
            open ? "bg-plum-900" : "chat-pulse bg-cream-50"
          }`}
        >
          <Image
            src="/images/brand/logo.png"
            alt=""
            width={30}
            height={42}
            className={`h-[2.6rem] w-auto transition-[opacity,transform] duration-300 ${open ? "scale-50 opacity-0" : "opacity-100"}`}
          />
          <svg
            viewBox="0 0 24 24"
            className={`absolute h-6 w-6 text-cream-100 transition-[opacity,transform] duration-300 ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span className="sr-only">{open ? "Close the chat" : "Chat with Jolly's"}</span>
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[0.66rem] font-bold text-plum-950 ring-2 ring-cream-50">
              {unread}
              <span className="sr-only"> new {unread === 1 ? "message" : "messages"}</span>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
