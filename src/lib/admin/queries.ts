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
  const { supabase, verify } = await requireAdmin();
  const [, inquiries, bookings] = await Promise.all([
    verify(),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return { newInquiries: count(inquiries), pendingBookings: count(bookings) };
}

/* ─── Inquiries ─── */

export type InquiryView = "inbox" | "archived";

/* Counts come first so an out-of-date ?page= lands on the last real page. */
function clampPage(requested: number, total: number) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, requested), pages);
  return { page, pages, from: (page - 1) * PAGE_SIZE };
}

export async function getInquiries(view: InquiryView, requestedPage: number) {
  const { supabase, verify } = await requireAdmin();

  /* The rows used to wait on the counts, because the range was worked out
     from them. They ask for the page that was requested instead, so counts
     and rows travel together — one round trip rather than two. */
  const listFrom = (start: number) => {
    const q = supabase
      .from("inquiries")
      .select(INQUIRY_COLUMNS)
      .order("created_at", { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    return view === "archived" ? q.eq("status", "archived") : q.neq("status", "archived");
  };

  const asked = Math.max(1, requestedPage);
  const [, inbox, archived, listed] = await Promise.all([
    verify(),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).neq("status", "archived"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "archived"),
    listFrom((asked - 1) * PAGE_SIZE),
  ]);

  const counts = { inbox: count(inbox), archived: count(archived) };
  const { page, pages, from } = clampPage(asked, view === "archived" ? counts.archived : counts.inbox);
  // Only when a page number lands past the end — normally never.
  const rows = must(page === asked ? listed : await listFrom(from));

  const leads = rows.length
    ? must(await supabase.from("crm_leads").select("id, inquiry_id").in("inquiry_id", rows.map((r) => r.id)))
    : [];
  const leadFor = new Map(leads.map((l) => [l.inquiry_id, l.id]));

  return {
    now: Date.now(),
    page,
    pages,
    counts,
    inquiries: rows.map((r) => toInquiry(r, leadFor.get(r.id) ?? null)),
  };
}

export async function getInquiry(id: string) {
  const { supabase, verify } = await requireAdmin();
  // The lead is keyed by inquiry id, so it can be looked up at the same time.
  const [, found, lead] = await Promise.all([
    verify(),
    supabase.from("inquiries").select(INQUIRY_COLUMNS).eq("id", id).maybeSingle(),
    supabase.from("crm_leads").select("id").eq("inquiry_id", id).maybeSingle(),
  ]);
  const row = maybe(found);
  if (!row) return null;
  return toInquiry(row, maybe(lead)?.id ?? null);
}

/* ─── CRM ─── */

export async function getBoard() {
  const { supabase, verify } = await requireAdmin();
  // Supabase returns at most 1,000 rows per request (by default), so page through.
  const readLeads = async () => {
    const rows: LeadRow[] = [];
    for (;;) {
      const batch = must(
        await supabase
          .from("crm_leads")
          .select("*")
          .order("position")
          .order("created_at")
          .order("id")
          .range(rows.length, rows.length + 999),
      );
      if (!batch.length) return rows;
      rows.push(...batch);
    }
  };
  const [, stages, leads] = await Promise.all([
    verify(),
    supabase.from("crm_stages").select("id, name, is_system").order("is_system", { ascending: false }).order("position"),
    readLeads(),
  ]);
  return {
    stages: must(stages).map((s): Stage => ({ id: s.id, name: s.name, isSystem: s.is_system })),
    leads: leads.map(toLead),
  };
}

/* ─── Bookings ─── */

export type BookingView = "pending" | "confirmed" | "incomplete" | "closed" | "all";

export async function getBookings(view: BookingView, requestedPage: number) {
  const { supabase, verify } = await requireAdmin();
  const head = () => supabase.from("bookings").select("id", { count: "exact", head: true });

  /* The rows used to wait on the tab counts, because the range was worked
     out from them. They ask for the page that was requested instead, so
     counts and rows travel together — one round trip rather than two. */
  const listFrom = (start: number) => {
    let list = supabase.from("bookings").select(BOOKING_COLUMNS).range(start, start + PAGE_SIZE - 1);
    const newestSent = { ascending: false, nullsFirst: false } as const;
    if (view === "pending") list = list.eq("status", "pending").order("submitted_at", newestSent);
    if (view === "confirmed") list = list.eq("status", "confirmed").order("confirmed_date", { ascending: false });
    if (view === "closed") list = list.in("status", ["declined", "cancelled"]).order("status_changed_at", newestSent);
    if (view === "all") list = list.neq("status", "in_progress").order("submitted_at", newestSent);
    // Incomplete: saved as they typed but never sent — only worth a call if we can reach them.
    if (view === "incomplete") {
      list = list
        .eq("status", "in_progress")
        .or("phone.not.is.null,email.not.is.null")
        .order("last_activity_at", { ascending: false });
    }
    return list;
  };

  const asked = Math.max(1, requestedPage);
  const [, pending, confirmed, incomplete, closed, all, listed] = await Promise.all([
    verify(),
    head().eq("status", "pending"),
    head().eq("status", "confirmed"),
    head().eq("status", "in_progress").or("phone.not.is.null,email.not.is.null"),
    head().in("status", ["declined", "cancelled"]),
    head().neq("status", "in_progress"),
    listFrom((asked - 1) * PAGE_SIZE),
  ]);
  const counts = {
    pending: count(pending),
    confirmed: count(confirmed),
    incomplete: count(incomplete),
    closed: count(closed),
    all: count(all),
  };
  const { page, pages, from } = clampPage(asked, counts[view]);
  // Only when a page number lands past the end — normally never.
  const rows = must(page === asked ? listed : await listFrom(from));

  return {
    now: Date.now(),
    page,
    pages,
    counts,
    bookings: rows.map(toBooking),
  };
}

export async function getBooking(id: string) {
  const { supabase, verify } = await requireAdmin();
  // The lead is keyed by booking id, so it needn't wait for the booking row.
  const [, found, lead] = await Promise.all([
    verify(),
    supabase.from("bookings").select("*").eq("id", id).maybeSingle(),
    supabase.from("crm_leads").select("id").eq("booking_id", id).maybeSingle(),
  ]);
  const booking = maybe(found);
  if (!booking) return null;

  // Who confirmed it is only knowable once the row is in hand.
  const confirmer = booking.confirmed_by
    ? maybe(await supabase.from("admin_users").select("email").eq("user_id", booking.confirmed_by).maybeSingle())
    : null;

  return {
    now: Date.now(),
    booking,
    leadId: maybe(lead)?.id ?? null,
    confirmedBy: confirmer?.email ?? null,
  };
}

/* ─── Analytics ─── */

/* Whole Sri Lanka days, today included. */
function rangeBounds(days: number, endDay = colomboDay()) {
  const from = startOfColomboDay(addDays(endDay, -(days - 1)));
  return { from, to: new Date() };
}

export async function getFormAnalytics(days: AnalyticsRange) {
  const { supabase, verify } = await requireAdmin();
  const { from, to } = rangeBounds(days);
  const [, result] = await Promise.all([
    verify(),
    supabase.rpc("booking_form_analytics", { p_from: from.toISOString(), p_to: to.toISOString() }),
  ]);
  return must(result) as unknown as FormAnalytics;
}

/* ─── Calendar ─── */

/* `month` is "YYYY-MM". The grid runs Monday to Sunday and always shows
   whole weeks, so it can include days from the months either side. */
export async function getCalendarMonth(month: string) {
  const { supabase, verify } = await requireAdmin();
  const first = `${month}-01`;
  const next = addDays(first, 32).slice(0, 7);
  const last = addDays(`${next}-01`, -1);
  const gridStart = addDays(first, -weekdayIndex(first));
  const gridEnd = addDays(last, 6 - weekdayIndex(last));

  const [, events, pending] = await Promise.all([
    verify(),
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
  const { supabase, verify } = await requireAdmin();
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
    ,
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
    pipelineRows,
    activityRows,
    analytics,
    analyticsPrev,
  ] = await Promise.all([
    verify(),
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
    bookings().eq("status", "confirmed").gte("confirmed_at", d30),
    bookings().eq("status", "confirmed").gte("confirmed_at", d60).lt("confirmed_at", d30),
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
      .order("submitted_at", { ascending: false, nullsFirst: false })
      .limit(5),
    supabase.from("crm_stages").select("id, name, is_system").order("is_system", { ascending: false }).order("position"),
    supabase.rpc("crm_pipeline_summary"),
    supabase.rpc("admin_daily_activity", { p_from: activityFrom, p_days: 30 }),
    supabase.rpc("booking_form_analytics", {
      p_from: analyticsRange.from.toISOString(),
      p_to: analyticsRange.to.toISOString(),
    }),
    supabase.rpc("booking_form_analytics", {
      p_from: previousRange.from.toISOString(),
      p_to: previousRange.to.toISOString(),
    }),
  ]);

  const summary = new Map(must(pipelineRows).map((r) => [r.stage_id, r]));
  const pipeline = must(stages).map((s) => ({
    id: s.id,
    name: s.name,
    isSystem: s.is_system,
    leads: Number(summary.get(s.id)?.leads ?? 0),
    value: Number(summary.get(s.id)?.value_lkr ?? 0),
  }));

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
    // New enquiries per Sri Lanka day, oldest first
    activity: must(activityRows).map((r) => ({ day: r.day, inquiries: Number(r.inquiries), requests: Number(r.requests) })),
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
