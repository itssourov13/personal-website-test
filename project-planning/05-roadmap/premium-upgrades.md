# Premium upgrade batch (post-P5/P6)

> Added outside the original 8-phase plan, at owner request, after P0–P6
> (code-level) were complete. Follows the same doc rule as everything else
> in this repo: behavior changes get logged (see decision-log.md D-033+).

## Shipped this batch

1. Command palette (⌘K / Ctrl+K) — nav + fuzzy search over work & writing
2. Reading progress bar + auto-generated table of contents on articles
3. Case-study cover images (cards + detail hero) — generated SVG placeholders,
   swap for real photography before launch
4. Dynamic per-page OG images (`/og/...`) wired into every page's metadata
5. Copy-link share row on articles/case studies + copy button on code blocks
6. Back-to-top control (appears after one viewport of scroll)
7. BreadcrumbList JSON-LD wired into work/writing detail pages
8. `/now` page (linked from About + footer + command palette)

## Considered, deliberately not built this batch

- **View Transitions API** for route changes — still unstable/experimental
  in the Next.js version this plan targets; revisit once stable, don't ship
  unverified browser-support gaps on a premium site.
- **Newsletter signup** — needs an ESP decision (F-20 in feature-list.md is
  already deferred); adding a form with nowhere for the data to go would be
  worse than not having one.
- **Custom cursor / magnetic buttons** — high visual risk vs. the site's
  restrained brand voice (design-guidelines.md); skipped as likely to read
  as gimmicky rather than premium.

## Still open (candidates for a future batch)

- Real photography to replace the generated SVG covers
- Command palette result ranking beyond simple substring match

---

# Batch 2 — unused-field cleanup + a few more premium touches

> Second pass, owner-requested. Priority this round: finish wiring fields
> that already existed in the schema/components but were never used
> (testimonial pull-quotes, series nav, the Marquee component), plus a
> handful of new small features. See decision-log.md D-034+.

## Shipped this batch

1. `/uses` page (tools & setup)
2. "Trusted by" wordmark marquee on the home page (first real use of the
   `Marquee` component built in batch 1)
3. Testimonial pull-quote embedded in case studies via the `testimonial`
   frontmatter field (existed since P3, never read anywhere until now)
4. Writing series support — `series` field (same story: existed, unused)
   now renders a "Part X of Y" badge + prev/next links within the series
5. `/resume` page with a dedicated print stylesheet (`window.print()`, no
   PDF generation tooling needed/available)
6. Smarter 404 — surfaces 3 recent work/writing items instead of just a
   "back home" link
7. `/feed.json` (JSON Feed 1.1) alongside the existing `/rss.xml`
8. Keyboard-shortcuts help overlay, opened with `?`, listing ⌘K and any
   other shortcuts as they're added

## Considered, deliberately not built this batch

- **Image gallery lightbox** for the `gallery` frontmatter field — the two
  sample case studies still don't have real photography to gallery, and a
  lightbox for zero images would just be dead code; revisit once real
  images exist.
- **Auto-advancing testimonial carousel** — the grid layout from batch 1
  already reads as considered; auto-advance risks feeling like a
  template default rather than a deliberate choice, and adds a
  reduced-motion edge case for no real gain.
