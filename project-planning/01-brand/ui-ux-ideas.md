# UI/UX Ideas & Interaction Architecture

> ✅ Approved baseline. Complements `design-concept.md`; component-level specs live in `03-architecture/component-architecture.md`; motion specs in `04-strategy/animation-plan.md`.

## 1. UX foundations (applied everywhere)

| Rule                 | Spec                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Primary CTA per page | Exactly one visually dominant action; everything else = secondary links                                  |
| Dead ends            | None: every page ends with a next step (related work / CTA / nav)                                        |
| State design         | Every interactive element has: default, hover, active, focus-visible, disabled, loading (where relevant) |
| Feedback             | Every user action gives feedback ≤ 200 ms (visual) — no silent buttons                                   |
| Error handling       | Human copy + concrete next step; never raw error codes/IDs                                               |
| Empty states         | Content missing → encouraging designed state ("Notes are coming — subscribe to RSS"), never blank        |
| Back behavior        | Browser back works with transitions; scroll position restored naturally                                  |
| Reduced motion       | All motion off-per-principle when `prefers-reduced-motion: reduce` (D-015)                               |

## 2. Primary flows (walkthroughs)

### Flow A — Hire path (most valuable)

**Home** → hero statement + availability pill + primary CTA "See the work" → scroll: selected work (3–4 items w/ hover preview) → Services snapshot (3 cards) → social proof (2–3 testimonials) → CTA "Start a conversation".
**Work** → filter chips (discipline × industry) → item cards (title, client, outcome metric, cover) → **Case study** → evidence story: hero (context + metric band) → problem → approach (process artifacts) → outcome (metrics before/after) → more like this → CTA.
**Services** → engagement model cards (Design Sprint / Product Partner / Advisory) → typical engagement timeline → FAQ (detail) → CTA "Book a 30-min intro call".
**Contact** → form (name/email/company-ish/project summary/budget range optional) → success state with response promise → confirmation email via Resend.

Acceptance: ≤ 3 clicks from any page to contact. Every case study and every service card leads to contact.

### Flow B — Trust path

**Home/Work** → **Writing** → note list (title, reading time, excerpt) → note (progress bar, related notes, share) → About (humanize) → Contact.

### Flow C — Referral path

Shared link lands on a case study or note → full experience without a landing-page redirect; every shared URL is canonical (SEO rule).

## 3. Navigation architecture

| Element     | Spec                                                                                                                                                                                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header      | Sticky, transparent over hero → gains surface + hairline border after 8 px scroll; wordmark left; nav (Work, Services, About, Writing) center/right; availability pill + theme toggle far right; mobile: hamburger → bottom-sheet or full-height overlay (choose in P1, both acceptable; overlay preferred for premium feel) |
| Footer      | 4 zones: identity (wordmark + one-liner), nav dupe, socials (GitHub, LinkedIn, X, Dribbble, RSS), legal-line (© year, colophon "Built with Next.js", no cookie banner needed — D-018)                                                                                                                                        |
| Breadcrumbs | Case studies & notes only (Work → Project title)                                                                                                                                                                                                                                                                             |
| Pagination  | Simple prev/next in lists when > 10 items; no infinite scroll in v1 (SEO + control)                                                                                                                                                                                                                                          |
| Mobile nav  | Full-screen overlay, staggered link entrance (250 ms), focus trap, Escape closes, `aria-expanded` correct                                                                                                                                                                                                                    |
| Search      | None in v1 (F-15); Writing index provides sort + tags                                                                                                                                                                                                                                                                        |

## 4. Home page section stack (v1)

1. **Hero:** wordmark intro (small), one-sentence capability statement (display type), sub-line (what I do / for whom), dual CTA (primary "See the work" / secondary "Start a conversation"), availability pill; background: subtle paper grain or copper dot motif (≈ 8 KB, no hero image needed in v1 — speed first).
2. **Proof band:** 3 headline metrics or client wordmarks (marquee, edge-faded).
3. **Selected work:** 3–4 spotlight cards, hover media swap; links to work index.
4. **Capabilities:** 3 cards (Design / Engineering / Product partnering) each linking to Services.
5. **Social proof:** testimonial tickets (2–3) + recognitions row.
6. **Writing preview:** 3 latest notes.
7. **Final CTA:** "Let's make something exceptional." + availability + button → /contact.
8. **Footer** as in §3.

## 5. Contact form UX spec (critical conversion surface)

- Fields: Name*, Email*, Message* (project type/budget = optional selects to save both sides' time)
- Validation: inline, on-blur + on-submit; zod schema; error copy human ("That email doesn't look right — mind checking?")
- Submit: optimistic → "Sending…" (≤ 1 s) → success card: "Got it. I reply within 24–48 h — usually faster." + mailto fallback note + résumé link
- Failure: "Something hiccuped. Email me directly at hello@…"
- Trust line under form: "No newsletters, no spam — just a reply." (privacy promise)
- Honeypot field (hidden) + time-trap; rate limit via Upstash Redis (or Vercel KV) — `04-strategy/security-considerations.md`

## 6. Microcopy inventory (write once, reuse everywhere)

- Availability: "Booking Q4 2026" / "Booking for Q1 2027 — 2 slots left"
- 404: "This page is missing. It happens to the best of us." + "See the work" + search-less alternative
- Theme toggle label: "Switch to dark mode / light mode" (full words for SR, icon visual)
- Form placeholders: "How can I help?" not "Enter message…"
- Footer colophon: "Designed & built by Sourov Mondol. No trackers, no cookies."
- Loading: "Preparing…" never spinners-only; skeleton or transitions preferred

## 7. Detail-page UX (case study & note template anatomy)

**Case study:** cover/hero (figma-frame screenshot) → context strip (client, role, timeline, stack chips) → metric band (2–4 numbers) → The problem (2–3 short paras) → The approach (structured, with artifacts: flows, wireframes, before/after images) → The outcome (metrics + quote) → Learnings (1 short para, honest) → related work → CTA.
**Note:** title (display) → meta row (date, reading time, tags) → prose (typography plugin) → progress bar → tags/related → CTA "See the work" → footer nav.

## 8. State & edge-case checklist for every page

- [ ] 320 px width, 200% zoom, 4K desktop
- [ ] Light + dark theme
- [ ] Reduced motion ON/OFF
- [ ] JS disabled (core info readable, form shows mailto fallback)
- [ ] Keyboard-only navigation, visible focus
- [ ] Screen reader pass (VoiceOver/NVDA spot-check)
- [ ] Slow network (LCP audit), offline (styled error, no blank page)
- [ ] Loading/error/empty states when data-driven sections exist
