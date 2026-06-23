"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Expose the Lenis instance globally so non-context consumers (e.g. the
// InkBackground canvas) can read the live scroll position. We use a distinct
// `__lenis` key: lenis ships its own `window.lenis` global declaration with a
// different shape, so reusing that name breaks declaration merging.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

type ScrollTarget = string | number | HTMLElement;

type LenisContextValue = {
  /** Smoothly scroll to a section id ("#who"), element, or offset. */
  scrollTo: (target: ScrollTarget, opts?: { offset?: number }) => void;
  /** Pause smooth scrolling (e.g. while a modal is open). */
  stop: () => void;
  /** Resume smooth scrolling. */
  start: () => void;
};

const LenisContext = createContext<LenisContextValue>({
  // Fallback used before the provider mounts or when motion is reduced.
  scrollTo: (target) => {
    if (typeof window === "undefined") return;
    const el =
      typeof target === "string" ? document.querySelector(target) : null;
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  },
  stop: () => {},
  start: () => {},
});

/** Access the smooth-scroll controller (e.g. for nav links). */
export function useSmoothScroll() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // Reduced motion: skip Lenis entirely and let the browser scroll natively.
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      // Touch devices keep their native momentum scrolling.
      syncTouch: false,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Keep ScrollTrigger in lockstep with Lenis' virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both share one rAF loop.
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once everything is laid out.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, [reduced]);

  const scrollTo = useCallback(
    (target: ScrollTarget, opts?: { offset?: number }) => {
      const offset = opts?.offset ?? 0;
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.2 });
        return;
      }
      // Reduced-motion / no-Lenis fallback: instant native jump.
      if (typeof window === "undefined") return;
      const el =
        typeof target === "string"
          ? document.querySelector(target)
          : target instanceof HTMLElement
            ? target
            : null;
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "auto" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "auto" });
      }
    },
    [],
  );

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  return (
    <LenisContext.Provider value={{ scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
