import type { Review } from "@/lib/data";
import { GoogleG, Stars } from "./GoogleBadge";
import Reveal from "./Reveal";

export default function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  return (
    <Reveal delay={(index % 3) * 90}>
      <article className="flex h-full flex-col border border-gold-200/70 bg-cream-50 p-7 shadow-[0_10px_30px_-18px_rgba(50,0,75,0.18)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-11 w-11 items-center justify-center font-display text-lg font-semibold text-cream-100"
              style={{ backgroundColor: review.accent }}
              aria-hidden
            >
              {review.initial}
            </span>
            <div>
              <p className="text-sm font-semibold text-plum-900">{review.name}</p>
              <p className="mt-0.5 text-[0.68rem] tracking-wide text-ink-500">{review.event}</p>
            </div>
          </div>
          <GoogleG className="h-4.5 w-4.5 shrink-0 opacity-80" />
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <Stars n={review.rating} />
          <span className="text-[0.68rem] text-ink-500">{review.timeAgo}</span>
        </div>
        <p className="mt-4 flex-1 text-[0.88rem] leading-relaxed text-ink-700">“{review.text}”</p>
      </article>
    </Reveal>
  );
}
