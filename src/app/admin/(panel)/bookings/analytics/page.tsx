import type { Metadata } from "next";
import AnalyticsView from "@/components/admin/AnalyticsView";
import { getFormAnalytics } from "@/lib/admin/queries";
import { ANALYTICS_RANGES, type AnalyticsRange } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Booking analytics" };

export default async function BookingAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range: raw } = await searchParams;
  const range: AnalyticsRange = ANALYTICS_RANGES.find((r) => String(r) === raw) ?? 30;
  const data = await getFormAnalytics(range);

  return <AnalyticsView range={range} data={data} />;
}
