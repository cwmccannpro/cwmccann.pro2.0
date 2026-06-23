"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const TITLE_ID = "project-modal-title";

/**
 * Accessible project dialog: shows the project's description and screenshots.
 *
 * - Opens when `project` is non-null; AnimatePresence handles enter/exit.
 * - Closes on Escape, backdrop click, or the close button.
 * - Locks page scroll (pauses Lenis + hides body overflow) while open.
 * - Manages focus: focuses the close button on open, traps Tab inside the
 *   panel, and restores focus to the trigger on close.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const { stop, start } = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

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
  }, [project, onClose, stop, start]);

  return (
    <AnimatePresence>
      {project && (
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
            aria-labelledby={TITLE_ID}
            data-lenis-prevent
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-fg/15 bg-bg-deep p-6 sm:p-10"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="label block text-ember">Project</span>
                <h2
                  id={TITLE_ID}
                  className="mt-3 font-display text-[clamp(34px,5vw,60px)] font-medium leading-none text-heading"
                >
                  {project.title}
                </h2>
                {project.year && (
                  <span className="label mt-3 block text-fg/45">
                    {project.year}
                  </span>
                )}
              </div>

              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 -mt-1 shrink-0 rounded-full border border-fg/20 p-2.5 text-fg/70 transition-colors hover:border-red hover:text-red"
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
            </div>

            {project.tags && project.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="label rounded-full border border-fg/15 px-3 py-1.5 text-[10px] text-fg/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-6 max-w-prose text-[17px] leading-relaxed text-fg/75">
              {project.description ?? project.blurb}
            </p>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-6 inline-flex items-center gap-2 text-fg transition-colors hover:text-red"
              >
                Visit project
                <span aria-hidden="true">↗</span>
              </a>
            )}

            {/* Screenshot gallery */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mt-9 flex flex-col gap-4">
                {project.screenshots.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary user screenshots; intrinsic ratio preserved
                  <img
                    key={src}
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    loading="lazy"
                    className="h-auto w-full border border-fg/10"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
