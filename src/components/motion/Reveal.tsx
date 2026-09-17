"use client";

import { motion, useReducedMotion as useMotionReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { useHasMounted } from "@/lib/hooks/useHasMounted";

export default function Reveal({
  children,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li";
}) {
  const prefersReducedMotion = useMotionReducedMotion();
  const mounted = useHasMounted();
  const MotionTag = as === "li" ? motion.li : motion.div;

  // Content must never depend solely on client JS to become visible: render
  // it plainly (fully opaque, no inline opacity:0) until mounted, and treat
  // the scroll-reveal animation as a progressive enhancement layered on top
  // once React has hydrated. Without this gate, `initial={{opacity:0}}` is
  // baked into the server-rendered HTML and only whileInView's
  // IntersectionObserver ever brings it back to opacity:1 — so any
  // hydration failure or delay (a blocked script, a slow connection, not
  // just the CSP issue this fixes) leaves the content stuck invisible.
  if (prefersReducedMotion || !mounted) {
    const StaticTag = as;
    return <StaticTag>{children}</StaticTag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
