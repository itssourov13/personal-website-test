# Premium Design Concept & UI/UX Direction

> ✅ Approved baseline. This is the _concept_ — the concrete tokens, type, and component rules are in `01-brand/design-guidelines.md`. Read both before any UI work.

## 1. Concept name: **"The Printed Studio"**

> The site should feel like a beautifully printed studio monograph that happens to be alive on screen: warm paper, crisp ink, generous margins, one copper accent, and motion that behaves like a skilled bookbinder — quiet, precise, never gratuitous.

Three mental models that drive every decision:

1. **The monograph** — editorial grids, running type hierarchies, a table-of-contents-like nav, polished details at every spread (page).
2. **The atelier** — the owner's craft is the subject; typography and layout frame the work like a gallery wall, never compete with it.
3. **The fast machine** — under the paper surface is a ruthlessly optimized engine: sub-2 s LCP, zero layout shift, crisp 60 fps motion. Craft you can feel, not just see.

## 2. Experience principles (UX)

- **P1 — Ten-second clarity.** Above the fold answers: who, what, why me, what next. No hero-carousel, no auto-playing anything.
- **P2 — One job per page.** Each page has one primary CTA (visit the route spec: `03-architecture/routing-and-pages.md`). Secondary actions are visually quiet.
- **P3 — Show, don't tell.** Work is presented as evidence (screenshots, metrics, process artifacts) — minimal adjectives.
- **P4 — Nothing breaks.** Every state is designed: hover, focus, active, loading, error, empty, reduced-motion, no-JS, offline-ish, mid-scroll, mid-transition.
- **P5 — Motion with intent.** Animation communicates hierarchy and continuity (where did that element come from?), never just decorates.
- **P6 — The details are the brand.** Breadcrumb spacing, micro-copy, focus rings, the 404 — each is a chance to demonstrate care.

## 3. Visual direction (see `design-guidelines.md` for the exact system)

### 3.1 Palette story: **Paper & Ink, one copper thread**

- Light: warm off-white paper (`--bg #F7F5F1`), warm near-black ink (`--fg #191714`), one accent: burnt copper (`--accent #B45F3E`) for links, focus, key numbers, the wordmark full stop.
- Dark: reverse — near-black warm (#141312) paper, cream ink (#F2EFEA), lightened copper (#D8906B) for contrast.
- No rainbow palettes. Neutrals are warm-tinted (never pure gray/blue-gray) — that's half the "premium" feel.

### 3.2 Type story: **Serif soul + sans clarity**

- Fraunces (variable, optical size axis) for display/headings — distinctive, editorial, human. Letter-spaced slightly negative.
- Inter for UI/body — invisible, fast, legible at all sizes.
- One accent typeface only; system fallbacks documented. No third font in v1 (D-020).

### 3.3 Layout story: **The gallery wall**

- 12-column grid, max content width 1200 px, generous gutters; prose width capped at 760 px (measures of 60–75 chars).
- Alternating rhythm: full-bleed moments (hero, case-study imagery) against quiet, airy sections.
- Section spacing ≥ 96 px desktop / 64 px mobile — whitespace is the luxury.
- Hairline borders (`--border`) instead of heavy cards; cards use 1 px borders + soft shadows, rarely filled panels.

### 3.4 Image & asset treatment

- Project imagery: browser-frame screenshots on warm-tinted backgrounds, subtle 3D tilt on hover (desktop only, reduced-motion off).
- Consistent grading: warm highlights, soft shadows, slight desaturation — a single look across all photos.
- Photography: over-edited = fast-food; this brand is slow food.

### 3.5 Motion story (details: `04-strategy/animation-plan.md`)

- **Entrance:** single elegant intro sequence on Home (wordmark + statement line, ~600 ms, decelerate easing); all other pages fade/slide up subtly (300–400 ms).
- **Scroll:** elements reveal once when they enter the viewport (staggered, 40–80 ms offsets); reveal distance small (16–24 px) — restraint is key.
- **Micro:** links underline slide; buttons' arrows nudge; cards lift 2 px with a copper hairline; theme toggle performs a 250 ms crossfade.
- **Page transitions:** View Transitions API where supported, Motion fallback; fade + 8 px rise, 250 ms — content moves forward, feels physical.
- **Scrolling:** Lenis smooth scroll (default on), disabled entirely when `prefers-reduced-motion: reduce` or on mobile where native is faster/cheaper.
- Counters (metrics) count up once on reveal. Marquee of client names: slow, edge-faded, pauses on hover.

## 4. UI/UX ideas worth prototyping (ranked)

| #   | Idea                                                                              | Value                       | Effort | Phase         |
| --- | --------------------------------------------------------------------------------- | --------------------------- | ------ | ------------- |
| 1   | Hero = one perfect sentence + wordmark + availability pill ("booking Q4 2026")    | High — instant clarity (P1) | Low    | P2            |
| 2   | Case studies as evidence stories (problem → process → outcome, with metrics band) | High — conversion           | Med    | P3            |
| 3   | Work index filters (discipline / industry) with animated layout transitions       | Med-High                    | Med    | P3            |
| 4   | Selected-work spotlight on Home with hover preview (media swap)                   | High — show don't tell      | Med    | P2            |
| 5   | "Handshake" footer CTA: "Let's make something exceptional." + mailto/form         | High — conversion           | Low    | P2            |
| 6   | Reading-time + progress bar on notes (thin copper line)                           | Med — trust + delight       | Low    | P4            |
| 7   | Sticky header that shrinks + gains hairline border on scroll                      | Low-Med — polish            | Low    | P2            |
| 8   | Availability pill in header (public calendar link later, F-13)                    | High — lead gen             | Low    | P2            |
| 9   | Testimonial "ticket" cards — quote, attribution, project link                     | Med                         | Low    | P3            |
| 10  | Keyboard command palette (⌘K) for work/notes — playful but useful                 | Med                         | Med    | P5+ (F-22)    |
| 11  | Cursor-follow copper glow (desktop, pointing devices only)                        | Low-Med — delight           | Med    | P4 (optional) |
| 12  | Service pages with "typical engagement" timeline graphic                          | Med — de-risks hiring       | Med    | P3            |

Prototype #1, #4, #6, #8 in P2–P4. Others are optional; ship only if quality bar holds.

## 5. What "premium" looks like concretely on this site (checklist)

- [ ] Every page < 2 s LCP on 4G; no layout shift while fonts/images load
- [ ] No lorem ipsum anywhere; error/empty states designed
- [ ] Focus ring matches accent; visible on every interactive element
- [ ] Dark/light both look intentional (no "dark mode = invert" laziness)
- [ ] All images AVIF/WebP responsive with correct aspect ratios
- [ ] Typography hierarchy legible at 200% zoom and on 320 px screens
- [ ] Reduced-motion = fully usable, graceful, still "designed"
- [ ] 404 designed with one helpful action (back to work)

## 6. Anti-patterns to reject (test every proposal against these)

Hero carousels · auto-playing video/audio · confetti/gradients-on-everything · glassmorphism spam · giant emoji · comic/script fonts · pure-gray palette · 8 different shapes of buttons · marquee-as-identity · cursor-torch effects · "wow" animations that slow the page · cookie banners · newsletter pop-ups (in v1) · fake social counters.

## 7. Design process going forward

1. Every new UI surface: sketch in tokens first (colors/spacing/type from `design-guidelines.md`), then build.
2. Every component: satisfies P4 (all states) before merging; a11y + reduced-motion review is part of "done".
3. Visual QA is done on a phone (320 px), a laptop (1440 px), and a 4K display before any page is "done".
4. Deviations → Decision Log, not silent shortcuts.
