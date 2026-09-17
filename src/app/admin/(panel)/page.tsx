import type { Metadata } from "next";
import DashboardView from "@/components/admin/DashboardView";
import { getDashboard } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const data = await getDashboard();
  return <DashboardView data={data} />;
}
