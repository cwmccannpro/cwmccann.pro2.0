"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Light mouse-driven parallax drift.
 *
 * Translates every `[data-depth]` element inside `scopeRef` toward the
 * pointer, scaled by its depth (0–1). Layers are nested as
 * wrapper(data-depth) > inner(scroll-animated) so this never fights the
 * GSAP scroll timeline, which only touches the inner elements.
 *
 * No-ops when `enabled` is false (reduced motion) or the device lacks a
 * precise pointer (touch) — so mobile gracefully drops the effect.
 */
export function useMouseParallax(
  scopeRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  maxShift = 26,
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !enabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const targets = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-depth]"),
    ).map((el) => ({
      depth: parseFloat(el.dataset.depth || "0"),
      // quickTo lerps toward the latest value each frame for a smooth drift.
      toX: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" }),
      toY: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
    }));

    const onMove = (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      for (const t of targets) {
        t.toX(px * t.depth * maxShift);
        t.toY(py * t.depth * maxShift);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      for (const t of targets) {
        t.toX(0);
        t.toY(0);
      }
    };
  }, [scopeRef, enabled, maxShift]);
}
