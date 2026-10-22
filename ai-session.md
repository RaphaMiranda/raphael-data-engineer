# AI session log

## 2026-10-22 - Preserve Markdown block order

- **Branch:** `feat/from-gojs-to-mermaid`.
- **Goal:** Render each Markdown topic in the order its paragraphs, code, tables, lists, and diagrams appear in the source.
- **Changed files:** `assets/js/aws-study-guide.js`, `tests/aws-study-guide.test.js`, `ai-session.md`.
- **Changes:** The parser now records ordered content blocks and the slide renderer emits them in that order. Nested Detailed notes use the same ordered rendering inside their collapsible section.
- **Verification:** All 9 Node tests passed; both JavaScript files passed syntax checks; four local page resources returned HTTP 200; `git diff --check` passed. A targeted browser check at desktop and mobile widths confirmed the Data Engineering 101 paragraph, code fence, and quote remain in source order without horizontal overflow. The full browser suite was not rerun.
- **Commit:** `da920ba` (`fix: preserve Markdown block order`).

## 2026-10-22 - Render all Markdown content outside Detailed notes

- **Branch:** `feat/from-gojs-to-mermaid`.
- **Goal:** Keep only explicitly nested Detailed notes collapsed; display the rest of each topic's Markdown.
- **Changed files:** `assets/js/aws-study-guide.js`, `tests/aws-study-guide.test.js`, `ai-session.md`.
- **Changes:** Render every top-level paragraph and list item, plus ordinary fenced code blocks. Standalone blockquotes now become visible paragraph text while Mermaid captions remain attached to their diagrams. Removed the four-item list summary. Nested Detailed notes still use the collapsed renderer.
- **Verification:** All 8 Node tests passed. Browser checks confirmed all three Ingestion vs Integration paragraphs and its example render at desktop and mobile, and a top-level SQL code block renders on mobile; no page horizontal overflow. Four local resources returned HTTP 200; JavaScript syntax and `git diff --check` passed. The full browser suite was not rerun because its fixed navigation assumptions predate the user's Markdown edits.
- **Commit:** `4cead3c` (`fix: render all non-detailed study content`).

## 2026-10-22 - Suppress empty prompt when a topic has a table

- **Branch:** `feat/from-gojs-to-mermaid`.
- **Goal:** Avoid showing the unexpanded-topic prompt on Key Concepts when its Markdown table is present.
- **Changed files:** `assets/js/aws-study-guide.js`, `ai-session.md`.
- **Changes:** The empty-state check omitted top-level tables, so a table-only slide looked empty. It now checks the same rendered table HTML that the slide displays; explicit `<!-- unexpanded -->` markers still trigger the prompt.
- **Verification:** Browser checks at 1440px and 390px confirmed the six-row table displays without the prompt and without page horizontal overflow. ArrowRight while the table is focused stayed on Key Concepts. Four local resources returned HTTP 200; `node --check` and `git diff --check` passed. The full browser suite was not rerun because its topic assumptions predate the user's uncommitted Markdown edits.
- **Commit:** `fa6e0b6` (`fix: include tables in empty topic check`).

## 2026-10-22 - Render top-level study tables

- **Branch:** `feat/from-gojs-to-mermaid`.
- **Goal:** Show Markdown tables written directly under a study topic.
- **Changed files:** `assets/js/aws-study-guide.js`, `ai-session.md`.
- **Changes:** Top-level tables were parsed into `current.tables` but `renderSlide()` only emitted tables from explicit Detailed notes. The slide renderer now includes top-level tables. Arrow keys pressed while a table region is focused no longer navigate to another topic.
- **Verification:** Browser check confirmed all six Key Concepts rows and the `Area` header at 1440px and 390px, with no page horizontal overflow. ArrowRight while the table had focus kept the same topic. Four local page resources returned HTTP 200; `node --check` and `git diff --check` passed. The existing Node suite passed 7/8 tests; its remaining source-count assertion expects 764 slides, while the user's uncommitted Markdown edits currently produce 766. Those Markdown edits were left unstaged.
- **Commit:** `c5d4a21` (`fix: render top-level study tables`).

## 2026-10-22 - Markdown and Mermaid study diagrams

- **Branch:** `feat/from-gojs-to-mermaid`.
- **Goal:** Keep study visuals with their topics in Markdown, use Mermaid throughout, simplify Key Concepts and apply the webpage theme.
- **Changed files:** `docs/aws-data-eng-associate.md`, `assets/js/aws-study-guide.js`, `assets/css/aws-study-guide.css`, `aws-study-guide.html`, `assets/js/aws-study-visuals.js` (deleted), `README.md`, `design/DESIGN.md`, `tests/aws-study-guide.test.js`, `tests/aws-study-guide-browser.js`, `ai-session.md`.
- **Changes:** Moved all 331 diagram definitions and the image reference/caption into the study document. Three VPC/gateway schematics use architecture diagrams; other relationships use labeled flowcharts. Removed the GoJS dependency, its renderer and the visual sidecar. Mermaid uses the page palette, accessible SVG labels, keyboard zoom/fit and scrolling, explicit loading/error states and protection against stale asynchronous renders. Markdown loads without browser caching so saved edits appear on refresh. Retained the user's concurrent Key Concepts diagram edits.
- **Verification:** All 331 Mermaid blocks parsed and rendered to SVG. A migration comparison preserved all 764 headings and original notes, plus 1,411 node labels/details and 1,152 relationships outside the user-edited Key Concepts diagram. All 8 Node tests and 168 browser checks per viewport passed at 1440x1000 and 390x844; mobile used reduced motion. Native keyboard zoom and diagram scrolling worked. All 9 local resource/navigation paths returned HTTP 200; JavaScript syntax and whitespace checks passed. Other browsers and deployment were not checked.
- **Commit:** `461c90c` (`refactor: move study diagrams into Markdown and Mermaid`).

## 2026-10-22 - Circular Key Concepts lifecycle diagram

