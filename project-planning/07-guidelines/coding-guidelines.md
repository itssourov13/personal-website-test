# Coding Guidelines

> ✅ Approved baseline. **Normative** — violations are defects, not style preferences. Complements `component-architecture.md` §7 (API conventions) and `06-agents/ai-agent-instructions.md` (agent rules). Read before writing any code; enforced by lint/typecheck/CI where possible.

## 1. Language & type discipline (D-002)

1. **TypeScript strict mode is mandatory.** `strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true` (P0-2). Type errors fail CI.
2. **Zero `any`, zero uncommented `@ts-ignore`/`@ts-expect-error`.** If you must escape (rare), attach a justification comment referencing the task ID; keep a Decision Log note if the need recurs.
3. **Model data with zod, share schemas between client and server.** `lib/schema.ts` is the single source for contact/frontmatter-shaped data crossing the client/server boundary.
4. **`satisfies` + `as const` for configuration objects** (`lib/site.config.ts`) so shapes are validated without widening.
5. **Type imports:** `import type { X }` for type-only imports (`verbatimModuleSyntax` requires it).
6. **No unused code.** Lint fails on unused imports/vars; dead branches get deleted, not commented.

## 2. Styling & tokens (D-017)

1. **All visual values come from design tokens** — CSS variables in `globals.css` mapped through Tailwind v4 `@theme`. No raw hex/rgb, no ad-hoc px spacing or hardcoded type sizes outside `globals.css` and the design-guidelines-exempt list (same list used by the hex grep gate).
2. **Use Tailwind utilities in JSX.** `style={{}}` only for Motion values and dynamic runtime values; never for colors/spacing/type.
3. **Semantic color names, not literal ones** — `text-fg`, `text-muted`, `bg-surface`, `border-hairline`, `accent-*`. If a literal shade seems needed, the token set is missing something → add a token (Decision Log entry) before using it.
4. **Theme-aware by default.** Both light and dark must be checked for every change; contrast pairs come from design-guidelines §2.1/§8.
5. **No CSS files per component.** CSS lives in `globals.css` + tailwind utilities; CSS Modules only if the tailwind variant truly cannot express it (rare — ask/gate it).

## 3. File & component conventions

1. **Naming:** files `kebab-case`; component files exact `PascalCase.tsx` (e.g., `Hero.tsx`, never `hero.tsx` for a component). Tests colocated as `Button.test.tsx`.
2. **One component per file.** Default-export the component; `export type Props` named-export. No anonymous default exports for components.
3. **Layers (component-architecture §1):** `ui/` primitives, `layout/` shell composites, `sections/` page sections, `motion/` animation wrappers, `icons/` stroke icons. Page-private components live in `app/**/_components/`.
4. **Colocation rules (folder-structure §2):** content in `content/`, fixtures in `data/`, site facts in `lib/site.config.ts`, page logic near the page. Never mix.
5. **Client/server boundary (component-architecture §6):** explicit `"use client"` only for the enumerated client islands (technical-architecture §4 list — keep it small). Everything else is a server component; new client island = Decision Log entry.
6. **Markdown/Prose:** body copy via the `Prose` wrapper + `@tailwindcss/typography`; never hand-style MDX output inline.

## 4. Dependency discipline (D-016)

1. **New runtime dependency ⇒ Decision Log entry first** (why, alternatives tried, bundle-cost guesstimate). Build-time/dev deps: still document if notable (Velite, Playwright).
2. **`pnpm onlyBuiltDependencies`** — postinstall scripts run only for an explicit approved list.
3. **Audit on every PR** (`pnpm audit`, fail on high/critical); weekly Renovate/Dependabot; security majors auto-merge only with CI green.
4. **No icon fonts / icon libraries** — hand-rolled stroke icons (F-1).
5. **No UI kits.** Radix primitives allowed only for dialog/menu a11y if hand-rolled is judged insufficient (D-023).

## 5. Performance practice (D-014)

