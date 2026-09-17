import type { BookingStatus, LeadSource } from "@/lib/supabase/database.types";

/* Shapes the admin pages pass to their components. Kept separate from the
   row types so client components only ever receive the columns they show. */

export type Tone = "good" | "warning" | "critical" | "neutral" | "muted" | "info";

export const BOOKING_STATUS: Record<BookingStatus, { label: string; tone: Tone }> = {
  in_progress: { label: "Incomplete", tone: "muted" },
  pending: { label: "Awaiting confirmation", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "good" },
  declined: { label: "Declined", tone: "critical" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

/* A visitor still typing counts as "filling in" for this long after their
   last keystroke — the same 30 minutes the analytics use. */
export const ACTIVE_WINDOW_MS = 30 * 60_000;

export const LEAD_SOURCE: Record<LeadSource, string> = {
  inquiry: "Inquiry",
  booking: "Booking",
  manual: "Added by hand",
};

export type Stage = { id: string; name: string; isSystem: boolean };

export type Lead = {
  id: string;
  stageId: string;
  name: string;
  email: string | null;
  phone: string | null;
  eventType: string | null;
  eventDate: string | null;
  guests: number | null;
  valueLkr: number | null;
  notes: string | null;
  source: LeadSource;
  inquiryId: string | null;
  bookingId: string | null;
  createdAt: string;
};

export type InquirySummary = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
  leadId: string | null;
};

export type BookingSummary = {
  id: string;
  status: BookingStatus;
  name: string | null;
  phone: string | null;
  email: string | null;
  eventType: string | null;
  eventDate: string | null;
  confirmedDate: string | null;
  confirmedTime: string | null;
  guests: number | null;
  lastField: string | null;
  submittedAt: string | null;
  lastActivityAt: string;
};

/* ─── booking_form_analytics() ─── */

export type FunnelCounts = { views: number; started: number; submitted: number };

export type FormAnalytics = {
  from: string;
  to: string;
  totals: FunnelCounts & {
    abandoned: number;
    in_progress: number;
    median_seconds_to_submit: number | null;
  };
  fields: {
    field: string;
    idx: number;
    reached: number;
    filled: number;
    dropped: number;
    errors: number;
    avg_ms: number | null;
  }[];
  daily: (FunnelCounts & { day: string })[];
  devices: (FunnelCounts & { device: string })[];
  sources: (FunnelCounts & { source: string })[];
};

export const ANALYTICS_RANGES = [7, 30, 90] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };
