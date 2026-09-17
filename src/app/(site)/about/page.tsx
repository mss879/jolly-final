import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import { FIND_US, IG_QUOTE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Jolly's began — from a shipping container on Marine Drive to permanent carts at Shangri-La Colombo and Hilton Colombo, and 500+ events across Sri Lanka.",
};

const VALUES = [
  {
    t: "Fresh and seasonal",
    c: "Real fruit, fresh cream and a texture somewhere between gelato and ice cream — made for the season, not the shelf.",
  },
  {
    t: "Styled end to end",
    c: "From the gold trim on the cart to the host's uniform, every detail is decided before your guests arrive.",
  },
  {
    t: "Proudly Sri Lankan",
    c: "Jaffna Karutha Columban mango, island strawberries, traditional milk toffee — our island inspires our menu.",
  },
  {
    t: "Joy is the standard",
    c: "You're about to feel good isn't a slogan. It's the brief for every event we serve.",
  },
];

/* Long-form brand story. The client will supply the full text and there is
   no length limit — people who reach this page want the whole story. Each
   chapter is marked CLIENT STORY: replace the paragraphs, keep the structure,
   add chapters freely. Founder facts come from press coverage (More Than Food
   Magazine, 2018) — CLIENT: confirm dates and details. */
const STORY: { heading: string; paragraphs: string[] }[] = [
  {
    // CLIENT STORY: chapter 1 — how and why Jolly's started
    heading: "Where it began",
    paragraphs: [
      "Before the carts there was a kitchen after work. Fazir had come home after more than ten years abroad with an idea that would not leave him alone. Ice cream that made people feel good, not just taste good.",
      "For a year and a half the neighbours were the tasting panel. The flavours were Sri Lankan from the start — cinnamon, cardamom, coconut, Karutha Columban mango, milk toffee. The early tagline was simple: we serve happiness.",
    ],
  },
  {
    // CLIENT STORY: chapter 2 — what makes the ice cream different
    heading: "What we make",
    paragraphs: [
      "Our ice cream sits somewhere between gelato and ice cream — smooth, full and fresh, made with real fruit and fresh cream. The flavours follow the season rather than a fixed list.",
      "Alongside it, dairy-free creamy sorbets — so every guest gets a scoop of the same moment.",
    ],
  },
  {
    // CLIENT STORY: chapter 3 — where the carts are today
    heading: "Where you'll find us",
    paragraphs: [
      FIND_US.line,
      "And at weddings, corporate events and private parties across the island, wherever a host wants the room to lift.",
    ],
  },
  {
    // CLIENT STORY / PLACEHOLDER: chapter 4 — Jolly's at Home (500 ml tubs); launch copy to follow
    heading: "What's next",
    paragraphs: [
      "Jolly's at Home is coming: the same feel-good moment in a 500 ml tub, to share on your own sofa. First flavours will be announced here and on Instagram.",
    ],
  },
];

