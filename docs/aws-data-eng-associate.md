<!-- Unified personal study notes -->

Personal AWS data engineering study notes. Technical details that change over time should be checked against current AWS documentation.

# Section Fundamentals

<!-- original-note: 0 -->
<!-- section -->
## Future of Data Engineering

Over the next years, Data Engineering is increasingly less about simply "moving data" and more about building reliable data products and platforms.

One particularly useful way to think about the evolution is:

```
ETL developer → Data Engineer → Data Platform Engineer
```
where the emphasis shifts from individual pipelines toward:
```
reusable platforms, 
infrastructure as code, 
automated testing, 
CI/CD, 
data contracts, 
observability, 
self-service tooling 
and AI-ready data infrastructure.
```


## Data Engineering Lifecycle

Generation, storage, ingestion, transformation and serving are stages of the **Data Engineering lifecycle**.

```mermaid
flowchart LR
  accTitle: Key Concepts
  n0["Storage"]
  n1["Generation"]
  n2["Ingestion"]
  n3["Transformation"]
  n4["Serving"]
  n5["Consumption"]
  n1 --> n2
  n2 --> n0
  n2 --> n3
  n3 --> n0
  n3 --> n4
  n4 --> n0
  n4 --> n5
```
> with features as governance, security, observability, and data quality spanning the entire lifecycle.

## Key Concepts

| Area | Brief Definition |
|---|---|
| **Data Generation** | The creation of data by applications, users, devices, APIs, databases, logs, SaaS platforms, and business processes. |
| **Data Storage** | Persisting data reliably in systems such as databases, data lakes, warehouses, lakehouses, object storage, and streaming platforms. |
| **Data Ingestion** | Moving data from source systems into a data platform for storage, processing, or analysis. |
| **Data Integration** | Combining data from multiple heterogeneous sources into a consistent, usable representation across the organization. |
| **Data Transformation** | Cleaning, validating, enriching, joining, aggregating, and modelling raw data into business-ready datasets. |
| **Data Serving** | Making processed data available to consumers such as BI dashboards, analysts, applications, APIs, ML systems, and AI workloads. |

## Ingestion vs Integration

**Data ingestion** is primarily about movement: getting data from A to B.

**Data integration** is about unification: making data from different systems work together coherently.

```mermaid
architecture-beta
  group sources(cloud)[Source systems]
  service salesforce(server)[Salesforce] in sources
  service postgres(database)[PostgreSQL] in sources

  group platform(cloud)[Data platform]
  service lake(database)[Data lake] in platform
  service standardize(server)[Join and standardize] in platform
  service customer(database)[Unified customer model] in platform

  align column salesforce postgres
  align row lake standardize customer

  salesforce:R --> L:lake
  postgres:R --> L:lake
  lake:R --> L:standardize
  standardize:R --> L:customer
```

> For example, copying Salesforce, PostgreSQL into a data lake is ingestion. Joining and standardizing customer information from those sources into a unified customer model is integration.

## Ingestion Patterns

| Pattern | Definition |
|---|---|
| **Push Ingestion** | The source actively sends data to the destination when data or events become available. |
| **Pull Ingestion** | The data platform periodically requests or retrieves data from the source. |
| **Batch Ingestion** | Data is collected and processed in groups at scheduled or triggered intervals. |
| **Streaming Ingestion** | Data is continuously ingested as events occur, enabling low-latency processing. |
| **Micro-batch** | Small batches are processed frequently, providing a compromise between traditional batch and continuous streaming. |
| **CDC** | Change Data Capture captures inserts, updates and deletes from operational systems instead of repeatedly loading entire datasets. |

- You can have a mixture of ingestion patterns on real life scenarios. 

> For example, **pull + batch** ingestion from an API or **push + streaming** from an event-driven application.

## Modern Data Engineering Features 1/6

Use the list below as a reference, do not try to understand all at once. Some of these items reflect big concepts and will be detailed later. However others may not be in scope for this course and the exam.

- Reprocessing - The ability to re-run historical data through a pipeline when logic changes, bugs are fixed, or datasets need to be reconstructed. **"A well-designed platform assumes reprocessing will eventually be necessary."**

- Idempotency - Running the same operation multiple times should produce the same final state without creating duplicates or unintended side effects. **"This is particularly important for retries and reprocessing."**

- Checkpointing - Persisting processing progress so a pipeline can resume from a known position after failure instead of starting from the beginning. **"Common in streaming and large incremental workloads."**

## Modern Data Engineering Features 2/6

- Versioning - Maintaining versions of data, schemas, transformation logic, pipeline code, and infrastructure so changes are traceable and reproducible.

- Schema Evolution - Allowing datasets to safely adapt when columns or data structures change while maintaining compatibility with existing consumers.

- Data Lineage - is related to tracking the path of data, fundamental for debugging, governance and impact analysis. **Where did this data come from? → What transformed it? → Where is it being used?**

## Modern Data Engineering Features 3/6

- Data Quality - Ensuring data satisfies defined expectations such as: accuracy, completeness, validity, consistency, uniqueness, integrity and timeliness. **"Modern pipelines should detect quality problems automatically rather than relying exclusively on downstream users to discover them."**

- Observability - Understanding the health and behaviour of the entire data platform through metrics, logs, traces, lineage and alerts. Monitoring might tell you: **Pipeline failed**. Observability should answer: Why did it fail, what data was affected, and which downstream systems are impacted?

- Logging - Recording pipeline execution, errors, transformations and operational events so engineers can debug, audit and monitor systems.

## Modern Data Engineering Features 4/6

- Retry & Failure Recovery - Pipelines should tolerate transient failures using controlled retries, backoff, checkpoints and recovery mechanisms rather than immediately failing permanently.

- Deduplication - Identifying and eliminating duplicate records, particularly important in event-driven and streaming architectures where at-least-once delivery can produce duplicate events.

- Incremental Processing - Processing only new or changed data instead of repeatedly processing the entire dataset.

## Modern Data Engineering Features 5/6

- Data Contracts - Explicit agreements between producers and consumers defining things such as schema, types, semantics, ownership and quality expectations. **They reduce unexpected upstream changes breaking downstream pipelines.**

- Compliance & Governance - Ensuring data is handled according to organizational and regulatory requirements covering areas such as privacy, retention, access control, auditing, classification and data residency.

- Security - Protecting data through authentication, authorization, encryption, secrets management, network controls and least-privilege access.

## Modern Data Engineering Features 6/6

- Scalability - The platform should continue operating efficiently as data volume, velocity, variety, users and workloads increase.

- Orchestration - Coordinating pipelines through dependencies, scheduling, retries, parameters and workflow state. For example:
```
Ingest → Validate → Transform → Quality Check → Publish
```

- Metadata Management - Maintaining information about the data—schemas, owners, classifications, descriptions, lineage, timestamps and locations—so datasets remain discoverable and understandable.

- Reproducibility - A pipeline should be capable of producing consistent results from the same inputs, code, configuration and environment.

## Types of Data

**Data structure determines how information is stored, interpreted, and queried.**

```mermaid
flowchart TB
    D["Data"]
    D --> S["Structured"]
    D --> M["Semi-structured"]
    D --> U["Unstructured"]
    S --> ST["Tables · CSV"]
    M --> MT["JSON · XML · Events"]
    U --> UT["Text · Images · Audio"]
```

- **Structured:** predictable fields and types.
- **Semi-structured:** explicit keys or tags, with flexible layouts.
- **Unstructured:** content that needs extraction or interpretation for analysis.

## Structured Data

**Structured data follows a defined schema**, enabling consistent SQL queries, joins, and validation.

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        int customer_id PK
        string name
    }
    ORDER {
        int order_id PK
        int customer_id FK
        decimal total
    }
```

- **Examples:** relational tables, consistently formatted CSV files.
- **Engineering implication:** enforce data types, keys, and constraints.

## Semi-Structured Data

**Semi-structured data is self-describing but does not require identical fields in every record.**

```mermaid
flowchart TB
    E["JSON event"] --> ID["event_id"]
    E --> T["timestamp"]
    E --> P["payload"]
    P --> A["device_type"]
    P --> B["optional attributes"]
```

- **Examples:** JSON, XML, event messages, application logs.
- **Engineering implication:** handle nested fields, missing values, and schema evolution.

## Unstructured Data

**Unstructured data has no predefined analytical field layout.** Its meaning is usually extracted before downstream querying.

```mermaid
flowchart LR
    A["Text · Audio · Images"] --> B["Extraction"]
    B --> C["Text · Labels · Embeddings"]
    C --> D["Search · Analytics · AI"]
```

- **Examples:** emails, PDFs, photographs, recordings, videos.
- **Engineering implication:** choose appropriate parsing, OCR, transcription, or ML methods.

## The 5 Vs of Data

**The 5 Vs describe the challenges and goals of working with data at scale.**

```mermaid
mindmap
  root((5 Vs of Data))
    Volume
      How much?
    Velocity
      How fast?
    Variety
      What forms?
    Veracity
      How trustworthy?
    Value
      Why does it matter?
```

- **Engineering pressures:** Volume, Velocity, Variety.
- **Quality and outcomes:** Veracity, Value.

## Volume — How Much Data?

**Volume is the quantity of data generated, processed, and retained.**

```mermaid
flowchart LR
    A["Many sources"] --> B["Growing data volume"]
    B --> C["Partitioned storage"]
    C --> D["Distributed processing"]
```

- **Design for:** data growth, storage footprint, compute capacity, retention.
- **Example:** years of retail transactions and clickstream history.
- **Key question:** How large is the daily ingest and retained dataset?

## Velocity — How Fast Does It Arrive?

**Velocity is the rate at which data is generated and arrives; freshness needs determine processing latency.**

```mermaid
sequenceDiagram
    participant A as Application
    participant B as Event stream
    participant C as Processor
    participant D as Dashboard
    A->>B: Publish event
    B->>C: Deliver event
    C->>D: Update metric
```

- **Design for:** throughput, latency, backpressure, and recovery.
- **Patterns:** scheduled batch, micro-batch, continuous streaming.
- **Example:** IoT telemetry or live fraud detection.

## Variety — What Forms Does Data Take?

**Variety is the diversity of sources, formats, schemas, and meanings.**

```mermaid
flowchart LR
    A["SQL tables"] --> N["Integration layer"]
    B["JSON APIs"] --> N
    C["Logs and media"] --> N
    N --> O["Consistent data model"]
```

- **Design for:** connectors, parsing, schema mapping, standardization.
- **Example:** joining healthcare database records with API responses.
- **Key question:** Do fields represent the same business concept across systems?

## Veracity — Can We Trust It?

**Veracity concerns the accuracy, completeness, consistency, and credibility of data.**

```mermaid
flowchart LR
    A["Incoming records"] --> B{"Quality checks"}
    B -->|Pass| C["Trusted dataset"]
    B -->|Fail| D["Quarantine + alert"]
```

- **Design for:** validation, deduplication, anomaly detection, lineage.
- **Example:** detecting missing customer IDs or duplicated payments.
- **Key question:** Is the data trustworthy enough for its intended use?

## Value — What Can We Achieve?

**Value is the measurable benefit created when data supports decisions, products, or automation.**

```mermaid
flowchart LR
    A["Raw data"] --> B["Curated datasets"]
    B --> C["Insights and models"]
    C --> D["Business decisions"]
    D --> E["Measurable outcomes"]
```

- **Design for:** useful data products, accessibility, cost-effectiveness.
- **Example:** improving delivery forecasts or reducing customer churn.
- **Key question:** What decision or outcome will this dataset improve?

## Data Warehouse

**A data warehouse centralizes governed, structured analytical data for reliable SQL reporting and BI.**

- **Workload:** complex, read-heavy analytical queries—not everyday transaction processing.
- **Model:** curated facts and dimensions, often star or snowflake schemas.
- **Loading:** supports ETL **or** ELT; modern cloud warehouses commonly use ELT.

**Examples:** Amazon Redshift, Google BigQuery, Azure Synapse dedicated SQL pools, Snowflake.

## Data Warehouse Architecture

**Sources are ingested and transformed into shared analytical models; data marts serve specific teams.**

```mermaid
flowchart TB
    subgraph S["Source systems"]
        A["Purchases"]
        B["Product catalog"]
        C["Clickstream"]
    end
    A --> I["Ingest + transform"]
    B --> I
    C --> I
    I --> W[("Data warehouse")]
    W --> M1["Finance mart"]
    W --> M2["Analytics mart"]
    W --> M3["ML features"]
```

- **Benefit:** consistent metrics and reusable datasets across consumers.

## Data Lake

**A data lake stores data of many formats—often in object storage—for flexible processing and analysis.**

- **Workload:** batch analytics, exploration, data science, and streaming ingestion.
- **Content:** raw and curated datasets; structured, semi-structured, or unstructured.
- **Trade-off:** storage flexibility requires metadata, governance, access control, and quality management.

**Examples:** Amazon S3, Azure Data Lake Storage, Google Cloud Storage (when organized as data lakes).

## Data Lake Architecture

**The lake separates durable storage from the engines that process and consume its data.**

```mermaid
flowchart TB
    A["Databases · APIs · Events · Files"] --> B[("Object storage / data lake")]
    B --> C["Spark / SQL / ML engines"]
    C --> D["Analytics · AI · Applications"]
    M["Catalog · Security · Lineage · Quality"] -.-> B
    M -.-> C
```

- **Engineering principle:** Store flexibly, govern strictly: make your data lake discoverable and trustworthy.

## Data Warehouse vs. Data Lake

**Both support analytics, but they emphasize different storage and consumption patterns.**

| Dimension | Data Warehouse | Data Lake |
|---|---|---|
| **Primary focus** | Governed SQL analytics and BI | Flexible storage and multi-engine processing |
| **Typical data** | Curated, structured | Raw and curated; any structure |
| **Processing** | Warehouse SQL engines | Spark, SQL, ML, other engines |
| **Common use** | Reporting, KPI models | Exploration, history, ML, diverse data |

**Modern convergence:** lakehouses combine lake storage with transactional table formats and warehouse-like management capabilities.

## Choosing Warehouse, Lake, or Both

```mermaid
flowchart TD
    A{"Primary need?"}
    A -->|"Stable BI & SQL"| W["Data warehouse"]
    A -->|"Raw / diverse data"| L["Data lake"]
    A -->|"Both"| B["Lake + warehouse"]
    B --> R["Lake: retain sources"]
    R --> C["Curate and publish"]
    C --> W
```

**Rule of thumb:** Keep reusable source history in the lake; publish trusted reporting models where consumers need them.

## Data Lakehouse

**Data-lake storage + reliable, managed analytical tables.**

```mermaid
flowchart LR
    S["APIs · Databases · Events"] --> B["Bronze<br/>Raw"]
    B --> SI["Silver<br/>Validated"]
    SI --> G["Gold<br/>Business models"]
    G --> BI["BI / SQL"]
    SI --> ML["ML / exploration"]
```

- Table formats (e.g., **Delta Lake, Apache Iceberg, Hudi**) add transactional table management and metadata.
- Key capabilities: **ACID**, schema controls, versioned snapshots, scalable engines.
- **AWS Lake Formation** is governance tooling, not itself a lakehouse table format.

## Data Mesh

**An organizational model: domains own discoverable data products.**

```mermaid
flowchart TB
    G["Federated governance<br/>Shared standards"]
    P["Self-service data platform"]
    D1["Sales domain<br/>Orders product"]
    D2["Finance domain<br/>Revenue product"]
    D3["Support domain<br/>Tickets product"]
    C["Cross-domain consumers"]
    G -.-> D1 & D2 & D3
    P -.-> D1 & D2 & D3
    D1 & D2 & D3 --> C
```

**Four ideas:** domain ownership · data as a product · self-service platform · federated governance.

## ETL and ELT Pipelines

**Extract → Transform → Load** or **Extract → Load → Transform**.

```mermaid
flowchart TB
    S["Sources"] --> E["Extract"]
    E --> T["Transform"]
    T --> W["Target warehouse / store"]
    E --> L["Load raw data"]
    L --> T2["Transform in target"]
    T2 --> M["Curated models"]
```

- **ETL:** transform before loading the destination.
- **ELT:** load first; transform using destination compute.

## Extract

**Read source data without silently losing records.**

```mermaid
flowchart LR
    DB["Databases"] & API["APIs"] & F["Files"] & EV["Events"] --> X["Extract"]
    X --> V["Raw landing area"]
```

- **Full load** or **incremental / CDC**.
- Capture **watermark/offset, source ID, extraction time**.
- Plan for pagination, rate limits, retries and duplicates.

## Transform

**Turn source records into usable business data.**

```mermaid
flowchart LR
    R["Raw"] --> C["Clean & deduplicate"]
    C --> J["Join & enrich"]
    J --> M["Model & aggregate"]
    M --> Q["Quality checks"]
    Q --> O["Trusted output"]
```

Examples: normalize dates · handle nulls · derive metrics · enforce business rules.

## Load

**Write output reliably to the chosen destination.**

```mermaid
flowchart LR
    D["Prepared records"] --> V{"Write mode"}
    V --> A["Append"]
    V --> U["Upsert / MERGE"]
    V --> O["Overwrite partition"]
    A & U & O --> Q["Validate counts & integrity"]
```

**Design for:** idempotency, atomic commits where supported, retries and target constraints.

## Managing ETL Pipelines

**Orchestration = dependencies + scheduling + recovery + visibility.**

```mermaid
flowchart LR
    E["Schedule / event"] --> I["Ingest"]
    I --> Q["Validate"]
    Q --> T["Transform"]
    T --> P["Publish"]
    Q -.->|"Failure"| A["Alert / retry"]
    T -.->|"Failure"| A
```

**AWS examples:** Step Functions, MWAA (Airflow), Glue Workflows; EventBridge triggers; Lambda or Glue runs tasks.

## Data Sources & Access Interfaces

**The connection method depends on the source.**

```mermaid
flowchart LR
    DB["Relational DB"] --> D["JDBC / ODBC"]
    API["Web service"] --> H["HTTP / REST API"]
    LOG["Log files"] --> F["File / log collector"]
    EV["Events"] --> K["Kafka / Kinesis"]
    D & H & F & K --> P["Ingestion platform"]
```

Consider **authentication, schema, rate, freshness and recovery** for each source.

## JDBC

**Java Database Connectivity:** a Java-oriented interface for SQL databases.

```mermaid
flowchart LR
    A["Java application"] --> J["JDBC API"]
    J --> D["Database-specific driver"]
    D --> DB[("Database")]
```

- Common with **Java/Spark ecosystem**.
- SQL and capabilities still depend on the connected database.

## ODBC

**Open Database Connectivity:** a language-neutral database-access standard.

```mermaid
flowchart LR
    A["BI tool / application"] --> O["ODBC interface"]
    O --> D["Installed driver"]
    D --> DB[("Database")]
```

**Contrast:** JDBC is Java-centric; ODBC exposes a common interface through platform-compatible drivers.

## Other Data Sources

```mermaid
flowchart TD
    S["Non-database sources"] --> A["REST / GraphQL APIs"]
    S --> L["Application logs"]
    S --> E["Event streams"]
    A --> P["Pagination · auth · limits"]
    L --> R["Parsing · rotation · timestamps"]
    E --> O["Offsets · ordering · replay"]
```

**Always establish:** data format · delivery model · error recovery.

## Data Format Selection

**Choose by how data is exchanged and queried.**

| Format | Layout | Typical strength |
|---|---|---|
| **CSV** | Text rows | Simple interchange |
| **JSON** | Nested text | APIs / flexibility |
| **Avro** | Binary records | Schema-aware transport |
| **Parquet** | Binary columns | Analytical scans |

> There is no universally best format: access patterns decide.

## CSV

**Delimited rows; simple but weakly typed.**

```csv
id,name,amount
1,Ana,49.90
2,Leo,20.00
```

- Useful for exports and system interchange.
- Agree on **header, delimiter, quoting, encoding and types**.
- Inefficient for large selective analytical scans.

## JSON

**Named fields and nested values; common for APIs.**

```json
{"order_id": 42, "customer": {"id": 7}, "items": ["A", "B"]}
```

- Supports nested and evolving records.
- **Flexible ≠ validated**: enforce required fields and types downstream.

## Apache Avro

**Compact row-oriented binary serialization with a schema.**

```mermaid
flowchart LR
    S["Writer schema"] --> E["Encode record"]
    R["Record"] --> E
    E --> B["Avro bytes"]
    B --> D["Reader + schema resolution"]
    D --> O["Decoded fields"]
```

Best fit: **record exchange, event pipelines, schema evolution** (subject to compatibility rules).

## Apache Parquet

**Columnar file layout: read only relevant columns.**

```mermaid
flowchart LR
    T["Wide table"] --> C1["Column: date"]
    T --> C2["Column: sales"]
    T --> C3["Column: customer"]
    C1 & C2 --> Q["Query: SUM(sales) BY date"]
    C3 -.->|"Not scanned when unnecessary"| X["Skipped"]
```

- Column projection + compression reduce I/O.
- Best suited to **analytical lake / lakehouse workloads**.

## Dimensional Data Modeling

Data Modeling is not an easy task, but the trick is to
**Start with the grain, then choose facts and dimensions accordingly.**

```mermaid
erDiagram
    DIM_STUDENT ||--o{ FACT_ENROLLMENT : has
    DIM_COURSE ||--o{ FACT_ENROLLMENT : describes
    DIM_DATE ||--o{ FACT_ENROLLMENT : dates
    DIM_STUDENT {
        int student_key PK
        string student_name
    }
    DIM_COURSE {
        int course_key PK
        string course_name
    }
    DIM_DATE {
        int date_key PK
        date full_date
    }
    FACT_ENROLLMENT {
        int student_key FK
        int course_key FK
        int date_key FK
        decimal paid_amount
    }
```

**Grain:** one fact row per student–course enrollment event.

## Star Schema

**A central fact table links directly to descriptive dimensions.**

```mermaid
flowchart TB
    DATE["Dim Date"] --> F["Fact Enrollments<br/>paid_amount"]
    STUDENT["Dim Student"] --> F
    COURSE["Dim Course"] --> F
    CHANNEL["Dim Channel"] --> F
```

- **Facts:** measurable events at a declared grain.
- **Dimensions:** who, what, when, where and how.

## Snowflake Schema

**Normalized dimensions introduce additional joins.**

```mermaid
flowchart LR
    F["Fact Sales"] --> P["Dim Product"]
    P --> C["Dim Category"]
    C --> D["Dim Department"]
    F --> S["Dim Store"]
    S --> R["Dim Region"]
```

**Trade-off:** less dimension redundancy, but more joins than a denormalized star schema.

## Data Lineage

**Trace data origin, transformations and downstream consumers.**

```mermaid
flowchart LR
    S["CRM source"] --> R["Raw customers"]
    R --> T["Normalize customer_id"]
    T --> G["Gold customer model"]
    G --> BI["Retention dashboard"]
    G --> ML["Churn model"]
```

**Use for:** root-cause analysis · change impact · governance / audit.

## Capturing Spark Lineage

**Illustrative architecture: Spark execution → lineage graph.**

```mermaid
sequenceDiagram
    participant G as Glue / Spark
    participant S as Spline Agent
    participant L as Lambda / Ingestion
    participant N as Neptune
    G->>S: Execution metadata
    S->>L: Lineage events
    L->>N: Nodes + dependencies
    Note over N: Traverse upstream / downstream
```

> Implementation example, not a built-in AWS Glue → Neptune integration.
**Reference Example:** [build-data-lineage-for-data-lakes](https://aws.amazon.com/blogs/big-data/build-data-lineage-for-data-lakes-using-aws-glue-amazon-neptune-and-spline/)

## Schema Evolution

**Change a dataset's structure without unexpectedly breaking consumers.**

```mermaid
flowchart LR
    A["v1: id, name"] --> B["v2: id, name, region?"]
    B --> C{"Compatibility check"}
    C -->|"Pass"| D["Register + deploy"]
    C -->|"Fail"| E["Coordinate migration"]
```

- **Adding optional fields** is often easier than removing/renaming required ones.
- Validate writer/reader compatibility; use a schema registry where relevant.
- Modern Table formats like Apache Iceberg, Hudi, and DeltaLake manage schema changes at the metadata level, meaning that you can add, drop or rename columns without reprocessing historical data.
- AWS Glue crawlers can be used to track schema evolution on s3 files.

## Database Performance Optimization

**Reduce work before adding compute.**

```mermaid
mindmap
  root((Query performance))
    Indexes
      Targeted lookups
    Partitions
      Prune scans
    Compression
      Less I/O
    Columnar layout
      Read needed fields
    Query design
      Filter early
```

**Trade-offs matter:** indexes cost writes/storage; repartitioning costs shuffles; compression costs CPU.

## Data Sampling Techniques

**Inspect less data while controlling selection bias.**

```mermaid
flowchart TD
    P["Population"] --> R["Random<br/>Sample across all items"]
    P --> S["Stratified<br/>Sample within groups"]
    P --> Y["Systematic<br/>Every kth item"]
```

**Other methods:** cluster, convenience and judgmental sampling; assess representativeness.

## Random Sampling

**Select observations using chance—not a fixed interval.**

```mermaid
flowchart LR
    P["Population<br/>A B C D E F G H"] --> R["Random draw"]
    R --> S["Example sample<br/>B E H"]
```

A **simple random sample** gives each eligible observation the same inclusion probability.

## Stratified Sampling

**Divide into groups; sample from each group.**

```mermaid
flowchart TB
    P["All products"] --> B["Books"]
    P --> M["Music"]
    P --> A["Apparel"]
    B & M & A --> S["Sample per stratum"]
    S --> C["Combined sample"]
```

Good when important subgroups must remain represented.

## Systematic Sampling

**Choose a start, then select every kth observation.**

```mermaid
flowchart LR
    A["1"] --> B["2 ✓"] --> C["3"] --> D["4"] --> E["5 ✓"] --> F["6"] --> G["7"] --> H["8 ✓"]
```

Example: **k = 3, start = 2**. Beware of periodic patterns aligned with k.

## Data Skew

**Unequal key frequencies overload some partitions/workers.**

```mermaid
flowchart LR
    E["Events"] --> K["Partition by actor_id"]
    K --> P1["Worker 1<br/>1k rows"]
    K --> P2["Worker 2<br/>1k rows"]
    K --> HOT["Worker 3<br/>90k rows ⚠"]
```

**Causes:** hot keys · poor partitioning · time-based bursts. **Symptom:** straggler tasks.

## Reducing Data Skew

```mermaid
flowchart TD
    D{"Skew source?"}
    D -->|"Hot join key"| S["Salting / skew-aware join"]
    D -->|"Bad partition sizing"| R["Repartition / rebalance"]
    D -->|"Unknown distribution"| P["Profile key frequencies"]
    S & R & P --> V["Verify results + shuffle cost"]
```

**Caution:** salting may require recombination; repartitioning introduces shuffle overhead.

## Data Validation and Profiling

| Dimension | Ask | Check |
|---|---|---|
| **Completeness** | Is required data present? | NULL / missing rate |
| **Consistency** | Do rules agree? | Cross-field checks |
| **Accuracy** | Is the value correct? | Trusted reference |
| **Integrity** | Are links valid? | Key relationships |

**Profile first; validate continuously.** Add uniqueness, validity and timeliness where needed.

## Data Cardinality

**Cardinality = number of distinct values in a field.**

```mermaid
flowchart LR
    L["status<br/>NEW · PAID · CANCELED"] --> LC["Low cardinality"]
    H["order_id<br/>Many distinct IDs"] --> HC["High cardinality"]
```

- Affects **indexes, compression, statistics, joins and partition choices**.
- **Relationship cardinality** is different: one-to-one, one-to-many, many-to-many.

## SQL and Git: Two Essential Toolsets

```mermaid
flowchart LR
    DE["Data Engineer"] --> SQL["SQL<br/>Query · join · aggregate"]
    DE --> GIT["Git<br/>Version · review · collaborate"]
    SQL --> D["Trustworthy datasets"]
    GIT --> P["Reproducible pipeline code"]
```

**SQL manipulates data; Git manages changes to code and other tracked files.**

## SQL Aggregation

**Aggregate functions summarize multiple rows.**

| Function | Purpose |
|---|---|
| `COUNT(*)` | Count rows |
| `SUM(x)` | Total |
| `AVG(x)` | Mean (ignores NULL) |
| `MIN(x)` / `MAX(x)` | Extremes |

```sql
SELECT COUNT(*) AS employees,
       AVG(salary) AS avg_salary
FROM employees;
```

## Conditional Aggregation with CASE

**Calculate several metrics in a single scan.**

```sql
SELECT
  COUNT(CASE WHEN salary > 70000 THEN 1 END) AS high,
  COUNT(CASE WHEN salary BETWEEN 50000 AND 70000 THEN 1 END) AS middle,
  COUNT(CASE WHEN salary < 50000 THEN 1 END) AS low
FROM employees;
```

- `COUNT(expression)` ignores `NULL`.
- `WHERE` filters rows; `HAVING` filters aggregated groups.

## SQL Grouping

**`GROUP BY` returns one output row per group.**

```sql
SELECT department_id, COUNT(*) AS employee_count
FROM employees
WHERE join_date > DATE '2020-01-01'
GROUP BY department_id;
```

```mermaid
flowchart LR
    R["Employee rows"] --> F["WHERE: date filter"]
    F --> G["GROUP BY department"]
    G --> C["COUNT per department"]
```

## Multiple Grouping Keys and Sorting

**Group by combinations; sort the result separately.**

```sql
SELECT EXTRACT(YEAR FROM sale_date) AS sale_year,
       product_id, SUM(amount) AS total_sales
FROM sales
GROUP BY EXTRACT(YEAR FROM sale_date), product_id
ORDER BY sale_year, total_sales DESC;
```

**Key:** `GROUP BY` does **not** guarantee output order.

## SQL Pivoting

**Convert categories stored in rows into report columns.**

```mermaid
flowchart LR
    R["Alice · Jan · 1000<br/>Alice · Feb · 1100<br/>Bob · Jan · 900"]
    --> P["PIVOT / conditional aggregation"]
    P --> C["Seller | Jan | Feb<br/>Alice | 1000 | 1100<br/>Bob | 900 | 0"]
```

Use **`PIVOT`** where supported or **`SUM(CASE...)`** for broad SQL compatibility.

## Pivoting with Conditional Aggregation

```sql
SELECT salesperson,
  SUM(CASE WHEN month = 'Jan' THEN sales ELSE 0 END) AS jan_sales,
  SUM(CASE WHEN month = 'Feb' THEN sales ELSE 0 END) AS feb_sales
FROM sales
GROUP BY salesperson;
```

**Pattern:** one `CASE` per desired column; one group per output row.

## INNER JOIN

**Returns matching row pairs only.**

```mermaid
flowchart LR
    A["Customers<br/>1 · 2 · 3"] --> J["Match on customer_id"]
    B["Payments<br/>1 · 1 · 4"] --> J
    J --> R["Result<br/>1 · 1"]
```

**Important:** repeated keys can create multiple output rows.

## INNER JOIN: SQL Example

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM customers AS c
INNER JOIN payments AS p
  ON c.customerNumber = p.customerNumber;
```

**Keeps:** customers with matching payments. A customer with three payments appears in three joined rows.

## LEFT OUTER JOIN

**Keeps all left rows; adds matching right values when available.**

```mermaid
flowchart LR
    L["Customers<br/>1 · 2 · 3"] --> J["LEFT JOIN"]
    R["Payments<br/>1 · 1 · 4"] --> J
    J --> O["1 · payment A<br/>1 · payment B<br/>2 · NULL<br/>3 · NULL"]
```

Unmatched columns from the **right** are `NULL`.

## LEFT JOIN: SQL Example

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM customers AS c
LEFT JOIN payments AS p
  ON c.customerNumber = p.customerNumber;
```

**Keeps:** every customer—even those without a payment.

## RIGHT OUTER JOIN

**Keeps all right rows; adds matching left values when available.**

```mermaid
flowchart LR
    L["Payments<br/>customer 1 · 4"] --> J["RIGHT JOIN"]
    R["Customers<br/>1 · 2 · 3"] --> J
    J --> O["Customer 1 + payment<br/>Customer 2 + NULL<br/>Customer 3 + NULL"]
```

**Equivalent idea:** swap table order and use `LEFT JOIN`.

## RIGHT JOIN: SQL Example

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM payments AS p
RIGHT JOIN customers AS c
  ON c.customerNumber = p.customerNumber;
```

**Keeps:** all `customers` rows because `customers` is the **right** input.

## FULL OUTER JOIN

**Keeps matches and all unmatched rows from both sides.**

```mermaid
flowchart LR
    A["Left<br/>1 · 2"] --> J["FULL OUTER JOIN"]
    B["Right<br/>2 · 3"] --> J
    J --> R["1 · NULL<br/>2 · 2<br/>NULL · 3"]
```

Missing partner fields become `NULL`; duplicate match keys can multiply rows.

## CROSS JOIN

**Cartesian product: every left row × every right row.**

```mermaid
flowchart LR
    A["Colors<br/>Red · Blue"] --> X["CROSS JOIN"]
    B["Sizes<br/>S · M · L"] --> X
    X --> R["6 combinations<br/>2 × 3"]
```

**No `ON` predicate.** Output count = `m × n`.

## CROSS JOIN: SQL Example

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM payments AS p
CROSS JOIN customers AS c;
```

**Warning:** multiplies rows regardless of customer keys. Use only when all combinations are intended.

## SQL Regular Expressions

**Regex matches patterns beyond simple `LIKE`.**

| Pattern | Meaning |
|---|---|
| `^` / `$` | Start / end |
| `[a-z]` | Character range |
| `a|b` | Alternative |
| `{4}` | Four repetitions |
| `\d` / `\s` | Digit / whitespace (dialect-dependent) |

**PostgreSQL example** (`~*` = case-insensitive regex):

```sql
SELECT * FROM names
WHERE name ~* '^(fire|ice)';
```

> Regex operators and escape rules differ across databases.

## Git: The Four Areas

**Track changes from files to shared history.**

```mermaid
flowchart LR
    W["Working tree"] -->|"git add"| S["Staging area"]
    S -->|"git commit"| L["Local repository"]
    L -->|"git push"| R["Remote"]
    R -->|"git fetch"| L
```

`git status` shows the current working-tree and staging state.

## Common Git Commands

| Intent | Command |
|---|---|
| Start new repo | `git init` |
| Copy existing repo | `git clone URL` |
| Inspect changes | `git status` / `git diff` |
| Stage files | `git add .` |
| Save snapshot | `git commit -m "message"` |
| Read history | `git log --oneline` |

**Identity:** `git config --global user.name` / `user.email`.

## Git Branching

**Branches allow parallel development and later integration.**

```mermaid
flowchart LR
    A["Common commit"] --> M1["main: next commit"]
    A --> F1["feature: change A"]
    F1 --> F2["feature: change B"]
    M1 & F2 --> M2["Merge commit"]
```

```bash
git switch -c feature/orders
git switch main
git merge feature/orders
```

## Remote Repositories

**Remotes share branches and history across collaborators.**

```mermaid
sequenceDiagram
    participant L as Local repo
    participant R as Remote repo
    L->>R: git push origin feature
    R-->>L: git fetch origin
    Note over L: git pull = fetch + integrate
```

- `git remote -v`: inspect configured remotes.
- **Fetch before integrating** to review incoming changes.

## Undoing Changes Safely

**Pick the undo method by the scope of change.**

| Goal | Command |
|---|---|
| Unstage a file | `git restore --staged file` |
| Discard unstaged edits | `git restore file` |
| Reverse a committed change | `git revert COMMIT` |
| Reset tracked files to HEAD | `git reset --hard HEAD` |

**Caution:** `reset --hard` discards local tracked changes; `revert` creates a new undo commit.

## Advanced Git Operations

```mermaid
flowchart TD
    N{"What do you need?"}
    N -->|"Temporarily set edits aside"| S["git stash"]
    N -->|"Move commits onto new base"| R["git rebase"]
    N -->|"Apply one commit"| C["git cherry-pick"]
    N -->|"Find first bad commit"| B["git bisect"]
```

**Rule:** avoid rewriting already-shared history without coordination.

## Git Collaboration and Inspection

**Review what changed before merging or releasing.**

```mermaid
flowchart LR
    F["git fetch"] --> D["git diff / git log"]
    D --> B["git blame (who changed a line?)"]
    B --> R["Review + integrate"]
```

**Useful commands:** `git diff`, `git show`, `git log`, `git blame`, `git fetch`.

## Git Maintenance and Recovery

**Inspect repository health and recover local references.**

| Command | Purpose |
|---|---|
| `git fsck` | Verify object connectivity/integrity |
| `git gc` | Repack and clean up objects |
| `git reflog` | Find previous positions of local references |

```mermaid
flowchart LR
    M["Commit seems lost"] --> R["git reflog"]
    R --> C["Locate commit hash"]
    C --> B["Create recovery branch"]
```

**Recovery tip:** investigate with `reflog` before aggressive cleanup.

# Section Storage

## Storage: Choosing the Right AWS Service

**Choose storage by access model, sharing, latency, and recovery needs.**

```mermaid
flowchart TD
    A{"How will data be accessed?"}
    A -->|Objects / data lake| S3["Amazon S3"]
    A -->|Disk for EC2| EBS["Amazon EBS"]
    A -->|Shared filesystem| EFS["Amazon EFS"]
    A -->|Central backups| B["AWS Backup"]
```

- **Object (s3):** API access to keys and blobs.
- **Block (EBS):** volumes formatted as disks/filesystems.
- **File (EFS):** shared paths and POSIX-style operations.

## Amazon S3: Object Storage

**Amazon S3** stores objects durably in buckets, separating storage from the compute that accesses them.

```mermaid
flowchart LR
    subgraph Sources
      DB["Databases"]
      API["APIs / logs"]
      App["Applications"]
    end
    DB & API & App --> S3[("S3 bucket")]
    S3 --> X["Glue / Spark / Athena"]
    S3 --> B["Backups / archives"]
    S3 --> W["Static assets / delivery"]
```

- **Data engineering:** raw lakes, curated files, pipeline exchange, historical retention.
- **Other uses:** backups, disaster recovery, media, static sites, software distribution.

## S3 Buckets and Object Keys

**A bucket is the storage container; a key is an object's full name within it.**

```mermaid
flowchart TB
    B["Bucket: analytics-lake"] --> K1["raw/orders/2026-10-22.json"]
    B --> K2["silver/orders/part-0001.parquet"]
    B --> K3["gold/revenue/report.parquet"]
```

- `s3://analytics-lake/silver/orders/part-0001.parquet`
- **Slashes are key-prefix delimiters**, not ordinary filesystem directories.
- General-purpose bucket naming follows namespace and Region rules; names are lowercase and typically 3–63 characters.

## S3 Object Anatomy and Upload Limits

**An object = content + key + metadata + optional tags / version ID.**

```mermaid
flowchart LR
    O["S3 object"] --> B["Body / bytes"]
    O --> K["Key"]
    O --> M["System + user metadata"]
    O --> T["Up to 10 tags"]
    O --> V["Version ID, if enabled"]
```

- **Maximum object:** approximately **50 TB (48.8 TiB)**.
- **Single PUT:** up to 5 GB; larger objects require multipart upload.
- Metadata describes content; **tags** support policy, lifecycle, and classification.

## S3 Authorization: What Grants Access?

**Access is allowed only when all applicable policy boundaries permit the request.**

```mermaid
flowchart TD
    R["Principal requests S3 action"] --> I["Identity policy / resource policy"]
    I --> D{"Explicit deny anywhere?"}
    D -->|Yes| N["DENY"]
    D -->|No| A{"Required allow and controls satisfied?"}
    A -->|Yes| Y["ALLOW"]
    A -->|No| N
```

- **IAM policies:** permissions attached to identities/roles.
- **Bucket / access-point policies:** permissions attached to S3 resources.
- **ACLs:** legacy access mechanism; generally prefer **Bucket owner enforced** and policy-based access.
- **Other limits:** Block Public Access, SCPs, endpoint policies, KMS permissions.

## Bucket Policies and Public Access

**Bucket policies declare `Principal`, `Action`, `Resource`, `Effect`, and optional `Condition`.**

```mermaid
flowchart LR
    U["Anonymous or IAM request"] --> BP["Bucket policy"]
    BPA["Block Public Access"] -.-> BP
    BP --> A{"Policy permits request?"}
    A -->|Yes, no blockers| S3[("S3 object")]
    A -->|No| D["Access denied"]
```

- Typical rules: **cross-account read**, **TLS-only access**, and **restricted prefixes**.
- **Public access is never implied** by an internet-reachable endpoint.
- Keep Block Public Access enabled unless public access is intentional and approved.

## S3 Roles and Cross-Account Access

**AWS workloads should use temporary IAM-role credentials—not embedded access keys.**

```mermaid
sequenceDiagram
    participant E as EC2 / Glue role (Account A)
    participant P as IAM policy (A)
    participant B as Bucket policy (B)
    participant S as S3 bucket (B)
    E->>P: Request s3:GetObject
    P-->>E: Identity-side permission
    E->>B: Signed request
    B-->>E: Resource-side permission
    E->>S: Read object, if all controls allow
```

- **Same account:** identity and resource-policy evaluation follows AWS authorization rules.
- **Cross-account:** normally requires **permission from the principal account and bucket account**.
- For SSE-KMS objects, the requester may also need appropriate **KMS key permissions**.

## S3 Block Public Access

**Block Public Access is a guardrail against accidental internet exposure.**

```mermaid
flowchart LR
    R["Public allow in policy / ACL"] --> G{"Block Public Access settings"}
    G -->|Blocked| D["Denied / rejected"]
    G -->|Not blocked| P["Evaluate normal S3 authorization"]
```

- Configure at **account**, **bucket**, and relevant **access-point** scope.
- Prefer restricting access by IAM roles, VPC conditions, and least privilege.

## S3 Versioning

**Versioning preserves historical object states under one key.**

```mermaid
flowchart LR
    K["orders.csv"] --> V1["v1: original"]
    K --> V2["v2: overwrite"]
    K --> V3["v3: overwrite"]
    K --> DM["Delete marker: current view hidden"]
```

- Enables **rollback** and recovery from accidental overwrite or simple deletion.
- Enabling versioning does not retroactively assign new version IDs to old objects (`null` versions can exist).
- Suspending versioning **does not erase** stored historical versions.

## S3 Replication: SRR vs CRR

**Replication asynchronously copies eligible object versions between versioned buckets.**

```mermaid
flowchart LR
    S[("Source bucket\nversioning ON")] --> R{"Replication rule + IAM role"}
    R -->|Same Region| SRR[("SRR destination")]
    R -->|Different Region| CRR[("CRR destination")]
```

- **SRR:** same-Region redundancy, aggregation, account separation.
- **CRR:** geographic copies, compliance, disaster recovery, proximity.
- Source and destination require **versioning**, valid permissions, and eligible configuration.

## S3 Replication: Edge Cases

**Ordinary replication rules handle eligible future writes; history needs a separate plan.**

```mermaid
flowchart TB
    W["New version"] --> R["Configured replication"]
    O["Existing versions / failed objects"] --> B["S3 Batch Replication"]
    R & B --> D[("Destination bucket")]
```

- **Delete-marker replication:** optional; deleting a specific version does not replicate as a normal deletion.
- **No automatic chaining:** A → B → C does not automatically relay A's replicas onward to C.
- Validate replication metrics and destination ownership / encryption requirements.

## S3 Replication Time Control (RTC)

**RTC adds a predictable replication-time objective and monitoring.**

```mermaid
sequenceDiagram
    participant S as Source bucket
    participant R as Replication RTC
    participant D as Destination bucket
    S->>R: Eligible new object
    R->>D: Asynchronous copy
    Note over R,D: 15-minute objective + SLA
    R-->>S: Metrics / threshold events
```

- AWS documents a **99.99% within 15 minutes SLA** for covered objects; monitor late or failed replication.
- Helps with regulatory delivery objectives; **additional charges apply**.
- [AWS: Replication Time Control](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-time-control.html)

## S3 Storage Classes: How to Choose

**Choose on access frequency, retrieval latency, AZ resilience, and total cost.**

```mermaid
flowchart TD
    Q{"Access pattern?"}
    Q -->|Frequent| STD["S3 Standard"]
    Q -->|Unpredictable| IT["Intelligent-Tiering"]
    Q -->|Infrequent, instant reads| IA["Standard-IA / One Zone-IA"]
    Q -->|Rare archive, instant reads| GI["Glacier Instant Retrieval"]
    Q -->|Archive, wait for restore| GF["Glacier Flexible / Deep Archive"]
    Q -->|Very low latency, one AZ| EX["S3 Express One Zone"]
```

## Durability vs Availability

**Durability protects data from loss; availability measures how often requests can access it.**

| Metric | Engineering question | S3 example |
|---|---|---|
| **Durability** | Will the object survive? | Many classes designed for **11 nines** |
| **Availability** | Can I access it now? | **S3 Standard: 99.99%** design |
| **Resilience** | What failure domain is covered? | **Multi-AZ** vs **One Zone** |

**Key distinction:** one-AZ classes can be durable against device failures but **not resilient to total AZ loss**.

## Standard and Infrequent Access

| Class | Access | Placement | Typical workload |
|---|---|---|---|
| **Standard** | Frequent, immediate | Multi-AZ | Hot lake datasets / assets |
| **Standard-IA** | Rare, immediate | Multi-AZ | Backups / DR copies |
| **One Zone-IA** | Rare, immediate | Single AZ | Re-creatable copies |

- **IA trade-off:** retrieval fees and **30-day minimum storage duration**.
- Avoid **One Zone-IA** as the only copy of irreplaceable data.

## S3 Glacier: Three Archive Choices

| Class | Typical retrieval | Minimum storage |
|---|---|---|
| **Glacier Instant Retrieval** | Milliseconds | **90 days** |
| **Glacier Flexible Retrieval** | Minutes–hours after restore | **90 days** |
| **Glacier Deep Archive** | Hours after restore | **180 days** |

```mermaid
flowchart LR
    D["Archive request"] --> Q{"Immediate access?"}
    Q -->|Yes| I["Instant Retrieval"]
    Q -->|No, faster restore| F["Flexible Retrieval"]
    Q -->|No, longest retention| A["Deep Archive"]
```

- Restore tiers and charges depend on the selected class and options.

## S3 Intelligent-Tiering

**Automatically optimizes eligible object storage when access patterns change.**

```mermaid
stateDiagram-v2
    [*] --> Frequent
    Frequent --> Infrequent: 30 days without access
    Infrequent --> ArchiveInstant: 90 days without access
    Infrequent --> Frequent: Access
    ArchiveInstant --> Frequent: Access
    ArchiveInstant --> OptionalArchive: Optional archival configuration
```

- Monitoring/automation fees apply for qualifying objects.
- **Optional archive tiers** may require restore before reading; automatic access tiers remain immediately available.
- Evaluate object-size eligibility and tier-specific behaviour.

## S3 Storage Cost: Full Workload View

**Lowest $/GB does not always mean lowest overall cost.**

```mermaid
mindmap
  root((Total S3 cost))
    Storage bytes
    PUT GET LIST requests
    Retrieval and restoration
    Data transfer
    Lifecycle transitions
    Monitoring and replication
```

- **Small frequently accessed files** may cost more in a supposedly cheaper archive class.
- Minimum-duration charges and transition request costs matter.
- Check current [AWS S3 pricing](https://aws.amazon.com/s3/pricing/) for the Region and workload.

## S3 Express One Zone

**Directory-bucket storage designed for high request rates and single-digit-ms access in one AZ.**

```mermaid
flowchart TB
    subgraph AZ["One Availability Zone"]
      C["Compute / analytics job"] <-->|"Low-latency requests"| B[("Directory bucket\nS3 Express One Zone")]
    end
    A["Multi-AZ / DR strategy"] -.->|"Plan separately"| B
```

- **Co-locate compute and storage** to minimize latency.
- **99.95% designed availability**; single-AZ failure domain.
- Directory buckets have different naming, API, endpoint, and feature constraints.
- [AWS: S3 Express](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-bucket-high-performance.html)

## S3 Lifecycle: Transition vs Expiration

**Lifecycle rules automate storage-class changes and retention cleanup.**

```mermaid
flowchart LR
    A["New object"] -->|"After 30+ days"| I["Infrequent storage"]
    I -->|"After retention threshold"| G["Archive"]
    G -->|"Retention ends"| X["Expire / delete"]
    V["Noncurrent versions"] --> NV["Separate transition / expiration rules"]
```

- Scope rules by **prefix, tags, size** and relevant object state.
- Can expire **noncurrent versions** and abort **incomplete multipart uploads**.
- Transitions must follow supported pathways; arrows show **illustrative** choices, not universal eligibility.

## S3 Lifecycle: Images Example

**Original files and regenerable derivatives deserve different retention policies.**

```mermaid
flowchart TB
    P["Profile image upload"] --> O["Original: Standard"]
    P --> T["Thumbnail: lower-cost tier"]
    O -->|"60 days"| G["Archive original"]
    T -->|"60 days"| D["Expire; regenerate if needed"]
```

- Use separate prefixes/tags and lifecycle rules.
- Confirm the intended archive **retrieval delay** before transition.

## S3 Lifecycle: Recover Deleted Data

**Versioning + noncurrent-version rules keep a time-limited recovery window.**

```mermaid
flowchart LR
    A["Overwrite / delete"] --> M["Old version retained"]
    M -->|"0–30 days"| F["Immediate recovery tier"]
    F -->|"30–365 days"| C["Lower-cost archive"]
    C -->|"After day 365"| E["Expire version"]
```

- A **delete marker** can hide a key without deleting older versions.
- Design recovery windows separately from current-object retention.

## S3 Analytics: Storage Class Analysis

**Use real access measurements to choose lifecycle thresholds.**

```mermaid
flowchart LR
    A["Object access / storage activity"] --> B["Storage Class Analysis"]
    B --> C["Daily report / trends"]
    C --> D["Proposed lifecycle rule"]
    D --> E["Measure savings and retrieval impact"]
```

- Primarily informs **Standard ↔ Standard-IA** decisions; not a universal recommendation engine for Glacier/One Zone-IA.
- Does **not automatically transition** objects.

## S3 Event Notifications

**Object events can trigger asynchronous downstream processing.**

```mermaid
flowchart LR
    U["Object uploaded"] --> S[("S3")]
    S -->|"ObjectCreated event"| Q["SQS"]
    S -->|"ObjectCreated event"| L["Lambda"]
    S -->|"ObjectCreated event"| N["SNS"]
    Q --> W["ETL / thumbnail worker"]
```

- Event types include **creation, removal, restore, and replication** events.
- Filter by **key prefix/suffix** when supported.
- Events can be **duplicated or out of order**: write idempotent consumers.

## Event Notification Permissions

**S3 needs permission to deliver events to the destination resource.**

```mermaid
flowchart TD
    S["S3 bucket event"] --> D{"Target"}
    D --> Q["SQS policy: SendMessage"]
    D --> N["SNS policy: Publish"]
    D --> L["Lambda resource policy: InvokeFunction"]
```

- Destination **resource policies** must trust the S3 service and constrain the source appropriately.
- Encryption keys and destination-specific permissions may impose further requirements.

## S3 Events with EventBridge

**EventBridge adds rich filtering, routing, archival and replay capabilities.**

```mermaid
flowchart LR
    S[("S3") ] --> B["EventBridge bus"]
    B --> R{"Event pattern"}
    R -->|".parquet"| E["Step Functions ETL"]
    R -->|"audit events"| Q["SQS / notifications"]
    R -->|"other matching events"| L["Lambda"]
```

- Better for **multiple targets** and complex event routing.
- EventBridge rules and archive/replay have their own delivery and cost rules.

## S3 Request Performance: Prefix Parallelism

**S3 scales with parallel requests; prefixes are useful workload partitions.**

```mermaid
flowchart TB
    B["S3 bucket"] --> R["raw/"]
    B --> S["silver/"]
    B --> G["gold/"]
    R & S & G --> P["Parallel clients / compute"]
```

- Documented baseline **per prefix:** at least **3,500 write-type** and **5,500 GET/HEAD** requests/second.
- Multiple prefixes can support greater aggregate request rates; performance ramps with demand.
- This is **request throughput**, not a guarantee of application query speed.

## S3 Multipart Upload

**Upload large objects in independently transferred parts, then complete the object.**

```mermaid
flowchart LR
    F["10 GB file"] --> P1["Part 1"]
    F --> P2["Part 2"]
    F --> P3["Part 3"]
    P1 & P2 & P3 --> C["CompleteMultipartUpload"]
    C --> S[("One S3 object")]
```

- **Consider for ≥100 MB**; **required above 5 GB**.
- Up to **10,000 parts** (normally 5 MiB–5 GiB per part; final part may be smaller).
- Supports parallelism, retrying failed parts, and aborting abandoned uploads.
- [AWS multipart limits](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html)

## S3 Byte-Range GET

**Read only the bytes needed instead of downloading the full object.**

```mermaid
flowchart LR
    O[("Large S3 object")] -->|"Range 0–N"| A["Worker A"]
    O -->|"Range N+1–M"| B["Worker B"]
    O -->|"Footer / header range"| C["Metadata reader"]
```

- Useful for **parallel downloads**, **partial reads**, and file-metadata access.
- Data formats such as Parquet can exploit selective I/O through suitable readers.

## S3 Transfer Acceleration vs CloudFront

**Transfer Acceleration optimizes long-distance S3 transfers via AWS edge locations.**

```mermaid
flowchart LR
    C["Remote client"] --> E["Nearby AWS edge"]
    E -->|"AWS network"| S[("S3 bucket in distant Region")]
```

- Works with multipart upload; **additional cost** and eligibility checks.
- **CloudFront is different:** CDN caching/content distribution, not simply accelerated upload transport.

## S3 Encryption: At Rest vs In Transit

**First ask where encryption occurs and who controls the keys.**

```mermaid
flowchart TB
    E["Protect S3 data"] --> T["In transit: TLS / HTTPS"]
    E --> R["At rest"]
    R --> S["Server-side: SSE-S3 / SSE-KMS / DSSE-KMS / SSE-C"]
    R --> C["Client-side: encrypt before upload"]
```

- **Default S3 encryption:** new objects receive server-side encryption (typically SSE-S3 unless configured otherwise).
- TLS and at-rest encryption protect **different** parts of the data path.

## SSE-S3: S3-Managed Keys

**S3 encrypts objects at rest using keys managed by the service.**

```mermaid
flowchart LR
    C["Client"] -->|"HTTPS PUT"| S["S3 encrypts with S3-managed keys"]
    S --> O[("Encrypted object")]
```

- Default for new objects unless another encryption configuration applies.
- Request header when explicitly specifying: `x-amz-server-side-encryption: AES256`.
- No separately managed customer KMS key policy required.

## SSE-KMS: Controlled Key Access

**S3 encrypts objects using data keys protected by AWS KMS.**

```mermaid
sequenceDiagram
    participant C as Client
    participant S as S3
    participant K as AWS KMS
    C->>S: PUT object (SSE-KMS)
    S->>K: GenerateDataKey / authorize
    K-->>S: Data key material for encryption
    S-->>C: Stored encrypted object
```

- **KMS key policies + IAM** matter in addition to S3 permissions.
- AWS CloudTrail can record supported **KMS API usage**.
- Header: `x-amz-server-side-encryption: aws:kms`.

## SSE-KMS: Throughput and Cost

**KMS requests may become an independent scaling constraint.**

```mermaid
flowchart LR
    R["Many S3 PUTs / GETs"] --> S["S3 with SSE-KMS"]
    S --> K{"KMS quotas + API calls"}
    K -->|"within limits"| O["Object access"]
    K -->|"throttled"| X["Backoff / capacity review"]
```

- Uploads can invoke **GenerateDataKey**, downloads can invoke **Decrypt**.
- Evaluate request rate, KMS quotas, API charges, and **S3 Bucket Keys** where supported.

## DSSE-KMS: Dual-Layer Encryption

**Two independent server-side encryption layers protect the same object.**

```mermaid
flowchart LR
    P["Plaintext"] --> K["KMS-backed encryption layer"]
    K --> S["Second S3-managed layer"]
    S --> O[("Stored ciphertext")]
```

- Designed for **requirements calling for two layers** of encryption.
- More key operations / cost considerations than ordinary SSE-S3.
- Header: `x-amz-server-side-encryption: aws:kms:dsse`.

## SSE-C: Customer-Provided Key

**Client supplies a key for server-side encryption on each relevant request.**

```mermaid
flowchart LR
    C["Client + customer key"] -->|"HTTPS + key headers"| S["S3 encrypts / decrypts"]
    S --> O[("Encrypted object")]
```

- S3 **does not retain the supplied key**; losing it can make data unreadable.
- Requires HTTPS; feature support varies by bucket type and API.
- **2026 update:** SSE-C is **disabled by default for new general-purpose buckets**; explicitly enable it if the workload requires it.
- [AWS: SSE-C default setting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-s3-c-encryption-setting-faq.html)

## Client-Side Encryption

**Encrypt locally before the object reaches S3; decrypt after download.**

```mermaid
flowchart LR
    P["Plaintext"] --> E["Client encrypts with key"]
    E --> C["Ciphertext"]
    C -->|"HTTPS upload"| S[("S3 bucket")]
```

- Key lifecycle and decryption are **client responsibilities**.
- Suited to workloads requiring encryption **before** cloud storage receives data.

## TLS and `aws:SecureTransport`

**Enforce HTTPS through an explicit bucket-policy deny for insecure transport.**

```mermaid
flowchart TD
    A["S3 request"] --> T{"aws:SecureTransport"}
    T -->|"false / HTTP"| D["Explicit DENY"]
    T -->|"true / HTTPS"| P["Continue authorization"]
```

- TLS protects **data in transit**, independently of object encryption at rest.
- `HTTPS` is necessary but **not sufficient** for authorization.

## Default Encryption vs Encryption Policy

**Default encryption encrypts new writes; policies can reject requests that fail explicit requirements.**

```mermaid
flowchart LR
    P["PUT request"] --> A{"Bucket policy checks"}
    A -->|"Allowed"| E["Default encryption / requested mode"]
    A -->|"Denied"| D["Reject request"]
    E --> O[("Stored encrypted object")]
```

- A policy that requires a **specific encryption header** can reject a request that default encryption would otherwise protect.
- Choose enforcement rules deliberately, particularly for SSE-KMS / key-ID requirements.

## S3 Access Points

**Access Points give separate names and resource policies for accessing one shared bucket.**

```mermaid
flowchart TB
    F["Finance role"] --> FA["Finance access point"]
    M["Marketing role"] --> MA["Marketing access point"]
    A["Analytics role"] --> AA["Analytics access point"]
    FA & MA & AA --> S[("Shared data lake bucket")]
```

- Simplify different **prefix, team, and network** access rules.
- They **do not copy data** or create independent buckets.
- Evaluate IAM, access-point, bucket, and endpoint policies together.

## Access Point Network Origins

**Internet-origin and VPC-origin access points restrict where requests may originate.**

```mermaid
flowchart LR
    P["Authorized public-network client"] --> I["Internet-origin AP"]
    V["Glue / EC2 in VPC"] --> E["S3 VPC endpoint"]
    E --> VP["VPC-origin AP"]
    I & VP --> S[("Bucket")]
```

- **Internet-origin ≠ publicly readable**; normal authorization still applies.
- **VPC-origin:** restrict to the designated VPC using supported S3 endpoints.

## S3 Access Points: Exam Checklist

| Question | Answer |
|---|---|
| Does each AP have its own policy? | **Yes** |
| Separate copy of data? | **No** |
| Unique AP endpoint/name? | **Yes** |
| Can it restrict network origin? | **Yes** |
| Does it bypass bucket policy / IAM? | **No** |

**Design principle:** use multiple managed access paths rather than a single unwieldy bucket policy.

## Amazon S3 Tables: Managed Iceberg Storage

**S3 Tables provides purpose-built table buckets and managed maintenance for Apache Iceberg.**

```mermaid
flowchart LR
    D["Structured / tabular datasets"] --> T[("S3 table bucket")]
    T --> I["Apache Iceberg tables"]
    I --> Q["Athena / Spark / Redshift / Glue"]
    M["Compaction / snapshot maintenance"] -.-> I
```

- Analytics-first storage with **table operations**, distinct from ordinary S3 object layouts.
- Catalog integration and supported engines supply the query interfaces.

## Apache Iceberg: Files + Transactional Metadata

**Iceberg is an open table format that manages large datasets stored as files.**

```mermaid
flowchart TB
    C["Catalog pointer"] --> M["Table metadata"]
    M --> S["Current snapshot"]
    S --> L["Manifest list / manifests"]
    L --> F["Parquet / other data files"]
```

- **ACID transactions**, snapshots, **time travel**, row-level updates/deletes (engine-dependent).
- **Schema / partition evolution** without rebuilding every historical file.
- Metadata-driven planning avoids naive directory scans.

## S3 Tables: Engine Interoperability

**Iceberg-compatible engines work through table metadata / catalog integration.**

```mermaid
flowchart LR
    A["Athena"] --> C["Glue Data Catalog / integration"]
    R["Redshift"] --> C
    G["Glue / EMR Spark"] --> C
    C --> T[("S3 Tables")]
    O["Supported Iceberg REST clients"] --> REST["Iceberg REST endpoint"] --> T
```

- **Interoperable** does not mean every feature works identically in every engine.
- Validate identity, catalog permissions, and engine-specific write operations.

## S3 Tables: Maintenance and Performance

**Managed table maintenance reduces repetitive Iceberg housekeeping.**

```mermaid
flowchart TB
    T[("Iceberg table")] --> C["Compaction: merge small files"]
    T --> S["Snapshot expiration"]
    T --> O["Unreferenced-object cleanup"]
    C & S & O --> P["Lower overhead / more predictable queries"]
```

- Request rates, table sizes, and maintenance costs still matter.
- Compare actual workloads instead of memorizing vendor benchmark multipliers.

## S3 Table Buckets and Namespaces

**Table buckets organize Iceberg tables under logical namespaces.**

```mermaid
flowchart TB
    B["Table bucket"] --> N1["sales namespace"]
    B --> N2["finance namespace"]
    N1 --> T1["orders table"]
    N1 --> T2["customers table"]
    N2 --> T3["ledger table"]
```

- Namespaces resemble database schemas; they are **not object-key folders**.
- S3 Tables has its own resource model / API namespace: **`s3tables`**.
- Permissions may apply at bucket, namespace, and table scopes as supported.

## S3 Tables Intelligent-Tiering

**Eligible files can move between immediate-access tiers based on inactivity.**

```mermaid
stateDiagram-v2
    [*] --> Frequent
    Frequent --> Infrequent: File not accessed for 30 days
    Infrequent --> ArchiveInstant: File not accessed for 90 days
    Infrequent --> Frequent: File accessed
    ArchiveInstant --> Frequent: File accessed
```

- **Tiering is per file**, so one table may span multiple tiers.
- These tiers retain **millisecond access**; not the same as Glacier restore workflows.
- [AWS: S3 Tables tiering](https://docs.aws.amazon.com/en_en/AmazonS3/latest/userguide/tables-intelligent-tiering.html)

## S3 Tables Replication

**Maintain read-only copies of Iceberg tables across table buckets.**

```mermaid
flowchart LR
    T[("Source Iceberg table")] --> R["Managed table replication"]
    R --> A[("Replica: Region A\nread-only")]
    R --> B[("Replica: Region B\nread-only")]
```

- Supports **same / cross-Region and account** destinations as configured.
- Replicas preserve table history and can have **independent snapshot retention**.
- Use for nearby reads, disaster recovery, compliance, and test analytics.
- [AWS: S3 Tables replication](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-replication-tables.html)

## S3 Tables Security and Governance

**Treat table access as a combination of IAM, table permissions, and analytics governance.**

```mermaid
flowchart TD
    U["Analytics user / engine"] --> I["IAM + s3tables permissions"]
    I --> G["Glue / Lake Formation governance"]
    G --> T[("Table bucket / Iceberg table")]
    SCP["Organization SCP"] -.-> I
    N["Private connectivity / endpoint policy"] -.-> I
```

- Supports **SSE-S3 / SSE-KMS**, organization controls, and private access configurations.
- **S3 Tables are not public-object hosting**; prefer tightly scoped access.

## S3 Storage Lens: Portfolio Visibility

**Storage Lens gives organization-wide metrics for cost, protection, and operational hygiene.**

```mermaid
flowchart LR
    B["Buckets / Regions / accounts"] --> L["Storage Lens"]
    L --> D["Dashboards"]
    L --> E["S3 CSV / Parquet exports"]
    D & E --> A["Investigate growth / waste / risk"]
```

- Filter/drill down by the supported account, bucket, Region and prefix scopes.
- Use **trends** and anomalies rather than raw totals alone.

## Storage Lens: Metric Families

| Family | Example signal | Question |
|---|---|---|
| **Summary** | Bytes, object count | What is growing? |
| **Cost** | Noncurrent bytes, incomplete uploads | What can be cleaned? |
| **Protection** | Versioning, encryption, replication | Which buckets lack controls? |
| **Access / events** | Ownership, notifications | How is storage configured? |
| **Activity / HTTP** | GET/PUT, 403/404 | How is it used / failing? |

**Free vs paid:** advanced metrics add detail, historical retention, and optional CloudWatch publishing; check the current feature tier.

## Amazon EBS: Persistent Block Storage

**EBS supplies network-attached block volumes for EC2 within an Availability Zone.**

```mermaid
flowchart TB
    subgraph AZA["Availability Zone A"]
      E["EC2 instance"] --> V1[("EBS root volume")]
      E --> V2[("EBS data volume")]
    end
    S[("EBS snapshot")] -.->|"Restore in another AZ"| V3[("New volume in AZ B")]
    V2 -->|"Create snapshot"| S
```

- Disk semantics: format, mount, and run filesystems/databases.
- Provision **capacity, IOPS and throughput** according to volume type.
- EBS is **not automatically a cross-AZ shared disk**.

## EBS Attachments and Lifecycle

**Volumes can survive compute replacement when deletion settings preserve them.**

```mermaid
flowchart LR
    E["EC2 terminated"] --> D{"DeleteOnTermination?"}
    D -->|"true"| X["Volume deleted"]
    D -->|"false"| P["Volume retained / reattach"]
```

- **Root volume:** commonly defaults to delete on termination.
- **Additional data volumes:** commonly default to retain, but verify launch/attachment settings.
- Typical volumes attach to one instance; **io1/io2 Multi-Attach** is a specific exception with cluster-aware application requirements.

## EBS Elastic Volumes

**Modify supported volume properties without replacing the disk first.**

```mermaid
flowchart LR
    A["Existing gp2 volume"] --> B["Modify volume"]
    B --> C["gp3 volume / larger size"]
    C --> D["Extend OS partition / filesystem if needed"]
```

- Increase size and adjust **volume type, IOPS, throughput** within supported limits.
- **Shrinking** an EBS volume is not supported in place.
- Performance tuning and filesystem expansion are separate tasks.

## Amazon EFS: Shared File Storage

**EFS is a managed NFS filesystem that multiple Linux clients can mount.**

```mermaid
flowchart TB
    subgraph A["AZ A"]
      EC1["EC2 / workload A"] --> MT1["EFS mount target"]
    end
    subgraph B["AZ B"]
      EC2["EC2 / workload B"] --> MT2["EFS mount target"]
    end
    MT1 & MT2 --> FS[("One shared EFS filesystem")]
```

- POSIX-style paths; compatible workloads access **the same files**.
- NFSv4.x, security groups, and mount permissions are key configuration points.
- Capacity expands automatically; charges depend on storage/throughput choices.

## EFS Performance and Throughput

**Separate file-system latency/throughput from storage-tier cost decisions.**

```mermaid
flowchart TD
    W{"Workload profile?"}
    W -->|"Unpredictable throughput"| E["Elastic throughput"]
    W -->|"Planned performance"| P["Provisioned throughput"]
    W -->|"Legacy size-linked pattern"| B["Bursting throughput"]
    W --> M["Evaluate performance mode / client behaviour"]
```

- **General Purpose:** latency-sensitive shared files.
- **Max I/O:** legacy performance-mode option; availability depends on creation and service support.
- Monitor throughput, operations, burst credits (if applicable), and client latency.

## EFS Lifecycle and Storage Classes

**Move colder files to cheaper storage without changing their path.**

```mermaid
flowchart LR
    S["EFS Standard"] -->|"Inactivity"| I["EFS Infrequent Access"]
    I -->|"Longer inactivity"| A["EFS Archive, where supported"]
    I & A -->|"Access policy"| S
```

- **Standard vs One Zone** expresses resilience / AZ placement.
- **Standard / IA / Archive** expresses access frequency and retrieval economics.
- Lifecycle and access policy choices determine transitions and read charges.

## EBS vs EFS vs S3

| Dimension | **S3** | **EBS** | **EFS** |
|---|---|---|---|
| Access | Object API | Block device | Shared NFS filesystem |
| Typical clients | Apps / analytics engines | EC2 / compatible compute | Multiple Linux clients |
| Sharing | By permissions | Usually one instance | Many instances |
| Placement | Bucket class / Region | Volume bound to AZ | Regional or One Zone filesystem |
| Best for | Lakes / archives / blobs | Instance disks / databases | Shared application files |

**Pattern:** S3 for historical data, EBS for local database disks, EFS for concurrently shared files.

## EBS Cross-AZ Migration

**Snapshot first, then restore the volume in the destination AZ.**

```mermaid
flowchart LR
    V1[("Volume: AZ A")] --> S["EBS snapshot"]
    S --> V2[("New volume: AZ B")]
    V2 --> E["Attach to EC2 in AZ B"]
```

- You **cannot directly attach** an AZ A volume to an EC2 instance in AZ B.
- Snapshots support restoration and disaster recovery; plan application-consistent backups where needed.

## AWS Backup: Centralized Protection

**AWS Backup coordinates supported resource backups without per-service scripts.**

```mermaid
flowchart LR
    subgraph Sources["Protected resources"]
      E["EBS / EC2"]
      D["RDS / DynamoDB"]
      F["EFS / S3 / other supported"]
    end
    E & D & F --> P["Backup plan + assignments"]
    P --> V[("Backup vault / recovery points")]
    V --> R["Restore / recovery testing"]
```

- Supports supported **cross-account / cross-Region copies** and **PITR** for eligible resources.
- Backup is not useful until **restore procedures are tested**.

## AWS Backup Plans

**A backup plan defines *what*, *when*, *where*, and *how long*.**

```mermaid
mindmap
  root((Backup plan))
    Resource assignment
      Tags or explicit selection
    Frequency and window
    Destination vault
    Retention period
    Cold-tier transitions
    Copy rules
```

- Backups may run **on-demand** or **scheduled**.
- Align policy with **RPO** (acceptable loss) and **RTO** (acceptable restoration delay).
- Recovery-point lifecycle rules depend on the protected resource and storage type.

## AWS Backup Vault Lock

**Vault Lock protects recovery points from premature deletion or retention changes.**

```mermaid
flowchart LR
    P["Recovery points"] --> V["Backup vault"]
    V --> L["Vault Lock policy"]
    L --> W["WORM-like retention enforcement"]
    W --> R["Recovery even after accidental / malicious delete attempts"]
```

- **Governance mode:** authorized administrators can change supported settings.
- **Compliance mode:** after its grace period, retention controls become immutable—even for the account root user.
- Plan grace periods and retention carefully before enforcement.

## Storage: Design Review Checklist

```mermaid
flowchart TB
    R["Storage design"] --> A["Access model + latency"]
    R --> B["Durability + AZ / Region recovery"]
    R --> C["IAM + encryption + network"]
    R --> D["Retention + lifecycle + cost"]
    R --> E["Events / automation + observability"]
    R --> F["Backup and restore validation"]
```

**Remember:** a low storage price is meaningless if retrieval, resilience, or recovery misses the workload requirement.

# Section Databases


## Traditional Architecture

**A conventional web tier scales behind a load balancer while a relational database holds shared state.**

- Traditional applications leverage RDBMS databases
- These databases have the SQL query language
- Strong requirements about how the data should be modeled
- Ability to do query joins, aggregations, complex computations
- Horizontal scaling (increasing reading capability by adding EC2 / RDS Read Replicas)

```mermaid
flowchart LR
  n0["Clients"]
  n1["Load balancer"]
  n2["Auto Scaling EC2 tier"]
  n3["RDS"]
  n0 -->|"requests"| n1
  n1 -->|"distribute"| n2
  n2 -->|"database queries"| n3
```


## NoSQL databases

**NoSQL databases use non-relational models—key-value, document, wide-column or graph—optimized for particular access patterns and scaling needs.**

- **Model around queries:** denormalized records and keys can reduce joins.
- **Capabilities vary:** some engines support aggregations, transactions and joins; do not assume uniform behavior.
- **Choose by workload:** latency, access pattern, relationships, consistency and cost.


## DynamoDB (NoSQL DBs)

**DynamoDB is a managed key-value/document database built for predictable low-latency access at scale.**

- **Design first:** partition and sort keys must match access patterns.
- **Scale:** managed capacity modes, IAM integration and Global Tables where needed.
- **Event driven:** DynamoDB Streams captures item changes.

```mermaid
flowchart LR
  A[Application] --> K[Partition-key lookup]
  K --> D[(DynamoDB table)]
  D --> S[Single-digit millisecond access]
  D -.-> E[DynamoDB Streams]
```


## DynamoDB — Tables and Items

**A DynamoDB table contains items identified by a primary key. Non-key attributes may differ between items.**

- **Item size:** maximum 400 KB.
- **Types:** scalar (String, Number, Binary, Boolean, Null); document (Map, List); sets (String, Number, Binary).
- **Schema:** define key attributes upfront; evolve other attributes as needed.


## DynamoDB — Simple Primary Key

**A table uses either a partition key alone or a partition key with a sort key. The combined key uniquely identifies an item in the second model.**

- **Option 1: Partition Key (HASH):** Partition key must be unique for each item; Partition key must be "diverse" so that the data is distributed; Example: "User_ID" for a users table

```mermaid
flowchart LR
  n0["Table"]
  n1["Partition key"]
  n2["Item attributes"]
  n0 ---|"primary key"| n1
  n0 ---|"non-key attributes"| n2
```


## DynamoDB — Composite Primary Key

**A composite key identifies an item by partition key plus sort key. Items with the same partition key form an ordered collection.**

- **Option 2: Partition Key + Sort Key (HASH + RANGE):** The combination must be unique for each item; Data is grouped by partition key; Example: users-games table, "User_ID" for Partition Key and "Game_ID" for Sort Key

```mermaid
flowchart LR
  n0["Partition key"]
  n1["Sort key A"]
  n2["Sort key B"]
  n3["Sort key C"]
  n0 ---|"item A"| n1
  n0 ---|"item B"| n2
  n0 ---|"item C"| n3
```


## DynamoDB – Partition Keys (Exercise)

**A good movie-table partition key distributes data and traffic while matching the required access pattern.**

- We're building a movie database
- **What is the best Partition Key to maximize data distribution?:** movie_id, producer_name, leader_actor_name, movie_language
- "movie_id" has the highest cardinality so it's a good candidate
- "movie_language" doesn't take many values and may be skewed towards English so it's not a great choice for the Partition Key


## DynamoDB use cases

**Choose DynamoDB for frequent, low-latency key-based operations with well-defined access patterns.**

- **Applications:** sessions, shopping carts, gaming and voting.
- **Operational data:** IoT device state, access records and metadata indexes.
- **Not ideal:** relational reporting, ad-hoc joins or large blobs; store large objects in S3.


## DynamoDB Anti Pattern

**DynamoDB is a poor default for workloads dominated by relational joins, infrequent large scans or large binary objects.**

- **Relational transactions/joins:** consider RDS or Aurora.
- **Large binary objects:** store bytes in S3 and index metadata in DynamoDB.
- **Ad-hoc OLAP:** use a data warehouse or analytics engine.


## DynamoDB capacity modes

**Provisioned capacity and on-demand capacity express different planning and billing choices.**

- Provisioned: configure RCU/WCU, optionally with Auto Scaling; suitable when capacity can be planned
- On-demand: pay for read/write requests and let the service manage throughput within its scaling behavior and quotas

```mermaid
flowchart TB
  A{Traffic predictable?} -->|Yes| B[Provisioned capacity]
  A -->|Variable or unknown| C[On-demand]
  B --> D[Configure RCU and WCU / autoscaling]
  C --> E[Pay per request; service scales capacity]
```

<!-- Source reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html -->


## Read Capacity Unit and Write Capacity Unit (RCU and WCU)

**Provisioned capacity sets read and write throughput explicitly. Calculate units from item size and read consistency, then decide whether to adjust capacity manually or through scaling.**

- Read Capacity Units (RCU) – throughput for reads
- Write Capacity Units (WCU) – throughput for writes
- Option to setup auto-scaling of throughput to meet demand
- Throughput can be exceeded temporarily using "Burst Capacity"
- If Burst Capacity has been consumed, you'll get a "ProvisionedThroughputExceededException"
- It's then advised to do an exponential backoff retry


## DynamoDB – Write Capacity Units (WCU)

**For standard provisioned writes, round item size up to whole KB, then multiply by writes per second.**

- **Formula:** WCUs = writes/s × ceil(item size ÷ 1 KB). Transactional writes use 2× capacity.
- **Example A:** 10 writes/s × 2 KB = **20 WCUs**.
- **Example B:** 6 writes/s × 4.5 KB (round to 5) = **30 WCUs**.
- **Example C:** 120 writes/min (2/s) × 2 KB = **4 WCUs**.

```mermaid
flowchart LR
  n0["Item size"]
  n1["Round up / 1 KB"]
  n2["Writes per second"]
  n3["Required WCU"]
  n0 -->|"ceiling"| n1
  n1 -->|"units per item"| n3
  n2 -->|"multiply"| n3
```


## DynamoDB — Read Consistency

**Eventually consistent reads may briefly return stale values. Strongly consistent reads return the latest successful write where supported.**

- **Default:** eventually consistent reads use less RCU capacity.
- **Strongly consistent:** use `ConsistentRead=true` for supported table and LSI operations; GSIs do not support strong reads.
- **Trade-off:** freshness requirements versus read throughput and cost.

```mermaid
flowchart LR
  n0["Application"]
  n1["Write path"]
  n2["Replica state"]
  n3["Read result"]
  n0 -->|"write"| n1
  n1 -->|"replication"| n2
  n2 -->|"consistency depends on read mode"| n3
```


## DynamoDB – Read Capacity Units (RCU)

**Provisioned read capacity rounds each item to a 4 KB unit; consistency changes the multiplier.**

- **Formula:** RCUs = reads/s × ceil(item size ÷ 4 KB) × multiplier.
- **Multipliers:** strong = 1; eventual = 0.5; transactional = 2.
- **Examples:** 10 strong reads/s of 4 KB → **10 RCUs**; 16 eventual reads/s of 12 KB → **24 RCUs**; 10 strong reads/s of 6 KB → **20 RCUs**.

```mermaid
flowchart LR
  n0["Item size"]
  n1["Round up / 4 KB"]
  n2["Read rate + consistency"]
  n3["Required RCU"]
  n0 -->|"ceiling"| n1
  n1 -->|"units per item"| n3
  n2 -->|"apply multiplier"| n3
```


## DynamoDB — Internal Partitions

**DynamoDB hashes partition-key values to distribute records. Uneven request rates may create hot physical partitions.**

- **Good key:** distribute traffic across many partition-key values, not only evenly distribute storage.
- **Watch:** hot keys, throttled requests, request-unit usage and item sizes.
- **Response:** revise access patterns, add safe caching or retries, and use adaptive capacity where applicable.

```mermaid
flowchart LR
  n0["Partition-key value"]
  n1["Hash function"]
  n2["Partition A"]
  n3["Partition B"]
  n4["Partition C"]
  n0 -->|"hash"| n1
  n1 -->|"placement"| n2
  n1 -->|"placement"| n3
  n1 -->|"placement"| n4
```


## DynamoDB — Throttling

**Throttling means a request exceeded an applicable capacity limit. Inspect hot keys, item sizes and configured capacity before choosing retries, redistribution or a read cache.**

- **Reasons:** Hot Keys – one partition key is being read too many times (e.g., popular item); Hot Partitions; Very large items, remember RCU and WCU depends on size of items
- **Solutions:** Exponential backoff when exception is encountered (already in SDK); Distribute partition keys as much as possible; If RCU issue, we can use DynamoDB Accelerator (DAX)


## DynamoDB — On-Demand Capacity

**On-demand billing removes explicit RCU/WCU provisioning, but hot partitions, quotas and rapid traffic changes can still throttle requests.**

- Hot partitions, table/account quotas, configured maximum throughput and rapid workload changes can still limit requests
- Billing uses read/write request units; the item-size and consistency multipliers still matter
- Compare actual utilization and prices instead of relying on a fixed price ratio

<!-- Source reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingThrottling.html -->


## DynamoDB — API Overview

**Use item APIs for individual records, Query for a partition-key access pattern, Scan for a broad examination, and batch APIs to group supported operations.**

```mermaid
flowchart LR
  A[DynamoDB operation] --> B[GetItem / PutItem / UpdateItem]
  A --> C[Query by partition key]
  A --> D[Scan table or index]
  A --> E[BatchGet / BatchWrite]
```


## DynamoDB – Writing Data

**DynamoDB write APIs differ in whether they replace an item, update attributes or perform grouped work.**

- **PutItem:** Creates a new item or fully replace an old item (same Primary Key); Consumes WCUs
- **UpdateItem:** Edits an existing item's attributes or adds a new item if it doesn't exist; Can be used to implement Atomic Counters – a numeric attribute that's unconditionally incremented
- **Conditional Writes:** Accept a write/update/delete only if conditions are met, otherwise returns an error; Helps with concurrent access to items; No performance impact


## DynamoDB – Reading Data

**GetItem reads by the complete primary key; use projections and consistency settings deliberately.**

- **GetItem:** Read based on Primary key · Primary Key can be HASH or HASH+RANGE · Eventually Consistent Read (default) · Option to use Strongly Consistent Reads (more RCU - might take longer) · ProjectionExpression can be specified to retrieve…


## DynamoDB – Reading Data (Query)

**Query selects one partition-key value and can narrow the sort-key range; a filter is applied after reading.**

- **Query returns items based on:** KeyConditionExpression · Partition Key value (must be = operator) – required · Sort Key value (=, <, <=, >, >=, Between, Begins with) – optional · FilterExpression · Additional filtering after the Query…
- **Returns:** The number of items specified in Limit; Or up to 1 MB of data
- Ability to do pagination on the results
- Can query table, a Local Secondary Index, or a Global Secondary Index


## DynamoDB – Reading Data (Scan)

**A Scan examines a broad set of items before applying its filter. Filtering the response does not avoid the read work already performed.**

- Returns up to 1 MB of data – use pagination to keep on reading
- Consumes a lot of RCU
- Limit impact using Limit or reduce the size of the result and pause
- **For faster performance, use Parallel Scan:** Multiple workers scan multiple data segments at the same time; Increases the throughput and RCU consumed; Limit the impact of parallel scans just like you would for Scans
- Can use ProjectionExpression & FilterExpression (no changes to RCU)


## DynamoDB – Deleting Data

**Deletion APIs remove individual or batched items; conditions help guard concurrent changes.**

- **DeleteItem:** Delete an individual item; Ability to perform a conditional delete
- **DeleteTable:** Delete a whole table and all its items; Much quicker deletion than calling DeleteItem on all items


## DynamoDB – Batch Operations

**Batch APIs reduce request overhead; partial failures must be retried. Batches are not atomic transactions.**

- **BatchWriteItem:** up to 25 puts/deletes, 16 MB total; no UpdateItem; retry `UnprocessedItems`.
- **BatchGetItem:** up to 100 keys, 16 MB; retry `UnprocessedKeys`.
- **Reliability:** use exponential backoff, handle duplicate execution, and use transactional APIs when atomicity is required.


## DynamoDB – PartiQL

**PartiQL offers SQL-like syntax for DynamoDB operations; it does not turn the table into a relational database or remove key-based access constraints.**

- Supported operations include SELECT, INSERT, UPDATE and DELETE
- A SELECT addresses one table or index; do not infer relational joins across DynamoDB tables
- A partition-key equality or IN condition can avoid a full scan; filtering only on other attributes can scan the table
- Submit supported statements through the console, NoSQL Workbench, CLI, SDK or DynamoDB APIs

<!-- Source reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ql-reference.select.html -->


## DynamoDB - Local Secondary Index

**An LSI retains the table's partition key and supplies another sort key. Plan it when creating the table because it cannot be added afterward.**

- Alternative Sort Key for your table (same Partition Key as that of base table)
- The Sort Key consists of one scalar attribute (String, Number, or Binary)
- Up to 5 Local Secondary Indexes per table
- Must be defined at table creation time
- Attribute Projections – can contain some or all the attributes of the base table (KEYS_ONLY, INCLUDE, ALL)

```mermaid
flowchart LR
  n0["Base table partition key"]
  n1["Base sort key"]
  n2["LSI alternate sort key"]
  n0 ---|"base order"| n1
  n0 ---|"alternate order"| n2
```


## DynamoDB — Global Secondary Index (GSI)

**A GSI provides another partition-key and optional sort-key access path. Its projections and capacity behavior are separate design choices from the base table.**

- Alternative Primary Key (HASH or HASH+RANGE) from the base table
- Speed up queries on non-key attributes
- The Index Key consists of scalar attributes (String, Number, or Binary)
- Attribute Projections – some or all the attributes of the base table (KEYS_ONLY, INCLUDE, ALL)
- Must provision RCUs & WCUs for the index

```mermaid
flowchart LR
  n0["Base table"]
  n1["GSI partition key"]
  n2["GSI sort key"]
  n3["Projected attributes"]
  n0 ---|"alternate access pattern"| n1
  n1 ---|"optional ordering"| n2
  n1 ---|"index projection"| n3
```


## DynamoDB — Index Capacity & Throttling

**Index capacity and hot keys can constrain table writes as well as index queries.**

- **Global Secondary Index (GSI):** If the writes are throttled on the GSI, then the main table will be throttled!; Even if the WCU on the main tables are fine; Choose your GSI partition key carefully!; Assign your WCU capacity carefully!
- **Local Secondary Index (LSI):** Uses the WCUs and RCUs of the main table; No special throttling considerations


## DynamoDB PartiQL operations

**PartiQL expresses supported item operations with familiar SQL-like statements. Batch execution is separate from a relational join across tables.**

- **Supports some (but not all) statements:** INSERT, UPDATE, SELECT, DELETE
- It supports Batch operations


## DynamoDB Accelerator (DAX)

**DAX caches DynamoDB reads to reduce response latency and repeated read traffic. It helps read-heavy access patterns rather than increasing write capacity.**

- Fully-managed, highly available, seamless in- memory cache for DynamoDB
- 5 minutes TTL for cache (default)
- Up to 10 nodes in the cluster
- Multi-AZ (3 nodes minimum recommended for production)
- Secure (Encryption at rest with KMS, VPC, IAM, CloudTrail, …)

```mermaid
flowchart LR
  n0["Application"]
  n1["DAX cluster"]
  n2["DynamoDB"]
  n0 -->|"DAX client request"| n1
  n1 -->|"miss / write-through"| n2
```


## DAX vs ElastiCache

**Use DAX for DynamoDB-compatible item and query caching. Use an application-managed cache when you need to store independently computed results, such as aggregates.**

- Example: cache a computed aggregate in an application cache when it will be read many times, rather than expecting DAX to compute that aggregate

```mermaid
flowchart LR
  n0["Application"]
  n1["DAX"]
  n2["DynamoDB"]
  n3["ElastiCache"]
  n0 -->|"item / query cache"| n1
  n1 -->|"table access"| n2
  n0 -->|"aggregate-result cache"| n3
```


## DynamoDB Streams

**DynamoDB Streams records item changes for consumers that react to inserts, updates and deletes. Retention and item-image selection shape what a consumer can reconstruct.**

- DynamoDB Streams retains changes for 24 hours and preserves modification order for each item
- Lambda or a supported Streams adapter can process the change records
- Kinesis Data Streams for DynamoDB is a separate change-capture option; it is not an automatic destination appended to DynamoDB Streams
- Applications can use changes to send notifications, maintain derived tables or feed search and analytics systems through an appropriate processing path
- Consumer retries still require safe handling of repeated processing

```mermaid
flowchart LR
  n0["DynamoDB table<br/>Create · update · delete"]
  n1["DynamoDB Streams<br/>Ordered change records"]
  n2["AWS Lambda<br/>Event source mapping"]
  n3["Analytics<br/>Kinesis or data lake"]
  n4["Search index<br/>OpenSearch"]
  n0 -->|"item changes"| n1
  n1 -->|"read batches"| n2
  n2 -->|"process"| n3
  n2 -->|"index"| n4
```

<!-- Source reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/streamsmain.html -->


## DynamoDB change-capture paths

**DynamoDB change capture has separate Streams and Kinesis integration paths; downstream consumers process changes asynchronously.**

```mermaid
flowchart TB
  n0["DynamoDB table"]
  n1["DynamoDB Streams"]
  n2["Lambda / Streams consumer"]
  n3["SNS / downstream table"]
  n4["Kinesis Data Streams"]
  n5["Data Firehose"]
  n6["S3 / Redshift / OpenSearch"]
  n0 -->|"change records"| n1
  n1 -->|"poll / process"| n2
  n2 -->|"application output"| n3
  n0 -->|"Kinesis streaming destination"| n4
  n4 -->|"delivery input"| n5
  n5 -->|"configured destination"| n6
```


## DynamoDB stream images

**StreamViewType selects keys, the old item image, the new image or both. Choose the information that downstream processing needs before enabling change capture.**

- KEYS_ONLY: primary-key attributes
- NEW_IMAGE: the item after the change
- NEW_AND_OLD_IMAGES: both versions
- DynamoDB manages the stream's shards; enabling a stream does not backfill earlier table changes


## DynamoDB Streams & AWS Lambda

**A Lambda event source mapping polls DynamoDB Streams and invokes the function with batches. Give the function the required stream permissions and handle retries safely.**

- You need to define an Event Source Mapping to read from a DynamoDB Streams
- You need to ensure the Lambda function has the appropriate permissions
- Your Lambda function is invoked synchronously

```mermaid
flowchart LR
  n0["DynamoDB"]
  n1["Streams shards"]
  n2["Lambda event source mapping"]
  n3["Lambda function"]
  n0 -->|"changes"| n1
  n1 -->|"poll batches"| n2
  n2 -->|"invoke"| n3
```


## DynamoDB – Time To Live (TTL)

**TTL marks items for eventual deletion using an epoch-time Number attribute. Expiration is not an immediate access-control or deletion boundary.**

- Automatically delete items after an expiry timestamp
- Doesn't consume any WCUs (i.e., no extra cost)
- The TTL attribute must be a "Number" data type with "Unix Epoch timestamp" value
- Expired items deleted within few days of expiration
- Expired items, that haven't been deleted, appears in reads/queries/scans (if you don't want them, filter them out)

```mermaid
flowchart LR
  n0["TTL attribute"]
  n1["Background expiry"]
  n2["Item deletion"]
  n3["DynamoDB Streams"]
  n0 -->|"expiry timestamp"| n1
  n1 -->|"asynchronous removal"| n2
  n2 -->|"deletion record"| n3
```


## DynamoDB + S3 — Large Object Pattern

**Keep large object bytes in S3 and store their identifiers or searchable metadata in DynamoDB. This separates blob storage from low-latency metadata access.**

- The related metadata-indexing example uses S3 for the object and DynamoDB for the fields needed to find or describe it

```mermaid
flowchart LR
  n0["Application"]
  n1["S3 object"]
  n2["DynamoDB metadata"]
  n3["Download client"]
  n0 -->|"upload bytes"| n1
  n0 -->|"store object reference"| n2
  n2 -->|"lookup location"| n3
  n1 -->|"download authorized object"| n3
```


## DynamoDB – Indexing S3 Objects Metadata

**An S3 event can trigger metadata extraction into DynamoDB, which an API queries independently of the object download.**

```mermaid
flowchart LR
  n0["S3 upload"]
  n1["Lambda"]
  n2["DynamoDB metadata"]
  n3["Query API"]
  n4["Client"]
  n0 -->|"object event"| n1
  n1 -->|"extract / write"| n2
  n4 -->|"metadata request"| n3
  n3 -->|"query"| n2
```


## DynamoDB security and other features

**DynamoDB access combines IAM authorization, network access, encryption and recovery features. Apply fine-grained restrictions where clients access their own records directly.**

- **Security:** VPC Endpoints available to access DynamoDB without using the Internet; Access fully controlled by IAM; Encryption at rest using AWS KMS and in-transit using SSL/TLS
- **Backup and Restore feature available:** Point-in-time Recovery (PITR) like RDS; No performance impact
- **Global Tables:** Multi-region, multi-active, fully replicated, high performance
- **DynamoDB Local:** Develop and test apps locally without accessing the DynamoDB web service (without Internet)
- AWS Database Migration Service (AWS DMS) can be used to migrate to DynamoDB (from MongoDB, Oracle, MySQL, S3, …)


## DynamoDB – Users Interact with DynamoDB Directly

**Federated identity obtains temporary AWS credentials; IAM policies then authorize the DynamoDB request.**

```mermaid
flowchart LR
  n0["Identity provider"]
  n1["Federation / STS"]
  n2["Temporary credentials"]
  n3["DynamoDB"]
  n0 -->|"authenticated identity"| n1
  n1 -->|"assume permitted role"| n2
  n2 -->|"signed authorized request"| n3
```


## DynamoDB – Fine-Grained Access Control

**Temporary credentials and IAM conditions can restrict direct client access to a user's own keys and attributes. Authentication alone does not establish that data boundary.**

- You can assign an IAM Role to these users with a Condition to limit their API access to DynamoDB
- LeadingKeys – limit row-level access for users on the Primary Key
- Attributes – limit specific attributes the user can see


## Amazon RDS - Hosted relational Database

**Amazon RDS operates managed relational databases for applications that need SQL, transactions and relational constraints.**

- **Engines:** PostgreSQL, MySQL, MariaDB, Oracle, SQL Server; Aurora is AWS’s compatible managed database family.
- **Typical workload:** OLTP, indexes, ACID transactions and application data.
- **Analytics:** export or replicate large analytical workloads to services such as Redshift or S3 when appropriate.


## ACID

**ACID means atomicity, consistency, isolation and durability; transactions preserve these properties within the engine's documented guarantees.**

- **RDS databases offer full ACID compliance:** Atomicity, Consistency, Isolation, Durability

```mermaid
flowchart TB
  T[Database transaction] --> A[Atomicity: all or nothing]
  T --> C[Consistency: preserve constraints]
  T --> I[Isolation: control concurrent work]
  T --> D[Durability: committed changes persist]
```


## Aurora engine and storage model

**Aurora provides MySQL- and PostgreSQL-compatible engines with a distributed managed storage layer.**

- Up to 5X faster than MySQL, 3X faster than PostgreSQL
- 1/10 the cost of commercial databases
- Up to 128TB per database volume
- Up to 15 read replicas
- Supports Row Level Security
- Do not integrate with Amazon Cognito for authentication over amazon.com


## Aurora Security

**Aurora security combines network isolation, database identity, encryption and optional IAM authentication.**

- VPC network isolation
- **At-rest with KMS:** Data, backup, snapshots, and replicas can be encrypted
- In-transit with SSL


## Relational database concurrency and locks

**Locking coordinates concurrent transactions; the actual conflict rules depend on the engine and isolation level.**

- Locks can apply to rows, ranges, tables or other resources, depending on the operation
- Shared and exclusive modes describe compatibility with other locks; they do not universally describe all snapshot-read behavior
- MVCC can let ordinary reads observe a consistent snapshot while another transaction holds a write lock. See the MySQL locking example below


## Relational Database Locking Commands

**Use engine-specific locking commands to coordinate concurrent operations. Distinguish locking reads from ordinary MVCC snapshot reads and plan for deadlock retries.**

- MySQL LOCK TABLES / UNLOCK TABLES are explicit table-lock operations
- SELECT ... FOR SHARE and FOR UPDATE request locking reads inside a transaction
- Do not infer that FOR UPDATE blocks all ordinary reads: MVCC may serve nonlocking snapshot reads
- Keep transactions short, acquire locks in a consistent order and handle deadlock retries

<!-- Source reference: https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html -->


## RDS Best Practices — Review Prompt

**Focus:** RDS best practices: unexpanded source heading — understand the key capabilities, constraints, and trade-offs.

- Unexpanded source area: retain it as a review prompt. Do not attribute invented recommendations to this slide


## RDS Operational guidelines

**Operate RDS from measurements: watch memory, CPU, storage and replica lag, maintain appropriate DNS behavior and tune the working set and queries.**

- Perform automatic backups during daily low in write IOPS
- **Insufficient I/O will make recovery after failure slow.:** Migrate to DB instance with more I/O; Move to General Purpose or Provisioned IOPS storage
- Set TTL on DNS for your DB instances to 30 seconds or less from your apps
- Test failover before you need it
- **Provision enough RAM to include your entire working set:** If your ReadIOPS metric is small and stable, you're good
- Rate limits in Amazon API Gateway can be used to protect your database


## Amazon RDS — Query Optimization

**Query plans, selective indexes and workload measurements guide relational-query optimization.**

- **Use indexes to accelerate SELECT statements:** Use EXPLAIN plans to identify the indexes you need
- Avoid full table scans
- Use ANALYZE TABLE periodically
- Simplify WHERE clauses
- Engine-specific optimizations


## RDS — MySQL & PostgreSQL Tuning

**Database tuning mechanisms are engine-specific; use the chosen engine's guidance and evaluate the durability and availability tradeoffs of bulk-load settings.**

- **MySQL/MariaDB: keep active indexes in memory and use InnoDB. The documented table-file limit is 16 TiB; partition large tables well below that size.:** Tables above 100 GB can make some operations expensive. Fewer than 10,000 tables is…
- PostgreSQL bulk loads may benefit from tuning maintenance_work_mem, max_wal_size and checkpoint_timeout
- Disabling backups, Multi-AZ, synchronous_commit or autovacuum changes protection or behavior. Treat such changes as a controlled load procedure with explicit recovery requirements and restoration of normal settings afterward
- Keep ordinary maintenance, including appropriate autovacuum behavior, part of the production configuration

<!-- Source reference: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html -->


## RDS — SQL Server & Oracle Considerations

**SQL Server tuning and administration options differ from MySQL-family settings.**

- **SQL Server:** Use RDS DB Events to monitor failovers; Do not enable simple recover mode, offline mode, or read-only mode (this breaks Multi-AZ); Deploy into all AZ's
- Oracle is its own beast


## Amazon Aurora

**Aurora combines MySQL- or PostgreSQL-compatible compute with a managed distributed storage layer. Separate engine compatibility from storage, replica and recovery behavior.**

- Postgres and MySQL are both supported as Aurora DB (that means your drivers will work as if Aurora was a Postgres or MySQL database)
- Aurora is "AWS cloud optimized" and claims 5x performance improvement over MySQL on RDS, over 3x the performance of Postgres on RDS
- Aurora storage automatically grows in increments of 10GB, up to 256 TB
- Aurora can have up to 15 replicas and the replication process is faster than MySQL (sub 10 ms replica lag)
- Failover in Aurora is instantaneous. It's HA (High Availability) native
- Aurora costs more than RDS (20% more) – but is more efficient


## High Availability and Read Scaling

**Aurora's storage replicas protect data, while database replicas provide read capacity and failover targets. These are related but different forms of replication.**

- **6 copies of your data across 3 AZ:** 4 copies out of 6 needed for writes; 3 copies out of 6 need for reads; Self healing with peer-to-peer replication; Storage is striped across 100s of volumes
- One Aurora Instance takes writes (master)
- Automated failover for master in less than 30 seconds
- Master + up to 15 Aurora Read Replicas serve reads
- Support for Cross Region Replication

```mermaid
flowchart LR
  n0["Aurora writer"]
  n1["AZ A<br/>2 storage copies"]
  n2["AZ B<br/>2 storage copies"]
  n3["AZ C<br/>2 storage copies"]
  n0 -->|"distributed storage"| n1
  n0 -->|"distributed storage"| n2
  n0 -->|"distributed storage"| n3
```


## Aurora DB Cluster

**The writer endpoint follows the current writer. The reader endpoint distributes connections across eligible readers; it does not split every query inside one connection.**

```mermaid
flowchart LR
  n0["Writer endpoint"]
  n1["Primary instance"]
  n2["Reader endpoint"]
  n3["Read replicas"]
  n4["Shared cluster volume"]
  n0 -->|"writes"| n1
  n2 -->|"read connections"| n3
  n1 -->|"storage"| n4
  n3 -->|"storage"| n4
```


## Features of Aurora

**Aurora availability, scaling and recovery features address different operational requirements.**

- Automatic fail-over
- Backup and Recovery
- Isolation and security
- Industry compliance
- Push-button scaling
- Backtrack: restore data at any point of time without using backups


## Amazon Aurora as a Vector Store

**The pgvector extension stores embeddings and supports vector-distance queries in compatible PostgreSQL databases.**

- **pgvector extension:** Creates a new "vector" column type; Can compute cosine, L2, or inner product distances; Also adds vector operators for SQL; This gives it an advantage over OpenSearch if you need complex filtering logic and stuff
- Allows you to store structured and vector data in the same place
- Can be appropriate for small / medium RAG systems with mostly structured data

```mermaid
flowchart LR
  n0["Text / other content"]
  n1["Embedding model"]
  n2["PostgreSQL + pgvector"]
  n3["Similarity query"]
  n0 -->|"encode"| n1
  n1 -->|"store vectors"| n2
  n3 -->|"nearest-neighbor search"| n2
```


## DocumentDB (MongoDB) NoSQL

**DocumentDB provides a managed document database with MongoDB compatibility. Check application and feature compatibility instead of assuming it is the same product as MongoDB.**

- DocumentDB is the same for MongoDB (which is a NoSQL database)
- MongoDB is used to store, query, and index JSON data
- Similar "deployment concepts" as Aurora
- Fully Managed, highly available with replication across 3 AZ
- DocumentDB storage automatically grows in increments of 10GB
- Automatically scales to workloads with millions of requests per seconds


## MemoryDB for Redis

**MemoryDB combines an in-memory data model with durable storage, making it distinct from using a disposable cache in front of another database.**

- Redis-compatible, durable, in-memory database service
- Ultra-fast performance with over 160 millions requests/second
- Durable in-memory data storage with Multi-AZ transactional log
- Scale seamlessly from 10s GBs to 100s TBs of storage
- Use cases: web and mobile apps, online gaming, media streaming, …

```mermaid
flowchart LR
  n0["Microservices"]
  n1["MemoryDB in-memory data"]
  n2["Multi-AZ transaction log"]
  n0 -->|"read / write"| n1
  n1 -->|"durable writes"| n2
```


## Amazon Keyspaces (For Apache Cassandra) NoSQL

**Keyspaces provides a managed Cassandra-compatible database accessed through CQL. It fits applications built around Cassandra's partitioned data model.**

- A managed Apache Cassandra-compatible database service
- Serverless, Scalable, highly available, fully managed by AWS
- Tables are replicated 3 times across multiple AZ
- Capacity: On-demand mode or provisioned mode with auto-scaling
- Encryption, backup, Point-In-Time Recovery (PITR) up to 35 days
- Use cases: store IoT devices info, time-series data, …


## Amazon Neptune

**Neptune stores connected data as a graph. Choose graph models and query languages from the relationships and traversals the application needs.**

- Fully managed graph database
- **A popular graph dataset would be a social network:** Users have friends, Posts have comments, Comments have likes from users, Users share and like posts…
- Highly available across 3 AZ, with up to 15 read replicas
- Build and run applications working with highly connected datasets – optimized for these complex and hard queries
- Can store up to billions of relations and query the graph with milliseconds latency

```mermaid
flowchart LR
  n0["Person A"]
  n1["Person B"]
  n2["Company"]
  n3["Place"]
  n0 ---|"knows"| n1
  n0 ---|"works at"| n2
  n1 ---|"lives in"| n3
```


## Amazon Neptune — Query Languages

**A graph statement connects a subject to an object through a predicate; RDF and property graphs use different models and query languages.**

- Supported graph query languages: Gremlin, openCypher, SPARQL

```mermaid
flowchart LR
  n0["Subject"]
  n1["Object"]
  n2["Graph model"]
  n3["Query language"]
  n0 ---|"predicate"| n1
  n2 ---|"model-specific traversal"| n3
```


## Amazon Timestream

**Timestream stores time-indexed observations for analytical queries. Its time-series model differs from a general relational or key-value database.**

- Automatically scales up/down to adjust capacity
- thousands times faster & 1/10th the cost of relational databases
- Scheduled queries, multi-measure records, SQL compatibility
- Data storage tiering: recent data kept in memory and historical data kept in a cost-optimized storage
- Encryption in transit and at rest
- Use cases: IoT apps, operational applications, real- time analytics, …


## Amazon Timestream — Architecture

**Timestream ingests time-series observations through supported APIs and connectors, then serves analytical queries to visualization tools.**

```mermaid
flowchart LR
  n0["IoT / applications"]
  n1["Kinesis / MSK"]
  n2["Managed Flink / Lambda"]
  n3["Timestream"]
  n4["Grafana / QuickSight / JDBC"]
  n0 -->|"direct writes"| n3
  n1 -->|"stream processing"| n2
  n2 -->|"write measurements"| n3
  n3 -->|"query results"| n4
```


## Amazon Redshift

**Amazon Redshift is a columnar, parallel SQL data warehouse optimized for large analytical scans, joins and aggregations.**

- **Use cases:** BI dashboards, historical analysis and enterprise reporting.
- **Execution:** massively parallel processing (MPP), column-oriented storage and compression.
- **Not designed for:** high-frequency row-level OLTP or storing large media objects.


## Redshift Use-Cases

**Redshift targets analytical workloads that benefit from a managed columnar warehouse.**

- Accelerate analytics workloads
- Unified data warehouse & data lake
- Data warehouse modernization
- Analyze global sales data
- Store historical stock trade data
- Analyze ad impressions & clicks


## Redshift architecture

**In a provisioned Redshift cluster, the leader coordinates SQL work across compute nodes and slices; node families in the slide are historical examples.**

```mermaid
flowchart LR
  n0["SQL clients"]
  n1["Leader node"]
  n2["Compute node A<br/>Slices"]
  n3["Compute node B<br/>Slices"]
  n0 -->|"SQL"| n1
  n1 -->|"parallel plan"| n2
  n1 -->|"parallel plan"| n3
```


## Redshift Spectrum

**Redshift Spectrum extends SQL queries to cataloged data in S3 without loading every file into warehouse tables.**

- **Architecture:** Redshift SQL → catalog schema → external S3 data.
- **Use for:** joining internal warehouse facts with lake datasets.
- **Performance:** choose partition pruning and columnar formats to reduce external scans.

```mermaid
flowchart LR
  n0["S3 data lake"]
  n1["External catalog"]
  n2["Redshift Spectrum"]
  n3["Athena"]
  n1 -->|"table metadata"| n2
  n1 -->|"table metadata"| n3
  n0 -->|"scan external data"| n2
  n0 -->|"scan external data"| n3
```


## Redshift Performance

**Redshift combines parallel execution, columnar storage and query optimization for analytics.**

- Massively Parallel Processing (MPP)
- Columnar Data Storage
- Column Compression


## Redshift Durability

**Redshift uses redundant storage and snapshots to protect warehouse data. Recovery planning still needs snapshot retention, copy permissions and restoration procedures.**

- Replication within cluster
- **Backup to S3:** Asynchronously replicated to another region
- Automated snapshots
- Failed drives / nodes automatically replaced
- **However – limited to a single availability zone (AZ):** Multi-AZ for RA3 clusters now available


## Scaling Redshift

**Redshift scaling changes compute capacity; choose the mechanism that fits the cluster and disruption tolerance.**

- Vertical and horizontal scaling on demand
- **During scaling:** A new cluster is created while your old one remains available for reads; CNAME is flipped to new cluster (a few minutes of downtime); Data moved in parallel to new compute nodes


## Redshift Distribution Styles

**Distribution style controls placement of rows and the data movement needed for joins.**

- **AUTO:** Redshift figures it out based on size of data
- **EVEN:** Rows distributed across slices in round-robin
- **KEY:** Rows distributed based on one column
- **ALL:** Entire table is copied to every node

```mermaid
flowchart TB
  T[Table rows] --> A[AUTO: optimizer chooses]
  T --> E[EVEN: round robin]
  T --> K[KEY: hash selected column]
  T --> L[ALL: full copies on nodes]
```


## EVEN distribution

**EVEN distribution spreads rows across slices without selecting a distribution key.**

```mermaid
flowchart LR
  n0["Rows"]
  n1["Slice A"]
  n2["Slice B"]
  n3["Slice C"]
  n0 -->|"round robin"| n1
  n0 -->|"round robin"| n2
  n0 -->|"round robin"| n3
```


## KEY distribution

**KEY distribution hashes the chosen column; matching join keys can colocate rows, while skewed keys can overload one slice.**

```mermaid
flowchart LR
  n0["Distribution-key value"]
  n1["Hash"]
  n2["Slice A"]
  n3["Slice B"]
  n4["Slice C"]
  n0 -->|"hash key"| n1
  n1 -->|"placement"| n2
  n1 -->|"placement"| n3
  n1 -->|"placement"| n4
```


## ALL distribution

**ALL distribution copies the complete table to every compute node, trading storage and load cost for fewer redistributions.**

```mermaid
flowchart LR
  n0["Small dimension table"]
  n1["Node A full copy"]
  n2["Node B full copy"]
  n3["Node C full copy"]
  n0 -->|"replicate"| n1
  n0 -->|"replicate"| n2
  n0 -->|"replicate"| n3
```


## Importing / Exporting data

**Redshift bulk movement typically uses COPY for loading and UNLOAD for exporting query results.**

- **COPY:** parallel loading from supported sources such as S3; manifests are optional for supported scenarios.
- **UNLOAD:** export query results to S3, including columnar Parquet.
- **Other ingestion:** streaming integrations and supported zero-ETL paths.
- **Security:** configure IAM roles, object permissions and network routes.


## COPY command: More depth

**COPY loads data in bulk from supported sources. Plan file layout, permissions, compression and error handling for parallel warehouse ingestion.**

- **If your data is already in Redshift in another table,:** Use INSERT INTO …SELECT, Or CREATE TABLE AS
- **COPY can decrypt data as it is loaded from S3:** Hardware-accelerated SSL used to keep it fast
- Gzip, lzop, and bzip2 compression supported to speed it up further
- **Automatic compression option:** Analyzes data being loaded and figures out optimal compression scheme for storing it
- **Special case: narrow tables (lots of rows, few columns):** Load with a single COPY transaction if possible; Otherwise hidden metadata columns consume too much space


## Redshift copy grants for cross-region snapshot copies

**An encrypted snapshot copy needs the correct destination-Region key and copy grant. Data replication and permission to use an encryption key are separate concerns.**

- You want to copy that snapshot to another region for backup
- **In the destination AWS region:** Create a KMS key if you don't have one already; Specify a unique name for your snapshot copy grant; Specify the KMS key ID for which you're creating the copy grant
- **In the source AWS region:** Enable copying of snapshots to the copy grant you just created


## DBLINK

**The source notes mention PostgreSQL DBLINK; Redshift uses its documented federated-query mechanisms for supported external RDS/Aurora access.**

- **Distinguish:** PostgreSQL extensions are not automatically supported as Redshift data-ingestion tools.
- **Pattern:** use federated queries or dedicated ingestion/replication according to workload and supported source.


## Integration with other services

**Redshift integrations cover data ingestion, catalog access, visualization and model training through different mechanisms.**

- S3
- DynamoDB
- EMR / EC2
- Database Migration Service
- AWS Glue Connector for Redshift


## Redshift Workload Management (WLM)

**WLM assigns query workloads to execution resources so short interactive work and longer analytical jobs can be governed deliberately.**

- Query queues
- Via console, CLI, or API

```mermaid
flowchart LR
  A[SQL requests] --> B[WLM priorities and queues]
  B --> C[Query execution resources]
  B -.-> D[Concurrency scaling where eligible]
```


## Concurrency Scaling

**Concurrency Scaling supplies additional supported query capacity during bursts. Eligibility and usage charges determine how it fits the workload.**

- Support virtually unlimited concurrent users & queries
- WLM queues manage which queries are sent to the concurrency scaling cluster


## Automatic Workload Management

**Automatic workload management allocates execution resources across configured query workloads.**

- Creates up to 8 queues
- Default 5 queues with even memory allocation
- Large queries (ie big hash joins) -> concurrency lowered
- Small queries (ie inserts, scans, aggregations) -> concurrency raised
- **Configuring query queues:** Priority · Concurrency scaling mode · User groups · Query groups · Query monitoring rules


## Manual Workload Management

**Manual WLM uses configured queues and concurrency settings. Queue allocation trades simultaneous execution against the memory available to each query.**

- Superuser queue with concurrency level 1
- **Define up to 8 queues, up to concurrency level 50:** Each can have defined concurrency scaling mode, concurrency level, user groups, query groups, memory, timeout, query monitoring rules; Can also enable query queue hopping; Timed out queries…


## Short Query Acceleration (SQA)

**Short Query Acceleration gives eligible short queries a separate execution path so they spend less time waiting behind longer work.**

- Short queries run in a dedicated space, won't wait in queue behind long queries
- Can be used in place of WLM queues for short queries
- **Works with:** CREATE TABLE AS (CTAS); Read-only queries (SELECT statements)
- Uses machine learning to predict a query's execution time
- Can configure how many seconds is "short"


## Resizing Redshift Clusters

**Elastic and classic resize have different constraints and interruption characteristics.**

- **Elastic resize:** Quickly add or remove nodes of same type · (It *can* change node types, but not without dropping connections – it creates a whole new cluster) · Cluster is down for a few minutes · Tries to keep connections open across the…
- **Classic resize:** Change node type and/or number of nodes; Cluster is read-only for hours to days
- **Snapshot, restore, resize:** Used to keep cluster available during a classic resize; Copy cluster, resize new cluster


## VACUUM command

**VACUUM reclaims deleted space or restores sorting according to the chosen operation. Use the table's maintenance needs and supported automatic behavior to decide when to run it.**

- VACUUM FULL
- **VACUUM DELETE ONLY:** Skips the sort
- **VACUUM SORT ONLY:** Does not reclaim space!
- **VACUUM REINDEX:** Re-analyzes distribution of sort key columns; Then does a full VACUUM


## Newer Redshift features

**Separate compute/storage and serverless features change capacity and administration choices; check support for the selected deployment.**

- **RA3 nodes with managed storage:** Enable independent scaling of compute and storage; SSD-based
- **Redshift data lake export:** Unload Redshift query to S3 in Apache Parquet format; Parquet is 2x faster to unload and consumes up to 6X less storage; Compatible with Redshift Spectrum, Athena, EMR, SageMaker; Automatically partitioned
- **Spatial data types:** GEOMETRY, GEOGRAPHY
- **Cross-Region Data Sharing:** Share live data across Redshift clusters without copying; Requires new RA3 node type; Secure, across regions and across accounts


## Amazon Redshift ML

**Redshift ML creates a model from SQL-selected training data using SageMaker; SQL functions then expose supported inference.**

```mermaid
flowchart LR
  n0["Redshift training query"]
  n1["CREATE MODEL"]
  n2["SageMaker training"]
  n3["Prediction function"]
  n4["SQL inference"]
  n0 -->|"select features / target"| n1
  n1 -->|"managed training"| n2
  n2 -->|"deploy model"| n3
  n3 -->|"predict"| n4
```


## Redshift anti-patterns

**A warehouse is usually a poor fit for tiny workloads or transactional access patterns that do not need analytical scans.**

- **Small data sets:** Use RDS instead
- **OLTP:** Use RDS or DynamoDB instead
- **Unstructured data:** ETL first with EMR etc
- **BLOB data:** Store references to large binary files in S3, not the files themselves


## Redshift security concerns

**Redshift security requires appropriate encryption, identity permissions and private/public network access controls.**

- **Using a Hardware Security Module (HSM):** Must use a client and server certificate to configure a trusted connection between Redshift and the HSM; If migrating an unencrypted cluster to an HSM-encrypted cluster, you must create the new…
- **Defining access privileges for user or group:** Use the GRANT or REVOKE commands in SQL; Example: grant select on table foo to bob;


## Redshift Serverless — Compute Model

**Serverless manages warehouse compute provisioning around the workload. Data organization, authorization and cost controls remain design responsibilities.**

- **Optimizes costs & performance:** Pay only when in use
- Uses ML to maintain performance across variable & sporadic workloads
- Easy spinup of development and test environments
- Easy ad-hoc business analysis
- You get back a serverless endpoint, JDBC/ODBC connection, or just query via the console's query editor


## Redshift Serverless: Getting Started

**Create a Serverless namespace/workgroup with deliberate identity, network, encryption and audit settings.**

- Need an IAM role with this policy
- **Define your:** Database name · Admin user credentials · VPC · Encryption settings · AWS-owned KMS by default · Audit logging
- Can manage snapshots & recovery points after creation


## Resource Scaling in Redshift Serverless

**Redshift Serverless measures compute capacity in RPUs. Compare base and maximum capacity with query performance and the resulting usage charges.**

- You pay for RPU-hours (per second) plus storage
- **Base RPU's:** You can adjust base capacity; Defaults to AUTO; But you can adjust from 32-512 RPU's to improve query performance
- **Max RPU's:** Can set a usage limit to control costs; Or, increase it to improve throughput


## Redshift Serverless — Network & Admin

**Redshift Serverless separates namespaces from workgroups and changes several administration controls. It can be configured for public accessibility when routing and security rules permit it.**

- Parameter groups, maintenance controls and workload-management configuration differ; check the current feature matrix
- Correction: Serverless can be configured for public accessibility. The slide's "no public endpoints" statement is outdated
- Use private connectivity when that fits the requirement; public accessibility still requires routing and security-group authorization

<!-- Source reference: https://docs.aws.amazon.com/redshift/latest/mgmt/serverless-connecting.html -->


## Serverless Monitoring

**Use query, load and serverless usage views alongside CloudWatch metrics to connect workload behavior with capacity consumption.**

- **Monitoring views:** SYS_QUERY_HISTORY, SYS_LOAD_HISTORY, SYS_SERVERLESS_USAGE, …and many more
- **CloudWatch logs:** Connection & user logs enabled by default; Optional user activity log data; Under /aws/redshift/serverless/
- **CloudWatch metrics:** QueriesCompletedPerSecond, QueryDuration, QueriesRunning,etc; Dimensions: DatabaseName, latency (short/medium/long), QueryType, stage


## Redshift Materialized Views

**A materialized view stores the result of a query so later reads can reuse it. Faster queries must be balanced against refresh cost and acceptable staleness.**

- **Contain precomputed results based on SQL queries over one or more base tables.:** This differs from a "normal" view in that it actually stores the results of the query
- Provide a way to speed up complex queries in a data warehouse environment, especially on large tables
- You can query materialized views just like any other tables or views
- Queries return results faster since they use precomputed results without accessing base tables
- They're particularly beneficial for predictable and recurring queries, e.g., populating dashboards like Amazon QuickSight

```mermaid
flowchart LR
  n0["Base tables"]
  n1["Aggregate / join query"]
  n2["Materialized view"]
  n3["Reporting query"]
  n0 -->|"source rows"| n1
  n1 -->|"materialize / refresh"| n2
  n2 -->|"reuse result"| n3
```


## Using Materialized Views

**Create, refresh and query materialized views according to the freshness required by the consuming workload.**

- CREATE MATERIALIZED VIEW…
- **Keeping them refreshed:** REFRESH MATERIALIZED VIEW…; Set AUTO REFRESH option on creation
- Query them just like any other table or view
- **Materialized views can be built from other materialized views:** Useful for re-using expensive joins


## Data Sharing

**A producer grants consumers access to live warehouse data. Sharing avoids a separate data copy and allows consumers to isolate their query workloads.**

- Securely share live data across Redshift clusters for read purposes
- **Why?:** Workload isolation; Cross-group collaboration; Sharing data between dev/test/prod; Licensing data access in AWS Data Exchange
- **Can share DB's, schemas, tables, views, and/or UDFs.:** Fine-grained access control

```mermaid
flowchart LR
  n0["Producer namespace"]
  n1["Datashare"]
  n2["Consumer namespace"]
  n0 -->|"publish selected objects"| n1
  n1 -->|"authorized reads"| n2
```


## Redshift Data Sharing

**Producer and consumer compute can scale independently while consumers read shared data.**

- **Producer / consumer architecture:** Producer controls security; Isolation to ensure producer performance unaffected by consumers; Data is live and transactionally consistent
- Both must be encrypted, must use RA3 nodes
- Cross-region data sharing involves transfer charges
- **Types of data shares:** Standard, AWS Data Exchange, AWS Lake Formation - managed

```mermaid
flowchart LR
  n0["Producer compute"]
  n1["Shared data"]
  n2["Consumer A"]
  n3["Consumer B"]
  n0 -->|"manage data"| n1
  n1 -->|"read"| n2
  n1 -->|"read"| n3
```


## Redshift Lambda UDF — Architecture

**Register a Lambda-backed external function to apply custom logic from Redshift SQL. Function permissions, invocation overhead and supported data handling remain constraints.**

- Lambda UDFs remain a distinct supported external-function mechanism; Redshift Python UDF end of support after June 30, 2026 does not mean Lambda UDFs were retired
- **Use custom functions in AWS Lambda inside SQL queries:** Using any language you want! · Do anything you want! · Call other services (AI?) · Access external systems · Integrate with location service
- Register with CREATE EXTERNAL FUNCTION
- Must GRANT USAGE ON LANGUAGE EXFUNC for permissions

```mermaid
flowchart LR
  n0["SQL query"]
  n1["External function"]
  n2["Lambda"]
  n3["External service / computation"]
  n0 -->|"invoke UDF"| n1
  n1 -->|"batched request"| n2
  n2 -->|"custom logic"| n3
```

<!-- Source reference: https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_FUNCTION.html -->


## Redshift Lambda UDF — IAM & Payloads

**Lambda UDF requests contain batches of arguments; the handler must return a correctly shaped response with corresponding results.**

- Lambda UDFs remain a distinct supported external-function mechanism; Redshift Python UDF end of support after June 30, 2026 does not mean Lambda UDFs were retired
- **Use AWSLambdaRole IAM policy to grant permissions to Lambda on your cluster's IAM role:** Or roll your own policy, to allow lambda:InvokeFunction
- **You also need this IAM role in your CREATE EXTERNAL FUNCTION command:** Possible to invoke functions in other accounts in the same Region, using IAM role chaining
- Redshift communicates with Lambda using JSON

```mermaid
flowchart LR
  n0["Argument rows"]
  n1["JSON request"]
  n2["Lambda handler"]
  n3["JSON response"]
  n4["SQL result rows"]
  n0 -->|"batch"| n1
  n1 -->|"invoke"| n2
  n2 -->|"serialize results"| n3
  n3 -->|"map to rows"| n4
```

<!-- Source reference: https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_FUNCTION.html -->


## Redshift Federation — Architecture

**Federated queries read supported RDS or Aurora databases from Redshift. Network connectivity and Secrets Manager credentials are required in addition to SQL definitions.**

- Query and analyze across databases, warehouses, and lakes
- **Ties Redshift to Amazon RDS or Aurora for PostgreSQL and MySQL:** Incorporate live data in RDS into your Redshift queries; Avoids the need for ETL pipelines
- Offloads computation to remote databases to reduce data movement

```mermaid
flowchart LR
  n0["Redshift query"]
  n1["Local tables"]
  n2["RDS / Aurora external schema"]
  n0 -->|"local scan"| n1
  n0 -->|"remote query"| n2
```


## Redshift Federation — Connectivity

**A federated query needs a reachable external database and permission to retrieve its credentials. SQL definitions cannot substitute for network connectivity.**

- Put them in the same VPC subnet
- Or use VPC peering
- Credentials must be in AWS Secrets Manager
- Include secrets in IAM role for your Redshift cluster
- **Connect using CREATE EXTERNAL SCHEMA:** Can also connect to S3 / Redshift Spectrum this way
- The SVV_EXTERNAL_SCHEMAS view contains available external schemas


## Redshift Federation — Read Behavior

**Federation reads supported external databases without first loading all remote data into local warehouse tables.**

- Read-only access to external data sources
- Costs will be incurred on external DB's
- You can query RDS/Aurora from Redshift, but not the other way around


## Redshift System Tables and Views

**In Amazon Redshift, system tables and system views are built-in metadata objects that record what is happening inside your cluster or workgroup.**

| Prefix | General purpose |
|---|---|
| `STL_` | Historical system log tables |
| `STV_` | Current/transient system information |
| `SVL_` | System log views |
| `SVV_` | System metadata/status views |
| `SYS_` | Newer unified monitoring views (available for serverless) |


## Redshift Data API

**The Redshift Data API submits SQL over HTTPS and returns asynchronous statement status and results. It supports application and workflow integration without a persistent database connection.**

- **Secure HTTP endpoint for SQL statements to Redshift clusters:** Provisioned or serverless, Individual or batch queries
- **Does not require managing connections:** No drivers needed
- **Passwords not sent via API:** Uses AWS Secrets Manager or temporary credentials
- **Can be invoked by AWS SDK:** C++, Go, Java, JavaScript, .NET, Node.js, PHP, Python, Ruby
- AWS CloudTrail captures API calls

```mermaid
flowchart LR
  n0["Application / SDK"]
  n1["Data API"]
  n2["Redshift"]
  n3["Statement status / results"]
  n0 -->|"ExecuteStatement"| n1
  n1 -->|"SQL execution"| n2
  n2 -->|"result"| n3
  n3 -->|"poll / retrieve"| n0
```


## Redshift Data API: Other use cases

**Lambda, EventBridge and Step Functions can orchestrate Data API calls without maintaining a JDBC connection.**

- **Application integration:** REST endpoints
- **It can also integrate with a variety of other services:** ETL Orchestration with AWS Step Functions; Serverless data processing workflows; Event-driven ETL; Access from SageMaker notebooks
- **Use with Amazon EventBridge:** Stream data from application to Lambda; Set WithEvent parameter to true; Schedule Data API operations

```mermaid
flowchart LR
  n0["Event / workflow"]
  n1["Lambda / Step Functions"]
  n2["Redshift Data API"]
  n3["Redshift"]
  n0 -->|"trigger"| n1
  n1 -->|"execute / poll"| n2
  n2 -->|"SQL"| n3
```


## Redshift Data API — Limits

**Query duration, concurrent statements, result size and result retention are separate Data API limits. Check the current quota for the chosen operation.**

- **Maximum…:** Query duration: 24 hours · Active queries: 500 · Query result size (gzip'ed): 100 MB · Result retention time: 24 hours · Query statement size: 100 KB · Packet for query (data per row) : 64 KB · Client token retention time: 8 hours · …
- **API Calls:** ExecuteStatement, BatchExecuteStatement; DescribeStatement, DescribeTable; GetStatementResult, CancelStatement; Users must have same IAM role or permissions to operate on a given statement
- Cluster must be in a VPC


# Section Migration And Transfer

## AWS Application Discovery Service

**Application Discovery collects on-premises inventory and dependency information to help plan migration waves and target resources.**

- Server utilization data and dependency mapping are important for migrations
- **Agentless Discovery (AWS Agentless Discovery Connector):** VM inventory, configuration, and performance history such as CPU, memory, and disk usage
- **Agent-based Discovery (AWS Application Discovery Agent):** System configuration, system performance, running processes, and details of the network connections between systems
- Resulting data can be viewed within AWS Migration Hub

```mermaid
flowchart LR
  A[On-prem servers / VMs] --> B[Agentless inventory]
  A --> C[Agent-based dependencies]
  B --> D[Migration assessment]
  C --> D
  D --> E[Plan migration waves]
```


## AWS Application Migration Service (MGN)

**Application Migration Service replicates server disks to a staging area before test and cutover instances are launched.**

- The "AWS evolution" of CloudEndure Migration, replacing AWS Server Migration Service (SMS)
- Lift-and-shift (rehost) solution which simplify migrating applications to AWS
- Converts your physical, virtual, and cloud-based servers to run natively on AWS
- Supports wide range of platforms, Operating Systems, and databases
- Minimal downtime, reduced costs

```mermaid
flowchart LR
  n0["Source server + agent"]
  n1["Replication staging area"]
  n2["Test EC2 instance"]
  n3["Cutover EC2 instance"]
  n0 -->|"continuous replication"| n1
  n1 -->|"test launch"| n2
  n1 -->|"cutover launch"| n3
```


## AWS Database Migration Service

**DMS moves data between supported sources and targets, using full loads and change data capture where supported. Schema conversion is a separate migration task.**

- Quickly and securely migrate databases to AWS, resilient, self healing
- **Supports:** Homogeneous migrations: ex Oracle to Oracle; Heterogeneous migrations: ex Microsoft SQL Server to Aurora
- Continuous Data Replication using CDC
- You must create an EC2 instance to perform the replication tasks

```mermaid
flowchart LR
  n0["Source database"]
  n1["DMS replication task"]
  n2["Target database"]
  n0 -->|"full load / CDC"| n1
  n1 -->|"apply changes"| n2
```


## DMS Sources and Targets

**DMS supports specific source-target combinations, with different full-load and CDC capabilities. Validate the chosen engines and versions as a pair.**

- Azure: Azure SQL Database
- Amazon RDS: all including Aurora
- Amazon S3
- **DocumentDB:** On-Premises and EC2 instances databases: Oracle, MS SQL Server, MySQL, MariaDB, PostgreSQL, SAP · Amazon RDS · Redshift, DynamoDB, S3 · OpenSearch Service · Kinesis Data Streams · Apache Kafka · DocumentDB & Amazon Neptune · …


## AWS Schema Conversion Tool (SCT)

**SCT translates schema and related objects when moving between different database engines. DMS handles the data movement; same-engine migrations may not need conversion.**

- Convert your Database's Schema from one engine to another
- Example OLTP: (SQL Server or Oracle) to MySQL, PostgreSQL, Aurora
- Example OLAP: (Teradata or Oracle) to Amazon Redshift
- Prefer compute-intensive instances to optimize data conversions
- **You do not need to use SCT if you are migrating the same DB engine:** Ex: On-Premise PostgreSQL => RDS PostgreSQL; The DB engine is still PostgreSQL (RDS is the platform)

```mermaid
flowchart LR
  n0["Source schema / code"]
  n1["SCT assessment + conversion"]
  n2["Target schema"]
  n3["Manual remediation"]
  n0 -->|"analyze"| n1
  n1 -->|"convert supported objects"| n2
  n1 -->|"unsupported constructs"| n3
```


## DMS - Continuous Replication

**For a heterogeneous migration, schema conversion and data replication are separate paths that converge on the target.**

```mermaid
flowchart LR
  n0["Source database"]
  n1["SCT"]
  n2["DMS full load + CDC"]
  n3["Target database"]
  n0 -->|"schema"| n1
  n1 -->|"converted schema"| n3
  n0 -->|"data / change log"| n2
  n2 -->|"replicate data"| n3
```


## AWS DMS – Multi-AZ Deployment

**A Multi-AZ DMS deployment provides a standby for replication-instance availability; it does not itself make a migration task parallel.**

- When Multi-AZ Enabled, DMS provisions and maintains a synchronously stand replica in a different AZ
- **Advantages:** Provides Data Redundancy, Eliminates I/O freezes, Minimizes latency spikes

```mermaid
flowchart LR
  n0["Source"]
  n1["Primary replication instance"]
  n2["Standby in another AZ"]
  n3["Target"]
  n0 -->|"source changes"| n1
  n1 -->|"standby replication"| n2
  n1 -->|"apply changes"| n3
```


## AWS DataSync

**DataSync schedules and verifies transfers between supported storage locations, including on-premises or other-cloud sources and AWS storage.**

- **Move large amount of data to and from:** On-premises / other cloud to AWS (NFS, SMB, HDFS, S3 API…) – needs agent; AWS to AWS (different storage services) – no agent needed
- **Can synchronize to:** Amazon S3 (any storage classes – including Glacier); Amazon EFS; Amazon FSx (Windows, Lustre, NetApp, OpenZFS...)
- Replication tasks can be scheduled hourly, daily, weekly
- File permissions and metadata are preserved (NFS POSIX, SMB…)
- One agent task can use 10 Gbps, can setup a bandwidth limit

```mermaid
flowchart LR
  A[On-prem or cloud storage] --> B[DataSync task]
  B --> C[S3 / EFS / FSx]
  B -.-> D[Schedule + verification + metadata]
```


## AWS DataSync NFS / SMB to AWS (S3, EFS, FSx…)

**An on-premises DataSync agent accesses supported local storage and transfers data to AWS storage over encrypted transport.**

```mermaid
flowchart LR
  n0["NFS / SMB storage"]
  n1["DataSync agent"]
  n2["DataSync service"]
  n3["S3 / EFS / FSx"]
  n0 -->|"read files"| n1
  n1 -->|"TLS transfer"| n2
  n2 -->|"write destination"| n3
```


## AWS DataSync Transfer between AWS storage services

**DataSync also transfers between supported AWS storage locations; agent requirements depend on the location types.**

```mermaid
flowchart LR
  n0["AWS source storage"]
  n1["DataSync task"]
  n2["AWS destination storage"]
  n0 -->|"read / verify"| n1
  n1 -->|"copy / verify"| n2
```


## AWS Snow Family

**Snow-family devices were used for offline transfer and edge processing, but availability is constrained by announced service changes.**

- **Historical comparison:** Storage Optimized 210 TB SSD; Compute Optimized 28 TB SSD (course models).
- **Source notice:** Snowball Edge closed to new customers on 7 Nov 2025; a commercial-Region support end is announced for 31 Dec 2026 with exceptions.
- **Migration planning:** compare supported current options rather than assuming a new device order is available.

| Model in course | vCPUs | Memory | SSD |
| --- | --- | --- | --- |
| Storage Optimized | 104 | 416 GB | 210 TB |
| Compute Optimized | 104 | 416 GB | 28 TB |


<!-- Source reference: https://aws.amazon.com/snowball/ -->


## Estimate network transfer time

**Compare online transfer time with the complete offline workflow, including preparation, shipping and import.**

| Dataset | 100 Mbps (course) | 1 Gbps (course) | 10 Gbps (course) |
| --- | --- | --- | --- |
| 10 TB | 12 days | 30 hours | 3 hours |
| 100 TB | 124 days | 12 days | 30 hours |
| 1 PB | 3 years | 124 days | 12 days |

- Approximate ideal transfer time = data size in bits ÷ usable bits per second; actual utilization and protocol overhead increase it
- Check shared bandwidth, cost, reliability and the migration deadline. The one-week threshold is a heuristic, not an AWS eligibility rule


## Offline transfer workflow

**Offline appliance transfer trades network upload time for device preparation, shipping and AWS import; eligibility is a dated service constraint.**

- Direct upload to S3
- With Snowball

```mermaid
flowchart LR
  n0["Local dataset"]
  n1["Network upload"]
  n2["Transfer appliance"]
  n3["Shipping + import"]
  n4["S3"]
  n0 -->|"online option"| n1
  n1 -->|"network transfer"| n4
  n0 -->|"offline option"| n2
  n2 -->|"ship device"| n3
  n3 -->|"AWS import"| n4
```


## Edge Computing — Processing Near Data

**Edge processing performs useful work near the data's origin, such as a remote site or vehicle, when connectivity or latency makes cloud-only processing unsuitable.**

- A truck on the road, a ship on the sea, a mining station underground
- These locations may have limited internet and no access to computing power
- **We setup a Snowball Edge device to do edge computing:** Snowball Edge Compute Optimized (dedicated for that use case) & Storage Optimized; Run EC2 Instances or Lambda functions at the edge
- Use cases: preprocess data, machine learning, transcoding media

```mermaid
flowchart LR
  A[Remote sensors / equipment] --> B[Local processing]
  B --> C[Fast local decisions]
  B -->|When connected| D[Cloud data platform]
```


## AWS Data Exchange — Third-Party Data

**Data Exchange lets subscribers obtain third-party datasets through supported delivery and sharing products, including S3 objects, Redshift data and APIs.**

- Reuters, who curate data from over 2.2 million unique news stories per year in multiple languages
- Change Healthcare, who process and anonymize more than 14 billion healthcare transactions and $1 trillion in claims annually
- Dun & Bradstreet, who maintain a database of more than 330 million global business records
- Foursquare, whose location data is derived from 220 million unique consumers and includes more than 60 million global commercial venues
- Once subscribed to a data product, you can use the AWS Data Exchange API to load data directly into Amazon S3 and then analyze it with a wide variety of AWS analytics and machine learning services


## AWS Data Exchange — Subscription Flow

**Data Exchange grants subscribed access to provider datasets; analytics then uses the licensed data through the delivery method configured.**

```mermaid
flowchart LR
  n0["Data provider"]
  n1["Data Exchange subscription"]
  n2["Delivered / shared dataset"]
  n3["Analytics / SageMaker"]
  n0 -->|"publish product"| n1
  n1 -->|"entitlement + delivery"| n2
  n2 -->|"analyze"| n3
```


## AWS Data Exchange – Other Products

**Data Exchange products can expose data through different delivery or sharing mechanisms, not only copied S3 objects.**

- **AWS Data Exchange for Redshift:** Find and subscribe to third-party data in AWS Data Exchange that you can query in an Amazon Redshift data warehouse in minutes; Easily license your data in Amazon Redshift through AWS Data Exchange
- **AWS Data Exchange for APIs:** Find and subscribe to third-party APIs with a consistent access using AWS SDKs; Consistent AWS-native authentication and governance


## AWS Transfer Family — Managed Protocols

**Transfer Family exposes managed file-transfer endpoints backed by S3 or EFS. Match the protocol and identity integration to the clients that will connect.**

- **Supported Protocols:** AWS Transfer for FTP (File Transfer Protocol (FTP)); AWS Transfer for FTPS (File Transfer Protocol over SSL (FTPS)); AWS Transfer for SFTP (Secure File Transfer Protocol (SFTP))
- Managed infrastructure, Scalable, Reliable, Highly Available (multi-AZ)
- Pay per provisioned endpoint per hour + data transfers in GB
- Store and manage users' credentials within the service
- Integrate with existing authentication systems (Microsoft Active Directory, LDAP, Okta, Amazon Cognito, custom)
- Usage: sharing files, public datasets, CRM, ERP, …


## AWS Transfer Family — Architecture

**Transfer Family provides managed file-transfer endpoints with configured identity and storage permissions.**

```mermaid
flowchart LR
  n0["SFTP / FTPS / FTP client"]
  n1["Transfer Family"]
  n2["Identity provider / IAM"]
  n3["S3 / EFS"]
  n0 -->|"file-transfer protocol"| n1
  n1 -->|"authenticate / authorize"| n2
  n1 -->|"read / write files"| n3
```

# Section Computing


## EC2

**EC2 provides configurable compute for data workloads. Select instance resources and purchase options from utilization, runtime and interruption tolerance.**

- **On demand, Spot & Reserved instances:** Spot: can tolerate loss, low cost => checkpointing feature (ML, etc); Reserved: long running clusters, databases (over a year); On demand: remaining workloads
- **Auto Scaling:** Leverage for EMR, etc; Automated for DynamoDB, Auto Scaling Groups, etc…
- **EC2 is behind EMR:** Master Nodes; Compute Nodes (contain data) + Tasks Nodes (do not contain data)

```mermaid
flowchart TD
  A[EC2 workload] --> B{Interruption tolerant?}
  B -->|Yes| C[Spot capacity]
  B -->|No| D[On-Demand / commitment options]
  C --> E[Checkpoint and retry]
  D --> F[Plan steady utilization]
```


## AWS Graviton

**Graviton is AWS's Arm-based processor family. Compare compatible instance and service options using the application's actual workload rather than a universal performance ratio.**

- General purpose: M7, T4
- Compute optimized: C7, C6
- Memory optimized: R7, X2
- Storage optimized: Im4, Is4
- Accelerated computing (game streaming, ML inference): G5
- Offers best price performance


## AWS Lambda

**AWS Lambda runs event-driven code without managing servers, using different invocation models for APIs, events and streams.**

- **Good fits:** S3 file events, API handlers, scheduled tasks and lightweight stream processing.
- **Limits:** execution timeout, payload, concurrency, memory and retry configuration.
- **Durable state:** use S3, DynamoDB, EFS or other persistent systems—not in-memory invocation state.

```mermaid
flowchart LR
  A[S3 / API / EventBridge / streams] --> B[Lambda function]
  B --> C[Process and validate]
  C --> D[S3 / DynamoDB / downstream API]
```

<!-- Source reference: https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html -->


## Lambda Architectures

**Common Lambda patterns process object events, update derived records from streams or expose an API. Identify the trigger, durable state and retry boundary in each architecture.**


## Example: Serverless Website

**A serverless API resolves its domain, accepts HTTP requests, invokes business logic and accesses persistent storage.**

```mermaid
flowchart LR
  n0["Route 53"]
  n1["API Gateway"]
  n2["Lambda"]
  n3["S3 / DynamoDB"]
  n0 -->|"resolve API domain"| n1
  n1 -->|"invoke integration"| n2
  n2 -->|"authorized data access"| n3
```


## Example: Order history app

**Streaming events can update an application-facing table asynchronously; client reads are a separate path.**

```mermaid
flowchart LR
  n0["Log producers"]
  n1["Kinesis Data Streams"]
  n2["Lambda"]
  n3["DynamoDB"]
  n4["Mobile application"]
  n0 -->|"events"| n1
  n1 -->|"poll batches"| n2
  n2 -->|"update state"| n3
  n4 -->|"read through authorized API"| n3
```


## Example: Transaction rate alarm

**Historical architecture: Kinesis SQL analytics processed an input stream and emitted results for alerting. Use a supported engine for new work.**

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments

```mermaid
flowchart TB
  n0["Logs"]
  n1["Kinesis input"]
  n2["Retired SQL analytics"]
  n3["Kinesis output"]
  n4["Lambda"]
  n5["SNS"]
  n0 -->|"ingest"| n1
  n1 -->|"stream SQL"| n2
  n2 -->|"result stream"| n3
  n3 -->|"process"| n4
  n4 -->|"notify"| n5
```

<!-- Source reference: https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html -->


## Why not just run a server?

**Managed execution removes much host administration, but the economic choice still depends on utilization, scaling behavior and the work that must stay running.**

- Servers can be cheap, but scaling gets expensive really fast
- You don't pay for processing time you don't use
- Easier to split up development between front-end and back-end

```mermaid
flowchart TB
  A{Workload pattern?} -->|Bursty / event driven| B[Managed event compute]
  A -->|Constant / specialized| C[Long-running compute]
  B --> D[Pay for executions and resources]
  C --> E[Optimize sustained utilization]
```


## AWS Lambda — Common Uses

**Lambda commonly handles event-driven file, stream, API and application tasks.**

- Real-time file processing
- Real-time stream processing
- ETL
- Cron replacement
- Process AWS events


## AWS Lambda — Supported Runtimes

**Lambda runtime support depends on language and runtime version; distinguish managed runtimes from custom-runtime options.**

- Node.js
- Python
- Java
- C#
- Go: verify the supported custom-runtime/container approach rather than assuming a current managed runtime
- Powershell: verify the supported custom-runtime/container approach rather than assuming a current managed runtime

<!-- Source reference: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html -->


## Lambda triggers

**Lambda integrations include request/response invocations, asynchronous events and polled event sources; these invocation models have different retry behavior.**

```mermaid
flowchart LR
  n0["API / synchronous caller"]
  n1["Event / asynchronous source"]
  n2["Queue / stream"]
  n3["Event source mapping"]
  n4["Lambda"]
  n0 -->|"request / response"| n4
  n1 -->|"enqueue invocation"| n4
  n2 -->|"poll"| n3
  n3 -->|"invoke batch"| n4
```


## Lambda and Amazon OpenSearch Service

**An S3 upload can trigger Lambda to extract and index content in OpenSearch.**

```mermaid
flowchart LR
  n0["S3 object"]
  n1["Lambda"]
  n2["OpenSearch index"]
  n0 -->|"object event"| n1
  n1 -->|"index searchable content"| n2
```


## Lambda and Redshift

**An event-driven loader can submit a Redshift COPY from S3 and track processed objects in DynamoDB; retry-safe bookkeeping is essential.**

```mermaid
flowchart LR
  n0["S3 object"]
  n1["Lambda loader"]
  n2["Redshift COPY"]
  n3["DynamoDB load tracking"]
  n0 -->|"upload event"| n1
  n1 -->|"submit load"| n2
  n0 -->|"COPY reads object"| n2
  n1 -->|"record processing state"| n3
```


## Lambda + Kinesis

**The Lambda event source mapping reads Kinesis shards and invokes batches, preserving order within a shard subject to configured parallelization.**

- **Your Lambda code receives an event with a batch of stream records:** You specify a batch size when setting up the trigger (up to 10,000 records); Too large a batch size can cause timeouts!; Batches may also be split beyond Lambda's payload…
- **Lambda will retry the batch until it succeeds or the data expires:** This can stall the shard if you don't handle errors properly; Use more shards to ensure processing isn't totally held up by errors
- Lambda processes shard data synchronously

```mermaid
flowchart LR
  n0["Kinesis shard"]
  n1["Event source mapping"]
  n2["Lambda batch handler"]
  n0 -->|"poll records"| n1
  n1 -->|"invoke batch"| n2
```


## AWS Lambda — Cost Model

**Lambda cost depends on request volume, execution duration, configured resources and optional capabilities.**

- "Pay for what you use"
- Generous free tier (1M requests / month, 400K GB-seconds compute time)
- $0.20 / million requests
- $.00001667 per GB/second


## AWS Lambda — Scaling & Reliability

**Managed scaling and availability do not remove the need to configure concurrency, permissions and recovery behavior.**

- Configure the invocation timeout for the selected capacity mode and invocation type
- Default-capacity functions have a 15-minute maximum. Managed Instances allows up to 90 minutes for asynchronous and eligible event-source-mapping invocations, with documented exceptions
- Retry behavior depends on the invocation path and configuration; there is no universal rule that every failure is retried three times
- Account and function concurrency controls can throttle work. Managed scaling is not unlimited capacity
- Keep durable application state outside one execution environment

<!-- Source reference: https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html | https://docs.aws.amazon.com/lambda/latest/dg/lambda-managed-instances-execution-environment.html -->


## AWS Lambda — Anti-Patterns

**Long-running or locally stateful workloads need a different execution/state design than one short Lambda invocation.**

- **Long-running applications:** Use EC2 instead, or chain functions
- **Dynamic websites:** Although Lambda can be used to develop "serverless" apps that rely on client-side AJAX
- **Stateful applications:** But you can work in DynamoDB or S3 to keep track of state


## Lambda - File Systems Mounting

**Lambda can mount EFS through a configured VPC connection. Distinguish shared persistent files from local scratch space, packaged layers and S3 objects.**

- Lambda functions can access EFS file systems if they are running in a VPC
- Configure Lambda to mount EFS file systems to local directory during initialization
- Must leverage EFS Access Points
- Limitations: watch out for the EFS connection limits (one function instance = one connection) and connection burst limits

```mermaid
flowchart LR
  n0["Lambda VPC attachment"]
  n1["EFS access point"]
  n2["AZ mount targets"]
  n3["Shared EFS filesystem"]
  n0 -->|"mount configuration"| n1
  n1 -->|"NFS connection"| n2
  n2 -->|"shared files"| n3
```


## Lambda storage choices

**Separate per-environment scratch space, packaged dependencies, object storage and shared filesystem storage.**

| Option | Persistence / sharing | Use |
| --- | --- | --- |
| /tmp | Execution-environment-local; ephemeral | Scratch files / intermediate data |
| Layers | Versioned package contents; read only | Libraries and static dependencies |
| S3 | Durable objects; authorized callers | Datasets, artifacts, large objects |
| EFS | Shared persistent filesystem | Shared files with NFS semantics |

- /tmp is writable and local to an execution environment; warm reuse is possible but durability is not guaranteed
- Layers package immutable dependencies; they are not a shared writable filesystem between invocations
- S3 persists objects independently of Lambda; EFS provides shared NFS access with VPC configuration

```mermaid
flowchart TB
  A[Lambda data] --> B[/tmp: local scratch]
  A --> C[Layers: packaged dependencies]
  A --> D[S3: durable objects]
  A --> E[EFS: shared filesystem]
```

<!-- Source reference: https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html -->


## Lambda - SAM

**SAM describes serverless resources in templates and builds on CloudFormation deployment. Its local development and synchronization commands shorten the edit-test cycle.**

- Framework for developing and deploying serverless applications
- All the configuration is YAML code
- Generate complex CloudFormation from simple SAM YAML file
- Supports anything from CloudFormation: Outputs, Mappings, Parameters, Resources…
- SAM can use CodeDeploy to deploy Lambda functions
- SAM can help you to run Lambda, API Gateway, DynamoDB locally


## AWS SAM – Recipe

**A SAM template declares its transform and serverless resource types, then supplies the properties used to build and deploy the application.**

- **Write Code:** AWS::Serverless::Function, AWS::Serverless::Api, AWS::Serverless::SimpleTable
- Package & Deploy: sam deploy (optionally preceded by "sam package")
- Quickly sync local changes to AWS Lambda (SAM Accelerate): sam sync


## Deep Dive into SAM Deployment

**SAM builds and packages application artifacts, then deploys the transformed infrastructure through CloudFormation.**

```mermaid
flowchart LR
  n0["SAM template + code"]
  n1["sam build"]
  n2["S3 artifacts"]
  n3["CloudFormation"]
  n4["Lambda / API / DynamoDB"]
  n0 -->|"build"| n1
  n1 -->|"package / upload"| n2
  n2 -->|"artifact references"| n3
  n3 -->|"create / update stack"| n4
```


## SAM Accelerate (sam sync)

**SAM sync accelerates development: eligible code updates use service APIs, while infrastructure changes still use CloudFormation.**

- SAM Accelerate is a set of features to reduce latency while deploying resources to AWS
- **sam sync:** Synchronizes your project declared in SAM templates to AWS; Synchronizes code changes to AWS without updating infrastructure (uses service APIs & bypass CloudFormation)

```mermaid
flowchart LR
  n0["Source change"]
  n1["sam sync"]
  n2["Service code API"]
  n3["CloudFormation stack"]
  n0 -->|"detect change"| n1
  n1 -->|"eligible code-only update"| n2
  n1 -->|"infrastructure update"| n3
```


## SAM Accelerate — Sync Examples

**Watch mode monitors local changes and selects the supported sync route; it is a development workflow.**

- **sam sync --code --resource AWS::Serverless::Function:** Synchronize only all Lambda functions and their dependencies
- **sam sync --code --resource-id HelloWorldLambdaFunction:** Synchronize only a specific resource by its ID
- **sam sync --watch:** Monitor for file changes and automatically synchronize when changes are detected; If changes include configuration, it uses sam sync; If changes are code only, it uses sam sync --code
- Dynamic provisioning of the instances (EC2 & Spot Instances)
- You just pay for the underlying EC2 instances

```mermaid
flowchart LR
  n0["Local file watcher"]
  n1["Code change"]
  n2["Infrastructure change"]
  n3["Lambda update"]
  n4["CloudFormation deployment"]
  n0 -->|"classify"| n1
  n0 -->|"classify"| n2
  n1 -->|"direct sync"| n3
  n2 -->|"stack update"| n4
```


## AWS Batch vs AWS Glue

**Use Glue for managed data preparation and ETL; use AWS Batch for general-purpose scheduled or queued container jobs.**

- **Glue:** data connectors, Spark ETL, Data Catalog, analytics integration.
- **Batch:** job queues, compute environments and container images; supports non-ETL workloads.
- **Decision:** choose by execution requirements, orchestration and compute/runtime control.

```mermaid
flowchart TB
  A{Job type?} -->|Managed Spark ETL and catalog| G[AWS Glue]
  A -->|General container batch job| B[AWS Batch]
  G --> C[Glue ETL jobs]
  B --> D[Container job queue + compute]
```



# Section Containers

<!-- original-note: 112 -->
<!-- section -->

## Docker

<!-- original-note: 113 -->

Containers package an application with its dependencies for a compatible runtime. They share a host kernel, so portability still depends on the operating-system and processor environment.

- Apps are packaged in containers that can be run on any OS
- Apps run the same, regardless of where they’re run
  - Any machine
  - No compatibility issues
  - Predictable behavior
  - Less work
  - Easier to maintain and deploy
  - Works with any language, any OS, any technology
- Use cases: microservices architecture, lift-and-shift apps from on-premises to the AWS cloud, …

- Portability still requires a compatible operating-system kernel and processor architecture; packaging does not make every image run unchanged on every host.

## Docker on an OS


Containers package applications and dependencies while sharing the host kernel.


```mermaid
flowchart LR
  accTitle: Docker on an OS
  n0["Host OS / kernel"]
  n1["Container runtime"]
  n2["Java container"]
  n3["Node container"]
  n4["Database container"]
  n0 ---|"runtime"| n1
  n1 ---|"isolated process"| n2
  n1 ---|"isolated process"| n3
  n1 ---|"isolated process"| n4
```

> Containers package applications and dependencies while sharing the host kernel.

## Where are Docker images stored?


A registry stores versioned container images for later deployment. Distinguish a public image source from a private repository with controlled access.

- Docker Hub (https://hub.docker.com)
  - Public repository
  - Find base images for many technologies or OS (e.g., Ubuntu, MySQL, …)
- Amazon ECR (Amazon Elastic Container Registry)
  - Private repository
  - Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws)

## Docker vs. Virtual Machines


The source compares a hosted hypervisor stack with containers. Virtual machines include guest operating systems; containers share the host kernel through their runtime.

- Docker is ”sort of” a virtualization technology, but not exactly
- Resources are shared with the host => many containers on one server


```mermaid
flowchart TB
  accTitle: Docker vs. Virtual Machines
  n0["Hardware"]
  n1["Hosted hypervisor"]
  n2["VM + guest OS"]
  n3["Host OS"]
  n4["Container runtime"]
  n5["Application container"]
  n0 ---|"host system"| n3
  n3 ---|"VM path"| n1
  n1 ---|"virtual machine"| n2
  n3 ---|"container path"| n4
  n4 ---|"container"| n5
```

> The source compares a hosted hypervisor stack with containers. Virtual machines include guest operating systems; containers share the host kernel through their runtime.

## Getting Started with Docker


A Dockerfile builds an image. A registry distributes images, and a runtime creates containers from them.


```mermaid
flowchart LR
  accTitle: Getting Started with Docker
  n0["Dockerfile"]
  n1["Image"]
  n2["Registry"]
  n3["Container"]
  n0 -->|"docker build"| n1
  n1 -->|"push"| n2
  n2 -->|"pull"| n1
  n1 -->|"docker run"| n3
```

> A Dockerfile builds an image. A registry distributes images, and a runtime creates containers from them.

## Docker Containers Management on AWS


ECS and EKS orchestrate containers with different APIs; Fargate supplies supported serverless compute beneath those orchestration choices.

  - Amazon’s own container platform
- Amazon Elastic Kubernetes Service (Amazon EKS)
  - Amazon’s managed Kubernetes (open source)
- AWS Fargate
  - Amazon’s own Serverless container platform
  - Works with ECS and with EKS
- Amazon ECR:
  - Store container images

## AWS ECS

<!-- original-note: 114 -->
<!-- title: Amazon ECS -->

ECS runs task definitions on a cluster using supported compute options. With EC2 you manage the instance fleet; with Fargate you request task resources without managing those hosts.

- ECS = Elastic Container Service
- Launch Docker containers on AWS = Launch ECS Tasks on ECS Clusters
- EC2 Launch Type: you must provision & maintain the infrastructure (the EC2 instances)
- Each EC2 Instance must run the ECS Agent to register in the ECS Cluster
- AWS takes care of starting /


```mermaid
flowchart LR
  accTitle: Amazon ECS
  n0["ECS cluster"]
  n1["EC2 instance + agent A"]
  n2["EC2 instance + agent B"]
  n3["Task A"]
  n4["Task B"]
  n0 ---|"registered host"| n1
  n0 ---|"registered host"| n2
  n1 ---|"runs task"| n3
  n2 ---|"runs task"| n4
```

> With the EC2 launch option, ECS places tasks on registered container instances whose capacity you manage.

## Amazon ECS – Fargate Launch Type


Fargate runs ECS tasks without exposing host-instance administration to the application team.

- Launch Docker containers on AWS
- You do not provision the infrastructure (no EC2 instances to manage)
- It’s all Serverless!
- You just create task definitions
- AWS just runs ECS Tasks for you based on the CPU / RAM you need
- To scale, just increase the number of tasks. Simple - no more EC2 instances


```mermaid
flowchart LR
  accTitle: Amazon ECS – Fargate Launch Type
  n0["ECS task definition"]
  n1["Fargate task A"]
  n2["Fargate task B"]
  n3["AWS-managed compute"]
  n0 -->|"launch"| n1
  n0 -->|"launch"| n2
  n3 -->|"provides capacity"| n1
  n3 -->|"provides capacity"| n2
```

> Fargate runs ECS tasks without exposing host-instance administration to the application team.

### ECS - IAM roles

<!-- original-note: 115 -->
<!-- title: ECS IAM roles -->

Separate the permissions used by container infrastructure from the task role used by application code. Give each workload only the AWS access it needs.

- EC2 Instance Profile (EC2 Launch Type only):
  - Used by the ECS agent
  - Makes API calls to ECS service
  - Send container logs to CloudWatch Logs
  - Pull Docker image from ECR
  - Reference sensitive data in Secrets Manager or SSM Parameter Store
- ECS Task Role:
  - Allows each task to have a specific role
  - Use different roles for the different ECS Services you run
  - Task Role is defined in the task definition


```mermaid
flowchart TB
  accTitle: ECS IAM roles
  n0["ECS infrastructure"]
  n1["Instance / execution role"]
  n2["ECR / logs / secrets"]
  n3["Application task"]
  n4["Task role"]
  n5["S3 / DynamoDB"]
  n0 -->|"assume infrastructure role"| n1
  n1 -->|"platform operations"| n2
  n3 -->|"temporary credentials"| n4
  n4 -->|"application permissions"| n5
```

> Host or execution permissions support infrastructure operations; the task role grants AWS permissions to application code.

## Amazon ECS – Load Balancer Integrations


An Application Load Balancer routes HTTP traffic to registered ECS task targets with health checks.

- Application Load Balancer supported and works for most use cases
- Network Load Balancer recommended only for high throughput / high performance use cases, or to pair it with AWS Private Link
- Classic Load Balancer supported but not recommended (no advanced features – no Fargate)


```mermaid
flowchart LR
  accTitle: Amazon ECS – Load Balancer Integrations
  n0["Clients"]
  n1["ALB"]
  n2["ECS task A"]
  n3["ECS task B"]
  n0 -->|"HTTP(S)"| n1
  n1 -->|"healthy target"| n2
  n1 -->|"healthy target"| n3
```

> An Application Load Balancer routes HTTP traffic to registered ECS task targets with health checks.

## Amazon ECS – Data Volumes (EFS)


ECS tasks on supported EC2 or Fargate configurations can mount a shared EFS filesystem.

- Mount EFS file systems onto ECS tasks
- Works for both EC2 and Fargate launch types
- Tasks running in any AZ will share the same data in the EFS file system
- Fargate + EFS = Serverless
- Use cases: persistent multi-AZ shared storage for your containers


```mermaid
flowchart LR
  accTitle: Amazon ECS – Data Volumes (EFS)
  n0["EC2-backed task"]
  n1["Fargate task"]
  n2["EFS mount targets"]
  n3["EFS"]
  n0 -->|"NFS mount"| n2
  n1 -->|"NFS mount"| n2
  n2 -->|"shared files"| n3
```

> ECS tasks on supported EC2 or Fargate configurations can mount a shared EFS filesystem.

## Amazon ECS – Data Volumes (S3 Files)


The source's S3 Files example mounts a filesystem from Fargate or ECS Managed Instances and synchronizes with an S3 bucket. Verify current feature support before deployment.

- Mount S3 Files file systems onto ECS tasks (S3 bucket exposed as a file system)
- Works for Fargate and ECS Managed Instances (EC2 launch type is NOT supported)
- Changes sync automatically to the S3 bucket
- Use cases: containers needing shared file access to data that already lives in S3


```mermaid
flowchart LR
  accTitle: Amazon ECS – Data Volumes (S3 Files)
  n0["ECS Managed Instances tasks"]
  n1["Fargate tasks"]
  n2["S3 Files filesystem"]
  n3["S3 bucket"]
  n0 -->|"mount"| n2
  n1 -->|"mount"| n2
  n2 -->|"automatic synchronization"| n3
```

> The source's S3 Files example mounts a filesystem from Fargate or ECS Managed Instances and synchronizes with an S3 bucket. Verify current feature support before deployment.

### ECR

<!-- original-note: 116 -->
<!-- title: Amazon ECR -->

ECR stores container images for deployment. Image repository access, lifecycle policies and scanning complement the runtime configuration in ECS or EKS.

- ECR = Elastic Container Registry
- Store and manage Docker images on AWS
- Private and Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws)
- Fully integrated with ECS, backed by Amazon S3
- Access is controlled through IAM (permission errors => policy)
- Supports image vulnerability scanning, versioning, image tags, image lifecycle, …


```mermaid
flowchart LR
  accTitle: Amazon ECR
  n0["ECR image repository"]
  n1["Authorized image pull"]
  n2["ECS task"]
  n0 -->|"authenticate + download"| n1
  n1 -->|"start container"| n2
```

> ECS pulls a private ECR image using the appropriate execution/instance permissions, then runs the resulting task.

### EKS

<!-- original-note: 117 -->
<!-- title: Amazon EKS -->

EKS manages a Kubernetes control plane. Choose node groups or supported serverless compute according to the Kubernetes workload and operational responsibilities.

- It is a way to launch managed Kubernetes clusters on AWS
- Kubernetes is an open-source system for automatic deployment, scaling and management of containerized (usually Docker) application
- It’s an alternative to ECS, similar goal but different API
- EKS supports EC2 if you want to deploy worker nodes or Fargate to deploy serverless containers
- Use case: if your company is already using Kubernetes on-premises or in another cloud, and wants to migrate to AWS using Kubernetes
- Kubernetes is cloud-agnostic (can be used in any cloud – Azure, GCP…)
- For multiple regions, deploy one EKS cluster per region
- Collect logs and metrics using CloudWatch Container Insights

## Amazon EKS - Diagram


EKS separates a managed Kubernetes control plane from worker capacity deployed across AZs; a load balancer exposes selected services.


```mermaid
flowchart LR
  accTitle: Amazon EKS - Diagram
  n0["Managed control plane"]
  n1["AZ A workers"]
  n2["AZ B workers"]
  n3["AZ C workers"]
  n4["Load balancer"]
  n0 -->|"Kubernetes API"| n1
  n0 -->|"Kubernetes API"| n2
  n0 -->|"Kubernetes API"| n3
  n4 -->|"service traffic"| n1
  n4 -->|"service traffic"| n2
  n4 -->|"service traffic"| n3
```

> EKS separates a managed Kubernetes control plane from worker capacity deployed across AZs; a load balancer exposes selected services.

## Amazon EKS – Node Types


EKS compute options differ in who provisions and maintains nodes. Compare managed groups, self-managed nodes and supported Fargate workloads.

  - Creates and manages Nodes (EC2 instances) for you
  - Nodes are part of an ASG managed by EKS
  - Supports On-Demand or Spot Instances
- Self-Managed Nodes
  - Nodes created by you and registered to the EKS cluster and managed by an ASG
  - You can use prebuilt AMI - Amazon EKS Optimized AMI
- AWS Fargate
  - No maintenance required; no nodes managed

## Amazon EKS – Data Volumes


Kubernetes persistent-volume claims use a compatible CSI driver to provision or mount the selected AWS storage backend.

- Need to specify StorageClass manifest on your EKS cluster
- Leverages a Container Storage Interface (CSI) compliant driver
- Support for…
- Amazon EBS
- Amazon EFS (works with Fargate)
- Amazon FSx for Lustre
- Amazon FSx for NetApp ONTAP


```mermaid
flowchart LR
  accTitle: Amazon EKS – Data Volumes
  n0["Pod / PVC"]
  n1["CSI driver"]
  n2["EBS"]
  n3["EFS"]
  n4["Supported FSx backend"]
  n0 -->|"claim / mount"| n1
  n1 -->|"block option"| n2
  n1 -->|"shared file option"| n3
  n1 -->|"driver-specific option"| n4
```

> Kubernetes persistent-volume claims use a compatible CSI driver to provision or mount the selected AWS storage backend.

# Section Analytics

<!-- original-note: 118 -->
<!-- section -->

## AWS Glue

<!-- original-note: 119 -->

Glue combines data discovery, a shared catalog and managed ETL. Crawlers describe datasets; jobs transform their contents; orchestration connects the steps.

  - S3 “data lakes”
  - RDS
  - Redshift
  - DynamoDB
  - Most other SQL databases
- Custom ETL jobs
  - Trigger-driven, on a schedule, or on demand
  - Fully managed

## Glue Crawler / Data Catalog


Glue crawlers discover metadata; query engines use that catalog to interpret data that remains in S3.

- Glue crawler scans data in S3, creates schema
- Can run periodically
- Populates the Glue Data Catalog
  - Stores only table definition
  - Original data stays in S3
- Once cataloged, you can treat your unstructured data like it’s structured
  - Redshift Spectrum
  - Athena
  - EMR
  - Quicksight


```mermaid
flowchart LR
  accTitle: Glue Crawler / Data Catalog
  n0["S3 dataset"]
  n1["Glue crawler"]
  n2["Glue Data Catalog"]
  n3["Athena / Spectrum / EMR"]
  n4["QuickSight"]
  n0 -->|"discover schema"| n1
  n1 -->|"register tables"| n2
  n2 -->|"metadata"| n3
  n0 -->|"read data"| n3
  n3 -->|"query results"| n4
```

> Glue crawlers discover metadata; query engines use that catalog to interpret data that remains in S3.

## Glue and S3 Partitions


Partition keys organize data prefixes so a query predicate can prune irrelevant partitions.

- Glue crawler will extract partitions based on how your S3 data is organized
- Think up front about how you will be querying your data lake in S3
- Example: devices send sensor data every hour
- Do you query primarily by time ranges?
  - If so, organize your buckets as yyyy/mm/dd/device
- Do you query primarily by device?
  - If so, organize your buckets as device/yyyy/mm/dd


```mermaid
flowchart LR
  accTitle: Glue and S3 Partitions
  n0["Dataset"]
  n1["Device"]
  n2["Year"]
  n3["Month"]
  n4["Partition files"]
  n0 ---|"partition level"| n1
  n1 ---|"partition level"| n2
  n2 ---|"partition level"| n3
  n3 ---|"scan selected paths"| n4
```

> Partition keys organize data prefixes so a query predicate can prune irrelevant partitions.

## Glue + Hive


Glue's catalog can act as a Hive metastore for compatible analytics engines, separating shared table metadata from the jobs that process data.

- The Glue Data Catalog can serve as a Hive “metastore”
- You can also import a Hive metastore into Glue

## Glue ETL


Glue ETL jobs use generated or authored code to read, prepare and write data. A generated script still needs review against the transformation requirements.

- Scala or Python
- Encryption
  - Server-side (at rest)
  - SSL (in transit)
- Can be event-driven
- Can provision additional “DPU’s” (data processing units) to increase performance of underlying Spark jobs
  - Enabling job metrics can help you understand the maximum capacity in DPU’s you need
  - You can plot maximum needed executors vs. maximum allocated executors in the Glue Console (not CloudWatch!), as well as ETL data movement
- Errors also reported to CloudWatch
  - Could tie into SNS for notification

## Glue ETL


An ETL job cleans and reshapes records for later analysis. Scaling choices and processing abstractions depend on the supported Glue job type.

  - Generate ETL code in Python or Scala, you can modify the code
  - Can provide your own Spark or PySpark scripts
  - Target can be S3, JDBC (RDS, Redshift), or in Glue Data Catalog
- Fully managed, cost effective, pay only for the resources consumed
- Jobs are run on a serverless Spark platform
- Glue Scheduler to schedule the jobs
- Glue Triggers to automate job runs based on “events”

## Glue ETL: The DynamicFrame


A DynamicFrame is a distributed collection of self-describing DynamicRecords, allowing inconsistent fields to be resolved during ETL.

- A DynamicFrame is a collection of DynamicRecords
  - DynamicRecords are self-describing, have a schema
  - Very much like a Spark DataFrame, but with more ETL stuff
  - Scala and Python APIs


```mermaid
flowchart LR
  accTitle: Glue ETL: The DynamicFrame
  n0["DynamicFrame"]
  n1["DynamicRecord A"]
  n2["DynamicRecord B"]
  n3["DynamicRecord C"]
  n0 ---|"record"| n1
  n0 ---|"record"| n2
  n0 ---|"record"| n3
```

> A DynamicFrame is a distributed collection of self-describing DynamicRecords, allowing inconsistent fields to be resolved during ETL.

## AWS Glue Transformations

<!-- original-note: 120 -->

Glue transformations remove or select fields, filter records, join datasets and apply custom mappings. Match the transformation to the quality or modeling problem.

  - DropFields, DropNullFields – remove (null) fields
  - Filter – specify a function to filter records
  - Join – to enrich data
  - Map - add fields, delete fields, perform external lookups
- Machine Learning Transformations:
  - FindMatches ML: identify duplicate or matching records in your dataset, even when the records do not have a common unique identifier and no fields match exactly.
- Format conversions: CSV, JSON, Avro, Parquet, ORC, XML
- Apache Spark transformations (example: K-Means)
  - Can convert between Spark DataFrame and Glue DynamicFrame

## Glue ETL: ResolveChoice


ResolveChoice makes a mixed-type field explicit by casting, projecting, creating separate columns or creating a struct.

- Deals with ambiguities in a DynamicFrame and returns a new one
- For example, two fields with the same name.
- make_cols: creates a new column for each type
  - price_double, price_string
- cast: casts all values to specified type
- make_struct: Creates a structure that contains each data type
- project: Projects every type to a given type, for example project:string


```mermaid
flowchart LR
  accTitle: Glue ETL: ResolveChoice
  n0["Mixed-type field"]
  n1["Cast"]
  n2["Project type"]
  n3["Separate columns"]
  n4["Struct of alternatives"]
  n0 -->|"cast"| n1
  n0 -->|"project"| n2
  n0 -->|"make_cols"| n3
  n0 -->|"make_struct"| n4
```

> ResolveChoice makes a mixed-type field explicit by casting, projecting, creating separate columns or creating a struct.

## AWS Glue Modifying Data Catalog

<!-- original-note: 121 -->

An ETL job can publish supported schema and partition changes to the Data Catalog. Updating files alone does not necessarily update the metadata used by query engines.

- Adding new partitions
  - Re-run the crawler, or
  - Have the script use enableUpdateCatalog and partitionKeys options
- Updating table schema
  - Use enableUpdateCatalog / updateBehavior from script
- Creating new tables
  - enableUpdateCatalog / updateBehavior with setCatalogInfo
- Restrictions
  - S3 only
  - Json, csv, avro, parquet only
  - Parquet requires special code
  - Nested schemas are not supported

## AWS Glue Development Endpoints


Development endpoints and notebooks illustrate interactive ETL development. Check the supported environment and stop resources that continue accruing charges.

  - Then create an ETL job that runs your script (using Spark and Glue)
- Endpoint is in a VPC controlled by security groups, connect via:
  - Apache Zeppelin on your local machine
  - Zeppelin notebook server on EC2 (via Glue console)
  - SageMaker notebook
  - Terminal window
  - PyCharm professional edition
  - Use Elastic IP’s to access a private endpoint address

## AWS Running Glue Jobs

<!-- original-note: 122 -->
<!-- title: Running Glue jobs -->

Run Glue jobs from schedules, triggers or workflows. Bookmarks retain processing state so suitable recurring jobs can identify new input.

- Job bookmarks
  - Persists state from the job run
  - Prevents reprocessing of old data
  - Allows you to process new data only when re-running on a schedule
  - Works with S3 sources in a variety of formats
  - Works with relational databases via JDBC (if PK’s are in sequential order)
    - Only handles new rows, not updated rows
- CloudWatch Events
  - Fire off a Lambda function or SNS notification when ETL succeeds or fails
  - Invoke EC2 run, send event to Kinesis, activate a Step Function

## AWS Glue Cost Model

<!-- original-note: 123 -->

Glue charges depend on compute time, catalog usage and optional development resources. Estimate the complete workflow rather than one ETL run alone.

- First million objects stored and accesses are free for the Glue Data Catalog
- Development endpoints for developing ETL code charged by the minute

## Glue Anti-patterns


Choose a different execution environment when the job depends on unsupported engines or runtime behavior. Glue's ETL model does not cover every distributed application.

- Glue ETL is based on Spark
- If you want to use other engines (Hive, Pig, etc) Data Pipeline EMR would be a better fit.

## No longer an anti-pattern: streaming


Glue streaming ETL continuously processes supported Kinesis or Kafka input using Spark Structured Streaming rather than waiting for a bounded batch.

  - Consumes from Kinesis or Kafka
  - Clean & transform in-flight
  - Store results into S3 or other data stores
- Runs on Apache Spark Structured Streaming

## AWS Glue Studio

<!-- original-note: 125 -->

Glue Studio builds and monitors ETL jobs through a visual graph. The graph still represents concrete sources, transformations and targets that need review.

- Visual interface for ETL workflows
- Visual job editor
  - Create DAG’s for complex workflows
  - Sources include S3, Kinesis, Kafka, JDBC
  - Transform / sample / join data
  - Target to S3 or Glue Data Catalog
  - Support partitioning
- Visual job dashboard
  - Overviews, status, run times


```mermaid
flowchart LR
  accTitle: AWS Glue Studio
  n0["Source"]
  n1["Transform / resolve schema"]
  n2["Target"]
  n0 -->|"records"| n1
  n1 -->|"transformed output"| n2
```

> Glue Studio's visual job is a directed graph of sources, transformations and targets; the generated job still needs correct schema and permissions.

## AWS Glue Data Quality

<!-- original-note: 126 -->

Glue Data Quality evaluates datasets against rules that you define or refine from recommendations. Integrate the checks into the job's success and failure handling.

- Data quality rules may be created manually or recommended automatically
- Integrates into Glue jobs
- Uses Data Quality Definition Language (DQDL)
- Results can be used to fail the job, or just be reported to CloudWatch

Example retained from the personal notes:

```dqdl
Rules = [
    RowCount >= 100,
    IsComplete "customer_id",
    IsUnique "order_id"
]
```


```mermaid
flowchart LR
  accTitle: AWS Glue Data Quality
  n0["Dataset / catalog table"]
  n1["DQDL ruleset"]
  n2["Data Quality evaluation"]
  n3["Rule outcomes / metrics"]
  n0 -->|"evaluate data"| n2
  n1 -->|"quality constraints"| n2
  n2 -->|"results"| n3
```

> Glue Data Quality evaluates a ruleset against data and produces rule outcomes and quality metrics; catalog integration provides dataset context.

## More on Data Quality Definition Language (DQDL)


DQDL expresses quality checks as a ruleset. Read the rule names, thresholds and combined conditions to understand what makes a dataset pass.

- A DQDL document consists of a ruleset, for example:
  - Rules = [IsComplete "order-id", IsUnique "order-id"]
- Lots of built-in rule types (Mean, Sum, CustomSQL, Uniqueness, DetectAnomalies…)
  - Not a bad idea to review them at https://docs.aws.amazon.com/glue/latest/dg/dqdl.html
- Composite rules (and, or)
  - (ColumnValues "myCol1" > 1) OR (ColumnValues "myCol2" > 2)
  - This evaluates left to right and will fail early, unlike SQL
    - Unless you specify otherwise with additionalOptions for compositeRuleEvaluation
- Expressions (=, !-, >, <, etc.)
- Filters (where clauses)
- Constants (storing common SQL snippets)
- Labels (apply all rules with a given label, like for a given team)

## AWS Glue Data Quality


The quality-results screen connects each configured rule to a pass/fail outcome and supporting metrics.


```mermaid
flowchart LR
  accTitle: AWS Glue Data Quality
  n0["Ruleset"]
  n1["Evaluation run"]
  n2["Per-rule results"]
  n3["Investigate / remediate"]
  n0 -->|"execute"| n1
  n1 -->|"report"| n2
  n2 -->|"act on failed rules"| n3
```

> The quality-results screen connects each configured rule to a pass/fail outcome and supporting metrics.

## AWS Glue DataBrew

<!-- original-note: 127 -->

DataBrew expresses visual data-preparation steps as reusable recipes and jobs. Use profiling and quality checks to evaluate the dataset before publishing the result.

  - UI for pre-processing large data sets
  - Input from S3, data warehouse, or database
  - Output to S3
- Over 250 ready-made transformations
- You create “recipes” of transformations that can be saved as jobs within a larger project
- May define data quality rules
- May create datasets with custom SQL from Redshift and Snowflake
- Security
  - Can integrate with KMS (with customer master keys only)
  - SSL in transit
  - IAM can restrict who can do what
  - CloudWatch & CloudTrail

## Handling PII in DataBRew Transformations

<!-- original-note: 128 -->
<!-- title: PII transformations in DataBrew -->

Identify sensitive fields, then choose whether to replace, shuffle or encrypt them. Reversible protection and anonymity are different goals.

- Substitution (REPLACE_WITH_RANDOM…)
- Shuffling (SHUFFLE_ROWS)
- Deterministic encryption (DETERMINISTIC_ENCRYPT)
- Probabilistic encryption (ENCRYPT)
- Decryption (DECRYPT)
- Nulling out or deletion (DELETE)
- Masking out (MASK_CUSTOM, _DATE, _DELIMITER, _RANGE)
- Hashing (CRYPTOGRAPHIC_HASH)

## Glue Workflows

<!-- original-note: 129 -->

Glue Workflows coordinate related jobs and crawlers with dependencies and triggers. Use them for ETL orchestration rather than general application workflows.

- Design multi-job, multi-crawler ETL processes run together
- Create from AWS Glue blueprint, from the console, or API
- This is only for orchestrating complex ETL operations using Glue


```mermaid
flowchart LR
  accTitle: Glue Workflows
  n0["Start trigger"]
  n1["Crawler"]
  n2["ETL job"]
  n3["Conditional trigger"]
  n4["Downstream job"]
  n0 -->|"start"| n1
  n1 -->|"catalog ready"| n2
  n2 -->|"job state"| n3
  n3 -->|"condition matched"| n4
```

> Glue workflows coordinate crawlers and jobs through triggers and run conditions.

## Glue Workflow Triggers


Workflow triggers start jobs or crawlers from schedules, requests, events or dependency conditions. A trigger is the activation rule, not the transformation itself.

  - Or can be fired when jobs or crawlers complete
- Schedule
  - Based on a cron expression
- On demand
- EventBridge events
  - Start on single event or batch of events
  - For example, arrival of a new object in S3
  - Optional batch conditions
    - Batch size (number of events)
    - Batch window (within X seconds, default is 15 min)

## AWS Glue Flex Jobs

<!-- original-note: 124 -->

Flex uses available capacity for eligible nonurgent Glue jobs. Lower cost comes with capacity-dependent startup and execution behavior.

- Execution class (“FLEX”) for non-urgent ETL workloads
  - Uses spare compute capacity instead of dedicated workers
  - Might have to wait for capacity to become available
- Appropriate for time-insensitive workloads (testing, one-time loads, etc.)
- Usually cheaper than standard execution (30- 35% savings)
  - Billed only for actual workers running and the duration they ran
  - Note you may end up with fewer workers than expected if capacity is limited


```mermaid
flowchart LR
  accTitle: AWS Glue Flex Jobs
  n0["Flex job submitted"]
  n1["Wait for capacity"]
  n2["Workers process data"]
  n3["Capacity reclaimed"]
  n4["Resume / complete"]
  n0 -->|"queue"| n1
  n1 -->|"workers available"| n2
  n2 -->|"possible interruption"| n3
  n3 -->|"wait / reacquire"| n1
  n2 -->|"finish when capacity permits"| n4
```

> Glue Flex uses spare capacity for eligible nonurgent jobs; startup and completion time can vary when capacity is unavailable or reclaimed.

## Glue Flex Jobs


Flex is limited to supported job types. Python shell, streaming and ML-transform jobs in this source comparison use other execution choices.

  - Python shell jobs
  - Streaming jobs
  - AWS Glue ML jobs
- When to use
  - Standard: Dedicated resources, predictable start time & performance, hard SLA’s
  - Flex: Willing to trade off variable performance for cost optimization

## AWS Lake Formation

<!-- original-note: 130 -->

Lake Formation centralizes governance of a data lake using catalog metadata and access permissions, working with Glue and the underlying storage services.

- Loading data & monitoring data flows
- Setting up partitions
- Encryption & managing keys
- Defining transformation jobs & monitoring them
- Access control
- Auditing
- Built on top of Glue

## AWS Lake Formation


Lake Formation governs a data lake while supported query engines enforce granted permissions on cataloged data.


```mermaid
flowchart LR
  accTitle: AWS Lake Formation
  n0["Data sources"]
  n1["S3 data lake"]
  n2["Lake Formation + catalog"]
  n3["Athena / Redshift / EMR"]
  n0 -->|"ingest"| n1
  n2 -->|"govern access"| n1
  n2 -->|"permissions + metadata"| n3
  n1 -->|"authorized reads"| n3
```

> Lake Formation governs a data lake while supported query engines enforce granted permissions on cataloged data.

## AWS Lake Formation: Pricing


Estimate Lake Formation together with the storage, processing and optional features used around it. A course statement about the service's price is not a full workload estimate.

- But underlying services incur charges
  - Glue
  - S3
  - EMR
  - Athena
  - Redshift

## AWS Lake Formation: Building a Data Lake


Building a governed lake combines storage registration, discovery, ingestion and permission grants rather than only copying files.


```mermaid
flowchart LR
  accTitle: AWS Lake Formation: Building a Data Lake
  n0["Register storage"]
  n1["Discover / catalog"]
  n2["Ingest / transform"]
  n3["Grant permissions"]
  n4["Query / audit"]
  n0 -->|"prepare"| n1
  n1 -->|"populate"| n2
  n2 -->|"govern"| n3
  n3 -->|"consume"| n4
```

> Building a governed lake combines storage registration, discovery, ingestion and permission grants rather than only copying files.

## AWS Lake Formation: The Finer Points


Cross-account governance combines catalog sharing, recipient setup and authorization. Confirm which principal can discover and query the shared data.

  - Recipient must be set up as a data lake administrator
  - Can use AWS Resource Access Manager for accounts external to your organization
  - IAM permissions for cross-account access
- Lake Formation does not support manifests in Athena or Redshift queries
- IAM permissions on the KMS encryption key are needed for encrypted data catalogs in Lake Formation
- IAM permissions needed to create blueprints and workflows

## Data Permissions in Lake formation

<!-- original-note: 131 -->
<!-- title: Lake Formation data permissions -->

Lake Formation grants access to cataloged data at supported scopes. Coordinate those grants with IAM, account sharing and the query engine's access path.

- Can tie to IAM users/roles, SAML, or external AWS accounts
- Can use policy tags on databases, tables, or columns
- Can select specific permissions for tables or columns


```mermaid
flowchart LR
  accTitle: Lake Formation data permissions
  n0["Principal"]
  n1["Database / table"]
  n2["Allowed operations"]
  n3["Authorized query"]
  n0 -->|"resource grant"| n1
  n2 -->|"permission scope"| n1
  n1 -->|"engine enforcement"| n3
```

> Lake Formation permissions relate a principal to catalog resources and allowed operations.

## Data filters in Lake Formation

<!-- original-note: 132 -->
<!-- title: Lake Formation data filters -->

Data filters limit the rows, columns or cells a principal can read. Apply the filter together with the table's SELECT permission.

- Column, row, or cell-level security
- Apply when granting SELECT permission on tables
- “All columns” + row filter = row- level security
- “All rows” + specific columns = column-level security
- Specific columns + specific rows = cell-level security
- Create filters via the console (seen here) or via CreateDataCellsFilter API.


```mermaid
flowchart LR
  accTitle: Lake Formation data filters
  n0["Table"]
  n1["Row predicate"]
  n2["Column selection"]
  n3["Filtered view for principal"]
  n0 -->|"row filtering"| n1
  n1 -->|"column filtering"| n2
  n2 -->|"authorized cells"| n3
```

> Data filters narrow authorized data by rows, columns or cells; a table grant need not expose every value.

## Amazon Athena

<!-- original-note: 133 -->

Athena runs SQL against data in S3 without a database server to administer. Catalog metadata, file layout and the amount scanned determine much of its usefulness and cost.

  - No need to load data, it stays in S3
- Presto under the hood
- Serverless!
- Supports many data formats
  - CSV, TSV (human readable)
  - JSON (human readable)
  - ORC (columnar, splittable)
  - Parquet (columnar, splittable)
  - Avro (splittable)
  - Snappy, Zlib, LZO, Gzip compression
- Unstructured, semi-structured, or structured

## Athena workloads


Athena suits exploratory SQL over logs, staging datasets and other files, with results available to applications or visualization tools.

- Querying staging data before loading to Redshift
- Analyze CloudTrail / CloudFront / VPC / ELB etc logs in S3
- Integration with Jupyter, Zeppelin, RStudio notebooks
- Integration with QuickSight
- Integration via ODBC / JDBC with other visualization tools

## Athena + Glue

<!-- original-note: 134 -->

S3 holds the data, Glue describes it, Athena queries it and QuickSight can visualize the results. Metadata discovery is separate from data processing.


```mermaid
flowchart LR
  accTitle: Athena + Glue
  n0["S3"]
  n1["Glue catalog"]
  n2["Athena"]
  n3["QuickSight"]
  n0 -->|"scan selected data"| n2
  n1 -->|"schema / partitions"| n2
  n2 -->|"results"| n3
```

> Athena queries S3 using catalog metadata and can feed QuickSight; it does not require loading the dataset into a dedicated database.

### Athena Workgroups

<!-- original-note: 135 -->

Workgroups separate Athena workloads and govern query history, access settings and usage controls for teams or applications.

- Can control query access and track costs by Workgroup
- Integrates with IAM, CloudWatch, SNS
- Each workgroup can have its own:
  - Query history
  - Data limits (you can limit how much data queries may scan by workgroup)
  - IAM policies
  - Encryption settings

## Athena cost model


Athena query cost depends on the selected capacity or scan-pricing model and supporting services. Reducing unnecessary scans can improve both cost and latency.

  - $5 per TB scanned
  - Successful or cancelled queries count, failed queries do not.
  - No charge for DDL (CREATE/ALTER/DROP etc.)
- Save LOTS of money by using columnar formats
  - ORC, Parquet
  - Save 30-90%, and get better performance
- Glue and S3 have their own charges

## Athena Security

<!-- original-note: 136 -->

Athena needs permission to query the catalog, read source data and write results. Protect the result location and encryption keys as well as the source bucket.

  - IAM, ACLs, S3 bucket policies
  - AmazonAthenaFullAccess / AWSQuicksightAthenaAccess
- Encrypt results at rest in S3 staging directory
  - Server-side encryption with S3-managed key (SSE-S3)
  - Server-side encryption with KMS key (SSE-KMS)
  - Client-side encryption with KMS key (CSE-KMS)
- Cross-account access in S3 bucket policy possible
- Transport Layer Security (TLS) encrypts in- transit (between Athena and S3)

## Athena anti-patterns


Athena is a query engine rather than a report-layout or general ETL product. Use a visualization tool or processing service when those are the main requirement.

  - That’s what QuickSight is for
- ETL
  - Use Glue instead

## Athena: Optimizing performance


Columnar formats, compression, useful partitions and sensible file sizes reduce the work Athena must scan to answer a query.

- Small number of large files performs better than large number of small files
- Use partitions
  - If adding partitions after the fact, use MSCK REPAIR TABLE command

## Athena ACID transactions

<!-- original-note: 137 -->

Athena uses supported Iceberg tables for transactional updates and time travel. Plan table maintenance and compaction alongside concurrent reads and writes.

  - Just add ‘table_type’ = ‘ICEBERG’ in your CREATE TABLE command
- Concurrent users can safely make row-level modifications
- Compatible with EMR, Spark, anything that supports Iceberg table format.
- Removes need for custom record locking
- Time travel operations
  - Recover data recently deleted with a SELECT statement
- Remember governed tables in Lake Formation? This is another way of getting ACID features in Athena.
- Benefits from periodic compaction to preserve performance

## Athena Fine-Grained Access to AWS Glue Data Catalog


Catalog permissions determine which metadata a caller can use. Coordinate table and database authorization with permissions on the underlying data and keys.

  - Broader than data filters in Lake Formation
  - Cannot restrict to specific table versions
- At a minimum you must have a policy that grants access to your database and the Glue Data Catalog in each region.

## Athena Fine-Grained Access to AWS Glue Data Catalog


Map catalog operations to their IAM actions and resource scope. Restricting one operation does not automatically restrict every way of accessing the data.

  - ALTER or CREATE DATABASE
  - CREATE TABLE
  - DROP DATABASE or DROP TABLE
  - MSCK REPAIR TABLE
  - SHOW DATABASES or SHOW TABLES
- Just need to map these operations to their IAM actions
- Example: DROP TABLE
- More examples at

## Wait,what’s Iceberg?


Iceberg adds table metadata, snapshots and transactional behavior over lake files. It is a table format, separate from the physical file format.

  - Petabyte-scale
  - Originally from Netflix
- ACID Compliance
  - Transactional consistency for adds, removals, modifications
  - Row-level updates and deletes for GDPR compliance
- Schema Evolution
  - Update tables safely as data evolves
- Hidden Partitioning
  - Partition evolution, update partition schemes and data volumes
- Time Travel
  - Query historical data, verify changes between updates. Easy rollback.
- Efficient Metadata Management
- Works with Spark, Flink, Trino, Presto, Hive
- Integrated with AWS Glue, EMR and Athena

## Iceberg + AWS Glue / S3


Iceberg separates metadata from data files; compatible engines use catalog coordination to locate table metadata and S3 objects.

- Glue can take the place of Hive as Iceberg’s source of table metadata
- Iceberg’s API communicates with Glue catalog for metadata
- Iceberg stores / retrieves files from Amazon S3
  - Usually in Parquet format
- Spark / Flink can then sit on top of the Iceberg API
- Also Athena for ACID transactions!
  - See, this is how ACID is implemented for Athena – it just uses Iceberg’s ACID compliance.


```mermaid
flowchart LR
  accTitle: Iceberg + AWS Glue / S3
  n0["Athena / Spark / compatible engine"]
  n1["Glue catalog"]
  n2["Iceberg metadata + data in S3"]
  n0 -->|"resolve table"| n1
  n1 -->|"metadata pointer"| n2
  n0 -->|"read / commit supported operations"| n2
```

> Iceberg separates metadata from data files; compatible engines use catalog coordination to locate table metadata and S3 objects.

## Migrating Glue Data Catalogs to Iceberg


Catalog migration requires compatible Iceberg metadata and APIs. Treat metadata conversion and the data files themselves as different parts of the change.

- Once done, Athena can use it for ACID transactions
- Other reasons to migrate:
  - Compliance; expire old versions of tables, audit trails
  - Historical reporting with time travel queries
  - Data lake with many active producers and consumers
    - Consistency is needed
- In-Place Migration
  - Leave data files where they are, just create Iceberg metadata
  - Does not allow for schema or partition changes
- Shadow Migration
  - Copies the data over
  - Allows additional validation
  - Easier rollback and recovery

## CREATE TABLE AS SELECT


CTAS creates a table from query output. In Athena it can also reorganize or convert S3 data into a layout better suited to subsequent queries.

  - But it exists in other databases as well.
- Creates a new table from query results (CTAS)
- Can be used to create a new table that’s a subset of another
- Can ALSO be used to convert data into a new underlying format
  - So this is a trick to get Athena to convert data stored in S3

### Athena Federated Queries

<!-- original-note: 141 -->

Athena federation uses connectors to query supported sources beyond S3. Connections, credentials and source-side work remain necessary even though the query is submitted to Athena.

- Query data from sources other than S3
- Data source connectors translate between source and Athena
  - These run on Lambda
- Many, many are available
  - CloudWatch
  - DynamoDB
  - DocumentDB
  - RDS
  - OpenSearch
  - JDBC
  - Custom connectors
  - And lots of third-party ones
    - Cloudera, HBase, Kafka, Oracle, Snowflake, Teradata…


```mermaid
flowchart LR
  accTitle: Athena Federated Queries
  n0["Athena query"]
  n1["Connector / Lambda"]
  n2["DynamoDB / DocumentDB / logs / other source"]
  n0 -->|"federated scan request"| n1
  n1 -->|"source API / query"| n2
```

> Athena federated queries invoke a connector, commonly Lambda-based, to access supported non-S3 data sources.

## Athena Federated Queries


Federated-query support varies by connector. Views, native passthrough queries, credential handling and cross-account access have their own requirements.

  - Stored in AWS Glue
- Can use with AWS Secrets Manager
  - If you configure a VPC private endpoint for it
- Some connectors may be integrated with AWS Glue
  - Enables fine-grained access control via Lake Formation
  - Redshift, BigQuery, DynamoDB, Snowflake, MySQL…
- Cross-account federated queries are possible
  - With appropriate permissions
- Passthrough Queries allow you to use the native query language of the data source
- Some connectors may be used as Spark data sources

### Hadoop

<!-- original-note: 146 -->

Hadoop separates distributed storage, resource scheduling and processing: HDFS stores blocks, YARN allocates resources and MapReduce executes map and reduce stages.

- Distributed processing framework for big data
- In-memory caching, optimized query execution
- Supports Java, Scala, Python, and R
- Supports code reuse across
  - Batch processing
  - Interactive Queries
    - Spark SQL
  - Real-time Analytics
  - Machine Learning
    - MLLib
  - Graph Processing
- Spark Streaming
  - Integrated with Kinesis, Kafka, on EMR
- Spark is NOT meant for OLTP


```mermaid
flowchart LR
  accTitle: Hadoop
  n0["HDFS"]
  n1["YARN"]
  n2["MapReduce / Spark"]
  n0 ---|"distributed data environment"| n1
  n1 ---|"resource allocation"| n2
```

> Hadoop layers distributed storage, cluster resource management and processing frameworks.

## Apache Spark

<!-- original-note: 138 -->

Spark distributes computation across executors coordinated by a driver and cluster manager. It supports analytical processing and reusable transformations rather than transactional database serving.

- Spark apps are run as independent processes on a cluster
- The SparkContext (driver program) coordinates them
- SparkContext works through a Cluster Manager
- Executors run computations and store data
- SparkContext sends application code and tasks to executors


```mermaid
flowchart LR
  accTitle: Apache Spark
  n0["Driver"]
  n1["Cluster manager"]
  n2["Executor A<br/>Tasks + cache"]
  n3["Executor B<br/>Tasks + cache"]
  n0 -->|"request resources"| n1
  n1 -->|"allocate"| n2
  n1 -->|"allocate"| n3
  n0 -->|"schedule tasks"| n2
  n0 -->|"schedule tasks"| n3
```

> The Spark driver plans work, a cluster manager allocates resources and executors run tasks and retain cached partitions.

## Spark Components


Spark Core underpins higher-level SQL, streaming, ML and graph APIs.


```mermaid
flowchart LR
  accTitle: Spark Components
  n0["Spark Core"]
  n1["Spark SQL"]
  n2["Structured Streaming"]
  n3["MLlib"]
  n4["GraphX"]
  n0 ---|"foundation"| n1
  n0 ---|"foundation"| n2
  n0 ---|"foundation"| n3
  n0 ---|"foundation"| n4
```

> Spark Core underpins higher-level SQL, streaming, ML and graph APIs.

### Spark Structured Streaming

<!-- original-note: 139 -->

Structured Streaming treats arriving records as additions to an unbounded table. Queries continuously transform that input and publish results to a configured sink.

- Example from the personal notes: group incoming actions by a one-hour event-time window, count them and publish the result to a JDBC sink. The original sketch was conceptual rather than runnable API code.


```mermaid
flowchart LR
  accTitle: Spark Structured Streaming
  n0["Input stream"]
  n1["Unbounded table"]
  n2["Incremental query"]
  n3["Supported output sink"]
  n0 -->|"append records"| n1
  n1 -->|"continuous processing"| n2
  n2 -->|"write results"| n3
```

> Structured Streaming models incoming data as an unbounded table and incrementally updates query results in a supported sink.

## Spark Streaming + Kinesis


A supported Spark connector consumes Kinesis records for distributed stream processing; checkpointing governs recovery.


```mermaid
flowchart LR
  accTitle: Spark Streaming + Kinesis
  n0["Producers"]
  n1["Kinesis Data Streams"]
  n2["Spark connector"]
  n3["Spark processing"]
  n0 -->|"records"| n1
  n1 -->|"read shards"| n2
  n2 -->|"distributed processing"| n3
```

> A supported Spark connector consumes Kinesis records for distributed stream processing; checkpointing governs recovery.

## Spark + Redshift


Spark can exchange bulk data with Redshift through S3 staging; S3 is the transfer path, not a Spark SQL database endpoint.

- spark-redshift package allows Spark datasets from Redshift
  - It’s a Spark SQL data source
- Useful for ETL using Spark


```mermaid
flowchart LR
  accTitle: Spark + Redshift
  n0["Spark job"]
  n1["S3 staging"]
  n2["Redshift"]
  n0 -->|"write staged files"| n1
  n1 -->|"COPY load"| n2
  n2 -->|"UNLOAD"| n1
  n1 -->|"read exported files"| n0
```

> Spark can exchange bulk data with Redshift through S3 staging; S3 is the transfer path, not a Spark SQL database endpoint.

### Spark + Athena

<!-- original-note: 140 -->
<!-- title: Spark in Athena -->

Athena can run Spark notebook sessions in supported workgroups. Session resources, permissions and notebook encryption remain part of the setup.

  - Notebooks may be encrypted automatically or with KMS
- Totally serverless
- Selectable as an alternate analytics engine (vs. Athena SQL)
- Uses Firecracker for quickly spinning up Spark resources
- Programmatic API / CLI access as well
  - create-work-group, create-notebook, start-session, start-calculation-execution
- Can adjust DPU’s for coordinator and executor sizes
- Pricing based on compute usage and DPU per hour

## AWS EMR

<!-- original-note: 142 -->

Amazon EMR (Elastic MapReduce) is AWS's managed platform for running distributed big-data processing frameworks.
Instead of manually creating EC2 instances and configuring Hadoop, Spark, Hive, HDFS, networking, monitoring, etc., EMR automates much of that infrastructure setup.

```
                  Amazon S3
               Raw / Lake Data
                     │
                     ▼
              ┌─────────────┐
              │     EMR     │
              │             │
              │ Spark       │
              │ Hive        │
              │ Hadoop      │
              │ Flink       │
              │ Presto      │
              │ HBase       │
              └──────┬──────┘
                     │
                     ▼
                  Results
                     │
                     ▼
                     S3
```

### EMR - Use Cases

Typical use cases include:
- ETL / ELT processing
- Large-scale transformations
- Log processing
- Machine learning preprocessing
- Batch processing
- SQL analytics with Hive/Presto
- Streaming with Flink/Spark
- Processing data stored in S3

### EMR Cluster


With traditional EMR on EC2, the cluster contains different types of nodes.
```
                    EMR Cluster
                         │
                ┌────────┴────────┐
                │  Primary Node   │
                │    CONTROL      │
                └────────┬────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Core Node      Core Node      Task Node
      COMPUTE        COMPUTE        COMPUTE
         +               +             only
      HDFS DATA       HDFS DATA
```


```mermaid
flowchart LR
  accTitle: EMR Cluster
  n0["Primary node"]
  n1["Core nodes<br/>Compute + HDFS"]
  n2["Task nodes<br/>Compute only"]
  n0 -->|"coordinate"| n1
  n0 -->|"coordinate"| n2
```

> An EMR on EC2 cluster separates orchestration, core compute with HDFS and optional task compute without HDFS storage.

### EMR - Primary node

Previously called the master node. It coordinates and manages the cluster.
Responsibilities include:
  - coordinating distributed jobs
  - tracking tasks
  - monitoring cluster health
  - coordinating Hadoop/YARN services

- It is not where you should intentionally depend on durable business data being stored.

### EMR - Core nodes

Core nodes perform two jobs:
1. Run processing tasks.
2. Store HDFS data.

```
          HDFS dataset

         sales.parquet
              │
      ┌───────┼───────┐
      ▼       ▼       ▼
    Core 1  Core 2   Core 3
```

- HDFS distributes and replicates data across core nodes.
- Adding core nodes therefore increases both: Compute and HDFS
- Removing them is more complicated because they may contain HDFS blocks (Data Loss)

### EMR - Task node: 

- Task nodes provide compute only.
- They do not store HDFS data.
- No risk of data loss when removing
- Good use of spot instances
- Once the workload finis

### EMR Usage

<!-- original-note: 143 -->

There are two major lifecycle patterns for EMR on EC2:

- Transient clusters:
  - terminate once all steps are complete.  
  - Create the cluster → process data → save results → destroy cluster.
  - This is often highly cost-effective for batch workloads.

- Long-running clusters:
  - The cluster remains available for repeated workloads.
  - must be manually terminated
  - Can spin up task nodes using Spot instances for temporary capacity
  - Can use reserved instances on long-running clusters to save $
  - Termination protection "ON" by default

  - Useful when:
    - jobs run frequently
    - users need interactive access
    - startup latency is undesirable
    - applications depend on a continuously available cluster


### Submitting EMR workloads


There are several ways to run workloads. One concept is an EMR Step.
A step is essentially: "Run this job on my cluster."

```
EMR Cluster
    │
    ├── Step 1
    │    Import data
    │
    ├── Step 2
    │    Spark transformation
    │
    ├── Step 3
    │    Hive aggregation
    │
    └── Step 4
         Write results
```
- Jobs can be submitted using mechanisms such as the AWS Console, CLI, SDKs, APIs and supported application-specific interfaces.
- You can also interact with the primary node when direct cluster/application access is appropriate.


### EMR / AWS Integration


EMR doesn't operate in isolation.

```
                       EMR
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
       VPC             IAM              S3
    networking      permissions       storage

        ▼               ▼
   CloudWatch       CloudTrail
   monitoring        auditing
```

- **AWS VPC** - Controls the cluster's network environment. (Subnets, routing, Security Groups, Network Access)
- **AWS IAM** - Controls what EMR and its jobs are allowed to access.
- **AWS S3** -  Provides durable input/output storage.
- **AWS CloudWatch** - Used for operational monitoring, metrics and alarms.
- **AWS CloudTrail** - Records AWS API activity.

### EMR Storage

<!-- original-note: 144 -->

This is one of the most important EMR topics.
> HDFS → cluster storage (end on termination)
> S3 → durable external object storage

HDFS stands for Hadoop Distributed File System distributes data across core nodes.
```
                HDFS

            Dataset A
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
    Core 1    Core 2    Core 3
```
HDFS replication helps protect against individual node failures.

### EMRFS

EMRFS allows Hadoop ecosystem applications running on EMR to interact with Amazon S3.

Conceptually:
```
Spark / Hive / Hadoop
          │
        EMRFS
          │
          ▼
          S3
```

#### EMRFS Consistent View Feature

Older EMR architectures had to account for historical S3 lack of consistency characteristics by using workarounds.
```
Step 1:
Spark writes 100 files to S3
        ↓
Step 2:
Hive immediately lists the directory
        ↓
Hive temporarily sees only 97 files
        ↓
Incomplete processing ❌
```


For example, **Consistent View Feature**:
```
Spark
  │
  ▼
EMRFS
  │
  ├──► Write object → S3
  │
  └──► Record metadata → DynamoDB
```

So:
```
S3 LIST: 97 objects

DynamoDB metadata: 100 objects
        ↓
EMRFS knows something
is temporarily inconsistent
```

But Amazon S3 now provides strong read-after-write and LIST consistency, so this historical workaround is no longer necessary for S3 consistency.
**Current reference (checked 2026-10-13):** [S3 consistency model](https://aws.amazon.com/s3/consistency/).

### EMR Local Storage and Attached Storages


There are three storage concepts worth separating:
- Local / Instance Storage
- EBS
- HDFS

**Local Storage** Good for temporary working data such as: buffer, caches, shuffle, temp files.
**EBS** EMR can use supported EBS volumes as additional storage attached to EC2 instances. 

EBS can therefore contribute storage to HDFS.
  - Allows use of EMR on EBS-only types (M4, C4)
  - Deleted when cluster is terminated
  - EBS volumes can only be attached when launching a cluster

> If you need data to survive cluster destruction, persist it somewhere appropriate such as S3.

Manually detaching a managed EBS volume can cause EMR to interpret the situation as an infrastructure failure.

### AWS EMR Managed Scaling

<!-- original-note: 145 -->

Imagine your workload changes throughout the day:
```
Workload

High      ████
          ████       ███
Medium    █████     █████
Low    ███████████████████
       00  06  12  18  24
```
- Keeping maximum capacity running all day wastes money.
- Managed Scaling dynamically adjusts cluster capacity within boundaries you configure (MIN/MAX).

EMR can manage capacity involving:
- On-Demand Instances
- Spot Instances
- instance groups
- instance fleets

### AWS EMR - Older Approach Scaling policies

You could create scaling rules based on CloudWatch metrics.
```
YARNMemoryAvailablePercentage < threshold
                ↓
           add nodes
```
- Supports instance groups only


### EMR Serverless

<!-- original-note: 147 -->

EMR Serverless changes the operational model significantly. 
```
You
 │
 ▼
Create application
 │
 ▼
Submit job
 │
 ▼
EMR allocates workers
 │
 ▼
Job executes
```

### EMR Serverless Example

1. You submit a script as an EMR Serverless job.

```python
  transactions = spark.read.parquet(
      "s3://company/raw/"
  )

  results = transactions.groupBy("country").sum("amount")

  results.write.parquet(
      "s3://company/processed/"
  )
```

2. EMR Serverless handles the underlying worker capacity needed to execute it.

```
             Spark job
                 │
                 ▼
         EMR Serverless
                 │           (capacity required)
         ┌───────┼───────┐-------┐
         ▼       ▼       ▼       ▼
       Worker  Worker  Worker  Add Worker
```

### EMR Serverless Permissions


There are two distinct permission concepts worth understanding.
**Caller permissions** Determine whether: "Is User/application X allowed to submit or manage this EMR Serverless job?"
**Job execution role** Determines: "What AWS resources can the running job access?"

```
User / Application
        │
        │ IAM caller permission
        ▼
Submit EMR Serverless job
        │
        ▼
Job Execution Role
        │
        ├── Read S3
        ├── Write S3
        └── Access other permitted AWS resources
```


```mermaid
flowchart LR
  accTitle: EMR Serverless Permissions
  n0["User / CLI"]
  n1["EMR Serverless application"]
  n2["Job execution role"]
  n3["Input / output / logs"]
  n0 -->|"submit job"| n1
  n1 -->|"assume role"| n2
  n2 -->|"authorized data access"| n3
```

> EMR Serverless runs submitted jobs with a job execution role; caller permissions and job data permissions are distinct.

### EMR Serverless Application Lifecycle


An EMR Serverless application can start, stop, restart and terminate.
```
STOP
 ↓
Application still exists
Can restart later


TERMINATE / delete
 ↓
Application lifecycle ends
```



```mermaid
flowchart TB
  accTitle: EMR Serverless Application Lifecycle
  n0["Creating"]
  n1["Created"]
  n2["Starting"]
  n3["Started"]
  n4["Stopping"]
  n5["Stopped"]
  n6["Terminated"]
  n0 -->|"created"| n1
  n1 -->|"start"| n2
  n2 -->|"ready"| n3
  n3 -->|"stop"| n4
  n4 -->|"stopped"| n5
  n5 -->|"restart"| n2
  n5 -->|"delete"| n6
```

> An EMR Serverless application can start, stop and restart before termination.

### EMR Serverless Pre-Initialized Capacity


Serverless doesn't necessarily mean:
> "Every resource magically exists instantly."

Workers may need to be provisioned before a job can execute.
That introduces startup latency.
If jobs are latency-sensitive, you can configure **pre-initialized capacity**.

> Note: When sizing workers, remember that frameworks such as Spark need resources not only for your application payload but also for framework/worker overhead.

### EMR Serverless Security


Security still applies even though AWS manages the underlying compute.
Think about four areas:
```
        EMR Serverless Security
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
   IAM       Encryption    Network
     │           │           │
     └───────────┼───────────┘
                 ▼
                S3
```
Supported EMR Serverless framework communication uses encryption mechanisms for relevant traffic, 
including Spark driver/executor communication and TLS for supported AWS service interactions.

The broader principle is:
  Protect data at rest (SSE-S3, SSE-KMS, or CSE), in transit (TLS/HTTPS), and through IAM authorization.

- Spark communication between drivers & executors is encrypted
- Hive communication between Glue Metastore and EMR uses TLS
- A bucket policy can enforce secure transport using: aws:SecureTransport

### EMR On EKS

<!-- original-note: 148 -->

The third major deployment model is EMR on EKS = Elastic Kubernetes Service.
You can execute supported EMR analytics workloads using Kubernetes infrastructure
```
               EKS Cluster
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Web/API       Spark      Other
    workload      jobs       workloads
                    ▲
                    │
                EMR on EKS
```

This is particularly useful for organizations that already operate Kubernetes and want analytics workloads to share Kubernetes infrastructure with other compatible workloads.

> EMR on EKS removes the need for a dedicated EMR EC2 cluster, but it does not remove the EKS cluster.


```mermaid
flowchart LR
  accTitle: EMR On EKS
  n0["EKS cluster"]
  n1["Spark driver / executors"]
  n2["Other Kubernetes workloads"]
  n3["Worker capacity across AZs"]
  n0 -->|"EMR job"| n1
  n0 -->|"other pods"| n2
  n1 -->|"scheduled compute"| n3
  n2 -->|"scheduled compute"| n3
```

> EMR on EKS schedules Spark workloads onto Kubernetes capacity that may also host other applications.

### EMR Models Comparison

| | EMR on EC2 | EMR Serverless | EMR on EKS |
|---|---|---|---|
| Infrastructure | EC2 cluster | AWS-managed workers | EKS |
| You manage cluster capacity? | Yes | Much less | Kubernetes capacity still matters |
| HDFS | Yes | Not traditional cluster HDFS | Not traditional EMR HDFS |
| Good for | Traditional Hadoop/Spark clusters | Job-oriented Spark/Hive workloads | Kubernetes-centric organizations |
| Scaling | Manual/Managed Scaling | Serverless worker scaling | Kubernetes + EMR mechanisms |
| Operational overhead | Highest | Lowest | Depends on EKS environment |

## Amazon Kinesis Data Streams

<!-- original-note: 149 -->

Kinesis Data Streams retains ordered shard records for independent consumers and replay. Partition-key distribution and consumer type determine throughput and read behavior.


```mermaid
flowchart LR
  accTitle: Amazon Kinesis Data Streams
  n0["Producers"]
  n1["Partition-key routing"]
  n2["Shard A"]
  n3["Shard B"]
  n4["Consumers"]
  n0 -->|"PutRecord(s)"| n1
  n1 -->|"hash key"| n2
  n1 -->|"hash key"| n3
  n2 -->|"read records"| n4
  n3 -->|"read records"| n4
```

> Producers choose partition keys; Kinesis assigns records to shards that consumers read independently.

## Kinesis Data Streams


Retention enables replay independently of the rate at which consumers process records. Record-size limits, ordering and delivery behavior remain separate constraints.

- Current correction: default maximum Kinesis record size is 1 MiB; supported configuration can raise it to 10 MiB for intermittent large records. Sustained per-shard throughput limits remain separate.
- Ability to reprocess (replay) data
- Once data is inserted in Kinesis, it can’t be deleted (immutability)
- Data that shares the same partition goes to the same shard (ordering)
- Producers: AWS SDK, Kinesis Producer Library (KPL), Kinesis Agent
- Consumers:
  - Write your own: Kinesis Client Library (KCL), AWS SDK
  - Managed: AWS Lambda, Data Firehose, Kinesis Data

**Current reference (checked 2026-10-13):** [Kinesis large records](https://docs.aws.amazon.com/streams/latest/dev/large-records.html).

## Kinesis Data Streams – Capacity Modes


Provisioned streams expose shard-count planning; on-demand streams manage capacity differently. Compare scaling behavior, limits and billing for the chosen mode.

- Current correction: default maximum Kinesis record size is 1 MiB; supported configuration can raise it to 10 MiB for intermittent large records. Sustained per-shard throughput limits remain separate.
  - You choose the number of shards provisioned, scale manually or using API
  - Each shard gets 1MB/s in (or 1000 records per second)
  - Each shard gets 2MB/s out (classic or enhanced fan-out consumer)
  - You pay per shard provisioned per hour
- On-demand mode:
  - No need to provision or manage the capacity
  - Default capacity provisioned (4 MB/s in or 4000 records per second)
  - Scales automatically based on observed throughput peak during the last 30 days
  - Pay per stream per hour & data in/out per GB

**Current reference (checked 2026-10-13):** [Kinesis large records](https://docs.aws.amazon.com/streams/latest/dev/large-records.html).

## Kinesis data streams security

<!-- original-note: 150 -->

Protect stream access with IAM and network controls, use TLS in transit and configure encryption at rest. Client-side encryption remains an application responsibility.

- Control access / authorization using IAM policies
- Encryption in flight using HTTPS endpoints
- Encryption at rest using KMS
- You can implement encryption/decryption of data on client side (harder)
- VPC Endpoints available for Kinesis to access within VPC
- Monitor API calls using CloudTrail


```mermaid
flowchart LR
  accTitle: Kinesis data streams security
  n0["VPC producer / consumer"]
  n1["Interface VPC endpoint"]
  n2["Kinesis Data Streams"]
  n3["KMS"]
  n0 -->|"private HTTPS"| n1
  n1 -->|"authorized API calls"| n2
  n2 -->|"encryption key operations"| n3
```

> Kinesis access combines network reachability, IAM authorization and optional KMS encryption controls.

## Kinesis Producers

<!-- original-note: 151 -->

Choose a producer by where records originate: SDK calls for application code, KPL for buffered high-throughput publishing or an agent for supported log-file ingestion.

- Kinesis SDK
- Kinesis Producer Library (KPL)
- Kinesis Agent
- 3rd party libraries: Spark, Log4J Appenders, Flume, Kafka Connect, NiFi…


```mermaid
flowchart LR
  accTitle: Kinesis Producers
  n0["SDK"]
  n1["KPL"]
  n2["Kinesis agent"]
  n3["Third-party producer"]
  n4["Kinesis stream"]
  n0 -->|"API writes"| n4
  n1 -->|"buffered / aggregated writes"| n4
  n2 -->|"file-tail records"| n4
  n3 -->|"supported integration"| n4
```

> The SDK, KPL, agent and supported third-party integrations are alternative producer paths into Kinesis.

### SDK

<!-- original-note: 152 -->
<!-- title: Kinesis producer SDK -->

PutRecord sends one record; PutRecords groups records in a request. Inspect individual failures and distribute partition keys before adding retries or capacity.

- PutRecords uses batching and increases throughput => less HTTP requests
- ProvisionedThroughputExceeded if we go over the limits
- + AWS Mobile SDK: Android, iOS, etc...
- Use case: low throughput, higher latency, simple API, AWS Lambda
- Managed AWS sources for Kinesis Data Streams:
  - CloudWatch Logs
  - AWS IoT
  - Kinesis Data Analytics

## AWS Kinesis API – Exceptions


Throughput exceptions signal that an applicable shard or stream limit was exceeded. Inspect partition-key distribution before repeatedly retrying the same load.

  - Happens when sending more data (exceeding MB/s or TPS for any shard)
  - Make sure you don’t have a hot shard (such as your partition key is bad and too much data goes to that partition)
- Solution:
  - Retries with backoff
  - Increase shards (scaling)
  - Ensure your partition key is a good one

### KPL (Kinesis Producer Library)

<!-- original-note: 153 -->
<!-- title: Kinesis Producer Library -->

KPL buffers, aggregates and collects records to improve publishing efficiency. The resulting latency and de-aggregation requirements are part of the tradeoff.

- Used for building high performance, long-running producers
- Automated and configurable retry mechanism
- Synchronous or Asynchronous API (better performance for async)
- Submits metrics to CloudWatch for monitoring
- Batching (both turned on by default) – increase throughput, decrease cost:
  - Collect Records and Write to multiple shards in the same PutRecords API call
  - Aggregate – increased latency
    - Capability to store multiple records in one record (go over 1000 records per second limit)
    - Increase payload size and improve throughput (maximize 1MB/s limit)
- Compression must be implemented by the user
- KPL Records must be de-coded with KCL or special helper library

- Review prompt: explain collection versus aggregation using the batching diagram, then describe how RecordMaxBufferedTime trades latency for packing efficiency.

## Kinesis Producer Library (KPL) Batching


KPL aggregation packs user records into a Kinesis record; collection batches multiple Kinesis records into one PutRecords request.

- We can influence the batching efficiency by introducing some delay with RecordMaxBufferedTime (default 100ms)


```mermaid
flowchart LR
  accTitle: Kinesis Producer Library (KPL) Batching
  n0["User records"]
  n1["Aggregated Kinesis records"]
  n2["PutRecords request"]
  n3["Stream"]
  n0 -->|"aggregation"| n1
  n1 -->|"collection"| n2
  n2 -->|"batch API call"| n3
```

> KPL aggregation packs user records into a Kinesis record; collection batches multiple Kinesis records into one PutRecords request.

### Anti pattern:

<!-- original-note: 154 -->
<!-- title: When to avoid KPL buffering -->

Buffering improves packing efficiency but delays delivery. Use a more direct publishing path when the application cannot tolerate that extra wait.

- The KPL can incur an additional processing delay of up to RecordMaxBufferedTime within the library (user- configurable)
- Larger values of RecordMaxBufferedTime results in higher packing efficiencies and better performance
- Applications that cannot tolerate this additional delay may need to use the AWS SDK directly


```mermaid
flowchart LR
  accTitle: When to avoid KPL buffering
  n0["Application"]
  n1["KPL buffer"]
  n2["Direct SDK write"]
  n3["Kinesis"]
  n0 -->|"throughput-oriented path"| n1
  n1 -->|"flush batch"| n3
  n0 -->|"low-buffering path"| n2
  n2 -->|"API request"| n3
```

> KPL buffering trades some latency for efficient requests; a direct SDK write avoids that producer-side buffer.

### Kinesis Agent

<!-- original-note: 155 -->

The Kinesis Agent watches supported log files and publishes their contents, handling rotation, checkpoints and retries while exposing operational metrics.

- Java-based agent, built on top of KPL
- Install in Linux-based server environments
- Features:
  - Write from multiple directories and write to multiple streams
  - Routing feature based on directory / log file
  - Pre-process data before sending to streams (single line, csv to json, log to json…)
  - The agent handles file rotation, checkpointing, and retry upon failures
  - Emits metrics to CloudWatch for monitoring

## Kinesis Consumers - Classic

<!-- original-note: 156 -->
<!-- title: Kinesis shared-throughput consumers -->

Classic consumers poll shards and share each shard's read throughput. More consumers do not create extra shared read capacity.

- Kinesis SDK
- Kinesis Client Library (KCL)
- Kinesis Connector Library
- 3rd party libraries: Spark, Log4J Appenders, Flume, Kafka Connect…
- Kinesis Firehose
- AWS Lambda
- (Kinesis Consumer Enhanced Fan-Out discussed in the next lecture)


```mermaid
flowchart LR
  accTitle: Kinesis shared-throughput consumers
  n0["Kinesis stream"]
  n1["SDK consumer"]
  n2["KCL application"]
  n3["Lambda mapping"]
  n4["Firehose / analytics"]
  n0 -->|"read"| n1
  n0 -->|"read"| n2
  n0 -->|"poll"| n3
  n0 -->|"supported consumer integration"| n4
```

> Multiple consumer applications can independently process the same stream using SDKs, KCL or managed integrations.

### Kinesis SDK

<!-- original-note: 157 -->
<!-- title: Kinesis consumer SDK -->

GetRecords reads through a shard iterator. Polling frequency, batch size and shared throughput jointly determine latency and throttling.

- Classic Kinesis - Records are polled by consumers from a shard
- Each shard has 2 MB total aggregate throughput
- GetRecords returns up to 10MB of data (then throttle for 5 seconds) or up to 10000 records
- Maximum of 5 GetRecords API calls per shard per second = 200ms latency
- If 5 consumers application consume from the same shard, means every consumer can poll once a second and receive less than 400 KB/s


```mermaid
flowchart LR
  accTitle: Kinesis consumer SDK
  n0["Shard<br/>Shared read budget"]
  n1["Consumer A"]
  n2["Consumer B"]
  n3["Consumer C"]
  n0 -->|"GetRecords"| n1
  n0 -->|"GetRecords"| n2
  n0 -->|"GetRecords"| n3
```

> Shared-throughput consumers compete for each shard's shared read capacity; adding consumers does not multiply that capacity.

### Kinesis Client Library (KCL)

<!-- original-note: 158 -->
<!-- title: Kinesis Client Library -->

KCL coordinates workers, leases shards, checkpoints progress and handles resharding. Its DynamoDB coordination tables also need sufficient capacity.

- KCL consumes records and de-aggregates KPL records for the application record processor.
- Workers discover and share shard assignments, then checkpoint progress for recovery.
- DynamoDB coordination-table throttling can delay worker progress; monitor its capacity as well as the stream.
- An expired iterator needs investigation of processing delays and iterator handling; increasing DynamoDB capacity is not a universal fix.
- Verify library and language support for the selected KCL version.


```mermaid
flowchart LR
  accTitle: Kinesis Client Library
  n0["Stream shards"]
  n1["KCL worker A"]
  n2["KCL worker B"]
  n3["DynamoDB lease / checkpoint table"]
  n0 -->|"leased shards"| n1
  n0 -->|"leased shards"| n2
  n1 -->|"lease / checkpoint"| n3
  n2 -->|"lease / checkpoint"| n3
```

> KCL coordinates shard leases and checkpoints in DynamoDB so workers can rebalance and recover progress.

### Kinesis Connector Library

<!-- original-note: 159 -->

The older connector library combines KCL consumption with destination writers. For supported use cases, compare it with managed Firehose delivery or Lambda processing.

- Older Java library (2016), leverages the KCL library
- Write data to:
  - Amazon S3
  - DynamoDB
  - Redshift
  - OpenSearch
- Kinesis Firehose replaces the Connector Library for a few of these targets, Lambda for the others


```mermaid
flowchart LR
  accTitle: Kinesis Connector Library
  n0["Kinesis"]
  n1["Consumer application"]
  n2["S3 / DynamoDB / Redshift / OpenSearch"]
  n0 -->|"consume"| n1
  n1 -->|"configured delivery"| n2
```

> A Kinesis consumer application can transform stream data and deliver it to configured destinations; check library maintenance before use.

### Kinesis Firehose

<!-- original-note: 160 -->
<!-- title: Firehose as a stream consumer -->

A Firehose delivery stream can consume Kinesis records and deliver buffered output. It is a managed delivery path rather than a KCL application.

### AWS Lambda

<!-- original-note: 161 -->
<!-- title: Lambda as a stream consumer -->

A Lambda event source mapping reads Kinesis batches and invokes the function. Configure batch handling and retry behavior around ordered shard processing.

- Lambda consumer has a library to de-aggregate record from the KPL
- Lambda can be used to run lightweight ETL to:
  - Amazon S3
  - DynamoDB
  - Redshift
  - OpenSearch
  - Anywhere you want
- Lambda can be used to trigger notifications / send emails in real time
- Lambda has a configurable batch size (more in Lambda section)

### Kinesis Enhanced Fan out

<!-- original-note: 162 -->
<!-- title: Kinesis enhanced fan-out -->

Enhanced fan-out gives registered consumers dedicated per-shard read throughput and a push-based delivery path, trading extra cost for isolation and lower latency.

- New game-changing feature from August 2018.
- Works with KCL 2.0 and AWS Lambda (Nov 2018)
- Each Consumer get 2 MB/s of provisioned throughput per shard
- That means 20 consumers will get 40MB/s per shard aggregated
- No more 2 MB/s limit!
- Enhanced Fan Out: Kinesis pushes data to consumers over HTTP/2
- Reduce latency (~70 ms)


```mermaid
flowchart LR
  accTitle: Kinesis enhanced fan-out
  n0["Shard"]
  n1["Registered consumer A"]
  n2["Registered consumer B"]
  n0 -->|"dedicated delivery"| n1
  n0 -->|"dedicated delivery"| n2
```

> Enhanced fan-out gives registered consumers dedicated per-shard read throughput through SubscribeToShard rather than sharing GetRecords capacity.

## Enhanced Fan-Out vs Standard Consumers


Shared consumers compete for shard read throughput; enhanced fan-out isolates supported consumers. Compare both throughput allocation and registered-consumer quotas.

  - Low number of consuming applications (1,2,3…)
  - Can tolerate ~200 ms latency
  - Minimize cost
- Enhanced Fan Out Consumers:
  - Multiple Consumer applications for the same Stream
  - Low Latency requirements ~70ms
  - Higher costs (see Kinesis pricing page)
  - Registered enhanced-fan-out consumer quotas depend on stream mode: consult current quotas; do not generalize one mode's limit.

**Current reference (checked 2026-10-13):** [Kinesis quotas by capacity mode](https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html).

### Kinesis Operations - Adding Sharts

<!-- original-note: 163 -->
<!-- title: Splitting Kinesis shards -->

Splitting a shard increases provisioned capacity or divides a hot key range. Existing records remain on the parent shard until retention expires.

- Also called “Shard Splitting”
- Can be used to increase the Stream capacity (1 MB/s data in per shard)
- Can be used to divide a “hot shard”
- The old shard is closed and will be deleted once the data is expired


```mermaid
flowchart LR
  accTitle: Splitting Kinesis shards
  n0["Parent shard"]
  n1["Child A"]
  n2["Child B"]
  n0 -->|"split hash range"| n1
  n0 -->|"split hash range"| n2
```

> A split closes the parent shard and creates two children covering its hash-key range.

### Merging Sharts

<!-- original-note: 164 -->
<!-- title: Merging Kinesis shards -->

Merging adjacent shards reduces provisioned capacity. Continue consuming the closed parents correctly while records remain within retention.

- Decrease the Stream capacity and save costs
- Can be used to group two shards with low traffic
- Old shards are closed and deleted based on data expiration


```mermaid
flowchart LR
  accTitle: Merging Kinesis shards
  n0["Adjacent parent A"]
  n1["Adjacent parent B"]
  n2["Merged child"]
  n0 -->|"merge"| n2
  n1 -->|"merge"| n2
```

> A merge combines adjacent shard hash-key ranges into one child shard.

### Out of order records after resahrding

<!-- original-note: 165 -->
<!-- title: Ordering after Kinesis resharding -->

Read a parent shard fully before its child shards to preserve the ordering dependency. KCL manages that progression for its consumers.

- After a reshard, you can read from child shards
- However, data you haven’t read yet could still be in the parent
- If you start reading the child before completing reading the parent, you could read data for a particular hash key out of order
- After a reshard, read entirely from the parent until you don’t have new records
- Note: The Kinesis Client Library (KCL) has this logic already built-in, even after resharding operations


```mermaid
flowchart LR
  accTitle: Ordering after Kinesis resharding
  n0["Parent records"]
  n1["Parent drained"]
  n2["Child A records"]
  n3["Child B records"]
  n0 -->|"finish parent"| n1
  n1 -->|"then consume"| n2
  n1 -->|"then consume"| n3
```

> A consumer must finish a parent before processing its children when it needs to preserve ordering across resharding.

### Kinesis Operations - Auto Scaling

<!-- original-note: 166 -->
<!-- title: Kinesis scaling -->

Distinguish managed on-demand capacity from a provisioned stream's shard-scaling automation. Capacity limits and the time required to reshard still matter.

- For a provisioned stream, UpdateShardCount requests a supported shard-count change.
- External automation can observe metrics and request that change, including through a Lambda workflow.
- On-demand mode uses a different capacity-management model; do not apply a blanket "no automatic scaling" statement to every stream.

- Review prompt: fill in a complete provisioned-scaling example around UpdateShardCount, including limits, observation periods and failure handling.


```mermaid
flowchart LR
  accTitle: Kinesis scaling
  n0["Kinesis metrics"]
  n1["CloudWatch alarm"]
  n2["Lambda / automation"]
  n3["UpdateShardCount"]
  n0 -->|"capacity signal"| n1
  n1 -->|"trigger"| n2
  n2 -->|"request resharding"| n3
```

> For provisioned streams, external automation can observe CloudWatch metrics and request shard-count changes; on-demand capacity is a different mode.

## Kinesis Scaling Limitations


Provisioned resharding has operational and quota constraints. Plan a capacity change before the current stream becomes the bottleneck.

- You can only perform one resharding operation at a time and it takes a few seconds
- For1000 shards, it takes 30K seconds (8.3 hours) to double the shards to 2000
- You can’t do the following:
  - Scale more than 10x for each rolling 24-hour period for each stream
  - Scale up to more than double your current shard count for a stream
  - Scale down below half your current shard count for a stream
  - Scale up to more than 10,000 shards in a stream
  - Scale a stream with more than 10,000 shards down unless the result is less than 10,000 shards
  - Scale up to more than the shard limit for your account

### Kinesis Handling duplicates for Producers

<!-- original-note: 167 -->
<!-- title: Producer duplicates -->

A timed-out producer can retry a write that already succeeded. Include a stable record identifier so the processing path can recognize duplicates.

- Producer retries can create duplicates due to network timeouts
- Although the two records have identical data, they also have unique sequence numbers
- Fix: embed unique record ID in the data to de-duplicate on the consumer side


```mermaid
flowchart LR
  accTitle: Producer duplicates
  n0["Producer"]
  n1["Successful write"]
  n2["Lost acknowledgement"]
  n3["Retry"]
  n4["Consumer deduplication"]
  n0 -->|"send record"| n1
  n1 -->|"response lost"| n2
  n2 -->|"uncertain result"| n3
  n3 -->|"same logical record may recur"| n4
  n1 -->|"original record"| n4
```

> An unacknowledged successful write may be retried and create a duplicate. Use an application record identifier and idempotent processing.

### Kinesis Handling duplicates for consumers

<!-- original-note: 168 -->
<!-- title: Consumer duplicates -->

Worker restarts, checkpoints and resharding can cause records to be processed again. Make destination effects idempotent rather than assuming a single delivery.

- Consumer retries happen when record processors restart:
- Fixes:
  - Make your consumer application idempotent
  - If the final destination can handle duplicates, it’s recommended to do it there
- More info: https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-

## Kinesis Security


IAM controls who can publish or consume, while TLS and KMS protect data on its network and storage paths. These are complementary controls.

- Encryption in flight using HTTPS endpoints
- Encryption at rest using KMS
- Client side encryption must be manually implemented (harder)
- VPC Endpoints available for Kinesis to access within VPC

## Kinesis Data Firehose

<!-- original-note: 169 -->
<!-- title: Amazon Data Firehose -->

Firehose buffers incoming records and delivers them to supported destinations, with optional transformation and backup paths. It does not expose a general replay API for arbitrary consumers.


```mermaid
flowchart LR
  accTitle: Amazon Data Firehose
  n0["Direct / stream producers"]
  n1["Data Firehose"]
  n2["Optional Lambda transform"]
  n3["Configured destination"]
  n4["S3 backup"]
  n0 -->|"ingest"| n1
  n1 -->|"optional transformation"| n2
  n2 -->|"deliver"| n3
  n1 -->|"without transformation"| n3
  n1 -->|"configured backup"| n4
```

> Data Firehose buffers delivery, optionally transforms records and sends them to a configured destination with optional S3 backup.

## Firehose operations


Firehose manages the delivery infrastructure, but buffering, destinations, transformation and failed-data handling still require configuration.

- Near Real Time (Buffer based on time and size, optionally can be disabled)
- Load data into Redshift / Amazon S3 / OpenSearch / Splunk
- Automatic scaling
- Supports many data formats
- Data Conversions from JSON to Parquet / ORC (only for S3)
- Data Transformation through AWS Lambda (ex: CSV => JSON)
- Supports compression when target is Amazon S3 (GZIP, ZIP, and SNAPPY)
- Only GZIP is the data is further loaded into Redshift
- Pay for the amount of data going through Firehose
- Spark / KCL do not read from KDF

## Data Firehose Delivery Diagram


Firehose delivery to Redshift stages files in S3 and issues COPY; Lambda transformation and failed-record backup are optional branches.


```mermaid
flowchart TB
  accTitle: Data Firehose Delivery Diagram
  n0["Kinesis"]
  n1["Firehose"]
  n2["Optional Lambda"]
  n3["S3 staging"]
  n4["Redshift COPY"]
  n5["S3 failed-record backup"]
  n0 -->|"stream input"| n1
  n1 -->|"transform"| n2
  n2 -->|"buffered output"| n3
  n1 -->|"untransformed path"| n3
  n3 -->|"bulk load"| n4
  n1 -->|"configured error backup"| n5
```

> Firehose delivery to Redshift stages files in S3 and issues COPY; Lambda transformation and failed-record backup are optional branches.

### Kinesis Firehose Buffer Sizing

<!-- original-note: 170 -->
<!-- title: Firehose buffering -->

Delivery occurs according to the configured size and time thresholds. Larger buffers can improve efficiency while increasing the delay before data reaches the destination.

- The buffer is flushed based on time and size rules
- Buffer Size (ex: 32MB): if that buffer size is reached, it’s flushed
- Buffer Time (ex: 2 minutes): if that time is reached, it’s flushed
- Firehose can automatically increase the buffer size to increase throughput
- High throughput => Buffer Size will be hit
- Low throughput => Buffer Time will be hit

### Kinesis Data Streams vs Firehose

<!-- original-note: 171 -->
<!-- title: Kinesis Data Streams and Firehose -->

Choose Streams for retained records, independent consumers and replay. Choose Firehose for managed buffered delivery into a supported destination.

| Requirement | Kinesis Data Streams | Data Firehose |
| --- | --- | --- |
| Consumption | Independent applications read retained records | Managed delivery to configured destinations |
| Replay | Within configured retention | No general replay API for arbitrary consumers |
| Timing | Consumer-dependent stream processing | Buffered delivery |
| Processing | Application, Lambda or supported analytics consumer | Supported transformation and format-conversion options |
| Capacity | Provisioned or supported on-demand modes | Managed delivery scaling |

### Troubleshooting Kinesis data stream producers

<!-- original-note: 172 -->
<!-- title: Troubleshooting Kinesis producers -->

When publishing is slow, distinguish hot shards, insufficient capacity, batching choices and network or service errors before changing the stream.

  - Service limits may be exceeded. Check for throughput exceptions, see what operations are being throttled. Different calls have different limits.
  - There are shard-level limits for writes and reads
  - Other operations (ie, CreateStream, ListStreams, DescribeStreams) have stream-level limits of 5-20 calls per second
  - Select partition key to evenly distribute puts across shards
- Large producers
  - Batch things up. Use Kinesis Producer Library, PutRecords with multi-records, or aggregate records into larger files.
- Small producers (i.e. apps)
  - Use PutRecords or Kinesis Recorder in the AWS Mobile SDKs

## Kinesis producer errors


Differentiate temporary service errors from invalid requests and oversize records. Apply retries only to recoverable failures and inspect per-record outcomes.

  - This indicates an AmazonKinesisException error rate above 1%
  - Implement a retry mechanism
- Connection errors from Flink to Kinesis
  - Network issue or lack of resources in Flink’s environment
  - Could be a VPC misconfiguration
- Timeout errors from Flink to Kinesis
  - Adjust RequestTimeout and #setQueueLimit on FlinkKinesisProducer
- Throttling errors
  - Check for hot shards with enhanced monitoring (shard-level)
  - Check logs for “micro spikes” or obscure metrics breaching limits
  - Try a random partition key or improve the key’s distribution
  - Use exponential backoff
  - Rate-limit

### Troubleshooting Kinesis data stream Consumers

<!-- original-note: 173 -->
<!-- title: Troubleshooting Kinesis consumers -->

Investigate missing or delayed processing through checkpoints, record handlers, iterator age, permissions and downstream processing capacity.

  - Check for unhandled exceptions on processRecords
- Records in same shard are processed by more than one processor
  - May be due to failover on the record processor workers
  - Adjust failover time
  - Handle shutdown methods with reason “ZOMBIE”
- Reading is too slow
  - Increase number of shards
  - maxRecords per call is too low
  - Your code is too slow (test an empty processor vs. yours)
- GetRecords returning empty results
  - This is normal, just keep calling GetRecords
- Shard Iterator expires unexpectedly
  - May need more write capacity on the shard table in DynamoDB
- Record processing falling behind
  - Increase retention period while troubleshooting
  - Usually insufficient resources
  - Monitor with GetRecords.IteratorAgeMilliseconds and MillisBehindLatest

## Kinesis and Lambda invocation failures


If Lambda is not processing a stream, inspect its event source mapping, execution permissions and failure behavior before changing producer code.

  - Permissions issue on execution role
  - Function is timing out (check max execution time)
  - Breaching concurrency limits
  - Monitor IteratorAge metric; it will increase is this is a problem
- ReadProvisionedThroughputExceeded exception
  - Throttling
  - Reshard your stream
  - Reduce size of GetRecords requests
  - Use enhanced fan-out
  - Use retries and exponential backoff

## Kinesis consumer latency


High iterator age can indicate slow processing, insufficient consumer capacity or downstream delays. Follow the processing path to locate the bottleneck.

  - Monitor with GetRecords.Latency and IteratorAge
  - Increase shards
  - Increase retention period
  - Check CPU and memory utilization (may need more memory)
- 500 errors
  - Same as producers – indicates a high error rate (>1%)
  - Implement a retry mechanism
- Blocked or stuck KCL application
  - Optimize your processRecords method
  - Increase maxLeasesPerWorker
  - Enable KCL debug logs

## Amazon Kinesis Data Analytics for SQL Applications


Historical Kinesis Data Analytics SQL architecture; applications of this service were discontinued in 2026.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).


```mermaid
flowchart LR
  accTitle: Amazon Kinesis Data Analytics for SQL Applications
  n0["Streaming input"]
  n1["Retired SQL application"]
  n2["Output stream"]
  n3["Error stream"]
  n0 -->|"input"| n1
  n1 -->|"query result"| n2
  n1 -->|"processing error"| n3
```

> Historical Kinesis Data Analytics SQL architecture; applications of this service were discontinued in 2026.

## In more depth…


Historical SQL analytics could join streaming input with S3 reference data; this is not a current deployment recommendation.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).


```mermaid
flowchart LR
  accTitle: In more depth…
  n0["Kinesis / Firehose input"]
  n1["S3 reference data"]
  n2["Retired SQL application"]
  n3["Output destination"]
  n0 -->|"stream"| n2
  n1 -->|"reference table"| n2
  n2 -->|"SQL output"| n3
```

> Historical SQL analytics could join streaming input with S3 reference data; this is not a current deployment recommendation.

## Reference tables are cool


Historical in-application streams separated source, SQL transformation, destination and error handling.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.
- Inexpensive way to “join” data for quick lookups
  - i.e., look up the city associated with a zip code
  - Mapping is stored in S3 which is very inexpensive
  - Just use a “JOIN” command to use the data in your queries

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).


```mermaid
flowchart TB
  accTitle: Reference tables are cool
  n0["Source stream"]
  n1["In-application input"]
  n2["SQL transformation"]
  n3["In-application output"]
  n4["Destination"]
  n5["Error stream"]
  n0 -->|"ingest"| n1
  n1 -->|"query"| n2
  n2 -->|"emit"| n3
  n3 -->|"deliver"| n4
  n2 -->|"errors"| n5
```

> Historical in-application streams separated source, SQL transformation, destination and error handling.

## Kinesis Data Analytics + Lambda


Historical SQL analytics used Lambda for custom output handling; use a supported processing service for new designs.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.
- AWS Lambda can be a destination as well
- Allows lots of flexibility for post-processing
  - Aggregating rows
  - Translating to different formats
  - Transforming and enriching data
  - Encryption
- Opens up access to other services & destinations
  - S3, DynamoDB, Aurora, Redshift, SNS, SQS, CloudWatch

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).


```mermaid
flowchart LR
  accTitle: Kinesis Data Analytics + Lambda
  n0["Retired SQL application"]
  n1["Lambda output handler"]
  n2["Downstream destination"]
  n0 -->|"result invocation"| n1
  n1 -->|"custom delivery"| n2
```

> Historical SQL analytics used Lambda for custom output handling; use a supported processing service for new designs.

## Managed Service for Apache Flink


Managed Service for Apache Flink runs stateful streaming jobs with supported Kinesis, Kafka and other connectors.

- Formerly Kinesis Data Analytics for Apache Flink or for Java
  - Kinesis Data Analytics always used Flink under the hood
  - But now supports Python and Scala
  - Flink is a framework for processing data streams
- MSAF integrates Flink with AWS
  - Instead of using SQL, you can develop your own Flink application from scratch and load it into MSAF via S3
- In addition to the DataStream API, there is a Table API for SQL access
- Serverless


```mermaid
flowchart LR
  accTitle: Managed Service for Apache Flink
  n0["Kinesis / MSK / supported source"]
  n1["Managed Flink application"]
  n2["Supported sink"]
  n0 -->|"consume"| n1
  n1 -->|"process / deliver"| n2
```

> Managed Service for Apache Flink runs stateful streaming jobs with supported Kinesis, Kafka and other connectors.

## Apache Flink Capabilities


Flink builds a processing graph of stateless and stateful operators, including event-time windows.

- Connectors
  - The flink-connector-kinesis library lets you consume a data stream from Java
  - A library of “Table API Connectors” are included in Flink
    - Kafka, DynamoDB, Firehose, Kinesis, MongoDB, OpenSearch, JDBC…
  - Custom “sink” connectors allow Flink to talk to anything you have an SDK for
    - For example, you could write a sink to connect to a Timestream database
- Operators
  - Transform one or more DataStreams into a new DataStream
  - Similar to Apache Spark transformations
    - Map, Flatmap, Filter, Reduce, Windows, Join
  - Physical partitioning
  - Task chaining


```mermaid
flowchart LR
  accTitle: Apache Flink Capabilities
  n0["Source"]
  n1["Map / flatMap / filter"]
  n2["Keyed reduce / window"]
  n3["Sink"]
  n0 -->|"records"| n1
  n1 -->|"grouped events"| n2
  n2 -->|"results"| n3
```

> Flink builds a processing graph of stateless and stateful operators, including event-time windows.

## Common use-cases


Streaming analytics can transform events, calculate ongoing metrics and detect conditions before delivering results to downstream systems.

- Continuous metric generation
- Responsive analytics

## Kinesis Analytics


Managed analytics charges follow the resources and processing model in use. Historical product names and example prices require dated interpretation.

  - Charged by Kinesis Processing Units (KPU’s) consumed per hour
  - 1 KPU = 1 vCPU + 4GB
- Serverless; scales automatically
- Use IAM permissions to access streaming source and destination(s)
- Schema discovery

## RANDOM_CUT_FOREST


RANDOM_CUT_FOREST is a historical Kinesis SQL anomaly-detection example. Retain the anomaly-detection concept while using a supported engine for new work.

- They’re especially proud of this because they published a paper on it
- It’s a novel way to identify outliers in a data set so you can handle them however you need to
- Example: detect anomalous subway ridership during the NYC marathon

## Amazon Managed Streaming for Apache Kafka (Amazon MSK)


MSK provides managed Apache Kafka infrastructure. Its Kafka APIs and ecosystem differ from Kinesis even when both serve streaming architectures.

- Fully managed Apache Kafka on AWS
  - Allow you to create, update, delete clusters
  - MSK creates & manages Kafka brokers nodes & Zookeeper nodes for you
  - Deploy the MSK cluster in your VPC, multi-AZ (up to 3 for HA)
  - Automatic recovery from common Apache Kafka failures
  - Data is stored on EBS volumes
- You can build producers and consumers of data
- Can create custom configurations for your clusters
  - Default message size of 1MB
  - Possibilities of sending large messages (ex: 10MB) into Kafka after custom configuration

## Apache Kafka at a high level


Kafka producers append to topic partitions on brokers; independent consumer groups process those records.


```mermaid
flowchart LR
  accTitle: Apache Kafka at a high level
  n0["Producers"]
  n1["Kafka brokers / topic partitions"]
  n2["Consumer group A"]
  n3["Consumer group B"]
  n4["Destinations"]
  n0 -->|"publish"| n1
  n1 -->|"consume"| n2
  n1 -->|"consume"| n3
  n2 -->|"process"| n4
  n3 -->|"process"| n4
```

> Kafka producers append to topic partitions on brokers; independent consumer groups process those records.

## MSK – Configurations


The course depicts a multi-AZ Kafka cluster with ZooKeeper. Coordination architecture depends on the Kafka/MSK version and cluster mode.

- Choose the number of AZ (3 – recommended, or 2)
- Choose the VPC & Subnets
- The broker instance type (ex: kafka.m5.large)
- The number of brokers per AZ (can add brokers later)
- Size of your EBS volumes (1GB – 16TB)


```mermaid
flowchart LR
  accTitle: MSK – Configurations
  n0["AZ A broker"]
  n1["AZ B broker"]
  n2["AZ C broker"]
  n3["Version-dependent coordination"]
  n0 -->|"partition replication"| n1
  n1 -->|"partition replication"| n2
  n3 -->|"cluster metadata"| n0
  n3 -->|"cluster metadata"| n1
  n3 -->|"cluster metadata"| n2
```

> The course depicts a multi-AZ Kafka cluster with ZooKeeper. Coordination architecture depends on the Kafka/MSK version and cluster mode.

## MSK – Security


MSK security separates transport encryption, client authentication and authorization.

- Encryption:
  - Optional in-flight using TLS between the brokers
  - Optional in-flight with TLS between the clients and brokers
  - At rest for your EBS volumes using KMS
- Network Security:
  - Authorize specific security groups for your Apache Kafka clients
- Authentication & Authorization (important):
  - Define who can read/write to which topics
  - Mutual TLS (AuthN) + Kafka ACLs (AuthZ)
  - SASL/SCRAM (AuthN) + Kafka ACLs (AuthZ)
  - IAM Access Control (AuthN + AuthZ)


```mermaid
flowchart LR
  accTitle: MSK – Security
  n0["Client"]
  n1["TLS transport"]
  n2["IAM / supported authentication"]
  n3["Topic authorization"]
  n4["MSK broker"]
  n0 -->|"encrypted connection"| n1
  n1 -->|"prove identity"| n2
  n2 -->|"check permissions"| n3
  n3 -->|"allowed operation"| n4
```

> MSK security separates transport encryption, client authentication and authorization.

## MSK – Monitoring


Monitor MSK through supported service and broker metrics, logs and monitoring integrations. Observe partition health and consumer lag alongside resource use.

  - Basic monitoring (cluster and broker metrics)
  - Enhanced monitoring (++enhanced broker metrics)
  - Topic-level monitoring (++enhanced topic-level metrics)
- Prometheus (Open-Source Monitoring)
  - Opens a port on the broker to export cluster, broker and topic-level metrics
  - Setup the JMX Exporter (metrics) or Node Exporter (CPU and disk metrics)
- Broker Log Delivery
  - Delivery to CloudWatch Logs
  - Delivery to Amazon S3
  - Delivery to Kinesis Data Streams

## MSK Connect


MSK Connect runs a compatible connector that consumes Kafka records and delivers them to a configured sink such as S3.

- Managed Kafka Connect workers on AWS
- Auto-scaling capabilities for workers
- You can deploy any Kafka Connect connectors to MSK Connect as a plugin
  - Amazon S3, Amazon Redshift, Amazon OpenSearch, Debezium, etc…
- Example pricing: Pay $0.11 per worker per hour


```mermaid
flowchart LR
  accTitle: MSK Connect
  n0["MSK topic"]
  n1["MSK Connect worker"]
  n2["S3 sink"]
  n0 -->|"consume connector input"| n1
  n1 -->|"connector delivery"| n2
```

> MSK Connect runs a compatible connector that consumes Kafka records and delivers them to a configured sink such as S3.

## MSK Serverless


MSK Serverless reduces broker-capacity administration while retaining Kafka's application model and documented service constraints.

- MSK automatically provisions resources and scales compute & storage
- You just define your topics and your partitions and you’re good to go!
- Security: IAM Access Control for all clusters
- Example Pricing:
  - $0.75 per cluster per hour = $558 monthly per cluster
  - $0.0015 per partition per hour = $1.08 monthly per partition
  - $0.10 per GB of storage each month
  - $0.10 per GB in
  - $0.05 per GB out

## Kinesis Data Streams vs Amazon MSK


Compare Kafka and Kinesis by protocol, partitioning, retention, consumer behavior and operating model. Message limits depend on the selected service configuration.

- Data Streams with Shards
- Shard Splitting & Merging
- TLS In-flight encryption
- KMS At-rest encryption
- Security:
  - IAM policies for AuthN/AuthZ
                    - 1MB default, configure for higher (ex: 10MB)
                    - Kafka Topics with Partitions
                    - Can only add partitions to a topic
                    - PLAINTEXT or TLS In-flight Encryption
                      - Mutual TLS (AuthN) + Kafka ACLs (AuthZ)
                      - SASL/SCRAM (AuthN) + Kafka ACLs (AuthZ)
                      - IAM Access Control (AuthN + AuthZ)

## What is OpenSearch?


OpenSearch indexes documents for search and aggregation. It originated from Elasticsearch and provides its own supported APIs and visualization ecosystem.

- A search engine
- An analysis tool
- A visualization tool (Dashboards = Kibana)
- A data pipeline
  - Kinesis replaces Beats & LogStash
- Horizontally scalable

## OpenSearch Dashboards


Dashboards turn indexed search and aggregation results into interactive visualizations.

- The screenshot illustrates a dashboard of multiple charts; filters and a time range define the slice being inspected.
- Interpret the underlying query, units and time interval before drawing an operational conclusion from a chart.

## OpenSearch applications


Search, log analysis and document aggregation are typical OpenSearch workloads. The index model is different from transactional database serving.

- Log analytics
- Application monitoring
- Security analytics
- Clickstream analytics

## OpenSearch concepts


OpenSearch indexes JSON documents; the slide's document-type terminology is historical and should not guide new index design.


```mermaid
flowchart LR
  accTitle: OpenSearch concepts
  n0["JSON documents"]
  n1["Index"]
  n2["Search / aggregation"]
  n0 -->|"index documents"| n1
  n1 -->|"query indexed fields"| n2
```

> OpenSearch indexes JSON documents; the slide's document-type terminology is historical and should not guide new index design.

## An index is split into shards


Document routing assigns documents to primary shards within an index; shard design affects scale and query overhead.


```mermaid
flowchart LR
  accTitle: An index is split into shards
  n0["Document ID / routing key"]
  n1["Shard routing"]
  n2["Primary shard A"]
  n3["Primary shard B"]
  n0 -->|"routing hash"| n1
  n1 -->|"place document"| n2
  n1 -->|"place document"| n3
```

> Document routing assigns documents to primary shards within an index; shard design affects scale and query overhead.

## Redundancy


Writes reach a primary shard and are replicated; reads may use eligible primary or replica copies on different nodes.


```mermaid
flowchart LR
  accTitle: Redundancy
  n0["Write request"]
  n1["Primary shard"]
  n2["Replica on another node"]
  n3["Read request"]
  n0 -->|"index write"| n1
  n1 -->|"replicate"| n2
  n3 -->|"read option"| n1
  n3 -->|"read option"| n2
```

> Writes reach a primary shard and are replicated; reads may use eligible primary or replica copies on different nodes.

## Amazon OpenSearch Service (Managed)


Managed OpenSearch domains supply service-managed infrastructure with explicit sizing and configuration choices. They are distinct from the serverless deployment model.

  - There is a separate serverless option now
- Scale up or down without downtime
  - But this isn’t automatic
- Pay for what you use
  - Instance-hours, storage, data transfer
- Network isolation
- AWS integration
  - S3 buckets (via Lambda to Kinesis)
  - Kinesis Data Streams
  - DynamoDB Streams
  - CloudWatch / CloudTrail
  - Zone awareness

## Amazon OpenSearch options


Node roles, storage choices and deployment sizing affect both query behavior and cluster stability. Assign resources to the work each role performs.

  - Choice of count and instance types
- “Domains”
- Snapshots to S3
- Zone Awareness

## Cold / warm / ultrawarm / hot storage


Hot, warm and cold tiers trade query performance and access behavior for storage cost. Move data according to how often it must be searched.

- Hot (standard data nodes)
  - Instance stores or EBS volumes / fastest performance
- UltraWarm (warm) storage uses S3 + caching
  - Best for indices with few writes (like log data / immutable data)
  - Slower performance but much lower cost
  - Must have a dedicated master node
- Cold storage
  - Also uses S3
  - Even cheaper
  - For “periodic research or forensic analysis on older data”
  - Must have dedicated master and have UltraWarm enabled too.
  - Not compatible with T2 or T3 instance types on data nodes
  - If using fine-grained access control, must map users to cold_manager role in OpenSearch Dashboards
- Data may be migrated between different storage types

## Index State Management


Index State Management applies lifecycle actions when configured conditions are met. Policies automate maintenance rather than changing the underlying retention requirement.

- Examples
  - Delete old indices after a period of time
  - Move indices into read only state after a period of time
  - Move indices from hot -> UltraWarm -> cold storage over time
  - Reduce replica count over time
  - Automate index snapshots
- ISM policies are run every 30-48 minutes
  - Random jitter to ensure they don’t all run at once
- Can even send notifications when done

## More Index Management


Rollups and transforms prepare derived data for repeated analysis. Decide which detail can be summarized and which original data must remain available.

  - Periodically roll up old data into summarized indices
  - Saves storage costs
  - New index may have fewer fields, coarser time buckets
- Index transforms
  - Like rollups, but purpose is to create a different view to analyze data differently.
  - Groupings and aggregations

## Cross-cluster replication


Cross-cluster replication follows supported indices and metadata into another domain. Replication direction, permissions and destination configuration still matter.

- Ensures high availability in an outage
- Replicate data geographically for better latency
- “Follower” index pulls data from “leader” index
- Requires fine-grained access control and node-to-node encryption
- “Remote Reindex” allows copying indices from one cluster to another on demand

## OpenSearch Stability


Separate cluster-management responsibilities from data processing and distribute supported resources appropriately. Stable sizing is part of reliable search performance.

  - Avoids “split brain”
- Don’t run out of disk space
  - Minimum storage requirement is roughly: Source Data * (1 + Number of Replicas) * 1.45
- Choosing the number of shards
  - (source data + room to grow) * (1 + indexing overhead) / desired shard size
  - Indexing overhead is normally 10% of your data
  - In rare cases you may need to limit the number of shards per node
    - You usually run out of disk space first.
- Choosing instance types
  - At least 3 nodes
  - Mostly about storage requirements
  - i.e., m6g.large.search, i3.4xlarge.search, i3.16xlarge.search

## Amazon OpenSearch Security


OpenSearch authorization can combine network, resource-policy and fine-grained controls. Apply the layers required by the application's access path.

- Identity-based policies
- IP-based policies
- Request signing
- VPC
- Cognito

## Securing Dashboards


A private OpenSearch dashboard needs network access through a supported private path plus application authentication.

- Cognito
- Getting inside a VPC from outside is hard…
  - Nginx reverse proxy on EC2 forwarding to ES domain
  - SSH tunnel for port 5601
  - VPC Direct Connect
  - VPN


```mermaid
flowchart LR
  accTitle: Securing Dashboards
  n0["User"]
  n1["VPN / authorized proxy"]
  n2["Private Dashboards endpoint"]
  n3["Cognito / configured authentication"]
  n0 -->|"private connectivity"| n1
  n1 -->|"HTTPS"| n2
  n3 -->|"authenticate user"| n2
```

> A private OpenSearch dashboard needs network access through a supported private path plus application authentication.

## Amazon OpenSearch anti-patterns


OpenSearch is a poor substitute for a transactional database or for workloads without a search or aggregation requirement.

  - No transactions
  - RDS or DynamoDB is better
- Ad-hoc data querying
  - Athena is better
- Remember OpenSearch is primarily for search & analytics

## Amazon OpenSearch performance


JVM memory pressure and shard layout can constrain search performance. Investigate field choices, aggregation load and resource distribution together.

  - You have unbalanced shard allocations across nodes
  - You have too many shards in a cluster
- Fewer shards can yield better performance if JVMMemoryPressure errors are encountered
  - Delete old or unused indices

## Amazon OpenSearch Serverless


OpenSearch Serverless separates collection access from managed indexing and search capacity; network, encryption and data-access policies are distinct.

- On-demand autoscaling!
- Works against “collections” instead of provisioned domains
  - May be “search” or “time series” type
- Always encrypted with your KMS key
  - Data access policies
  - Encryption at rest is required
  - May configure security policies across many collections
- Capacity measured in OpenSearch Compute Units (OCUs)
  - Can set an upper limit, lower limit is always 2 for indexing, 2 for search


```mermaid
flowchart LR
  accTitle: Amazon OpenSearch Serverless
  n0["Client"]
  n1["Network + data policies"]
  n2["Collection"]
  n3["Managed indexing / search capacity"]
  n0 -->|"authorized access"| n1
  n1 -->|"permitted operation"| n2
  n3 -->|"service-managed compute"| n2
```

> OpenSearch Serverless separates collection access from managed indexing and search capacity; network, encryption and data-access policies are distinct.

## What is Quick Suite / Quick Sight?


QuickSight provides business-intelligence analysis and dashboards within the broader product suite described by the source. Keep analytics features separate from branding changes.

- Fast, easy, cloud-powered business analytics service
- Allows all employees in an organization to:
  - Build visualizations
  - Build paginated reports
  - Perform ad-hoc analysis
  - Get alerts on detected anomalies
  - Quickly get business insights from data
  - Anytime, on any device (browsers, mobile)
- Serverless

## Quick Sight Data Sources


QuickSight can analyze supported databases, lake data and uploaded files. The selected source determines connectivity, refresh and permission requirements.

- Aurora / RDS
- Athena
- OpenSearch
- IoT Analytics
- EC2-hosted databases
- Files (S3 or on-premises)
  - Excel
  - CSV, TSV
  - Common or extended log format
- Data preparation allows limited ETL

## Quick Sight Is SPICE!


SPICE imports datasets into an analytical cache for interactive queries. Importing creates a refresh and capacity-planning responsibility.

  - Super-fast, Parallel, In-memory Calculation Engine
  - Uses columnar storage, in-memory, machine code generation
  - Accelerates interactive queries on large datasets
- Each user gets 10GB of SPICE
- Highly available / durable
- Scales to hundreds of thousands of users
- Can accelerate large queries that would time out in direct query mode (hitting Athena directly)
  - But if it takes more than 30 minutes to import your data into SPICE it will still time out

## Quick Sight Use Cases


Use QuickSight to explore data and communicate results through interactive visuals. Prepare and govern the underlying datasets before presenting their conclusions.

- Dashboards and KPI’s
- Analyze / visualize data from:
  - Logs in S3
  - On-premise databases
  - AWS (RDS, Redshift, Athena, S3)
  - SaaS applications, such as Salesforce
  - Any JDBC/ODBC data source

## Quick Sight Anti-Patterns


QuickSight is not a general data-transformation engine or a substitute for the systems that ingest and prepare analytical data.

- Use Glue instead, although QuickSight can do some transformations

## Quick Sight Security


Protect account access and choose the edition and identity integration required by the organization. Data access remains a separate permission boundary.

- VPC connectivity
  - Add QuickSight’s IP address range to your database security groups
- Row-level security
  - New for 2021: Column-level security too (CLS) – Enterprise edition only
- Private VPC access
  - Elastic Network Interface, AWS Direct Connect

## Quick Sight Security


QuickSight needs explicit access to supported AWS resources and encryption keys. A user who can open the application may still lack access to a dataset.

  - Must ensure QuickSight is authorized to use Athena / S3 / your S3 buckets
  - This can be managed within the QuickSight console (Manage Quicksight / Security & Permissions)\
- Data access
  - Can create IAM policies to restrict what data in S3 given QuickSight users can access

## QuickSight database connectivity: public and private paths


Choose connectivity for the database endpoint; access also requires database credentials and network authorization.

- For the public-endpoint path, authorize documented QuickSight source IP ranges in the database security group.
- Correction: the source's blanket same-Region restriction is not universal. Supported private designs can reach data across accounts and Regions.
- The following pages compare a VPC connection, VPC peering, Transit Gateway, supported PrivateLink endpoints and VPC sharing. These are alternatives with configuration-specific requirements.

**Current reference (checked 2026-10-13):** [QuickSight cross-account and cross-Region deployment models](https://aws.amazon.com/blogs/big-data/amazon-quicksight-deployment-models-for-cross-account-and-cross-region-access-to-amazon-redshift-and-amazon-rds/).


```mermaid
flowchart LR
  accTitle: QuickSight database connectivity: public and private paths
  n0["QuickSight service"]
  n1["Documented source IP ranges"]
  n2["Database security group"]
  n3["Reachable database endpoint"]
  n0 -->|"query source"| n1
  n1 -->|"allowlisted traffic"| n2
  n2 -->|"authorized query"| n3
```

> Conceptual public-endpoint path: authorize the documented QuickSight source IP ranges at the database. The source's blanket same-Region restriction is not universal; private alternatives follow.

## Quick Sight / Redshift / RDS cross-region


An Enterprise VPC connection places network interfaces in the configured VPC; subnet routes and security rules determine reachable private data sources.

- Other ways to do it (if you have Enterprise Edition)
- Create a private subnet in a VPC
- Use Elastic Network Interface to put Quick Sight in the subnet
  - This is the part that requires Enterprise Edition
- This can also enable cross- account access


```mermaid
flowchart LR
  accTitle: Quick Sight / Redshift / RDS cross-region
  n0["QuickSight"]
  n1["VPC connection ENI"]
  n2["Private-subnet route table"]
  n3["Reachable private data source"]
  n0 -->|"VPC connection"| n1
  n1 -->|"private traffic"| n2
  n2 -->|"configured route"| n3
```

> An Enterprise VPC connection places network interfaces in the configured VPC; subnet routes and security rules determine reachable private data sources.

## Quick Suite / Redshift / RDS cross-region


VPC peering connects the QuickSight connection VPC to the database VPC, with routes on both sides and database authorization.

- Now you can create a peering connection between your private subnet and another private subnet containing your data
  - This also works for cross-account access


```mermaid
flowchart LR
  accTitle: Quick Suite / Redshift / RDS cross-region
  n0["QuickSight ENI in VPC A"]
  n1["Route table A"]
  n2["VPC peering"]
  n3["Route table B"]
  n4["RDS / Redshift in VPC B"]
  n0 -->|"private traffic"| n1
  n1 -->|"peer route"| n2
  n2 -->|"peer route"| n3
  n3 -->|"authorized query"| n4
```

> VPC peering connects the QuickSight connection VPC to the database VPC, with routes on both sides and database authorization.

## Quick Sight / Redshift / RDS cross- account


Transit Gateway routing, a supported PrivateLink endpoint and VPC sharing are alternative private-access designs, not one combined chain. Each requires its own supported configuration.

- Can use an AWS Transit Gateway to connect your subnets
  - But this must be in the same org & region
  - Or you can peer Transit Gateways in different regions
- OR use AWS PrivateLink to connect them
- OR use VPC sharing to connect them


```mermaid
flowchart TB
  accTitle: Quick Sight / Redshift / RDS cross- account
  n0["QuickSight connection VPC"]
  n1["Transit Gateway + attachments"]
  n2["Data-source VPC"]
  n3["Supported PrivateLink endpoint"]
  n4["Data service"]
  n5["Shared subnet"]
  n6["QuickSight ENI + data source"]
  n0 -->|"routed option"| n1
  n1 -->|"configured routes"| n2
  n0 -->|"endpoint option"| n3
  n3 -->|"private service access"| n4
  n5 -->|"VPC sharing option"| n6
```

> Transit Gateway routing, a supported PrivateLink endpoint and VPC sharing are alternative private-access designs, not one combined chain. Each requires its own supported configuration.

## Quick Sight User Management


User and group management depends on the supported identity model and edition. Assign access according to authoring and consumption responsibilities.

- Active Directory connector with Quick Sight Enterprise Edition
  - All keys are managed by AWS; you CANNOT use customer- provided keys
  - Enterprise edition only!
  - Can tweak security access using IAM if needed

## Quick Sight pricing


QuickSight pricing depends on the chosen roles, capacity and subscription model. Treat the source's dollar amounts as examples rather than a current quote.

  - Standard: $9 / user /month
  - Enterprise: $18 / user / month
  - With Quicksight Q: $28 / user /month
- Extra SPICE capacity (beyond 10GB)
  - $0.25 (standard) $0.38 (enterprise) / GB / month
- Month to month
  - Standard: $12 / user / month
  - Enterprise: $24 / user / month
  - With Quicksight Q: $34 / user / month
- Enterprise edition
  - Encryption at rest
  - Microsoft Active Directory integration

## Quick Sight Dashboards


A dashboard publishes a read-oriented view of an analysis. Updates to the analysis and publication determine what readers see.

- Can share with others with Quick suite access
- Can share even more widely with embedded dashboards
  - Embed within an application
  - Authenticate with Active Directory / Cognito / SSO
  - QuickSight Javascript SDK / QuickSight API
  - Whitelist domains where embedding is allowed

## Quick Sight Machine Learning Insights


ML insights can highlight anomalies or forecast patterns in suitable data. Validate the input, interval and interpretation before using an insight to make a decision.

  - Uses Random Cut Forest
  - Identify top contributors to significant changes in metrics
- ML-powered forecasting
  - Also uses Random Cut Forest
  - Detects seasonality and trends
  - Excludes outliers and imputes missing values
- Autonarratives
  - Adds “story of your data” to your dashboards
- Suggested Insights
  - “Insights” tab displays read-to-use suggested insights

## Quick Sight Calculated Fields


Calculated fields derive values from dataset fields. Understand whether an expression operates at row or aggregation level before comparing its results.

  - For example, profit margin, things like that
- Mathematical and logical operators
  - /, *, AND, OR, NOT, etc.
- Conditional functions
  - If / else / not / etc.
- Date functions
  - Date offsets, formatting
- Numeric and mathematical functions
  - Log, sqrt, round, etc.
- String functions
- Table calculation functions
  - Running average, running min/max, etc.
- Aggregation functions
  - Avg, min, max, stddev, etc.

## Level-Aware Calculations (LAC)


LAC-A changes the grouping level at which an aggregate is evaluated before the visual's final aggregation.

- Control granularity of calculations
  - Which may be independent, and before, aggregations done at the display level
- LAC-A : Aggregate functions
  - See example at right
  - Sum({Sales}) aggregates on the columns displayed (region, country, product)
  - But we can aggregate at a different level as well
    - sum({Sales},[{Country}])
    - This aggregates only by Country
    - Country doesn’t even have to be in the visual
  - Works on sum, count, percentile


```mermaid
flowchart LR
  accTitle: Level-Aware Calculations (LAC)
  n0["Dataset rows"]
  n1["Specified grouping level"]
  n2["Level-aware aggregate"]
  n3["Visual aggregation"]
  n0 -->|"group"| n1
  n1 -->|"aggregate at chosen level"| n2
  n2 -->|"render at visual grain"| n3
```

> LAC-A changes the grouping level at which an aggregate is evaluated before the visual's final aggregation.

## Level-Aware Calculations – Window (LAC-W)


LAC-W calculates a window expression at the selected prefilter or preaggregation stage; evaluation order changes the result.

- Aggregate over a window or partition
  - Values calculated over some window are added to each row
    - Some window functions: sumover, maxover, denseRank
  - Example below: Order amount defined as sumOver({Sales}, [{Order ID}], PRE_AGG)
- PRE_AGG means to apply the window prior to display-level aggregations
- PRE_FILTER applies prior to any display-level filters


```mermaid
flowchart LR
  accTitle: Level-Aware Calculations – Window (LAC-W)
  n0["Dataset"]
  n1["Prefilter / preaggregate window"]
  n2["Visual grouping"]
  n3["Displayed metric"]
  n0 -->|"selected calculation stage"| n1
  n1 -->|"aggregate"| n2
  n2 -->|"render"| n3
```

> LAC-W calculates a window expression at the selected prefilter or preaggregation stage; evaluation order changes the result.

## QuickSight numeric precision: decimal and floating point


Choose a numeric type for the required precision and range; floating point is approximate.

- Fixed-decimal and floating-point types use different precision models.
- FLOAT may represent a wider range, but it does not universally avoid rounding or calculation error.
- Use appropriate decimal precision for exact decimal requirements such as financial values; validate import and calculated-field behavior.

**Current reference (checked 2026-10-13):** [QuickSight decimal data types](https://docs.aws.amazon.com/quick/latest/userguide/supported-data-types-and-values.html).

# Section Application integration

## AWS SQS What’s a queue?


SQS decouples producers from competing consumers; a message is processed by a consumer, then explicitly deleted on success.


```mermaid
flowchart LR
  accTitle: AWS SQS What’s a queue?
  n0["Producers"]
  n1["SQS queue"]
  n2["Consumer A"]
  n3["Consumer B"]
  n0 -->|"SendMessage"| n1
  n1 -->|"receive"| n2
  n1 -->|"receive"| n3
```

> SQS decouples producers from competing consumers; a message is processed by a consumer, then explicitly deleted on success.

## AWS SQS – Standard Queue


SQS Standard is a decoupling work queue with at-least-once delivery and best-effort ordering.

- Oldest offering (over 10 years old)
- Fully managed
- Scales from 1 message per second to 15,000s per second
- Default retention of messages: 4 days, maximum of 14 days
- No limit to how many messages can be in the queue
- Low latency (<10 ms on publish and receive)
- Horizontal scaling in terms of number of consumers
- Can have duplicate messages (at least once delivery, occasionally)
- Can have out of order messages (best effort ordering)
- Limitation of 1024 KB per message sent

## SQS – Producing Messages


A queue message contains a body and optional attributes used by applications and supported integrations.

- Define Body
- Add message attributes (metadata – optional)
- Provide Delay Delivery (optional)
- Get back
  - Message identifier
  - MD5 hash of the body


```mermaid
flowchart LR
  accTitle: SQS – Producing Messages
  n0["Message"]
  n1["Body"]
  n2["Message attributes"]
  n3["SQS queue"]
  n0 ---|"payload"| n1
  n0 ---|"metadata"| n2
  n0 ---|"enqueue"| n3
```

> A queue message contains a body and optional attributes used by applications and supported integrations.

## SQS – Consuming Messages


Receive makes a message temporarily invisible; delete it after successful work. Expired visibility permits another receive.

- Consumers…
- Poll SQS for messages (receive up to 10 messages at a time)
- Process the message within the visibility timeout
- Delete the message using the message ID & receipt handle


```mermaid
flowchart LR
  accTitle: SQS – Consuming Messages
  n0["Queue"]
  n1["Receive + visibility timer"]
  n2["Process"]
  n3["Delete on success"]
  n4["Retry after timeout"]
  n0 -->|"poll"| n1
  n1 -->|"work"| n2
  n2 -->|"success"| n3
  n2 -->|"failure / timeout"| n4
  n4 -->|"visible again"| n0
```

> Receive makes a message temporarily invisible; delete it after successful work. Expired visibility permits another receive.

## SQS FIFO: ordering and deduplication


FIFO queues preserve order within a message group and support send deduplication.

- The queue name ends in .fifo. Use MessageGroupId for the ordering domain.
- Provide MessageDeduplicationId or enable content-based deduplication; the send-deduplication interval is five minutes.
- A failed or timed-out consumer may receive the message again. Make side effects idempotent and delete after successful work.
- Throughput examples depend on configuration; high-throughput FIFO and Regional quotas differ.

**Current reference (checked 2026-10-13):** [SQS deduplication](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html); [SQS visibility and retries](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html).


```mermaid
flowchart LR
  accTitle: SQS FIFO: ordering and deduplication
  n0["FIFO queue"]
  n1["Group A ordered messages"]
  n2["Group B ordered messages"]
  n3["Idempotent consumers"]
  n0 -->|"per-group order"| n1
  n0 -->|"per-group order"| n2
  n1 -->|"sequential within group"| n3
  n2 -->|"parallel across groups"| n3
```

> FIFO ordering applies within a message group; different groups can be processed concurrently. Deduplication is not a guarantee of exactly-once side effects.

## SQS Extended Client


The extended-client pattern places a large payload in S3 and a reference in SQS; the consumer retrieves the object separately.

- Message size limit is 1024 KB, how to send large messages?
- Using the SQS Extended Client (Java Library)


```mermaid
flowchart LR
  accTitle: SQS Extended Client
  n0["Producer"]
  n1["S3 payload"]
  n2["SQS pointer"]
  n3["Consumer"]
  n0 -->|"store bytes"| n1
  n0 -->|"send reference"| n2
  n2 -->|"receive pointer"| n3
  n1 -->|"retrieve bytes"| n3
```

> The extended-client pattern places a large payload in S3 and a reference in SQS; the consumer retrieves the object separately.

## AWS SQS Use Cases


A work queue decouples request arrival from processing capacity, such as accepting payment work for asynchronous handling.

- Buffer writes to a database (for example a voting application)
- Handle large loads of messages coming in (for example an email sender)
- SQS can be integrated with Auto Scaling through CloudWatch!

## SQS Limits


SQS quotas constrain in-flight work and API behavior separately from queue retention. Check the queue type and current documented limits.

- Batch Request has a maximum of 10 messages
- Message content is XML, JSON, Unformatted text
- Standard queues have an unlimited TPS
- FIFO queues support up to 3,000 messages per second (using batching)
- Max message size is 1024 KB (or use Extended Client)
- Data retention from 1 minute to 14 days
- Pricing:
  - Pay per API Request
  - Pay per network usage

## AWS SQS Security


Protect SQS with HTTPS, supported at-rest encryption and IAM or queue policies. Delivery to a queue and access to its encryption key require separate authorization.

- Can enable SSE (Server Side Encryption) using KMS
  - Can set the CMK (Customer Master Key) we want to use
  - SSE only encrypts the body, not the metadata (message ID, timestamp, attributes)
- IAM policy must allow usage of SQS
- SQS queue access policy
  - Finer grained control over IP
  - Control over the time the requests come in

## Kinesis Data Stream vs SQS


Kinesis retains records for independent readers; SQS distributes work to receivers that acknowledge completion by deleting messages.

- Data can be consumed many times
- Data is deleted after the retention period
- Ordering of records is preserved (at the shard level) – even during replays
- Build multiple applications reading from the same stream independently (Pub/Sub)
- “Streaming MapReduce” querying capability (Spark, Flink…)
- Checkpointing needed to track progress of consumption (ex: KCL with DynamoDB)
- Provisioned mode or on-demand mode
                      - SQS:
                        - Queue, decouple applications
                        - One application per queue
                        - Records are deleted after consumption (ack / fail)
                        - Messages are processed independently for standard queue
                        - Ordering for FIFO queues (decreased throughtput)
                        - Capability to “delay” messages
                        - Dynamic scaling of load (no-ops)

## Stream, delivery service or queue?


Choose by replay, consumer independence, ordering and delivery behavior rather than a single throughput number.

- Kinesis Data Streams: retained ordered shard records and independent consumers; replay within retention.
- Data Firehose: managed buffered delivery to a destination, not a general retained stream for arbitrary consumers.
- SQS Standard: work queue with at-least-once delivery and best-effort ordering.
- SQS FIFO: ordering within a message group and deduplication support; design idempotent consumer side effects.
- Course retention examples: Kinesis up to 365 days, SQS up to 14 days. Record/message sizes and throughput limits vary by configuration and date.

| Service | Ordering | Independent replay |
| --- | --- | --- |
| Kinesis Data Streams | Per shard / partition-key routing | Within configured retention |
| Data Firehose | No general ordering guarantee | No arbitrary consumer replay API |
| SQS Standard | Best effort | Receive/delete work queue |
| SQS FIFO | Within message group | Receive/delete work queue; deduplication |

## SQS vs Kinesis – Use cases


Use a queue to distribute tasks and buffer uneven demand. Use a stream when independent consumers or replay of ordered records are central requirements.

  - Order processing
  - Image Processing
  - Auto scaling queues according to messages.
  - Buffer and Batch messages for future processing.
  - Request Offloading
- Kinesis Data Streams use cases:
  - Fast log and event data collection and processing
  - Real Time metrics and reports
  - Mobile data capture
  - Real Time data analytics
  - Gaming data feed
  - Complex Stream Processing
  - Data Feed from “Internet of Things”

## Amazon SQS – Dead Letter Queue (DLQ)


Repeated unsuccessful receives can move a message to a dead-letter queue according to maxReceiveCount.

- If a consumer fails to process a message within the Visibility Timeout… the message goes back to the queue!
- We can set a threshold of how many times a message can go back to the queue
- After the MaximumReceives threshold is exceeded, the message goes into a Dead Letter Queue (DLQ)
- Useful for debugging!
- DLQ of a FIFO queue must also be a FIFO queue
- DLQ of a Standard queue must also be a Standard queue
- Make sure to process the messages in the DLQ before they expire:
  - Good to set a retention of 14 days in the DLQ


```mermaid
flowchart LR
  accTitle: Amazon SQS – Dead Letter Queue (DLQ)
  n0["Source queue"]
  n1["Consumer attempt"]
  n2["Visibility expires"]
  n3["DLQ"]
  n0 -->|"receive"| n1
  n1 -->|"not deleted"| n2
  n2 -->|"retry below threshold"| n0
  n2 -->|"receive threshold exceeded"| n3
```

> Repeated unsuccessful receives can move a message to a dead-letter queue according to maxReceiveCount.

## SQS DLQ – Redrive to Source


Inspect dead-letter messages, fix the cause and redrive eligible messages to a source or other supported destination.

- Feature to help consume messages in the DLQ to understand what is wrong with them
- When our code is fixed, we can redrive the messages from the DLQ back into the source queue (or any other queue) in batches without writing custom code


```mermaid
flowchart LR
  accTitle: SQS DLQ – Redrive to Source
  n0["DLQ"]
  n1["Diagnose / fix"]
  n2["Redrive"]
  n3["Source queue"]
  n0 -->|"inspect failures"| n1
  n1 -->|"ready to retry"| n2
  n2 -->|"move messages"| n3
```

> Inspect dead-letter messages, fix the cause and redrive eligible messages to a source or other supported destination.

## Amazon SNS


SNS fan-out replaces separate producer calls with one publication to independently subscribed consumers.

- What if you want to send one message to many receivers?


```mermaid
flowchart LR
  accTitle: Amazon SNS
  n0["Producer"]
  n1["SNS topic"]
  n2["Subscriber A"]
  n3["Subscriber B"]
  n4["Subscriber C"]
  n0 -->|"publish once"| n1
  n1 -->|"deliver"| n2
  n1 -->|"deliver"| n3
  n1 -->|"deliver"| n4
```

> SNS fan-out replaces separate producer calls with one publication to independently subscribed consumers.

## Amazon SNS


A topic delivers to supported subscription protocols; delivery, ordering and retry behavior depend on the protocol and topic type.

- The “event producer” only sends message to one SNS topic
- As many “event receivers” (subscriptions) as we want to listen to the SNS topic notifications
- Each subscriber to the topic will get all the messages (note: new feature to filter messages)
- Up to 12,500,000 subscriptions per topic
- 100,000 topics limit


```mermaid
flowchart TB
  accTitle: Amazon SNS
  n0["SNS topic"]
  n1["SQS"]
  n2["Lambda"]
  n3["HTTP(S)"]
  n4["Email / SMS"]
  n5["Firehose"]
  n0 -->|"queue subscription"| n1
  n0 -->|"function subscription"| n2
  n0 -->|"webhook"| n3
  n0 -->|"notification"| n4
  n0 -->|"delivery-stream subscription"| n5
```

> A topic delivers to supported subscription protocols; delivery, ordering and retry behavior depend on the protocol and topic type.

## SNS integrates with a lot of AWS services


Supported AWS services publish notifications into SNS, which fans out to subscriptions.

- Many AWS services can send data directly to SNS for notifications


```mermaid
flowchart LR
  accTitle: SNS integrates with a lot of AWS services
  n0["CloudWatch / S3 / supported service"]
  n1["SNS topic"]
  n2["Configured subscribers"]
  n0 -->|"service event / alarm"| n1
  n1 -->|"notification"| n2
```

> Supported AWS services publish notifications into SNS, which fans out to subscriptions.

## Amazon SNS – How to publish


Mobile push can target a platform endpoint directly or reach multiple subscribed endpoints through a topic.

- Topic Publish (using the SDK)
  - Create a topic
  - Create a subscription (or many)
  - Publish to the topic
- Direct Publish (for mobile apps SDK)
  - Create a platform application
  - Create a platform endpoint
  - Publish to the platform endpoint
  - Works with Google GCM, Apple APNS, Amazon ADM…


```mermaid
flowchart LR
  accTitle: Amazon SNS – How to publish
  n0["Application"]
  n1["SNS topic"]
  n2["Platform endpoint"]
  n3["Push provider"]
  n4["Device"]
  n0 -->|"topic publication"| n1
  n1 -->|"fan-out"| n2
  n0 -->|"direct publication"| n2
  n2 -->|"platform delivery"| n3
  n3 -->|"push notification"| n4
```

> Mobile push can target a platform endpoint directly or reach multiple subscribed endpoints through a topic.

## Amazon SNS – Security


SNS combines topic permissions with transport and at-rest protection. Authorize publishers and subscribers for the intended delivery paths.

  - In-flight encryption using HTTPS API
  - At-rest encryption using KMS keys
  - Client-side encryption if the client wants to perform encryption/decryption itself
- Access Controls: IAM policies to regulate access to the SNS API
- SNS Access Policies (similar to S3 bucket policies)
  - Useful for cross-account access to SNS topics
  - Useful for allowing other services ( S3…) to write to an SNS topic

## SNS + SQS: Fan Out


SNS plus separate SQS queues lets fraud and shipping consumers process the same order independently.

- Push once in SNS, receive in all SQS queues that are subscribers
- Consumers are decoupled; delivery policies, retention and failure handling still determine reliability.
- SQS allows for: data persistence, delayed processing and retries of work
- Ability to add more SQS subscribers over time
- The destination queue policy must permit the SNS topic to send messages.


```mermaid
flowchart TB
  accTitle: SNS + SQS: Fan Out
  n0["Order producer"]
  n1["SNS topic"]
  n2["Fraud queue"]
  n3["Shipping queue"]
  n4["Fraud worker"]
  n5["Shipping worker"]
  n0 -->|"order event"| n1
  n1 -->|"fan-out"| n2
  n1 -->|"fan-out"| n3
  n2 -->|"consume"| n4
  n3 -->|"consume"| n5
```

> SNS plus separate SQS queues lets fraud and shipping consumers process the same order independently.

## Application: S3 Events to multiple queues


An S3 event can publish to SNS, which distributes notifications to independent queue and function subscribers.

- For the same combination of: event type (e.g. object create) and prefix (e.g. images/) you can only have one S3 Event rule
- If you want to send the same S3 event to many SQS queues, use fan-out


```mermaid
flowchart LR
  accTitle: Application: S3 Events to multiple queues
  n0["S3 bucket"]
  n1["SNS topic"]
  n2["SQS queue"]
  n3["Lambda"]
  n0 -->|"object event"| n1
  n1 -->|"subscription"| n2
  n1 -->|"subscription"| n3
```

> An S3 event can publish to SNS, which distributes notifications to independent queue and function subscribers.

## Application: SNS to Amazon S3 through Data Firehose


An SNS Firehose subscription can archive topic events to S3 through buffered delivery.

- SNS can send to Kinesis and therefore we can have the following solutions architecture:


```mermaid
flowchart LR
  accTitle: Application: SNS to Amazon S3 through Data Firehose
  n0["SNS topic"]
  n1["Data Firehose"]
  n2["S3 archive"]
  n0 -->|"subscription delivery"| n1
  n1 -->|"buffer / deliver"| n2
```

> An SNS Firehose subscription can archive topic events to S3 through buffered delivery.

## Amazon SNS – FIFO Topic


SNS FIFO and SQS FIFO preserve supported per-group ordering and deduplication; consumers must still handle retries idempotently.

- FIFO = First In First Out (ordering of messages in the topic)
- Similar features as SQS FIFO:
  - Ordering by Message Group ID (all messages in the same group are ordered)
  - Deduplication using a Deduplication ID or Content Based Deduplication
- Can have SQS Standard and FIFO queues as subscribers
- Limited throughput (same throughput as SQS FIFO)


```mermaid
flowchart LR
  accTitle: Amazon SNS – FIFO Topic
  n0["Producer + group ID"]
  n1["SNS FIFO"]
  n2["SQS FIFO"]
  n3["Consumer"]
  n0 -->|"ordered publication"| n1
  n1 -->|"FIFO subscription"| n2
  n2 -->|"receive / delete"| n3
```

> SNS FIFO and SQS FIFO preserve supported per-group ordering and deduplication; consumers must still handle retries idempotently.

## SNS FIFO + SQS FIFO: Fan Out


FIFO fan-out gives each subscribed queue its own ordered processing path.

- In case you need fan out + ordering + deduplication


```mermaid
flowchart LR
  accTitle: SNS FIFO + SQS FIFO: Fan Out
  n0["SNS FIFO"]
  n1["SQS FIFO A"]
  n2["SQS FIFO B"]
  n3["Worker A"]
  n4["Worker B"]
  n0 -->|"ordered copy"| n1
  n0 -->|"ordered copy"| n2
  n1 -->|"process"| n3
  n2 -->|"process"| n4
```

> FIFO fan-out gives each subscribed queue its own ordered processing path.

## SNS – Message Filtering


Subscription filter policies route only matching events; a subscription without a filter receives all supported messages.

- JSON policy used to filter messages sent to SNS topic’s subscriptions
- If a subscription doesn’t have a filter policy, it receives every message


```mermaid
flowchart LR
  accTitle: SNS – Message Filtering
  n0["Order events"]
  n1["SNS"]
  n2["Cancelled-order queue"]
  n3["Declined-order queue"]
  n4["All-orders queue"]
  n0 -->|"publish"| n1
  n1 -->|"status=cancelled"| n2
  n1 -->|"status=declined"| n3
  n1 -->|"no filter"| n4
```

> Subscription filter policies route only matching events; a subscription without a filter receives all supported messages.

## AWS Step Functions


Step Functions models a workflow as states and transitions. Define success, retries, error handling and service calls as part of the state machine.

- Easy visualizations
- Advanced Error Handling and Retry mechanism outside the code
- Audit of the history of workflows
- Ability to “Wait” for an arbitrary amount of time
- Max execution time of a State Machine is 1 year

## Step Functions – Examples Train a Machine Learning Model


A training workflow makes data preparation, training, evaluation and conditional deployment explicit orchestration steps.


```mermaid
flowchart LR
  accTitle: Step Functions – Examples Train a Machine Learning Model
  n0["Prepare data"]
  n1["Train model"]
  n2["Evaluate"]
  n3["Deploy if accepted"]
  n4["Handle failure"]
  n0 -->|"prepared input"| n1
  n1 -->|"model artifact"| n2
  n2 -->|"quality gate passed"| n3
  n1 -->|"catch / retry exhausted"| n4
```

> A training workflow makes data preparation, training, evaluation and conditional deployment explicit orchestration steps.

## Step Functions – Examples Tune a Machine Learning Model


A tuning workflow launches a search, waits for its outcome and selects the best eligible model.


```mermaid
flowchart LR
  accTitle: Step Functions – Examples Tune a Machine Learning Model
  n0["Prepare tuning job"]
  n1["Hyperparameter search"]
  n2["Wait / check status"]
  n3["Select best model"]
  n4["Evaluate / deploy"]
  n0 -->|"launch"| n1
  n1 -->|"asynchronous job"| n2
  n2 -->|"not complete"| n2
  n2 -->|"completed"| n3
  n3 -->|"candidate"| n4
```

> A tuning workflow launches a search, waits for its outcome and selects the best eligible model.

## Step Functions – Examples Manage a Batch Job


Step Functions can submit a Batch job and coordinate success or failure paths with downstream work.


```mermaid
flowchart LR
  accTitle: Step Functions – Examples Manage a Batch Job
  n0["Submit Batch job"]
  n1["Wait for job"]
  n2["Success branch"]
  n3["Failure handler"]
  n0 -->|"run job"| n1
  n1 -->|"succeeded"| n2
  n1 -->|"failed"| n3
```

> Step Functions can submit a Batch job and coordinate success or failure paths with downstream work.

## AWS Step Functions


Map iterates a dataset, Parallel runs branches and Choice selects a path; these states express different orchestration semantics.

- Your workflow is called a state machine
- Each step in a workflow is a state
- Types of states
  - Task: Does something with Lambda, other AWS services, or third party API’s
  - Choice: Adds conditional logic via Choice Rules (ie, comparisons)
  - Wait: Delays state machine for a specified time
  - Parallel: Add separate branches of execution
  - Map: Run a set of steps for each item in a dataset, in parallel
    - This is most relevant to data engineering! Works with JSON, S3 objects, CSV files
  - Also Pass, Succeed, Fail


```mermaid
flowchart LR
  accTitle: AWS Step Functions
  n0["Input dataset"]
  n1["Map items"]
  n2["Per-item task"]
  n3["Collect outcomes"]
  n4["Choice / next step"]
  n0 -->|"iterate"| n1
  n1 -->|"bounded concurrency"| n2
  n2 -->|"results"| n3
  n3 -->|"branch on result"| n4
```

> Map iterates a dataset, Parallel runs branches and Choice selects a path; these states express different orchestration semantics.

## Amazon AppFlow


AppFlow transfers supported SaaS application data to or from supported AWS destinations, with connectors, mappings and run settings controlling the exchange.

- Sources: Salesforce, SAP, Zendesk, Slack, and ServiceNow
- Destinations: AWS services like Amazon S3, Amazon Redshift or non-AWS such as SnowFlake and Salesforce
- Frequency: on a schedule, in response to events, or on demand
- Data transformation capabilities like filtering and validation
- Encrypted over the public internet or privately over AWS PrivateLink
- Don’t spend time writing the integrations and leverage APIs

## Amazon AppFlow


AppFlow transfers supported SaaS data to configured AWS or SaaS destinations with optional mapping and filtering.


```mermaid
flowchart LR
  accTitle: Amazon AppFlow
  n0["SaaS application"]
  n1["AppFlow mapping / filtering"]
  n2["Supported destination"]
  n0 -->|"scheduled / event / on-demand transfer"| n1
  n1 -->|"mapped records"| n2
```

> AppFlow transfers supported SaaS data to configured AWS or SaaS destinations with optional mapping and filtering.

## Amazon EventBridge (formerly CloudWatch Events)


EventBridge routes matching events to targets; scheduled workflows may use EventBridge Scheduler or supported schedule rules.

- Schedule: Cron jobs (scheduled scripts)
- Event Pattern: Event rules to react to a service doing something
- Trigger Lambda functions, send SQS/SNS messages…


```mermaid
flowchart LR
  accTitle: Amazon EventBridge (formerly CloudWatch Events)
  n0["Schedule / event"]
  n1["EventBridge rule / scheduler"]
  n2["Lambda"]
  n3["SNS"]
  n0 -->|"trigger"| n1
  n1 -->|"invoke"| n2
  n1 -->|"publish"| n3
```

> EventBridge routes matching events to targets; scheduled workflows may use EventBridge Scheduler or supported schedule rules.

## Amazon EventBridge Rules


An event envelope carries source, detail type and detail fields; rules match patterns before invoking targets.


```mermaid
flowchart LR
  accTitle: Amazon EventBridge Rules
  n0["AWS event source"]
  n1["Event JSON"]
  n2["EventBridge bus + rule"]
  n3["Target"]
  n0 -->|"emit"| n1
  n1 -->|"pattern matching"| n2
  n2 -->|"matching event"| n3
```

> An event envelope carries source, detail type and detail fields; rules match patterns before invoking targets.

## Amazon EventBridge


Default, partner and custom buses separate event intake; each has configured rules and permissions.

- Event buses can be accessed by other AWS accounts using Resource- based Policies
- You can archive events (all/filter) sent to an event bus (indefinitely or set period)
- Ability to replay archived events


```mermaid
flowchart TB
  accTitle: Amazon EventBridge
  n0["AWS service events"]
  n1["SaaS partner events"]
  n2["Application events"]
  n3["Default bus"]
  n4["Partner bus"]
  n5["Custom bus"]
  n0 -->|"service events"| n3
  n1 -->|"partner integration"| n4
  n2 -->|"PutEvents"| n5
```

> Default, partner and custom buses separate event intake; each has configured rules and permissions.

## Amazon EventBridge – Schema Registry


An event schema describes the structure consumers should expect. EventBridge can infer supported schemas and provide code bindings for integration.

- The Schema Registry allows you to generate code for your application, that will know in advance how data is structured in the event bus
- Schema can be versioned

## Amazon EventBridge – Resource-based Policy


Cross-account event routing requires a permitted target bus and receiver resource policy before receiver rules invoke local targets.

- Manage permissions for a specific Event Bus
- Example: allow/deny events from another AWS account or AWS region
- Use case: aggregate all events from your AWS Organization in a single AWS account or AWS region


```mermaid
flowchart LR
  accTitle: Amazon EventBridge – Resource-based Policy
  n0["Sender bus / rule"]
  n1["Receiver bus policy"]
  n2["Receiver bus / rule"]
  n3["Receiver target"]
  n0 -->|"cross-account delivery"| n1
  n1 -->|"authorized event"| n2
  n2 -->|"local routing"| n3
```

> Cross-account event routing requires a permitted target bus and receiver resource policy before receiver rules invoke local targets.

## Amazon Managed Workflows for Apache Airflow (MWAA)


MWAA hosts Apache Airflow for scheduled, dependency-based batch workflows. Airflow orchestrates tasks rather than acting as the data-processing engine itself.

- Develop, schedule, and monitor your workflows
- Workflows are defined as Python code that creates a Directed Acyclic Graph (DAG)
- Amazon MWAA provides a managed service for Apache Airflow so you don’t have to deal with installing or maintaining it
- Use cases:
  - Complex workflows
  - ETL coordination
  - Preparing ML data

## Airflow DAG: schedule and task dependency


A DAG defines tasks and their dependency order; the sample runs a Bash task before a Python TaskFlow task.

- The daily schedule is midnight using the cron expression 0 0 * * *.
- The hello >> airflow() expression establishes the upstream/downstream dependency.
- This is an interpreted Airflow 2-style course example. Check imports and scheduling options for the deployed Airflow version.

```python
from datetime import datetime
from airflow import DAG
from airflow.decorators import task
from airflow.operators.bash import BashOperator

with DAG("study_demo", start_date=datetime(2022, 1, 1),
         schedule="0 0 * * *", catchup=False) as dag:
    hello = BashOperator(task_id="hello", bash_command="echo hello")

    @task
    def airflow():
        print("airflow")

    hello >> airflow()
```


```mermaid
flowchart LR
  accTitle: Airflow DAG: schedule and task dependency
  n0["Daily schedule"]
  n1["hello<br/>BashOperator: echo hello"]
  n2["airflow<br/>Python task: print airflow"]
  n0 -->|"scheduled run"| n1
  n1 -->|"hello #gt;#gt; airflow()"| n2
```

> The sample Airflow DAG schedules a daily workflow in which a Bash task completes before a Python TaskFlow task runs.

## Airflow + MWAA


MWAA loads DAG definitions and supporting files from S3 and schedules task execution in its managed Airflow environment.

- Your DAGs (Python code) are uploaded into S3
  - May also zip it together with required plugins and requirements
- Amazon MWAA picks it up, and orchestrates and schedules the pipelines defined by each DAG.
- Runs within a VPC
  - In at least 2 AZ’s
- Private or public endpoints
  - IAM-managed
  - (Access to Airflow Web Server)
- Automatic scaling
  - Airflow Workers autoscale up to the limits you define


```mermaid
flowchart LR
  accTitle: Airflow + MWAA
  n0["DAG files in S3"]
  n1["MWAA scheduler"]
  n2["Airflow workers"]
  n3["AWS / external task targets"]
  n0 -->|"load definitions"| n1
  n1 -->|"schedule runnable tasks"| n2
  n2 -->|"execute operators"| n3
```

> MWAA loads DAG definitions and supporting files from S3 and schedules task execution in its managed Airflow environment.

## Amazon MWAA Integration


MWAA operators and integrations invoke surrounding data and compute services. Execution roles, credentials and network access govern those calls.

  - Athena, Batch, CloudWatch, DynamoDB, DataSync
  - EMR, Fargate, EKS, Kinesis, Glue, Lambda
  - Redshift, SQS, SNS, SageMaker, S3… and more
  - Security services (AWS Secrets Manager, etc)
- Schedulers and Workers are AWS Fargate containers

## Amazon MWAA Architecture


MWAA separates customer-VPC schedulers/workers from service-VPC web and metadata services; private endpoints, IAM, KMS, S3, ECR and CloudWatch support the environment.


```mermaid
flowchart TB
  accTitle: Amazon MWAA Architecture
  n0["S3 DAGs / plugins"]
  n1["Schedulers"]
  n2["SQS task queue"]
  n3["Workers across AZs"]
  n4["Database endpoint + proxy"]
  n5["Metadata database"]
  n6["Web-server VPC endpoint"]
  n7["Airflow web server"]
  n8["Public / private web access"]
  n9["CloudWatch / ECR / IAM / KMS"]
  n0 -->|"DAG definitions"| n1
  n1 -->|"enqueue tasks"| n2
  n2 -->|"claim tasks"| n3
  n1 -->|"metadata connection"| n4
  n3 -->|"task state"| n4
  n4 -->|"database proxy"| n5
  n6 -->|"private web path"| n7
  n8 -->|"configured web access"| n7
  n9 -->|"logs / images / permissions / keys"| n3
```

> MWAA separates customer-VPC schedulers/workers from service-VPC web and metadata services; private endpoints, IAM, KMS, S3, ECR and CloudWatch support the environment.

# Section Security, identity and compliance

## Least privilege


Grant only the actions and resource scope required by the workload.

- Use roles and temporary credentials for workloads; scope bucket listing separately from object reads.
- IAM Access Analyzer can help generate policies from observed activity, followed by review and refinement.
- Start broadly only as an isolated learning shortcut, not as a recommended production baseline.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {"Effect": "Allow", "Action": "s3:ListBucket",
     "Resource": "arn:aws:s3:::example-bucket",
     "Condition": {"StringLike": {"s3:prefix": "data/reports/*"}}},
    {"Effect": "Allow", "Action": ["s3:GetObject", "s3:GetObjectVersion"],
     "Resource": "arn:aws:s3:::example-bucket/data/reports/*.csv"}
  ]
}
```

**Current reference (checked 2026-10-13):** [IAM security best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html).

## Data Masking and Anonymization


Sensitive-data handling starts by identifying the fields and the permitted use. Masking, encryption and anonymization solve different disclosure problems.

- Masking obfuscates data
  - For example, masking all but the last 4 digits of a credit card or social security number
  - Masking passwords
  - Supported in Glue DataBrew and Redshift

## Masking, pseudonymization and anonymization


Reducing identifiability requires a threat model, not just changing the displayed value.

- The source lists replacement, shuffling, encryption, hashing and deletion as techniques.
- Encryption is reversible with a key; a hash can still permit matching or guessing. Neither automatically makes a dataset anonymous.
- Minimize collection, restrict access and assess re-identification risk across the retained fields.

## Password salts and hashing


A unique random salt prevents identical passwords from producing identical stored hashes and defeats reusable precomputed lookup tables.

- Use a suitable password-hashing scheme with a cost factor; do not substitute a single fast general-purpose hash.
- Store the salt and scheme parameters with the derived hash. Salts are not passwords or encryption keys.
- Salt rotation is not a standalone password-storage recipe; use the selected scheme's supported password-change and rehash process.

**Current reference (checked 2026-10-13):** [NIST password storage guidance](https://pages.nist.gov/800-63-4/sp800-63b.html).

## Key Salting: Example


A password-hashing illustration combines a salt with a password. A fast SHA-256 hash alone is not an appropriate production password-storage scheme.

**Current reference (checked 2026-10-13):** [NIST password storage guidance](https://pages.nist.gov/800-63-4/sp800-63b.html).


```mermaid
flowchart LR
  accTitle: Key Salting: Example
  n0["Password"]
  n1["Unique random salt"]
  n2["Password KDF<br/>Illustrative hashing step"]
  n3["Stored salt + derived hash"]
  n0 -->|"secret input"| n2
  n1 -->|"salt input"| n2
  n2 -->|"store derived value"| n3
```

> A password-hashing illustration combines a salt with a password. A fast SHA-256 hash alone is not an appropriate production password-storage scheme.

## Keeping Data Where it Belongs


Data-residency requirements constrain where data may be stored, copied or processed. Apply the constraint to backups and supporting services as well as the primary dataset.

- It’s all too easy for backups or replication to send data to a region where it is not allowed
- AWS Organizations’ Service Control Policies are one way to enforce this
- Restrict IAM policies and S3 bucket policies to allowed regions
- Take care when configuring backups & replication for RDS, Aurora, Redshift
- Monitor and alarm with CloudTrail / CloudWatch

## Keeping Data Where it Belongs


The policy example restricts specified RDS backup actions to selected Regions. Verify the action, resource and condition together rather than generalizing it to all data movement.

## IAM: Users & Groups


IAM users can belong to multiple groups; groups collect permissions and do not contain other groups.

- IAM = Identity and Access Management, Global service
- Root account created by default, shouldn’t be used or shared
- Users are people within your organization, and can be grouped
- Groups only contain users, not other groups
- Users don’t have to belong to a group, and user can belong to multiple groups


```mermaid
flowchart LR
  accTitle: IAM: Users & Groups
  n0["User A"]
  n1["User B"]
  n2["Developers group"]
  n3["Auditors group"]
  n4["Group policies"]
  n0 ---|"membership"| n2
  n0 ---|"membership"| n3
  n1 ---|"membership"| n3
  n4 ---|"attached policy"| n2
  n4 ---|"attached policy"| n3
```

> IAM users can belong to multiple groups; groups collect permissions and do not contain other groups.

## IAM: Permissions


IAM policies grant actions on resources subject to conditions. Effective access depends on all applicable policies and explicit denies.

- These policies define the permissions of the users
- In AWS you apply the least privilege principle: don’t give more permissions than a user needs

## IAM Policies inheritance


Identity permissions may come from direct and group policies, but explicit denies, boundaries and organization controls constrain effective access.


```mermaid
flowchart LR
  accTitle: IAM Policies inheritance
  n0["Direct / group allows"]
  n1["Resource policy"]
  n2["Boundary / SCP / explicit deny"]
  n3["Effective authorization"]
  n0 -->|"candidate permissions"| n3
  n1 -->|"resource rules"| n3
  n2 -->|"constraints / deny precedence"| n3
```

> Identity permissions may come from direct and group policies, but explicit denies, boundaries and organization controls constrain effective access.

## IAM Policies Structure


A policy statement defines its effect, allowed or denied actions, resources and optional conditions; resource policies also identify principals.

- Consists of
  - Version: policy language version, always include “2012-10-17”
  - Id: an identifier for the policy (optional)
  - Statement: one or more individual statements (required)
- Statements consists of
  - Sid: an identifier for the statement (optional)
  - Effect: whether the statement allows or denies access (Allow, Deny)
  - Principal: account/user/role to which this policy applied to
  - Action: list of actions this policy allows or denies
  - Resource: list of resources to which the actions applied to
  - Condition: conditions for when this policy is in effect (optional)


```mermaid
flowchart LR
  accTitle: IAM Policies Structure
  n0["Policy statement"]
  n1["Effect"]
  n2["Action"]
  n3["Resource"]
  n4["Condition / Principal"]
  n0 ---|"Allow / Deny"| n1
  n0 ---|"operation"| n2
  n0 ---|"scope"| n3
  n0 ---|"context / caller where applicable"| n4
```

> A policy statement defines its effect, allowed or denied actions, resources and optional conditions; resource policies also identify principals.

## IAM – Password Policy


A password policy defines supported composition and lifecycle requirements for applicable IAM users. It complements federation and stronger authentication factors.

- In AWS, you can setup a password policy:
  - Set a minimum password length
  - Require specific character types:
    - including uppercase letters
    - lowercase letters
    - numbers
    - non-alphanumeric characters
  - Allow all IAM users to change their own passwords
  - Require users to change their password after some time (password expiration)
  - Prevent password re-use

## Multi Factor Authentication - MFA


MFA adds an independent authentication factor to the password sign-in path.

- Users have access to your account and can possibly change configurations or delete resources in your AWS account
- You want to protect your Root Accounts and IAM users
- MFA = password you know + security device you own
- Main benefit of MFA: if a password is stolen or hacked, the account is not compromised


```mermaid
flowchart LR
  accTitle: Multi Factor Authentication - MFA
  n0["Password"]
  n1["Authenticator factor"]
  n2["Sign-in verification"]
  n3["Authenticated session"]
  n0 -->|"knowledge factor"| n2
  n1 -->|"possession / supported factor"| n2
  n2 -->|"successful verification"| n3
```

> MFA adds an independent authentication factor to the password sign-in path.

## MFA: authenticator applications and security keys


Choose a supported independent authentication factor for the sign-in context.

- Authenticator applications generate time-based codes; supported security keys/passkeys use a different mechanism.
- Check currently supported devices rather than treating example vendors as an exhaustive list.

## MFA: hardware devices


Hardware MFA devices are another supported factor option; availability differs by account environment.

- The course distinguishes ordinary commercial-account devices and GovCloud device options.
- Verify current supported hardware and enrollment requirements before purchasing.

## IAM Roles for Services


An EC2 instance profile exposes temporary role credentials to software on the instance; role permissions govern subsequent AWS calls.

- Some AWS service will need to perform actions on your behalf
- To do so, we will assign permissions to AWS services with IAM Roles
- Common roles:
  - EC2 Instance Roles
  - Lambda Function Roles
  - Roles for CloudFormation


```mermaid
flowchart LR
  accTitle: IAM Roles for Services
  n0["EC2 application"]
  n1["Instance role"]
  n2["Temporary credentials"]
  n3["AWS service"]
  n0 -->|"instance profile"| n1
  n1 -->|"credential delivery"| n2
  n2 -->|"signed permitted API call"| n3
```

> An EC2 instance profile exposes temporary role credentials to software on the instance; role permissions govern subsequent AWS calls.

## Why encryption? Encryption in flight (TLS / SSL)


TLS protects data while it crosses the network; it is separate from storage encryption.

- Data is encrypted before sending and decrypted after receiving
- TLS certificates help with encryption (HTTPS)
- Encryption in flight ensures no MITM (man in the middle attack) can happen


```mermaid
flowchart LR
  accTitle: Why encryption? Encryption in flight (TLS / SSL)
  n0["Client plaintext"]
  n1["TLS-protected channel"]
  n2["Server plaintext"]
  n0 -->|"encrypt in transit"| n1
  n1 -->|"decrypt at endpoint"| n2
```

> TLS protects data while it crosses the network; it is separate from storage encryption.

## Why encryption? Server-side encryption at rest


With server-side encryption, the storage service receives data and encrypts it before persistence.

- Data is encrypted after being received by the server
- Data is decrypted before being sent
- It is stored in an encrypted form thanks to a key (usually a data key)
- The encryption / decryption keys must be managed somewhere, and the server must have access to it


```mermaid
flowchart LR
  accTitle: Why encryption? Server-side encryption at rest
  n0["Client"]
  n1["Storage service encryption"]
  n2["Ciphertext at rest"]
  n3["Authorized read"]
  n0 -->|"TLS request"| n1
  n1 -->|"encrypt / store"| n2
  n2 -->|"service decrypts on permitted read"| n3
```

> With server-side encryption, the storage service receives data and encrypts it before persistence.

## Why encryption? Client-side encryption


With client-side encryption, the service stores ciphertext and the client controls decryption.

- Data is encrypted by the client and never decrypted by the server
- Data will be decrypted by a receiving client
- The server should not be able to decrypt the data
- Could leverage Envelope Encryption


```mermaid
flowchart LR
  accTitle: Why encryption? Client-side encryption
  n0["Client plaintext"]
  n1["Client key + encryption"]
  n2["Remote ciphertext"]
  n3["Client decryption"]
  n0 -->|"encrypt"| n1
  n1 -->|"upload ciphertext"| n2
  n2 -->|"download / decrypt"| n3
```

> With client-side encryption, the service stores ciphertext and the client controls decryption.

## AWS KMS (Key Management Service)


KMS manages cryptographic keys and authorized operations used by many AWS integrations. Control of a key is distinct from permission to access encrypted data.

- AWS manages encryption keys for us
- Fully integrated with IAM for authorization
- Easy way to control access to your data
- Able to audit KMS Key usage using CloudTrail
- Seamlessly integrated into most AWS services (EBS, S3, RDS, SSM…)
- Never ever store your secrets in plaintext, especially in your code!
  - KMS Key Encryption also available through API calls (SDK, CLI)

## KMS key types and operations


Key type and key usage determine which cryptographic operations a KMS key supports.

- Symmetric encryption keys use the same secret key material for encryption and decryption; AWS integrations commonly use this model.
- Asymmetric keys have a public/private pair. Supported RSA keys may encrypt/decrypt or sign/verify according to their configured usage; ECC keys are not generic RSA encryption replacements.
- The public key can be downloaded for supported external operations; unencrypted private key material is not exported from KMS.
- Use the current key-specification and key-usage documentation rather than applying every listed operation to every asymmetric key.

**Current reference (checked 2026-10-13):** [KMS asymmetric key specifications](https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html).

## AWS KMS (Key Management Service)


Distinguish AWS-owned, AWS-managed and customer-managed keys, including control, rotation and billing.

- Pricing figures are illustrative. Check current Region, usage and feature pricing before making a cost decision.
- Types of KMS Keys:
  - AWS Owned Keys (free): SSE-S3, SSE-SQS, SSE-DDB (default key)
  - AWS Managed Key: free (aws/service-name, example: aws/rds or aws/ebs)
  - Customer managed keys created in KMS: $1 / month
  - Customer managed keys imported: $1 / month
  - + pay for API call to KMS ($0.03 / 10000 calls)
- Automatic Key rotation:
  - AWS-managed KMS Key: automatic every 1 year
  - Customer-managed KMS Key: (must be enabled) automatic & on- demand

## Copying Snapshots across regions


KMS keys are Regional. Copying an encrypted EBS snapshot to another Region uses an appropriate destination-Region key.


```mermaid
flowchart LR
  accTitle: Copying Snapshots across regions
  n0["Source EBS snapshot"]
  n1["Source-Region key"]
  n2["Cross-Region copy"]
  n3["Destination-Region key"]
  n4["Destination snapshot"]
  n1 -->|"source encryption"| n0
  n0 -->|"copy"| n2
  n3 -->|"reencrypt"| n2
  n2 -->|"new encrypted copy"| n4
```

> KMS keys are Regional. Copying an encrypted EBS snapshot to another Region uses an appropriate destination-Region key.

## KMS Key Policies


KMS authorization combines key-policy rules and applicable identity permissions or grants; a key does not become usable merely because a caller knows its ID.

- Control access to KMS keys, “similar” to S3 bucket policies
- Difference: you cannot control access without them
- Default KMS Key Policy:
  - Created if you don’t provide a specific KMS Key Policy
  - Complete access to the key to the root user = entire AWS account
- Custom KMS Key Policy:
  - Define users, roles that can access the KMS key
  - Define who can administer the key
  - Useful for cross-account access of your KMS key


```mermaid
flowchart LR
  accTitle: KMS Key Policies
  n0["Caller"]
  n1["Key policy / grant"]
  n2["Applicable IAM policy"]
  n3["KMS key operation"]
  n0 -->|"request"| n1
  n1 -->|"key authorization"| n3
  n2 -->|"identity authorization where required"| n3
```

> KMS authorization combines key-policy rules and applicable identity permissions or grants; a key does not become usable merely because a caller knows its ID.

## Copying Snapshots across accounts


Cross-account encrypted snapshot sharing requires snapshot permission and use of the source customer-managed key; the recipient can copy under its own key.


```mermaid
flowchart LR
  accTitle: Copying Snapshots across accounts
  n0["Source encrypted snapshot"]
  n1["Source key permissions"]
  n2["Recipient copy"]
  n3["Recipient key"]
  n4["Restored volume"]
  n0 -->|"share snapshot"| n2
  n1 -->|"permit key use"| n2
  n3 -->|"encrypt copy"| n2
  n2 -->|"restore"| n4
```

> Cross-account encrypted snapshot sharing requires snapshot permission and use of the source customer-managed key; the recipient can copy under its own key.

## AWS Macie


Amazon Macie is a security service that helps the institution discover, classify, and protect sensitive data, including PII. 
While it can help identify PII data, it does not directly obfuscate the data or control access to it during preprocessing.

- Emits findings that EventBridge can route to response workflows.
- Amazon Macie is a fully managed data security and data privacy service 
- Uses machine learning and pattern matching to discover and protect your sensitive data in AWS.


```mermaid
flowchart LR
  accTitle: AWS Macie
  n0["S3 objects"]
  n1["Macie classification"]
  n2["Findings"]
  n3["EventBridge response"]
  n0 -->|"inspect permitted data"| n1
  n1 -->|"sensitive-data finding"| n2
  n2 -->|"route for action"| n3
```

> Macie discovers sensitive S3 data and emits findings that EventBridge can route to response workflows.

## AWS Secrets Manager


Secrets Manager stores application secrets and supports configured rotation workflows. Retrieving a secret and rotating the associated credential are separate operations.

- Capability to force rotation of secrets every X days
- Automate generation of secrets on rotation (uses Lambda)
- Integration with Amazon RDS (MySQL, PostgreSQL, Aurora)
- Secrets are encrypted using KMS
- Mostly meant for RDS integration

## AWS Secrets Manager – Multi-Region Secrets


Secrets Manager can replicate a secret into another Region; replication and rotation behavior must be planned for regional access.

- Replicate Secrets across multiple AWS Regions
- Secrets Manager keeps read replicas in sync with the primary Secret
- Ability to promote a read replica Secret to a standalone Secret
- Use cases: multi-region apps, disaster recovery strategies, multi- region DB…


```mermaid
flowchart LR
  accTitle: AWS Secrets Manager – Multi-Region Secrets
  n0["Primary secret"]
  n1["Replica in Region B"]
  n2["Replica in Region C"]
  n0 -->|"replicate"| n1
  n0 -->|"replicate"| n2
```

> Secrets Manager can replicate a secret into another Region; replication and rotation behavior must be planned for regional access.

## AWS WAF – Web Application Firewall


WAF evaluates application-layer HTTP(S) requests at supported attachment points.

- Protects your web applications from common web exploits (Layer 7)
- Layer 7 is HTTP (vs Layer 4 is TCP/UDP)
- Deploy on
  - Application Load Balancer
  - API Gateway
  - CloudFront
  - AppSync GraphQL API
  - Cognito User Pool

## AWS WAF – Web Application Firewall


A web ACL evaluates HTTP(S) requests through configured WAF rules. Choose rules and attachment points from the application traffic that needs inspection.

  - IP Set: up to 10,000 IP addresses – use multiple Rules for more IPs
  - HTTP headers, HTTP body, or URI strings Protects from common attack - SQL injection and Cross-Site Scripting (XSS)
  - Size constraints, geo-match (block countries)
  - Rate-based rules (to count occurrences of events) – for DDoS protection
- Web ACL are Regional except for CloudFront
- A rule group is a reusable set of rules that you can add to a web ACL

## WAF – Fixed IP while using WAF with a Load Balancer


Global Accelerator can expose static anycast addresses in front of an ALB protected by WAF; WAF attaches to supported application endpoints.

- WAF does not support the Network Load Balancer (Layer 4)
- We can use Global Accelerator for fixed IP and WAF on the ALB


```mermaid
flowchart LR
  accTitle: WAF – Fixed IP while using WAF with a Load Balancer
  n0["Client"]
  n1["Global Accelerator"]
  n2["ALB + WAF"]
  n3["EC2 application"]
  n0 -->|"static IP ingress"| n1
  n1 -->|"route traffic"| n2
  n2 -->|"allowed request"| n3
```

> Global Accelerator can expose static anycast addresses in front of an ALB protected by WAF; WAF attaches to supported application endpoints.

## AWS Shield: protect from DDoS attack


Shield addresses distributed-denial-of-service threats at supported AWS resources. Compare the protection and operational features of its service tiers.

- AWS Shield Standard:
  - Free service that is activated for every AWS customer
  - Provides protection from attacks such as SYN/UDP Floods, Reflection attacks and other layer 3/layer 4 attacks
- AWS Shield Advanced:
  - Optional DDoS mitigation service ($3,000 per month per organization)
  - Protect against more sophisticated attack on Amazon EC2, Elastic Load Balancing (ELB), Amazon CloudFront, AWS Global Accelerator, and Route 53
  - 24/7 access to AWS DDoS response team (DRP)
  - Protect against higher fees during usage spikes due to DDoS
  - Shield Advanced automatic application layer DDoS mitigation automatically creates, evaluates and deploys AWS WAF rules to mitigate layer 7 attacks

## Security - Kinesis


Stream security combines permitted producers and consumers, encrypted transport, at-rest protection and optional private network paths.

  - SSL endpoints using the HTTPS protocol to do encryption in flight
  - AWS KMS provides server-side encryption [Encryption at rest]
  - For client side-encryption, you must use your own encryption libraries
  - Supported Interface VPC Endpoints / Private Link – access privately
  - KCL – must get read / write access to DynamoDB table
- Data Firehose:
  - Attach IAM roles so it can deliver to S3 / ES / Redshift / Splunk
  - Can encrypt the delivery stream with KMS [Server side encryption]
- Kinesis Data Analytics
  - Attach IAM role so it can read from Kinesis Data Streams and reference sources and write to an output destination (example Data Firehose)

## Security - SQS


Queue security must cover message publishers, receivers, encryption keys and resource policies used by service integrations.

- Server Side Encryption using KMS
- IAM policy must allow usage of SQS
- SQS queue access policy
- Client-side encryption must be implemented manually
- VPC Endpoint is provided through an Interface

## Security – AWS IoT


IoT policies authorize device operations separately from IAM permissions used by other AWS principals. Secure both the device connection and its data destination.

  - Attached to X.509 certificates or Cognito Identities
  - Able to revoke any device at any time
  - IoT Policies are JSON documents
  - Can be attached to groups instead of individual Things.
- IAM Policies:
  - Attached to users, group or roles
  - Used for controlling IoT AWS APIs
- Attach roles to Rules Engine so they can perform their actions

## Security – Amazon S3


S3 protection combines access policies, public-access controls, encryption and appropriate network paths. Use each control for its own boundary.

- S3 bucket policies
- Access Control Lists (ACLs)
- Encryption in flight using HTTPS
- Encryption at rest
  - Server-side encryption: SSE-S3, SSE-KMS, SSE-C
  - Client-side encryption – such as Amazon S3 Encryption Client
- Versioning + MFA Delete
- CORS for protecting websites
- VPC Endpoint is provided through a Gateway
- Glacier – vault lock policies to prevent deletes (WORM)

## Security – DynamoDB


DynamoDB protects requests and stored data through transport encryption, key management and IAM authorization, with optional private access paths.

- DynamoDB tables are encrypted at rest
  - KMS encryption for base tables and secondary indexes
  - AWS owned key (default)
  - AWS managed key (aws/dynamodb)
  - AWS customer managed key (your own)
- Access to tables / API / DAX using IAM
- DynamoDB Streams are encrypted
- VPC Endpoint is provided through a Gateway

## Security - RDS


RDS security separates VPC reachability, database authentication and encryption. Recovery copies and monitoring data also require protection.

- Security Groups control network access to DB Instances
- KMS provides encryption at rest
- SSL provides encryption in-flight
- IAM policies provide protection for the RDS API
- IAM authentication is supported by PostgreSQL, MySQL and MariaDB
- Must manage user permissions within the database itself
- MSSQL Server and Oracle support TDE (Transparent Data Encryption)

## Security - Aurora


Aurora uses the same broad network, identity and encryption layers as RDS, with permissions and recovery behavior matched to its cluster model.

- VPC provides network isolation
- Security Groups control network access to DB Instances
- KMS provides encryption at rest
- SSL provides encryption in-flight
- IAM authentication is supported by PostgreSQL and MySQL
- Must manage user permissions within the database itself

## Security - Lambda


A Lambda execution role authorizes the function's AWS calls. Permissions to invoke the function are a separate part of the request path.

- Sources
- Targets
- KMS encryption for secrets
- SSM parameter store for configurations
- CloudWatch Logs
- Deploy in VPC to access private resources

## Security - Glue


Glue needs permissions for job execution, source and destination data, catalog operations and encryption keys. Scope the execution role to the workflow.

- Configure Glue to only access JDBC through SSL
- Data Catalog: Encrypted by KMS
- Connection passwords: Encrypted by KMS
- Data written by AWS Glue – Security Configurations:
  - S3 encryption mode: SSE-S3 or SSE-KMS
  - CloudWatch encryption mode
  - Job bookmark encryption mode

## Security - EMR


EMR protection spans cluster access, instance identities, application permissions and encrypted storage or transport. Separate operator access from job access.

- Attach IAM roles to EC2 instances for:
  - proper S3 access
  - for EMRFS requests to S3
  - DynamoDB scans through Hive
- EC2 Security Groups
  - One for master node
  - Another one for cluster node (core node or task node)
- Encrypts data at-rest: EBS encryption, Open Source HDFS Encryption, LUKS + EMRFS for S3
- In-transit encryption: node to node communication, EMRFS, TLS
- Data is encrypted before uploading to S3
- Kerberos authentication (provide authentication from Active Directory)
- Apache Ranger: Centralized Authorization (RBAC – Role Based Access) – setup on external EC2
- https://aws.amazon.com/blogs/big-data/best-practices-for-securing-amazon-emr/

## Security – EMR Encryption (security config)


An EMR security configuration controls supported at-rest and in-transit encryption paths; data and local/HDFS storage require their own settings.

- At-rest data encryption for EMRFS:
  - Encryption in Amazon S3 (SSE-S3, SSE-KMS, Client-Side encryption)
  - Enctyption in Local Disks
- At-rest data encryption for local disks:
  - Open-source HDFS encryption
  - EC2 Instance Store encryption: NVMe encryption, or LUKS encryption
  - EBS volumes: EBS encryption (KMS) – works with root volume LUKS encryption – does not work with root
- In-transit encryption:
  - Note to node communication
  - For EMRFS traffic between S3 and cluster nodes
  - TLS encryption


```mermaid
flowchart LR
  accTitle: Security – EMR Encryption (security config)
  n0["EMR security configuration"]
  n1["S3 encryption"]
  n2["Local / HDFS encryption"]
  n3["Node-to-node transport"]
  n0 ---|"at-rest policy"| n1
  n0 ---|"at-rest policy"| n2
  n0 ---|"in-transit policy"| n3
```

> An EMR security configuration controls supported at-rest and in-transit encryption paths; data and local/HDFS storage require their own settings.

## Security – OpenSearch Service


OpenSearch security layers network reachability with supported domain and fine-grained permissions. Encryption alone does not authorize a query.

- OpenSearch policy to manage security further
- Data security by encrypting data at-rest using KMS
- Encryption in-transit using HTTPS (TLS)
- IAM or Cognito based authentication
- Amazon Cognito allow end-users to log-in to OpenSearch Dashboards through enterprise identity providers such as Microsoft Active Directory using SAML

## Security - Redshift


Redshift access combines network rules, database permissions and encryption-key access. Audit settings determine which activity is retained for review.

- Cluster security groups
- Encryption in flight using the JDBC driver enabled with SSL
- Encryption at rest using KMS or an HSM device (establish a connection)
- Supports S3 SSE using default managed key
- Use IAM Roles for Redshift
- To access other AWS Resources (example S3 or KMS)
- Must be referenced in the COPY or UNLOAD command (alternatively paste access key and secret key creds)

## Security - Athena


Athena authorization includes the query service, catalog, data locations and keys. Protect query results with the same care as source data.

- Data is in S3: IAM policies, bucket policies & ACLs
- Encryption of data according to S3 standards: SSE-S3, SSE- KMS, CSE-KMS
- Encryption in transit using TLS between Athena and S3 and JDBC
- Fine grained access using the AWS Glue Catalog

## Security - Quicksight


QuickSight security features vary by edition and connection model. Evaluate identity, dataset permissions and source connectivity together.

  - IAM users
  - Email based accounts
- Enterprise edition:
  - Active Directory
  - Federated Login
  - Supports MFA (Multi Factor Authentication)
  - Encryption at rest and in SPICE
- Row Level Security to control which users can see which rows
- Column Level Security to restrict access to specific columns in dataset

# Section Networking and delivery

## VPC & Subnets Primer


A VPC is Regional; subnets each occupy one AZ, with route tables determining public or private routing.

- VPC: private network to deploy your resources (regional resource)
- Subnets allow you to partition your network inside your VPC (Availability Zone resource)
- A public subnet is a subnet that is accessible from the internet
- A private subnet is a subnet that is not accessible from the internet
- To define access to the internet and between subnets, we use Route Tables.


```mermaid
architecture-beta
  group vpc(cloud)[Regional VPC]
  service subnet0(server)[AZ A public subnet] in vpc
  service subnet1(server)[AZ A private subnet] in vpc
  service subnet2(server)[AZ B public subnet] in vpc
  service subnet3(server)[AZ B private subnet] in vpc
  align row subnet0 subnet2
  align row subnet1 subnet3
  align column subnet0 subnet1
  align column subnet2 subnet3
  %% Regional VPC -> AZ A public subnet: subnet
  %% Regional VPC -> AZ A private subnet: subnet
  %% Regional VPC -> AZ B public subnet: subnet
  %% Regional VPC -> AZ B private subnet: subnet
```

> A VPC is Regional; subnets each occupy one AZ, with route tables determining public or private routing.

## VPC Diagram


Subnet CIDRs divide a VPC address range into nonoverlapping ranges within individual AZs.


```mermaid
architecture-beta
  group vpc(cloud)[VPC 10.0.0.0/16]
  service subnet0(server)[AZ A subnet 10.0.1.0/24] in vpc
  service subnet1(server)[AZ B subnet 10.0.2.0/24] in vpc
  service subnet2(server)[AZ C subnet 10.0.3.0/24] in vpc
  align row subnet0 subnet1 subnet2
  %% VPC 10.0.0.0/16 -> AZ A subnet: address allocation
  %% VPC 10.0.0.0/16 -> AZ B subnet: address allocation
  %% VPC 10.0.0.0/16 -> AZ C subnet: address allocation
```

> Subnet CIDRs divide a VPC address range into nonoverlapping ranges within individual AZs.

## Internet Gateway & NAT Gateways


Private IPv4 workloads can initiate internet traffic through a NAT gateway in a public subnet and an internet gateway; unsolicited inbound access is not provided.

- Internet Gateways helps our VPC instances connect with the internet
- Public Subnets have a route to the internet gateway.
- NAT Gateways (AWS-managed) & NAT Instances (self-managed) allow your instances in your Private Subnets to access the internet while remaining private


```mermaid
architecture-beta
  group az(cloud)[AZ - Availability Zone]
  service www(internet)[WWW - Internet]
  service igw(cloud)[IGW - Internet gateway]
  service public(server)[Public Subnet - Route to IGW] in az
  service nat(server)[NAT - Public NAT gateway] in az
  service private(server)[Private Subnet - Initiates outbound traffic] in az
  www:B <--> T:igw
  igw:B <--> T:public
  igw:L <--> L:nat
  private:T --> B:nat
  %% WWW -> IGW: internet traffic
  %% IGW -> Public Subnet: public-subnet traffic
  %% IGW -> NAT: NAT egress and responses
  %% Private Subnet -> NAT: initiates outbound traffic
```

> WWW and the IGW are outside the AZ; the public subnet, NAT and private subnet are inside. A public NAT gateway is deployed in a public subnet. Private workloads initiate outbound traffic through NAT; return traffic is supported, but unsolicited inbound access is not provided.

## Network ACL & Security Groups


NACLs act at subnet boundaries and security groups at network interfaces; both apply alongside route and application controls.

- NACL (Network ACL)
  - A firewall which controls traffic from and to subnet
  - Can have ALLOW and DENY rules
  - Are attached at the Subnet level
  - Rules only include IP addresses
- Security Groups
  - A firewall that controls traffic to and from an ENI / an EC2 Instance
  - Can have only ALLOW rules
  - Rules include IP addresses and other security groups


```mermaid
flowchart LR
  accTitle: Network ACL & Security Groups
  n0["Network packet"]
  n1["Subnet NACL"]
  n2["ENI security group"]
  n3["Application"]
  n0 -->|"stateless rules"| n1
  n1 -->|"stateful rules"| n2
  n2 -->|"allowed traffic"| n3
```

> NACLs act at subnet boundaries and security groups at network interfaces; both apply alongside route and application controls.

## Network ACLs vs Security Groups


Security groups are stateful allow rules; NACLs are stateless ordered allow/deny rules requiring return-path allowances.


```mermaid
flowchart LR
  accTitle: Network ACLs vs Security Groups
  n0["Security group"]
  n1["Stateful response tracking"]
  n2["NACL"]
  n3["Separate inbound / outbound rules"]
  n0 ---|"automatic response allowance"| n1
  n2 ---|"stateless evaluation"| n3
```

> Security groups are stateful allow rules; NACLs are stateless ordered allow/deny rules requiring return-path allowances.

## VPC Flow Logs


VPC Flow Logs capture network-flow metadata, not packet payloads, and publish to a configured supported destination.

- Capture information about IP traffic going into your interfaces:
  - VPC Flow Logs
  - Subnet Flow Logs
  - Elastic Network Interface Flow Logs
- Helps to monitor & troubleshoot connectivity issues. Example:
  - Subnets to internet
  - Subnets to subnets
  - Internet to subnets
- Captures network information from AWS managed interfaces too: Elastic Load Balancers, ElastiCache, RDS, Aurora, etc…
- VPC Flow logs data can go to S3, CloudWatch Logs, and Data Firehose


```mermaid
flowchart LR
  accTitle: VPC Flow Logs
  n0["VPC / subnet / ENI"]
  n1["Flow log records"]
  n2["CloudWatch Logs"]
  n3["S3"]
  n4["Data Firehose"]
  n0 -->|"traffic metadata"| n1
  n1 -->|"destination option"| n2
  n1 -->|"destination option"| n3
  n1 -->|"destination option"| n4
```

> VPC Flow Logs capture network-flow metadata, not packet payloads, and publish to a configured supported destination.

## VPC Peering


VPC peering is nontransitive: A-to-B and B-to-C do not establish A-to-C connectivity.

- Connect two VPC, privately using AWS’ network
- Make them behave as if they were in the same network
- Must not have overlapping CIDR (IP address range)
- VPC Peering connection is not transitive (must be established for each VPC that need to communicate with one another)


```mermaid
flowchart LR
  accTitle: VPC Peering
  n0["VPC A"]
  n1["VPC B"]
  n2["VPC C"]
  n0 ---|"explicit peering"| n1
  n1 ---|"explicit peering"| n2
```

> VPC peering is nontransitive: A-to-B and B-to-C do not establish A-to-C connectivity.

## VPC Endpoints


Interface endpoints use private ENIs for supported services; gateway endpoints route S3 or DynamoDB traffic through route-table entries.

- Endpoints allow you to connect to AWS Services using a private network instead of the public www network
- This gives you enhanced security and lower latency to access AWS services
- VPC Endpoint Gateway: S3 & DynamoDB
- VPC Endpoint Interface: most services (including S3 & DynamoDB)
- Only used within your VPC


```mermaid
flowchart LR
  accTitle: VPC Endpoints
  n0["VPC workload"]
  n1["Interface endpoint ENI"]
  n2["Supported AWS service"]
  n3["Gateway endpoint route"]
  n4["S3 / DynamoDB"]
  n0 -->|"private IP"| n1
  n1 -->|"PrivateLink"| n2
  n0 -->|"route-table path"| n3
  n3 -->|"gateway endpoint"| n4
```

> Interface endpoints use private ENIs for supported services; gateway endpoints route S3 or DynamoDB traffic through route-table entries.

## Site to Site VPN & Direct Connect


A site-to-site VPN encrypts over an IP path; Direct Connect provides dedicated connectivity but is not encrypted by default.

- Site to Site VPN
  - Connect an on-premises VPN to AWS
  - The connection is automatically encrypted
  - Goes over the public internet
- Direct Connect (DX)
  - Establish a physical connection between on-premises and AWS
  - The connection is private, secure and fast
  - Goes over a private network
  - Takes at least a month to establish


```mermaid
flowchart LR
  accTitle: Site to Site VPN & Direct Connect
  n0["On-premises network"]
  n1["VPN encrypted tunnel"]
  n2["Direct Connect connection"]
  n3["AWS network"]
  n0 -->|"IPsec path"| n1
  n1 -->|"VPN gateway"| n3
  n0 -->|"private circuit"| n2
  n2 -->|"configured routing"| n3
```

> A site-to-site VPN encrypts over an IP path; Direct Connect provides dedicated connectivity but is not encrypted by default.

## VPC connectivity review


VPC networking connects addressing, subnet routes, gateways and filtering controls. Trace the complete request and return path when explaining connectivity.

- Subnets: Tied to an AZ, network partition of the VPC
- Internet Gateway: at the VPC level, provide Internet Access
- NAT Gateway / Instances: give internet access to private subnets
- NACL: Stateless, subnet rules for inbound and outbound
- Security Groups: Stateful, operate at the EC2 instance level or ENI
- VPC Peering: Connect two VPC with non overlapping IP ranges, non transitive
- VPC Endpoints: Provide private access to AWS Services within VPC
- VPC Flow Logs: network traffic logs
- Site to Site VPN: VPN over public internet between on-premises DC and AWS
- Direct Connect: direct private connection to a AWS

## AWS PrivateLink (VPC Endpoint Services)


PrivateLink exposes a provider service through an endpoint service and consumer interface endpoint, without broad VPC peering.

- Most secure & scalable way to expose a service to 1000s of VPCs
- Does not require VPC peering, internet gateway, NAT, route tables…
- Requires a network load balancer (Service VPC) and ENI (Customer VPC)


```mermaid
flowchart LR
  accTitle: AWS PrivateLink (VPC Endpoint Services)
  n0["Consumer application"]
  n1["Interface endpoint ENI"]
  n2["Provider endpoint service / NLB"]
  n3["Provider application"]
  n0 -->|"private address"| n1
  n1 -->|"PrivateLink"| n2
  n2 -->|"service traffic"| n3
```

> PrivateLink exposes a provider service through an endpoint service and consumer interface endpoint, without broad VPC peering.

## What is DNS?


DNS resolves human-readable names to records used by clients to locate services. Caching and TTLs influence when a client observes changes.

- www.google.com => 172.217.18.36
- DNS is the backbone of the Internet
- DNS uses hierarchical naming structure

## DNS Terminologies


DNS is the Internet’s address book: it maps names people remember to records computers can use.

- Name hierarchy — in `www.example.com`, `www` is a subdomain, `example.com` is the second-level domain, and `.com` is the top-level domain.
- Domain registrar — the company where a domain is registered, such as Route 53 or GoDaddy.
- DNS record — an instruction for what answer to return for a name.
- DNS servers — authoritative servers give answers for their zone; recursive resolvers find and cache answers for clients.
- Hosted zone — Route 53’s collection of records for a domain or subdomain.
- Zone file — a text format for storing DNS records.


```mermaid
flowchart LR
  accTitle: DNS Terminologies
  n0["Root ."]
  n1["Top-level domain"]
  n2["Domain"]
  n3["Subdomain / host"]
  n0 ---|"delegation"| n1
  n1 ---|"delegation"| n2
  n2 ---|"name hierarchy"| n3
```

> DNS names form a hierarchy from root to top-level domain to authoritative domain and subdomains.

## How DNS Works


- Your device asks a DNS resolver for the record behind a name such as `www.example.com`.
- If the answer is not cached, the resolver follows referrals: root → `.com` → the domain’s authoritative name server.
- That server returns the DNS answer; your browser then connects to the destination. DNS finds the destination, it does not deliver the web page.


```mermaid
flowchart TB
  accTitle: How DNS Works
  n0["Browser"]
  n1["Recursive resolver"]
  n2["Root"]
  n3["TLD server"]
  n4["Authoritative server"]
  n5["Web server"]
  n0 -->|"DNS query"| n1
  n1 -->|"find TLD"| n2
  n1 -->|"find authority"| n3
  n1 -->|"get record"| n4
  n1 -->|"DNS answer"| n0
  n0 -->|"HTTP(S) to resolved address"| n5
```

> A recursive resolver follows delegations when its cache has no answer, then returns an address that the client uses separately for HTTP.

## Amazon Route 53


Route 53 is AWS’s managed authoritative DNS service: it stores domain records and answers queries for them.

- Register a domain with Route 53, or keep another registrar and use Route 53 for DNS.
- Health checks monitor configured endpoints; failover policies can prefer a healthy alternative.


```mermaid
flowchart LR
  accTitle: Amazon Route 53
  n0["Client resolver"]
  n1["Route 53 hosted zone"]
  n2["EC2 / application endpoint"]
  n0 -->|"DNS query / answer"| n1
  n0 -->|"connect to returned endpoint"| n2
```

> Route 53 answers DNS queries from hosted-zone records; the client's application traffic then goes to the resolved endpoint.

## Route 53 – Records


A DNS record tells Route 53 what answer to return for a name and how long resolvers can reuse it.

- Name + type — which DNS question this record answers, such as an A record for `www.example.com`.
- Value — the answer, such as an IP address or another hostname.
- Routing policy — how Route 53 chooses an answer when multiple targets are configured.
- TTL (seconds) — how long resolvers keep the answer in cache before asking Route 53 again.

## Route 53 – Record Types


Choose a record type by the kind of answer DNS should return.

- A returns an IPv4 address; AAAA returns an IPv6 address.
- CNAME points one hostname to another. DNS looks up the target; this does not redirect a browser request.
- NS lists a zone’s authoritative name servers and tells DNS where to ask for its records.
- CNAME cannot be used at the zone apex (`example.com`). A Route 53 Alias can point the apex to supported AWS resources.
- Other types (advanced, beyond this exam’s focus): CAA, DS, MX, NAPTR, PTR, SOA, TXT, SPF and SRV.

## Route 53 – Hosted Zones


A hosted zone is Route 53’s container for the DNS records of a domain or subdomain.

- Its name server (NS) records identify which servers answer for the zone.
- For a public domain, set the registrar’s name servers to the zone’s NS records so DNS reaches Route 53.

## Route 53 – Public vs. Private Hosted Zones


- Public zone — public DNS resolvers return its records to Internet clients.
- Private zone — the VPC resolver returns its records to clients inside associated VPCs.
- The same domain can have both: internal clients can get a private answer while public clients get a public answer (split-view DNS).
- DNS supplies a record; network rules still decide whether a client can reach the destination.


```mermaid
flowchart LR
  accTitle: Route 53 – Public vs. Private Hosted Zones
  n0["Internet resolver"]
  n1["Public hosted zone"]
  n2["Associated VPC resolver"]
  n3["Private hosted zone"]
  n0 -->|"public query"| n1
  n2 -->|"private query"| n3
```

> Public hosted zones answer public DNS; private hosted zones answer through associated VPC resolver contexts.

## Amazon CloudFront


A CDN serves geographically distributed clients from nearby edge caches while retaining an origin for uncached content.

- Content Delivery Network (CDN)
- Improves read performance, content is cached at the edge
- Improves users experience
- Hundreds of Points of Presence globally (edge locations, caches)
- DDoS protection (because worldwide), integration with Shield, AWS Web Application Firewall


```mermaid
flowchart LR
  accTitle: Amazon CloudFront
  n0["Origin"]
  n1["Edge region A"]
  n2["Edge region B"]
  n3["Client A"]
  n4["Client B"]
  n0 -->|"cache fill"| n1
  n0 -->|"cache fill"| n2
  n1 -->|"nearby delivery"| n3
  n2 -->|"nearby delivery"| n4
```

> A CDN serves geographically distributed clients from nearby edge caches while retaining an origin for uncached content.

## CloudFront – Origins


A CloudFront origin supplies content that the distribution caches or forwards. S3 and HTTP origins require different access and request configurations.

  - For distributing files and caching them at the edge
  - For uploading files to S3 through CloudFront
  - Secured using Origin Access Control (OAC)
- VPC Origin
  - For applications hosted in VPC private subnets
  - Private Application Load Balancer / Network Load Balancer / EC2 Instances
- Custom Origin (HTTP)
  - S3 website (must first enable the bucket as a static S3 website)
  - Any public HTTP backend you want (example: Public ALB)

## CloudFront at a high level


CloudFront serves cache hits at the edge and fetches cache misses from the origin according to its cache behavior.


```mermaid
flowchart LR
  accTitle: CloudFront at a high level
  n0["Viewer"]
  n1["CloudFront edge"]
  n2["Cached response"]
  n3["Origin"]
  n0 -->|"request"| n1
  n1 -->|"cache hit"| n2
  n1 -->|"cache miss / origin request"| n3
  n3 -->|"origin response"| n1
```

> CloudFront serves cache hits at the edge and fetches cache misses from the origin according to its cache behavior.

## CloudFront – S3 as an Origin


Origin Access Control authorizes CloudFront access to a private S3 origin while viewers use the distribution endpoint.


```mermaid
flowchart LR
  accTitle: CloudFront – S3 as an Origin
  n0["Viewers"]
  n1["CloudFront"]
  n2["Origin Access Control"]
  n3["Private S3 bucket"]
  n0 -->|"HTTPS"| n1
  n1 -->|"signed origin request"| n2
  n2 -->|"bucket-policy-authorized access"| n3
```

> Origin Access Control authorizes CloudFront access to a private S3 origin while viewers use the distribution endpoint.

## CloudFront vs S3 Cross Region Replication


CloudFront caches content at edge locations for delivery; cross-Region replication creates separate S3 copies. These solve different access and recovery requirements.

  - Global Edge network
  - Files are cached for a TTL (maybe a day)
  - Great for static content that must be available everywhere
- S3 Cross Region Replication:
  - Must be setup for each region you want replication to happen
  - Files are updated in near real-time
  - Read only
  - Great for dynamic content that needs to be available at low- latency in few regions

## CloudFront – ALB or EC2 as an origin Using VPC Origins


A supported CloudFront VPC origin reaches a private ALB, NLB or EC2 origin through managed connectivity.

- Allows you to deliver content from your applications hosted in your VPC private subnets (no need to expose them on the Internet)
- Deliver traffic to private:
  - Application Load Balancer
  - Network Load Balancer
  - EC2 Instances


```mermaid
flowchart LR
  accTitle: CloudFront – ALB or EC2 as an origin Using VPC Origins
  n0["Viewer"]
  n1["CloudFront"]
  n2["VPC origin"]
  n3["Private ALB / NLB / EC2"]
  n0 -->|"HTTPS"| n1
  n1 -->|"origin fetch"| n2
  n2 -->|"private connectivity"| n3
```

> A supported CloudFront VPC origin reaches a private ALB, NLB or EC2 origin through managed connectivity.

## CloudFront – ALB or EC2 as an origin Using Public Network


For a public custom origin, security-group restrictions can limit origin ingress to CloudFront origin-facing addresses; application authorization remains separate.


```mermaid
flowchart LR
  accTitle: CloudFront – ALB or EC2 as an origin Using Public Network
  n0["Viewer"]
  n1["CloudFront"]
  n2["Origin security group"]
  n3["Public ALB / EC2"]
  n0 -->|"viewer request"| n1
  n1 -->|"origin-facing traffic"| n2
  n2 -->|"allowed origin access"| n3
```

> For a public custom origin, security-group restrictions can limit origin ingress to CloudFront origin-facing addresses; application authorization remains separate.

## CloudFront – Cache Invalidations


Updating the origin does not instantly replace cached objects. Invalidation requests remove selected cached paths before their normal expiry.

- In case you update the back-end origin, CloudFront doesn’t know about it and will only get the refreshed content after the TTL has expired
- However, you can force an entire or partial cache refresh (thus bypassing the TTL) by performing a CloudFront Invalidation
- You can invalidate all files (*) or a special path (/images/*)


```mermaid
flowchart LR
  accTitle: CloudFront – Cache Invalidations
  n0["Updated origin object"]
  n1["Invalidation request"]
  n2["CloudFront cache"]
  n3["Next origin fetch"]
  n1 -->|"invalidate paths"| n2
  n2 -->|"next cache miss"| n3
  n0 -->|"retrieve updated object"| n3
```

> Updating the origin does not instantly replace cached objects. Invalidation requests remove selected cached paths before their normal expiry.

# Section Management and governance

## Amazon CloudWatch Metrics


A metric is a time series identified by its namespace, name and dimensions. Select statistics and intervals that answer the operational question.

- Metric is a variable to monitor (CPUUtilization, NetworkIn…)
- Metrics belong to namespaces
- Dimension is an attribute of a metric (instance id, environment, etc…).
- Up to 30 dimensions per metric
- Metrics have timestamps
- Can create CloudWatch dashboards of metrics
- Can create CloudWatch Custom Metrics (for the RAM for example)

## CloudWatch Metric Streams


CloudWatch Metric Streams continuously deliver selected metric updates through Firehose to supported analysis destinations.

- Continually stream CloudWatch metrics to a destination of your choice, with near-real-time delivery and low latency.
  - Amazon Data Firehose (and then its destinations)
  - 3rd party service provider: Datadog, Dynatrace, New Relic, Splunk, Sumo Logic…
- Option to filter metrics to only stream a subset of them


```mermaid
flowchart LR
  accTitle: CloudWatch Metric Streams
  n0["CloudWatch metrics"]
  n1["Metric Stream"]
  n2["Data Firehose"]
  n3["S3 / supported partner"]
  n0 -->|"selected namespaces / metrics"| n1
  n1 -->|"stream updates"| n2
  n2 -->|"configured delivery"| n3
```

> CloudWatch Metric Streams continuously deliver selected metric updates through Firehose to supported analysis destinations.

## CloudWatch Logs


Log groups organize streams and their retention or access settings. Plan collection, storage and querying as separate steps.

- Log stream: instances within application / log files / containers
- Can define log expiration policies (never expire, 1 day to 10 years…)
- CloudWatch Logs can send logs to:
  - Amazon S3 (exports)
  - Kinesis Data Streams
  - Data Firehose
  - AWS Lambda
  - OpenSearch
- Logs are encrypted by default
- Can setup KMS-based encryption with your own keys

## CloudWatch Logs - Sources


Logs reach CloudWatch from agents, SDKs and supported service integrations. The collection path determines what context and permissions are required.

- Elastic Beanstalk: collection of logs from application
- ECS: collection from containers
- AWS Lambda: collection from function logs
- VPC Flow Logs: VPC specific logs
- API Gateway
- CloudTrail based on filter
- Route53: Log DNS queries

## CloudWatch Logs Insights


Logs Insights queries selected log groups and a time range; results help diagnose events rather than mutate the source logs.


```mermaid
flowchart LR
  accTitle: CloudWatch Logs Insights
  n0["Log groups + time range"]
  n1["Insights query"]
  n2["Filtered / aggregated results"]
  n3["Investigation"]
  n0 -->|"scope"| n1
  n1 -->|"execute"| n2
  n2 -->|"interpret"| n3
```

> Logs Insights queries selected log groups and a time range; results help diagnose events rather than mutate the source logs.

## CloudWatch Logs Insights


Logs Insights queries collected log data to find events, patterns and aggregates. Scope the time range and log groups to the investigation.

- Example: find a specific IP inside a log, count occurrences of “ERROR” in your logs…
- Provides a purpose-built query language
  - Automatically discovers fields from AWS services and JSON log events
  - Fetch desired event fields, filter based on conditions, calculate aggregate statistics, sort events, limit number of events…
  - Can save queries and add them to CloudWatch Dashboards
- Can query multiple Log Groups in different AWS accounts
- It’s a query engine, not a real-time engine

## CloudWatch Logs – S3 Export


CreateExportTask exports CloudWatch Logs to S3 asynchronously; it is not a low-latency streaming delivery mechanism.

- Log data can take up to 12 hours to become available for export
- The API call is CreateExportTask
- Not near-real time or real-time… use Logs Subscriptions instead


```mermaid
flowchart LR
  accTitle: CloudWatch Logs – S3 Export
  n0["CloudWatch Logs"]
  n1["Export task"]
  n2["S3 objects"]
  n0 -->|"select range"| n1
  n1 -->|"asynchronous export"| n2
```

> CreateExportTask exports CloudWatch Logs to S3 asynchronously; it is not a low-latency streaming delivery mechanism.

## CloudWatch Logs Subscriptions


Subscription filters route matching log events to supported stream, delivery or function destinations.

- Get a real-time log events from CloudWatch Logs for processing and analysis
- Send to Kinesis Data Streams, Data Firehose, or Lambda
- Subscription Filter – filter which logs are events delivered to your destination


```mermaid
flowchart LR
  accTitle: CloudWatch Logs Subscriptions
  n0["Log group"]
  n1["Subscription filter"]
  n2["Kinesis consumer path"]
  n3["Firehose to S3"]
  n4["Lambda to custom destination"]
  n0 -->|"matching log events"| n1
  n1 -->|"stream"| n2
  n1 -->|"buffered delivery"| n3
  n1 -->|"custom processing"| n4
```

> Subscription filters route matching log events to supported stream, delivery or function destinations.

## CloudWatch Logs Aggregation Multi-Account & Multi Region


A centralized logging design forwards account/Region log groups into a configured aggregation path and archival storage.


```mermaid
flowchart LR
  accTitle: CloudWatch Logs Aggregation Multi-Account & Multi Region
  n0["Account / Region log groups"]
  n1["Subscription filters"]
  n2["Central Kinesis stream"]
  n3["Firehose"]
  n4["S3 archive"]
  n0 -->|"logs"| n1
  n1 -->|"permitted forwarding"| n2
  n2 -->|"delivery input"| n3
  n3 -->|"archive"| n4
```

> A centralized logging design forwards account/Region log groups into a configured aggregation path and archival storage.

## CloudWatch Logs Subscriptions


Cross-account log subscriptions use a destination resource policy and appropriate roles to permit forwarding to the destination stream.

- Cross-Account Subscription – send log events to resources in a different AWS account (KDS, KDF)


```mermaid
flowchart LR
  accTitle: CloudWatch Logs Subscriptions
  n0["Source account log group"]
  n1["Destination policy / role"]
  n2["CloudWatch Logs destination"]
  n3["Kinesis stream"]
  n0 -->|"subscription request"| n1
  n1 -->|"authorized forwarding"| n2
  n2 -->|"stream delivery"| n3
```

> Cross-account log subscriptions use a destination resource policy and appropriate roles to permit forwarding to the destination stream.

## CloudWatch Logs for EC2


The CloudWatch agent collects configured host metrics and logs from EC2 or on-premises hosts.

- By default, no logs from your EC2 machine will go to CloudWatch
- You need to run a CloudWatch agent on EC2 to push the log files you want
- Make sure IAM permissions are correct
- The CloudWatch log agent can be setup on-premises too


```mermaid
flowchart LR
  accTitle: CloudWatch Logs for EC2
  n0["EC2 / on-premises host"]
  n1["CloudWatch agent"]
  n2["CloudWatch metrics"]
  n3["CloudWatch Logs"]
  n0 -->|"configured collection"| n1
  n1 -->|"metrics"| n2
  n1 -->|"log events"| n3
```

> The CloudWatch agent collects configured host metrics and logs from EC2 or on-premises hosts.

## CloudWatch Logs Agent & Unified Agent


The unified agent collects supported host metrics and logs beyond basic instance monitoring. Configure what to collect and where to publish it.

- CloudWatch Logs Agent
  - Old version of the agent
  - Can only send to CloudWatch Logs
- CloudWatch Unified Agent
  - Collect additional system-level metrics such as RAM, processes, etc…
  - Collect logs to send to CloudWatch Logs
  - Centralized configuration using SSM Parameter Store

## CloudWatch Unified Agent – Metrics


Host-level telemetry can reveal memory, disk, network and process behavior that is not captured by every default service metric.

- CPU (active, guest, idle, system, user, steal)
- Disk metrics (free, used, total), Disk IO (writes, reads, bytes, iops)
- RAM (free, inactive, used, total, cached)
- Netstat (number of TCP and UDP connections, net packets, bytes)
- Processes (total, dead, bloqued, idle, running, sleep)
- Swap Space (free, used, used %)
- Reminder: out-of-the box metrics for EC2 – disk, CPU, network (high level)

## CloudWatch Alarms


An alarm evaluates a metric over configured periods and changes state when its conditions are met. Missing-data treatment is part of the rule.

- Various options (sampling, %, max, min, etc…)
- Alarm States:
  - OK
  - INSUFFICIENT_DATA
  - ALARM
- Period:
  - Length of time in seconds to evaluate the metric
  - High resolution custom metrics: 10 sec, 30 sec or multiples of 60 sec

## CloudWatch Alarm Targets


Alarm actions can notify operators or invoke supported recovery and scaling behavior. Match the action to the resource and failure being observed.

- Trigger Auto Scaling Action
- Send notification to SNS (from which you can do pretty much anything)

## CloudWatch Alarms – Composite Alarms


A composite alarm evaluates the states of other alarms, such as CPU and IOPS, before notifying.

- CloudWatch Alarms are on a single metric
- Composite Alarms are monitoring the states of multiple other alarms
- AND and OR conditions
- Helpful to reduce “alarm noise” by creating complex composite alarms


```mermaid
flowchart LR
  accTitle: CloudWatch Alarms – Composite Alarms
  n0["CPU alarm"]
  n1["IOPS alarm"]
  n2["Composite alarm rule"]
  n3["SNS"]
  n0 -->|"alarm state"| n2
  n1 -->|"alarm state"| n2
  n2 -->|"combined condition"| n3
```

> A composite alarm evaluates the states of other alarms, such as CPU and IOPS, before notifying.

## EC2 Instance Recovery


A supported EC2 status-check alarm can request instance recovery and separately send a notification.

- Status Check:
  - Instance status = check the EC2 VM
  - System status = check the underlying hardware
  - Attached EBS status = check attached EBS volumes
- Recovery: Same Private, Public, Elastic IP, metadata, placement group


```mermaid
flowchart LR
  accTitle: EC2 Instance Recovery
  n0["EC2 system status metric"]
  n1["CloudWatch alarm"]
  n2["EC2 recovery action"]
  n3["SNS notification"]
  n0 -->|"failed status condition"| n1
  n1 -->|"configured action"| n2
  n1 -->|"notify"| n3
```

> A supported EC2 status-check alarm can request instance recovery and separately send a notification.

## CloudWatch Alarm: good to know


A metric filter turns matching log patterns into numeric metrics; an alarm evaluates the metric and invokes configured actions.

- Alarms can be created based on CloudWatch Logs Metrics Filters
- To test alarms and notifications, set the alarm state to Alarm using CLI aws cloudwatch set-alarm-state --alarm-name "myalarm" -- state-value ALARM --state-reason "testing purposes"


```mermaid
flowchart LR
  accTitle: CloudWatch Alarm: good to know
  n0["CloudWatch Logs"]
  n1["Metric filter"]
  n2["Custom metric"]
  n3["Alarm"]
  n4["SNS"]
  n0 -->|"pattern"| n1
  n1 -->|"metric value"| n2
  n2 -->|"threshold"| n3
  n3 -->|"notify"| n4
```

> A metric filter turns matching log patterns into numeric metrics; an alarm evaluates the metric and invokes configured actions.

## AWS CloudTrail


CloudTrail records supported AWS API activity for investigation and governance. Event type, collection scope and retention determine the available evidence.

- CloudTrail is enabled by default!
- Get an history of events / API calls made within your AWS Account by:
  - Console
  - SDK
  - CLI
  - AWS Services
- Can put logs from CloudTrail into CloudWatch Logs or S3
- A trail can be applied to All Regions (default) or a single Region.
- If a resource is deleted in AWS, investigate CloudTrail first!

## CloudTrail Diagram


CloudTrail records supported account activity across console, CLI and SDK calls and can deliver trails to S3 and CloudWatch Logs.


```mermaid
flowchart LR
  accTitle: CloudTrail Diagram
  n0["Console / CLI / SDK"]
  n1["AWS API activity"]
  n2["CloudTrail"]
  n3["S3 trail"]
  n4["CloudWatch Logs"]
  n0 -->|"API call"| n1
  n1 -->|"audit event"| n2
  n2 -->|"trail delivery"| n3
  n2 -->|"configured integration"| n4
```

> CloudTrail records supported account activity across console, CLI and SDK calls and can deliver trails to S3 and CloudWatch Logs.

## CloudTrail Events


Management events describe control-plane activity; data events cover supported resource-level operations. Enable the event categories needed for the audit question.

  - Operations that are performed on resources in your AWS account
  - Examples:
    - Configuring security (IAM AttachRolePolicy)
    - Configuring rules for routing data (Amazon EC2 CreateSubnet)
    - Setting up logging (AWS CloudTrail CreateTrail)
  - By default, trails are configured to log management events.
  - Can separate Read Events (that don’t modify resources) from Write Events (that may modify resources)
- Data Events:
  - By default, data events are not logged (because high volume operations)
  - Amazon S3 object-level activity (ex: GetObject, DeleteObject, PutObject): can separate Read and Write Events
  - AWS Lambda function execution activity (the Invoke API)
- CloudTrail Insights Events:
  - See next slide ☺

## CloudTrail Insights


CloudTrail Insights compares supported activity against a baseline and emits unusual-activity events when enabled.

- Enable CloudTrail Insights to detect unusual activity in your account:
  - inaccurate resource provisioning
  - hitting service limits
  - Bursts of AWS IAM actions
  - Gaps in periodic maintenance activity
- CloudTrail Insights analyzes normal management events to create a baseline
- And then continuously analyzes write events to detect unusual patterns
  - Anomalies appear in the CloudTrail console
  - Event is sent to Amazon S3
  - An EventBridge event is generated (for automation needs)


```mermaid
flowchart LR
  accTitle: CloudTrail Insights
  n0["Management activity"]
  n1["Baseline analysis"]
  n2["Insights event"]
  n3["S3 / EventBridge"]
  n0 -->|"observed rate / errors"| n1
  n1 -->|"unusual pattern"| n2
  n2 -->|"configured delivery / response"| n3
```

> CloudTrail Insights compares supported activity against a baseline and emits unusual-activity events when enabled.

## CloudTrail Events Retention


Event history provides a limited management-event window; trails in S3 support longer retention and Athena analysis.

- Events are stored for 90 days in CloudTrail
- To keep events beyond this period, log them to S3 and use Athena


```mermaid
flowchart LR
  accTitle: CloudTrail Events Retention
  n0["CloudTrail activity"]
  n1["Event history<br/>Recent management events"]
  n2["Trail in S3<br/>Chosen retention"]
  n3["Athena"]
  n0 -->|"history view"| n1
  n0 -->|"configured trail"| n2
  n2 -->|"query archived events"| n3
```

> Event history provides a limited management-event window; trails in S3 support longer retention and Athena analysis.

## AWS CloudTrail Lake


CloudTrail Lake stores selected activity in queryable event data stores. The source labels this offering as maintenance-mode material, so availability needs a dated check.

- Managed data lake for CloudTrail events
- Integrates collection, storage, preparation, and optimization for analysis & query
  - Events are converted to ORC format
- Enables querying CloudTrail data with SQL
- Enable it with the “Create event data store” menu choice in the console

## AWS CloudTrail Lake


Event data store settings select which activity is collected and retained. Query access and collection configuration are separate controls.

- Note KMS events add up fast and can make your costs blow up
- Basic event selectors can be selected in the UI
- Finer grained selection may be achieved with advanced event selectors
  - This can help control your ingestion and storage costs
- You can create “channels” to integrate with events outside of AWS
  - Built-in support for Okta, LaunchDarkly, Clumio, and other CloudTrail partners
  - Or custom integrations

## CloudTrail advanced event selector example


Advanced selectors choose event categories, resource types, event names and resource ARN prefixes.

- The example keeps management events and only PutObject/DeleteObject data events under two S3 prefixes.
- A resource ARN prefix must match the intended scope; a broad prefix can include more objects than expected.
- Applying selectors changes trail collection and can affect data-event costs; review in a test configuration first.

```json
[
  {"Name": "Management events", "FieldSelectors": [
    {"Field": "eventCategory", "Equals": ["Management"]}
  ]},
  {"Name": "Selected S3 writes", "FieldSelectors": [
    {"Field": "eventCategory", "Equals": ["Data"]},
    {"Field": "resources.type", "Equals": ["AWS::S3::Object"]},
    {"Field": "eventName", "Equals": ["PutObject", "DeleteObject"]},
    {"Field": "resources.ARN", "StartsWith": [
      "arn:aws:s3:::example-bucket/prefix/",
      "arn:aws:s3:::another-bucket/prefix2/"
    ]}
  ]}
]
```

## Querying CloudTrail Lake


CloudTrail Lake SQL and dashboards analyze stored events. Results reflect the event types, retention and permissions configured for the store.

- Roll your own SQL queries
- Start from sample queries in the CloudTrail Lake Editor
- Remember to bound your queries by eventTime to constrain costs

## AWS Config


Config records resource configuration and evaluates compliance against rules. It answers different questions from application monitoring or an API activity log.

- Helps record configurations and changes over time
- Questions that can be solved by AWS Config:
  - Is there unrestricted SSH access to my security groups?
  - Do my buckets have any public access?
  - How has my ALB configuration changed over time?
- You can receive alerts (SNS notifications) for any changes
- AWS Config is a per-region service
- Can be aggregated across regions and accounts
- Possibility of storing the configuration data into S3 (analyzed by Athena)

## Config Rules


Config rules evaluate recorded resources with managed or custom logic. A noncompliant result identifies a condition; remediation is another action.

- Can make custom config rules (must be defined in AWS Lambda)
  - Ex: evaluate if each EBS disk is of type gp2
  - Ex: evaluate if each EC2 instance is t2.micro
- Rules can be evaluated / triggered:
  - For each config change
  - And / or: at regular time intervals
- AWS Config Rules does not prevent actions from happening (no deny)
- Pricing: no free tier, $0.003 per configuration item recorded per region, $0.001 per config rule evaluation per region

## AWS Config Resource


Config associates resource configuration history with compliance evaluations; CloudTrail supplies a separate API-activity history.

- View compliance of a resource over time
- View configuration of a resource over time
- View CloudTrail API calls of a resource over time


```mermaid
flowchart LR
  accTitle: AWS Config Resource
  n0["Resource configuration"]
  n1["Config timeline"]
  n2["Config rule evaluation"]
  n3["Compliance result"]
  n0 -->|"record changes"| n1
  n0 -->|"evaluate"| n2
  n2 -->|"compliant / noncompliant"| n3
```

> Config associates resource configuration history with compliance evaluations; CloudTrail supplies a separate API-activity history.

## Config Rules – Remediations


A Config remediation can invoke a Systems Manager Automation document; role permissions and retry limits control the corrective action.

- Automate remediation of non-compliant resources using SSM Automation Documents
- Use AWS-Managed Automation Documents or create custom Automation Documents
  - Tip: you can create custom Automation Documents that invokes Lambda function
- You can set Remediation Retries if the resource is still non-compliant after auto-remediation


```mermaid
flowchart LR
  accTitle: Config Rules – Remediations
  n0["Config noncompliance"]
  n1["Remediation configuration"]
  n2["SSM Automation"]
  n3["Corrective API action"]
  n0 -->|"rule result"| n1
  n1 -->|"invoke with role"| n2
  n2 -->|"remediate / bounded retry"| n3
```

> A Config remediation can invoke a Systems Manager Automation document; role permissions and retry limits control the corrective action.

## Config Rules – Notifications


Config changes and compliance events can route through EventBridge; SNS delivery is another configured notification path.

- Use EventBridge to trigger notifications when AWS resources are non-compliant
- Ability to send configuration changes and compliance state notifications to SNS (all events – use SNS Filtering or filter at client-side)


```mermaid
flowchart LR
  accTitle: Config Rules – Notifications
  n0["AWS Config"]
  n1["EventBridge"]
  n2["Lambda / SQS / SNS"]
  n3["Direct SNS notification"]
  n0 -->|"configuration / compliance event"| n1
  n1 -->|"rule target"| n2
  n0 -->|"configured topic"| n3
```

> Config changes and compliance events can route through EventBridge; SNS delivery is another configured notification path.

## CloudWatch vs CloudTrail vs Config


Use CloudWatch for operational telemetry, CloudTrail for API activity and Config for configuration history and compliance. Combine their evidence when investigating a change.

  - Performance monitoring (metrics, CPU, network, etc…) & dashboards
  - Events & Alerting
  - Log Aggregation & Analysis
- CloudTrail
  - Record API calls made within your Account by everyone
  - Can define trails for specific resources
  - Global Service
- Config
  - Record configuration changes
  - Evaluate resources against compliance rules
  - Get timeline of changes and compliance

## For an Elastic Load Balancer


For a load balancer, monitor traffic and errors with CloudWatch, investigate API changes with CloudTrail and evaluate configuration with Config.

  - Monitoring Incoming connections metric
  - Visualize error codes as % over time
  - Make a dashboard to get an idea of your load balancer performance
- Config:
  - Track security group rules for the Load Balancer
  - Track configuration changes for the Load Balancer
  - Ensure an SSL certificate is always assigned to the Load Balancer (compliance)
- CloudTrail:
  - Track who made any changes to the Load Balancer with API calls

## What is CloudFormation


CloudFormation declares infrastructure in templates and manages it as stacks. Review the proposed resources and dependencies before applying a change.

- For example, within a CloudFormation template, you say:
  - I want a security group
  - I want two EC2 instances using this security group
  - I want an S3 bucket
  - I want a load balancer (ELB) in front of these machines
- Then CloudFormation creates those for you, in the right order, with the exact configuration that you specify

## Benefits of AWS CloudFormation (1/2)


Infrastructure templates make resource definitions repeatable and reviewable. Stack metadata also helps associate deployed resources with an application and its costs.

  - No resources are manually created, which is excellent for control
  - Changes to the infrastructure are reviewed through code
- Cost
  - Each resources within the stack is tagged with an identifier so you can easily see how much a stack costs you
  - You can estimate the costs of your resources using the CloudFormation template
  - Savings strategy: In Dev, you could automation deletion of templates at 5 PM and recreated at 8 AM, safely

## Benefits of AWS CloudFormation (2/2)


Reusable templates and change sets support consistent deployment. Automation still requires deliberate permissions, dependency handling and review of destructive changes.

  - Ability to destroy and re-create an infrastructure on the cloud on the fly
  - Automated generation of Diagram for your templates!
  - Declarative programming (no need to figure out ordering and orchestration)
- Don’t re-invent the wheel
  - Leverage existing templates on the web!
  - Leverage the documentation
- Supports (almost) all AWS resources:
  - Everything we’ll see in this course is supported
  - You can use “custom resources” for resources that are not supported

## CloudFormation + Infrastructure Composer


Infrastructure Composer visualizes CloudFormation resources and dependencies; the template remains the deployment source.

- Example: WordPress CloudFormation Stack
- We can see all the resources
- We can see the relations between the components


```mermaid
flowchart LR
  accTitle: CloudFormation + Infrastructure Composer
  n0["CloudFormation template"]
  n1["Composer resource graph"]
  n2["Networking / compute / database"]
  n3["CloudFormation stack"]
  n0 -->|"visual representation"| n1
  n1 -->|"resource dependencies"| n2
  n0 -->|"deploy"| n3
```

> Infrastructure Composer visualizes CloudFormation resources and dependencies; the template remains the deployment source.

## SSM Parameter Store


An application retrieves authorized Parameter Store values; SecureString access also depends on KMS decrypt permissions.

- Secure storage for configuration and secrets
- Optional Seamless Encryption using KMS
- Serverless, scalable, durable, easy SDK
- Version tracking of configurations / secrets
- Security through IAM
- Notifications with Amazon EventBridge
- Integration with CloudFormation


```mermaid
flowchart LR
  accTitle: SSM Parameter Store
  n0["Application role"]
  n1["Parameter Store"]
  n2["KMS key"]
  n3["Decrypted SecureString"]
  n0 -->|"GetParameter with decryption"| n1
  n1 -->|"Decrypt authorization"| n2
  n1 -->|"return permitted value"| n3
```

> An application retrieves authorized Parameter Store values; SecureString access also depends on KMS decrypt permissions.

## SSM Parameter Store Hierarchy


Hierarchical parameter names support environment/application organization; recursive path access must be scoped carefully.

- /my-department/
  - my-app/
    - dev/
      - db-url
      - db-password
    - prod/
  - other-app/
- /other-department/
- /aws/reference/secretsmanager/secret_ID_in_Secrets_Manager
- /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2 (public)


```mermaid
flowchart LR
  accTitle: SSM Parameter Store Hierarchy
  n0["Parameter root"]
  n1["/dev/app"]
  n2["/prod/app"]
  n3["Environment-specific values"]
  n0 ---|"development path"| n1
  n0 ---|"production path"| n2
  n1 ---|"dev values"| n3
  n2 ---|"prod values"| n3
```

> Hierarchical parameter names support environment/application organization; recursive path access must be scoped carefully.

## Parameter Store tiers


Advanced parameters add policies and larger values, with charges; choose the tier for required capabilities.

- Course quota snapshot per account/Region: Standard 10,000 parameters and 4 KB values; Advanced 100,000 and 8 KB.
- Only Advanced supports parameter policies in the comparison.
- Storage and high-throughput/API charges are separate considerations; verify current pricing rather than memorizing the screenshot's dollar amount.

| Capability | Standard (dated snapshot) | Advanced (dated snapshot) |
| --- | --- | --- |
| Parameter count | 10,000 | 100,000 |
| Value size | 4 KB | 8 KB |
| Parameter policies | No | Yes |
| Billing | Check throughput charges | Storage plus applicable throughput charges |

## Parameters Policies (for advanced parameters)


Advanced-parameter policies can expire a value or notify about expiry and lack of change; notifications do not automatically rotate secrets.

- Allow to assign a TTL to a parameter (expiration date) to force updating or deleting sensitive data such as passwords
- Can assign multiple policies at a time


```mermaid
flowchart LR
  accTitle: Parameters Policies (for advanced parameters)
  n0["Advanced parameter"]
  n1["Expiration policy"]
  n2["Expiration notification"]
  n3["No-change notification"]
  n4["EventBridge"]
  n0 -->|"delete at timestamp"| n1
  n0 -->|"warn before / after expiry"| n2
  n0 -->|"warn when unchanged"| n3
  n2 -->|"policy event"| n4
  n3 -->|"policy event"| n4
```

> Advanced-parameter policies can expire a value or notify about expiry and lack of change; notifications do not automatically rotate secrets.

## Well Architected Framework General Guiding Principles


Well-Architected reviews start from operational requirements, favor measured decisions and revisit assumptions as the workload changes.

- Stop guessing your capacity needs
- Test systems at production scale
- Automate to make architectural experimentation easier
- Allow for evolutionary architectures
  - Design based on changing requirements
- Drive architectures using data
- Improve through game days
  - Simulate applications for flash sale days

## Well-Architected: six pillars and explicit tradeoffs


Review operational excellence, security, reliability, performance efficiency, cost optimization and sustainability together.

- The pillars interact; architecture decisions can require tradeoffs between them.
- Use the framework to document benefits and evaluate actual tradeoffs.

**Current reference (checked 2026-10-13):** [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html).

## AWS Well-Architected Tool


The Well-Architected Tool records workload reviews against the framework's pillars and tracks improvement items. A review is an ongoing engineering activity.

- How does it work?
  - Select your workload and answer questions
  - Review your answers against the 6 pillars
  - Obtain advice: get videos and documentations, generate a report, see the results in a dashboard
- Let’s have a look: https://console.aws.amazon.com/wellarchitected

## Amazon Managed Grafana


Managed Grafana provides dashboards and alerting over supported observability sources. It visualizes collected telemetry rather than collecting every signal itself.

- Integrated with IAM Identity Center (formerly AWS SSO) and/or SAML for user management and permissions
- Compatible with Grafana plugins and alerts
- Fully managed, scales automatically
- Encrypted at rest and in transit, can use KMS.

## Amazon Managed Grafana


Each Grafana data source needs its own supported connection and authorization. Combine sources when they help explain one workload's behavior.

  - CloudWatch, OpenSearch, Timestream, Athena, Redshift, X-Ray
  - Amazon Managed Service for Prometheus (AMP)
- Also with everything else Grafana integrates with
  - GitHub, Google, Azure, MySQL, Redis, JSON, OpenTelemetry, much more.

# Section Machine learning

## Amazon SageMaker AI


Training learns a model from labeled historical examples; inference applies the model to new feature values.

- Fully managed service for developers / data scientists to build ML models
- Typically, difficult to do all the processes in one place + provision servers
- Machine learning process (simplified): predicting your exam score


```mermaid
flowchart LR
  accTitle: Amazon SageMaker AI
  n0["Labeled historical data"]
  n1["Training / tuning"]
  n2["Model"]
  n3["New example"]
  n4["Prediction"]
  n0 -->|"learn"| n1
  n1 -->|"model artifact"| n2
  n2 -->|"inference"| n4
  n3 -->|"new features"| n4
```

> Training learns a model from labeled historical examples; inference applies the model to new feature values.

## SageMaker Feature Store


A feature is an input used by a model. Feature Store organizes reusable feature values for training and supported serving access patterns.

  - Like, you might predict someone’s political party based on “features” such as their address, income, age, etc.
- Machine learning models require fast, secure access to feature data for training.
- It’s also a challenge to keep it organized and share features across different models.

## Where the features come from is up to you.


A feature store organizes reusable features between data preparation and training/inference consumers.


```mermaid
flowchart LR
  accTitle: Where the features come from is up to you.
  n0["Batch / streaming sources"]
  n1["Feature preparation"]
  n2["Feature Store"]
  n3["Training"]
  n4["Online inference"]
  n0 -->|"raw observations"| n1
  n1 -->|"write feature records"| n2
  n2 -->|"historical features"| n3
  n2 -->|"low-latency features"| n4
```

> A feature store organizes reusable features between data preparation and training/inference consumers.

## How SageMaker Feature Store Organizes Your Data


Feature groups define features and records identified by a record identifier and event time.


```mermaid
flowchart LR
  accTitle: How SageMaker Feature Store Organizes Your Data
  n0["Feature Store"]
  n1["Feature group"]
  n2["Record identifier"]
  n3["Event time"]
  n4["Feature values"]
  n0 ---|"group"| n1
  n1 ---|"record key"| n2
  n1 ---|"version / time"| n3
  n1 ---|"named features"| n4
```

> Feature groups define features and records identified by a record identifier and event time.

## Data Ingestion (streaming or batch)


Feature Store ingestion can populate an online store and an offline S3 store; their access patterns serve different workloads.


```mermaid
flowchart TB
  accTitle: Data Ingestion (streaming or batch)
  n0["Streaming / batch ingestion"]
  n1["Feature Store"]
  n2["Online store"]
  n3["Offline S3 store"]
  n4["Inference"]
  n5["Training / Athena"]
  n0 -->|"PutRecord / supported ingestion"| n1
  n1 -->|"latest feature access"| n2
  n1 -->|"historical persistence"| n3
  n2 -->|"low-latency read"| n4
  n3 -->|"batch query"| n5
```

> Feature Store ingestion can populate an online store and an offline S3 store; their access patterns serve different workloads.

## SageMaker Feature Store Security


Feature data needs authorized access, encrypted storage and protected network transport, with controls matched to its online and offline paths.

- Works with KMS customer master keys
- Fine-grained access control with IAM
- May also be secured with AWS PrivateLink

## SageMaker ML Lineage Tracking


ML lineage connects input artifacts, processing actions, model artifacts and deployments for traceability.

- Creates & stores your ML workflow (MLOps)
- Keep a running history of your models
- Tracking for auditing and compliance
- Automatically or manually-created tracking entities
- Integrates with AWS Resource Access Manager for cross-account lineage
- Sample SageMaker-created lineage graph:


```mermaid
flowchart LR
  accTitle: SageMaker ML Lineage Tracking
  n0["Dataset artifact"]
  n1["Processing / training action"]
  n2["Model artifact"]
  n3["Deployment action"]
  n4["Endpoint"]
  n0 -->|"input"| n1
  n1 -->|"output"| n2
  n2 -->|"deploy"| n3
  n3 -->|"serving artifact"| n4
```

> ML lineage connects input artifacts, processing actions, model artifacts and deployments for traceability.

## Lineage Tracking Entities


Lineage entities describe artifacts, actions and execution components in an ML workflow. Relationships connect the data, processing and model outputs.

- Trial (a model composed of trial components)
- Experiment (a group of Trials for a given use case)
- Context (logical grouping of entities)
- Action (workflow step, model deployment)
- Artifact (Object or data, such as an S3 bucket or an image in ECR)
- Association (connects entities together) – has optional AssociationType:
  - ContributedTo
  - AssociatedWith
  - DerivedFrom
  - Produced
  - SameAs

## Querying Lineage Entities


Lineage queries traverse recorded relationships to investigate dependencies and provenance. The available result depends on which entities and associations were captured.

  - Part of the Amazon SageMaker SDK for Python
- Do things like find all models / endpoints / etc. that use a given artifact
- Produce a visualization
  - Requires external Visualizer helper class

## Ground Truth: availability and labeling concept


Ground Truth is closed to new customers; existing customers can continue using it.

- AWS announced the maintenance availability change for July 30, 2026. That differs from a complete service shutdown.
- Ground Truth Plus is a separate feature that reached end of support June 30, 2026.
- Keep the human-labeling and active-learning concepts in study notes; check the current official exam guide before inferring exam scope.

**Current reference (checked 2026-10-13):** [AWS service availability update](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-service-availability/); [Ground Truth documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/sms.html).

## What is Ground Truth?


Human labeling creates training targets when the raw dataset does not contain them. The labeling workflow defines tasks and checks the returned annotations.

- Availability: see the Ground Truth status note above.
- Example: training an image classification model. Somebody needs to tag a bunch of images with what they are images of before training a neural network
- Ground Truth manages humans who will label your data for training purposes

## But it’s more than that


Ground Truth's active-learning pattern sends uncertain examples to human labeling and uses labeled results to improve the model; availability is a separate service-status question.

- Availability: see the Ground Truth status note above.
- Ground Truth creates its own model as images are labeled by people
- As this model learns, only images the model isn’t sure about are sent to human labelers
- This can reduce the cost of labeling jobs by 70%


```mermaid
flowchart LR
  accTitle: But it’s more than that
  n0["Unlabeled data"]
  n1["Model / confidence selection"]
  n2["Human labeling"]
  n3["Labeled dataset"]
  n4["Updated model"]
  n0 -->|"score examples"| n1
  n1 -->|"uncertain examples"| n2
  n2 -->|"labels"| n3
  n3 -->|"train"| n4
  n4 -->|"next iteration"| n1
```

> Ground Truth's active-learning pattern sends uncertain examples to human labeling and uses labeled results to improve the model; availability is a separate service-status question.

## Who are these human labelers?


Labeling workers may come from managed public, private or vendor workforces in the historical workflow. Workforce selection affects privacy, quality and cost.

- Availability: see the Ground Truth status note above.
- Your own internal team
- Professional labeling companies

## Ground Truth Plus


Ground Truth Plus was a managed labeling arrangement distinct from Ground Truth. Its separate end-of-support status matters when interpreting this historical workflow.

- Availability: see the Ground Truth status note above.
- “Our team of AWS Experts” manages the workflow and team of labelers
  - You fill out an intake form
  - They contact you and discuss pricing
- You track progress via the Ground Truth Plus Project Portal
- Get labeled data from S3 when done

## Other ways to generate training labels


Existing models can help generate candidate labels, with humans reviewing uncertain or unsuitable outputs. Automated labels still require quality assessment.

- Availability: see the Ground Truth status note above.
  - AWS service for image recognition
  - Automatically classify images
- Comprehend
  - AWS service for text analysis and topic modeling
  - Automatically classify text by topics, sentiment
- Any pre-trained model or unsupervised technique that may be helpful

## Amazon Mechanical Turk


Mechanical Turk matches requesters with workers for small human tasks. Treat task design and result validation as part of the labeling process.

- Availability: see the Ground Truth status note above.
- Distributed virtual workforce
- Example:
  - You have a dataset of 10,000,000 images and you want to labels these images
  - You distribute the task on Mechanical Turk and humans will tag those images
  - You set the reward per image (for example $0.10 per image)
- Use cases: image classification, data collection, business processing
- Integrates with Amazon A2I, SageMaker Ground Truth…

## Amazon Mechanical Turk


A labeling job defines its dataset, labeling instructions and workforce, then collects annotations for review.

- Availability: see the Ground Truth status note above.


```mermaid
flowchart LR
  accTitle: Amazon Mechanical Turk
  n0["Input dataset"]
  n1["Labeling instructions + workforce"]
  n2["Annotation tasks"]
  n3["Reviewed labels"]
  n0 -->|"examples"| n2
  n1 -->|"task definition"| n2
  n2 -->|"results"| n3
```

> A labeling job defines its dataset, labeling instructions and workforce, then collects annotations for review.

## SageMaker Canvas


Canvas offers a visual path for supported ML preparation and prediction tasks. Validate the dataset and model outcome even when little code is required.

- Availability: see the Ground Truth status note above.
- Upload csv data (csv only for now), select a column to predict, build it, and make predictions
- Can also join datasets
- Classification or regression
- Automatic data cleaning
  - Missing values
  - Outliers
  - Duplicates
- Share models & datasets with SageMaker Studio
- Also has generative AI support via Bedrock or JumpStart foundation models
  - Many are fine-tunable within Canvas

## SageMaker Data Wrangler


Data Wrangler prepares ML datasets through visual analysis and transformations. The prepared flow still needs export, execution and appropriate data permissions.

- Availability: see the Ground Truth status note above.
- Import data
- Visualize data
- Transform data (300+ transformations to choose from)
  - Or integrate your own custom xforms with pandas, PySpark, PySpark SQL
- “Quick Model” to train your model with your data and measure its results

## Data Wrangler sources


Data Wrangler imports supported sources, explores and transforms data, then exports a reproducible preparation workflow.


```mermaid
flowchart LR
  accTitle: Data Wrangler sources
  n0["S3 / Athena / Redshift / other source"]
  n1["Data Wrangler flow"]
  n2["Processing / Pipeline"]
  n3["Feature Store / S3 output"]
  n0 -->|"import"| n1
  n1 -->|"export preparation"| n2
  n2 -->|"prepared features"| n3
```

> Data Wrangler imports supported sources, explores and transforms data, then exports a reproducible preparation workflow.

## Data Wrangler: Import Data


The import screen chooses a source and dataset before previewing records.


```mermaid
flowchart LR
  accTitle: Data Wrangler: Import Data
  n0["Choose source"]
  n1["Select dataset"]
  n2["Preview"]
  n3["Import to flow"]
  n0 -->|"connect"| n1
  n1 -->|"inspect"| n2
  n2 -->|"confirm schema"| n3
```

> The import screen chooses a source and dataset before previewing records.

## Data Wrangler: Preview Data


Preview helps validate types, missing values and sample records before adding transformations.


```mermaid
flowchart LR
  accTitle: Data Wrangler: Preview Data
  n0["Imported dataset"]
  n1["Schema / sample preview"]
  n2["Quality observations"]
  n3["Preparation decisions"]
  n0 -->|"inspect"| n1
  n1 -->|"identify issues"| n2
  n2 -->|"choose transformations"| n3
```

> Preview helps validate types, missing values and sample records before adding transformations.

## Data Wrangler: Visualize Data


Visual analysis helps spot distributions and relationships; a sample plot is evidence to investigate rather than proof of causality.


```mermaid
flowchart LR
  accTitle: Data Wrangler: Visualize Data
  n0["Dataset"]
  n1["Visualization"]
  n2["Distribution / relationship"]
  n3["Investigate features"]
  n0 -->|"plot"| n1
  n1 -->|"observe"| n2
  n2 -->|"evaluate"| n3
```

> Visual analysis helps spot distributions and relationships; a sample plot is evidence to investigate rather than proof of causality.

## Data Wrangler: Transform Data


Transformations form a reproducible sequence rather than unrecorded edits to a spreadsheet.


```mermaid
flowchart LR
  accTitle: Data Wrangler: Transform Data
  n0["Input"]
  n1["Clean / encode / derive"]
  n2["Preview transformed data"]
  n3["Saved flow"]
  n0 -->|"transform"| n1
  n1 -->|"validate"| n2
  n2 -->|"retain recipe"| n3
```

> Transformations form a reproducible sequence rather than unrecorded edits to a spreadsheet.

## Data Wrangler: Quick Model


A quick model provides exploratory feature feedback, not a production-model quality guarantee.


```mermaid
flowchart LR
  accTitle: Data Wrangler: Quick Model
  n0["Prepared sample"]
  n1["Quick model"]
  n2["Feature / prediction feedback"]
  n3["Refine preparation"]
  n0 -->|"exploratory training"| n1
  n1 -->|"diagnostics"| n2
  n2 -->|"iterate"| n3
```

> A quick model provides exploratory feature feedback, not a production-model quality guarantee.

## Data Wrangler: Export Data Flow


Export a validated flow to a supported job or pipeline destination for repeatable execution.


```mermaid
flowchart LR
  accTitle: Data Wrangler: Export Data Flow
  n0["Validated flow"]
  n1["Export configuration"]
  n2["Processing job / pipeline"]
  n3["Prepared dataset"]
  n0 -->|"choose destination"| n1
  n1 -->|"run"| n2
  n2 -->|"output"| n3
```

> Export a validated flow to a supported job or pipeline destination for repeatable execution.

## Data Wrangler Troubleshooting


Troubleshoot preparation work from permissions, connectivity, supported formats and resource capacity before changing transformation logic.

- Make sure permissions on your data sources allow Data Wrangler access
  - Add AmazonSageMakerFullAccess policy
- EC2 instance limit
  - If you get “The following instance type is not available…” errors
  - May need to request a quota increase
  - Service Quotas / Amazon SageMaker / Studio KernelGateway Apps running on ml.m5.4xlarge instance

## Foundation Models


A foundation model is pretrained on broad data and can be adapted or prompted for new tasks. The adaptation method determines what changes inside the model.

- GPT-n (OpenAI)
- Claude (Anthropic)
- DALL-E (OpenAI, Microsoft)
- LLaMa (Meta)
- DeepSeek
- Nova

## AWS Foundation Models (Base Models)


The foundation-model names in this course are examples from its date; model access, capability and lifecycle vary.

- Jurassic-2 (AI21labs)
  - Multilingual LLMs for text generation
  - Spanish, French, German, Portuguese, Italian, Dutch
- Claude (Anthropic)
  - LLM’s for conversations
  - Question answering
  - Workflow automation
- Stable Diffusion (stability.ai)
  - Image, art, logo, design generation
- Llama (Meta)
  - LLM
- Amazon Titan
  - Text summarization
  - Text generation
  - Q&A
  - Embeddings
    - Personalization
    - Search
- Amazon Nova Pro (LLM portfolio of models)
- Amazon Nova Reels
  - Video

## Amazon Bedrock


Bedrock exposes supported foundation models through managed APIs. Model access, inference configuration and application authorization remain distinct concerns.

  - Invoke chat, text, or image models
  - Pre-built, your own fine-tuned models, or your own models
  - Third-party models bill you through AWS via their own pricing
  - Support for RAG (Retrieval-Augmented Generation… we’ll get there)
  - Support for LLM agents
- Serverless
- Can integrate with SageMaker Canvas

## The Bedrock API Endpoints


Bedrock uses different endpoint families for management, inference and agent-related operations. Select the API for the operation rather than relying on one generic endpoint.

- bedrock-runtime: Perform inference (execute prompts, generate embeddings) against these models
  - Converse, ConverseStream, InvokeModel, InvokeModelWithResponseStream
- bedrock-agent: Manage, deploy, train LLM agents and knowledge bases
- bedrock-agent-runtime: Perform inference against agents and knowledge bases
  - InvokeAgent, Retrieve, RetrieveAndGenerate

## Bedrock authorization


Use an authorized IAM principal, including a workload role with temporary credentials; an IAM user is not mandatory.

- Grant the model and API permissions required by the application. Broad AWS-managed policies are examples, not the least-privilege end state.
- Avoid root credentials for routine model invocation and development.

**Current reference (checked 2026-10-13):** [Bedrock identity and access management](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html).

## Amazon Bedrock: Model Access


Model access depends on the model/provider, account permissions and current Bedrock access workflow.

- Amazon is phasing out the need to request access to specific models
- Be sure to check pricing
  - aws.amazon.com/bedrock/pricing

## Let’s Play


Bedrock playgrounds let you explore supported model input/output and inference settings before building an application.

- Bedrock provides “playground” environments
  - Chat
  - Text
  - Images
- Must have model access first (you probably do)
- Also useful for evaluating your own custom or imported models
- Let’s go hands-on and get a feel for it.

## Fine-tuning


Fine-tuning adjusts an existing model using examples for a specific task or behavior. It differs from supplying reference information at inference time.

- Additional training using your own data – potentially lots of it
  - Eliminates need to build up a big conversation to get the results you want (“prompt engineering” / “prompt design”)
  - Saves on tokens in the long run
- Your fine-tuned model can be used like any other
- You can fine-tune a fine-tuned model, making it “smarter” over time
- Applications:
  - Chatbot with a certain personality or style, or with a certain objective (i.e., customer support, writing ads)
  - Training with data more recent than what the LLM had
  - Training with proprietary data (i.e., your past emails or messages, customer support transcripts)

## Fine-tuning in Bedrock: “Custom Models”


Custom-model support varies by provider and model. Choose supported training inputs and deployment options instead of assuming every catalog model can be tuned.

- Text models: provide labeled training pairs of prompts and completions
  - Can be questions and answers
  - Upload training data into S3
- Image models: provide pairs of image S3 paths to image descriptions (prompts)
  - Used for text-to-image or image-to- embedding models
- Use a VPC and PrivateLink for sensitive training data
- This can get expensive
- Your resulting “custom model” may then be used like any other.

## “Continued Pre-Training”


Continued pretraining adapts a model using additional unlabeled material. It has different data and objective requirements from supervised fine-tuning.

- Just feed it text to familiarize the model with
  - Your own business documents
  - Whatever
- Basically including extra data into the model itself
  - So you don’t need to include it in the prompts

## Low-Rank Adaptation (LoRA)


LoRA freezes base-model weights while training smaller low-rank adapter parameters that modify the output.

- We don’t update the entire model, just slap on some “low-rank matrices” to the attention weights (usually), and train those.
  - “Low-rank” refers to the complexity of the underlying matrices in the model, but you don’t need that level of understanding for this exam.
- At inference, these fine-tuned weights get added into the base model
- Base model remains unchanged
- Very efficient for storage, training, and inference
- This is different from an “adapter layer” added to the top of a model


```mermaid
flowchart LR
  accTitle: Low-Rank Adaptation (LoRA)
  n0["Input"]
  n1["Frozen base weights"]
  n2["Trainable low-rank adapter"]
  n3["Combined output"]
  n0 -->|"base path"| n1
  n0 -->|"adapter path"| n2
  n1 -->|"base activation"| n3
  n2 -->|"learned adjustment"| n3
```

> LoRA freezes base-model weights while training smaller low-rank adapter parameters that modify the output.

## Retrieval Augmented Generation (RAG)


RAG retrieves external evidence and places it in the prompt before generation; it does not retrain the model for every question.

- Like an open-book exam for LLM’s
- You query some external database for the answers instead of relying on the LLM
- Then, work those answers into the prompt for the LLM to work with
  - Or, use tools and functions to incorporate the search into the LLM in a slightly more principled way


```mermaid
flowchart LR
  accTitle: Retrieval Augmented Generation (RAG)
  n0["Question"]
  n1["Retriever + knowledge source"]
  n2["Evidence + question prompt"]
  n3["Language model"]
  n4["Grounded response"]
  n0 -->|"search"| n1
  n1 -->|"retrieved context"| n2
  n0 -->|"user question"| n2
  n2 -->|"augmented prompt"| n3
  n3 -->|"generate with evidence"| n4
```

> RAG retrieves external evidence and places it in the prompt before generation; it does not retrain the model for every question.

## RAG: Pros and Cons


RAG supplies retrieved reference material with a prompt, making knowledge easier to update without retraining the model. Retrieval quality becomes a critical dependency.

- Updating info is just a matter of updating a database
- Can leverage “semantic search” via vector stores
- Can prevent “hallucinations” when you ask the model about something it wasn’t trained on
- If your boss wants “AI search”, this is an easy way to deliver it.
- Technically you aren’t “training” a model with this data
                        - You have made the world’s most overcomplicated search engine
                        - Very sensitive to the prompt templates you use to incorporate your data
                        - Non-deterministic
                        - It can still hallucinate
                        - Very sensitive to the relevancy of the information you retrieve

## RAG: Example Approach (winning at Jeopardy!)


The research illustration encodes a question, retrieves relevant documents and conditions generation on that evidence.


```mermaid
flowchart LR
  accTitle: RAG: Example Approach (winning at Jeopardy!)
  n0["Question encoder"]
  n1["Document index"]
  n2["Retrieved passages"]
  n3["Generator"]
  n4["Answer"]
  n0 -->|"query representation"| n1
  n1 -->|"top matches"| n2
  n2 -->|"condition generation"| n3
  n3 -->|"answer"| n4
```

> The research illustration encodes a question, retrieves relevant documents and conditions generation on that evidence.

## Choosing a Database (Knowledge Base Data Store) for RAG


Select a retrieval store from the required query pattern, data model and filtering needs. A vector store is one option rather than the only kind of knowledge source.

- Graph database (i.e., Neo4j) for retrieving product recommendations or relationships between items
- OpenSearch or something for traditional text search (TF/IDF)
- But almost every example you find of RAG uses a Vector database
- Note Elasticsearch / OpenSearch can function as a vector DB

## Embeddings


Embeddings place semantically similar content near each other; the slide's clusters are conceptual, not measured coordinates.

- An embedding is just a big vector associated with your data
- Think of it as a point in multi- dimensional space (typically 100’s or thousands of dimensions)
- Embeddings are computed such that items that are similar to each other are close to each other in that space
- We can use embedding base models (like Titan) to compute them en masse


```mermaid
flowchart LR
  accTitle: Embeddings
  n0["Related terms A"]
  n1["Embedding model"]
  n2["Semantic neighborhood A"]
  n3["Unrelated terms B"]
  n4["Semantic neighborhood B"]
  n0 -->|"encode"| n1
  n3 -->|"encode"| n1
  n1 -->|"similar vectors"| n2
  n1 -->|"different neighborhood"| n4
```

> Embeddings place semantically similar content near each other; the slide's clusters are conceptual, not measured coordinates.

## Embeddings are vectors, so store them in…


Vector search compares a query embedding with stored embeddings using the configured distance/similarity metric.

- …a vector database!
- It just stores your data alongside their computed embedding vectors
- Leverages the embeddings you might already have for ML
- Retrieval looks like this:
  - Compute an embedding vector for the thing you want to search for
  - Query the vector database for the top items close to that vector
  - You get back the top-N most similar things (K-Nearest Neighbor)
  - “Vector search”
- Examples of vector databases
  - Coercing existing databases to do vector search
    - OpenSearch / Elasticsearch, SQL, Neptune, Redis, MongoDB, Cassandra
  - Purpose-built vector DB’s
    - Pinecone, Weaviate (commercial)
    - Chroma, Marqo, Vespa, Qdrant, LanceDB, Milvus, vectordb (open source)


```mermaid
flowchart LR
  accTitle: Embeddings are vectors, so store them in…
  n0["Query"]
  n1["Embedding"]
  n2["Vector index"]
  n3["Nearest matches"]
  n0 -->|"encode"| n1
  n1 -->|"similarity search"| n2
  n2 -->|"top-k results"| n3
```

> Vector search compares a query embedding with stored embeddings using the configured distance/similarity metric.

## RAG Example with a Vector Database: Making Data from Star Trek, by Cheating.


A retrieval-assisted persona example selects relevant source passages, then combines them with the question and instructions for generation.


```mermaid
flowchart LR
  accTitle: RAG Example with a Vector Database: Making Data from Star Trek, by Cheating.
  n0["Question"]
  n1["Embedding model"]
  n2["Source-text vector store"]
  n3["Retrieved passages + prompt"]
  n4["LLM response"]
  n0 -->|"encode"| n1
  n1 -->|"nearest-neighbor query"| n2
  n2 -->|"relevant lines"| n3
  n0 -->|"question"| n3
  n3 -->|"generate"| n4
```

> A retrieval-assisted persona example selects relevant source passages, then combines them with the question and instructions for generation.

## RAG in Bedrock: Knowledge Bases


A knowledge-base ingestion pipeline parses content, chunks it, embeds chunks and writes a searchable vector index.

- You can upload your own documents or structured data (via S3, maybe with a JSON schema) into Bedrock “Knowledge Bases”
  - Other sources: web crawler, Confluence, Salesforce, SharePoint
- Must use an embedding model
  - For which you must have obtained model access
  - Currently Cohere or Amazon Titan
  - You can control the vector dimension
- And a vector store of some sort
  - For development, a serverless OpenSearch instance may be used by default
  - MemoryDB now has vector capabilties
  - Or Aurora, MongoDB Atlas, Pinecone, Redis Enterprise Cloud
  - You can control the “chunking” of your data
    - How many tokens are represented by each vector


```mermaid
flowchart LR
  accTitle: RAG in Bedrock: Knowledge Bases
  n0["Source documents"]
  n1["Parse / chunk"]
  n2["Embedding model"]
  n3["Vector store"]
  n4["Knowledge base retrieval"]
  n0 -->|"ingest"| n1
  n1 -->|"text chunks"| n2
  n2 -->|"vectors + metadata"| n3
  n3 -->|"searchable corpus"| n4
```

> A knowledge-base ingestion pipeline parses content, chunks it, embeds chunks and writes a searchable vector index.

## Using Knowledge Bases


A Bedrock RAG application retrieves relevant OpenSearch content and supplies that context with the question to a model.

- “Chat with your document”
  - Basically, automatic RAG
- Integrate it into an application directly
- Incorporate it into an agent
  - “Agentic RAG”


```mermaid
flowchart LR
  accTitle: Using Knowledge Bases
  n0["User query"]
  n1["OpenSearch retrieval"]
  n2["Context + query"]
  n3["Bedrock model"]
  n4["Response"]
  n0 -->|"search"| n1
  n1 -->|"evidence"| n2
  n0 -->|"question"| n2
  n2 -->|"prompt"| n3
  n3 -->|"generate"| n4
```

> A Bedrock RAG application retrieves relevant OpenSearch content and supplies that context with the question to a model.

## Let’s Make a Knowledge Base


A knowledge-base workflow ingests documents, prepares chunks and embeddings, and stores them for later retrieval. Each stage influences what context reaches the model.

- Hands-on; let’s use the text of a book I wrote.

## Breaking up the R in RAG


RAG quality depends on indexing, query preparation, retrieval, post-retrieval processing and grounded generation.

- Pre-Retrieval
  - Indexing
    - Granularity / chunking
    - Data extraction
  - Query Rewriting
- Retrieval
- Post-Retrieval


```mermaid
flowchart TB
  accTitle: Breaking up the R in RAG
  n0["Prepare / index"]
  n1["Prepare query"]
  n2["Retrieve"]
  n3["Rerank / filter"]
  n4["Augment prompt"]
  n5["Generate / evaluate"]
  n0 -->|"searchable evidence"| n2
  n1 -->|"retrieval query"| n2
  n2 -->|"candidates"| n3
  n3 -->|"selected context"| n4
  n4 -->|"generation"| n5
```

> RAG quality depends on indexing, query preparation, retrieval, post-retrieval processing and grounded generation.

## Pre-Retrieval


Chunk size trades local precision against sufficient context; splitting a text too finely can lose its meaning.

- What should you be storing in your database?
- Data granularity matters
- Example: Every set of lines Data had, or individual sentences? Or blocks of text of a fixed length? Why just Data’s lines?
  - Or maybe summaries of those lines?
  - You can use an LLM for this too…
- The process of splitting up your data prior to storage is referred to as CHUNKING.


```mermaid
flowchart LR
  accTitle: Pre-Retrieval
  n0["Document"]
  n1["Very small chunks"]
  n2["Larger contextual chunks"]
  n3["Retrieval tradeoff"]
  n0 -->|"fine granularity"| n1
  n0 -->|"coarse granularity"| n2
  n1 -->|"precision / context loss"| n3
  n2 -->|"context / extra noise"| n3
```

> Chunk size trades local precision against sufficient context; splitting a text too finely can lose its meaning.

## More on Chunking


Semantic chunking groups related sentences at meaningful boundaries rather than arbitrary character positions.

- Make sure we don’t end up feeding more info into the LLM than it can handle
- Stay within the limit of how many tokens can be used within a context
  - This limit is becoming larger and larger though.
- Semantic Chunking
  - Ensure each chunk contains semantically independent information
  - Embedding-based (LlamaIndex / Langchain)
  - Model-based (BERT)
  - LLM-based (Basically tell it to do semantic chunking)


```mermaid
flowchart LR
  accTitle: More on Chunking
  n0["Sentences"]
  n1["Semantic boundary detection"]
  n2["Self-contained chunks"]
  n3["Embeddings"]
  n0 -->|"compare meaning"| n1
  n1 -->|"group related text"| n2
  n2 -->|"index"| n3
```

> Semantic chunking groups related sentences at meaningful boundaries rather than arbitrary character positions.

## Chunking with Bedrock: Standard Chunking


Fixed-size chunks may overlap to retain boundary context; no chunking treats a supported document as one retrieval unit.

- Fixed Size
  - You specify tokens per chunk and overlap percentage
- Default
  - 300 tokens per chunk, while honoring sentence boundaries (complete sentences preserved within each chunk)
- No chunking
  - Every document is a chunk
  - You could pre-process your own data to “chunk” it however you want per document


```mermaid
flowchart LR
  accTitle: Chunking with Bedrock: Standard Chunking
  n0["Document"]
  n1["Fixed token windows"]
  n2["Overlapping boundary text"]
  n3["Indexed chunks"]
  n0 -->|"split by configured size"| n1
  n1 -->|"retain overlap"| n2
  n2 -->|"embed chunks"| n3
```

> Fixed-size chunks may overlap to retain boundary context; no chunking treats a supported document as one retrieval unit.

## Chunking with Bedrock: Hierarchical Chunking


Hierarchical retrieval indexes smaller child chunks but can return a larger parent to restore context.

- Nested parent/child chunks
- Initial search hits the child chunks
  - But then replaces them with parent chunks to get more context when appropriate
- The idea is to get better precision in retrieval from the smaller embeddings
  - But then reclaim comprehensiveness from the parents


```mermaid
flowchart LR
  accTitle: Chunking with Bedrock: Hierarchical Chunking
  n0["Document"]
  n1["Parent chunk"]
  n2["Child chunks"]
  n3["Child match"]
  n4["Parent context"]
  n0 -->|"large units"| n1
  n1 -->|"small units"| n2
  n2 -->|"search"| n3
  n3 -->|"expand matched context"| n4
```

> Hierarchical retrieval indexes smaller child chunks but can return a larger parent to restore context.

## Chunking with Bedrock: Semantic Chunking


Semantic chunking uses model-based similarity and a boundary threshold; these settings affect chunk size and ingestion cost.

- Hits a foundation model to break up chunks based on “semantic content” and not just things like sentences or a fixed chunk size
- You specify:
  - Maximum tokens (while honoring sentence boundaries)
  - Buffer size
    - Number of surrounding sentences per sentence to consider when embeddings
    - i.e., buffer size of 1 results in 3 sentences
    - Too large = introducing noise; too small = missing important context (but more precise)
  - Breakpoint percentile threshold
    - How “semantically similar” a chunk must be
    - Higher = more distinguishable chunks, less of them, larger chunks.
- This costs money; you’re charged for the underlying FM used for this


```mermaid
flowchart LR
  accTitle: Chunking with Bedrock: Semantic Chunking
  n0["Text sentences"]
  n1["Embedding / similarity"]
  n2["Boundary threshold"]
  n3["Semantic chunks"]
  n0 -->|"encode / compare"| n1
  n1 -->|"detect meaning shifts"| n2
  n2 -->|"split"| n3
```

> Semantic chunking uses model-based similarity and a boundary threshold; these settings affect chunk size and ingestion cost.

## Optimizing your Embeddings


Embedding size and storage choices affect cost, latency and retrieval quality. Evaluate the resulting search behavior before reducing representation size.

  - I’m talking vector size here, not chunk size
  - Smaller vectors = fewer dimensions per chunk = less cost
  - However there is a tradeoff with your retrieval performance
- Amazon Titan has a default of 1024+ dimensions
  - This might be more than you need!
  - Balance dimensionality with domain fit
    - Are the semantic concepts you are searching for really that complex?

## Sparse vs. Dense Embeddings


Sparse vectors emphasize token occurrence; dense vectors encode learned semantic features. Hybrid search combines complementary signals.

- Sparse = large vectors that are mostly empty
  - Ie. One-hot encoding
- Dense = smaller vectors that contain more semantic information
  - This is what you generally use
- There is a tradeoff
  - Sparse vectors give greater similarity factors
  - Dense vectors are more efficient (in memory, and in general)
  - Classical AI systems have ways to compress sparse vectors
- Wait, what’s a similarity factor
  - Some measure of how close two vectors are
  - A common one is cosine similarity
  - Remember your trig? Cosine is related to the angle between two vectors.
    - And it has a nice smoothness to it


```mermaid
flowchart LR
  accTitle: Sparse vs. Dense Embeddings
  n0["Text"]
  n1["Sparse token representation"]
  n2["Dense embedding"]
  n3["Lexical / semantic search"]
  n0 -->|"token features"| n1
  n0 -->|"learned encoder"| n2
  n1 -->|"lexical signal"| n3
  n2 -->|"semantic signal"| n3
```

> Sparse vectors emphasize token occurrence; dense vectors encode learned semantic features. Hybrid search combines complementary signals.

## Optimizing Retrieval with Metadata


Metadata filters constrain eligible documents alongside vector similarity, improving scope and access-aware retrieval.

- Your vector DB can store more than just vectors and the raw text of the chunk
  - Bedrock Knowledge Bases can treat certain columns as content vs. metadata
  - Pass in a metadata.json file to specify what’s what
  - This makes sure you aren’t chunking up metadata (like creation date) but can still retrieve it
- If you add metadata tags for things like topics, what section of the document we’re in, etc… you can use this for better retrieval too.
  - Relevance scoring against metadata can be used for ranking
- Other examples of metadata
  - Document ID, category, access control, data lineage, additional context }


```mermaid
flowchart LR
  accTitle: Optimizing Retrieval with Metadata
  n0["Query + metadata constraint"]
  n1["Eligible document subset"]
  n2["Vector similarity"]
  n3["Filtered matches"]
  n0 -->|"apply supported filter"| n1
  n1 -->|"search candidates"| n2
  n2 -->|"rank results"| n3
```

> Metadata filters constrain eligible documents alongside vector similarity, improving scope and access-aware retrieval.

## Keeping Your KB Up to Date


An S3-triggered ingestion function can update an embedding index; handle updates and deletes so retrieval does not become stale.

- New or changed content can trigger a Lambda function
- This Lambda function can then generate new embeddings
- Batch-generate them for greater efficiency
  - Instead of syncing on every change, maybe you can do so on a schedule


```mermaid
flowchart LR
  accTitle: Keeping Your KB Up to Date
  n0["S3 content event"]
  n1["Lambda ingestion"]
  n2["Bedrock embedding model"]
  n3["Vector index"]
  n0 -->|"create / update event"| n1
  n1 -->|"encode content"| n2
  n2 -->|"upsert vectors + metadata"| n3
```

> An S3-triggered ingestion function can update an embedding index; handle updates and deletes so retrieval does not become stale.

## OpenSearch as a Vector Store


Hybrid search combines keyword and vector retrieval, then ranks the combined candidate set.

- Serverless vector stores
  - Note “serverless” does not mean “scales to zero”
    - Remember to shut down your serverless OpenSearch instances if you’re not using them – or you’ll keep getting billed
  - The exam treats OpenSearch as the primary implementation for backing Bedrock Knowledge Bases
    - But I think this might get subsumed by the newer S3 vectors feature
- Not limited to Bedrock Knowledge Bases
  - Can also integrate with SageMaker AI and HuggingFace or custom models for RAG
- SEMANTIC vs. HYBRID search
  - Semantic refers to vector search
    - As we’ve seen relevancy can be elusive and dependent on your chunking strategy
  - Hybrid combines vector and keyword search
    - Requires indexing filterable keyword fields for metadata
  - This is important


```mermaid
flowchart LR
  accTitle: OpenSearch as a Vector Store
  n0["Query"]
  n1["Keyword search"]
  n2["Vector search"]
  n3["Combine / normalize scores"]
  n4["Ranked evidence"]
  n0 -->|"lexical query"| n1
  n0 -->|"embedding query"| n2
  n1 -->|"lexical matches"| n3
  n2 -->|"semantic matches"| n3
  n3 -->|"ranking"| n4
```

> Hybrid search combines keyword and vector retrieval, then ranks the combined candidate set.

## OpenSearch Vector Engines


OpenSearch vector engines provide different indexing and search implementations. Engine, algorithm and supported parameters must be selected together.

- Exact Nearest Neighbor search
  - This is slow
- Approximate Nearest Neighbor (ANN) search
  - Heirarchical Navigable Small World ()
    - Fast, high-quality, simple – but uses lots of RAM
  - Inverted File (IVF)
    - Better for really huge datasets, can trade recall for speed & memory
- Tuning
  - M = How many edges per node
    - Higher M -> denser graph, higher recall, but more memory
  - ef_construction = Size of dynamic list used for KNN graph
    - Higher -> more accurate graph, slower indexing speed
  - ef_search = How thoroughly the graph is explored
    - Higher -> higher recall, but slower search performance

## OpenSearch as a Vector Store: Finer Points


Vector compression reduces the representation's storage or memory footprint. Evaluate the quality and latency effects on the actual retrieval task.

  - Different ANN methods have their own techniques (, IVF)
  - Dense embeddings add up fast
- Binary vectors
  - Bit sequences (stored as bytes)
  - Not embeddings, but used for fast distance search
  - 32x compression compared to float32
- FP16
  - A form of scalar quantization
  - Store embedding dimensions as 16-bit values instead of 32-bit
  - What does

## OpenSearch as a Vector Store: Finer Points


Vector-index shard layout affects memory use, parallelism and distribution of search work. Size it from the dataset and query workload.

  - Balance shard size and CPU ratio
  - Larger shards for semantic search (30-50 GB)
    - Vector search benefits from fewer, larger shards because there is less cross-shard coordination.
  - Smaller for hybrid (10-30 GB)
  - On OpenSearch Serverless, this is automatic
- Multi-index approaches
  - Different document types belong in their own index
  - This way you can tune performance for each corpus
  - You might want different embedding models for different types of data
  - You’ll need some sort of query routing to pull this off.

## Amazon Aurora as a Vector Store


A PostgreSQL pgvector table stores vectors and metadata; the query chooses the distance operator and supported index strategy.

- pgvector extension
  - Creates a new “vector” column type
  - Can compute cosine, L2, or inner product distances
  - The source mentions IVF similarity search but leaves the alternative after "or" unfinished.
  - Also adds vector operators for SQL
    - This gives it an advantage over OpenSearch if you need complex filtering logic and stuff.
- Allows you to store structured and vector data in the same place
- Can be appropriate for small / medium RAG systems with mostly structured data


```mermaid
flowchart LR
  accTitle: Amazon Aurora as a Vector Store
  n0["Embeddings + metadata"]
  n1["pgvector table"]
  n2["Distance query / index"]
  n3["Nearest rows"]
  n0 -->|"insert"| n1
  n1 -->|"search"| n2
  n2 -->|"rank by distance"| n3
```

> A PostgreSQL pgvector table stores vectors and metadata; the query chooses the distance operator and supported index strategy.

## Amazon Quick


Amazon Quick can connect authenticated employees with permitted enterprise content and configured application capabilities.

- Successor to Amazon Q Business
- Agentic AI assistant for your employees: answer, research, analyze, act
  - Connects to your company’s documents, apps, databases and the Internet
- Built on Amazon Bedrock, your data is never used to train models


```mermaid
flowchart LR
  accTitle: Amazon Quick
  n0["Employee"]
  n1["Quick workspace"]
  n2["Enterprise content"]
  n3["Connected applications"]
  n0 -->|"authenticated question / action"| n1
  n2 -->|"authorized knowledge"| n1
  n1 -->|"configured action"| n3
```

> Amazon Quick can connect authenticated employees with permitted enterprise content and configured application capabilities.

## Amazon Quick – Capabilities


Quick indexed knowledge can support research, flows and other workspace capabilities.

- Quick Index – unified, searchable knowledge base of your company data (fully managed RAG)
  - Knowledge bases from S3, SharePoint, OneDrive, Google Drive, Confluence, web pages…
- Quick Research – deep research agent, combines internal data and the Internet, cited reports
- Quick Flows – simple automations built with natural language (e.g., weekly report email)
- Quick Automate – multi-step agentic workflows across systems, with human approvals
- Quick Sight – AI-powered BI dashboards, ask questions about your data (formerly QuickSight)
- Spaces – shared workspace of documents, dashboards and agents for a team


```mermaid
flowchart LR
  accTitle: Amazon Quick – Capabilities
  n0["Enterprise index"]
  n1["Research"]
  n2["Flows / automation"]
  n3["Sight / spaces / applications"]
  n0 ---|"grounded knowledge"| n1
  n0 ---|"workflow context"| n2
  n0 ---|"workspace capabilities"| n3
```

> Quick's indexed knowledge can support research, flows and other workspace capabilities.

## Amazon Quick + IAM Identity Center


Identity integration and source permissions determine which enterprise data an authenticated user can retrieve.

- Users can be authenticated through IAM Identity Center
- Users receive responses generated only from the documents they have access to
- IAM Identity Center can be configured with external Identity Providers
  - IdP: Google Login, Microsoft Active Directory…


```mermaid
flowchart LR
  accTitle: Amazon Quick + IAM Identity Center
  n0["Identity provider"]
  n1["IAM Identity Center"]
  n2["Authenticated employee"]
  n3["Quick"]
  n4["Permission-filtered content"]
  n0 -->|"federation"| n1
  n1 -->|"session"| n2
  n2 -->|"request"| n3
  n3 -->|"authorized retrieval"| n4
```

> Identity integration and source permissions determine which enterprise data an authenticated user can retrieve.

## Amazon Quick – Integrations


Enterprise connectors index supported content; action connectors separately invoke permitted business operations.

- Knowledge Bases (fully managed RAG) – index your company data into Quick Index
  - Amazon S3, Google Drive, OneDrive, SharePoint, Confluence, Web Crawler…
  - 30+ structured data sources for Quick Sight: Redshift, Athena, RDS, Snowflake…
- Actions – allows agents to perform tasks in 3rd party services
  - Jira, ServiceNow, Zendesk, Salesforce, Slack, Outlook… (100+ pre-built connectors)
  - MCP & OpenAPI – connects to your own


```mermaid
flowchart LR
  accTitle: Amazon Quick – Integrations
  n0["S3 / databases / SaaS content"]
  n1["Enterprise index"]
  n2["Quick"]
  n3["Configured API / application actions"]
  n0 -->|"supported ingestion"| n1
  n1 -->|"retrieval"| n2
  n2 -->|"authorized action"| n3
```

> Enterprise connectors index supported content; action connectors separately invoke permitted business operations.

## Apps in Amazon Quick


The application-building screen illustrates describing, previewing, refining and publishing an application.

- Build and publish web applications without coding by describing them in natural language
- Example: project tracker, customer dashboard, training portal, data entry form…
- Apps can embed Quick Sight visuals, use Actions (Salesforce, Jira…), Spaces as knowledge base, and call an FM for summaries or classification


```mermaid
flowchart LR
  accTitle: Apps in Amazon Quick
  n0["Describe need"]
  n1["Generate draft"]
  n2["Preview"]
  n3["Refine"]
  n4["Publish"]
  n0 -->|"instructions"| n1
  n1 -->|"review"| n2
  n2 -->|"feedback"| n3
  n3 -->|"iterate"| n2
  n3 -->|"ready"| n4
```

> The application-building screen illustrates describing, previewing, refining and publishing an application.

## Amazon Quick Example


A visual flow represents ordered business steps with explicit inputs, transformations and outputs.


```mermaid
flowchart LR
  accTitle: Amazon Quick Example
  n0["Flow input"]
  n1["Configured business steps"]
  n2["Review / approval where configured"]
  n3["Output / action"]
  n0 -->|"start"| n1
  n1 -->|"intermediate result"| n2
  n2 -->|"complete"| n3
```

> A visual flow represents ordered business steps with explicit inputs, transformations and outputs.

## Amazon Kendra


Kendra indexes supported enterprise sources and serves search queries. Its 2026 maintenance-mode status must be considered separately from the retrieval concept.

- Availability note: Kendra moved to maintenance and is no longer open to new customers from July 30, 2026; existing customers can continue. Retain the retrieval concept, but evaluate current alternatives for new systems.
- NOTE! In maintenance mode as of July 30 2026
- Fully managed document search service powered by Machine Learning
- Extract answers from documents and common file formats.
- Natural language search capabilities
- Learn from user interactions/feedback to promote preferred results (Incremental Learning)
- Ability to manually fine-tune search results (importance of data, freshness, custom, …)

**Current reference (checked 2026-10-13):** [Kendra availability](https://docs.aws.amazon.com/kendra/latest/dg/kendra-availability-change.html).


```mermaid
flowchart LR
  accTitle: Amazon Kendra
  n0["S3 / RDS / documents / SaaS"]
  n1["Kendra index"]
  n2["Natural-language query"]
  n3["Ranked results"]
  n0 -->|"connector ingestion"| n1
  n2 -->|"search"| n1
  n1 -->|"retrieval"| n3
```

> Kendra indexes supported enterprise sources and serves search queries. Its 2026 maintenance-mode status must be considered separately from the retrieval concept.

# Section Developer tools

## Console, CLI and SDK access


The console is interactive; the CLI and SDK call AWS APIs using a credential provider chain.

- Prefer federation, IAM Identity Center or assumed workload roles with temporary credentials where appropriate.
- Long-lived access keys are one credential option, not a requirement for every CLI or SDK user.
- Keep secret keys and session tokens out of code, shared notes and logs. An access key ID is an identifier, not a password.

**Current reference (checked 2026-10-13):** [AWS SDK credentials and providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html).

## Access key identifiers and secrets


Example credentials are synthetic: the access key identifier names a credential, while its secret is used to sign requests.

- Access key ID: identifies the credential; it does not authenticate a request by itself.
- Secret access key: confidential signing material. Temporary credentials also require a session token.
- The literal fake strings add no study value and are intentionally replaced by these descriptions.

## What’s the AWS CLI?


The AWS CLI invokes AWS service APIs from a shell with a configured credential provider and Region.

- A tool that enables you to interact with AWS services using commands in your command-line shell
- Direct access to the public APIs of AWS services
- You can develop scripts to manage your resources
- It’s open-source https://github.com/aws/aws-cli
- Alternative to using AWS Management Console

## What’s the AWS SDK?


AWS SDKs expose service APIs through language libraries and credential providers.

- AWS Software Development Kit (AWS SDK)
- Language-specific APIs (set of libraries)
- Enables you to access and manage AWS services programmatically
- Embedded within your application
- Supports
  - SDKs (JavaScript, Python, PHP, .NET, Ruby, Java, Go, Node.js, C++)
  - Mobile SDKs (Android, iOS, …)
  - IoT Device SDKs (Embedded C, Arduino, …)
- Example: AWS CLI is built on AWS SDK for Python

## AWS Cloud Development Kit (CDK)


CDK expresses infrastructure as code and synthesizes a CloudFormation template; CloudFormation performs the deployment.

- Define your cloud infrastructure using a familiar language:
  - JavaScript/TypeScript, Python, Java, and .NET
- Contains high level components called constructs
- The code is “compiled” into a CloudFormation template (JSON/YAML)
- You can therefore deploy infrastructure and application runtime code together
  - Great for Lambda functions
  - Great for Docker containers in ECS / EKS


```mermaid
flowchart LR
  accTitle: AWS Cloud Development Kit (CDK)
  n0["CDK constructs"]
  n1["Synthesized template"]
  n2["CloudFormation"]
  n3["AWS resources"]
  n0 -->|"cdk synth"| n1
  n1 -->|"cdk deploy"| n2
  n2 -->|"provision"| n3
```

> CDK expresses infrastructure as code and synthesizes a CloudFormation template; CloudFormation performs the deployment.

## CDK in a diagram


CDK language code becomes a cloud assembly/template before CloudFormation creates or updates the stack.


```mermaid
flowchart LR
  accTitle: CDK in a diagram
  n0["Application code"]
  n1["CDK synthesis"]
  n2["Cloud assembly"]
  n3["CloudFormation stack"]
  n0 -->|"construct graph"| n1
  n1 -->|"templates + assets"| n2
  n2 -->|"deploy"| n3
```

> CDK language code becomes a cloud assembly/template before CloudFormation creates or updates the stack.

## CDK vs SAM


SAM focuses on serverless application resources; CDK models infrastructure with programming-language constructs.

- SAM:
  - Serverless focused
  - Write your template declaratively in JSON or YAML
  - Great for quickly getting started with Lambda
  - Leverages CloudFormation
- CDK:
  - All AWS services
  - Write infra in a programming language JavaScript/TypeScript, Python, Java, and .NET

## CDK + SAM


After CDK synthesis, SAM CLI can locally invoke supported Lambda resources from the generated template for development testing.

- You can use SAM CLI to locally test your CDK apps
- You must first run cdk synth


```mermaid
flowchart LR
  accTitle: CDK + SAM
  n0["CDK code"]
  n1["cdk synth"]
  n2["Generated template"]
  n3["sam local invoke"]
  n0 -->|"synthesize"| n1
  n1 -->|"template"| n2
  n2 -->|"local Lambda test"| n3
```

> After CDK synthesis, SAM CLI can locally invoke supported Lambda resources from the generated template for development testing.

## CDK Hands-On


An object event invokes an image-analysis function, which calls Rekognition and stores extracted results in DynamoDB.


```mermaid
flowchart LR
  accTitle: CDK Hands-On
  n0["S3 upload"]
  n1["Lambda"]
  n2["Rekognition"]
  n3["DynamoDB results"]
  n0 -->|"object event"| n1
  n1 -->|"analyze image"| n2
  n2 -->|"labels / detections"| n1
  n1 -->|"store result"| n3
```

> An object event invokes an image-analysis function, which calls Rekognition and stores extracted results in DynamoDB.

## AWS CodeDeploy


CodeDeploy coordinates installation of an application revision on supported compute targets using a deployment configuration.

- We want to deploy our application automatically
- Works with EC2 Instances
- Works with On-Premises Servers
- Hybrid service
- Servers / Instances must be provisioned and configured ahead of time with the CodeDeploy Agent


```mermaid
flowchart LR
  accTitle: AWS CodeDeploy
  n0["Revision artifact"]
  n1["CodeDeploy deployment"]
  n2["EC2 / on-premises targets"]
  n3["Updated application"]
  n0 -->|"revision + AppSpec"| n1
  n1 -->|"deployment lifecycle"| n2
  n2 -->|"new version"| n3
```

> CodeDeploy coordinates installation of an application revision on supported compute targets using a deployment configuration.

## AWS CodeCommit


A source repository stores application history for collaboration and delivery pipelines. Access, branch policy and the chosen hosting service govern how changes are published.

- Developers usually store code in a repository, using the Git technology
- A famous public offering is GitHub, AWS’ competing product is CodeCommit
- CodeCommit:
  - Source-control service that hosts Git-based repositories
  - Makes it easy to collaborate with others on code
  - The code changes are automatically versioned
- Benefits:
  - Fully managed
  - Scalable & highly available
  - Private, Secured, Integrated with AWS

## AWS CodeBuild


CodeBuild checks out source, runs configured build commands and publishes build artifacts and logs.

- Code building service in the cloud (name is obvious)
- Compiles source code, run tests, and produces packages that are ready to be deployed (by CodeDeploy for example)
- Benefits:
  - Fully managed, serverless
  - Continuously scalable & highly available
  - Secure
  - Pay-as-you-go pricing – only pay for the build time


```mermaid
flowchart LR
  accTitle: AWS CodeBuild
  n0["Source repository"]
  n1["CodeBuild"]
  n2["Build artifact"]
  n3["Build logs"]
  n0 -->|"checkout"| n1
  n1 -->|"package output"| n2
  n1 -->|"execution logs"| n3
```

> CodeBuild checks out source, runs configured build commands and publishes build artifacts and logs.

## AWS CodePipeline


CodePipeline orchestrates source, build and deploy stages using configured providers; the pictured repository is one possible source.

- Orchestrate the different steps to have the code automatically pushed to production
  - Code => Build => Test => Provision => Deploy
  - Basis for CICD (Continuous Integration & Continuous Delivery)
- Benefits:
  - Fully managed, compatible with CodeCommit, CodeBuild, CodeDeploy, Elastic Beanstalk, CloudFormation, GitHub, 3rd-party services (GitHub…) & custom plugins…
  - Fast delivery & rapid updates


```mermaid
flowchart LR
  accTitle: AWS CodePipeline
  n0["Source provider"]
  n1["CodeBuild"]
  n2["Deployment stage"]
  n3["Application environment"]
  n0 -->|"source artifact"| n1
  n1 -->|"built artifact"| n2
  n2 -->|"release"| n3
```

> CodePipeline orchestrates source, build and deploy stages using configured providers; the pictured repository is one possible source.

# Section Cost management and API Gateway

## AWS Budgets


Budgets compares configured spending or usage against thresholds and sends notifications or supported actions. A budget alert is not automatically a hard spending cap.

- 4 types of budgets: Usage, Cost, Reservation, Savings Plans
- For Reserved Instances (RI)
  - Track utilization
  - Supports EC2, ElastiCache, RDS, Redshift
- Up to 5 SNS notifications per budget
- Can filter by: Service, Linked Account, Tag, Purchase Option, Instance Type, Region, Availability Zone, API Operation, etc…
- Same options as AWS Cost Explorer!
- 2 budgets are free, then $0.02/day/budget

## Cost Explorer


Cost Explorer analyzes usage and cost trends across chosen dimensions. Use filters and time ranges to investigate the source of a change.

- Create custom reports that analyze cost and usage data.
- Analyze your data at a high level: total costs and usage across all accounts
- Or Monthly, hourly, resource level granularity
- Choose an optimal Savings Plan (to lower prices on your bill)
- Forecast usage up to 18 months based on previous usage

## Cost Explorer – Monthly Cost by AWS Service


A cost breakdown groups spend by service and time period so the reader can identify contributors; no screenshot dollar amounts are reproduced.


```mermaid
flowchart LR
  accTitle: Cost Explorer – Monthly Cost by AWS Service
  n0["Billing usage"]
  n1["Group by service + time"]
  n2["Cost breakdown"]
  n3["Investigate contributors"]
  n0 -->|"aggregate"| n1
  n1 -->|"chart"| n2
  n2 -->|"review"| n3
```

> A cost breakdown groups spend by service and time period so the reader can identify contributors; no screenshot dollar amounts are reproduced.

## Cost Explorer– Hourly & Resource Level


Finer cost granularity exposes short-lived spending patterns at the expense of more detailed data.


```mermaid
flowchart LR
  accTitle: Cost Explorer– Hourly & Resource Level
  n0["Usage records"]
  n1["Chosen time granularity"]
  n2["Hourly / daily view"]
  n3["Cost investigation"]
  n0 -->|"aggregate"| n1
  n1 -->|"visualize"| n2
  n2 -->|"identify changes"| n3
```

> Finer cost granularity exposes short-lived spending patterns at the expense of more detailed data.

## Cost Explorer – Savings Plan Alternative to Reserved Instances


Savings Plans recommendations use historical eligible usage and commitment assumptions; a recommendation is not a guaranteed saving.


```mermaid
flowchart LR
  accTitle: Cost Explorer – Savings Plan Alternative to Reserved Instances
  n0["Eligible usage history"]
  n1["Commitment assumptions"]
  n2["Recommendation"]
  n3["Review risk / purchase decision"]
  n0 -->|"historical pattern"| n2
  n1 -->|"term / payment / utilization"| n2
  n2 -->|"evaluate"| n3
```

> Savings Plans recommendations use historical eligible usage and commitment assumptions; a recommendation is not a guaranteed saving.

## Cost Explorer – Forecast Usage


A cost forecast projects future spend with uncertainty; compare it with budgets and actual usage as conditions change.


```mermaid
flowchart LR
  accTitle: Cost Explorer – Forecast Usage
  n0["Historical spend"]
  n1["Forecast model"]
  n2["Projected cost + interval"]
  n3["Budget / capacity decision"]
  n0 -->|"time series"| n1
  n1 -->|"estimate"| n2
  n2 -->|"plan with uncertainty"| n3
```

> A cost forecast projects future spend with uncertainty; compare it with budgets and actual usage as conditions change.

## Example: Building a Serverless API


A REST API accepts a client request, invokes Lambda business logic and accesses DynamoDB with the function's permissions.


```mermaid
flowchart LR
  accTitle: Example: Building a Serverless API
  n0["Client"]
  n1["API Gateway"]
  n2["Lambda"]
  n3["DynamoDB"]
  n0 -->|"HTTP request"| n1
  n1 -->|"integration"| n2
  n2 -->|"CRUD"| n3
```

> A REST API accepts a client request, invokes Lambda business logic and accesses DynamoDB with the function's permissions.

## AWS API Gateway


API Gateway exposes managed API endpoints with configurable integrations and access controls. It connects clients to application backends without making every backend serverless.

- Support for the WebSocket Protocol
- Handle API versioning (v1, v2…)
- Handle different environments (dev, test, prod…)
- Handle security (Authentication and Authorization)
- Create API keys, handle request throttling
- Swagger / Open API import to quickly define APIs
- Transform and validate requests and responses
- Generate SDK and API specifications
- Cache API responses

## API Gateway – Integrations High Level


API Gateway integrations can invoke Lambda, route HTTP requests or call supported AWS service APIs.

- Lambda Function
  - Invoke Lambda function
  - Easy way to expose REST API backed by AWS Lambda
- HTTP
  - Expose HTTP endpoints in the backend
  - Example: internal HTTP API on premise, Application Load Balancer…
  - Why? Add rate limiting, caching, user authentications, API keys, etc…
- AWS Service
  - Expose any AWS API through the API Gateway
  - Example: start an AWS Step Function workflow, post a message to SQS
  - Why? Add authentication, deploy publicly, rate control…

## API Gateway – AWS Service Integration Kinesis Data Streams example


An API Gateway service integration can put records into Kinesis without an intervening Lambda function; Firehose delivers onward to S3.


```mermaid
flowchart LR
  accTitle: API Gateway – AWS Service Integration Kinesis Data Streams example
  n0["Client"]
  n1["API Gateway"]
  n2["Kinesis Data Streams"]
  n3["Data Firehose"]
  n4["S3"]
  n0 -->|"HTTP payload"| n1
  n1 -->|"mapped PutRecords"| n2
  n2 -->|"stream source"| n3
  n3 -->|"buffered delivery"| n4
```

> An API Gateway service integration can put records into Kinesis without an intervening Lambda function; Firehose delivers onward to S3.

## API Gateway - Endpoint Types


API Gateway endpoint choices affect access and edge placement: edge-optimized, Regional and private endpoints have different network paths.

- Edge-Optimized (default): For global clients
  - Requests are routed through the CloudFront Edge locations (improves latency)
  - The API Gateway still lives in only one region
- Regional:
  - For clients within the same region
  - Could manually combine with CloudFront (more control over the caching strategies and the distribution)
- Private:
  - Can only be accessed from your VPC using an interface VPC endpoint (ENI)
  - Use a resource policy to define access


```mermaid
flowchart LR
  accTitle: API Gateway - Endpoint Types
  n0["Public client"]
  n1["Edge-optimized API"]
  n2["Regional API"]
  n3["VPC client"]
  n4["Private API endpoint"]
  n0 -->|"edge entry"| n1
  n0 -->|"regional entry"| n2
  n3 -->|"interface-endpoint access"| n4
```

> API Gateway endpoint choices affect access and edge placement: edge-optimized, Regional and private endpoints have different network paths.

## API Gateway – Security


API authentication and custom-domain TLS are separate controls; edge-optimized custom-domain certificates use us-east-1 and Regional certificates use the API Region.

- User Authentication through
  - IAM Roles (useful for internal applications)
  - Cognito (identity for external users – example mobile users)
  - Custom Authorizer (your own logic)
- Custom Domain Name HTTPS security through integration with AWS Certificate Manager (ACM)
  - If using Edge-Optimized endpoint, then the certificate must be in us- east-1
  - If using Regional endpoint, the certificate must be in the API Gateway region
  - Must setup CNAME or A-alias record in Route 53

```mermaid
flowchart LR
  accTitle: API Gateway – Security
  n0["API caller"]
  n1["IAM / Cognito / Lambda authorizer"]
  n2["API Gateway"]
  n3["ACM custom-domain certificate"]
  n4["Backend integration"]
  n0 -->|"authenticate / authorize"| n1
  n1 -->|"permitted request"| n2
  n3 -->|"TLS domain binding"| n2
  n2 -->|"invoke"| n4
```

> API authentication and custom-domain TLS are separate controls; edge-optimized custom-domain certificates use us-east-1 and Regional certificates use the API Region.
