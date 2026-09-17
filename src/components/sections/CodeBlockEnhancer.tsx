"use client";

import { useEffect, useRef } from "react";

/** Adds a "Copy" button to every <pre><code> block inside its children,
 * client-side, after mount. Keeps Prose's rendered HTML untouched so the
 * server output stays plain and cacheable. */
export default function CodeBlockEnhancer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const blocks = container.querySelectorAll("pre");
    const cleanups: Array<() => void> = [];

    blocks.forEach((pre) => {
      if (pre.querySelector("[data-copy-button]")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.copyButton = "true";
      button.textContent = "Copy";
      button.className =
        "absolute top-2 right-2 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted hover:text-fg hover:bg-surface-2";

      pre.style.position = "relative";
      pre.appendChild(button);

      const onClick = () => {
        const code = pre.querySelector("code")?.textContent ?? "";
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = "Copied";
          setTimeout(() => (button.textContent = "Copy"), 1500);
        });
      };

      button.addEventListener("click", onClick);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div ref={ref}>{children}</div>;
}
