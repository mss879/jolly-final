"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CARTS, FLAVORS } from "@/lib/data";
import type { BookingDraft, ChatBlock } from "@/lib/chat/types";

/* What the concierge shows under its replies. Cards in the latest reply can
   be tapped: picking flavours or a cart colour, or confirming the booking,
   sends that answer as the visitor's next message. */

type Props = {
  block: ChatBlock;
  interactive: boolean;
  onSend: (text: string) => void;
  onEdit: () => void;
};

const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });
const formatDay = (day: string) => {
  const t = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(t) ? day : dayFmt.format(t);
};

const listWords = (items: string[]) =>
  items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function Check({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="m2.5 6.2 2.3 2.3 4.7-5" />
    </svg>
  );
}

function FlavoursBlock({ block, interactive, onSend }: Props & { block: Extract<ChatBlock, { type: "flavours" }> }) {
  const flavours = block.slugs.map((slug) => FLAVORS.find((f) => f.slug === slug)).filter((f) => f !== undefined);
  const [picked, setPicked] = useState<string[]>([]);
  const [all, setAll] = useState(flavours.length <= 6);
  const canPick = block.pick && interactive;
  const shown = all ? flavours : flavours.slice(0, 6);

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2">
        {shown.map((f) => {
          const on = picked.includes(f.name);
          const body = (
            <>
              <span className="relative h-11 w-11 shrink-0">
                <Image src={f.image} alt="" fill sizes="44px" className="object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.76rem] leading-snug font-semibold text-balance text-plum-900">{f.name}</span>
                {f.dairyFree && (
                  <span className="mt-1 inline-block rounded-btn bg-plum-100 px-1.5 py-px text-[0.52rem] font-bold tracking-[0.12em] text-plum-900 uppercase">
                    Dairy free
                  </span>
                )}
              </span>
            </>
          );
          const cls = "flex w-full items-center gap-2 rounded-card border p-2 text-left transition-colors";
          return (
            <li key={f.slug}>
              {canPick ? (
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => (on ? p.filter((n) => n !== f.name) : [...p, f.name]))}
                  className={`${cls} relative pr-6 ${on ? "border-plum-900 bg-plum-100/60" : "border-gold-200 bg-cream-50 hover:border-gold-400"}`}
                >
                  {body}
                  <span
                    aria-hidden
                    className={`absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                      on ? "border-plum-900 bg-plum-900 text-cream-100" : "border-gold-300 text-transparent"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                </button>
              ) : (
                <div className={`${cls} border-gold-200 bg-cream-50`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        {!all ? (
          <button type="button" onClick={() => setAll(true)} className="text-[0.74rem] font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4">
            Show all {flavours.length} flavours
          </button>
        ) : (
          <Link href="/flavors" className="text-[0.74rem] font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4">
            See the Flavours page
          </Link>
        )}
        {canPick && (
          <button
            type="button"
            disabled={!picked.length}
            onClick={() => onSend(`I'd like ${listWords(picked)}.`)}
            className="rounded-btn bg-plum-900 px-3.5 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-cream-100 uppercase transition-colors hover:bg-plum-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {picked.length ? `Choose ${picked.length} flavour${picked.length > 1 ? "s" : ""}` : "Tap to pick"}
          </button>
        )}
      </div>
    </div>
  );
}

function CartsBlock({ block, interactive, onSend }: Props & { block: Extract<ChatBlock, { type: "carts" }> }) {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-2">
        {CARTS.map((c) => {
          const lit = block.highlight === c.key;
          const body = (
            <>
              <span className="relative block aspect-[3/4] overflow-hidden rounded-[0.6rem] bg-cream-200">
                <Image src={c.formImage} alt={c.formAlt ?? `${c.name} Jolly's cart`} fill sizes="120px" className="object-cover" />
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 px-0.5">
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-gold-400/70" style={{ backgroundColor: c.swatch }} />
                <span className="text-[0.7rem] leading-tight font-semibold text-plum-900">{c.name}</span>
              </span>
            </>
          );
          const cls = `block w-full rounded-card border p-1.5 text-left transition-colors ${
            lit ? "border-plum-900 bg-plum-100/60" : "border-gold-200 bg-cream-50"
          }`;
          return (
            <li key={c.key}>
              {interactive ? (
                <button type="button" onClick={() => onSend(`I'd like the ${c.name} cart.`)} className={`${cls} hover:border-plum-900`}>
                  {body}
                </button>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      {interactive && <p className="mt-1.5 text-[0.7rem] text-ink-500">Tap a colour to choose it.</p>}
    </div>
  );
}

const DRAFT_ROWS: [keyof BookingDraft, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["event_type", "Occasion"],
  ["event_date", "Date"],
  ["guests", "Guests"],
  ["venue", "Venue"],
  ["cart", "Cart"],
  ["flavours", "Flavours"],
  ["custom_flavour", "Custom"],
  ["message", "Notes"],
];

function DraftRows({ draft }: { draft: BookingDraft }) {
  return (
    <dl className="grid grid-cols-[4.6rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[0.78rem] leading-snug">
      {DRAFT_ROWS.map(([key, label]) => {
        const value = draft[key];
        if (!value || (Array.isArray(value) && !value.length)) return null;
        const shown = key === "event_date" ? formatDay(String(value)) : Array.isArray(value) ? value.join(", ") : value;
        return (
          <div key={key} className="contents">
            <dt className="text-ink-500">{label}</dt>
            <dd className="font-medium break-words text-ink-900">{shown}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function DraftBlock({ block, interactive, onSend, onEdit }: Props & { block: Extract<ChatBlock, { type: "booking-draft" }> }) {
  const ready = block.missing.length === 0;
  return (
    <div className="rounded-card border border-gold-300 bg-cream-50 p-3.5 shadow-[0_8px_24px_-16px_rgba(50,0,75,0.35)]">
      <p className="mb-2.5 text-[0.6rem] font-semibold tracking-[0.18em] text-gold-700 uppercase">Your reservation request</p>
      <DraftRows draft={block.draft} />
      {!ready && (
        <p className="mt-3 rounded-btn bg-amber-50 px-2.5 py-1.5 text-[0.74rem] text-amber-900 ring-1 ring-amber-200 ring-inset">
          Still needed: {listWords(block.missing)}
        </p>
      )}
      {ready && interactive && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSend("Yes, that's all correct. Please send my request.")}
            className="rounded-btn bg-plum-900 px-3.5 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-cream-100 uppercase transition-colors hover:bg-plum-800"
          >
            Send request
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-btn border border-gold-300 px-3.5 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-plum-900 uppercase transition-colors hover:border-plum-900"
          >
            Change something
          </button>
        </div>
      )}
    </div>
  );
}

function SentBlock({ block }: { block: Extract<ChatBlock, { type: "booking-sent" }> }) {
  const d = block.draft;
  const line = [d.event_type, d.event_date ? formatDay(d.event_date) : null, d.guests ? `${d.guests} guests` : null, d.cart]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="flex gap-3 rounded-card border border-emerald-200 bg-emerald-50/70 p-3.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Check className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.82rem] font-semibold text-emerald-900">Request sent to the team</p>
        {line && <p className="mt-0.5 text-[0.74rem] text-emerald-900/80">{line}</p>}
        <p className="mt-1 text-[0.74rem] leading-snug text-ink-700">
          Expect availability, a flavour menu and a styled cart proposal within one working day.
        </p>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-btn bg-plum-100/70 px-2.5 py-1.5 text-[0.74rem] font-medium text-plum-900">
      <Check className="h-3 w-3 shrink-0" />
      {children}
    </p>
  );
}

export default function ChatBlockView(props: Props) {
  const { block, interactive, onSend } = props;
  switch (block.type) {
    case "flavours":
      return <FlavoursBlock {...props} block={block} />;
    case "carts":
      return <CartsBlock {...props} block={block} />;
    case "choices":
      return interactive ? (
        <div className="flex flex-wrap gap-1.5">
          {block.options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onSend(o)}
              className="rounded-btn border border-gold-300 bg-cream-50 px-3 py-1.5 text-[0.76rem] font-medium text-plum-900 transition-colors hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
            >
              {o}
            </button>
          ))}
        </div>
      ) : null;
    case "booking-draft":
      return <DraftBlock {...props} block={block} />;
    case "booking-sent":
      return <SentBlock block={block} />;
    case "lead-saved":
      return <Note>Your details are with the team</Note>;
    case "handover":
      return <Note>The team has been asked to join this chat</Note>;
    default:
      return null;
  }
}
