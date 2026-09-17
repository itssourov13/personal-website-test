# Feature List — Core (v1) & Future

> ✅ Approved baseline. Feature IDs (F-*) are referenced from the task breakdown (`05-roadmap/task-breakdown.md`) and roadmap. Core features have acceptance criteria; satisfying them is how "done" is proven.

## Legend
**P0/P1/P2/P3/P4** = roadmap phase gate (see `05-roadmap/development-roadmap.md`) · **Core** = must ship v1 · **Future** = approved direction, do not build in v1 · owning tests where listed must pass before the feature is considered done.

---

## A. Core features (v1)

### F-1 · Design system & theming (P1) — ✅ core
Design tokens → CSS variables + Tailwind mapping; light/dark themes via `next-themes` with no-flash inline script; typography system (Fraunces + Inter) via `next/font`.
**AC:** tokens-only UI (`grep` for raw hex fails); theme toggle crossfades 250 ms; `prefers-color-scheme` respected on first visit; no theme flash on reload; all primitives consume tokens.

### F-2 · Global layout & navigation (P1) — ✅ core
Sticky header (transparent → surface + hairline on scroll), wordmark, nav (Work, Services, About, Writing), availability pill, theme toggle; mobile overlay menu with focus trap; footer (identity, nav, socials, legal line, colophon); custom 404; skip-to-content link.
**AC:** keyboard-complete (tab order, Escape closes menu, focus returns); 44 px targets; correct `aria-expanded`/`aria-label`s; works with JS off (static links); 404 includes one recovery action.

### F-3 · Home page (P2) — ✅ core
Sections per `01-brand/ui-ux-ideas.md` §4: hero (statement + CTAs + availability), proof band, selected work spotlight, capabilities, testimonials, writing preview, final CTA.
**AC:** 10-second clarity test passes; single primary CTA; hero < 100 KB assets; LCP budget met; all sections have working internal links; reduced-motion variant verified.

### F-4 · Work index + filters (P2/P3) — ✅ core
Grid of project cards (cover, client, discipline/industry tags, outcome metric); filter chips with animated re-layout; ordering: featured first, newest first.
**AC:** filter combos return correct subsets (unit-tested against fixture data); keyboard-operable chips; results count announced to screen readers; URL filter state shallow (shareable? — no: keep local state, document why in decision log if changed).

### F-5 · Case study pages (P3) — ✅ core
Dynamic route `/work/[slug]` from MDX collection; anatomy per ui-ux-ideas §7; metric band; related work; breadcrumbs; JSON-LD `CreativeWork`/`Article`.
**AC:** every published case study renders with all anatomy blocks; missing metric → component hides gracefully (not required field); prose styles via typography plugin consistent with brand.

### F-6 · Contact form & delivery (P4) — ✅ core
RHF + zod validated form (name, email, message, optional project type/budget); honeypot + time-trap; rate limit (Upstash/Vercel KV); server route → Resend email to owner; success/failure/loading states per ui-ux-ideas §5; confirmation copy with response promise.
**AC:** unit tests for validation edge cases; rate-limit test (5 requests/10 s → blocked); e2e happy path + honeypot-filled path; email arrives with correct format; keys are server-only.

### F-7 · Writing / notes system (P3) — ✅ core
MDX collection (`content/writing`), index route `/writing` + detail `/writing/[slug]`; reading time; tags; related notes; progress bar; JSON-LD `BlogPosting`; RSS feed at `/rss.xml`.
**AC:** 3 sample notes (may be marked draft) build and render; reading time correct to ±10%; RSS validates; slug from filename; draft notes excluded from index, sitemap, RSS.

### F-8 · SEO foundation (P4) — ✅ core
Metadata API on all routes; OpenGraph/Twitter cards; generated OG images (edge, `@vercel/og`); `sitemap.xml`; `robots.txt`; canonical URLs; JSON-LD structured data (Person site-wide, Article/CreativeWork per page); semantic heading hierarchy enforced by component lint.
**AC:** every public page has unique title/description/OG; sitemap matches `robots.txt`; Lighthouse SEO ≥ 98; heading order validated by test on fixture pages.

