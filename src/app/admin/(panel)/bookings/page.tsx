import type { Metadata } from "next";
import BookingsView, { BOOKING_VIEWS } from "@/components/admin/BookingsView";
import { getBookings, type BookingView } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Bookings" };

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ view?: string; page?: string }> }) {
  const params = await searchParams;
  const view: BookingView = BOOKING_VIEWS.find((v) => v.view === params.view)?.view ?? "pending";
  const page = Math.max(1, Math.floor(Number(params.page)) || 1);
  const { bookings, pages, counts, now } = await getBookings(view, page);

  return <BookingsView view={view} page={page} pages={pages} counts={counts} bookings={bookings} now={now} />;
}
