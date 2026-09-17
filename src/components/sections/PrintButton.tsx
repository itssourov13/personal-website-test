"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border-border hover:bg-surface-2 min-h-11 shrink-0 rounded-full border px-5 py-2.5 font-medium"
    >
      Print / Save as PDF
    </button>
  );
}
