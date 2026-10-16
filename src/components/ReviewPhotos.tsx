"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

type Photo = { src: string; width: number; height: number };

const SHOWN = 4; // thumbnails on the card; the viewer pages through them all

/* A reviewer's own photos: thumbnails on the card that open a full-size
   viewer (a native modal <dialog>: Esc and the backdrop close it, the arrow
   keys move between photos). */
export default function ReviewPhotos({ photos, name }: { photos: Photo[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + photos.length) % photos.length));
  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };
  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-2">
        {photos.slice(0, SHOWN).map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length} from ${name}'s review`}
              className="group relative block h-16 w-16 cursor-zoom-in overflow-hidden rounded-btn ring-1 ring-gold-200/80 transition-shadow hover:ring-gold-400"
            >
              <Image src={p.src} alt="" fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              {i === SHOWN - 1 && photos.length > SHOWN && (
                <span className="absolute inset-0 flex items-center justify-center bg-plum-950/55 text-sm font-semibold text-cream-100">
                  +{photos.length - SHOWN}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onKeyDown={onKey}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        aria-label={`Photos from ${name}'s review`}
        className="m-auto max-h-[94vh] max-w-[94vw] overflow-visible bg-transparent p-0 backdrop:bg-plum-950/85 backdrop:backdrop-blur-sm"
      >
        {current && open !== null && (
          <figure className="flex flex-col items-center">
            <Image
              key={current.src}
              src={current.src}
              alt={`Photo ${open + 1} from ${name}'s Google review`}
              width={current.width}
              height={current.height}
              sizes="94vw"
              className="h-auto max-h-[80vh] w-auto max-w-[94vw] rounded-card object-contain shadow-soft"
            />
            <figcaption className="mt-4 flex w-full items-center justify-between gap-6 text-cream-100">
              <span className="text-[0.8rem] tracking-wide">
                {name}
                {photos.length > 1 && <span className="text-cream-100/60"> · {open + 1} / {photos.length}</span>}
              </span>
              <span className="flex items-center gap-2">
                {photos.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={viewerBtn}>
                      ←
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label="Next photo" className={viewerBtn}>
                      →
                    </button>
                  </>
                )}
                <button type="button" onClick={() => setOpen(null)} aria-label="Close" className={viewerBtn}>
                  ✕
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}

const viewerBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-cream-100/30 text-cream-100 transition-colors hover:border-gold-300 hover:text-gold-300";
