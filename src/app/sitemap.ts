import type { MetadataRoute } from "next";

import {
  getAllIdeas,
  getAllLab,
  getAllLife,
  getAllNotes,
  getAllWork,
  getTopics,
} from "@/lib/content";
import { siteConfig } from "@/lib/site.config";
import { bookmarks } from "@data/bookmarks";
import { photos } from "@data/photos";

// Dynamic: includes work/writing/lab detail pages and qualifying topic
// pages, and only lists /lab and /bookmarks once they hold real (non-demo)
// content — matching the `robots: { index: false }` those pages set for
// themselves while demo-only/empty. Demo lab entries are excluded from the
// sitemap outright, even though the route exists. /speaking is
// intentionally excluded entirely; see data/talks.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${siteConfig.domain}`;
  const work = getAllWork();
  const notes = getAllNotes();
  const lab = getAllLab();
  const realLab = lab.filter((entry) => !entry.demo);
  const ideas = getAllIdeas();
  const life = getAllLife();
  const topics = getTopics();

  const staticRoutes = [
    "",
    "/work",
    "/writing",
    "/about",
    "/services",
    "/contact",
    "/now",
    "/uses",
    "/resume",
    "/colophon",
    ...(topics.length > 0 ? ["/topics"] : []),
    ...(realLab.length > 0 ? ["/lab"] : []),
    ...(bookmarks.length > 0 ? ["/bookmarks"] : []),
    ...(ideas.length > 0 ? ["/ideas"] : []),
    ...(life.length > 0 ? ["/life"] : []),
    ...(photos.length > 0 ? ["/photography"] : []),
  ];

  const dynamicRoutes = [
    ...work.map((item) => `/work/${item.slug}`),
    ...notes.map((note) => `/writing/${note.slug}`),
    ...realLab.map((entry) => `/lab/${entry.slug}`),
    ...ideas.map((idea) => `/ideas/${idea.slug}`),
    ...topics.map((topic) => `/topics/${topic.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
