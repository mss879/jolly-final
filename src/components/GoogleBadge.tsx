"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GOOGLE_RATING, REVIEWS } from "@/lib/data";

export function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Stars({ n = 5, className = "h-3.5 w-3.5" }: { n?: number; className?: string }) {
  return (
    <span className="flex gap-0.5 text-[#FBBC05]" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={className} fill={i < n ? "currentColor" : "#E8DFC5"} aria-hidden>
          <path d="M10 1.5l2.47 5.32 5.83.63-4.35 3.94 1.18 5.74L10 14.2l-5.13 2.93 1.18-5.74L1.7 7.45l5.83-.63L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/* Google-reviews strip for the hero — rating + rotating quote. */
export default function GoogleBadge() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 5200);
    return () => clearInterval(t);
  }, []);

  const r = REVIEWS[i];

  return (
    <Link
      href="/reviews"
      className="group block border border-gold-200/80 bg-cream-50/90 p-5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:shadow-gold sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-white shadow-[0_4px_14px_-4px_rgba(50,0,75,0.25)]">
            <GoogleG />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl leading-none font-semibold text-plum-900">
                {GOOGLE_RATING.score}
              </span>
              <Stars />
            </div>
            <p className="mt-1 text-[0.68rem] font-medium tracking-[0.16em] text-ink-500 uppercase">
              {GOOGLE_RATING.count} Google reviews
            </p>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-gold-200 sm:block" />

        <div className="relative min-h-[2.6rem] flex-1 basis-56 overflow-hidden">
          {REVIEWS.map((rv, idx) => (
            <p
              key={rv.name}
              className="absolute inset-0 text-[0.83rem] leading-snug text-ink-700 italic transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                opacity: idx === i ? 1 : 0,
                transform: idx === i ? "translateY(0)" : "translateY(10px)",
              }}
            >
              “{rv.text.length > 110 ? rv.text.slice(0, 110).trimEnd() + "…" : rv.text}”
              <span className="not-italic font-medium text-plum-900"> — {rv.name}</span>
            </p>
          ))}
          {/* spacer for layout */}
          <p className="invisible text-[0.83rem] leading-snug italic">“{r.text.slice(0, 110)}” — {r.name}</p>
        </div>

        <span className="hidden text-[0.7rem] font-semibold tracking-[0.2em] text-gold-600 uppercase transition-transform duration-300 group-hover:translate-x-1 md:block">
          Read all →
        </span>
      </div>
    </Link>
  );
}
