import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "./ProjectsGrid";

/**
 * SECTION 3 — Projects. Add a project by editing src/data/projects.ts.
 * Each project renders as an editorial index row that opens a modal
 * (see ProjectsGrid / ProjectModal).
 */
export function Projects() {
  return (
    <section
      id="projects"
      className="relative border-t border-hairline bg-bg-deep py-28 sm:py-36"
    >
      <div className="mx-auto max-w-container px-6 sm:px-12">
        <SectionHeading index="02" eyebrow="Selected Work" />
        <ProjectsGrid />
      </div>
    </section>
  );
}
