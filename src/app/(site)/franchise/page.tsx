import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import { BADGE_STAT, CONTACT, FRANCHISE, STATS } from "@/lib/data";

/* Footer-only page (the client took Franchise out of the main nav). */
export const metadata: Metadata = {
  title: "Franchise & Venue Partnerships",
  description:
    "Host a permanently placed, fully serviced Jolly's ice cream cart at your hotel, café or attraction — revenue-share and rental models across Sri Lanka.",
};

export default function FranchisePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-16 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] bg-gold-200/40 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker={FRANCHISE.kicker}
            title={
              <>
                A cart your guests
                <span className="italic text-gold-600"> will gather around</span>
              </>
            }
            copy={FRANCHISE.intro}
          />
        </div>
      </section>

      <section className="container-luxe pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-20 w-20 border border-gold-300" />
              <Parallax speed={0.07} className="relative aspect-[4/5] overflow-hidden shadow-soft">
                <Image
                  src="/images/carts/cart-lobby-crimson.jpeg"
                  alt="Ferrari Red Jolly's cart placed in a hotel lobby"
                  fill
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="scale-110 object-cover"
                />
              </Parallax>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="kicker flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                What You Get
              </p>
              <h2 className="heading-display mt-4 text-3xl sm:text-4xl">
                Placed, stocked and staffed by us
              </h2>
              <p className="mt-5 text-[0.93rem] leading-relaxed text-ink-700">
                We handle the cart, the stock, the host and the upkeep. You offer
                your guests a live ice cream moment — and a dessert line that earns.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {FRANCHISE.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[0.85rem] leading-snug text-ink-700">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" fill="currentColor">
                      <path d="M10 0l2.4 5.1L18 6l-4 4 1 5.9L10 13l-5 2.9L6 10 2 6l5.6-.9L10 0z" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={200}>
              <dl className="mt-9 grid grid-cols-3 gap-4">
                {[BADGE_STAT, STATS[0], STATS[1]].map(([n, l]) => (
                  <div key={l} className="border border-gold-200/70 bg-cream-50 px-4 py-5 text-center">
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display text-2xl font-semibold text-plum-900">{n}</dd>
                    <dd className="mt-1 text-[0.6rem] font-semibold tracking-[0.14em] text-ink-500 uppercase">{l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Partnership models — CLIENT: confirm commercial terms before launch */}
      <section className="bg-cream-200/60 py-20">
        <div className="container-luxe">
          <SectionHeading
            kicker="Partnership Models"
            title={
              <>
                Two ways to
                <span className="italic text-gold-600"> partner with us</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {FRANCHISE.models.map((m, i) => (
              <Reveal key={m.t} delay={i * 110}>
                <div className="h-full border border-gold-200/70 bg-cream-50 p-8">
                  <span className="font-display text-2xl font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-plum-900">{m.t}</h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-500">{m.c}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxe py-20 text-center">
        <Reveal>
          <p className="kicker flex items-center justify-center gap-3">Let&apos;s Talk</p>
          <h2 className="heading-display mt-5 text-3xl sm:text-5xl">
            Want a Jolly&apos;s cart at
            <span className="italic text-gold-600"> your venue?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[0.93rem] leading-relaxed text-ink-700">
            Tell us about your property and your footfall — we&apos;ll come back with
            the model that fits.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/reserve?type=franchise"
              className="rounded-btn bg-plum-900 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
            >
              Start the conversation
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="rounded-btn border border-gold-500 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
            >
              {CONTACT.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
