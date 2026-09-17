# Scope & Non-Goals

> ✅ Approved baseline. Scope is enforced through the roadmap (`05-roadmap/`) and task breakdown (`05-roadmap/task-breakdown.md`). Anything not listed here or in `02-features/feature-list.md` is out of scope until a Decision Log entry says otherwise.

## 1. In scope — v1 (must ship)

### Pages (9 routes)
1. `/` Home
2. `/work` Work index (portfolio list, filterable)
3. `/work/[slug]` Case study detail
4. `/about` About / bio
5. `/services` Services & engagement models
6. `/writing` Writing/notes index
7. `/writing/[slug]` Article detail
8. `/contact` Contact & booking form
9. `/404` Custom 404

Plus system routes: `sitemap.xml`, `robots.txt`, `rss.xml`, `manifest.webmanifest` (PWA-minimal, D-019), favicon/OG-image generation.

### Capabilities (summary — full detail in `02-features/feature-list.md`)
- Design system: tokens, theme (light/dark), typography, primitives (F-7, F-14)
- Content system: MDX collections for work + writing, site config single source of truth
- Contact form: validation, honeypot, rate limit, email delivery (F-6)
- SEO foundation: metadata API, JSON-LD, sitemap, OG images, RSS (F-8)
- Motion: smooth scroll, scroll reveals, page transitions, micro-interactions — reduced-motion aware
- Accessibility: WCAG 2.2 AA throughout, skip links, focus management, semantic structure
- Performance: static-first, image pipeline, fonts optimization, streaming where useful
- Deployment: Vercel preview+production, CI checks (lint/type/test/build), analytics (Plausible)

### Content deliverables (v1)
- 3–4 case studies (per A-004; may start with 2, quality-gated)
- 3 notes/articles (per A-005; may start with 1–2)
- About, services copy, FAQ (5–8 Q&A), testimonial slots (2–3)
- Microcopy everywhere: empty states, form states, 404, mailto fallbacks
- site.config.ts content (name, domain, socials, availability, response promise)

## 2. Explicitly out of scope — v1 (do NOT build)

| Area | Why deferred | Revisit trigger |
|---|---|---|
| User accounts, login, admin panel | No need; content is files in git | Content editors join (F-16 CMS) |
| Comments / guestbook | Moderation burden; trust signal questionable on personal sites | Audience requests it (F-20) |
| E-commerce / shop | Inventory, payments, tax — all new domains | Productized offering proven (F-17) |
| Booking/payment automation | Cal.com embed breaks design cohesion and adds JS weight | ≥ 4 conversations/month (F-13) |
| Newsletter/email capture | Adds third-party JS + design debt in v1 | 3+ notes published (F-12) |
| Multi-language (i18n) | Doubles content + routing complexity; audience is English-first | Demand proven (F-14) |
| Full PWA/offline app | Overkill for a content site; manifest+meta only (D-019) | Repeated mobile usage evidence |
| CMS (Sanity etc.) | Local MDX is simpler, faster, no cost (D-005) | Non-technical co-authors appear (F-16) |
| Video hosting, podcasts, paid content | Heavy media pipeline; not core to v1 job | Content strategy adds media pillar |
| Social feed embeds | Third-party JS, tracking, visual noise — violates D-018 | Need proof, not gut feeling |
| Legal pages (privacy/impressum) | Only needed if jurisdiction/regions demand; analytics is cookie-less | Domain + jurisdiction confirmed (A-003) |

## 3. Boundary rules for agents

1. If a request would add a page, feature, dependency, or tracking surface not listed here → write it to `09-decisions/notes-and-assumptions.md` as a `suggestion`, and surface it to the owner. Do **not** build it in the same change.
2. "Easy to add later" is the default posture: prefer architecture that *leaves room* (config-driven site data, content collections, token-based design) over architecture that *pre-builds* unrequested features.
3. Truncating scope is allowed and encouraged when quality-gated (e.g., 2 case studies instead of 4) — record the truncation in the task breakdown with status `deferred-by-owner` or `deferred-quality-gate`.
4. The 404 page is in scope and must be designed — dead ends are a brand moment, not an afterthought.

## 4. Future roadmap preview (approved directions only)

See `08-operations/future-expansion.md` for architecture-prepared expansion: newsletter (F-12), booking (F-13), i18n (F-14), CMS migration (F-16), search (F-15), shop (F-17), now/uses pages (F-18), PWA-lite (F-19).

The architecture must *accommodate* these without building them (config-driven site data, MDX collections, token theming, no lock-in to Vercel-only APIs — D-016).
