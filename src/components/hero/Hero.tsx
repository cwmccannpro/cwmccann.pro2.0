"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { Monogram } from "./Monogram";
import { site } from "@/data/site";

/**
 * HERO — the cinematic title card.
 *
 * A tall track (300vh) holds a sticky 100vh "stage". As you scroll the
 * track, a scrubbed GSAP timeline drives the transition:
 *   • grain fades down            • fog parts left/right and clears
 *   • haze drifts/scales          • hero text lifts away
 *   • the monogram shrinks and docks toward the top-left corner, where the
 *     fixed nav logo takes over (see Nav.tsx)
 *
 * Layers are nested wrapper(data-depth) > inner(ref) so the light
 * mouse-parallax drift (on the wrappers) never collides with the scroll
 * timeline (on the inner refs).
 *
 * Reduced motion: the whole transition is skipped, the track collapses to
 * a single readable viewport, and grain animation is disabled via CSS.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Inner (scroll-animated) layer refs
  const hazeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // Avoid an SSR/client hydration mismatch on the track height.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Light pointer drift on every [data-depth] wrapper inside the stage.
  useMouseParallax(stageRef, !reduced);

  // The scrubbed scroll transition (motion only).
  useEffect(() => {
    if (reduced || !mounted) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true, // recompute the corner offsets on resize
        },
      });

      // Timeline normalized to a total duration of 1 == full scroll of track.
      tl.to(hazeRef.current, { scale: 1.12, opacity: 0.8, duration: 1 }, 0)
        // Hero text lifts away early.
        .to(textRef.current, { opacity: 0, y: -40, duration: 0.4 }, 0)
        // Scroll cue is the first thing to go.
        .to(cueRef.current, { opacity: 0, duration: 0.12 }, 0)
        // Atmosphere settles: grain calms, vignette opens up.
        .to(grainRef.current, { opacity: 0.05, duration: 1 }, 0)
        .to(vignetteRef.current, { opacity: 0.42, duration: 1 }, 0)
        // Monogram gently recedes the whole way and only fades out near the
        // end, so the hero never sits empty before scrolling into Who Am I.
        .to(monoRef.current, { scale: 0.82, duration: 1 }, 0)
        .to(monoRef.current, { opacity: 0, duration: 0.3 }, 0.6);
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, mounted]);

  // Motion → tall track to scrub through; reduced → single static viewport.
  // 200vh = one viewport of scrub + one of scroll-off, so there's no dead
  // blank stage between the resolved hero and the Who Am I section.
  const trackHeight = mounted && reduced ? "100svh" : "200vh";

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label={`${site.fullName} — title card`}
      className="relative bg-bg-deep"
      style={{ height: trackHeight }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden bg-bg-deep"
      >
        {/* LAYER 1 — far haze: deep gradient + faint warm core glow */}
        <div data-depth="0.12" className="absolute inset-[-8%]">
          <div
            ref={hazeRef}
            className="absolute inset-0 will-change-transform"
            style={{
              transform: "scale(1.06)",
              background:
                "radial-gradient(60% 55% at 50% 46%, rgba(70,18,16,0.55) 0%, rgba(20,8,8,0) 55%), radial-gradient(120% 90% at 50% 50%, #100c0c 0%, #070606 50%, #040404 100%)",
            }}
          />
        </div>

        {/* HERO TEXT — scroll cue + name, anchored toward the bottom */}
        <div data-depth="0.9" className="absolute inset-0 z-[3]">
          <div
            ref={textRef}
            className="pointer-events-none flex h-full flex-col items-center justify-end px-[6vw] py-[7vh] will-change-transform"
          >
            {/* Scroll cue + name, anchored toward the bottom */}
            <div className="flex flex-col items-center gap-7">
              {/* SCROLL CUE — sits just above the name so it never overlaps it */}
              <div
                ref={cueRef}
                aria-hidden="true"
                className="flex flex-col items-center gap-3"
              >
                <span className="label text-[10px] text-fg/50">Scroll</span>
                <span
                  className="block h-10 w-px animate-bob"
                  style={{
                    background:
                      "linear-gradient(180deg, #E10600, rgba(225,6,0,0))",
                  }}
                />
              </div>

              <div
                className="text-center"
                // Barely-perceptible warm crimson luminescence behind the name,
                // as if the ink were bleeding light onto it.
                style={{ filter: "drop-shadow(0 0 40px rgba(180, 60, 30, 0.25))" }}
              >
                {/* TODO: full name placeholder lives in src/data/site.ts */}
                <h1
                  className="font-display text-[clamp(30px,4.4vw,62px)] font-medium leading-[1.05] tracking-[0.16em]"
                  // Warm ivory→parchment glow, clipped to the glyphs — light
                  // catching through liquid, tying the name to the ink aesthetic.
                  style={{
                    backgroundImage:
                      "linear-gradient(160deg, #F5F5F2 0%, #C8B8A2 60%, #A08070 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  {site.fullName}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* MONOGRAM — centerpiece that shrinks toward the corner */}
        <div
          data-depth="0.5"
          className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center"
        >
          <div
            ref={monoRef}
            className="w-[min(74vw,880px)] will-change-transform"
          >
            <Monogram id="hero" glow title={`${site.monogram} monogram`} />
          </div>
        </div>

        {/* LAYER 4 — animated film grain (CSS keyframe; opacity scrubbed) */}
        <div
          ref={grainRef}
          aria-hidden="true"
          className="grain pointer-events-none absolute -left-1/2 -top-1/2 z-[6] h-[200%] w-[200%] opacity-[0.17] mix-blend-overlay"
        />

        {/* LAYER 5 — deep vignette frame */}
        <div
          ref={vignetteRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[7]"
          style={{
            background:
              "radial-gradient(120% 110% at 50% 48%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.92) 100%)",
          }}
        />

      </div>
    </section>
  );
}
