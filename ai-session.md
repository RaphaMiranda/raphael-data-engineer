# AI session log

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
- **Goal:** Build and fully validate a source-backed child page of the AWS Study Guide for DEA-C01 service selection, flashcards and documented relationships.
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
