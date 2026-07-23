"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { HeroEmberVideo } from "./HeroEmberVideo";
import { TextReveal } from "@/components/ui/TextReveal";
import { site } from "@/data/site";

/**
 * HERO — the cinematic title card.
 *
 * A 200vh track holds a sticky 100vh "stage" framed like a film slate:
 * metadata in the four corners and the name — huge, Fraunces, masked
 * word-reveal — as the true centerpiece.
 *
 * As you scroll, a scrubbed GSAP timeline resolves the card: the frame and
 * name lift away, grain calms, the vignette opens.
 *
 * Layers are nested wrapper(data-depth) > inner(ref) so the light
 * mouse-parallax drift (on the wrappers) never collides with the scroll
 * timeline (on the inner refs).
 *
 * Reduced motion: the transition is skipped, the track collapses to a
 * single readable viewport, and grain animation is disabled via CSS.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Inner (scroll-animated) layer refs
  const hazeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  // Avoid an SSR/client hydration mismatch on the track height.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // True only while the hero stage is on screen. Drives pausing the ember
  // video and the film-grain animation once the title card scrolls away, so
  // no offscreen loop keeps the compositor (and GPU/battery) busy.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

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
          invalidateOnRefresh: true,
        },
      });

      // Timeline normalized to a total duration of 1 == full scroll of track.
      // The choreography fills the entire scrub so there is never a stretch
      // of background-only page: as the name finishes lifting, the smoke is
      // already dissolving to the section base color, and Who Am I's edge
      // arrives exactly as the scrub ends.
      tl.to(hazeRef.current, { scale: 1.12, duration: 1 }, 0)
        // The film-slate frame is the first thing to dissolve.
        .to(frameRef.current, { opacity: 0, duration: 0.3 }, 0)
        // The name lifts away across the FULL scrub — it is still finishing
        // its exit as Who Am I's edge enters, so the screen never rests
        // empty between the two sections.
        .to(
          textRef.current,
          { opacity: 0, y: -90, scale: 0.985, duration: 1, ease: "power1.in" },
          0,
        )
        // Vignette opens up over the whole ride.
        .to(vignetteRef.current, { opacity: 0, duration: 1 }, 0)
        // THE HANDOFF — smoke and grain fade to the bg-deep black that
        // Who Am I sits on, so the sections blend with no visible seam.
        .to(grainRef.current, { opacity: 0, duration: 0.45 }, 0.55)
        .to(
          hazeRef.current,
          { opacity: 0, duration: 0.45, ease: "power1.in" },
          0.55,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, mounted]);

  // Motion → tall track to scrub through; reduced → single static viewport.
  // 150vh = one viewport of stage + 50vh of scrub. The negative bottom
  // margin pulls Who Am I up INTO the scrub: the section rises over the
  // fading title card from the first pixel of scroll, covering the stage's
  // center exactly as the name finishes its exit — the screen is never an
  // empty black page between the two sections.
  const motionMode = mounted && !reduced;
  const trackHeight = motionMode ? "150vh" : "100svh";
  const trackMarginBottom = motionMode ? "-50vh" : undefined;

  // Display treatment for the name: every word roman except the surname,
  // which lands in Fraunces italic — "Cameron W." / *McCann*.
  const words = site.fullName.split(" ");
  const surname = words[words.length - 1];
  const forenames = words.slice(0, -1).join(" ");

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label={`${site.fullName} — title card`}
      className="relative bg-bg-deep"
      style={{ height: trackHeight, marginBottom: trackMarginBottom }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden bg-bg-deep"
      >
        {/* LAYER 1 — the Molten Ink plate: photoreal ember-smoke cinema
            loop, seated into the noir base by a soft radial falloff on top. */}
        <div data-depth="0.12" className="absolute inset-[-8%]">
          <div
            ref={hazeRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: "scale(1.06)" }}
          >
            <HeroEmberVideo
              className="absolute inset-0 h-full w-full"
              paused={!inView}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 95% at 50% 50%, rgba(4,4,4,0) 30%, rgba(4,4,4,0.42) 70%, rgba(4,4,4,0.85) 100%)",
              }}
            />
          </div>
        </div>

        {/* LAYER 2 — THE NAME. Huge, masked word-reveal, italic surname. */}
        <div data-depth="0.8" className="absolute inset-0 z-[3]">
          <div
            ref={textRef}
            className="pointer-events-none flex h-full flex-col items-center justify-center px-[6vw] will-change-transform"
          >
            <h1
              className="whitespace-nowrap text-center font-display font-light leading-[0.95] tracking-[-0.01em] text-heading"
              style={{
                fontSize: "clamp(26px, 8vw, 118px)",
                filter: "drop-shadow(0 0 48px rgba(180, 60, 30, 0.28))",
              }}
            >
              <TextReveal as="span" delay={0.3}>
                {forenames}
              </TextReveal>{" "}
              <TextReveal as="span" delay={0.55}>
                {surname}
              </TextReveal>
            </h1>
          </div>
        </div>

        {/* LAYER 4 — film-slate frame: metadata pinned to the corners.
            The framer intro fade lives on the OUTER div and the GSAP scroll
            fade on the INNER one — opacities multiply, so the late-finishing
            intro can never overwrite the scrub (they'd race on one element). */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
        >
          <div ref={frameRef} className="absolute inset-0 p-6 sm:p-10">
          <span className="label absolute left-6 top-6 text-[10px] text-fg/45 sm:left-10 sm:top-9">
            {site.heroLabel}
          </span>
          <span className="label absolute right-6 top-6 text-right text-[10px] text-fg/45 sm:right-10 sm:top-9">
            Buffalo, NY
            <span className="mt-1 block text-fg/30">42.88°N — 78.87°W</span>
          </span>
          <span className="label absolute bottom-6 left-6 text-[10px] text-fg/45 sm:bottom-9 sm:left-10">
            {site.monogram} — {new Date().getFullYear()}
          </span>
          {/* Scroll cue */}
          <span className="absolute bottom-6 right-6 flex flex-col items-end gap-3 sm:bottom-9 sm:right-10">
            <span className="label text-[10px] text-fg/50">Scroll</span>
            <span
              className="block h-10 w-px animate-bob"
              style={{
                background: "linear-gradient(180deg, #E10600, rgba(225,6,0,0))",
              }}
            />
          </span>
          </div>
        </motion.div>

        {/* LAYER 5 — animated film grain (CSS keyframe; opacity scrubbed).
            The infinite keyframe is halted once the hero leaves view so the
            large mix-blend layer stops repainting offscreen. */}
        <div
          ref={grainRef}
          aria-hidden="true"
          className="grain pointer-events-none absolute -left-1/2 -top-1/2 z-[6] h-[200%] w-[200%] opacity-[0.17] mix-blend-overlay"
          style={{ animationPlayState: inView ? "running" : "paused" }}
        />

        {/* LAYER 6 — deep vignette frame */}
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
