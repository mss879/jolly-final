import { Skeleton } from "@/components/admin/ui";

/* Sits inside bookings/layout.tsx, so the heading and the tabs are already
   on screen — only the table below them waits. */
export default function BookingsLoading() {
  return (
    <div className="border border-gold-200/70 bg-cream-50">
      <div className="flex min-h-12 items-center justify-between border-b border-gold-200/60 px-5 py-2.5">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
