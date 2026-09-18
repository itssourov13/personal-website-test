# Task Breakdown / Todo List (implementation checklist)

> ✅ Approved baseline. This is the executable checklist for agents. Convention: each line = one task with acceptance shorthand; statuses: `[ ]` open, `[x]` done, `[~]` in progress, `[d]` deferred (reason recorded in phase report). Tasks reference phases and features by ID.

## P0 — Foundation & setup

- [ ] P0-1 Scaffold Next.js 15 (App Router) + TypeScript strict + pnpm (`create-next-app` flags: `--typescript --app --tailwind --eslint --src-dir --import-alias "@/*"`)
- [ ] P0-2 Configure `tsconfig` strict extras (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`), `.npmrc` (`engine-strict=true`), Node engine ≥ 20
- [ ] P0-3 ESLint flat config (next/core-web-vitals + typescript-eslint + import sorting) + Prettier config; format all
- [ ] P0-4 Husky + lint-staged pre-commit (lint, format, typecheck)
- [ ] P0-5 `.env.example` (all vars per tech-stack §5) + `.gitignore` + `.editorconfig`
- [ ] P0-6 GitHub repo + branch protection (PR required, checks required) + `ci.yml`: lint → typecheck → vitest → build
- [ ] P0-7 Dependabot/Renovate weekly grouped, security auto-merge (CI green)
- [ ] P0-8 Secret scanner (gitleaks or GH secret scanning) in CI
- [ ] P0-9 `next.config.ts` baseline: headers skeleton, `poweredByHeader: false`, images config
- [ ] P0-10 Root `README.md` (human) + `AGENTS.md` (agent entry — already present in workspace; verify links)
- **Exit:** `pnpm lint && typecheck && test && build` all green locally + CI replicates

## P1 — Core shell & design system (F-1, F-2, F-9-lite, F-10-lite)

- [ ] P1-1 `globals.css`: full token inventory (colors light/dark, type scale, spacing, radius, shadows, motion) + Tailwind `@theme` mapping + base styles + grain data-URI
- [ ] P1-2 Fonts: next/font Fraunces + Inter (subsets, display swap, variable axes opts)
- [ ] P1-3 `lib/site.config.ts` + `SiteConfig` type (per folder-structure §3) — single source of truth
- [ ] P1-4 Primitives: `Button` (variants/sizes/loading/asChild), `Link` (external rel+icon, underline slide), `Badge/Pill`, `Card`, `Section`, `Prose`, `Input/Textarea/Field`, `Spinner/Skeleton`
- [ ] P1-5 `Header` (sticky, scrolled state, nav from config, availability pill slot) + `Footer` (4 zones, colophon, year)
- [ ] P1-6 `ThemeToggle` (next-themes, no-flash script, crossfade) + `providers.tsx`
- [ ] P1-7 `MobileNav` (overlay, focus trap, Escape, aria-expanded, staggered entrance) — colocated client
- [ ] P1-8 `SkipLink` + semantic landmarks in root layout; `main` id + `scroll-mt` on sections
- [ ] P1-9 Custom `not-found.tsx` (404 anatomy + one recovery action) + `error.tsx` styled shell
- [ ] P1-10 Root layout: metadata template, fonts, providers, Header/Footer; `manifest.ts` (PWA meta, D-019)
- [ ] P1-11 Placeholder Home stub (PageHeader only) to prove shell; no lorem ipsum (designed empty state)
- **Exit:** Lighthouse ≥ 90 stub; axe 0 crit; hex-grep clean; keyboard nav works (`tab` through menu/theme/404)

## P2 — Home (F-3; microcopy F-2)

- [ ] P2-1 `Hero`: Display1 statement (owner copy), sub-line, dual CTA, availability pill (config-driven), hero intro motion (P4 tokens referenced, static now)
- [ ] P2-2 `ProofBand`: 3 metrics (Fraunces numbers) + client wordmark strip (static in P2; marquee P4)
- [ ] P2-3 `SelectedWork`: 3–4 spotlight cards from fixture/content (hover/focus media swap component wired)
- [ ] P2-4 `Capabilities` 3 cards → /services; `Testimonials` tickets (fixture data/); `WritingPreview` (empty-state + list when content exists)
- [ ] P2-5 `FinalCTA` ("Let's make something exceptional.") + footer CTA alignment
- [ ] P2-6 Microcopy audit: all states designed (hover/focus/active/reduced-motion/no-JS)
- [ ] P2-7 Home copy finalized with owner (hero, section intros, buttons) — content-strategy tone pass
- [ ] P2-8 Home performance verify: LCP/FCP/CLS budgets + images (hero has no raster or ≤ 250 KB AVIF)
- **Exit:** D-014 mobile+desktop green on Home; ten-second clarity owner-pass; reduced-motion variant ok

## P3 — Content pages (F-4, F-5, F-6-UI, F-7)

- [ ] P3-1 Velite: install + `velite.config.ts`; `WorkSchema` + `NoteSchema` (folder-structure §4) + `lib/content.ts` typed queries
- [ ] P3-2 Templates: `content/work/_template.md`, `content/writing/_template.md`; `scripts/new-post.mjs`; `scripts/check-content.mjs` (CI wiring)
- [ ] P3-3 Sample content: 1 fixture work + 1 fixture note (deterministic, tests); owner drafts pushed as they approve
- [ ] P3-4 `/work` index: PageHeader, card grid, FilterBar (client: discipline × industry, SR results announcement, `aria-pressed` chips, unit tests)
- [ ] P3-5 `/work/[slug]`: full anatomy (hero cover → context strip → MetricBand → problem/approach/outcome/learnings → RelatedWork → FinalCTA); `generateStaticParams`, `dynamicParams=false`; breadcrumbs; gallery with lazy images
- [ ] P3-6 `/writing` index (list, tags, RSS pill, sort) + `/writing/[slug]` (reading time, progress bar, related, prev/next)
- [ ] P3-7 `/about` (bio, principles, toolkit, timeline, human note) + `/services` (3 models, how-we-work, timeline graphic, FAQ accordion) + copy per inventory
- [ ] P3-8 `/contact` page: form UI full states (per ui-ux-ideas §5) + form component; endpoint wiring deferred to P5-5 (mock in dev)
- [ ] P3-9 RSS `route.ts` (full content, autodiscovery link in layout head)
- [ ] P3-10 Unit tests: schema validation, filter logic, reading-time, formatters, content queries; vitest ≥ 90% on lib
- **Exit:** all routes static-build with real content; axe clean; filter + schema tests green

## P4 — Motion & polish (D-004)

- [ ] P4-1 Motion tokens (animation-plan §2) as constants; `LenisProvider` (desktop + motion-safe only)
- [ ] P4-2 `Reveal` + `StaggerGroup` applied to all sections (reduced-motion static output, no layout jump)
- [ ] P4-3 `PageTransition` (View Transitions API first, Motion fallback; focus → main heading; instant under reduced motion)
- [ ] P4-4 `MetricCounter` (count-up, aria-hidden final in DOM); `ScrollProgress` (notes)
- [ ] P4-5 Micro-interactions: link underline, button arrows, card lift, theme crossfade, pill pulse (motion-safe)
- [ ] P4-6 Optional: `MagneticButton` (CTA only), `CursorGlow`, marquee animation (client wordmarks) — pointer-only gating
- [ ] P4-7 Perf re-verify: budgets green after motion; no long tasks > 200 ms; no CLS from animation
- [ ] P4-8 Reduced-motion regression pass (animation-plan §5 checklist)
- **Exit:** animation-plan QA checklist green; budgets green

## P5 — SEO, performance hardening & contact endpoint (F-8, F-9, F-11, F-6-complete)

- [ ] P5-1 Metadata API on all routes: unique title/description/OG/Twitter/canonical; title template; CI test for duplicates/missing
- [ ] P5-2 OG edge route `/og/[...slug]` (1200×630 template: wordmark, title, copper, per-page); verified in preview
- [ ] P5-3 JSON-LD: `Person` (layout), `Article/BlogPosting`, `CreativeWork`, `FAQPage`, `BreadcrumbList`; validate with schema.org checker
- [ ] P5-4 `sitemap.ts` + `robots.ts` (disallow `/api`, exclude drafts/nonexistent); `rss.xml` finalized
- [ ] P5-5 Contact endpoint: `lib/schema.ts` shared zod; honeypot + time-trap; Upstash rate limit (5/10 min + burst cap); Resend send (subject `[site]`, reply-to, no body logging); 503 fail-soft with mailto guidance; e2e happy + honeypot + rate-limit tests
- [ ] P5-6 Security headers + CSP (security plan §2) in `next.config.ts`; verify with securityheaders-style curl + Playwright asserts; HSTS staged (preload at launch)
- [ ] P5-7 Lighthouse CI: `lighthouserc.json` budgets (D-014) on 9 routes, mobile+desktop; bundle analyzer review; website weight report
- [ ] P5-8 Plausible integration (script, data-domain, events: outbound, contact CTA, note reads); CSP-clean
- [ ] P5-9 Field baseline: GSC property (domain), Plausible goals, CrUX note; save baseline into maintenance doc
- **Exit:** SEO/a11y/perf gates green (CI); headers verified; form e2e green; audit clean

## P6 — Accessibility deep pass (D-015)

- [ ] P6-1 Full axe sweep (all routes mobile+desktop) — 0 violations
- [ ] P6-2 Keyboard walkthrough script (a11y plan §3) — all controls; documented results
- [ ] P6-3 SR pass: VoiceOver + NVDA on §7 script (nav, menu, filters, form, case study, notes, 404)
- [ ] P6-4 Zoom 200%/400% (responsive + a11y matrices); reader-mode article check
- [ ] P6-5 Reduced-motion audit + contrast re-check vs design-guidelines §2.1 table
- [ ] P6-6 Fix findings; exotic fixes logged in decision log
- **Exit:** a11y plan §8 matrix fully green; owner spot-verifies SR demo

## P7 — QA, launch & handoff (deployment plan)

- [ ] P7-1 Full Playwright e2e suite: hire path, trust path, theme toggle, filters, form (happy/honeypot/rate-limit), 404, reduced-motion, no-h-scroll asserts
- [ ] P7-2 Content final: all copy/images/testimonials owner-approved; placeholder sweep (`lorem|TODO|placeholder` grep = 0)
- [ ] P7-3 Preflight: env vars in Vercel (all environments), DNS (apex+www→static), TLS, redirects 301 (www→apex if chosen), preview smoke
- [ ] P7-4 Launch security checklist (security plan §8) — verified in production
- [ ] P7-5 GSC + Plausible live verification; sitemap submitted; OG/LinkedIn-validator spot-check
- [ ] P7-6 Rollback rehearsal (previous deploy promote) documented
- [ ] P7-7 Handoff: update handoff-documentation.md (customization checklist done), close phase report
- **Exit:** launch checklist 100% green; owner sign-off

## P8 — Post-launch (first cycle)

- [ ] P8-1 30-day review: analytics + CWV field + search impressions; compare to G-1..G-7 targets
- [ ] P8-2 First content update cycle (new note or case study) using `new-post.mjs` flow
- [ ] P8-3 Maintenance cadence adopted (08-operations/maintenance-plan.md); first quarterly review scheduled
- [ ] P8-4 Decision log phase report for launch + learnings

## Cross-cutting (every PR/phase — CI enforced)

- [ ] X-1 Token-only styling (hex grep) · X-2 axe sweep on touched routes · X-3 Lighthouse budgets on touched routes
- [ ] X-4 No new deps without decision entry · X-5 `pnpm audit` clean · X-6 No secrets in client bundle
- [ ] X-7 Copy passes tone guide · X-8 Docs updated for any behavior change

## Test map (what must exist by phase)

| Suite                  | Scope                                                                                      | Phase |
| ---------------------- | ------------------------------------------------------------------------------------------ | ----- |
| Unit (vitest/RTL)      | schema, filter, formatter, content queries, Button/Link/Accordion/Field                    | P3+   |
| e2e (Playwright + axe) | hire path, trust path, form, theme, filters, 404, reduced-motion, no-h-scroll, headers/CSP | P5+   |
| Lighthouse CI          | budgets on 9 routes                                                                        | P5+   |
| Manual                 | keyboard, SR, zoom, visual QA (a11y plan §8)                                               | P6    |
