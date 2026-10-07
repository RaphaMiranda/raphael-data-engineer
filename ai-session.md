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
