# Prompt 06 — Accessibility Deep Pass, QA, Launch & Handoff (P6+P7)

> Copy-paste into a fresh AI agent session. Prerequisite: `05-motion-seo-performance.md` completed (P4+P5 green). This is the release-quality run: nothing ships until the a11y matrix and launch checklist are 100% green.

---

**ROLE:** A release engineer and accessibility specialist performing the final quality pass on a premium personal website. You act as the owner's safety net: find every defect, fix it properly, and leave the site launch-ready with all documentation current. Hostility to shortcuts is your job description.

**READ FIRST:**
1. `project-planning/README.md` §2 + `06-agents/ai-agent-instructions.md` §7 (definition of done)
2. `04-strategy/accessibility-plan.md` — **normative** §2–§8 (testing matrix, SR script)
3. `04-strategy/performance-plan.md` §1 + `04-strategy/security-considerations.md` §8 (launch checklist)
4. `08-operations/deployment-plan.md` (environments, DNS, rollback) — read before launch steps
5. `05-roadmap/task-breakdown.md` P6 (P6-1…P6-6) + P7 (P7-1…P7-7)
6. `09-decisions/notes-and-assumptions.md` + `decision-log.md` (check recent entries before touching anything)
7. `01-brand/design-guidelines.md` §8–§9 (contrast table, design QA checklist)

**TASK A (Phase P6 — Accessibility deep pass).** Tasks P6-1…P6-6:
- Full axe sweep: all 9 routes, mobile + desktop, light + dark → **0 violations**; fix, never suppress (no `axe.skip`, no `aria-hidden` band-aids).
- Keyboard walkthrough script (a11y plan §3) on every control: nav, mobile menu, theme toggle, filters, accordions, form, case-study galleries, 404 recovery, links list; documented results committed to the a11y plan §8 matrix.
- Screen-reader pass (VoiceOver + NVDA) on the §7 script: nav, menu, filters, form, case study, note, 404 — announce order correct, no "click here", no unreachable content.
- Zoom 200% / 400% (responsive matrix + a11y plan) — no clipped content, no horizontal scroll; reader-mode article check (no broken prose styles).
- Reduced-motion audit + contrast re-check against design-guidelines §2.1 table (light + dark).
- Fix findings at the root (tokens/semantics/layout), not with overlays; exotic fixes get a Decision Log entry.

**TASK B (Phase P7 — QA, launch & handoff).** Tasks P7-1…P7-7:
- Full Playwright e2e suite (hire path, trust path, theme toggle, filters, form happy/honeypot/rate-limit, 404, reduced-motion, no-h-scroll, headers/CSP).
- Content final: every copy block, image, and testimonial owner-approved; placeholder sweep (`lorem|TODO|PLACEHOLDER|FIXME` grep = 0 in user-facing output; draft items either published or excluded).
- Preflight (deployment-plan): env vars on Vercel for all environments; DNS apex+www; TLS; 301 www→apex (per decision); preview smoke on production-like build; rollback rehearsal documented (P7-6).
- Launch security checklist (security-considerations §8) verified **in production**.
- GSC + Plausible live verification; sitemap submitted; OG/LinkedIn-validator spot check.
- Handoff: complete the customization checklist in `09-decisions/handoff-documentation.md`, close the phase report, ensure zero open `needs-validation` items without an owner decision.

**ACCEPTANCE CRITERIA:**
- a11y plan §8 testing matrix fully green; SR script results documented; axe 0 on final production build
- e2e 100% pass on clean CI run; Lighthouse CI green on all budgets (D-014) for all 9 routes
- Launch checklist (security §8 + deployment plan) 100% complete, evidence-linked (URLs, header dumps, screenshots)
- Public site serves: correct headers, no mixed content, no console errors, no dead links (crawl check)
- Repo hygiene: `pnpm audit` clean; no secrets; docs updated (decision log phase report, handoff checklist, maintenance plan baselines)
- Owner sign-off captured in the phase report

**CONSTRAINTS:** D-015 hard (0 known violations, no known remediation debt) · D-014 budgets are launch gates · D-018 no tracking additions · do NOT add features during P7 — defects and polish only; anything else goes to `notes-and-assumptions.md` `suggestion` + owner decision · never claim green without running the command (ai-agent-instructions §4).

**VERIFY:** all commands re-run locally AND in CI: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e` + Lighthouse CI report URL + production header/curl checks + `rg -n "lorem|TODO|PLACEHOLDER" src content` report (0 user-facing hits).

**OUTPUT:** final handoff summary (< 20 lines): launch status, key evidence links, remaining owner tasks (if any — e.g., real content, domain confirmation A-003), pointer to `project-planning/09-decisions/handoff-documentation.md` for the post-launch maintainer.
