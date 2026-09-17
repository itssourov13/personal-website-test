# Accessibility Plan

> ✅ Approved baseline (D-015). Target: **WCAG 2.2 AA** across all pages — treated as a quality feature (Vision §4), not compliance paperwork. Premium experiences exclude nobody.

## 1. Standards & tooling

- Baseline: WCAG 2.2 AA (success criteria listed below). Keyboard-only + screen-reader + zoom pass required per page.
- Automated: axe-core via Playwright (`@axe-core/playwright`) in CI, every PR; Lighthouse a11y ≥ 98 gate.
- Manual: keyboard walkthrough checklist (below) run per phase + launch; SR spot-checks with VoiceOver (macOS) and NVDA (Windows, via owner) on: nav, menu, filters, form, case-study, notes.
- Reporting: violations = review-blocker; fix in same PR.

## 2. Structural & semantic foundation

- Landmarks: `header` (banner), `nav` (one main), `main` (unique), `footer` (contentinfo); `main` after SkipLink.
- Heading order: one `h1` per page; no skipped levels; content headings via `Prose`.
- Regions: `section` with accessible name when titled (`aria-labelledby`); lists for nav/labels; `article` for notes/case studies; `time` with `datetime` for dates.
- Language: `<html lang="en">` (owner's locale; i18n later F-25).
- Title: unique per page (metadata rule from SEO plan).
- Zoom: layout must survive 200% zoom (all breakpoints) and iOS 400% reader mode — no horizontal scroll traps, no fixed-height text containers.

## 3. Keyboard & focus

| Requirement | Spec |
|---|---|
| Full keyboard operability | All interactive elements reachable + operable (Enter/Space/Escape per control type) |
| Visible focus | `:focus-visible` ring 2 px `--focus-ring` + 2 px offset (tokens) on ALL interactive elements |
| Logical order | DOM order = visual order; no `tabindex > 0` |
| Skip link | First focusable: "Skip to content" → `#main` |
| Mobile nav | Open/close via button (`aria-expanded`, `aria-controls`); focus moves into menu; Trap + return focus to trigger on close; Escape closes |
| Filter chips | Radio-group semantics (`role="radiogroup"` or native buttons with `aria-pressed`) — decide in implementation, must announce result count (`role="status"`/`aria-live`) |
| Accordion (FAQ) | Native `<button>` + `aria-expanded` + `aria-controls`; heading wrapper; keyboard-safe |
| Page transitions | Focus management on route change: move to `main` heading (`tabindex="-1"`, `aria-label`); skip transitions under reduced motion |
| Form | Labels visible + programmatic; errors `aria-describedby` + `role="alert"` region; no error-only-color signaling |
| Dialog/toast | Toast (form success) `role="status"` + `aria-live="polite"`; announce result; no focus theft |

## 4. Content & media

- Images: meaningful `alt` (≤ 125 chars, describes the *lesson* of project screenshots: what changed/was achieved — brand policy); decorative `alt=""`; no `alt` = review-blocker.
- Links: descriptive text ("see how we rebuilt the checkout") — no "click here"; external links announce `aria-label` "Opens in new tab" + icon.
- Text: WCAG contrast (design-guidelines §2.1 table verified); body ≥ 16 px; no text in images.
- Motion: `prefers-reduced-motion: reduce` → all decorative motion off (Reveal static, counters show final, Lenis off, transitions instant, marquee static).
- `prefers-contrast: more` consideration: tokens designed to pass at default; verify selection & surface-2 contrast (documented).
- Focus not obscured: sticky header doesn't cover focused content (scroll-margin-top on sections: `scroll-mt-24`).

## 5. Forms (contact, the critical path)

- All fields: `<label>` visible; `required` + `aria-required`; autocomplete attributes (`name`, `email`, `organization`).
- Validation: on-blur + on-submit; message per field in plain language, linked via `aria-describedby`/`aria-invalid`; summary `role="alert"` on submit failure.
- Submit state announced (`aria-live` on status region); success message focusable + announced.
- Honeypot field: `aria-hidden` + `tabindex="-1"` + `autocomplete="off"` — invisible to SR users by design.
- No auto-submit, no countdown, no reCAPTCHA v2 checkbox (adds friction + tracking; honeypot/rate-limit chosen instead).

## 6. Reduced-motion & sensory design

- All animation components gate via `useReducedMotion`/CSS `@media (prefers-reduced-motion: reduce)` (animation-plan §5).
- No auto-playing media; no flashing content (WCAG 2.3); hover-only effects never hide content (WCAG 1.4.13 — focus + hover states equivalent).
- Touch: targets ≥ 44×44 (48 preferred per design-guidelines §8); spacing between interactive items ≥ 8 px.

## 7. Screen-reader QA script (per launch + quarterly)

1. Home: name, role, main landmark; hero statement read in order.
2. Header: nav list items + availability pill + theme toggle announced sensibly.
3. Mobile nav: open → focus lands, items announced, close returns focus.
4. Work: filter chips announce selection + result count; cards announce summary.
5. Case study: metric band values read; images alt meaningful; headings hierarchy.
6. Form: tab through, trigger errors (SR reads them), submit success announced.
7. Notes: reading time, progress bar `aria-hidden`, related links.
8. 404: announces not-found + recovery link.

## 8. Testing matrix (per page, pre-ship)

| Test | Tool | Gate |
|---|---|---|
| Automated axe scan | Playwright + axe | 0 violations / 0 serious-crit issues |
| Keyboard walkthrough | Manual script (§3) | All controls pass |
| Focus visibility | Manual | Ring visible on every control |
| Screen reader spot | VoiceOver/NVDA (§7) | §7 script passes |
| Zoom 200% + 400% | Browser | No loss of function/overlap/h-scroll |
| Reduced motion | DevTools emulate | No stray animation; content intact |
| Contrast audit | axe + manual (§4) | All AA text passes |
| TTS/reader mode | Reader mode test on notes | Clean article extraction |

## 9. Ownership & regressions

- Axe runs in CI on all routes (`/`, `/work`, `/work/[slug]`, `/about`, `/services`, `/writing`, `/writing/[slug]`, `/contact`, `/404`) — mobile + desktop.
- Any component change re-runs affected-page suite; a11y debt is a release blocker, same as a crash.
- Owner commits to quarterly manual SR pass (maintenance plan).
