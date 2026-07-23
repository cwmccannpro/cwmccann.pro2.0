"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  /** Video path under /public, e.g. "/water.mp4". */
  src: string;
  /** Optional poster still shown before playback / on autoplay failure. */
  poster?: string;
  /** Tailwind opacity utility for the faint accent, e.g. "opacity-[0.08]". */
  opacityClassName?: string;
};

/**
 * Autoplaying, looping video background for a section.
 *
 * Unlike ScrollVideoBackground, playback is NOT tied to scroll — the clip
 * simply loops on its own. It autoplays muted/inline and is paused only
 * when the tab is hidden or the section scrolls out of view (an in-view
 * observer, not a scroll scrub), so no offscreen video keeps decoding.
 *
 * Reduced motion: renders a static poster still (or nothing) — no playback.
 */
export function LoopingVideoBackground({
  src,
  poster,
  opacityClassName = "opacity-[0.08]",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  // True only while the section is on screen (drives play/pause).
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(wrapper);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    // Play only when visible tab + in view; pause otherwise. A loop keeps
    // no state, so nothing is lost across pauses.
    const sync = () => {
      if (!inView || document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {
          /* autoplay blocked → the poster still stands in */
        });
      }
    };
    sync();

    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [reduced, inView]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {reduced ? (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className={`absolute inset-x-0 top-[-12.5%] h-[125%] w-full object-cover ${opacityClassName}`}
          />
        )
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          // Oversized + centered so it fully covers with margin to spare.
          className={`absolute inset-x-0 top-[-12.5%] h-[125%] w-full object-cover ${opacityClassName}`}
        />
      )}
    </div>
  );
}
