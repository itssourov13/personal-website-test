import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { getTopicBySlug, getTopics } from "@/lib/content";

export function generateStaticParams() {
  return getTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: `${topic.label} — Topics`,
    description: `Writing, work, lab, and idea entries related to ${topic.label}.`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  return (
    <Section className="pt-32 md:pt-40">
      <p className="text-overline text-accent-strong mb-2">Topic</p>
      <h1 className="text-display-2 mb-10">{topic.label}</h1>

      {topic.notes.length > 0 ? (
        <div className="mb-10">
          <p className="text-faint mb-4 text-sm">Writing</p>
          <div className="flex flex-col gap-3">
            {topic.notes.map((note) => (
              <Link key={note.slug} href={`/writing/${note.slug}`} className="font-medium hover:underline">
                {note.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {topic.work.length > 0 ? (
        <div className="mb-10">
          <p className="text-faint mb-4 text-sm">Work</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topic.work.map((item) => (
              <Link key={item.slug} href={`/work/${item.slug}`}>
                <Card className="hover:border-accent h-full transition-colors">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted mt-1 text-sm">{item.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {topic.lab.length > 0 ? (
        <div className="mb-10">
          <p className="text-faint mb-4 text-sm">Lab</p>
          <div className="flex flex-col gap-3">
            {topic.lab.map((entry) => (
              <Link key={entry.slug} href={`/lab/${entry.slug}`} className="font-medium hover:underline">
                {entry.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {topic.ideas.length > 0 ? (
        <div>
          <p className="text-faint mb-4 text-sm">Ideas</p>
          <div className="flex flex-col gap-3">
            {topic.ideas.map((idea) => (
              <Link key={idea.slug} href={`/ideas/${idea.slug}`} className="font-medium hover:underline">
                {idea.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
