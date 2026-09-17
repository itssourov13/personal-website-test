import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Set false for cards that manage their own inner spacing (e.g. a cover
   * image flush to the edge, with padding only on the text below it).
   * Never override padding via className — our cn() helper is a plain
   * string-join, not a Tailwind-merge: a conflicting class like `p-0` can
   * land in the DOM alongside `p-6` with no guaranteed winner. */
  padded?: boolean;
};

export default function Card({
  className,
  children,
  padded = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface shadow-sm",
        padded && "p-6 md:p-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
