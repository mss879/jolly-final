"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PublicEvent } from "@/lib/recent-events";
import Reveal from "./Reveal";

/* Recent events on the Reviews page: a card per event (cover photo, what,
   when, where) that opens a photo viewer with the write-up. */

function formatDate(day: string | null) {
  if (!day) return null;
  const d = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function meta(e: PublicEvent) {
  return [e.eventType, formatDate(e.eventDate), e.location].filter(Boolean).join(" · ");
}

function Viewer({ event, onClose }: { event: PublicEvent; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const n = event.photos.length;
  const go = useCallback((step: number) => setI((v) => (v + step + n) % n), [n]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    d.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={event.title}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      onKeyDown={(e) => {
        if (n > 1 && e.key === "ArrowRight") go(1);
        if (n > 1 && e.key === "ArrowLeft") go(-1);
      }}
      className="m-auto w-[min(64rem,calc(100vw-2rem))] overflow-hidden rounded-card bg-cream-50 p-0 shadow-soft backdrop:bg-plum-950/70 backdrop:backdrop-blur-sm"
    >
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-[4/3] bg-plum-950">
          {n > 0 && (
            <Image
              key={event.photos[i]}
              src={event.photos[i]}
              alt={`${event.title}, photo ${i + 1} of ${n}`}
              fill
              sizes="(min-width: 1024px) 38rem, 100vw"
              className="object-contain"
            />
          )}
          {n > 1 && (
            <>
              {[
                { step: -1, label: "Previous photo", side: "left-3", d: "M15 6l-6 6 6 6" },
                { step: 1, label: "Next photo", side: "right-3", d: "M9 6l6 6-6 6" },
              ].map((b) => (
                <button
                  key={b.step}
                  type="button"
                  onClick={() => go(b.step)}
                  aria-label={b.label}
                  className={`absolute top-1/2 ${b.side} flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/90 text-plum-900 shadow-card transition-colors hover:bg-white`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d={b.d} />
                  </svg>
                </button>
              ))}
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-btn bg-plum-950/60 px-2.5 py-1 text-[0.66rem] font-semibold tracking-[0.14em] text-cream-100">
                {i + 1} / {n}
              </p>
            </>
          )}
        </div>
        <div className="flex max-h-[70vh] flex-col overflow-y-auto p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl leading-tight font-semibold text-plum-900">{event.title}</h3>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn text-ink-700 transition-colors hover:bg-cream-200 hover:text-plum-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          {meta(event) && (
            <p className="mt-2 text-[0.7rem] font-semibold tracking-[0.14em] text-gold-600 uppercase">{meta(event)}</p>
          )}
          {event.summary && (
            <p className="mt-5 text-[0.9rem] leading-relaxed whitespace-pre-line text-ink-700">{event.summary}</p>
          )}
          {n > 1 && (
            <div className="mt-6 grid grid-cols-4 gap-2">
              {event.photos.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Show photo ${idx + 1}`}
                  aria-current={idx === i}
                  className={`relative aspect-square overflow-hidden rounded-btn ring-offset-2 ring-offset-cream-50 transition ${
                    idx === i ? "ring-2 ring-plum-900" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default function RecentEvents({ events }: { events: PublicEvent[] }) {
  const [open, setOpen] = useState<PublicEvent | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e, idx) => (
          <Reveal key={e.id} delay={(idx % 3) * 90}>
            <button
              type="button"
              onClick={() => setOpen(e)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-card border border-gold-200/70 bg-cream-50 text-left shadow-[0_10px_30px_-18px_rgba(50,0,75,0.18)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-card"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden bg-cream-200">
                {e.photos[0] && (
                  <Image
                    src={e.photos[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                  />
                )}
                {e.photos.length > 1 && (
                  <span className="absolute right-3 bottom-3 rounded-btn bg-plum-950/65 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] text-cream-100 uppercase">
                    {e.photos.length} photos
                  </span>
                )}
              </span>
              <span className="flex flex-1 flex-col p-6">
                {meta(e) && (
                  <span className="text-[0.64rem] font-semibold tracking-[0.16em] text-gold-600 uppercase">{meta(e)}</span>
                )}
                <span className="mt-2 font-display text-xl leading-snug font-semibold text-plum-900">{e.title}</span>
                {e.summary && (
                  <span className="mt-2.5 line-clamp-3 text-[0.84rem] leading-relaxed text-ink-500">{e.summary}</span>
                )}
                <span className="mt-4 text-[0.66rem] font-semibold tracking-[0.2em] text-plum-900 uppercase transition-transform duration-300 group-hover:translate-x-1">
                  View the event →
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      {open && <Viewer event={open} onClose={() => setOpen(null)} />}
    </>
  );
}
