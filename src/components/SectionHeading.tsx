import Reveal from "./Reveal";

export default function SectionHeading({
  kicker,
  title,
  copy,
  align = "left",
  rule = true,
  as: Heading = "h2",
}: {
  kicker?: string; // the small gold line above the title; the homepage goes without
  title: React.ReactNode;
  copy?: string;
  align?: "center" | "left";
  rule?: boolean;
  as?: "h1" | "h2"; // h1 for the title at the top of a page
}) {
  const center = align === "center";
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : ""}>
      {kicker && (
        <p className={`kicker mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          {!center && <span className="h-px w-8 bg-gold-500" />}
          {kicker}
        </p>
      )}
      <Heading className="heading-display text-4xl sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
        {title}
      </Heading>
      {copy && (
        <p className={`mt-6 text-[0.95rem] leading-relaxed text-ink-700 ${center ? "" : "max-w-2xl"}`}>
          {copy}
        </p>
      )}
      {rule && !center && <div className="mt-10 h-px w-full bg-gold-300/70" />}
    </Reveal>
  );
}
