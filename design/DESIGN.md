# Design System: Architectural Precision

Canonical specification for Raphael Miranda Mata's portfolio, case studies and AWS learning workspace. Updated 2026-10-14 from the implemented frontend. Use this document as context when generating screens in Google Stitch or changing the static site.

Only the homepage's first-screen hero is restored from `feature/merged-aws-study-notes`, as clarified by the user. Its headline, illustrative terminal and original hero treatment are intentional exceptions to the newer composition guidance. Everything around and below that hero retains the frontend design review: featured project grid, footer contrast, icon-font subset, shared accessibility improvements and refined case-study/learning-tool layouts.

## 1. Visual Theme & Atmosphere

A calm engineering journal in deep navy: confident typography, real infrastructure imagery, generous margins and clearly separated working surfaces. The portfolio introduces the person and projects; the learning tools prioritize reading, finding topics and understanding relationships.

Calibrate **variance 5 / motion 3 / density 4** for new work. Preserve the requested homepage split between its headline and illustrative terminal, a single focused introduction for Explorer, and compact controls around spacious content in the study tools. Hierarchy comes from type, alignment, tonal layers and useful content.

The repository's established identity takes precedence over generic skill defaults. Keep **Space Grotesk, Inter and JetBrains Mono**, the periwinkle primary action, and restrained cyan/green signals. The implementation remains HTML, CSS and vanilla JavaScript. React, animation libraries, perpetual motion and a new build pipeline are outside this design system.

Implementation ownership:

| Concern | Source |
| --- | --- |
| Shared tokens and fonts | `assets/js/tailwind.config.js` |
| Header, focus, shared surfaces and preference fallbacks | `assets/css/styles.css` |
| Cross-page navigation | `assets/js/main.js` |
| Portfolio composition | `index.html`, `assets/css/portfolio.css` |
| Article layout | `assets/css/case-studies.css`, `case-studies/*.html` |
| Study deck | `assets/css/aws-study-guide.css`, `assets/js/aws-study-guide.js` |
| Explorer entry | `assets/css/aws-explorer-landing.css` |
| Map and notebook | `assets/css/aws-service-explorer.css` |

Keep equivalent page-level CSS variables aligned with shared token values. Use root-relative asset paths. Study content, fenced Mermaid schematics, image references and captions belong in `docs/aws-data-eng-associate.md`. The study page applies the shared palette through Mermaid's theme configuration.

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
| Quiet Ink | `#aebad3` | Header links, placeholders, supporting tool text and footer links |
| Brand Periwinkle | `#c0c1ff` | Primary action, selected navigation and controlled emphasis |
| Brand Depth | `#8083ff` | Existing compact brand gradients |
| Action Ink | `#1000a9` | Dark lettering on light periwinkle actions |
| Interaction Cyan | `#5de6ff` | Keyboard focus, tool links, selected service flows |
| Study Green | `#4edea3` | Source-page metadata, service guidance and meaningful state |
| Error Coral | `#ffb4ab` | Errors and warnings with explanatory text |
| Structural Edge | `#464554` | Subtle bevels, progress track, restrained outlines |

Separate sections with space and tonal shifts. Inputs and diagram controls may have quiet outlines so their affordance remains clear. Bevels use Structural Edge at approximately 15% opacity. Do not outline every card or use a neon shadow to signal selection.

The homepage primary button, shared brand, contact action, Explorer entry and study Next control use the existing periwinkle gradient. The restored homepage also retains its original multicolor headline. Do not spread gradient lettering to body content or add another decorative accent. Existing article diagrams and skill categories may use semantic colors; preserve their meaning.

## 3. Typography Rules

**Space Grotesk** gives headings and navigation their technical character. **Inter** supplies readable body copy and controls. **JetBrains Mono** identifies code, source-page markers, measurements and compact technical metadata. Keep sans-serif fallbacks and a monospace fallback; never make a font download necessary to understand the page.

