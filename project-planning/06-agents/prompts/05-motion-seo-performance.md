# Prompt 05 — Motion, SEO, Performance Hardening & Contact Endpoint (P4+P5)

> Copy-paste into a fresh AI agent session. Prerequisite: `04-content-pages-mdx.md` completed (P3 green). Two quality-gated phases in one handoff — complete P4 fully before starting P5; never mix motion and header/CSP changes in the same commit.

---

**ROLE:** A senior front-end engineer with deep performance and privacy engineering focus. You are adding the site's motion system (quiet, precise — "The Printed Studio"), then hardening SEO, performance CI, security headers, and the only dynamic endpoint (contact form delivery).

**READ FIRST:**
1. `project-planning/README.md` §2 + `06-agents/ai-agent-instructions.md` (budgets are hard gates)
2. `04-strategy/animation-plan.md` — **normative** §2 tokens, §3 inventory, §5 reduced-motion gating
3. `04-strategy/performance-plan.md` §1 budgets + §3 per-layer checklist + §4 CI pipeline
4. `04-strategy/seo-strategy.md` §3 technical checklist + §8 accounts
5. `04-strategy/security-considerations.md` §2 (headers/CSP) + §3 (contact endpoint spec) + §8 (launch checklist)
6. `03-architecture/technical-architecture.md` §4 (client islands list) + §6 (cross-cutting infra)
7. `03-architecture/component-architecture.md` §5 (motion components) + `folder-structure.md` §1 (paths: `lib/schema.ts`, `lib/contact.ts`, `lib/seo.ts`, `lib/rss.ts`, `app/api/contact/route.ts`, `app/og/[...slug]/route.tsx`)
8. `02-features/feature-list.md` F-6, F-8, F-9, F-11 (ACs)
9. `05-roadmap/task-breakdown.md` P4 (P4-1…P4-8) + P5 (P5-1…P5-9)

**TASK A (Phase P4 — Motion & polish).** Tasks P4-1…P4-8:
- Motion tokens (animation-plan §2) as constants; `LenisProvider` — desktop + motion-safe gated only; `Reveal` + `StaggerGroup` applied to all sections (reduced-motion → static output, zero layout jump); `PageTransition` (View Transitions API first, Motion `AnimatePresence` fallback; focus → main heading; instant under reduced motion); `MetricCounter` (count-up, aria-hidden final in DOM); `ScrollProgress` (notes pages); micro-interactions: link underline, button arrows, card lift, theme crossfade, availability-pill pulse (all motion-safe); optional pointer-only: `MagneticButton` (FinalCTA only), `CursorGlow`, wordmark `Marquee`.
- Perf re-verify after motion: budgets green; no long tasks > 200 ms; no CLS from animation; reduced-motion regression pass (animation-plan §5 checklist).

**TASK B (Phase P5 — SEO, performance, security & contact delivery).** Tasks P5-1…P5-9:
- Metadata API on all routes (unique title/description/OG/Twitter/canonical, `%s — Sourov Mondol` template); CI test: duplicate/missing metadata = fail.
- OG edge route `/og/[...slug]` via `@vercel/og` (1200×630: wordmark, title, copper accent, per-page fields); verified in preview.
- JSON-LD: `Person` (layout), `Article`/`BlogPosting`, `CreativeWork`, `FAQPage`, `BreadcrumbList`; validate with schema.org validators.
- `sitemap.ts` + `robots.ts` (disallow `/api`, exclude drafts + `siteConfig.excludes`); finalize RSS.
- **Contact endpoint** — the only dynamic surface: `lib/schema.ts` shared zod (name ≤ 80 / email ≤ 254 / message ≤ 4000); honeypot + time-trap (issued-at signed constant, elapsed check ~2.5 s); Upstash REST or Vercel KV rate limit (5 req / 10 min per IP + global burst cap; fail-open + logged); Resend send (`RESEND_API_KEY`, `to` = `CONTACT_TO_EMAIL` → fallback `siteConfig.email`, subject `[site] …`, reply-to set, no body logging); 503 fail-soft → client shows mailto guidance; everything under `import "server-only"`.
- Security headers + CSP per security-considerations §2 in `next.config.ts`; verify via Playwright asserts + curl; HSTS staged with `preload` at launch only.
- Lighthouse CI: `lighthouserc.json` budgets (D-014) on all 9 routes, mobile+desktop; `next/bundle-analyzer` review; website-weight report (< 150 KB gz initial JS).
- Plausible: script (`data-domain` from env), CSP-clean, events: outbound links, contact CTA, note reads.
- Field baseline: GSC property + Plausible goals + CrUX note saved into `08-operations/deployment-plan.md`/`maintenance-plan.md`.

**ACCEPTANCE CRITERIA:**
- Reduced-motion: with `prefers-reduced-motion: reduce` there is NO motion anywhere (grep-able: motion components check `useMedia().reduced`); with motion: budgets still green, no CLS > 0.05, no long tasks > 200 ms on mobile 4G
- E2E suite green: hire path, trust path, form happy path + honeypot + rate-limit (blocked after 5/10 min), headers/CSP asserts, theme toggle, filters, 404, no-horizontal-scroll
- Security: CSP as specced (no `unsafe-eval`, `frame-ancestors 'none'`, `form-action 'self'`), headers verified in prod preview; repo-wide secret grep clean; client bundle contains no key-shaped strings
- SEO: Lighthouse SEO ≥ 98 on all routes; sitemap ↔ robots consistent; every page has unique metadata (CI-enforced)
- OG image renders in preview; LinkedIn/Twitter card validators pass spot-check
- Decision Log entries: motion system (P4), SEO/perf/security baseline (P5), contact endpoint security posture, versions of new deps (Upstash client if used, Resend, @vercel/og)

**CONSTRAINTS:** D-014 budgets hard · D-015 reduced-motion mandatory · D-016 no deps without log entry · D-018 no cookies/trackers beyond Plausible · D-022 secrets server-only · D-017 tokens-only · static-first: content routes remain fully static; ONLY `/api/contact` is dynamic · no inline scripts (CSP is nonce-free — move hydration/theme scripts to files or `next`-managed patterns).

**VERIFY:** the four gates + `pnpm e2e` + Lighthouse CI report + reduced-motion e2e run + `curl -I` header check on preview + `grep -rE 'sk-[A-Za-z0-9]|RESEND|UPSTASH' src` clean.

**OUTPUT:** summary (< 15 lines): what shipped per phase, evidence (budget numbers, header dump, test results), open items, suggested next prompt (`06-a11y-qa-launch.md`).
