# Verification: 2026-10-28

## PostgreSQL and API

- Imported the full checksummed handoff into a project-local native PostgreSQL 17 cluster.
- All 12 table row counts reconciled, including 272 participants, 539,376 phenotype responses, 2,720 scan-inventory rows and 803 task events.
- All seven backend tests passed, including real database tests; none were skipped.
- SELECTs, joins, aggregates, literals, CTEs and UNIONs passed parser checks.
- Writes, writable CTEs, row locking, multiple statements, side-effect functions, out-of-scope CTE references and unrelated catalogs were rejected.
- The read-only role was denied DELETE and DROP by PostgreSQL even after changing the session's default read-only setting.
- The API refused an owner connection.
- A real expensive cross join was canceled by PostgreSQL's 2.5-second statement timeout and surfaced as HTTP 408.
- Request-size, method and per-instance request-window checks passed; results were capped at 200 rows.
- Live introspection returned 17 tables/views, primary keys and typed foreign-key arrays.

## Browser

- Desktop 1440 x 1000 and mobile 375 x 812 checks passed.
- Real cohort counts returned CONTROL 130, SCHZ 50, BIPOLAR 49 and ADHD 43.
- All four examples ran against PostgreSQL: cohort, dimensional join, source lineage and completeness CTE.
- Table search, selected-table columns, relationship links, 50-row previews and Ctrl+Enter worked.
- Result strings containing HTML remained text.
- Rejected queries cleared stale results and displayed an error.
- Simulated API unavailability left the catalog browsable and disabled live query controls; reconnecting restored real queries.
- No page-level horizontal overflow; results/columns scroll inside their own regions.
- All 13 existing shared-navigation assertions passed on the mobile playground.
- Private build/configuration/server-source paths returned HTTP 404 from the local dev server.

## Migration

- Previous website sources, generated legacy PostgreSQL import and old site bundle were copied into build/ucla/migrated with SHA-256 verification before removal from the data project.
- The data project builds only the local model, quality profile and CSV handoff.
- Original dataset files remain in the data project; images are not loaded into PostgreSQL.
- Current frontend sources, runtime API, final PostgreSQL DDL, reader setup, importer and configuration live in this repository.

## Limits

No remote push or Vercel deployment was performed. The user-provided Neon project has now been loaded and its restricted reader verified as described below. The in-memory request quota is per function instance, not distributed. Docker could not start because the WSL kernel is missing; verification used native PostgreSQL binaries in the ignored build folder without changing WSL settings. Other browsers, image voxel integrity and clinical score validity were not evaluated.


## Hosted Neon verification: 2026-10-28

- The supplied DATABASE_URL initially used an elevated account. The API rejected it; a separate valid owner connection was present for the same fresh database.
- The initial import loaded all 12 raw/core tables and five analytical views, reconciling every table count.
- A new ucla_reader account was created with SELECT-only access and verified by the unchanged API permission checks.
- Hosted queries returned 272 participants, 539,376 phenotype responses and 15,219 source records. All 17 relations were introspected successfully.
- The hosted owner connection was rejected by the public API.
- The private .env.neon.local DATABASE_URL entry was updated to the restricted reader. Original private settings were backed up under ignored build/ucla; no secret values were printed or committed.
- The app now prefers DATABASE_READER_URL, followed by the legacy UCLA_DATABASE_URL and DATABASE_URL fallbacks. A regression test covers all three paths.
- All seven backend tests passed against the local PostgreSQL fixture. Separate hosted-reader queries and browser checks passed against Neon at 1440px and 375px.
- The Neon-backed local preview is available on port 8003. Vercel uses its DATABASE_READER_URL Secret set for Production/Preview and a new deployment.


## Reader setting rename: 2026-10-28

- DATABASE_READER_URL is the preferred runtime and exported-reader setting.
- Precedence is DATABASE_READER_URL, then UCLA_DATABASE_URL, then DATABASE_URL.
- The regression test verifies both legacy fallbacks, all three variables together, and the preferred variable alone.
- All seven backend tests passed. A separate hosted check using only DATABASE_READER_URL returned all 17 relations and 272 participants.
- Ignored local Neon reader files were aligned to the new key without changing credential values.
- Neon-backed desktop/mobile browser queries passed at 1440px and 375px.
- The user's Vercel setting was not read or changed; the committed code requires a new deployment to use it.


## Interview walkthrough verification: 2026-10-28

- All 10 UCLA tests passed with none skipped: three new ER-model tests and seven existing PostgreSQL/API tests.
- ER tests cover all nine core tables and nine declared relationships, nullable scanner references, composite PK/FK attributes, raw one-to-one/one-to-many lineage and focused fact ancestry.
- Desktop 1440 x 1000 and mobile 375 x 812 rendered all five views. Focused phenotype/scan/event views expose 4/4/3 relationships; complete core and raw expose 9/2.
- Fit, 100%, zoom, keyboard view selection, keyboard canvas scrolling, the relationship disclosure and numbered jump links passed. No page-level horizontal overflow.
- Sequential flow cards stack on mobile. Desktop/mobile screenshots were inspected, including diagram text contrast.
- Real Neon cohort queries returned four rows on desktop and mobile after navigating from the walkthrough.
- Simulated Mermaid and API failure opened the relationship-table fallback, retained all 17 catalog relations and the explanation, and disabled query execution.
- Five page/asset routes returned HTTP 200; IDs were unique; normal rendering reported no runtime JavaScript errors. The simulated failures produced the expected blocked-request errors.
- Changed JavaScript syntax and scoped Git whitespace checks passed. No schema, import, credential or database changes were needed.
- No remote push or Vercel deployment was performed. The separate user edit in index.html was preserved and excluded from the feature commit.
