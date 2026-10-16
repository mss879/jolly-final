"use client";

import { Children, useState, type ReactNode } from "react";

/* Shows the first `initial` items, then `step` more per click: for long lists
   rendered on the server (the review cards), so the page opens light. */
export default function ShowMore({
  children,
  className = "",
  initial = 9,
  step = 9,
  label = "Show more",
}: {
  children: ReactNode;
  className?: string;
  initial?: number;
  step?: number;
  label?: string;
}) {
  const items = Children.toArray(children);
  const [count, setCount] = useState(initial);
  const left = items.length - count;

  return (
    <>
      <div className={className}>{items.slice(0, count)}</div>
      {left > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setCount((c) => c + step)}
            className="inline-flex items-center gap-3 rounded-btn border border-gold-400 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.18em] text-plum-900 uppercase transition-all duration-300 hover:border-plum-900 hover:bg-plum-900 hover:text-cream-100"
          >
            {label}
            <span className="font-normal tracking-normal normal-case opacity-70">({left} more)</span>
          </button>
        </div>
      )}
    </>
  );
}
