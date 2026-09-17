import Link from "next/link";
import Icon, { type IconName } from "./icons";
import type { Tone } from "@/lib/admin/types";

/* Building blocks shared by the admin pages. Brand rules carry over from the
   site: radius on buttons, pills and inputs only; cards stay square. */

const btn =
  "inline-flex items-center justify-center gap-2 rounded-btn px-4 py-2.5 text-[0.78rem] font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";
export const btnPrimary = `${btn} bg-plum-900 text-cream-100 hover:bg-plum-800`;
export const btnSecondary = `${btn} border border-gold-300 bg-cream-50 text-plum-900 hover:border-plum-900`;
export const btnGhost = `${btn} text-ink-700 hover:bg-cream-200/80 hover:text-plum-900`;
export const btnDanger = `${btn} border border-rose-200 bg-cream-50 text-rose-700 hover:border-rose-400 hover:bg-rose-50`;
export const inputCls =
  "w-full rounded-btn border border-gold-200 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-500/60 focus:border-gold-400 focus:ring-2 focus:ring-gold-300/40";
export const labelCls = "mb-1 block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-700 uppercase";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-semibold text-plum-900 sm:text-[2.1rem]">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`border border-gold-200/70 bg-cream-50 ${className}`}>
      {(title || action) && (
        <header className="flex min-h-12 items-center justify-between gap-3 border-b border-gold-200/60 px-5 py-2.5">
          <h2 className="text-[0.72rem] font-semibold tracking-[0.14em] text-ink-700 uppercase">{title}</h2>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-plum-900 hover:text-gold-700"
    >
      {children}
      <Icon name="arrow" className="h-3.5 w-3.5" />
    </Link>
  );
}

const TONES: Record<Tone, { cls: string; icon: IconName }> = {
  good: { cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", icon: "check" },
  warning: { cls: "bg-amber-50 text-amber-900 ring-amber-200", icon: "clock" },
  critical: { cls: "bg-rose-50 text-rose-800 ring-rose-200", icon: "close" },
  neutral: { cls: "bg-cream-200 text-ink-700 ring-gold-200", icon: "minus" },
  muted: { cls: "bg-cream-50 text-ink-500 ring-gold-300", icon: "dotted" },
  info: { cls: "bg-plum-100 text-plum-900 ring-plum-200", icon: "sparkle" },
};

/* Status always pairs an icon and a label with its colour. */
export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const t = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-btn px-2 py-0.5 text-[0.68rem] font-semibold whitespace-nowrap ring-1 ring-inset ${t.cls}`}
    >
      <Icon name={t.icon} className="h-3 w-3" />
      {children}
    </span>
  );
}

export function StatTile({
  label,
  value,
  delta,
  hint,
  href,
}: {
  label: string;
  value: string;
  delta?: { change: number | null; period: string; upIsGood?: boolean; unit?: string };
  hint?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-[0.78rem] text-ink-500">{label}</p>
      <p className="mt-2 text-[1.9rem] leading-none font-semibold text-plum-900">{value}</p>
      {delta && <Delta {...delta} />}
      {hint && <p className="mt-2 text-[0.75rem] text-ink-500">{hint}</p>}
    </>
  );
  const cls = "block border border-gold-200/70 bg-cream-50 px-5 py-4";
  return href ? (
    <Link href={href} className={`${cls} transition-colors hover:border-gold-400`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Delta({
  change,
  period,
  upIsGood = true,
  unit = "%",
}: {
  change: number | null;
  period: string;
  upIsGood?: boolean;
  unit?: string;
}) {
  if (change === null) return <p className="mt-2 text-[0.75rem] text-ink-500">No earlier data {period}</p>;
  if (change === 0) return <p className="mt-2 text-[0.75rem] text-ink-500">No change {period}</p>;
  const good = change > 0 === upIsGood;
  return (
    <p className={`mt-2 text-[0.75rem] font-medium ${good ? "text-emerald-700" : "text-rose-700"}`}>
      {change > 0 ? "▲" : "▼"} {Math.abs(change)}
      {unit} <span className="font-normal text-ink-500">{period}</span>
    </p>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="font-display text-xl text-plum-900">{title}</p>
      {children && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Tabs({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string; count?: number; active: boolean }[];
}) {
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1 border-b border-gold-200/70">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "border-plum-900 font-semibold text-plum-900"
                  : "border-transparent text-ink-500 hover:text-plum-900"
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span className="rounded-btn bg-cream-200 px-1.5 py-px text-[0.68rem] font-semibold text-ink-700 tabular-nums">
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Pagination({ page, pages, hrefFor }: { page: number; pages: number; hrefFor: (page: number) => string }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-gold-200/60 px-5 py-3 text-sm text-ink-500">
      <span>
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={hrefFor(page - 1)} className={btnSecondary}>
            <Icon name="left" /> Newer
          </Link>
        )}
        {page < pages && (
          <Link href={hrefFor(page + 1)} className={btnSecondary}>
            Older <Icon name="right" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* Only plain addresses become mailto: links — anything with ?, &, = or %
   could smuggle extra headers into the email. */
const LINKABLE_EMAIL = /^[A-Za-z0-9._+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/* Sri Lankan numbers are often typed locally ("070 …"); WhatsApp wants 94… */
export function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `94${digits.slice(1)}` : digits}`;
}

export function ContactLinks({ phone, email }: { phone: string | null; email: string | null }) {
  const link = "inline-flex items-center gap-1.5 text-sm text-plum-900 underline-offset-4 hover:underline";
  return (
    <div className="flex flex-col gap-1.5">
      {phone && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={link}>
            <Icon name="phone" className="h-3.5 w-3.5 text-ink-500" />
            {phone}
          </a>
          <a href={whatsappLink(phone)} target="_blank" rel="noopener noreferrer" className="text-[0.75rem] font-semibold text-gold-700 hover:text-plum-900">
            WhatsApp
          </a>
        </div>
      )}
      {email &&
        (LINKABLE_EMAIL.test(email) ? (
          <a href={`mailto:${email}`} className={`${link} break-all`}>
            <Icon name="mail" className="h-3.5 w-3.5 shrink-0 text-ink-500" />
            {email}
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm break-all text-ink-700">
            <Icon name="mail" className="h-3.5 w-3.5 shrink-0 text-ink-500" />
            {email}
          </span>
        ))}
      {!phone && !email && <span className="text-sm text-ink-500">No contact details yet</span>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold tracking-[0.12em] text-ink-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-ink-900">{children}</dd>
    </div>
  );
}
