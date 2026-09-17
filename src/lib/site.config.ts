export type NavItem = {
  label: string;
  href: string;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  x?: string;
  dribbble?: string;
  rss: string;
};

export type Availability = {
  status: "booking" | "limited" | "unavailable";
  label: string;
  href: string;
};

export type Metric = {
  value: number;
  suffix: string;
  label: string;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  domain: string;
  tagline: string;
  description: string;
  email: string;
  availability: Availability;
  nav: NavItem[];
  secondaryNav: NavItem[];
  socials: SocialLinks;
  metrics: Metric[];
  excludes: string[];
};

// Real identity (see decision-log.md D-038 — resolves A-001). `domain`/
// `email` are still a placeholder in the original A-002 pattern (renamed to
// match the new name, not owner-confirmed) — see notes-and-assumptions.md.
// Every piece of metadata, JSON-LD, the sitemap, RSS, and the footer derive
// from this file.
export const siteConfig = {
  name: "Sourov Mondol",
  // Casual/first-person contexts (e.g. the About page greeting) use this
  // instead of the full name.
  shortName: "Sourov",
  domain: "sourovmondol.studio",
  tagline: "Independent product designer & engineer.",
  description:
    "Sourov Mondol is an independent product designer and engineer who helps founders and teams design, build, and ship premium digital products.",
  email: "hello@sourovmondol.studio",
  availability: {
    status: "booking",
    label: "Booking Q4 2026",
    href: "/contact",
  },
  // Header/mobile nav — kept deliberately small (Phase 4 nav restructure,
  // decision-log.md D-036). The availability pill next to it is the CTA
  // ("Let's work together"); Contact and Services live one level down
  // rather than crowding the primary bar.
  nav: [
    { label: "Work", href: "/work" },
    { label: "Writing", href: "/writing" },
    { label: "About", href: "/about" },
  ],
  // Footer + command palette + the header "More" menu — everything
  // reachable, nothing crowding the primary bar. Speaking is deliberately
  // excluded (see data/talks.ts). Ideas/Life/Photography added D-038.
  secondaryNav: [
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "Now", href: "/now" },
    { label: "Ideas", href: "/ideas" },
    { label: "Life", href: "/life" },
    { label: "Photography", href: "/photography" },
    { label: "Lab", href: "/lab" },
    { label: "Topics", href: "/topics" },
    { label: "Uses", href: "/uses" },
    { label: "Resume", href: "/resume" },
    { label: "Colophon", href: "/colophon" },
    { label: "Bookmarks", href: "/bookmarks" },
  ],
  socials: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    x: "https://x.com/",
    dribbble: "https://dribbble.com/",
    rss: "/rss.xml",
  },
  metrics: [
    { value: 12, suffix: "+", label: "years shipping products" },
    { value: 40, suffix: "+", label: "projects launched" },
    { value: 98, suffix: "%", label: "client retention" },
  ],
  excludes: ["resume.pdf"],
} as const satisfies SiteConfig;
