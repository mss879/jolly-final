"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createStage, deleteStage, moveLead, renameStage, reorderStages } from "@/lib/admin/actions/crm";
import { formatDay, formatLkr } from "@/lib/admin/format";
import { LEAD_SOURCE, type Lead, type Stage } from "@/lib/admin/types";
import { ConfirmDialog } from "./Dialog";
import Icon from "./icons";
import LeadDialog, { type LeadDialogState } from "./LeadDialog";
import { btnPrimary, btnSecondary, inputCls } from "./ui";

/* The CRM pipeline. Cards move optimistically and the new position is saved
   in the background; if saving fails the board snaps back. Stage edits go
   through server actions and re-render the board from the database. */

type Columns = Record<string, string[]>;

function toColumns(stages: Stage[], leads: Lead[]): Columns {
  const columns: Columns = Object.fromEntries(stages.map((s) => [s.id, [] as string[]]));
  for (const lead of leads) columns[lead.stageId]?.push(lead.id);
  return columns;
}

export default function KanbanBoard({
  stages,
  leads,
  openLeadId,
}: {
  stages: Stage[];
  leads: Lead[];
  openLeadId: string | null;
}) {
  const [columns, setColumns] = useState(() => toColumns(stages, leads));
  const [synced, setSynced] = useState({ stages, leads });
  if (synced.stages !== stages || synced.leads !== leads) {
    // Fresh data from the server (after an edit): rebuild the board.
    setSynced({ stages, leads });
    setColumns(toColumns(stages, leads));
  }

  const leadById = useMemo(() => new Map(leads.map((l) => [l.id, l])), [leads]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dragStart = useRef<{ columns: Columns; stageId: string; index: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [dialog, setDialog] = useState<LeadDialogState>(() => {
    const lead = openLeadId ? leads.find((l) => l.id === openLeadId) : undefined;
    return lead ? { mode: "edit", lead, stageId: lead.stageId } : null;
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    // Space picks a card up; Enter opens it.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
    }),
  );

  const stageOf = (id: UniqueIdentifier) => {
    const key = String(id);
    if (key in columns) return key;
    return Object.keys(columns).find((stageId) => columns[stageId].includes(key));
  };

  function onDragStart({ active }: DragStartEvent) {
    const stageId = stageOf(active.id);
    if (!stageId) return;
    setError(null);
    setActiveId(String(active.id));
    dragStart.current = { columns, stageId, index: columns[stageId].indexOf(String(active.id)) };
  }

  // Crossing into another column: move the card there as it's dragged.
  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = stageOf(active.id);
    const to = stageOf(over.id);
    if (!from || !to || from === to) return;

    setColumns((prev) => {
      const target = prev[to];
      const overIndex = target.indexOf(String(over.id));
      const translated = active.rect.current.translated;
      const below = translated && translated.top > over.rect.top + over.rect.height / 2;
      const index = overIndex >= 0 ? overIndex + (below ? 1 : 0) : target.length;
      return {
        ...prev,
        [from]: prev[from].filter((id) => id !== active.id),
        [to]: [...target.slice(0, index), String(active.id), ...target.slice(index)],
      };
    });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const start = dragStart.current;
    dragStart.current = null;
    setActiveId(null);
    const stageId = stageOf(active.id);
    if (!start || !stageId || !over) {
      if (start) setColumns(start.columns);
      return;
    }

    let next = columns;
    const overStage = stageOf(over.id);
    if (overStage === stageId) {
      const oldIndex = columns[stageId].indexOf(String(active.id));
      const newIndex = columns[stageId].indexOf(String(over.id));
      if (newIndex >= 0 && oldIndex !== newIndex) {
        next = { ...columns, [stageId]: arrayMove(columns[stageId], oldIndex, newIndex) };
        setColumns(next);
      }
    }

    const index = next[stageId].indexOf(String(active.id));
    if (stageId === start.stageId && index === start.index) return;

    const leadId = String(active.id);
    startTransition(async () => {
      const result = await moveLead(leadId, stageId, index).catch(() => null);
      if (!result?.ok) {
        setColumns(start.columns);
        setError(result?.error ?? "That move didn't save — check your connection and try again.");
      }
    });
  }

  function onDragCancel() {
    if (dragStart.current) setColumns(dragStart.current.columns);
    dragStart.current = null;
    setActiveId(null);
  }

  const openLead = (lead: Lead) => setDialog({ mode: "edit", lead, stageId: stageOf(lead.id) ?? lead.stageId });
  const movable = stages.filter((s) => !s.isSystem);

  function moveStage(stageId: string, direction: -1 | 1) {
    const ids = movable.map((s) => s.id);
    const i = ids.indexOf(stageId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= ids.length) return;
    startTransition(async () => {
      const result = await reorderStages(arrayMove(ids, i, j)).catch(() => null);
      if (!result?.ok) setError(result?.error ?? "The stages couldn't be reordered — check your connection.");
    });
  }

  const activeLead = activeId ? leadById.get(activeId) : undefined;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.8rem] text-ink-500">
          {leads.length} {leads.length === 1 ? "lead" : "leads"} · drag cards between stages, or press Space on a card to
          move it with the arrow keys
        </p>
        <button
          type="button"
          onClick={() => setDialog({ mode: "new", stageId: stages[0]?.id ?? "" })}
          className={btnPrimary}
        >
          <Icon name="plus" /> Add lead
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-800">
          {error}
        </p>
      )}

      <DndContext
        id="crm-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="-mx-4 flex items-start gap-4 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {stages.map((stage) => {
            const ids = columns[stage.id] ?? [];
            const position = movable.findIndex((s) => s.id === stage.id);
            return (
              <StageColumn
                key={stage.id}
                stage={stage}
                leads={ids.map((id) => leadById.get(id)).filter((l): l is Lead => Boolean(l))}
                canMoveLeft={position > 0}
                canMoveRight={position >= 0 && position < movable.length - 1}
                onMove={(direction) => moveStage(stage.id, direction)}
                onOpen={openLead}
                onAdd={() => setDialog({ mode: "new", stageId: stage.id })}
                onError={setError}
              />
            );
          })}
          <AddStage onError={setError} />
        </div>

        <DragOverlay>
          {activeLead && (
            <div className="w-[16rem] rotate-2 cursor-grabbing border border-gold-400 bg-cream-50 p-3 shadow-card">
              <LeadCardBody lead={activeLead} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <LeadDialog state={dialog} stages={stages} onClose={() => setDialog(null)} />
    </>
  );
}

