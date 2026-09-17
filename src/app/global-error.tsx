"use client";

// Catches errors thrown by the root layout itself (rare — most errors are
// caught by the nested error.tsx). Must render its own <html>/<body> since
// the root layout is what failed.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: "4rem 1.5rem" }}>
        <h1>Something went wrong.</h1>
        <p>Please try reloading the page.</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </body>
    </html>
  );
}
