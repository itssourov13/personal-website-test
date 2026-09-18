# Page Structure & Routing Plan

> ✅ Approved baseline (D-025). Every v1 route with purpose, sections, CTA, metadata focus, and success criteria.

## 1. Route map

| Route                   | Page             | Type                          | Primary CTA                                         |
| ----------------------- | ---------------- | ----------------------------- | --------------------------------------------------- |
| `/`                     | Home             | static                        | "See the work" (+ secondary "Start a conversation") |
| `/work`                 | Work index       | static (filtered client-side) | Open case study                                     |
| `/work/[slug]`          | Case study       | static, generateStaticParams  | "Work together" → /contact                          |
| `/about`                | About            | static                        | "Start a conversation"                              |
| `/services`             | Services         | static                        | "Book a 30-min intro call" + FAQ accordion          |
| `/writing`              | Writing index    | static                        | Open note (+ RSS subscribe)                         |
| `/writing/[slug]`       | Article          | static                        | "See the work" + related notes                      |
| `/contact`              | Contact          | static + serverless POST      | Submit form                                         |
| `/404`                  | Not found        | static                        | "Back to the work"                                  |
| `/rss.xml`              | Feed             | route handler                 | —                                                   |
| `/sitemap.xml`          | Sitemap          | route handler                 | —                                                   |
| `/robots.txt`           | Robots           | route handler                 | —                                                   |
| `/manifest.webmanifest` | PWA meta (D-019) | route handler                 | —                                                   |
| `/og/[...slug]`         | OG images        | edge route                    | —                                                   |

## 2. Per-page spec

### Home `/`

**Job:** 10-second clarity + route the visitor (hire path primary).
**Sections:** Hero (statement `<Display1>`, sub, dual CTA, availability pill) → ProofBand (metrics + client wordmarks) → SelectedWork (3–4 spotlight cards, hover previews, "view all") → Capabilities (3 cards → /services) → Testimonials (2–3) → WritingPreview (3 latest) → FinalCTA ("Let's make something exceptional." + button) → Footer.
**Metadata:** unique title + description; OG with generated image; JSON-LD `Person` (sitewide layout) + `WebSite`.
**Success:** G-1, G-2 proxies; LCP budget; one dominant CTA visible above the fold.

### Work `/work`

**Job:** Filterable proof archive.
**Layout:** PageHeader (title + intro) → FilterBar (discipline × industry chips; client) → ProjectGrid (cards: cover, title, client, outcome metric, tags) → empty state ("No projects match — clear filters") → CTA strip.
**Metadata:** `CollectionPage`; per-card JSON-LD optional (rich snippets); canonical `/work/` (no query params indexed — filters client-side only).
**Success:** every card links to detail; filter subsets tested; keyboard-operable; SR announces result count.

### Case study `/work/[slug]`

**Job:** The conversion engine — turn a visitor into a conversation.
**Anatomy (ui-ux-ideas §7):** Hero cover → Context strip (client, role, timeline, stack chips) → MetricBand (2–4 outcomes) → "The problem" → "The approach" (with artifacts/screenshots) → "The outcome" (metrics + client quote) → "What I learned" → RelatedWork → FinalCTA.
**Metadata:** unique title ("Case study — client — outcome" patterns), OG card, JSON-LD `Article`/`CreativeWork`; canonical per slug.
**Success:** reads standalone when shared; < 3 clicks to contact; images lazy/priority-correct; A-004 content quality bar.

### About `/about`

**Job:** Humanize + authority.
**Sections:** PageHeader → Bio (2–3 paras, first person) → Principles (3–5, editorial) → "How I think about design & engineering" (short essay) → Toolkit (chips: tools/stack) → Career timeline (compact, honest gaps ok) → Personal note (one human detail: coffee, cameras, climbing — A-006) → CTA. _(Résumé link optional F-31.)_
**Metadata:** JSON-LD `Person` enriched (sameAs, jobTitle, knowsAbout).
**Success:** visitor leaves liking AND trusting the person.

### Services `/services`

**Job:** De-risk hiring; clarify engagement.
**Sections:** PageHeader → Engagement models (3 cards: Design Sprint / Product Partner / Fractional Advisory — each: what you get, timeline, format, starting point) → "How we work together" (steps 1–4) → Typical timeline graphic (horizontal steps) → FAQ (5–8 Q&A accordion) → Testimonial → FinalCTA.
**Metadata:** unique title + FAQ JSON-LD (rich results).
**Success:** FAQ answers pre-sales questions; clear next action; honest about what owner does NOT do.

### Writing `/writing`

