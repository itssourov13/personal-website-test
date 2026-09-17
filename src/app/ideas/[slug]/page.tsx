import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import ReadingProgress from "@/components/motion/ReadingProgress";
import ShareRow from "@/components/sections/ShareRow";
import TableOfContents from "@/components/sections/TableOfContents";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import {
  extractHeadings,
  getAllIdeas,
  getIdeaBySlug,
  getRelatedIdeas,
  getTopics,
  renderMarkdown,
} from "@/lib/content";
import { breadcrumbJsonLd, ideaJsonLd, jsonLdScript } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";

export function generateStaticParams() {
  return getAllIdeas().map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);
  if (!idea) return {};
  return {
    title: idea.title,
    description: idea.summary,
    openGraph: {
      title: idea.title,
      description: idea.summary,
      type: "article",
      images: [`/og/ideas-${slug}?title=${encodeURIComponent(idea.title)}`],
    },
  };
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);
  if (!idea) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const html = await renderMarkdown(idea.body);
  const headings = extractHeadings(idea.body);
  const related = getRelatedIdeas(slug);
  const topicSlugs = new Set(getTopics().map((topic) => topic.slug));

  return (
    <>
      <script {...jsonLdScript(ideaJsonLd(idea))} nonce={nonce} />
      <script
        {...jsonLdScript(
          breadcrumbJsonLd([
            { name: "Ideas", path: "/ideas" },
            { name: idea.title, path: `/ideas/${idea.slug}` },
          ]),
        )}
        nonce={nonce}
      />

      <ReadingProgress />

      <Section className="pt-16 pb-8 md:pt-24">
        <p className="text-overline text-accent-strong mb-3">
          {formatDate(idea.published)} · {idea.readingTimeMinutes} min read
        </p>
        <h1 className="text-display-2 max-w-2xl">{idea.title}</h1>
        {idea.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {idea.tags.map((tag) => {
              const tagSlug = slugify(tag);
              return topicSlugs.has(tagSlug) ? (
                <Link
                  key={tag}
                  href={`/topics/${tagSlug}`}
                  className="text-accent-strong text-xs font-medium hover:underline"
                >
                  #{tag}
                </Link>
              ) : (
                <span key={tag} className="text-faint text-xs">
                  #{tag}
                </span>
              );
            })}
          </div>
        ) : null}
        <ShareRow title={idea.title} />
      </Section>

      <Section id="article-content" className="pt-0">
        <TableOfContents headings={headings} />
        <Prose html={html} />
      </Section>

      {related.length > 0 ? (
        <Section className="border-border border-t">
          <p className="text-overline text-accent-strong mb-4">Related ideas</p>
          <ul className="flex flex-col gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/ideas/${item.slug}`} className="font-medium hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
