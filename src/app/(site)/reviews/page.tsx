import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ReviewCard from "@/components/ReviewCard";
import RecentEvents from "@/components/RecentEvents";
import Reveal from "@/components/Reveal";
import { GoogleG, Stars } from "@/components/GoogleBadge";
import { CONTACT, CTA } from "@/lib/data";
import { getGoogleReviews, reviewCountLabel } from "@/lib/google-reviews";
import { getPublishedEvents } from "@/lib/recent-events";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Reviews, straight from Google, and recent events: what hosts and guests say about Jolly's on Wheels at weddings, corporate events and parties across Sri Lanka.",
};

/* Rebuilt at most hourly. Publishing or editing an event in the admin
   refreshes it straight away; the Google answer is cached for six hours. */
export const revalidate = 3600;

export default async function ReviewsPage() {
  const [google, events] = await Promise.all([getGoogleReviews(), getPublishedEvents()]);

  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-14 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold-200/40 blur-3xl" />
        <div className="container-luxe grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading
              kicker="Reviews"
              title={
                <>
                  The feeling, in their
                  <span className="italic text-gold-600"> own words</span>
                </>
              }
              copy="Straight from Google, unedited, and a look at the events we've served lately."
            />

            <Reveal className="mt-10 max-w-md">
              <a
                href={google.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-5 rounded-card border border-gold-200/80 bg-cream-50 px-8 py-6 shadow-card transition-colors hover:border-gold-400"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-btn bg-white shadow-[0_4px_14px_-4px_rgba(50,0,75,0.25)]">
                  <GoogleG className="h-7 w-7" />
                </span>
                <span>
                  <span className="flex items-end gap-2">
                    <span className="font-display text-4xl leading-none font-semibold text-plum-900">{google.rating}</span>
                    <Stars n={Math.round(Number(google.rating))} className="mb-1 h-4 w-4" />
                  </span>
                  <span className="mt-1.5 block text-[0.7rem] font-medium tracking-[0.16em] text-ink-500 uppercase">
                    Based on {reviewCountLabel(google)}
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
          {/* Real photo from the client's Instagram (24 Jun 2026) — see public/images/social/CREDITS.md */}
          <Reveal delay={160} className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-soft">
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

      {/* Google reviews */}
      <section className="container-luxe pb-20" aria-labelledby="google-reviews">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold-300/70 pb-6">
          <h2 id="google-reviews" className="heading-display text-3xl sm:text-4xl">
            Google reviews
          </h2>
          <p className="flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] text-ink-500 uppercase">
            <GoogleG className="h-4 w-4" />
            Reviews from Google
          </p>
        </div>

        {google.reviews.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {google.reviews.map((r, i) => (
              <ReviewCard key={r.key} review={r} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-ink-500">Read what our guests say on Google.</p>
        )}

        <Reveal className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href={google.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-btn border border-gold-400 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
          >
            <GoogleG className="h-4 w-4" />
            All reviews on Google
          </a>
          <a
            href={google.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.75rem] font-semibold tracking-[0.18em] text-ink-700 uppercase underline decoration-gold-400 underline-offset-4 transition-colors hover:text-plum-900"
          >
            Hosted with us? Leave a review
          </a>
        </Reveal>
        {google.credit && (
          <p className="mt-6 text-[0.68rem] text-ink-500">
            <a href={google.credit.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-plum-900">
              {google.credit.label}
            </a>
          </p>
        )}
      </section>

      {/* Recent events — managed in /admin/events */}
      {events.length > 0 && (
        <section className="bg-cream-200/60 py-20 sm:py-24" aria-labelledby="recent-events">
          <div className="container-luxe">
            <div className="border-b border-gold-300/70 pb-6">
              <h2 id="recent-events" className="heading-display text-3xl sm:text-4xl">
                Recent events
              </h2>
              <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-ink-700">
                Weddings, galas and celebrations we&apos;ve scooped at lately.
              </p>
            </div>
            <div className="mt-10">
              <RecentEvents events={events} />
            </div>
          </div>
        </section>
      )}

      <section className="container-luxe py-20 text-center">
        <Reveal>
          <p className="font-display text-2xl text-plum-900 italic">Your event could be next.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
            <Link
              href={CTA.href}
              className="inline-flex rounded-btn bg-plum-900 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
            >
              {CTA.label}
            </Link>
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