function StageColumn({
  stage,
  leads,
  canMoveLeft,
  canMoveRight,
  onMove,
  onOpen,
  onAdd,
  onError,
}: {
  stage: Stage;
  leads: Lead[];
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMove: (direction: -1 | 1) => void;
  onOpen: (lead: Lead) => void;
  onAdd: () => void;
  onError: (message: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const value = leads.reduce((sum, l) => sum + (l.valueLkr ?? 0), 0);

  return (
    <section
      aria-label={stage.name}
      className={`flex w-[17rem] shrink-0 flex-col border bg-cream-50/70 ${
        stage.isSystem ? "border-plum-200" : "border-gold-200/70"
      }`}
    >
      <StageHeader
        stage={stage}
        count={leads.length}
        canMoveLeft={canMoveLeft}
        canMoveRight={canMoveRight}
        onMove={onMove}
        onError={onError}
      />
      {value > 0 && (
        <p className="border-b border-gold-200/50 px-3 py-1.5 text-[0.7rem] text-ink-500">{formatLkr(value)} estimated</p>
      )}
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className={`flex min-h-28 flex-1 flex-col gap-2 p-2 transition-colors ${isOver ? "bg-cream-200/70" : ""}`}
        >
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onOpen={onOpen} />
          ))}
          {leads.length === 0 && (
            <li className="flex flex-1 items-center justify-center border border-dashed border-gold-300/80 px-3 py-6 text-center text-[0.75rem] text-ink-500">
              {stage.isSystem ? "Inquiries and bookings you move to the CRM land here" : "Drop leads here"}
            </li>
          )}
        </ul>
      </SortableContext>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 border-t border-gold-200/60 px-3 py-2.5 text-[0.75rem] font-semibold text-ink-500 transition-colors hover:bg-cream-200/60 hover:text-plum-900"
      >
        <Icon name="plus" className="h-3.5 w-3.5" /> Add lead
      </button>
    </section>
  );
}

