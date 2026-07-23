/**
 * PROJECTS
 * --------
 * Each project renders as a button; clicking it opens a modal with the
 * `description`, `highlights`, and `screenshots`. To add a project, append
 * one object below. Only `title` and `blurb` are required; the rest optional.
 *
 *   {
 *     title: "Project name",
 *     blurb: "One-line description.",              // shown on the button
 *     description: "Longer paragraph for the modal.",
 *     highlights: ["Key capability one.", "Key capability two."], // modal bullets
 *     screenshots: ["/projects/foo-1.png"],         // files live in /public
 *     link: "https://...",                          // optional "Visit" link
 *     tags: ["Next.js", "AI"],                      // optional (stack / themes)
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
  /** Bullet list of standout capabilities, shown in the modal. */
  highlights?: string[];
  /** Image paths (in /public) shown as a gallery in the modal. */
  screenshots?: string[];
  /** Optional external/internal URL — rendered as a "Visit" link in the modal. */
  link?: string;
  /** Optional short tags (stack / themes). */
  tags?: string[];
  /** Optional year shown in the meta line. */
  year?: string;
};

export const projects: Project[] = [
  {
    title: "Viridian",
    blurb: "Software and automation for service businesses.",
    description:
      "Viridian is a software studio building practical tools for small service businesses. Its flagship is an evidence-driven lead-intelligence and CRM platform that surfaces local businesses with observable revenue leakage — recent formation, a weak web presence, unanswered-call complaints, low review velocity, or dated technology — and fuses those independent signals into a single, transparent priority score. From there it runs the full loop: discovery, enrichment, explainable scoring, operator review, and researched outreach.",
    highlights: [
      "Signal-based lead scoring that combines independent public signals into one explainable priority score — no black box.",
      "A complete evidence-to-action loop: discovery → enrichment → scoring → operator review → CRM → outreach → outcome feedback.",
      "An automated outreach engine with per-vertical pitches (websites, reviews, AI receptionist).",
      "Marketing site built on TanStack Start and Radix UI, deployed on Cloudflare.",
    ],
    tags: ["TanStack Start", "React", "Cloudflare", "CRM & Automation"],
    year: "2025",
    link: "https://viridian.cwmccann.pro",
    // TODO: replace these placeholders with real screenshots (drop files in public/projects/)
    screenshots: ["/projects/viridian-1.svg", "/projects/viridian-2.svg"],
  },
  {
    title: "Ctrlpanel",
    blurb: "A personal, AI-powered Life OS and control center.",
    description:
      "Ctrlpanel is a multi-user personal “Life OS” — tasks, projects, CRM, calendar, health, finances, and habits behind a single dark, glass-morphism dashboard, with an AI “Master Controller” that reads and writes your own data by voice or chat. Every user registers their own account and gets a fully isolated workspace protected by Postgres row-level security.",
    highlights: [
      "Master Controller — a streaming Claude chat with real read/write tools over your data (create tasks and events, log expenses, query anything), plus voice input.",
      "A customizable widget board: drag to rearrange, corner-drag to resize, from a 15-widget registry — layout saved per user.",
      "Two-way Google Calendar sync across all of your calendars, with a local calendar fallback.",
      "Projects with an embedded Excalidraw canvas, Kanban, and notes; custom-column CRM and to-do boards; health, finance, and an investing portfolio with live prices.",
      "Per-user isolation via Supabase Postgres row-level security, deployed on a Cloudflare Worker.",
    ],
    tags: ["React", "Supabase", "Cloudflare Workers", "Claude AI"],
    year: "2025",
    link: "https://ctrlpanel.cwmccann.pro",
    // TODO: replace these placeholders with real screenshots (drop files in public/projects/)
    screenshots: ["/projects/ctrlpanel-1.svg", "/projects/ctrlpanel-2.svg"],
  },
  {
    title: "Content Engine",
    blurb: "End-to-end short-form video automation.",
    description:
      "Content Engine is a pipeline that turns a single idea into a finished, illustrated, narrated video with burned-in captions. It originates a high-performing topic from a channel’s strategy, pressure-tests the hook against a virality optimizer, and writes the script — then automatically produces the voiceover, word-level captions, per-scene artwork, and a Ken Burns assembly. The result is a faceless channel that can publish consistently without the manual grind.",
    highlights: [
      "Idea-first workflow that originates and pressure-tests an original topic and hook before a word is written (adapting a source video is opt-in).",
      "A fully automated media pipeline: script → ElevenLabs TTS → word-level transcription → scene alignment → captions → per-scene AI images → assembled MP4 with outro.",
      "A reusable channel template — copy the folder, drop in a voice and art style, and spin up a new channel.",
      "A virality optimizer and feedback loop that learn from each upload’s performance.",
    ],
    tags: ["Python", "ElevenLabs", "Gemini", "FFmpeg"],
    year: "2025",
    // TODO: add screenshots (drop files in public/projects/ and list them here)
    // screenshots: ["/projects/content-engine-1.png"],
    // link: "https://...",
  },
  // 👇 Add more projects here — just copy the shape above.
];
