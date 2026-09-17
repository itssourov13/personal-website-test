import type { Metadata } from "next";

import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import { siteConfig } from "@/lib/site.config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${siteConfig.name} is focused on right now.`,
  openGraph: { images: [`/og/now?title=${encodeURIComponent("Now")}`] },
};

// Update this by hand every few weeks — that irregularity is the point of a
// /now page (see nownownow.com). Don't automate it.
const lastUpdated = "2026-09-01";

export default function NowPage() {
  return (
    <>
      <PageHeader
        eyebrow="Now"
        title="What I'm focused on."
        description={`Last updated ${formatDate(lastUpdated)}. A /now page, in the tradition of nownownow.com — what's actually on my plate, not an evergreen bio.`}
      />
      <Section className="max-w-[760px] pt-0">
        <div className="prose prose-neutral dark:prose-invert">
          <h2>Work</h2>
          <p>
            Wrapping the Atlas Analytics dashboard rebuild and starting to
            scope a new project for {siteConfig.availability.label.toLowerCase()}.
          </p>
          <h2>Learning</h2>
          <p>
            Going deeper on motion design — specifically when restraint beats
            a flourish, which is most of the time.
          </p>
          <h2>Reading</h2>
          <p>
            A stack of books on editorial typography, mostly to steal ideas
            for how this site presents long-form writing.
          </p>
        </div>
      </Section>
    </>
  );
}
