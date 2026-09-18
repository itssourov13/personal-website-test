# SEO Strategy

> ✅ Approved baseline (D-011, D-026). Target: G-4 — rank top-10 for 3 keyword clusters; zero technical-SEO debt.

## 1. Principles

1. **Technical SEO is a build-time property**, not an afterthought (metadata API, semantic HTML, sitemap/robots/RSS, canonical, structured data, performance).
2. **Content is the growth engine** (notes) — target real search intent, not vanity volume.
3. **No dark patterns**: no keyword stuffing, no cloaking, no doorway pages, no AI-generated filler content (E-E-A-T carries weight for a personal brand).
4. **Owned surfaces only**: Google Search Console + Plausible goals; no SEO tooling bloat.

## 2. Keyword strategy (v1 targets — refine with GSC data post-launch)

| Cluster                                                                                                                   | Intent     | Target pages         | Realistic horizon         |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- | ------------------------- |
| `[discipline] portfolio/case study` (e.g., "product design case study", "design engineer portfolio")                      | Evaluation | Work + case studies  | 3–6 months                |
| Person-based ("Sourov Mondol designer")                                                                                   | Brand      | Home/About           | 1–3 months                |
| Long-tail expertise notes ("design tokens governance", "accessibility in design systems", "frontend performance budgets") | Learning   | Writing              | 6–12 months (compounding) |
| Question clusters for services ("how much does a design sprint cost", "fractional product designer")                      | Pre-sales  | Services FAQ + notes | 6–12 months               |

**Method:** 1 focus query per page/note → title template `[Focus] — Sourov Mondol` (≤ 60 chars); meta description 140–155 chars with value prop; keyword appears in h1, first 100 words, one `<h2>`, image alts (naturally).

## 3. Technical SEO implementation checklist (build-time)

- [ ] Metadata API: `title.template`, unique `description`, `alternates.canonical`, `openGraph` (type, locale, url, images), `twitter` card, `robots` sensible
- [ ] JSON-LD: sitewide `Person` (layout) + per-page `WebSite`, `Article`/`BlogPosting` (notes), `CreativeWork` (case studies), `FAQPage` (services, 5–8 Q&A), `BreadcrumbList` (detail pages)
- [ ] `sitemap.ts`: all public routes + lastModified; excludes draft/api/404
- [ ] `robots.ts`: allow all public; explicit `Disallow: /api`; sitemap URL
- [ ] `rss.xml`: full-content feed (marketing + SEO, `application/rss+xml` autodiscovery link in `<head>`)
- [ ] OG images: edge-generated per page (`/og/[...slug]`) — 1200×630, wordmark + title + copper accent, consistent template
- [ ] Semantic HTML: one `h1`, ordered headings, `article`/`section`/`nav`/`footer` landmarks, descriptive link text
- [ ] Performance is SEO: Core Web Vitals budgets (D-014) — verified in CI, monitored in GSC
- [ ] Mobile-first rendering: fully responsive (responsive-strategy.md); no interstitials
- [ ] Accessibility is SEO: WCAG 2.2 AA baseline (heading semantics, alt text, contrast)
- [ ] HTTPS + HSTS + 301 redirects for `www` → apex (deployment plan)

## 4. Content/on-page rules

- Unique title + description per URL (CI test enforces: no duplicates, no missing).
- Case study title pattern: `[Client or product] case study: [outcome]`; note pattern: `[Benefit-led topic]`.
- Internal linking (routing-and-pages §4): each content page ≥ 1 related internal link; link text descriptive.
- Images: descriptive `alt` (content-bearing) or `alt=""` (decorative); filenames descriptive; `next/image` sizes correct.
- Dates: `published` + `updated` visible on notes (schema too) — freshness signal.
- No thin pages: every index page + page copy passes the quality bar (content-strategy §3); no pagination-only filler.

## 5. Performance as SEO

Core Web Vitals feed rankings: budgets and monitoring in `04-strategy/performance-plan.md`; GSC reports wired to maintenance checklist (08-operations).

## 6. Post-launch SEO program (maintenance plan parallel)

| Cadence         | Action                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| Monthly         | GSC: queries→ CTR/impressions; adjust titles/descriptions; fix coverage warnings; check Core Web Vitals report |
| Monthly         | 1 quality note published (content calendar)                                                                    |
| Quarterly       | Refresh outdated notes (add `updated`, improve, re-link); prune dead links; review sitemap                     |
| Quarterly       | Backlinks: respond to genuine mentions; no link buying; list in `notes-and-assumptions` §External              |
| On content edit | Run redirect check (`next.config` 301 map for old slugs); grep internal links                                  |
| Continuous      | Plausible goals: case-study views, contact CTA clicks, note reads — feed G-2/G-4                               |

## 7. Anti-patterns (never)

Buying links · link farms · keyword-stuffed pages · duplicate content (canonical enforced) · dynamic rendering hacks · shadow pages · AI-generated volume content · hiding text · infinite scroll without pagination fallback.

## 8. Tools & accounts (setup in P5)

- Google Search Console (domain property) + Bing Webmaster (redirects to GSC)
- Plausible dashboard + goal events
- Lighthouse CI budgets in GitHub Actions
- `robots.txt` + sitemap validated in CI (`scripts/check-content.mjs` extended) and manually at launch
