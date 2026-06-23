/**
 * PROJECTS
 * --------
 * Each project renders as a button; clicking it opens a modal with the
 * `description` and `screenshots`. To add a project, append one object below.
 * Only `title` and `blurb` are required; everything else is optional.
 *
 *   {
 *     title: "Project name",
 *     blurb: "One-line description.",              // shown on the button
 *     description: "Longer paragraph for the modal.",
 *     screenshots: ["/projects/foo-1.png"],         // files live in /public
 *     link: "https://...",                          // optional "Visit" link
 *     tags: ["Next.js", "AI"],                      // optional
 *     year: "2025",                                 // optional
 *   }
 *
 * SCREENSHOTS: drop image files in `public/projects/` and reference them by
 * path (e.g. "/projects/viridian-1.png"). The ones below are clearly-labeled
 * placeholders — replace them with real screenshots.
 */

export type Project = {
  /** Project name (shown large). */
  title: string;
  /** One-line description shown on the button face. */
  blurb: string;
  /** Longer description shown in the modal. Falls back to `blurb`. */
  description?: string;
  /** Image paths (in /public) shown as a gallery in the modal. */
  screenshots?: string[];
  /** Optional external/internal URL — rendered as a "Visit" link in the modal. */
  link?: string;
  /** Optional short tags. */
  tags?: string[];
  /** Optional year shown in the meta line. */
  year?: string;
};

export const projects: Project[] = [
  {
    title: "Viridian",
    blurb: "Solutions for service businesses.",
    description:
      "Viridian builds practical software solutions for service businesses — tooling and automation that streamline the day-to-day operations they rely on.",
    // TODO: replace these placeholders with real screenshots (drop files in public/projects/)
    screenshots: ["/projects/viridian-1.svg", "/projects/viridian-2.svg"],
    // link: "https://...",
    // tags: ["Automation", "Web"],
  },
  {
    title: "Ctrlpanel",
    blurb: "My personal AI-powered dashboard and control center.",
    description:
      "Ctrlpanel is a personal, AI-powered dashboard that brings my tools, data, and workflows into a single control center.",
    // TODO: replace these placeholders with real screenshots (drop files in public/projects/)
    screenshots: ["/projects/ctrlpanel-1.svg", "/projects/ctrlpanel-2.svg"],
    // link: "https://...",
    // tags: ["AI", "Dashboard"],
  },
  // 👇 Add more projects here — just copy the shape above.
];
