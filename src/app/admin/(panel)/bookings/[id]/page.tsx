import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingDetailView from "@/components/admin/BookingDetailView";
import { getBooking } from "@/lib/admin/queries";
import { isUuid } from "@/lib/admin/validate";

export const metadata: Metadata = { title: "Booking" };

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const detail = await getBooking(id);
  if (!detail) notFound();

  return <BookingDetailView detail={detail} />;
}
