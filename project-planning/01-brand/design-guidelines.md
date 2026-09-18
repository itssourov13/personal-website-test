# Design Guidelines — the Design System (v1)

> ✅ Approved baseline · Normative. **All UI code MUST consume these tokens.** Ad-hoc colors/spacing/type = defect (D-017). Implement as CSS custom properties (`:root` / `.dark`) + Tailwind v4 `@theme` mapping.

## 1. How tokens map to code

```txt
CSS variables (single source)  →  Tailwind @theme utility mapping  →  components
:root { --bg: … }                   bg-bg, text-fg, border-border,     <Button className="…"/>
.dark { --bg: … }                   accent-*, surface-*, muted, …
```

Convention: token class names = `bg-bg`, `text-fg`, `bg-surface`, `border-border`, `text-muted`, `bg-accent`, `ring-accent`, `text-faint`. Never hard-code a hex in a component.

## 2. Color system

### 2.1 Palette (warm neutrals + one accent)

| Token                | Light                 | Dark                    | Usage                                      |
| -------------------- | --------------------- | ----------------------- | ------------------------------------------ |
| `--bg`               | `#F7F5F1`             | `#141312`               | Page background (warm paper)               |
| `--surface`          | `#FFFFFF`             | `#1C1B19`               | Cards, header, elevated panels             |
| `--surface-2`        | `#EFECE6`             | `#24221F`               | Hover fills, wells, code blocks            |
| `--fg`               | `#191714`             | `#F2EFEA`               | Primary text (warm ink / cream)            |
| `--muted`            | `#6B675F`             | `#A29D94`               | Secondary text                             |
| `--faint`            | `#9B978E`             | `#6E6A62`               | Captions, meta, placeholders               |
| `--border`           | `rgba(25,23,20,.10)`  | `rgba(242,239,234,.12)` | Hairlines, card borders, dividers          |
| `--accent`           | `#B45F3E`             | `#D8906B`               | Links, focus, key numbers, dot mark        |
| `--accent-strong`    | `#9C4A2C`             | `#E8A67E`               | Accent where AA contrast required on bg    |
| `--accent-soft`      | `#EDDCD2`             | `#3A2A22`               | Accent tints, pills, selection bg          |
| `--accent-grad-from` | `#B45F3E`             | `#D8906B`               | Gradient start (metric bands, hero motif)  |
| `--accent-grad-to`   | `#D9A441`             | `#E7BC6D`               | Gradient end (copper→gold)                 |
| `--focus-ring`       | `#9C4A2C`             | `#E8A67E`               | `:focus-visible` ring (2 px + 2 px offset) |
| `--selection`        | `rgba(180,95,62,.20)` | `rgba(216,144,107,.30)` | Text selection                             |
| `--success`          | `#2F7D4F`             | `#5FB27B`               | Form success only                          |
| `--danger`           | `#B03A2E`             | `#E2766A`               | Form errors only                           |

**Contrast QA (WCAG 2.2 AA):**

- `--fg` on `--bg`: light 14.2:1 · dark 13.9:1 ✅
- `--muted` on `--bg`: light 4.8:1 · dark 5.6:1 ✅ (body-size ok; keep captions ≥ `--faint` only for non-essential)
- `--accent` on `--bg` for link text: light 4.4:1 ✅ · dark `#D8906B` on `#141312`: 6.3:1 ✅
- `--accent` on `--surface` (white cards, light): 4.0:1 — links in cards must use `--accent-strong` `#9C4A2C` (5.9:1) ⚠️ rule: **on white surface use accent-strong**
- Large display text may use `--accent` (decorative/focal); body text never below 4.5:1

### 2.2 Rules

- Neutrals always warm-tinted; never pure `#808080` or blue-gray.
- Accent usage budget: ≤ 10% of any viewport (links, focus, key numbers, pills). Accent ≠ decoration everywhere.
- Dark mode is a first-class re-design (approved mapping above), not an invert filter.
- No new palette tokens without a Decision Log entry.

## 3. Typography

| Role                       | Font                 | Sizing (clamp where fluid)              | Weight / tracking / lh           |
| -------------------------- | -------------------- | --------------------------------------- | -------------------------------- |
| Display 1 (hero statement) | Fraunces             | `clamp(2.75rem, 1rem + 5.5vw, 4.75rem)` | 460 · `-0.02em` · 1.05           |
| Display 2 (page titles)    | Fraunces             | `clamp(2.25rem, 1rem + 3.5vw, 3.5rem)`  | 460 · `-0.015em` · 1.08          |
| H1                         | Fraunces             | `clamp(2rem, 1rem + 2.5vw, 2.75rem)`    | 520 · `-0.01em` · 1.1            |
| H2 (section)               | Fraunces             | `clamp(1.75rem, 1rem + 2vw, 2.25rem)`   | 520 · `-0.01em` · 1.15           |
| H3 (card title)            | Inter                | `1.375rem`                              | 600 · `-0.01em` · 1.25           |
| H4                         | Inter                | `1.125rem`                              | 600 · 0 · 1.3                    |
| Body / body-lg             | Inter                | `1rem / 1.125rem`                       | 400 · 0 · 1.65                   |
| Small / caption            | Inter                | `0.875rem / 0.8125rem`                  | 400 · 0 · 1.5                    |
| Overline (eyebrow)         | Inter                | `0.75rem`                               | 600 · `0.08em` · 1.3 · UPPERCASE |
| Monospace (code/meta)      | `ui-monospace` stack | `0.875rem`                              | — · 0 · 1.6                      |

