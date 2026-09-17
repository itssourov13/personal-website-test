# Prompt 02 — Core Shell & Design System (P1)

> Copy-paste into a fresh AI agent session. Prerequisite: `01-project-bootstrap.md` completed (P0 green).

---

**ROLE:** A meticulous design-engineer implementing the production design system for a premium personal website ("The Printed Studio" concept).

**READ FIRST:**
1. `project-planning/README.md` §2 (if not yet read this session)
2. `01-brand/design-guidelines.md` — **normative**: implement §2 color ramps (light+dark), §3 type system, §4 spacing/radius/shadow tokens exactly
3. `01-brand/design-concept.md` + `ui-ux-ideas.md` §3 (nav) and §8 (states)
4. `03-architecture/component-architecture.md` — layered model & API sketches
5. `03-architecture/folder-structure.md` §1–§3 — exact file locations
6. `04-strategy/accessibility-plan.md` §2–§4 (landmarks, focus, nav menu)
7. `05-roadmap/task-breakdown.md` P1 tasks

**TASK (Phase P1 — Core Shell & Design System).** Tasks P1-1…P1-11:
- `globals.css`: complete CSS-variable tokens (both themes) + Tailwind v4 `@theme` mapping (so `bg-bg`, `text-fg`, `text-muted`, `border-border`, `accent-*`, `surface-*` work) + base styles + grain data-URI (≤ 8 KB, opacity .03).
- Fonts via `next/font` — Fraunces (variable, opsz) + Inter; `display: swap`, subsets.
- `lib/site.config.ts` implementing the §3 shape (SiteConfig type with `as const satisfies`): name/domain/tagline/description/email/availability/nav/socials/metrics. Use the **placeholder persona values from notes-and-assumptions A-001/A-002** and mark them clearly for later replacement.
- Primitives (`components/ui/`): Button (variants primary|secondary|ghost|link, sizes, `loading`, `asChild`), Link (external detection: rel + icon), Badge/Pill, Card, Section (eyebrow/title/intro/padding layouts), Prose (typography plugin wrapper), Input/Textarea/Field (label, error, hint, aria wiring), Spinner/Skeleton — per component-architecture §2 API sketches.
- Layout composites: Header (sticky, transparent→surface+hairline `useScrolled` hook, nav from config, AvailabilityPill slot), Footer (4 zones, dynamic year, colophon "Designed & built by …no trackers, no cookies"), ThemeToggle (next-themes, no-flash, crossfade), MobileNav (overlay, focus trap, Escape, `aria-expanded`, staggered entrance), SkipLink.
- Root `layout.tsx`: metadata template (`%s — Sourov Mondol`), fonts, providers, Header/Footer, `<html lang="en">`, landmarks, `manifest.ts` (PWA meta).
- Custom `not-found.tsx` per ui-ux-ideas §3/§7 (recovery action) + `error.tsx` styled shell.

**ACCEPTANCE CRITERIA:**
- Grep check: no raw hex/rgb outside `globals.css` and design-guidelines-exempt files
- Lighthouse ≥ 90 on the stub home; axe 0 critical; keyboard full walkthrough passes (nav → menu → toggle → 404)
- Theme: first-visit respects `prefers-color-scheme`; toggle persists; NO flash on reload
- Mobile nav: focus trap works, Escape closes, focus returns to trigger, `aria-expanded` correct; JS-off still shows static links
- Every interactive element ≥ 44 px and shows `--focus-ring` styling
- All component files match `folder-structure.md` paths
- Decision Log entry: design system shipped, fonts/tokens versions, any token deviations (expected: none)

**CONSTRAINTS:** D-017 tokens-only · D-002 strict · D-015 a11y · D-016 no new runtime deps beyond approved (next-themes, motion — from tech-stack table; do not add more) · Motion import only where the plan lists client components (ThemeToggle, MobileNav) — Lenis NOT yet wired (P4).

**VERIFY:** the four gates + `grep -rnE '#[0-9a-fA-F]{3,8}' src --exclude=globals.css` clean; report Lighthouse/axe numbers and the theme-no-flash test method used.

**OUTPUT:** summary (< 15 lines) + evidence + next suggestion (`03-home-page.md`).
