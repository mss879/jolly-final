import { Skeleton } from "@/components/admin/ui";

/* Shown the instant a nav link is clicked, while the page's data loads.
   Having this file is also what makes these dynamic routes prefetchable —
   without it Next skips prefetching them and a click shows nothing at all
   until the server answers. */
export default function PanelLoading() {
  return (
    <div>
      <div className="pb-6">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="border border-gold-200/70 bg-cream-50 px-5 py-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-16" />
            <Skeleton className="mt-3 h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="border border-gold-200/70 bg-cream-50">
            <div className="flex min-h-12 items-center border-b border-gold-200/60 px-5 py-2.5">
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex flex-col gap-3 p-5">
              {Array.from({ length: 4 }, (_, row) => (
                <Skeleton key={row} className="h-11 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
