import type { Metadata } from "next";
import Link from "next/link";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CoverImage from "@/components/ui/CoverImage";
import Section from "@/components/ui/Section";
import { getAllLab } from "@/lib/content";

const entries = getAllLab();
const hasRealEntries = entries.some((entry) => !entry.demo);

export const metadata: Metadata = {
  title: "Lab",
  description: "Experiments, prototypes, and research — separate from client work.",
  openGraph: { images: [`/og/lab?title=${encodeURIComponent("Lab")}`] },
  // Thin/demo-only section: don't index until there's real content to show.
  robots: !hasRealEntries ? { index: false, follow: true } : undefined,
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lab"
        title="Experiments, not client work."
        description="Work is what I ship for clients. Lab is everything else — prototypes, research, small tools, things I built to find out if they'd work."
      />
      {!hasRealEntries ? (
        <Section className="pt-0 pb-0">
          <p className="text-muted border-accent-soft bg-accent-soft/40 rounded-md border px-4 py-3 text-sm">
            This section is still mostly empty — the entry below is sample
            content standing in for a real one while it's built out.
          </p>
        </Section>
      ) : null}
      <Section className="pt-0">
        {entries.length === 0 ? (
          <EmptyState
            title="This section is being built."
            description="Nothing real to show yet — real experiments and research will land here as they're actually finished, not before."
          >
            <Link href="/writing" className="text-accent-strong text-sm font-medium hover:underline">
              Read the writing instead →
            </Link>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {entries.map((entry) => (
              <Link key={entry.slug} href={`/lab/${entry.slug}`} className="group block h-full">
                <Card padded={false} className="flex h-full flex-col overflow-hidden transition-colors group-hover:border-accent">
                  <CoverImage src={entry.cover} alt="" className="aspect-[3/2] w-full object-cover" />
                  <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
                    <div className="flex items-center gap-2">
                      {entry.demo ? <Badge>Sample</Badge> : null}
                      <Badge tone="accent">{entry.status}</Badge>
                      <Badge>{entry.type}</Badge>
                    </div>
                    <h2 className="text-xl font-semibold">{entry.title}</h2>
                    <p className="text-muted">{entry.summary}</p>
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
