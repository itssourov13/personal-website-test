import Link from "next/link";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { getAllNotes, getAllWork } from "@/lib/content";

export default function NotFound() {
  const recentWork = getAllWork().slice(0, 2);
  const recentNotes = getAllNotes().slice(0, 1);
  const suggestions = [
    ...recentWork.map((item) => ({
      title: item.title,
      href: `/work/${item.slug}`,
      kind: "Work",
    })),
    ...recentNotes.map((item) => ({
      title: item.title,
      href: `/writing/${item.slug}`,
      kind: "Writing",
    })),
  ];

  return (
    <Section className="flex min-h-[70vh] flex-col items-start justify-center gap-6">
      <div>
        <p className="text-overline text-accent-strong">404</p>
        <h1 className="text-display-2 mt-2">This page wandered off.</h1>
        <p className="text-muted mt-4 max-w-md">
          The link might be broken, or the page moved. Here&apos;s where you
          might have been headed instead:
        </p>
      </div>

      {suggestions.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {suggestions.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:border-accent h-full transition-colors">
                <p className="text-faint text-xs">{item.kind}</p>
                <p className="mt-1 font-medium">{item.title}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}

      <Link
        href="/"
        className="bg-accent text-accent-foreground hover:bg-accent-strong min-h-11 rounded-full px-5 py-2.5 font-medium"
      >
        Back home
      </Link>
    </Section>
  );
}
