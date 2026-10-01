import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { BRAND_BLURB, CONTACT, CTA, FIND_US, FOOTER_LINKS, SMILEY } from "@/lib/data";

const columnHeading = "text-[0.68rem] font-semibold tracking-[0.28em] text-gold-300 uppercase";
const footerLink =
  "inline-block text-[0.86rem] leading-none text-cream-100/70 transition-colors duration-300 hover:text-gold-300";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-plum-900 sm:mt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-500/60" />

      {/* CTA band */}
      <div className="container-luxe border-b border-cream-100/10 py-20 text-center sm:py-24">
        <Reveal>
          <p className="kicker !text-gold-300">Jolly&apos;s On Wheels</p>
          <h2 className="heading-display mt-5 !text-cream-100 text-3xl sm:text-5xl">
            Invite us to your next
            <span className="mt-1 block italic text-gold-300">BIG EVENT!</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href={CTA.href}
              className="rounded-btn bg-cream-100 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-plum-900 uppercase transition-all duration-300 hover:bg-white"
            >
              {CTA.label}
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="rounded-btn border border-cream-100/40 px-10 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-cream-100 uppercase transition-all duration-300 hover:border-gold-300 hover:text-gold-300"
            >
              {CONTACT.phone}
            </a>
          </div>
        </Reveal>
      </div>

      {/* Columns */}
      <div className="container-luxe py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1.1fr_1.3fr] lg:gap-x-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Image
              src="/images/brand/logo.png"
              alt="Jolly's Creamery"
              width={102}
              height={144}
              className="h-[4.5rem] w-auto object-contain opacity-90 brightness-0 invert"
            />
            <p className="mt-5 font-display text-xl text-cream-100/90 italic">
              {CONTACT.tagline} <span aria-hidden className="not-italic">{SMILEY}</span>
            </p>
            <p className="mt-4 max-w-xs text-[0.83rem] leading-relaxed text-cream-100/55">
              {BRAND_BLURB}
            </p>
            <SocialLinks className="mt-7" />
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <h3 className={columnHeading}>{heading}</h3>
              <span className="mt-3 block h-px w-8 bg-gold-500/70" />
              <ul className="mt-6 flex flex-col gap-3.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className={columnHeading}>Get In Touch</h3>
            <span className="mt-3 block h-px w-8 bg-gold-500/70" />
            <a
              href={CONTACT.phoneHref}
              className="mt-6 block font-display text-2xl font-semibold text-cream-100 transition-colors duration-300 hover:text-gold-300"
            >
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.phone2Href}
              className="mt-1.5 block font-display text-2xl font-semibold text-cream-100 transition-colors duration-300 hover:text-gold-300"
            >
              {CONTACT.phone2}
            </a>
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-2 text-[0.8rem] text-cream-100/60 transition-colors duration-300 hover:text-gold-300"
            >
              Message us on WhatsApp
              <span aria-hidden>→</span>
            </a>
            <a
              href={CONTACT.emailHref}
              className="mt-5 block text-[0.84rem] break-all text-cream-100/70 transition-colors duration-300 hover:text-gold-300"
            >
              {CONTACT.email}
            </a>
            <p className="mt-6 border-t border-cream-100/10 pt-5 text-[0.8rem] leading-relaxed text-cream-100/55">
              {FIND_US.line}
            </p>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="bg-plum-950 py-5">
        <div className="container-luxe flex flex-col items-center justify-between gap-2 text-center text-[0.66rem] leading-relaxed tracking-[0.2em] text-cream-100/50 uppercase sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Jolly&apos;s Creamery · All rights reserved</p>
          <p>Made in Colombo, Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
