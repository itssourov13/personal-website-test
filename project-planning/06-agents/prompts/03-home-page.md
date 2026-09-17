# Prompt 03 — Home Page (P2)

> Copy-paste into a fresh AI agent session. Prerequisite: `02-core-shell-design-system.md` completed (P1 green: shell + design system + 404 verified).

---

**ROLE:** A senior design-engineer implementing the most important conversion surface of a premium personal website ("The Printed Studio" concept). The home page is the owner's professional handshake: it must earn trust in ten seconds and route visitors onward along the hire/trust/referral paths.

**READ FIRST:**
1. `project-planning/README.md` §2 + `06-agents/ai-agent-instructions.md` (if not already read this session)
2. `00-vision/goals-and-audience.md` §5 (reading journeys) + `scope-and-non-goals.md` §3 (boundary rules)
3. `01-brand/design-guidelines.md` — tokens: hero type scale, section spacing, card elevation
4. `01-brand/ui-ux-ideas.md` §4 (home section stack) + §6 (microcopy) + §8 (state checklist)
5. `03-architecture/component-architecture.md` §4 (sections) + `folder-structure.md` §1 (paths)
6. `04-strategy/content-strategy.md` §3 (home copy sources) + `04-strategy/responsive-strategy.md` §3 (layout adaptation)
7. `04-strategy/performance-plan.md` §1 (budgets) — Home is the budget-critical route
8. `05-roadmap/task-breakdown.md` P2 tasks (P2-1…P2-8)

**TASK (Phase P2 — Home page).** Tasks P2-1…P2-8:
- `Hero`: Display1 statement (owner copy per content-strategy), sub-line, dual CTA (primary → /work or /contact per copy, secondary → /services), availability pill from `site.config`; hero intro uses P4 motion *tokens* but stays static in P2 (no client motion yet).
- `ProofBand`: 3 metrics (Fraunces numerals, from `site.config.metrics`) + client wordmark strip — static layout in P2 (`Marquee` is P4-6 optional).
- `SelectedWork`: 3–4 spotlight cards from fixture content (`data/` or first real `.mdx`); hover/focus media-swap component wired with reduced-motion + keyboard fallback (no-JS shows first image only).
- `Capabilities` (3 cards → `/services`), `Testimonials` (fixture `data/testimonials.ts`), `WritingPreview` (renders latest notes when content exists; otherwise the *designed* empty state — "notes coming soon", never blank).
- `FinalCTA` ("Let's make something exceptional." + button) aligned with footer CTA spacing; all internal links resolve (checklist from routing-and-pages §4).
- Microcopy audit (ui-ux-ideas §6): hover/focus/active/reduced-motion/no-JS states designed and implemented for every interactive element.
- Copy work with owner: hero statement + section intros + buttons finalized (content-strategy tone guide); everything not-yet-approved stays labeled `draft:` in config/data, never silently shipped as final.

**ACCEPTANCE CRITERIA:**
- 10-second clarity test passes (owner: "who is this, what do they do, what do I do next?" answered above the fold & re-answered per section)
- Single primary CTA per viewport; hero assets ≤ 250 KB total (AVIF ≤ 250 KB or pure CSS/type hero)
- D-014 budgets green on Home, mobile + desktop (Lighthouse CI config added if not present)
- Section order + internal links match routing-and-pages §4; no dead links (test asserts)
- Reduced-motion variant verified (no motion defined in P2 anyway — confirm nothing *accidentally* animates)
- All interactive targets ≥ 44 px; `:focus-visible` ring visible; contrast per design-guidelines §8
- Fixture content deterministically drives tests (unit: link resolution, metrics formatting, empty-state render)
- Decision Log entry: home shipped with owner-approved copy; any deviations logged

**CONSTRAINTS:** D-017 tokens-only · D-002 strict · D-015 a11y · D-014 budgets gates · D-016 no new runtime deps (motion components are NOT wired yet — Lenis/Motion land in P4) · static-first: Home must build fully static · no placeholder copy shipped (draft flag or owner sign-off only).

**VERIFY:** the four gates (`pnpm lint && pnpm typecheck && pnpm test && pnpm build`) + Lighthouse CI on mobile+desktop + axe 0 critical on Home + `grep -rnE '#[0-9a-fA-F]{3,8}' src` clean. Report actual budget numbers.

**OUTPUT:** summary (< 15 lines): what shipped (sections, states), evidence (commands + numbers), open items (copy/asset needs), suggested next prompt (`04-content-pages-mdx.md`).
