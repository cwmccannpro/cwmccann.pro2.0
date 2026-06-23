/**
 * CWM MONOGRAM
 * ============
 * This is the mark supplied from Claude Design (ported verbatim from the
 * design export): engraved Cormorant Garamond "C W M", white fill with a
 * signal-red keyline on the central W and a soft red bloom behind.
 *
 * ── TO SWAP IN A DIFFERENT SVG ───────────────────────────────────────
 * Replace ONLY the contents of <svg>…</svg> below with your exported
 * artwork. Keep:
 *   • the <svg> viewBox proportions (or update consumers if you change it)
 *   • the `id`-suffixed filter ids (so multiple instances don't collide)
 *   • the component's props/signature
 * Everything else (hero scaling, corner docking) will keep working.
 * ─────────────────────────────────────────────────────────────────────
 */

type MonogramProps = {
  /** Unique suffix so SVG filter ids don't collide between instances. */
  id?: string;
  /** Show the soft red bloom behind the letters (hero) vs. flat (corner). */
  glow?: boolean;
  className?: string;
  /** Accessible label. */
  title?: string;
};

export function Monogram({
  id = "mono",
  glow = true,
  className,
  title = "CWM monogram",
}: MonogramProps) {
  const bloomId = `bloom-${id}`;
  const engraveId = `engrave-${id}`;

  return (
    <svg
      viewBox="0 0 1000 600"
      width="100%"
      height="100%"
      role="img"
      aria-label={title}
      className={className}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <filter id={bloomId} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
        <filter id={engraveId} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.6"
          />
          <feDropShadow
            dx="0"
            dy="-1"
            stdDeviation="0.5"
            floodColor="#ffffff"
            floodOpacity="0.16"
          />
        </filter>
      </defs>

      {/* Soft red bloom behind the letters */}
      {glow && (
        <text
          x="500"
          y="392"
          textAnchor="middle"
          filter={`url(#${bloomId})`}
          opacity="0.4"
          fill="#E10600"
          fontFamily="var(--font-display), 'Cormorant Garamond', serif"
          fontWeight="600"
          fontSize="300"
          letterSpacing="6"
        >
          <tspan>C</tspan>
          <tspan>W</tspan>
          <tspan>M</tspan>
        </text>
      )}

      {/* Engraved serif letters; signal-red keyline on the central W */}
      <text
        x="500"
        y="392"
        textAnchor="middle"
        filter={`url(#${engraveId})`}
        fontFamily="var(--font-display), 'Cormorant Garamond', serif"
        fontWeight="600"
        fontSize="300"
        letterSpacing="6"
        paintOrder="stroke fill"
      >
        <tspan fill="#F5F5F2">C</tspan>
        <tspan fill="#F5F5F2" stroke="#E10600" strokeWidth="4">
          W
        </tspan>
        <tspan fill="#F5F5F2">M</tspan>
      </text>
    </svg>
  );
}
