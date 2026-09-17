"use client";

import { useState } from "react";

export default function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="button"
        onClick={copyLink}
        className="border-border hover:bg-surface-2 min-h-9 rounded-full border px-4 text-sm font-medium"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${
          typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""
        }`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (opens in a new tab)"
        className="border-border hover:bg-surface-2 min-h-9 rounded-full border px-4 text-sm font-medium"
      >
        Share on X
      </a>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
