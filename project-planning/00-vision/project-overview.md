# Project Overview

> ✅ Approved baseline — read this before anything else.
> Status: Planning complete · Code not started · Owner: site owner (single maintainer)

## 1. One-paragraph summary

We are building a **premium personal website** for a senior product designer and front-end engineer (working persona: *Sourov Mondol* — placeholder, see A-001). The site functions as the owner's professional home base: a portfolio, thought-leadership platform, and conversion tool for consulting engagements — presented with the editorial polish and craft of a high-end design studio. It is not a template site: every pixel, interaction, and word is deliberate, and the tech behind it is as clean as the interface.

## 2. What "premium" means for this project (working definition)

Premium is a *quality bar*, not a style:

1. **Craft over decoration** — restrained design, generous whitespace, precise typography, deliberate motion.
2. **Details at every size** — from favicon to 4K desktop, from 150 ms hover states to 404 pages.
3. **Editorial content standard** — real writing, structured case studies, no filler.
4. **Engineering excellence** — type-safe code, sub-2 s LCP, zero layout shift, WCAG 2.2 AA.
5. **Own the experience** — no cookie banners, no trackers beyond privacy-first analytics, no third-party UI debt.

## 3. Product in one sentence

> A fast, elegant, content-rich personal website that turns the owner's craft into credibility, work into case studies, and visitors into consulting conversations.

## 4. Key facts (canonical — see decision log for IDs)

| Dimension | Value |
|---|---|
| Category | Personal website / portfolio + blog |
| Positioning | Independent product designer & engineer; "design-led engineering for ambitious product teams" |
| Primary job | Win the reader's trust → showcase work → start a conversation |
| v1 pages | 9 routes (see §6) |
| Stack | Next.js 15 + TypeScript + Tailwind v4 + MDX (D-001..D-013) |
| Hosting | Vercel (D-007) |
| Analytics | Plausible, privacy-first (D-008) |
| Deadline style | Quality-gated, not date-gated; ~8 weeks part-time (10–15 h/wk) |
| Maintenance | Single maintainer; low-touch by design |

## 5. Success at a glance

- A new visitor can articulate what the owner does **within 10 seconds** of landing.
- Any project page can be shared on its own and reads as a complete story.
- Someone ready to hire knows exactly **how to start a conversation** and what happens next.
- The site loads fast enough that performance is never the reason someone leaves.

## 6. v1 deliverables (high level)

| # | Area | Deliverable |
|---|------|-------------|
| 1 | Home | Hero, capability statement, selected work, services summary, social proof, CTA + footer |
| 2 | Work | Project index with filters + full case study pages (story-structured, métrics where available) |
| 3 | About | Bio, principles, toolkit, career highlights, personal touch |
| 4 | Services | Offerings, engagement models, "how we work", FAQ, CTA |
| 5 | Writing | Notes index + article pages (MDX, RSS feed) |
| 6 | Contact | Validated contact form → email (Resend), response-time promise |
| 7 | Global | Dark/light theme, smooth scroll, page transitions, 404, SEO/OG/RSS foundation |

See `02-features/feature-list.md` for the full matrix and `03-architecture/routing-and-pages.md` for per-page specs.

## 7. Constraints (non-negotiable)

1. **Performance budgets** (D-014) and **accessibility target WCAG 2.2 AA** (D-015) are hard gates at every phase — not launch-week polish.
2. **Content is first-class.** Empty states, lorem ipsum, and placeholder copy must be flagged to the owner, never silently shipped.
3. **Dependency discipline.** New runtime dependencies require a Decision Log entry with rationale (D-016).
4. **Design tokens are law.** No ad-hoc colors, spacing, or type sizes outside `01-brand/design-guidelines.md` (D-017).
5. **Privacy by default.** No cookies, no fingerprinting, no third-party embeds that track (D-018).
6. **The plan is the contract.** Deviations from scope require a flagged decision, not a silent change (see `07-guidelines/documentation-system.md`).

## 8. What is out of scope for v1

E-commerce, user accounts, comments, membership, booking automation, multi-language, CMS — all explicitly deferred. See `00-vision/scope-and-non-goals.md` and the future features list in `02-features/feature-list.md`.
