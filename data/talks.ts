export type Talk = {
  title: string;
  event: string;
  date: string; // ISO
  type: "talk" | "podcast" | "workshop" | "panel" | "interview";
  url?: string;
};

// Empty by design — see decision-log.md D-036. No real talks, podcasts, or
// appearances exist yet. This file is the single place to add one when
// there is a real event to list; the /speaking page reads from here and
// renders an honest empty state while this stays empty. Do not add
// placeholder or invented entries.
export const talks: Talk[] = [];
