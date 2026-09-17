# Responsive Design Strategy

> ✅ Approved baseline. Mobile-first, fluid, no breakpoint hacks. The mobile experience is a first-class design pass, not a squeezed desktop (accessibility plan §2 zoom rules apply on top).

## 1. Principles

1. **Mobile-first authoring** — build at 375 px, enhance upward; every layout decision starts from the smallest screen.
2. **Fluid by default** — fluid type (clamp tokens), fluid spacing (space scale + `min()` where useful), grids that collapse naturally.
3. **Content parity** — nothing desktop-only that matters (except decorative motion); no "view desktop version" links.
4. **Touch-first on small screens** — 44+ px targets, thumb-zone CTAs, no hover-dependent interactions (hover is enhancement only).
5. **Safe & complete at every size** — 320 px, 375, 768, 1024, 1440, 2560; 200% zoom; landscape phones; split-screen; foldables if owner cares (nice-to-have).

## 2. Breakpoint system (Tailwind defaults + our usage)

| Token | Min-width | Used for |
|---|---|---|
| `sm` | 640 px | Multi-column meta rows, 2-col grids |
| `md` | 768 px | Cards grid 2→3, footer 2-col |
| `lg` | 1024 px | Desktop nav replaces hamburger; hero side-by-side; 12-col grid rolls out |
| `xl` | 1280 px | Max-width 1200 content constraint kicks in |
| `2xl` | 1536 px | Rare: oversized imagery padding |

Rules: breakpoints are **increase-only** (mobile-first); never query `max-width` for layout (exceptions: sticky-header shrink, motion, print).

## 3. Layout adaptation table

| Component/Page | 320–639 | 640–1023 | 1024+ |
|---|---|---|---|
| Header | Wordmark + availability dot + hamburger | same | Full nav + pill + toggle |
| Hero (Home) | Stacked; Display1 clamp | same | Statement max 26 chars/line; optional secondary column with portrait/artifact |
| Work grid | 1 col | 2 col | 3 col (2 featured span) |
| Case study | Stacked; metric band 2×2 | metric band 2×2 | metric band 4-in-row; side context rail |
| Services cards | 1 col | 2 col | 3 col |
| Notes list | 1 col | 2 col | 1 col + sidebar (tags, RSS) at xl |
| Prose width | full (≤ 76ch) | full | 760 px centered |
| Footer | stacked zones | 2×2 | 4-col |

## 4. Fluid type & spacing (tokens already defined in design-guidelines §3–4)

- Display sizes: `clamp()` values per design-guidelines — verified at 320/375/768/1440.
- Section rhythm: 64 px mobile → 96 px+ desktop (`py-16 md:py-24`).
- Gutter: 20 px mobile → 48 px desktop (`px-5 lg:px-12` with max-w container).
- Never allow horizontal scroll: test `overflow-x` audit in CI (Playwright assert `scrollWidth <= innerWidth`).

## 5. Imagery & media

- `next/image` with correct `sizes` per breakpoint (e.g., `(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw`).
- Hero images: 2 densities (1x/2x) via pipeline; AVIF; aspect-ratio reserved (CLS 0).
- Gallery: horizontal snap-scroll on mobile (native `scroll-snap`, `aria-label` "gallery"), grid on desktop.
- Backgrounds: grain/pattern tokens are CSS/data-URI — no oversized images at any width.

## 6. Interaction adaptation (touch vs pointer vs keyboard)

| Interaction | Mobile (touch) | Desktop (pointer) | Keyboard |
|---|---|---|---|
| Hover previews (SelectedWork) | Tap toggles inline detail | Hover swaps media | Focus reveals detail (focus-within) |
| Marquee | Static scroll-free row (or pause) | Animated | Static |
| Filters | Horizontal scrollable chip row (`overflow-x: auto`, `scrollbar-gutter`) | Full chip row | Arrow-key navigation with radiogroup semantics |
| Sticky header | Stay compact; no shrink animation | Shrink + hairline on scroll | n/a |
| Magnetic/cursor effects | Disabled (no hover) | Enabled, pointer fine only | Disabled |

**Hover-only content rule:** any hover reveal is mirrored on `:focus-visible` and `:active` (WCAG 1.4.13 + 2.1.1).

## 7. Special contexts

- **Landscape phones / split-screen:** max-width containers handle gracefully; test at 667×375.
- **Tablets:** `md` layouts verified (768×1024 and 1024×768).
- **Print:** `@media print` — hide header/footer/CTAs; expand prose to full width; ensure contrast survives (fallback colors); optional "print cv" note.
- **High-refresh / foldables:** nothing special in v1; avoid `100vh` traps — use `min-h-dvh` for hero/menu overlay.
- **RTL/i18n:** not v1 (F-25); keep logical properties (`ms-`/`me-`/`ps-`/`pe-`) in utilities where free to do so — future-proofing at zero current cost.

## 8. QA matrix (per page — overlaps accessibility plan)

- [ ] No horizontal scroll at 320/375/768/1024/1440/2560
- [ ] 200% zoom: no overlap, no clipped text, no hidden controls
- [ ] Landscape phone: hero + primary CTA visible
- [ ] Touch: all targets ≥ 44 px; no hover-gated content
- [ ] Reduced motion: mobile visual parity
- [ ] Images: correct sizes/source at each width (network tab / LH)
- [ ] Reader mode: article readable, images not duplicated by CSS backgrounds
