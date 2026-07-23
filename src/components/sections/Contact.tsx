import { contactLinks } from "@/data/contact";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { LoopingVideoBackground } from "./LoopingVideoBackground";

/** SECTION 5 — Contact. Links come from src/data/contact.ts. */
export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-hairline bg-bg-deep py-28 sm:py-40"
    >
      {/* Looping water video — plays on its own loop (independent of
          scroll). Faint accent behind the content. */}
      <LoopingVideoBackground src="/water.mp4" opacityClassName="opacity-[0.08]" />

      <div className="relative z-10 mx-auto max-w-container px-6 sm:px-12">
        <Reveal>
          <span className="label block text-ember">
            <span className="text-fg/40">04 — </span>Contact
          </span>
        </Reveal>

        {/* The closing line — full display voice, one heading. */}
        <h2 className="mt-10 font-display text-[clamp(48px,9vw,132px)] font-light leading-[0.95] tracking-[-0.01em] text-heading">
          <TextReveal as="span" className="block">
            Let&rsquo;s build
          </TextReveal>
          <TextReveal as="span" className="block italic text-ember" delay={0.2}>
            something.
          </TextReveal>
        </h2>

        {/* Availability */}
        <Reveal delay={0.15}>
          <p className="mt-10 flex items-center gap-3 text-[15px] text-fg/60">
            <span
              aria-hidden="true"
              className="block h-2 w-2 animate-breathe rounded-full bg-red"
            />
            Open to new opportunities — Buffalo, NY
          </p>
        </Reveal>

        <ul className="mt-16">
          {contactLinks.map((link, i) => (
            <Reveal key={link.label} delay={i * 0.05}>
              <li>
                <a
                  href={link.href}
                  className="group grid grid-cols-[80px_1fr_auto] items-center gap-5 border-b border-hairline py-7 transition-[padding,border-color] duration-500 hover:border-hairline-strong hover:pl-4 sm:grid-cols-[160px_1fr_auto] sm:gap-9"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="label text-fg/45 transition-colors duration-300 group-hover:text-ember">
                    {link.label}
                  </span>
                  <span className="font-display text-[clamp(24px,3.4vw,44px)] font-light leading-none text-heading transition-colors duration-300 group-hover:text-red">
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
