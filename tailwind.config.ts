import type { Config } from "tailwindcss";

/**
 * Design system tokens live here AND as CSS variables in globals.css.
 * Keep them in sync. Colors are intentionally restrained:
 * black & white with a single signal-red accent.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0908", // near-black base, warmed a hair
        "bg-deep": "#050404", // deepest layer
        "bg-raised": "#131009", // raised panels / hover washes
        fg: "#D8CEC2", // warm parchment — base body/prose text temperature
        heading: "#F0E7DA", // warm off-white — display headings (a tier brighter than prose)
        ember: "#D23723", // warm ember red — atmospheric mono labels (not a UI-alert red)
        "nav-link": "#E1D7C8", // warm nav-link tone, lit by the same source as the ink
        red: "#E10600", // signal red — structural accent (borders, hairlines, shadows, hovers)
        "red-deep": "#B8000B", // deep red — fills
        hairline: "rgba(216,206,194,0.14)", // standard rule
        "hairline-strong": "rgba(216,206,194,0.28)",
      },
      fontFamily: {
        // Wired up via next/font in app/layout.tsx
        display: ["var(--font-display)", "Fraunces", "serif"],
        body: ["var(--font-body)", "Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        label: "0.26em",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        // Subtle vertical pulse for the scroll cue line
        bob: {
          "0%,100%": { transform: "scaleY(1)", opacity: "0.55", transformOrigin: "top" },
          "50%": { transform: "scaleY(0.5)", opacity: "1", transformOrigin: "top" },
        },
        // Slow breathing for the red status dot
        breathe: {
          "0%,100%": { opacity: "0.45" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        bob: "bob 2.2s ease-in-out infinite",
        breathe: "breathe 3.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
