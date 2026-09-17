import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";

import { readingTime, slugify } from "@/lib/utils";
import {
  ideaFrontmatterSchema,
  labFrontmatterSchema,
  lifeFrontmatterSchema,
  noteFrontmatterSchema,
  workFrontmatterSchema,
  type Idea,
  type LabEntry,
  type LifeEntry,
  type Note,
  type Work,
} from "@/lib/schema";

// DEVIATION FROM tech-stack.md (D-005): the plan calls for Velite. Velite's
// build-time codegen couldn't be installed/verified in the authoring
// environment (no network access), so this is a small, dependency-light
// hand-rolled loader (gray-matter + marked) with the same zod-validated
// contract. Swapping back to Velite later is a drop-in change scoped to this
// file — see project-planning/09-decisions/decision-log.md.

const CONTENT_DIR = path.join(process.cwd(), "content");

function readCollection(collection: "work" | "writing" | "lab" | "ideas" | "life") {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .filter((file) => !file.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, data, content };
    });
}

let workCache: Work[] | null = null;
let noteCache: Note[] | null = null;
let labCache: LabEntry[] | null = null;
let ideaCache: Idea[] | null = null;
let lifeCache: LifeEntry[] | null = null;

export function getAllLab(): LabEntry[] {
  if (labCache) return labCache;

  labCache = readCollection("lab")
    .map(({ slug, data, content }) => {
      const parsed = labFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`[content] skipping content/lab/${slug}: invalid frontmatter`, parsed.error.flatten());
        return null;
      }
      return { ...parsed.data, slug, body: content };
    })
    .filter((item): item is LabEntry => item !== null)
    .filter((item) => !item.draft)
    .sort((a, b) => (a.published < b.published ? 1 : -1));

  return labCache;
}

export function getLabBySlug(slug: string): LabEntry | undefined {
  return getAllLab().find((item) => item.slug === slug);
}

export function getAllIdeas(): Idea[] {
  if (ideaCache) return ideaCache;

  ideaCache = readCollection("ideas")
    .map(({ slug, data, content }) => {
      const parsed = ideaFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`[content] skipping content/ideas/${slug}: invalid frontmatter`, parsed.error.flatten());
        return null;
      }
      return {
        ...parsed.data,
        slug,
        body: content,
        readingTimeMinutes: readingTime(content),
      };
    })
    .filter((item): item is Idea => item !== null)
    .filter((item) => !item.draft)
    .sort((a, b) => (a.published < b.published ? 1 : -1));

  return ideaCache;
}

export function getIdeaBySlug(slug: string): Idea | undefined {
  return getAllIdeas().find((item) => item.slug === slug);
}

/** Ideas sharing at least one tag with the given idea, most recent first. */
export function getRelatedIdeas(slug: string, limit = 3): Idea[] {
  const current = getIdeaBySlug(slug);
  if (!current) return [];

  return getAllIdeas()
    .filter((idea) => idea.slug !== slug)
    .filter((idea) => idea.tags.some((tag) => current.tags.includes(tag)))
    .slice(0, limit);
}

/** Short, dated journal-style entries — rendered inline on a single /life
 * timeline rather than given individual detail pages (see
 * decision-log.md D-038: nothing here is long enough to need one yet). */
export function getAllLife(): LifeEntry[] {
  if (lifeCache) return lifeCache;

  lifeCache = readCollection("life")
    .map(({ slug, data, content }) => {
      const parsed = lifeFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`[content] skipping content/life/${slug}: invalid frontmatter`, parsed.error.flatten());
        return null;
      }
      return { ...parsed.data, slug, body: content };
    })
    .filter((item): item is LifeEntry => item !== null)
    .filter((item) => !item.draft)
    .sort((a, b) => (a.published < b.published ? 1 : -1));

  return lifeCache;
}

export function getAllWork(): Work[] {
  if (workCache) return workCache;

  workCache = readCollection("work")
    .map(({ slug, data, content }) => {
      const parsed = workFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`[content] skipping content/work/${slug}: invalid frontmatter`, parsed.error.flatten());
        return null;
      }
      return { ...parsed.data, slug, body: content };
    })
    .filter((item): item is Work => item !== null)
    .filter((item) => !item.draft)
    .sort((a, b) => (a.published < b.published ? 1 : -1));

  return workCache;
}

export function getWorkBySlug(slug: string): Work | undefined {
  return getAllWork().find((item) => item.slug === slug);
}

export function getFeaturedWork(limit = 3): Work[] {
  return getAllWork()
    .filter((item) => item.featured)
    .slice(0, limit);
}

export function getAllNotes(): Note[] {
  if (noteCache) return noteCache;

  noteCache = readCollection("writing")
    .map(({ slug, data, content }) => {
      const parsed = noteFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`[content] skipping content/writing/${slug}: invalid frontmatter`, parsed.error.flatten());
        return null;
      }
      return {
        ...parsed.data,
        slug,
        body: content,
        readingTimeMinutes: readingTime(content),
      };
    })
    .filter((item): item is Note => item !== null)
    .filter((item) => !item.draft)
    .sort((a, b) => (a.published < b.published ? 1 : -1));

  return noteCache;
}

