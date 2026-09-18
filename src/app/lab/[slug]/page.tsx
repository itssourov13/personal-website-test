import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Badge from "@/components/ui/Badge";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { getAllLab, getLabBySlug, renderMarkdown } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllLab().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLabBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    robots: entry.demo ? { index: false, follow: true } : undefined,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      images: [`/og/lab-${slug}?title=${encodeURIComponent(entry.title)}`],
    },
  };
}

export default async function LabEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLabBySlug(slug);
  if (!entry) notFound();

  const html = await renderMarkdown(entry.body);

  return (
    <>
      <Section className="pt-32 pb-8 md:pt-40">
        {entry.demo ? (
          <p className="text-muted border-accent-soft bg-accent-soft/40 mb-6 rounded-md border px-4 py-3 text-sm">
            Sample entry — standing in for a real one while this section is
            built out.
          </p>
        ) : null}
        <div className="mb-4 flex items-center gap-2">
          {entry.demo ? <Badge>Sample</Badge> : null}
          <Badge tone="accent">{entry.status}</Badge>
          <Badge>{entry.type}</Badge>
        </div>
        <h1 className="text-display-2 max-w-2xl">{entry.title}</h1>
        <p className="text-muted mt-4 max-w-xl text-lg">{entry.summary}</p>
        <p className="text-faint mt-4 text-sm">
          Started {formatDate(entry.started)}
          {entry.externalUrl ? (
            <>
              {" · "}
              <a
                href={entry.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View externally
              </a>
            </>
          ) : null}
        </p>
      </Section>

      <Section className="pt-0">
        <Prose html={html} />
      </Section>
    </>
  );
}
