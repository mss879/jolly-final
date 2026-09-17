import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ReserveForm from "@/components/ReserveForm";
import Reveal from "@/components/Reveal";
import { CONTACT, FIND_US, REASONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reserve Your Event",
  description:
    "Reserve Jolly's on Wheels for your wedding, corporate event or private party — pick a cart colour, tell us your flavours, or call +94 707 222 511.",
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
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal>
            <div className="border border-gold-200/70 bg-cream-50 p-7 shadow-card sm:p-9">
              <h2 className="font-display text-2xl font-semibold text-plum-900">Reserve your date</h2>
              <p className="mt-1.5 mb-7 text-[0.83rem] text-ink-500">
                Pick a cart colour, tell us your flavours and how to reach you — we&apos;ll handle the rest.
              </p>
              <ReserveForm />
            </div>
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal delay={120}>
              <div className="border border-gold-200/70 bg-cream-200/70 p-6">
                <p className="kicker">Rather Talk?</p>
                <a
                  href={CONTACT.phoneHref}
                  className="mt-3 block font-display text-2xl font-semibold text-plum-900 transition-colors hover:text-gold-600"
                >
                  {CONTACT.phone}
                </a>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-2 text-[0.8rem] text-ink-700 transition-colors hover:text-plum-900"
                >
                  Message us on WhatsApp
                  <span aria-hidden>→</span>
                </a>
                <p className="mt-4 border-t border-gold-200 pt-4 text-[0.78rem] leading-relaxed text-ink-500">
                  {FIND_US.line}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="border border-gold-200/70 bg-cream-50 p-6">
                <p className="kicker">What You Get</p>
                <ul className="mt-4 flex flex-col gap-3.5">
                  {REASONS.map((r) => (
                    <li key={r.n} className="flex gap-3">
                      <span className="font-display text-sm font-semibold text-gold-500">{r.n}</span>
                      <span className="text-[0.85rem] leading-snug text-ink-700">{r.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="text-[0.8rem] leading-relaxed text-ink-500">
                Not booking an event?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-plum-900 underline decoration-gold-400 underline-offset-4"
                >
                  Send us a message
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
