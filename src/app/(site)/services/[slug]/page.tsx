import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { CARTS, CONTACT, HOW_IT_WORKS, SERVICES, serviceHref } from "@/lib/data";

/* One page per service. The four are fixed, so each is built ahead of time
   and any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: `${service.blurb} ${service.description}` };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div className="pointer-events-none absolute -top-24 right-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold-200/40 blur-3xl" />
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <nav aria-label="Breadcrumb" className="text-[0.7rem] font-semibold tracking-[0.18em] text-ink-500 uppercase">
                <Link href="/services" className="transition-colors hover:text-plum-900">
                  Services
                </Link>
                <span aria-hidden className="mx-2 text-gold-500">/</span>
                <span className="text-plum-900" aria-current="page">
                  {service.title}
                </span>
              </nav>
              <h1 className="heading-display mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                {service.title}
              </h1>
              <p className="mt-4 font-display text-xl text-gold-600 italic sm:text-2xl">{service.blurb}</p>
              <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-ink-700">{service.description}</p>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={`/reserve?type=${service.slug}`}
                  className="inline-flex rounded-btn bg-plum-900 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold"
                >
                  Reserve your date
                </Link>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-btn border border-gold-400 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="relative">
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-card border border-gold-300" />
              <Parallax
                speed={0.07}
                className={`relative overflow-hidden rounded-card shadow-soft ${service.imagePortrait ? "aspect-[4/5]" : "aspect-[3/2]"}`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  preload
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="scale-110 object-cover"
                />
              </Parallax>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="container-luxe pb-20">
        <Reveal>
          <div className="rounded-card border border-gold-200/70 bg-cream-50 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-plum-900 sm:text-3xl">What&apos;s included</h2>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {service.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.9rem] leading-snug text-ink-700">
                  <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" fill="currentColor" aria-hidden>
                    <path d="M10 0l2.4 5.1L18 6l-4 4 1 5.9L10 13l-5 2.9L6 10 2 6l5.6-.9L10 0z" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Cart colours */}
      <section className="bg-cream-200/60 py-20">
        <div className="container-luxe">
          <SectionHeading
            title={
              <>
                Pick the cart
                <span className="italic text-gold-600"> for your theme</span>
              </>
            }
            copy="Three colours, each styled to sit naturally with your palette, florals and venue."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {CARTS.map((c, i) => (
              <Reveal key={c.key} delay={i * 100}>
                <figure className="group relative overflow-hidden rounded-card shadow-card">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(min-width: 640px) 30vw, 92vw"
                      className="object-cover object-bottom transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-plum-950/10 to-transparent" />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-display text-xl font-semibold text-cream-100">{c.name}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-luxe py-20">
        <SectionHeading
          title={
            <>
              Effortless for you,
              <span className="italic text-gold-600"> memorable for your guests</span>
            </>
          }
        />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map(([t, c], i) => (
            <Reveal key={t} delay={i * 100} as="li">
              <div className="relative h-full rounded-card border border-gold-200/70 bg-cream-50 p-7 pt-9">
                <span className="absolute -top-5 left-7 flex h-10 w-10 items-center justify-center rounded-btn bg-plum-900 font-display text-sm font-semibold text-cream-100 shadow-soft">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg leading-snug font-semibold text-plum-900">{t}</h3>
                <p className="mt-2.5 text-[0.83rem] leading-relaxed text-ink-500">{c}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* The other services */}
      <section className="container-luxe pb-8">
        <SectionHeading
          title={
            <>
              More ways
              <span className="italic text-gold-600"> to bring the mood</span>
            </>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {others.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100}>
              <Link
                href={serviceHref(s.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-gold-200/70 bg-cream-50 shadow-[0_10px_30px_-18px_rgba(50,0,75,0.18)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 768px) 30vw, 92vw"
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
      </section>
    </>
  );
}
