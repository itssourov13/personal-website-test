"use client";

import { useEffect, useState } from "react";

import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";

const shortcuts = [
  { keys: "⌘K / Ctrl K", description: "Open search & quick navigation" },
  { keys: "Esc", description: "Close any open menu or dialog" },
  { keys: "?", description: "Show this list" },
];

export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "?" && !isTyping) {
        event.preventDefault();
        setOpen((v) => !v);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className="bg-fg/30 fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="bg-surface border-border w-full max-w-sm rounded-md border p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Keyboard shortcuts</h2>
        <dl className="flex flex-col gap-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between gap-4">
              <dt className="text-muted text-sm">{shortcut.description}</dt>
              <dd>
                <kbd className="border-border bg-surface-2 rounded border px-2 py-1 text-xs">
                  {shortcut.keys}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border-border hover:bg-surface-2 mt-6 min-h-9 w-full rounded-full border text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