| Use | Implemented scale and rhythm |
| --- | --- |
| Homepage display | Original Tailwind `text-5xl md:text-7xl` (3rem / 4.5rem), 700, line-height 1.1 |
| Explorer entry display | `clamp(3rem, 6.8vw, 6rem)`, 700, line-height 1.08, maximum 14ch |
| Case-study title | `clamp(2.25rem, 4.7vw, 4.25rem)`, line-height 1.12, maximum 22ch; smaller mobile scale |
| Study topic title | `clamp(1.8rem, 3vw, 3rem)`, line-height 1.15, maximum 30ch |
| Main explanatory copy | 1rem–1.125rem (16–18px), line-height 1.7 |
| Notebook and relationship copy | `.9375rem` (15px), notebook line-height 1.7 |
| Search labels, topic rows and tool help | `.875rem` (14px) with visible labels |
| Secondary metadata | Approximately .75rem (12px); not the primary reading surface |

Limit reading paragraphs to **65ch** where practical. The restored homepage introduction uses `max-w-lg` (32rem). Use weight and spacing before increasing size. Balance long headings, allow sensible word wrapping, and retain complete technical titles. Explorer's short headline occupies two lines at the reviewed desktop/mobile sizes; the original homepage and long article titles retain their natural wrapping.

Do not truncate study topics to make them look short. Preserve original headings, incomplete prompts, code and source references. Source-page metadata belongs on the slide; the topic menu contains section headings and title-only rows.

## 4. Component Stylings

**Navigation.** Use the same 80px header, brand, destination order and current-page state on all ten pages. The container is at most 1440px wide. Desktop links have a 44px minimum height. Below 1100px, use a real 44px menu button with `aria-expanded`, a controlled menu and Escape/outside-click handling. Constrain the expanded menu to the available dynamic viewport and let it scroll in short windows.

**Actions.** Use rounded rectangles with a `.75rem` (12px) radius. Homepage actions retain their original 1rem vertical padding; Start Explorer is at least 56px high; tool controls are at least 44px. Give the primary action clear dark-on-light contrast. The homepage secondary action retains its transparent outlined treatment. Use links for navigation and buttons for in-page actions. Keep one dominant action per context.

**Focus.** Use a visible cyan ring, normally 3px with a 3px offset; page-specific study controls may use 2px. Leave room for the outline. Never hide focus or clip the 44px study-sidebar arrow. Initial study loading leaves focus at the document; explicit slide navigation moves focus to the slide.

**Project cards.** Use an Editorial Layer surface, 1rem (16px) corners and generous padding. The lakehouse and planned data-contracts concept span the complete two-column grid; the lakehouse keeps its architectural image and the concept uses a compact monitoring-flow diagram. The remaining four projects fill two rows. Hover changes tone and raises the card by at most 3px. Keep project status, titles, technologies and destinations accurate. Existing results require evidence before editorial changes.

**Article code.** Code retains its whitespace inside a keyboard-focusable `pre` with horizontal scrolling. Grid/flex children use `min-width: 0`; the panel stays within the page. Prose can wrap long tokens. Keep the focus ring visible when readers use arrow keys to inspect long lines.

**Study slide.** Use one quiet, 1rem-radius surface with a subtle bevel. Order the content as section, title and concise explanation. Key points are plain bullets rather than individual glowing cards. Extra notes, code and tables appear in a native disclosure only under an explicit nested `Detailed notes` heading. Mermaid diagrams follow the explanation at full width, with zoom/fit controls, a focusable scroll region, accessible SVG labels and captions. Use architecture diagrams for deployment topology and flowcharts for labeled relationships and sequences.

**Topic sections.** Use native `details`/`summary` for each section, with a nested list of title-only topic buttons. Summary targets are at least 48px and topic targets at least 44px. Show the active section and topic; keep secondary descriptions and repeated page prefixes out of the list. Search opens matching groups and restores previous expansion choices when cleared.

**Search and filters.** Put a persistent visible label above the field, with .4rem spacing. Use a recessed surface, readable placeholder, 44px control height and cyan focus. Secondary filters remain behind a disclosure. Matching services open the catalog; active selections remain visible as removable chips.

**Embedded notebook.** Keep the notebook within the map workspace. Start with a service name, a short explanation and usage guidance; put deeper notes, recall prompts and sources behind a disclosure. Use 15px body copy and a visible Choose services link. On large screens retain the wide reading panel; on mobile stack it beneath the map inside the same workspace.

**Explorer walkthrough.** On first use, teach one service, its related-service list and a two-service connection in three steps. Dim the page with a navy overlay; keep a cyan spotlight around the actual target and a pointing, bounded callout. Make Skip tutorial and Escape available, remember dismissal locally, and expose Show tutorial for replay. Keep background controls inert and keyboard focus within the target and tutorial actions. A single selected service exposes a compact related-services row; explain that co-participants can require additional services rather than implying direct pairwise integration.

