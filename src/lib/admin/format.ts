/* Formatting for the admin area. Everything is shown in Sri Lanka time,
   whatever timezone the server or the browser happens to be in. */

export const TIME_ZONE = "Asia/Colombo";
const DAY_MS = 86_400_000;

const dateFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short", year: "numeric" });
const shortDateFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
const isoDayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });

// Calendar dates ("2026-12-12") have no timezone: format them as UTC.
const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });
const dayShortFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });
const monthFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "long", year: "numeric" });

export function formatDate(value: string | Date) {
  return dateFmt.format(new Date(value));
}

export function formatShortDate(value: string | Date) {
  return shortDateFmt.format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return dateTimeFmt.format(new Date(value));
}

/* "Sat 12 Dec 2026" for a date-only value */
export function formatDay(day: string, withYear = true) {
  const date = new Date(`${day}T00:00:00Z`);
  return (withYear ? dayFmt : dayShortFmt).format(date);
}

export function formatMonth(month: string) {
  return monthFmt.format(new Date(`${month}-01T00:00:00Z`));
}

/* "18:30:00" → "6:30 pm" */
export function formatTime(time: string | null | undefined) {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function relativeTime(value: string | Date, now = Date.now()) {
  const diff = now - new Date(value).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? "yesterday" : `${days} days ago`;
  return formatDate(value);
}

const numberFmt = new Intl.NumberFormat("en-GB");
const compactFmt = new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 });

export function formatNumber(value: number) {
  return numberFmt.format(value);
}

export function formatLkr(value: number | null | undefined, compact = false) {
  if (value === null || value === undefined) return null;
  return `LKR ${(compact && value >= 100_000 ? compactFmt : numberFmt).format(value)}`;
}

export function percent(part: number, whole: number) {
  if (!whole) return null;
  return Math.round((part / whole) * 100);
}

export function formatPercent(part: number, whole: number) {
  const value = percent(part, whole);
  return value === null ? "—" : `${value}%`;
}

export function formatDuration(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

/* ─── Calendar arithmetic on "YYYY-MM-DD" strings ─── */

export function colomboDay(value: string | Date = new Date()) {
  return isoDayFmt.format(new Date(value));
}

export function addDays(day: string, amount: number) {
  return new Date(Date.parse(`${day}T00:00:00Z`) + amount * DAY_MS).toISOString().slice(0, 10);
}

/* Monday = 0 … Sunday = 6 */
export function weekdayIndex(day: string) {
  return (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/* The instant a Sri Lanka calendar day begins (UTC+5:30, no daylight saving). */
export function startOfColomboDay(day: string) {
  return new Date(`${day}T00:00:00+05:30`);
}
