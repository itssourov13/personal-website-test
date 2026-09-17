import { describe, expect, it } from "vitest";

import { getAllNotes, getAllWork } from "@/lib/content";

describe("content loader", () => {
  it("reads and validates the sample work case studies", () => {
    const work = getAllWork();
    expect(work.length).toBeGreaterThan(0);
    expect(work.every((item) => item.title.length > 0)).toBe(true);
  });

  it("reads and validates the sample writing posts", () => {
    const notes = getAllNotes();
    expect(notes.length).toBeGreaterThan(0);
    expect(notes.every((note) => note.readingTimeMinutes >= 1)).toBe(true);
  });
});

describe("extractHeadings", () => {
  it("finds h2/h3 lines and slugifies matching ids", async () => {
    const { extractHeadings } = await import("@/lib/content");
    const markdown = "## First Section\n\ntext\n\n### A Sub Point\n\nmore text";
    const headings = extractHeadings(markdown);

    expect(headings).toEqual([
      { depth: 2, text: "First Section", id: "first-section" },
      { depth: 3, text: "A Sub Point", id: "a-sub-point" },
    ]);
  });
});

describe("getSeries", () => {
  it("returns notes in the named series, oldest first", async () => {
    const { getSeries } = await import("@/lib/content");
    const series = getSeries("Forms, badly designed");

    expect(series.length).toBe(2);
    expect(series[0]?.slug).toBe("checkout-is-a-form-problem");
    expect(series[1]?.slug).toBe("forms-second-look");
  });

  it("returns an empty array for an unknown series", async () => {
    const { getSeries } = await import("@/lib/content");
    expect(getSeries("Not a real series")).toEqual([]);
  });
});

describe("ideas loader", () => {
  it("returns an empty array — no real ideas exist yet, only the _template.md", async () => {
    const { getAllIdeas } = await import("@/lib/content");
    expect(getAllIdeas()).toEqual([]);
  });

  it("getRelatedIdeas returns an empty array for an unknown slug", async () => {
    const { getRelatedIdeas } = await import("@/lib/content");
    expect(getRelatedIdeas("not-a-real-idea")).toEqual([]);
  });
});

describe("life loader", () => {
  it("returns an empty array — no real entries exist yet, only the _template.md", async () => {
    const { getAllLife } = await import("@/lib/content");
    expect(getAllLife()).toEqual([]);
  });
});

describe("getTopics with ideas", () => {
  it("includes an ideas field on every topic without throwing", async () => {
    const { getTopics } = await import("@/lib/content");
    const topics = getTopics();
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.every((topic) => Array.isArray(topic.ideas))).toBe(true);
    // No real idea content exists yet, so no topic should be pulling ideas in.
    expect(topics.every((topic) => topic.ideas.length === 0)).toBe(true);
  });
});
