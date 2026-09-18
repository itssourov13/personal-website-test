# Folder & File Structure Proposal

> ✅ Approved baseline (D-024). The website code lives at the repository root (workspace root `/home/kali/personal-website/`), alongside this `project-planning/` package. Layout below is the target; agents build exactly this.

## 1. Repository layout (full tree)

```txt
personal-website/                      ← repository root (this workspace)
├── AGENTS.md                          ← global agent entry point (pointer + constraints)
├── README.md                          ← human-facing quick start (links into project-planning)
├── package.json                       ← pnpm · scripts · engines (node >=20)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                ← (only if workspace needed — v1: skip)
├── next.config.ts                     ← images, headers (CSP etc.), redirects, webpack-none
├── tsconfig.json                      ← strict: true, noUncheckedIndexedAccess, verbatimModuleSyntax
├── eslint.config.mjs                  ← flat config: next/core-web-vitals + typescript-eslint + import order
├── .prettierrc / .prettierignore
├── .stylelintrc.json                  ← optional; tailwind css linting (may drop if noisy)
├── .gitignore / .npmrc               ← .npmrc: shamefully-hoist=false, engine-strict=true
├── .env.example                       ← documented env vars (tech-stack.md §5)
├── .husky/pre-commit                  ← lint-staged
├── .github/
│   ├── workflows/ci.yml               ← lint · typecheck · test · build · lighthouse-ci budget
│   └── dependabot.yml                 ← weekly, grouped, security auto-merge w/ green CI
├── public/
│   ├── favicon.ico / icon.svg / apple-touch-icon.png
│   ├── og/ (generated at runtime — none committed except templates)
│   ├── images/                        ← static asset library (per-collection folders)
│   └── resume/ (if owner adds PDF later)
├── content/
│   ├── work/
│   │   ├── _template.md               ← case-study frontmatter template with field docs
│   │   └── <slug>.mdx                 ← one file per project
│   └── writing/
│       ├── _template.md
│       └── <slug>.mdx
├── data/                              ← small structured fixtures (testimonials, clients, FAQs)
│   └── testimonials.ts
├── src/
│   ├── app/                           ← App Router (route groups per page)
│   │   ├── layout.tsx                 ← root: fonts, metadata template, LenisProvider, Header/Footer, skip link
│   │   ├── globals.css                ← tokens + Tailwind v4 @theme + base styles
│   │   ├── page.tsx                   ← Home
│   │   ├── not-found.tsx              ← custom 404
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── rss/route.ts
│   │   ├── manifest.ts
│   │   ├── og/[...slug]/route.tsx     ← dynamic OG images (edge)
│   │   ├── (marketing)/
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── work/
│   │   │   ├── page.tsx               ← index + filter (server-rendered list, client filter bar)
│   │   │   └── [slug]/page.tsx        ← case study; generateStaticParams
│   │   ├── writing/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── api/contact/route.ts       ← the ONLY dynamic endpoint
│   ├── components/
│   │   ├── ui/                        ← primitives: Button, Link, Badge, Card, Section, Prose,
│   │   │                                Input, Textarea, Field(Error), Spinner, Skeleton, Markdown
│   │   ├── layout/                    ← Header, Footer, MobileNav, SkipLink, ThemeToggle, AvailabilityPill
│   │   ├── sections/                  ← Hero, ProofBand, SelectedWork, Capabilities, Testimonials,
│   │   │                                WritingPreview, FinalCTA, PageHeader, MetricBand, RelatedWork
│   │   ├── motion/                    ← Reveal, StaggerGroup, PageTransition, MetricCounter, Marquee,
│   │   │                                ScrollProgress, MagneticButton
│   │   └── icons/                     ← hand-rolled 20px stroke icon components + social icons
│   ├── lib/
│   │   ├── site.config.ts             ← ★ single source of truth for site-level facts
│   │   ├── content.ts                 ← typed access to .velite collections (queries, helpers)
│   │   ├── schema.ts                  ← zod schemas (shared client/server): contact, frontmatter mirrors
│   │   ├── contact.ts                 ← server-only: validation, honeypot, rate-limit, Resend send
│   │   ├── seo.ts                     ← metadata + JSON-LD builders
│   │   ├── rss.ts                     ← feed generator (from collections)
│   │   ├── utils.ts                   ← cn(), formatters (date, reading time), constants
│   │   └── hooks/                     ← useHasMounted, useMedia (reduced-motion), useInView
│   ├── styles/                        ← (thin; globals.css may cover) theme tokens partials
│   └── middleware.ts                  ← (only if header/geo logic needed — v1 likely none)
├── tests/
│   ├── unit/                          ← vitest: schema, filters, formatters, content queries
│   ├── e2e/                           ← playwright: hire path, form, theme, filters, reduced-motion, 404
│   └── fixtures/                      ← sample projects/notes (deterministic)
├── scripts/
│   ├── new-post.mjs                   ← scaffolds a note/case-study .mdx from _template
│   ├── check-content.mjs              ← frontmatter completeness report (usable in CI)
│   └── lighthouse-ci-setup.mjs        ← (or rely on GH Action)
└── project-planning/                  ← THIS package (all documentation)
```

## 2. Naming & colocation rules

