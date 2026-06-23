"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectModal } from "./ProjectModal";

/**
 * The projects grid. Each project is a Gumroad-style button (see
 * `.project-button` in globals.css) that opens a modal with the project's
 * full description and screenshots.
 */
export function ProjectsGrid() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.08}>
            <ProjectButton
              project={project}
              index={i}
              onOpen={() => setActive(project)}
            />
          </Reveal>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}

function ProjectButton({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${project.title} — view details`}
      // `.project-button` carries the themed hover/lift; children inherit color.
      className="project-button group flex h-full w-full flex-col items-start p-7 text-left"
    >
      <div className="mb-5 flex w-full items-center justify-between">
        <span className="label opacity-40">{num}</span>
        {project.year && <span className="label opacity-40">{project.year}</span>}
      </div>

      <h3 className="font-display text-[clamp(28px,3.4vw,42px)] font-medium leading-none text-heading">
        {project.title}
      </h3>

      <p className="mt-4 max-w-prose text-[15px] leading-relaxed opacity-70">
        {project.blurb}
      </p>

      {project.tags && project.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="label text-[10px] opacity-50">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {/* mt-auto pins this to the bottom so it aligns across cards of
          differing content height (the grid makes both cards equal height). */}
      <span className="label mt-auto inline-flex items-center gap-2 pt-6 opacity-60 transition-[color,opacity] duration-300 group-hover:text-red group-hover:opacity-100">
        View project
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </button>
  );
}
