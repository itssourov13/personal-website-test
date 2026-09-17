"use client";

import { useEffect, useState } from "react";

/** Thin progress bar under the header, tracking scroll through the
 * <article> element. Pure width transition — no reduced-motion concern
 * since it's not a decorative animation, it's a status indicator, but the
 * transition itself is short and harmless either way. */
export default function ReadingProgress({
  targetId = "article-content",
}: {
  targetId?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const onScroll = () => {
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div className="bg-border sticky top-16 z-30 h-0.5 w-full" aria-hidden="true">
      <div
        className="bg-accent h-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
