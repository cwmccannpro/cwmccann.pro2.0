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
        bg: "#0A0A0A", // near-black base
        "bg-deep": "#050505", // deepest layer
        fg: "#DCD2C6", // warm parchment — base body/prose text temperature
        heading: "#EEE4D7", // warm off-white — display headings (a tier brighter than prose)
        ember: "#D23723", // warm ember red — atmospheric mono labels (not a UI-alert red)
        "nav-link": "#E1D7C8", // warm nav-link tone, lit by the same source as the ink
        red: "#E10600", // signal red — structural accent (borders, hairlines, shadows, hovers)
        "red-deep": "#B8000B", // deep red — fills
      },
      fontFamily: {
        // Wired up via next/font in app/layout.tsx
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
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
