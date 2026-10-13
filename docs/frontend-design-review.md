# Frontend design review

Reviewed 2026-10-13 on `feature/frontend-design-review`. Covers the portfolio, all five case studies, AWS study deck, Explorer introduction and Explorer workspace. The canonical specification is [design/DESIGN.md](../design/DESIGN.md).

## Design decisions and fixes

| Finding | Result |
| --- | --- |
| Homepage introduction occupied almost a full extra screen; primary actions sat too low | Short two-line headline, concise copy and visible actions; editorial infrastructure image replaces the simulated terminal/status panel |
| Five projects left an empty corner in a three-column grid | One full-width featured project and four supporting projects in a two-column grid; single column on mobile |
| Lakehouse and AI case studies overflowed by 210px and 75px at 375px width | Shrinkable grid/flex children and contained code scrolling; both now have zero page overflow |
| Large article headings consumed too much mobile space | Fluid title scales and balanced wrapping, with complete technical titles retained |
| Slide text, repeated cards and diagrams competed for attention | Plain key points and quieter slide surfaces; small diagrams share a wide-screen row with the grouped explanation; complex graphs keep the full width and precede the bullet list |
| Initial study loading moved keyboard focus beyond the header | Initial focus stays at the document; explicit slide navigation still focuses the new slide |
| Notebook text and tool labels were too small | 15px notebook/relationship copy, 14px topic rows, search labels, diagram controls and map guidance |
| Search depended on a placeholder for its visible name | Persistent Search services label above the Explorer field |
| Footer links failed the automated contrast check | Quiet Ink (`#aebad3`) replaces the low-contrast utility color; links also get 44px target height |
| Full icon font transferred 1,137,571 bytes | All six font pages request the 52 actual symbols; measured transfer is 21,683 bytes, about 98% smaller |
| Motion/transparency preferences were inconsistently handled | Shared reduced-motion and opaque-surface fallbacks, no grid-track/progress-width transitions, scrollable mobile menu for short viewports |

The existing shared navigation order, routes, brand fonts, study material, visual registry and service relationship data are preserved. Concurrent edits to `docs/aws-data-eng-associate.md` are excluded from this frontend commit. The wide desktop notebook and All relationships default remain intact.

## Skill application

- **gpt-taste:** Seeded layout exploration, shorter hero, complete five-project grid, useful imagery and tactile feedback. Its React/GSAP, alternate-font and cinematic-layout prescriptions were adapted to the repository's static stack and established identity.
- **design-taste-frontend:** Audit-first refinement, readable type, precise spacing, restrained card surfaces, responsive containment, real content and keyboard/pointer parity. Compact learning tools retain task-oriented controls rather than taking on a marketing-page structure.
- **stitch-design-taste:** Rewrote the existing canonical design document in its seven-section semantic format: atmosphere, color roles, typography, components, layout, motion and explicit anti-patterns. The document is suitable as Stitch prompt context; no screen generation in the external Stitch application is claimed.

The repository explicitly requires Space Grotesk/Inter/JetBrains Mono and the navy/periwinkle/cyan/green identity. These take precedence over generic font/color bans. Restrained CSS feedback suits the learning workspace; perpetual animation and new framework dependencies were not introduced.

## Verification

Chrome review used 1440×1000 and 375×812 viewports. The interaction suites run against the locally served production HTML/CSS/JavaScript, without a new website dependency.

| Check | Result |
| --- | --- |
| Node built-in tests | 20 passing |
| Shared navigation/layout across nine pages | 92 desktop and 128 mobile assertions passing; zero page overflow |
| Extra-narrow layout | All nine pages also pass the 128 mobile assertions at 320px width |
| Study deck | 177 assertions passing at each width |
| Explorer interactions | 24 assertions passing at each width |
| Embedded notebook and disclosure behavior | 25 assertions passing at each width |
| Local assets/pages/docs and fragment destinations | 34 paths return HTTP 200; local fragment targets exist |
| Notebook at wide breakpoints | 480px track at 1050/1100px, 720px track at 1920px; zero page overflow |
| Reduced motion | Emulated preference matches; project-card transition duration is 0s |
| Native keyboard checks | First Tab reaches the visible header brand; Enter toggles section disclosures; O toggles the sidebar; Enter on Start Explorer loads all 75 services |
| Code scrolling | ArrowRight moves the mobile code viewport 40px while preserving a visible 3px focus ring and zero page overflow |
| Screenshots | Homepage desktop/mobile, project composition, small/complex diagrams, article code, Explorer entry and selected notebook visually inspected |

The existing study suites also exercise section search/restoration, direct source-page navigation, full notes/code/tables, diagram zoom/fit, text alternatives and blocked-library fallback. Browser checks do not constitute a complete assistive-technology audit.

### Homepage Lighthouse measurements

Mobile simulation against the local server, same Lighthouse invocation before and after the font/contrast corrections:

| Metric | First design pass | Final pass |
| --- | --- | --- |
| Performance | 56 | 77 |
| Accessibility | 95 | 100 |
| First contentful paint | 9.0s | 3.6s |
| Largest contentful paint | 9.5s | 4.1s |
| Final cumulative layout shift | — | 0 |
| Final total blocking time | — | 0ms |

These are single-run lab measurements, not production field results or a guarantee for every page. The first column is the initial redesigned page before icon subsetting, not a pre-task performance baseline. Existing runtime Tailwind (approximately 130KB) and external text fonts still add render-blocking network work. A future asset/build strategy could improve loading further; that tooling change is outside this visual refinement.

Google documents alphabetical `icon_names` subsetting and `display=block` in its [Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols). The implemented request retains the existing variable axes and includes every icon used by the six pages.

## Generated image record

- **Mode:** generate; photorealistic-natural editorial illustration, no input image.
- **Saved asset:** [assets/images/infrastructure-editorial.webp](../assets/images/infrastructure-editorial.webp).
- **Dimensions/size:** 1448×1086, 96,314 bytes; converted to WebP quality 84 without resizing or visual edits.
- **Use:** decorative homepage imagery, empty alternative text. This AI-generated image does not represent a client installation.

Exact generation prompt:

> Use case: photorealistic-natural. Asset type: editorial photograph for a data engineer portfolio hero, landscape 4:3 composition. Primary request: a precise, calm macro photograph of neatly organized fiber optic patch cables and brushed metal network infrastructure. Dark graphite equipment, deep navy environment (#0b1326), cool off-white studio light, a very restrained hint of soft cyan on a few cable tips. Close crop focused on the tactile cable arcs and machined connectors, with generous dark negative space, architectural rhythm and clear depth. Sophisticated real material texture, soft directional light, realistic shallow depth of field, high-end engineering journal photography. No text, numbers, logos, status displays, software UI, charts, diagrams, people, glowing neon, purple lighting, colorful LEDs or sci-fi effects. This is an illustrative infrastructure image, not a claimed photograph of a client installation. It must remain legible as an image in a dark navy website without being overly bright.
