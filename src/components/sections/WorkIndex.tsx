"use client";

import { useCallback, useState } from "react";
import { work, type WorkEntry } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { DetailModal } from "@/components/ui/DetailModal";

const TITLE_ID = "work-modal-title";

/**
 * The work-experience index — editorial rows in the same voice as the
 * project index: company reads big, role beneath it, a one-line summary
 * in small type. Clicking a row opens the full record (dates, location,
 * highlights) in the shared DetailModal.
 */
export function WorkIndex() {
  const [active, setActive] = useState<WorkEntry | null>(null);

  return (
    <>
      <div className="border-t border-hairline">
        {work.map((entry, i) => (
          <Reveal key={`${entry.company}-${i}`} delay={i * 0.06}>
            <WorkRow
              entry={entry}
              index={i}
              onOpen={() => setActive(entry)}
            />
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
            <span className="label block text-ember">Experience</span>
            <h2
              id={TITLE_ID}
              className="mt-3 pr-12 font-display text-[clamp(28px,4vw,48px)] font-light leading-[1.05] text-heading"
            >
              {active.company}
            </h2>
            <div className="mt-3 font-display text-[clamp(19px,2vw,26px)] font-normal leading-snug text-fg/90">
              {active.role}
            </div>

            {/* Tenure & location */}
            <dl className="mt-7 grid grid-cols-2 gap-x-8 border-t border-hairline sm:max-w-md">
              <div className="border-b border-hairline py-4">
                <dt className="label text-[10px] text-fg/40">Dates</dt>
                <dd className="mt-1.5 text-[15px] text-heading">
                  {active.dates}
                </dd>
              </div>
              <div className="border-b border-hairline py-4">
                <dt className="label text-[10px] text-fg/40">Details</dt>
                <dd className="mt-1.5 text-[15px] text-heading">
                  {active.meta ?? "—"}
                </dd>
              </div>
            </dl>

            <ul className="mt-7 flex max-w-prose flex-col gap-3">
              {active.highlights.map((point, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[20px_1fr] text-[16px] leading-relaxed text-fg/75"
                >
                  <span aria-hidden="true" className="text-red/70">
                    —
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </DetailModal>
    </>
  );
}

function WorkRow({
  entry,
  index,
  onOpen,
}: {
  entry: WorkEntry;
  index: number;
  onOpen: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");

  // Feed the cursor position to the CSS glow (custom props on the row).
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
    [],
  );

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerMove={onPointerMove}
      aria-haspopup="dialog"
      aria-label={`${entry.company}, ${entry.role} — view details`}
      className="glow-row group grid w-full grid-cols-[auto_1fr] items-start gap-x-6 border-b border-hairline py-9 text-left transition-colors duration-500 hover:border-hairline-strong sm:grid-cols-[64px_1fr_auto] sm:gap-x-10 sm:py-11"
    >
      {/* pt tuned so the numeral sits on the title's cap height */}
      <span className="label pt-2.5 text-fg/35 transition-colors duration-300 group-hover:text-ember sm:pt-3.5">
        {num}
      </span>

      <span className="block">
        <span className="block font-display text-[clamp(26px,4vw,54px)] font-light leading-[1.05] text-heading transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
          {entry.company}
        </span>
        <span className="mt-2.5 block font-display text-[clamp(17px,1.8vw,23px)] font-normal leading-snug text-fg/85">
          {entry.role}
        </span>
        <span className="mt-2.5 block max-w-prose text-[14px] leading-relaxed text-fg/55">
          {entry.summary}
        </span>
      </span>

      {/* Dates + arrow column */}
      <span className="col-start-2 mt-5 flex items-center gap-4 self-start sm:col-start-3 sm:mt-1.5 sm:flex-col sm:items-end sm:gap-5">
        <span className="label whitespace-nowrap text-fg/40">
          {entry.dates}
        </span>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-fg/60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-red group-hover:bg-red group-hover:text-heading"
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
      </span>
    </button>
  );
}
