# Raphael Miranda Mata — Data Engineer portfolio

A static portfolio for Raphael Miranda Mata, with case studies and a focused AWS Certified Data Engineer – Associate study deck.

## Pages

- `/` — portfolio, professional timeline, skills, and case studies.
- `/case-studies/*.html` — individual project case studies.
- `/aws-study-guide.html` — interactive, keyboard-friendly study deck generated from the notes in `docs/aws-data-eng-associate.md`.
- `/aws-study-guide/explorer.html` - explorer introduction with a hero and **Start Explorer** link into the workspace.
- `/aws-study-guide/service-explorer.html` — source-backed AWS service flashcards and an interactive relationship map. Covers 75 distinct entries from the retrieved DEA-C01 scope and 63 curated relationships. See [coverage and maintenance notes](docs/aws-service-explorer.md).

## Study deck

The AWS deck keeps the Markdown document as its source of truth. It groups personal notes into expandable topic sections, with keyboard navigation, searchable topics and diagrams. To add expandable notes, tables or code to a slide, place them under a heading one level below the slide title named `Detailed notes` (for example, `### Detailed notes` under a `##` slide). The notes are a personal study aid; validate exam-critical details against current AWS documentation.

### Visuals and diagrams

All study content, diagrams, image references and captions live in `docs/aws-data-eng-associate.md`. Add a fenced `mermaid` block beneath its topic heading, followed by a Markdown blockquote (`> Caption`) for its caption. The webpage renders these diagrams with its navy, cyan and periwinkle theme. Key Concepts uses a simple flowchart; VPC and gateway topologies use `architecture-beta` groups and services.

Use [flowcharts](https://mermaid.js.org/syntax/flowchart.html) when edge labels explain a sequence or relationship, and [architecture diagrams](https://mermaid.js.org/syntax/architecture.html) when service placement and containment are the main idea. Ordinary Markdown images (`![description](/assets/images/example.png)`) use the same caption convention. Keep extra notes under an explicit nested `Detailed notes` heading.

Mermaid is loaded from a version-pinned CDN. Diagrams have keyboard-accessible zoom and fit buttons, a focusable scroll region and a visible loading/error state. Large diagrams retain readable labels and can be scrolled inside the slide.

## Local preview

This repository has no build step. Open the folder in VS Code with Live Server, or serve it from the repository root:

```powershell
npx serve .
```

Then open the local address printed by the server. Serving the folder is needed for the study deck to load its Markdown source.

## Conventions

Explorer checks use Node's built-in runner: `node --test tests/aws-explorer.test.js`. Browser interaction checks and official-source verification are documented in [the explorer guide](docs/aws-service-explorer.md).

- Plain HTML, CSS, and vanilla JavaScript only.
- Shared styles belong in `assets/css/styles.css`; shared behaviour belongs in `assets/js/main.js`.
- Page-specific code uses descriptive sibling files in `assets/css` and `assets/js`.
- Design guidance lives in [design/DESIGN.md](design/DESIGN.md); contributor guidance is in [AGENTS.md](AGENTS.md).
- The [frontend design review](docs/frontend-design-review.md) records responsive fixes, skill adaptations, accessibility checks and measured loading limitations.

## Deployment

`vercel.json` configures clean static URLs for Vercel. Deploy the repository as a static site; no dependency installation or build command is required.
