"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { siteConfig } from "@/lib/site.config";

type Item = { label: string; href: string; group: string };

export default function CommandPalette({
  work,
  notes,
  lab,
  ideas,
  topics,
}: {
  work: Array<{ title: string; slug: string }>;
  notes: Array<{ title: string; slug: string }>;
  lab: Array<{ title: string; slug: string }>;
  ideas: Array<{ title: string; slug: string }>;
  topics: Array<{ label: string; slug: string }>;
}) {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const items: Item[] = useMemo(
    () => [
      ...siteConfig.nav.map((item) => ({
        label: item.label,
        href: item.href,
        group: "Go to",
      })),
      ...siteConfig.secondaryNav.map((item) => ({
        label: item.label,
        href: item.href,
        group: "Go to",
      })),
      ...work.map((item) => ({
        label: item.title,
        href: `/work/${item.slug}`,
        group: "Work",
      })),
      ...notes.map((item) => ({
        label: item.title,
        href: `/writing/${item.slug}`,
        group: "Writing",
      })),
      ...lab.map((item) => ({
        label: item.title,
        href: `/lab/${item.slug}`,
        group: "Lab",
      })),
      ...ideas.map((item) => ({
        label: item.title,
        href: `/ideas/${item.slug}`,
        group: "Ideas",
      })),
      ...topics.map((topic) => ({
        label: topic.label,
        href: `/topics/${topic.slug}`,
        group: "Topics",
      })),
    ],
    [work, notes, lab, ideas, topics],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;
      if (isMeta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    const onOpenRequest = () => setOpen(true);

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenRequest);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenRequest);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) go(item.href);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation"
      className="bg-fg/30 fixed inset-0 z-50 flex items-start justify-center px-4 pt-24"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="bg-surface border-border w-full max-w-lg rounded-md border shadow-lg">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search pages, work, writing…"
          aria-label="Search"
          aria-activedescendant={
            filtered[activeIndex] ? `cmdk-${activeIndex}` : undefined
          }
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          className="border-border min-h-12 w-full border-b bg-transparent px-4 text-base outline-none"
        />
        <ul
          id="cmdk-list"
          role="listbox"
          className="max-h-80 overflow-y-auto py-2"
        >
          {filtered.length === 0 ? (
            <li className="text-muted px-4 py-3 text-sm">No results.</li>
          ) : (
            filtered.map((item, index) => (
              <li
                key={item.href}
                id={`cmdk-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <div
                  role="button"
                  tabIndex={-1}
                  onClick={() => go(item.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm ${
                    index === activeIndex
                      ? "bg-accent-soft text-accent-strong"
                      : "text-fg"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-faint text-xs">{item.group}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