1. Write pages that are **static by default**; dynamic behavior = the tiny approved island list only.
2. **Images:** use the site `Image` component everywhere (responsive sizes, AVIF→WebP→fallback, `loading`/`priority` per layout role). Hero images ≤ 250 KB AVIF; no unoptimized raster.
3. **Fonts via `next/font`** (self-hosted, subsets, `display: swap`) — never a Google Fonts `<link>` in markup (D-021).
4. **No layout shift:** reserve space for anything that loads late (images, counters, fonts); CLS ≤ 0.05 is a hard budget.
5. **Streaming/Suspense** only where it improves first paint; verify, don't guess.
6. Every PR on a touched route must pass Lighthouse budgets; check before merging, and in CI (P5+).

## 6. Accessibility practice (D-015)

1. Semantic HTML first: `<header>`, `<nav>`, `<main id="main">`, `<section aria-labelledby>`, one `<h1>` per page, ordered headings.
2. Every interactive element: visible `:focus-visible` ring, ≥ 44×44 px target, accessible name (`aria-label` when icon-only).
3. Keyboard complete: custom components (menu, dialog, accordion, tabs, chips) implement full keyboard patterns + focus trap/return as specced in accessibility-plan §3.
4. Live regions (`aria-live="polite"`) for filter results, form errors, toast notifications.
5. **Reduced motion is not optional:** every motion component checks reduced-motion/capability and renders static content (animation-plan §5). Verify with the e2e reduced-motion suite.
6. Run `axe` on touched routes; 0 critical; document non-blocking findings.

## 7. Testing standards (D-012)

1. **Unit (Vitest + RTL)** for all logic: schemas, filters, formatters, content queries, primitives with state/events. Colocate `X.test.tsx` next to source.
2. **Coverage floor:** ≥ 90% line coverage on `src/lib`; new logic ships with tests in the same PR.
3. **E2E (Playwright)** for critical journeys: hire path, trust path, theme toggle, filters, form (happy + honeypot + rate-limit), 404, reduced-motion, no-horizontal-scroll, headers/CSP. Assertions must be behavioral, not snapshot-only.
4. **Fixtures over mocks where possible:** deterministic content fixtures in `tests/fixtures/` (they double as content-system regression tests).
5. Tests must run on a clean checkout: `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e`.

## 8. Git & workflow (D-013)

1. **Small commits, one logical unit; conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`, `perf:`, `refactor:`, `test:`); squash-merge PRs.
2. **Branch protection:** PR required, checks required (lint/typecheck/test/build + e2e + Lighthouse CI); content changes review like code.
3. Pre-commit (Husky + lint-staged): lint, format, typecheck on staged files. Secret scan (gitleaks) in CI.
4. **Message body** references task IDs (`P3-4`) and the decision-log entry when behavior changed.
5. Never commit: `.env*`, build output, `.next/`, lockfile churn without dep change.

## 9. Definition of done (per change)

- [ ] Acceptance criteria of the task ID are met (not only "it compiles")
- [ ] `lint + typecheck + test + build` green; affected CI jobs green
- [ ] axe clean + budgets green on touched routes; reduced-motion + no-JS sanity checked
- [ ] No new deps/secrets/raw hex/placeholders introduced
- [ ] Docs updated (task status, decision log if behavior changed)
- [ ] Change summarized for the owner (< 15 lines): what, evidence, open items

## 10. Review checklist (for any reviewer — human or AI)

1. Types: no `any`, no widening at boundaries; shared schemas used.
2. Tokens: no raw values; both themes considered.
3. Boundary: client islands still within the approved list; secrets nowhere near client.
4. Perf: budgets verified with real numbers; images/fonts optimized.
5. A11y: keyboard, focus, ARIA, reduced-motion, contrast.
6. Content: copy in brand voice; no placeholder/lorem shipped; drafts flagged.
7. Tests: logic covered; e2e for touched flows; CI green.
8. Docs: decision log / notes / task statuses reflect reality.
