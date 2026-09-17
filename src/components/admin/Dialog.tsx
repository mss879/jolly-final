"use client";

import { useEffect, useId, useRef } from "react";
import Icon from "./icons";
import { btnDanger, btnPrimary, btnSecondary } from "./ui";

/* Native <dialog>: focus trapping, Esc to close and the backdrop come free.
   Content only mounts while open, so forms start fresh each time. */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto border border-gold-200 bg-cream-50 p-0 text-ink-900 shadow-soft backdrop:bg-plum-950/40 ${
        wide ? "max-w-2xl" : "max-w-md"
      }`}
    >
      {open && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="font-display text-xl font-semibold text-plum-900">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm leading-relaxed text-ink-500">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mt-1 -mr-2 rounded-btn p-2 text-ink-500 hover:bg-cream-200 hover:text-plum-900"
            >
              <Icon name="close" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  pending = false,
  error,
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  pending?: boolean;
  error?: string | null;
  danger?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      {error && (
        <p role="alert" className="mb-4 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={btnSecondary}>
          Keep it
        </button>
        <button type="button" onClick={onConfirm} disabled={pending} className={danger ? btnDanger : btnPrimary}>
          {pending ? "Working…" : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
