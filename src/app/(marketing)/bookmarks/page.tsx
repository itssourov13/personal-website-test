import type { Metadata } from "next";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import { formatDate } from "@/lib/utils";
import { bookmarks } from "@data/bookmarks";

const hasRealBookmarks = bookmarks.some((b) => !b.demo);

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "A curated, personally-annotated set of links.",
  openGraph: {
    images: [`/og/bookmarks?title=${encodeURIComponent("Bookmarks")}`],
  },
  robots: !hasRealBookmarks ? { index: false, follow: true } : undefined,
};

export default function BookmarksPage() {
  const categories = Array.from(new Set(bookmarks.map((b) => b.category)));

  return (
    <>
      <PageHeader
        eyebrow="Bookmarks"
        title="What I'm actually reading and referencing."
        description="A small, curated library — not a link dump. Everything here has a reason to be here."
      />
      {!hasRealBookmarks && bookmarks.length > 0 ? (
        <Section className="pt-0 pb-0">
          <p className="text-muted border-accent-soft bg-accent-soft/40 rounded-md border px-4 py-3 text-sm">
            This library is still mostly empty — the entries below are sample
            bookmarks standing in for real curation while it&apos;s built out.
          </p>
        </Section>
      ) : null}
      <Section className="pt-0">
        {bookmarks.length === 0 ? (
          <EmptyState
            title="Nothing curated yet."
            description="This will fill in with real links and real commentary over time — not a starter pack of generic resources."
          />
        ) : (
          <div className="flex flex-col gap-10">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="mb-4 text-xl font-semibold">{category}</h2>
                <ul className="flex flex-col gap-4">
                  {bookmarks
                    .filter((b) => b.category === category)
                    .map((bookmark) => (
                      <li key={bookmark.url}>
                        <div className="flex items-center gap-2">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                          >
                            {bookmark.title}
                          </a>
                          {bookmark.demo ? <Badge>Sample</Badge> : null}
                        </div>
                        <p className="text-muted text-sm">
                          {bookmark.description}
                        </p>
                        <p className="text-faint text-xs">
                          Added {formatDate(bookmark.dateAdded)}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
