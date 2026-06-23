import { about } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** SECTION 2 — Who Am I. Body copy & skills come from src/data/site.ts. */
export function WhoAmI() {
  return (
    <section id="who" className="relative bg-bg-deep py-28 sm:py-36">
      <div className="mx-auto max-w-container px-6 sm:px-12">
        <SectionHeading eyebrow="About" />

        <div className="mt-16 grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
          <Reveal>
            <h2 className="font-display text-[clamp(40px,6vw,84px)] font-medium leading-[0.95] text-heading">
              {about.heading}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-pretty font-display text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.4] text-fg/90">
              {about.body}
            </p>

            {/* Skill tags — hidden while `about.skills` is empty. Re-adding
                entries in src/data/site.ts brings this back, styled as-is. */}
            {about.skills.length > 0 && (
              <ul className="mt-9 flex flex-wrap gap-3">
                {about.skills.map((skill) => (
                  <li
                    key={skill}
                    className="label rounded-full border border-fg/15 px-4 py-2 text-[11px] text-fg/70 transition-colors hover:border-red hover:text-fg"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
