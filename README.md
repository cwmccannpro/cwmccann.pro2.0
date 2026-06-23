# CWM — Cinematic Portfolio

A personal portfolio that opens as a dramatic, dark **title card** and resolves
into a clean, well-lit portfolio as you scroll.

Black & white with a single signal-red accent. Layered parallax, soft fog,
animated film grain, deep vignette — restrained and elegant, not busy.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** — styling & design tokens
- **Framer Motion** — component reveal animation
- **GSAP + ScrollTrigger** — scroll-driven hero transition
- **Lenis** — smooth scrolling
- Deploy-ready for **Vercel**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build & run production:

```bash
npm run build
npm start
```

## Deploy to Vercel

Push to a Git repo and import it at [vercel.com/new](https://vercel.com/new).
Zero config — Vercel detects Next.js automatically. No environment variables
are required.

## Editing content (no component-diving required)

All content lives in `src/data/` — edit these, not the components:

| File                     | What it controls                                            |
| ------------------------ | ----------------------------------------------------------- |
| `src/data/site.ts`       | **Full name** (placeholder), tagline, "Who Am I" copy + skills, nav labels, SEO metadata |
| `src/data/projects.ts`   | Projects grid — **add a project = add one object**          |
| `src/data/experience.ts` | Work & education timeline (**placeholder entries — replace with your real history**) |
| `src/data/contact.ts`    | Contact links (LinkedIn, Email, Phone, GitHub)              |

### Add a project

Append one object to the `projects` array in `src/data/projects.ts`:

```ts
{
  title: "New Project",
  blurb: "One-line description.",
  link: "https://example.com",   // optional — makes the card a link
  image: "/projects/shot.jpg",   // optional — put the file in /public
  tags: ["Next.js", "AI"],       // optional
  year: "2025",                  // optional
}
```

> Using a **remote** image URL? Whitelist its host in `next.config.mjs`
> under `images.remotePatterns` so `next/image` can optimize it.
> Local images in `/public` need no config.

### A few things flagged for you

- **Full name** — `site.fullName` in `src/data/site.ts` is a placeholder
  (`Cameron W. McCann`), consistent with the **CWM** monogram. Swap in your
  real name. The monogram itself stays "CWM".
- **Work / Education** — the entries in `src/data/experience.ts` are clearly
  labeled placeholders. Replace them with your real info from
  <https://www.linkedin.com/in/cwmccannpro/>.
- **Monogram SVG** — `src/components/hero/Monogram.tsx` holds the CWM mark
  from Claude Design. To swap in different artwork, replace only the contents
  of the `<svg>` (instructions are in the file).

## How the cinematic transition works

`src/components/hero/Hero.tsx` renders a tall (300vh) track with a sticky
100vh stage. A scrubbed GSAP **ScrollTrigger** timeline drives the resolve:
grain fades down, fog parts and clears, the haze drifts, the hero text lifts
away, and the monogram shrinks + docks toward the top-left — where the fixed
nav logo (`src/components/layout/Nav.tsx`) takes over.

- **Lenis** smooth scroll is wired to GSAP's ticker in
  `src/components/providers/SmoothScrollProvider.tsx`.
- **Accessibility / reduced motion** — with `prefers-reduced-motion: reduce`,
  the heavy parallax, grain animation, smooth scroll, and pinned transition
  are all disabled; the track collapses to a single readable viewport and the
  site stays fully navigable.
- **Touch / mobile** — mouse-parallax drift is skipped on coarse pointers and
  the layout simplifies responsively.

## Project structure

```
src/
  app/
    layout.tsx          # fonts, metadata, providers, skip link
    page.tsx            # composes the page
    globals.css         # design tokens, grain, reduced-motion rules
  components/
    hero/               # Hero (scroll transition) + Monogram
    layout/             # Nav (docking logo) + Footer
    providers/          # Lenis smooth-scroll provider
    sections/           # WhoAmI, Projects, Experience, Contact
    ui/                 # Reveal, SectionHeading
  data/                 # ← editable content lives here
  hooks/                # reduced-motion, mouse-parallax
  lib/                  # gsap registration
```

## Design tokens

Defined in **both** `src/app/globals.css` (CSS variables) and
`tailwind.config.ts` (Tailwind theme) — keep them in sync.

| Token       | Value     | Use                  |
| ----------- | --------- | -------------------- |
| `bg`        | `#0A0A0A` | near-black base      |
| `bg-deep`   | `#050505` | deepest layer        |
| `fg`        | `#F5F5F2` | off-white text       |
| `red`       | `#E10600` | signal red (accent)  |
| `red-deep`  | `#B8000B` | deep red (fills)     |
