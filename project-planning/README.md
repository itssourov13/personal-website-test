# Master Project Planning — Premium Personal Website

> **Entry point for any human or AI agent working on this project.**
> If you are an AI coding agent (Claude Code, Copilot, Grok, Codex, Cursor, etc.), read this file first, then follow the reading order below before writing any code.

**Project working title:** `sourovmondol.studio` (placeholder — see Assumption A-001)
**Document version:** v1.0 — Approved baseline (2026-09-12)
**Status:** Planning complete / code not started
**Owner:** Site owner (you) — single maintainer

---

## 1. What this package is

A complete, implementation-ready project handoff package for a premium personal website. Every file is written so that **any AI coding agent can open this folder, understand the entire vision, architecture, and constraints, and continue building without further explanation.**

This package intentionally contains **no website code**. It is the specification, strategy, and instructions layer only. Code lives in the same repository, outside `project-planning/` (see `03-architecture/folder-structure.md`).

## 2. Mandatory reading order

| #   | File                                        | Why                                                    |
| --- | ------------------------------------------- | ------------------------------------------------------ |
| 1   | `00-vision/project-overview.md`             | What this site is, in 10 minutes                       |
| 2   | `00-vision/vision-and-mission.md`           | The "why" — always grounds design decisions            |
| 3   | `00-vision/goals-and-audience.md`           | Who it serves and what success means                   |
| 4   | `00-vision/scope-and-non-goals.md`          | What is explicitly NOT built in v1                     |
| 5   | `01-brand/brand-identity.md`                | Brand positioning, personality, voice                  |
| 6   | `01-brand/design-concept.md`                | The premium design concept — read before any UI work   |
| 7   | `01-brand/design-guidelines.md`             | The actual design system: tokens, type, color, spacing |
| 8   | `03-architecture/tech-stack.md`             | Stack, versions, reasoning, alternatives               |
| 9   | `03-architecture/technical-architecture.md` | How the system fits together                           |
| 10  | `06-agents/ai-agent-instructions.md`        | Rules every agent MUST follow                          |
| 11  | `05-roadmap/development-roadmap.md`         | Phases and order of work                               |
| 12  | `05-roadmap/task-breakdown.md`              | The full task list                                     |

Remaining files (`02-features/`, `03-architecture/component-architecture.md`, `04-strategy/*`, `07-guidelines/*`, `08-operations/*`, `09-decisions/*`) are reference material — read them as needed before touching the area they govern. **`04-strategy/*` and `07-guidelines/*` are normative**: violating them is a defect, not an option.

## 3. Canonical facts (single source of truth)

These are referenced by ID across the entire package. Change them only via the Decision Log (`09-decisions/decision-log.md`).

- **Persona (placeholder):** Sourov Mondol — product designer & engineer, independent consultant. Replace per `09-decisions/notes-and-assumptions.md` → A-001 and the customization checklist in `09-decisions/handoff-documentation.md`.
- **Stack (D-001..D-013):** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Motion (Framer Motion) · Lenis · MDX + Velite · next-themes · RHF + zod + Resend · Plausible · pnpm · Vercel · Vitest/RTL + Playwright · ESLint + Prettier + Husky/lint-staged.
- **Design tokens:** full system in `01-brand/design-guidelines.md` (color, type, spacing, radius, shadow, motion, grid). Tokens are the _only_ allowed source for colors/spacing in UI code.
- **Performance budgets (D-014):** LCP ≤ 1.8 s · INP ≤ 200 ms · CLS ≤ 0.05 · initial JS ≤ 150 KB gzip · Lighthouse ≥ 95 perf / ≥ 98 SEO / ≥ 98 a11y / ≥ 98 best-practices.
- **Accessibility target (D-015):** WCAG 2.2 AA, keyboard-complete, reduced-motion supported.
- **Pages (v1):** Home, Work index, Work detail (case studies), About, Services, Writing index, Writing detail, Contact, 404. See `03-architecture/routing-and-pages.md`.

## 4. Quick-start for an AI agent

1. Open this folder. Read the 12 files in §2 in order (they are 📖 core).
2. Open `06-agents/prompts/01-project-bootstrap.md` — it is the first executable prompt.
3. Implement strictly inside the agreed code locations from `03-architecture/folder-structure.md`.
4. Never change a canonical fact (stack, tokens, budgets, pages) without adding a Decision Log entry.
5. Never mark a task done without its acceptance criteria from `05-roadmap/task-breakdown.md`.
6. When stuck, put findings in `09-decisions/notes-and-assumptions.md` (tagged `needs-validation`), then ask the owner.

## 5. Package map

```
project-planning/
├── README.md                          ← you are here (master index)
├── 00-vision/                         project overview, vision, goals, scope
├── 01-brand/                          brand identity, design concept, UI/UX ideas, design guidelines
├── 02-features/                       feature list (core + future)
├── 03-architecture/                   tech architecture, stack, folder structure, components, routing
├── 04-strategy/                       content, SEO, performance, security, a11y, responsive, animation
├── 05-roadmap/                        phased roadmap + full task breakdown
├── 06-agents/                         AI agent instructions + ready-to-use prompt files
├── 07-guidelines/                     coding guidelines, documentation system
├── 08-operations/                     deployment, maintenance, future expansion
└── 09-decisions/                      decision log, notes & assumptions, handoff documentation
```

## 6. Status legend used across all docs

- ✅ Approved — normative, build against it
- 🟡 Draft / needs-validation — read but verify before relying on it
- 🔧 Plan — intent for a later phase, not yet binding

## 7. Updating this package

See `07-guidelines/documentation-system.md`. Every change to the website's plan must be reflected here; this package is the contract between the owner and any future agent.
