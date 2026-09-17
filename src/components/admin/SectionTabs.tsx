"use client";

import { usePathname } from "next/navigation";
import { Tabs } from "./ui";

/* Tabs that follow the URL path, e.g. Bookings | Analytics. */
export default function SectionTabs({ label, items }: { label: string; items: { href: string; label: string; exact?: boolean }[] }) {
  const pathname = usePathname();
  const activeHref =
    items.find((i) => i.exact && pathname === i.href)?.href ??
    [...items].sort((a, b) => b.href.length - a.href.length).find((i) => !i.exact && pathname.startsWith(i.href))?.href ??
    items[0]?.href;

  return <Tabs label={label} items={items.map((i) => ({ href: i.href, label: i.label, active: i.href === activeHref }))} />;
}
