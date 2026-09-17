import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import { SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "You host the event, we bring the mood — ice cream carts with a live host for weddings, corporate events, private parties and brand collaborations.",
};

const STEPS = [
  ["Tell us about your event", "Date, venue, guest count and the feeling you want to create."],
  ["We style your cart", "Cart colour and flavour menu chosen with you, to match your palette."],
  ["We arrive and set the scene", "Fully chilled, fully staffed — before your first guest walks in."],
  ["Guests feel good", "Live scoops, a smiling host, and the room finds its mood."],
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-16 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] bg-gold-200/40 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker="Our Services"
            title={
              <>
                Whatever the occasion,
                <span className="italic text-gold-600"> we bring the mood</span>
              </>
            }
            copy="Weddings, corporate events, private parties and brand collaborations — a styled cart, a live host, and ice creams and dairy-free sorbets so every guest joins in."
          />
        </div>
      </section>

      <section className="container-luxe flex flex-col gap-20 pb-20 sm:gap-24">
        {SERVICES.map((s, i) => (
          <div
            key={s.slug}
            id={s.slug}
            className={`grid scroll-mt-32 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <Reveal>
              <div className="relative">
                <div className={`absolute -top-4 h-20 w-20  border border-gold-300 ${i % 2 ? "-right-4" : "-left-4"}`} />
                <Parallax speed={0.07} className={`relative overflow-hidden shadow-soft ${s.imagePortrait ? "aspect-[4/5]" : "aspect-[3/2]"}`}>
                  <Image
                    src={s.image}
                    alt={s.title}
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
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="heading-display mt-4 text-3xl sm:text-4xl">{s.title}</h2>
                <p className="mt-3 font-display text-lg text-gold-600 italic">{s.blurb}</p>
                <p className="mt-5 text-[0.93rem] leading-relaxed text-ink-700">{s.description}</p>
              </Reveal>
              <Reveal delay={140}>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[0.85rem] leading-snug text-ink-700">
                      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" fill="currentColor">
                        <path d="M10 0l2.4 5.1L18 6l-4 4 1 5.9L10 13l-5 2.9L6 10 2 6l5.6-.9L10 0z" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={220}>
                <Link
                  href={`/reserve?type=${s.slug}`}
                  className="mt-8 inline-flex rounded-btn bg-plum-900 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
                >
                  Enquire about {s.title}
                </Link>
              </Reveal>
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="bg-cream-200/60 py-20">
        <div className="container-luxe">
          <SectionHeading
            kicker="How It Works"
            title={
              <>
                Effortless for you,
                <span className="italic text-gold-600"> memorable for your guests</span>
              </>
            }
          />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, c], i) => (
              <Reveal key={t} delay={i * 100} as="li">
                <div className="relative h-full border border-gold-200/70 bg-cream-50 p-7 pt-9">
                  <span className="absolute -top-5 left-7 flex h-10 w-10 items-center justify-center bg-plum-900 font-display text-sm font-semibold text-cream-100 shadow-soft">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg leading-snug font-semibold text-plum-900">{t}</h3>
                  <p className="mt-2.5 text-[0.83rem] leading-relaxed text-ink-500">{c}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Franchise path — left the nav, still reachable from Services */}
      <section className="container-luxe py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border border-gold-200/70 bg-cream-50 px-8 py-9 sm:flex-row sm:items-center">
            <div>
              <p className="kicker">Own a venue?</p>
              <p className="mt-2 font-display text-xl text-plum-900 sm:text-2xl">
                A permanently placed Jolly&apos;s cart for your hotel, café or attraction.
              </p>
            </div>
            <Link
              href="/franchise"
              className="inline-flex shrink-0 items-center gap-3 rounded-btn border border-gold-400 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
            >
              Explore venue partnerships
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
