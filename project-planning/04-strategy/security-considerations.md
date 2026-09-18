# Security Considerations

> ✅ Approved baseline (D-018, D-022). The attack surface is deliberately tiny: static content + one serverless POST endpoint + dependency hygiene. This plan is proportionate to a personal site — defense-in-depth without enterprise ceremony.

## 1. Threat model (v1)

| Threat                                          | Likelihood            | Impact                           | Primary controls                                                       |
| ----------------------------------------------- | --------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Contact-form spam/abuse (bots, floods)          | High                  | Medium (inbox noise, rate costs) | Honeypot, time-trap, rate limit, validation                            |
| Supply chain (malicious/compromised dependency) | Medium                | High                             | pnpm lockfile, audit gate, Renovate, `onlyBuiltDependencies` review    |
| Secret leakage (API keys in client/repo)        | Low                   | High                             | Server-only env rule, `.env.example` only, CI secret scan              |
| Hosting/infra compromise                        | Low (Vercel-managed)  | High                             | Managed platform, least-privilege tokens, org 2FA, minimal custom code |
| Content injection (MDX/XSS via content)         | Low                   | Medium                           | Raw HTML disabled in MDX, server-side rendering, CSP                   |
| DDoS                                            | Low for personal site | Low-Med                          | Vercel edge + optional Cloudflare shield if ever needed                |
| Phishing via lookalike domain                   | Low                   | Reputation                       | Register close domains; DMARC on mail domain                           |

Explicitly **out of scope** for v1 risk register: auth systems, payments, PII databases, admin panels (none exist). If CMS/booking/paid content arrive (F-23/F-21/F-26), update this register in the same change.

## 2. Static surface hardening

- **CSP** (set via `next.config.ts` headers; strictly nonce-free, static policy is fine since no inline scripts):
  `default-src 'self'; script-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline' (Tailwind/Next inline styles); img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://plausible.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
  - `unsafe-inline` for style accepted (Next requirement); **no** `unsafe-eval` in v1 policy.
- **Security headers bundle:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` — enforced in header config, verified in CI (Playwright assert).
- **HSTS:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (enable once HTTPS confirmed; submit preload only at launch).
- MDX: raw HTML disabled by default; external images only via configured `remotePatterns` allowlist (no arbitrary URL fetch → no SSRF vector); links sanitized `rel` on external.
- Headers reflection: none (static); template injection: none (no user content rendered except form echo — form does NOT echo user input in HTML, avoiding reflected XSS).
- `robots.txt`/`sitemap` leak nothing (no admin routes).

## 3. Contact endpoint (`/api/contact`) — the only write path

1. **Transport:** POST JSON only; TLS enforced by platform.
2. **Validation:** zod schema (identical client/server); length caps (name ≤ 80, email ≤ 254, message ≤ 4000 chars); email format.
3. **Bot deterrence:** Honeypot field (CSS-hidden, `tabindex=-1`, `aria-hidden`) — filled → 200-OK decoy (no error, just discard); time-trap: form rendered > ~2.5 s ago (server sets issued-at signed constant, client passes elapsed) — too fast → discard.
4. **Rate limiting:** Upstash REST (or Vercel KV): per-IP sliding window (e.g., 5 req / 10 min) + global burst cap; fail-open with logged error (documented, low traffic) or fail-closed per owner choice at P4 (default fail-open + alert).
5. **Delivery:** Resend via server-only `RESEND_API_KEY`; `to` from `CONTACT_TO_EMAIL` (env) falling back to `siteConfig.email`; subject prefixed `[site]`; include reply-to; never log message bodies (PII); logs: counters only.
6. **Failure UX:** 503 response → client shows mailto fallback (no stack traces, no IDs leak — generic message only).
7. **No secrets in client:** API keys/env only in route handler + `lib/contact.ts` marked `import "server-only"`.
8. **Vercel protections:** Vercel Firewall default WAF on (managed rules); optional IP deny list later.

## 4. Secrets & environment hygiene (D-022)

- `.env.example` committed with dummy values + comments; real `.env*` gitignored.
- CI + pre-commit secret scanner (gitleaks or GH secret-scanning).
- Rotation: if a key is ever committed or suspected exposed → rotate immediately, record in decision log.
- Vercel env vars: scoped per environment (preview/production), protected by default.
- GitHub: branch protection (PR required, checks required) — content changes go through review.

## 5. Supply chain

- `pnpm` with lockfile committed; `integrity` via lockfile.
- `pnpm audit` (or `npm audit`) gate in CI — fail on high/critical with a `pnpm audit --fix` path; Renovate weekly PRs; security majors auto-merge only when CI green + tests cover affected area.
- `pnpm.onlyBuiltDependencies` — review which packages run postinstall scripts; approve list explicitly.
- Keep deps lean (D-016): fewer deps = smaller attack surface.

## 6. Privacy & compliance (D-018)

- Analytics: Plausible (cookie-less, no fingerprinting) — no consent banner needed under GDPR for this stack (verify with local counsel if jurisdiction requires more, A-003).
- No email list in v1; contact emails kept only in owner inbox; add a privacy note line under form ("used only to reply").
- If newsletter/booking arrive (F-20/F-21): third-party processors have own DPAs — link their privacy policies; keep analytics posture unchanged.
- Legal pages (privacy policy) — decision deferred until domain/jurisdiction confirmed (A-003); placeholder decision in `decision-log.md` D-027.

## 7. Monitoring & incident response (lightweight)

- **Monitoring:** Vercel production alerts (crash/error rate) + Plausible anomaly glance weekly; Lighthouse CI trend; uptime pings (UptimeRobot free or Vercel status).
- **Logs:** Vercel function logs retained 1h default; enable log drains only if needed (privacy: no body logging).
- **Response plan:** Owner = on-call (site is static; worst case = site down, restore by redeploy/rollback). Incident log: add entries to `09-decisions/notes-and-assumptions.md` tag `incident`.
- **Bounty/self-disclosure:** not applicable v1 (no sensitive data). Still, dependency CVEs tracked via GitHub alerts.

## 8. Launch security checklist

- [ ] Security headers + CSP verified in production (curl/Playwright)
- [ ] HSTS header present; no mixed content; HTTPS enforced
- [ ] Contact endpoint: rate-limit + honeypot active; test emails arrive; no body logging
- [ ] Secrets: grep repo for key patterns; verify zero secrets in client bundle (`next build` output scan)
- [ ] `pnpm audit` clean (or documented exceptions)
- [ ] Branch protection + required checks on; PR reviews for all content
- [ ] GSC + Plausible deployed; no console errors in prod
- [ ] Vercel WAF on; frame-ancestors none; form-action self verified
