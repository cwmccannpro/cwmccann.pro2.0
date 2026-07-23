"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * HeroEmberVideo — the "Molten Ink" plate.
 *
 * A photoreal cinema plate (generated, then animated as a seamless loop:
 * the first and last frames are identical) of black smoke veined with
 * molten ember light. It replaces the procedural WebGL shader with real
 * volumetric depth, light scattering, and filmic texture the fbm noise
 * could never reach.
 *
 * - Autoplays muted/inline and loops without a visible seam.
 * - The poster is the loop's own first frame, so paint → playback is
 *   invisible, and any autoplay failure degrades to the identical still.
 * - Playback is paused while the tab is hidden (loop = no lost state).
 *
 * Reduced motion: only the still frame is rendered — no <video> at all.
 *
 * `paused` (driven by the hero's in-view observer) stops decoding once the
 * title card scrolls away, so no offscreen video burns GPU/battery.
 */
export function HeroEmberVideo({
  className,
  paused = false,
}: {
  className?: string;
  paused?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    // Pause when offscreen or when the tab is hidden; resume only when both
    // are true (visible tab + in view). A loop keeps no state, so nothing
    // is lost across pauses.
    const sync = () => {
      if (paused || document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {
          /* autoplay blocked → the poster still is the identical frame */
        });
      }
    };
    sync();

    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [reduced, paused]);

  if (reduced) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/hero-ember.jpg"
        alt=""
        aria-hidden="true"
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src="/hero-ember.mp4"
      poster="/hero-ember.jpg"
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      aria-hidden="true"
      className={`object-cover ${className ?? ""}`}
    />
  );
}
