import SectionTabs from "@/components/admin/SectionTabs";
import { PageHeader } from "@/components/admin/ui";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Bookings"
        description="Event requests from the reserve form. Confirmed bookings appear on the calendar."
      />
      <SectionTabs
        label="Bookings sections"
        items={[
          { href: "/admin/bookings", label: "Bookings" },
          { href: "/admin/bookings/analytics", label: "Analytics", exact: true },
        ]}
      />
      <div className="mt-6">{children}</div>
    </>
  );
}
