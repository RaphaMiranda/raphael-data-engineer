# Repository guidance

## Project shape

- This is a dependency-free, static portfolio. Keep new work to HTML, CSS, and vanilla JavaScript unless the user explicitly approves a change in tooling.
- Vercel serves the project as static files (`vercel.json`); use root-relative asset paths so pages work at every route.
- Follow the Architectural Precision system in [design/DESIGN.md](design/DESIGN.md): deep-navy surfaces, Space Grotesk/Inter/JetBrains Mono, generous spacing, tonal layers, and restrained cyan/green signals.

## Where changes belong

- Shared Tailwind tokens and fonts: `assets/js/tailwind.config.js`.
- Shared reusable styling: `assets/css/styles.css`.
- Shared cross-page behaviour: `assets/js/main.js`.
- Page-specific styles and scripts should use clearly named files in the same folders; do not add page-specific logic to global files unless several pages use it.
- The AWS study deck derives its content from `docs/aws-data-eng-associate.md`. Preserve every heading, including TODO or incomplete headings, and label unexpanded source areas instead of inventing notes.

## Quality bar

- Use semantic HTML, visible keyboard focus, real buttons for actions, and keyboard support for interactive features.
- Respect `prefers-reduced-motion`; motion must enhance, never be required to understand content.
- Check desktop and narrow mobile layouts, keyboard interactions, and local links before committing. A static server such as `npx serve .` or VS Code Live Server is sufficient.
- Treat personal notes as study material, not AWS documentation. Verify changed factual claims with an authoritative source before presenting them as definitive.

## Working agreement

- Inspect the working tree before edits; preserve unrelated user work.
- Major features belong on a dedicated feature branch. The user requires every chat to finish with a scoped commit.
- Update `ai-session.md` with the date, branch, changed files, verification, and commit after each chat.
