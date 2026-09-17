import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import CodeBlockEnhancer from "@/components/sections/CodeBlockEnhancer";
import MetricBand from "@/components/sections/MetricBand";
import RelatedWork from "@/components/sections/RelatedWork";
import ShareRow from "@/components/sections/ShareRow";
import TestimonialPullQuote from "@/components/sections/TestimonialPullQuote";
import Badge from "@/components/ui/Badge";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { getAllWork, getRelatedNotesForWork, getTopics, getWorkBySlug, renderMarkdown } from "@/lib/content";
import { breadcrumbJsonLd, jsonLdScript, workJsonLd } from "@/lib/seo";
import { slugify } from "@/lib/utils";
import { testimonials } from "@data/testimonials";

export function generateStaticParams() {
  return getAllWork().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: [`/og/work-${slug}?title=${encodeURIComponent(item.title)}`],
    },
  };
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWorkBySlug(slug);
  if (!item) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const html = await renderMarkdown(item.body);
  const allWork = getAllWork();
  const relatedNotes = getRelatedNotesForWork(item);
  const topicSlugs = new Set(getTopics().map((topic) => topic.slug));
  const matchedTestimonial = item.testimonial
    ? testimonials.find((t) => t.name === item.testimonial)
    : undefined;

  return (
    <>
      <script {...jsonLdScript(workJsonLd(item))} nonce={nonce} />
      <script
        {...jsonLdScript(
          breadcrumbJsonLd([
            { name: "Work", path: "/work" },
            { name: item.title, path: `/work/${item.slug}` },
          ]),
        )}
        nonce={nonce}
      />

      <Section className="pt-32 pb-8 md:pt-40">
        <div className="mb-4 flex flex-wrap gap-2">
          {item.discipline.map((tag) =>
            topicSlugs.has(slugify(tag)) ? (
              <Link key={tag} href={`/topics/${slugify(tag)}`}>
                <Badge tone="accent">{tag}</Badge>
              </Link>
            ) : (
              <Badge key={tag}>{tag}</Badge>
            ),
          )}
        </div>
        <h1 className="text-display-2 max-w-2xl">{item.title}</h1>
        <p className="text-muted mt-4 max-w-xl text-lg">{item.summary}</p>
        <dl className="text-muted mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-faint">Client</dt>
            <dd>{item.client ?? "Confidential"}</dd>
          </div>
          <div>
            <dt className="text-faint">Role</dt>
            <dd>{item.role}</dd>
          </div>
          <div>
            <dt className="text-faint">Timeline</dt>
            <dd>{item.timeline}</dd>
          </div>
          <div>
            <dt className="text-faint">Year</dt>
            <dd>{item.year}</dd>
          </div>
        </dl>
        <ShareRow title={item.title} />
      </Section>

      {item.cover ? (
        <Section className="pt-0 pb-8">
          <img
            src={item.cover}
            alt={`Cover image for ${item.title}`}
            className="w-full rounded-md border border-border"
          />
        </Section>
      ) : null}

      <Section className="pt-0">
        <MetricBand outcomes={item.outcomes} />
      </Section>

      {matchedTestimonial ? (
        <Section className="pt-0">
          <TestimonialPullQuote testimonial={matchedTestimonial} />
        </Section>
      ) : null}

      <Section id="article-content" className="pt-0">
        <CodeBlockEnhancer>
          <Prose html={html} />
        </CodeBlockEnhancer>
      </Section>

      {relatedNotes.length > 0 ? (
        <Section className="border-border border-t pt-16">
          <p className="text-overline text-accent-strong mb-4">Related writing</p>
          <ul className="flex flex-col gap-3">
            {relatedNotes.map((note) => (
              <li key={note.slug}>
                <Link href={`/writing/${note.slug}`} className="font-medium hover:underline">
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <RelatedWork items={allWork} currentSlug={item.slug} />
    </>
  );
}
