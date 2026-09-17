import type { Metadata } from "next";

import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Uses",
  description: `Hardware, software, and tools ${siteConfig.name} uses day to day.`,
  openGraph: { images: [`/og/uses?title=${encodeURIComponent("Uses")}`] },
};

const groups = [
  {
    title: "Hardware",
    items: [
      "14-inch laptop, external monitor for design work",
      "A mechanical keyboard, because the sound matters more than it should",
      "A basic drawing tablet for quick annotation, not illustration",
    ],
  },
  {
    title: "Design",
    items: [
      "Figma for everything from wireframe to hand-off",
      "A hand-built token library shared across client projects",
    ],
  },
  {
    title: "Engineering",
    items: [
      "Next.js + TypeScript for almost everything shipped in the last two years",
      "Tailwind CSS, kept to a token layer rather than ad-hoc utility soup",
      "A terminal-based editor for anything that isn't visual design",
    ],
  },
  {
    title: "Everything else",
    items: [
      "A plain-text task list — no project management tool has stuck",
      "Notion for the messy in-between notes that don't belong anywhere yet",
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Uses"
        title="What I actually work with."
        description="The tools behind the work — updated occasionally, not chased for its own sake."
      />
      <Section className="max-w-[760px] pt-0">
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-xl font-semibold">{group.title}</h2>
              <ul className="text-muted flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent-strong" aria-hidden="true">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
