import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import type { BookingRow, InquiryRow, LeadRow } from "@/lib/supabase/database.types";
import { requireAdmin } from "./auth";
import { addDays, colomboDay, startOfColomboDay, weekdayIndex } from "./format";
import type {
  AnalyticsRange,
  BookingSummary,
  FormAnalytics,
  InquirySummary,
  Lead,
  Stage,
} from "./types";

/* Read side of the admin area. Every function checks the admin first, then
   returns only what its page renders. */

const DAY_MS = 86_400_000;
export const PAGE_SIZE = 25;

function must<T>(result: { data: T; error: PostgrestError | null }) {
  if (result.error) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result.data as NonNullable<T>;
}

/* For single-row lookups, where "not found" is a normal answer. */
function maybe<T>(result: { data: T; error: PostgrestError | null }) {
  if (result.error) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result.data;
}

function count(result: { count: number | null; error: PostgrestError | null }) {
  if (result.error) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result.count ?? 0;
}

const pct = (current: number, previous: number) =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

/* ─── Mapping rows to the shapes components use ─── */

const INQUIRY_COLUMNS = "id, name, email, phone, message, status, created_at";
type InquiryPick = Pick<InquiryRow, "id" | "name" | "email" | "phone" | "message" | "status" | "created_at">;

function toInquiry(row: InquiryPick, leadId: string | null = null): InquirySummary {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    leadId,
  };
}

const BOOKING_COLUMNS =
  "id, status, name, phone, email, event_type, event_date, confirmed_date, confirmed_time, guests, last_field, submitted_at, last_activity_at";
type BookingPick = Pick<
  BookingRow,
  | "id"
  | "status"
  | "name"
  | "phone"
  | "email"
  | "event_type"
  | "event_date"
  | "confirmed_date"
  | "confirmed_time"
  | "guests"
  | "last_field"
  | "submitted_at"
  | "last_activity_at"
>;

function toBooking(row: BookingPick): BookingSummary {
  return {
    id: row.id,
    status: row.status,
    name: row.name,
    phone: row.phone,
    email: row.email,
    eventType: row.event_type,
    eventDate: row.event_date,
    confirmedDate: row.confirmed_date,
    confirmedTime: row.confirmed_time,
    guests: row.guests,
    lastField: row.last_field,
    submittedAt: row.submitted_at,
    lastActivityAt: row.last_activity_at,
  };
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    stageId: row.stage_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    eventType: row.event_type,
    eventDate: row.event_date,
    guests: row.guests,
    valueLkr: row.value_lkr === null ? null : Number(row.value_lkr),
    notes: row.notes,
    source: row.source,
    inquiryId: row.inquiry_id,
    bookingId: row.booking_id,
    createdAt: row.created_at,
  };
}

/* ─── Navigation badges ─── */

export async function getNavCounts() {
  const { supabase } = await requireAdmin();
  const [inquiries, bookings] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return { newInquiries: count(inquiries), pendingBookings: count(bookings) };
}

/* ─── Inquiries ─── */

export type InquiryView = "inbox" | "archived";

