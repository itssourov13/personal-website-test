import type { Metadata } from "next";

import PageHeader from "@/components/sections/PageHeader";
import Section from "@/components/ui/Section";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Colophon",
  description: `How ${siteConfig.domain} is built.`,
  openGraph: {
    images: [`/og/colophon?title=${encodeURIComponent("Colophon")}`],
  },
};

const sections = [
  {
    title: "Technology",
    body: "Next.js (App Router) with TypeScript in strict mode. Content is authored as Markdown/MDX with zod-validated frontmatter, read directly from the filesystem at build time — no headless CMS. Forms use React Hook Form + zod; the contact endpoint is a Next.js route handler with a honeypot, a time-trap, and rate limiting.",
  },
  {
    title: "Design",
    body: "Every color, radius, spacing value, and shadow is a CSS custom property, mapped into Tailwind v4 through its CSS-first @theme — no hard-coded hex values in components. Light and dark are both first-class, not a dark mode bolted on afterward.",
  },
  {
    title: "Typography",
    body: "Fraunces for display type, Inter for text, both loaded through next/font so there's no layout shift waiting on a web font. Body copy sits in a measured content width rather than stretching edge to edge.",
  },
  {
    title: "Motion",
    body: "Scroll reveals, the metric counters, and the command palette are all built with restraint on purpose — everything respects prefers-reduced-motion, most of it by disabling outright rather than just shortening.",
  },
  {
    title: "Performance",
    body: "Static generation wherever content allows it, system fonts as a fallback, no client-side data fetching on first paint. Target budgets: LCP ≤ 1.8s, INP ≤ 200ms, CLS ≤ 0.05, initial JS ≤ 150KB gzipped.",
  },
  {
    title: "Accessibility",
    body: "Keyboard-navigable throughout, including a real focus trap in the mobile nav and the command palette. Skip link, visible focus rings, semantic landmarks, and route-change focus management so screen-reader and keyboard users land somewhere sensible after navigating.",
  },
  {
    title: "Privacy",
    body: "No cookies, no third-party trackers, no ad network. Analytics, where enabled, are cookie-less and aggregate-only.",
  },
  {
    title: "Hosting",
    body: "Built to deploy on Vercel's edge network; the OG-image and Apple-touch-icon routes run on the edge runtime specifically so social previews render fast.",
  },
];

export default function ColophonPage() {
  return (
    <>
      <PageHeader
        eyebrow="Colophon"
        title="How this site is built."
        description="A short, honest note on the technical and design decisions behind this website — not a documentation dump."
      />
      <Section className="max-w-[760px] pt-0">
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
              <p className="text-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