- Fonts: **Fraunces** (variable, set `opsz` high for display) + **Inter** (variable, 400/500/600). Loaded via `next/font` (self-hosted, subset, `display: swap`) — D-021.
- Prose measure: 60–75 chars (max-width 760 px) for notes/case-study body. Headings above 1rem use Fraunces by default; numerals in metrics bands use Fraunces 520 (open numbers — they're the "big ticket" typography).
- Line length rule for lists/cards ≤ 40 chars per visual line where possible.
- Emphasis: _italic_ Fraunces for words, never fake-bold. No ALL CAPS except overline labels.
- Type scale is fixed; fluid only on display/h1/h2 via the clamp values above.

## 4. Spacing & layout

- **Spacing scale (4 px base):** `4 8 12 16 20 24 32 40 48 64 80 96 128 160` → tokens `--space-*` / Tailwind `p-1…p-40`.
- **Section rhythm:** 96 px desktop / 64 px mobile (min); hero top padding 128–160 px.
- **Grid:** 12 col desktop ≥ 1024, 6 col ≥ 640, 4 col mobile; gutters 24 px desktop / 16 px mobile; outer margin 48 px desktop / 20 px mobile; max content width 1200 px; prose 760 px.
- **Card padding:** 24–32 px; **card radius `--radius-md` 8 px**; buttons: pill `9999px` for primary CTA, `8px` for inputs; images `4–8 px`.
- Borders: 1 px hairlines everywhere (`--border`); 2 px only for focus ring.
- Shadows (warm-tinted): `--shadow-sm: 0 1px 2px rgba(25,23,20,.06)` · `--shadow-md: 0 4px 12px rgba(25,23,20,.08)` · `--shadow-lg: 0 16px 40px rgba(25,23,20,.12)`; dark mode: use `rgba(0,0,0,.4)`.

## 5. Radius, elevation, effects tokens

| Token           | Value   | Use                                        |
| --------------- | ------- | ------------------------------------------ |
| `--radius-xs`   | 4 px    | chips, pills, thumbnails                   |
| `--radius-sm`   | 6 px    | inputs, code blocks                        |
| `--radius-md`   | 8 px    | cards, modals                              |
| `--radius-lg`   | 12 px   | hero media, large panels                   |
| `--radius-full` | 9999 px | buttons, toggle                            |
| `--shadow-*`    | above   | layered elevation, 1 level max per surface |

Effects rule: grain/paper texture `data-uri` PNG (≤ 8 KB) at `opacity .03` on `--bg` only; gradients only from `--accent-grad-*`; blur `backdrop-filter: blur(8px)` on sticky header surface only (motion-safe media query).

## 6. Iconography & imagery

- Icons: hand-rolled 20×20 stroke icons (1.5 px stroke, round caps) in an `icons/` component library — no icon-font packages (D-016). Social icons (GitHub, LinkedIn, X, Dribbble, RSS) simple-line.
- Imagery: see `design-concept.md` §3.4 (warm grading, browser frames). All decorative imagery must pass through the Next.js Image pipeline (AVIF, sizes, priority rules) — `04-strategy/performance-plan.md`.

## 7. Dark mode rules

- Toggle via `next-themes`; default respecting `prefers-color-scheme`; persists to localStorage; no flash (inline script before hydration).
- Colors ONLY from the approved dark mapping in §2.1 — do not invent new dark shades.
- Shadows dark = black-based (§4); borders stay 1 px; surfaces get slight elevation separation (surface 2 > surface > bg).
- Imagery: consider a universal grade that reads fine in both themes (no black-background screenshots with dark text, etc.).

## 8. Accessibility-in-design rules (summary; norm in `04-strategy/accessibility-plan.md`)

- All text ≥ 4.5:1 (large display ≥ 3:1); focus ring visible `:focus-visible` 2 px accent offset 2 px.
- Touch targets ≥ 44×44 px (48 preferred); interactive elements in lists get adequate gaps (8 px min).
- Don't rely on color alone (links underlined/iconed in body copy).
- Motion-safe media query gates all animation; `prefers-reduced-motion` kills most motion (see animation plan).
- Zoom to 200% must not break layout (no fixed-width traps).

## 9. Design QA checklist (per page, pre-ship)

- [ ] Tokens-only (grep for hex outside tokens fails review)
- [ ] Light + dark visual pass; warm neutrals intact
- [ ] 320 / 768 / 1440 / 2560 widths pass
- [ ] 200% zoom pass; 400% (iOS) readable
- [ ] Focus-visible on every control; keyboard flow logical
- [ ] Reduced-motion pass — content order intact, nothing hidden
- [ ] Copy: no lorem ipsum, no placeholder text, brand voice
- [ ] Contrast spot-check (accent-on-white rule respected)
- [ ] Image pipeline applied (not raw `<img>`)

## 10. Versioning

Token changes = minor bump affecting all components; rational in Decision Log. This document is the canonical reference — code must follow it, never the reverse.
