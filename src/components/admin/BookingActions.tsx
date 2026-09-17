"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  confirmBooking,
  deleteBooking,
  moveBookingToCrm,
  saveBookingNotes,
  setBookingStatus,
} from "@/lib/admin/actions/bookings";
import type { ActionResult } from "@/lib/admin/types";
import type { BookingStatus } from "@/lib/supabase/database.types";
import Dialog, { ConfirmDialog } from "./Dialog";
import Icon from "./icons";
import { btnGhost, btnPrimary, btnSecondary, inputCls, labelCls } from "./ui";

type Props = {
  id: string;
  status: BookingStatus;
  fillingIn: boolean; // an unfinished form the visitor is still typing into
  requestedDate: string | null;
  confirmedDate: string | null;
  confirmedTime: string | null;
  leadId: string | null;
};

type Pending = "confirm" | "decline" | "cancel" | "delete" | null;

export default function BookingActions({ id, status, fillingIn, requestedDate, confirmedDate, confirmedTime, leadId }: Props) {
  const [open, setOpen] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<ActionResult<unknown>>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) setOpen(null);
      else setError(result.error);
    });
  }

  const confirmed = status === "confirmed";
  const closed = status === "declined" || status === "cancelled";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {!closed && !fillingIn && (
          <button type="button" onClick={() => setOpen("confirm")} className={confirmed ? btnSecondary : btnPrimary}>
            <Icon name={confirmed ? "calendar" : "check"} /> {confirmed ? "Reschedule" : "Confirm booking"}
          </button>
        )}
        {status === "pending" && (
          <button type="button" onClick={() => setOpen("decline")} className={btnSecondary}>
            <Icon name="close" /> Decline
          </button>
        )}
        {confirmed && (
          <button type="button" onClick={() => setOpen("cancel")} className={btnSecondary}>
            <Icon name="close" /> Cancel booking
          </button>
        )}
        {closed && (
          <button type="button" disabled={pending} onClick={() => run(() => setBookingStatus(id, "pending"))} className={btnPrimary}>
            <Icon name="undo" /> Reopen
          </button>
        )}
        {leadId ? (
          <Link href={`/admin/crm?lead=${leadId}`} className={btnSecondary}>
            <Icon name="board" /> View in CRM
          </Link>
        ) : (
          <button type="button" disabled={pending} onClick={() => run(() => moveBookingToCrm(id))} className={btnSecondary}>
            <Icon name="board" /> Add to CRM
          </button>
        )}
        <button type="button" onClick={() => setOpen("delete")} className={`${btnGhost} text-rose-700 hover:text-rose-800`}>
          <Icon name="trash" /> Delete
        </button>
      </div>
      {fillingIn && (
        <p className="mt-3 text-[0.8rem] text-ink-500">
          The visitor is still filling in the form, so it can&apos;t be confirmed yet.
        </p>
      )}
      {error && !open && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <Dialog
        open={open === "confirm"}
        onClose={() => setOpen(null)}
        title={confirmed ? "Reschedule booking" : "Confirm booking"}
        description="The booking goes on the calendar on this date."
      >
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            run(() => confirmBooking(id, String(f.get("date") ?? ""), String(f.get("time") ?? "")));
          }}
        >
          <div>
            <label htmlFor="confirm-date" className={labelCls}>
              Event date *
            </label>
            <input
              id="confirm-date"
              name="date"
              type="date"
              required
              defaultValue={confirmedDate ?? requestedDate ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="confirm-time" className={labelCls}>
              Start time
            </label>
            <input id="confirm-time" name="time" type="time" defaultValue={confirmedTime?.slice(0, 5) ?? ""} className={inputCls} />
          </div>
          {requestedDate && confirmedDate === null && (
            <p className="text-[0.78rem] text-ink-500 sm:col-span-2">The visitor asked for this date — change it if you agreed another.</p>
          )}
          {error && (
            <p role="alert" className="text-sm text-rose-700 sm:col-span-2">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={() => setOpen(null)} className={btnSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={pending} className={btnPrimary}>
              {pending ? "Saving…" : confirmed ? "Save new date" : "Confirm and add to calendar"}
            </button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={open === "decline"}
        onClose={() => setOpen(null)}
        onConfirm={() => run(() => setBookingStatus(id, "declined"))}
        title="Decline this request?"
        description="It moves to Declined & cancelled. You can reopen it later."
        confirmLabel="Decline request"
        pending={pending}
        error={error}
      />
      <ConfirmDialog
        open={open === "cancel"}
        onClose={() => setOpen(null)}
        onConfirm={() => run(() => setBookingStatus(id, "cancelled"))}
        title="Cancel this booking?"
        description="It comes off the calendar. You can reopen it later."
        confirmLabel="Cancel booking"
        pending={pending}
        error={error}
        danger
      />
      <ConfirmDialog
        open={open === "delete"}
        onClose={() => setOpen(null)}
        onConfirm={() => run(() => deleteBooking(id))}
        title="Delete this booking?"
        description={
          leadId
            ? "It's removed for good, along with its place on the calendar. Its lead stays in the CRM."
            : "It's removed for good, along with its place on the calendar. Decline or cancel it instead to keep a record."
        }
        confirmLabel="Delete booking"
        pending={pending}
        error={error}
        danger
      />
    </div>
  );
}

export function BookingNotes({ id, notes }: { id: string; notes: string | null }) {
  const [state, setState] = useState<{ saved?: boolean; error?: string }>({});
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const value = String(new FormData(e.currentTarget).get("notes") ?? "");
        startTransition(async () => {
          const result = await saveBookingNotes(id, value);
          setState(result.ok ? { saved: true } : { error: result.error });
        });
      }}
    >
      <label htmlFor="booking-notes" className="sr-only">
        Team notes
      </label>
      <textarea
        id="booking-notes"
        name="notes"
        rows={4}
        maxLength={10000}
        defaultValue={notes ?? ""}
        onChange={() => state.saved && setState({})}
        placeholder="Only the team sees these — call notes, quotes, set-up details"
        className={inputCls}
      />
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" disabled={pending} className={btnSecondary}>
          {pending ? "Saving…" : "Save notes"}
        </button>
        {state.saved && <span className="text-[0.8rem] text-emerald-700">Saved</span>}
        {state.error && (
          <span role="alert" className="text-[0.8rem] text-rose-700">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

