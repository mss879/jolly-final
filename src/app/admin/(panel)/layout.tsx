import { unstable_rethrow } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { adminEmail } from "@/lib/admin/auth";
import { getNavCounts } from "@/lib/admin/queries";

/* The badges are a nicety. This layout sits above error.tsx, so a failed
   count would otherwise blank the whole admin; the sidebar goes without them
   instead. */
async function navCounts() {
  try {
    return await getNavCounts();
  } catch (error) {
    unstable_rethrow(error);
    console.error(error);
    return { newInquiries: 0, pendingBookings: 0 };
  }
}

/* Signed-in admin area. Pages and actions check the admin again themselves.

   Nothing is awaited here on purpose: a layout that awaits runtime data
   blocks the whole navigation before loading.tsx can put anything on screen.
   So the sidebar shell ships straight away and the address and the badge
   counts stream in behind their own Suspense boundaries inside AdminNav. */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminNav email={adminEmail()} counts={navCounts()} />
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
