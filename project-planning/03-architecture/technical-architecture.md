# Technical Architecture

> ✅ Approved baseline (D-001…D-023). Read with: `tech-stack.md` (choices) and `folder-structure.md` (layout). This doc explains *how the system fits together*.

## 1. Architectural posture

- **Static-first, server-light.** Every page is statically generated at build time from typed content collections. The only dynamic runtime surface is the contact endpoint (serverless route) + form client logic. There is no database, no session, no app server.
- **RSC-first component model.** Components render on the server by default; only small, deliberate client islands carry interactivity (listed in §4).
- **Content as typed data.** Site config + work + writing are files, validated by zod schemas at build time with Velite. Content that fails validation fails the build — typos in frontmatter never reach production.
- **Configuration over code.** Site-level facts (name, socials, availability, nav) live in one typed `site.config.ts` consumed by components, metadata, JSON-LD, sitemap, robots, RSS. Change once, propagates everywhere.

## 2. System diagram (logical)

```
                    ┌──────────────────────────────────────────────┐
                    │              CONTENT LAYER (repo)            │
                    │  content/work/*.mdx   content/writing/*.mdx  │
                    │  site.config.ts        data/*.ts (fixtures)  │
                    └───────────────┬──────────────────────────────┘
                                    │ Velite (build) + zod validation (fail-fast)
                    ┌───────────────▼──────────────────────────────┐
                    │            GENERATED TYPED MODULE            │
                    │        .velite/ (typed queries, schemas)     │
                    └───────────────┬──────────────────────────────┘
                    ┌───────────────▼──────────────────────────────┐
                    │      NEXT.JS (App Router, RSC) — server      │
                    │  app/ layouts · pages (static) · metadata    │
                    │  sitemap.ts · robots.ts · rss/route.ts       │
                    │  og/edge image route · contact/route.ts      │
                    └───────────────┬──────────────────────────────┘
                    ┌───────────────▼──────────────────────────────┐
                    │   CLIENT ISLANDS (motion, forms, theme,      │
                    │   filters, progress bar — small & explicit)  │
                    └───────────────┬──────────────────────────────┘
                    ┌───────────────▼──────────────────────────────┐
                    │   EXTERNAL (minimal, all optional-fail-safe) │
                    │   Plausible · Resend · Upstash (rate limit)  │
                    └──────────────────────────────────────────────┘
```

## 3. Rendering strategy per route

| Route | Strategy | Why |
|---|---|---|
| All content routes | **Static generation at build** (`generateStaticParams`) | Content is known at build; fastest UX, best SEO, zero runtime cost |
| Home / static pages | Static | Same |
| Metadata, OG images | Static + **edge OG route** (`@vercel/og` at `/og/[...slug]`) | Dynamic share cards without per-page build cost |
| Contact POST `/api/contact` (or `app/contact/route.ts`) | Serverless function | Only dynamic surface; zod + honeypot + rate limit before Resend |
| Search (F-24) | Staged: client-side index later | Not in v1 |

ISR/revalidation: not needed in v1 (content updates = deploys). If live-edit content appears (F-23 CMS), evaluate `revalidate` hooks then — architecture keeps this easy (content accessed through one data layer).

## 4. Client islands (complete list for v1 — keep it this small)

1. `ThemeToggle` — next-themes; crossfade
2. `MobileNav` — overlay menu, focus trap
3. `LenisProvider` (+ `ScrollProgress` for notes) — smooth scroll
4. `Reveal` / `StaggerGroup` — scroll-reveal wrappers (reduced-motion aware)
5. `WorkFilterBar` — filter interactions, animated re-layout
6. `ContactForm` — RHF/zod/honeypot/rate-limit UX
7. `MetricCounter` — count-up numbers on reveal
8. `PageTransition` — AnimatePresence route transitions (viewport/route group scope)

