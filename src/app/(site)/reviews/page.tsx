import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import ReviewCard from "@/components/ReviewCard";
import Reveal from "@/components/Reveal";
import { GoogleG, Stars } from "@/components/GoogleBadge";
import { GOOGLE_RATING, REVIEWS, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Honest Reviews",
  description:
    "Honest reviews, straight from Google — what hosts and guests say about Jolly's on Wheels at weddings, corporate events and parties across Sri Lanka.",
};

export default function ReviewsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-14 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] bg-gold-200/40 blur-3xl" />
        <div className="container-luxe grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
          <SectionHeading
            kicker="Honest Reviews"
            title={
              <>
                The feeling, in their
                <span className="italic text-gold-600"> own words</span>
              </>
            }
            copy="Straight from Google, unedited. Real hosts, real events — a wedding, a gala, a birthday."
          />

          <Reveal className="mt-10 max-w-md">
            <div className="flex items-center justify-center gap-5 border border-gold-200/80 bg-cream-50 px-8 py-6 shadow-card">
              <span className="flex h-14 w-14 items-center justify-center bg-white shadow-[0_4px_14px_-4px_rgba(50,0,75,0.25)]">
                <GoogleG className="h-7 w-7" />
              </span>
              <div>
                <div className="flex items-end gap-2">
                  <span className="font-display text-4xl leading-none font-semibold text-plum-900">
                    {GOOGLE_RATING.score}
                  </span>
                  <Stars className="mb-1 h-4 w-4" />
                </div>
                <p className="mt-1.5 text-[0.7rem] font-medium tracking-[0.16em] text-ink-500 uppercase">
                  Based on {GOOGLE_RATING.count} Google reviews
                </p>
              </div>
            </div>
          </Reveal>
          </div>
          {/* Real photo from the client's Instagram (24 Jun 2026) — see public/images/social/CREDITS.md */}
          <Reveal delay={160} className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden shadow-soft">
              <Image
                src="/images/social/ig-couple-bw.jpg"
                alt="A couple laughing with ice cream cups at a wedding"
                fill
                sizes="(min-width: 1024px) 34vw, 0px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={r.name} review={r} index={i} />
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="font-display text-xl text-plum-900 italic">Hosted an event with us?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
            A Google review helps other hosts find their moment of joy — and it
            makes our day.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.google.com/search?q=Jolly%27s+Creamery+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-btn border border-gold-400 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
            >
              <GoogleG className="h-4 w-4" />
              Review us on Google
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.75rem] font-semibold tracking-[0.18em] text-ink-700 uppercase underline decoration-gold-400 underline-offset-4 transition-colors hover:text-plum-900"
            >
              Tag us @jollys_creamery
            </a>
          </div>
        </Reveal>
      </section>

    </>
  );
}
