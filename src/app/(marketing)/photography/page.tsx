import type { Metadata } from "next";
import Link from "next/link";

import EmptyState from "@/components/sections/EmptyState";
import PageHeader from "@/components/sections/PageHeader";
import CoverImage from "@/components/ui/CoverImage";
import Section from "@/components/ui/Section";
import { photos } from "@data/photos";

export const metadata: Metadata = {
  title: "Photography",
  description: "A personal collection of photographs.",
  openGraph: {
    images: [`/og/photography?title=${encodeURIComponent("Photography")}`],
  },
  // Thin/empty section: don't index until there's something real to show.
  robots: photos.length === 0 ? { index: false, follow: true } : undefined,
};

export default function PhotographyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Photography"
        title="A personal collection."
        description="Not client work — just photographs, added as they're worth keeping."
      />
      <Section className="pt-0">
        {photos.length === 0 ? (
          <EmptyState
            title="Nothing here yet."
            description="Real photographs will fill this in over time — not a stock gallery standing in for one."
          >
            <Link
              href="/work"
              className="text-accent-strong text-sm font-medium hover:underline"
            >
              See the work instead →
            </Link>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure
                key={photo.src}
                className={
                  photo.featured
                    ? "overflow-hidden rounded-md sm:col-span-2 sm:row-span-2"
                    : "overflow-hidden rounded-md"
                }
              >
                <CoverImage
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/5] w-full object-cover"
                />
                {photo.caption ? (
                  <figcaption className="text-muted mt-2 text-sm">
                    {photo.caption}
                    {photo.location ? (
                      <span className="text-faint"> · {photo.location}</span>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
