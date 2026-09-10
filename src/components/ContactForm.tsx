"use client";

import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/data";

/* Short general-enquiry form (/contact) — four fields, one button.
   Event bookings use the longer ReserveForm on /reserve.
   No backend yet: submitting composes a pre-filled email to the
   key-account inbox. */

const labelCls = "mb-1.5 block text-[0.7rem] font-semibold tracking-[0.16em] text-ink-700 uppercase";
const inputCls =
  "w-full rounded-btn border border-gold-200 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500/60 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-300/40";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Website enquiry — ${f.get("name")}`;
    const body = [
      `Name: ${f.get("name")}`,
      `Email: ${f.get("email")}`,
      `Phone: ${f.get("phone") || "-"}`,
      "",
      `${f.get("message") || ""}`,
    ].join("\n");
    const a = document.createElement("a");
    a.href = `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    a.click();
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={labelCls}>
          Name *
        </label>
        <input id="name" name="name" required placeholder="Your name" className={inputCls} />
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>
          Email *
        </label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="phone" className={labelCls}>
          Phone <span className="font-normal tracking-normal text-ink-500 normal-case">(optional)</span>
        </label>
        <input id="phone" name="phone" placeholder="+94 ..." className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelCls}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="How can we help?"
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-btn bg-plum-900 px-8 py-4 text-[0.8rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold sm:w-auto"
        >
          Send Message
        </button>
        <p className="mt-4 text-sm text-ink-700">
          {sent
            ? "Your email app should now be open with the message — press send, and we'll be in touch."
            : "Prefer WhatsApp? "}
          {!sent && (
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4"
            >
              Message us directly
            </a>
          )}
          {!sent && "."}
        </p>
      </div>
    </form>
  );
}
