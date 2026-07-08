"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ProjectModal } from "./ProjectModal";

/**
 * The project index — full-width editorial rows, not cards.
 *
 * Each row is a button that opens the project modal. On hover a soft
 * ember glow follows the cursor (see .glow-row in globals.css), the
 * title shears right, the arrow answers — and a floating screenshot
 * preview trails the pointer (desktop + motion-ok only).
 */
export function ProjectsGrid() {
  const [active, setActive] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  // Keeps the last image mounted while the preview fades out.
  const [preview, setPreview] = useState<Project | null>(null);

  const reduced = usePrefersReducedMotion();
  const previewRef = useRef<HTMLDivElement>(null);
  const moveTo = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  // Lazily build the lerped followers once the preview element exists.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    moveTo.current = {
      x: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }),
    };
    return () => {
      moveTo.current = null;
    };
  }, [reduced]);

  const onRowEnter = useCallback((project: Project) => {
    setHovered(project);
    if (project.screenshots?.length) setPreview(project);
  }, []);

  const onRowMove = useCallback((e: React.PointerEvent) => {
    // Trail the cursor, offset so the card sits beside — not under — it.
    moveTo.current?.x(e.clientX + 28);
    moveTo.current?.y(e.clientY - 90);
  }, []);

  const showPreview =
    hovered != null && (hovered.screenshots?.length ?? 0) > 0;

  return (
    <>
      <div className="mt-14 border-t border-hairline">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.06}>
            <ProjectRow
              project={project}
              index={i}
              onOpen={() => setActive(project)}
              onEnter={() => onRowEnter(project)}
              onLeave={() => setHovered(null)}
              onMove={onRowMove}
            />
          </Reveal>
        ))}
      </div>

      {/* Floating screenshot preview — trails the cursor over the index. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-30 hidden w-[300px] overflow-hidden border border-hairline-strong bg-bg-raised shadow-[0_24px_80px_rgba(0,0,0,0.6)] transition-[opacity,scale] duration-300 ease-out md:block ${
          showPreview ? "scale-100 opacity-100" : "scale-[0.94] opacity-0"
        }`}
      >
        {preview?.screenshots?.[0] && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user screenshots
          <img
            src={preview.screenshots[0]}
            alt=""
            className="block h-auto w-full"
          />
        )}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}

function ProjectRow({
  project,
  index,
  onOpen,
  onEnter,
  onLeave,
  onMove,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
  onEnter: () => void;
  onLeave: () => void;
  onMove: (e: React.PointerEvent) => void;
}) {
  const num = String(index + 1).padStart(2, "0");

  // Feed the cursor position to the CSS glow (custom props on the row)
  // and to the floating preview follower.
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      onMove(e);
    },
    [onMove],
  );

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerMove={onPointerMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      aria-haspopup="dialog"
      aria-label={`${project.title} — view details`}
      className="glow-row group grid w-full grid-cols-[auto_1fr] items-start gap-x-6 border-b border-hairline py-10 text-left transition-colors duration-500 hover:border-hairline-strong sm:grid-cols-[64px_1fr_auto] sm:gap-x-10 sm:py-12"
    >
      {/* pt tuned so the numeral sits on the title's cap height */}
      <span className="label pt-3 text-fg/35 transition-colors duration-300 group-hover:text-ember sm:pt-4">
        {num}
      </span>

      <span className="block">
        <span className="block font-display text-[clamp(34px,5.4vw,72px)] font-light leading-[1.02] text-heading transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
          {project.title}
        </span>
        <span className="mt-3 block max-w-prose text-[15px] leading-relaxed text-fg/60">
          {project.blurb}
        </span>
        {project.tags && project.tags.length > 0 && (
          <span className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
            {project.tags.map((tag) => (
              <span key={tag} className="label text-[10px] text-fg/40">
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>

      {/* Year + arrow column */}
      <span className="col-start-2 mt-5 flex items-center gap-4 self-start sm:col-start-3 sm:mt-2 sm:flex-col sm:items-end sm:gap-6">
        {project.year && (
          <span className="label text-fg/40">{project.year}</span>
        )}
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-fg/60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-red group-hover:bg-red group-hover:text-heading"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 12L12 2M12 2H4M12 2v8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