export function getNoteBySlug(slug: string): Note | undefined {
  return getAllNotes().find((item) => item.slug === slug);
}

export function getRelatedNotes(slug: string, limit = 3): Note[] {
  const current = getNoteBySlug(slug);
  if (!current) return [];

  return getAllNotes()
    .filter((note) => note.slug !== slug)
    .filter((note) => note.tags.some((tag) => current.tags.includes(tag)))
    .slice(0, limit);
}

/** Notes sharing a `series` value, ordered oldest-first (publish order is
 * the read order for a series). Ordering is inferred from `published` —
 * there's no separate "part number" field, one fewer thing content authors
 * can get out of sync. */
export function getSeries(seriesName: string): Note[] {
  return getAllNotes()
    .filter((note) => note.series === seriesName)
    .sort((a, b) => (a.published > b.published ? 1 : -1));
}

// ---------------------------------------------------------------------------
// Cross-content relationships ("knowledge graph"). Deterministic tag/label
// matching over existing frontmatter — no separate graph store, per
// project-planning direction (avoid a database graph for a handful of
// content items). Matching is case-insensitive since writing `tags` and
// work `industry`/`discipline` are authored independently and won't always
// share exact casing (e.g. tag "e-commerce" vs industry "E-commerce").
// ---------------------------------------------------------------------------

function norm(value: string): string {
  return value.trim().toLowerCase();
}

/** Work items whose industry or discipline overlaps a note's tags. */
export function getRelatedWorkForNote(note: Note, limit = 2): Work[] {
  const noteTags = note.tags.map(norm);
  return getAllWork()
    .filter((work) =>
      [...work.industry, ...work.discipline].some((label) => noteTags.includes(norm(label))),
    )
    .slice(0, limit);
}

/** Notes whose tags overlap a work item's industry or discipline. */
export function getRelatedNotesForWork(work: Work, limit = 2): Note[] {
  const workLabels = [...work.industry, ...work.discipline].map(norm);
  return getAllNotes()
    .filter((note) => note.tags.some((tag) => workLabels.includes(norm(tag))))
    .slice(0, limit);
}

export type Topic = {
  slug: string;
  label: string;
  notes: Note[];
  work: Work[];
  lab: LabEntry[];
  ideas: Idea[];
};

const MIN_TOPIC_ITEMS = 2;

/** Aggregates writing tags + work industry/discipline + lab tags + idea
 * tags into topic pages — but only for labels with enough real content to
 * be worth a page (MIN_TOPIC_ITEMS), so the archive doesn't grow sparse
 * topic pages ahead of having anything to put on them. */
export function getTopics(): Topic[] {
  const buckets = new Map<
    string,
    { label: string; notes: Note[]; work: Work[]; lab: LabEntry[]; ideas: Idea[] }
  >();

  const add = (
    label: string,
    kind: "note" | "work" | "lab" | "idea",
    item: Note | Work | LabEntry | Idea,
  ) => {
    const key = slugify(label);
    if (!buckets.has(key)) buckets.set(key, { label, notes: [], work: [], lab: [], ideas: [] });
    const bucket = buckets.get(key)!;
    if (kind === "note") bucket.notes.push(item as Note);
    if (kind === "work") bucket.work.push(item as Work);
    if (kind === "lab") bucket.lab.push(item as LabEntry);
    if (kind === "idea") bucket.ideas.push(item as Idea);
  };

  getAllNotes().forEach((note) => note.tags.forEach((tag) => add(tag, "note", note)));
  getAllWork().forEach((work) =>
    [...work.industry, ...work.discipline].forEach((label) => add(label, "work", work)),
  );
  // Demo lab entries don't count toward "is this topic real enough" — see
  // decision-log.md D-037.
  getAllLab()
    .filter((entry) => !entry.demo)
    .forEach((entry) => entry.tags.forEach((tag) => add(tag, "lab", entry)));
  getAllIdeas().forEach((idea) => idea.tags.forEach((tag) => add(tag, "idea", idea)));

  return Array.from(buckets.entries())
    .map(([slug, bucket]) => ({ slug, ...bucket }))
    .filter(
      (topic) =>
        topic.notes.length + topic.work.length + topic.lab.length + topic.ideas.length >=
        MIN_TOPIC_ITEMS,
    )
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getTopics().find((topic) => topic.slug === slug);
}

export type Heading = { depth: 2 | 3; text: string; id: string };

/** Scans raw markdown for h2/h3 lines and builds a table-of-contents list.
 * Uses the same slugify as the heading renderer below so ids always match. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const depth = match[1]?.length === 2 ? 2 : 3;
    const text = match[2]?.trim() ?? "";
    headings.push({ depth, text, id: slugify(text) });
  }

  return headings;
}

const headingRenderer = {
  heading({ tokens, depth }: { tokens: unknown; depth: number }) {
    // Cast needed: marked's Token type isn't imported to avoid a hard
    // dependency on its (unstable across versions) internal token shape.
    const text = this.parser.parseInline(tokens as never);
    const id = slugify(text.replace(/<[^>]+>/g, ""));
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  },
};

marked.use({ renderer: headingRenderer });

export async function renderMarkdown(body: string): Promise<string> {
  return marked.parse(body, { async: true });
}
