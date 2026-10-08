# AWS service relationship explorer

Open `/aws-study-guide/service-explorer.html` from **Service explorer** in the AWS study deck. Serve the repository root; there is no build step or runtime package dependency.

## Coverage and provenance

Scope retrieved **8 October 2026** from the [official DEA-C01 service list](https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/dea-01-in-scope-services.html), using the [documentation directory](https://aws.amazon.com/documentation-overview/) and the [exam guide](https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html) for discovery and exam task context.

- 77 listed entries become **75 distinct services/features**. SageMaker AI appears in Analytics and Machine Learning; both category memberships are retained. S3 Tables is listed twice in Storage and is represented once.
- **63 documented integrations, features and architecture patterns** cover batch/stream ingestion, transformations, storage, catalogs, orchestration, database migration/CDC, quality, monitoring, security, governance and cost/performance tradeoffs.
- Every service has a description, use cases, own components, technical characteristics, considerations, selection guidance, alternatives, a recall question/answer, exam tasks and official sources. Core data engineering services receive more detail; supporting services have concise cards.
- Historical scope names remain searchable: Kinesis Data Firehose → Amazon Data Firehose; MemoryDB for Redis → Amazon MemoryDB; QuickSight → Amazon Quick BI capabilities. CloudWatch Logs remains a distinct entry. Scope names are preserved in `scopeName`, independently from current display names.
- Current official documentation describes availability changes for Kendra, Q Business, Application Discovery Service and Snowball Edge. Cards retain their exam scope while flagging availability. Application Migration Service links to the current AWS Transform MGN guide.
- The scope list is **non-exhaustive and subject to change**. This page does not claim every possible exam topic or every service combination. Task mappings and “choose this when” guidance are editorial study guidance, not AWS endorsements.

## Learning interactions

The workspace leads with the available service list, followed by the system map. Service search, category/domain filters, relationship selection, zoom controls and example connections are grouped below the diagram. Jump links connect the picker and search tools; the study notebook stays beside the workspace on desktop and follows it on narrow screens.

Search accepts service names, aliases and capability terms. Category and exam-domain filters combine. List buttons and SVG nodes toggle the same working set. Chips remove one service; Clear all restores the starting state. Filter changes preserve selections and keep selected services on the map.

One selection opens its flashcard, including a native keyboard-accessible answer disclosure. Two or more selections show all-selected matches first, then a clearly labeled subset section. A match can require additional participants; each card identifies them and supporting prerequisites. Unverified combinations show an honest empty state.

The graph groups services by their primary AWS category. The full map opens at a readable scale for panning; Fit view provides the full overview. Once selected, it shows up to three relevant relationship junctions to limit clutter; the relationship dropdown can focus any recorded match. Narrow-screen relationships stack vertically. Multi-service relationships retain whole participant sets. Desktop spokes are numbered to match named junctions, with arrows indicating participant direction and dashed lines for control/metadata. Read the notebook for the exact service-to-service flow; a junction does not assert integration between every pair. Filters can hide unselected participants, while notebook cards always retain the full architecture.

Drag the background to pan; use toolbar controls or `+`/`-` to zoom, `0` to fit, and arrow keys to pan while the map is focused. Ctrl/Command + wheel zooms. Enter/Space selects a focused graph node. The accessible list offers equivalent selection without graph navigation. On small screens the notebook follows the map/list; **View notebook** jumps directly to it. There is no required motion, and reduced-motion preferences are respected.

## Required examples

**S3 + Redshift** includes Spectrum (read external files without loading warehouse tables), COPY (load warehouse tables), and UNLOAD (export query results). Further results identify staging-based Glue, DMS and Firehose integrations rather than implying direct paths.

**RDS + Redshift + S3** shows a composition of a federated external schema and a Spectrum external schema, with illustrative SQL. Federation supports RDS PostgreSQL/MySQL and Aurora PostgreSQL/MySQL-compatible editions at documented versions, with Secrets Manager credentials, IAM and database connectivity. S3 is required by the Spectrum branch, **not by federation**. The page distinguishes read-only remote queries, source load, file scans and deployment-specific Region constraints.

## Files and maintenance

- `assets/js/aws-explorer-data.js`: structured service records and relationships; separate from rendering. Each record declares tasks, source URLs and verification date. Relationship roles and directed flows retain hyperedges without manufacturing pairwise integrations. `kind` distinguishes features, integrations and composed architecture patterns.
- `assets/js/aws-explorer-core.js`: pure filtering, selection, neighborhood and all/subset matching.
- `assets/js/aws-service-explorer.js` and `assets/css/aws-service-explorer.css`: page interactions and styling.
- `docs/aws-explorer-source-audit.json`: source URLs, resolved URLs, HTTP status, page titles, retrieval timestamps, hashes and the retrieved scope entries. This is retrieval evidence; HTTP success alone does not establish claim accuracy.
- `assets/js/aws-explorer-sources.js`: generated official source titles for readable documentation links.
- `scripts/verify-aws-explorer-sources.py`: standard-library source retrieval/audit helper. It caches full source text in ignored `.tmp-aws-sources/` for human/agent review and fails on errors, short landing pages or redirects. No credentials are used.

When editing technical content, read the current relevant AWS page, correct redirecting links, review exact prerequisites and update verification dates. Re-run the source helper and inspect its cached documents. Avoid uncited numerical limits; if a limit is added, record its service, operating mode and context. Preserve the independent personal study notes and all incomplete deck headings.

## Verification

```powershell
node --test tests/aws-explorer.test.js
node --check assets/js/aws-service-explorer.js
python scripts/verify-aws-explorer-sources.py
python -m http.server 8765 --bind 127.0.0.1
```

The source helper requires internet access. Node tests use the checked-in retrieval snapshot and no network. They check exact deduplicated scope, card/data completeness, source retrieval evidence, valid role/flow references, all/subset matching, unsupported-pair behavior, selection/filter behavior and both required examples.

`tests/aws-explorer-browser.js` runs inside the rendered page and checks all 75 service cards plus 24 interaction/layout assertions. `tests/aws-explorer-relationships-browser.js` separately checks all 63 relationship cards and their complete roles. With the optional `agent-browser` testing CLI (kept outside project dependencies):

```powershell
agent-browser --session aws-explorer open http://127.0.0.1:8765/aws-study-guide/service-explorer.html
$checks = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path (Get-Location) 'tests/aws-explorer-browser.js')))
agent-browser --session aws-explorer eval -b $checks
$relationships = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path (Get-Location) 'tests/aws-explorer-relationships-browser.js')))
agent-browser --session aws-explorer eval -b $relationships
agent-browser --session aws-explorer set viewport 375 812
agent-browser --session aws-explorer eval -b $checks
agent-browser --session aws-explorer eval -b $relationships
agent-browser --session aws-explorer errors
agent-browser --session aws-explorer close
```

Also inspect screenshots at desktop and narrow widths, exercise real keyboard focus/activation and pointer pan, and check local navigation/HTTP assets. Browser assertions complement visual inspection; they do not claim a full assistive-technology audit.

## Deliberate coverage boundaries

Relationships are curated exam-relevant examples, not a universal integration registry. Some supporting scope services have cards but no relationship records; no result is presented as evidence of impossibility. The graph shows a readable subset of matches; every verified match remains available in the dropdown and notebook. No live AWS resources or paid APIs are called by the page. Exam weights describe the retrieved guide, not this dataset's distribution.
