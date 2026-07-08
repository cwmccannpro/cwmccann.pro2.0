"use client";

import { useCallback, useState } from "react";
import { education, type EducationEntry } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { DetailModal } from "@/components/ui/DetailModal";

const TITLE_ID = "education-modal-title";

/**
 * The education index — same clickable-row voice as the work index. The row
 * reads as a ledger line (dates · degree · school); clicking it opens the
 * full record with every relevant course taken, in the shared DetailModal.
 */
export function EducationIndex() {
  const [active, setActive] = useState<EducationEntry | null>(null);

  return (
    <>
      <div className="border-t border-hairline">
        {education.map((entry, i) => (
          <Reveal key={`${entry.school}-${i}`} delay={i * 0.06}>
            <EducationRow entry={entry} onOpen={() => setActive(entry)} />
          </Reveal>
        ))}
      </div>

      <DetailModal
        open={active !== null}
        onClose={() => setActive(null)}
        labelledBy={TITLE_ID}
      >
        {active && (
          <>
            <span className="label block text-ember">Education</span>
            <h2
              id={TITLE_ID}
              className="mt-3 pr-12 font-display text-[clamp(24px,3.4vw,40px)] font-light leading-[1.1] text-heading"
            >
              {active.degree}
            </h2>
            <div className="mt-3 font-display text-[clamp(18px,1.9vw,24px)] font-normal leading-snug text-fg/90">
              {active.school}
            </div>
            <div className="label mt-3 text-fg/45">{active.dates}</div>

            {active.courses && active.courses.length > 0 && (
              <div className="mt-8 border-t border-hairline pt-7">
                <h3 className="label text-[10px] text-fg/40">
                  Relevant coursework
                </h3>
                <ul className="mt-4 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
                  {active.courses.map((course) => {
                    const [code, ...rest] = course.split("—");
                    const title = rest.join("—").trim();
                    return (
                      <li
                        key={course}
                        className="flex gap-3 text-[14px] leading-snug"
                      >
                        <span className="whitespace-nowrap font-mono text-[12px] text-ember/80">
                          {code.trim()}
                        </span>
                        <span className="text-fg/70">{title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </DetailModal>
    </>
  );
}

function EducationRow({
  entry,
  onOpen,
}: {
  entry: EducationEntry;
  onOpen: () => void;
}) {
  // Feed the cursor position to the CSS glow (custom props on the row).
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
    [],
  );

  const courseCount = entry.courses?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerMove={onPointerMove}
      aria-haspopup="dialog"
      aria-label={`${entry.degree}, ${entry.school} — view coursework`}
      className="glow-row group grid w-full grid-cols-[1fr_auto] items-start gap-x-6 border-b border-hairline py-9 text-left transition-colors duration-500 hover:border-hairline-strong md:grid-cols-[220px_1fr_auto] md:gap-x-10"
    >
      <span className="label col-span-2 pt-1 text-fg/45 md:col-span-1">
        {entry.dates}
      </span>

      <span className="block">
        <span className="block font-display text-[clamp(24px,2.8vw,38px)] font-light leading-tight text-heading transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
          {entry.degree}
        </span>
        <span className="label mt-2 block text-ember">{entry.school}</span>
        {courseCount > 0 && (
          <span className="mt-2.5 block text-[14px] leading-relaxed text-fg/55">
            {courseCount} relevant courses — view coursework
          </span>
        )}
      </span>

      {/* Arrow — mirrors the work-index affordance */}
      <span
        aria-hidden="true"
        className="mt-1.5 flex h-11 w-11 shrink-0 items-center justify-center self-start justify-self-end rounded-full border border-hairline text-fg/60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-red group-hover:bg-red group-hover:text-heading"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 12L12 2M12 2H4M12 2v8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
