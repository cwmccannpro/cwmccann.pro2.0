/**
 * CONTACT LINKS
 * -------------
 * `href` is the real URL/scheme; `display` is what the visitor sees.
 * Edit/add entries here to change the contact block.
 */

export type ContactLink = {
  label: string;
  href: string;
  display: string;
  /** Set true for external links (opens in a new tab with rel=noopener). */
  external?: boolean;
};

export const contactLinks: ContactLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cwmccannpro/",
    display: "/in/cwmccannpro",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:cwm@cwmccann.pro",
    display: "cwm@cwmccann.pro",
  },
  {
    label: "Phone",
    href: "tel:+13153981228",
    display: "(315) 398-1228",
  },
  {
    label: "GitHub",
    href: "https://github.com/cwmccannpro",
    display: "@cwmccannpro",
    external: true,
  },
];
