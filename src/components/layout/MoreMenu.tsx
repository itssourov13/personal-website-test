"use client";

import { useRef, useState } from "react";

import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import type { NavItem } from "@/lib/site.config";
import { cn } from "@/lib/utils";

import NavLink from "./NavLink";

/**
 * Desktop-only disclosure menu for secondaryNav. Before this, secondary
 * pages (Services, Contact, Now, Ideas, Life, Photography, Lab, Topics,
 * Uses, Resume, Colophon, Bookmarks) had no visible desktop entry point —
 * only the footer and the ⌘K command palette. Mobile already sees
 * everything via MobileNav.
 *
 * Dismissal is focus-based (close on blur leaving the wrapper, or Escape)
 * rather than a global pointerdown listener — simpler, and avoids the
 * containing-block class of bug already found in MobileNav (see
 * decision-log.md D-037): this wrapper is `position: relative` from the
 * start so the panel's containing block is never ambiguous.
 */
export default function MoreMenu({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="more-menu-panel"
        onClick={() => setOpen((value) => !value)}
        className="hover:bg-surface-2 flex min-h-11 items-center gap-1 rounded-full px-4 text-sm font-medium"
      >
        More
        <ChevronDownIcon className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          id="more-menu-panel"
          role="menu"
          aria-label="More"
          className="border-border bg-surface absolute right-0 top-full z-50 mt-2 w-56 rounded-md border py-2 shadow-lg"
        >
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={close}
              className="hover:bg-surface-2 flex min-h-11 items-center px-4 text-sm font-medium"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