const FIND_US_CARDS = [
  { kicker: "Colombo", t: FIND_US.anchors[0], c: "A permanent cart in the lobby." },
  { kicker: "Colombo", t: FIND_US.anchors[1], c: "A permanent cart in the lobby." },
  {
    kicker: "Colombo → down south",
    t: "30+ more locations",
    c: "Hotels, cafés and attractions from Colombo down the south coast.",
    link: { href: "/franchise", label: "Host a cart" },
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 pb-16 sm:pt-52">
        <div className="pointer-events-none absolute -top-24 left-[-12rem] h-[26rem] w-[26rem] bg-plum-100/70 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker="About Jolly's"
            title={
              <>
                One belief:
                <span className="italic text-gold-600"> everyone deserves to feel good</span>
              </>
            }
          />
        </div>
      </section>

      <section className="container-luxe pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-5 -left-5 h-24 w-24 border border-gold-300" />
              {/* Real photo from Instagram (The Island Pop Up, 14 Jul 2026) — see public/images/social/CREDITS.md.
                  CLIENT: confirm rights and send the original for the homepage hero. */}
              <Parallax speed={0.07} className="relative aspect-[4/5] overflow-hidden shadow-soft">
                <Image
                  src="/images/social/ig-cart-dusk.jpg"
                  alt="Jolly's Cream cart at dusk under string lights, the host serving a guest"
                  fill
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="scale-110 object-cover"
                />
              </Parallax>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="heading-display text-3xl sm:text-4xl">
                From Marine Drive
                <span className="block italic text-gold-600">to five-star lobbies</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              {/* CLIENT: confirm founder facts (years abroad, 2017, Marine Drive) */}
              <div className="mt-6 space-y-5 text-[0.93rem] leading-relaxed text-ink-700">
                <p>
                  Fazir came home to Sri Lanka after more than ten years abroad
                  with one idea: ice cream that makes people feel good.
                </p>
                <p>
                  In 2017 Jolly&apos;s opened from a shipping container on Marine
                  Drive. The cart came later — built to roll into a ballroom or
                  onto a beach deck and scoop in front of your guests.
                </p>
                <p>
                  Today our carts stand in the lobbies of Shangri-La Colombo and
                  Hilton Colombo. They have served more than 500 weddings,
                  corporate events and private parties across the island.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our story — long form */}
      <section className="border-t border-gold-200/70 py-20 sm:py-24">
        <div className="container-luxe">
          <SectionHeading
            kicker="Our Story"
            title={
              <>
                The whole story,
                <span className="italic text-gold-600"> scoop by scoop</span>
              </>
            }
            rule={false}
          />
          <div className="mx-auto mt-14 max-w-3xl">
            {STORY.map((chapter, i) => (
              <Reveal key={chapter.heading} delay={80} className={i === 0 ? "" : "mt-14"}>
                <p className="kicker flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="heading-display mt-4 text-2xl sm:text-3xl">{chapter.heading}</h3>
                <div className="mt-5 space-y-5 text-[0.97rem] leading-[1.85] text-ink-700">
                  {chapter.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className={
                        i === 0 && j === 0
                          ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-gold-600"
                          : ""
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
                {i === 1 && (
                  <figure className="my-14 border-l-2 border-gold-400 pl-6">
                    <blockquote className="font-display text-2xl text-plum-900 italic sm:text-3xl">
                      &ldquo;{IG_QUOTE.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-[0.68rem] font-semibold tracking-[0.2em] text-gold-600 uppercase">
                      {IG_QUOTE.source}
                    </figcaption>
                  </figure>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-200/60 py-20">
        <div className="container-luxe">
          <SectionHeading
            kicker="What Guides Us"
            title={
              <>
                Four promises,
                <span className="italic text-gold-600"> kept at every event</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 100}>
                <div className="h-full border border-gold-200/70 bg-cream-50 p-7">
                  <span className="font-display text-2xl font-semibold text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-plum-900">{v.t}</h3>
                  <p className="mt-2.5 text-[0.83rem] leading-relaxed text-ink-500">{v.c}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Where to find us — two anchor venues + a count, never the full list */}
      <section id="find-us" className="container-luxe scroll-mt-32 py-20">
        <SectionHeading
          kicker="Where You'll Find Us"
          title={
            <>
              Shangri-La, Hilton,
              <span className="italic text-gold-600"> and 30+ places down south</span>
            </>
          }
          copy={FIND_US.line}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FIND_US_CARDS.map((card, i) => (
            <Reveal key={card.t} delay={i * 110}>
              <div className="flex h-full flex-col border border-gold-200/70 bg-cream-50 p-7">
                <p className="kicker">{card.kicker}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-plum-900">{card.t}</h3>
                <p className="mt-2.5 flex-1 text-[0.85rem] leading-relaxed text-ink-500">{card.c}</p>
                {card.link && (
                  <Link
                    href={card.link.href}
                    className="group mt-5 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.18em] text-plum-900 uppercase"
                  >
                    {card.link.label}
                    <span className="inline-block h-px w-6 bg-gold-500 transition-all duration-300 group-hover:w-10" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
