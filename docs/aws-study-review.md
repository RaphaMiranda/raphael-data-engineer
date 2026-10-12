# PDF study-material review

Reviewed 13 October 2026. Source: **AWSCertifiedDataEngineerSlides.pdf**, by Stephane Maarek and Frank Kane; supplied PDF metadata dated 25 September 2026.

## Coverage and boundaries

- Physical pages **1–765 inclusive** were rendered and reviewed. Page 765 ends with API Gateway security. Pages 766–780 are outside this request.
- **730 study pages** have individually traceable notes. **31 divider pages** inform the topic/section organization. **Four non-study pages** contain copyright, logistics or biographies; their disposition is recorded rather than copied into study slides.
- **329 page-linked schematics** interpret architectures, relationships, conceptual drawings, comparison structures and workflow screens. Photographs, logos and decorative service icons are not technical diagrams. The two existing personal-note visuals remain available.
- [The coverage index](aws-study-source-coverage.json) records every requested page, its disposition and its visual key where applicable. It is an audit index, not an official exam-scope list.

## Writing and presentation decisions

The main sequence follows the course's progression: fundamentals, SQL/Git, storage, databases, migration, compute, containers, analytics, integration, security, networks, operations, ML, development, costs and API Gateway. Each topic has a takeaway, normalized reference points and a physical-page marker. Multi-line bullets were rejoined using text geometry so drawing labels do not become accidental prose.

The presentation shows at most four top-level points. Category-only labels such as “Characteristics” include the first two direct details as a useful summary. The complete nested outline, tables and code remain in **Detailed notes**. Search accepts a topic name or an exact physical page; addresses such as `/aws-study-guide.html#page-543` reopen the corresponding topic. This keeps reference completeness without showing an entire dense source slide at once.

All **173 pre-existing heading lines**, including repeated and unfinished headings, are preserved in the **Personal working notes** collection with their bodies. Keeping this collection separate avoids interrupting the course sequence with duplicate topics. Its older claims and rough writing remain personal working material; the dated source corrections take precedence.

The SQL screenshots are represented as readable queries and result semantics, not screenshots of text. Storage and queue comparisons use semantic tables. Console demonstrations become reproducible learning steps, with UI labels and numeric examples treated as a course snapshot. No PDF page images or PDF binary are required by the website.

## Diagram interpretation

The registry uses `pdf:<physical page>` keys, preventing repeated slide titles from selecting the wrong drawing. Directed edges describe a named data or control operation. Structural links omit arrowheads. Captions explain important omissions, alternatives and historical context rather than implying that every edge is a direct AWS integration.

Each diagram has a complete component/relationship text view, keyboard-operated zoom/fit buttons and a visible text fallback if the existing GoJS CDN cannot load. Graph models are copied before rendering so the library does not mutate the source registry.

## Corrections and unfinished source areas

Selected definitive corrections were checked against primary documentation and linked beside the relevant notes. These include SQL WHERE/HAVING order (53), S3 object-size context and supported lifecycle transitions (82/103), DynamoDB on-demand throttling (173), locking/MVCC (202–203), Redshift Serverless public connectivity (252), Lambda storage/runtime distinctions (297/306), S3 consistency (398), Kinesis record/consumer limits (409–410/425), QuickSight cross-Region connectivity (489), decimal versus floating-point precision (500), FIFO deduplication versus consumer retries (506), password hashing (548–549), KMS key operations (565), IAM role/temporary-credential use (700/740), and Well-Architected tradeoffs (664).

Historical/availability labels distinguish discontinued Kinesis SQL analytics (294/445–448), Snowball eligibility and its announced commercial-Region end of support (278), Ground Truth maintenance versus Ground Truth Plus end of support (678), and Kendra maintenance (738). These distinctions are dated; pricing, quotas, model catalogs and service availability elsewhere remain explicitly source-derived study snapshots, not a fully revalidated AWS reference.

Page 204 contains an RDS best-practices heading and icon with no guidance; it is labeled **unexpanded**. Pages 213 and 731 leave a vector-search alternative after “IVF or” unfinished; the missing alternative is identified rather than invented. Personal TODOs and incomplete headings remain prompts.

## Verification

Run the dependency-free checks from the repository root:

```powershell
node --test --test-isolation=none tests/aws-study-guide.test.js tests/aws-explorer.test.js
node --check assets/js/aws-study-guide.js
node --check assets/js/aws-study-visuals.js
```

The unit checks cover all 765 page dispositions, every diagram's endpoints and note mapping, original-heading preservation, repeated-title lookup, safe HTML, complete detail retention, screenshot-code/table parsing and selected source corrections.

With the static site served locally, [the browser check](../tests/aws-study-guide-browser.js) exercises search, direct page addresses, collection switching, real rendered GoJS models, zoom/fit controls, structural arrowheads, tables, SQL, unfinished topics and blocked-CDN fallback. Desktop and narrow-mobile verification also includes visible keyboard focus, real Enter activation and layout inspection. There are no new website dependencies or build steps.
