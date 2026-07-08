"use client";

import type { Project } from "@/data/projects";
import { DetailModal } from "@/components/ui/DetailModal";

const TITLE_ID = "project-modal-title";

/**
 * Project dialog: the project's description and screenshots, rendered in
 * the shared DetailModal shell (focus trap, scroll lock, Escape/backdrop).
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <DetailModal open={project !== null} onClose={onClose} labelledBy={TITLE_ID}>
      {project && (
        <>
          <span className="label block text-ember">Project</span>
          <h2
            id={TITLE_ID}
            className="mt-3 pr-12 font-display text-[clamp(34px,5vw,60px)] font-light leading-none text-heading"
          >
            {project.title}
          </h2>
          {project.year && (
            <span className="label mt-3 block text-fg/45">{project.year}</span>
          )}

          {project.tags && project.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="label rounded-full border border-hairline px-3 py-1.5 text-[10px] text-fg/70"
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
        </>
      )}
    </DetailModal>
  );
}
