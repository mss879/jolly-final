"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CTA, FIND_US, NAV } from "@/lib/data";

const HOVER_CLOSE_DELAY = 160; // ms of grace before a dropdown closes on mouse-leave

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile overlay
  const [menu, setMenu] = useState<string | null>(null); // open desktop dropdown, by href
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes (render-phase adjustment)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setMenu(null);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = (key: string) => {
    cancelClose();
    setMenu(key);
  };
  const closeMenuNow = () => {
    cancelClose();
    setMenu(null);
  };
  const closeMenuSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMenu(null), HOVER_CLOSE_DELAY);
  };
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkCls = (active: boolean) =>
    `group relative inline-flex items-center gap-1.5 pb-1 text-[0.82rem] font-medium tracking-[0.14em] uppercase transition-colors ${
      active ? "text-plum-900" : "text-ink-700 hover:text-plum-900"
    }`;
  const underline = (active: boolean) => (
    <span
      className={`absolute bottom-0 left-0 h-px bg-gold-500 transition-all duration-500 ${
        active ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold-200/70 bg-cream-100/90 shadow-[0_10px_40px_-20px_rgba(50,0,75,0.25)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* Announcement bar — location credibility; `truncate` guarantees a single line */}
      <div className="bg-plum-900 py-2 text-center">
        <p className="truncate px-4 text-[0.6rem] font-semibold tracking-[0.22em] text-cream-100 uppercase sm:text-[0.64rem]">
          <span className="sm:hidden">{FIND_US.short}</span>
          <span className="hidden sm:inline">{FIND_US.bar}</span>
        </p>
      </div>
      <div className="container-luxe flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link href="/" aria-label="Jolly's Creamery — home" className="shrink-0">
          <Image
            src="/images/brand/logo-purple.png"
            alt="Jolly's Creamery"
            width={64}
            height={64}
            preload
            className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-11" : "h-14"}`}
          />
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-7">
            {NAV.map((l) => {
              const active = isActive(l.href);
              if (!l.children) {
                return (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls(active)}>
                      {l.label}
                      {underline(active)}
                    </Link>
                  </li>
                );
              }

              const isOpen = menu === l.href;
              const panelId = `${l.label.toLowerCase().replace(/\s+/g, "-")}-menu`;
              return (
                <li
                  key={l.href}
                  className="relative"
                  onMouseEnter={() => openMenu(l.href)}
                  onMouseLeave={closeMenuSoon}
                  onFocus={() => openMenu(l.href)}
                  onBlur={(e: FocusEvent<HTMLLIElement>) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMenuNow();
                  }}
                  onKeyDown={(e: KeyboardEvent<HTMLLIElement>) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      // focus first: the trigger's onFocus re-opens, so close afterwards
                      triggerRef.current?.focus();
                      closeMenuNow();
                    } else if (e.key === "ArrowDown" && e.target === triggerRef.current) {
                      e.preventDefault();
                      openMenu(l.href);
                      firstItemRef.current?.focus();
                    }
                  }}
                >
                  <Link
                    ref={triggerRef}
                    href={l.href}
                    className={linkCls(active)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    {l.label}
                    <svg
                      viewBox="0 0 12 12"
                      className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden
                    >
                      <path d="M2.5 4.5 6 8l3.5-3.5" />
                    </svg>
                    {underline(active)}
                  </Link>

                  {/* pt-3 bridges the gap so the pointer never leaves the hit area */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                    <ul
                      id={panelId}
                      className={`w-60 rounded-btn border border-gold-200/80 bg-cream-50 p-1.5 shadow-card transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      {l.children.map((c, i) => (
                        <li key={c.href}>
                          <Link
                            ref={i === 0 ? firstItemRef : undefined}
                            href={c.href}
                            onClick={closeMenuNow}
                            className="block rounded-btn px-4 py-2.5 text-[0.72rem] font-medium tracking-[0.16em] text-ink-700 uppercase transition-colors hover:bg-cream-200/70 hover:text-plum-900 focus-visible:bg-cream-200/70 focus-visible:outline-none"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                      <li className="mt-1 border-t border-gold-200/70 pt-1">
                        <Link
                          href={l.href}
                          onClick={closeMenuNow}
                          className="block rounded-btn px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.2em] text-gold-600 uppercase transition-colors hover:bg-cream-200/70 hover:text-plum-900 focus-visible:bg-cream-200/70 focus-visible:outline-none"
                        >
                          All services →
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={CTA.href}
            className="hidden items-center gap-2 rounded-btn bg-plum-900 px-6 py-2.5 text-[0.78rem] font-semibold tracking-[0.18em] text-cream-100 uppercase shadow-soft transition-all duration-300 hover:bg-plum-800 hover:shadow-gold sm:inline-flex"
          >
            {CTA.label}
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-btn border border-gold-300 bg-cream-50/70 lg:hidden"
          >
            <span
              className={`h-px w-5 bg-plum-900 transition-all duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span className={`h-px w-5 bg-plum-900 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-5 bg-plum-900 transition-all duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 top-[100px] z-40 bg-cream-100 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ${
          open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <nav className="container-luxe flex h-full flex-col gap-1 overflow-y-auto pt-8 pb-12" aria-label="Mobile">
          {NAV.map((l, i) => (
            <div
              key={l.href}
              className={`border-b border-gold-200/60 transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-3xl text-plum-900"
              >
                {l.label}
              </Link>
              {l.children && (
                <ul className="mb-4 grid grid-cols-2 gap-x-4">
                  {l.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-[0.7rem] font-semibold tracking-[0.16em] text-ink-700 uppercase"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Link
            href={CTA.href}
            onClick={() => setOpen(false)}
            className={`mt-8 inline-flex w-fit items-center rounded-btn bg-plum-900 px-8 py-3.5 text-[0.8rem] font-semibold tracking-[0.18em] text-cream-100 uppercase transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? "500ms" : "0ms" }}
          >
            {CTA.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
