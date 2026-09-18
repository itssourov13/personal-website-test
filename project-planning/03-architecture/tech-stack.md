# Tech Stack — Recommendation & Reasoning

> ✅ Approved (D-001…D-021). Versions below are the planning baseline (Sept 2026); agents must verify current stable minor versions during implementation and record bumps in the Decision Log.

## 1. Stack at a glance

| Layer       | Choice                                                      | Version baseline | Decision |
| ----------- | ----------------------------------------------------------- | ---------------- | -------- |
| Framework   | **Next.js (App Router, RSC-first)**                         | 15.x             | D-001    |
| Language    | **TypeScript** (strict)                                     | 5.x              | D-002    |
| Styling     | **Tailwind CSS v4** (CSS-first) + `@tailwindcss/typography` | 4.x              | D-003    |
| Animation   | **Motion** (Framer Motion) + **Lenis** smooth scroll        | 11.x / 1.x       | D-004    |
| Content     | **MDX + Velite** (build-time), zod-validated                | 1.x/2.x          | D-005    |
| Theme       | **next-themes**                                             | 0.4.x            | D-006    |
| Forms       | **react-hook-form + zod**                                   | 7.x / 3.x        | D-009    |
| Email       | **Resend** (API, via route handler)                         | 3.x              | D-009    |
| Rate limit  | **Upstash Redis** REST (or Vercel KV)                       | —                | D-010    |
| Analytics   | **Plausible** (self-hosted or pro)                          | —                | D-008    |
| OG images   | **@vercel/og** (edge)                                       | 0.6.x            | D-011    |
| Pkg manager | **pnpm**                                                    | 9.x              | D-006    |
| Testing     | **Vitest + React Testing Library + Playwright**             | 2.x / 16.x / 1.x | D-012    |
| Lint/format | **ESLint (flat) + Prettier** + Husky + lint-staged          | 9.x / 3.x        | D-013    |
| Deploy      | **Vercel** (preview + prod)                                 | —                | D-007    |
| Monitor     | Vercel Analytics (optional) + Lighthouse CI                 | —                | D-012    |
| Node        | **20 LTS+ (22 LTS preferred)**                              | —                | D-019    |

## 2. Why these choices (reasoning)

### Framework — Next.js 15 (App Router) over alternatives

| Alternative      | Verdict       | Why                                                                                                                                                                                                           |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 15**   | 🟢 **Chosen** | Best-in-class SEO (metadata, RSC streaming), image optimization, static generation + ISR, Vercel synergy, largest ecosystem, first-class MDX/RSC content patterns                                             |
| Astro            | 🟡 Runner-up  | Excellent for content sites (fewer bytes to client), but weaker for interactive islands + dynamic transitions; viable escape hatch: our architecture is componentized so porting is feasible if owner prefers |
| Vite SPA (React) | 🔴 Rejected   | Client-rendered → poor SEO/CWV without heavy work; contradicts performance-first goals                                                                                                                        |
| Remix            | 🟡 OK         | Great data patterns, but content-site ergonomics weaker than App Router metadata/RSC story                                                                                                                    |

Rationale: content story (MDX collections), SEO story (route-level metadata, sitemap, OG at edge), performance story (static-first + streaming), and one deploy target (Vercel) that removes ops burden for a single maintainer.

### Content — MDX + Velite (build-time) over CMS in v1 (D-005)

- Local MDX in git: version-controlled, typo-reviewed in PRs, zero runtime cost, no CMS vendor dependency, fastest possible pages (fully static).
- Velite: typed content collections, zod validation, Tailwind-style DX; generated `.velite/` module gives typed queries into content at build time.
- Fallback if Velite shows friction: `@content-collections/mdx` or `next-mdx-remote`; migration path to Sanity (F-23) preserved by keeping content in schema-validated collections.

### Styling — Tailwind v4 CSS-first (D-003)

- v4 moves config into CSS (`@theme`), aligns perfectly with our CSS-variable token system; utility-driven consistency; `@tailwindcss/typography` gives brand-consistent prose blocks for MDX without bespoke CSS.

