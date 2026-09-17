"use client";

import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/data";

/* Short general-enquiry form (/contact) — four fields, one button.
   Event bookings use the longer ReserveForm on /reserve.
   Messages are saved to Supabase and appear under Inquiries in /admin.
   If saving fails, the same message can go by email or WhatsApp. */

const labelCls = "mb-1.5 block text-[0.7rem] font-semibold tracking-[0.16em] text-ink-700 uppercase";
const inputCls =
  "w-full rounded-btn border border-gold-200 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500/60 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-300/40";
const linkCls = "font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4";

type Outcome =
  | { status: "idle" | "sending" | "sent" }
  | { status: "invalid"; message: string }
  | { status: "failed"; email: string; whatsapp: string };

function composeMessage(f: FormData) {
  const subject = `Website enquiry — ${f.get("name")}`;
  const body = [
    `Name: ${f.get("name")}`,
    `Email: ${f.get("email")}`,
    `Phone: ${f.get("phone") || "-"}`,
    "",
    `${f.get("message") || ""}`,
  ].join("\n");
  return {
    email: `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    whatsapp: `${CONTACT.whatsappHref}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`,
  };
}

export default function ContactForm() {
  const [outcome, setOutcome] = useState<Outcome>({ status: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setOutcome({ status: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      if (res.ok) {
        form.reset();
        setOutcome({ status: "sent" });
        return;
      }
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      if (res.status === 400 && payload?.error) {
        setOutcome({ status: "invalid", message: payload.error });
      } else {
        setOutcome({ status: "failed", ...composeMessage(f) });
      }
    } catch {
      setOutcome({ status: "failed", ...composeMessage(f) });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={labelCls}>
          Name *
        </label>
        <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={inputCls} />
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="phone" className={labelCls}>
          Phone <span className="font-normal tracking-normal text-ink-500 normal-case">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+94 ..." className={inputCls} />
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

      {/* Hidden from people; bots that fill it in are ignored */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={outcome.status === "sending"}
          className="w-full rounded-btn bg-plum-900 px-8 py-4 text-[0.8rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {outcome.status === "sending" ? "Sending…" : "Send Message"}
        </button>
        <p className="mt-4 text-sm text-ink-700" aria-live="polite">
          {outcome.status === "sent" && "Thank you — your message is with us. We'll be in touch."}
          {outcome.status === "invalid" && `${outcome.message}.`}
          {outcome.status === "failed" && (
            <>
              We couldn&apos;t send that just now.{" "}
              <a href={outcome.email} className={linkCls}>
                Email it instead
              </a>{" "}
              or{" "}
              <a href={outcome.whatsapp} target="_blank" rel="noopener noreferrer" className={linkCls}>
                message us on WhatsApp
              </a>
              .
            </>
          )}
          {(outcome.status === "idle" || outcome.status === "sending") && (
            <>
              Prefer WhatsApp?{" "}
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Message us directly
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}
