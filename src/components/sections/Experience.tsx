import { work, education, certifications } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * SECTION 4 — Work Experience, Education & Certifications.
 * All entries live in src/data/experience.ts.
 */
export function Experience() {
  return (
    <section
      id="experience"
      className="relative border-t border-fg/10 bg-bg py-28 sm:py-36"
    >
      <div className="mx-auto max-w-container px-6 sm:px-12">
        <SectionHeading
          eyebrow="Experience"
          title="Work & Education"
        />

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
          {/* Work */}
          <div>
            <Reveal>
              <h3 className="label mb-8 text-fg/45">Work</h3>
            </Reveal>
            <ol className="relative border-l border-fg/15">
              {work.map((entry, i) => (
                <Reveal key={`${entry.company}-${i}`} delay={i * 0.05}>
                  <li className="relative mb-10 pl-8 last:mb-0">
                    <Node />
                    <span className="label text-fg/45">{entry.dates}</span>
                    <h4 className="mt-1.5 font-display text-2xl font-medium leading-tight text-heading">
                      {entry.role}
                    </h4>
                    <div className="label mt-1 text-ember">{entry.company}</div>
                    {entry.meta && (
                      <div className="mt-1.5 text-[12px] text-fg/40">
                        {entry.meta}
                      </div>
                    )}
                    <ul className="mt-3 flex flex-col gap-2">
                      {entry.highlights.map((point, j) => (
                        <li
                          key={j}
                          className="relative pl-4 text-[15px] leading-relaxed text-fg/65 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-red/60"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Education */}
          <div>
            <Reveal>
              <h3 className="label mb-8 text-fg/45">Education</h3>
            </Reveal>
            <ol className="relative border-l border-fg/15">
              {education.map((entry, i) => (
                <Reveal key={`${entry.school}-${i}`} delay={i * 0.05}>
                  <li className="relative mb-10 pl-8 last:mb-0">
                    <Node />
                    <span className="label text-fg/45">{entry.dates}</span>
                    <h4 className="mt-1.5 font-display text-2xl font-medium leading-tight text-heading">
                      {entry.degree}
                    </h4>
                    <div className="label mt-1 text-ember">{entry.school}</div>
                  </li>
                </Reveal>
              ))}
            </ol>

            {/* Certifications */}
            <Reveal>
              <h3 className="label mb-8 mt-14 text-fg/45">Certifications</h3>
            </Reveal>
            <ol className="relative border-l border-fg/15">
              {certifications.map((entry, i) => (
                <Reveal key={`${entry.name}-${i}`} delay={i * 0.05}>
                  <li className="relative mb-10 pl-8 last:mb-0">
                    <Node />
                    {entry.status && (
                      <span className="label text-fg/45">{entry.status}</span>
                    )}
                    <h4 className="mt-1.5 font-display text-2xl font-medium leading-tight text-heading">
                      {entry.name}
                    </h4>
                    {entry.issuer && (
                      <div className="label mt-1 text-ember">{entry.issuer}</div>
                    )}
                    {entry.credentialId && (
                      <div className="mt-1.5 break-all font-mono text-[11px] text-fg/35">
                        Credential ID {entry.credentialId}
                      </div>
                    )}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Red timeline node sitting on the vertical rule. */
function Node() {
  return (
    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-red ring-4 ring-bg" />
  );
}
