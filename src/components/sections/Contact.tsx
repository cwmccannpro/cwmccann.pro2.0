import { contactLinks } from "@/data/contact";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollVideoBackground } from "./ScrollVideoBackground";

/** SECTION 5 — Contact. Links come from src/data/contact.ts. */
export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-fg/10 bg-bg-deep py-28 sm:py-36"
    >
      {/* Scroll-scrubbed water video — finishes at the page bottom since
          this is the last section. Faint accent behind the content. */}
      <ScrollVideoBackground
        src="/water.mp4"
        end="max"
        opacityClassName="opacity-[0.08]"
      />

      <div className="relative z-10 mx-auto max-w-container px-6 sm:px-12">
        <SectionHeading
          eyebrow="Contact"
          title="Let's connect"
        />

        <ul className="mt-8">
          {contactLinks.map((link, i) => (
            <Reveal key={link.label} delay={i * 0.05}>
              <li>
                <a
                  href={link.href}
                  className="group grid grid-cols-[80px_1fr_auto] items-center gap-5 border-b border-fg/12 py-7 transition-[padding] duration-300 hover:pl-4 sm:grid-cols-[160px_1fr_auto] sm:gap-9"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="label text-fg/45">{link.label}</span>
                  <span className="font-display text-[clamp(24px,3.4vw,44px)] font-medium leading-none text-heading transition-colors duration-300 group-hover:text-red">
                    {link.display}
                  </span>
                  <span
                    aria-hidden="true"
                    className="label text-fg/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red"
                  >
                    {link.external ? "↗" : "→"}
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
