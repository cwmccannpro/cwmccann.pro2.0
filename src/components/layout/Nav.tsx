"use client";

import { useEffect, useState } from "react";
import { Monogram } from "@/components/hero/Monogram";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { navLinks, site } from "@/data/site";

/** Height reserved for the fixed nav; used as scroll offset for anchors. */
const NAV_OFFSET = -84;

/**
 * Fixed top navigation. Hidden over the title card, then fades in as the
 * hero resolves — the small corner logo is where the big monogram "docks".
 * Visibility is driven by a plain scroll listener so it works identically
 * with or without the GSAP transition (incl. reduced-motion users).
 */
export function Nav() {
  const { scrollTo } = useSmoothScroll();
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reveal as the title card resolves. The hero scrub completes at 50vh
    // of scroll (150vh track − 100vh stage), so the nav arrives just as the
    // smoke finishes its handoff into Who Am I.
    const threshold = () => window.innerHeight * 0.5;

    let ticking = false;
    const update = () => {
      setVisible(window.scrollY > threshold());
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollTo(`#${id}`, { offset: NAV_OFFSET });
  };

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(0);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-red/45 px-6 py-4 transition-[opacity,transform] duration-500 ease-out sm:px-12 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
      style={{
        background:
          "linear-gradient(180deg, #0A0908 30%, rgba(10,9,8,0))",
      }}
      // Hide from the a11y tree (and tab order) until it's actually shown.
      aria-hidden={!visible}
    >
      {/* Reading-progress hairline — rides the top edge of the frame. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-red will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
      {/* Corner logo → back to top */}
      <a
        href="#top"
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className="block h-[34px] w-12 transition-opacity hover:opacity-70"
      >
        <Monogram id="nav" glow={false} title={`${site.monogram} — home`} />
      </a>

      <nav aria-label="Primary">
        <ul className="flex gap-5 sm:gap-9">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                tabIndex={visible ? 0 : -1}
                className="label link-draw pb-1 text-[10px] text-nav-link/55 transition-colors hover:text-red sm:text-[11px]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
