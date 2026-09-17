"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Moves focus to <main> on client-side route changes so screen-reader and
 * keyboard users land somewhere sensible instead of staying on a now-stale
 * nav link (accessibility-plan.md §3, "page transitions"). Renders nothing;
 * skips the very first render so the browser's own initial-load focus is
 * left alone. */
export default function RouteFocus() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    document.getElementById("main-content")?.focus();
  }, [pathname]);

  return null;
}
