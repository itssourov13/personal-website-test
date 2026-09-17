# Goals & Target Audience

> ✅ Approved baseline. Persona details are assumptions (A-001, A-002) — replace with owner's real details per the customization checklist in `09-decisions/handoff-documentation.md`.

## 1. Business / project goals (SMART-ish, measurable after launch)

| ID | Goal | How we measure it | Target (post-launch, 3 months) |
|----|------|-------------------|--------------------------------|
| G-1 | Establish a premium professional presence | Bounce rate on home; time on case studies | Bounce < 40%; avg. case-study view > 90 s |
| G-2 | Generate consulting conversations | Contact form submits + direct email replies | ≥ 3 qualified conversations / month |
| G-3 | Grow an owned audience | RSS/email subscribers; shares of notes | 25% MoM note reads after first 3 notes |
| G-4 | Become findable for the right queries | Organic impressions for target keywords | Rank in top 10 for 3 target NLP/keyword clusters (see `04-strategy/seo-strategy.md`) |
| G-5 | Demonstrate engineering craft | Core Web Vitals pass rate; Lighthouse | CWV ≥ 99% healthy sessions; LH ≥ 95 perf |
| G-6 | Look current in 5 years | Design-system debt metrics (drift from tokens) | 0 drift: all UI uses tokens (D-017) |
| G-7 | Zero avoidable maintenance burden | Time spent on maintenance | < 2 h/month routine upkeep |

## 2. Target audience — primary

**The primary reader is a decision-maker who can hire, fund, or refer the owner.**

| Persona | Who they are | What they need | What would convert them |
|---|---|---|---|
| **Product leads / founders** (startups → scale-ups, teams 5–200) | Hiring a senior design+engineering hand for a product push; evaluating consultants | Proof of shipped, measurable work; clear engagement model; signal of taste | 2–3 relevant case studies + crisp "how we work" + fast contact path |
| **Design & engineering leaders** (VPs, staff+ ICs) | Looking for contributors, collaborators, or referrals | Depth of thinking; quality of writing; judgment | Case studies + notes; well-crafted detail pages; shareable insights |

## 3. Target audience — secondary

- **Designers / engineers / students** in the craft — they follow the writing, share it, and keep the site in circulation.
- **Recruiters** — quick credibility check; resume link, clear role narrative.
- **Media / podcast hosts / conference organizers** — a "press kit" surface: about page, selected work, contact path.

## 4. Audience jobs-to-be-done (JTBD)

1. **"I need to quickly judge whether this person is excellent."** → 10-second home scan, then case-study depth.
2. **"I need to see work that looks like my problem."** → filtered work index, story-structured case studies with process + outcomes.
3. **"I want to learn something from them."** → notes with substance, RSS, readable on mobile.
4. **"I want to hire/discuss something now."** → contact form with 24–48 h response promise; no friction, no account.
5. **"I want to check legitimacy / who they've worked with."** → about page, testimonials, recognitions, links to verifiable profiles.

**Friction to eliminate:** vague positioning ("creative technologist"?), buried contact, slow pages, broken mobile experience, no social proof.

## 5. Reading journeys (the three paths through the site)

1. **Hire path (primary):** Home → Work (filtered) → Case study → Services (engagement model) → Contact.
2. **Trust path:** Home → Notes → 2–3 articles → About → Contact.
3. **Referral path (short):** shared case-study link → Work; shared note link → Notes (+ newsletter nudge in site config).

Every page must link onward along at least one path (internal-linking rules: `04-strategy/seo-strategy.md`).

## 6. What success feels like for the visitor

- < 10 s to know exactly who the owner is and whether they're relevant.
- Every page answers *"what am I looking at, why does it matter, what do I do next?"*
- Nothing is broken, slow, or awkward — on a phone, a laptop, or with a screen reader, with or without motion and JS.
- Leaving is pleasant too: 404 is designed, dead ends don't exist.

## 7. Metrics we intentionally do NOT chase

Vanity dashboards, daily active users, follower counts, "viral" design. The site is a lead-generation and trust asset, not a media property (G-2, G-4 govern).

## 8. Owner's personal goals (assumptions to confirm)

- Present as an **independent expert**, not an agency and not a job-seeker.
- **Own the platform**: content is first-party, exportable, version-controlled.
- **Low maintenance**: static-first architecture, minimal moving parts (D-016).
