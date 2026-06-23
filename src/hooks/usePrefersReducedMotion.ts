"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user has requested reduced motion at the OS level.
 *
 * SSR-safe: defaults to `false` (full motion) on the server and the first
 * client render, then updates after mount. Components use this to skip
 * heavy parallax, the pinned scroll transition, and smooth scrolling.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
