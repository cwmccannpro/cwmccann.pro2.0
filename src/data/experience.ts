/**
 * WORK EXPERIENCE & EDUCATION
 * ---------------------------
 * Add/remove objects to add/remove timeline rows. Entries render top-to-bottom
 * in array order (most recent first).
 */

export type WorkEntry = {
  role: string;
  company: string;
  /** e.g. "Jan 2026 — Present" */
  dates: string;
  /** Optional secondary line, e.g. "Full-time · Buffalo, NY · On-site" */
  meta?: string;
  /** Bullet-point accomplishments. */
  highlights: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  /** e.g. "2018 — 2022" */
  dates: string;
};

export type CertificationEntry = {
  name: string;
  /** Issuing organization (omit for self-study / pending exams). */
  issuer?: string;
  /** e.g. "Issued Feb 2026" or "Pending". */
  status?: string;
  /** Optional credential / certificate id. */
  credentialId?: string;
};

export const work: WorkEntry[] = [
  {
    role: "IT Analyst",
    company: "Roswell Park Comprehensive Cancer Center",
    dates: "Jan 2026 — Present",
    meta: "Full-time · Buffalo, NY · On-site",
    highlights: [
      "Build Power BI reports and dashboards that turn service and operational data into actionable insight on performance.",
      "Support Epic EHR workflows, clinical applications, and access management across Active Directory and Microsoft Entra ID in a healthcare environment.",
    ],
  },
  {
    role: "Senior Information Technology Technician",
    company: "University at Buffalo",
    dates: "Sep 2022 — Dec 2025",
    meta: "Part-time · Buffalo, NY · On-site",
    highlights: [
      "Trained consultants and authored detailed process documentation, standardizing how the team delivered support.",
      "Served as an L2 escalation point across the Remedyforce and TDX ticketing systems, resolving hardware, software, and network issues for students and faculty.",
    ],
  },
  {
    role: "Venue IT Support",
    company: "Live Nation Entertainment",
    dates: "Apr 2025 — Nov 2025",
    meta: "Part-time · Corfu, NY · On-site",
    highlights: [
      "Provided on-site IT leadership during live events, documenting and resolving technical issues to keep operations running.",
      "Supported event IT infrastructure end to end — switches, access points, POS systems, and Videri digital signage — coordinating rapid configuration changes with remote teams.",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    degree: "Computational & Applied Mathematics, Computer Science Minor",
    school: "University at Buffalo",
    dates: "Sep 2021 — Dec 2025",
  },
];

export const certifications: CertificationEntry[] = [
  {
    name: "Actuary Financial Mathematics Exam",
    issuer: "Society of Actuaries",
    status: "Pending",
  },
  {
    name: "Theory of Credit Risk Models",
    issuer: "Udemy",
    status: "Pending",
  },
  {
    name: "ITIL 4 Foundations",
    issuer: "Udemy",
    status: "Issued Feb 2026",
    credentialId: "UC-6f7df76a-2355-44c2-b0b0-1cc262735144",
  },
  {
    name: "Lean Six Sigma White Belt Certification",
    issuer: "Aveta Business Institute",
    status: "Issued Apr 2025",
    credentialId: "djM5NDQ0NC0yOTg",
  },
];
