# AI session log

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