export async function getInquiries(view: InquiryView, page: number) {
  const { supabase } = await requireAdmin();
  const from = (page - 1) * PAGE_SIZE;

  let list = supabase
    .from("inquiries")
    .select(INQUIRY_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  list = view === "archived" ? list.eq("status", "archived") : list.neq("status", "archived");

  const [result, inbox, archived] = await Promise.all([
    list,
    supabase.from("inquiries").select("id", { count: "exact", head: true }).neq("status", "archived"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "archived"),
  ]);
  const rows = must(result);
  const leads = rows.length
    ? must(await supabase.from("crm_leads").select("id, inquiry_id").in("inquiry_id", rows.map((r) => r.id)))
    : [];
  const leadFor = new Map(leads.map((l) => [l.inquiry_id, l.id]));

  return {
    now: Date.now(),
    inquiries: rows.map((r) => toInquiry(r, leadFor.get(r.id) ?? null)),
    pages: Math.max(1, Math.ceil((result.count ?? 0) / PAGE_SIZE)),
    counts: { inbox: count(inbox), archived: count(archived) },
  };
}

export async function getInquiry(id: string) {
  const { supabase } = await requireAdmin();
  const row = maybe(await supabase.from("inquiries").select(INQUIRY_COLUMNS).eq("id", id).maybeSingle());
  if (!row) return null;
  const lead = maybe(await supabase.from("crm_leads").select("id").eq("inquiry_id", id).maybeSingle());
  return toInquiry(row, lead?.id ?? null);
}

/* ─── CRM ─── */

export async function getBoard() {
  const { supabase } = await requireAdmin();
  const [stages, leads] = await Promise.all([
    supabase.from("crm_stages").select("id, name, is_system").order("is_system", { ascending: false }).order("position"),
    supabase.from("crm_leads").select("*").order("position").order("created_at").limit(2000),
  ]);
  return {
    stages: must(stages).map((s): Stage => ({ id: s.id, name: s.name, isSystem: s.is_system })),
    leads: must(leads).map(toLead),
  };
}

/* ─── Bookings ─── */

export type BookingView = "pending" | "confirmed" | "incomplete" | "closed" | "all";

export async function getBookings(view: BookingView, page: number) {
  const { supabase } = await requireAdmin();
  const from = (page - 1) * PAGE_SIZE;
  const head = () => supabase.from("bookings").select("id", { count: "exact", head: true });

  let list = supabase.from("bookings").select(BOOKING_COLUMNS, { count: "exact" }).range(from, from + PAGE_SIZE - 1);
  if (view === "pending") list = list.eq("status", "pending").order("submitted_at", { ascending: false });
  if (view === "confirmed") list = list.eq("status", "confirmed").order("confirmed_date", { ascending: false });
  if (view === "closed") list = list.in("status", ["declined", "cancelled"]).order("status_changed_at", { ascending: false });
  if (view === "all") list = list.neq("status", "in_progress").order("submitted_at", { ascending: false });
  // Incomplete: saved as they typed but never sent — only worth a call if we can reach them.
  if (view === "incomplete") {
    list = list
      .eq("status", "in_progress")
      .or("phone.not.is.null,email.not.is.null")
      .order("last_activity_at", { ascending: false });
  }

  const [result, pending, confirmed, incomplete, closed, all] = await Promise.all([
    list,
    head().eq("status", "pending"),
    head().eq("status", "confirmed"),
    head().eq("status", "in_progress").or("phone.not.is.null,email.not.is.null"),
    head().in("status", ["declined", "cancelled"]),
    head().neq("status", "in_progress"),
  ]);

  return {
    now: Date.now(),
    bookings: must(result).map(toBooking),
    pages: Math.max(1, Math.ceil((result.count ?? 0) / PAGE_SIZE)),
    counts: {
      pending: count(pending),
      confirmed: count(confirmed),
      incomplete: count(incomplete),
      closed: count(closed),
      all: count(all),
    },
  };
}

export async function getBooking(id: string) {
  const { supabase } = await requireAdmin();
  const booking = maybe(await supabase.from("bookings").select("*").eq("id", id).maybeSingle());
  if (!booking) return null;

  const [lead, confirmer] = await Promise.all([
    supabase.from("crm_leads").select("id").eq("booking_id", id).maybeSingle(),
    booking.confirmed_by
      ? supabase.from("admin_users").select("email").eq("user_id", booking.confirmed_by).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  return {
    now: Date.now(),
    booking,
    leadId: maybe(lead)?.id ?? null,
    confirmedBy: maybe(confirmer)?.email ?? null,
  };
}

/* ─── Analytics ─── */

/* Whole Sri Lanka days, today included. */
function rangeBounds(days: number, endDay = colomboDay()) {
  const from = startOfColomboDay(addDays(endDay, -(days - 1)));
  return { from, to: new Date() };
}

export async function getFormAnalytics(days: AnalyticsRange) {
  const { supabase } = await requireAdmin();
  const { from, to } = rangeBounds(days);
  const data = must(
    await supabase.rpc("booking_form_analytics", { p_from: from.toISOString(), p_to: to.toISOString() }),
  );
  return data as unknown as FormAnalytics;
}

/* ─── Calendar ─── */

/* `month` is "YYYY-MM". The grid runs Monday to Sunday and always shows
   whole weeks, so it can include days from the months either side. */
export async function getCalendarMonth(month: string) {
  const { supabase } = await requireAdmin();
  const first = `${month}-01`;
  const next = addDays(first, 32).slice(0, 7);
  const last = addDays(`${next}-01`, -1);
  const gridStart = addDays(first, -weekdayIndex(first));
  const gridEnd = addDays(last, 6 - weekdayIndex(last));

  const [events, pending] = await Promise.all([
    supabase
      .from("bookings")
      .select(BOOKING_COLUMNS)
      .eq("status", "confirmed")
      .gte("confirmed_date", gridStart)
      .lte("confirmed_date", gridEnd)
      .order("confirmed_date")
      .order("confirmed_time", { nullsFirst: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return { gridStart, gridEnd, events: must(events).map(toBooking), pending: count(pending) };
}

/* ─── Dashboard ─── */

export async function getDashboard() {
  const { supabase } = await requireAdmin();
  const now = Date.now();
  const today = colomboDay();
  const since = (days: number) => new Date(now - days * DAY_MS).toISOString();
  const d30 = since(30);
  const d60 = since(60);
  const activityFrom = startOfColomboDay(addDays(today, -29)).toISOString();
  const quietSince = new Date(now - 30 * 60_000).toISOString();

  const inquiries = () => supabase.from("inquiries").select("id", { count: "exact", head: true });
  const bookings = () => supabase.from("bookings").select("id", { count: "exact", head: true });
  const analyticsRange = rangeBounds(30);
  const previousRange = { from: new Date(analyticsRange.from.getTime() - 30 * DAY_MS), to: analyticsRange.from };

  const [
    newInquiries,
    pending,
    incomplete,
    inquiries30,
    inquiriesPrev,
    requests30,
    requestsPrev,
    confirmed30,
    confirmedPrev,
    upcoming,
    latestInquiries,
    latestRequests,
    stages,
    leads,
    inquiryDays,
    requestDays,
    analytics,
    analyticsPrev,
  ] = await Promise.all([
    inquiries().eq("status", "new"),
    bookings().eq("status", "pending"),
    bookings()
      .eq("status", "in_progress")
      .lt("last_activity_at", quietSince)
      .gte("last_activity_at", since(7))
      .or("phone.not.is.null,email.not.is.null"),
    inquiries().gte("created_at", d30),
    inquiries().gte("created_at", d60).lt("created_at", d30),
    bookings().gte("submitted_at", d30),
    bookings().gte("submitted_at", d60).lt("submitted_at", d30),
    bookings().gte("confirmed_at", d30),
    bookings().gte("confirmed_at", d60).lt("confirmed_at", d30),
    supabase
      .from("bookings")
      .select(BOOKING_COLUMNS)
      .eq("status", "confirmed")
      .gte("confirmed_date", today)
      .order("confirmed_date")
      .order("confirmed_time", { nullsFirst: true })
      .limit(5),
    supabase.from("inquiries").select(INQUIRY_COLUMNS).order("created_at", { ascending: false }).limit(5),
    supabase
      .from("bookings")
      .select(BOOKING_COLUMNS)
      .neq("status", "in_progress")
      .order("submitted_at", { ascending: false })
      .limit(5),
    supabase.from("crm_stages").select("id, name, is_system").order("is_system", { ascending: false }).order("position"),
    supabase.from("crm_leads").select("stage_id, value_lkr").limit(5000),
    supabase.from("inquiries").select("created_at").gte("created_at", activityFrom).limit(5000),
    supabase.from("bookings").select("submitted_at").gte("submitted_at", activityFrom).limit(5000),
    supabase.rpc("booking_form_analytics", {
      p_from: analyticsRange.from.toISOString(),
      p_to: analyticsRange.to.toISOString(),
    }),
    supabase.rpc("booking_form_analytics", {
      p_from: previousRange.from.toISOString(),
      p_to: previousRange.to.toISOString(),
    }),
  ]);

  // Enquiries per Sri Lanka day, oldest first
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i - 29));
  const tally = (stamps: (string | null)[]) => {
    const map = new Map<string, number>();
    for (const stamp of stamps) if (stamp) map.set(colomboDay(stamp), (map.get(colomboDay(stamp)) ?? 0) + 1);
    return map;
  };
  const inquiryTally = tally(must(inquiryDays).map((r) => r.created_at));
  const requestTally = tally(must(requestDays).map((r) => r.submitted_at));

  const leadRows = must(leads);
  const pipeline = must(stages).map((s) => {
    const inStage = leadRows.filter((l) => l.stage_id === s.id);
    return {
      id: s.id,
      name: s.name,
      isSystem: s.is_system,
      leads: inStage.length,
      value: inStage.reduce((sum, l) => sum + Number(l.value_lkr ?? 0), 0),
    };
  });

  const form = must(analytics) as unknown as FormAnalytics;
  const formPrev = must(analyticsPrev) as unknown as FormAnalytics;
  const conversion = (a: FormAnalytics) => (a.totals.views ? a.totals.submitted / a.totals.views : null);
  const conversionNow = conversion(form);
  const conversionPrev = conversion(formPrev);

  return {
    now,
    today,
    attention: {
      newInquiries: count(newInquiries),
      pendingBookings: count(pending),
      incompleteBookings: count(incomplete),
    },
    kpis: {
      inquiries: { value: count(inquiries30), change: pct(count(inquiries30), count(inquiriesPrev)) },
      requests: { value: count(requests30), change: pct(count(requests30), count(requestsPrev)) },
      confirmed: { value: count(confirmed30), change: pct(count(confirmed30), count(confirmedPrev)) },
      conversion: {
        value: conversionNow,
        change:
          conversionNow === null || conversionPrev === null
            ? null
            : Math.round((conversionNow - conversionPrev) * 100),
      },
    },
    activity: days.map((day) => ({
      day,
      inquiries: inquiryTally.get(day) ?? 0,
      requests: requestTally.get(day) ?? 0,
    })),
    upcoming: must(upcoming).map(toBooking),
    latestInquiries: must(latestInquiries).map((r) => toInquiry(r)),
    latestRequests: must(latestRequests).map(toBooking),
    pipeline,
    form,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;
export type CalendarData = Awaited<ReturnType<typeof getCalendarMonth>>;
export type BookingDetail = NonNullable<Awaited<ReturnType<typeof getBooking>>>;
