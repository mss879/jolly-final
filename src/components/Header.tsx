"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CTA, NAV } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile overlay
  // Open desktop dropdown, by href. Dropdowns open on click, not hover (client,
  // Oct 2026: hover fired while the pointer was only passing by).
  const [menu, setMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
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

  // An open dropdown closes on a click anywhere outside the nav
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu]);

  const closeMenu = () => setMenu(null);
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
    <>
      <header
        /* The bottom border is always there, transparent until scrolled. Added
           only on scroll, it would fade in from the text colour — a black line
           across the top of the page while the header turns sticky. */
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          open
            ? "border-transparent bg-cream-100"
            : scrolled
              ? "border-gold-200/70 bg-cream-100/90 shadow-[0_10px_40px_-20px_rgba(50,0,75,0.25)] backdrop-blur-md"
              : "border-transparent bg-transparent"
        }`}
      >
        {/* Stays above the full-screen mobile menu (z-40, a sibling below) */}
        <div className="container-wide relative z-50 flex items-center justify-between gap-4 py-3 sm:py-4">
          <Link href="/" aria-label="Jolly's Creamery, home" className="shrink-0">
            {/* The full logo (dot, wordmark and cone) — never crop it */}
            <Image
              src="/images/brand/logo.png"
              alt="Jolly's Creamery"
              width={46}
              height={65}
              preload
              className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-12" : "h-16"}`}
            />
          </Link>

          <nav ref={navRef} className="hidden lg:block" aria-label="Primary">
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
                    onBlur={(e: FocusEvent<HTMLLIElement>) => {
                      // keyboard focus moving out of the menu closes it
                      if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) closeMenu();
                    }}
                    onKeyDown={(e: KeyboardEvent<HTMLLIElement>) => {
                      if (e.key === "Escape") {
                        e.preventDefault();
                        closeMenu();
                        triggerRef.current?.focus();
                      } else if (e.key === "ArrowDown" && e.target === triggerRef.current) {
                        e.preventDefault();
                        setMenu(l.href);
                        // the panel is visibility:hidden until the re-render
                        requestAnimationFrame(() => firstItemRef.current?.focus());
                      }
                    }}
                  >
                    <button
                      ref={triggerRef}
                      type="button"
                      onClick={() => setMenu(isOpen ? null : l.href)}
                      className={`${linkCls(active)} cursor-pointer`}
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
                    </button>

                    {/* pt-3 sets the panel just below the trigger */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                      <ul
                        id={panelId}
                        className={`w-60 rounded-card border border-gold-200/80 bg-cream-50 p-1.5 shadow-card transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                          isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                        }`}
                      >
                        {l.children.map((c, i) => (
                          <li key={c.href}>
                            <Link
                              ref={i === 0 ? firstItemRef : undefined}
                              href={c.href}
                              onClick={closeMenu}
                              className="block rounded-btn px-4 py-2.5 text-[0.72rem] font-medium tracking-[0.16em] text-ink-700 uppercase transition-colors hover:bg-cream-200/70 hover:text-plum-900 focus-visible:bg-cream-200/70 focus-visible:outline-none"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li className="mt-1 border-t border-gold-200/70 pt-1">
                          <Link
                            href={l.href}
                            onClick={closeMenu}
                            className="block rounded-btn px-4 py-2.5 text-[0.66rem] font-semibold tracking-[0.2em] text-gold-700 uppercase transition-colors hover:bg-cream-200/70 hover:text-plum-900 focus-visible:bg-cream-200/70 focus-visible:outline-none"
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
      </header>

      {/* Mobile menu. A sibling of the header, not inside it: the scrolled
          header's backdrop blur would otherwise size this fixed layer to the
          header bar while the blur fades, so it opened cramped, then jumped. */}
      <div
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-40 bg-cream-100 transition-[opacity,visibility] ease-out lg:hidden ${
          open ? "visible opacity-100 duration-300" : "invisible opacity-0 duration-200"
        }`}
      >
        <nav className="container-luxe flex h-full flex-col gap-1 overflow-y-auto pt-28 pb-12 sm:pt-32" aria-label="Mobile">
          {NAV.map((l, i) => (
            <div
              key={l.href}
              className={`border-b border-gold-200/60 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${40 + i * 30}ms` : "0ms" }}
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
            className={`mt-8 inline-flex w-fit items-center rounded-btn bg-plum-900 px-8 py-3.5 text-[0.8rem] font-semibold tracking-[0.18em] text-cream-100 uppercase transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? "240ms" : "0ms" }}
          >
            {CTA.label}
          </Link>
        </nav>
      </div>
    </>
  );
}
