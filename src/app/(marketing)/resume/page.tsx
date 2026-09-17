import type { Metadata } from "next";

import PrintButton from "@/components/sections/PrintButton";
import Section from "@/components/ui/Section";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Resume",
  description: `${siteConfig.name}'s resume — experience, skills, and background.`,
  openGraph: { images: [`/og/resume?title=${encodeURIComponent("Resume")}`] },
};

const experience = [
  {
    role: "Independent product designer & engineer",
    org: "Self-employed",
    period: "2019 — present",
    points: [
      "Design and build end-to-end products for founders and small teams",
      "Recent clients: Northwind, Atlas Analytics, Fernway",
    ],
  },
  {
    role: "Senior product designer",
    org: "Confidential, pre-IPO SaaS",
    period: "2016 — 2019",
    points: [
      "Owned design for the core product surface across web and mobile",
      "Built and maintained the company's first design system",
    ],
  },
];

export default function ResumePage() {
  return (
    <>
      <Section className="print:pt-0 flex flex-col gap-2 pt-32 pb-4 md:pt-40">
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-display-2">{siteConfig.name}</h1>
            <p className="text-muted mt-2 max-w-lg text-lg">{siteConfig.tagline}</p>
          </div>
          <PrintButton />
        </div>
        <div className="hidden print:block">
          <h1 className="text-2xl font-semibold">{siteConfig.name}</h1>
          <p className="text-sm">
            {siteConfig.tagline} · {siteConfig.email} · {siteConfig.domain}
          </p>
        </div>
      </Section>

      <Section className="max-w-[760px] pt-0 print:pt-2">
        <h2 className="mb-4 text-xl font-semibold print:text-base">Experience</h2>
        <div className="flex flex-col gap-8 print:gap-4">
          {experience.map((job) => (
            <div key={job.role}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium print:text-sm">{job.role}</h3>
                <p className="text-faint text-sm print:text-xs">{job.period}</p>
              </div>
              <p className="text-muted text-sm print:text-xs">{job.org}</p>
              <ul className="text-muted mt-2 flex flex-col gap-1 text-sm print:text-xs">
                {job.points.map((point) => (
                  <li key={point}>— {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
