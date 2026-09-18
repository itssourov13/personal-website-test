import type { Metadata } from "next";
import Link from "next/link";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import { getTopics } from "@/lib/content";

const topics = getTopics();

export const metadata: Metadata = {
  title: "Topics",
  description: "Writing, work, lab, and idea entries grouped by theme.",
  robots: topics.length === 0 ? { index: false, follow: true } : undefined,
};

export default function TopicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Topics"
        title="Browse by theme."
        description="Only themes with enough real content to be worth a page — not every tag gets one."
      />
      <Section className="pt-0">
        {topics.length === 0 ? (
          <EmptyState
            title="Not enough content yet."
            description="Topic pages appear once a theme has enough writing, work, or lab entries to be worth aggregating — sparse pages aren't useful to anyone."
          />
        ) : (
          <ul className="flex flex-wrap gap-3">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="border-border hover:bg-surface-2 flex min-h-11 items-center rounded-full border px-4 text-sm font-medium"
                >
                  {topic.label}
                  <span className="text-faint ml-2">
                    {topic.notes.length +
                      topic.work.length +
                      topic.lab.length +
                      topic.ideas.length}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