- **Branch:** `feature/aws-explorer-first-use-tour`.
- **Goal:** Arrange the five Key Concepts lifecycle stages as equal circles around a ring, connected by the five lifecycle arrows.
- **Changed files:** `README.md`, `assets/css/aws-study-guide.css`, `assets/js/aws-study-guide.js`, `assets/js/aws-study-visuals.js`, `docs/aws-data-eng-associate.md`, `ai-session.md`.
- **Changes:** Replaced the Mermaid experiment with the existing GoJS renderer's circular layout, equal-sized circle nodes and the established page palette. Refit the circular diagram when the slide resizes; updated the README to match.
- **Verification:** Browser previews at 1440px and 390px show all five circles and arrows in a ring without clipping. `node --check` passed for both changed scripts and scoped `git diff --check` passed. No test suite was run.
- **Commit:** `8f8e317` (`fix: arrange lifecycle stages in circular diagram`).

## 2026-10-22 - Removed diagram text and made detailed notes opt-in

- **Branch:** `feature/aws-explorer-first-use-tour`.
- **Goal:** Remove the "Read Diagram as text" feature and show the Detailed notes renderer only when a slide has a nested `Detailed notes` heading.
- **Changed files:** `assets/js/aws-study-guide.js`, `assets/css/aws-study-guide.css`, `README.md`, `tests/aws-study-guide.test.js`, `tests/aws-study-guide-browser.js`, `ai-session.md`.
- **Changes:** Removed the diagram node and relationship text disclosure and its fallback dependency. Kept the diagram caption for accessibility. Detailed notes, tables and code now render only from content under an explicit `Detailed notes` subheading.
- **Verification:** A focused self-check confirms diagrams omit the text disclosure, explicit nested notes and code parse correctly, and the current source has no opt-in notes sections. Changed JavaScript syntax checks and scoped `git diff --check` pass. Full Node and browser suites were not run.
- **Commit:** `7a3c8af` (`fix: make detailed slide notes opt-in`).

## 2026-10-22 - Removed base-document references from AWS study deck

- **Branch:** `feature/aws-explorer-first-use-tour`.
- **Goal:** Remove source-document attribution, page markers, page navigation and references from the personal AWS study deck.
- **Changed files:** `README.md`, `assets/js/aws-study-guide.js`, `assets/js/aws-study-visuals.js`, `aws-study-guide.html`, `docs/aws-data-eng-associate.md`, `docs/aws-study-review.md` (deleted), `docs/aws-study-source-coverage.json` (deleted), `tests/aws-study-guide-browser.js`, `tests/aws-study-guide.test.js`, `ai-session.md`.
- **Changes:** Removed all 723 page markers and direct source attributions in the notes, removed page search and page-based URLs, and rekeyed all 329 diagrams by section and topic. Retired the source-specific coverage and review files. Made older session summaries neutral too. Existing user edits to the notes were retained.
- **Verification:** A self-check resolved all 329 diagrams against 763 topics with unique diagram IDs and no unmatched keys. `node --check` passed for the changed JavaScript and test scripts. The full Node and browser suites were not run. `git diff --check` found trailing whitespace in pre-existing edited note lines.
- **Commit:** `fc37e65` (`chore: remove study deck source page references`).

## 2026-10-14 - Selectable Explorer relationships

- **Branch:** `feature/aws-explorer-first-use-tour`.
- **Goal:** Let learners choose an individual relationship when a selected service pair has several documented patterns, and replace the notebook preview with that relationship.
- **Changed files:** `assets/js/aws-service-explorer.js`, `assets/css/aws-service-explorer.css`, `aws-study-guide/service-explorer.html`, `tests/aws-explorer-notebook-browser.js`, `docs/aws-service-explorer.md`, `ai-session.md`.
- **Changes:** Added numbered relationship buttons to multi-match notebooks and made each map junction a pointer- and keyboard-accessible button. Selecting R1/R2 synchronizes the relationship dropdown, focuses the selected map relationship and replaces the compact notebook preview. Focused maps retain the same R number as the notebook; the chooser sits at the top of the notebook so it remains directly reachable. No relationship data or factual claims changed.
- **Verification:** All 11 Explorer Node tests and changed-script syntax checks pass. Notebook regression checks pass 28 assertions each at 1440x1000 and 375x812, including direct map mouse selection, keyboard activation, notebook-button switching, selector synchronization, stable R labels and responsive layout. The existing 24 interaction checks and all 63 relationship-card/preview checks pass at desktop. A real browser click switched the visible notebook from COPY to R2 Redshift Spectrum; a real map-junction click switched it to R3 UNLOAD. No browser errors; all five changed local paths returned HTTP 200; scoped whitespace checks pass.
- **Commit:** `feat: make AWS explorer relationships selectable`.

## 2026-10-14 - Opened cumulative AWS study pull request

