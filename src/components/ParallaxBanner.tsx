"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

/* Full-bleed image band whose background drifts slower than the page —
   the classic luxury parallax strip. Pass `video` to play a muted,
   looping clip over the image (the image doubles as poster and as the
   reduced-motion fallback). Expected assets: public/video/*.webm|mp4. */
export default function ParallaxBanner({
  image,
  alt,
  children,
  heightClass = "min-h-[62vh]",
  overlay = "bg-plum-950/45",
  video,
}: {
  image: string;
  alt: string;
  children: ReactNode;
  heightClass?: string;
  overlay?: string;
  video?: { webm?: string; mp4?: string };
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const img = useRef<HTMLDivElement | null>(null);
  const vid = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const w = wrap.current;
    const m = img.current;
    const v = vid.current;
    if (!w || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v?.pause();
      return;
    }

    let active = false;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = w.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      m.style.transform = `translate3d(0, ${(progress * -7).toFixed(2)}%, 0) scale(1.25)`;
    };
    const onScroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        if (active) {
          onScroll();
          v?.play().catch(() => {});
        } else {
          v?.pause();
        }
      },
      { rootMargin: "10% 0px 10% 0px" },
    );
    io.observe(w);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const hasVideo = Boolean(video?.webm || video?.mp4);

  return (
    <section ref={wrap} className={`relative flex ${heightClass} items-center overflow-hidden`}>
      <div ref={img} className="absolute inset-0 scale-125 will-change-transform">
        <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
        {hasVideo && (
          <video
            ref={vid}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={image}
            aria-hidden
            tabIndex={-1}
            disablePictureInPicture
          >
            {video?.webm && <source src={video.webm} type="video/webm" />}
            {video?.mp4 && <source src={video.mp4} type="video/mp4" />}
          </video>
        )}
      </div>
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-500/50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold-500/50" />
      <div className="container-luxe relative py-24">{children}</div>
    </section>
  );
}
