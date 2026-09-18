"use client";

import { Suspense, use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/admin/actions/auth";
import Icon, { type IconName } from "./icons";

type Counts = { newInquiries: number; pendingBookings: number };

const LINKS: { href: string; label: string; icon: IconName; count?: keyof Counts; hint?: string }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "inbox", count: "newInquiries", hint: "new" },
  { href: "/admin/crm", label: "CRM", icon: "board" },
  { href: "/admin/bookings", label: "Bookings", icon: "bookings", count: "pendingBookings", hint: "awaiting confirmation" },
  { href: "/admin/calendar", label: "Calendar", icon: "calendar" },
];

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Image
        src="/images/brand/logo.png"
        alt="Jolly's Creamery"
        width={68}
        height={96}
        className="h-12 w-auto object-contain brightness-0 invert"
      />
      <span className="text-[0.62rem] font-semibold tracking-[0.24em] text-gold-300 uppercase">Admin</span>
    </Link>
  );
}

/* The counts are one DB round trip. Reading them inside a boundary keeps the
   links themselves on screen while that trip is still in the air. */
function NavCount({ counts, field, hint }: { counts: Promise<Counts>; field: keyof Counts; hint?: string }) {
  const n = use(counts)[field];
  if (n <= 0) return null;
  return (
    <span
      className="rounded-btn bg-gold-400 px-1.5 py-px text-[0.68rem] font-bold text-plum-950 tabular-nums"
      title={`${n} ${hint}`}
    >
      {n}
      <span className="sr-only"> {hint}</span>
    </span>
  );
}

function AccountEmail({ email }: { email: Promise<string | null> }) {
  const address = use(email);
  return (
    <p className="truncate px-3 text-[0.72rem] text-cream-100/60" title={address ?? undefined}>
      {address}
    </p>
  );
}

export default function AdminNav({ email, counts }: { email: Promise<string | null>; counts: Promise<Counts> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating (render-phase adjustment)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const links = (
    <ul className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-cream-100 font-semibold text-plum-900" : "text-cream-100/80 hover:bg-plum-800 hover:text-cream-100"
              }`}
            >
              <Icon name={link.icon} className="h-[1.1rem] w-[1.1rem]" />
              <span className="flex-1">{link.label}</span>
              {link.count && (
                <Suspense fallback={null}>
                  <NavCount counts={counts} field={link.count} hint={link.hint} />
                </Suspense>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const account = (
    <div className="border-t border-plum-700 pt-4">
      <Suspense fallback={<div className="mx-3 h-4 w-32 animate-pulse bg-cream-100/15" aria-hidden="true" />}>
        <AccountEmail email={email} />
      </Suspense>
      <div className="mt-2 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-btn px-3 py-2 text-[0.8rem] text-cream-100/80 hover:bg-plum-800 hover:text-cream-100"
        >
          <Icon name="external" /> View website
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-btn px-3 py-2 text-[0.8rem] text-cream-100/80 hover:bg-plum-800 hover:text-cream-100"
          >
            <Icon name="logout" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 bg-plum-900 px-4 py-6 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <nav aria-label="Admin" className="flex-1">
          {links}
        </nav>
        {account}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 bg-plum-900 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-btn text-cream-100 hover:bg-plum-800"
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
        {open && (
          <nav id="admin-mobile-nav" aria-label="Admin" className="flex flex-col gap-4 border-t border-plum-700 px-4 pt-3 pb-5">
            {links}
            {account}
          </nav>
        )}
      </div>
    </>
  );
}
