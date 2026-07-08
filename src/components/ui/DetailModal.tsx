"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

/**
 * DetailModal — shared accessible dialog shell for the index sections
 * (projects, work experience).
 *
 * - Renders when `open`; AnimatePresence handles enter/exit (the exiting
 *   panel keeps its last children while it animates out).
 * - Closes on Escape, backdrop click, or the corner close button.
 * - Locks page scroll (pauses Lenis + hides body overflow) while open.
 * - Manages focus: focuses the close button on open, traps Tab inside the
 *   panel, and restores focus to the trigger on close.
 */
export function DetailModal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the heading element inside `children`. */
  labelledBy: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const { stop, start } = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Remember what to return focus to, then lock the page behind the modal.
    lastFocused.current = document.activeElement as HTMLElement | null;
    stop();
    document.body.style.overflow = "hidden";

    // Focus the close button once the panel has mounted.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Basic focus trap: keep Tab within the panel.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      start();
      lastFocused.current?.focus?.();
    };
  }, [open, onClose, stop, start]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close dialog"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            data-lenis-prevent
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-hairline-strong bg-bg-deep p-6 shadow-[0_32px_120px_rgba(0,0,0,0.7)] sm:p-10"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 rounded-full border border-fg/20 p-2.5 text-fg/70 transition-colors hover:border-red hover:text-red sm:right-8 sm:top-8"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
