# Documentation System

> ✅ Approved baseline. **Normative** for every human or AI agent touching this repository. This package (`project-planning/`) is the contract between the owner and every future agent: if code and docs disagree, the docs must win the argument — then be updated.

## 1. Purpose & position

- `project-planning/` is the **single source of truth** for _what_ this website is, _why_, and _how_ it is built. The website code lives at the repo root, outside this folder.
- The `README.md` is the master index and mandatory reading order. Every agent reads it first (also via root `AGENTS.md`).
- Documentation is a first-class deliverable: a PR that changes behavior without updating docs is incomplete (ai-agent-instructions §7).

## 2. Folder map

| Folder             | What lives there                                                          | Rules                                                                                                     |
| ------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `00-vision/`       | Overview, vision, goals/audience, scope                                   | Changes only with owner decision (Decision Log entry)                                                     |
| `01-brand/`        | Identity, design concept, UI/UX ideas, **design guidelines**              | Guidelines = normative; token changes require Decision Log entry + version bump (§9 of design-guidelines) |
| `02-features/`     | Feature list (F-*) core + future                                          | AC changes = Decision Log entry                                                                           |
| `03-architecture/` | Tech stack, technical architecture, folder structure, components, routing | Reconciliation required whenever code structure evolves                                                   |
| `04-strategy/`     | Content, SEO, performance, security, a11y, responsive, animation          | Normative plans; budgets/headers are hard gates                                                           |
| `05-roadmap/`      | Roadmap + task breakdown (P-_, X-_)                                       | Task statuses updated continuously; add tasks, never delete (mark `deferred` with reason)                 |
| `06-agents/`       | Agent instructions + prompt files                                         | Prompts updated when the plan changes materially                                                          |
| `07-guidelines/`   | **Coding guidelines**, documentation system (this file)                   | The "how we work" rules                                                                                   |
| `08-operations/`   | Deployment, maintenance, future expansion                                 | Pre/post-launch runbooks                                                                                  |
| `09-decisions/`    | Decision log, notes & assumptions, handoff documentation                  | Append-only decision log; living notes                                                                    |

## 3. Status legend (normative)

- **✅ Approved** — bind as-is. Implement, do not re-litigate; propose changes via a new decision.
- **🟡 Draft / needs-validation** — read and verify before relying; resolves via evidence or owner decision, then flips to ✅ or is amended.
- **🔧 Plan** — intent for a later phase; not binding yet.

Every file header carries its status. If you see a reference to a doc that does not exist or is stale, fix it in the same change you notice it.

## 4. Change workflows

### 4.1 Decision Log (`09-decisions/decision-log.md`)

Append-only registry of architectural/strategic decisions (D-*). Rules:

1. **New decision** → new row with ID (next free number), date, status (Proposed → Approved / Rejected), context, decision, rationale, consequences, reviewer (owner unless gated).
2. **Change to an approved decision** → new entry _superseding_ the old one; never edit an Approved entry's outcome in place (annotate "Superseded by D-XXX").
3. Required events: new runtime dependency, token/font/color change, page/route change, budget change, scope change, client-island addition, privacy posture change.
4. Small implementation deviations (naming, file location within approved structure) belong in the phase report / commit message, not the log.

### 4.2 Notes & assumptions (`09-decisions/notes-and-assumptions.md`)

Living file for assumptions (A-*), open questions, suggestions, incidents. Tags: `needs-validation` (must be resolved before relying), `suggestion` (out-of-scope idea), `blocker` (needs owner input), `incident`. Resolutions update the note and, if architectural, graduate to the decision log.

### 4.3 Phase reports

At each phase exit, record (in the decision log): what shipped, evidence (commands/results), deviations, owner sign-off status. This is the audit trail for `README.md` §6 statuses.

## 5. When docs MUST be updated (checklist)

- [ ] A task status changes in `05-roadmap/task-breakdown.md`
- [ ] A phase passes or is cut short (phase report)
- [ ] Behavior, route, component, or data shape changes → architecture + affected strategy docs
- [ ] Token, color, type, spacing changes → design-guidelines + version bump
- [ ] New dependency, secret, env var, or account → tech-stack §5 + security plan + deployment plan
- [ ] Content model change → folder-structure §4 + content-strategy §3 + feature list
- [ ] Any hard gate (budget, a11y target, privacy) is touched → decision log + README canonical facts
- [ ] Deployment/maintenance procedures change → `08-operations/*`

## 6. Style rules for docs

1. English, plain, imperative for instructions; tables for comparisons/contracts; one idea per file.
2. Every file: status header, `## 1.` numbered sections, cross-references with relative paths (`` `04-strategy/performance-plan.md` ``).
3. Canonical facts (README §3) are referenced by ID (D-_, A-_, F-_, P-_, G-*) — never paraphrase silently; keep IDs unique.
4. Absolute shortest path that is self-sufficient: reference a doc, not a phrase, when semantics are normative.
5. No "TBD"/"later" without an owner decision or an explicit `🟡` draft flag. Ambiguity must be tagged, not hidden.

## 7. Keeping it honest

- Do not write a doc that the code contradicts. If you find drift, either fix the code (if docs are right) or update the docs (if the plan changed) — and record which and why.
- Do not copy-paste walls of logs/JSON into docs; summarize with evidence pointers.
- Deletions: files never die silently — mark superseded/archived with a pointer to the successor.
- The owner reviews docs on the same bar as code: token/AC/budget changes are owner-gated by default.
