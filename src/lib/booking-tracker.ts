import type { BookingFieldKey } from "./booking-fields";

/* Browser side of the reserve form's autosave and analytics.
   Field values and interaction events are queued and sent in small batches
   to /api/booking/track; whatever is still queued when the visitor leaves
   goes out with sendBeacon. Requests are chained so a later value can never
   land before an earlier one. */

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
  private fields: Partial<Record<BookingFieldKey, unknown>> = {};
  private timer: ReturnType<typeof setTimeout> | null = null;
  private dueAt = 0;
  private chain: Promise<unknown> = Promise.resolve();
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
    this.fields[field] = value;
    this.schedule(delay);
  }

  /* Sends everything queued. With `leaving`, uses sendBeacon so the request
     survives the page closing. */
  flush(leaving = false) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (!this.events.length && !Object.keys(this.fields).length) return;

    const body = JSON.stringify({
      session: this.session,
      events: this.events.splice(0, 100),
      fields: this.fields,
      context: this.context,
    });
    this.fields = {};
    if (this.events.length) this.schedule(0);

    if (leaving && navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    this.chain = this.chain
      .then(() =>
        fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }),
      )
      .catch(() => undefined);
  }

  stop() {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.events = [];
    this.fields = {};
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
