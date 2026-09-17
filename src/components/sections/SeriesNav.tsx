import Link from "next/link";

import type { Note } from "@/lib/schema";

export default function SeriesNav({
  seriesName,
  items,
  currentSlug,
}: {
  seriesName: string;
  items: Note[];
  currentSlug: string;
}) {
  if (items.length < 2) return null;

  const index = items.findIndex((item) => item.slug === currentSlug);
  const prev = index > 0 ? items[index - 1] : undefined;
  const next = index < items.length - 1 ? items[index + 1] : undefined;

  return (
    <div className="border-border bg-surface-2 mb-8 rounded-md border p-5">
      <p className="text-overline text-accent-strong mb-1">
        {seriesName} · Part {index + 1} of {items.length}
      </p>
      <ol className="text-muted mb-3 flex flex-col gap-1 text-sm">
        {items.map((item, i) => (
          <li key={item.slug}>
            {item.slug === currentSlug ? (
              <span className="text-fg font-medium">
                {i + 1}. {item.title}
              </span>
            ) : (
              <Link href={`/writing/${item.slug}`} className="hover:underline">
                {i + 1}. {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <div className="flex justify-between gap-4 text-sm font-medium">
        {prev ? (
          <Link href={`/writing/${prev.slug}`} className="hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/writing/${next.slug}`} className="hover:underline">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
