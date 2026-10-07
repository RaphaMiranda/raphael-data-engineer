# Raphael Miranda — Data Engineer portfolio

A static portfolio for Raphael Miranda, with case studies and a focused AWS Certified Data Engineer – Associate study deck.

## Pages

- `/` — portfolio, professional timeline, skills, and case studies.
- `/case-studies/*.html` — individual project case studies.
- `/aws-study-guide.html` — interactive, keyboard-friendly study deck generated from the notes in `docs/aws-data-eng-associate.md`.

## Study deck

The AWS deck keeps the Markdown document as its source of truth. It turns every heading into a slide, retains unfinished source topics as prompts for future study, and supports Previous/Next controls, arrow keys, and a topic map (`O`). The notes are a personal study aid; validate exam-critical details against current AWS documentation.

### Visuals and diagrams

`assets/js/aws-study-visuals.js` is a title-keyed visual registry. Add an `image` entry for a root-relative image path, or a `diagram` entry with its node/link data. The first working GoJS example is attached to the **DynamoDB Streams** slide.

GoJS is loaded from a version-pinned CDN and is proprietary. Its current non-commercial terms allow personal learning use but retain a watermark; commercial or organisation use requires an appropriate GoJS licence. See the [GoJS deployment guidance](https://gojs.net/latest/learn/deployment).

## Local preview

This repository has no build step. Open the folder in VS Code with Live Server, or serve it from the repository root:

```powershell
npx serve .
```

Then open the local address printed by the server. Serving the folder is needed for the study deck to load its Markdown source.

## Conventions

- Plain HTML, CSS, and vanilla JavaScript only.
- Shared styles belong in `assets/css/styles.css`; shared behaviour belongs in `assets/js/main.js`.
- Page-specific code uses descriptive sibling files in `assets/css` and `assets/js`.
- Design guidance lives in [design/DESIGN.md](design/DESIGN.md); contributor guidance is in [AGENTS.md](AGENTS.md).

## Deployment

`vercel.json` configures clean static URLs for Vercel. Deploy the repository as a static site; no dependency installation or build command is required.
