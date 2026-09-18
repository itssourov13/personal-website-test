# Development Roadmap (Phases)

> ✅ Approved baseline. Phases are **quality-gated** (exit criteria must pass to advance), not date-gated. Estimates assume 10–15 h/week part-time, single maintainer + AI agent assistance.

## 1. Phase overview

| Phase | Name                        | Span      | Primary features                                                       | Exit gate                                 |
| ----- | --------------------------- | --------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| P0    | Foundation & setup          | Week 1    | Repo, tooling, CI, env                                                 | CI green on empty app                     |
| P1    | Core shell & design system  | Weeks 1–2 | Tokens, themes, fonts, Header/Footer, 404, a11y base                   | Home shell meets budgets (stub content)   |
| P2    | Home page                   | Weeks 2–3 | Hero, proof band, selected work, capabilities, testimonials, final CTA | Home meets all budgets + copy in place    |
| P3    | Content pages               | Weeks 3–5 | Work index + case studies, Writing + notes, About, Services, Contact   | All routes build; content collection live |
| P4    | Motion & polish             | Weeks 5–6 | Motion tokens, reveals, transitions, counters, micro-UI                | Budgets re-green after motion             |
| P5    | SEO & performance hardening | Weeks 6–7 | Metadata, JSON-LD, OG, sitemap/RSS, headers, Lighthouse CI suite       | SEO/performance gates green               |
| P6    | Accessibility deep pass     | Week 7    | Full a11y audit + fixes, SR passes                                     | axe 0 issues + manual §7 script           |
| P7    | QA, launch & handoff        | Week 8    | E2E full suite, content final, deploy, GSC/analytics, launch checklist | Launch checklist complete; live           |
| P8    | Post-launch                 | Ongoing   | Analytics review, iteration, maintenance cadence                       | First cycle complete (30 days)            |

**Critical path:** P0 → P1 → P2 → P3 (content volume) → P5 (SEO) → P7 (launch). P4 and P6 can interleave; P6 must finish before P7.

## 2. Phase details

### P0 — Foundation & setup (F-*: all build plumbing)

- Scaffold Next.js (App Router, TS strict), pnpm, ESLint flat, Prettier, Husky + lint-staged, `.env.example`, `.gitignore`, VS Code settings.
- GitHub repo + branch protection + `ci.yml` (lint → typecheck → unit → build); Dependabot/Renovate.
- `next.config.ts` baseline (headers skeleton, output settings); commit `AGENTS.md` + this package already present.
- **Exit:** `pnpm lint && pnpm typecheck && pnpm build && pnpm test` all green on scaffold app; CI replicates locally.

### P1 — Core shell & design system (F-1, F-2, F-9, F-10)

- `globals.css`: full token set (design-guidelines §2–6), Tailwind v4 `@theme` mapping, base styles, grain.
- Fonts via next/font (Fraunces + Inter); fluid type classes.
- `site.config.ts` + `SiteConfig` type; header/footer/mobile nav/theme toggle/skip link; custom 404.
- Primitives kit: Button, Link, Badge, Card, Section, Prose, Input/Field, Spinner/Skeleton.
- a11y baseline: landmarks, skip link, focus styles, keyboard nav for menu.
- **Exit:** Lighthouse ≥ 90 on stub home; axe 0 critical; tokens-only grep passes; P1 checklist in task breakdown fully ticked.

### P2 — Home page (F-3, F-7 section of it, F-11 later)

- Hero (copy from content strategy), availability pill; ProofBand (metrics + marquee skeleton); SelectedWork (fixture data); Capabilities; Testimonials (fixture); WritingPreview (empty-state → "notes coming"); FinalCTA.
- Microcopy set: all states designed (ui-ux-ideas §8).
- **Exit:** Home meets full budgets (D-014 mobile+desktop); 10-second clarity pass with owner; reduced-motion variant verified; copy final (owner-approved).

### P3 — Content pages (F-4, F-5, F-6-lite, F-7)

- Velite wiring: WorkSchema/NoteSchema, `lib/content.ts`, `_template.md`, `scripts/new-post.mjs`, `scripts/check-content.mjs`.
- Work index + filters (client filter bar, SR announcement); Case study page (full anatomy incl. MetricBand; galleries).
- Writing index + article page (reading time, tags, related, progress bar); RSS route.
- About + Services (copy per inventory; FAQ accordion); Contact page + form UI (states) — endpoint wiring in P5-lite (F-6 full).
- Content authoring: owner drafts case studies/notes per inventory; agent builds templates + scaffolds.
- **Exit:** all 9 routes build static; fixture + real content renders; axe clean on all routes; filter unit tests pass.

### P4 — Motion & polish (D-004, F-1 interactions)

- Motion tokens; Reveal/StaggerGroup/PageTransition/MetricCounter/Marquee; Lenis provider; scroll progress.
- Micro-interactions (buttons, links, cards, theme crossfade, pill pulse).
- CursorGlow + magnetic (optional, pointer-only).
- **Exit:** budgets re-green (CI), reduced-motion full pass; no motion ≥ 60 fps issues on emulated mid device.

### P5 — SEO & performance hardening (F-8, F-9, F-11, D-011)

- Metadata API everywhere (titles/descriptions/OG/canonical); OG edge route; JSON-LD (Person/Article/CreativeWork/FAQ/Breadcrumb); sitemap/robots; RSS polish; `404` noindex-proofing.
- Security headers + CSP (security plan §2); contact endpoint completion (rate limit, honeypot wiring, Resend delivery + failure UX) — F-6 full.
- Lighthouse CI budgets file + `lighthouserc.json`; bundle analyzer pass; field-data baseline (GSC/Plausible).
- **Exit:** SEO ≥ 98/a11y ≥ 98/perf ≥ 95 on all routes (CI); headers verified in prod preview; form e2e green; audit clean.

### P6 — Accessibility deep pass (D-015)

- Full axe sweep all routes; keyboard walkthrough (a11y plan §3); SR spot-checks (VoiceOver/NVDA) on §7 script; zoom tests 200%/400%; reduced-motion audit; contrast re-check vs design guidelines.
- Fix all findings in same phase; document exotic fixes in decision log.
- **Exit:** a11y plan testing matrix fully green.

### P7 — QA, launch & handoff (F-11, deployment)

- Full Playwright e2e suite (hire path, trust path, theme, filters, form incl. honeypot, 404, reduced-motion).
- Content final review (owner: all copy, images, testimonials); preflight checklist (deployment plan §6).
- Production deploy: domain, DNS, TLS, redirects; GSC + Plausible live; launch security checklist (security plan §8).
- **Exit:** launch checklist 100%; rollback plan rehearsed; owner signs off.

### P8 — Post-launch (maintenance cadence)

- 30-day review: analytics readings, CWV field data, initial SEO observations; first content update cycle.
- Enter maintenance cadence (08-operations/maintenance-plan.md §3); quarterly a11y/SEO/backlink reviews.

## 3. Roadmap rules

1. An agent may parallelize within a phase but never advance the phase without its exit gate.
2. Quality-gated truncation allowed (e.g., 2 case studies) — record in task breakdown as deferred.
3. Feature requests during build → `09-decisions/notes-and-assumptions.md` (suggestion) + surface to owner; never silently added.
4. Phase slippage is expected; re-scope content before sacrificing quality gates.
5. Each phase ends with a brief phase report appended to `09-decisions/decision-log.md` (what shipped, deviations, risks).
