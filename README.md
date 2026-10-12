# Raphael Miranda — Data Engineer portfolio

A static portfolio for Raphael Miranda, with case studies and a focused AWS Certified Data Engineer – Associate study deck.

## Pages

- `/` — portfolio, professional timeline, skills, and case studies.
- `/case-studies/*.html` — individual project case studies.
- `/aws-study-guide.html` — interactive, keyboard-friendly study deck generated from the notes in `docs/aws-data-eng-associate.md`.
- `/aws-study-guide/explorer.html` - explorer introduction with a hero and **Start Explorer** link into the workspace.
- `/aws-study-guide/service-explorer.html` — source-backed AWS service flashcards and an interactive relationship map. Covers 75 distinct entries from the retrieved DEA-C01 scope and 63 curated relationships. See [coverage and maintenance notes](docs/aws-service-explorer.md).

## Study deck

The AWS deck keeps the Markdown document as its source of truth. The course collection covers the supplied PDF through physical page 765; the personal collection preserves the existing working notes and unfinished prompts. Search by topic or PDF page, use Previous/Next or arrow keys, and open the topic map with `O`. Slides show brief key points with expandable full notes, tables and code. The notes are a personal study aid; validate exam-critical details against current AWS documentation. See the [coverage and writing review](docs/aws-study-review.md).

### Visuals and diagrams

`assets/js/aws-study-visuals.js` contains 329 course schematics keyed by `pdf:<physical page>` plus the two existing title-keyed personal-note visuals. Match a source topic with `<!-- pdf-page: 543 -->` in Markdown. Add an `image` entry with a root-relative path or a `diagram` with node/link data. Set structural links' `relation` flag to omit data-flow arrowheads. Diagrams include readable text and keyboard zoom/fit controls; their text remains available when the canvas library cannot load.

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

## Deployment

`vercel.json` configures clean static URLs for Vercel. Deploy the repository as a static site; no dependency installation or build command is required.
