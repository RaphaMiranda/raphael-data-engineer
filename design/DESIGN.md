# Design System: Architectural Precision

Canonical specification for Raphael Miranda's portfolio, case studies and AWS learning workspace. Updated 2026-10-13 from the implemented frontend. Use this document as context when generating screens in Google Stitch or changing the static site.

## 1. Visual Theme & Atmosphere

A calm engineering journal in deep navy: confident typography, real infrastructure imagery, generous margins and clearly separated working surfaces. The portfolio introduces the person and projects; the learning tools prioritize reading, finding topics and understanding relationships.

Calibrate **variance 5 / motion 3 / density 4**. Use an asymmetric editorial split for the homepage, a single focused introduction for Explorer, and compact controls around spacious content in the study tools. Hierarchy comes from type, alignment, tonal layers and useful content.

The repository's established identity takes precedence over generic skill defaults. Keep **Space Grotesk, Inter and JetBrains Mono**, the periwinkle primary action, and restrained cyan/green signals. The implementation remains HTML, CSS and vanilla JavaScript. React, animation libraries, perpetual motion and a new build pipeline are outside this design system.

Implementation ownership:

| Concern | Source |
| --- | --- |
| Shared tokens and fonts | `assets/js/tailwind.config.js` |
| Header, focus, shared surfaces and preference fallbacks | `assets/css/styles.css` |
| Cross-page navigation | `assets/js/main.js` |
| Portfolio composition | `assets/css/portfolio.css`, `index.html` |
| Article layout | `assets/css/case-studies.css`, `case-studies/*.html` |
| Study deck | `assets/css/aws-study-guide.css`, `assets/js/aws-study-guide.js` |
| Explorer entry | `assets/css/aws-explorer-landing.css` |
| Map and notebook | `assets/css/aws-service-explorer.css` |

Keep equivalent page-level CSS variables aligned with shared token values. Use root-relative asset paths. Study content belongs in `docs/aws-data-eng-associate.md`; schematics belong in `assets/js/aws-study-visuals.js`.

## 2. Color Palette & Roles

All surfaces belong to the same cool navy family. Periwinkle carries the brand and primary action; cyan indicates interaction and diagram flow. Green has a specific study or status meaning rather than serving as another button color.

| Descriptive name | Value | Functional role |
| --- | --- | --- |
| Deep Navy | `#0b1326` | Page canvas and low-contrast section environment |
| Recessed Navy | `#060e20` | Diagram canvas, code background, opaque header fallback |
| Editorial Layer | `#131b2e` | Main slide, project card and sidebar surface |
| Raised Navy | `#222a3d` | Secondary action, selected row, elevated controls |
| Glass Layer | `#2d3449` | Shared translucent panels and opaque fallback |
| Hover Layer | `#31394d` | Hover elevation without a glow |
| Reading Ink | `#dae2fd` | Primary text on navy |
| Supporting Ink | `#c7c4d7` | Body notes and descriptive text |
| Quiet Ink | `#aebad3` | Header links, placeholders, supporting homepage text and footer links |
| Brand Periwinkle | `#c0c1ff` | Primary action, selected navigation and controlled emphasis |
| Brand Depth | `#8083ff` | Existing compact brand gradients |
| Action Ink | `#1000a9` | Dark lettering on light periwinkle actions |
| Interaction Cyan | `#5de6ff` | Keyboard focus, tool links, selected service flows |
| Study Green | `#4edea3` | Source-page metadata, service guidance and meaningful state |
| Error Coral | `#ffb4ab` | Errors and warnings with explanatory text |
| Structural Edge | `#464554` | Subtle bevels, progress track, restrained outlines |

Separate sections with space and tonal shifts. Inputs and diagram controls may have quiet outlines so their affordance remains clear. Bevels use Structural Edge at approximately 15% opacity. Do not outline every card or use a neon shadow to signal selection.

The homepage uses a flat primary button. The shared brand, contact action, Explorer entry and study Next control retain their existing restrained periwinkle gradient. Do not spread gradient lettering to body content or add another decorative accent. Existing article diagrams and skill categories may use semantic colors; preserve their meaning.

## 3. Typography Rules

**Space Grotesk** gives headings and navigation their technical character. **Inter** supplies readable body copy and controls. **JetBrains Mono** identifies code, source-page markers, measurements and compact technical metadata. Keep sans-serif fallbacks and a monospace fallback; never make a font download necessary to understand the page.

