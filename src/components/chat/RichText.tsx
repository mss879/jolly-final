import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/* The little Markdown the concierge writes: paragraphs, "- " lists, **bold**,
   *italic* and [links](…). Built as React elements, never as HTML. Only this
   site's pages, Jolly's own channels, and tel:/mailto: become links: a link
   the model was talked into writing to anywhere else stays plain text. */

const TRUSTED_HOSTS = [
  "jollyscreamery.com",
  "wa.me",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "linkedin.com",
];

function trusted(href: string) {
  try {
    const host = new URL(href).hostname.toLowerCase();
    return TRUSTED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

const INLINE = /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^)\s]+\)|\*[^*\s][^*\n]*\*)/g;

function link(href: string, label: ReactNode, key: number, tone: string) {
  const cls = `font-semibold underline decoration-1 underline-offset-[3px] ${tone}`;
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link key={key} href={href} className={cls}>
        {label}
      </Link>
    );
  }
  if (/^https:\/\//i.test(href) && trusted(href)) {
    return (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  if (/^tel:\+?[\d\s-]+$/i.test(href) || /^mailto:[^?&]+$/i.test(href)) {
    return (
      <a key={key} href={href} className={cls}>
        {label}
      </a>
    );
  }
  return <Fragment key={key}>{label}</Fragment>;
}

function inline(text: string, tone: string) {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const a = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (a) return link(a[2], a[1], i, tone);
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const BULLET = /^\s*(?:[-*•]|\d+[.)])\s+/;

/* Each paragraph splits into runs of plain lines and runs of list items. */
function runs(paragraph: string) {
  const out: { list: boolean; lines: string[] }[] = [];
  for (const line of paragraph.split("\n")) {
    const list = BULLET.test(line);
    const last = out[out.length - 1];
    if (last && last.list === list) last.lines.push(list ? line.replace(BULLET, "") : line);
    else out.push({ list, lines: [list ? line.replace(BULLET, "") : line] });
  }
  return out;
}

export default function RichText({ text, tone = "decoration-gold-400" }: { text: string; tone?: string }) {
  const blocks = text
    .trim()
    .split(/\n{2,}/)
    .flatMap(runs);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) =>
        block.list ? (
          <ul key={i} className="space-y-1">
            {block.lines.map((line, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45 bg-gold-500" />
                <span>{inline(line, tone)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(line, tone)}
              </Fragment>
            ))}
          </p>
        ),
      )}
    </div>
  );
}
