# Deployment Plan

> ✅ Approved baseline (D-007). Target: **Vercel** (preview + production) with GitHub as the source of truth. Static-first: the site is fully build-time static except the single contact endpoint (`/api/contact`, serverless). This doc is the runbook from first deploy to launch day and beyond.

## 1. Environments & architecture

| Environment | Domain (after A-002) | Branch | Purpose |
|---|---|---|---|
| Development | localhost | `main` (local) | Daily work; `pnpm dev` |
| Preview | `*.vercel.app` + per-PR URL | every PR branch | Review, QA, Lighthouse CI, external validation (OG/LinkedIn) |
| Production | apex + `www` (redirect decision) | `main` (protected) | The live site |

- **GitHub → Vercel** import with framework preset `Next.js`; zero-config build (build `pnpm build`, output `.next`), pnpm detected from `packageManager` field.
- **Branch protection on `main`:** PR required, required checks (ci.yml jobs + e2e + Lighthouse CI), no direct push. Content changes flow through PRs like code.
- **Deploys:** every merge to `main` auto-deploys production; every PR gets a preview; Vercel comments the preview URL on the PR.

## 2. Repository & CI prerequisites (P0)

1. GitHub repo created; `main` protected; `ci.yml` (install → lint → typecheck → unit → build) + e2e job + Lighthouse CI budgets job (P5-7) + secret scan job (gitleaks).
2. Dependabot/Renovate weekly grouped PRs; `pnpm audit` gate; `scripts/check-content.mjs` wired to CI.
3. `.env.example` committed (tech-stack §5 inventory); real values only in Vercel project settings, per-environment.

## 3. Environment variables (Vercel project settings → all three environments)

| Var | Preview | Production | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | preview URL* | `https://<domain>` | *use a fixed preview domain (or leave empty + fallback) so OG/sitemap don't break on preview |
| `NEXT_PUBLIC_SITE_NAME` | Sourov Mondol | Sourov Mondol | metadata brand |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | plausible domain (or test) | production Plausible domain | Plausible data-domain |
| `RESEND_API_KEY` | test key | production key | server-only; rotate on any suspected leak (D-022) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | test instance | production instance | rate limiting (or Vercel KV — decision D-010) |
| `CONTACT_TO_EMAIL` | owner inbox (test alias ok) | owner real inbox | fallback to `siteConfig.email`; guard against misconfigured deploys sending to garbage |

Secrets are encrypted and never exposed to the client; branch-protected so only merges to `main` reach production.

## 4. DNS, TLS & domains (P7-3)

1. `A-002` domain confirmed by owner (placeholder `sourovmondol.studio`).
2. Add domain in Vercel (apex + `www`); Vercel issues TLS automatically (Let's Encrypt / Vercel certs, auto-renew).
3. Choose canonical host: apex preferred (`sourovmondol.studio`) with 301 `www` → apex; record in Decision Log.
4. Register close/typo/lookalike domains → 301 or parked (security §1); DMARC on the mail domain (Resend uses its own sending domain by default — enable custom sending domain `send.<site>` for brand).
5. HSTS: stage `max-age=63072000; includeSubDomains` once HTTPS is verified; submit `preload` **only at launch** (security §2).

## 5. Security headers & CSP (P5-6, verified at launch)

Implemented in `next.config.ts` headers block (values in `security-considerations.md` §2). Verify:

```bash
curl -sI https://<domain>/ | grep -iE 'content-security-policy|strict-transport|x-content-type-options|x-frame-options|referrer-policy|permissions-policy'
```

Expected: CSP (nonce-free, `frame-ancestors 'none'`, no `unsafe-eval`), `nosniff`, `DENY`, `strict-origin-when-cross-origin`, restrictive Permissions-Policy, HSTS present. Playwright e2e asserts these on all 9 routes (P5-6).

## 6. Rollback & recovery

- **Rollback:** Vercel dashboard → previous deployment → Promote. Rehearse once pre-launch (P7-6) and document the timestamp/URL in the phase report.
- **Instant safety:** git revert + merge → auto-deploys. Static site: worst case is downtime, repaired by redeploy.
- **Failed deploy:** CI gates + Vercel build checks prevent most; if production is bad, promote last-known-good immediately, then fix on a branch.
- **Contact endpoint outage:** form returns 503 → client shows mailto fallback (design already in place, P3-8/P5-5). Fail-open rate limiting means spam risk is the only impact; monitor inbox.

## 7. Launch checklist (owners + agent, P7-4)

- [ ] All env vars set in all environments; preview smoke on production-like build
- [ ] DNS propagated (`dig` apex/www), TLS valid, 301 redirect active, HSTS verified
- [ ] Security headers + CSP verified in production (curl + Playwright)
- [ ] `pnpm audit` clean; zero secrets in client bundle; repo secret-scan green
- [ ] Launch security checklist (security-considerations §8) 100%
- [ ] GSC property verified; sitemap submitted; Plausible receiving events; goals set
- [ ] e2e + Lighthouse CI green against production URL; OG/LinkedIn card validators pass
- [ ] Rollback rehearsal documented
- [ ] Analytics baseline recorded (P5-9) in `maintenance-plan.md`
- [ ] Post-launch monitoring (UptimeRobot or Vercel status) enabled

## 8. Post-launch deploy cadence

- Content updates: new note/case study via `scripts/new-post.mjs` → PR → merge → auto-deploy (zero-downtime, seconds).
- Dependency updates: Renovate weekly PRs; merge when CI green; watch decision log for version bumps.
- Platform changes (Vercel settings, headers, DNS): change → preview → merge to `main` → verify headers in production.

## 9. Cost & scaling notes

- Free tier is sufficient for v1 traffic; upgrade only when preview concurrency/bandwidth demands it (record in maintenance plan).
- Architecture is deployment-agnostic (no Vercel-only runtime APIs beyond optional KV; documented in tech-stack §2) — Cloudflare Pages/Netlify remain viable escape hatches if ever needed.