| Use | Implemented scale and rhythm |
| --- | --- |
| Homepage display | `clamp(2.75rem, 5.1vw, 4.6rem)`, 700, line-height 1.08, tracking `-.045em`; mobile starts at 2.4rem |
| Explorer entry display | `clamp(3rem, 6.8vw, 6rem)`, 700, line-height 1.08, maximum 14ch |
| Case-study title | `clamp(2.25rem, 4.7vw, 4.25rem)`, line-height 1.12, maximum 22ch; smaller mobile scale |
| Study topic title | `clamp(1.8rem, 3vw, 3rem)`, line-height 1.15, maximum 30ch |
| Main explanatory copy | 1rem–1.125rem (16–18px), line-height 1.7 |
| Notebook and relationship copy | `.9375rem` (15px), notebook line-height 1.7 |
| Search labels, topic rows and tool help | `.875rem` (14px) with visible labels |
| Secondary metadata | Approximately .75rem (12px); not the primary reading surface |

Limit reading paragraphs to **65ch** where practical. The homepage introduction is tighter at 42ch. Use weight and spacing before increasing size. Balance long headings, allow sensible word wrapping, and retain complete technical titles. The short homepage and Explorer headlines occupy two lines at the reviewed desktop/mobile sizes; long case-study titles may need additional mobile lines.

Do not truncate study topics to make them look short. Preserve original headings, incomplete prompts, code and source references. Source-page metadata belongs on the slide; the topic menu contains section headings and title-only rows.

## 4. Component Stylings

**Navigation.** Use the same 80px header, brand, destination order and current-page state on all nine pages. The container is at most 1440px wide. Desktop links have a 44px minimum height. Below 1100px, use a real 44px menu button with `aria-expanded`, a controlled menu and Escape/outside-click handling. Constrain the expanded menu to the available dynamic viewport and let it scroll in short windows.

**Actions.** Use rounded rectangles with a `.75rem` (12px) radius. Homepage actions are at least 52px high; Start Explorer is at least 56px high; tool controls are at least 44px. Give the primary action clear dark-on-light contrast. A secondary action uses Raised Navy and Reading Ink. Use links for navigation and buttons for in-page actions. Keep one dominant action per context.

**Focus.** Use a visible cyan ring, normally 3px with a 3px offset; page-specific study controls may use 2px. Leave room for the outline. Never hide focus or clip the 44px study-sidebar arrow. Initial study loading leaves focus at the document; explicit slide navigation moves focus to the slide.

**Project cards.** Use an Editorial Layer surface, 1rem (16px) corners and generous padding. The leading project includes its existing architectural image and spans the complete two-column grid; the remaining four projects fill two rows. Hover changes tone and raises the card by at most 3px. Keep project titles, technologies and destinations real. Existing results require evidence before editorial changes.

**Article code.** Code retains its whitespace inside a keyboard-focusable `pre` with horizontal scrolling. Grid/flex children use `min-width: 0`; the panel stays within the page. Prose can wrap long tokens. Keep the focus ring visible when readers use arrow keys to inspect long lines.

**Study slide.** Use one quiet, 1rem-radius surface with a subtle bevel. Order the content as source metadata, section, title and concise explanation. Key points are plain bullets rather than individual glowing cards. Full notes, code and tables remain in a native disclosure. Small diagrams can sit beside the explanation on wide screens; complex diagrams remain full width directly after it. Diagram controls, captions and a readable text equivalent accompany the canvas.

**Topic sections.** Use native `details`/`summary` for each section, with a nested list of title-only topic buttons. Summary targets are at least 48px and topic targets at least 44px. Show the active section and topic; keep secondary descriptions and repeated page prefixes out of the list. Search opens matching groups and restores previous expansion choices when cleared.

**Search and filters.** Put a persistent visible label above the field, with .4rem spacing. Use a recessed surface, readable placeholder, 44px control height and cyan focus. Secondary filters remain behind a disclosure. Matching services open the catalog; active selections remain visible as removable chips.

**Embedded notebook.** Keep the notebook within the map workspace. Start with a service name, a short explanation and usage guidance; put deeper notes, recall prompts and sources behind a disclosure. Use 15px body copy and a visible Choose services link. On large screens retain the wide reading panel; on mobile stack it beneath the map inside the same workspace.

**Loading, empty and error states.** Preserve the existing source-loading message, explicit unfinished-topic prompts, no-result feedback and diagram-library text fallback. Unsupported service combinations must say there is no verified relationship. Keep errors inline and actionable. Do not invent progress, service uptime, plausible relationships or decorative loading loops.

## 5. Layout Principles

Use CSS Grid for page composition and flexbox for compact action groups. Every content child must be allowed to shrink. Fix the overflowing component rather than concealing page-wide overflow. Internal code/table/canvas scrolling is intentional and must remain keyboard-accessible.

Portfolio composition:

