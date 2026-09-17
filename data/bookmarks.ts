export type Bookmark = {
  title: string;
  url: string;
  description: string;
  category: "Security" | "Engineering" | "Design" | "AI" | "Research" | "Writing" | "Tools";
  dateAdded: string; // ISO
  /** Sample content standing in for a real, personally-vetted bookmark.
   * Rendered with a visible "Sample" tag; see decision-log.md D-037. */
  demo?: boolean;
};

// A couple of sample entries (demo: true) stand in while this section is
// still empty of real, personally-curated links — see decision-log.md
// D-037. Add real entries above/alongside them as they become real; each
// demo entry is clearly tagged in the UI, never presented as a real
// recommendation.
export const bookmarks: Bookmark[] = [
  {
    title: "web.dev — Learn (Google)",
    url: "https://web.dev/learn",
    description: "A solid, current reference for web performance and modern CSS/JS fundamentals.",
    category: "Engineering",
    dateAdded: "2026-01-01",
    demo: true,
  },
  {
    title: "A11y Project checklist",
    url: "https://www.a11yproject.com/checklist/",
    description: "The checklist I use as a baseline sanity check before shipping anything client-facing.",
    category: "Design",
    dateAdded: "2026-01-01",
    demo: true,
  },
];
