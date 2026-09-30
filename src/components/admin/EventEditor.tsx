"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteEvent, saveEvent, uploadEventPhoto, type EventInput } from "@/lib/admin/actions/events";
import type { AdminEvent } from "@/lib/admin/queries";
import { MAX_EVENT_PHOTOS, eventPhotoUrl } from "@/lib/event-photos";
import { ConfirmDialog } from "./Dialog";
import Icon from "./icons";
import { btnDanger, btnPrimary, btnSecondary, inputCls, labelCls } from "./ui";

/* Add or edit a recent event for the Reviews page. Photos upload as soon as
   they're picked (shrunk to 2000px first); nothing reaches the website
   until the event is saved with "Show on the website" ticked. */

const EVENT_TYPES = ["Wedding", "Corporate Event", "Private Party", "Brand Collaboration", "Other"];
const MAX_EDGE = 2000;

/* Phone photos are often 4000px+ and several MB; this keeps them sharp on
   screen at a fraction of the size. HEIC can't be read by the browser. */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bitmap) throw new Error(`${file.name} isn't a photo this browser can read — use JPG or PNG.`);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) throw new Error(`${file.name} couldn't be prepared for upload.`);
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

export default function EventEditor({ event, isNew, justSaved = false }: { event: AdminEvent; isNew: boolean; justSaved?: boolean }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: event.title,
    eventType: event.eventType ?? "",
    eventDate: event.eventDate ?? "",
    location: event.location ?? "",
    summary: event.summary ?? "",
    published: event.published,
  });
  const [photos, setPhotos] = useState<string[]>(event.photos);
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    justSaved ? { tone: "ok", text: event.published ? "Saved — it's on the Reviews page." : "Saved. It's hidden from the website until you tick “Show on the website”." } : null,
  );
  const [saving, startSaving] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, startDeleting] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_EVENT_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, Math.max(0, room));
    if (!picked.length) {
      setMessage({ tone: "error", text: `An event can have up to ${MAX_EVENT_PHOTOS} photos.` });
      return;
    }
    setMessage(null);
    setUploading({ done: 0, total: picked.length });
    const problems: string[] = [];
    for (const [i, file] of picked.entries()) {
      try {
        const body = new FormData();
        body.set("eventId", event.id);
        body.set("photo", await shrink(file));
        const result = await uploadEventPhoto(body);
        if (result.ok && result.data) {
          const path = result.data;
          setPhotos((p) => [...p, path]);
        } else problems.push(result.ok ? `${file.name} didn't upload.` : result.error);
      } catch (error) {
        problems.push(error instanceof Error ? error.message : `${file.name} didn't upload.`);
      }
      setUploading({ done: i + 1, total: picked.length });
    }
    setUploading(null);
    if (fileInput.current) fileInput.current.value = "";
    if (problems.length) setMessage({ tone: "error", text: problems.join(" ") });
    else if (files.length > picked.length) {
      setMessage({ tone: "error", text: `Only the first ${picked.length} were added — the limit is ${MAX_EVENT_PHOTOS}.` });
    }
  }

  const move = (from: number, to: number) =>
    setPhotos((p) => {
      if (to < 0 || to >= p.length) return p;
      const next = [...p];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });

  function save() {
    setMessage(null);
    const input: EventInput = { id: event.id, ...form, photos };
    startSaving(async () => {
      const result = await saveEvent(input);
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setMessage({
        tone: "ok",
        text: form.published ? "Saved — it's on the Reviews page." : "Saved. It's hidden from the website until you tick “Show on the website”.",
      });
      if (isNew) router.replace(`/admin/events/${event.id}?saved=1`);
      else router.refresh();
    });
  }

  function remove() {
    setDeleteError(null);
    startDeleting(async () => {
      const result = await deleteEvent(event.id);
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }
      router.push("/admin/events");
    });
  }

  const busy = saving || uploading !== null;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-6">
        {/* Details */}
        <section className="border border-gold-200/70 bg-cream-50 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelCls}>
                Title *
              </label>
              <input
                id="title"
                value={form.title}
                onChange={set("title")}
                maxLength={120}
                placeholder="e.g. A garden wedding in Colombo 07"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="eventType" className={labelCls}>
                Type of event
              </label>
              <input
                id="eventType"
                list="event-types"
                value={form.eventType}
                onChange={set("eventType")}
                maxLength={60}
                placeholder="Wedding"
                className={inputCls}
              />
              <datalist id="event-types">
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="eventDate" className={labelCls}>
                Date
              </label>
              <input id="eventDate" type="date" value={form.eventDate} onChange={set("eventDate")} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="location" className={labelCls}>
                Where
              </label>
              <input
                id="location"
                value={form.location}
                onChange={set("location")}
                maxLength={120}
                placeholder="e.g. Colombo, or the south coast"
                className={inputCls}
              />
              <p className="mt-1 text-[0.72rem] text-ink-500">Shown publicly — a city or area is usually enough.</p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="summary" className={labelCls}>
                About the event
              </label>
              <textarea
                id="summary"
                value={form.summary}
                onChange={set("summary")}
                maxLength={1200}
                rows={5}
                placeholder="The theme, the cart colour, the flavours, the moment guests loved."
                className={inputCls}
              />
              <p className="mt-1 text-right text-[0.7rem] text-ink-500">{form.summary.length} / 1200</p>
            </div>
          </div>
        </section>

        {/* Photos */}
        <section className="border border-gold-200/70 bg-cream-50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[0.72rem] font-semibold tracking-[0.14em] text-ink-700 uppercase">
                Photos ({photos.length}/{MAX_EVENT_PHOTOS})
              </h2>
              <p className="mt-1 text-[0.78rem] text-ink-500">The first photo is the cover. Use the arrows to reorder.</p>
            </div>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading !== null || photos.length >= MAX_EVENT_PHOTOS}
              className={btnSecondary}
            >
              <Icon name="upload" />
              {uploading ? `Uploading ${uploading.done + 1} of ${uploading.total}…` : "Add photos"}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => addPhotos(e.target.files)}
            />
          </div>

          {photos.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading !== null}
              className="mt-5 flex w-full flex-col items-center justify-center gap-2 border border-dashed border-gold-400 bg-cream-100/60 px-6 py-12 text-center text-sm text-ink-500 hover:border-plum-900 hover:text-plum-900"
            >
              <Icon name="photo" className="h-7 w-7" />
              Add the event&apos;s photos — JPG, PNG or WebP
            </button>
          ) : (
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((path, i) => (
                <li key={path} className="group relative">
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
                    <Image src={eventPhotoUrl(path)} alt={`Photo ${i + 1}`} fill sizes="200px" className="object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 rounded-btn bg-plum-900 px-2 py-0.5 text-[0.62rem] font-semibold text-cream-100">
                        Cover
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, i - 1)}
                        disabled={i === 0}
                        aria-label={`Move photo ${i + 1} earlier`}
                        className="rounded-btn p-1.5 text-ink-500 hover:bg-cream-200 hover:text-plum-900 disabled:opacity-30"
                      >
                        <Icon name="left" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, i + 1)}
                        disabled={i === photos.length - 1}
                        aria-label={`Move photo ${i + 1} later`}
                        className="rounded-btn p-1.5 text-ink-500 hover:bg-cream-200 hover:text-plum-900 disabled:opacity-30"
                      >
                        <Icon name="right" className="h-3.5 w-3.5" />
                      </button>
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => move(i, 0)}
                          aria-label={`Make photo ${i + 1} the cover`}
                          title="Make cover"
                          className="rounded-btn p-1.5 text-ink-500 hover:bg-cream-200 hover:text-plum-900"
                        >
                          <Icon name="star" className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotos((p) => p.filter((x) => x !== path))}
                      aria-label={`Remove photo ${i + 1}`}
                      className="rounded-btn p-1.5 text-ink-500 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Publish */}
      <aside className="flex flex-col gap-4 self-start border border-gold-200/70 bg-cream-50 p-5 xl:sticky xl:top-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-plum-900"
          />
          <span>
            <span className="block text-sm font-semibold text-plum-900">Show on the website</span>
            <span className="mt-0.5 block text-[0.78rem] leading-snug text-ink-500">
              Appears under “Recent events” on the Reviews page, newest date first.
            </span>
          </span>
        </label>

        {message && (
          <p role={message.tone === "error" ? "alert" : "status"} className={`text-sm ${message.tone === "error" ? "text-rose-700" : "text-emerald-800"}`}>
            {message.text}
          </p>
        )}

        <button type="button" onClick={save} disabled={busy} className={btnPrimary}>
          {saving ? "Saving…" : isNew ? "Save event" : "Save changes"}
        </button>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gold-200/60 pt-4">
          <Link href="/reviews" target="_blank" className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-plum-900 hover:text-gold-700">
            <Icon name="external" className="h-3.5 w-3.5" />
            View Reviews page
          </Link>
          {!isNew && (
            <button type="button" onClick={() => setConfirmDelete(true)} className={btnDanger}>
              <Icon name="trash" />
              Delete
            </button>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title="Delete this event?"
        description="It comes off the website and its photos are deleted. This can't be undone."
        confirmLabel="Delete event"
        pending={deleting}
        error={deleteError}
        danger
      />
    </div>
  );
}
