# Animation & Interaction Plan

> ✅ Approved baseline (D-004). Concept "The Printed Studio" (01-brand/design-concept.md §5) requires motion that is _quiet, precise, never gratuitous_. Motion must never cost the performance budget (04-strategy/performance-plan.md) and must disappear under reduced motion (D-015).

## 1. Motion principles

1. **Intent only** — motion communicates hierarchy, continuity, or state; if it does none of those, cut it.
2. **Restraint** — reveal distance small (16–24 px), durations short (150–400 ms), ≤ 2 simultaneous systems.
3. **One signature moment** — the Home hero intro only; every other entrance is a whisper, not a fanfare.
4. **Performance first** — animate `transform` and `opacity` only (GPU); never `top/left/width/height` for layout motion; cap concurrent animations; `will-change` sparingly.
5. **Reduced motion = first-class** — all decorative motion replaced by instant/static equivalents (identical content order).
6. **No motion without state** — every animation has a resting state that is fully designed.

## 2. Motion token set (single source — implement as constants)

| Token                       | Value                                             |
| --------------------------- | ------------------------------------------------- |
| `--dur-fast`                | 150 ms                                            |
| `--dur-base`                | 250 ms                                            |
| `--dur-slow`                | 400 ms                                            |
| `--dur-hero`                | 600 ms                                            |
| Ease standard               | `cubic-bezier(0.65, 0, 0.35, 1)`                  |
| Ease decelerate (entrances) | `cubic-bezier(0.16, 1, 0.3, 1)`                   |
| Ease accelerate (exits)     | `cubic-bezier(0.7, 0, 0.84, 0)`                   |
| Spring (micro)              | `{ type: "spring", stiffness: 380, damping: 30 }` |
| Reveal distance             | 16–24 px                                          |
| Stagger                     | 40–80 ms between items (max 6 steps)              |

## 3. Animation inventory (v1 — complete list)

### Entrances

| Animation        | Trigger         | Spec                                                                                                                        | Component                |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Hero intro       | Home load       | Wordmark fades/rises 12 px (250 ms), statement line follows (300 ms), CTAs (150 ms staggered) — `--dur-hero` total ≤ 800 ms | `Hero`                   |
| Reveal on scroll | All sections    | Fade + 16–24 px rise, 400 ms ease-decelerate, once; `StaggerGroup` offsets 40–80 ms                                         | `Reveal`, `StaggerGroup` |
| Page transition  | Route change    | Fade + 8 px rise, 250 ms; View Transitions API where supported, Motion fallback; focus → main heading                       | `PageTransition`         |
| Menu overlay     | Mobile nav open | Links stagger in 150–250 ms; overlay fade 200 ms                                                                            | `MobileNav`              |

### Micro-interactions

| Interaction              | Spec                                                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Inline links             | Copper underline grows left→right 150 ms (motion-safe)                                                                      |
| Buttons                  | Arrow translates 2–3 px on hover/focus; bg deepens 150 ms                                                                   |
| Cards (work)             | Lift 2 px + shadow-md + copper hairline, 250 ms spring-lite                                                                 |
| SelectedWork hover/focus | Media crossfade + caption swap 300 ms (focus mirror)                                                                        |
| Theme toggle             | Content crossfade 250 ms; icon swap with micro-rotate                                                                       |
| Availability pill        | Soft pulse only while "booking" status (motion-safe, opacity)                                                               |
| Form submit              | Button shows inline spinner (rotates, no layout shift); success card fades up 250 ms                                        |
| Metric counters          | Count-up 600–900 ms on reveal (spring-damped), `aria-hidden` (final value in DOM for SR) — reduced-motion: show final value |
| Scroll progress (notes)  | Thin copper bar: width = scroll %, 0 jumps (transform scaleX)                                                               |

### Decorative (optional, pointer-only, motion-safe gated)

| Effect                      | Restraint rules                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| CursorGlow                  | Copper radial glow following pointer; opacity ≤ 14%; disabled < lg + reduced-motion + touch |
| Magnetic buttons (CTA only) | ≤ 4 px translate toward cursor, springs back 200 ms                                         |
| Marquee (client names)      | 20–30 s loop, edge fade masks, pause on hover/focus                                         |

## 4. Scroll & page-motion systems

- **Lenis** smooth scroll: enabled desktop only (`lg+`), motion-safe only, `wheelMultiplier` 1, `touchMultiplier` 0 (native touch scroll — always), `syncTouch: false`; scroll-behavior math hidden under reduced motion; CSS `scroll-behavior: smooth` for anchor fallback.
- **Scroll progress**: passive `scroll` listener (rAF-throttled) or IntersectionObserver-driven; zero layout thrash (`transform: scaleX` origin-left).
- **View Transitions API**: adopt progressively for route changes (`document.startViewTransition`); default fade+rise; Motion `AnimatePresence` fallback; disabled under reduced motion (instant).

## 5. Reduced-motion & capability gating (normative)

| Context                                                 | Behavior                                                                                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefers-reduced-motion: reduce`                        | All entrances reveal instantly at final state; counters final; Lenis off; marquee static; transitions instant; no cursor effects; no magnetic; no pulse |
| No JavaScript                                           | Every animated component renders its static (reduced-motion) state server-side — identical markup                                                       |
| Touch device                                            | Cursor effects/magnetic/marquee animation off; hover previews → tap pattern (responsive-strategy §6)                                                    |
| `prefers-contrast: more`                                | Keep animation; ensure no information conveyed by motion alone                                                                                          |
| Battery saver / `navigator.deviceMemory` low (optional) | Could disable marquee/glow — decide at P4; low priority                                                                                                 |

## 6. Implementation rules for agents

1. Use the motion token constants — no ad-hoc durations/easings.
2. `Reveal`/`StaggerGroup` wrap sections; never animate whole-page opacity on scroll (jank risk).
3. No animation on LCP element after initial render beyond hero intro; hero image itself never animates.
4. Every client motion component imports reduced-motion hook/media query first.
5. Animate only `transform/opacity`; where layout must animate (filter re-layout), use FLIP-style approach (`framer-motion layout` prop) with `layout={true}` + measured, not hand-rolled keys.
6. No infinite loops except marquee; loop animations respect `visibilitychange` (pause in background tabs) and pause on hover/focus.
7. Gamut: check each animation in Lighthouse CI (no long tasks > 200 ms on trail; no layout shifts from animation).

## 7. QA checklist (per animation)

- [ ] Works without JS (static fallback identical)
- [ ] Reduced-motion: instant, no transform, no hidden content
- [ ] No CLS contribution (measured)
- [ ] 60 fps on a mid phone (3060/emulated) — DevTools performance spot-check
- [ ] Focus/keyboard triggers equivalent animation to hover
- [ ] Totally off when tab hidden (marquee loops)
