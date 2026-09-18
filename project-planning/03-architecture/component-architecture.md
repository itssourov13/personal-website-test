# Component Architecture

> ✅ Approved baseline (D-024). Companion to `folder-structure.md`. Governs how components are organized, where interactivity lives, and how UI stays consistent.

## 1. Layered model

```txt
tokens (CSS vars) ──► primitives (ui/) ──► composites (layout/ + sections/) ──► page templates (app/)
        ▲                    ▲                       ▲                              ▲
        └── design-guidelines.md  ── component contracts ── route specs ── routing-and-pages.md
```

**Rules:** primitives never import composites; composites compose primitives; pages compose composites. One direction only — no circular/upward imports.

## 2. Primitives (`src/components/ui/`)

Pure presentational, server-renderable by default, fully token-styled, no data fetching.

| Component                      | API sketch                                        | Notes                                                                                                                  |
| ------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Button`                       | `variant: primary                                 | secondary                                                                                                              | ghost    | link`, `size: sm                  | md  | lg`, `asChild?` (slot) | Primary = accent bg (AA-checked), pill radius; supports `loading` state (spinner + disabled) |
| `Link`                         | wraps next/link + `external?`                     | Inline links get copper underline slide animation (motion-safe only); external gets icon + `rel="noopener noreferrer"` |
| `Badge` / `Pill`               | `tone: neutral                                    | accent                                                                                                                 | success` | Chips for stack/tags/availability |
| `Card`                         | `as` polymorphic, optional `hover`                | 1 px border + `--shadow-sm`; hover: lift 2 px + `--shadow-md` + copper hairline                                        |
| `Section`                      | `id?`, `eyebrow?`, `title?`, `intro?`, `padding?` | Encodes section rhythm tokens; optional `maxWidth: prose                                                               | content  | full`                             |
| `Prose`                        | wraps typography plugin                           | Brand-styled MDX body (headings, lists, blockquote, code, tables)                                                      |
| `Input` / `Textarea` / `Field` | label, error, hint, `aria-describedby` wiring     | All form primitives; 44 px+ targets; error states with `role="alert"` text                                             |
| `Spinner` / `Skeleton`         | size, tone                                        | Respect reduced-motion (static/ pulse-off)                                                                             |
| `Markdown`                     | renders MDX/markdown remotely or from local       | Server-side render; disallow raw HTML by default (security)                                                            |

## 3. Layout composites (`src/components/layout/`)

| Component        | Client?                                                  | Behavior                                                                                                                                                               |
| ---------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Header`         | server shell + client `MobileNav`/`ThemeToggle` children | Sticky; transparent → surface+hairline on scroll (tiny client hook `useScrolled`, or CSS `scroll-driven` progressive enhancement); availability pill from `siteConfig` |
| `Footer`         | server                                                   | 4 zones per ui-ux-ideas §3; year auto; colophon line                                                                                                                   |
| `MobileNav`      | **client**                                               | Overlay menu, focus trap, Escape handling, `aria-expanded`, staggered entrance; disabled JS → links still present (static fallback list)                               |
| `SkipLink`       | server                                                   | "Skip to content" — first focusable on every page                                                                                                                      |
| `ThemeToggle`    | **client**                                               | next-themes; `aria-label` announces action; crossfade 250 ms                                                                                                           |
| `ScrollProgress` | **client**                                               | Notes only; thin copper bar; `aria-hidden`, reduced-motion: none                                                                                                       |

## 4. Section composites (`src/components/sections/`)

All server by default; each maps to a Home/page section:
`Hero` (includes `AvailabilityPill`), `ProofBand` (marquee client only if animated), `SelectedWork` (hover media swap → `SelectedWorkCard` client), `Capabilities`, `Testimonials`, `WritingPreview`, `FinalCTA`, `PageHeader` (title + intro + breadcrumbs), `MetricBand` (uses `MetricCounter` client), `RelatedWork`, `FAQ` (`Accordion` client).

## 5. Motion components (`src/components/motion/`)

| Component        | Purpose                                                                   | Reduced-motion                             |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| `Reveal`         | Fade+rise 16–24 px on viewport enter (once)                               | Renders statically (visible, no transform) |
| `StaggerGroup`   | Orchestrates children offsets (40–80 ms)                                  | Same                                       |
| `PageTransition` | Route change fade+8 px rise (View Transitions API first, Motion fallback) | Instant swap                               |
| `MetricCounter`  | Count-up on reveal (desktop + intersection)                               | Show final value immediately               |
| `Marquee`        | Client wordmarks; slow, edge-fade, pause on hover                         | Static wrap or single row                  |
| `MagneticButton` | Subtle cursor magnetism (pointing devices only, ≤ 4 px)                   | Disabled                                   |
| `CursorGlow`     | Optional copper glow (desktop only)                                       | Disabled                                   |

Implementation rule: every motion component reads reduced motion via `useReducedMotion`/media query; SSR output must be identical to reduced-motion output (no layout jump).

## 6. Client/server boundary contract

- **Default server.** Only components listed "client" above use `"use client"` — plus nothing else in v1 (exceptions require review).
- Data access (Velite collections, site config) happens **only in server components / lib**, never in client islands. Client islands receive props ("islands receive, server renders").
- Forms: `ContactForm` is client (state) but calls the server route; validation schemas shared via `lib/schema.ts` (zod) — same rules both sides.

## 7. Component API conventions (see coding-guidelines for detail)

- `type Props` exported with each component; strict types; no implicit any.
- Default export the component; `displayName` set for devtools.
- All interactive elements get `aria-label` when icon-only, `:focus-visible` ring from tokens.
- No inline `style=` except dynamic motion values; everything else tokens/utilities.
- Component tests for stateful logic (filters, form, accordion/FAQ) with RTL; visual QA via Playwright screenshots per page.

## 8. Composition examples (atomic recipes)

```tsx
// Header composition
<Header>
  <Wordmark />            // server
  <DesktopNav />          // server (map siteConfig.nav)
  <AvailabilityPill />    // server (config-driven)
  <ThemeToggle />         // client
  <MobileNav />           // client (contains its own trigger)
</Header>

// Case study layout
<PageHeader eyebrow="Case study" title={…} breadcrumbs />
<MetricBand metrics={…} />            // contains MetricCounter (client)
<Prose>{mdx}</Prose>
<TestimonialCard … />                // optional, data-driven
<RelatedWork … />
<FinalCTA />
```

## 9. Design-token enforcement

- Primitives consume tokens via Tailwind utilities mapped in `globals.css` (`@theme`). No raw values.
- New component visual needs → first a token (design-guidelines.md), then code. Violations are review-blockers.
- Storybook: not required in v1 (time); Playwright screenshots serve as visual regression baseline. Add Storybook only if component count > 40 (future decision).
