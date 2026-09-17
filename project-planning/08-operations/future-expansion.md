# Future Expansion Plan

> ✅ Approved baseline (direction). These features are **approved as directions — NOT to be built in v1** (per `00-vision/scope-and-non-goals.md` §4). v1 architecture deliberately *leaves room* for each (see Enabler). A feature graduates to a Decision Log entry + roadmap phase only when its trigger fires and the owner approves.

## 1. Decision process for expansion

1. Trigger fires (table below) → owner notes it or agent logs a `suggestion` in `09-decisions/notes-and-assumptions.md`.
2. Owner + agent sketch impact: scope, new dependencies (D-016), privacy posture (D-018), cost, maintenance load (G-7).
3. A Decision Log entry is created (Proposed); owner approves/rejects.
4. If approved → roadmap phase + task breakdown entries with ACs; prompts if agent-run.

**Gate:** any feature adding third-party JS, cookies, tracking, or new architecture classes requires explicit amendments to D-018 / D-016 and a security plan re-check (security §1 register update).

## 2. Approved direction backlog (from `02-features/feature-list.md` B)

| ID | Feature | Trigger | Enabler already in v1 | Notes / architecture impact |
|----|---------|---------|----------------------|------------------------------|
| F-20 | Newsletter (Buttondown/Beehiiv) | ≥ 3 notes published | RSS-first; footer RSS link; `site.config.socials` | If built: link/embed decision (embeds = JS weight + design risk; prefer a button linking to provider page, per feature-rules §C4) |
| F-21 | Booking / availability (Cal.com) | ≥ 4 convos/month | availability pill is a config-driven `<a>` | Keep it a link, not an embed (same rule); provider link → `site.config.availability.href` |
| F-22 | ⌘K command palette | Post-launch polish | stable URL patterns | Small client island; add to technical-architecture §4 client-island list via decision |
| F-23 | CMS migration (Sanity) | co-authors appear | content = zod-validated collections; exports match | Prefer keeping MDX; migrate only on real co-authoring need; content API surface |
| F-24 | Client-side search (fuse/minisearch) | > 40 notes | clean metadata schemas | Search index at build; tiny client island for input/results |
| F-25 | i18n | proven demand | routes centralized; copy in config where practical | Doubles content pipeline; defer until post-launch readership/GSC evidence — big cost, do not pre-build |
| F-26 | Productized offers (Lemon Squeezy) | offer validated | contact + services structure | Payment flow = new security surface; update risk register (security §1) in the same change |
| F-27 | Now / Uses pages | any time post-v1 | static routes ready; `site.config` refactor | Low cost; content-owned |
| F-28 | Comments / webmentions | audience asks | RSS + structured content | Post-merge moderation need; keep out until real demand |
| F-29 | PWA-lite / offline shell | mobile repeat-use evidence | manifest + meta in v1 (D-019) | Only if analytics show repeated visits with flaky connectivity |
| F-30 | Video/talks embeds | content exists | case-study schema extensible | Use self-hosted poster + link or privacy-friendly iframe; never autoplay |
| F-31 | Resume page + JSON API | recruiter demand | — | Simple static page + `/resume.json`; ATS-friendly |
| F-32 | Reading stats / "now writing" | post-launch charm | — | Analytical feature; small |
| F-33 | Webring / blogroll | community backlinks | — | Content + link section; SEO-positive |
| F-34 | Home copy split-test | traffic > 1k/mo | static pages make this trivial | Keep honest: no dark patterns (vision §6) |

## 3. Architecture preparedness (what v1 already guarantees)

- **Config-driven site data** (`lib/site.config.ts`) — most home/nav/footer changes are data edits, not code.
- **Content collections** (`content/work`, `content/writing`, zod schemas) — new collection types (talks, uses) follow the same pattern; CMS migration preserves data via schema.
- **Token theming** — any future surface inherits the design system; no re-skin work.
- **Static-first + one endpoint** — search, booking, newsletter never compromise the performance story if added per the gates above.
- **No Vercel-lock-in** — deployment-agnostic API surface (tech-stack §2) keeps hosting options open.

## 4. Things that will NOT be built (anti-scope, per vision §6)

- Social feed embeds, cookie banners, autoplay media, login walls, comments without moderation, fake-urgency conversion patterns. Any of these requires overturning the vision — owner-level decision only.

## 5. Review cadence

- `08-operations/maintenance-plan.md` quarterly review includes a pass over this table: mark triggers observed, note new ideas (→ `notes-and-assumptions.md`), and prune anything stale.
- The roadmap keeps a "Next" slot for the first graduated feature; never more than one in-flight expansion so the maintenance budget (G-7) holds.

