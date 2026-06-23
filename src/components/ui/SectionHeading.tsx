import { Reveal } from "./Reveal";

/**
 * Shared section header: a mono eyebrow + optional display title on the
 * left, optional meta on the right, divided by the signature red hairline.
 */
export function SectionHeading({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title?: string;
  meta?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-end justify-between gap-6 border-b border-red pb-4">
        <div>
          <span className="label block text-ember">{eyebrow}</span>
          {title && (
            <h2 className="mt-3 font-display text-[clamp(34px,4.4vw,56px)] font-medium leading-none text-heading">
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
