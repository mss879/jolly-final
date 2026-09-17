import type { BookingFieldKey } from "./booking-fields";

/* Browser side of the reserve form's autosave and analytics.
   Answers and interaction events are queued and sent in small batches to
   /api/booking/track; whatever is still queued when the visitor leaves goes
   out with sendBeacon. Every batch carries all the answers given so far plus
   a timestamp, and the database ignores a batch older than one it has
   already applied — so a slow request can never overwrite newer answers.
   Failed batches are retried a few times. */

export type TrackEvent =
  | { type: "view" }
  | { type: "focus" | "complete" | "clear" | "error"; field: BookingFieldKey; duration_ms?: number };

export type TrackingContext = {
  device: "mobile" | "tablet" | "desktop";
  referrer: string | null;
  landing: string;
};

const SESSION_KEY = "jollys-booking-session";
const ENDPOINT = "/api/booking/track";
const MAX_RETRIES = 3;

/* One id per visit to the form, kept for the tab so a refresh carries on
   the same booking instead of starting a second one. */
export function bookingSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function endBookingSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable — nothing to clear
  }
}

export function trackingContext(): TrackingContext {
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  return {
    device: !touch ? "desktop" : shortSide >= 600 ? "tablet" : "mobile",
    referrer: document.referrer || null,
    landing: location.pathname + location.search,
  };
}

export class BookingTracker {
  private events: TrackEvent[] = [];
  private answers: Partial<Record<BookingFieldKey, unknown>> = {};
  private unsent = false; // answers changed since the last batch went out
  private timer: ReturnType<typeof setTimeout> | null = null;
  private dueAt = 0;
  private chain: Promise<unknown> = Promise.resolve();
  private failures = 0;
  private lastSeq = 0;
  private stopped = false;

  constructor(
    readonly session: string,
    private readonly context: TrackingContext,
  ) {}

  event(event: TrackEvent, delay = 400) {
    if (this.stopped) return;
    this.events.push(event);
    this.schedule(delay);
  }

  save(field: BookingFieldKey, value: unknown, delay = 1200) {
    if (this.stopped) return;
    this.answers[field] = value;
    this.unsent = true;
    this.schedule(delay);
  }

  /* Sends everything queued. With `leaving`, uses sendBeacon so the request
     survives the page closing. */
  flush(leaving = false) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (this.stopped || (!this.events.length && !this.unsent)) return;

    const events = this.events.splice(0, 100);
    const withAnswers = this.unsent;
    this.unsent = false;
    const body = JSON.stringify({
      session: this.session,
      events,
      fields: withAnswers ? { ...this.answers } : {},
      context: { ...this.context, seq: (this.lastSeq = Math.max(Date.now(), this.lastSeq + 1)) },
    });
    if (this.events.length) this.schedule(0);

    if (leaving && navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    this.chain = this.chain.then(async () => {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => null);
      if (res && (res.ok || (res.status < 500 && res.status !== 429))) {
        this.failures = 0; // sent, or refused as invalid (retrying won't help)
        return;
      }
      if (this.stopped) return;
      // Keep the batch for the next send — a retry, the next answer or the page
      // closing — and retry a few times on its own before waiting for those.
      this.events.unshift(...events.slice(0, Math.max(0, 100 - this.events.length)));
      if (withAnswers) this.unsent = true;
      if (++this.failures <= MAX_RETRIES) this.schedule(2000 * this.failures);
    });
  }

  stop() {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.events = [];
    this.answers = {};
    this.unsent = false;
  }

  // Flush at the earliest deadline anyone has asked for.
  private schedule(delay: number) {
    const due = Date.now() + delay;
    if (this.timer && due >= this.dueAt) return;
    if (this.timer) clearTimeout(this.timer);
    this.dueAt = due;
    this.timer = setTimeout(() => this.flush(), delay);
  }
}
