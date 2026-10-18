import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import Parallax from "@/components/Parallax";
import ParallaxBanner from "@/components/ParallaxBanner";
import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
import ScrollWords from "@/components/ScrollWords";
import Unveil from "@/components/Unveil";
import { SMILEY } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "The Jolly's story: a blank canvas in Colombo in 2017, a cart built to arrive, and flavours that belong to no rules. Now at Shangri-La and Hilton Colombo.",
  path: "/about",
});

/* The story is the client's own text (Oct 2026), tightened to about half its
   length and set in five chapters. Animations come from <Unveil> (masked
   lines, image wipes, fades), <CountUp> and <ScrollWords>. */

const MILESTONES: { value?: string; count?: number; label: string }[] = [
  { value: "2017", label: "Founded in Colombo" },
  { count: 500, label: "Events served" },
  { count: 30, label: "Locations island-wide" },
  { value: "∞", label: "Possible flavours" },
];

const WHAT_WE_MAKE = [
  {
    t: "Slow-churned ice cream",
    c: "More fresh milk, a slower churn: denser, and somewhere between gelato and ice cream.",
    image: "/images/flavors/jaffna-mango.png",
    alt: "A scoop of Jaffna mango ice cream",
  },
  {
    t: "Dairy-free sorbets",
    c: "Rice milk and natural alternatives, just as creamy and bold. Inclusivity is a principle, not a compromise.",
    image: "/images/flavors/passion-fruit-sorbet.png",
    alt: "A scoop of passion fruit sorbet",
  },
  {
    t: "Seasonal originals",
    c: "A new ingredient each season: a flavour of the month that might become a lasting love.",
    image: "/images/flavors/flavour-of-the-month.png",
    alt: "A scoop of the flavour of the month",
  },
];

const MARQUEE = [
  "Events island-wide",
  "Shangri-La Colombo",
  "Hilton Colombo",
  "30+ locations",
  "500 ml tubs, coming home soon",
];

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/* Headline lines that rise one after another, each from behind its own mask. */
function Lines({ lines, start = 0, step = 120 }: { lines: ReactNode[]; start?: number; step?: number }) {
  return lines.map((line, i) => (
    <span key={i} className="mask">
      <span style={delay(start + i * step)}>{line}</span>
    </span>
  ));
}

function ChapterMark({ n, label, light = false, center = false }: { n: string; label: string; light?: boolean; center?: boolean }) {
  return (
    <p
      className={`fade flex items-center gap-4 text-[0.7rem] font-semibold tracking-[0.3em] uppercase ${
        light ? "text-gold-300" : "text-gold-700"
      } ${center ? "justify-center" : ""}`}
    >
      <span className="font-display text-base tracking-normal">{n}</span>
      <span className="draw-x h-px w-12 bg-current" style={delay(200)} />
      {label}
    </p>
  );
}

