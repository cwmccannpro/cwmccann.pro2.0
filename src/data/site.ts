/**
 * Global site content & metadata.
 * Edit these values to update the hero, nav labels, and <head> SEO.
 */

export const site = {
  /**
   * TODO: replace with your real full name.
   * Placeholder consistent with the CWM monogram (initials C·W·M) and
   * the cwmccann.pro domain. The monogram itself is locked to "CWM".
   */
  fullName: "Cameron W. McCann",

  /** Initials shown in the monogram mark. */
  monogram: "CWM",

  /**
   * Short role / tagline under the name on the title card.
   * Summarized from your bio — edit freely.
   */
  tagline: "Automation · Data · IT Systems",

  /** Eyebrow label on the title card. */
  heroLabel: "Portfolio — Vol. 01",

  /** SEO metadata. */
  meta: {
    title: "Cameron W. McCann — Portfolio",
    description:
      "Automation, data analysis, dashboards, and IT systems. Python, SQL, Power BI, and workflow automation.",
    /** Used for canonical/OG urls. Update to your deployed domain. */
    url: "https://cwmccann.pro",
  },
} as const;

/**
 * "Who Am I" section content. Body copy is used verbatim.
 */
export const about = {
  heading: "Who Am I",
  body:
    "Highly motivated professional with a foundation in mathematics through education, computer science through continued study, and information technology through hands-on professional experience. I am interested in technology, business, finance, and building practical solutions that improve how people and organizations operate.",
  /**
   * Small pill tags under the bio. Empty = hidden (the list only renders
   * when this has entries — see WhoAmI.tsx). To bring them back, re-add, e.g.:
   *   skills: ["Python", "SQL", "Power BI", "Workflow Automation"],
   */
  skills: [] as string[],
} as const;

/**
 * Top-nav links. `id` must match the `id` on the corresponding <section>.
 * Add/remove entries here to change the nav.
 */
export const navLinks: { label: string; id: string }[] = [
  { label: "About", id: "who" },
  { label: "Work", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];
