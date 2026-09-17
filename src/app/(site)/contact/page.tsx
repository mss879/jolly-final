import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { CONTACT, CTA, FIND_US } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Jolly's Creamery — call +94 707 222 511, message us on WhatsApp, or send a note. Booking an event? Reserve your date in a minute.",
};

const CHANNELS = [
  {
    label: "Call us",
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
    note: "Mon–Sun · 9am–9pm",
  },
  {
    label: "WhatsApp",
    value: CONTACT.phone,
    href: CONTACT.whatsappHref,
    note: "Quickest reply",
  },
  {
    label: "Email",
    value: CONTACT.email,
    href: CONTACT.emailHref,
    note: "Proposals and partnerships",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-12 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] bg-plum-100/70 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker="Contact"
            title={
              <>
                Say hello,
                <span className="italic text-gold-600"> we&apos;ll reply</span>
              </>
            }
            copy="Questions, partnerships or a quick hello — reach us however suits you."
          />
        </div>
      </section>

      <section className="container-luxe pb-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="flex flex-col gap-5">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block border border-gold-200/70 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-card"
                >
                  <p className="kicker">{c.label}</p>
                  <p className="mt-2 font-display text-xl font-semibold break-all text-plum-900">{c.value}</p>
                  <p className="mt-1 text-[0.78rem] text-ink-500">{c.note}</p>
                </a>
              </Reveal>
            ))}

            <Reveal delay={280}>
              <div className="border border-gold-200/70 bg-cream-200/70 p-6">
                <p className="kicker">Follow The Joy</p>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-ink-700 transition-colors hover:text-plum-900">
                    Instagram — @jollys_creamery
                  </a>
                  <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="text-ink-700 transition-colors hover:text-plum-900">
                    Facebook — Jolly&apos;s Creamery
                  </a>
                </div>
                <p className="mt-4 border-t border-gold-200 pt-4 text-[0.78rem] leading-relaxed text-ink-500">
                  {FIND_US.line}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="border border-gold-200/70 bg-cream-50 p-7 shadow-card sm:p-9">
              <h2 className="font-display text-2xl font-semibold text-plum-900">Send a message</h2>
              <p className="mt-1.5 mb-7 text-[0.83rem] text-ink-500">
                A few details and we&apos;ll come back to you.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Event bookings belong on the reserve page */}
      <section className="container-luxe pb-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border border-gold-200/70 bg-cream-200/60 px-8 py-9 sm:flex-row sm:items-center">
            <div>
              <p className="kicker">Booking an event?</p>
              <p className="mt-2 font-display text-xl text-plum-900 sm:text-2xl">
                Pick a cart colour and your flavours in a minute.
              </p>
            </div>
            <Link
              href={CTA.href}
              className="inline-flex shrink-0 items-center gap-3 rounded-btn bg-plum-900 px-8 py-4 text-[0.78rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
            >
              {CTA.label}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
