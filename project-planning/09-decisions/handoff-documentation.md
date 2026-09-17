# Handoff Documentation

> ✅ Approved baseline. This package's purpose is a **complete handoff**: any human or AI agent can open the repo, read this folder, and continue the project correctly. This file defines how handoffs work and what must be true before one is signed off.

## 1. What "handoff-ready" means

- A new agent reads `README.md` §2 (12 files) and can act without further explanation — tasks, constraints, tokens, budgets, and definitions of done are all documented.
- All state is in the repo (`05-roadmap/task-breakdown.md` statuses, decision log, notes) — never only in an agent's chat memory.
- Owner-facing decisions are explicit: anything marked `needs-validation`/`blocker` has a named decision owner.
- Nothing invented: claims of "done" are backed by commands/results in the phase report or commit history (ai-agent-instructions §4).

## 2. Handoff protocol

### 2.1 Owner → new AI agent (start a session)
1. Open the repo root; read `AGENTS.md` (one page); follow it to `project-planning/README.md`.
2. Read the mandatory reading order (README §2), then the applicable `06-agents/prompts/0X-*.md` for the next phase.
3. Check task statuses (task-breakdown) + decision log + notes before writing code.
4. Run the repo gates; add a short session-start summary to the shared note if collaborating.

### 2.2 Agent → owner (end a session / finish a phase)
1. Work summary (< 15 lines): what shipped, evidence (commands + results), open items, suggested next task.
2. Updated task statuses + phase report (decision-log §4).
3. Any behavior change logged (decision/notes).
4. Owner decisions requested in a numbered, actionable list (nothing buried).

### 2.3 Agent → agent (mid-project swap)
- The incoming agent starts from the same §2.1 protocol; the outgoing agent leaves the phase report + updated task breakdown as the handoff artifact. **Never** rely on chat history — the repo is the memory.

## 3. Customization checklist (prerequisite before launch)

Tracked in `09-decisions/notes-and-assumptions.md` by ID; mark ✅ here as completed.

| # | Item | Where | Owner action |
|---|------|-------|--------------|
| 1 | Real name/role/persona (A-001) | `lib/site.config.ts`, all copy, JSON-LD | ✅/⬜ |
| 2 | Domain registered + configured (A-002) | `site.config.ts` domain, Vercel domains, DNS, deployment-plan §4 | ✅/⬜ |
| 3 | Jurisdiction confirmed (A-003) → legal pages decision (D-027) | security plan §6, launch checklist | ✅/⬜ |
| 4 | Case study content: 2–4 approved (A-004) | `content/work/*.mdx` | ✅/⬜ |
| 5 | Notes: 1–3 approved (A-005) | `content/writing/*.mdx` | ✅/⬜ |
| 6 | Personal detail for About (A-006) | `/about` page section | ✅/⬜ |
| 7 | Final copy pass (A-007) — no draft flags left in user-facing output | site-wide grep `draft:` | ✅/⬜ |
| 8 | Contact details: email, response promise, availability pill copy | `site.config.ts` + `/contact` | ✅/⬜ |
| 9 | Social profile URLs + resume (optional F-31) | `site.config.ts` socials | ✅/⬜ |
| 10 | Real metrics for ProofBand + case studies (N-2) | config + MDX frontmatter | ✅/⬜ |
| 11 | Testimonials (2–3) or explicit removal (N-3) | `data/testimonials.ts` | ✅/⬜ |
| 12 | OG/favicon art assets (wordmark mark for OG template) | OG template + `public/` | ✅/⬜ |

## 4. Accounts & services setup (owner + agent; see deployment-plan §3)

| Service | Purpose | Who creates | Notes |
|---|---|---|---|
| GitHub repo | Source of truth | Owner | Protected `main`, CI, secret scan |
| Vercel project | Deploy | Owner | Env vars per environment |
| Resend | Email delivery | Owner | `RESEND_API_KEY` + sending domain |
| Upstash (or Vercel KV) | Rate limiting | Owner | `UPSTASH_*` env vars |
| Plausible | Analytics | Owner | `NEXT_PUBLIC_ANALYTICS_DOMAIN` + goals |
| Google Search Console | SEO | Owner | Property verify (P5-9) |

## 5. Phase report template (used at each phase exit)

```md
## Phase report — P{n}
- Date: YYYY-MM-DD
- Status: completed | cut-short (reason)
- Shipped: <bullets, with file paths>
- Evidence: <commands + results; CI links>
- Deviations: <D-* entries / notes>
- Owner sign-off: yes | no (blocker: …)
- Next suggested prompt: `06-agents/prompts/0X-….md`
```

## 6. Post-launch handoff (owner + maintainer/agent)

1. Handoff-documentation stays current: customization checklist fully ✅, baselines recorded (maintenance-plan §9), launch evidence linked (deployment-plan §7).
2. Maintenance cadence adopted (maintenance-plan §2) with first 30-day review scheduled (P8-1).
3. Next-feature decision flow active (`08-operations/future-expansion.md` §1).
4. The package remains the contract — anyone picking up the site 6 months later reads this folder first.

## 7. Completion checklist for THIS planning package

- [ ] All folders populated (00-vision … 09-decisions) per package map
- [ ] README canonical facts (§3) match decision log / tech stack / design tokens
- [ ] Prompt library 01–06 covers P0–P7; prerequisites and suggested-next links chain
- [ ] Agent instructions + coding guidelines + documentation system present and cross-linked
- [ ] Tree verified; no empty folders; no stray temp files
- [ ] Zip archive exported to the owner (if requested)