const h2 = "heading-display mt-6 text-4xl sm:text-5xl lg:text-[3.6rem] lg:leading-[1.04]";
const body = "text-[0.97rem] leading-[1.85]";

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Our Story", path: "/about" }])} />
      <ReadingProgress />

      {/* Opening */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-[-14rem] h-[30rem] w-[30rem] rounded-full bg-plum-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-[-12rem] bottom-[-6rem] h-[28rem] w-[28rem] rounded-full bg-gold-200/40 blur-3xl" />
        <Unveil
          afterPreloader
          className="container-luxe relative grid items-center gap-16 pt-36 pb-20 sm:pt-44 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-10 lg:pt-32 lg:pb-16"
        >
          <div className="lg:col-span-7">
            <p className="fade kicker flex items-center gap-3">
              <span className="draw-x h-px w-8 bg-gold-500" style={delay(150)} />
              Jolly&apos;s Creamery · Est. 2017
            </p>
            <h1 className="heading-display mt-8 text-[3.5rem] leading-[0.98] sm:text-[5.25rem] xl:text-[6.4rem]">
              <Lines
                start={150}
                step={140}
                lines={[
                  "You’re about",
                  "to feel",
                  <>
                    <span className="italic text-gold-600">good.</span>
                    <span
                      aria-hidden
                      className="ml-[0.2em] inline-block align-[0.35em] text-[0.38em] opacity-0 in-[.is-in]:animate-pop in-[.is-in]:[animation-delay:1150ms]"
                    >
                      {SMILEY}
                    </span>
                  </>,
                ]}
              />
            </h1>
            <p className="fade mt-8 max-w-md font-display text-xl text-ink-700 italic sm:text-2xl" style={delay(700)}>
              An ice cream story from the heart of Ceylon.
            </p>
            <div className="fade mt-14 flex items-center gap-4" style={delay(950)}>
              <span className="relative h-14 w-px overflow-hidden bg-gold-300/60">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-plum-900" />
              </span>
              <span className="text-[0.64rem] font-semibold tracking-[0.32em] text-ink-500 uppercase">Scroll</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <div className="fade absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-card border border-gold-300" style={delay(700)} />
              {/* Real photo from Instagram (The Island Pop Up, 14 Jul 2026), see docs/image-credits.md */}
              <Parallax speed={0.06}>
                <div className="wipe relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-card shadow-soft" style={delay(250)}>
                  <Image
                    src="/images/social/ig-cart-dusk.jpg"
                    alt="Jolly's Vanilla Cream cart at dusk under string lights, the host serving a guest"
                    fill
                    preload
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </Parallax>
            </div>
          </div>
        </Unveil>
      </section>

      {/* 01 The beginning */}
      <section className="py-24 sm:py-32">
        <Unveil className="container-luxe grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Parallax speed={0.07}>
            <div className="wipe relative aspect-[4/3] overflow-hidden rounded-card shadow-soft">
              <Image
                src="/images/scenes/about-craft.jpg"
                alt="A gold scoop drawn through fresh vanilla ice cream, split vanilla pods alongside"
                fill
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 92vw"
                className="scale-110 object-cover"
              />
            </div>
          </Parallax>
          <div>
            <ChapterMark n="01" label="The Beginning" />
            <h2 className={h2}>
              <Lines start={120} lines={["Great things begin", <span key="2" className="italic text-gold-600">as a blank canvas.</span>]} />
            </h2>
            <p className={`fade mt-7 max-w-lg text-ink-700 ${body}`} style={delay(380)}>
              Before the first scoop there was no recipe, only a canvas: Ceylon spice meeting
              European technique, frangipani folded into hand-churned ice cream.
            </p>
            <div className="fade mt-9 border-l-2 border-gold-400 pl-6" style={delay(520)}>
              <p className="text-[0.66rem] font-semibold tracking-[0.24em] text-gold-700 uppercase">
                One question
              </p>
              <p className="mt-3 font-display text-2xl leading-snug text-plum-900 italic sm:text-[1.75rem]">
                What can we make that the world hasn’t tasted yet?
              </p>
            </div>
          </div>
        </Unveil>
      </section>

      {/* Milestones */}
      <section className="border-y border-gold-200/70 bg-cream-50">
        <Unveil threshold={0.4} className="container-luxe grid grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((m, i) => (
            <div
              key={m.label}
              className={`fade px-4 py-12 text-center sm:py-14 ${i % 2 ? "border-l border-gold-200/70" : ""} ${
                i > 0 ? "lg:border-l lg:border-gold-200/70" : ""
              } ${i > 1 ? "border-t border-gold-200/70 lg:border-t-0" : ""}`}
              style={delay(i * 120)}
            >
              <p className="font-display text-5xl font-semibold text-plum-900 sm:text-6xl">
                {m.count ? <CountUp to={m.count} suffix="+" /> : m.value}
              </p>
              <p className="mt-3 text-[0.64rem] font-semibold tracking-[0.22em] text-ink-500 uppercase">{m.label}</p>
            </div>
          ))}
        </Unveil>
      </section>

      {/* 02 The philosophy */}
      <section className="relative overflow-hidden bg-plum-950 py-24 sm:py-32">
        <div className="pointer-events-none absolute -top-40 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-luxe relative">
          <Unveil className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <ChapterMark n="02" label="The Philosophy" light />
              <h2 className={`${h2} !text-cream-100`}>
                <Lines start={120} lines={["It was never", <span key="2" className="italic text-gold-300">about the ice cream.</span>]} />
              </h2>
            </div>
            <p className={`fade text-cream-100/75 lg:col-span-5 ${body}`} style={delay(400)}>
              We don&apos;t just make ice cream. We make the feeling that arrives a split second
              before the first taste.
            </p>
          </Unveil>

          <figure className="mx-auto mt-20 max-w-5xl sm:mt-28">
            <span aria-hidden className="block font-display text-7xl leading-[0.6] text-gold-400 sm:text-8xl">
              &ldquo;
            </span>
            <ScrollWords
              text="Ice cream is an emotion. We give it a flavour, and you give it a memory."
              className="mt-1 font-display text-[2rem] leading-[1.22] text-cream-100 sm:text-5xl sm:leading-[1.18] lg:text-[3.5rem]"
            />
          </figure>

          <Unveil className="mt-20 grid items-center gap-12 sm:mt-28 lg:grid-cols-2 lg:gap-20">
            <Parallax speed={0.06}>
              <div className="wipe relative aspect-[3/2] overflow-hidden rounded-card">
                <Image
                  src="/images/scenes/scene-six-scoops.webp"
                  alt="Six cups of ice cream in different colours on a marble table, each with a gold spoon"
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 92vw"
                  className="scale-110 object-cover"
                />
              </div>
            </Parallax>
            <div>
              <p className="fade font-display text-2xl leading-snug text-cream-100 sm:text-[2rem]" style={delay(200)}>
                The joy starts the moment the cart arrives, when you can’t decide and want
                everything.
              </p>
            </div>
          </Unveil>
        </div>
      </section>

      {/* 03 The experience */}
      <section className="py-24 sm:py-32">
        <Unveil className="container-luxe grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <ChapterMark n="03" label="The Experience" />
            <h2 className={h2}>
              <Lines start={120} lines={["The cart was never", <span key="2" className="italic text-gold-600">just a cart.</span>]} />
            </h2>
            <p className="fade mt-8 font-display text-2xl text-plum-900 sm:text-[1.75rem]" style={delay(380)}>
              Most ice cream waits for you.{" "}
              <span className="italic text-gold-600 sm:block">Ours arrives.</span>
            </p>
            <p className={`fade mt-5 max-w-lg text-ink-700 ${body}`} style={delay(480)}>
              People stop and smile before they&apos;ve even ordered. The cart isn&apos;t a serving
              unit. It&apos;s an arrival.
            </p>
          </div>

          <ol className="relative self-center lg:col-span-5 lg:col-start-8">
            <span aria-hidden className="draw-y absolute top-3 bottom-3 left-[5px] w-px bg-gold-300" style={delay(300)} />
            <li className="fade relative pl-10" style={delay(350)}>
              <span aria-hidden className="absolute top-3 left-0 h-[11px] w-[11px] rounded-full border border-gold-500 bg-cream-100" />
              <p className="font-display text-3xl font-semibold text-gold-600">2017</p>
              <p className={`mt-2 text-ink-700 ${body}`}>A shipping container on Marine Drive, Colombo.</p>
            </li>
            <li className="fade relative mt-10 pl-10" style={delay(550)}>
              <span aria-hidden className="absolute top-3 left-0 h-[11px] w-[11px] rounded-full bg-plum-900" />
              <p className="font-display text-3xl font-semibold text-plum-900">Today</p>
              <p className={`mt-2 text-ink-700 ${body}`}>
                The lobbies of Shangri-La Colombo and Hilton Colombo.
              </p>
            </li>
            <li className="fade relative mt-10 pl-10" style={delay(750)}>
              <span aria-hidden className="absolute top-2.5 left-[1px] h-[9px] w-[9px] rotate-45 bg-gold-500" />
              <p className="font-display text-xl leading-snug text-plum-900 italic">
                It travels everywhere, and lands the same way every time.
              </p>
            </li>
          </ol>
        </Unveil>
      </section>

      <ParallaxBanner
        image="/images/scenes/hero-cart-banner.jpg"
        mobileImage="/images/carts/cart-lobby-cream.jpeg"
        imageClassName="object-contain scale-80 md:scale-100 md:object-cover"
        alt="A Vanilla Cream Jolly's bicycle cart with its host in a bright hotel lobby"
        heightClass="min-h-[72vh]"
        overlay="bg-plum-950/60 md:bg-transparent md:bg-gradient-to-r md:from-plum-950/85 md:via-plum-950/50 md:via-45% md:to-plum-950/0 md:to-75%"
      >
        <Unveil className="max-w-3xl">
          <p className="font-display text-3xl leading-[1.15] text-cream-100 [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] sm:text-5xl lg:text-[3.1rem]">
            <Lines lines={["When the cart arrives,", "something in the room changes."]} step={160} />
          </p>
          <p className="fade mt-6 font-display text-2xl text-gold-300 italic sm:text-3xl" style={delay(520)}>
            That is designed.
          </p>
        </Unveil>
      </ParallaxBanner>

      {/* 04 What we make */}
      <section className="relative bg-cream-50 py-24 sm:py-32">
        <div className="container-luxe">
          <Unveil className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <ChapterMark n="04" label="What We Make" />
              <h2 className={h2}>
                <Lines start={120} lines={["Flavours that belong", <span key="2" className="italic text-gold-600">to no rules.</span>]} />
              </h2>
            </div>
            <div className="fade lg:col-span-5" style={delay(380)}>
              <p className={`text-ink-700 ${body}`}>
                The best of Ceylon, paired freely with techniques from around the world.
                Unexpected, and deliciously adventurous.
              </p>
              <p className="mt-5 font-display text-xl leading-snug text-gold-600 italic sm:text-2xl">
                Kiribath with pol pani.
                <br />
                Frangipani with goat milk.
              </p>
            </div>
          </Unveil>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {WHAT_WE_MAKE.map((m, i) => (
              <Reveal key={m.t} delay={i * 130} className="h-full">
                <article className="group h-full rounded-card border border-gold-200/70 bg-cream-100 px-7 pt-7 pb-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
                  <span className="font-display text-sm text-gold-700">{String(i + 1).padStart(2, "0")}</span>
                  <div className="relative mx-auto mt-1 h-40 w-40 animate-float" style={{ animationDelay: `${i * -2.4}s` }}>
                    <Image
                      src={m.image}
                      alt={m.alt}
                      fill
                      sizes="160px"
                      className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105 group-hover:-rotate-3"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-plum-900 md:min-h-[2lh] md:text-xl lg:text-2xl xl:min-h-0">{m.t}</h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-500">{m.c}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link
              href="/flavors"
              className="group inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.18em] text-plum-900 uppercase"
            >
              Explore flavours
              <span className="inline-block h-px w-6 bg-gold-500 transition-all duration-300 group-hover:w-10" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 05 An invitation */}
      <section className="relative overflow-hidden pt-24 sm:pt-32">
        <div className="pointer-events-none absolute top-0 left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-gold-200/30 blur-3xl" />
        <Unveil className="container-luxe relative text-center">
          <figure className="fade mx-auto max-w-xl">
            <blockquote className="font-display text-xl leading-snug text-balance text-ink-700 italic sm:text-2xl">
              &ldquo;The most joyful possibilities lie somewhere in the unknown.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[0.64rem] font-semibold tracking-[0.24em] text-gold-700 uppercase">
              Our vision
            </figcaption>
          </figure>
          <div className="mx-auto mt-16 h-px w-24 bg-gold-300" />
          <div className="mt-16">
            <ChapterMark n="05" label="An Invitation" center />
          </div>
          <h2 className={`${h2} mx-auto max-w-4xl sm:text-6xl lg:text-[4.1rem]`}>
            <Lines start={120} lines={["Come with whatever", <span key="2" className="italic text-gold-600">you’re in the mood for.</span>]} />
          </h2>
          <p className={`fade mx-auto mt-8 max-w-xl text-ink-700 ${body}`} style={delay(400)}>
            Come curious. Come dairy-free or indulgent. Come for the flavour you love, or the one
            you haven&apos;t found yet.
          </p>
          <p className="fade mt-6 font-display text-2xl text-plum-900 italic sm:text-3xl" style={delay(520)}>
            Jolly’s is a canvas. You decide what goes on it.
          </p>
        </Unveil>

        <div className="mt-20 overflow-hidden border-y border-gold-300/60 py-6 sm:mt-28">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {MARQUEE.map((m) => (
                  <li key={m} className="flex items-center gap-10 pr-10 font-display text-xl whitespace-nowrap text-plum-900 italic sm:text-2xl">
                    {m}
                    <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
