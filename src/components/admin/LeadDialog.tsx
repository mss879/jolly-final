"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { EVENT_TYPES } from "@/lib/data";
import { deleteLead, saveLead } from "@/lib/admin/actions/crm";
import { formatDateTime } from "@/lib/admin/format";
import { LEAD_SOURCE, type Lead, type Stage } from "@/lib/admin/types";
import Dialog from "./Dialog";
import Icon from "./icons";
import { btnDanger, btnGhost, btnPrimary, btnSecondary, inputCls, labelCls } from "./ui";

export type LeadDialogState = { mode: "edit"; lead: Lead; stageId: string } | { mode: "new"; stageId: string } | null;

export default function LeadDialog({
  state,
  stages,
  onClose,
}: {
  state: LeadDialogState;
  stages: Stage[];
  onClose: () => void;
}) {
  const lead = state?.mode === "edit" ? state.lead : null;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function close() {
    setError(null);
    setConfirmDelete(false);
    onClose();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (key: string) => String(f.get(key) ?? "");
    setError(null);
    startTransition(async () => {
      const result = await saveLead({
        id: lead?.id,
        stageId: get("stageId"),
        name: get("name"),
        email: get("email"),
        phone: get("phone"),
        eventType: get("eventType"),
        eventDate: get("eventDate"),
        guests: get("guests"),
        valueLkr: get("valueLkr"),
        notes: get("notes"),
      });
      if (result.ok) close();
      else setError(result.error);
    });
  }

  function onDelete() {
    if (!lead) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteLead(lead.id);
      if (result.ok) close();
      else setError(result.error);
    });
  }

  return (
    <Dialog
      open={state !== null}
      onClose={close}
      wide
      title={lead ? lead.name : "Add a lead"}
      description={
        lead ? (
          <>
            {LEAD_SOURCE[lead.source]} · added {formatDateTime(lead.createdAt)}
          </>
        ) : (
          "For enquiries that came in by phone, WhatsApp or in person."
        )
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="lead-name" className={labelCls}>
            Name *
          </label>
          <input id="lead-name" name="name" required maxLength={120} defaultValue={lead?.name} className={inputCls} />
        </div>
        <div>
          <label htmlFor="lead-phone" className={labelCls}>
            Phone
          </label>
          <input id="lead-phone" name="phone" type="tel" maxLength={40} defaultValue={lead?.phone ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="lead-email" className={labelCls}>
            Email
          </label>
          <input id="lead-email" name="email" type="email" maxLength={254} defaultValue={lead?.email ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="lead-type" className={labelCls}>
            Event type
          </label>
          <input
            id="lead-type"
            name="eventType"
            list="lead-event-types"
            maxLength={60}
            defaultValue={lead?.eventType ?? ""}
            className={inputCls}
          />
          <datalist id="lead-event-types">
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="lead-date" className={labelCls}>
            Event date
          </label>
          <input id="lead-date" name="eventDate" type="date" defaultValue={lead?.eventDate ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="lead-guests" className={labelCls}>
            Guests
          </label>
          <input
            id="lead-guests"
            name="guests"
            type="number"
            min={1}
            defaultValue={lead?.guests ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="lead-value" className={labelCls}>
            Estimated value (LKR)
          </label>
          <input
            id="lead-value"
            name="valueLkr"
            inputMode="decimal"
            defaultValue={lead?.valueLkr ?? ""}
            placeholder="e.g. 150000"
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-stage" className={labelCls}>
            Stage
          </label>
          <select id="lead-stage" name="stageId" defaultValue={state?.stageId} className={inputCls}>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-notes" className={labelCls}>
            Notes
          </label>
          <textarea id="lead-notes" name="notes" rows={5} maxLength={10000} defaultValue={lead?.notes ?? ""} className={inputCls} />
        </div>

        {lead && (lead.inquiryId || lead.bookingId) && (
          <p className="text-[0.8rem] text-ink-500 sm:col-span-2">
            <Link
              href={lead.inquiryId ? `/admin/inquiries?id=${lead.inquiryId}` : `/admin/bookings/${lead.bookingId}`}
              className="inline-flex items-center gap-1 font-semibold text-plum-900 hover:text-gold-700"
            >
              Open the original {lead.inquiryId ? "inquiry" : "booking"} <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-rose-700 sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold-200/60 pt-4 sm:col-span-2">
          {lead ? (
            confirmDelete ? (
              <span className="flex flex-wrap items-center gap-2 text-sm text-ink-700">
                Delete this lead?
                <button type="button" onClick={onDelete} disabled={pending} className={btnDanger}>
                  Delete
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className={btnGhost}>
                  Cancel
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className={`${btnGhost} text-rose-700`}>
                <Icon name="trash" /> Delete lead
              </button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" onClick={close} className={btnSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={pending} className={btnPrimary}>
              {pending ? "Saving…" : lead ? "Save changes" : "Add lead"}
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
