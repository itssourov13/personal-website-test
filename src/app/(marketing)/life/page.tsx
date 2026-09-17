import type { Metadata } from "next";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import Badge from "@/components/ui/Badge";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { getAllLife, renderMarkdown } from "@/lib/content";
import { formatDate } from "@/lib/utils";

const entries = getAllLife();

export const metadata: Metadata = {
  title: "Life",
  description: "Short, dated notes — moments, places, and small observations.",
  openGraph: { images: [`/og/life?title=${encodeURIComponent("Life")}`] },
  robots: entries.length === 0 ? { index: false, follow: true } : undefined,
};

const kindLabel: Record<string, string> = {
  note: "Note",
  moment: "Moment",
  place: "Place",
  observation: "Observation",
};

export default async function LifePage() {
  const rendered = await Promise.all(
    entries.map(async (entry) => ({ entry, html: await renderMarkdown(entry.body) })),
  );

  return (
    <>
      <PageHeader
        eyebrow="Life"
        title="Outside the work."
        description="A running, dated log — not a feed to scroll, just what's actually true at the time."
      />
      <Section className="max-w-[760px] pt-0">
        {entries.length === 0 ? (
          <EmptyState
            title="Nothing logged yet."
            description="This will fill in with real, dated entries over time — see /now for what's currently top of mind."
          />
        ) : (
          <div className="divide-border flex flex-col divide-y">
            {rendered.map(({ entry, html }) => (
              <article key={entry.slug} className="flex flex-col gap-3 py-8 first:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-faint text-sm">{formatDate(entry.published)}</p>
                  <Badge>{kindLabel[entry.kind] ?? entry.kind}</Badge>
                  {entry.location ? (
                    <span className="text-faint text-sm">· {entry.location}</span>
                  ) : null}
                </div>
                {entry.title ? <h2 className="text-lg font-semibold">{entry.title}</h2> : null}
                <Prose html={html} />
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
