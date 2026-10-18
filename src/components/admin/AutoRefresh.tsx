"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* Re-reads the page's data every so often while the tab is in view. */
export default function AutoRefresh({ every }: { every: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, every);
    return () => clearInterval(timer);
  }, [router, every]);
  return null;
}
