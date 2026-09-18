# Prompt 01 — Project Bootstrap (P0)

> Copy-paste into a fresh AI agent session to initialize the codebase. Works with Claude Code, Codex, Cursor, Copilot, Grok, etc.

---

**ROLE:** You are a senior front-end engineer implementing a premium personal website. This is a real production project with strict quality gates, not a demo.

**READ FIRST (in order, before any code):**

1. `project-planning/README.md` — master index + canonical facts
2. `project-planning/00-vision/project-overview.md` + `vision-and-mission.md` + `scope-and-non-goals.md`
3. `project-planning/01-brand/design-guidelines.md` — tokens are law
4. `project-planning/03-architecture/tech-stack.md` + `technical-architecture.md` + `folder-structure.md`
5. `project-planning/06-agents/ai-agent-instructions.md` — global rules
6. `project-planning/05-roadmap/development-roadmap.md` (P0) + `task-breakdown.md` (P0 tasks)

**TASK (Phase P0 — Foundation & Setup).** Tasks P0-1…P0-10 from `05-roadmap/task-breakdown.md`:

- Scaffold Next.js (App Router) + TypeScript strict + Tailwind + ESLint + Prettier + pnpm, mirroring `folder-structure.md` §1 exactly (src/, app/ layout, content/, data/, tests/, scripts/ placeholders).
- Strict tsconfig extras, `.npmrc`, `.env.example` (complete var inventory from `tech-stack.md` §5), `.gitignore`, `.editorconfig`, `.husky` pre-commit (lint-staged: lint+typecheck+format).
- `next.config.ts` baseline: `poweredByHeader: false`, headers skeleton (CSP stubs per `security-considerations.md` §2 — values finalized in P5), images config.
- GitHub Actions `ci.yml`: install(pnpm) → lint → typecheck → unit (vitest placeholder) → build. Dependabot weekly grouped. Secret scan (gitleaks).
- Root `README.md` (one paragraph + links into project-planning) — keep `AGENTS.md` intact (it points here).

**ACCEPTANCE CRITERIA:**

- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass locally and in CI on a clean checkout
- Strict-mode enforced (test: intentionally `any` fails typecheck)
- `.env.example` documents every env var from tech-stack §5 with comments; real env files gitignored
- No lorem markup in app; app compiles a single styled stub page ("Site under construction" can be **designed** but a plain empty page is not acceptable — at minimum token-styled shell)
- Decision Log (project-planning/09-decisions/decision-log.md) gains one entry: P0 bootstrap completed, versions locked, any deviations

**CONSTRAINTS:** D-016 (no new runtime deps without log entry) · D-002 (strict) · do not start P1 work — scaffolding only. Use latest stable Next 15.x / TS 5.x / Tailwind v4.x.

**VERIFY BEFORE FINISHING:** run all four commands from acceptance; report versions (`pnpm list next typescript tailwindcss`), CI workflow file list, and the exact files created.

**OUTPUT:** summary (< 15 lines): what shipped, evidence, open items, suggested next prompt (`02-core-shell-design-system.md`).
