# Notes & Assumptions

> ✅ Approved process (documentation-system §4.2). **Living file**, not append-only: assumptions (A-*) are resolved/updated as facts land; open questions, suggestions, blockers, and incidents are tracked here with tags. Tags: `needs-validation` · `suggestion` · `blocker` · `incident`.

## 1. Assumptions register

| ID | Assumption | Status | Resolution path |
|----|-----------|--------|-----------------|
| A-001 | Persona name is **Sourov Mondol** (real, owner-provided 2026-09-17; short/display form "Sourov" — `siteConfig.shortName`). The surrounding role/tagline ("independent product designer & engineer, independent consultant") and all bio/career narrative (About, Resume, testimonials, case studies) are still the original placeholder copy, carried forward under the new name — see D-035's finding that this body copy is agent-invented, not yet owner-confirmed | 🟡 Partially resolved | Owner confirms real role/title + supplies real bio, case-study, and resume content → update tagline/description in `lib/site.config.ts` + `/about` + `/resume` + `data/testimonials.ts` |
| A-002 | Domain is **`sourovmondol.studio`** (placeholder, renamed 2026-09-17 to match the new persona name — same unregistered-placeholder status as before, not owner-confirmed) | 🟡 Active | Owner registers/confirms domain → update `site.config.ts`, DNS, Vercel project, deployment plan |
| A-003 | Domain + owner jurisdiction not yet confirmed; legal pages & GDPR details deferred | 🟡 Active | Owner confirms jurisdiction → resolve D-027 (privacy/impressum scope) + consent posture |
| A-004 | v1 ships **3–4 case studies**; may start with 2, quality-gated | 🟡 Active | Owner provides/approves case-study content (P3) |
| A-005 | v1 ships **3 notes/articles**; may start with 1–2, quality-gated | 🟡 Active | Owner provides/approves notes (P3) |
| A-006 | About page includes one human personal detail (direction: "coffee, cameras, climbing") | 🟡 Active | Owner confirms personal detail at P3 copy finalization |
| A-007 | **Owner writes the final copy** (bio, case studies, notes, microcopy); agents scaffold drafts flagged `draft: true` only | ✅ Confirmed | Enforced by ai-agent-instructions §4.5; no placeholder copy ships |

## 2. Open questions (`needs-validation`)

| # | Question | Why it matters | Needed from |
|---|----------|----------------|-------------|
| N-1 | Owner pronouns + exact title/role for bylines + JSON-LD `Person` (name itself is resolved: Sourov Mondol — A-001) | Every page metadata | Owner |
| N-2 | Real metrics for ProofBand + case studies (years, impact numbers) | Credibility of proof sections | Owner |
| N-3 | Testimonials: 2–3 real quotes or anonymized client words? | Trust path | Owner |
| N-4 | Apex vs www canonical (default: apex + 301) — D-028 | SEO + link hygiene | Owner at P7 |
| N-5 | Case-study client names public or anonymized? | Legal/brand | Owner |
| N-6 | Social profiles to include in footer/config (GitHub/LinkedIn/X/Dribbble/RSS) | Brand hygiene | Owner |

## 3. Suggestions (out-of-scope ideas — logged, not built)

*Add entries as they arise (source: scope-and-non-goals §3, agents, owner). Each suggestion: idea · why now/not now · trigger.*

Logged from the 2026-09-13 personal-brand audit (not built this pass — see decision-log.md D-035):

