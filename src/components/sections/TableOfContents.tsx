import type { Heading } from "@/lib/content";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <p className="text-overline text-accent-strong mb-3">On this page</p>
      <ul className="border-border flex flex-col gap-2 border-l pl-4 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.depth === 3 ? "ml-3" : undefined}
          >
            <a href={`#${heading.id}`} className="text-muted hover:text-fg">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
