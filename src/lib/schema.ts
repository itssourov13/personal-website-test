import { z } from "zod";

export const outcomeSchema = z.object({
  label: z.string(),
  value: z.string(),
  suffix: z.string().optional().default(""),
  delta: z.string().optional(),
});

export const workFrontmatterSchema = z.object({
  title: z.string(),
  client: z.string().optional(),
  year: z.number().int(),
  role: z.string(),
  timeline: z.string(),
  stack: z.array(z.string()).default([]),
  discipline: z.array(z.string()).default([]),
  industry: z.array(z.string()).default([]),
  summary: z.string().max(160),
  outcomes: z.array(outcomeSchema).default([]),
  cover: z.string().nullable().default(null),
  featured: z.boolean().default(false),
  published: z.string(),
  draft: z.boolean().default(false),
  testimonial: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;
export type Work = WorkFrontmatter & { slug: string; body: string };

export const noteFrontmatterSchema = z.object({
  title: z.string(),
  published: z.string(),
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  summary: z.string().max(160),
  draft: z.boolean().default(false),
  series: z.string().optional(),
});

export type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>;
export type Note = NoteFrontmatter & {
  slug: string;
  body: string;
  readingTimeMinutes: number;
};

export const ideaFrontmatterSchema = z.object({
  title: z.string(),
  published: z.string(),
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  summary: z.string().max(160),
  cover: z.string().nullable().default(null),
  draft: z.boolean().default(false),
});

export type IdeaFrontmatter = z.infer<typeof ideaFrontmatterSchema>;
export type Idea = IdeaFrontmatter & {
  slug: string;
  body: string;
  readingTimeMinutes: number;
};

export const lifeFrontmatterSchema = z.object({
  // Short entries don't need a headline the way an article does — keep it
  // optional and fall back to the date in the UI.
  title: z.string().optional(),
  published: z.string(),
  kind: z.enum(["note", "moment", "place", "observation"]).default("note"),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type LifeFrontmatter = z.infer<typeof lifeFrontmatterSchema>;
export type LifeEntry = LifeFrontmatter & { slug: string; body: string };

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Please enter a valid email.").max(254),
  budget: z.string().max(80).optional(),
  message: z
    .string()
    .min(20, "Give me a bit more detail (20 characters minimum).")
    .max(4000),
  // Honeypot: must stay empty. Bots that fill every field trip this.
  company: z.string().max(0, "").optional().default(""),
  // Time-trap: form must be on-page at least a couple seconds before submit.
  renderedAt: z.number(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const labFrontmatterSchema = z.object({
  title: z.string(),
  type: z.enum(["experiment", "prototype", "research", "tool", "open-source"]),
  status: z.enum(["exploring", "active", "paused", "archived"]),
  summary: z.string().max(160),
  tags: z.array(z.string()).default([]),
  cover: z.string().nullable().default(null),
  externalUrl: z.string().url().optional(),
  started: z.string(),
  published: z.string(),
  draft: z.boolean().default(false),
  // Sample content standing in for a real entry — rendered with a visible
  // "Sample" badge and excluded from indexing. Never used for anything
  // resembling a real claim (client, achievement, testimonial); see
  // decision-log.md D-037.
  demo: z.boolean().default(false),
});

export type LabFrontmatter = z.infer<typeof labFrontmatterSchema>;
export type LabEntry = LabFrontmatter & { slug: string; body: string };