**Loading, empty and error states.** Preserve the existing source-loading message, explicit unfinished-topic prompts, no-result feedback and diagram-library text fallback. Unsupported service combinations must say there is no verified relationship. Keep errors inline and actionable. Do not invent progress, service uptime, plausible relationships or decorative loading loops.

## 5. Layout Principles

Use CSS Grid for page composition and flexbox for compact action groups. Every content child must be allowed to shrink. Fix the overflowing component rather than concealing page-wide overflow. Internal code/table/canvas scrolling is intentional and must remain keyboard-accessible.

Portfolio composition:

- Preserve the original 921px minimum-height hero, 1280px container, 2rem side gutters, two equal columns from 768px and 3rem column gap. The main container retains the review's 80px fixed-header clearance.
- The original headline, opportunity indicator, introduction, illustrative pipeline terminal and decorative background remain. The terminal illustrates a workflow; it is not live telemetry.
- Below 768px, hide the terminal and use the original single-column text/actions. Keep both case-study and résumé destinations.
- Six project cards retain the reviewed two-column grid: the lakehouse and planned data-contracts concept span the full width, followed by four regular cells. `grid-auto-flow: dense` avoids an empty corner. Below 768px use one column.
- Case-study articles use controlled title widths, 65ch paragraphs, generous section spacing and smaller mobile padding. Preserve their individual content structure.

Workspace boundaries:

| Breakpoint | Behavior |
| --- | --- |
| Below 1100px | Shared navigation becomes a mobile menu |
| At/below 860px | Study slide and topics stack; the document can scroll naturally |
| At/below 720px | Study controls compact and the sidebar arrow gets its own top space |
| Every viewport | Diagrams use the full slide width; large diagrams scroll within their focusable region |
| At/above 1050px | Explorer notebook uses `clamp(480px, 42vw, 720px)` |
| 761–1049px | Explorer notebook uses a 360px reading track |
| At/below 760px | Map and notebook stack; service tiles use two columns |
| At/below 430px | Explorer service tiles use one column |

Use `100dvh` for viewport-aware shells. The desktop study shell keeps the slide and topic list independently scrollable; the mobile shell has automatic height and a dynamic-viewport minimum. Do not force article content into a fixed-height slide.

Image direction for future work: tactile infrastructure, organized cable paths, machined metal, cool light and dark negative space. The generated `assets/images/infrastructure-editorial.webp` is retained as an unused illustration recorded in the design review; the restored hero does not load it. The featured project retains the reviewed crop of the existing lakehouse artwork. Explorer keeps its static schematic SVG background behind a contrast-preserving navy wash.

Performance for new media: prioritize hero images, lazy-load below-fold media, and reserve dimensions. The homepage and six case-study pages retain the reviewed alphabetically sorted **52-symbol Material Symbols subset** with `display=block`; update their requests together when adding a glyph. See [Google's subsetting guidance](https://developers.google.com/fonts/docs/material_symbols). Existing Tailwind and font CDN requests remain part of the current static implementation.

## 6. Motion & Interaction

Motion confirms an action. Use short CSS feedback around 150–220ms and modest transform/opacity changes. The existing study entrance is a brief 420ms fade and 15px rise; project cards rise slightly on hover. Preserve the restored hero's existing hover and opportunity-indicator treatments; shared reduced-motion rules disable its animation when requested. Reading content, diagrams and topic lists do not need perpetual animation.

Do not animate the study grid's track widths or its progress-bar width. Sidebar visibility changes its layout immediately; opacity/transform may soften the panel transition. Avoid scroll hijacking, pinned reading sections, custom cursors, typewriter headings and unrequested carousels. No animation library is required.

Respect `prefers-reduced-motion`: stop animations, remove transitions and use immediate scrolling; show the complete final content. Under `prefers-reduced-transparency`, shared glass panels and the notebook use opaque navy surfaces with no backdrop blur.

Preserve native keyboard behavior for links, buttons, selects and disclosures. Study shortcuts operate outside text entry and interactive controls. Search, topic navigation, zoom/fit, map selection, notebook disclosures and mobile navigation must work without pointer-only gestures. Diagram captions and a visible error message remain usable if the library fails.

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