| Idea | Why now / not now | Trigger to build |
|---|---|---|
| ~~`/colophon` page~~ | **Built 2026-09-13** — owner explicitly requested it in the Phase 1 expansion; see decision-log.md D-036. | Done |
| `/resume.json` (ATS-friendly companion to F-31's `/resume` page) | F-31 (future-expansion.md) explicitly names this pairing; the HTML `/resume` page shipped without it. | Recruiter demand fires F-31 fully |
| `/topics/[tag]` landing pages | Only 3 writing posts + 2 case studies exist; taxonomy elevation adds nothing until there's enough content for a topic page to feel substantive, not sparse. | Writing archive grows past ~10–15 posts across a stable tag set |
| Client-side search (F-24) | Trigger explicitly ">40 notes" in feature-list.md; currently 3. Command palette's substring match already covers today's tiny catalog. | >40 notes published |
| ~~`/lab`~~ | **Architecture built 2026-09-13**, updated 2026-09-14: 1 demo entry added (`demo: true`, visible "Sample" badge, `noindex`) per owner's explicit "add clearly-marked demo content" instruction — see D-037. | Owner publishes a real entry (demo entry can stay alongside or be removed) |
| ~~`/speaking`~~ | **Route built 2026-09-13**, deliberately unlinked from header/footer nav and the command palette while `data/talks.ts` is empty — reachable only by direct URL, `noindex`. See D-036. | Owner adds a real talk to `data/talks.ts` — at that point, link it |
| ~~`/bookmarks`~~ | **Architecture built 2026-09-13**, updated 2026-09-14: 2 demo entries added (real, verifiable URLs — web.dev/learn, a11yproject.com checklist — tagged `demo: true`, visible "Sample" badge, `noindex` while no real entries exist) per D-037. `/reading` still NOT built — still duplicates `/writing` too closely, and Phase 6 of the 2026-09-14 request kept talks/personal-history-adjacent content off-limits even as demo. | `/bookmarks`: owner adds real entries. `/reading`: owner wants a distinct reading log |
| ~~`/photography`~~ | **Built 2026-09-17** — owner explicitly requested it (identity + expansion request); see decision-log.md D-038. Architecture only: `data/photos.ts` ships empty, zero images fabricated, honest empty state, `noindex` while empty. | Owner adds real photographs to `data/photos.ts` |
| ~~`/life`~~ | **Built 2026-09-17** — owner explicitly requested it; see decision-log.md D-038. `content/life/` ships with only `_template.md`, no invented journal entries, `noindex` while empty. Deliberately has no per-entry detail route yet (entries render inline on one page) — adding one before any real entry exists would be exactly the kind of speculative infrastructure `/lab`'s lightbox note above already argues against. | Owner adds real entries via `content/life/*.mdx`; a `/life/[slug]` detail route is worth adding once entries are long enough to want one |
| ~~`/ideas`~~ | **Built 2026-09-17** — owner explicitly requested it; see decision-log.md D-038. Full content-collection architecture (index + detail + related-ideas + topics integration), zero real entries shipped, `noindex` while empty. | Owner adds real entries via `content/ideas/*.mdx` |

**Retroactive note on batch 1/2 (2026-09-13):** `/now`, `/uses`, `/resume`, and the ⌘K command palette were built in owner-requested "premium upgrade" batches *before* this audit, ahead of their documented triggers (F-27 "any time post-v1" — soft trigger, low risk; F-31 "recruiter demand" — not yet fired; F-22 "post-launch polish" — site hasn't launched). Each was owner-requested in the moment ("do these"), which is a valid way to fire a trigger early, but the scope-and-non-goals.md §3.1 process (log as suggestion, surface, then build) wasn't followed at the time — they were built directly. Recorded here for traceability; not reversed, since rule 10 ("don't replace working functionality without a clear reason") applies and the owner has now seen and kept them across two follow-up turns.

## 4. Blockers

| ID | Blocker | Blocks | Unblock needs |
|----|---------|--------|---------------|
| — | None at baseline | — | — |

## 5. Incident log

*Append `incident` entries here (maintenance-plan §6): date · summary · impact · root cause · fix · prevention added.*
None recorded.

## 6. Notes & decisions pending owner review

- **Pkg-manager/theme double-reference:** the approved tech-stack table references both next-themes and pnpm as D-006; recorded together in the decision log entry D-006 and kept identical here for traceability.
- **Filter state not in URL** (F-4): deliberate v1 choice (local component state) — revisit if shareable filtered views are requested.
- **Fail-open rate limiting** (security §3.4): default for v1 (low traffic, spam tolerable, zero false-negative UX cost); owner may flip to fail-closed at P4.
