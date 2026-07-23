"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { Children, Fragment, isValidElement } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * TextReveal — masked word-by-word heading reveal.
 *
 * Splits plain-string children into words; each word slides up from behind
 * an overflow mask with a stagger, like a film title resolving. Non-string
 * children (e.g. an <em> for an italic accent word) are treated as a single
 * unit so rich display headings still work:
 *
 *   <TextReveal as="h2">Who am <em>I</em></TextReveal>
 *
 * Honors prefers-reduced-motion by rendering static text.
 */
export function TextReveal({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.055,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between successive words. */
  stagger?: number;
  once?: boolean;
}) {
  // SSR-safe (false on the server and first client paint) so the markup
  // hydrates identically, then settles to the visitor's real preference.
  const reduced = usePrefersReducedMotion();

  // Flatten children into an ordered list of "units": plain words split
  // from strings, plus any React elements kept whole.
  const units: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      for (const word of String(child).split(/\s+/).filter(Boolean)) {
        units.push(word);
      }
    } else if (isValidElement(child) || child != null) {
      units.push(child);
    }
  });

  if (reduced) {
    return (
      <Tag className={className}>
        {units.map((u, i) => (
          <Fragment key={i}>
            {u}
            {i < units.length - 1 ? " " : null}
          </Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {units.map((unit, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once, margin: "0px 0px -10% 0px" }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * stagger,
              }}
            >
              {unit}
            </motion.span>
          </span>
          {/* Real space between masks so text wraps & copies naturally. */}
          {i < units.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
