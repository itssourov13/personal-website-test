"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Cover image with a real fallback: if `src` is missing, or the image
 * fails to load, renders a token-based gradient placeholder instead of
 * leaving an empty/broken box. This is a client component specifically so
 * the onError handler can work — the parent (a server component card grid)
 * stays server-rendered.
 *
 * The raw <img> below is deliberate: next/image can't express an onError
 * fallback, and the sources are local, hand-rolled SVGs that gain nothing
 * from the optimizer.
 */
export default function CoverImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;
  const isDecorative = alt === "";

  if (showFallback) {
    return (
      <div
        role={isDecorative ? undefined : "img"}
        aria-label={isDecorative ? undefined : alt}
        aria-hidden={isDecorative || undefined}
        className={cn(
          "from-accent-soft to-surface-2 flex items-center justify-center bg-gradient-to-br",
          className,
        )}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="text-accent-strong opacity-60"
        >
          <circle cx="16" cy="16" r="10" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
