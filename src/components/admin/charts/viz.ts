/* Chart constants shared by server and client components. (Values exported
   from a "use client" module reach server components as references, not
   values, so they live here.)

   Colours were checked with the data-viz palette validator against the card
   surface (#fffef8): the categorical pair clears the colour-blind and
   contrast gates, and the funnel ramp is a single-hue light→dark scale. */
export const VIZ = {
  surface: "#fffef8",
  grid: "#efe7d2",
  baseline: "#d9cda9",
  series: ["#6f3496", "#a07728"], // plum, gold-600
  funnel: ["#b58fd0", "#8752ad", "#5a2a78"], // viewed → started → sent
  accent: "#6f3496",
  context: "#dcd4c5",
} as const;

export const tableCls =
  "w-full text-left text-[0.8rem] [&_td]:border-t [&_td]:border-gold-200/60 [&_td]:px-2 [&_td]:py-1.5 [&_th]:px-2 [&_th]:pb-1.5 [&_th]:font-semibold [&_th]:text-ink-500";
