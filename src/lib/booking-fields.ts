/* The reserve form's fields, in on-page order. Keys are the bookings table's
   column names and must match private.booking_form_fields() in
   supabase/migrations — the analytics funnel follows this order. */
export const BOOKING_FIELDS = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "event_type", label: "Event type" },
  { key: "event_date", label: "Event date" },
  { key: "guests", label: "Guests" },
  { key: "venue", label: "Venue" },
  { key: "cart", label: "Cart colour" },
  { key: "flavours", label: "Flavours" },
  { key: "custom_flavour", label: "Custom flavour" },
  { key: "message", label: "Event details" },
] as const;

export type BookingFieldKey = (typeof BOOKING_FIELDS)[number]["key"];

const KEYS = new Set<string>(BOOKING_FIELDS.map((f) => f.key));

export function isBookingField(name: unknown): name is BookingFieldKey {
  return typeof name === "string" && KEYS.has(name);
}

export function bookingFieldLabel(key: string | null | undefined) {
  return BOOKING_FIELDS.find((f) => f.key === key)?.label ?? "—";
}
