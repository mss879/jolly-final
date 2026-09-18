import AdminNav from "@/components/admin/AdminNav";
import { adminEmail } from "@/lib/admin/auth";
import { getNavCounts } from "@/lib/admin/queries";

/* Signed-in admin area. Pages and actions check the admin again themselves.

   Nothing is awaited here on purpose: a layout that awaits runtime data
   blocks the whole navigation before loading.tsx can put anything on screen.
   So the sidebar shell ships straight away and the address and the badge
   counts stream in behind their own Suspense boundaries inside AdminNav. */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminNav email={adminEmail()} counts={getNavCounts()} />
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
