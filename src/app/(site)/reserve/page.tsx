import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ReserveForm from "@/components/ReserveForm";
import Reveal from "@/components/Reveal";
import { CONTACT, FIND_US, REASONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reserve Your Event",
  description:
    "Reserve Jolly's on Wheels for your wedding, corporate event or private party. Pick a cart colour, tell us your flavours, or call +94 707 222 511.",
};

export default function ReservePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-12 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] bg-plum-100/70 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker="Reserve Your Event"
            title={
              <>
                Your guests are about to
                <span className="italic text-gold-600"> feel good</span>
              </>
            }
            copy="Tell us about your event. Within one working day you'll have availability, a flavour menu and a styled cart proposal."
          />
        </div>
      </section>

      <section className="container-luxe pb-20">
        {/* The form takes the full page width; the extras that used to sit beside it follow below */}
        <Reveal>
          <div className="rounded-card border border-gold-200/70 bg-cream-50 p-5 shadow-card sm:p-9 lg:p-10">
            <div className="mb-7 flex flex-col gap-5 border-b border-gold-200/70 pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pb-7">
              <div>
                <h2 className="font-display text-2xl font-semibold text-plum-900">Reserve your date</h2>
                <p className="mt-1.5 max-w-md text-[0.83rem] leading-relaxed text-ink-500">
                  Pick a cart colour, tell us your flavours and how to reach you. We&apos;ll handle the rest.
                </p>
              </div>

              {/* Rather talk? — two tap targets on a phone, a quiet line beside the title on larger screens */}
              <div className="shrink-0 sm:text-right">
                <p className="kicker">Rather Talk?</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:hidden">
                  <a
                    href={CONTACT.phoneHref}
                    className="flex items-center justify-center gap-2 rounded-btn border border-gold-400 px-3 py-3 text-[0.72rem] font-semibold tracking-[0.14em] text-plum-900 uppercase"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M5 4h3.5l1.6 4.2-2 1.5a12 12 0 0 0 6.2 6.2l1.5-2 4.2 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                    </svg>
                    Call us
                  </a>
                  <a
                    href={CONTACT.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-btn border border-gold-400 px-3 py-3 text-[0.72rem] font-semibold tracking-[0.14em] text-plum-900 uppercase"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
                      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 1.7a7.3 7.3 0 1 1-3.9 13.5l-.3-.2-2.8.7.8-2.7-.2-.3A7.3 7.3 0 0 1 12 4.7zm-2.6 3.2c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.9 2.6.7 3 .7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.3-1.4-.6-.6-1-1.2-1.3-1.8-.1-.2 0-.4.1-.5l.6-.7c.1-.2.1-.4 0-.6L9.9 8.3c-.1-.3-.3-.4-.5-.4z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
                <div className="hidden sm:block">
                  <a
                    href={CONTACT.phoneHref}
                    className="mt-2 block font-display text-2xl font-semibold text-plum-900 transition-colors hover:text-gold-600"
                  >
                    {CONTACT.phone}
                  </a>
                  <a
                    href={CONTACT.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 text-[0.8rem] text-ink-700 transition-colors hover:text-plum-900"
                  >
                    Message us on WhatsApp
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </div>

            <ReserveForm />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 grid gap-8 px-1 sm:mt-12 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
            <div>
              <p className="kicker">What You Get</p>
              <ul className="mt-4 grid gap-3.5 sm:grid-cols-3 sm:gap-6">
                {REASONS.map((r) => (
                  <li key={r.n} className="flex gap-3">
                    <span className="font-display text-sm font-semibold text-gold-500">{r.n}</span>
                    <span className="text-[0.85rem] leading-snug text-ink-700">{r.t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gold-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <p className="text-[0.8rem] leading-relaxed text-ink-500">{FIND_US.line}</p>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-500">
                Not booking an event?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4"
                >
                  Send us a message
                </Link>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
