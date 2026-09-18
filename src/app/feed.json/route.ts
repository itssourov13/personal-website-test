import { NextResponse } from "next/server";

import { getAllNotes } from "@/lib/content";
import { siteConfig } from "@/lib/site.config";

// JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/) alongside the
// existing RSS route — some readers prefer it, and it's a small addition
// once the RSS route already exists.
export function GET() {
  const notes = getAllNotes();
  const siteUrl = `https://${siteConfig.domain}`;

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${siteConfig.name} — Writing`,
    home_page_url: `${siteUrl}/writing`,
    feed_url: `${siteUrl}/feed.json`,
    description: siteConfig.description,
    icon: `${siteUrl}/icon.svg`,
    authors: [{ name: siteConfig.name, url: siteUrl }],
    items: notes.map((note) => ({
      id: `${siteUrl}/writing/${note.slug}`,
      url: `${siteUrl}/writing/${note.slug}`,
      title: note.title,
      summary: note.summary,
      date_published: new Date(note.published).toISOString(),
      ...(note.updated
        ? { date_modified: new Date(note.updated).toISOString() }
        : {}),
      tags: note.tags,
    })),
  };

  return NextResponse.json(feed, {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