- **Branch:** `feature/aws-explorer-first-use-tour`.
- **Goal:** Publish the completed AWS study deck, Service Explorer, Data Contracts case study and tutorial work for review.
- **Changed files:** `ai-session.md`.
- **Changes:** Pushed the feature branch and opened [pull request #1](https://github.com/RaphaMiranda/raphael-data-engineer/pull/1) from `feature/aws-explorer-first-use-tour` into the repository's `main` branch. `main` is an ancestor of the feature branch; GitHub shows the PR as open with 25 implementation commits and 46 changed files at creation.
- **Verification:** Confirmed `origin/main` is the only primary remote ref (there is no `master` ref), that it is an ancestor of the feature branch, and that the GitHub PR page reports the intended base and compare branches. The existing scope's static and browser checks are documented in the preceding feature entries.
- **Commit:** `docs: record AWS study pull request`.

## 2026-10-14 - First-use AWS explorer tutorial

- **Branch:** `feature/aws-explorer-first-use-tour`.
- **Goal:** Guide new users through Athena, its related services and the Amazon Quick visualization connection in three clickable steps.
- **Changed files:** `aws-study-guide/service-explorer.html`, `assets/js/aws-service-explorer.js`, `assets/js/aws-explorer-tutorial.js`, `assets/css/aws-service-explorer.css`, `tests/aws-explorer-tutorial-browser.js`, `tests/aws-explorer-browser.js`, `tests/aws-explorer-notebook-browser.js`, `tests/aws-explorer-relationships-browser.js`, `tests/site-navigation-browser.js`, `docs/aws-service-explorer.md`, `design/DESIGN.md`, `ai-session.md`.
- **Changes:** Added a first-visit walkthrough with a dark overlay, cyan spotlight, pointing callouts and actual service-selection targets. Added a compact single-service related list from documented co-participants. Skip and Escape restore the previous selections, filters, relationship choice and neighborhood setting; completion keeps Athena + Quick and focuses its notebook. Browser-local state remembers completion/skipping and Show tutorial allows replay. Background controls are inert, Tab cycles among tour controls, storage failures remain skippable, and callouts use side placement for short landscape windows. No dependencies added.
- **Factual review:** Confirmed the Athena-to-BI explanation against [AWS Athena connection documentation](https://docs.aws.amazon.com/quick/latest/userguide/athena.html) and [Amazon Quick Sight visualization documentation](https://docs.aws.amazon.com/quick/latest/userguide/quick-bi.html). The tour clarifies the catalog's Amazon Quick label alongside QuickSuite / QuickSight; related co-participants are not described as universal pairwise integrations.
- **Verification:** All 11 explorer Node tests and changed JavaScript syntax checks pass. Dedicated tutorial browser checks pass 37 assertions each at 1440x1000, 375x812 and 812x375, including real pointer-hit targets, focus isolation, all steps, skip restoration, replay, blocked storage and visible notebook focus after related-service selection. Existing notebook (25 assertions), interaction/card (24 assertions; all 75 services), relationship (all 63) and shared-navigation (9/13 assertions) suites pass at desktop/mobile sizes. Screenshots inspected; real pointer Athena selection and real Tab/Enter Quick selection pass with visible focus. Completion and skipping remain dismissed after reload; live resizing rebinds the spotlight. No browser page errors or horizontal overflow. All 35 local referenced paths return HTTP 200 and fragments resolve; scoped whitespace checks pass.
- **Preserved work:** The existing user edit in `docs/aws-data-eng-associate.md` remains untouched and excluded from the commit.
- **Commit:** `feat: add first-use AWS explorer tutorial`.

## 2026-10-14 - Planned data contracts case study

- **Branch:** `feature/data-contracts-case-study`.
- **Goal:** Explain how contracts and monitoring can prevent and surface source changes that affect data pipelines.
- **Changed files:** `case-studies/data-contracts-monitoring.html`, `index.html`, `design/DESIGN.md`, `ai-session.md`.
- **Changes:** Added a proposed-project case study that distinguishes approved expectations from observed schema snapshots, compares the live schema with both, traces downstream impact to responsible owners, and covers freshness, quality, brownfield onboarding, alert context and human review. Added a balanced full-width concept card with a compact four-step flow. Marked the Git repository and implementation as future work; selected no stack and claimed no measured outcomes. Linked standards and tools as references to evaluate, not dependencies.
- **Verification:** Existing site-navigation browser checks pass on the homepage and case-study page at 1440x1000 and 375x812 (9/10/13/14 assertions), with no horizontal overflow. The concept link has visible keyboard focus and opens with Enter; mobile navigation opens/closes with Enter/Escape and restores focus. Desktop and mobile layouts inspected. 34 local page, asset and documentation paths return HTTP 200 and local fragments resolve. HTML ID/encoding checks and scoped `git diff --check` pass. No page errors; the existing Tailwind CDN emits its production-use warning.
- **Preserved work:** The existing user edit in `docs/aws-data-eng-associate.md` remains untouched and excluded from the commit.
- **Commit:** `feat: document data contract monitoring concept`.

## 2026-10-13 - Vertical internet/NAT gateway diagram

- **Branch:** `feature/frontend-design-review`.
- **Goal:** Correct the Internet Gateway & NAT Gateways schematic to the user's requested vertical topology and dashed Availability Zone container.
- **Changed files:** `assets/js/aws-study-visuals.js`, `assets/js/aws-study-guide.js`, `assets/css/aws-study-guide.css`, `tests/aws-study-guide.test.js`, `tests/aws-study-guide-browser.js`, `README.md`, `ai-session.md`.
- **Changes:** Replaced the horizontal chain with WWW first, WWW ↔ IGW, IGW ↔ Public Subnet, IGW ↔ NAT and Private Subnet → NAT. The dashed AZ contains both subnets and NAT; WWW and IGW remain above/outside it. Added opt-in fixed vertical positions, group rendering, explicit link attachment points and bidirectional arrowheads/text alternatives. The vertical canvas reserves room for the library attribution on mobile. Existing diagrams retain their default layout. Documented authoring fields in README.
- **Factual review:** Caption retains outbound-initiation and return-traffic qualifications, including placement of a public NAT gateway in a public subnet, checked against [AWS NAT gateway documentation](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) and [AWS internet gateway documentation](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html). Renderer APIs checked against official GoJS group, layout, link and spot documentation.
- **Verification:** All 22 Node tests and changed JavaScript syntax checks pass. Chrome study checks pass 203 assertions each at 1440x1000 and 375x812, including actual vertical positions, dashed group bounds, excluded nodes, all arrow directions, zoom/fit and blocked-library text fallback. Desktop/mobile screenshots inspected; WWW clears the attribution area. Real Enter activates zoom, fit and the text disclosure with visible focus. No horizontal overflow or browser runtime errors. All 33 referenced local paths return HTTP 200 and fragment targets exist; scoped whitespace checks pass.
- **Preserved work:** Existing user changes in `docs/aws-data-eng-associate.md` remain untouched and excluded. No new dependencies, source-note edits, homepage changes or Explorer changes.
- **Commit:** `fix: correct vertical internet and NAT gateway diagram`.

## 2026-10-13 - Remove repeated flat-list slide notes

- **Branch:** `feature/frontend-design-review`.
- **Goal:** Remove card-text repetition from Detailed notes on SNS + SQS: Fan Out.
- **Changed files:** `assets/js/aws-study-guide.js`, `tests/aws-study-guide.test.js`, `tests/aws-study-guide-browser.js`, `ai-session.md`.
- **Changes:** Flat lists now put only points beyond the four-point card summary into Detailed notes. Page 521 retains its four visible points and shows only the additional destination-queue policy below. Nested outlines retain their parent context; source notes and diagrams remain unchanged. Added regression checks for page 521 and flat lists that fit entirely on the card.
- **Verification:** The new regression failed before the fix (five repeated detail points instead of one) and passes afterward. All 21 Node tests and changed JavaScript syntax checks pass. Chrome study checks pass 183 assertions each at 1440x1000 and 375x812. Real Enter opens Detailed notes with visible focus; both sizes show the single additional point without horizontal overflow or runtime errors. Desktop/mobile screenshots inspected. All 33 referenced local paths return HTTP 200 and fragment targets exist; scoped whitespace checks pass.
- **Preserved work:** Working tree was clean at the start. No source content, layout, service data, homepage or unrelated files changed.
- **Commit:** `fix: avoid repeated flat-list study details`.

## 2026-10-13 - Limit the homepage rollback to its hero

- **Branch:** `feature/frontend-design-review`.
- **Goal:** Correct the previous rollback so only the first-screen hero comes from `feature/merged-aws-study-notes`; retain everything else from the frontend design review.
- **Changed files:** `index.html`, `assets/css/portfolio.css`, `design/DESIGN.md`, `docs/frontend-design-review.md`, `ai-session.md`.
- **Changes:** Composed the homepage from design-review commit `eabdba6`, replacing only its first section with the original hero. Restored the complete reviewed portfolio stylesheet, featured five-project grid, footer contrast/44px links, icon-font subset and 80px fixed-header clearance. Updated the design specification and audit note to describe the hero-only exception. The generated hero image remains unused.
- **Verification:** Source comparison confirms the hero exactly matches the older branch and every surrounding homepage byte and the portfolio stylesheet match `eabdba6`. Chrome navigation/layout checks pass at 1440x1000 (9 assertions) and 375x812 (13), with zero horizontal overflow and no runtime errors. Confirmed five cards, full-width featured project, responsive two/one-column grid, footer color `#aebad3`, 44px footer targets and the icon subset. Hero/project screenshots inspected at both sizes. Real Enter activates View Case Studies; mobile Enter/Escape opens/closes navigation and restores focus. All 33 referenced local paths return HTTP 200 and local fragment targets exist. Scoped whitespace checks pass.
- **Preserved work:** Case-study pages, shared styles, AWS study deck, Explorer, visual models and data remain identical to the frontend design review. Current user edits in `docs/aws-data-eng-associate.md` remain untouched and excluded.
- **Commit:** `fix: limit homepage rollback to the hero section`.

## 2026-10-13 - Restore the previous homepage

- **Branch:** `feature/frontend-design-review`.
- **Goal:** Restore the home screen from `feature/merged-aws-study-notes` while retaining the case-study, AWS study-deck and Explorer refinements.
- **Changed files:** `index.html`, `assets/css/portfolio.css` (removed), `design/DESIGN.md`, `docs/frontend-design-review.md`, `ai-session.md`.
- **Changes:** Restored `index.html` exactly from the requested branch, including its hero, illustrative terminal, original project grid, footer and icon-font request. Removed the unused homepage stylesheet. Updated the canonical design specification and marked the earlier homepage audit/measurements as historical. Retained the unused generated image for its existing audit record.
- **Verification:** The restored homepage has no diff against `feature/merged-aws-study-notes`. Chrome homepage navigation/layout checks pass at 1440x1000 (9 assertions) and 375x812 (13 assertions), with zero horizontal overflow and no runtime errors. Desktop/mobile screenshots inspected; real Tab shows visible header focus, and mobile Enter/Escape opens/closes the menu with focus restoration. All 32 referenced local page/asset/documentation paths return HTTP 200 and fragment targets exist. New documentation passes whitespace checks; the restored HTML intentionally retains its source branch's existing trailing space.
- **Preserved work:** Current user edits in `docs/aws-data-eng-associate.md` remain untouched and excluded. Shared focus, reduced-motion and menu improvements remain, together with all case-study and AWS-tool changes.
- **Commit:** `revert: restore homepage from merged AWS study branch`.

## 2026-10-13 - Frontend design review and canonical specification

- **Branch:** `feature/frontend-design-review`.
- **Goal:** Apply gpt-taste and design-taste-frontend to review/fix the frontend, then use stitch-design-taste to generate the design specification.
- **Changed files:** `index.html`, all five `case-studies/*.html` pages, `aws-study-guide/explorer.html`, `aws-study-guide/service-explorer.html`, `assets/css/styles.css`, `assets/css/portfolio.css`, `assets/css/case-studies.css`, `assets/css/aws-study-guide.css`, `assets/css/aws-service-explorer.css`, `assets/css/aws-explorer-landing.css`, `assets/js/aws-study-guide.js`, `assets/images/infrastructure-editorial.webp`, `tests/site-navigation-browser.js`, `design/DESIGN.md`, `docs/frontend-design-review.md`, `README.md`, `ai-session.md`.
- **Changes:** Shortened the homepage hero and added a generated editorial infrastructure image; arranged five projects without an empty grid cell; corrected mobile article overflow and keyboard code scrolling; improved study hierarchy and small-diagram placement while keeping larger graphs full width; enlarged notebook copy and visible tool labels; corrected initial focus, footer contrast, preference fallbacks and short-viewport menu scrolling. Subset the existing icon font to 52 symbols across six pages. Rewrote the existing canonical design document using the seven-section Stitch format and documented skill adaptations to the established fonts, palette and static stack.
- **Verification:** All 20 Node tests and changed JavaScript syntax checks pass. Chrome shared-navigation/layout checks pass across nine pages at 1440x1000 (92 assertions), 375x812 (128) and 320x812 (128), with zero horizontal page overflow. Study checks pass 177 assertions at desktop/mobile; Explorer checks pass 24 plus 25 notebook assertions at each width. Real Tab, Enter, O and code ArrowRight behavior passed with visible focus; Start Explorer loads all 75 services. Notebook tracks remain 480px at 1050/1100px and 720px at 1920px. Emulated reduced motion disables card transitions. Screenshots reviewed for hero, project grid, simple/complex diagrams, case-study code, Explorer entry and notebook. All 34 local paths return HTTP 200 and local fragment targets exist; scoped whitespace checks pass.
- **Measurements:** Local mobile Lighthouse homepage accessibility 100 and performance 77, FCP 3.6s, LCP 4.1s, CLS 0 and blocking time 0ms. Icon transfer fell from 1,137,571 to 21,683 bytes. These are lab checks, not field measurements; existing runtime Tailwind/external fonts remain a loading limitation. The review records the generated image's exact prompt, mode, asset path and illustrative status.
- **Preserved work:** Started from a clean tree. Concurrent user edits to `docs/aws-data-eng-associate.md` remain untouched and excluded. Diagram models, Explorer behavior/data and source notes were not edited by this task. No new website dependencies or build tooling. Temporary audit files are excluded.
- **Commit:** `style: refine frontend layouts and document design system`.

## 2026-10-13 - Merged AWS notes and expandable topic sections

- **Branch:** `feature/merged-aws-study-notes`.
- **Goal:** Consolidate the personal notes into a study guide, remove introductory study guidance, and organize the right-side topics into expandable section sublists without page prefixes.
- **Changed files:** `docs/aws-data-eng-associate.md`, `docs/aws-study-source-coverage.json`, `docs/aws-study-review.md`, `assets/js/aws-study-guide.js`, `assets/css/aws-study-guide.css`, `aws-study-guide.html`, `tests/aws-study-guide.test.js`, `tests/aws-study-guide-browser.js`, `tests/site-navigation-browser.js`, `README.md`, `ai-session.md`.
- **Content:** Integrated all 174 original headings into their relevant subject sections, including the indented AWS BATCH heading. Merged overlapping topics with rewritten takeaways and retained practical examples, DQDL, SQL and review questions. Labeled unfinished headings as prompts. Removed Study approach, Course orientation and How to use this study guide from the presentation. The single sequence has 738 topics in 15 sections, including 724 source-page topics and original prompts; all 329 source diagrams remain mapped. The 765-page coverage index now records 37 context pages and four non-study pages.
- **References:** Resolved conflicting S3 namespace, DynamoDB PartiQL/change-capture, Lambda timeout/retry and RDS tuning claims against linked primary AWS documentation. Retained source-specific technical details and distinguished hard limits from performance guidance. Other dated course figures retain their study-snapshot qualification.
- **Menu:** Added native section disclosures with nested title-only topic buttons, compact rows and visible keyboard focus. Search opens matching groups and restores expansion choices when cleared. Navigation opens the selected group; direct topic links and original review-prompt links work. Removed collection selection and the opening orientation slide. Retained the visible 44px sidebar arrow and reduced-motion support.
- **Verification:** All 20 Node tests and production/test JavaScript syntax checks pass. Chrome at 1440x1000 and 375x812 passed 177 study-deck assertions each, covering grouped topics, search restoration, page navigation, diagrams, zoom/fit, text alternatives, code/tables, original DQDL, unfinished prompts and library fallback. Shared-navigation checks passed at both widths (15 desktop / 19 mobile). Real Enter/Space expansion and collapse, Tab skipping collapsed children, and arrow-key focus behavior passed with visible focus. Inspected expanded/collapsed desktop and full mobile screenshots; no study-deck horizontal overflow or browser runtime errors. All 29 local page/asset/documentation paths return HTTP 200 and fragment targets exist. Scoped whitespace checks pass.
- **Preserved work:** Working tree was clean before this task. No unrelated files or diagram models changed; extraction files and temporary authoring tools remain excluded. No new website dependencies.
- **Commit:** `feat: merge AWS study notes and group topics by section`.

## 2026-10-13 - AWS study material

- **Goal:** Organize and interpret AWS study material, then optimize the notes and presentation.
- **Changed files:** `docs/aws-data-eng-associate.md`, `docs/aws-study-source-coverage.json`, `docs/aws-study-review.md`, `assets/js/aws-study-visuals.js`, `assets/js/aws-study-guide.js`, `assets/css/aws-study-guide.css`, `assets/js/main.js`, `aws-study-guide.html`, `tests/aws-study-guide.test.js`, `tests/aws-study-guide-browser.js`, `README.md`, `ai-session.md`.
- **Coverage:** Rendered and visually reviewed all 765 requested pages, with targeted full-page checks of diagrams and image-only code/tables. Added 730 page-linked study topics and 329 semantic schematics; recorded 31 dividers and four non-study pages in a complete coverage index. Pages 766-780 remain outside scope. SQL screenshots became readable queries; comparisons became semantic tables. Added dated qualifications, primary-source links for selected corrections and explicit unfinished-topic prompts.
- **Presentation:** Added topic search and direct topic links. Main slides show at most four points, with short summaries of category-only labels; complete outlines, examples and tables expand below. Diagrams have text equivalents, keyboard zoom/fit and a blocked-CDN fallback; structural links omit flow arrowheads. Corrected mobile slide scrolling and shared-header highlighting for fragment links. No new website dependencies or build tooling.
- **Preserved work:** All 173 pre-existing heading lines and their complete bodies remain in Personal working notes. Compared the appended original content with the pre-edit backup. Its existing trailing whitespace remains intentionally untouched; all newly authored note lines and the other changed files pass whitespace checks.
- **Verification:** All 19 Node tests pass; changed production/test scripts pass syntax checks. Chrome at 1440x1000 and 375x812 passed 146 study-deck assertions each, including corrected source models, page search, collection switching, zoom, text alternatives, safe code/tables and library fallback. Shared-navigation checks pass across all nine pages at both widths, including study-page and homepage fragment highlighting. Real Enter activation of diagram text, zoom and detailed code passed with visible focus. Explicit reduced-motion emulation disabled diagram animation and reduced CSS animation. Desktop/mobile screenshots inspected; no study-deck horizontal overflow or runtime errors. All 29 local page, asset and documentation HTTP checks returned 200; local fragment targets exist.
- **Boundaries:** The notes contain dated examples alongside selected verified corrections; they are not a fully current AWS reference or official exam blueprint. The existing lakehouse and AI pair-programming case-study body overflows remain unchanged (210px/75px at 375px); shared headers fit. Rendered materials and temporary extraction tools are excluded from the commit.
- **Commit:** study deck expansion (original commit recorded in Git history).

## 2026-10-08 - AWS Explorer hero landing page

- **Branch:** `feature/aws-explorer-landing`.
- **Goal:** Introduce the AWS Explorer with a large headline, hero background and Start Explorer entry button.
- **Changed files:** `aws-study-guide/explorer.html`, `assets/css/aws-explorer-landing.css`, `assets/images/aws-explorer-hero.svg`, `assets/js/main.js`, `index.html`, `aws-study-guide.html`, `aws-study-guide/service-explorer.html`, all five `case-studies/*.html` pages, `tests/aws-explorer.test.js`, `README.md`, `docs/aws-service-explorer.md`, `ai-session.md`.
- **Changes:** Added a full-height navy hero with oversized typography, a decorative static infrastructure schematic and a single Start Explorer link styled as the primary button. Shared menus now open the landing page; the existing tool address remains available directly. The Service Explorer menu remains active inside the tool. The landing page loads only shared navigation JavaScript and works without JavaScript; the explorer data and map load after entry. No new dependencies or AWS factual claims were added.
- **Verification:** All 11 Node tests and shared JavaScript syntax checks pass. Chrome navigation checks passed on the landing page at 1440x1000 (9 checks) and 375x812 (13 checks), and on the tool at 375px (13 checks). Desktop/mobile screenshots inspected; no hero or header overflow. Start Explorer activated with real Enter at both widths, with a visible focus outline and 56px target. A fresh desktop tool session rendered all 75 service cards and opened the S3 notebook; no runtime errors reported. All local assets/links and two landing menu destinations per page resolve across all nine pages. Scoped diff checks passed.
- **Verification limitation:** The optional full explorer interaction sweep lost the browser daemon connection; focused entry, navigation, card-count and notebook checks passed in a fresh session. Explorer rendering and interaction code were unchanged.
- **Preserved work:** User edits in `docs/aws-data-eng-associate.md` remain untouched and excluded from the commit. The earlier PR scope clarification remains pending.
- **Commit:** `feat: add AWS Explorer hero landing page`.

## 2026-10-08 - Shared navigation and compact study topics

- **Branch:** `feature/consistent-site-navigation`.
- **Goal:** Normalize navigation across the portfolio, case studies, study deck and explorer; simplify the study topic list and prevent clipping of its show/hide arrow.
- **Changed files:** `index.html`, `aws-study-guide.html`, `aws-study-guide/service-explorer.html`, all five `case-studies/*.html` pages, `assets/css/styles.css`, `assets/css/aws-study-guide.css`, `assets/css/aws-service-explorer.css`, `assets/js/main.js`, `assets/js/aws-study-guide.js`, `tests/site-navigation-browser.js`, `ai-session.md`.
- **Changes:** Added one shared header design and menu order across all eight pages, with root-relative destinations, current-page indicators, visible keyboard focus and accessible mobile toggles. Mobile navigation closes on Escape, outside click and desktop resize. Study topics now contain only section and title in tighter rows; the entire 44px sidebar arrow sits inside its stage with dedicated space. Header keyboard actions preserve the study sidebar state. No dependencies or source notes changed.
- **Verification:** JavaScript syntax checks and all 11 Node explorer tests pass. Chrome navigation checks passed on all eight pages at 1440x1000 and 375x812, plus the explorer at the 1100px menu breakpoint. Study checks verified compact rows, correct slide navigation, 44px targets and the unclipped arrow in both sidebar states. Real Enter/Escape actions and visible focus passed. All 24 existing explorer browser checks passed, including all 75 service cards. Desktop/mobile screenshots inspected and all local header/asset links resolved. Scoped staged diff checks passed.
- **Existing limitation:** The lakehouse and AI pair-programming case-study bodies overflow horizontally by 210px and 75px at 375px. Identical overflow was reproduced using their committed versions before this change; all shared headers fit within the viewport.
- **Preserved work:** User edits in `docs/aws-data-eng-associate.md` remain untouched and excluded from the commit.
- **Pull request:** Publishing to main remains pending the earlier prerequisite-commit scope clarification; no branch has been pushed and no PR created.
- **Commit:** `feat: unify site navigation and compact study topics`.

## 2026-10-08 — Prepared pull request to main; scope pending

- **Branch:** `feature/aws-explorer-embedded-notebook`.
- **Goal:** Open a pull request to `main` for the latest notebook-width change (`8f912bb`).
- **Changed files:** `ai-session.md`.
- **Findings:** Fetched `origin/main`; it does not contain the study guide or explorer. The feature branch is 11 implementation commits ahead, with 23 changed files. The latest sizing commit modifies a stylesheet introduced by those earlier commits and cannot function independently on main.
- **Preparation:** Verified GitHub API access through the existing Git credential manager without exposing credentials, found no open pull requests, verified branch push access with `git push --dry-run`, and prepared the full prerequisite PR description in ignored temporary storage.
- **Pending:** Asked whether the PR should include the required earlier commits or be a draft limited to the latest commit. No branch was published and no pull request was created while that scope question remained unanswered.
- **Preserved work:** User edits in `docs/aws-data-eng-associate.md` remain untouched and excluded.
- **Commit:** `docs: record pending main pull request scope`.

## 2026-10-08 — Expanded notebook on large screens

- **Branch:** `feature/aws-explorer-embedded-notebook`.
- **Goal:** Increase notebook width further at screen widths of 1050px and above.
- **Changed files:** `assets/css/aws-service-explorer.css`, `ai-session.md`.
- **Changes:** Increased the desktop notebook column to `clamp(480px, 42vw, 720px)` and moved the intermediate breakpoint to 1049px so the larger sizing starts at exactly 1050px.
- **Verification:** Chrome layout checks passed at 1049, 1050, 1440, 1920 and 375px, with no horizontal overflow or notebook/map overlap. Notebook widths measured 464px at 1050px, 589px at 1440px and 704px at 1920px. Inspected screenshots at 1050 and 1920px. Real Enter activation expanded full notes with visible focus; no browser runtime errors. Scoped staged `git diff --check` passed.
- **Preserved work:** Existing user edits in `docs/aws-data-eng-associate.md` remain untouched and excluded from the commit.
- **Commit:** `style: expand notebook on large screens`.

## 2026-10-08 — Wider notebook and all relationships by default

- **Branch:** `feature/aws-explorer-embedded-notebook`.
- **Goal:** Increase notebook reading space on desktop and show all relevant relationships before the optional suggested mode.
- **Changed files:** `assets/css/aws-service-explorer.css`, `assets/js/aws-service-explorer.js`, `aws-study-guide/service-explorer.html`, `tests/aws-explorer-notebook-browser.js`, `docs/aws-service-explorer.md`, `ai-session.md`.
- **Changes:** Widened the desktop notebook column to a responsive 380–520px, with 360px at intermediate widths and the existing mobile dock. Added All relationships as the default selector option before Suggested relationship and individual matches. All mode renders every relevant whole-selection/subset junction; Suggested focuses one. Large maps open at a readable scale for panning, with Fit view available for the overview; dense views retain junction labels without crowded spoke numbers. Clear selection restores All mode.
- **Verification:** All 11 Node tests and changed JavaScript syntax checks pass. Chrome at 1440×1000 and 375×1000 passed 25 notebook/mode/layout checks and 24 existing interaction checks at each width, including all 75 service cards and all 63 relationship cards/previews. Verified restoring all junctions after suggested mode, selector order, whole/subset coverage, desktop width and mobile docking. Inspected desktop and 375×812 mobile screenshots; desktop notebook measured approximately 474px versus the previous 324px. Real Home/ArrowDown switching between All and Suggested passed with visible focus. No browser runtime errors or horizontal overflow; local explorer HTTP returned 200. Scoped staged `git diff --check` passed.
- **Preserved work:** User edits in `docs/aws-data-eng-associate.md` remain untouched and excluded from the commit.
- **Commit:** `feat: widen notebook and show all AWS relationships by default`.

## 2026-10-08 — Simplified explorer with embedded notebook

- **Branch:** `feature/aws-explorer-embedded-notebook`.
- **Goal:** Simplify the explorer into one map workspace and embed a contextual notebook with full notes available on demand.
- **Changed files:** `aws-study-guide/service-explorer.html`, `assets/css/aws-service-explorer.css`, `assets/js/aws-service-explorer.js`, `docs/aws-service-explorer.md`, `tests/aws-explorer-browser.js`, `tests/aws-explorer-relationships-browser.js`, `tests/aws-explorer-notebook-browser.js`, `ai-session.md`.
- **Changes:** Replaced the large introduction and separate notebook column with a compact heading, search/filter toolbar, collapsible service picker and an embedded notebook card. Search/filter changes open the picker; active filter counts stay visible. Service cards lead with description and selection guidance; connection cards lead with one relationship, explicit flows and tradeoffs. More details retains complete notes, recall, all/subset matches and sources. The map suggests one relationship at a time and the selector updates its preview. The notebook reserves space on desktop and docks below the canvas on mobile. Optional examples, map settings and provenance start collapsed. Picker navigation explicitly opens and focuses its disclosure; notebook keys remain independent of map controls. No dependencies or study data were changed.
- **Verification:** All 11 Node tests and changed JavaScript syntax checks pass. Chrome at 1440×1000 and 375×1000 passed all 24 interaction/layout assertions, all 75 service cards, and all 63 relationship cards/previews. Final notebook checks passed 20 assertions at 1440×1000 and 21 at 375×812, covering initial disclosure state, selection resets, one-relationship display, preview synchronization, filter indicators, reserved map space and picker focus. Desktop and mobile screenshots inspected; mobile graph readability improved by reducing simultaneous junctions. Real Tab/Enter service selection and full-notes disclosure passed with visible focus. Actual notebook picker navigation and study-deck navigation passed; IDs remained unique; browser reported no runtime errors. All five local page/asset/documentation HTTP checks returned 200. Scoped staged `git diff --check` passed.
- **Preserved work:** User changes in `docs/aws-data-eng-associate.md` remain untouched and excluded from the commit.
- **Commit:** `feat: simplify AWS explorer with embedded notebook`.

## 2026-10-08 — Service-first explorer layout

- **Branch:** `feature/aws-service-explorer`.
- **Goal:** Give available services more focus, place the system map next, and group search and related tools below the diagram.
- **Changed files:** `aws-study-guide/service-explorer.html`, `assets/css/aws-service-explorer.css`, `docs/aws-service-explorer.md`, `ai-session.md`.
- **Changes:** Moved the service picker to a highlighted first panel with a larger heading; tightened the introduction; placed the map directly after the list; grouped search, filters, zoom, relationship selection and examples below it. Added keyboard-accessible jump links between the picker and search tools and corrected map/notebook direction labels. Retained the desktop notebook and mobile stacking.
- **Verification:** All 11 Node tests pass using `node --test --test-isolation=none tests/aws-explorer.test.js`. Chrome checks at 1440×1000 and 375×812 passed all 24 existing interaction/layout assertions at each width, including all 75 service cards. Verified rendered list → map → tools order, unique IDs, valid jump-link targets, real Tab/Enter service selection, visible keyboard focus and search-jump focus. Inspected desktop and mobile screenshots, including the lower tools panel; no browser runtime errors or horizontal overflow. Local explorer HTTP returned 200; scoped staged `git diff --check` passed.
- **Preserved work:** Existing user changes in `docs/aws-data-eng-associate.md` remain untouched and excluded from this commit.
- **Commit:** `style: prioritize available services in AWS explorer`.

## 2026-10-08 — AWS service relationship explorer

- **Branch:** `feature/aws-service-explorer`.
- **Goal:** Build and fully validate a source-backed child page of the AWS DE-01 Guide for DEA-C01 service selection, flashcards and documented relationships.
- **Changed files:** `.gitignore`, `README.md`, `ai-session.md`, `aws-study-guide.html`, `aws-study-guide/service-explorer.html`, `assets/css/aws-study-guide.css`, `assets/css/aws-service-explorer.css`, `assets/js/aws-explorer-data.js`, `assets/js/aws-explorer-core.js`, `assets/js/aws-explorer-sources.js`, `assets/js/aws-service-explorer.js`, `docs/aws-explorer-source-audit.json`, `docs/aws-service-explorer.md`, `scripts/verify-aws-explorer-sources.py`, `tests/aws-explorer.test.js`, `tests/aws-explorer-browser.js`, `tests/aws-explorer-relationships-browser.js`.
- **Coverage:** Retrieved the official scope and four domain/task pages on 8 October 2026. Deduplicated 77 listed entries into 75 services/features, retaining aliases and both SageMaker categories. Added complete service cards and 63 documented features, integrations and architecture patterns, with directed flows, whole participant sets, prerequisites, tradeoffs, editorial task mappings and source dates. Both required Redshift examples distinguish Spectrum, COPY, UNLOAD and PostgreSQL/MySQL federation. Retained current availability notes for historical scope entries. Audited 148 substantive official documentation URLs, resolved moved links and verified exam task anchors.
- **Interactions:** Shared graph/list selection, multiple chips, individual removal, clear-all, name/alias/capability search, combined filters, zoom/pan/fit, focused neighborhoods, relationship focus, recall disclosures, honest all-selected/subset/empty results, keyboard controls, visible focus and responsive notebook navigation. The full map opens at a readable scale; relationship junctions preserve multi-service patterns. No runtime dependency or build tooling was added.
- **Verification:** All 11 Node built-in tests pass; all JavaScript syntax checks pass. Isolated Chrome checks at 1440×1000 and 375×812 exercised all 75 service cards, all 63 relationship cards and 24 interaction/layout assertions at each width. All relationship-card sweeps took approximately 1.3 seconds per viewport. Desktop/mobile screenshots inspected and connector routing improved. Real Enter activation and pointer dragging passed; keyboard focus remained visible; reduced motion was verified; study-deck navigation worked; browser reported no runtime errors. HTTP checks returned 200 for all 13 local pages/assets/documentation paths tested. Scoped staged `git diff --check` passed.
- **Preserved work:** Existing user edits in `docs/aws-data-eng-associate.md` were left untouched and excluded from the commit.
- **Boundaries:** AWS's scope is non-exhaustive. Relationships are curated exam-relevant coverage, not every theoretical combination; unsupported pairs remain explicit empty states. Browser checks do not constitute a full assistive-technology audit.
- **Commit:** `feat: add source-backed AWS service relationship explorer`.

## 2026-10-07 — AWS Data Engineer Associate study deck

- **Branch:** `feature/aws-data-engineer-study-guide`
- **Goal:** Create a vanilla HTML/CSS/JavaScript interactive reference deck from `docs/aws-data-eng-associate.md`.
- **Changes:** Added a Markdown-backed study deck, page-specific styling and interactions, repository guidance, and accurate project documentation. Linked the new deck from the portfolio navigation. The deck parses all 76 Markdown headings, preserves ordered/nested study notes, and marks source TODOs instead of inventing material.
- **Review:** Repository structure and source-document outlines were independently reviewed; a final deck review identified and resolved section-context, list-structure, and topic-map accessibility issues.
- **Verification:** `node --check assets/js/aws-study-guide.js`; static-server HTTP checks returned 200 for the deck, Markdown source, and script; `git diff --check` passed. A visual browser check could not run because no browser surface or `agent-browser` executable is available in this environment.
- **Commit:** `feat: add interactive AWS data engineer study deck`.

## 2026-10-07 — GoJS study visuals

- **Branch:** `feature/gojs-study-diagrams`
- **Goal:** Add a reusable image/diagram framework and a functional GoJS diagram example to the study deck.
- **Changes:** Added a title-keyed visual registry, an image example for Data Lakehouses, and a read-only GoJS DynamoDB Streams → Lambda processing diagram with pan, zoom, fit-to-view, reduced-motion support, lifecycle cleanup, and an accessible text equivalent/fallback.
- **Review:** Independent review identified and resolved keyboard conflict, accessible diagram fallback, and diagram initialisation-order issues.
- **Verification:** Both study scripts pass `node --check`; local HTTP checks returned 200 for the page, visual registry, and image asset; GoJS CDN is pinned to `4.0.5`. Browser rendering could not be exercised because this environment has no accessible browser surface or browser automation executable.
- **Commit:** `feat: add GoJS study visual framework`.

## 2026-10-07 — Study navigation sidebar

- **Branch:** `feature/study-deck-sidebar`
- **Goal:** Replace the full-screen topic map with a hideable lateral navigation menu containing slide-summary previews.
- **Changes:** Replaced the full-screen topic map with a left-side drawer opened from Topics. Each navigable slide now shows its section, title, and a two-line source-note summary; Close, Escape, and the overlay hide the drawer.
- **Verification:** `node --check assets/js/aws-study-guide.js`; local HTTP checks returned 200 for the deck, stylesheet, and script; scoped `git diff --check` passed. Browser rendering could not be exercised because this environment has no accessible browser surface or browser automation executable.
- **Commit:** `feat: add study navigation sidebar`.

## 2026-10-07 — Persistent study sidebar

- **Branch:** `feature/persistent-study-sidebar`
- **Goal:** Keep the study navigation in the same page, beside the slide, with a control to collapse it.
- **Changes:** Reworked the topic menu as an in-page sidebar. It is visible beside the slide on desktop and above it on narrow screens; Hide topics / Show topics collapses or restores it without an overlay or separate window.
- **Verification:** `node --check assets/js/aws-study-guide.js`; local HTTP checks returned 200 for the deck, stylesheet, and script; scoped `git diff --check` passed. Browser rendering could not be exercised because this environment has no accessible browser surface or browser automation executable.
- **Commit:** `feat: keep study navigation beside slides`.

## 2026-10-08 — Scrollable topic sidebar

- **Branch:** `feature/scrollable-topic-sidebar`
- **Goal:** Position the sidebar to the right of the slide, make its topic list independently scrollable, and move its show/hide control to the slide/sidebar boundary.
- **Changes:** Repositioned the topic menu as a right-side panel beside the slide, constrained its topic cards to an independent vertical scroll area, and moved the Hide topics / Show topics control to the divider between the slide and panel. The visual design remains consistent with the existing study deck.
- **Verification:** `node --check assets/js/aws-study-guide.js`; local HTTP checks returned 200 for the deck, stylesheet, and script; scoped `git diff --check` passed. Browser rendering could not be exercised because this environment has no accessible browser surface or browser automation executable.
- **Commit:** `feat: add scrollable topic sidebar`.

## 2026-10-08 — Larger slides and arrow toggle

- **Branch:** `feature/larger-slides-toggle-arrows`
- **Goal:** Increase the slide proportion and replace the topic-panel text control with directional arrows.
- **Changes:** Increased the primary slide area by reducing the sidebar width, enlarging the slide surface, and tightening outer stage spacing. Replaced Hide topics / Show topics with `>` / `<` controls and retained accessible labels.
- **Verification:** `node --check assets/js/aws-study-guide.js`; local HTTP checks returned 200 for the deck, stylesheet, and script; `git diff --check` passed. Browser rendering could not be exercised because this environment has no accessible browser surface or browser automation executable.
- **Commit:** `feat: enlarge study slides and use arrow toggle`.

## 2026-10-13 — Route 53 slide rewrite

- **Branch:** `feature/frontend-design-review`
- **Goal:** Make the DNS and Route 53 study slides clearer and easier to review.
- **Changes:** Rewrote DNS terminology and lookup slides, plus the Route 53 overview, record fields, record types, hosted zones, and public/private zones. Clarified A/AAAA, CNAME and apex Alias behavior, NS delegation, TTL, and split-view DNS; removed dated hosted-zone pricing and unrelated service trivia.
- **Verification:** 22 Node tests passed; 203 browser checks passed at 1440×1000 and 375×812; 33 local links returned HTTP 200; AWS claims checked against official Route 53 documentation; `git diff --check` passed.
- **Commit:** `docs: simplify Route 53 study slides`.
