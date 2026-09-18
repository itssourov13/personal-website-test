# Performance Optimization Plan

> ✅ Approved baseline (D-014). Performance is a launch gate: no page ships until budgets pass. CI enforces; humans audit.

## 1. Budgets (hard gates — D-014)

| Metric            | Budget                                     | Where measured                                 |
| ----------------- | ------------------------------------------ | ---------------------------------------------- |
| LCP               | ≤ 1.8 s (mobile 4G)                        | Lighthouse CI (mobile), RUM (Plausible/Vercel) |
| FCP               | ≤ 1.0 s                                    | LH CI                                          |
| INP               | ≤ 200 ms                                   | LH CI + field data                             |
| CLS               | ≤ 0.05 (target 0)                          | LH CI                                          |
| TTFB              | ≤ 600 ms                                   | Lighthouse + curl check                        |
| Initial JS (gzip) | ≤ 150 KB (route-split)                     | `next/bundle-analyzer` per phase + CI warning  |
| Page weight       | ≤ 1.5 MB total; hero image ≤ 250 KB        | CI artifact report                             |
| Lighthouse scores | Perf ≥ 95 · SEO ≥ 98 · A11y ≥ 98 · BP ≥ 98 | CI (desktop+mobile)                            |

Reference devices: Moto G Power (classic budget baseline) + iPhone; real field data via CrUX once indexed (check monthly).

## 2. Strategy pillars (in priority order — always apply this order)

1. **Don't ship what you don't need** — no unused JS/icons/fonts; MDX pages static; client islands minimal (technical-architecture §4).
2. **Optimize critical path** — fonts (next/font, subset, `display:swap`), LCP asset preloaded, CSS critical via Tailwind tree-shaking, no render-blocking third-party.
3. **Server-render + stream** — all pages static; Suspense only where dynamic creep happens (future CMS).
4. **Images right** — `next/image`: AVIF→WebP→JPEG fallbacks, explicit `sizes`, `priority` only on LCP, lazy below fold, correct `loading`/`decoding`.
5. **Cache everything static** — Vercel default CDN; `stale-while-revalidate` not needed (static); immutable asset hashing.
6. **Third-party discipline** (D-016/D-018) — Plausible (~1 KB) only; everything else self-hosted inline (fonts local).

## 3. Implementation checklist by layer

### Fonts (D-021)

- Fraunces + Inter via `next/font/google` → self-hosted `.woff2`, subsets, `display: swap`; CSS `size-adjust` fallbacks (Inter `text-rendering: optimizeLegibility` fine).
- Preload only the display weights actually used; avoid loading the whole variable axis set node_modules-side.

### Images

- All raster → AVIF (quality 62–78) via sharp pipeline; hero images size-matched to largest breakpoint; gallery images 1600 px max width.
- Decorative/grain textures as inline data-URI (≤ 8 KB) — no network request.
- Icons: inline SVG components (no `<img>` icons, no icon fonts).

### JavaScript

- Route-split everything: Motion only on pages using it (dynamic-import heavy sections like marquee if needed).
- `react-hook-form` + `zod` code-split to `/contact` only (dynamic import or route-level client component boundary).
- Fonts metadata: `preload` for critical, `async` (non-blocking) for others.
- No `use client` without performance review (component-architecture §6).

### CSS

- Tokens via CSS variables (no runtime cost); Tailwind v4 `@theme` compiles to used utilities only.
- `@tailwindcss/typography` for prose (brand styles shipped once).
- No CSS-in-JS runtime (D-003).

### HTML/streaming

- Static by default; `loading.tsx` skeletons only where async appears; no client-side fetching in v1.
- Resource hints: `preconnect` Plausible; `dns-prefetch` none extra.

### Caching/headers (Vercel)

- `Cache-Control: public, max-age=31536000, immutable` for `/images/*`, hashed assets (framework handles).
- Static pages: Vercel smart cache; verify no `no-store` leaks except `/api/contact`.

## 4. Measurement & CI pipeline

| Tool                                                                 | Where                | Trigger                                |
| -------------------------------------------------------------------- | -------------------- | -------------------------------------- |
| Lighthouse CI (mobile+desktop, budgets file `lighthouserc.json`)     | GitHub Actions       | Every PR touching pages                |
| Bundle analyzer report                                               | CI artifact / manual | End of each phase                      |
| `next build` warnings (Large Page Data, etc.)                        | CI                   | Every build — treat warnings as errors |
| Playwright `page.snapshotPerformance`                                | e2e                  | Smoke on home/work/note                |
| Field: CrUX + RUM (Plausible events: navigation timing approximated) | Monthly review       | Post-launch maintenance                |
| WebPageTest (LCP filmstrip, mobile)                                  | Manual               | P5 + pre-launch + after major changes  |

## 5. Known performance risks & mitigations

| Risk                       | Mitigation                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| Motion bundle weight       | Keep Motion to islands; import only needed APIs (`motion/react` tree-shakes); monitor analyzer |
| Velite build-time cost     | Negligible (< 2 s for our content scale); watch as content grows                               |
| Large case-study galleries | Lazy-load below fold, `sizes` correct, AVIF; cap gallery ≤ 8–10 images per study               |
| Font loading flash (FOUT)  | `display: swap` + size-adjust fallbacks; accept tiny swap (premium feel) over blocked text     |
| Plausible availability     | Script `async` + `data-excluded`; site works without it                                        |
| Future embeds (F-20/21/28) | Never embed third-party scripts in critical flow; always link-out or lazy after interaction    |

## 6. Definition of "performance done" (per phase)

- P1: fonts + tokens ship with zero CLS; Lighthouse green on a stub page.
- P2: Home meets all budgets (CI).
- P3: All content pages meet budgets including case-study galleries.
- P4: Motion added — re-verify budgets (motion must not cost the meter).
- P5: Full Lighthouse CI suite + field-data baseline recorded.
- Launch gate: budgets green on mobile+desktop; GSC/CrUX baseline saved in `08-operations/maintenance-plan.md`.
