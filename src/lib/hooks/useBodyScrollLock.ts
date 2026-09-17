"use client";

import { useEffect } from "react";

/** Locks background scroll while a modal/dialog is open — without this,
 * the page behind a fixed-position overlay can still scroll (mobile
 * touch-scroll in particular), which reads as broken/overlay bugs. */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
