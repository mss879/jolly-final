"use client";

import { Suspense, useState, type FormEvent } from "react";
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

/* Reserve-your-event form — the long, interactive one (/reserve).
   Cart colour swaps a live preview, flavour chips are optional, and the
   enquiry can go by WhatsApp (fastest reply) or email.
   The short general enquiry form lives in ContactForm.tsx (/contact).
   No backend is wired yet — both paths compose a pre-filled message.
   Swap for a form endpoint (Formspree/Resend/API route) when ready.
   CLIENT: replace/extend the fields with their booking-format questions
   once received. */

const labelCls = "mb-1.5 block text-[0.7rem] font-semibold tracking-[0.16em] text-ink-700 uppercase";
const inputCls =
  "w-full rounded-btn border border-gold-200 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500/60 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-300/40";

function EventTypeSelect({ initial = "Wedding" }: { initial?: EventType }) {
  return (
    <select id="eventType" name="eventType" required className={inputCls} defaultValue={initial}>
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

function buildEnquiry(f: FormData) {
  const eventType = String(f.get("eventType") ?? "");
  const date = String(f.get("date") ?? "");
  const flavours = f.getAll("flavours").map(String);
  const subject = `Event enquiry — ${eventType} · ${date || "date TBC"}`;
  const body = [
    `Name: ${f.get("name")}`,
    `Phone: ${f.get("phone")}`,
    `Email: ${f.get("email")}`,
    `Event type: ${eventType}`,
    `Event date: ${date || "-"}`,
    `Venue / location: ${f.get("venue") || "-"}`,
    `Estimated guests: ${f.get("guests") || "-"}`,
    `Cart colour: ${f.get("cart") || "-"}`,
    `Flavour preferences: ${flavours.length ? flavours.join(", ") : "-"}`,
    "",
    `${f.get("message") || ""}`,
  ].join("\n");
  return { subject, body };
}

function openHref(href: string, newTab = false) {
  const a = document.createElement("a");
  a.href = href;
  if (newTab) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  a.click();
}

export default function ReserveForm() {
  const [sent, setSent] = useState<"email" | "whatsapp" | null>(null);
  const [cart, setCart] = useState<CartKey>("ivory");
  const selected = CARTS.find((c) => c.key === cart) ?? CARTS[0];

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const via = submitter?.value === "whatsapp" ? "whatsapp" : "email";
    const { subject, body } = buildEnquiry(f);
    if (via === "whatsapp") {
      openHref(`${CONTACT.whatsappHref}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`, true);
    } else {
      openHref(`${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
    setSent(via);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={labelCls}>
          Full name *
        </label>
        <input id="name" name="name" required placeholder="Your name" className={inputCls} />
      </div>
      <div>
        <label htmlFor="phone" className={labelCls}>
          Phone / WhatsApp *
        </label>
        <input id="phone" name="phone" required placeholder="+94 ..." className={inputCls} />
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>
          Email *
        </label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputCls} />
      </div>
      <div>
        <label htmlFor="eventType" className={labelCls}>
          Event type *
        </label>
        <Suspense fallback={<EventTypeSelect />}>
          <EventTypeFromUrl />
        </Suspense>
      </div>
      <div>
        <label htmlFor="date" className={labelCls}>
          Event date
        </label>
        <input id="date" name="date" type="date" className={inputCls} />
      </div>
      <div>
        <label htmlFor="guests" className={labelCls}>
          Estimated guests
        </label>
        <input id="guests" name="guests" type="number" min={1} placeholder="150" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="venue" className={labelCls}>
          Venue / location
        </label>
        <input id="venue" name="venue" placeholder="e.g. Colombo 07, or the venue name" className={inputCls} />
      </div>

      {/* Cart colour — the preview image follows the selection */}
      <fieldset className="sm:col-span-2">
        <legend className={labelCls}>Cart colour</legend>
        <div className="grid grid-cols-[1fr_7rem] gap-4 sm:grid-cols-[1fr_11rem] sm:gap-5">
          <div className="flex flex-col gap-2.5">
            {CARTS.map((c) => {
              const on = c.key === cart;
              return (
                <label
                  key={c.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-btn border bg-cream-50 px-3.5 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-gold-300/60 ${
                    on ? "border-plum-900" : "border-gold-200 hover:border-gold-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="cart"
                    value={`${c.colour} — ${c.name}`}
                    className="sr-only"
                    checked={on}
                    onChange={() => setCart(c.key)}
                  />
                  <span
                    aria-hidden
                    className="h-6 w-6 shrink-0 rounded-full ring-1 ring-gold-400/80 ring-offset-2 ring-offset-cream-50"
                    style={{ backgroundColor: c.swatch }}
                  />
                  <span className="flex-1 text-sm leading-tight text-ink-900">
                    <span className="font-semibold text-plum-900">{c.colour}</span>
                    <span className="hidden text-ink-500 sm:inline"> · {c.name}</span>
                  </span>
                  <span className={`h-2 w-2 shrink-0 rounded-full transition-colors ${on ? "bg-plum-900" : "bg-gold-200"}`} />
                </label>
              );
            })}
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-btn border border-gold-200 bg-cream-200/60">
            {CARTS.map((c) => (
              <Image
                key={c.key}
                src={c.image}
                alt={c.key === cart ? c.alt : ""}
                fill
                sizes="(min-width: 640px) 176px, 112px"
                className={`object-cover transition-opacity duration-500 ${c.key === cart ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <p className="absolute inset-x-0 bottom-0 bg-plum-950/60 px-3 py-2 text-[0.6rem] font-semibold tracking-[0.14em] text-cream-100 uppercase">
              {selected.name}
            </p>
          </div>
        </div>
      </fieldset>

      {/* Flavour preferences — optional chips */}
      <div className="sm:col-span-2">
        <p className={labelCls}>
          Flavour preferences{" "}
          <span className="font-normal tracking-normal text-ink-500 normal-case">(optional — pick any)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {FLAVORS.map((f) => (
            <label
              key={f.slug}
              className="cursor-pointer rounded-btn border border-gold-300 bg-cream-50 px-3 py-1.5 text-[0.66rem] font-semibold tracking-[0.12em] text-ink-700 uppercase transition-colors hover:border-gold-500 focus-within:ring-2 focus-within:ring-gold-300/60 has-checked:border-plum-900 has-checked:bg-plum-900 has-checked:text-cream-100"
            >
              <input type="checkbox" name="flavours" value={f.name} className="sr-only" />
              {f.name}
            </label>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelCls}>
          Tell us about your event
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Theme, colours, the feeling you want to create"
          className={inputCls}
        />
      </div>

      <div className="sm:col-span-2">
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="via"
            value="whatsapp"
            className="inline-flex items-center gap-2.5 rounded-btn bg-plum-900 px-8 py-4 text-[0.8rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 1.7a7.3 7.3 0 1 1-3.9 13.5l-.3-.2-2.8.7.8-2.7-.2-.3A7.3 7.3 0 0 1 12 4.7zm-2.6 3.2c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.9 2.6.7 3 .7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.3-1.4-.6-.6-1-1.2-1.3-1.8-.1-.2 0-.4.1-.5l.6-.7c.1-.2.1-.4 0-.6L9.9 8.3c-.1-.3-.3-.4-.5-.4z" />
            </svg>
            Send via WhatsApp
          </button>
          <button
            type="submit"
            name="via"
            value="email"
            className="rounded-btn border border-gold-500 px-8 py-4 text-[0.8rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
          >
            Send by Email
          </button>
        </div>
        {sent && (
          <p className="mt-4 text-sm text-ink-700">
            {sent === "whatsapp"
              ? "WhatsApp should now be open with your enquiry — press send, and we'll be in touch within one working day."
              : "Your email app should now be open with the enquiry — press send, and we'll be in touch within one working day."}{" "}
            Prefer the other route?{" "}
            <a
              href={sent === "whatsapp" ? CONTACT.emailHref : CONTACT.whatsappHref}
              target={sent === "whatsapp" ? undefined : "_blank"}
              rel={sent === "whatsapp" ? undefined : "noopener noreferrer"}
              className="font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4"
            >
              {sent === "whatsapp" ? "Email us instead" : "Message us on WhatsApp"}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
