export type Photo = {
  /** Path under /public or a fully-qualified https URL. */
  src: string;
  /** Required, meaningful alt text — never decorative-empty for a gallery
   * whose entire point is the image. */
  alt: string;
  caption?: string;
  location?: string;
  takenOn?: string; // ISO date
  tags?: string[];
  /** Shown larger / first in the grid. */
  featured?: boolean;
};

// Empty by design — see decision-log.md D-038. No real photographs exist
// yet. This file is the single place to add one when there's a real image
// to show; the /photography page reads from here and renders an honest
// empty state while this stays empty. Do not add placeholder or stock
// images — see notes-and-assumptions.md for the trigger to revisit.
export const photos: Photo[] = [];
