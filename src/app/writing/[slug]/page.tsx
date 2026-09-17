import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import ReadingProgress from "@/components/motion/ReadingProgress";
import CodeBlockEnhancer from "@/components/sections/CodeBlockEnhancer";
import SeriesNav from "@/components/sections/SeriesNav";
import ShareRow from "@/components/sections/ShareRow";
import TableOfContents from "@/components/sections/TableOfContents";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import {
  extractHeadings,
  getAllNotes,
  getNoteBySlug,
  getRelatedNotes,
  getRelatedWorkForNote,
  getSeries,
  getTopics,
  renderMarkdown,
} from "@/lib/content";
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    openGraph: {
      title: note.title,
      description: note.summary,
      type: "article",
      images: [`/og/writing-${slug}?title=${encodeURIComponent(note.title)}`],
    },
  };
}

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const html = await renderMarkdown(note.body);
  const headings = extractHeadings(note.body);
  const related = getRelatedNotes(slug);
  const relatedWork = getRelatedWorkForNote(note);
  const seriesItems = note.series ? getSeries(note.series) : [];
  const topicSlugs = new Set(getTopics().map((topic) => topic.slug));

  return (
    <>
      <script {...jsonLdScript(articleJsonLd(note))} nonce={nonce} />
      <script
        {...jsonLdScript(
          breadcrumbJsonLd([
            { name: "Writing", path: "/writing" },
            { name: note.title, path: `/writing/${note.slug}` },
          ]),
        )}
        nonce={nonce}
      />

      <ReadingProgress />

      <Section className="pt-16 pb-8 md:pt-24">
        <p className="text-overline text-accent-strong mb-3">
          {formatDate(note.published)} · {note.readingTimeMinutes} min read
        </p>
        <h1 className="text-display-2 max-w-2xl">{note.title}</h1>
        {note.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => {
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
        <ShareRow title={note.title} />
      </Section>

      <Section id="article-content" className="pt-0">
        {note.series ? (
          <SeriesNav seriesName={note.series} items={seriesItems} currentSlug={note.slug} />
        ) : null}
        <TableOfContents headings={headings} />
        <CodeBlockEnhancer>
          <Prose html={html} />
        </CodeBlockEnhancer>
      </Section>

      {related.length > 0 || relatedWork.length > 0 ? (
        <Section className="border-border border-t">
          {related.length > 0 ? (
            <div className="mb-8">
              <p className="text-overline text-accent-strong mb-4">
                Related notes
              </p>
              <ul className="flex flex-col gap-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/writing/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {relatedWork.length > 0 ? (
            <div>
              <p className="text-overline text-accent-strong mb-4">
                Related work
              </p>
              <ul className="flex flex-col gap-3">
                {relatedWork.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/work/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      ) : null}
    </>
  );
}
