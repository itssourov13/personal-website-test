# Vision & Mission

> ✅ Approved baseline. This document is the decision filter: when in doubt, ask *"does this serve the vision?"*

## 1. Vision (where this project leads)

A personal website that feels like a conversation with a craftsman: calm, confident, and precise. Five years from now, this site should still look considered — because the design system, content, and code were built to age well rather than chase trends.

Concretely, the vision has three horizons:

| Horizon | Theme | What is true then |
|---|---|---|
| Now (v1) | **Show the craft** | A fast, beautiful home base that earns trust and starts conversations |
| +12 months | **Compounding content** | A growing library of case studies and notes that attracts visitors via search and shares; the site is a magnet, not just a business card |
| +3–5 years | **Own platform** | The site is the owner's primary professional asset — independent of social platforms — with optional newsletter, curated archive, and (possibly) products |

## 2. Mission (what the site must do every day)

> **Earn trust through demonstrated craft, and convert trust into professional conversations — with an experience so fast and polished that the medium itself is the message.**

## 3. Brand promise (the visitor's takeaway)

> *"This person doesn't just talk about quality — the site itself is the proof."*

Every element (typography, motion, case-study depth, page speed) is evidence supporting this promise. If an element doesn't support it, cut it.

## 4. Operating principles (how we make decisions)

1. **Craft over coverage** — do ten things excellently, not fifty things adequately.
2. **Content is the funnel** — the portfolio proves ability, the writing builds trust, both lead to contact.
3. **Performance is a feature** — speed is a visible sign of engineering care.
4. **Accessibility is craft** — a premium experience excludes nobody.
5. **Restraint is sophistication** — every animation, color, and word must earn its place.
6. **Owned > rented** — first-party content on our own domain beats followers on rented platforms.
7. **Simple by default, complex only when it pays** — prefer static, build-time, no-server solutions until a need is proven.
8. **The website is a product** — it gets a roadmap, a backlog, a changelog, and maintenance, like any product we'd deliver to a client.

## 5. Value test (use for every feature/design decision)

Before adding anything (feature, animation, copy block, dependency), score it:

- Does it support the brand promise (§3)?
- Does it serve the primary job (§6 of overview)?
- Can we do it excellently within the quality bar?
- Is the cost (load time, complexity, maintenance) justified?

**Two or more "no"s → it goes to the future list** (`02-features/feature-list.md`), not into v1.

## 6. What we will never do

- Ship a page that fails its performance or accessibility budget.
- Use dark patterns, fake urgency, or manipulative copy.
- Add trackers, cookies, or third-party scripts that leak visitor data (D-018).
- Let template aesthetics (generic gradients, stock hero banners, clip-art icons) represent the owner's work.
- Leave broken, half-finished, or placeholder UI in production silently.

## 7. North-star metric

> **Qualified conversation starts** (contact form submissions + direct email replies from the site) per month.

Supporting metrics: portfolio/contact page completion rate; shareable case-study views; organic search traffic to notes; LCP/pass rates on Core Web Vitals. (Measurement plan: `08-operations/maintenance-plan.md`.)
