import type { Metadata } from "next";
import Link from "next/link";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CoverImage from "@/components/ui/CoverImage";
import Section from "@/components/ui/Section";
import { getAllIdeas } from "@/lib/content";
import { formatDate } from "@/lib/utils";

const ideas = getAllIdeas();

export const metadata: Metadata = {
  title: "Ideas",
  description:
    "Thoughts, observations, and concepts — not client or project writing.",
  openGraph: { images: [`/og/ideas?title=${encodeURIComponent("Ideas")}`] },
  robots: ideas.length === 0 ? { index: false, follow: true } : undefined,
};

export default function IdeasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ideas"
        title="Thoughts, not deliverables."
        description="Observations and half-formed concepts that don't belong on the Writing or Work pages — nothing here shipped to a client."
      />
      <Section className="pt-0">
        {ideas.length === 0 ? (
          <EmptyState
            title="Nothing here yet."
            description="This will fill in with real ideas over time — not filler posts written to look busy."
          >
            <Link
              href="/writing"
              className="text-accent-strong text-sm font-medium hover:underline"
            >
              Read the writing instead →
            </Link>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ideas.map((idea) => (
              <Link
                key={idea.slug}
                href={`/ideas/${idea.slug}`}
                className="group block h-full"
              >
                <Card
                  padded={false}
                  className="group-hover:border-accent flex h-full flex-col overflow-hidden transition-colors"
                >
                  <CoverImage
                    src={idea.cover}
                    alt=""
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold group-hover:underline">
                      {idea.title}
                    </h2>
                    <p className="text-muted">{idea.summary}</p>
                    <p className="text-faint mt-auto text-sm">
                      {formatDate(idea.published)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
