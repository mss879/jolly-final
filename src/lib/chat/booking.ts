import "server-only";
import { CARTS, EVENT_TYPES, FLAVORS, type Flavor } from "@/lib/data";
import type { BookingDraft } from "./types";

/* Turns what the AI gathered into clean reserve-form values, and says what's
   still missing. The database checks everything again on submit. */

export const REQUIRED: (keyof BookingDraft)[] = ["name", "phone", "email", "event_type"];

const LABELS: Record<keyof BookingDraft, string> = {
  name: "name",
  phone: "phone number",
  email: "email address",
  event_type: "occasion",
  event_date: "date",
  guests: "guest count",
  venue: "venue",
  cart: "cart colour",
  flavours: "flavours",
  custom_flavour: "custom flavours",
  message: "notes",
};

export const fieldLabel = (key: keyof BookingDraft) => LABELS[key];

// Same rule as private.is_email() in the migration.
export const EMAIL = /^[A-Za-z0-9._+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const squash = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/* "Ferrari red", "red", "the vanilla one" → the cart's name. */
export function matchCart(value: string) {
  const v = squash(value);
  if (!v) return null;
  return (
    CARTS.find((c) => squash(c.name) === v || squash(c.key) === v) ??
    CARTS.find((c) => v.length >= 3 && (v.includes(squash(c.name)) || squash(c.name).includes(v))) ??
    CARTS.find((c) => c.name.toLowerCase().split(" ").some((word) => v.includes(squash(word)))) ??
    null
  );
}

export function matchFlavour(value: string): Flavor | null {
  const v = squash(value);
  if (!v) return null;
  return (
    FLAVORS.find((f) => squash(f.name) === v || squash(f.slug) === v) ??
    FLAVORS.find((f) => v.length >= 4 && (squash(f.name).includes(v) || v.includes(squash(f.name)))) ??
    null
  );
}

function matchEventType(value: string) {
  const v = squash(value);
  if (!v) return null;
  return (
    EVENT_TYPES.find((t) => squash(t) === v) ??
    EVENT_TYPES.find((t) => v.length >= 4 && (squash(t).includes(v) || v.includes(squash(t)))) ??
    (/wedding|engagement|homecoming|nikah|reception/.test(v) ? "Wedding" : null) ??
    (/corporate|office|conference|launch|gala|company/.test(v) ? "Corporate Event" : null) ??
    (/birthday|party|anniversary|celebration|christening|baby/.test(v) ? "Private Party" : null) ??
    (/brand|collab|activation|popup/.test(v) ? "Brand Collaboration" : null) ??
    (/franchise|venue|hotel/.test(v) ? "Franchise / Venue Enquiry" : null) ??
    (/tub|home|500ml/.test(v) ? "Jolly's at Home (tubs)" : null) ??
    "Other"
  );
}

/* Today's date in Sri Lanka, as YYYY-MM-DD. */
export function colomboToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function longDate(day: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${day}T00:00:00Z`),
  );
}

export type DraftInput = Partial<Record<Exclude<keyof BookingDraft, "flavours" | "guests">, string>> & {
  guests?: number | string;
  flavours?: string[];
};

/* Merges new answers into the draft. A value given as "" clears that field. */
export function mergeDraft(current: BookingDraft, input: DraftInput) {
  const draft: BookingDraft = { ...current };
  const problems: string[] = [];
  const set = (key: keyof BookingDraft, value: string | string[] | undefined) => {
    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) delete draft[key];
    else (draft as Record<string, unknown>)[key] = value;
  };

  if (input.name !== undefined) set("name", clip(input.name, 120));
  if (input.phone !== undefined) {
    const phone = clip(input.phone, 40);
    if (phone && phone.replace(/\D/g, "").length < 7) problems.push(`"${phone}" doesn't look like a full phone number.`);
    else set("phone", phone);
  }
  if (input.email !== undefined) {
    const email = clip(input.email, 254);
    if (email && !EMAIL.test(email)) problems.push(`"${email}" doesn't look like a valid email address.`);
    else set("email", email);
  }
  if (input.event_type !== undefined) {
    const type = clip(input.event_type, 60);
    set("event_type", type ? (matchEventType(type) ?? "Other") : "");
  }
  if (input.event_date !== undefined) {
    const day = clip(input.event_date, 10);
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(`${day}T00:00:00Z`));
    if (day && !valid) problems.push(`"${day}" isn't a date in YYYY-MM-DD form.`);
    else if (day && day < colomboToday()) problems.push(`${longDate(day)} has already passed. Check the date with them.`);
    else set("event_date", day);
  }
  if (input.guests !== undefined) {
    const n = typeof input.guests === "number" ? input.guests : Number(String(input.guests).replace(/[^\d]/g, ""));
    if (String(input.guests).trim() === "") set("guests", "");
    else if (!Number.isInteger(n) || n < 1 || n > 100000) problems.push("The guest count should be a whole number.");
    else set("guests", String(n));
  }
  if (input.venue !== undefined) set("venue", clip(input.venue, 200));
  if (input.cart !== undefined) {
    const raw = clip(input.cart, 80);
    const cart = raw ? matchCart(raw) : null;
    if (raw && !cart) problems.push(`"${raw}" isn't one of the cart colours (${CARTS.map((c) => c.name).join(", ")}).`);
    else set("cart", cart?.name ?? "");
  }
  if (input.flavours !== undefined) {
    const picked: string[] = [];
    const unknown: string[] = [];
    for (const name of input.flavours.slice(0, 20)) {
      const f = matchFlavour(String(name));
      if (f) {
        if (!picked.includes(f.name)) picked.push(f.name);
      } else if (String(name).trim()) unknown.push(String(name).trim().slice(0, 60));
    }
    set("flavours", picked);
    if (unknown.length) {
      problems.push(
        `Not on the menu: ${unknown.join(", ")}. If they want these made, put them in custom_flavour (custom flavours need at least 500 cups).`,
      );
    }
  }
  if (input.custom_flavour !== undefined) set("custom_flavour", clip(input.custom_flavour, 200));
  if (input.message !== undefined) set("message", clip(input.message, 2000));

  const missing = REQUIRED.filter((key) => !draft[key]);
  return { draft, missing, problems };
}

export function missingFields(draft: BookingDraft) {
  return REQUIRED.filter((key) => !draft[key]);
}

/* One line for the AI's notes about the conversation. */
export function summariseDraft(draft: BookingDraft) {
  const parts = (Object.keys(LABELS) as (keyof BookingDraft)[])
    .filter((key) => draft[key] && (!Array.isArray(draft[key]) || (draft[key] as string[]).length))
    .map((key) => `${LABELS[key]}: ${Array.isArray(draft[key]) ? (draft[key] as string[]).join(", ") : draft[key]}`);
  return parts.length ? parts.join("; ") : null;
}

/* The bookings table's field values, as submit_booking expects them. */
export function bookingFields(draft: BookingDraft) {
  return {
    name: draft.name ?? "",
    phone: draft.phone ?? "",
    email: draft.email ?? "",
    event_type: draft.event_type ?? "",
    event_date: draft.event_date ?? "",
    guests: draft.guests ?? "",
    venue: draft.venue ?? "",
    cart: draft.cart ?? "",
    flavours: draft.flavours ?? [],
    custom_flavour: draft.custom_flavour ?? "",
    message: draft.message ?? "",
  };
}
