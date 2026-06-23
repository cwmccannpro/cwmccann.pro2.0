"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  /** Video path under /public, e.g. "/water.mp4". Should be encoded
   *  all-intra (every frame a keyframe) so scroll-seeking is smooth. */
  src: string;
  /** ScrollTrigger start — default: when the section enters view. */
  start?: string;
  /** ScrollTrigger end — default: when the section leaves view.
   *  Pass "max" for the last section so it finishes at the page bottom. */
  end?: string;
  /** Tailwind opacity utility for the faint accent, e.g. "opacity-[0.08]". */
  opacityClassName?: string;
  /** Vertical parallax travel, in % of the (oversized) video height. */
  parallax?: number;
};

/**
 * Scroll-scrubbed video background for a section.
 *
 * The video never auto-plays — its `currentTime` is tied to scroll, so it
 * plays forward as the section scrolls through the viewport and reverses as
 * you scroll back up. A gentle vertical parallax drifts it against the
 * content, and it sits at a very low opacity as a faint atmospheric accent.
 *
 * The wrapper (absolute inset-0) doubles as the ScrollTrigger trigger, so
 * this stays self-contained inside its (relative, overflow-hidden) parent.
 *
 * Reduced motion: no scrub/parallax — the video holds a still frame.
 */
export function ScrollVideoBackground({
  src,
  start = "top bottom",
  end = "bottom top",
  opacityClassName = "opacity-[0.08]",
  parallax = 8,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    // Reduced motion: hold a static frame, skip all scroll wiring.
    if (reduced) {
      video.pause();
      return;
    }

    let ctx: gsap.Context | undefined;

    const build = () => {
      video.pause();
      ctx = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: wrapper,
              start,
              end,
              scrub: 1, // ~1s eased catch-up = smooth glide; reverses upward
            },
          })
          // Scrub the video frame-by-frame across the scroll range.
          .fromTo(
            video,
            { currentTime: 0 },
            { currentTime: video.duration || 1, duration: 1 },
            0,
          )
          // Subtle parallax drift against the foreground content.
          .fromTo(
            video,
            { yPercent: -parallax },
            { yPercent: parallax, duration: 1 },
            0,
          );
      }, wrapper);

      ScrollTrigger.refresh();
    };

    // Need the duration before we can scrub — wait for metadata if needed.
    if (Number.isFinite(video.duration) && video.duration > 0) {
      build();
      return () => ctx?.revert();
    }

    const onMeta = () => build();
    video.addEventListener("loadedmetadata", onMeta, { once: true });
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      ctx?.revert();
    };
  }, [reduced, src, start, end, parallax]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        // Oversized + centered so the parallax drift never reveals an edge.
        className={`absolute inset-x-0 top-[-12.5%] h-[125%] w-full object-cover ${opacityClassName}`}
      />
    </div>
  );
}
