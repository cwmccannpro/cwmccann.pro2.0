import { certifications } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EducationIndex } from "./EducationIndex";
import { WorkIndex } from "./WorkIndex";

/**
 * SECTION 4 — Education, Work Experience & Certifications.
 * All entries live in src/data/experience.ts.
 *
 * Education leads as a ledger row; work renders as clickable index rows
 * (see WorkIndex — company big, role, one-liner, detail dialog);
 * certifications close the section as a compact grid.
 */
export function Experience() {
  return (
    <section
      id="experience"
      className="relative border-t border-hairline bg-bg py-28 sm:py-36"
    >
      <div className="mx-auto max-w-container px-6 sm:px-12">
        <SectionHeading
          index="03"
          eyebrow="Experience"
          title="Education & Work"
        />

        {/* Education index — click the row for the full coursework */}
        <div className="mt-16">
          <Reveal>
            <h3 className="label mb-2 text-fg/45">Education</h3>
          </Reveal>
          <EducationIndex />
        </div>

        {/* Work index — click a row for the full record */}
        <div className="mt-20">
          <Reveal>
            <h3 className="label mb-2 text-fg/45">Work</h3>
          </Reveal>
          <WorkIndex />
        </div>

        {/* Certifications grid */}
        <div className="mt-20">
          <Reveal>
            <h3 className="label mb-2 text-fg/45">Certifications</h3>
          </Reveal>
          <div className="grid border-t border-hairline sm:grid-cols-2 sm:gap-x-10">
            {certifications.map((entry, i) => (
              <Reveal key={`${entry.name}-${i}`} delay={i * 0.04}>
                <div className="flex h-full items-baseline justify-between gap-6 border-b border-hairline py-6">
                  <div>
                    <h4 className="font-display text-[clamp(17px,1.7vw,22px)] font-normal leading-snug text-heading">
                      {entry.name}
                    </h4>
                    {entry.issuer && (
                      <div className="label mt-1.5 text-[10px] text-ember/90">
                        {entry.issuer}
                      </div>
                    )}
                    {entry.credentialId && (
                      <div className="mt-1.5 break-all font-mono text-[10px] text-fg/40">
                        ID {entry.credentialId}
                      </div>
                    )}
                  </div>
                  {entry.status && (
                    <span className="label shrink-0 whitespace-nowrap text-[10px] text-fg/40">
                      {entry.status}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
