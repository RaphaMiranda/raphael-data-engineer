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

`assets/js/aws-study-visuals.js` contains study diagrams keyed by section and topic. Add an `image` entry with a root-relative path or a `diagram` with node/link data. Set structural links' `relation` flag to omit data-flow arrowheads. Diagrams include keyboard zoom/fit controls and a caption.

For an explicitly positioned vertical diagram, set `layout: "vertical"` and give each regular node a `loc: "x y"`. Define containers with `isGroup: true` and assign member nodes their container's key through `group`. A link's `bidirectional: true` adds a second arrowhead and a matching two-way text alternative. The Internet Gateway & NAT Gateways topic demonstrates these options.

GoJS is loaded from a version-pinned CDN and is proprietary. Its current non-commercial terms allow personal learning use but retain a watermark; commercial or organisation use requires an appropriate GoJS licence. See the [GoJS deployment guidance](https://gojs.net/latest/learn/deployment).

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