function StageHeader({
  stage,
  count,
  canMoveLeft,
  canMoveRight,
  onMove,
  onError,
}: {
  stage: Stage;
  count: number;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMove: (direction: -1 | 1) => void;
  onError: (message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  function rename(value: string) {
    setEditing(false);
    if (value.trim() === stage.name || !value.trim()) return;
    startTransition(async () => {
      const result = await renameStage(stage.id, value);
      if (!result.ok) onError(result.error);
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteStage(stage.id);
      setConfirming(false);
      if (!result.ok) onError(result.error);
    });
  }

  const item = "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-700 hover:bg-cream-200/70 disabled:opacity-40";

  return (
    <header className="flex min-h-12 items-center gap-2 border-b border-gold-200/60 px-3 py-1.5">
      {editing ? (
        <input
          autoFocus
          defaultValue={stage.name}
          maxLength={40}
          aria-label="Stage name"
          onBlur={(e) => rename(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setEditing(false);
          }}
          className={`${inputCls} py-1.5`}
        />
      ) : (
        <h2 className={`min-w-0 flex-1 truncate text-sm font-semibold text-plum-900 ${pending ? "opacity-60" : ""}`}>
          {stage.name}
        </h2>
      )}
      <span className="rounded-btn bg-cream-200 px-1.5 py-px text-[0.7rem] font-semibold text-ink-700 tabular-nums">{count}</span>

      {stage.isSystem ? (
        <span
          className="p-1.5 text-plum-700"
          title="New Leads is fixed — inquiries and bookings moved to the CRM arrive here"
        >
          <Icon name="lock" className="h-3.5 w-3.5" />
          <span className="sr-only">Fixed stage</span>
        </span>
      ) : (
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="rounded-btn p-1.5 text-ink-500 hover:bg-cream-200 hover:text-plum-900"
          >
            <Icon name="more" />
            <span className="sr-only">{stage.name} options</span>
          </button>
          {menuOpen && (
            <div role="menu" className="absolute top-full right-0 z-20 mt-1 w-44 border border-gold-200 bg-cream-50 py-1 shadow-card">
              <button
                role="menuitem"
                type="button"
                className={item}
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
              >
                <Icon name="pencil" /> Rename
              </button>
              <button
                role="menuitem"
                type="button"
                className={item}
                disabled={!canMoveLeft}
                onClick={() => {
                  setMenuOpen(false);
                  onMove(-1);
                }}
              >
                <Icon name="left" /> Move left
              </button>
              <button
                role="menuitem"
                type="button"
                className={item}
                disabled={!canMoveRight}
                onClick={() => {
                  setMenuOpen(false);
                  onMove(1);
                }}
              >
                <Icon name="right" /> Move right
              </button>
              <button
                role="menuitem"
                type="button"
                className={`${item} text-rose-700`}
                onClick={() => {
                  setMenuOpen(false);
                  setConfirming(true);
                }}
              >
                <Icon name="trash" /> Delete stage
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={remove}
        title={`Delete “${stage.name}”?`}
        description={
          count
            ? `Its ${count} ${count === 1 ? "lead moves" : "leads move"} to the bottom of New Leads — nothing is lost.`
            : "The stage is empty, so nothing else changes."
        }
        confirmLabel="Delete stage"
        pending={pending}
        danger
      />
    </header>
  );
}

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(lead)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen(lead);
          return;
        }
        listeners?.onKeyDown?.(e);
      }}
      className={`cursor-grab touch-manipulation border bg-cream-50 p-3 outline-none focus-visible:ring-2 focus-visible:ring-plum-700 ${
        isDragging ? "border-dashed border-gold-400 opacity-40" : "border-gold-200/80 hover:border-gold-400"
      }`}
    >
      <LeadCardBody lead={lead} />
    </li>
  );
}

function LeadCardBody({ lead }: { lead: Lead }) {
  const details = [lead.eventType, lead.eventDate && formatDay(lead.eventDate, false)].filter(Boolean).join(" · ");
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-sm leading-snug font-semibold break-words text-plum-900">{lead.name}</p>
        {lead.valueLkr !== null && (
          <span className="shrink-0 text-[0.72rem] font-semibold text-ink-700">{formatLkr(lead.valueLkr, true)}</span>
        )}
      </div>
      {details && <p className="mt-1 text-[0.75rem] text-ink-500">{details}</p>}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[0.62rem] font-semibold tracking-[0.12em] text-gold-700 uppercase">{LEAD_SOURCE[lead.source]}</span>
        {lead.guests !== null && <span className="text-[0.7rem] text-ink-500">{lead.guests} guests</span>}
      </div>
    </>
  );
}

function AddStage({ onError }: { onError: (message: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex w-[17rem] shrink-0 items-center justify-center gap-2 border border-dashed border-gold-300 px-4 py-4 text-sm font-semibold text-ink-500 transition-colors hover:border-plum-700 hover:text-plum-900"
      >
        <Icon name="plus" /> Add stage
      </button>
    );
  }

  return (
    <form
      className="flex w-[17rem] shrink-0 flex-col gap-2 border border-gold-200/70 bg-cream-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const name = String(new FormData(e.currentTarget).get("name") ?? "");
        startTransition(async () => {
          const result = await createStage(name);
          if (result.ok) setAdding(false);
          else onError(result.error);
        });
      }}
    >
      <input name="name" autoFocus required maxLength={40} placeholder="Stage name" aria-label="Stage name" className={inputCls} />
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Adding…" : "Add stage"}
        </button>
        <button type="button" onClick={() => setAdding(false)} className={btnSecondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}
