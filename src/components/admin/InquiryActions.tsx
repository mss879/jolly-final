"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteInquiry,
  markInquiryRead,
  moveInquiryToCrm,
  setInquiryStatus,
} from "@/lib/admin/actions/inquiries";
import type { InquirySummary } from "@/lib/admin/types";
import { ConfirmDialog } from "./Dialog";
import Icon from "./icons";
import { btnGhost, btnPrimary, btnSecondary } from "./ui";

export default function InquiryActions({ inquiry, listHref }: { inquiry: InquirySummary; listHref: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // Opening a new inquiry marks it read.
  useEffect(() => {
    if (inquiry.status === "new") markInquiryRead(inquiry.id).catch(() => {}); // best effort
  }, [inquiry.id, inquiry.status]);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      else after?.();
    });
  }

  const archived = inquiry.status === "archived";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {inquiry.leadId ? (
          <Link href={`/admin/crm?lead=${inquiry.leadId}`} className={btnSecondary}>
            <Icon name="board" /> View in CRM
          </Link>
        ) : (
          <button type="button" disabled={pending} onClick={() => run(() => moveInquiryToCrm(inquiry.id))} className={btnPrimary}>
            <Icon name="board" /> Move to CRM
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setInquiryStatus(inquiry.id, archived ? "read" : "archived"))}
          className={btnSecondary}
        >
          <Icon name={archived ? "undo" : "archive"} /> {archived ? "Move to inbox" : "Archive"}
        </button>
        {!archived && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => setInquiryStatus(inquiry.id, "new"), () => router.push(listHref))}
            className={btnGhost}
          >
            Mark as unread
          </button>
        )}
        <button type="button" onClick={() => setConfirming(true)} className={`${btnGhost} text-rose-700 hover:text-rose-800`}>
          <Icon name="trash" /> Delete
        </button>
      </div>
      {inquiry.leadId && <p className="mt-3 text-[0.78rem] text-ink-500">This inquiry is in the CRM pipeline.</p>}
      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() =>
          run(
            () => deleteInquiry(inquiry.id),
            () => {
              setConfirming(false);
              router.replace(listHref);
            },
          )
        }
        title="Delete this inquiry?"
        description={
          inquiry.leadId
            ? "The message is removed for good. Its lead stays in the CRM."
            : "The message is removed for good. Archive it instead to keep a record."
        }
        confirmLabel="Delete inquiry"
        pending={pending}
        error={confirming ? error : null}
        danger
      />
    </div>
  );
}
