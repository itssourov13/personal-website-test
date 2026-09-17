import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — background, approach, and how I work.`,
  openGraph: { images: [`/og/about?title=${encodeURIComponent("About " + siteConfig.name)}`] },
};

const principles = [
  {
    title: "Design and code are one craft, not a handoff",
    description:
      "I stay in the work from sketch to shipped build. A lot of the decisions that make a product feel right only become obvious once you're the one wiring up the form.",
  },
  {
    title: "The unglamorous parts are where trust is won or lost",
    description:
      "Loading states, error copy, the edge case that shows up in week six — that's where most products actually earn or lose someone's confidence, not in the hero shot.",
  },
  {
    title: "Honest about what didn't work",
    description:
      "Case studies on this site include the approach that got cut, not just the one that shipped. A result without the messy middle isn't useful to anyone deciding whether to work with me.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`Hi, I'm ${siteConfig.shortName}.`}
        description="I'm an independent product designer and engineer based on the idea that the person who designs a product should be able to help build it."
      />
      <Section className="max-w-[760px] pt-0">
        <div className="prose prose-neutral dark:prose-invert">
          <p>
            Over the last {siteConfig.metrics[0]?.value}+ years I&apos;ve
            worked with founders and small teams to take products from a
            rough idea to something people actually use — usually wearing
            both the design and engineering hats, sometimes handing off to a
            larger team once the direction is set.
          </p>
          <p>
            When I&apos;m not working, I&apos;m usually reading about
            typography, tinkering with the site you&apos;re on right now, or
            trying to get better at the things I write about on the{" "}
            <a href="/writing">writing page</a>. See what I&apos;m focused on
            right now on the <a href="/now">/now page</a>.
          </p>
        </div>
      </Section>

      <Section className="border-border border-t pt-16">
        <p className="text-overline text-accent-strong mb-2">How I work</p>
        <h2 className="text-display-2 mb-10 max-w-lg">
          A few things I hold to on every project.
        </h2>
        <div className="flex flex-col gap-8">
          {principles.map((principle) => (
            <div key={principle.title} className="border-border border-t pt-6 first:border-t-0 first:pt-0">
              <h3 className="text-lg font-semibold">{principle.title}</h3>
              <p className="text-muted mt-2 max-w-2xl">{principle.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface-2 flex flex-col items-start gap-4 border-t border-border">
        <h2 className="text-display-2 max-w-lg">
          If that sounds like the right fit, let&apos;s talk.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="min-h-11 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-accent-strong"
          >
            Get in touch
          </Link>
          <Link
            href="/work"
            className="border-border hover:bg-surface-2 min-h-11 rounded-full border bg-transparent px-6 py-3 font-medium"
          >
            See the work
          </Link>
        </div>
      </Section>
    </>
  );
}
