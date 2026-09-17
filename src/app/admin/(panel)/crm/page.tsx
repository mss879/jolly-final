import type { Metadata } from "next";
import KanbanBoard from "@/components/admin/KanbanBoard";
import { PageHeader } from "@/components/admin/ui";
import { getBoard } from "@/lib/admin/queries";
import { isUuid } from "@/lib/admin/validate";

export const metadata: Metadata = { title: "CRM" };

export default async function CrmPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const [{ stages, leads }, { lead }] = await Promise.all([getBoard(), searchParams]);

  return (
    <>
      <PageHeader
        title="CRM"
        description="Your pipeline. New Leads is fixed — rename, reorder, add or remove any other stage."
      />
      <KanbanBoard stages={stages} leads={leads} openLeadId={isUuid(lead) ? lead : null} />
    </>
  );
}
