# Sourov Mondol — Personal Website

Premium personal website: portfolio, writing, experiments, and a consulting
conversion path. Built with **Next.js 15 (App Router)**, **TypeScript
(strict)**, **Tailwind CSS v4**, MDX content collections, Motion + Lenis, and
next-themes.

- **Full planning package:** [`project-planning/README.md`](project-planning/README.md)
- **Agent entry point:** [`AGENTS.md`](AGENTS.md)
- **Decision log:** [`DECISIONLOG.md`](DECISIONLOG.md)

## Status

GitHub Actions is the source of truth for the exact commit being reviewed.
The quality job runs lint, typecheck, unit tests, content validation, the
production dependency audit, and a production build. The E2E job runs the
Playwright + axe suite in Chromium and WebKit and uploads reports/traces on
failure. Run the same commands locally before opening a PR; do not rely on
historical test counts from an earlier snapshot.

Routes: `/`, `/work`, `/writing`, `/ideas`, `/lab`, `/life`,
`/photography`, `/bookmarks`, `/topics`, `/about`, `/services`,
`/contact`, `/now`, `/uses`, `/resume`, `/speaking`, `/colophon`,
plus `/feed.json`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/og/...`.

Content lives in MDX collections — `content/{work,writing,ideas,lab,life}` —
validated by zod schemas at build time, plus structured data in `data/`
(`bookmarks.ts`, `photos.ts`, `talks.ts`, `testimonials.ts`). Demo-only
placeholder entries are flagged `demo: true`, render a visible "Sample"
badge, and are `noindex`ed so they never leak into real SEO.

> **Honesty note:** `/speaking` is intentionally empty — no fabricated talks
> are shipped (DECISIONLOG D-036/D-038). The same "real content or honest
> empty state" rule applies to `/photography` and `/lab` until real material
> exists.

## Getting started

```bash
pnpm install              # pinned pnpm version from packageManager field
cp .env.example .env.local  # fill in only the values you have
pnpm dev                  # http://localhost:3000
```

## Environment variables

| Variable                          | Scope  | Purpose                                                      |
| --------------------------------- | ------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`            | client | canonical URL for metadata, sitemap, OG                      |
| `NEXT_PUBLIC_SITE_NAME`           | client | brand metadata                                               |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN`    | client | Plausible data-domain (omit if analytics unset)              |
| `RESEND_API_KEY`                  | server | contact email delivery; no key returns 503 + mailto fallback |
| `UPSTASH_REDIS_REST_URL`/`_TOKEN` | server | distributed contact rate limit (recommended in production)   |
| `CONTACT_TO_EMAIL`                | server | contact form recipient (falls back to `siteConfig.email`)    |

`.env*.local` is gitignored — never commit real values. Secrets live only in
Vercel project settings for deployed environments (see the deployment plan,
`project-planning/08-operations/deployment-plan.md` §3).

## Scripts

| Command                             | Purpose                                  |
| ----------------------------------- | ---------------------------------------- |
| `pnpm dev`                          | Local dev server (http://localhost:3000) |
| `pnpm build`                        | Production build (`.next`)               |
| `pnpm start`                        | Serve the production build               |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (flat config)                     |
| `pnpm typecheck`                    | `tsc --noEmit` (strict)                  |
| `pnpm format` / `pnpm format:check` | Prettier                                 |
| `pnpm test` / `pnpm test:watch`     | Vitest unit tests                        |
| `pnpm e2e`                          | Playwright e2e + axe (chromium, webkit)  |
| `pnpm check-content`                | Validate MDX content + cross-links       |
| `pnpm new-post`                     | Scaffold a new writing post              |

Before any PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
(CI runs the same gates plus `pnpm e2e`).

## Deploying to Vercel

1. Push to GitHub and import the repository in Vercel — the Next.js preset is
   auto-detected; `vercel.json` pins the commands:
   - build: `pnpm build`
   - install: `pnpm install --frozen-lockfile` (same as CI)
   - pnpm version comes from the `packageManager` field.
2. Set environment variables per environment in Vercel project settings
   (table above). `NEXT_PUBLIC_*` values are baked in at build time; server
   secrets are read at runtime.
3. Production deploys from `main` (branch-protected); every PR gets a
   preview deployment.
4. Local CLI alternative: `npx vercel link && npx vercel --prod`.

Deployment notes:

- **Security headers** (nonce-based CSP, HSTS without the preload directive,
  `nosniff`, `DENY`, restrictive Permissions-Policy) are served by
  `src/middleware.ts` and `next.config.ts`. **Do not duplicate the CSP in
  `vercel.json`** — it is deliberately set in exactly one place (two policies
  would each have to pass independently).
- The nonce-based CSP makes routes render dynamically (`ƒ`) instead of
  static — that is a documented, deliberate trade-off (see the middleware
  header comment and DECISIONLOG). Configure `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_SITE_NAME`, and (when enabled) `NEXT_PUBLIC_ANALYTICS_DOMAIN`
  in each deployed environment; metadata and the Plausible script now read
  those settings.
- Contact endpoint `POST /api/contact`: zod validation, honeypot field,
  fill-time trap, rate limiting (fail-open), Resend delivery, and a mailto
  fallback in the UI when sending is unavailable.

## Project structure

```
src/app/           routes, layouts, API + OG routes, feed/sitemap/robots
src/components/    layout / sections / motion / ui / command / icons
src/lib/           content loaders, zod schemas, SEO/JSON-LD, site config
content/           MDX collections: work, writing, ideas, lab, life
data/              bookmarks, photos, talks, testimonials
tests/             unit tests (Vitest) + e2e (Playwright + axe)
scripts/           content check + post scaffolding helpers
project-planning/  complete planning package (start at AGENTS.md)
```

## Content workflow

To add an entry, copy the matching `content/<type>/_template.md`, fill in
the front matter and body, then run `pnpm check-content`. `pnpm new-post`
scaffolds a writing post. Content changes deploy like code changes — PR,
CI green, merge to `main`.

## Conventions

- **Tokens are law** — never hard-code colors/spacing/type in a component;
  consume the CSS variables mapped in `src/app/globals.css`
  (`project-planning/01-brand/design-guidelines.md`).
- TypeScript strict, zero `any`.
- No cookies/trackers except Plausible (D-018); privacy by default.
- Docs reflect reality: any behavior change updates the affected planning
  docs and the decision log.
