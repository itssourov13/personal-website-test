# Prompt 04 — Content Pages & MDX System (P3)

> Copy-paste into a fresh AI agent session. Prerequisite: `03-home-page.md` completed (P2 green). This is the highest-volume phase — work in the order below and keep every route buildable at each commit.

---

**ROLE:** A meticulous full-stack implementer wiring the typed content system (Velite/MDX + zod) and building all remaining v1 pages: Work index + case studies, Writing index + notes, About, Services, Contact UI.

**READ FIRST:**

1. `project-planning/README.md` §2 + `06-agents/ai-agent-instructions.md` (global rules, §4 working method)
2. `03-architecture/tech-stack.md` §1 (Velite/MDX) + `technical-architecture.md` §3 (rendering) + §5 (data flow)
3. `03-architecture/folder-structure.md` §4 (content frontmatter contract) — **normative**
4. `03-architecture/routing-and-pages.md` §2 (per-page specs for Work/Case Study/About/Services/Writing/Article/Contact)
5. `01-brand/ui-ux-ideas.md` §7 (detail-page anatomy) + §5 (contact form UX spec) + §6 (microcopy)
6. `04-strategy/content-strategy.md` §3–§4 (inventory + workflow) + `seo-strategy.md` §3 (on-page rules)
7. `04-strategy/responsive-strategy.md` + `accessibility-plan.md` §4–§5 (filters, forms)
8. `05-roadmap/task-breakdown.md` P3 tasks (P3-1…P3-10)

**TASK (Phase P3 — Content pages).** Tasks P3-1…P3-10, in this order:

1. **Content foundation:** Velite install + `velite.config.ts`; `WorkSchema` + `NoteSchema` (folder-structure §4, zod); `lib/content.ts` typed queries (bySlug, featured, byTag, related, drafts excluded); templates `content/work/_template.md` + `content/writing/_template.md`; `scripts/new-post.mjs` + `scripts/check-content.mjs`; wire check-content into CI.
2. **Sample content:** 1 fixture work + 1 fixture note (deterministic, seed `tests/fixtures/`); owner drafts land as they approve (A-004/A-005 — may start 2 case studies + 1–2 notes, quality-gated).
3. **Work index** `/work`: PageHeader, card grid (cover, client, discipline/industry tags, top metric), `FilterBar` client component (discipline × industry, `aria-pressed` chips, SR results announcement `aria-live`, unit-tested filter logic, no-URL-state by design — document in decision log only if changed).
4. **Case study** `/work/[slug]`: generateStaticParams + `dynamicParams=false`; anatomy — hero cover → context strip (client/role/timeline/stack) → `MetricBand` → problem/approach/outcome/learnings → gallery (lazy, priority-correct) → RelatedWork → FinalCTA; breadcrumbs; graceful hidden MetricBand when no metrics; `draft: true` items excluded everywhere (routes, sitemap, RSS).
5. **Writing index + article** `/writing` + `/writing/[slug]`: list (sort, tags, RSS pill), reading time (computed at build), progress bar (P4 client component — static placeholder now), related notes, prev/next.
6. **About** `/about` (bio, principles, toolkit, career timeline, personal note A-006) + **Services** `/services` (3 engagement models, how-we-work, timeline graphic, FAQ accordion — accordion keyboard/semantics per component-architecture §2) — copy per content-strategy inventory.
7. **Contact UI** `/contact`: form component with ALL states (ui-ux-ideas §5: idle/typing/validating/submitting/success/error/rate-limited) calling **mock endpoint in dev** (P5-5 wires the real route); mailto fallback visible in no-JS.
8. **RSS** `rss/route.ts` (full content; autodiscovery `<link>` in layout head); **tests**: schema validation, filter logic, reading-time, formatters, content queries — vitest ≥ 90% line coverage on `src/lib` and `src/lib/content.ts`-adjacent logic.

**ACCEPTANCE CRITERIA:**

- All 9 v1 routes + RSS build statically with real (non-dummy) content; `pnpm build` green
- Draft exclusion verified: draft items absent from index routes, `generateStaticParams`, sitemap, RSS
- Work filter returns correct subsets (unit tests against fixtures); SR announcement on filter change; keyboard-operable chips
- Every published case study renders all required anatomy blocks; MetricBand hides gracefully when absent
- axe 0 critical on `/work`, `/writing`, `/about`, `/services`, `/contact`, one case study, one note
- Reading time within ±10% of reference; RSS validates (W3C validator or equivalent)
- Contact form: all states visible in UI; dev mock returns success/failure/rate-limit deterministically; no console errors
- Decision Log entry: content system shipped (Velite version, schema versions), any frontmatter contract deviations logged

**CONSTRAINTS:** D-002 strict · D-005 MDX/Velite (no CMS) · D-017 tokens-only · D-016 no new runtime deps without log entry (Velite is a build-time dep — record it) · raw HTML disabled in MDX · static-first: all content routes build-time static · no lorem/filler copy (draft flag instead) · filter state intentionally NOT in URL (local component state).

**VERIFY:** the four gates + `scripts/check-content.mjs` output (completeness report) + vitest coverage report + manual browser pass on each new route (keyboard + reduced-motion + 320 px width).

**OUTPUT:** summary (< 15 lines): routes shipped, content count (draft/approved), test/coverage numbers, open items (owner copy/asset needs), suggested next prompt (`05-motion-seo-performance.md`).
