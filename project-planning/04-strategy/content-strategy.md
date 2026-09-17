# Content Strategy

> ✅ Approved baseline. Content is a first-class v1 deliverable (Project Overview §7-2); placeholder copy is a defect, flagged not shipped.

## 1. Positioning & content thesis

The site sells **evidence of craft**, not adjectives. Content types map to conversions:

| Content type | Converts | Because it demonstrates |
|---|---|---|
| Case studies | Hire path | Problem→process→outcome with metrics |
| Notes | Trust path + SEO | Thinking, judgment, generosity |
| Services/FAQ copy | Hire path | Clarity, honest scoping |
| About | All paths | Humanity, credibility, values |
| Microcopy | Brand loyalty | Attention to detail everywhere |

**Thesis:** *Depth is the differentiator.* One honest, metric-backed case study out-credentializes ten glossy ones.

## 2. Content pillars (3)

1. **Craft — "How I design & build"** → case studies, process breakdowns, before/afters.
2. **Engineering — "How I think about systems"** → notes on architecture, performance, a11y, quality gates.
3. **The practice — "How we should work together"** → notes on consulting, scoping, collaboration; supports services conversion.

Content calendar cadence (post-launch; v1 ships the inventory in §5):
- Case study: per completed engagement (1–3/yr), published within 2–4 weeks of wrap.
- Notes: **1/month** sustainable minimum, quality-gated (tone pass + fact check).
- Site copy refresh: quarterly review of home/services/contact (measure + iterate).

## 3. Content inventory — v1 deliverables

| Item | Type | Status plan | Owner notes |
|---|---|---|---|
| Home hero + sections copy | Page | Write in P2 | Includes microcopy, availability label |
| Case study A | Work MDX | Draft in P3 | Highest-impact recent project |
| Case study B | Work MDX | Draft in P3 | Second project (different discipline if possible) |
| Case study C (optional) | Work MDX | Quality-gate | Only if it clears the bar (A-004) |
| Note 1 — design systems | Writing MDX | Draft in P3 | E.g., "Design tokens are a contract, not a theme" |
| Note 2 — performance | Writing MDX | Draft in P3 | E.g., "Why my site loads in under a second" (meta, dogfood) |
| Note 3 (optional) | Writing MDX | Quality-gate | A-005 |
| About bio + principles | Page | Write in P2 | 200–350 words + 3–5 principles |
| Services copy + 3 models + FAQ | Page | Write in P3 | FAQ from real pre-sales questions |
| Testimonials (2–3) | data/ | Collect P3 | Ask past clients; name/anonymize |
| 404 + empty states + errors | Microcopy | P1–P4 | Deliberate, on-brand |
| site.config copy | Config | P1 | Signals + one-liners |

**Content quality bar (applies to everything):**
- Specific > generic; numbers over adjectives; honest failures included in case studies.
- Readable at 8th-grade level for notes (short sentences; jargon explained).
- One idea per paragraph; headings that survive "headline-only" skimming.
- No AI-slop patterns: no "in today's fast-paced world", no filler transitions, no fake enthusiasm.
- Every page's copy passes the tone guide (§6).

## 4. Content model & workflow

- Files in `content/` (MDX + validated frontmatter per `folder-structure.md` §4).
- **Draft flow:** `pnpm new:post work|writing` scaffolds from `_template.md` → write → `pnpm check:content` → PR with `draft: true` until owner approves → flip `draft: false` + publish (deploy is the publish mechanism; preview URL review first).
- Images: added to `public/images/{work|writing}/<slug>/`, optimized by pipeline; naming `<n>-<descriptor>.<ext>` (e.g., `01-hero.webp`).
- Version control = backup + history (notes on git LFS only if assets > 50 MB — unlikely; keep assets lean).
- Role clarity: **owner writes**; **agents draft/restructure/polish only with explicit instruction** — content voice is personal and cannot be automated by default (A-007).

## 5. Voice & tone guide (examples)

| Scenario | Say (example) | Never say |
|---|---|---|
| Hero | "I help product teams ship design and code as one craft." | "We empower brands to unlock synergies." |
| Case study failure | "The first onboarding flow failed retention tests — we cut it to two screens." | "Through iterative optimization we achieved paradigm shifts." |
| FAQ | "Yes — I'll work inside your existing product cycle. Here's what I need from your team." | "Please contact our solutions team for granular insights." |
| 404 | "This page is missing. Even the best sites have a draft that got away." | "Error 404: resource not found." |
| Form error | "That email doesn't look right — mind checking it?" | "Invalid input format detected." |
| Footer | "Designed & built by Sourov Mondol. No trackers, no cookies." | "© All rights reserved. Terms apply." |

- **Word list:** use *I / my / me*; *craft, shipped, measurable, deliberate*; avoid *excited to, thrilled, amazing, cutting-edge, revolutionize, empower, seamless* (overused), *solutions*, superlatives.
- **Punctuation:** em-dashes fine; exclamation marks ≤ 1 per page; ellipses sparingly.
- **Numbers:** real metrics or nothing; "%" with actual figures; rounding marked "~" when estimated.
- **Links in copy:** write link text as the target ("my take on design tokens"), never "click here".

## 6. SEO-content alignment (summary; detail in seo-strategy.md)

- Case studies target `[discipline] for [industry]` queries + brand-adjacent ("product designer case study", "[tool] case study").
- Notes target long-tail learned queries; 1 focus keyword cluster per note, in title/h1/first 100 words/NLPs; avoid keyword stuffing.
- FAQs (services) target question queries for rich results.
- All pages: unique titles/descriptions, canonical, internal links per routing rules.

## 7. Content governance

- `content/` is locked to review-PRs (branch protection); drafts merged only with owner approval.
- Quarterly: archive/refresh stale notes (add `updated` date, fix links — SEO plan §6).
- Every content change updates: sitemap (auto), RSS (auto), OG (auto), related lists (auto) — because everything is derived from collections.
- Content metrics reviewed in maintenance cadence (08-operations/maintenance-plan.md): reads, share CTR, case-study completion, contact rate.