| Concern                | Rule                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Files                  | `kebab-case` everywhere; components PascalCase only for component files (`Hero.tsx`, `metric-band.tsx` is wrong)                                                                 |
| One component per file | Yes; default-export the component, named-export `type Props`                                                                                                                     |
| Colocation             | Components in `components/{layer}/`; page-only logic inside `app/**/_components/` if page-private                                                                                |
| Styles                 | In `globals.css` + token layer; one-off component styles via Tailwind utilities in JSX (no CSS modules unless unavoidable)                                                       |
| Data                   | Content in `content/`, fixtures in `data/`, config in `lib/site.config.ts` — never mixed                                                                                         |
| Tests                  | Colocate-only when trivial (`Button.test.tsx` next to file) OR under `tests/` — pick colocation for unit, `tests/e2e` for flows (library config documented in coding-guidelines) |

## 3. The single source of truth — `site.config.ts` (shape sketch)

```ts
export const siteConfig = {
  name: "Sourov Mondol", // A-001 replacement
  domain: "sourovmondol.studio", // A-002 replacement
  tagline: "Independent product designer & engineer.",
  description: "…", // feeds metadata + JSON-LD
  email: "hello@sourovmondol.studio",
  availability: {
    status: "booking",
    label: "Booking Q4 2026",
    href: "/contact",
  },
  nav: [{ label: "Work", href: "/work" } /* … */],
  socials: {
    github: "…",
    linkedin: "…",
    x: "…",
    dribbble: "…",
    rss: "/rss.xml",
  },
  metrics: [{ value: 12, suffix: "", label: "years shipping products" }],
  excludes: ["resume.pdf"], // robots/ crawl exclusions
} as const satisfies SiteConfig;
```

All nav, meta, JSON-LD, sitemap, RSS, footer consume this object. See `prompts/02-…` for the full type contract.

## 4. Content file contract (frontmatter)

**Work (`content/work/<slug>.mdx`) — zod `WorkSchema`:** `title`, `client` (optional, supports anonymized "Finta (name changed)"), `year`, `role`, `timeline`, `stack[]`, `discipline[]`, `industry[]`, `summary` (≤ 160 chars), `outcomes[]` (metric objects: label/value/suffix/delta), `cover` (path or null), `featured` (bool), `published` (date), `draft` (bool), `testimonial?`, `gallery[]`. Body = markdown story (problem/approach/outcome/learnings blocks as headings).

**Writing (`content/writing/<slug>.mdx`) — zod `NoteSchema`:** `title`, `published`, `updated?`, `tags[]`, `summary` (≤ 160), `readingTime` (computed at build, not hand-written), `draft`, `series?`.

**Ideas (`content/ideas/<slug>.mdx`) — zod `ideaFrontmatterSchema`, added D-038:** `title`, `published`, `updated?`, `tags[]`, `summary` (≤ 160), `cover` (path or null, optional — Notes doesn't have this field), `draft`. Same shape as Notes otherwise; kept as a separate collection/schema rather than reusing Notes because it's owner-distinguished content (non-client/non-project thinking vs. Writing's technical notes), not just a tag.

**Life (`content/life/<slug>.mdx`) — zod `lifeFrontmatterSchema`, added D-038:** `title?` (optional — short entries don't need a headline), `published`, `kind` (`note | moment | place | observation`, default `note`), `location?`, `tags[]`, `draft`. No `summary`/`readingTime` — entries render in full, inline, on a single `/life` timeline rather than getting individual pages.

**Validation:** Velite runs both schemas at build; CI runs `scripts/check-content.mjs` for completeness (missing summary/cover on featured items → warning or fail per phase).

## 5. What to create first (bootstrap order)

1. `package.json`, `tsconfig`, `eslint`, `prettier`, `.env.example`, `.gitignore`, `.npmrc`
2. `next.config.ts` + `globals.css` tokens (light+dark) + fonts
3. `src/lib/site.config.ts` + type
4. `content/work/_template.md` + `content/writing/_template.md`
5. First real content (A-004/A-005 samples) + Velite wiring + `lib/content.ts`

Full step order: `05-roadmap/task-breakdown.md`.

## 6. Post-baseline reality (not reflected in the §1 tree)

The §1 tree is the frozen D-024 baseline and, like `routing-and-pages.md` §1, was never redrawn as later phases shipped — decision-log.md is the living record. As of D-038 the repo additionally has:

- **Content collections** beyond `work`/`writing`: `content/lab/`, `content/ideas/`, `content/life/` (each with its own `_template.md`) — `lab` from D-036, `ideas`/`life` from D-038.
- **Data fixtures** beyond `data/testimonials.ts`: `data/talks.ts`, `data/bookmarks.ts`, `data/photos.ts` — all three ship empty/near-empty by design (D-036/D-037/D-038).
- **Routes** beyond Home/Work/Writing/About/Services/Contact: see `routing-and-pages.md` §5 for the full list and which decision introduced each.
- **`lib/content.ts` is a hand-rolled frontmatter loader (gray-matter + fs), not Velite** — D-030 deviation, still in effect. References to "Velite" above (§4) describe the originally-planned mechanism; the zod schemas and content contract they validate are unchanged.
- **`components/command/`** (CommandPalette, ⌘K) and a `ChevronDownIcon` in `components/icons/` and a `MoreMenu` in `components/layout/` aren't in the §1 sketch either — the icon/component folders are correctly described at the _layer_ level (`ui/`, `layout/`, `icons/`, etc.), just not exhaustively enumerated.
