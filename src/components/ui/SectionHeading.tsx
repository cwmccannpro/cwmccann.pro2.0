import { Reveal } from "./Reveal";

/**
 * Shared section header — the editorial index system.
 *
 * A mono eyebrow and optional display title, divided by the signature red
 * hairline. `index` ("01"…) prefixes the eyebrow, threading a filmic
 * chapter rhythm through the whole page.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  meta,
}: {
  /** Chapter number, e.g. "01". */
  index?: string;
  eyebrow: string;
  title?: string;
  meta?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-end justify-between gap-6 border-b border-red pb-4">
        <div>
          <span className="label block text-ember">
            {index && <span className="text-fg/40">{index} — </span>}
            {eyebrow}
          </span>
          {title && (
            <h2 className="mt-3 font-display text-[clamp(34px,4.4vw,56px)] font-light leading-none text-heading">
              {title}
            </h2>
          )}
        </div>
        {meta && (
          <span className="label whitespace-nowrap text-fg/45">{meta}</span>
        )}
      </div>
    </Reveal>
  );
}
