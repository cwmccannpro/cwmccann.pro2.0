"use client";

import { useEffect, useState } from "react";
import { Monogram } from "@/components/hero/Monogram";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { site } from "@/data/site";

/**
 * Footer — the closing slate. Monogram at left, live local time at center
 * (a small "the lights are on" signal), magnetic back-to-top at right.
 */
export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(0);
  };

  return (
    <footer className="border-t border-hairline bg-bg-deep px-6 py-10 sm:px-12">
      <div className="mx-auto flex max-w-container flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span className="block h-[30px] w-11">
            <Monogram id="footer" glow={false} title={`${site.monogram} monogram`} />
          </span>
          <span className="label text-fg/35">
            © {year} — {site.fullName}
          </span>
        </div>

        <LocalTime />

        <Magnetic strength={0.35}>
          <a
            href="#top"
            onClick={toTop}
            className="label inline-flex items-center gap-3 rounded-full border border-hairline px-5 py-3 text-fg/60 transition-colors duration-300 hover:border-red hover:text-heading"
          >
            Back to top
            <span aria-hidden="true" className="text-red">
              ↑
            </span>
          </a>
        </Magnetic>
      </div>
    </footer>
  );
}

/** Live HH:MM:SS in the visitor-facing home timezone (Eastern). */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/New_York",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Renders empty until mounted, so SSR and client HTML always match.
  return (
    <span className="label tabular-nums text-fg/35">
      {time ? `Buffalo, NY — ${time} EST` : " "}
    </span>
  );
}
