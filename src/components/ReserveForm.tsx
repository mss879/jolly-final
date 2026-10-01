"use client";

import { Suspense, useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CARTS,
  CONTACT,
  EVENT_TYPES,
  EVENT_TYPE_PARAM,
  FLAVORS,
  type CartKey,
  type EventType,
} from "@/lib/data";
import { isBookingField, type BookingFieldKey } from "@/lib/booking-fields";
import {
  BookingTracker,
  bookingSessionId,
  endBookingSession,
  trackingContext,
} from "@/lib/booking-tracker";

/* Reserve-your-event form — the long, interactive one (/reserve).
   Four numbered steps. On a desktop the details and the cart sit side by side
   and the flavours run four across, so the form fills the page width; on a
   phone everything stacks into one column with two flavours to a row.
   Cart colour swaps a live preview; the flavour cards (scoop and name) are
   optional.
   Every field is saved as the visitor goes (src/lib/booking-tracker.ts), so a
   half-finished form still reaches /admin/bookings as an incomplete booking,
   and the focus/blur timings feed the booking-form analytics.
   Sending moves the booking to "awaiting confirmation". If the save fails,
   the same enquiry can go by WhatsApp or email instead.
   The short general enquiry form lives in ContactForm.tsx (/contact).
   CLIENT: replace/extend the fields with their booking-format questions
   once received — keep src/lib/booking-fields.ts and the migration in step. */

const labelCls = "mb-1.5 block text-[0.7rem] font-semibold tracking-[0.16em] text-ink-700 uppercase";
/* 16px text on phones: anything smaller makes iOS zoom the page on focus. */
const inputCls =
  "w-full min-w-0 rounded-btn border border-gold-200 bg-cream-50 px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/60 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-300/40 sm:text-sm";

/* iOS draws an empty date field shorter than the rest and lets it overflow
   its column; a set height and no native chrome keep it in line. */
const dateCls = "block h-[3.125rem] appearance-none sm:h-[2.875rem]";

/* The numbered heading of each step. */
function Step({ n, children }: { n: string; children: ReactNode }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className="font-display text-[0.8rem] font-semibold tracking-[0.08em] text-gold-500">{n}</span>
      {children}
    </span>
  );
}
const stepTitleCls = "font-display text-lg font-semibold text-plum-900";
const stepCls = "mb-4 block w-full";

/* A flavour you can tick. On a phone the scoop sits above its name, two to a
   row; from tablet up it sits beside the name. The checkbox itself is visually
   hidden; the card shows its state. */
const flavourCardCls =
  "group relative flex cursor-pointer flex-col items-center gap-2.5 rounded-card border border-gold-200 bg-cream-50 px-3 pt-5 pb-4 text-center transition-colors hover:border-gold-400 focus-within:ring-2 focus-within:ring-gold-300/60 has-checked:border-plum-900 has-checked:bg-plum-100/50 sm:flex-row sm:gap-3.5 sm:p-3 sm:pr-11 sm:text-left";
const flavourNameCls = "block text-[0.84rem] leading-snug font-semibold text-balance text-plum-900";

function Tick() {
  return (
    <span
      aria-hidden
      className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-gold-300 bg-cream-50 text-transparent transition-colors group-has-checked:border-plum-900 group-has-checked:bg-plum-900 group-has-checked:text-cream-100 sm:top-1/2 sm:right-3.5 sm:-translate-y-1/2"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m2.5 6.2 2.3 2.3 4.7-5" />
      </svg>
    </span>
  );
}

// Picked rather than typed: saved on change, not on blur.
const CHOICE_FIELDS = new Set<BookingFieldKey>(["event_type", "cart", "flavours"]);

function EventTypeSelect({ initial = "Wedding" }: { initial?: EventType }) {
  return (
    <select id="event_type" name="event_type" required className={inputCls} defaultValue={initial}>
      {EVENT_TYPES.map((t) => (
        <option key={t}>{t}</option>
      ))}
    </select>
  );
}

/* Reads `?type=` (service slug / franchise / at-home) to preselect the event
   type. Kept in a leaf under <Suspense> so the rest of the form stays in the
   prerendered HTML (Next 16 requires a boundary around useSearchParams). */
function EventTypeFromUrl() {
  const type = useSearchParams().get("type");
  return <EventTypeSelect initial={(type && EVENT_TYPE_PARAM[type]) || "Wedding"} />;
}

function fieldName(target: EventTarget | null) {
  const el = target as { name?: unknown } | null;
  return isBookingField(el?.name) ? el.name : null;
}

function fieldValue(form: HTMLFormElement, field: BookingFieldKey) {
  const data = new FormData(form);
  return field === "flavours" ? data.getAll("flavours").map(String) : String(data.get(field) ?? "");
}

