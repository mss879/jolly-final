import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { BRAND_BLURB, CONTACT, CTA, FIND_US, FOOTER_LINKS, SMILEY } from "@/lib/data";

const SOCIALS = [
  {
    label: "Instagram",
    href: CONTACT.instagram,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    stroke: true,
  },
  {
    label: "Facebook",
    href: CONTACT.facebook,
    path: <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5H16.7V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H7.9v3h2.6v7h3z" />,
    stroke: false,
  },
  {
    label: "WhatsApp",
    href: CONTACT.whatsappHref,
    path: <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 1.7a7.3 7.3 0 1 1-3.9 13.5l-.3-.2-2.8.7.8-2.7-.2-.3A7.3 7.3 0 0 1 12 4.7zm-2.6 3.2c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.9 2.6.7 3 .7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.3-1.4-.6-.6-1-1.2-1.3-1.8-.1-.2 0-.4.1-.5l.6-.7c.1-.2.1-.4 0-.6L9.9 8.3c-.1-.3-.3-.4-.5-.4z" />,
    stroke: false,
  },
];

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
            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-btn border border-cream-100/20 text-cream-100/75 transition-all duration-300 hover:border-gold-300 hover:text-gold-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill={s.stroke ? "none" : "currentColor"}
                    stroke={s.stroke ? "currentColor" : undefined}
                    strokeWidth={s.stroke ? 1.5 : undefined}
                  >
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
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
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-2 text-[0.8rem] text-cream-100/60 transition-colors duration-300 hover:text-gold-300"
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
          <p>© {new Date().getFullYear()} Jolly&apos;s Creamery — All rights reserved</p>
          <p>Made in Colombo, Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
