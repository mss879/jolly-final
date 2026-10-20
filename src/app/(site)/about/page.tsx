import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Parallax from "@/components/Parallax";
import ParallaxBanner from "@/components/ParallaxBanner";
import ReadingProgress from "@/components/ReadingProgress";
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
   length and set in three chapters (the milestones band, the "What we make"
   flavour cards and the closing invitation + marquee came out on the
   client's review, Oct 2026). Animations
   come from <Unveil> (masked lines, image wipes, fades) and <ScrollWords>. */

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

      {/* 01 The beginning. No photo here (client, Oct 2026): the headline
          on the left, the story and the question on the right. */}
      <section className="py-24 sm:py-32">
        <Unveil className="container-luxe grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-6">
            <ChapterMark n="01" label="The Beginning" />
            <h2 className={h2}>
              <Lines start={120} lines={["Great things begin", <span key="2" className="italic text-gold-600">as a blank canvas.</span>]} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className={`fade max-w-lg text-ink-700 ${body}`} style={delay(380)}>
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
              <p className={`mt-2 text-ink-700 ${body}`}>A boutique shop at Marine Drive, Colombo.</p>
            </li>
            <li className="fade relative mt-10 pl-10" style={delay(550)}>
              <span aria-hidden className="absolute top-3 left-0 h-[11px] w-[11px] rounded-full bg-plum-900" />
              <p className="font-display text-3xl font-semibold text-plum-900">Today</p>
              <p className={`mt-2 text-ink-700 ${body}`}>
                The lobbies of prominent hotels and boutique villas.
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
    </>
  );
}
