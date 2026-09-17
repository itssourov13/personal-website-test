# Maintenance Plan

> ✅ Approved baseline. Goal (G-7): **< 2 h/month routine upkeep** for a single maintainer, with AI-agent assistance for everything below. This document owns the recurring calendar, monitoring, incident response, and content workflow. Metrics/targets: `00-vision/goals-and-audience.md` (G-1…G-7).

## 1. Operating model

- **Owner = maintainer.** Agents execute on the owner's command or via scheduled prompts; never auto-merge to production without review (branch protection).
- Everything here is designed to be *small and repeatable*: a checklist, not a project.
- **Time budget:** routine work (deps, monitoring, small fixes) ≤ 2 h/month; content publishing ≤ 1 h per piece (drafts drafted by AI agent, owner edits + approves — A-007).

## 2. Recurring calendar

| Cadence | Activity | Owner | Agent-assist | Est. time |
|---|---|---|---|---|
| Daily (2 min) | Glance: Plausible anomaly + Vercel alerts + inbox | ✓ | — | 2 min |
| Weekly (15 min) | Renovate/Dependabot PRs: merge green ones; `pnpm audit` check; GH security alerts triage | ✓ | prepares PRs, summaries | 15 min |
| Monthly (30–45 min) | Analytics review vs G-1…G-4 targets; LCP/CWV field check (CrUX); Lighthouse CI trend; decision-log review; backlog tidy | ✓ | builds the report (scripted queries) | 30–45 min |
| Quarterly (1–2 h) | Full a11y sweep (axe + keyboard + SR spot per accessibility §7 script); security checklist re-run (security §8); backup/rotation review (any secrets/accounts); content strategy review | ✓ | runs sweeps, reports | 1–2 h |
| After every content publish | `check-content.mjs` clean; preview visual pass; link check | ✓ | runs checks | 10 min |

## 3. Monitoring (from security §7 + performance §4)

| Signal | Tool | Threshold → action |
|---|---|---|
| Uptime | UptimeRobot (free) or Vercel status page | Down > 5 min → check Vercel dashboard → rollback/redeploy |
| Errors | Vercel production alerts (crash/error rate) + Plausible | Error rate spike → check function logs (counters only, no bodies) |
| Performance | Lighthouse CI trend + CrUX (GSC) + Plausible | LCP/INP drift > 10% vs baseline → perf regression hunt (images/fonts/deps) |
| SEO | GSC impressions/clicks + sitemap coverage | Impressions drop → check structured data/sitemap/robots/404s |
| Security | GH security alerts + `pnpm audit` + email bounce notices | CVE → Renovate fix PR or manual pin; rotate any exposed key immediately (D-022) |
| Form health | Test email yourself each month; rate-limit logs counters | No email received → check env vars/Resend/Upstash; test 503 fallback UX |

## 4. Content workflow (publishing a note or case study)

1. Owner idea → agent drafts via `scripts/new-post.mjs` (from `_template.md`) with `draft: true`, in brand voice (content-strategy §5).
2. Owner edits + approves: flip `draft: false`, set `published`, add real metrics/images.
3. PR → CI (schemas + `check-content.mjs` + build) → merge → auto-deploy.
4. Post-publish mini-loop: RSS valid? OG card correct? Promoted on home/writing index? Link check passed?
5. Deletions/corrections: edit the `.mdx`; if a URL changes, set a redirect (next.config redirects) — never leave 404s for shared links.

## 5. Dependency & security upkeep

- Weekly: merge green Renovate PRs; any major version → do it as a *planned task* (run a11y + perf suite — tech-stack §6), not a blind merge.
- `pnpm.onlyBuiltDependencies` reviewed whenever a new package with postinstall appears.
- Rotation policy: contact/Rate-limit keys rotated every 12 months on the calendar (set reminder); immediately on suspected leak.
- Accounts audit (quarterly): Vercel org 2FA, GitHub PATs, GSC/Plausible access; remove stale tokens.

## 6. Incident response (lightweight)

1. **Detect:** alert (monitoring above) or owner notice. Log entry → `09-decisions/notes-and-assumptions.md` tag `incident`.
2. **Assess:** is it availability (site down), integrity (content wrong), or privacy (data exposure)?
3. **Respond:**
   - Availability → rollback/redeploy (deployment-plan §6); notify via socials if prolonged.
   - Integrity → revert the content commit; re-run `check-content.mjs`.
   - Privacy → rotate secrets; document what happened and what changed in the incident note; inform affected parties if any (v1 holds no user PII beyond contact emails in owner inbox).
4. **Post-incident:** within 1 week, add prevention step to this plan or the relevant strategy doc; close the incident note.

## 7. Post-launch analytics program (tie-in with G-1…G-4)

| Question | Data source | Review at |
|---|---|---|
| Are case studies being read? | Plausible per-path + time-on-page proxies | Monthly |
| Is the reader finding contact? | Contact conversion rate from /work + /writing CTAs | Monthly |
| Are we ranking? | GSC impressions for the 3 keyword clusters (seo-strategy §2) | Monthly |
| Is it fast in the field? | CrUX + LCP budget pass rate (G-5) | Monthly |
| Is the system fresh? | Content calendar vs read growth; quarterly strategy | Quarterly |

First 30-day review is **P8-1** (task in roadmap); its findings update targets in this document.

## 8. Documentation hygiene (tie-in with 07-guidelines/documentation-system.md)

- Phase reports, decision log, and maintenance baselines update after every significant change.
- Quarterly: verify README canonical facts (§3) still true; check no dead doc links; tag any drift `🟡` immediately.

## 9. Baseline record (populated at P5-9 / P7-5)

| Metric | Baseline (set at launch) | Target (G-*) |
|---|---|---|
| LCP (p75, mobile) | *TBD* | ≤ 1.8 s |
| INP (p75) | *TBD* | ≤ 200 ms |
| Lighthouse perf/SEO/a11y/BP | *TBD* | ≥ 95 / ≥ 98 / ≥ 98 / ≥ 98 |
| Total page weight / initial JS | *TBD* | ≤ 150 KB gz initial JS |
| Plausible weekly visits | *TBD* | — |
| GSC impressions (3 clusters) | *TBD* | top-10 for 3 clusters |
| Maintenance time/month | *TBD* | < 2 h |
