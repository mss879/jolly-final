import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import FlavorCard, { DEFAULT_FLAVOR_VARIANT, FLAVOR_GRID } from "@/components/FlavorCard";
import Reveal from "@/components/Reveal";
import ReviewCard from "@/components/ReviewCard";
import Parallax from "@/components/Parallax";
import ParallaxBanner from "@/components/ParallaxBanner";
import { GoogleG, Stars } from "@/components/GoogleBadge";
import { BADGE_STAT, CARTS, FIND_US, FLAVORS, GOOGLE_RATING, REASONS, REVIEWS, SERVICES, STATS } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      {/* Statement */}
      <section className="container-luxe py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-5 -left-5 h-24 w-24 border border-gold-300" />
              <Parallax speed={0.08} className="relative overflow-hidden shadow-soft">
                <Image
                  src="/images/scenes/scene-wedding.jpg"
                  alt="Jolly's cream and gold cart at a candlelit garden wedding"
                  width={900}
                  height={600}
                  className="h-full w-full scale-110 object-cover"
                />
              </Parallax>
              <div className="absolute -right-4 -bottom-6 hidden border border-gold-200 bg-cream-50 px-6 py-5 shadow-card sm:block">
                <p className="font-display text-3xl leading-none font-semibold text-plum-900">{BADGE_STAT[0]}</p>
                <p className="mt-1 text-[0.62rem] font-semibold tracking-[0.18em] text-ink-500 uppercase">
                  {BADGE_STAT[1]}
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              kicker="The Jolly's Experience"
              title={
                <>
                  Elegant décor, live scoops,
                  <span className="italic text-gold-600"> joyful memories</span>
                </>
              }
            />
            <Reveal delay={120}>
              <p className="mt-8 font-display text-xl leading-snug text-plum-900 sm:text-2xl">
                A live ice cream station, tailored to complement the unique
                ambience of your event.
              </p>
              <p className="mt-5 max-w-xl text-[0.92rem] leading-relaxed text-ink-500">
                Wedding, corporate evening or private party: the mood lifts the
                moment the cart rolls in, and guests remember the night for it.
              </p>
              <p className="mt-5 max-w-xl border-l-2 border-gold-400 pl-4 text-[0.9rem] leading-relaxed text-plum-900">
                {FIND_US.line}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <dl className="mt-9 grid grid-cols-3 gap-4">
                {STATS.map(([n, l]) => (
                  <div key={l} className="border border-gold-200/70 bg-cream-50 px-4 py-5 text-center">
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display text-2xl font-semibold text-plum-900">{n}</dd>
                    <dd className="mt-1 text-[0.6rem] font-semibold tracking-[0.14em] text-ink-500 uppercase">{l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={260}>
              <Link
                href="/about"
                className="group mt-9 inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.18em] text-plum-900 uppercase"
              >
                Read our story
                <span className="inline-block h-px w-6 bg-gold-500 transition-all duration-300 group-hover:w-10" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Parallax statement strip — why an ice cream cart.
          CLIENT: when the background clip arrives, add
          video={{ webm: "/video/why-cart.webm", mp4: "/video/why-cart.mp4" }} */}
      <ParallaxBanner
        image="/images/scenes/scene-party.jpg"
        alt="Pastel scoops in ivory cups with gold spoons on marble"
      >
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="kicker !text-gold-300">The Feel-Good Moment</p>
          <p className="heading-display mt-6 !text-cream-100 text-3xl leading-snug sm:text-5xl">
            Every scoop is a small ceremony —
            <span className="italic text-gold-300"> styled, served and savoured.</span>
          </p>
          <p className="mx-auto mt-7 max-w-2xl font-display text-lg leading-snug text-cream-100 sm:text-xl">
            Guests visit the coffee bar and the cake table. They queue for this
            one.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream-100/80">
            A cart and a host turn the last hour of your event into the part
            everyone remembers.
          </p>
        </Reveal>
      </ParallaxBanner>

      {/* Google reviews — its own section */}
      <section className="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-200" />
        <div className="pointer-events-none absolute -top-20 right-[-10rem] h-80 w-80 rounded-full bg-gold-200/30 blur-3xl" />
        <div className="container-luxe">
          <SectionHeading
            kicker="Loved On Google"
            title={
              <>
                Rated {GOOGLE_RATING.score} by the people
                <span className="italic text-gold-600"> we&apos;ve served</span>
              </>
            }
          />
          <Reveal delay={100} className="mt-10 flex justify-start">
            <div className="flex items-center gap-5 border border-gold-200 bg-white px-8 py-5 shadow-card">
              <GoogleG className="h-8 w-8" />
              <div className="h-10 w-px bg-gold-200" />
              <div>
                <div className="flex items-end gap-2">
                  <span className="font-display text-3xl leading-none font-semibold text-plum-900">
                    {GOOGLE_RATING.score}
                  </span>
                  <Stars className="mb-0.5 h-4 w-4" />
                </div>
                <p className="mt-1 text-[0.64rem] font-semibold tracking-[0.18em] text-ink-500 uppercase">
                  {GOOGLE_RATING.count} Google reviews
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVIEWS.slice(0, 3).map((r, i) => (
              <ReviewCard key={r.name} review={r} index={i} />
            ))}
          </div>
          <Reveal className="mt-14">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-3 rounded-btn border border-gold-400 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
            >
              Read the Honest Reviews
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </Link>
          </Reveal>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold-200" />
      </section>

      {/* Carts */}
      <section className="bg-cream-200/60 py-24 sm:py-32">
        <div className="container-luxe">
          <SectionHeading
            kicker="Our Carts"
            title={
              <>
                Three colours,
                <span className="italic text-gold-600"> one for your theme</span>
              </>
            }
            copy="Ivory for lobbies and ballrooms, Crimson for galas and festive seasons, Blue for beaches and gardens — or tell us your palette."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CARTS.map((c, i) => (
              <Reveal key={c.key} delay={i * 110}>
                <figure className="group relative overflow-hidden shadow-card">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-plum-950/10 to-transparent" />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">{c.colour}</p>
                    <p className="mt-1 font-display text-xl font-semibold text-cream-100">{c.name}</p>
                    <p className="mt-1.5 text-[0.8rem] leading-relaxed text-cream-100/85">{c.copy}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why an ice cream cart — three reasons */}
      <section className="container-luxe py-24 sm:py-32">
        <SectionHeading
          kicker="Why It Works"
          title={
            <>
              Why an ice cream cart?
              <span className="italic text-gold-600"> Three reasons</span>
            </>
          }
          copy="Hosts now compare a cart with coffee, cocktail and cake stations. Three things only the cart does."
        />
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {REASONS.map((step, i) => (
            <Reveal key={step.n} delay={i * 130}>
              <div className="group border-t border-gold-300/70 pt-8 transition-colors duration-500 hover:border-plum-900">
                <span className="font-display text-5xl font-medium text-gold-400 transition-colors duration-500 group-hover:text-gold-600">
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-plum-900">{step.t}</h3>
                <p className="mt-3 max-w-xs text-[0.88rem] leading-relaxed text-ink-500">{step.c}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Flavours preview */}
      <section className="container-luxe py-24 sm:py-32">
        <SectionHeading
          kicker="Our Flavours"
          title={
            <>
              Fresh, seasonal,
              <span className="italic text-gold-600"> chosen with you</span>
            </>
          }
          copy="Somewhere between gelato and ice cream: fresh ice creams and dairy-free creamy sorbets, with a menu curated for your occasion."
        />
        <div className={`mt-14 ${FLAVOR_GRID[DEFAULT_FLAVOR_VARIANT]}`}>
          {FLAVORS.slice(0, 3).map((f, i) => (
            <FlavorCard key={f.slug} flavor={f} index={i} />
          ))}
        </div>
        <Reveal className="mt-14">
          <Link
            href="/flavors"
            className="inline-flex items-center gap-3 rounded-btn border border-gold-400 px-9 py-4 text-[0.78rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
          >
            Explore the flavours
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </Link>
        </Reveal>
      </section>

      {/* Services teaser */}
      <section className="bg-cream-200/60 py-24 sm:py-32">
        <div className="container-luxe">
          <SectionHeading
            kicker="What We Do"
            title={
              <>
                You host the event,
                <span className="italic text-gold-600"> we bring the mood</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 100}>
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-gold-200/70 bg-cream-50 shadow-[0_10px_30px_-18px_rgba(50,0,75,0.18)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1024px) 24vw, (min-width: 768px) 45vw, 92vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold text-plum-900">{s.title}</h3>
                    <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-ink-500">{s.blurb}</p>
                    <span className="mt-4 text-[0.68rem] font-semibold tracking-[0.2em] text-gold-600 uppercase transition-transform duration-300 group-hover:translate-x-1">
                      Learn more →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Follow the joy */}
      <section className="container-luxe pb-8">
        <SectionHeading
          kicker="Instagram"
          title={
            <>
              Feel-good times
              <span className="italic text-gold-600"> @jollys_creamery</span>
            </>
          }
          rule={false}
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { src: "/images/carts/cart-beach.jpeg", alt: "Blue cart on a beachfront deck" },
            { src: "/images/social/ig-bride-cart.jpg", alt: "Bride at the ivory cart under pendant lights" },
            { src: "/images/social/ig-couple-bw.jpg", alt: "Couple laughing with ice cream cups at a wedding" },
            { src: "/images/carts/cart-lobby-crimson.jpeg", alt: "Crimson cart in a hotel lobby" },
          ].map((t, i) => (
            <Reveal key={t.src} delay={i * 90}>
              <a
                href="https://www.instagram.com/jollys_creamery/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden"
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 46vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-plum-950/0 opacity-0 transition-all duration-500 group-hover:bg-plum-950/40 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-cream-100" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