- A 1280px hero container uses a `1.2fr / 1fr` editorial split with `minmax(0, …)` tracks, a 2–5rem gap and 3–6rem vertical padding.
- Text and imagery occupy separate zones. Use one clear heading, a short introduction and two useful destinations: case studies and résumé.
- Below 768px, stack text, actions and image. Use 1.25rem side gutters, 2rem gaps and a fluid display scale. Actions wrap if needed.
- Five project cards occupy a two-column grid: one full-width feature plus four regular cells. `grid-auto-flow: dense` avoids an empty corner. Below 768px use one column.
- Case-study articles use controlled title widths, 65ch paragraphs, generous section spacing and smaller mobile padding. Preserve their individual content structure.

Workspace boundaries:

| Breakpoint | Behavior |
| --- | --- |
| Below 1100px | Shared navigation becomes a mobile menu |
| At/below 860px | Study slide and topics stack; the document can scroll naturally |
| At/below 720px | Study controls compact and the sidebar arrow gets its own top space |
| At/above 1360px | Diagrams with at most three nodes may share a row with grouped explanation and bullets |
| Above three nodes | Diagram remains full width at every viewport |
| At/above 1050px | Explorer notebook uses `clamp(480px, 42vw, 720px)` |
| 761–1049px | Explorer notebook uses a 360px reading track |
| At/below 760px | Map and notebook stack; service tiles use two columns |
| At/below 430px | Explorer service tiles use one column |

Use `100dvh` for viewport-aware shells. The desktop study shell keeps the slide and topic list independently scrollable; the mobile shell has automatic height and a dynamic-viewport minimum. Do not force article content into a fixed-height slide.

Image direction: tactile infrastructure, organized cable paths, machined metal, cool light and dark negative space. The homepage's `assets/images/infrastructure-editorial.webp` is a decorative **AI-generated illustration**, 1448×1086, approximately 96KB, with empty alternative text and explicit intrinsic dimensions. It is not evidence of a client installation. The case-study feature uses the existing lakehouse artwork. Explorer keeps its static schematic SVG background behind a contrast-preserving navy wash.

Performance: prioritize the hero image, lazy-load below-fold media, and reserve dimensions. The six icon-font pages share an alphabetically sorted **52-symbol Material Symbols subset** with `display=block`; update all six requests together when adding a glyph. See [Google's subsetting guidance](https://developers.google.com/fonts/docs/material_symbols). Existing Tailwind and font CDN requests remain part of the current static implementation.

## 6. Motion & Interaction

Motion confirms an action. Use short CSS feedback around 150–220ms and modest transform/opacity changes. The existing study entrance is a brief 420ms fade and 15px rise. Buttons press inward and project cards rise slightly on hover. Reading content, diagrams and topic lists do not need perpetual animation.

Do not animate the study grid's track widths or its progress-bar width. Sidebar visibility changes its layout immediately; opacity/transform may soften the panel transition. Avoid scroll hijacking, pinned reading sections, custom cursors, typewriter headings and unrequested carousels. No animation library is required.

Respect `prefers-reduced-motion`: stop animations, remove transitions and use immediate scrolling; show the complete final content. Under `prefers-reduced-transparency`, shared glass panels and the notebook use opaque navy surfaces with no backdrop blur.

Preserve native keyboard behavior for links, buttons, selects and disclosures. Study shortcuts operate outside text entry and interactive controls. Search, topic navigation, zoom/fit, map selection, notebook disclosures and mobile navigation must work without pointer-only gestures. Diagram text alternatives remain usable if the library fails.

## 7. Anti-Patterns (Banned)

- Oversized short headlines that bury the primary action or create unnecessary mobile line breaks.
- Dense slides made of repeated rounded text chips; unexplained diagrams with illegible labels and no zoom/text alternative.
- Clipped controls, missing keyboard focus, hidden form labels and autofocus that skips the site header on load.
- Page-level horizontal scrolling, percentage-width hacks and hiding overflow to mask a broken grid.
- Equal three-card rows added by habit, empty grid corners and overlapping text/image compositions.
- Neon button glows, excessive gradient headings, new competing accent colors and pure-black replacement backgrounds.
- Fake terminal output, live-service indicators, invented metrics, fabricated testimonials and unsupported AWS connections.
- Generic marketing slogans, filler scroll instructions, decorative badges and emoji navigation.
- Perpetual pulse/shimmer loops, layout-property animation and motion required to reveal information.
- React/GSAP/build tooling introduced as a visual shortcut, or a second conflicting design specification.
- Removing source headings or rewriting technical facts solely to simplify the layout.

Before accepting a screen, review desktop and narrow mobile layouts, keyboard focus and local destinations. Run the existing Node/browser checks relevant to the change. Record actual measurements and limitations in the [frontend design review](../docs/frontend-design-review.md).
