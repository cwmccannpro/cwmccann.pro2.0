import { about } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** SECTION 2 — Who Am I. Body copy & facts come from src/data/site.ts. */
export function WhoAmI() {
  return (
    // z-10 keeps the section painting above the hero's sticky stage while
    // it slides up over the fading title card.
    <section id="who" className="relative z-10 border-t border-hairline bg-bg-deep">
      {/* Top padding kept tight so content greets the visitor right after
          the title card's black handoff — no dead scroll between them. */}
      <div className="mx-auto max-w-container px-6 pb-28 pt-16 sm:px-12 sm:pb-36 sm:pt-20">
        <SectionHeading index="01" eyebrow="About" />

        <div className="mt-16 grid gap-12 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
          <div>
            <TextReveal
              as="h2"
              className="font-display text-[clamp(44px,6vw,88px)] font-light leading-[0.95] text-heading"
            >
              Who am <em className="italic text-ember">I</em>
            </TextReveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              {/* Editorial drop cap on the lede — Fraunces carries it. */}
              <p className="text-pretty font-display text-[clamp(22px,2.4vw,32px)] font-light leading-[1.45] text-fg/90 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[3.1em] first-letter:font-normal first-letter:leading-[0.75] first-letter:text-ember">
                {about.body}
              </p>
            </Reveal>

            {/* Skill tags — hidden while `about.skills` is empty. Re-adding
                entries in src/data/site.ts brings this back, styled as-is. */}
            {about.skills.length > 0 && (
              <Reveal delay={0.14}>
                <ul className="mt-9 flex flex-wrap gap-3">
                  {about.skills.map((skill) => (
                    <li
                      key={skill}
                      className="label rounded-full border border-hairline px-4 py-2 text-[11px] text-fg/70 transition-colors hover:border-red hover:text-fg"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Quick-facts grid — hard data under the prose. */}
            <Reveal delay={0.16}>
              <dl className="mt-14 grid grid-cols-2 gap-x-8 border-t border-hairline">
                {about.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-b border-hairline py-5"
                  >
                    <dt className="label text-[10px] text-fg/40">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 font-display text-[clamp(16px,1.6vw,21px)] font-normal leading-snug text-heading">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
