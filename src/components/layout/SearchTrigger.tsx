"use client";

export default function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-command-palette"))
      }
      aria-label="Search (Command K)"
      className="border-border hover:bg-surface-2 text-muted hidden min-h-9 items-center gap-2 rounded-full border px-3 text-sm md:flex"
    >
      Search
      <kbd className="border-border bg-surface-2 rounded border px-1.5 py-0.5 text-xs">
        ⌘K
      </kbd>
    </button>
  );
}