### F-9 · Performance pipeline (P1..P4) — ✅ core
Image component (sizes, AVIF/WebP, priority per hero), font optimization, streaming/Suspense where valuable, static generation by default, `next.config` hardening; Core Web Vitals budgets from D-014 verified in CI (Lighthouse CI).
**AC:** budgets in `04-strategy/performance-plan.md` all pass on CI for home + one case study + one note (mobile 4G simulated).

### F-10 · Accessibility baseline (P1..P4) — ✅ core
Skip link, landmarks, heading order, focus management, `aria` on nav/menu/dialog/toast, form errors, reduced-motion end-to-end, contrast compliance per design guidelines §8, 200% zoom pass, SR spot-checks.
**AC:** axe/Playwright a11y checks green for all pages; manual keyboard walkthrough for nav, menu, form, filters; reduced-motion audit: no motion when enabled.

### F-11 · Analytics (privacy-first) (P4) — ✅ core
Plausible single script (`data-domain=…`), events for outbound links + `#contact` CTA; no cookies; excluded from CSP issues via explicit directive.
**AC:** dashboard shows pageviews/UTM/goals; `<script>` passes CSP; dnt-style exclusion (attribute `data-excluded` respected).

### F-12 → moved: newsletter is Future.

---

## B. Future features (approved direction — architecture must leave room, DO NOT build in v1)

| ID | Feature | Why | Enabler in v1 | Trigger to build |
|----|---------|-----|---------------|------------------|
| F-20 | Newsletter (Buttondown/ Beehiiv embed or API) | Owned audience compounding | RSS-first; footer RSS link; `site.config` socials | ≥ 3 notes published |
| F-21 | Booking / availability (Cal.com embed or link) | Direct conversion from availability pill | Pill is a plain `<a>` link (config-driven URL) | ≥ 4 convos/mo |
| F-22 | Keyboard command palette (⌘K) | Power-user delight; content navigation | URL patterns stable | Post-launch polish |
| F-23 | CMS migration (Sanity) | Non-technical co-authors | Content is collections + zod-validated frontmatter; API surface if needed | Co-authors appear |
| F-24 | Client-side search (fuse/minisearch) | Growing archive | Clean metadata schemas | > 40 notes |
| F-25 | i18n (es/es-ES or per owner) | Reach | Routes centralized; copy in config where practical | Proven demand |
| F-26 | Shop / productized offers (Lemon Squeezy) | Revenue path | Contact form + services pages structure | Offer validated |
| F-27 | Now / Uses pages | Indie-web freshness, low effort | Static routes ready; site config refactor | Any time post-v1 |
| F-28 | Comments/guestbook (webmentions) | Community loop | RSS + structured content | Audience asks |
| F-29 | PWA-lite / offline shell | Mobile repeat visits | manifest + meta in v1 (D-019) | Usage evidence |
| F-30 | Video case studies / talks embed | Depth, trust | Case study schema extensible | Content exists |
| F-31 | Resume/linktree-style single page + JSON API | Sharing, ATS | — | Recruiter demand |
| F-32 | Reading stats / "now writing" indicator | Indie-web charm | — | Post-launch |
| F-33 | Webring / blogroll | Community, backlinks | — | Post-launch community |
| F-34 | Split-test home copy | Conversion optimization | Static pages make this trivial | Traffic > 1k/mo |

## C. Feature priority rules (deciding what ships)

1. Core list is the only v1 scope — additions go to Future + a Decision Log entry.
2. Future features build on v1 enablers; never introduce new architecture classes before their trigger.
3. Anything that would add third-party JS, cookies, or tracking → rejected unless Privacy Decision (D-018) is amended.
4. Any feature that can be a link (booking, newsletter) in v1 must be a link — no embeds (performance).

## D. Cross-cutting requirements (apply to ALL features)

- Accessibility WCAG 2.2 AA (D-015) · Performance budgets (D-014) · Token-only styling (D-017) · Reduced-motion support · Mobile-first responsive · Copy in brand voice · Test coverage: unit where logic, e2e for top flows (`05-roadmap/task-breakdown.md` test map).
