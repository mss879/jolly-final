import Link from "next/link";
import { btnPrimary } from "@/components/admin/ui";

export default function AdminNotFound() {
  return (
    <div className="border border-gold-200/70 bg-cream-50 px-6 py-14 text-center">
      <p className="font-display text-2xl text-plum-900">That record isn&apos;t here</p>
      <p className="mx-auto mt-3 max-w-sm text-sm text-ink-500">It may have been deleted, or the link is out of date.</p>
      <Link href="/admin" className={`${btnPrimary} mt-6`}>
        Back to the dashboard
      </Link>
    </div>
  );
}
