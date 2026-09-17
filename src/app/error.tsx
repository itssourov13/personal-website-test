"use client";

import { useEffect } from "react";

import Section from "@/components/ui/Section";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[60vh] flex-col items-start justify-center gap-4">
      <p className="text-overline text-danger">Something broke</p>
      <h1 className="text-display-2">This page hit an error.</h1>
      <p className="text-muted max-w-md">
        That&apos;s on me, not you. Try again, or head back to the homepage.
      </p>
      <button
        type="button"
        onClick={reset}
        className="min-h-11 rounded-full bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:bg-accent-strong"
      >
        Try again
      </button>
    </Section>
  );
}