**Job:** Trust + retention + SEO surface.
**Sections:** PageHeader → note list (title, date, reading time, excerpt, tags) → sort by date; tags row; RSS subscribe pill → CTA strip.
**Metadata:** `Blog`/`CollectionPage`; feed-linked (`<link rel="alternate">`).
**Success:** drafting workflow (scripts/new-post) works; drafts excluded everywhere.

### Article `/writing/[slug]`

**Job:** Readable, shareable substance.
**Anatomy:** Title (Display2) → meta (date, reading time, tags) → Prose body → related notes (tag overlap) → CTA → back to index.
**Extras:** ScrollProgress bar; JSON-LD `BlogPosting` (author, datePublished/Modified); prev/next; footnote-safe.
**Success:** mobile reading > 80 s avg; reading-time accurate; internal links to 1–2 related notes + work.

### Contact `/contact`

**Job:** Convert intent into a reply.
**Sections:** PageHeader → trust line ("I reply within 24–48h") → form (F-6 spec) → response-time promise + mailto fallback → what happens next (3 steps) → FAQ-mini.
**Metadata:** minimal; canonical.
**Success:** F-6 AC; zero spam-by-hand measured via honeypot/rate-limit logs; G-2.

### 404 `/404`

**Job:** Brand moment, no dead end.
**Content:** Display text "This page is missing." + one-liner + primary link "See the work" + theme-aware design + humorous-but-calm note. HTTP 404 status; excluded from sitemap.
**Success:** no user reports confusion; SR-friendly.

## 3. Routing/technical rules

- All routes static unless noted; `generateStaticParams` for both content types; `dynamicParams = false` (unknown slugs → 404).
- Route groups `(marketing)` keep URLs clean; no layout side-effects per page.
- Headings: exactly one `h1` per page (PageHeader/markdown first heading); hierarchy enforced.
- Alternate URLs: `zh`/locale prefixes not in v1 (D-014 → F-25).
- Old slugs: redirect map in `next.config.ts` (301) — maintain during content edits (SEO plan).
- `robots`: crawl everything public, exclude `/api`, `draft` content never exported, no `noindex` artifacts.

## 4. Navigation & link architecture

- Global nav: Work · Writing · About · **More** (disclosure menu — D-036/D-038; superseded the original "5th slot reserved for availability pill" plan). Services moved out of primary nav in D-036; the availability pill is the sole CTA. Contact reachable via the More menu + every FinalCTA + footer.
- Secondary pages (Services, Contact, Now, Ideas, Life, Photography, Lab, Topics, Uses, Resume, Colophon, Bookmarks) are reachable via the header's More menu (desktop), the mobile nav's "More" group, the footer, and ⌘K — never crowding the primary bar (D-036, D-038).
- Internal-linking minimums: every case study links ≥ 1 other case study + contact; every note links ≥ 1 related note + home/work; about ↔ services ↔ contact cross-linked.
- All internal links use `next/link`; external `target=_blank` + `rel` per component spec.

## 5. Routes added after the v1 baseline

This file's route map (§1) is the frozen, fully-specced D-025 baseline — it was never rewritten as later phases shipped. The routes below exist in the actual site but only have a spec in decision-log.md, not a full per-page entry here:

| Route                        | Type                         | One-line purpose                                                                                                                     | Introduced                |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `/now`                       | static                       | Single hand-edited "what I'm doing right now" snapshot                                                                               | D-033                     |
| `/uses`                      | static                       | Tools/hardware/software list                                                                                                         | D-033                     |
| `/resume`                    | static                       | HTML résumé (no `/resume.json` yet — see notes-and-assumptions.md)                                                                   | D-033                     |
| `/colophon`                  | static                       | How the site itself is built                                                                                                         | D-036                     |
| `/lab` + `/lab/[slug]`       | static, generateStaticParams | Interactive code experiments; empty-architecture pattern                                                                             | D-036, demo entry D-037   |
| `/speaking`                  | static                       | Talks list; deliberately excluded from nav/sitemap while empty (an empty talks page reads as a false claim, unlike an empty gallery) | D-036                     |
| `/topics` + `/topics/[slug]` | static, generateStaticParams | Tag aggregation across writing/work/lab/ideas                                                                                        | D-036, extended D-038     |
| `/bookmarks`                 | static                       | Curated links; demo entries policy per D-037                                                                                         | D-036, demo entries D-037 |
| `/photography`               | static                       | Photo grid; empty architecture, no fabricated images                                                                                 | D-038                     |
| `/life`                      | static                       | Reverse-chronological short entries; no detail route yet (see D-038)                                                                 | D-038                     |
| `/ideas` + `/ideas/[slug]`   | static, generateStaticParams | Non-client essays/thoughts; full content-collection treatment                                                                        | D-038                     |

All of the above follow §3's routing/technical rules (static, `dynamicParams = false`, one `h1`, `noindex` while a collection is empty rather than omitted from the codebase).
