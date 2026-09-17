import type { Metadata } from "next";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import { talks } from "@data/talks";

// Deliberately not linked from header/footer nav or the command palette
// while `talks` is empty (see decision-log.md D-036) — the route exists so
// it's ready the moment there's something real to list, without the site
// advertising a "Speaking" section that has nothing in it.
export const metadata: Metadata = {
  title: "Speaking",
  description: "Talks, podcasts, and appearances.",
  robots: talks.length === 0 ? { index: false, follow: true } : undefined,
};

export default function SpeakingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Speaking"
        title="Talks, podcasts, and appearances."
        description="Public appearances I've actually done — nothing here is aspirational."
      />
      <Section className="pt-0">
        {talks.length === 0 ? (
          <EmptyState
            title="Nothing to list yet."
            description="This page is ready for real talks, podcasts, or panels the moment they happen — there's nothing here to invent in the meantime."
          />
        ) : (
          <ul className="divide-border divide-y">
            {talks.map((talk) => (
              <li key={talk.title} className="flex flex-col gap-1 py-5">
                <p className="font-medium">{talk.title}</p>
                <p className="text-muted text-sm">
                  {talk.event} · {talk.type}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
