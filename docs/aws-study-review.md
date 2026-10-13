# PDF study-material review

Reviewed 13 October 2026. Source: **AWSCertifiedDataEngineerSlides.pdf**, by Stephane Maarek and Frank Kane; supplied PDF metadata dated 25 September 2026.

## Coverage and boundaries

- Physical pages **1–765 inclusive** were rendered and reviewed. Page 765 ends with API Gateway security. Pages 766–780 are outside this request.
- **724 study pages** have individually traceable notes in the merged guide. **37 context pages** comprise 31 dividers and six orientation pages removed from the study sequence at the user's request. **Four non-study pages** contain copyright, logistics or biographies; their disposition is recorded rather than copied into study slides.
- **329 page-linked schematics** interpret architectures, relationships, conceptual drawings, comparison structures and workflow screens. Photographs, logos and decorative service icons are not technical diagrams. The two existing personal-note visuals remain available.
- [The coverage index](aws-study-source-coverage.json) records every requested page, its disposition and its visual key where applicable. It is an audit index, not an official exam-scope list.

## Writing and presentation decisions

The guide combines the PDF and personal notes into one sequence across 15 subject sections. Matching topics share a rewritten takeaway and reference details; original examples and review questions appear alongside the relevant material. Technical identifiers, commands and code retain their meaning. The clinical-data example, DQDL rules and pipeline exercises remain available without a separate personal-note appendix. Multi-line source bullets were rejoined using text geometry so drawing labels do not become accidental prose.

The presentation opens directly at **Types of Data**, with no Study approach, Course orientation or How to use this study guide slides. Each slide shows at most four top-level points. Category-only labels include the first two direct details as a useful summary. The complete nested outline, tables and code remain in **Detailed notes**.

All **174 original headings**, including repeated and unfinished headings and the indented AWS BATCH heading, are retained within their matching subject sections. Their bodies are merged and paraphrased rather than appended verbatim. The coverage index maps each heading to its merged location. Unfinished Snowflake, Cardinality and unnamed database headings remain labeled review prompts; no missing explanations were invented.

The topic menu has native expandable section headings with nested, title-only topic rows. Repeated section names and `p. X` prefixes are absent from those rows. Search accepts a title, section name or exact physical page, expands matching groups and hides unrelated ones. Clearing search restores expansion choices; navigating to a topic opens its group. Collapsed groups remove their children from keyboard navigation. Addresses such as `/aws-study-guide.html#page-543` retain physical-page access; original review prompts use `#note-ID` addresses. There are **738 topics**, including original prompts, in the merged presentation.

The SQL screenshots are represented as readable queries and result semantics, not screenshots of text. Storage and queue comparisons use semantic tables. Console demonstrations become reproducible learning steps, with UI labels and numeric examples treated as a course snapshot. No PDF page images or PDF binary are required by the website.

## Diagram interpretation

The registry uses `pdf:<physical page>` keys, preventing repeated slide titles from selecting the wrong drawing. Directed edges describe a named data or control operation. Structural links omit arrowheads. Captions explain important omissions, alternatives and historical context rather than implying that every edge is a direct AWS integration.

Each diagram has a complete component/relationship text view, keyboard-operated zoom/fit buttons and a visible text fallback if the existing GoJS CDN cannot load. Graph models are copied before rendering so the library does not mutate the source registry.

## Corrections and unfinished source areas

Selected definitive corrections were checked against primary documentation and linked beside the relevant notes. These include SQL WHERE/HAVING order (53), S3 object-size context and supported lifecycle transitions (82/103), DynamoDB on-demand throttling (173), locking/MVCC (202–203), Redshift Serverless public connectivity (252), Lambda storage/runtime distinctions (297/306), S3 consistency (398), Kinesis record/consumer limits (409–410/425), QuickSight cross-Region connectivity (489), decimal versus floating-point precision (500), FIFO deduplication versus consumer retries (506), password hashing (548–549), KMS key operations (565), IAM role/temporary-credential use (700/740), and Well-Architected tradeoffs (664).

The merge also resolves conflicting claims about S3 shared-global/account-regional bucket namespaces (80), single-table/index DynamoDB PartiQL SELECT (180), DynamoDB Streams versus Kinesis Data Streams for DynamoDB (187), and Lambda timeout limits by capacity mode and invocation type (291/303). RDS bulk-load guidance (207) now explains the protection tradeoffs and restoration of normal settings; MySQL/MariaDB file limits are distinguished from performance recommendations. The applicable primary documentation is linked beside each topic.

Historical/availability labels distinguish discontinued Kinesis SQL analytics (294/445–448), Snowball eligibility and its announced commercial-Region end of support (278), Ground Truth maintenance versus Ground Truth Plus end of support (678), and Kendra maintenance (738). These distinctions are dated; pricing, quotas, model catalogs and service availability elsewhere remain explicitly source-derived study snapshots, not a fully revalidated AWS reference.

Page 204 contains an RDS best-practices heading and icon with no guidance; it is labeled **unexpanded**. Pages 213 and 731 leave a vector-search alternative after “IVF or” unfinished; the missing alternative is identified rather than invented. Personal TODOs and incomplete headings remain prompts.

## Verification

Run the dependency-free checks from the repository root:

```powershell
node --test --test-isolation=none tests/aws-study-guide.test.js tests/aws-explorer.test.js
node --check assets/js/aws-study-guide.js
node --check assets/js/aws-study-visuals.js
```

All **20 unit tests** pass. They cover all 765 page dispositions, every diagram's endpoints and note mapping, all original-heading locations, ordered section groups, search, repeated-title lookup, safe HTML, complete detail retention, screenshot-code/table parsing and selected source corrections.

With the static site served locally, [the browser check](../tests/aws-study-guide-browser.js) passes **177 assertions** at both 1440×1000 and 375×812. It exercises section expansion and collapse, search and expansion restoration, direct page addresses, real rendered GoJS models, zoom/fit controls, structural arrowheads, tables, SQL, the original DQDL example, unfinished topics and blocked-CDN fallback. Shared-navigation checks also pass at both widths, including sidebar arrow spacing. Real Enter, Space and Tab checks verify visible keyboard focus and that collapsed topic lists are skipped. Desktop/mobile screenshots have no horizontal study-deck overflow or runtime errors. All 29 local page, asset and documentation paths return HTTP 200, and local fragment targets exist. There are no new website dependencies or build steps.
