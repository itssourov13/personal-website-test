import Link from "next/link";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import type { Work } from "@/lib/schema";

/** Prefers projects sharing a discipline tag with the current one (same
 * matching approach as `getRelatedNotes` for writing) — falls back to any
 * other project only if nothing overlaps, so a small catalog still always
 * shows something. */
export default function RelatedWork({
  items,
  currentSlug,
}: {
  items: Work[];
  currentSlug: string;
}) {
  const current = items.find((item) => item.slug === currentSlug);
  const others = items.filter((item) => item.slug !== currentSlug);

  const overlapping = current
    ? others.filter((item) => item.discipline.some((tag) => current.discipline.includes(tag)))
    : [];

  const related = (overlapping.length > 0 ? overlapping : others).slice(0, 2);
  if (related.length === 0) return null;

  return (
    <Section className="border-border border-t">
      <p className="text-overline text-accent-strong mb-6">More work</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {related.map((item) => (
          <Link key={item.slug} href={`/work/${item.slug}`}>
            <Card className="hover:border-accent h-full transition-colors">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted mt-2">{item.summary}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
