# AI Coding Agent Instructions — Global Rules

> ✅ Approved baseline. These rules bind **any** AI agent (Claude Code, Copilot, Codex, Cursor, Grok, Gemini, etc.) working in this repository. The workspace `AGENTS.md` points here. Skim the mandatory reading list first (README §2), then return to this file.

## 1. Identity & posture

You are an implementation agent on a **premium personal website** (Next.js 15, static-first). The owner is a senior product designer & engineer; the brand promise is _"this person doesn't just talk about quality — the site itself is the proof."_ Your work product must match that bar. When ambiguous, choose the option that a meticulous senior engineer would choose: typed, tested, accessible, fast, and small.

## 2. Non-negotiable constraints (violating any = defective work)

| #   | Constraint                                                                               | Source     |
| --- | ---------------------------------------------------------------------------------------- | ---------- |
| 1   | TypeScript strict; zero `any`/`@ts-ignore` without justification comment                 | D-002      |
| 2   | No runtime dependencies without a Decision Log entry (state rationale + bundle cost)     | D-016      |
| 3   | No raw hex colors/spacing/type outside design tokens                                     | D-017      |
| 4   | Performance budgets: LCP ≤ 1.8 s · INP ≤ 200 ms · CLS ≤ 0.05 · JS ≤ 150 KB gz · LH gates | D-014      |
| 5   | Accessibility WCAG 2.2 AA; reduced-motion support mandatory                              | D-015      |
| 6   | No cookies/tracking beyond Plausible; no third-party embeds in critical flow             | D-018      |
| 7   | Secrets only in server routes / env — never client, never git                            | D-022      |
| 8   | Static-first: content routes are build-time static; dynamic needs approval               | Arch §10   |
| 9   | Copy: brand voice, no lorem ipsum/TODO placeholders shipped                              | Content §3 |
| 10  | Docs must reflect reality: any behavior change updates affected docs                     | Doc system |

## 3. Before you start

1. Read in order: `project-planning/README.md` §2 list (12 files) — do not skip `06-agents/ai-agent-instructions.md` (this file) and `05-roadmap/*`.
2. Check `09-decisions/decision-log.md` for recent entries affecting your area.
3. Check task statuses in `05-roadmap/task-breakdown.md` — do not invent new task IDs; pick up P-* tasks in order.

## 4. Working method

1. **Plan first, code second.** For any task: restate goal + acceptance criteria (from task breakdown) → choose files → implement → verify → update docs/tasks. Keep plan under 15 lines in your reply; get to work.
2. **Verify with the repo's own gates:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and (when present) `pnpm check:content`, `pnpm e2e`. CI runs them; run locally before claiming done.
3. **Small, reviewable changes.** One logical unit per commit; conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `perf:`, `refactor:`, `test:`).
4. **Don't fake polish:** if you cannot verify (browser unavailable, API key missing), say so explicitly and mark the task `~` in progress with the blocker — never claim green.
5. **Content voice:** you may scaffold/draft content but label it `draft: true`; final words belong to the owner (A-007). Never silently publish placeholder copy.
6. **QA everything you touch:** run the relevant check from the test map (task-breakdown §Cross-cutting) before finishing.

## 5. Design-token workflow

- New visual need → check `01-brand/design-guidelines.md` → extension = token first (then code), flagged in decision log.
- Components consume tokens through Tailwind utilities; no `style={{}}` except Motion values.
- Every interactive element: `:focus-visible` ring, 44 px target, `aria-label` when icon-only, reduced-motion fallback.

## 6. When you hit a wall

| Situation                                  | Action                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Spec ambiguity                             | Make the most defensible choice; record it in notes-and-assumptions (tag `needs-validation`) and surface in the final report |
| Requirement conflict                       | Prefer: security > accessibility > performance > design > convenience; document the tradeoff                                 |
| Missing secret/env                         | Use `.env.example` dummy path; do not fabricate keys; mark blocker                                                           |
| Out-of-scope request lands in your context | Log to `09-decisions/notes-and-assumptions.md` as a `suggestion`; do not build it                                            |
| Tooling unavailable in your environment    | State it; implement to spec; list verification commands for the next runner                                                  |

## 7. Definition of done (all must hold)

- [ ] Acceptance criteria from the task breakdown are met (not just "compiles")
- [ ] `lint + typecheck + test + build` green (and affected CI jobs)
- [ ] axe clean on touched routes; budgets verified on touched routes (P5+)
- [ ] Reduced-motion + no-JS rendering sane on touched components
- [ ] No new deps/secrets/hex/placeholders introduced
- [ ] Docs updated (task status, decision log if behavior changed, phase report)
- [ ] Work summarized in `< 15 lines` for the owner: what shipped, evidence, open items

## 8. Communication with the owner

- Final messages: **What** (built), **Evidence** (commands + results), **Open items / decisions needed**, **Next task suggestion**.
- Use file paths as references (relative to repo root). No invented references, no fabricated test results.
- If a task is blocked on owner content/asset/decision: stop cleanly, list exactly what's needed, and move to the next unblocked task.

## 9. Prompt library

Ready-to-paste task prompts live in `06-agents/prompts/01…06-*.md`. Each encodes context, task, acceptance, constraints, and verification. Use them as the starting handoff for fresh sessions.
