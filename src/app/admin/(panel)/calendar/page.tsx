import type { Metadata } from "next";
import CalendarView from "@/components/admin/CalendarView";
import { colomboDay } from "@/lib/admin/format";
import { getCalendarMonth } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month: raw } = await searchParams;
  const today = colomboDay();
  const month = raw && /^\d{4}-(0[1-9]|1[0-2])$/.test(raw) ? raw : today.slice(0, 7);
  const data = await getCalendarMonth(month);

  return <CalendarView month={month} today={today} data={data} />;
}