function readFields(f: FormData) {
  const get = (key: string) => String(f.get(key) ?? "");
  return {
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    event_type: get("event_type"),
    event_date: get("event_date"),
    guests: get("guests"),
    venue: get("venue"),
    cart: get("cart"),
    flavours: f.getAll("flavours").map(String),
    custom_flavour: get("custom_flavour"),
    message: get("message"),
  };
}

function buildEnquiry(f: FormData) {
  const v = readFields(f);
  const subject = `Event enquiry: ${v.event_type} · ${v.event_date || "date TBC"}`;
  const body = [
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    `Email: ${v.email}`,
    `Event type: ${v.event_type}`,
    `Event date: ${v.event_date || "-"}`,
    `Venue / location: ${v.venue || "-"}`,
    `Estimated guests: ${v.guests || "-"}`,
    `Cart colour: ${v.cart || "-"}`,
    `Flavour preferences: ${v.flavours.length ? v.flavours.join(", ") : "-"}`,
    `Custom flavours: ${v.custom_flavour || "-"}`,
    "",
    v.message,
  ].join("\n");
  return {
    whatsapp: `${CONTACT.whatsappHref}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`,
    email: `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

type Outcome =
  | { status: "idle" | "sending" }
  | { status: "sent"; whatsapp: string }
  | { status: "invalid"; message: string }
  | { status: "failed"; whatsapp: string; email: string };

export default function ReserveForm() {
  const [cart, setCart] = useState<CartKey>("cream");
  const [customFlavour, setCustomFlavour] = useState(false);
  const customFlavourRef = useRef<HTMLInputElement>(null);
  const [outcome, setOutcome] = useState<Outcome>({ status: "idle" });
  const selected = CARTS.find((c) => c.key === cart) ?? CARTS[0];

  const tracker = useRef<BookingTracker | null>(null);
  const started = useRef(false);
  const lastFocused = useRef<BookingFieldKey | null>(null);
  const focusedAt = useRef<Partial<Record<BookingFieldKey, number>>>({});
  const savedValues = useRef<Partial<Record<BookingFieldKey, string>>>({});
  const hadValue = useRef<Partial<Record<BookingFieldKey, boolean>>>({});
  const thanksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = new BookingTracker(bookingSessionId(), trackingContext());
    tracker.current = t;
    t.event({ type: "view" }, 0);

    const leave = () => t.flush(true);
    const onVisibility = () => document.visibilityState === "hidden" && leave();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", leave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, []);

  useEffect(() => {
    if (outcome.status === "sent") thanksRef.current?.focus();
  }, [outcome.status]);

  useEffect(() => {
    if (customFlavour) customFlavourRef.current?.focus();
  }, [customFlavour]);

  // Closing the custom flavour box clears what was typed in it.
  function toggleCustomFlavour(on: boolean) {
    setCustomFlavour(on);
    if (on || !hadValue.current.custom_flavour) return;
    hadValue.current.custom_flavour = false;
    save("custom_flavour", "", 300);
    tracker.current?.event({ type: "clear", field: "custom_flavour" });
  }

  // Queue a field's value if it changed since it was last queued.
  function save(field: BookingFieldKey, value: string | string[], delay?: number) {
    const serialised = JSON.stringify(value);
    if (savedValues.current[field] === serialised) return;
    savedValues.current[field] = serialised;
    tracker.current?.save(field, value, delay);
  }

  function onFocus(e: FocusEvent<HTMLFormElement>) {
    const field = fieldName(e.target);
    if (!field || !tracker.current) return;

    if (!started.current) {
      // First touch: keep the preselected choices with the draft too.
      started.current = true;
      save("event_type", fieldValue(e.currentTarget, "event_type"), 400);
      save("cart", fieldValue(e.currentTarget, "cart"), 400);
    }
    if (lastFocused.current !== field) {
      lastFocused.current = field;
      focusedAt.current[field] = performance.now();
      tracker.current.event({ type: "focus", field });
    }
  }

  function onBlur(e: FocusEvent<HTMLFormElement>) {
    const field = fieldName(e.target);
    if (!field || CHOICE_FIELDS.has(field) || !tracker.current) return;

    const value = fieldValue(e.currentTarget, field) as string;
    const filled = value.trim() !== "";
    const since = focusedAt.current[field];
    save(field, value, 300);
    if (filled) {
      tracker.current.event({
        type: "complete",
        field,
        duration_ms: since === undefined ? undefined : Math.round(performance.now() - since),
      });
    } else if (hadValue.current[field]) {
      tracker.current.event({ type: "clear", field });
    }
    hadValue.current[field] = filled;
    // Leaving the form entirely (not just moving between fields) resets focus tracking.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) lastFocused.current = null;
  }

  function onChange(e: FormEvent<HTMLFormElement>) {
    if ((e.target as { name?: unknown }).name === "website") {
      tracker.current?.stop(); // only bots fill in the hidden field
      return;
    }
    const field = fieldName(e.target);
    if (!field || !tracker.current) return;

    const value = fieldValue(e.currentTarget, field);
    if (!CHOICE_FIELDS.has(field)) {
      save(field, value); // typing: saved every moment or so, even without leaving the field
      return;
    }
    save(field, value, field === "flavours" ? 800 : 400);
    const filled = Array.isArray(value) ? value.length > 0 : value !== "";
    tracker.current.event({ type: filled ? "complete" : "clear", field });
  }

  function onInvalid(e: FormEvent<HTMLFormElement>) {
    const field = fieldName(e.target);
    if (field) tracker.current?.event({ type: "error", field });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const enquiry = buildEnquiry(data);
    const t = tracker.current;
    t?.flush();
    setOutcome({ status: "sending" });

    try {
      const res = await fetch("/api/booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: t?.session ?? bookingSessionId(),
          fields: readFields(data),
          context: trackingContext(),
          website: data.get("website"),
        }),
      });
      if (res.ok) {
        t?.stop();
        endBookingSession();
        setOutcome({ status: "sent", whatsapp: enquiry.whatsapp });
        return;
      }
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      if (res.status === 400 && payload?.error) {
        setOutcome({ status: "invalid", message: payload.error });
      } else {
        setOutcome({ status: "failed", ...enquiry });
      }
    } catch {
      setOutcome({ status: "failed", ...enquiry });
    }
  }

  if (outcome.status === "sent") {
    return (
      <div
        ref={thanksRef}
        tabIndex={-1}
        role="status"
        className="rounded-card border border-gold-200 bg-cream-100 px-6 py-8 text-center outline-none sm:px-10"
      >
        <p className="kicker">Request received</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-plum-900 sm:text-3xl">
          Your request is with us
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700">
          We&apos;ll be in touch within one working day with availability and a styled cart proposal.
        </p>
        <a
          href={outcome.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4"
        >
          Prefer to chat now? Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      onInvalidCapture={onInvalid}
      className="grid gap-x-12 gap-y-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-y-11"
    >
      {/* 01 — who and when */}
      <fieldset className="min-w-0">
        <legend className={stepCls}>
          <Step n="01">
            <span className={stepTitleCls}>Your details</span>
          </Step>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Full name *
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              autoCapitalize="words"
              placeholder="Your name"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelCls}>
              Phone / WhatsApp *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              placeholder="+94 ..."
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="event_type" className={labelCls}>
              Event type *
            </label>
            <Suspense fallback={<EventTypeSelect />}>
              <EventTypeFromUrl />
            </Suspense>
          </div>
          <div>
            <label htmlFor="event_date" className={labelCls}>
              Event date
            </label>
            <input id="event_date" name="event_date" type="date" className={`${inputCls} ${dateCls}`} />
          </div>
          <div>
            <label htmlFor="guests" className={labelCls}>
              Estimated guests
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="150"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="venue" className={labelCls}>
              Venue / location
            </label>
            <input id="venue" name="venue" placeholder="Venue name or area" className={inputCls} />
          </div>
        </div>
      </fieldset>

      {/* 02 — cart colour; the preview follows the selection */}
      <fieldset className="min-w-0">
        <legend className={stepCls}>
          <Step n="02">
            <span className={stepTitleCls}>Cart colour</span>
          </Step>
        </legend>
        <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2.5 min-[380px]:grid-cols-[minmax(0,1fr)_7.5rem] min-[380px]:gap-3 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-4 xl:grid-cols-[minmax(0,1fr)_15.25rem]">
          <div className="grid min-w-0 grid-rows-3 gap-2.5">
            {CARTS.map((c) => {
              const on = c.key === cart;
              return (
                <label
                  key={c.key}
                  className={`flex min-w-0 cursor-pointer items-center gap-2.5 rounded-card border px-2.5 py-2 transition-colors focus-within:ring-2 focus-within:ring-gold-300/60 min-[380px]:gap-3 min-[380px]:px-3 sm:gap-4 sm:px-4 ${
                    on ? "border-plum-900 bg-plum-100/50" : "border-gold-200 bg-cream-50 hover:border-gold-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="cart"
                    value={c.name}
                    className="sr-only"
                    checked={on}
                    onChange={() => setCart(c.key)}
                  />
                  <span
                    aria-hidden
                    className="h-5 w-5 shrink-0 rounded-full ring-1 ring-gold-400/80 ring-offset-2 ring-offset-cream-50 min-[380px]:h-6 min-[380px]:w-6 sm:h-7 sm:w-7"
                    style={{ backgroundColor: c.swatch }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.84rem] leading-tight font-semibold text-plum-900 sm:text-sm">
                      {c.name}
                    </span>
                    <span className="mt-1 hidden text-[0.75rem] leading-snug text-ink-500 sm:block">{c.occasion}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-gold-200 bg-cream-200/60">
            {CARTS.map((c) => (
              <Image
                key={c.key}
                src={c.formImage}
                alt={c.key === cart ? `${c.name} Jolly's cart with a bicycle in a marble hotel lobby` : ""}
                fill
                sizes="(min-width: 1280px) 244px, (min-width: 640px) 192px, 120px"
                className={`object-cover transition-opacity duration-500 ${c.key === cart ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <p className="absolute inset-x-0 bottom-0 bg-plum-950/60 px-3 py-2 text-[0.6rem] font-semibold tracking-[0.14em] text-cream-100 uppercase">
              {selected.name}
            </p>
          </div>
        </div>
      </fieldset>

      {/* 03 — flavour preferences, optional */}
      <fieldset className="min-w-0 lg:col-span-2">
        <legend className={stepCls}>
          <Step n="03">
            <span className={stepTitleCls}>Flavour preferences</span>
            <span className="text-[0.78rem] text-ink-500">Optional. Pick any, or add your own.</span>
          </Step>
        </legend>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {FLAVORS.map((f) => (
            <label key={f.slug} className={flavourCardCls}>
              <input type="checkbox" name="flavours" value={f.name} className="sr-only" />
              <span className="relative h-16 w-16 shrink-0 sm:h-14 sm:w-14">
                <Image src={f.image} alt="" fill sizes="64px" className="object-contain" />
              </span>
              <span className="min-w-0">
                <span className={flavourNameCls}>{f.name}</span>
                {f.dairyFree && (
                  <span className="mt-1.5 inline-block rounded-btn bg-plum-100 px-2 py-0.5 text-[0.54rem] font-bold tracking-[0.14em] text-plum-900 uppercase">
                    Dairy Free
                  </span>
                )}
              </span>
              <Tick />
            </label>
          ))}
          {/* Sixteenth card: its own row where the grid is three across */}
          <label className={`${flavourCardCls} lg:col-span-full lg:justify-center lg:pl-11 xl:col-span-1 xl:justify-start xl:pl-3`}>
            <input
              type="checkbox"
              className="sr-only"
              checked={customFlavour}
              onChange={(e) => toggleCustomFlavour(e.target.checked)}
            />
            <span
              aria-hidden
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed border-gold-400 font-display text-2xl text-gold-600 sm:h-14 sm:w-14"
            >
              +
            </span>
            <span className={flavourNameCls}>Custom Flavours</span>
            <Tick />
          </label>
        </div>
        {customFlavour && (
          <div className="mt-3">
            <label htmlFor="custom_flavour" className="sr-only">
              Your custom flavours
            </label>
            <input
              ref={customFlavourRef}
              id="custom_flavour"
              name="custom_flavour"
              maxLength={200}
              placeholder="Tell us the flavours you have in mind"
              className={inputCls}
            />
          </div>
        )}
      </fieldset>

      {/* 04 — anything else, and send */}
      <div className="min-w-0 lg:col-span-2">
        <label htmlFor="message" className={stepCls}>
          <Step n="04">
            <span className={stepTitleCls}>Tell us about your event</span>
          </Step>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Theme, colours, the feeling you want to create"
          className={inputCls}
        />
      </div>

      {/* Hidden from people; bots that fill it in are ignored */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="min-w-0 lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <button
            type="submit"
            disabled={outcome.status === "sending"}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-btn bg-plum-900 px-10 py-4 text-[0.8rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {outcome.status === "sending" ? "Sending…" : "Request Your Date"}
          </button>
          <p className="text-center text-[0.75rem] leading-relaxed text-ink-500 sm:text-left">
            We save your details as you type, so nothing is lost.
          </p>
        </div>

        {outcome.status === "invalid" && (
          <p role="alert" className="mt-4 text-sm font-medium text-plum-900">
            {outcome.message}.
          </p>
        )}
        {outcome.status === "failed" && (
          <div role="alert" className="mt-5 rounded-card border border-gold-300 bg-cream-100 p-5">
            <p className="text-sm text-ink-900">
              We couldn&apos;t send that just now. Your details are still here. Send them another way and
              we&apos;ll reply within one working day.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={outcome.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn bg-plum-900 px-6 py-3 text-[0.72rem] font-semibold tracking-[0.16em] text-cream-100 uppercase transition-colors hover:bg-plum-800"
              >
                Send via WhatsApp
              </a>
              <a
                href={outcome.email}
                className="rounded-btn border border-gold-500 px-6 py-3 text-[0.72rem] font-semibold tracking-[0.16em] text-plum-900 uppercase transition-colors hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
              >
                Send by Email
              </a>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
