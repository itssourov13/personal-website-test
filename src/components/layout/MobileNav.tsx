"use client";

import { useEffect, useRef, useState } from "react";

import type { NavItem } from "@/lib/site.config";

import NavLink from "./NavLink";

export default function MobileNav({
  primary,
  secondary,
}: {
  primary: NavItem[];
  secondary: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Focus the first item on open; trap Tab within the menu; Escape closes
  // and returns focus to the trigger (accessibility-plan §3).
  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable =
        menuRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-surface-2 flex h-11 w-11 items-center justify-center rounded-full"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {open ? (
            <path
              d="M4 4l12 12M16 4L4 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M2 5h16M2 10h16M2 15h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open ? (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile"
          ref={menuRef}
          className="border-border bg-surface absolute inset-x-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain border-t px-5 py-4 shadow-lg"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  close();
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }}
                className="hover:bg-surface-2 flex min-h-11 w-full items-center justify-between rounded-md px-3 text-base font-medium"
              >
                Search
                <kbd className="border-border bg-surface-2 rounded border px-1.5 py-0.5 text-xs font-normal">
                  ⌘K
                </kbd>
              </button>
            </li>
            {primary.map((item, index) => (
              <li key={item.href}>
                <NavLink
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={close}
                  className="hover:bg-surface-2 flex min-h-11 items-center rounded-md px-3 text-base font-medium"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="text-overline text-faint mt-4 mb-1 px-3">More</p>
          <ul className="flex flex-col gap-1">
            {secondary.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={close}
                  className="hover:bg-surface-2 flex min-h-11 items-center rounded-md px-3 text-base font-medium"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
