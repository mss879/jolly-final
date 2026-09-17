import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/auth";
import { getNavCounts } from "@/lib/admin/queries";

/* Signed-in admin area. Pages and actions check the admin again themselves —
   layouts don't re-render on every navigation. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  const counts = await getNavCounts();

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminNav email={user.email} counts={counts} />
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
