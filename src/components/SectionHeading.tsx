import Reveal from "./Reveal";

export default function SectionHeading({
  kicker,
  title,
  copy,
  align = "left",
  rule = true,
}: {
  kicker: string;
  title: React.ReactNode;
  copy?: string;
  align?: "center" | "left";
  rule?: boolean;
}) {
  const center = align === "center";
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : ""}>
      <p className={`kicker flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        {!center && <span className="h-px w-8 bg-gold-500" />}
        {kicker}
      </p>
      <h2 className="heading-display mt-5 text-4xl sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
        {title}
      </h2>
      {copy && (
        <p className={`mt-6 text-[0.95rem] leading-relaxed text-ink-700 ${center ? "" : "max-w-2xl"}`}>
          {copy}
        </p>
      )}
      {rule && !center && <div className="mt-10 h-px w-full bg-gold-300/70" />}
    </Reveal>
  );
}
