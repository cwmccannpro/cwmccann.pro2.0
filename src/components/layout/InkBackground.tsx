"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * InkBackground — global cinematic ink atmosphere for the opening.
 *
 * A hidden <video> (ink.mp4, re-encoded all-intra for smooth seeking) is
 * scrubbed frame-by-frame onto a <canvas> in a ping-pong loop — playing
 * forward, then reversing at each end, forever, with no visible seam.
 *
 * - The ink keeps its slow living ping-pong the whole time (never fades).
 * - Parallax: the ink drifts upward at 35% of the Lenis scroll position,
 *   carrying it up and out of frame, so the transition into the page is
 *   spatial depth rather than an opacity dissolve.
 * - Screen blend makes the black areas of the clip fully transparent, so
 *   only the bright ink tendrils glow over the page.
 *
 * NOTE: the screen blend lives on the fixed wrapper (which contains only the
 * canvas) rather than literally on the <canvas>. A fixed element isolates a
 * child's blend mode from the page, which would make the black areas opaque
 * instead of transparent — putting it on the wrapper is visually identical
 * and actually composites against the page.
 *
 * Reduced motion: not rendered (purely decorative motion).
 */

const STEP = 0.012; // seconds of video advanced per animation frame (slow, weightless)
const PLAYBACK_RATE = 0.85; // ~15% slower than recorded, more weightless
const PARALLAX = 0.35; // canvas rises at 35% of scroll — drifts up and out of frame
const BASE_OPACITY = 0.45; // constant — the ink never fades, it parallaxes away

export function InkBackground() {
  const reduced = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduced) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!wrapper || !canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const direction = { current: 1 }; // 1 = forward, -1 = reverse

    // Keep the canvas backing store matched to its displayed size.
    const sizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    sizeCanvas();
    const resizeObserver = new ResizeObserver(sizeCanvas);
    resizeObserver.observe(canvas);

    // Autoplay fix: prime the first frame so there's no black flash before
    // the rAF loop takes over.
    video.playbackRate = PLAYBACK_RATE;
    video.currentTime = 0;
    video
      .play()
      .then(() => video.pause())
      .catch(() => {});

    // Drive parallax/fade from the live Lenis scroll position (fallback to
    // the native scroll offset before Lenis has initialized).
    const getScrollY = () => window.lenis?.scroll ?? window.scrollY;

    // Draw the frame like CSS object-fit: cover — scaled to fill while keeping
    // the video's aspect ratio (no vertical stretch on portrait / mobile),
    // centered, cropping whatever overflows.
    const paintCover = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!cw || !ch || !vw || !vh) return;
      const scale = Math.max(cw / vw, ch / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      ctx.drawImage(video, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const loop = () => {
      const scrollY = getScrollY();

      // 1) Ping-pong the video time and paint the frame — always alive.
      if (video.readyState >= 2 && Number.isFinite(video.duration)) {
        let t = video.currentTime + STEP * direction.current;
        if (t >= video.duration - 0.05) {
          direction.current = -1;
          t = video.duration - 0.05;
        } else if (t <= 0.05) {
          direction.current = 1;
          t = 0.05;
        }
        video.currentTime = t;
        paintCover();
      }

      // 2) Parallax — the ink drifts up and out of frame as you scroll,
      //    so the transition is spatial depth, never an opacity fade.
      canvas.style.transform = `translateY(${-scrollY * PARALLAX}px)`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      {/* Hidden source video — its decoded frames are drawn onto the canvas */}
      <video
        ref={videoRef}
        src="/ink.mp4"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 -z-10 h-px w-px opacity-0"
      />

      {/* Ink layer — screen-blended against the page (black → transparent) */}
      <div
        ref={wrapperRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden mix-blend-screen"
        style={{ opacity: BASE_OPACITY }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            objectFit: "cover",
            transform: "translateY(0px)",
            willChange: "transform",
            filter: "blur(0.4px)",
            // Soft-fade the top & bottom edges so the video has no hard line
            // as it parallaxes up out of frame on scroll-down. The mask moves
            // with the canvas, so the bottom edge is always feathered.
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 12%, #000 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 12%, #000 78%, transparent 100%)",
          }}
        />

        {/* Radial vignette — concentrates the ink toward the centre so it
            feels like it's emanating from the middle of the screen. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            zIndex: 1,
          }}
        />
      </div>
    </>
  );
}
