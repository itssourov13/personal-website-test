"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";

type NavLinkProps = ComponentPropsWithRef<typeof Link>;

// React 19 / Next 15: function components accept `ref` as a plain prop, no
// forwardRef wrapper needed.
export default function NavLink({ href, className, children, ref, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href.toString());

  return (
    <Link
      ref={ref}
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(className, isActive && "text-accent-strong font-semibold")}
      {...props}
    >
      {children}
    </Link>
  );
}