Rule: any new `"use client"` component must be justified in the component architecture review; client bundle budget is part of performance CI. Server components render everything else (headers/hero/footers/cards default to server unless they need interactivity).

## 5. Data flow

- **Content:** `.mdx` files → Velite parses frontmatter (zod: `WorkSchema`, `NoteSchema`), MDX body → typed `Project`/`Note` objects → pages query via imported collections from `.velite/` → static props.
- **Site config:** `site.config.ts` → typed `SiteConfig` → consumed by layout metadata, header/footer, JSON-LD, sitemap, RSS, contact fallbacks.
- **Contact:** form → client validation (zod) → POST JSON → server: zod again → honeypot/time-trap check → Upstash rate-limit check → Resend send → JSON response; client renders success/error states. Fail-safe: if any dependency errors, route returns friendly error and renders mailto fallback instructions (never crashes silently).
- **Analytics:** Plausible script (data-domain) + manual `plausible()` events for outbound links and contact CTA — no cookie, no cross-site.

## 6. Cross-cutting infrastructure

| Concern | Approach |
|---|---|
| Styling | Tokens (CSS vars) → Tailwind v4 `@theme`; prose via typography plugin |
| Typography | `next/font` (Fraunces + Inter), `display: swap`, subset, self-hosted |
| Images | `next/image`: AVIF preferred, explicit `sizes`, `priority` only on hero/LCP, all assets in `/public` or remote with `remotePatterns` allowlist |
| SEO/OG | Metadata API + `opengraph-image` pattern or edge route; JSON-LD injected server-side |
| Errors | `app/error.tsx` (styled, helpful), `app/global-error.tsx`, `not-found.tsx` per route level as needed |
| Loading | `loading.tsx` + Suspense skeleton for streaming where dynamic ever appears |
| Headers/CSP | `next.config.ts` headers array + `vercel.json` (where appropriate); full list in security plan |
| Monorepo | No — single app; `src/` colocation per folder-structure doc |
| CI | GitHub Actions: pnpm install → lint → typecheck → test → build → Lighthouse CI (budget) → deploy via Vercel git integration |

## 7. Failure modes & resilience (design-for-failure)

| Failure | Behavior |
|---|---|
| Resend down | Contact route returns 503 JSON; client shows email fallback with mailto; site otherwise unaffected |
| Upstash down | Rate limiter fails-open with error logged (documented risk, acceptable for low-traffic personal site; alternative: in-memory limiter per function instance) |
| Velite schema error | Build fails loudly at CI — never ships |
| Font CDN failure | next/font self-hosts — no external dependency |
| JS disabled | All pages are static; nav/form degrade to mailto; no blank states |
| CMS/dynamic later | Revalidation hooks isolated in one content-data module |

## 8. Performance architecture notes

- Preload critical: hero LCP image (if any) + fonts via next/font; `preconnect` to Plausible only.
- CSS: Tailwind v4 tree-shaken utilities; `@layer` ordering; no unused tokens shipped.
- JS: estimated initial JS ≈ 90–140 KB gzip (Next runtime + Motion + RHF/zod split across routes); budgets enforced in CI (D-014).
- Streaming/suspense reserved for future dynamic content; static pages need none.

## 9. Security architecture summary

Attack surface is intentionally tiny: static content (no injection), one POST endpoint (validated, rate-limited, honeypotted), no secrets client-side, hardened headers + CSP, dependency audit gates. Full analysis: `04-strategy/security-considerations.md`.

## 10. Architectural invariants (agents must never break)

1. No new runtime dependencies without Decision Log entry (D-016).
2. No raw hex colors/spacing outside tokens (D-017).
3. No client-side secret material; API keys only in server routes (D-022).
4. Content failures fail builds (no `any`, no silently-rendered junk).
5. Static-first remains default; ISR/dynamic requires approval.
6. `site.config.ts` remains the single source for site-level facts.
7. Accessibility and performance gates run in CI and block merges.
