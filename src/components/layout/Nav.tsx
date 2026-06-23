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

  useEffect(() => {
    // Reveal a touch earlier when the cinematic transition is disabled.
    // 0.9 brings the corner logo in just as the hero monogram finishes
    // fading (~90% of the 100vh scrub), so the mark hands off to the corner.
    const threshold = () => window.innerHeight * (reduced ? 0.5 : 0.9);

    let ticking = false;
    const update = () => {
      setVisible(window.scrollY > threshold());
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
          "linear-gradient(180deg, #0A0A0A 30%, rgba(10,10,10,0))",
      }}
      // Hide from the a11y tree (and tab order) until it's actually shown.
      aria-hidden={!visible}
    >
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
                className="label text-[10px] text-nav-link/55 transition-colors hover:text-red sm:text-[11px]"
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