### Motion — Motion (Framer Motion) + Lenis (D-004)

- Motion: battle-tested spring/gesture library with reduced-motion hooks (`useReducedMotion`), AnimatePresence for route/view transitions.
- Lenis: premium smooth scrolling feeling that matches "Printed Studio" concept; must be gated: desktop + no-reduced-motion only.
- View Transitions API adopted progressively where available (progressive enhancement over Motion for route changes).

### Forms & delivery — RHF + zod + Resend (D-009)

- No backend server to maintain: static site + one serverless route handler for email.
- zod schemas double as client validation and server validation (single source).
- Honeypot + time-trap + Upstash rate limit make the endpoint resilient (see security plan).

### Analytics — Plausible (D-008)

- Privacy-first, cookie-less (GDPR-friendly, no banner — aligns with brand), tiny script (~1 KB), no slowing CWV. Self-hostable later (Umami alternative) with the same no-cookie posture.

### Testing & quality (D-012 / D-013)

Vitest+RTL for units (validation logic, filters, format helpers), Playwright for e2e critical journeys (hire path, form, theme toggle, filters, reduced-motion), Lighthouse CI enforcing budgets per PR, Husky pre-commit (lint+format+typecheck).

### Deploy — Vercel (D-007)

- Zero-config CI/CD from GitHub, preview deploys per PR (PR reviewers see real URLs), edge network, ISR support, built-in CSP headers authoring, free tier sufficient for v1 traffic.
- Alternatives (Cloudflare Pages, Netlify) noted as viable; keep deployment-agnostic APIs (no Vercel-only runtime features except optional KV; abstraction documented).

## 3. Explicit non-choices (locked)

- ❌ No `any`, no `@ts-ignore` without justification comment (D-002)
- ❌ No UI component library (shadcn/ui, MUI, Radix paid layer) — Radix primitives allowed _only_ for dialog/menu accessibility if hand-rolled is judged insufficient; decision recorded (see decision log D-023)
- ❌ No CSS-in-JS runtime (styled-components/emotion) — conflicts with RSC + performance
- ❌ No icon-font packages — hand-rolled stroke icons (F-1, D-016)
- ❌ No cookies / tracking scripts (D-018)
- ❌ No CMS, auth, or database in v1 (D-005, scope)
- ❌ No monorepo tooling, no turborepo — single app, keep it simple

## 4. Dependency governance (D-016)

- New runtime dep → Decision Log entry (why, bundle cost guesstimate, alternatives tried).
- `pnpm approve-builds`/`onlyBuiltDependencies` reviewed; audit on every PR (`pnpm audit` gate).
- Renovate (or Dependabot) weekly PRs; security majors auto-merge with CI green.
- Bundle-size regression check in CI (compare LCP budget + `next/bundle-analyzer` manually each phase).

## 5. Env vars & secrets (complete inventory for setup)

| Var                                                   | Where                   | Purpose                                | Public? |
| ----------------------------------------------------- | ----------------------- | -------------------------------------- | ------- |
| `NEXT_PUBLIC_SITE_URL`                                | Vercel + `.env.example` | Canonical URL (analytics, OG, sitemap) | yes     |
| `NEXT_PUBLIC_SITE_NAME`                               | build                   | Site name for metadata                 | yes     |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN`                        | build                   | Plausible data-domain                  | yes     |
| `RESEND_API_KEY`                                      | server-only             | Send contact emails                    | no      |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | server-only             | Rate limiting                          | no      |
| `CONTACT_TO_EMAIL`                                    | server-only             | Owner inbox (default from site.config) | no      |

`.env.example` committed; real values only in Vercel project settings, never in git; `CONTACT_TO_EMAIL` fallback guard so a misconfigured deploy never sends to garbage (see security plan).

## 6. Upgrade path commitments

- Minor upgrades: weekly Renovate PRs, CI gates, low risk.
- Major framework upgrades: planned task with regression window (a11y + perf suite re-run) — record in `09-decisions/decision-log.md`.
