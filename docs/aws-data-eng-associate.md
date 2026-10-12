# Section Study approach

<!-- collection: course -->

Study notes interpreted from **AWSCertifiedDataEngineerSlides.pdf**, physical pages **1–765 inclusive**. Course authors: **Stephane Maarek and Frank Kane**. The supplied PDF metadata is dated **25 September 2026**. Reviewed **13 October 2026**.

These are personal study materials, not AWS documentation or an official exam blueprint. Source-derived limits, prices, console behavior and availability describe the course snapshot unless a dated correction is cited. Verify them in AWS documentation before deploying or booking an exam.

Read the takeaway, explain the diagram, then recall the operational tradeoff. Each source topic has a physical PDF page marker; the presentation shows a short set of points and expandable reference notes. Repeated slide titles are distinguished by page. Tables and screenshots are rewritten as comparisons, SQL examples or workflow steps. Decorative logos, biographies and chapter cards are accounted for in the coverage index rather than copied.

## How the material is organized

- Fundamentals → SQL/Git → storage → databases → migration → compute/containers.
- Analytics/streaming → integration → security → networks → operations.
- ML/data preparation/RAG → developer tools → costs and API Gateway.
- The final **Personal working notes** collection preserves the pre-existing headings and unfinished prompts. It remains separate from the source-linked course sequence so duplicates do not interrupt that sequence.

# Section Course orientation

## How to use this study guide

<!-- pdf-page: 4 -->

Study the requirement, choose a service, then explain its tradeoffs and failure modes.

- The course targets DEA-C01 and recommends prior AWS fundamentals, including EC2/networking, and data-engineering knowledge.
- Read the key points first; expand detailed notes and diagram text when revising.
- Use the PDF page number to find the original example. Console screenshots are interpreted as learning steps, not reproduced UI instructions.
- Test yourself: What enters the system? Where is durable state? What retries? Which identity is authorized? What changes cost or latency?

## Service map: integration and analytics

<!-- pdf-page: 7 -->

Distinguish moving events, orchestrating work and analyzing data.

- Integration: SQS, SNS, EventBridge, Step Functions, AppFlow and MWAA.
- Analytics: Glue, Lake Formation, Athena, EMR, Kinesis, OpenSearch and QuickSight.
- Cost visibility and control: Cost Explorer and Budgets.

## Service map: compute, containers and databases

<!-- pdf-page: 8 -->

Choose storage and execution models independently.

- Compute: EC2, Lambda and Batch; SAM supports serverless application development.
- Containers: ECS and EKS orchestrate workloads; ECR stores images.
- Database choices include RDS/Aurora, DynamoDB, DocumentDB, Keyspaces, Neptune, MemoryDB, Timestream and Redshift; match the data model and access pattern.

## Service map: development and operations

<!-- pdf-page: 9 -->

Build reproducible infrastructure and retain operational evidence.

- CLI/SDK, CDK, CodeBuild, CodeDeploy and CodePipeline support development and delivery; repository availability is a separate service consideration.
- CloudFormation, CloudWatch, CloudTrail, Config, Systems Manager and Managed Grafana cover provisioning, observability and governance.
- SageMaker supports ML workflows; API Gateway exposes application interfaces.

## Service map: migration, networks and security

<!-- pdf-page: 10 -->

Plan how data reaches AWS and how users and workloads gain access.

- Migration: discovery, Application Migration Service, DMS, DataSync, Transfer Family and offline-transfer options.
- Networking: VPC, PrivateLink, Route 53 and CloudFront.
- Security: IAM, KMS, Secrets Manager, WAF and Macie.

## Service map: storage

<!-- pdf-page: 11 -->

Separate objects, block devices, shared filesystems and recovery copies.

- S3: object storage and lake datasets.
- EBS: block volumes for supported compute.
- EFS: shared NFS files.
- AWS Backup: centrally managed recovery points for supported resources.

# Section Data engineering fundamentals

## Types of Data

<!-- pdf-page: 13 -->

Classify data by how explicitly its structure is defined: structured, semi-structured or unstructured.

- Structured
- Unstructured
- Semi-Structured

## Structured Data

<!-- pdf-page: 14 -->

Definition: Data that is organized in a defined manner or schema, typically found in relational databases.

- Characteristics:
  - Easily queryable
  - Organized in rows and columns
  - Has a consistent structure
- Examples:
  - Database tables
  - CSV files with consistent columns
  - Excel spreadsheets

## Unstructured Data

<!-- pdf-page: 15 -->

Definition: Data that doesn't have a predefined structure or schema.

- Characteristics:
  - Not easily queryable without preprocessing
  - May come in various formats
- Examples:
  - Text files without a fixed format
  - Videos and audio files
  - Images
  - Emails and word processing documents

## Semi-Structured Data

<!-- pdf-page: 16 -->

Definition: Data that is not as organized as structured data but has some level of structure in the form of tags, hierarchies, or other patterns.

- Characteristics:
  - Elements might be tagged or categorized in some way
  - More flexible than structured data but not as chaotic as unstructured data
- Examples:
  - XML and JSON files
  - Email headers (which have a mix of structured fields like date, subject, etc., and unstructured data in the body)
  - Log files with varied formats

## Properties of Data

<!-- pdf-page: 17 -->

Volume, velocity and variety describe different pressures on a data pipeline.

- Volume
- Velocity
- Variety

## Volume

<!-- pdf-page: 18 -->

Definition: Refers to the amount or size of data that organizations are dealing with at any given time.

- Characteristics:
  - May range from gigabytes to petabytes or even more
  - Challenges in storing, processing, and analyzing high volumes of data
- Examples:
  - A popular social media platform processing terabytes of data daily from user posts, images, and videos.
  - Retailers collecting years' worth of transaction data, amounting to several petabytes.

## Velocity

<!-- pdf-page: 19 -->

Definition: Refers to the speed at which new data is generated, collected, and processed.

- Characteristics:
  - High velocity requires real-time or near-real-time processing capabilities
  - Rapid ingestion and processing can be critical for certain applications
- Examples:
  - Sensor data from IoT devices streaming readings every millisecond.
  - High-frequency trading systems where milliseconds can make a difference in decision-making.

## Variety

<!-- pdf-page: 20 -->

Definition: Refers to the different types, structures, and sources of data.

- Characteristics:
  - Data can be structured, semi-structured, or unstructured
  - Data can come from multiple sources and in various formats
- Examples:
  - A business analyzing data from relational databases (structured), emails (unstructured), and JSON logs (semi-structured).
  - Healthcare systems collecting data from electronic medical records, wearable health devices, and patient feedback forms.

## Data Warehouse

<!-- pdf-page: 22 -->

Definition: A centralized repository optimized for analysis where data from different sources is stored in a structured format.

- Characteristics:
  - Designed for complex queries and analysis
  - Data is cleaned, transformed, and loaded (ETL process)
  - Typically uses a star or snowflake schema
  - Optimized for read-heavy operations
- Examples:
  - Amazon Redshift
  - Google BigQuery
  - Microsoft Azure SQL Data Warehouse

## Data Warehouse example

<!-- pdf-page: 23 -->

Source systems feed a central warehouse; subject-specific data marts serve accounting, analysis and machine learning.

## Data Lake

<!-- pdf-page: 24 -->

Definition: A storage repository that holds vast amounts of raw data in its native format, including structured, semi-structured, and unstructured data.

- Characteristics:
  - Can store large volumes of raw data without predefined schema
  - Data is loaded as-is, no need for preprocessing
  - Supports batch, real-time, and stream processing
  - Can be queried for data transformation or exploration purposes
- Examples:
  - Amazon Simple Storage Service (S3) when used as a data lake
  - Azure Data Lake Storage
  - Hadoop Distributed File System (HDFS)

## Comparing the two

<!-- pdf-page: 25 -->

Warehouses prioritize modeled analytics; lakes retain flexible raw data. Compare schema, data types, agility and total cost.

- Schema:
  - Data Warehouse: Schema-on-write (predefined schema before writing data)
    - Extract – Transform – Load (ETL)
  - Data Lake: Schema-on-read (schema is defined at the time of reading data)
    - Extract – Load – Transform (ELT)
- Data Types:
  - Data Warehouse: Primarily structured data
  - Data Lake: Both structured and unstructured data
- Agility:
  - Data Warehouse: Less agile due to predefined schema
  - Data Lake: More agile as it accepts raw data without a predefined structure
- Processing:
  - Data Warehouse: ETL (Extract, Transform, Load)
  - Data Lake: ELT (Extract, Load, Transform) or just Load for storage purposes
- Cost:
  - Data Warehouse: Typically more expensive because of optimizations for complex queries
  - Data Lake: Cost-effective storage solutions, but costs can rise when processing large amounts of data

## Choosing a Warehouse vs. a Lake

<!-- pdf-page: 26 -->

Choose the analytical store by the data, query pattern and governance requirement; many systems use both.

- Use a Data Warehouse when:
  - You have structured data sources and require fast and complex queries.
  - Data integration from different sources is essential.
  - Business intelligence and analytics are the primary use cases.
- Use a Data Lake when:
  - You have a mix of structured, semi-structured, or unstructured data.
  - You need a scalable and cost-effective solution to store massive amounts of data.
  - Future needs for data are uncertain, and you want flexibility in storage and processing.
  - Advanced analytics, machine learning, or data discovery are key goals.
- Often, organizations use a combination of both, ingesting raw data into a data lake and then processing and moving refined data into a data warehouse for analysis.

## Data Lakehouse

<!-- pdf-page: 27 -->

Definition: A hybrid data architecture that combines the best features of data lakes and data warehouses, aiming to provide the performance, reliability, and capabilities of a data warehouse while maintaining the flexibility, scale, and low-cost storage of data lakes.

- Characteristics:
  - Supports both structured and unstructured data.
  - Allows for schema-on-write and schema-on-read.
  - Provides capabilities for both detailed analytics and machine learning tasks.
  - Typically built on top of cloud or distributed architectures.
  - Benefits from technologies like Delta Lake, which bring ACID transactions to big data.
- Examples:
  - AWS Lake Formation (with S3 and Redshift Spectrum)
  - Delta Lake: An open-source storage layer that brings ACID transactions to Apache Spark and big data workloads.
  - Databricks Lakehouse Platform: A unified platform that combines the capabilities of data lakes and data warehouses.
  - Azure Synapse Analytics: Microsoft's analytics service that brings together big data and data warehousing.

## Data Mesh

<!-- pdf-page: 28 -->

Data mesh distributes ownership to domains while sharing governance standards and self-service infrastructure.

- Coined in 2019; it’s more about governance and organization
- Individual teams own “data products” within a given domain
- These data products serve various “use cases” around the organization
- “Domain-based data management”
- Federated governance with central standards
- Self-service tooling & infrastructure
- Data lakes, warehouses, etc. may be part of it
  - But a “data mesh” is more about the “data management paradigm” and not the specific technologies or architectures.

## ETL Pipelines

<!-- pdf-page: 29 -->

Definition: ETL stands for Extract, Transform, Load. It's a process used to move data from source systems into a data warehouse.

- Extract:
  - Retrieve raw data from source systems, which can be databases, CRMs, flat files, APIs, or other data repositories.
  - Ensure data integrity during the extraction phase.
  - Can be done in real-time or in batches, depending on requirements.

## ETL Pipelines: Transform

<!-- pdf-page: 30 -->

Convert the extracted data into a format suitable for the target data warehouse.

- Can involve various operations such as:
  - Data cleansing (e.g., removing duplicates, fixing errors)
  - Data enrichment (e.g., adding additional data from other sources)
  - Format changes (e.g., date formatting, string manipulation)
  - Aggregations or computations (e.g., calculating totals or averages)
  - Encoding or decoding data
  - Handling missing values

## ETL Pipelines: Load

<!-- pdf-page: 31 -->

Move the transformed data into the target data warehouse or another data repository.

- Can be done in batches (all at once) or in a streaming manner (as data becomes available).
- Ensure that data maintains its integrity during the loading phase.

## Managing ETL Pipelines

<!-- pdf-page: 32 -->

This process must be automated in some reliable way

- AWS Glue
- Orchestration services
  - EventBridge
  - Amazon Managed Workflows for Apache Airflow [Amazon MWAA]
  - AWS Step Functions
  - Lambda
  - Glue Workflows
- We’ll get into specific architectures later.

## Data Sources

<!-- pdf-page: 33 -->

Applications use database drivers; JDBC is Java-oriented, while ODBC exposes a language-independent interface through drivers.

- JDBC
  - Java Database Connectivity
  - Platform-independent
  - Language-dependent
- ODBC
  - Open Database Connectivity
  - Platform-dependent (thx to drivers)
  - Language-independent
- Raw logs
- API’s
- Streams

## CSV (Comma-Separated Values)

<!-- pdf-page: 35 -->

Description: Text-based format that represents data in a tabular form where each line corresponds to a row and values within a row are separated by commas.

- When to Use:
  - For small to medium datasets.
  - For data interchange between systems with different technologies.
  - For human-readable and editable data storage.
  - Importing/Exporting data from databases or spreadsheets.
- Systems: Databases (SQL-based), Excel, Pandas in Python, R, many ETL tools.

## JSON (JavaScript Object Notation)

<!-- pdf-page: 36 -->

Description: Lightweight, text-based, and human-readable data interchange format that represents structured or semi- structured data based on key-value pairs.

- When to Use:
  - Data interchange between a web server and a web client.
  - Configurations and settings for software applications.
  - Use cases that need a flexible schema or nested data structures.
- Systems: Web browsers, many programming languages (like JavaScript, Python, Java, etc.), RESTful APIs, NoSQL databases (like MongoDB).

## Avro

<!-- pdf-page: 37 -->

Description: Binary format that stores both the data and its schema, allowing it to be processed later with different systems without needing the original system's context.

- When to Use:
  - With big data and real-time processing systems.
  - When schema evolution (changes in data structure) is needed.
  - Efficient serialization for data transport between systems.
- Systems: Apache Kafka, Apache Spark, Apache Flink, Hadoop ecosystem.

## Parquet

<!-- pdf-page: 38 -->

Description: Columnar storage format optimized for analytics. Allows for efficient compression and encoding schemes.

- When to Use:
  - Analyzing large datasets with analytics engines.
  - Use cases where reading specific columns instead of entire records is beneficial.
  - Storing data on distributed systems where I/O operations and storage need optimization.
- Systems: Hadoop ecosystem, Apache Spark, Apache Hive, Apache Impala, Amazon Redshift Spectrum.

## A Very (intentionally) Incomplete Overview of Data Modeling

<!-- pdf-page: 39 -->

The enrollment star schema connects the fact table to course, student and payment dimensions through foreign keys.

- The exam guide doesn’t really talk about specific data models.
- But here’s a star schema.
  - Fact tables
  - Dimensions
  - Primary / foreign keys
- This sort of diagram is an Entity Relationship Diagram (ERD)

## Data Lineage

<!-- pdf-page: 40 -->

Lineage follows source data through transformations to outputs, making upstream dependencies and downstream impact visible.

- Description: A visual representation that traces the flow and transformation of data through its lifecycle, from its source to its final destination.
- Importance:
  - Helps in tracking errors back to their source.
  - Ensures compliance with regulations.
  - Provides a clear understanding of how data is moved, transformed, and consumed within systems.

## Data Lineage

<!-- pdf-page: 41 -->

In the illustrated lineage solution, a Spline agent observes Glue/Spark jobs; Lambda loads lineage metadata into Neptune for traversal.

- Example of capturing data lineage
  - Uses Spline Agent (for Spark) attached to Glue
  - Dump lineage data into Neptune via Lambda

## Schema Evolution

<!-- pdf-page: 42 -->

Description: The ability to adapt and change the schema of a dataset over time without disrupting existing processes or systems.

- Importance:
  - Ensures data systems can adapt to changing business requirements.
  - Allows for the addition, removal, or modification of columns/fields in a dataset.
  - Maintains backward compatibility with older data records.
- Glue Schema Registry
  - Schema discovery, compatibility, validation, registration…

## Database Performance Optimization

<!-- pdf-page: 43 -->

Partitioning distributes data for parallel work; indexing and compression address different parts of query cost.

- Indexing
  - Avoid full table scans!
  - Enforce data uniqueness and integrity
- Partitioning
  - Reduce amount of data scanned
  - Helps with data lifecycle management
  - Enables parallel processing
- Compression
  - Speed up data transfer, reduce storage & disk reads
  - GZIP, LZOP, BZIP2, ZSTD (Redshift examples)
    - Various tradeoffs between compression & speed
  - Columnar compression

## Data Sampling Techniques

<!-- pdf-page: 44 -->

Random sampling selects from the entire population; stratified sampling first divides the population into groups.

- Random Sampling
  - Everything has an equal chance
- Stratified Sampling
  - Divide population into homogenous subgroups (strata)
  - Random sample within each stratum
  - Ensures representation of each subgroup
- Others
  - Systemic, Cluster, Convenience, Judgmental

## Random Sampling

<!-- pdf-page: 45 -->

Random sampling gives each eligible item a chance of selection; highlighted items need not be regularly spaced.

## Stratified Sampling

<!-- pdf-page: 46 -->

Stratified sampling takes samples from books, music, home/garden and apparel separately, then combines them.

## Systematic sampling

<!-- pdf-page: 47 -->

Select every kth observation after choosing a starting point.

- The PDF labels this "systemic" sampling; the statistical term is systematic.
- Avoid a sampling interval that aligns with periodic structure in the population.

## Data Skew Mechanisms

<!-- pdf-page: 48 -->

A popular partition key sends disproportionate traffic to one partition; even storage distribution alone does not prevent hot keys.

- Data skew refers to the unequal distribution or imbalance of data across various nodes or partitions in distributed computing systems.
- “The celebrity problem”
  - Even partitioning doesn’t work if your traffic is uneven
  - Imagine you’re IMDb… Brad Pitt could overload his partition
- Causes:
  - Non-uniform distribution of data
  - Inadequate partitioning strategy
  - Temporal skew
- Important to monitor data distribution and alert when skew issues arise.

## Addressing data skew

<!-- pdf-page: 49 -->

Choose a partitioning strategy that reduces uneven work without changing the required result.

- Adaptive partitioning adjusts partitioning to observed data characteristics.
- Salting adds a distribution factor; account for it when joining or combining results.
- Repartitioning redistributes existing data, trading shuffle cost for a better balance.
- Sampling estimates the distribution before choosing a strategy.
- Custom partitioning applies domain-specific placement rules.

## Data validation and profiling

<!-- pdf-page: 50 -->

Check whether data is present, consistent, correct and relationally valid before trusting analysis.

- Completeness: required fields and records exist; inspect missing/null counts and populated-field percentages.
- Consistency: cross-field rules and comparisons across sources or time do not contradict each other.
- Accuracy: compare values with trusted sources, known standards and business rules.
- Integrity: preserve valid relationships and lifecycle consistency, including foreign-key/reference checks.
- Missing, contradictory, inaccurate or disconnected data can each produce misleading conclusions; report these dimensions separately.

# Section SQL and Git

## Aggregation

<!-- pdf-page: 52 -->

COUNT, SUM, AVG, MIN and MAX summarize a set of input rows.

- COUNT
  - SELECT COUNT(*) AS total_rows FROM employees;
- SUM
  - SELECT SUM(salary) AS total_salary FROM employees;
- AVG
  - SELECT AVG(salary) AS average_salary FROM employees;
- MAX / MIN
  - SELECT MAX(salary) AS highest_salary FROM employees;

## Conditional aggregation with CASE

<!-- pdf-page: 53 -->

WHERE filters input rows before grouping; CASE lets one query calculate several conditional aggregates.

- HAVING filters groups after aggregation. The PDF reverses the WHERE order in its explanation.
- COUNT(CASE WHEN condition THEN 1 END) counts matches because COUNT(expression) ignores NULL.
- SUM(CASE WHEN condition THEN amount ELSE 0 END) totals values within a condition.

```sql
SELECT
  COUNT(CASE WHEN salary > 70000 THEN 1 END) AS high_count,
  COUNT(CASE WHEN salary BETWEEN 50000 AND 70000 THEN 1 END) AS middle_count,
  COUNT(CASE WHEN salary < 50000 THEN 1 END) AS low_count
FROM employees;
```

**Current reference (checked 2026-10-13):** [Redshift WHERE and HAVING](https://docs.aws.amazon.com/redshift/latest/dg/r_HAVING_clause.html).

## Grouping

<!-- pdf-page: 54 -->

GROUP BY returns one aggregate row per distinct grouping key.

- The screenshot filters employees by join date before counting each department.
- For the pictured sample, HR has 5 qualifying rows and IT has 8; those are example results, not properties of the query.

```sql
SELECT department_id, COUNT(*) AS number_of_employees
FROM employees
WHERE join_date > '2020-01-01'
GROUP BY department_id;
```

## Multiple grouping keys and sorting

<!-- pdf-page: 55 -->

Grouping by year and product produces one row for each year/product combination.

- ORDER BY controls result order; GROUP BY alone does not guarantee a sorted result.
- The source uses YEAR(); this version uses EXTRACT for Redshift-style SQL.

```sql
SELECT EXTRACT(YEAR FROM sale_date) AS sale_year,
       product_id, SUM(amount) AS total_sales
FROM sales
GROUP BY EXTRACT(YEAR FROM sale_date), product_id
ORDER BY sale_year, total_sales DESC;
```

## Pivoting rows into report columns

<!-- pdf-page: 56 -->

A pivot turns distinct category values into output columns and aggregates the corresponding measures.

- The screenshot pivots monthly sales into January and February columns per salesperson.
- PIVOT syntax differs by database; conditional aggregation is a portable alternative.

## Pivoting with conditional aggregation

<!-- pdf-page: 57 -->

Use CASE inside an aggregate to build a cross-tab report without a dedicated PIVOT operator.

- Group by salesperson; each CASE selects the month contributing to its output column.
- The source sample shows Alice: 1000 January / 1100 February and Bob: 900 / 950.

```sql
SELECT salesperson,
  SUM(CASE WHEN month = 'Jan' THEN sales ELSE 0 END) AS jan_sales,
  SUM(CASE WHEN month = 'Feb' THEN sales ELSE 0 END) AS feb_sales
FROM sales
GROUP BY salesperson;
```

## INNER JOIN

<!-- pdf-page: 58 -->

INNER JOIN returns matching row pairs. Duplicate keys can produce multiple output rows.

## INNER JOIN worked example

<!-- pdf-page: 59 -->

Return only customers with matching payments; multiple payments produce multiple result rows.

- The screenshot is interpreted as SQL plus result semantics; individual customer/payment rows are illustrative.

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM customers c
INNER JOIN payments p
  ON c.customerNumber = p.customerNumber;
```

## LEFT OUTER JOIN

<!-- pdf-page: 60 -->

LEFT OUTER JOIN keeps every left row; unmatched right-side columns become NULL.

## LEFT JOIN worked example

<!-- pdf-page: 61 -->

Keep every customer and return NULL payment fields when no payment matches.

- The screenshot is interpreted as SQL plus result semantics; individual customer/payment rows are illustrative.

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM customers c
LEFT JOIN payments p
  ON c.customerNumber = p.customerNumber;
```

## RIGHT OUTER JOIN

<!-- pdf-page: 62 -->

RIGHT OUTER JOIN keeps every right row; unmatched left-side columns become NULL.

## RIGHT JOIN worked example

<!-- pdf-page: 63 -->

Keep every customer on the right-hand side; the preserved side depends on table order.

- The screenshot is interpreted as SQL plus result semantics; individual customer/payment rows are illustrative.

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM payments p
RIGHT JOIN customers c
  ON c.customerNumber = p.customerNumber;
```

## FULL OUTER JOIN

<!-- pdf-page: 64 -->

FULL OUTER JOIN preserves unmatched rows from both inputs and includes all matching row pairs.

## CROSS JOIN

<!-- pdf-page: 65 -->

A cross join returns the Cartesian product: m rows times n rows yields m × n combinations.

- The PDF says "CROSS OUTER JOIN"; use CROSS JOIN.
- There is no matching ON predicate in this example.

## CROSS JOIN worked example

<!-- pdf-page: 66 -->

Return every customer/payment combination, whether or not the customer numbers match.

- The screenshot is interpreted as SQL plus result semantics; individual customer/payment rows are illustrative.

```sql
SELECT c.customerName, p.paymentDate, p.amount
FROM payments p
CROSS JOIN customers c;
```

## SQL Regular Expressions

<!-- pdf-page: 67 -->

Regular expressions match patterns inside text; SQL syntax and supported operators depend on the database.

- Pattern matching
  - Think a much more powerful “LIKE”
- ~ is the regular expression operator
- ~* is case-insensitive
- !~* would mean “not match expression, case insensitive”
- Regular expression 101
  - ^ - match a pattern at the start of a string
  - $ - match a pattern at the end of a string (boo$ would match boo but not book)
  - | - alternate characters (sit|sat matches both sit and sat)
  - Ranges ([a-z] matches any lower case letter)
  - Repeats ([a-z]{4} matches any four-letter lowercase word)
  - Special metacharacters
    - \d – any digit; \w – any letter, digit, or underscore, \s – whitespace, \t – tab
- Example:
  - SELECT * FROM name WHERE name ~ * ‘^(fire|ice)’;
  - Selects any rows where the name starts with “fire” or “ice” (case insensitive)

## Git review

<!-- pdf-page: 68 -->

Git separates working files, the staging area, local commits and the remote repository.

## Common git commands

<!-- pdf-page: 69 -->

Git configuration sets identity and preferences; init and clone create a local repository in different ways.

- Setting Up and Configuration:
  - git init: Initialize a new Git repository.
  - git config: Set configuration values for user info, aliases, and more.
    - git config --global user.name "Your Name": Set your name.
    - git config --global user.email "your@email.com": Set your email.
- Basic Commands:
  - git clone <repository>: Clone (or download) a repository from an existing URL.
  - git status: Check the status of your changes in the working directory.
  - git add <filename>: Add changes in the file to the staging area.
    - git add .: Add all new and changed files to the staging area.
  - git commit -m "Commit message here": Commit the staged changes with a message.
  - git log: View commit logs.

## Branching with git

<!-- pdf-page: 70 -->

Branches diverge from a common commit and may later merge; branch pointers identify the current tip.

- git branch: List all local branches.
  - git branch <branchname>: Create a new branch.
- git checkout <branchname>: Switch to a specific branch.
  - git checkout -b <branchname>: Create a new branch and switch to it.
- git merge <branchname>: Merge the specified branch into the current branch.
- git branch -d <branchname>: Delete a branch.

## Remote repositories

<!-- pdf-page: 71 -->

git remote add <name> <url>: Add a remote repository.

- git remote: List all remote repositories.
- git push <remote> <branch>: Push a branch to a remote repository.
- git pull <remote> <branch>: Pull changes from a remote repository branch into the current local branch.

## Undoing changes

<!-- pdf-page: 72 -->

git reset: Reset your staging area to match the most recent commit, without affecting the working directory.

- git reset --hard: Reset the staging area and the working directory to match the most recent commit.
- git revert <commit>: Create a new commit that undoes all of the changes from a previous commit.

## Advanced git

<!-- pdf-page: 73 -->

git stash: Temporarily save changes that are not yet ready for a commit.

  - git stash pop: Restore the most recently stashed changes.
- git rebase <branch>: Reapply changes from one branch onto another, often used to integrate changes from one branch into another.
- git cherry-pick <commit>: Apply changes from a specific commit to the current branch.

## Git collaboration and inspection

<!-- pdf-page: 74 -->

git blame <file>: Show who made changes to a file and when.

- git diff: Show changes between commits, commit and working tree, etc.
- git fetch: Fetch changes from a remote repository without merging them.

## Git maintenance and data recovery

<!-- pdf-page: 75 -->

Git integrity checks, cleanup and the reflog support local repository maintenance and recovery.

- git fsck: Check the database for errors.
- git gc: Clean up and optimize the local repository.
- git reflog: Record when refs were updated in the local repository, useful for recovering lost commits.

# Section Object and file storage

## Section introduction

<!-- pdf-page: 78 -->

Amazon S3 is one of the main building blocks of AWS

- It’s advertised as ”infinitely scaling” storage
- Many websites use Amazon S3 as a backbone
- Many AWS services use Amazon S3 as an integration as well
- We’ll have a step-by-step approach to S3

## Amazon S3 Use cases

<!-- pdf-page: 79 -->

S3 supports object-backed storage, archives, recovery copies, content delivery and analytical lakes.

- Backup and storage
- Disaster Recovery
- Archive
- Hybrid Cloud storage
- Application hosting
- Media hosting
- Data lakes & big data analytics
- Software delivery
- Static website

## Amazon S3 - Buckets

<!-- pdf-page: 80 -->

Amazon S3 allows people to store objects (files) in “buckets” (directories)

- Buckets are defined at the region level
- S3 looks like a global service but buckets are created in a region
- Naming:
  - Shared Global Namespace – have a globally unique name (across all regions all accounts)
  - Account Regional Namespace – allows for “reuse” of the same bucket name across regions
- Naming constraints:
  - No uppercase, No underscore
  - Not an IP
  - Must start with lowercase letter or number
  - Must NOT start with the prefix xn--
  - Must NOT end with the suffix -s3alias

## Amazon S3 - Objects

<!-- pdf-page: 81 -->

An S3 object key identifies the object within its bucket; slash-separated prefixes do not create ordinary filesystem directories.

- Objects (files) have a Key
- The key is the FULL path:
  - s3://my-bucket/my_file.txt
  - s3://my-bucket/my_folder1/another_folder/my_file.txt
- The key is composed of prefix + object name
- There’s no concept of “directories” within buckets (although the UI will trick you to think otherwise)
- Just keys with very long names that contain slashes (“/”) with Objects

## Amazon S3 – Objects (cont.)

<!-- pdf-page: 82 -->

An S3 object combines its bytes with metadata, optional tags and a version identifier when versioning is enabled.

- Current correction: S3 supports objects up to 53.7 TB (48.8 TiB), commonly called 50 TB; a single PUT supports up to 5 GB. Use multipart upload for larger objects.
- Object values are the content of the body:
  - Max. Object Size is 50TB (50,000GB)
  - If uploading more than 5GB, must use “multi-part upload”
- Metadata (list of text key / value pairs – system or user metadata)
- Tags (Unicode key / value pair – up to 10) – useful for security / lifecycle
- Version ID (if versioning is enabled)

**Current reference (checked 2026-10-13):** [S3 object limits](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingObjects.html).

## Amazon S3 – Security

<!-- pdf-page: 83 -->

S3 authorization combines identity and resource policies, with explicit denies and public-access controls constraining access.

- User-Based
  - IAM Policies – which API calls should be allowed for a specific user from IAM
- Resource-Based
  - Bucket Policies – bucket wide rules from the S3 console - allows cross account
  - Object Access Control List (ACL) – finer grain (can be disabled)
  - Bucket Access Control List (ACL) – less common (can be disabled)
- Note: an IAM principal can access an S3 object if
  - The user IAM permissions ALLOW it OR the resource policy ALLOWS it
  - AND there’s no explicit DENY
- Encryption: encrypt objects in Amazon S3 using encryption keys

## S3 Bucket Policies

<!-- pdf-page: 84 -->

A bucket policy is a resource policy that scopes S3 actions by principal, resource and optional conditions.

- JSON based policies
  - Resources: buckets and objects
  - Effect: Allow / Deny
  - Actions: Set of API to Allow or Deny
  - Principal: The account or user to apply the policy to
- Use S3 bucket for policy to:
  - Grant public access to the bucket
  - Force objects to be encrypted at upload
  - Grant access to another account (Cross Account)

## Example: Public Access - Use Bucket Policy

<!-- pdf-page: 85 -->

Anonymous access requires an applicable bucket policy and public-access settings that permit it; public access is an explicit configuration choice.

## Example: User Access to S3 – IAM permissions

<!-- pdf-page: 86 -->

An IAM user's identity policy can authorize same-account S3 access, subject to all applicable policy restrictions.

## Example: EC2 instance access - Use IAM Roles

<!-- pdf-page: 87 -->

An EC2 instance uses an IAM role and temporary credentials to access S3 without embedded long-lived keys.

## Advanced: Cross-Account Access – Use Bucket Policy

<!-- pdf-page: 88 -->

Cross-account S3 access requires authorization on both sides; the destination bucket policy trusts the external principal.

## Bucket settings for Block Public Access

<!-- pdf-page: 89 -->

These settings were created to prevent company data leaks

- If you know your bucket should never be public, leave these on
- Can be set at the account level

## Amazon S3 - Versioning

<!-- pdf-page: 90 -->

Versioning retains distinct versions under the same object key; a delete marker hides the current object without erasing retained versions.

- You can version your files in Amazon S3
- It is enabled at the bucket level
- Same key overwrite will change the “version”: 1, 2, 3….
- It is best practice to version your buckets
  - Protect against unintended deletes (ability to restore a version)
  - Easy roll back to previous version
- Notes:
  - Any file that is not versioned prior to enabling versioning will have version “null”
  - Suspending versioning does not delete the previous versions

## Amazon S3 – Replication (CRR & SRR)

<!-- pdf-page: 91 -->

S3 asynchronously replicates eligible new object versions to another bucket in the same or a different Region.

- Must enable Versioning in source and destination buckets
- Cross-Region Replication (CRR)
- Same-Region Replication (SRR)
- Buckets can be in different AWS accounts
- Copying is asynchronous
- Must give proper IAM permissions to S3
- Use cases:
  - CRR – compliance, lower latency access, replication across accounts
  - SRR – log aggregation, live replication between production and test accounts

## Amazon S3 – Replication (Notes)

<!-- pdf-page: 92 -->

After you enable Replication, only new objects are replicated

- Optionally, you can replicate existing objects using S3 Batch Replication
  - Replicates existing objects and objects that failed replication
- For DELETE operations
  - Can replicate delete markers from source to target (optional setting)
  - Deletions with a version ID are not replicated (to avoid malicious deletes)
- There is no “chaining” of replication
  - If bucket 1 has replication into bucket 2, which has replication into bucket 3
  - Then objects created in bucket 1 are not replicated to bucket 3

## Amazon S3 – Replication Time Control (RTC)

<!-- pdf-page: 93 -->

Feature of Amazon S3 Replication that guarantees replication speed

- 99.99% of new objects replicated within 15 minutes
- Provides predictable, auditable replication time
- Publishes CloudWatch metrics to monitoring
- Alerts you if replication falls behind
- Can replicate to same or different AWS Region
- Helps you meet compliance or business requirements
- Extra cost per GB for the replication

## S3 Storage Classes

<!-- pdf-page: 94 -->

S3 storage classes trade storage cost, retrieval cost, access delay and resilience for different access patterns.

- Amazon S3 Standard - General Purpose
- Amazon S3 Standard-Infrequent Access (IA)
- Amazon S3 One Zone-Infrequent Access
- Amazon S3 Glacier Instant Retrieval
- Amazon S3 Glacier Flexible Retrieval
- Amazon S3 Glacier Deep Archive
- Amazon S3 Intelligent Tiering
- Can move between classes manually or using S3 Lifecycle configurations

## S3 Durability and Availability

<!-- pdf-page: 95 -->

Durability measures protection against data loss; availability measures successful access over time.

- Durability:
  - High durability (99.999999999%, 11 9’s) of objects across multiple AZ
  - If you store 10,000,000 objects with Amazon S3, you can on average expect to incur a loss of a single object once every 10,000 years
  - Same for all storage classes
- Availability:
  - Measures how readily available a service is
  - Varies depending on storage class
  - Example: S3 standard has 99.99% availability = not available 53 minutes a year

## S3 Standard – General Purpose

<!-- pdf-page: 96 -->

S3 Standard targets frequently accessed data with immediate access and multi-AZ resilience.

- 99.99% Availability
- Used for frequently accessed data
- Low latency and high throughput
- Sustain 2 concurrent facility failures
- Use Cases: Big Data analytics, mobile & gaming applications, content distribution…

## S3 Storage Classes – Infrequent Access

<!-- pdf-page: 97 -->

For data that is less frequently accessed, but requires rapid access when needed

- Lower cost than S3 Standard
- Amazon S3 Standard-Infrequent Access (S3 Standard-IA)
  - 99.9% Availability
  - Use cases: Disaster Recovery, backups
- Amazon S3 One Zone-Infrequent Access (S3 One Zone-IA)
  - High durability (99.999999999%) in a single AZ; data lost when AZ is destroyed
  - 99.5% Availability
  - Use Cases: Storing secondary backup copies of on-premises data, or data you can recreate

## Amazon S3 Glacier Storage Classes

<!-- pdf-page: 98 -->

Low-cost object storage meant for archiving / backup

- Pricing: price for storage + object retrieval cost
- Amazon S3 Glacier Instant Retrieval
  - Millisecond retrieval, great for data accessed once a quarter
  - Minimum storage duration of 90 days
- Amazon S3 Glacier Flexible Retrieval (formerly Amazon S3 Glacier):
  - Expedited (1 to 5 minutes), Standard (3 to 5 hours), Bulk (5 to 12 hours) – free
- Amazon S3 Glacier Deep Archive – for long term storage:
  - Standard (12 hours), Bulk (48 hours)
  - Minimum storage duration of 180 days

## S3 Intelligent-Tiering

<!-- pdf-page: 99 -->

Intelligent-Tiering adapts eligible objects to changing access patterns, with monitoring and optional archive-tier considerations.

- Small monthly monitoring and auto-tiering fee
- Moves objects automatically between Access Tiers based on usage
- There are no retrieval charges in S3 Intelligent-Tiering
- Frequent Access tier (automatic): default tier
- Infrequent Access tier (automatic): objects not accessed for 30 days
- Archive Instant Access tier (automatic): objects not accessed for 90 days
- Archive Access tier (optional): configurable from 90 days to 700+ days

## S3 storage-class comparison

<!-- pdf-page: 100 -->

Compare access latency, AZ resilience, retention charges and retrieval fees before comparing storage price.

- The course table describes 11-nines designed durability; durability and availability are different measures.
- Standard, Intelligent-Tiering and IA classes provide immediate access; Flexible Retrieval and Deep Archive require restore workflows.
- One Zone-IA stores data in one AZ: choose it only for reproducible or otherwise acceptable single-AZ datasets.
- Course minimum-duration examples: IA 30 days, Glacier Instant/Flexible 90 days, Deep Archive 180 days. Validate current class rules before implementation.

| Class family | Typical role | Tradeoff to check |
| --- | --- | --- |
| Standard | Frequent access | Storage price versus request volume |
| Intelligent-Tiering | Unpredictable access | Monitoring, object eligibility, optional archive tiers |
| Standard-IA / One Zone-IA | Infrequent immediate reads | Retrieval charges; single-AZ risk for One Zone |
| Glacier Instant Retrieval | Rare immediate reads | Minimum duration and retrieval cost |
| Glacier Flexible Retrieval | Archives with restore delay | Restore tier and temporary restored copy |
| Glacier Deep Archive | Long retention, hours acceptable | Longer restore time and minimum duration |

## S3 pricing: compare the complete workload

<!-- pdf-page: 101 -->

The us-east-1 dollar amounts are a course snapshot, not a current quote.

- Include storage, requests, retrieved bytes, lifecycle transitions, monitoring and transfer in the estimate.
- Frequent small reads can make the lowest per-GB storage class more expensive overall.
- The source illustrates Flexible Retrieval tiers of minutes to hours and Deep Archive restore times of hours; check the selected tier and current pricing.

**Current reference (checked 2026-10-13):** [S3 pricing](https://aws.amazon.com/s3/pricing/).

## S3 Express One Zone

<!-- pdf-page: 102 -->

S3 Express One Zone places a directory bucket in one Availability Zone; co-locating compute reduces access latency.

- High performance, single Availability Zone storage class
- Objects stored in a Directory Bucket (bucket in a single AZ)
- Handle 100,000s requests per second with single- digit millisecond latency
- Up to 10x better performance than S3 Standard (50% lower costs)
- High Durability (99.999999999%) and Availability (99.95%)
- Co-locate your storage and compute resources in the same AZ (reduces latency)
- Use cases: latency-sensitive apps, data-intensive apps, AI & ML training, financial modeling, media processing, HPC…
- Best integrated with SageMaker Model Training,

## Amazon S3 – Moving between Storage Classes

<!-- pdf-page: 103 -->

The lifecycle waterfall shows alternative permitted transitions, not a mandatory sequence. Intelligent-Tiering exits depend on the object's access tier; eligibility and minimum-duration rules still apply.

- You can transition objects between storage classes
- For infrequently accessed object, move them to Standard IA
- For archive objects that you don’t need fast access to, move them to Glacier or Glacier Deep Archive
- Moving objects can be automated using a Lifecycle Rules

**Current reference (checked 2026-10-13):** [S3 supported lifecycle transitions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html).

## Amazon S3 – Lifecycle Rules

<!-- pdf-page: 104 -->

Transition Actions – configure objects to transition to another storage class

  - Move objects to Standard IA class 60 days after creation
  - Move to Glacier for archiving after 6 months
- Expiration actions – configure objects to expire (delete) after some time
  - Access log files can be set to delete after a 365 days
  - Can be used to delete old versions of files (if versioning is enabled)
  - Can be used to delete incomplete Multi-Part uploads
- Rules can be created for a certain prefix (example: s3://mybucket/mp3/*)

## Amazon S3 – Lifecycle Rules (Scenario 1)

<!-- pdf-page: 105 -->

Your application on EC2 creates images thumbnails after profile photos are uploaded to Amazon S3. These thumbnails can be easily recreated, and only need to be kept for 60 days. The source images should be able to be immediately retrieved for these 60 days, and afterwards, the user can wait up to 6 hours. How would you design this?

- S3 source images can be on Standard, with a lifecycle configuration to transition them to Glacier after 60 days
- S3 thumbnails can be on One-Zone IA, with a lifecycle configuration to expire them (delete them) after 60 days

## Amazon S3 – Lifecycle Rules (Scenario 2)

<!-- pdf-page: 106 -->

A rule in your company states that you should be able to recover your deleted S3 objects immediately for 30 days, although this may happen rarely. After this time, and for up to 365 days, deleted objects should be recoverable within 48 hours.

- Enable S3 Versioning in order to have object versions, so that “deleted objects” are in fact hidden by a “delete marker” and can be recovered
- Transition the “noncurrent versions” of the object to Standard IA
- Transition afterwards the “noncurrent versions” to Glacier Deep Archive

## Amazon S3 Analytics – Storage Class Analysis

<!-- pdf-page: 107 -->

S3 storage-class analysis produces reports to inform lifecycle decisions; recommendations do not themselves move objects.

- Help you decide when to transition objects to the right storage class
- Recommendations for Standard and Standard IA
  - Does NOT work for One-Zone IA or Glacier
- Report is updated daily
- 24 to 48 hours to start seeing data analysis
- Good first step to put together Lifecycle Rules (or improve them)!

## S3 Event Notifications

<!-- pdf-page: 108 -->

S3 object events can notify SNS, SQS or Lambda; configure the supported event types and filters.

- S3:ObjectCreated, S3:ObjectRemoved, S3:ObjectRestore, S3:Replication…
- Object name filtering possible (*.jpg)
- Use case: generate thumbnails of images uploaded to S3
- Can create as many “S3 events” as desired
- S3 event notifications typically deliver events in seconds but can sometimes take a minute or longer

## S3 Event Notifications – IAM Permissions

<!-- pdf-page: 109 -->

Notification destinations need resource policies allowing the S3 service to publish, send or invoke as appropriate.

## S3 Event Notifications with Amazon EventBridge

<!-- pdf-page: 110 -->

S3 events enter EventBridge, where rules filter event detail and route to configured targets.

- Advanced filtering options with JSON rules (metadata, object size, name...)
- Multiple Destinations – ex Step Functions, Kinesis Streams / Firehose…
- EventBridge Capabilities – Archive, Replay Events, Reliable delivery

## S3 – Baseline Performance

<!-- pdf-page: 111 -->

Amazon S3 automatically scales to high request rates, latency 100- 200 ms

- Your application can achieve at least 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD requests per second per prefix in a bucket.
- There are no limits to the number of prefixes in a bucket.
- Example (object path => prefix):
  - bucket/folder1/sub1/file => /folder1/sub1/
  - bucket/folder1/sub2/file => /folder1/sub2/
  - bucket/1/file => /1/
  - bucket/2/file => /2/
- If you spread reads across all four prefixes evenly, you can achieve 22,000 requests per second for GET and HEAD

## S3 Performance

<!-- pdf-page: 112 -->

Multipart upload sends parts in parallel; Transfer Acceleration routes uploads through an edge location toward the destination bucket.

- Multi-Part upload:
  - recommended for files > 100MB, must use for files > 5GB
  - Can help parallelize uploads (speed up transfers)
                        - S3 Transfer Acceleration
                          - Increase transfer speed by transferring file to an AWS edge location which will forward the data to the S3 bucket in the target region
                          - Compatible with multi-part upload

## S3 Performance – S3 Byte-Range Fetches

<!-- pdf-page: 113 -->

Byte-range GETs can download separate ranges concurrently or retrieve only a file header.

- Parallelize GETs by requesting specific byte ranges
- Better resilience in case of failures

## Amazon S3 – Object Encryption

<!-- pdf-page: 114 -->

You can encrypt objects in S3 buckets using one of the following methods

- Server-Side Encryption (SSE)
  - Server-Side Encryption with Amazon S3-Managed Keys (SSE-S3) – Enabled by Default
  - Server-Side Encryption with KMS Keys stored in AWS KMS (SSE-KMS)
  - Dual-Layer Server-Side Encryption with KMS Keys (DSSE-KMS)
  - Server-Side Encryption with Customer-Provided Keys (SSE-C)
- Client-Side Encryption
- It’s important to understand which ones are for which situation for the exam

## Amazon S3 Encryption – SSE-S3

<!-- pdf-page: 115 -->

With SSE-S3, S3 encrypts the received object using keys managed by S3; TLS separately protects upload transport.

- Encryption using keys handled, managed, and owned by AWS
- Object is encrypted server-side
- Encryption type is AES-256
- Must set header "x-amz-server-side-encryption": "AES256"
- Enabled by default for new buckets & new objects

## Amazon S3 Encryption – SSE-KMS

<!-- pdf-page: 116 -->

With SSE-KMS, S3 integrates with KMS for key authorization and data-key operations, then stores the encrypted object.

- Encryption using keys handled and managed by AWS KMS (Key Management Service)
- KMS advantages: user control + audit key usage using CloudTrail
- Object is encrypted server side
- Must set header "x-amz-server-side-encryption": "aws:kms"

## SSE-KMS Limitation

<!-- pdf-page: 117 -->

SSE-KMS operations depend on both S3 and KMS capacity; key-operation quotas can become a bottleneck.

- If you use SSE-KMS, you may be impacted by the KMS limits
- When you upload, it calls the GenerateDataKey KMS API
- When you download, it calls the Decrypt KMS API
- Count towards the KMS quota per second (5500, 10000, 30000 req/s based on region)
- You can request a quota increase using the Service Quotas Console

## Amazon S3 Encryption – DSSE-KMS

<!-- pdf-page: 118 -->

DSSE-KMS applies two independent encryption layers, combining KMS-controlled key use with an additional S3-managed layer.

- Dual-Layer Server-Side Encryption using keys handled and managed by AWS KMS
- Object is encrypted twice server side: KMS Key (1st layer) + S3 Managed Key (2nd layer)
- For compliance standards requiring multi-layer encryption (higher cost & latency than SSE-KMS)
- Must set header "x-amz-server-side-encryption": "aws:kms:dsse"

## Amazon S3 Encryption – SSE-C

<!-- pdf-page: 119 -->

SSE-C performs encryption in S3 using a customer-provided key sent over HTTPS; S3 does not retain that key for later requests.

- Server-Side Encryption using keys fully managed by the customer outside of AWS
- Amazon S3 does NOT store the encryption key you provide
- HTTPS must be used
- Encryption key must provided in HTTP headers, for every HTTP request made

## Amazon S3 Encryption – Client-Side Encryption

<!-- pdf-page: 120 -->

Client-side encryption encrypts the object before upload; the client manages encryption and decryption.

- Use client libraries such as Amazon S3 Client-Side Encryption Library
- Clients must encrypt data themselves before sending to Amazon S3
- Clients must decrypt data themselves when retrieving from Amazon S3
- Customer fully manages the keys and encryption cycle

## Amazon S3 – Encryption in transit (SSL/TLS)

<!-- pdf-page: 121 -->

TLS protects S3 traffic in transit independently of object encryption at rest.

- Encryption in flight is also called SSL/TLS
- Amazon S3 exposes two endpoints:
  - HTTP Endpoint – non encrypted
  - HTTPS Endpoint – encryption in flight
- HTTPS is recommended
- HTTPS is mandatory for SSE-C
- Most clients would use the HTTPS endpoint by default

## Amazon S3 – Force Encryption in Transit aws:SecureTransport

<!-- pdf-page: 122 -->

A bucket-policy explicit deny on aws:SecureTransport=false rejects unencrypted transport even if another policy allows the action.

## Amazon S3 – Default Encryption vs. Bucket Policies

<!-- pdf-page: 123 -->

SSE-S3 encryption is automatically applied to new objects stored in S3 bucket

- Optionally, you can “force encryption” using a bucket policy and refuse any API call to PUT an S3 object without encryption headers
- Note: Bucket Policies are evaluated before “Default Encryption”

## S3 – Access Points

<!-- pdf-page: 124 -->

Separate access points apply application-specific permissions to shared S3 data; they do not create separate copies of the bucket.

- Access Points simplify security management for S3 Buckets
- Each Access Point has:
  - its own DNS name (Internet Origin or VPC Origin)
  - an access point policy (similar to bucket policy) – manage security at scale

## S3 – Access Points – VPC Origin

<!-- pdf-page: 125 -->

A VPC-origin S3 access point is reached through a gateway endpoint; endpoint, access-point and bucket policies all participate.

- We can define the access point to be accessible only from within the VPC
- You must create a VPC Endpoint to access the Access Point (Gateway or Interface Endpoint)
- The VPC Endpoint Policy must allow access to the target bucket and Access Point

## S3 Tables

<!-- pdf-page: 126 -->

The heart of Amazon’s data lakehouse system they are building out

  - This seems to be the direction AWS is converging on as a data platform
  - Combined with Amazon Sagemaker Lakehouse
- A managed data lake solution
- Built around “Table Buckets”
  - These store data in Apache Iceberg format
  - So you can just issue SQL queries through anything that supports Iceberg

## Wait,what’s Iceberg?

<!-- pdf-page: 127 -->

Iceberg is an open table format that adds transaction and metadata management to lake files.

- Apache Iceberg is a table format for data lakes
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
- New preferred AWS interface: Amazon Sagemaker Lakehouse
- Works with Spark, Flink, Trino, Presto, Hive
- Integrated with AWS Glue, Redshift, EMR and Athena

## Iceberg means S3 Tables is compatible with a lot of stuff

<!-- pdf-page: 128 -->

S3 Tables exposes Iceberg-compatible tabular data to supported engines; the Glue catalog and Iceberg REST endpoint provide metadata access paths.

## Features of S3 Tables

<!-- pdf-page: 129 -->

S3 Tables provides purpose-built storage and maintenance for Iceberg tables; feature support is a dated course snapshot.

- Purpose-built for tabular data
  - Better than just storing data in S3 buckets
  - Up to 3X faster performance, 10X more transaction rate
- But it’s more expensive
- Managed table optimization
  - Compaction
  - Snapshot management
  - Unreferenced file removal
- IAM and Service Control Policies (Amazon Organizations) integration
  - New, distinct service namespace: s3tables

## Table Buckets

<!-- pdf-page: 130 -->

Table buckets contain namespaces, which organize Iceberg tables; these are not ordinary object-key folders.

- arn’s are also under s3tables namespace
  - arn:aws:s3tables:Region:OwnerAccountID:bucket/bucke t-name
- Table buckets contain tables, which may be organized into namespaces
  - This is the same concept as a “database” in other services, which contains multiple, related tables
- Types of table buckets
  - Customer-managed
  - AWS-managed (S3 metadata table, inventory tables)
- Names only need to be unique within your account
  - Must be lowercase! Or won’t integrate with Lake Formation / Glue
  - Same restriction on namespaces
  - Cannot be changed
- May have IAM policies attached
- May have tags attached

## S3 Tables Intelligent-Tiering

<!-- pdf-page: 131 -->

The course's S3 Tables tiering example uses 30 and 90 days of inactivity; table access returns a colder table to frequent access. Timings are a dated course snapshot.

- Cost optimization feature
  - Automatically move data between storage tiers based on access frequency
- Frequent Access (Standard)
  - Default; accessing a table will move it back here.
  - Compaction table maintenance only occurs in this tier
- Infrequent Access
  - If data untouched for 30 days
- Archive Instant Access
  - If data untouched for 90 days
- All tiers have 99.9% availability and 99.999999999% durability

## S3 Tables Replication

<!-- pdf-page: 132 -->

Table replication creates read-only replicas for backup, compliance or local reads; replicas are not independent writable primaries.

- Automatic replication for backup / availability / compliance
- Read-only replicas
  - Potentially across regions and across accounts
- Use cases
  - Minimize latency with local replicas
  - Centralize analytics by replicating into a single region
  - Compliance / data residency
  - Test / devo environments
- Intelligent tiering can apply to replicas to minimize cost

## S3 Tables Security

<!-- pdf-page: 133 -->

The standard tools apply to table buckets and tables

  - IAM identity-based policies (user, group, or role)
  - Resource-based policies
  - Amazon Organizations Service Control Policies (SCP’s)
- Other access management tools
  - SQL commands (operations map to specific IAM permissions)
  - Lake Formation
- Encryption
  - SSE-S3 or SSE-KMS
- VPC endpoints via PrivateLink
  - Gateway and Interface endpoints (for finer-grained control)
  - Endpoint policies may restrict by table or bucket
  - Dual-stack IPv4 and IPv6 endpoints
- Public access and HTTP not allowed

## S3 – Storage Lens

<!-- pdf-page: 134 -->

Storage Lens aggregates organization, account, Region and bucket metrics into dashboards and optional exports.

- Understand, analyze, and optimize storage across entire AWS Organization
- Discover anomalies, identify cost efficiencies, and apply data protection best practices across entire AWS Organization (30 days usage & activity metrics)
- Aggregate data for Organization, specific accounts, regions, buckets, or prefixes
- Default dashboard or create your own dashboards
- Can be configured to export metrics daily to an S3 bucket (CSV, Parquet)

## Storage Lens – Default Dashboard

<!-- pdf-page: 135 -->

Visualize summarized insights and trends for both free and advanced metrics

- Default dashboard shows Multi-Region and Multi-Account data
- Preconfigured by Amazon S3
- Can’t be deleted, but can be disabled

## Storage Lens – Metrics

<!-- pdf-page: 136 -->

Storage Lens summary metrics describe storage volume, object counts and activity across a chosen scope.

- Summary Metrics
  - General insights about your S3 storage
  - StorageBytes, ObjectCount…
  - Use cases: identify the fastest-growing (or not used) buckets and prefixes
- Cost-Optimization Metrics
  - Provide insights to manage and optimize your storage costs
  - NonCurrentVersionStorageBytes, IncompleteMultipartUploadStorageBytes…
  - Use cases: identify buckets with incomplete multipart uploaded older than 7 days, Identify which objects could be transitioned to lower-cost storage class

## Storage Lens – Metrics

<!-- pdf-page: 137 -->

Storage Lens data-protection metrics reveal adoption of protection controls across buckets.

- Data-Protection Metrics
  - Provide insights for data protection features
  - VersioningEnabledBucketCount, MFADeleteEnabledBucketCount, SSEKMSEnabledBucketCount, CrossRegionReplicationRuleCount…
  - Use cases: identify buckets that aren’t following data-protection best practices
- Access-management Metrics
  - Provide insights for S3 Object Ownership
  - ObjectOwnershipBucketOwnerEnforcedBucketCount…
  - Use cases: identify which Object Ownership settings your buckets use
- Event Metrics
  - Provide insights for S3 Event Notifications
  - EventNotificationEnabledBucketCount (identify which buckets have S3 Event Notifications configured)

## Storage Lens – Metrics

<!-- pdf-page: 138 -->

Storage Lens performance metrics help distinguish request activity, errors and latency signals.

- Performance Metrics
  - Provide insights for S3 Transfer Acceleration
  - TransferAccelerationEnabledBucketCount (identify which buckets have S3 Transfer Acceleration enabled)
- Activity Metrics
  - Provide insights about how your storage is requested
  - AllRequests, GetRequests, PutRequests, ListRequests, BytesDownloaded…
- Detailed Status Code Metrics
  - Provide insights for HTTP status codes
  - 200OKStatusCount, 403ForbiddenErrorCount, 404NotFoundErrorCount…

## Storage Lens – Free vs. Paid

<!-- pdf-page: 139 -->

Storage Lens free and paid metric sets differ in detail, retention and available capabilities.

- Free Metrics
  - Automatically available for all customers
  - Contains around 28 usage metrics
  - Data is available for queries for 14 days
- Advanced Metrics and Recommendations
  - Additional paid metrics and features
  - Advanced Metrics – Activity, Advanced Cost Optimization, Advanced Data Protection, Status Code
  - CloudWatch Publishing – Access metrics in CloudWatch without additional charges
  - Prefix Aggregation – Collect metrics at the prefix level
  - Data is available for queries for 15 months

## What’s an EBS Volume?

<!-- pdf-page: 141 -->

An EBS (Elastic Block Store) Volume is a network drive you can attach to your instances while they run

- It allows your instances to persist data, even after their termination
- They can only be mounted to one instance at a time (at the CCP level)
- They are bound to a specific availability zone
- Analogy: Think of them as a “network USB stick”

## EBS Volume

<!-- pdf-page: 142 -->

EBS exposes network-attached block storage to supported compute within an Availability Zone.

- It’s a network drive (i.e. not a physical drive)
  - It uses the network to communicate the instance, which means there might be a bit of latency
  - It can be detached from an EC2 instance and attached to another one quickly
- It’s locked to an Availability Zone (AZ)
  - An EBS Volume in us-east-1a cannot be attached to us-east-1b
  - To move a volume across, you first need to snapshot it
- Have a provisioned capacity (size in GBs, and IOPS)
  - You get billed for all the provisioned capacity
  - You can increase the capacity of the drive over time

## EBS Volume - Example

<!-- pdf-page: 143 -->

EBS volumes belong to one Availability Zone and may remain unattached; the example includes multiple volumes on one instance.

## EBS – Delete on Termination attribute

<!-- pdf-page: 144 -->

Controls the EBS behaviour when an EC2 instance terminates

  - By default, the root EBS volume is deleted (attribute enabled)
  - By default, any other attached EBS volume is not deleted (attribute disabled)
- This can be controlled by the AWS console / AWS CLI
- Use case: preserve root volume when instance is terminated

## Amazon EBS Elastic Volumes

<!-- pdf-page: 145 -->

You don’t have to detach a volume or restart your instance to change it!

  - Just go to actions / modify volume from the console
- Increase volume size
  - You can only increase, not decrease
- Change volume type
  - Gp2 -> Gp3
  - Specify desired IOPS or throughput performance (or it will guess)
- Adjust performance
  - Increase or decrease

## Amazon EFS – Elastic File System

<!-- pdf-page: 146 -->

EFS offers a shared NFS filesystem to compute instances across Availability Zones through mount targets.

- Managed NFS (network file system) that can be mounted on many EC2
- EFS works with EC2 instances in multi-AZ
- Highly available, scalable, expensive (3x gp2), pay per use

## Amazon EFS – Elastic File System

<!-- pdf-page: 147 -->

Use cases: content management, web serving, data sharing, Wordpress

- Uses NFSv4.1 protocol
- Uses security group to control access to EFS
- Compatible with Linux based AMI (not Windows)
- Encryption at rest using KMS
- POSIX file system (~Linux) that has a standard file API
- File system scales automatically, pay-per-use, no capacity planning!

## EFS – Performance & Storage Classes

<!-- pdf-page: 148 -->

EFS performance choices and storage-class choices solve different throughput, latency and cost requirements.

- EFS Scale
  - 1000s of concurrent NFS clients, 10 GB+ /s throughput
  - Grow to Petabyte-scale network file system, automatically
- Performance Mode (set at EFS creation time)
  - General Purpose (default) – latency-sensitive use cases (web server, CMS, etc…)
  - Max I/O – higher latency, throughput, highly parallel (big data, media processing)
- Throughput Mode
  - Bursting – 1 TB = 50MiB/s + burst of up to 100MiB/s
  - Provisioned – set your throughput regardless of storage size, ex: 1 GiB/s for 1 TB storage
  - Elastic – automatically scales throughput up or down based on your workloads
    - Up to 3GiB/s for reads and 1GiB/s for writes
    - Used for unpredictable workloads

## EFS – Storage Classes

<!-- pdf-page: 149 -->

EFS lifecycle policies move eligible files between storage tiers; Standard and One Zone describe a separate availability choice.

- Storage Tiers (lifecycle management feature – move file after N days)
  - Standard: for frequently accessed files
  - Infrequent access (EFS-IA): cost to retrieve files, lower price to store.
  - Archive: rarely accessed data (few times each year), 50% cheaper
  - Implement lifecycle policies to move files between storage tiers
- Availability and durability
  - Standard: Multi-AZ, great for prod
  - One Zone: One AZ, great for dev, backup enabled by default, compatible with IA (EFS One Zone-IA)
- Over 90% in cost savings

## EBS vs EFS – Elastic Block Storage

<!-- pdf-page: 150 -->

To move EBS data between Availability Zones, snapshot the source volume and restore a new volume in the target AZ.

- EBS volumes…
  - one instance (except multi-attach io1/io2)
  - are locked at the Availability Zone (AZ) level
  - gp2: IO increases if the disk size increases
  - gp3 & io1: can increase IO independently
- To migrate an EBS volume across AZ
  - Take a snapshot
  - Restore the snapshot to another AZ
  - EBS backups use IO and you shouldn’t run them while your application is handling a lot of traffic
- Root EBS Volumes of instances get terminated by default if the EC2

## EBS vs EFS – Elastic File System

<!-- pdf-page: 151 -->

EFS clients in separate AZs mount one shared filesystem; EBS ordinarily supplies block storage to an instance in one AZ.

- Mounting 100s of instances across AZ
- EFS share website files (WordPress)
- Only for Linux Instances (POSIX)
- EFS has a higher price point than EBS
- Can leverage Storage Tiers for cost savings
- Remember: EFS vs EBS vs Instance

## AWS Backup

<!-- pdf-page: 152 -->

AWS Backup centralizes policy-based protection of supported resources.

- Fully managed service
- Centrally manage and automate backups across AWS services
- No need to create custom scripts and manual processes
- Supported services:
  - Amazon EC2 / Amazon EBS
  - Amazon S3
  - Amazon RDS (all DBs engines) / Amazon Aurora / Amazon DynamoDB
  - Amazon DocumentDB / Amazon Neptune
  - Amazon EFS / Amazon FSx (Lustre & Windows File Server)
  - AWS Storage Gateway (Volume Gateway)
- Supports cross-region backups
- Supports cross-account backups

## AWS Backup

<!-- pdf-page: 153 -->

Backup plans, recovery options and resource support determine whether a backup meets the recovery requirement.

- Supports PITR for supported services
- On-Demand and Scheduled backups
- Tag-based backup policies
- You create backup policies known as Backup Plans
  - Backup frequency (every 12 hours, daily, weekly, monthly, cron expression)
  - Backup window
  - Transition to Cold Storage (Never, Days, Weeks, Months, Years)
  - Retention Period (Always, Days, Weeks, Months, Years)

## AWS Backup

<!-- pdf-page: 154 -->

A backup plan defines frequency and retention, assigns supported resources and writes recovery points to a backup vault.

## AWS Backup Vault Lock

<!-- pdf-page: 155 -->

Vault Lock protects recovery points with retention controls; compliance-mode immutability applies after its changeable period.

- Enforce a WORM (Write Once Read Many) state for all the backups that you store in your AWS Backup Vault
- Additional layer of defense to protect your backups against:
  - Inadvertent or malicious delete operations
  - Updates that shorten or alter retention periods
- Even the root user cannot delete backups when enabled

# Section Databases and warehouses

## Traditional Architecture

<!-- pdf-page: 158 -->

A conventional web tier scales behind a load balancer while a relational database holds shared state.

- Traditional applications leverage RDBMS databases
- These databases have the SQL query language
- Strong requirements about how the data should be modeled
- Ability to do query joins, aggregations, complex computations
- Vertical scaling (getting a more powerful CPU / RAM / IO)
- Horizontal scaling (increasing reading capability by adding EC2 / RDS Read Replicas)

## NoSQL databases

<!-- pdf-page: 159 -->

NoSQL databases are non-relational databases and are distributed

- NoSQL databases include MongoDB, DynamoDB, …
- NoSQL databases do not support query joins (or just limited support)
- All the data that is needed for a query is present in one row
- NoSQL databases don’t perform aggregations such as “SUM”, “AVG”, …
- NoSQL databases scale horizontally
- There’s no “right or wrong” for NoSQL vs SQL, they just require to model the data differently and think about user queries

## Amazon DynamoDB

<!-- pdf-page: 160 -->

Fully managed, highly available with replication across multiple AZs

- NoSQL database - not a relational database
- Scales to massive workloads, distributed database
- Millions of requests per seconds, trillions of row, 100s of TB of storage
- Fast and consistent in performance (low latency on retrieval)
- Integrated with IAM for security, authorization and administration
- Enables event driven programming with DynamoDB Streams
- Low cost and auto-scaling capabilities

## DynamoDB - Basics

<!-- pdf-page: 161 -->

A DynamoDB table stores key-identified items with flexible non-key attributes and a 400 KB item-size limit.

- DynamoDB is made of Tables
- Each table has a Primary Key (must be decided at creation time)
- Each table can have an infinite number of items (= rows)
- Each item has attributes (can be added over time – can be null)
- Maximum size of an item is 400KB
- Data types supported are:
  - Scalar Types – String, Number, Binary, Boolean, Null
  - Document Types – List, Map
  - Set Types – String Set, Number Set, Binary Set

## DynamoDB – Primary Keys

<!-- pdf-page: 162 -->

A simple DynamoDB primary key consists of a partition key; its value uniquely identifies an item.

- Option 1: Partition Key (HASH)
  - Partition key must be unique for each item
  - Partition key must be “diverse” so that the data is distributed
  - Example: “User_ID” for a users table

## DynamoDB – Primary Keys

<!-- pdf-page: 163 -->

A composite key identifies an item by partition key plus sort key. Items with the same partition key form an ordered collection.

- Option 2: Partition Key + Sort Key (HASH + RANGE)
  - The combination must be unique for each item
  - Data is grouped by partition key
  - Example: users-games table, “User_ID” for Partition Key and “Game_ID” for Sort Key

## DynamoDB – Partition Keys (Exercise)

<!-- pdf-page: 164 -->

A good movie-table partition key distributes data and traffic while matching the required access pattern.

- We’re building a movie database
- What is the best Partition Key to maximize data distribution?
  - movie_id
  - producer_name
  - leader_actor_name
  - movie_language
- “movie_id” has the highest cardinality so it’s a good candidate
- “movie_language” doesn’t take many values and may be skewed towards English so it’s not a great choice for the Partition Key

## DynamoDB in Big Data

<!-- pdf-page: 165 -->

DynamoDB fits predictable key-based low-latency access; model the access pattern before selecting it.

- Common use cases include:
  - Mobile apps
  - Gaming
  - Digital ad serving
  - Live voting
  - Audience interaction for live events
  - Sensor networks
  - Log ingestion
  - Access control for web-based content
  - Metadata storage for Amazon S3 objects
  - E-commerce shopping carts
  - Web session management
                        - Anti Pattern
                          - Prewritten application tied to a traditional relational database: use RDS instead
                          - Joins or complex transactions
                          - Binary Large Object (BLOB) data: store data in S3 & metadata in DynamoDB
                          - Large data with low I/O rate: use S3 instead

## DynamoDB capacity modes

<!-- pdf-page: 166 -->

Provisioned capacity and on-demand capacity express different planning and billing choices.

- Provisioned: configure RCU/WCU, optionally with Auto Scaling; suitable when capacity can be planned.
- On-demand: pay for read/write requests and let the service manage throughput within its scaling behavior and quotas.
- Do not memorize the slide's default-mode or once-per-day switching claims as universal; mode changes have documented direction-specific limits.

**Current reference (checked 2026-10-13):** [DynamoDB capacity modes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html).

## R/W Capacity Modes – Provisioned

<!-- pdf-page: 167 -->

Table must have provisioned read and write capacity units

- Read Capacity Units (RCU) – throughput for reads
- Write Capacity Units (WCU) – throughput for writes
- Option to setup auto-scaling of throughput to meet demand
- Throughput can be exceeded temporarily using “Burst Capacity”
- If Burst Capacity has been consumed, you’ll get a “ProvisionedThroughputExceededException”
- It’s then advised to do an exponential backoff retry

## DynamoDB – Write Capacity Units (WCU)

<!-- pdf-page: 168 -->

For provisioned standard writes, round each item up to 1 KB and multiply by writes per second; transactional writes cost twice as much.

- One Write Capacity Unit (WCU) represents one write per second for an item up to 1 KB in size
- If the items are larger than 1 KB, more WCUs are consumed
- Example 1: we write 10 items per second, with item size 2 KB
  - We need 10 ∗(
- Example 2: we write 6 items per second, with item size 4.5 KB
  - We need 6 ∗( 1 𝐾𝐵) = 30 𝑊𝐶𝑈𝑠 (4.5 gets rounded to the upper KB)
- Example 3: we write 120 items per minute, with item size 2 KB
  - We need

## Strongly Consistent Read vs. Eventually Consistent Read

<!-- pdf-page: 169 -->

An eventually consistent read can briefly lag a completed write. Strongly consistent reads return the latest successful write where supported.

- Eventually Consistent Read (default)
  - If we read just after a write, it’s possible we’ll get some stale data because of replication
- Strongly Consistent Read
  - If we read just after a write, we will get the correct data
  - Set “ConsistentRead” parameter to True in API calls (GetItem, BatchGetItem, Query, Scan)

## DynamoDB – Read Capacity Units (RCU)

<!-- pdf-page: 170 -->

Round each item up to 4 KB. Strong reads use one RCU per unit per second; eventual reads use half and transactional reads use two.

- One Read Capacity Unit (RCU) represents one Strongly Consistent Read per second, or two Eventually Consistent Reads per second, for an item up to 4 KB in size
- If the items are larger than 4 KB, more RCUs are consumed
- Example 1: 10 Strongly Consistent Reads per second, with item size 4 KB
  - We need 10 ∗ 4 𝐾𝐵= 10 𝑅𝐶𝑈𝑠
- Example 2: 16 Eventually Consistent Reads per second, with item size 12 KB
  - We need 16
- Example 3: 10 Strongly Consistent Reads per second, with item size 6 KB

## DynamoDB – Partitions Internal

<!-- pdf-page: 171 -->

DynamoDB hashes the partition-key value to place data; uneven key traffic can create a hot partition.

- Data is stored in partitions
- Partition Keys go through a hashing algorithm to know to which partition they go to
- To compute the number of partitions:
  - # 𝑜𝑓 𝑝𝑎𝑟𝑡𝑖𝑡𝑖𝑜𝑛𝑠𝑏𝑦 𝑐𝑎𝑝𝑎𝑐𝑖𝑡𝑦= + ( )
  - # 𝑜𝑓 𝑝𝑎𝑟𝑡𝑖𝑡𝑖𝑜𝑛𝑠𝑏𝑦 𝑠𝑖𝑧𝑒=
  - # 𝑜𝑓 𝑝𝑎𝑟𝑡𝑖𝑡𝑖𝑜𝑛𝑠= ceil(max # 𝑜𝑓 𝑝𝑎𝑟𝑡𝑖𝑡𝑖𝑜𝑛𝑠𝑏𝑦 𝑐𝑎𝑝𝑎𝑐𝑖𝑡𝑦, # 𝑜𝑓 𝑝𝑎𝑟𝑡𝑖𝑡𝑖𝑜𝑛𝑠𝑏𝑦 𝑠𝑖𝑧𝑒)
- WCUs and RCUs are spread evenly across partitions

## DynamoDB – Throttling

<!-- pdf-page: 172 -->

If we exceed provisioned RCUs or WCUs, we get “ProvisionedThroughputExceededException”

- Reasons:
  - Hot Keys – one partition key is being read too many times (e.g., popular item)
  - Hot Partitions
  - Very large items, remember RCU and WCU depends on size of items
- Solutions:
  - Exponential backoff when exception is encountered (already in SDK)
  - Distribute partition keys as much as possible
  - If RCU issue, we can use DynamoDB Accelerator (DAX)

## DynamoDB on-demand: capacity still has limits

<!-- pdf-page: 173 -->

On-demand removes explicit RCU/WCU provisioning, but does not eliminate throttling.

- Hot partitions, table/account quotas, configured maximum throughput and rapid workload changes can still limit requests.
- Billing uses read/write request units; the item-size and consistency multipliers still matter.
- Choose it for uncertain or variable traffic. Compare actual utilization and prices instead of memorizing the PDF's 2.5× price ratio.

**Current reference (checked 2026-10-13):** [DynamoDB throttling causes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingThrottling.html).

## DynamoDB – Writing Data

<!-- pdf-page: 174 -->

DynamoDB write APIs differ in whether they replace an item, update attributes or perform grouped work.

- PutItem
  - Creates a new item or fully replace an old item (same Primary Key)
  - Consumes WCUs
- UpdateItem
  - Edits an existing item’s attributes or adds a new item if it doesn’t exist
  - Can be used to implement Atomic Counters – a numeric attribute that’s unconditionally incremented
- Conditional Writes
  - Accept a write/update/delete only if conditions are met, otherwise returns an error
  - Helps with concurrent access to items
  - No performance impact

## DynamoDB – Reading Data

<!-- pdf-page: 175 -->

GetItem reads by the complete primary key; use projections and consistency settings deliberately.

- GetItem
  - Read based on Primary key
  - Primary Key can be HASH or HASH+RANGE
  - Eventually Consistent Read (default)
  - Option to use Strongly Consistent Reads (more RCU - might take longer)
  - ProjectionExpression can be specified to retrieve only certain attributes

## DynamoDB – Reading Data (Query)

<!-- pdf-page: 176 -->

Query selects one partition-key value and can narrow the sort-key range; a filter is applied after reading.

- Query returns items based on:
  - KeyConditionExpression
    - Partition Key value (must be = operator) – required
    - Sort Key value (=, <, <=, >, >=, Between, Begins with) – optional
  - FilterExpression
    - Additional filtering after the Query operation (before data returned to you)
    - Use only with non-key attributes (does not allow HASH or RANGE attributes)
- Returns:
  - The number of items specified in Limit
  - Or up to 1 MB of data
- Ability to do pagination on the results
- Can query table, a Local Secondary Index, or a Global Secondary Index

## DynamoDB – Reading Data (Scan)

<!-- pdf-page: 177 -->

Scan the entire table and then filter out data (inefficient)

- Returns up to 1 MB of data – use pagination to keep on reading
- Consumes a lot of RCU
- Limit impact using Limit or reduce the size of the result and pause
- For faster performance, use Parallel Scan
  - Multiple workers scan multiple data segments at the same time
  - Increases the throughput and RCU consumed
  - Limit the impact of parallel scans just like you would for Scans
- Can use ProjectionExpression & FilterExpression (no changes to RCU)

## DynamoDB – Deleting Data

<!-- pdf-page: 178 -->

Deletion APIs remove individual or batched items; conditions help guard concurrent changes.

- DeleteItem
  - Delete an individual item
  - Ability to perform a conditional delete
- DeleteTable
  - Delete a whole table and all its items
  - Much quicker deletion than calling DeleteItem on all items

## DynamoDB – Batch Operations

<!-- pdf-page: 179 -->

Allows you to save in latency by reducing the number of API calls

- Operations are done in parallel for better efficiency
- Part of a batch can fail; in which case we need to try again for the failed items
- BatchWriteItem
  - Up to 25 PutItem and/or DeleteItem in one call
  - Up to 16 MB of data written, up to 400 KB of data per item
  - Can’t update items (use UpdateItem)
  - UnprocessedItems for failed write operations (exponential backoff or add WCU)
- BatchGetItem
  - Return items from one or more tables
  - Up to 100 items, up to 16 MB of data
  - Items are retrieved in parallel to minimize latency
  - UnprocessedKeys for failed read operations (exponential backoff or add RCU)

## DynamoDB – PartiQL

<!-- pdf-page: 180 -->

SQL-compatible query language for DynamoDB

- Allows you to select, insert, update, and delete data in DynamoDB using SQL
- Run queries across multiple DynamoDB tables
- Run PartiQL queries from:
  - AWS Management Console
  - NoSQL Workbench for DynamoDB
  - DynamoDB APIs
  - AWS CLI
  - AWS SDK

## DynamoDB – Local Secondary Index (LSI)

<!-- pdf-page: 181 -->

An LSI retains the base table's partition key and supplies another sort key within that item collection.

- Alternative Sort Key for your table (same Partition Key as that of base table)
- The Sort Key consists of one scalar attribute (String, Number, or Binary)
- Up to 5 Local Secondary Indexes per table
- Must be defined at table creation time
- Attribute Projections – can contain some or all the attributes of the base table (KEYS_ONLY, INCLUDE, ALL)

## DynamoDB – Global Secondary Index (GSI)

<!-- pdf-page: 182 -->

A GSI supports a different partition key and optional sort key; projected attributes determine what the index contains.

- Alternative Primary Key (HASH or HASH+RANGE) from the base table
- Speed up queries on non-key attributes
- The Index Key consists of scalar attributes (String, Number, or Binary)
- Attribute Projections – some or all the attributes of the base table (KEYS_ONLY, INCLUDE, ALL)
- Must provision RCUs & WCUs for the index
- Can be added/modified after table creation

## DynamoDB – Indexes and Throttling

<!-- pdf-page: 183 -->

Index capacity and hot keys can constrain table writes as well as index queries.

- Global Secondary Index (GSI):
  - If the writes are throttled on the GSI, then the main table will be throttled!
  - Even if the WCU on the main tables are fine
  - Choose your GSI partition key carefully!
  - Assign your WCU capacity carefully!
- Local Secondary Index (LSI):
  - Uses the WCUs and RCUs of the main table
  - No special throttling considerations

## DynamoDB - PartiQL

<!-- pdf-page: 184 -->

Use a SQL-like syntax to manipulate DynamoDB tables

- Supports some (but not all) statements:
  - INSERT
  - UPDATE
  - SELECT
  - DELETE
- It supports Batch operations

## DynamoDB Accelerator (DAX)

<!-- pdf-page: 185 -->

DAX caches supported DynamoDB reads. Cache misses reach DynamoDB; supported writes pass through to the table.

- Fully-managed, highly available, seamless in- memory cache for DynamoDB
- Microseconds latency for cached reads & queries
- Doesn’t require application logic modification (compatible with existing DynamoDB APIs)
- Solves the “Hot Key” problem (too many reads)
- 5 minutes TTL for cache (default)
- Up to 10 nodes in the cluster
- Multi-AZ (3 nodes minimum recommended for production)
- Secure (Encryption at rest with KMS, VPC, IAM, CloudTrail, …)

## DynamoDB Accelerator (DAX) vs. ElastiCache

<!-- pdf-page: 186 -->

DAX accelerates DynamoDB item/query reads; ElastiCache can separately cache computed application results.

## DynamoDB Streams

<!-- pdf-page: 187 -->

Ordered stream of item-level modifications (create/update/delete) in a table

- Stream records can be:
  - Sent to Kinesis Data Streams
  - Read by AWS Lambda
  - Read by Kinesis Client Library applications
- Data Retention for up to 24 hours
- Use cases:
  - react to changes in real-time (welcome email to users)
  - Analytics
  - Insert into derivative tables
  - Insert into OpenSearch Service
  - Implement cross-region replication

## DynamoDB Streams

<!-- pdf-page: 188 -->

DynamoDB change capture has separate Streams and Kinesis integration paths; downstream consumers process changes asynchronously.

## DynamoDB Streams

<!-- pdf-page: 189 -->

Ability to choose the information that will be written to the stream:

  - KEYS_ONLY – only the key attributes of the modified item
  - NEW_IMAGE – the entire item, as it appears after it was modified
  - OLD_IMAGE – the entire item, as it appeared before it was modified
  - NEW_AND_OLD_IMAGES – both the new and the old images of the item
- DynamoDB Streams are made of shards, just like Kinesis Data Streams
- You don’t provision shards, this is automated by AWS
- Records are not retroactively populated in a stream after

## DynamoDB Streams & AWS Lambda

<!-- pdf-page: 190 -->

A Lambda event source mapping polls DynamoDB Streams and invokes a function with batches; the table does not synchronously call the function.

- You need to define an Event Source Mapping to read from a DynamoDB Streams
- You need to ensure the Lambda function has the appropriate permissions
- Your Lambda function is invoked synchronously

## DynamoDB – Time To Live (TTL)

<!-- pdf-page: 191 -->

TTL removes expired items asynchronously; deletions can appear in Streams for downstream processing.

- Automatically delete items after an expiry timestamp
- Doesn’t consume any WCUs (i.e., no extra cost)
- The TTL attribute must be a “Number” data type with “Unix Epoch timestamp” value
- Expired items deleted within few days of expiration
- Expired items, that haven’t been deleted, appears in reads/queries/scans (if you don’t want them, filter them out)
- Expired items are deleted from both LSIs and GSIs
- A delete operation for each expired item enters the DynamoDB Streams (can help recover expired items)

## DynamoDB – Large Objects Pattern

<!-- pdf-page: 192 -->

Store large object bytes in S3 and their searchable metadata and object reference in DynamoDB.

## DynamoDB – Indexing S3 Objects Metadata

<!-- pdf-page: 193 -->

An S3 event can trigger metadata extraction into DynamoDB, which an API queries independently of the object download.

## DynamoDB – Security & Other Features

<!-- pdf-page: 194 -->

DynamoDB security and operations combine IAM permissions, encryption, recovery and local-development options.

- Security
  - VPC Endpoints available to access DynamoDB without using the Internet
  - Access fully controlled by IAM
  - Encryption at rest using AWS KMS and in-transit using SSL/TLS
- Backup and Restore feature available
  - Point-in-time Recovery (PITR) like RDS
  - No performance impact
- Global Tables
  - Multi-region, multi-active, fully replicated, high performance
- DynamoDB Local
  - Develop and test apps locally without accessing the DynamoDB web service (without Internet)
- AWS Database Migration Service (AWS DMS) can be used to migrate to DynamoDB (from MongoDB, Oracle, MySQL, S3, …)

## DynamoDB – Users Interact with DynamoDB Directly

<!-- pdf-page: 195 -->

Federated identity obtains temporary AWS credentials; IAM policies then authorize the DynamoDB request.

## DynamoDB – Fine-Grained Access Control

<!-- pdf-page: 196 -->

Using Web Identity Federation or Cognito Identity Pools, each user gets AWS credentials

- You can assign an IAM Role to these users with a Condition to limit their API access to DynamoDB
- LeadingKeys – limit row-level access for users on the Primary Key
- Attributes – limit specific attributes the user can see

## What is RDS?

<!-- pdf-page: 198 -->

RDS manages supported relational database engines while the application retains responsibility for schema, queries and access design.

- Hosted relational database
  - Amazon Aurora
  - MySQL
  - PostgreSQL
  - MariaDB
  - Oracle
  - SQL Server
- Not for “big data”
  - Might appear on exam as an example of what not to use
  - Or in the context of migrating from RDS to Redshift etc.

## ACID

<!-- pdf-page: 199 -->

ACID means atomicity, consistency, isolation and durability; transactions preserve these properties within the engine's documented guarantees.

- RDS databases offer full ACID compliance
  - Atomicity
  - Consistency
  - Isolation
  - Durability

## Amazon Aurora

<!-- pdf-page: 200 -->

Aurora provides MySQL- and PostgreSQL-compatible engines with a distributed managed storage layer.

- MySQL and PostgreSQL – compatible
- Up to 5X faster than MySQL, 3X faster than PostgreSQL
- 1/10 the cost of commercial databases
- Up to 128TB per database volume
- Up to 15 read replicas
- Continuous backup to S3
- Replication across regions and availability zones
- Automatic scaling with Aurora Serverless

## Aurora Security

<!-- pdf-page: 201 -->

Aurora security combines network isolation, database identity, encryption and optional IAM authentication.

- VPC network isolation
- At-rest with KMS
  - Data, backup, snapshots, and replicas can be encrypted
- In-transit with SSL

## Relational database concurrency and locks

<!-- pdf-page: 202 -->

Locking coordinates concurrent transactions; the actual conflict rules depend on the engine and isolation level.

- Locks can apply to rows, ranges, tables or other resources, depending on the operation.
- Shared and exclusive modes describe compatibility with other locks; they do not universally describe all snapshot-read behavior.
- MVCC can let ordinary reads observe a consistent snapshot while another transaction holds a write lock. See the MySQL example on page 203.

## Database locks: engine-specific behavior

<!-- pdf-page: 203 -->

Locks protect concurrent operations, but their scope and interaction with reads depend on the database engine and isolation level.

- MySQL LOCK TABLES / UNLOCK TABLES are explicit table-lock operations.
- SELECT ... FOR SHARE and FOR UPDATE request locking reads inside a transaction.
- Do not infer that FOR UPDATE blocks all ordinary reads: MVCC may serve nonlocking snapshot reads.
- Keep transactions short, acquire locks in a consistent order and handle deadlock retries.

**Current reference (checked 2026-10-13):** [MySQL InnoDB locking reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html).

## RDS best practices: unexpanded source heading

<!-- pdf-page: 204 -->

The PDF contains a heading and a service icon, with no written best-practice guidance on this page.

- Unexpanded source area: retain it as a review prompt. Do not attribute invented recommendations to this slide.

## Amazon RDS operational guidelines

<!-- pdf-page: 205 -->

Use CloudWatch to monitor memory, CPU, storage, replica lag

- Perform automatic backups during daily low in write IOPS
- Insufficient I/O will make recovery after failure slow.
  - Migrate to DB instance with more I/O
  - Move to General Purpose or Provisioned IOPS storage
- Set TTL on DNS for your DB instances to 30 seconds or less from your apps
- Test failover before you need it
- Provision enough RAM to include your entire working set
  - If your ReadIOPS metric is small and stable, you’re good
- Rate limits in Amazon API Gateway can be used to protect your database

## Query optimization in RDS

<!-- pdf-page: 206 -->

Query plans, selective indexes and workload measurements guide relational-query optimization.

- Use indexes to accelerate SELECT statements
  - Use EXPLAIN plans to identify the indexes you need
- Avoid full table scans
- Use ANALYZE TABLE periodically
- Simplify WHERE clauses
- Engine-specific optimizations

## DB-specific tweaks

<!-- pdf-page: 207 -->

Database tuning mechanisms are engine-specific; apply MySQL/MariaDB settings in their supported context.

- MySQL, MariaDB
  - Keep tables well under 16TB, ideally under 100GB
  - Have enough RAM to hold indexes of actively used tables
  - Try to have less than 10,000 tables
  - Use InnoDB for storage engine
- PostgreSQL
  - When loading data, disable DB backups and multi-AZ. Tweak various DB parameters such as maintenance_work_mem, max_wal_size, checkpoint_timeout. Disable synchronous_commit, autovacuum, and ensure tables are logged.
  - Use autovacuum

## DB-specific tweaks

<!-- pdf-page: 208 -->

SQL Server tuning and administration options differ from MySQL-family settings.

- SQL Server
  - Use RDS DB Events to monitor failovers
  - Do not enable simple recover mode, offline mode, or read-only mode (this breaks Multi-AZ)
  - Deploy into all AZ’s
- Oracle is its own beast

## Amazon Aurora

<!-- pdf-page: 209 -->

Aurora is a proprietary technology from AWS (not open sourced)

- Postgres and MySQL are both supported as Aurora DB (that means your drivers will work as if Aurora was a Postgres or MySQL database)
- Aurora is “AWS cloud optimized” and claims 5x performance improvement over MySQL on RDS, over 3x the performance of Postgres on RDS
- Aurora storage automatically grows in increments of 10GB, up to 256 TB.
- Aurora can have up to 15 replicas and the replication process is faster than MySQL (sub 10 ms replica lag)
- Failover in Aurora is instantaneous. It’s HA (High Availability) native.
- Aurora costs more than RDS (20% more) – but is more efficient

## Aurora High Availability and Read Scaling

<!-- pdf-page: 210 -->

Aurora replicates a cluster volume across three AZs. The course illustrates six copies, a four-copy write quorum and a three-copy read quorum.

- 6 copies of your data across 3 AZ:
  - 4 copies out of 6 needed for writes
  - 3 copies out of 6 need for reads
  - Self healing with peer-to-peer replication
  - Storage is striped across 100s of volumes
- One Aurora Instance takes writes (master)
- Automated failover for master in less than 30 seconds
- Master + up to 15 Aurora Read Replicas serve reads
- Support for Cross Region Replication

## Aurora DB Cluster

<!-- pdf-page: 211 -->

The writer endpoint follows the current primary; the reader endpoint distributes connections across available replicas sharing the cluster volume.

## Features of Aurora

<!-- pdf-page: 212 -->

Aurora availability, scaling and recovery features address different operational requirements.

- Automatic fail-over
- Backup and Recovery
- Isolation and security
- Industry compliance
- Push-button scaling
- Automated Patching with Zero Downtime
- Advanced Monitoring
- Routine Maintenance
- Backtrack: restore data at any point of time without using backups

## Amazon Aurora as a Vector Store

<!-- pdf-page: 213 -->

The pgvector extension stores embeddings and supports vector-distance queries in compatible PostgreSQL databases.

- pgvector extension
  - Creates a new “vector” column type
  - Can compute cosine, L2, or inner product distances
  - The source mentions IVF similarity search but leaves the alternative after "or" unfinished.
  - Also adds vector operators for SQL
    - This gives it an advantage over OpenSearch if you need complex filtering logic and stuff.
- Allows you to store structured and vector data in the same place
- Can be appropriate for small / medium RAG systems with mostly structured data

## DocumentDB

<!-- pdf-page: 214 -->

Aurora is an “AWS-implementation” of PostgreSQL / MySQL …

- DocumentDB is the same for MongoDB (which is a NoSQL database)
- MongoDB is used to store, query, and index JSON data
- Similar “deployment concepts” as Aurora
- Fully Managed, highly available with replication across 3 AZ
- DocumentDB storage automatically grows in increments of 10GB
- Automatically scales to workloads with millions of requests per seconds

## Amazon MemoryDB for Redis

<!-- pdf-page: 215 -->

MemoryDB serves low-latency in-memory operations while a distributed transaction log provides durability.

- Redis-compatible, durable, in-memory database service
- Ultra-fast performance with over 160 millions requests/second
- Durable in-memory data storage with Multi-AZ transactional log
- Scale seamlessly from 10s GBs to 100s TBs of storage
- Use cases: web and mobile apps, online gaming, media streaming, …

## Amazon Keyspaces (for Apache Cassandra)

<!-- pdf-page: 216 -->

Apache Cassandra is an open-source NoSQL distributed database

- A managed Apache Cassandra-compatible database service
- Serverless, Scalable, highly available, fully managed by AWS
- Automatically scale tables up/down based on the application’s traffic
- Tables are replicated 3 times across multiple AZ
- Using the Cassandra Query Language (CQL)
- Single-digit millisecond latency at any scale, 1000s of requests per second
- Capacity: On-demand mode or provisioned mode with auto-scaling
- Encryption, backup, Point-In-Time Recovery (PITR) up to 35 days
- Use cases: store IoT devices info, time-series data, …

## Amazon Neptune

<!-- pdf-page: 217 -->

Graph databases represent entities as vertices and relationships as edges; traversal answers connection-oriented questions.

- Fully managed graph database
- A popular graph dataset would be a social network
  - Users have friends
  - Posts have comments
  - Comments have likes from users
  - Users share and like posts…
- Highly available across 3 AZ, with up to 15 read replicas
- Build and run applications working with highly connected datasets – optimized for these complex and hard queries
- Can store up to billions of relations and query the graph with milliseconds latency
- Highly available with replications across multiple AZs
- Great for knowledge graphs (Wikipedia), fraud detection, recommendation engines, social networking

## Amazon Neptune – Query Languges

<!-- pdf-page: 218 -->

A graph statement connects a subject to an object through a predicate; RDF and property graphs use different models and query languages.

- Supported graph query languages: Gremlin, openCypher, SPARQL

## Amazon Timestream

<!-- pdf-page: 219 -->

Fully managed, fast, scalable, serverless time series database

- Automatically scales up/down to adjust capacity
- Store and analyze trillions of events per day
- 1000s times faster & 1/10th the cost of relational databases
- Scheduled queries, multi-measure records, SQL compatibility
- Data storage tiering: recent data kept in memory and historical data kept in a cost-optimized storage
- Built-in time series analytics functions (helps you identify patterns in your data in near real-time)
- Encryption in transit and at rest
- Use cases: IoT apps, operational applications, real- time analytics, …

## Amazon Timestream – Architecture

<!-- pdf-page: 220 -->

Timestream ingests time-series observations through supported APIs and connectors, then serves analytical queries to visualization tools.

## What is Redshift?

<!-- pdf-page: 222 -->

Fully-managed, petabyte scale data warehouse service

- 10X better performance than other DW’s
  - Via machine learning, massively parallel query execution, columnar storage
- Designed for OLAP, not OLTP
- Cost effective
- SQL, ODBC, JDBC interfaces
- Scale up or down on demand
- Built-in replication & backups
- Monitoring via CloudWatch / CloudTrail

## Redshift Use-Cases

<!-- pdf-page: 223 -->

Redshift targets analytical workloads that benefit from a managed columnar warehouse.

- Accelerate analytics workloads
- Unified data warehouse & data lake
- Data warehouse modernization
- Analyze global sales data
- Store historical stock trade data
- Analyze ad impressions & clicks
- Aggregate gaming data
- Analyze social trends

## Redshift architecture

<!-- pdf-page: 224 -->

In a provisioned Redshift cluster, the leader coordinates SQL work across compute nodes and slices; node families in the slide are historical examples.

## Redshift Spectrum

<!-- pdf-page: 225 -->

Redshift Spectrum and Athena can query S3 data through external metadata; this does not imply data flows from Athena into Redshift.

- Query exabytes of unstructured data in S3 without loading
- Limitless concurrency
- Horizontal scaling
- Separate storage & compute resources
- Wide variety of data formats
- Support of Gzip and Snappy compression

## Redshift Performance

<!-- pdf-page: 226 -->

Redshift combines parallel execution, columnar storage and query optimization for analytics.

- Massively Parallel Processing (MPP)
- Columnar Data Storage
- Column Compression

## Redshift Durability

<!-- pdf-page: 227 -->

Redshift durability uses redundant storage and recovery copies; plan restoration separately from query availability.

- Replication within cluster
- Backup to S3
  - Asynchronously replicated to another region
- Automated snapshots
- Failed drives / nodes automatically replaced
- However – limited to a single availability zone (AZ)
  - Multi-AZ for RA3 clusters now available

## Scaling Redshift

<!-- pdf-page: 228 -->

Redshift scaling changes compute capacity; choose the mechanism that fits the cluster and disruption tolerance.

- Vertical and horizontal scaling on demand
- During scaling:
  - A new cluster is created while your old one remains available for reads
  - CNAME is flipped to new cluster (a few minutes of downtime)
  - Data moved in parallel to new compute nodes

## Redshift Distribution Styles

<!-- pdf-page: 229 -->

Distribution style controls placement of rows and the data movement needed for joins.

- AUTO
  - Redshift figures it out based on size of data
- EVEN
  - Rows distributed across slices in round-robin
- KEY
  - Rows distributed based on one column
- ALL
  - Entire table is copied to every node

## EVEN distribution

<!-- pdf-page: 230 -->

EVEN distribution spreads rows across slices without selecting a distribution key.

## KEY distribution

<!-- pdf-page: 231 -->

KEY distribution hashes the chosen column; matching join keys can colocate rows, while skewed keys can overload one slice.

## ALL distribution

<!-- pdf-page: 232 -->

ALL distribution copies the complete table to every compute node, trading storage and load cost for fewer redistributions.

## Importing / Exporting data

<!-- pdf-page: 233 -->

COPY loads bulk data into Redshift; UNLOAD writes query results out to supported external storage.

- COPY command
  - Parallelized; efficient
  - From S3, EMR, DynamoDB, remote hosts
  - S3 requires a manifest file and IAM role
- UNLOAD command
  - Unload from a table into files in S3
- Enhanced VPC routing
- Auto-copy from Amazon S3
- Amazon Aurora zero-ETL integration
  - Auto replication from Aurora -> Redshift
- Redshift Streaming Ingestion
  - From Kinesis Data Streams or MSK

## COPY command: More depth

<!-- pdf-page: 234 -->

Use COPY to load large amounts of data from outside of Redshift

- If your data is already in Redshift in another table,
  - Use INSERT INTO …SELECT
  - Or CREATE TABLE AS
- COPY can decrypt data as it is loaded from S3
  - Hardware-accelerated SSL used to keep it fast
- Gzip, lzop, and bzip2 compression supported to speed it up further
- Automatic compression option
  - Analyzes data being loaded and figures out optimal compression scheme for storing it
- Special case: narrow tables (lots of rows, few columns)
  - Load with a single COPY transaction if possible
  - Otherwise hidden metadata columns consume too much space

## Redshift copy grants for cross-region snapshot copies

<!-- pdf-page: 235 -->

Let’s say you have a KMS-encrypted Redshift cluster and a snapshot of it

- You want to copy that snapshot to another region for backup
- In the destination AWS region:
  - Create a KMS key if you don’t have one already
  - Specify a unique name for your snapshot copy grant
  - Specify the KMS key ID for which you’re creating the copy grant
- In the source AWS region:
  - Enable copying of snapshots to the copy grant you just created

## DBLINK

<!-- pdf-page: 236 -->

Connect Redshift to PostgreSQL (possibly in RDS)

- Good way to copy and sync data between PostgreSQL and Redshift

## Integration with other services

<!-- pdf-page: 237 -->

Redshift integrations cover data ingestion, catalog access, visualization and model training through different mechanisms.

- S3
- DynamoDB
- EMR / EC2
- Database Migration Service
- AWS Glue Connector for Redshift

## Redshift Workload Management (WLM)

<!-- pdf-page: 238 -->

Prioritize short, fast queries vs. long, slow queries

- Query queues
- Via console, CLI, or API

## Concurrency Scaling

<!-- pdf-page: 239 -->

Automatically adds cluster capacity to handle increase in concurrent read queries

- Support virtually unlimited concurrent users & queries
- WLM queues manage which queries are sent to the concurrency scaling cluster

## Automatic Workload Management

<!-- pdf-page: 240 -->

Automatic workload management allocates execution resources across configured query workloads.

- Creates up to 8 queues
- Default 5 queues with even memory allocation
- Large queries (ie big hash joins) -> concurrency lowered
- Small queries (ie inserts, scans, aggregations) -> concurrency raised
- Configuring query queues
  - Priority
  - Concurrency scaling mode
  - User groups
  - Query groups
  - Query monitoring rules

## Manual Workload Management

<!-- pdf-page: 241 -->

One default queue with concurrency level of 5 (5 queries at once)

- Superuser queue with concurrency level 1
- Define up to 8 queues, up to concurrency level 50
  - Each can have defined concurrency scaling mode, concurrency level, user groups, query groups, memory, timeout, query monitoring rules
  - Can also enable query queue hopping
    - Timed out queries “hop” to next queue to try again

## Short Query Acceleration (SQA)

<!-- pdf-page: 242 -->

Prioritize short-running queries over longer-running ones

- Short queries run in a dedicated space, won’t wait in queue behind long queries
- Can be used in place of WLM queues for short queries
- Works with:
  - CREATE TABLE AS (CTAS)
  - Read-only queries (SELECT statements)
- Uses machine learning to predict a query’s execution time
- Can configure how many seconds is “short”

## Resizing Redshift Clusters

<!-- pdf-page: 243 -->

Elastic and classic resize have different constraints and interruption characteristics.

- Elastic resize
  - Quickly add or remove nodes of same type
    - (It *can* change node types, but not without dropping connections – it creates a whole new cluster)
  - Cluster is down for a few minutes
  - Tries to keep connections open across the downtime
  - Limited to doubling or halving for some dc2 and ra3 node types.
- Classic resize
  - Change node type and/or number of nodes
  - Cluster is read-only for hours to days
- Snapshot, restore, resize
  - Used to keep cluster available during a classic resize
  - Copy cluster, resize new cluster

## VACUUM command

<!-- pdf-page: 244 -->

Recovers space from deleted rows and restores sort order

- VACUUM FULL
- VACUUM DELETE ONLY
  - Skips the sort
- VACUUM SORT ONLY
  - Does not reclaim space!
- VACUUM REINDEX
  - Re-analyzes distribution of sort key columns
  - Then does a full VACUUM

## Newer Redshift features

<!-- pdf-page: 245 -->

Separate compute/storage and serverless features change capacity and administration choices; check support for the selected deployment.

- RA3 nodes with managed storage
  - Enable independent scaling of compute and storage
  - SSD-based
- Redshift data lake export
  - Unload Redshift query to S3 in Apache Parquet format
  - Parquet is 2x faster to unload and consumes up to 6X less storage
  - Compatible with Redshift Spectrum, Athena, EMR, SageMaker
  - Automatically partitioned
- Spatial data types
  - GEOMETRY, GEOGRAPHY
- Cross-Region Data Sharing
  - Share live data across Redshift clusters without copying
  - Requires new RA3 node type
  - Secure, across regions and across accounts

## Amazon Redshift ML

<!-- pdf-page: 246 -->

Redshift ML creates a model from SQL-selected training data using SageMaker; SQL functions then expose supported inference.

## Redshift anti-patterns

<!-- pdf-page: 247 -->

A warehouse is usually a poor fit for tiny workloads or transactional access patterns that do not need analytical scans.

- Small data sets
  - Use RDS instead
- OLTP
  - Use RDS or DynamoDB instead
- Unstructured data
  - ETL first with EMR etc.
- BLOB data
  - Store references to large binary files in S3, not the files themselves.

## Redshift security concerns

<!-- pdf-page: 248 -->

Redshift security requires appropriate encryption, identity permissions and private/public network access controls.

- Using a Hardware Security Module (HSM)
  - Must use a client and server certificate to configure a trusted connection between Redshift and the HSM
  - If migrating an unencrypted cluster to an HSM-encrypted cluster, you must create the new encrypted cluster and then move data to it.
- Defining access privileges for user or group
  - Use the GRANT or REVOKE commands in SQL
  - Example: grant select on table foo to bob;

## Redshift Serverless

<!-- pdf-page: 249 -->

Automatic scaling and provisioning for your workload

- Optimizes costs & performance
  - Pay only when in use
- Uses ML to maintain performance across variable & sporadic workloads
- Easy spinup of development and test environments
- Easy ad-hoc business analysis
- You get back a serverless endpoint, JDBC/ODBC connection, or just query via the console’s query editor.

## Redshift Serverless: Getting Started

<!-- pdf-page: 250 -->

Create a Serverless namespace/workgroup with deliberate identity, network, encryption and audit settings.

- Need an IAM role with this policy
- Define your
  - Database name
  - Admin user credentials
  - VPC
  - Encryption settings
    - AWS-owned KMS by default
  - Audit logging
- Can manage snapshots & recovery points after creation

## Resource Scaling in Redshift Serverless

<!-- pdf-page: 251 -->

Capacity measured in Redshift Processing Units (RPU’s)

- You pay for RPU-hours (per second) plus storage
- Base RPU’s
  - You can adjust base capacity
  - Defaults to AUTO
  - But you can adjust from 32-512 RPU’s to improve query performance
- Max RPU’s
  - Can set a usage limit to control costs
  - Or, increase it to improve throughput

## Redshift Serverless: check feature differences

<!-- pdf-page: 252 -->

Serverless uses namespaces and workgroups rather than the same administration model as a provisioned cluster.

- Parameter groups, maintenance controls and workload-management configuration differ; check the current feature matrix.
- Correction: Serverless can be configured for public accessibility. The slide's "no public endpoints" statement is outdated.
- Use private connectivity when that fits the requirement; public accessibility still requires routing and security-group authorization.

**Current reference (checked 2026-10-13):** [Connecting to Redshift Serverless](https://docs.aws.amazon.com/redshift/latest/mgmt/serverless-connecting.html).

## Redshift Serverless: Monitoring

<!-- pdf-page: 253 -->

Serverless system views and metrics expose workload behavior and resource consumption.

- Monitoring views
  - SYS_QUERY_HISTORY
  - SYS_LOAD_HISTORY
  - SYS_SERVERLESS_USAGE
  - …and many more
- CloudWatch logs
  - Connection & user logs enabled by default
  - Optional user activity log data
  - Under /aws/redshift/serverless/
- CloudWatch metrics
  - QueriesCompletedPerSecond, QueryDuration, QueriesRunning,etc.
  - Dimensions: DatabaseName, latency (short/medium/long), QueryType, stage

## Redshift Materialized Views

<!-- pdf-page: 254 -->

A materialized view stores a query result derived from base tables. Refresh policy determines when the stored result reflects later changes.

- Contain precomputed results based on SQL queries over one or more base tables.
  - This differs from a “normal” view in that it actually stores the results of the query
- Provide a way to speed up complex queries in a data warehouse environment, especially on large tables.
- You can query materialized views just like any other tables or views.
- Queries return results faster since they use precomputed results without accessing base tables.
- They're particularly beneficial for predictable and recurring queries, e.g., populating dashboards like Amazon QuickSight.

## Using Materialized Views

<!-- pdf-page: 255 -->

Create, refresh and query materialized views according to the freshness required by the consuming workload.

- CREATE MATERIALIZED VIEW…
- Keeping them refreshed
  - REFRESH MATERIALIZED VIEW…
  - Set AUTO REFRESH option on creation
- Query them just like any other table or view
- Materialized views can be built from other materialized views
  - Useful for re-using expensive joins

## Redshift Data Sharing

<!-- pdf-page: 256 -->

Redshift data sharing exposes selected live data to authorized consumers without copying the shared dataset.

- Securely share live data across Redshift clusters for read purposes
- Why?
  - Workload isolation
  - Cross-group collaboration
  - Sharing data between dev/test/prod
  - Licensing data access in AWS Data Exchange
- Can share DB’s, schemas, tables, views, and/or UDFs.
  - Fine-grained access control

## Redshift Data Sharing

<!-- pdf-page: 257 -->

Producer and consumer compute can scale independently while consumers read shared data.

- Producer / consumer architecture
  - Producer controls security
  - Isolation to ensure producer performance unaffected by consumers
  - Data is live and transactionally consistent
- Both must be encrypted, must use RA3 nodes
- Cross-region data sharing involves transfer charges
- Types of data shares
  - Standard
  - AWS Data Exchange
  - AWS Lake Formation - managed

## Redshift Lambda UDF

<!-- pdf-page: 258 -->

A Lambda UDF calls an external function from Redshift SQL; it is distinct from retired Redshift Python UDFs.

- Lambda UDFs remain a distinct supported external-function mechanism; Redshift Python UDF end of support after June 30, 2026 does not mean Lambda UDFs were retired.
- Use custom functions in AWS Lambda inside SQL queries
  - Using any language you want!
  - Do anything you want!
    - Call other services (AI?)
    - Access external systems
    - Integrate with location service
- Register with CREATE EXTERNAL FUNCTION
- Must GRANT USAGE ON LANGUAGE EXFUNC for permissions

**Current reference (checked 2026-10-13):** [Redshift Lambda UDF syntax](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_FUNCTION.html).

## Redshift Lambda UDF

<!-- pdf-page: 259 -->

Lambda UDF requests contain batches of arguments; the handler must return a correctly shaped response with corresponding results.

- Lambda UDFs remain a distinct supported external-function mechanism; Redshift Python UDF end of support after June 30, 2026 does not mean Lambda UDFs were retired.
- Use AWSLambdaRole IAM policy to grant permissions to Lambda on your cluster’s IAM role
  - Or roll your own policy, to allow lambda:InvokeFunction
- You also need this IAM role in your CREATE EXTERNAL FUNCTION command
  - Possible to invoke functions in other accounts in the same Region, using IAM role chaining
- Redshift communicates with Lambda using JSON

**Current reference (checked 2026-10-13):** [Redshift Lambda UDF syntax](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_FUNCTION.html).

## Redshift Federated Queries

<!-- pdf-page: 260 -->

Federated queries combine Redshift data with supported remote RDS or Aurora databases; authorization and pushdown affect performance.

- Query and analyze across databases, warehouses, and lakes
- Ties Redshift to Amazon RDS or Aurora for PostgreSQL and MySQL
  - Incorporate live data in RDS into your Redshift queries
  - Avoids the need for ETL pipelines
- Offloads computation to remote databases to reduce data movement

## Redshift Federated Queries

<!-- pdf-page: 261 -->

Must establish connectivity between your Redshift cluster and RDS / Aurora

  - Put them in the same VPC subnet
  - Or use VPC peering
- Credentials must be in AWS Secrets Manager
- Include secrets in IAM role for your Redshift cluster
- Connect using CREATE EXTERNAL SCHEMA
  - Can also connect to S3 / Redshift Spectrum this way
- The SVV_EXTERNAL_SCHEMAS view contains available external schemas

## Redshift Federated Queries

<!-- pdf-page: 262 -->

Federation reads supported external databases without first loading all remote data into local warehouse tables.

- Read-only access to external data sources
- Costs will be incurred on external DB’s
- You can query RDS/Aurora from Redshift, but not the other way around

## Redshift System Tables and Views

<!-- pdf-page: 263 -->

System tables and views expose query, load, storage and operational state; access and retention differ by view.

- Contains info about how Redshift is functioning
- Types of system tables / views
  - SYS views: Monitor query & workload usage
  - STV tables: Transient data containing snapshots of current system data
  - SVV views: metadata about DB objects that reference STV tables
  - STL views: Generated from logs persisted to disk
  - SVCS views: Details about queries on main & concurrency scaling clusters
  - SVL views: Details about queries on main clusters
- Many system monitoring views & tables are only for provisioned clusters, not serverless

## Redshift Data API

<!-- pdf-page: 264 -->

The Redshift Data API accepts authenticated HTTPS requests and returns a statement identifier for asynchronous status and result retrieval.

- Secure HTTP endpoint for SQL statements to Redshift clusters
  - Provisioned or serverless
  - Individual or batch queries
- Asynchronous
- Does not require managing connections
  - No drivers needed
- Passwords not sent via API
  - Uses AWS Secrets Manager or temporary credentials
- Can be invoked by AWS SDK
  - C++, Go, Java, JavaScript, .NET, Node.js, PHP, Python, Ruby
- AWS CloudTrail captures API calls

## Redshift Data API: Other use cases

<!-- pdf-page: 265 -->

Lambda, EventBridge and Step Functions can orchestrate Data API calls without maintaining a JDBC connection.

- Application integration
  - REST endpoints
- It can also integrate with a variety of other services
  - ETL Orchestration with AWS Step Functions
    - Serverless data processing workflows
    - Event-driven ETL
  - Access from SageMaker notebooks
- Use with Amazon EventBridge
  - Stream data from application to Lambda
    - Set WithEvent parameter to true
  - Schedule Data API operations

## Redshift Data API: Finer Points

<!-- pdf-page: 266 -->

Data API request, runtime and result limits are separate constraints; consult current API quotas.

- Maximum…
  - Query duration: 24 hours
  - Active queries: 500
  - Query result size (gzip’ed): 100 MB
  - Result retention time: 24 hours
  - Query statement size: 100 KB
  - Packet for query (data per row) : 64 KB
  - Client token retention time: 8 hours
  - Transaction per Second quotas per API (30 for ExecuteStatement)
- API Calls
  - ExecuteStatement, BatchExecuteStatement
  - DescribeStatement, DescribeTable
  - GetStatementResult, CancelStatement
  - Users must have same IAM role or permissions to operate on a given statement
- Cluster must be in a VPC

# Section Migration and transfer

## AWS Application Discovery Service

<!-- pdf-page: 268 -->

Plan migration projects by gathering information about on-premises data centers

- Server utilization data and dependency mapping are important for migrations
- Agentless Discovery (AWS Agentless Discovery Connector)
  - VM inventory, configuration, and performance history such as CPU, memory, and disk usage
- Agent-based Discovery (AWS Application Discovery Agent)
  - System configuration, system performance, running processes, and details of the network connections between systems
- Resulting data can be viewed within AWS Migration Hub

## AWS Application Migration Service (MGN)

<!-- pdf-page: 269 -->

Application Migration Service replicates server disks to a staging area before test and cutover instances are launched.

- The “AWS evolution” of CloudEndure Migration, replacing AWS Server Migration Service (SMS)
- Lift-and-shift (rehost) solution which simplify migrating applications to AWS
- Converts your physical, virtual, and cloud-based servers to run natively on AWS
- Supports wide range of platforms, Operating Systems, and databases
- Minimal downtime, reduced costs

## DMS – Database Migration Service

<!-- pdf-page: 270 -->

DMS moves database data through a replication task; source/target compatibility and full-load versus CDC settings matter.

- Quickly and securely migrate databases to AWS, resilient, self healing
- The source database remains available during the migration
- Supports:
  - Homogeneous migrations: ex Oracle to Oracle
  - Heterogeneous migrations: ex Microsoft SQL Server to Aurora
- Continuous Data Replication using CDC
- You must create an EC2 instance to perform the replication tasks

## DMS Sources and Targets

<!-- pdf-page: 271 -->

On-Premises and EC2 instances databases: Oracle, MS SQL Server, MySQL, MariaDB, PostgreSQL, MongoDB, SAP, DB2

- Azure: Azure SQL Database
- Amazon RDS: all including Aurora
- Amazon S3
- DocumentDB
                        - On-Premises and EC2 instances databases: Oracle, MS SQL Server, MySQL, MariaDB, PostgreSQL, SAP
                        - Amazon RDS
                        - Redshift, DynamoDB, S3
                        - OpenSearch Service
                        - Kinesis Data Streams
                        - Apache Kafka
                        - DocumentDB & Amazon Neptune
                        - Redis & Babelfish

## AWS Schema Conversion Tool (SCT)

<!-- pdf-page: 272 -->

Schema Conversion Tool converts compatible schema and code and reports objects requiring manual remediation.

- Convert your Database’s Schema from one engine to another
- Example OLTP: (SQL Server or Oracle) to MySQL, PostgreSQL, Aurora
- Example OLAP: (Teradata or Oracle) to Amazon Redshift
- Prefer compute-intensive instances to optimize data conversions
- You do not need to use SCT if you are migrating the same DB engine
  - Ex: On-Premise PostgreSQL => RDS PostgreSQL
  - The DB engine is still PostgreSQL (RDS is the platform)

## DMS - Continuous Replication

<!-- pdf-page: 273 -->

For a heterogeneous migration, schema conversion and data replication are separate paths that converge on the target.

## AWS DMS – Multi-AZ Deployment

<!-- pdf-page: 274 -->

A Multi-AZ DMS deployment provides a standby for replication-instance availability; it does not itself make a migration task parallel.

- When Multi-AZ Enabled, DMS provisions and maintains a synchronously stand replica in a different AZ
- Advantages:
  - Provides Data Redundancy
  - Eliminates I/O freezes
  - Minimizes latency spikes

## AWS DataSync

<!-- pdf-page: 275 -->

DataSync automates transfer and verification between supported storage locations.

- Move large amount of data to and from
  - On-premises / other cloud to AWS (NFS, SMB, HDFS, S3 API…) – needs agent
  - AWS to AWS (different storage services) – no agent needed
- Can synchronize to:
  - Amazon S3 (any storage classes – including Glacier)
  - Amazon EFS
  - Amazon FSx (Windows, Lustre, NetApp, OpenZFS...)
- Replication tasks can be scheduled hourly, daily, weekly
- File permissions and metadata are preserved (NFS POSIX, SMB…)
- One agent task can use 10 Gbps, can setup a bandwidth limit

## AWS DataSync NFS / SMB to AWS (S3, EFS, FSx…)

<!-- pdf-page: 276 -->

An on-premises DataSync agent accesses supported local storage and transfers data to AWS storage over encrypted transport.

## AWS DataSync Transfer between AWS storage services

<!-- pdf-page: 277 -->

DataSync also transfers between supported AWS storage locations; agent requirements depend on the location types.

## Snowball device comparison: course snapshot

<!-- pdf-page: 278 -->

The source compares portable storage-optimized and compute-optimized offline-transfer devices.

- Availability correction: Snowball Edge closed new-customer access November 7, 2025. AWS announces commercial-Region device support ending December 31, 2026, with stated exceptions for active GovCloud/ADC jobs. Review current migration options rather than treating this as a new-customer recommendation.
- Both pictured models list 104 vCPUs and 416 GB memory.
- The storage-optimized model lists 210 TB SSD storage; the compute-optimized model lists 28 TB.
- Treat these hardware specifications as model-specific course examples, not universal capacities for every generation.

| Model in course | vCPUs | Memory | SSD |
| --- | --- | --- | --- |
| Storage Optimized | 104 | 416 GB | 210 TB |
| Compute Optimized | 104 | 416 GB | 28 TB |

**Current reference (checked 2026-10-13):** [Snowball end-of-support notice](https://aws.amazon.com/snowball/).

## Estimate network transfer time

<!-- pdf-page: 279 -->

Compare online transfer time with the complete offline workflow, including preparation, shipping and import.

- Approximate ideal transfer time = data size in bits ÷ usable bits per second; actual utilization and protocol overhead increase it.
- The source examples round a 10 TB transfer to 12 days at 100 Mbps, 30 hours at 1 Gbps and 3 hours at 10 Gbps.
- Check shared bandwidth, cost, reliability and the migration deadline. The PDF's one-week threshold is a heuristic, not an AWS eligibility rule.

| Dataset | 100 Mbps (course) | 1 Gbps (course) | 10 Gbps (course) |
| --- | --- | --- | --- |
| 10 TB | 12 days | 30 hours | 3 hours |
| 100 TB | 124 days | 12 days | 30 hours |
| 1 PB | 3 years | 124 days | 12 days |

## Diagrams

<!-- pdf-page: 280 -->

Offline appliance transfer trades network upload time for device preparation, shipping and AWS import; eligibility is a dated service constraint.

- Direct upload to S3:
- With Snowball:

## What is Edge Computing?

<!-- pdf-page: 281 -->

Process data while it’s being created on an edge location

  - A truck on the road, a ship on the sea, a mining station underground...
- These locations may have limited internet and no access to computing power
- We setup a Snowball Edge device to do edge computing
  - Snowball Edge Compute Optimized (dedicated for that use case) & Storage Optimized
  - Run EC2 Instances or Lambda functions at the edge
- Use cases: preprocess data, machine learning, transcoding media

## AWS Data Exchange

<!-- pdf-page: 282 -->

Find, subscribe to, and use third-party data in the cloud

  - Reuters, who curate data from over 2.2 million unique news stories per year in multiple languages
  - Change Healthcare, who process and anonymize more than 14 billion healthcare transactions and $1 trillion in claims annually
  - Dun & Bradstreet, who maintain a database of more than 330 million global business records;
  - Foursquare, whose location data is derived from 220 million unique consumers and includes more than 60 million global commercial venues.
- Once subscribed to a data product, you can use the AWS Data Exchange API to load data directly into Amazon S3 and then analyze it with a wide variety of AWS analytics and machine learning services

## AWS Data Exchange

<!-- pdf-page: 283 -->

Data Exchange grants subscribed access to provider datasets; analytics then uses the licensed data through the delivery method configured.

## AWS Data Exchange – Other Products

<!-- pdf-page: 284 -->

Data Exchange products can expose data through different delivery or sharing mechanisms, not only copied S3 objects.

- AWS Data Exchange for Redshift
  - Find and subscribe to third-party data in AWS Data Exchange that you can query in an Amazon Redshift data warehouse in minutes
  - Easily license your data in Amazon Redshift through AWS Data Exchange
- AWS Data Exchange for APIs
  - Find and subscribe to third-party APIs with a consistent access using AWS SDKs
  - Consistent AWS-native authentication and governance

## AWS Transfer Family

<!-- pdf-page: 285 -->

A fully-managed service for file transfers into and out of Amazon S3 or Amazon EFS using the FTP protocol

- Supported Protocols
  - AWS Transfer for FTP (File Transfer Protocol (FTP))
  - AWS Transfer for FTPS (File Transfer Protocol over SSL (FTPS))
  - AWS Transfer for SFTP (Secure File Transfer Protocol (SFTP))
- Managed infrastructure, Scalable, Reliable, Highly Available (multi-AZ)
- Pay per provisioned endpoint per hour + data transfers in GB
- Store and manage users’ credentials within the service
- Integrate with existing authentication systems (Microsoft Active Directory, LDAP, Okta, Amazon Cognito, custom)
- Usage: sharing files, public datasets, CRM, ERP, …

## AWS Transfer Family

<!-- pdf-page: 286 -->

Transfer Family provides managed file-transfer endpoints with configured identity and storage permissions.

# Section Compute

## EC2 in Big Data

<!-- pdf-page: 288 -->

Choose EC2 purchase options by interruption tolerance, duration and utilization of the processing workload.

- On demand, Spot & Reserved instances:
  - Spot: can tolerate loss, low cost => checkpointing feature (ML, etc)
  - Reserved: long running clusters, databases (over a year)
  - On demand: remaining workloads
- Auto Scaling:
  - Leverage for EMR, etc
  - Automated for DynamoDB, Auto Scaling Groups, etc…
- EC2 is behind EMR
  - Master Nodes
  - Compute Nodes (contain data) + Tasks Nodes (do not contain data)

## AWS Graviton

<!-- pdf-page: 289 -->

Amazon’s own family of processors, powers several EC2 instance types

  - General purpose: M7, T4
  - Compute optimized: C7, C6
  - Memory optimized: R7, X2
  - Storage optimized: Im4, Is4
  - Accelerated computing (game streaming, ML inference): G5
- Offers best price performance
- Option for many data engineering services
  - MSK, RDS, MemoryDB, ElastiCache, OpenSearch, EMR, Lambda, Fargate

## What is Lambda?

<!-- pdf-page: 291 -->

Lambda runs event-driven code in managed execution environments within its configured limits.

- A way to run code snippets “in the cloud”
  - Serverless
  - Continuous scaling
- Often used to process data as it’s moved around

## Example: Serverless Website

<!-- pdf-page: 292 -->

A serverless API resolves its domain, accepts HTTP requests, invokes business logic and accesses persistent storage.

## Example: Order history app

<!-- pdf-page: 293 -->

Streaming events can update an application-facing table asynchronously; client reads are a separate path.

## Example: Transaction rate alarm

<!-- pdf-page: 294 -->

Historical architecture: Kinesis SQL analytics processed an input stream and emitted results for alerting. Use a supported engine for new work.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).

## Why not just run a server?

<!-- pdf-page: 295 -->

Server management (patches, monitoring, hardware failures, etc.)

- Servers can be cheap, but scaling gets expensive really fast
- You don’t pay for processing time you don’t use
- Easier to split up development between front-end and back-end

## Main uses of Lambda

<!-- pdf-page: 296 -->

Lambda commonly handles event-driven file, stream, API and application tasks.

- Real-time file processing
- Real-time stream processing
- ETL
- Cron replacement
- Process AWS events

## Supported languages

<!-- pdf-page: 297 -->

Lambda runtime support depends on language and runtime version; distinguish managed runtimes from custom-runtime options.

- Node.js
- Python
- Java
- C#
- Go: verify the supported custom-runtime/container approach rather than assuming a current managed runtime.
- Powershell: verify the supported custom-runtime/container approach rather than assuming a current managed runtime.
- Ruby

**Current reference (checked 2026-10-13):** [Current Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).

## Lambda triggers

<!-- pdf-page: 298 -->

Lambda integrations include request/response invocations, asynchronous events and polled event sources; these invocation models have different retry behavior.

## Lambda and Amazon OpenSearch Service

<!-- pdf-page: 299 -->

An S3 upload can trigger Lambda to extract and index content in OpenSearch.

## Lambda and Redshift

<!-- pdf-page: 300 -->

An event-driven loader can submit a Redshift COPY from S3 and track processed objects in DynamoDB; retry-safe bookkeeping is essential.

## Lambda + Kinesis

<!-- pdf-page: 301 -->

The Lambda event source mapping reads Kinesis shards and invokes batches, preserving order within a shard subject to configured parallelization.

- Your Lambda code receives an event with a batch of stream records
  - You specify a batch size when setting up the trigger (up to 10,000 records)
  - Too large a batch size can cause timeouts!
  - Batches may also be split beyond Lambda’s payload limit (6 MB)
- Lambda will retry the batch until it succeeds or the data expires
  - This can stall the shard if you don’t handle errors properly
  - Use more shards to ensure processing isn’t totally held up by errors
- Lambda processes shard data synchronously

## Cost Model

<!-- pdf-page: 302 -->

Lambda cost depends on request volume, execution duration, configured resources and optional capabilities.

- “Pay for what you use”
- Generous free tier (1M requests / month, 400K GB-seconds compute time)
- $0.20 / million requests
- $.00001667 per GB/second

## Other promises

<!-- pdf-page: 303 -->

Managed scaling and availability do not remove the need to configure concurrency, permissions and recovery behavior.

- High availability
  - No scheduled downtime
  - Retries failed code 3 times
- Unlimited scalability*
  - Safety throttle of 1,000 concurrent executions per region
- High performance
  - New functions callable in seconds
  - Events processed in milliseconds
  - Code is cached automatically
  - But you do specify a timeout! This can cause problems. Max is 900 seconds (15 min)

## Anti-patterns

<!-- pdf-page: 304 -->

Long-running or locally stateful workloads need a different execution/state design than one short Lambda invocation.

- Long-running applications
  - Use EC2 instead, or chain functions
- Dynamic websites
  - Although Lambda can be used to develop “serverless” apps that rely on client-side AJAX
- Stateful applications
  - But you can work in DynamoDB or S3 to keep track of state

## Lambda – File Systems Mounting

<!-- pdf-page: 305 -->

VPC-connected Lambda mounts EFS through an access point and mount targets; routing and security groups must permit NFS.

- Lambda functions can access EFS file systems if they are running in a VPC
- Configure Lambda to mount EFS file systems to local directory during initialization
- Must leverage EFS Access Points
- Limitations: watch out for the EFS connection limits (one function instance = one connection) and connection burst limits

## Lambda storage choices

<!-- pdf-page: 306 -->

Separate per-environment scratch space, packaged dependencies, object storage and shared filesystem storage.

- /tmp is writable and local to an execution environment; warm reuse is possible but durability is not guaranteed.
- Layers package immutable dependencies; they are not a shared writable filesystem between invocations.
- S3 persists objects independently of Lambda; EFS provides shared NFS access with VPC configuration.
- The source lists up to 10,240 MB for /tmp and five layers within the unzipped package limit. Extra ephemeral storage can incur charges; it is not all included.

| Option | Persistence / sharing | Use |
| --- | --- | --- |
| /tmp | Execution-environment-local; ephemeral | Scratch files / intermediate data |
| Layers | Versioned package contents; read only | Libraries and static dependencies |
| S3 | Durable objects; authorized callers | Datasets, artifacts, large objects |
| EFS | Shared persistent filesystem | Shared files with NFS semantics |

**Current reference (checked 2026-10-13):** [Lambda ephemeral storage](https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html).

## AWS SAM

<!-- pdf-page: 307 -->

SAM = Serverless Application Model

- Framework for developing and deploying serverless applications
- All the configuration is YAML code
- Generate complex CloudFormation from simple SAM YAML file
- Supports anything from CloudFormation: Outputs, Mappings, Parameters, Resources…
- SAM can use CodeDeploy to deploy Lambda functions
- SAM can help you to run Lambda, API Gateway, DynamoDB locally

## AWS SAM – Recipe

<!-- pdf-page: 308 -->

Transform Header indicates it’s SAM template:

  - Transform: 'AWS::Serverless-2016-10-31'
- Write Code
  - AWS::Serverless::Function
  - AWS::Serverless::Api
  - AWS::Serverless::SimpleTable
- Package & Deploy: sam deploy (optionally preceded by “sam package”)
- Quickly sync local changes to AWS Lambda (SAM Accelerate): sam sync --

## Deep Dive into SAM Deployment

<!-- pdf-page: 309 -->

SAM builds and packages application artifacts, then deploys the transformed infrastructure through CloudFormation.

## SAM Accelerate (sam sync)

<!-- pdf-page: 310 -->

SAM sync accelerates development: eligible code updates use service APIs, while infrastructure changes still use CloudFormation.

- SAM Accelerate is a set of features to reduce latency while deploying resources to AWS
- sam sync
  - Synchronizes your project declared in SAM templates to AWS
  - Synchronizes code changes to AWS without updating infrastructure (uses service APIs & bypass CloudFormation)

## SAM Accelerate (sam sync) – Examples

<!-- pdf-page: 311 -->

Watch mode monitors local changes and selects the supported sync route; it is a development workflow.

- sam sync (no options)
  - Synchronize code and infrastructure
- sam sync --code
  - Synchronize code changes without updating infrastructure (bypass CloudFormation, update in seconds)
- sam sync --code --resource AWS::Serverless::Function
  - Synchronize only all Lambda functions and their dependencies
- sam sync --code --resource-id HelloWorldLambdaFunction
  - Synchronize only a specific resource by its ID
- sam sync --watch
  - Monitor for file changes and automatically synchronize when changes are detected
  - If changes include configuration, it uses sam sync
  - If changes are code only, it uses sam sync --code

## AWS Batch

<!-- pdf-page: 312 -->

Run batch jobs as Docker images

- Dynamic provisioning of the instances (EC2 & Spot Instances)
- Optimal quantity and type based on volume and requirements
- No need to manage clusters, fully serverless
- You just pay for the underlying EC2 instances
- Schedule Batch Jobs using CloudWatch Events
- Orchestrate Batch Jobs using AWS Step Functions

## AWS Batch vs Glue

<!-- pdf-page: 313 -->

Glue:

  - Glue ETL - Run Apache Spark code, Scala or Python based, focus on the ETL
  - Glue ETL - Do not worry about configuring or managing the resources
  - Data Catalog to make the data available to Athena or Redshift Spectrum
- Batch:
  - For any computing job regardless of the job (must provide Docker image)
  - Resources are created in your account, managed by Batch
  - For any non-ETL related work, Batch is probably better

# Section Containers

## What is Docker?

<!-- pdf-page: 316 -->

Docker is a software development platform to deploy apps

- Apps are packaged in containers that can be run on any OS
- Apps run the same, regardless of where they’re run
  - Any machine
  - No compatibility issues
  - Predictable behavior
  - Less work
  - Easier to maintain and deploy
  - Works with any language, any OS, any technology
- Use cases: microservices architecture, lift-and-shift apps from on-premises to the AWS cloud, …

## Docker on an OS

<!-- pdf-page: 317 -->

Containers package applications and dependencies while sharing the host kernel.

## Where are Docker images stored?

<!-- pdf-page: 318 -->

Docker images are stored in Docker Repositories

- Docker Hub (https://hub.docker.com)
  - Public repository
  - Find base images for many technologies or OS (e.g., Ubuntu, MySQL, …)
- Amazon ECR (Amazon Elastic Container Registry)
  - Private repository
  - Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws)

## Docker vs. Virtual Machines

<!-- pdf-page: 319 -->

The source compares a hosted hypervisor stack with containers. Virtual machines include guest operating systems; containers share the host kernel through their runtime.

- Docker is ”sort of” a virtualization technology, but not exactly
- Resources are shared with the host => many containers on one server

## Getting Started with Docker

<!-- pdf-page: 320 -->

A Dockerfile builds an image. A registry distributes images, and a runtime creates containers from them.

## Docker Containers Management on AWS

<!-- pdf-page: 321 -->

Amazon Elastic Container Service (Amazon ECS)

  - Amazon’s own container platform
- Amazon Elastic Kubernetes Service (Amazon EKS)
  - Amazon’s managed Kubernetes (open source)
- AWS Fargate
  - Amazon’s own Serverless container platform
  - Works with ECS and with EKS
- Amazon ECR:
  - Store container images

## Amazon ECS - EC2 Launch Type

<!-- pdf-page: 322 -->

With the EC2 launch option, ECS places tasks on registered container instances whose capacity you manage.

- ECS = Elastic Container Service
- Launch Docker containers on AWS = Launch ECS Tasks on ECS Clusters
- EC2 Launch Type: you must provision & maintain the infrastructure (the EC2 instances)
- Each EC2 Instance must run the ECS Agent to register in the ECS Cluster
- AWS takes care of starting /

## Amazon ECS – Fargate Launch Type

<!-- pdf-page: 323 -->

Fargate runs ECS tasks without exposing host-instance administration to the application team.

- Launch Docker containers on AWS
- You do not provision the infrastructure (no EC2 instances to manage)
- It’s all Serverless!
- You just create task definitions
- AWS just runs ECS Tasks for you based on the CPU / RAM you need
- To scale, just increase the number of tasks. Simple - no more EC2 instances

## Amazon ECS – IAM Roles for ECS

<!-- pdf-page: 324 -->

Host or execution permissions support infrastructure operations; the task role grants AWS permissions to application code.

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

## Amazon ECS – Load Balancer Integrations

<!-- pdf-page: 325 -->

An Application Load Balancer routes HTTP traffic to registered ECS task targets with health checks.

- Application Load Balancer supported and works for most use cases
- Network Load Balancer recommended only for high throughput / high performance use cases, or to pair it with AWS Private Link
- Classic Load Balancer supported but not recommended (no advanced features – no Fargate)

## Amazon ECS – Data Volumes (EFS)

<!-- pdf-page: 326 -->

ECS tasks on supported EC2 or Fargate configurations can mount a shared EFS filesystem.

- Mount EFS file systems onto ECS tasks
- Works for both EC2 and Fargate launch types
- Tasks running in any AZ will share the same data in the EFS file system
- Fargate + EFS = Serverless
- Use cases: persistent multi-AZ shared storage for your containers

## Amazon ECS – Data Volumes (S3 Files)

<!-- pdf-page: 327 -->

The source's S3 Files example mounts a filesystem from Fargate or ECS Managed Instances and synchronizes with an S3 bucket. Verify current feature support before deployment.

- Mount S3 Files file systems onto ECS tasks (S3 bucket exposed as a file system)
- Works for Fargate and ECS Managed Instances (EC2 launch type is NOT supported)
- Changes sync automatically to the S3 bucket
- Use cases: containers needing shared file access to data that already lives in S3

## Amazon ECR

<!-- pdf-page: 328 -->

ECS pulls a private ECR image using the appropriate execution/instance permissions, then runs the resulting task.

- ECR = Elastic Container Registry
- Store and manage Docker images on AWS
- Private and Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws)
- Fully integrated with ECS, backed by Amazon S3
- Access is controlled through IAM (permission errors => policy)
- Supports image vulnerability scanning, versioning, image tags, image lifecycle, …

## Amazon EKS Overview

<!-- pdf-page: 329 -->

Amazon EKS = Amazon Elastic Kubernetes Service

- It is a way to launch managed Kubernetes clusters on AWS
- Kubernetes is an open-source system for automatic deployment, scaling and management of containerized (usually Docker) application
- It’s an alternative to ECS, similar goal but different API
- EKS supports EC2 if you want to deploy worker nodes or Fargate to deploy serverless containers
- Use case: if your company is already using Kubernetes on-premises or in another cloud, and wants to migrate to AWS using Kubernetes
- Kubernetes is cloud-agnostic (can be used in any cloud – Azure, GCP…)
- For multiple regions, deploy one EKS cluster per region
- Collect logs and metrics using CloudWatch Container Insights

## Amazon EKS - Diagram

<!-- pdf-page: 330 -->

EKS separates a managed Kubernetes control plane from worker capacity deployed across AZs; a load balancer exposes selected services.

## Amazon EKS – Node Types

<!-- pdf-page: 331 -->

Managed Node Groups

  - Creates and manages Nodes (EC2 instances) for you
  - Nodes are part of an ASG managed by EKS
  - Supports On-Demand or Spot Instances
- Self-Managed Nodes
  - Nodes created by you and registered to the EKS cluster and managed by an ASG
  - You can use prebuilt AMI - Amazon EKS Optimized AMI
- AWS Fargate
  - No maintenance required; no nodes managed

## Amazon EKS – Data Volumes

<!-- pdf-page: 332 -->

Kubernetes persistent-volume claims use a compatible CSI driver to provision or mount the selected AWS storage backend.

- Need to specify StorageClass manifest on your EKS cluster
- Leverages a Container Storage Interface (CSI) compliant driver
- Support for…
- Amazon EBS
- Amazon EFS (works with Fargate)
- Amazon FSx for Lustre
- Amazon FSx for NetApp ONTAP

# Section Analytics and streaming

## What is Glue?

<!-- pdf-page: 335 -->

Serverless discovery and definition of table definitions and schema

  - S3 “data lakes”
  - RDS
  - Redshift
  - DynamoDB
  - Most other SQL databases
- Custom ETL jobs
  - Trigger-driven, on a schedule, or on demand
  - Fully managed

## Glue Crawler / Data Catalog

<!-- pdf-page: 336 -->

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

## Glue and S3 Partitions

<!-- pdf-page: 337 -->

Partition keys organize data prefixes so a query predicate can prune irrelevant partitions.

- Glue crawler will extract partitions based on how your S3 data is organized
- Think up front about how you will be querying your data lake in S3
- Example: devices send sensor data every hour
- Do you query primarily by time ranges?
  - If so, organize your buckets as yyyy/mm/dd/device
- Do you query primarily by device?
  - If so, organize your buckets as device/yyyy/mm/dd

## Glue + Hive

<!-- pdf-page: 338 -->

Hive lets you run SQL-like queries from EMR

- The Glue Data Catalog can serve as a Hive “metastore”
- You can also import a Hive metastore into Glue

## Glue ETL

<!-- pdf-page: 339 -->

Automatic code generation

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

<!-- pdf-page: 340 -->

Transform data, Clean Data, Enrich Data (before doing analysis)

  - Generate ETL code in Python or Scala, you can modify the code
  - Can provide your own Spark or PySpark scripts
  - Target can be S3, JDBC (RDS, Redshift), or in Glue Data Catalog
- Fully managed, cost effective, pay only for the resources consumed
- Jobs are run on a serverless Spark platform
- Glue Scheduler to schedule the jobs
- Glue Triggers to automate job runs based on “events”

## Glue ETL: The DynamicFrame

<!-- pdf-page: 341 -->

A DynamicFrame is a distributed collection of self-describing DynamicRecords, allowing inconsistent fields to be resolved during ETL.

- A DynamicFrame is a collection of DynamicRecords
  - DynamicRecords are self-describing, have a schema
  - Very much like a Spark DataFrame, but with more ETL stuff
  - Scala and Python APIs

## Glue ETL - Transformations

<!-- pdf-page: 342 -->

Bundled Transformations:

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

<!-- pdf-page: 343 -->

ResolveChoice makes a mixed-type field explicit by casting, projecting, creating separate columns or creating a struct.

- Deals with ambiguities in a DynamicFrame and returns a new one
- For example, two fields with the same name.
- make_cols: creates a new column for each type
  - price_double, price_string
- cast: casts all values to specified type
- make_struct: Creates a structure that contains each data type
- project: Projects every type to a given type, for example project:string

## Glue ETL: Modifying the Data Catalog

<!-- pdf-page: 344 -->

ETL scripts can update your schema and partitions if necessary

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

<!-- pdf-page: 345 -->

Develop ETL scripts using a notebook

  - Then create an ETL job that runs your script (using Spark and Glue)
- Endpoint is in a VPC controlled by security groups, connect via:
  - Apache Zeppelin on your local machine
  - Zeppelin notebook server on EC2 (via Glue console)
  - SageMaker notebook
  - Terminal window
  - PyCharm professional edition
  - Use Elastic IP’s to access a private endpoint address

## Running Glue jobs

<!-- pdf-page: 346 -->

Time-based schedules (cron style)

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

## Glue cost model

<!-- pdf-page: 347 -->

Billed by the second for crawler and ETL jobs

- First million objects stored and accesses are free for the Glue Data Catalog
- Development endpoints for developing ETL code charged by the minute

## Glue Anti-patterns

<!-- pdf-page: 348 -->

Multiple ETL engines

- Glue ETL is based on Spark
- If you want to use other engines (Hive, Pig, etc) Data Pipeline EMR would be a better fit.

## No longer an anti-pattern: streaming

<!-- pdf-page: 349 -->

As of April 2020, Glue ETL supports serverless streaming ETL

  - Consumes from Kinesis or Kafka
  - Clean & transform in-flight
  - Store results into S3 or other data stores
- Runs on Apache Spark Structured Streaming

## AWS Glue Studio

<!-- pdf-page: 350 -->

Glue Studio's visual job is a directed graph of sources, transformations and targets; the generated job still needs correct schema and permissions.

- Visual interface for ETL workflows
- Visual job editor
  - Create DAG’s for complex workflows
  - Sources include S3, Kinesis, Kafka, JDBC
  - Transform / sample / join data
  - Target to S3 or Glue Data Catalog
  - Support partitioning
- Visual job dashboard
  - Overviews, status, run times

## AWS Glue Data Quality

<!-- pdf-page: 351 -->

Glue Data Quality evaluates a ruleset against data and produces rule outcomes and quality metrics; catalog integration provides dataset context.

- Data quality rules may be created manually or recommended automatically
- Integrates into Glue jobs
- Uses Data Quality Definition Language (DQDL)
- Results can be used to fail the job, or just be reported to CloudWatch

## More on Data Quality Definition Language (DQDL)

<!-- pdf-page: 352 -->

Even though this is specific to AWS Glue, the exam expects you to understand its syntax.

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

<!-- pdf-page: 353 -->

The quality-results screen connects each configured rule to a pass/fail outcome and supporting metrics.

## AWS Glue DataBrew

<!-- pdf-page: 354 -->

A visual data preparation tool

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

## Handling Personally Identifiable Information (PII) in DataBrew Transformations

<!-- pdf-page: 355 -->

Enable PII statistics in a DataBrew profile job to identify PII

- Substitution (REPLACE_WITH_RANDOM…)
- Shuffling (SHUFFLE_ROWS)
- Deterministic encryption (DETERMINISTIC_ENCRYPT)
- Probabilistic encryption (ENCRYPT)
- Decryption (DECRYPT)
- Nulling out or deletion (DELETE)
- Masking out (MASK_CUSTOM, _DATE, _DELIMITER, _RANGE)
- Hashing (CRYPTOGRAPHIC_HASH)

## Glue Workflows

<!-- pdf-page: 356 -->

Glue workflows coordinate crawlers and jobs through triggers and run conditions.

- Design multi-job, multi-crawler ETL processes run together
- Create from AWS Glue blueprint, from the console, or API
- This is only for orchestrating complex ETL operations using Glue

## Glue Workflow Triggers

<!-- pdf-page: 357 -->

Triggers within workflows start jobs or crawlers

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

## Glue Flex Jobs

<!-- pdf-page: 358 -->

Glue Flex uses spare capacity for eligible nonurgent jobs; startup and completion time can vary when capacity is unavailable or reclaimed.

- Execution class (“FLEX”) for non-urgent ETL workloads
  - Uses spare compute capacity instead of dedicated workers
  - Might have to wait for capacity to become available
- Appropriate for time-insensitive workloads (testing, one-time loads, etc.)
- Usually cheaper than standard execution (30- 35% savings)
  - Billed only for actual workers running and the duration they ran
  - Note you may end up with fewer workers than expected if capacity is limited

## Glue Flex Jobs

<!-- pdf-page: 359 -->

Not supported:

  - Python shell jobs
  - Streaming jobs
  - AWS Glue ML jobs
- When to use
  - Standard: Dedicated resources, predictable start time & performance, hard SLA’s
  - Flex: Willing to trade off variable performance for cost optimization

## AWS Lake Formation

<!-- pdf-page: 360 -->

“Makes it easy to set up a secure data lake in days”

- Loading data & monitoring data flows
- Setting up partitions
- Encryption & managing keys
- Defining transformation jobs & monitoring them
- Access control
- Auditing
- Built on top of Glue

## AWS Lake Formation

<!-- pdf-page: 361 -->

Lake Formation governs a data lake while supported query engines enforce granted permissions on cataloged data.

## AWS Lake Formation: Pricing

<!-- pdf-page: 362 -->

No cost for Lake Formation itself

- But underlying services incur charges
  - Glue
  - S3
  - EMR
  - Athena
  - Redshift

## AWS Lake Formation: Building a Data Lake

<!-- pdf-page: 363 -->

Building a governed lake combines storage registration, discovery, ingestion and permission grants rather than only copying files.

## AWS Lake Formation: The Finer Points

<!-- pdf-page: 364 -->

Cross-account Lake Formation permission

  - Recipient must be set up as a data lake administrator
  - Can use AWS Resource Access Manager for accounts external to your organization
  - IAM permissions for cross-account access
- Lake Formation does not support manifests in Athena or Redshift queries
- IAM permissions on the KMS encryption key are needed for encrypted data catalogs in Lake Formation
- IAM permissions needed to create blueprints and workflows

## Data Permissions in Lake Formation

<!-- pdf-page: 365 -->

Lake Formation permissions relate a principal to catalog resources and allowed operations.

- Can tie to IAM users/roles, SAML, or external AWS accounts
- Can use policy tags on databases, tables, or columns
- Can select specific permissions for tables or columns

## Data Filters in Lake Formation

<!-- pdf-page: 366 -->

Data filters narrow authorized data by rows, columns or cells; a table grant need not expose every value.

- Column, row, or cell-level security
- Apply when granting SELECT permission on tables
- “All columns” + row filter = row- level security
- “All rows” + specific columns = column-level security
- Specific columns + specific rows = cell-level security
- Create filters via the console (seen here) or via CreateDataCellsFilter API.

## What is Athena?

<!-- pdf-page: 368 -->

Interactive query service for S3 (SQL)

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

## Some examples

<!-- pdf-page: 369 -->

Ad-hoc queries of web logs

- Querying staging data before loading to Redshift
- Analyze CloudTrail / CloudFront / VPC / ELB etc logs in S3
- Integration with Jupyter, Zeppelin, RStudio notebooks
- Integration with QuickSight
- Integration via ODBC / JDBC with other visualization tools

## Athena + Glue

<!-- pdf-page: 370 -->

Athena queries S3 using catalog metadata and can feed QuickSight; it does not require loading the dataset into a dedicated database.

## Athena Workgroups

<!-- pdf-page: 371 -->

Can organize users / teams / apps / workloads into Workgroups

- Can control query access and track costs by Workgroup
- Integrates with IAM, CloudWatch, SNS
- Each workgroup can have its own:
  - Query history
  - Data limits (you can limit how much data queries may scan by workgroup)
  - IAM policies
  - Encryption settings

## Athena cost model

<!-- pdf-page: 372 -->

Pay-as-you-go

  - $5 per TB scanned
  - Successful or cancelled queries count, failed queries do not.
  - No charge for DDL (CREATE/ALTER/DROP etc.)
- Save LOTS of money by using columnar formats
  - ORC, Parquet
  - Save 30-90%, and get better performance
- Glue and S3 have their own charges

## Athena Security

<!-- pdf-page: 373 -->

Access control

  - IAM, ACLs, S3 bucket policies
  - AmazonAthenaFullAccess / AWSQuicksightAthenaAccess
- Encrypt results at rest in S3 staging directory
  - Server-side encryption with S3-managed key (SSE-S3)
  - Server-side encryption with KMS key (SSE-KMS)
  - Client-side encryption with KMS key (CSE-KMS)
- Cross-account access in S3 bucket policy possible
- Transport Layer Security (TLS) encrypts in- transit (between Athena and S3)

## Athena anti-patterns

<!-- pdf-page: 374 -->

Highly formatted reports / visualization

  - That’s what QuickSight is for
- ETL
  - Use Glue instead

## Athena: Optimizing performance

<!-- pdf-page: 375 -->

Use columnar data (ORC, Parquet)

- Small number of large files performs better than large number of small files
- Use partitions
  - If adding partitions after the fact, use MSCK REPAIR TABLE command

## Athena ACID transactions

<!-- pdf-page: 376 -->

Powered by Apache Iceberg

  - Just add ‘table_type’ = ‘ICEBERG’ in your CREATE TABLE command
- Concurrent users can safely make row-level modifications
- Compatible with EMR, Spark, anything that supports Iceberg table format.
- Removes need for custom record locking
- Time travel operations
  - Recover data recently deleted with a SELECT statement
- Remember governed tables in Lake Formation? This is another way of getting ACID features in Athena.
- Benefits from periodic compaction to preserve performance

## Athena Fine-Grained Access to AWS Glue Data Catalog

<!-- pdf-page: 377 -->

IAM-based Database and table- level security

  - Broader than data filters in Lake Formation
  - Cannot restrict to specific table versions
- At a minimum you must have a policy that grants access to your database and the Glue Data Catalog in each region.

## Athena Fine-Grained Access to AWS Glue Data Catalog

<!-- pdf-page: 378 -->

You might have policies to restrict access to:

  - ALTER or CREATE DATABASE
  - CREATE TABLE
  - DROP DATABASE or DROP TABLE
  - MSCK REPAIR TABLE
  - SHOW DATABASES or SHOW TABLES
- Just need to map these operations to their IAM actions
- Example: DROP TABLE
- More examples at

## Wait,what’s Iceberg?

<!-- pdf-page: 379 -->

Apache Iceberg is a table format for data lakes

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

<!-- pdf-page: 380 -->

Iceberg separates metadata from data files; compatible engines use catalog coordination to locate table metadata and S3 objects.

- Glue can take the place of Hive as Iceberg’s source of table metadata
- Iceberg’s API communicates with Glue catalog for metadata
- Iceberg stores / retrieves files from Amazon S3
  - Usually in Parquet format
- Spark / Flink can then sit on top of the Iceberg API
- Also Athena for ACID transactions!
  - See, this is how ACID is implemented for Athena – it just uses Iceberg’s ACID compliance.

## Migrating Glue Data Catalogs to Iceberg

<!-- pdf-page: 381 -->

Glue Data Catalogs must be made compatible with the Iceberg API

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

<!-- pdf-page: 382 -->

You might see this in the context of Amazon Athena

  - But it exists in other databases as well.
- Creates a new table from query results (CTAS)
- Can be used to create a new table that’s a subset of another
- Can ALSO be used to convert data into a new underlying format
  - So this is a trick to get Athena to convert data stored in S3

## Athena Federated Queries

<!-- pdf-page: 383 -->

Athena federated queries invoke a connector, commonly Lambda-based, to access supported non-S3 data sources.

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

## Athena Federated Queries

<!-- pdf-page: 384 -->

Views on federated data sources

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

## HDFS YARN MapReduce Spark

<!-- pdf-page: 385 -->

Hadoop layers distributed storage, cluster resource management and processing frameworks.

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

## How Spark Works

<!-- pdf-page: 386 -->

The Spark driver plans work, a cluster manager allocates resources and executors run tasks and retain cached partitions.

- Spark apps are run as independent processes on a cluster
- The SparkContext (driver program) coordinates them
- SparkContext works through a Cluster Manager
- Executors run computations and store data
- SparkContext sends application code and tasks to executors

## Spark Components

<!-- pdf-page: 387 -->

Spark Core underpins higher-level SQL, streaming, ML and graph APIs.

## Spark Structured Streaming A constantly growing DataSet

<!-- pdf-page: 388 -->

Structured Streaming models incoming data as an unbounded table and incrementally updates query results in a supported sink.

## Spark Streaming + Kinesis

<!-- pdf-page: 389 -->

A supported Spark connector consumes Kinesis records for distributed stream processing; checkpointing governs recovery.

## Spark + Redshift

<!-- pdf-page: 390 -->

Spark can exchange bulk data with Redshift through S3 staging; S3 is the transfer path, not a Spark SQL database endpoint.

- spark-redshift package allows Spark datasets from Redshift
  - It’s a Spark SQL data source
- Useful for ETL using Spark

## Amazon Athena for Apache Spark

<!-- pdf-page: 391 -->

Can run Jupyter notebooks with Spark within Athena console

  - Notebooks may be encrypted automatically or with KMS
- Totally serverless
- Selectable as an alternate analytics engine (vs. Athena SQL)
- Uses Firecracker for quickly spinning up Spark resources
- Programmatic API / CLI access as well
  - create-work-group, create-notebook, start-session, start-calculation-execution
- Can adjust DPU’s for coordinator and executor sizes
- Pricing based on compute usage and DPU per hour

## What is EMR?

<!-- pdf-page: 393 -->

Elastic MapReduce

- Managed Hadoop framework on EC2 instances
- Includes Spark, HBase, Presto, Flink, Hive & more
- EMR Notebooks
- Several integration points with AWS

## An EMR Cluster

<!-- pdf-page: 394 -->

An EMR on EC2 cluster separates orchestration, core compute with HDFS and optional task compute without HDFS storage.

- Master node: manages the cluster
  - Tracks status of tasks, monitors cluster health
  - Single EC2 instance (it can be a single node cluster even)
  - AKA “leader node”
- Core node: Hosts HDFS data and runs tasks
  - Can be scaled up & down, but with some risk
  - Multi-node clusters have at least one
- Task node: Runs tasks, does not host data
  - Optional
  - No risk of data loss when removing
  - Good use of spot instances

## EMR Usage

<!-- pdf-page: 395 -->

Transient vs Long-Running Clusters

- Transient clusters terminate once all steps are complete
  - Loading data, processing, storing – then shut down
  - Saves money
- Long-running clusters must be manually terminated
  - Basically a data warehouse with periodic processing on large datasets
  - Can spin up task nodes using Spot instances for temporary capacity
  - Can use reserved instances on long-running clusters to save $
  - Termination protection on by default, auto-termination off

## EMR Usage

<!-- pdf-page: 396 -->

Frameworks and applications are specified at cluster launch

- Connect directly to master to run jobs directly
- Or, submit ordered steps via the console
  - Process data in S3 or HDFS
  - Output data to S3 or somewhere
  - Once defined, steps can be invoked via the console

## EMR / AWS Integration

<!-- pdf-page: 397 -->

Amazon EC2 for the instances that comprise the nodes in the cluster

- Amazon VPC to configure the virtual network in which you launch your instances
- Amazon S3 to store input and output data
- Amazon CloudWatch to monitor cluster performance and configure alarms
- AWS IAM to configure permissions
- AWS CloudTrail to audit requests made to the service

## EMR storage and S3 consistency

<!-- pdf-page: 398 -->

Use cluster-local HDFS for suitable working data and S3 for storage that must outlive the cluster.

- HDFS distributes blocks across cluster nodes; replication protects against some node failures, not cluster termination.
- EMRFS gives Hadoop applications access to S3, with different semantics from a local filesystem.
- Historical EMRFS Consistent View used DynamoDB metadata. S3 now has strong read-after-write and LIST consistency; that historical workaround is not required for S3 consistency.

**Current reference (checked 2026-10-13):** [S3 consistency model](https://aws.amazon.com/s3/consistency/).

## EMR Storage

<!-- pdf-page: 399 -->

Local file system

  - Suitable only for temporary data (buffers, caches, etc)
- EBS for HDFS
  - Allows use of EMR on EBS-only types (M4, C4)
  - Deleted when cluster is terminated
  - EBS volumes can only be attached when launching a cluster
  - If you manually detach an EBS volume, EMR treats that as a failure and replaces it

## EMR promises

<!-- pdf-page: 400 -->

EMR charges by the hour

  - Plus EC2 charges
- Provisions new nodes if a core node fails
- Can add and remove tasks nodes on the fly
  - Increase processing capacity, but not HDFS capacity
- Can resize a running cluster’s core nodes
  - Increases both processing and HDFS capacity
- Core nodes can also be added or removed
  - But removing risks data loss.

## EMR Managed Scaling

<!-- pdf-page: 401 -->

EMR Automatic Scaling

  - The old way of doing it
  - Custom scaling rules based on CloudWatch metrics
  - Supports instance groups only
- EMR Managed Scaling
  - Introduced in 2020
  - Support instance groups and instance fleets
  - Scales spot, on-demand, and instances in a Savings Plan within the same cluster
  - Available for Spark, Hive, YARN workloads
- Scale-up Strategy
  - First adds core nodes, then task nodes, up to max units specified
- Scale-down Strategy
  - First removes task nodes, then core nodes, no further than minimum constraints
  - Spot nodes always removed before on-demand instances

## EMR Serverless

<!-- pdf-page: 402 -->

Choose an EMR Release and Runtime (Spark, Hive, Presto)

- Submit queries / scripts via job run requests
- EMR manages underlying capacity
  - But you can specify default worker sizes & pre-initialized capacity
  - EMR computes resources needed for your job & schedules workers accordingly
  - All within one region (across multiple AZ’s)
- Why is this a big deal?
  - You no longer have to estimate how many workers are needed for your workloads – they are provisioned as needed, automatically.
- Serverless? Really?
  - TBH you still need to think about worker nodes and how they are configured.

## Using EMR Serverless

<!-- pdf-page: 403 -->

EMR Serverless runs submitted jobs with a job execution role; caller permissions and job data permissions are distinct.

## EMR Serverless Application Lifecycle

<!-- pdf-page: 404 -->

An EMR Serverless application can start, stop and restart before termination.

## Pre-Initialized Capacity

<!-- pdf-page: 405 -->

Spark adds 10% overhead to memory requested for drivers & executors

- Be sure initial capacity is at least 10% more than requested by the job

## EMR Serverless Security

<!-- pdf-page: 406 -->

Basically the same as EMR

- EMRFS
  - S3 encryption (SSE or CSE) at rest
  - TLS in transit between EMR nodes and S3
- S3
  - SSE-S3, SSE-KMS
- Local disk encryption
- Spark communication between drivers & executors is encrypted
- Hive communication between Glue Metastore and EMR uses TLS
- Force HTTPS (TLS) on S3 policies with aws:SecureTransport

## EMR on EKS

<!-- pdf-page: 407 -->

EMR on EKS schedules Spark workloads onto Kubernetes capacity that may also host other applications.

- Allows submitting Spark job on Elastic Kubernetes Service without provisioning clusters
- Fully managed
- Share resources between Spark and other apps on Kubernetes

## Kinesis Data Streams

<!-- pdf-page: 408 -->

Producers choose partition keys; Kinesis assigns records to shards that consumers read independently.

## Kinesis Data Streams

<!-- pdf-page: 409 -->

Retention between 1 day to 365 days

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

<!-- pdf-page: 410 -->

Provisioned mode:

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

## Kinesis Data Streams Security

<!-- pdf-page: 411 -->

Kinesis access combines network reachability, IAM authorization and optional KMS encryption controls.

- Control access / authorization using IAM policies
- Encryption in flight using HTTPS endpoints
- Encryption at rest using KMS
- You can implement encryption/decryption of data on client side (harder)
- VPC Endpoints available for Kinesis to access within VPC
- Monitor API calls using CloudTrail

## Kinesis Producers

<!-- pdf-page: 412 -->

The SDK, KPL, agent and supported third-party integrations are alternative producer paths into Kinesis.

- Kinesis SDK
- Kinesis Producer Library (KPL)
- Kinesis Agent
- 3rd party libraries: Spark, Log4J Appenders, Flume, Kafka Connect, NiFi…

## Kinesis Producer SDK - PutRecord(s)

<!-- pdf-page: 413 -->

APIs that are used are PutRecord (one) and PutRecords (many records)

- PutRecords uses batching and increases throughput => less HTTP requests
- ProvisionedThroughputExceeded if we go over the limits
- + AWS Mobile SDK: Android, iOS, etc...
- Use case: low throughput, higher latency, simple API, AWS Lambda
- Managed AWS sources for Kinesis Data Streams:
  - CloudWatch Logs
  - AWS IoT
  - Kinesis Data Analytics

## AWS Kinesis API – Exceptions

<!-- pdf-page: 414 -->

ProvisionedThroughputExceeded Exceptions

  - Happens when sending more data (exceeding MB/s or TPS for any shard)
  - Make sure you don’t have a hot shard (such as your partition key is bad and too much data goes to that partition)
- Solution:
  - Retries with backoff
  - Increase shards (scaling)
  - Ensure your partition key is a good one

## Kinesis Producer Library (KPL)

<!-- pdf-page: 415 -->

Easy to use and highly configurable C++ / Java library

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

## Kinesis Producer Library (KPL) Batching

<!-- pdf-page: 416 -->

KPL aggregation packs user records into a Kinesis record; collection batches multiple Kinesis records into one PutRecords request.

- We can influence the batching efficiency by introducing some delay with RecordMaxBufferedTime (default 100ms)

## Kinesis Producer Library – When not to use

<!-- pdf-page: 417 -->

KPL buffering trades some latency for efficient requests; a direct SDK write avoids that producer-side buffer.

- The KPL can incur an additional processing delay of up to RecordMaxBufferedTime within the library (user- configurable)
- Larger values of RecordMaxBufferedTime results in higher packing efficiencies and better performance
- Applications that cannot tolerate this additional delay may need to use the AWS SDK directly

## Kinesis Agent

<!-- pdf-page: 418 -->

Monitor Log files and sends them to Kinesis Data Streams

- Java-based agent, built on top of KPL
- Install in Linux-based server environments
- Features:
  - Write from multiple directories and write to multiple streams
  - Routing feature based on directory / log file
  - Pre-process data before sending to streams (single line, csv to json, log to json…)
  - The agent handles file rotation, checkpointing, and retry upon failures
  - Emits metrics to CloudWatch for monitoring

## Kinesis Consumers - Classic

<!-- pdf-page: 419 -->

Multiple consumer applications can independently process the same stream using SDKs, KCL or managed integrations.

- Kinesis SDK
- Kinesis Client Library (KCL)
- Kinesis Connector Library
- 3rd party libraries: Spark, Log4J Appenders, Flume, Kafka Connect…
- Kinesis Firehose
- AWS Lambda
- (Kinesis Consumer Enhanced Fan-Out discussed in the next lecture)

## Kinesis Consumer SDK - GetRecords

<!-- pdf-page: 420 -->

Shared-throughput consumers compete for each shard's shared read capacity; adding consumers does not multiply that capacity.

- Classic Kinesis - Records are polled by consumers from a shard
- Each shard has 2 MB total aggregate throughput
- GetRecords returns up to 10MB of data (then throttle for 5 seconds) or up to 10000 records
- Maximum of 5 GetRecords API calls per shard per second = 200ms latency
- If 5 consumers application consume from the same shard, means every consumer can poll once a second and receive less than 400 KB/s

## Kinesis Client Library (KCL)

<!-- pdf-page: 421 -->

KCL coordinates shard leases and checkpoints in DynamoDB so workers can rebalance and recover progress.

- Java-first library but exists for other languages too (Golang, Python, Ruby, Node, .NET …)
- Read records from Kinesis produced with the KPL (de-aggregation)
- Share multiple shards with multiple consumers in one “group”, shard discovery
- Checkpointing feature to resume progress
- Leverages DynamoDB for coordination and checkpointing (one row per shard)
  - Make sure you provision enough WCU / RCU
  - Or use On-Demand for DynamoDB
  - Otherwise DynamoDB may slow down KCL
- Record processors will process the data
- ExpiredIteratorException => increase

## Kinesis Connector Library

<!-- pdf-page: 422 -->

The course's Kinesis Connector example is a consumer application delivering transformed stream data to configured destinations; check library maintenance before use.

- Older Java library (2016), leverages the KCL library
- Write data to:
  - Amazon S3
  - DynamoDB
  - Redshift
  - OpenSearch
- Kinesis Firehose replaces the Connector Library for a few of these targets, Lambda for the others

## AWS Lambda sourcing from Kinesis

<!-- pdf-page: 423 -->

AWS Lambda can source records from Kinesis Data Streams

- Lambda consumer has a library to de-aggregate record from the KPL
- Lambda can be used to run lightweight ETL to:
  - Amazon S3
  - DynamoDB
  - Redshift
  - OpenSearch
  - Anywhere you want
- Lambda can be used to trigger notifications / send emails in real time
- Lambda has a configurable batch size (more in Lambda section)

## Kinesis Enhanced Fan Out

<!-- pdf-page: 424 -->

Enhanced fan-out gives registered consumers dedicated per-shard read throughput through SubscribeToShard rather than sharing GetRecords capacity.

- New game-changing feature from August 2018.
- Works with KCL 2.0 and AWS Lambda (Nov 2018)
- Each Consumer get 2 MB/s of provisioned throughput per shard
- That means 20 consumers will get 40MB/s per shard aggregated
- No more 2 MB/s limit!
- Enhanced Fan Out: Kinesis pushes data to consumers over HTTP/2
- Reduce latency (~70 ms)

## Enhanced Fan-Out vs Standard Consumers

<!-- pdf-page: 425 -->

Standard consumers:

  - Low number of consuming applications (1,2,3…)
  - Can tolerate ~200 ms latency
  - Minimize cost
- Enhanced Fan Out Consumers:
  - Multiple Consumer applications for the same Stream
  - Low Latency requirements ~70ms
  - Higher costs (see Kinesis pricing page)
  - Registered enhanced-fan-out consumer quotas depend on stream mode: consult current quotas; do not generalize one mode's limit.

**Current reference (checked 2026-10-13):** [Kinesis quotas by capacity mode](https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html).

## Kinesis Operations – Adding Shards

<!-- pdf-page: 426 -->

A split closes the parent shard and creates two children covering its hash-key range.

- Also called “Shard Splitting”
- Can be used to increase the Stream capacity (1 MB/s data in per shard)
- Can be used to divide a “hot shard”
- The old shard is closed and will be deleted once the data is expired

## Kinesis Operations – Merging Shards

<!-- pdf-page: 427 -->

A merge combines adjacent shard hash-key ranges into one child shard.

- Decrease the Stream capacity and save costs
- Can be used to group two shards with low traffic
- Old shards are closed and deleted based on data expiration

## Out-of-order records after resharding

<!-- pdf-page: 428 -->

A consumer must finish a parent before processing its children when it needs to preserve ordering across resharding.

- After a reshard, you can read from child shards
- However, data you haven’t read yet could still be in the parent
- If you start reading the child before completing reading the parent, you could read data for a particular hash key out of order
- After a reshard, read entirely from the parent until you don’t have new records
- Note: The Kinesis Client Library (KCL) has this logic already built-in, even after resharding operations

## Kinesis Operations – Auto Scaling

<!-- pdf-page: 429 -->

For provisioned streams, external automation can observe CloudWatch metrics and request shard-count changes; on-demand capacity is a different mode.

- Auto Scaling is not a native feature of Kinesis
- The API call to change the number of shards is UpdateShardCount
- We can implement Auto Scaling with AWS Lambda
- See: https://aws.amazon.com/blogs/b ig-data/scaling-amazon-kinesis- data-streams-with-aws- application-auto-scaling/

## Kinesis Scaling Limitations

<!-- pdf-page: 430 -->

Resharding cannot be done in parallel. Plan capacity in advance

- You can only perform one resharding operation at a time and it takes a few seconds
- For1000 shards, it takes 30K seconds (8.3 hours) to double the shards to 2000
- You can’t do the following:
  - Scale more than 10x for each rolling 24-hour period for each stream
  - Scale up to more than double your current shard count for a stream
  - Scale down below half your current shard count for a stream
  - Scale up to more than 10,000 shards in a stream
  - Scale a stream with more than 10,000 shards down unless the result is less than 10,000 shards
  - Scale up to more than the shard limit for your account

## Kinesis Data Streams – Handling Duplicates For Producers

<!-- pdf-page: 431 -->

An unacknowledged successful write may be retried and create a duplicate. Use an application record identifier and idempotent processing.

- Producer retries can create duplicates due to network timeouts
- Although the two records have identical data, they also have unique sequence numbers
- Fix: embed unique record ID in the data to de-duplicate on the consumer side

## Kinesis Data Streams – Handling Duplicates For Consumers

<!-- pdf-page: 432 -->

Consumer retries can make your application read the same data twice

- Consumer retries happen when record processors restart:
- Fixes:
  - Make your consumer application idempotent
  - If the final destination can handle duplicates, it’s recommended to do it there
- More info: https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-

## Kinesis Security

<!-- pdf-page: 433 -->

Control access / authorization using IAM policies

- Encryption in flight using HTTPS endpoints
- Encryption at rest using KMS
- Client side encryption must be manually implemented (harder)
- VPC Endpoints available for Kinesis to access within VPC

## Data Firehose

<!-- pdf-page: 434 -->

Data Firehose buffers delivery, optionally transforms records and sends them to a configured destination with optional S3 backup.

## AWS Data Firehose

<!-- pdf-page: 435 -->

Fully Managed Service, no administration

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

<!-- pdf-page: 436 -->

Firehose delivery to Redshift stages files in S3 and issues COPY; Lambda transformation and failed-record backup are optional branches.

## Firehose Buffer Sizing

<!-- pdf-page: 437 -->

Firehose accumulates records in a buffer

- The buffer is flushed based on time and size rules
- Buffer Size (ex: 32MB): if that buffer size is reached, it’s flushed
- Buffer Time (ex: 2 minutes): if that time is reached, it’s flushed
- Firehose can automatically increase the buffer size to increase throughput
- High throughput => Buffer Size will be hit
- Low throughput => Buffer Time will be hit

## Kinesis Data Streams vs Firehose

<!-- pdf-page: 438 -->

Streams

  - Going to write custom code (producer / consumer)
  - Real time (~200 ms latency for classic, ~70 ms latency for enhanced fan-out)
  - On-demand or Provisioned mode
  - Data Storage for 1 to 365 days, replay capability, multi consumers
  - Use with Lambda to insert data in real-time to OpenSearch (for example)
- Firehose
  - Fully managed, send to S3, Splunk, Redshift, OpenSearch
  - Serverless data transformations with Lambda
  - Near real time
  - Automated Scaling
  - No data storage

## Troubleshooting Kinesis Data Stream Producers: Performance

<!-- pdf-page: 439 -->

Writing is too slow

  - Service limits may be exceeded. Check for throughput exceptions, see what operations are being throttled. Different calls have different limits.
  - There are shard-level limits for writes and reads
  - Other operations (ie, CreateStream, ListStreams, DescribeStreams) have stream-level limits of 5-20 calls per second
  - Select partition key to evenly distribute puts across shards
- Large producers
  - Batch things up. Use Kinesis Producer Library, PutRecords with multi-records, or aggregate records into larger files.
- Small producers (i.e. apps)
  - Use PutRecords or Kinesis Recorder in the AWS Mobile SDKs

## Other Kinesis Data Stream Producer Issues

<!-- pdf-page: 440 -->

Stream returns a 500 or 503 error

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

## Troubleshooting Kinesis Data Stream Consumers

<!-- pdf-page: 441 -->

Records get skipped with Kinesis Client Library

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

## Troubleshooting Kinesis Data Stream Consumers

<!-- pdf-page: 442 -->

Lambda function can’t get invoked

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

## Troubleshooting Kinesis Data Stream Consumers

<!-- pdf-page: 443 -->

High latency

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

<!-- pdf-page: 445 -->

Historical Kinesis Data Analytics SQL architecture; applications of this service were discontinued in 2026.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).

## In more depth…

<!-- pdf-page: 446 -->

Historical SQL analytics could join streaming input with S3 reference data; this is not a current deployment recommendation.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).

## Reference tables are cool

<!-- pdf-page: 447 -->

Historical in-application streams separated source, SQL transformation, destination and error handling.

- Historical: Kinesis SQL applications were discontinued; deletion began January 27, 2026. Use a supported engine for new deployments.
- Inexpensive way to “join” data for quick lookups
  - i.e., look up the city associated with a zip code
  - Mapping is stored in S3 which is very inexpensive
  - Just use a “JOIN” command to use the data in your queries

**Current reference (checked 2026-10-13):** [Kinesis SQL discontinuation](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/what-is.html).

## Kinesis Data Analytics + Lambda

<!-- pdf-page: 448 -->

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

## Managed Service for Apache Flink

<!-- pdf-page: 449 -->

Managed Service for Apache Flink runs stateful streaming jobs with supported Kinesis, Kafka and other connectors.

- Formerly Kinesis Data Analytics for Apache Flink or for Java
  - Kinesis Data Analytics always used Flink under the hood
  - But now supports Python and Scala
  - Flink is a framework for processing data streams
- MSAF integrates Flink with AWS
  - Instead of using SQL, you can develop your own Flink application from scratch and load it into MSAF via S3
- In addition to the DataStream API, there is a Table API for SQL access
- Serverless

## Apache Flink Capabilities

<!-- pdf-page: 450 -->

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

## Common use-cases

<!-- pdf-page: 451 -->

Streaming ETL

- Continuous metric generation
- Responsive analytics

## Kinesis Analytics

<!-- pdf-page: 452 -->

Pay only for resources consumed (but it’s not cheap)

  - Charged by Kinesis Processing Units (KPU’s) consumed per hour
  - 1 KPU = 1 vCPU + 4GB
- Serverless; scales automatically
- Use IAM permissions to access streaming source and destination(s)
- Schema discovery

## RANDOM_CUT_FOREST

<!-- pdf-page: 453 -->

SQL function used for anomaly detection on numeric columns in a stream

- They’re especially proud of this because they published a paper on it
- It’s a novel way to identify outliers in a data set so you can handle them however you need to
- Example: detect anomalous subway ridership during the NYC marathon

## Amazon Managed Streaming for Apache Kafka (Amazon MSK)

<!-- pdf-page: 454 -->

Alternative to Kinesis (Kafka vs Kinesis next lecture)

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

<!-- pdf-page: 455 -->

Kafka producers append to topic partitions on brokers; independent consumer groups process those records.

## MSK – Configurations

<!-- pdf-page: 456 -->

The course depicts a multi-AZ Kafka cluster with ZooKeeper. Coordination architecture depends on the Kafka/MSK version and cluster mode.

- Choose the number of AZ (3 – recommended, or 2)
- Choose the VPC & Subnets
- The broker instance type (ex: kafka.m5.large)
- The number of brokers per AZ (can add brokers later)
- Size of your EBS volumes (1GB – 16TB)

## MSK – Security

<!-- pdf-page: 457 -->

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

## MSK – Monitoring

<!-- pdf-page: 458 -->

CloudWatch Metrics

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

<!-- pdf-page: 459 -->

MSK Connect runs a compatible connector that consumes Kafka records and delivers them to a configured sink such as S3.

- Managed Kafka Connect workers on AWS
- Auto-scaling capabilities for workers
- You can deploy any Kafka Connect connectors to MSK Connect as a plugin
  - Amazon S3, Amazon Redshift, Amazon OpenSearch, Debezium, etc…
- Example pricing: Pay $0.11 per worker per hour

## MSK Serverless

<!-- pdf-page: 460 -->

Run Apache Kafka on MSK without managing the capacity

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

<!-- pdf-page: 461 -->

10 MB message size limit

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

<!-- pdf-page: 463 -->

A fork of Elasticsearch and Kibana

- A search engine
- An analysis tool
- A visualization tool (Dashboards = Kibana)
- A data pipeline
  - Kinesis replaces Beats & LogStash
- Horizontally scalable

## OpenSearch Dashboards

<!-- pdf-page: 464 -->

Dashboards turn indexed search and aggregation results into interactive visualizations.

- The screenshot illustrates a dashboard of multiple charts; filters and a time range define the slice being inspected.
- Interpret the underlying query, units and time interval before drawing an operational conclusion from a chart.

## OpenSearch applications

<!-- pdf-page: 465 -->

Full-text search

- Log analytics
- Application monitoring
- Security analytics
- Clickstream analytics

## OpenSearch concepts

<!-- pdf-page: 466 -->

OpenSearch indexes JSON documents; the slide's document-type terminology is historical and should not guide new index design.

## An index is split into shards

<!-- pdf-page: 467 -->

Document routing assigns documents to primary shards within an index; shard design affects scale and query overhead.

## Redundancy

<!-- pdf-page: 468 -->

Writes reach a primary shard and are replicated; reads may use eligible primary or replica copies on different nodes.

## Amazon OpenSearch Service (Managed)

<!-- pdf-page: 469 -->

Fully-managed (but not serverless)

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

<!-- pdf-page: 470 -->

Dedicated master node(s)

  - Choice of count and instance types
- “Domains”
- Snapshots to S3
- Zone Awareness

## Cold / warm / ultrawarm / hot storage

<!-- pdf-page: 471 -->

Standard data nodes use “hot” storage

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

<!-- pdf-page: 472 -->

Automates index management policies

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

<!-- pdf-page: 473 -->

Index rollups

  - Periodically roll up old data into summarized indices
  - Saves storage costs
  - New index may have fewer fields, coarser time buckets
- Index transforms
  - Like rollups, but purpose is to create a different view to analyze data differently.
  - Groupings and aggregations

## Cross-cluster replication

<!-- pdf-page: 474 -->

Replicate indices / mappings / metadata across domains

- Ensures high availability in an outage
- Replicate data geographically for better latency
- “Follower” index pulls data from “leader” index
- Requires fine-grained access control and node-to-node encryption
- “Remote Reindex” allows copying indices from one cluster to another on demand

## OpenSearch Stability

<!-- pdf-page: 475 -->

3 dedicated master nodes is best

  - Avoids “split brain”
- Don’t run out of disk space
  - Minimum storage requirement is roughly: Source Data * (1 + Number of Replicas) * 1.45
- Choosing the number of shards
  - (source data + room to grow) * (1 + indexing overhead) / desired shard size
  - In rare cases you may need to limit the number of shards per node
    - You usually run out of disk space first.
- Choosing instance types
  - At least 3 nodes
  - Mostly about storage requirements
  - i.e., m6g.large.search, i3.4xlarge.search, i3.16xlarge.search

## Amazon OpenSearch Security

<!-- pdf-page: 476 -->

Resource-based policies

- Identity-based policies
- IP-based policies
- Request signing
- VPC
- Cognito

## Securing Dashboards

<!-- pdf-page: 477 -->

A private OpenSearch dashboard needs network access through a supported private path plus application authentication.

- Cognito
- Getting inside a VPC from outside is hard…
  - Nginx reverse proxy on EC2 forwarding to ES domain
  - SSH tunnel for port 5601
  - VPC Direct Connect
  - VPN

## Amazon OpenSearch anti-patterns

<!-- pdf-page: 478 -->

OLTP

  - No transactions
  - RDS or DynamoDB is better
- Ad-hoc data querying
  - Athena is better
- Remember OpenSearch is primarily for search & analytics

## Amazon OpenSearch performance

<!-- pdf-page: 479 -->

Memory pressure in the JVM can result if:

  - You have unbalanced shard allocations across nodes
  - You have too many shards in a cluster
- Fewer shards can yield better performance if JVMMemoryPressure errors are encountered
  - Delete old or unused indices

## Amazon OpenSearch Serverless

<!-- pdf-page: 480 -->

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

## What is Quick Suite / Quick Sight?

<!-- pdf-page: 482 -->

Quick Sight is part of the larger Quick Suite

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

<!-- pdf-page: 483 -->

Redshift

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

## SPICE

<!-- pdf-page: 484 -->

Data sets are imported into SPICE

  - Super-fast, Parallel, In-memory Calculation Engine
  - Uses columnar storage, in-memory, machine code generation
  - Accelerates interactive queries on large datasets
- Each user gets 10GB of SPICE
- Highly available / durable
- Scales to hundreds of thousands of users
- Can accelerate large queries that would time out in direct query mode (hitting Athena directly)
  - But if it takes more than 30 minutes to import your data into SPICE it will still time out

## Quick Sight Use Cases

<!-- pdf-page: 485 -->

Interactive ad-hoc exploration / visualization of data

- Dashboards and KPI’s
- Analyze / visualize data from:
  - Logs in S3
  - On-premise databases
  - AWS (RDS, Redshift, Athena, S3)
  - SaaS applications, such as Salesforce
  - Any JDBC/ODBC data source

## Quick Sight Anti-Patterns

<!-- pdf-page: 486 -->

ETL

- Use Glue instead, although QuickSight can do some transformations

## Quick Sight Security

<!-- pdf-page: 487 -->

Multi-factor authentication on your account

- VPC connectivity
  - Add QuickSight’s IP address range to your database security groups
- Row-level security
  - New for 2021: Column-level security too (CLS) – Enterprise edition only
- Private VPC access
  - Elastic Network Interface, AWS Direct Connect

## Quick Sight Security

<!-- pdf-page: 488 -->

Resource access

  - Must ensure QuickSight is authorized to use Athena / S3 / your S3 buckets
  - This can be managed within the QuickSight console (Manage Quicksight / Security & Permissions)\
- Data access
  - Can create IAM policies to restrict what data in S3 given QuickSight users can access

## QuickSight database connectivity: public and private paths

<!-- pdf-page: 489 -->

Choose connectivity for the database endpoint; access also requires database credentials and network authorization.

- For the public-endpoint path, authorize documented QuickSight source IP ranges in the database security group.
- Correction: the source's blanket same-Region restriction is not universal. Supported private designs can reach data across accounts and Regions.
- The following pages compare a VPC connection, VPC peering, Transit Gateway, supported PrivateLink endpoints and VPC sharing. These are alternatives with configuration-specific requirements.

**Current reference (checked 2026-10-13):** [QuickSight cross-account and cross-Region deployment models](https://aws.amazon.com/blogs/big-data/amazon-quicksight-deployment-models-for-cross-account-and-cross-region-access-to-amazon-redshift-and-amazon-rds/).

## Quick Sight / Redshift / RDS cross-region

<!-- pdf-page: 490 -->

An Enterprise VPC connection places network interfaces in the configured VPC; subnet routes and security rules determine reachable private data sources.

- Other ways to do it (if you have Enterprise Edition)
- Create a private subnet in a VPC
- Use Elastic Network Interface to put Quick Sight in the subnet
  - This is the part that requires Enterprise Edition
- This can also enable cross- account access

## Quick Suite / Redshift / RDS cross-region

<!-- pdf-page: 491 -->

VPC peering connects the QuickSight connection VPC to the database VPC, with routes on both sides and database authorization.

- Now you can create a peering connection between your private subnet and another private subnet containing your data
  - This also works for cross-account access

## Quick Sight / Redshift / RDS cross- account

<!-- pdf-page: 492 -->

Transit Gateway routing, a supported PrivateLink endpoint and VPC sharing are alternative private-access designs, not one combined chain. Each requires its own supported configuration.

- Can use an AWS Transit Gateway to connect your subnets
  - But this must be in the same org & region
  - Or you can peer Transit Gateways in different regions
- OR use AWS PrivateLink to connect them
- OR use VPC sharing to connect them

## Quick Sight User Management

<!-- pdf-page: 493 -->

Users defined via IAM, or email signup

- Active Directory connector with Quick Sight Enterprise Edition
  - All keys are managed by AWS; you CANNOT use customer- provided keys
  - Enterprise edition only!
  - Can tweak security access using IAM if needed

## Quick Sight pricing

<!-- pdf-page: 494 -->

Annual subscription

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

<!-- pdf-page: 495 -->

Read-only snapshots of an analysis

- Can share with others with Quick suite access
- Can share even more widely with embedded dashboards
  - Embed within an application
  - Authenticate with Active Directory / Cognito / SSO
  - QuickSight Javascript SDK / QuickSight API
  - Whitelist domains where embedding is allowed

## Quick Sight Machine Learning Insights

<!-- pdf-page: 496 -->

ML-powered anomaly detection

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

<!-- pdf-page: 497 -->

Create new fields based on others

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

<!-- pdf-page: 498 -->

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

## Level-Aware Calculations – Window (LAC-W)

<!-- pdf-page: 499 -->

LAC-W calculates a window expression at the selected prefilter or preaggregation stage; evaluation order changes the result.

- Aggregate over a window or partition
  - Values calculated over some window are added to each row
    - Some window functions: sumover, maxover, denseRank
  - Example below: Order amount defined as sumOver({Sales}, [{Order ID}], PRE_AGG)
- PRE_AGG means to apply the window prior to display-level aggregations
- PRE_FILTER applies prior to any display-level filters

## QuickSight numeric precision: decimal and floating point

<!-- pdf-page: 500 -->

Choose a numeric type for the required precision and range; floating point is approximate.

- The PDF contrasts a four-decimal fixed representation with approximately 16 significant floating-point digits.
- FLOAT may represent a wider range, but it does not universally avoid rounding or calculation error.
- Use appropriate decimal precision for exact decimal requirements such as financial values; validate import and calculated-field behavior.

**Current reference (checked 2026-10-13):** [QuickSight decimal data types](https://docs.aws.amazon.com/quick/latest/userguide/supported-data-types-and-values.html).

# Section Application integration

## AWS SQS What’s a queue?

<!-- pdf-page: 502 -->

SQS decouples producers from competing consumers; a message is processed by a consumer, then explicitly deleted on success.

## AWS SQS – Standard Queue

<!-- pdf-page: 503 -->

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

<!-- pdf-page: 504 -->

A queue message contains a body and optional attributes used by applications and supported integrations.

- Define Body
- Add message attributes (metadata – optional)
- Provide Delay Delivery (optional)
- Get back
  - Message identifier
  - MD5 hash of the body

## SQS – Consuming Messages

<!-- pdf-page: 505 -->

Receive makes a message temporarily invisible; delete it after successful work. Expired visibility permits another receive.

- Consumers…
- Poll SQS for messages (receive up to 10 messages at a time)
- Process the message within the visibility timeout
- Delete the message using the message ID & receipt handle

## SQS FIFO: ordering and deduplication

<!-- pdf-page: 506 -->

FIFO queues preserve order within a message group and support send deduplication.

- The queue name ends in .fifo. Use MessageGroupId for the ordering domain.
- Provide MessageDeduplicationId or enable content-based deduplication; the send-deduplication interval is five minutes.
- A failed or timed-out consumer may receive the message again. Make side effects idempotent and delete after successful work.
- The PDF's 300/3,000 throughput examples describe a particular configuration; high-throughput FIFO and Regional quotas differ.

**Current reference (checked 2026-10-13):** [SQS deduplication](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html); [SQS visibility and retries](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html).

## SQS Extended Client

<!-- pdf-page: 507 -->

The extended-client pattern places a large payload in S3 and a reference in SQS; the consumer retrieves the object separately.

- Message size limit is 1024 KB, how to send large messages?
- Using the SQS Extended Client (Java Library)

## AWS SQS Use Cases

<!-- pdf-page: 508 -->

Decouple applications (for example to handle payments asynchronously)

- Buffer writes to a database (for example a voting application)
- Handle large loads of messages coming in (for example an email sender)
- SQS can be integrated with Auto Scaling through CloudWatch!

## SQS Limits

<!-- pdf-page: 509 -->

Maximum of 120,000 in-flight messages being processed by consumers

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

<!-- pdf-page: 510 -->

Encryption in flight using the HTTPS endpoint

- Can enable SSE (Server Side Encryption) using KMS
  - Can set the CMK (Customer Master Key) we want to use
  - SSE only encrypts the body, not the metadata (message ID, timestamp, attributes)
- IAM policy must allow usage of SQS
- SQS queue access policy
  - Finer grained control over IP
  - Control over the time the requests come in

## Kinesis Data Stream vs SQS

<!-- pdf-page: 511 -->

Kinesis Data Stream:

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

<!-- pdf-page: 512 -->

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

<!-- pdf-page: 513 -->

SQS use cases:

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

<!-- pdf-page: 514 -->

Repeated unsuccessful receives can move a message to a dead-letter queue according to maxReceiveCount.

- If a consumer fails to process a message within the Visibility Timeout… the message goes back to the queue!
- We can set a threshold of how many times a message can go back to the queue
- After the MaximumReceives threshold is exceeded, the message goes into a Dead Letter Queue (DLQ)
- Useful for debugging!
- DLQ of a FIFO queue must also be a FIFO queue
- DLQ of a Standard queue must also be a Standard queue
- Make sure to process the messages in the DLQ before they expire:
  - Good to set a retention of 14 days in the DLQ

## SQS DLQ – Redrive to Source

<!-- pdf-page: 515 -->

Inspect dead-letter messages, fix the cause and redrive eligible messages to a source or other supported destination.

- Feature to help consume messages in the DLQ to understand what is wrong with them
- When our code is fixed, we can redrive the messages from the DLQ back into the source queue (or any other queue) in batches without writing custom code

## Amazon SNS

<!-- pdf-page: 516 -->

SNS fan-out replaces separate producer calls with one publication to independently subscribed consumers.

- What if you want to send one message to many receivers?

## Amazon SNS

<!-- pdf-page: 517 -->

A topic delivers to supported subscription protocols; delivery, ordering and retry behavior depend on the protocol and topic type.

- The “event producer” only sends message to one SNS topic
- As many “event receivers” (subscriptions) as we want to listen to the SNS topic notifications
- Each subscriber to the topic will get all the messages (note: new feature to filter messages)
- Up to 12,500,000 subscriptions per topic
- 100,000 topics limit

## SNS integrates with a lot of AWS services

<!-- pdf-page: 518 -->

Supported AWS services publish notifications into SNS, which fans out to subscriptions.

- Many AWS services can send data directly to SNS for notifications

## Amazon SNS – How to publish

<!-- pdf-page: 519 -->

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

## Amazon SNS – Security

<!-- pdf-page: 520 -->

Encryption:

  - In-flight encryption using HTTPS API
  - At-rest encryption using KMS keys
  - Client-side encryption if the client wants to perform encryption/decryption itself
- Access Controls: IAM policies to regulate access to the SNS API
- SNS Access Policies (similar to S3 bucket policies)
  - Useful for cross-account access to SNS topics
  - Useful for allowing other services ( S3…) to write to an SNS topic

## SNS + SQS: Fan Out

<!-- pdf-page: 521 -->

SNS plus separate SQS queues lets fraud and shipping consumers process the same order independently.

- Push once in SNS, receive in all SQS queues that are subscribers
- Consumers are decoupled; delivery policies, retention and failure handling still determine reliability.
- SQS allows for: data persistence, delayed processing and retries of work
- Ability to add more SQS subscribers over time
- The destination queue policy must permit the SNS topic to send messages.

## Application: S3 Events to multiple queues

<!-- pdf-page: 522 -->

An S3 event can publish to SNS, which distributes notifications to independent queue and function subscribers.

- For the same combination of: event type (e.g. object create) and prefix (e.g. images/) you can only have one S3 Event rule
- If you want to send the same S3 event to many SQS queues, use fan-out

## Application: SNS to Amazon S3 through Data Firehose

<!-- pdf-page: 523 -->

An SNS Firehose subscription can archive topic events to S3 through buffered delivery.

- SNS can send to Kinesis and therefore we can have the following solutions architecture:

## Amazon SNS – FIFO Topic

<!-- pdf-page: 524 -->

SNS FIFO and SQS FIFO preserve supported per-group ordering and deduplication; consumers must still handle retries idempotently.

- FIFO = First In First Out (ordering of messages in the topic)
- Similar features as SQS FIFO:
  - Ordering by Message Group ID (all messages in the same group are ordered)
  - Deduplication using a Deduplication ID or Content Based Deduplication
- Can have SQS Standard and FIFO queues as subscribers
- Limited throughput (same throughput as SQS FIFO)

## SNS FIFO + SQS FIFO: Fan Out

<!-- pdf-page: 525 -->

FIFO fan-out gives each subscribed queue its own ordered processing path.

- In case you need fan out + ordering + deduplication

## SNS – Message Filtering

<!-- pdf-page: 526 -->

Subscription filter policies route only matching events; a subscription without a filter receives all supported messages.

- JSON policy used to filter messages sent to SNS topic’s subscriptions
- If a subscription doesn’t have a filter policy, it receives every message

## AWS Step Functions

<!-- pdf-page: 527 -->

Use to design workflows

- Easy visualizations
- Advanced Error Handling and Retry mechanism outside the code
- Audit of the history of workflows
- Ability to “Wait” for an arbitrary amount of time
- Max execution time of a State Machine is 1 year

## Step Functions – Examples Train a Machine Learning Model

<!-- pdf-page: 528 -->

A training workflow makes data preparation, training, evaluation and conditional deployment explicit orchestration steps.

## Step Functions – Examples Tune a Machine Learning Model

<!-- pdf-page: 529 -->

A tuning workflow launches a search, waits for its outcome and selects the best eligible model.

## Step Functions – Examples Manage a Batch Job

<!-- pdf-page: 530 -->

Step Functions can submit a Batch job and coordinate success or failure paths with downstream work.

## AWS Step Functions

<!-- pdf-page: 531 -->

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

## Amazon AppFlow

<!-- pdf-page: 532 -->

Fully managed integration service that enables you to securely transfer data between Software-as-a-Service (SaaS) applications and AWS

- Sources: Salesforce, SAP, Zendesk, Slack, and ServiceNow
- Destinations: AWS services like Amazon S3, Amazon Redshift or non-AWS such as SnowFlake and Salesforce
- Frequency: on a schedule, in response to events, or on demand
- Data transformation capabilities like filtering and validation
- Encrypted over the public internet or privately over AWS PrivateLink
- Don’t spend time writing the integrations and leverage APIs

## Amazon AppFlow

<!-- pdf-page: 533 -->

AppFlow transfers supported SaaS data to configured AWS or SaaS destinations with optional mapping and filtering.

## Amazon EventBridge (formerly CloudWatch Events)

<!-- pdf-page: 534 -->

EventBridge routes matching events to targets; scheduled workflows may use EventBridge Scheduler or supported schedule rules.

- Schedule: Cron jobs (scheduled scripts)
- Event Pattern: Event rules to react to a service doing something
- Trigger Lambda functions, send SQS/SNS messages…

## Amazon EventBridge Rules

<!-- pdf-page: 535 -->

An event envelope carries source, detail type and detail fields; rules match patterns before invoking targets.

## Amazon EventBridge

<!-- pdf-page: 536 -->

Default, partner and custom buses separate event intake; each has configured rules and permissions.

- Event buses can be accessed by other AWS accounts using Resource- based Policies
- You can archive events (all/filter) sent to an event bus (indefinitely or set period)
- Ability to replay archived events

## Amazon EventBridge – Schema Registry

<!-- pdf-page: 537 -->

EventBridge can analyze the events in your bus and infer the schema

- The Schema Registry allows you to generate code for your application, that will know in advance how data is structured in the event bus
- Schema can be versioned

## Amazon EventBridge – Resource-based Policy

<!-- pdf-page: 538 -->

Cross-account event routing requires a permitted target bus and receiver resource policy before receiver rules invoke local targets.

- Manage permissions for a specific Event Bus
- Example: allow/deny events from another AWS account or AWS region
- Use case: aggregate all events from your AWS Organization in a single AWS account or AWS region

## Amazon Managed Workflows for Apache Airflow (MWAA)

<!-- pdf-page: 539 -->

Apache Airflow is batch-oriented workflow tool

- Develop, schedule, and monitor your workflows
- Workflows are defined as Python code that creates a Directed Acyclic Graph (DAG)
- Amazon MWAA provides a managed service for Apache Airflow so you don’t have to deal with installing or maintaining it
- Use cases:
  - Complex workflows
  - ETL coordination
  - Preparing ML data

## Airflow DAG: schedule and task dependency

<!-- pdf-page: 540 -->

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

## Airflow + MWAA

<!-- pdf-page: 541 -->

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

## Amazon MWAA Integration

<!-- pdf-page: 542 -->

Leverages open-source integrations

  - Athena, Batch, CloudWatch, DynamoDB, DataSync
  - EMR, Fargate, EKS, Kinesis, Glue, Lambda
  - Redshift, SQS, SNS, SageMaker, S3… and more
  - Security services (AWS Secrets Manager, etc)
- Schedulers and Workers are AWS Fargate containers

## Amazon MWAA Architecture

<!-- pdf-page: 543 -->

MWAA separates customer-VPC schedulers/workers from service-VPC web and metadata services; private endpoints, IAM, KMS, S3, ECR and CloudWatch support the environment.

# Section Security, identity and compliance

## Least privilege

<!-- pdf-page: 545 -->

Grant only the actions and resource scope required by the workload.

- Use roles and temporary credentials for workloads; scope bucket listing separately from object reads.
- IAM Access Analyzer can help generate policies from observed activity, followed by review and refinement.
- The PDF suggests starting broadly during development. Treat that as an isolated learning shortcut, not a recommended production baseline.

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

<!-- pdf-page: 546 -->

Dealing with PII or other sensitive data

- Masking obfuscates data
  - For example, masking all but the last 4 digits of a credit card or social security number
  - Masking passwords
  - Supported in Glue DataBrew and Redshift

## Masking, pseudonymization and anonymization

<!-- pdf-page: 547 -->

Reducing identifiability requires a threat model, not just changing the displayed value.

- The source lists replacement, shuffling, encryption, hashing and deletion as techniques.
- Encryption is reversible with a key; a hash can still permit matching or guessing. Neither automatically makes a dataset anonymous.
- Minimize collection, restrict access and assess re-identification risk across the retained fields.

## Password salts and hashing

<!-- pdf-page: 548 -->

A unique random salt prevents identical passwords from producing identical stored hashes and defeats reusable precomputed lookup tables.

- Use a suitable password-hashing scheme with a cost factor; do not substitute a single fast general-purpose hash.
- Store the salt and scheme parameters with the derived hash. Salts are not passwords or encryption keys.
- The PDF's periodic-salt-rotation bullet is not a standalone password-storage recipe; use the selected scheme's supported password-change and rehash process.

**Current reference (checked 2026-10-13):** [NIST password storage guidance](https://pages.nist.gov/800-63-4/sp800-63b.html).

## Key Salting: Example

<!-- pdf-page: 549 -->

A password-hashing illustration combines a salt with a password. A fast SHA-256 hash alone is not an appropriate production password-storage scheme.

**Current reference (checked 2026-10-13):** [NIST password storage guidance](https://pages.nist.gov/800-63-4/sp800-63b.html).

## Keeping Data Where it Belongs

<!-- pdf-page: 550 -->

Compliance may prohibit data from being transferred into certain regions

- It’s all too easy for backups or replication to send data to a region where it is not allowed
- AWS Organizations’ Service Control Policies are one way to enforce this
- Restrict IAM policies and S3 bucket policies to allowed regions
- Take care when configuring backups & replication for RDS, Aurora, Redshift
- Monitor and alarm with CloudTrail / CloudWatch

## Keeping Data Where it Belongs

<!-- pdf-page: 551 -->

Example: IAM Policy to restrict RDS to backups in us-east-1 and us-west-1

## IAM: Users & Groups

<!-- pdf-page: 552 -->

IAM users can belong to multiple groups; groups collect permissions and do not contain other groups.

- IAM = Identity and Access Management, Global service
- Root account created by default, shouldn’t be used or shared
- Users are people within your organization, and can be grouped
- Groups only contain users, not other groups
- Users don’t have to belong to a group, and user can belong to multiple groups

## IAM: Permissions

<!-- pdf-page: 553 -->

Users or Groups can be assigned JSON documents called policies

- These policies define the permissions of the users
- In AWS you apply the least privilege principle: don’t give more permissions than a user needs

## IAM Policies inheritance

<!-- pdf-page: 554 -->

Identity permissions may come from direct and group policies, but explicit denies, boundaries and organization controls constrain effective access.

## IAM Policies Structure

<!-- pdf-page: 555 -->

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

## IAM – Password Policy

<!-- pdf-page: 556 -->

Strong passwords = higher security for your account

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

<!-- pdf-page: 557 -->

MFA adds an independent authentication factor to the password sign-in path.

- Users have access to your account and can possibly change configurations or delete resources in your AWS account
- You want to protect your Root Accounts and IAM users
- MFA = password you know + security device you own
- Main benefit of MFA: if a password is stolen or hacked, the account is not compromised

## MFA: authenticator applications and security keys

<!-- pdf-page: 558 -->

Choose a supported independent authentication factor for the sign-in context.

- Authenticator applications generate time-based codes; supported security keys/passkeys use a different mechanism.
- The PDF names example vendors. Check current supported devices rather than treating those names as an exhaustive list.

## MFA: hardware devices

<!-- pdf-page: 559 -->

Hardware MFA devices are another supported factor option; availability differs by account environment.

- The course distinguishes ordinary commercial-account devices and GovCloud device options.
- Verify current supported hardware and enrollment requirements before purchasing.

## IAM Roles for Services

<!-- pdf-page: 560 -->

An EC2 instance profile exposes temporary role credentials to software on the instance; role permissions govern subsequent AWS calls.

- Some AWS service will need to perform actions on your behalf
- To do so, we will assign permissions to AWS services with IAM Roles
- Common roles:
  - EC2 Instance Roles
  - Lambda Function Roles
  - Roles for CloudFormation

## Why encryption? Encryption in flight (TLS / SSL)

<!-- pdf-page: 561 -->

TLS protects data while it crosses the network; it is separate from storage encryption.

- Data is encrypted before sending and decrypted after receiving
- TLS certificates help with encryption (HTTPS)
- Encryption in flight ensures no MITM (man in the middle attack) can happen

## Why encryption? Server-side encryption at rest

<!-- pdf-page: 562 -->

With server-side encryption, the storage service receives data and encrypts it before persistence.

- Data is encrypted after being received by the server
- Data is decrypted before being sent
- It is stored in an encrypted form thanks to a key (usually a data key)
- The encryption / decryption keys must be managed somewhere, and the server must have access to it

## Why encryption? Client-side encryption

<!-- pdf-page: 563 -->

With client-side encryption, the service stores ciphertext and the client controls decryption.

- Data is encrypted by the client and never decrypted by the server
- Data will be decrypted by a receiving client
- The server should not be able to decrypt the data
- Could leverage Envelope Encryption

## AWS KMS (Key Management Service)

<!-- pdf-page: 564 -->

Anytime you hear “encryption” for an AWS service, it’s most likely KMS

- AWS manages encryption keys for us
- Fully integrated with IAM for authorization
- Easy way to control access to your data
- Able to audit KMS Key usage using CloudTrail
- Seamlessly integrated into most AWS services (EBS, S3, RDS, SSM…)
- Never ever store your secrets in plaintext, especially in your code!
  - KMS Key Encryption also available through API calls (SDK, CLI)

## KMS key types and operations

<!-- pdf-page: 565 -->

Key type and key usage determine which cryptographic operations a KMS key supports.

- Symmetric encryption keys use the same secret key material for encryption and decryption; AWS integrations commonly use this model.
- Asymmetric keys have a public/private pair. Supported RSA keys may encrypt/decrypt or sign/verify according to their configured usage; ECC keys are not generic RSA encryption replacements.
- The public key can be downloaded for supported external operations; unencrypted private key material is not exported from KMS.
- Use the current key-specification and key-usage documentation rather than applying every listed operation to every asymmetric key.

**Current reference (checked 2026-10-13):** [KMS asymmetric key specifications](https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html).

## AWS KMS (Key Management Service)

<!-- pdf-page: 566 -->

Distinguish AWS-owned, AWS-managed and customer-managed keys, including control, rotation and billing.

- Pricing figures on this source page are a dated illustration. Check current Region, usage and feature pricing before making a cost decision.
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

<!-- pdf-page: 567 -->

KMS keys are Regional. Copying an encrypted EBS snapshot to another Region uses an appropriate destination-Region key.

## KMS Key Policies

<!-- pdf-page: 568 -->

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

## Copying Snapshots across accounts

<!-- pdf-page: 569 -->

Cross-account encrypted snapshot sharing requires snapshot permission and use of the source customer-managed key; the recipient can copy under its own key.

## AWS Macie

<!-- pdf-page: 570 -->

Macie discovers sensitive S3 data and emits findings that EventBridge can route to response workflows.

- Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS.
- Macie helps identify and alert you to sensitive data, such as personally identifiable information (PII)

## AWS Secrets Manager

<!-- pdf-page: 571 -->

Newer service, meant for storing secrets

- Capability to force rotation of secrets every X days
- Automate generation of secrets on rotation (uses Lambda)
- Integration with Amazon RDS (MySQL, PostgreSQL, Aurora)
- Secrets are encrypted using KMS
- Mostly meant for RDS integration

## AWS Secrets Manager – Multi-Region Secrets

<!-- pdf-page: 572 -->

Secrets Manager can replicate a secret into another Region; replication and rotation behavior must be planned for regional access.

- Replicate Secrets across multiple AWS Regions
- Secrets Manager keeps read replicas in sync with the primary Secret
- Ability to promote a read replica Secret to a standalone Secret
- Use cases: multi-region apps, disaster recovery strategies, multi- region DB…

## AWS WAF – Web Application Firewall

<!-- pdf-page: 573 -->

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

<!-- pdf-page: 574 -->

Define Web ACL (Web Access Control List) Rules:

  - IP Set: up to 10,000 IP addresses – use multiple Rules for more IPs
  - HTTP headers, HTTP body, or URI strings Protects from common attack - SQL injection and Cross-Site Scripting (XSS)
  - Size constraints, geo-match (block countries)
  - Rate-based rules (to count occurrences of events) – for DDoS protection
- Web ACL are Regional except for CloudFront
- A rule group is a reusable set of rules that you can add to a web ACL

## WAF – Fixed IP while using WAF with a Load Balancer

<!-- pdf-page: 575 -->

Global Accelerator can expose static anycast addresses in front of an ALB protected by WAF; WAF attaches to supported application endpoints.

- WAF does not support the Network Load Balancer (Layer 4)
- We can use Global Accelerator for fixed IP and WAF on the ALB

## AWS Shield: protect from DDoS attack

<!-- pdf-page: 576 -->

DDoS: Distributed Denial of Service – many requests at the same time

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

<!-- pdf-page: 577 -->

Kinesis Data Streams

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

<!-- pdf-page: 578 -->

Encryption in flight using the HTTPS endpoint

- Server Side Encryption using KMS
- IAM policy must allow usage of SQS
- SQS queue access policy
- Client-side encryption must be implemented manually
- VPC Endpoint is provided through an Interface

## Security – AWS IoT

<!-- pdf-page: 579 -->

AWS IoT policies:

  - Attached to X.509 certificates or Cognito Identities
  - Able to revoke any device at any time
  - IoT Policies are JSON documents
  - Can be attached to groups instead of individual Things.
- IAM Policies:
  - Attached to users, group or roles
  - Used for controlling IoT AWS APIs
- Attach roles to Rules Engine so they can perform their actions

## Security – Amazon S3

<!-- pdf-page: 580 -->

IAM policies

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

<!-- pdf-page: 581 -->

Data is encrypted in transit using TLS (HTTPS)

- DynamoDB tables are encrypted at rest
  - KMS encryption for base tables and secondary indexes
  - AWS owned key (default)
  - AWS managed key (aws/dynamodb)
  - AWS customer managed key (your own)
- Access to tables / API / DAX using IAM
- DynamoDB Streams are encrypted
- VPC Endpoint is provided through a Gateway

## Security - RDS

<!-- pdf-page: 582 -->

VPC provides network isolation

- Security Groups control network access to DB Instances
- KMS provides encryption at rest
- SSL provides encryption in-flight
- IAM policies provide protection for the RDS API
- IAM authentication is supported by PostgreSQL, MySQL and MariaDB
- Must manage user permissions within the database itself
- MSSQL Server and Oracle support TDE (Transparent Data Encryption)

## Security - Aurora

<!-- pdf-page: 583 -->

(very similar to RDS)

- VPC provides network isolation
- Security Groups control network access to DB Instances
- KMS provides encryption at rest
- SSL provides encryption in-flight
- IAM authentication is supported by PostgreSQL and MySQL
- Must manage user permissions within the database itself

## Security - Lambda

<!-- pdf-page: 584 -->

IAM roles attached to each Lambda function

- Sources
- Targets
- KMS encryption for secrets
- SSM parameter store for configurations
- CloudWatch Logs
- Deploy in VPC to access private resources

## Security - Glue

<!-- pdf-page: 585 -->

IAM policies for the Glue service

- Configure Glue to only access JDBC through SSL
- Data Catalog: Encrypted by KMS
- Connection passwords: Encrypted by KMS
- Data written by AWS Glue – Security Configurations:
  - S3 encryption mode: SSE-S3 or SSE-KMS
  - CloudWatch encryption mode
  - Job bookmark encryption mode

## Security - EMR

<!-- pdf-page: 586 -->

Using Amazon EC2 key pair for SSH credentials

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

<!-- pdf-page: 587 -->

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

## Security – OpenSearch Service

<!-- pdf-page: 588 -->

Amazon VPC provides network isolation

- OpenSearch policy to manage security further
- Data security by encrypting data at-rest using KMS
- Encryption in-transit using HTTPS (TLS)
- IAM or Cognito based authentication
- Amazon Cognito allow end-users to log-in to OpenSearch Dashboards through enterprise identity providers such as Microsoft Active Directory using SAML

## Security - Redshift

<!-- pdf-page: 589 -->

VPC provides network isolation

- Cluster security groups
- Encryption in flight using the JDBC driver enabled with SSL
- Encryption at rest using KMS or an HSM device (establish a connection)
- Supports S3 SSE using default managed key
- Use IAM Roles for Redshift
- To access other AWS Resources (example S3 or KMS)
- Must be referenced in the COPY or UNLOAD command (alternatively paste access key and secret key creds)

## Security - Athena

<!-- pdf-page: 590 -->

IAM policies to control access to the service

- Data is in S3: IAM policies, bucket policies & ACLs
- Encryption of data according to S3 standards: SSE-S3, SSE- KMS, CSE-KMS
- Encryption in transit using TLS between Athena and S3 and JDBC
- Fine grained access using the AWS Glue Catalog

## Security - Quicksight

<!-- pdf-page: 591 -->

Standard edition:

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

<!-- pdf-page: 593 -->

A VPC is Regional; subnets each occupy one AZ, with route tables determining public or private routing.

- VPC: private network to deploy your resources (regional resource)
- Subnets allow you to partition your network inside your VPC (Availability Zone resource)
- A public subnet is a subnet that is accessible from the internet
- A private subnet is a subnet that is not accessible from the internet
- To define access to the internet and between subnets, we use Route Tables.

## VPC Diagram

<!-- pdf-page: 594 -->

Subnet CIDRs divide a VPC address range into nonoverlapping ranges within individual AZs.

## Internet Gateway & NAT Gateways

<!-- pdf-page: 595 -->

Private IPv4 workloads can initiate internet traffic through a NAT gateway in a public subnet and an internet gateway; unsolicited inbound access is not provided.

- Internet Gateways helps our VPC instances connect with the internet
- Public Subnets have a route to the internet gateway.
- NAT Gateways (AWS-managed) & NAT Instances (self-managed) allow your instances in your Private Subnets to access the internet while remaining private

## Network ACL & Security Groups

<!-- pdf-page: 596 -->

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

## Network ACLs vs Security Groups

<!-- pdf-page: 597 -->

Security groups are stateful allow rules; NACLs are stateless ordered allow/deny rules requiring return-path allowances.

## VPC Flow Logs

<!-- pdf-page: 598 -->

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

## VPC Peering

<!-- pdf-page: 599 -->

VPC peering is nontransitive: A-to-B and B-to-C do not establish A-to-C connectivity.

- Connect two VPC, privately using AWS’ network
- Make them behave as if they were in the same network
- Must not have overlapping CIDR (IP address range)
- VPC Peering connection is not transitive (must be established for each VPC that need to communicate with one another)

## VPC Endpoints

<!-- pdf-page: 600 -->

Interface endpoints use private ENIs for supported services; gateway endpoints route S3 or DynamoDB traffic through route-table entries.

- Endpoints allow you to connect to AWS Services using a private network instead of the public www network
- This gives you enhanced security and lower latency to access AWS services
- VPC Endpoint Gateway: S3 & DynamoDB
- VPC Endpoint Interface: most services (including S3 & DynamoDB)
- Only used within your VPC

## Site to Site VPN & Direct Connect

<!-- pdf-page: 601 -->

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

## VPC Closing Comments

<!-- pdf-page: 602 -->

VPC: Virtual Private Cloud

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

<!-- pdf-page: 603 -->

PrivateLink exposes a provider service through an endpoint service and consumer interface endpoint, without broad VPC peering.

- Most secure & scalable way to expose a service to 1000s of VPCs
- Does not require VPC peering, internet gateway, NAT, route tables…
- Requires a network load balancer (Service VPC) and ENI (Customer VPC)

## What is DNS?

<!-- pdf-page: 604 -->

Domain Name System which translates the human friendly hostnames into the machine IP addresses

- www.google.com => 172.217.18.36
- DNS is the backbone of the Internet
- DNS uses hierarchical naming structure

## DNS Terminologies

<!-- pdf-page: 605 -->

DNS names form a hierarchy from root to top-level domain to authoritative domain and subdomains.

- Domain Registrar: Amazon Route 53, GoDaddy, …
- DNS Records: A, AAAA, CNAME, NS, …
- Zone File: contains DNS records
- Name Server: resolves DNS queries (Authoritative or Non- Authoritative)
- Top Level Domain (TLD): .com, .us, .in, .gov, .org, …
- Second Level Domain (SLD): amazon.com, google.com, …

## How DNS Works

<!-- pdf-page: 606 -->

A recursive resolver follows delegations when its cache has no answer, then returns an address that the client uses separately for HTTP.

## Amazon Route 53

<!-- pdf-page: 607 -->

Route 53 answers DNS queries from hosted-zone records; the client's application traffic then goes to the resolved endpoint.

- A highly available, scalable, fully managed and Authoritative DNS
  - Authoritative = the customer (you) can update the DNS records
- Route 53 is also a Domain Registrar
- Ability to check the health of your resources
- The only AWS service which provides 100% availability SLA
- Why Route 53? 53 is a reference to the traditional DNS port

## Route 53 – Records

<!-- pdf-page: 608 -->

How you want to route traffic for a domain

- Each record contains:
  - Domain/subdomain Name – e.g., example.com
  - Record Type – e.g., A or AAAA
  - Value – e.g., 12.34.56.78
  - Routing Policy – how Route 53 responds to queries
  - TTL – amount of time the record cached at DNS Resolvers
- Route 53 supports the following DNS record types:
  - (must know) A / AAAA / CNAME / NS
  - (advanced) CAA / DS / MX / NAPTR / PTR / SOA / TXT / SPF / SRV

## Route 53 – Record Types

<!-- pdf-page: 609 -->

A – maps a hostname to IPv4

- AAAA – maps a hostname to IPv6
- CNAME – maps a hostname to another hostname
  - The target is a domain name which must have an A or AAAA record
  - Can’t create a CNAME record for the top node of a DNS namespace (Zone Apex)
  - Example: you can’t create for example.com, but you can create for www.example.com
- NS – Name Servers for the Hosted Zone
  - Control how traffic is routed for a domain

## Route 53 – Hosted Zones

<!-- pdf-page: 610 -->

A container for records that define how to route traffic to a domain and its subdomains

- Pricing figures on this source page are a dated illustration. Check current Region, usage and feature pricing before making a cost decision.
- Public Hosted Zones – contains records that specify how to route traffic on the Internet (public domain names) application1.mypublicdomain.com
- Private Hosted Zones – contain records that specify how you route traffic within one or more VPCs (private domain names) application1.company.internal
- You pay $0.50 per month per hosted zone

## Route 53 – Public vs. Private Hosted Zones

<!-- pdf-page: 611 -->

Public hosted zones answer public DNS; private hosted zones answer through associated VPC resolver contexts.

## Amazon CloudFront

<!-- pdf-page: 612 -->

A CDN serves geographically distributed clients from nearby edge caches while retaining an origin for uncached content.

- Content Delivery Network (CDN)
- Improves read performance, content is cached at the edge
- Improves users experience
- Hundreds of Points of Presence globally (edge locations, caches)
- DDoS protection (because worldwide), integration with Shield, AWS Web Application Firewall

## CloudFront – Origins

<!-- pdf-page: 613 -->

S3 bucket

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

<!-- pdf-page: 614 -->

CloudFront serves cache hits at the edge and fetches cache misses from the origin according to its cache behavior.

## CloudFront – S3 as an Origin

<!-- pdf-page: 615 -->

Origin Access Control authorizes CloudFront access to a private S3 origin while viewers use the distribution endpoint.

## CloudFront vs S3 Cross Region Replication

<!-- pdf-page: 616 -->

CloudFront:

  - Global Edge network
  - Files are cached for a TTL (maybe a day)
  - Great for static content that must be available everywhere
- S3 Cross Region Replication:
  - Must be setup for each region you want replication to happen
  - Files are updated in near real-time
  - Read only
  - Great for dynamic content that needs to be available at low- latency in few regions

## CloudFront – ALB or EC2 as an origin Using VPC Origins

<!-- pdf-page: 617 -->

A supported CloudFront VPC origin reaches a private ALB, NLB or EC2 origin through managed connectivity.

- Allows you to deliver content from your applications hosted in your VPC private subnets (no need to expose them on the Internet)
- Deliver traffic to private:
  - Application Load Balancer
  - Network Load Balancer
  - EC2 Instances

## CloudFront – ALB or EC2 as an origin Using Public Network

<!-- pdf-page: 618 -->

For a public custom origin, security-group restrictions can limit origin ingress to CloudFront origin-facing addresses; application authorization remains separate.

## CloudFront – Cache Invalidations

<!-- pdf-page: 619 -->

Updating the origin does not instantly replace cached objects. Invalidation requests remove selected cached paths before their normal expiry.

- In case you update the back-end origin, CloudFront doesn’t know about it and will only get the refreshed content after the TTL has expired
- However, you can force an entire or partial cache refresh (thus bypassing the TTL) by performing a CloudFront Invalidation
- You can invalidate all files (*) or a special path (/images/*)

# Section Management and governance

## Amazon CloudWatch Metrics

<!-- pdf-page: 621 -->

CloudWatch provides metrics for every service in AWS

- Metric is a variable to monitor (CPUUtilization, NetworkIn…)
- Metrics belong to namespaces
- Dimension is an attribute of a metric (instance id, environment, etc…).
- Up to 30 dimensions per metric
- Metrics have timestamps
- Can create CloudWatch dashboards of metrics
- Can create CloudWatch Custom Metrics (for the RAM for example)

## CloudWatch Metric Streams

<!-- pdf-page: 622 -->

CloudWatch Metric Streams continuously deliver selected metric updates through Firehose to supported analysis destinations.

- Continually stream CloudWatch metrics to a destination of your choice, with near-real-time delivery and low latency.
  - Amazon Data Firehose (and then its destinations)
  - 3rd party service provider: Datadog, Dynatrace, New Relic, Splunk, Sumo Logic…
- Option to filter metrics to only stream a subset of them

## CloudWatch Logs

<!-- pdf-page: 623 -->

Log groups: arbitrary name, usually representing an application

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

<!-- pdf-page: 624 -->

SDK, CloudWatch Logs Agent, CloudWatch Unified Agent

- Elastic Beanstalk: collection of logs from application
- ECS: collection from containers
- AWS Lambda: collection from function logs
- VPC Flow Logs: VPC specific logs
- API Gateway
- CloudTrail based on filter
- Route53: Log DNS queries

## CloudWatch Logs Insights

<!-- pdf-page: 625 -->

Logs Insights queries selected log groups and a time range; results help diagnose events rather than mutate the source logs.

## CloudWatch Logs Insights

<!-- pdf-page: 626 -->

Search and analyze log data stored in CloudWatch Logs

- Example: find a specific IP inside a log, count occurrences of “ERROR” in your logs…
- Provides a purpose-built query language
  - Automatically discovers fields from AWS services and JSON log events
  - Fetch desired event fields, filter based on conditions, calculate aggregate statistics, sort events, limit number of events…
  - Can save queries and add them to CloudWatch Dashboards
- Can query multiple Log Groups in different AWS accounts
- It’s a query engine, not a real-time engine

## CloudWatch Logs – S3 Export

<!-- pdf-page: 627 -->

CreateExportTask exports CloudWatch Logs to S3 asynchronously; it is not a low-latency streaming delivery mechanism.

- Log data can take up to 12 hours to become available for export
- The API call is CreateExportTask
- Not near-real time or real-time… use Logs Subscriptions instead

## CloudWatch Logs Subscriptions

<!-- pdf-page: 628 -->

Subscription filters route matching log events to supported stream, delivery or function destinations.

- Get a real-time log events from CloudWatch Logs for processing and analysis
- Send to Kinesis Data Streams, Data Firehose, or Lambda
- Subscription Filter – filter which logs are events delivered to your destination

## CloudWatch Logs Aggregation Multi-Account & Multi Region

<!-- pdf-page: 629 -->

A centralized logging design forwards account/Region log groups into a configured aggregation path and archival storage.

## CloudWatch Logs Subscriptions

<!-- pdf-page: 630 -->

Cross-account log subscriptions use a destination resource policy and appropriate roles to permit forwarding to the destination stream.

- Cross-Account Subscription – send log events to resources in a different AWS account (KDS, KDF)

## CloudWatch Logs for EC2

<!-- pdf-page: 631 -->

The CloudWatch agent collects configured host metrics and logs from EC2 or on-premises hosts.

- By default, no logs from your EC2 machine will go to CloudWatch
- You need to run a CloudWatch agent on EC2 to push the log files you want
- Make sure IAM permissions are correct
- The CloudWatch log agent can be setup on-premises too

## CloudWatch Logs Agent & Unified Agent

<!-- pdf-page: 632 -->

For virtual servers (EC2 instances, on-premises servers…)

- CloudWatch Logs Agent
  - Old version of the agent
  - Can only send to CloudWatch Logs
- CloudWatch Unified Agent
  - Collect additional system-level metrics such as RAM, processes, etc…
  - Collect logs to send to CloudWatch Logs
  - Centralized configuration using SSM Parameter Store

## CloudWatch Unified Agent – Metrics

<!-- pdf-page: 633 -->

Collected directly on your Linux server / EC2 instance

- CPU (active, guest, idle, system, user, steal)
- Disk metrics (free, used, total), Disk IO (writes, reads, bytes, iops)
- RAM (free, inactive, used, total, cached)
- Netstat (number of TCP and UDP connections, net packets, bytes)
- Processes (total, dead, bloqued, idle, running, sleep)
- Swap Space (free, used, used %)
- Reminder: out-of-the box metrics for EC2 – disk, CPU, network (high level)

## CloudWatch Alarms

<!-- pdf-page: 634 -->

Alarms are used to trigger notifications for any metric

- Various options (sampling, %, max, min, etc…)
- Alarm States:
  - OK
  - INSUFFICIENT_DATA
  - ALARM
- Period:
  - Length of time in seconds to evaluate the metric
  - High resolution custom metrics: 10 sec, 30 sec or multiples of 60 sec

## CloudWatch Alarm Targets

<!-- pdf-page: 635 -->

Stop, Terminate, Reboot, or Recover an EC2 Instance

- Trigger Auto Scaling Action
- Send notification to SNS (from which you can do pretty much anything)

## CloudWatch Alarms – Composite Alarms

<!-- pdf-page: 636 -->

A composite alarm evaluates the states of other alarms, such as CPU and IOPS, before notifying.

- CloudWatch Alarms are on a single metric
- Composite Alarms are monitoring the states of multiple other alarms
- AND and OR conditions
- Helpful to reduce “alarm noise” by creating complex composite alarms

## EC2 Instance Recovery

<!-- pdf-page: 637 -->

A supported EC2 status-check alarm can request instance recovery and separately send a notification.

- Status Check:
  - Instance status = check the EC2 VM
  - System status = check the underlying hardware
  - Attached EBS status = check attached EBS volumes
- Recovery: Same Private, Public, Elastic IP, metadata, placement group

## CloudWatch Alarm: good to know

<!-- pdf-page: 638 -->

A metric filter turns matching log patterns into numeric metrics; an alarm evaluates the metric and invokes configured actions.

- Alarms can be created based on CloudWatch Logs Metrics Filters
- To test alarms and notifications, set the alarm state to Alarm using CLI aws cloudwatch set-alarm-state --alarm-name "myalarm" -- state-value ALARM --state-reason "testing purposes"

## AWS CloudTrail

<!-- pdf-page: 639 -->

Provides governance, compliance and audit for your AWS Account

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

<!-- pdf-page: 640 -->

CloudTrail records supported account activity across console, CLI and SDK calls and can deliver trails to S3 and CloudWatch Logs.

## CloudTrail Events

<!-- pdf-page: 641 -->

Management Events:

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

<!-- pdf-page: 642 -->

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

## CloudTrail Events Retention

<!-- pdf-page: 643 -->

Event history provides a limited management-event window; trails in S3 support longer retention and Athena analysis.

- Events are stored for 90 days in CloudTrail
- To keep events beyond this period, log them to S3 and use Athena

## AWS CloudTrail Lake

<!-- pdf-page: 644 -->

NOTE: Now in maintenance mode (but still in exam guide)

- Managed data lake for CloudTrail events
- Integrates collection, storage, preparation, and optimization for analysis & query
  - Events are converted to ORC format
- Enables querying CloudTrail data with SQL
- Enable it with the “Create event data store” menu choice in the console

## AWS CloudTrail Lake

<!-- pdf-page: 645 -->

Specify the event types you want to track

- Note KMS events add up fast and can make your costs blow up
- Basic event selectors can be selected in the UI
- Finer grained selection may be achieved with advanced event selectors
  - This can help control your ingestion and storage costs
- You can create “channels” to integrate with events outside of AWS
  - Built-in support for Okta, LaunchDarkly, Clumio, and other CloudTrail partners
  - Or custom integrations

## CloudTrail advanced event selector example

<!-- pdf-page: 646 -->

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

<!-- pdf-page: 647 -->

Lake dashboards allow you to visualize events

- Roll your own SQL queries
- Start from sample queries in the CloudTrail Lake Editor
- Remember to bound your queries by eventTime to constrain costs

## AWS Config

<!-- pdf-page: 648 -->

Helps with auditing and recording compliance of your AWS resources

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

<!-- pdf-page: 649 -->

Can use AWS managed config rules (over 75)

- Can make custom config rules (must be defined in AWS Lambda)
  - Ex: evaluate if each EBS disk is of type gp2
  - Ex: evaluate if each EC2 instance is t2.micro
- Rules can be evaluated / triggered:
  - For each config change
  - And / or: at regular time intervals
- AWS Config Rules does not prevent actions from happening (no deny)
- Pricing: no free tier, $0.003 per configuration item recorded per region, $0.001 per config rule evaluation per region

## AWS Config Resource

<!-- pdf-page: 650 -->

Config associates resource configuration history with compliance evaluations; CloudTrail supplies a separate API-activity history.

- View compliance of a resource over time
- View configuration of a resource over time
- View CloudTrail API calls of a resource over time

## Config Rules – Remediations

<!-- pdf-page: 651 -->

A Config remediation can invoke a Systems Manager Automation document; role permissions and retry limits control the corrective action.

- Automate remediation of non-compliant resources using SSM Automation Documents
- Use AWS-Managed Automation Documents or create custom Automation Documents
  - Tip: you can create custom Automation Documents that invokes Lambda function
- You can set Remediation Retries if the resource is still non-compliant after auto-remediation

## Config Rules – Notifications

<!-- pdf-page: 652 -->

Config changes and compliance events can route through EventBridge; SNS delivery is another configured notification path.

- Use EventBridge to trigger notifications when AWS resources are non-compliant
- Ability to send configuration changes and compliance state notifications to SNS (all events – use SNS Filtering or filter at client-side)

## CloudWatch vs CloudTrail vs Config

<!-- pdf-page: 653 -->

CloudWatch

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

<!-- pdf-page: 654 -->

CloudWatch:

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

<!-- pdf-page: 655 -->

CloudFormation is a declarative way of outlining your AWS Infrastructure, for any resources (most of them are supported).

- For example, within a CloudFormation template, you say:
  - I want a security group
  - I want two EC2 instances using this security group
  - I want an S3 bucket
  - I want a load balancer (ELB) in front of these machines
- Then CloudFormation creates those for you, in the right order, with the exact configuration that you specify

## Benefits of AWS CloudFormation (1/2)

<!-- pdf-page: 656 -->

Infrastructure as code

  - No resources are manually created, which is excellent for control
  - Changes to the infrastructure are reviewed through code
- Cost
  - Each resources within the stack is tagged with an identifier so you can easily see how much a stack costs you
  - You can estimate the costs of your resources using the CloudFormation template
  - Savings strategy: In Dev, you could automation deletion of templates at 5 PM and recreated at 8 AM, safely

## Benefits of AWS CloudFormation (2/2)

<!-- pdf-page: 657 -->

Productivity

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

<!-- pdf-page: 658 -->

Infrastructure Composer visualizes CloudFormation resources and dependencies; the template remains the deployment source.

- Example: WordPress CloudFormation Stack
- We can see all the resources
- We can see the relations between the components

## SSM Parameter Store

<!-- pdf-page: 659 -->

An application retrieves authorized Parameter Store values; SecureString access also depends on KMS decrypt permissions.

- Secure storage for configuration and secrets
- Optional Seamless Encryption using KMS
- Serverless, scalable, durable, easy SDK
- Version tracking of configurations / secrets
- Security through IAM
- Notifications with Amazon EventBridge
- Integration with CloudFormation

## SSM Parameter Store Hierarchy

<!-- pdf-page: 660 -->

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

## Parameter Store tiers

<!-- pdf-page: 661 -->

Advanced parameters add policies and larger values, with charges; choose the tier for required capabilities.

- Course quota snapshot per account/Region: Standard 10,000 parameters and 4 KB values; Advanced 100,000 and 8 KB.
- Only Advanced supports parameter policies in the comparison.
- Storage and high-throughput/API charges are separate considerations; verify current pricing rather than memorizing the screenshot's dollar amount.

| Capability | Standard (course snapshot) | Advanced (course snapshot) |
| --- | --- | --- |
| Parameter count | 10,000 | 100,000 |
| Value size | 4 KB | 8 KB |
| Parameter policies | No | Yes |
| Billing | Check throughput charges | Storage plus applicable throughput charges |

## Parameters Policies (for advanced parameters)

<!-- pdf-page: 662 -->

Advanced-parameter policies can expire a value or notify about expiry and lack of change; notifications do not automatically rotate secrets.

- Allow to assign a TTL to a parameter (expiration date) to force updating or deleting sensitive data such as passwords
- Can assign multiple policies at a time

## Well Architected Framework General Guiding Principles

<!-- pdf-page: 663 -->

https://aws.amazon.com/architecture/well-architected

- Stop guessing your capacity needs
- Test systems at production scale
- Automate to make architectural experimentation easier
- Allow for evolutionary architectures
  - Design based on changing requirements
- Drive architectures using data
- Improve through game days
  - Simulate applications for flash sale days

## Well-Architected: six pillars and explicit tradeoffs

<!-- pdf-page: 664 -->

Review operational excellence, security, reliability, performance efficiency, cost optimization and sustainability together.

- The pillars interact; architecture decisions can require tradeoffs between them.
- The PDF calls them a synergy without tradeoffs. Use the framework to document and evaluate actual tradeoffs instead.

**Current reference (checked 2026-10-13):** [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html).

## AWS Well-Architected Tool

<!-- pdf-page: 665 -->

Free tool to review your architectures against the 6 pillars Well- Architected Framework and adopt architectural best practices

- How does it work?
  - Select your workload and answer questions
  - Review your answers against the 6 pillars
  - Obtain advice: get videos and documentations, generate a report, see the results in a dashboard
- Let’s have a look: https://console.aws.amazon.com/wellarchitected

## Amazon Managed Grafana

<!-- pdf-page: 666 -->

Grafana is a popular open-source platform used to monitor, visualize, and alert on metrics and logs.

- Integrated with IAM Identity Center (formerly AWS SSO) and/or SAML for user management and permissions
- Compatible with Grafana plugins and alerts
- Fully managed, scales automatically
- Encrypted at rest and in transit, can use KMS.

## Amazon Managed Grafana

<!-- pdf-page: 667 -->

Integrated with many AWS data sources

  - CloudWatch, OpenSearch, Timestream, Athena, Redshift, X-Ray
  - Amazon Managed Service for Prometheus (AMP)
- Also with everything else Grafana integrates with
  - GitHub, Google, Azure, MySQL, Redis, JSON, OpenTelemetry, much more.

# Section Machine learning

## Amazon SageMaker AI

<!-- pdf-page: 669 -->

Training learns a model from labeled historical examples; inference applies the model to new feature values.

- Fully managed service for developers / data scientists to build ML models
- Typically, difficult to do all the processes in one place + provision servers
- Machine learning process (simplified): predicting your exam score

## SageMaker Feature Store

<!-- pdf-page: 670 -->

A “feature” is just a property used to train a machine learning model.

  - Like, you might predict someone’s political party based on “features” such as their address, income, age, etc.
- Machine learning models require fast, secure access to feature data for training.
- It’s also a challenge to keep it organized and share features across different models.

## Where the features come from is up to you.

<!-- pdf-page: 671 -->

A feature store organizes reusable features between data preparation and training/inference consumers.

## How SageMaker Feature Store Organizes Your Data

<!-- pdf-page: 672 -->

Feature groups define features and records identified by a record identifier and event time.

## Data Ingestion (streaming or batch)

<!-- pdf-page: 673 -->

Feature Store ingestion can populate an online store and an offline S3 store; their access patterns serve different workloads.

## SageMaker Feature Store Security

<!-- pdf-page: 674 -->

Encrypted at rest and in transit

- Works with KMS customer master keys
- Fine-grained access control with IAM
- May also be secured with AWS PrivateLink

## SageMaker ML Lineage Tracking

<!-- pdf-page: 675 -->

ML lineage connects input artifacts, processing actions, model artifacts and deployments for traceability.

- Creates & stores your ML workflow (MLOps)
- Keep a running history of your models
- Tracking for auditing and compliance
- Automatically or manually-created tracking entities
- Integrates with AWS Resource Access Manager for cross-account lineage
- Sample SageMaker-created lineage graph:

## Lineage Tracking Entities

<!-- pdf-page: 676 -->

Trial component (processing jobs, training jobs, transform jobs)

- Trial (a model composed of trial components)
- Experiment (a group of Trials for a given use case)
- Context (logical grouping of entities)
- Action (workflow step, model deployment
- Artifact (Object or data, such as an S3 bucket or an image in ECR)
- Association (connects entities together) – has optional AssociationType:
  - ContributedTo
  - AssociatedWith
  - DerivedFrom
  - Produced
  - SameAs

## Querying Lineage Entities

<!-- pdf-page: 677 -->

Use the LineageQuery API from Python

  - Part of the Amazon SageMaker SDK for Python
- Do things like find all models / endpoints / etc. that use a given artifact
- Produce a visualization
  - Requires external Visualizer helper class

## Ground Truth: availability and labeling concept

<!-- pdf-page: 678 -->

Ground Truth is closed to new customers; existing customers can continue using it.

- AWS announced the maintenance availability change for July 30, 2026. That differs from a complete service shutdown.
- Ground Truth Plus is a separate feature that reached end of support June 30, 2026.
- Keep the human-labeling and active-learning concepts in study notes; do not infer current exam scope from the PDF's assertion.

**Current reference (checked 2026-10-13):** [AWS service availability update](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-service-availability/); [Ground Truth documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/sms.html).

## What is Ground Truth?

<!-- pdf-page: 679 -->

Sometimes you don’t have training data at all, and it needs to be generated by humans first.

- Availability: see the Ground Truth status correction on page 678.
- Example: training an image classification model. Somebody needs to tag a bunch of images with what they are images of before training a neural network
- Ground Truth manages humans who will label your data for training purposes

## But it’s more than that

<!-- pdf-page: 680 -->

Ground Truth's active-learning pattern sends uncertain examples to human labeling and uses labeled results to improve the model; availability is a separate service-status question.

- Availability: see the Ground Truth status correction on page 678.
- Ground Truth creates its own model as images are labeled by people
- As this model learns, only images the model isn’t sure about are sent to human labelers
- This can reduce the cost of labeling jobs by 70%

## Who are these human labelers?

<!-- pdf-page: 681 -->

Mechanical Turk

- Availability: see the Ground Truth status correction on page 678.
- Your own internal team
- Professional labeling companies

## Ground Truth Plus

<!-- pdf-page: 682 -->

Turnkey solution

- Availability: see the Ground Truth status correction on page 678.
- “Our team of AWS Experts” manages the workflow and team of labelers
  - You fill out an intake form
  - They contact you and discuss pricing
- You track progress via the Ground Truth Plus Project Portal
- Get labeled data from S3 when done

## Other ways to generate training labels

<!-- pdf-page: 683 -->

Rekognition

- Availability: see the Ground Truth status correction on page 678.
  - AWS service for image recognition
  - Automatically classify images
- Comprehend
  - AWS service for text analysis and topic modeling
  - Automatically classify text by topics, sentiment
- Any pre-trained model or unsupervised technique that may be helpful

## Amazon Mechanical Turk

<!-- pdf-page: 684 -->

Crowdsourcing marketplace to perform simple human tasks

- Availability: see the Ground Truth status correction on page 678.
- Distributed virtual workforce
- Example:
  - You have a dataset of 10,000,000 images and you want to labels these images
  - You distribute the task on Mechanical Turk and humans will tag those images
  - You set the reward per image (for example $0.10 per image)
- Use cases: image classification, data collection, business processing
- Integrates with Amazon A2I, SageMaker Ground Truth…

## Amazon Mechanical Turk

<!-- pdf-page: 685 -->

A labeling job defines its dataset, labeling instructions and workforce, then collects annotations for review.

- Availability: see the Ground Truth status correction on page 678.

## SageMaker Canvas

<!-- pdf-page: 686 -->

No-code machine learning for business analysts

- Availability: see the Ground Truth status correction on page 678.
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

<!-- pdf-page: 687 -->

Visual interface (in SageMaker Studio) to prepare data for machine learning

- Availability: see the Ground Truth status correction on page 678.
- Import data
- Visualize data
- Transform data (300+ transformations to choose from)
  - Or integrate your own custom xforms with pandas, PySpark, PySpark SQL
- “Quick Model” to train your model with your data and measure its results

## Data Wrangler sources

<!-- pdf-page: 688 -->

Data Wrangler imports supported sources, explores and transforms data, then exports a reproducible preparation workflow.

## Data Wrangler: Import Data

<!-- pdf-page: 689 -->

The import screen chooses a source and dataset before previewing records.

## Data Wrangler: Preview Data

<!-- pdf-page: 690 -->

Preview helps validate types, missing values and sample records before adding transformations.

## Data Wrangler: Visualize Data

<!-- pdf-page: 691 -->

Visual analysis helps spot distributions and relationships; a sample plot is evidence to investigate rather than proof of causality.

## Data Wrangler: Transform Data

<!-- pdf-page: 692 -->

Transformations form a reproducible sequence rather than unrecorded edits to a spreadsheet.

## Data Wrangler: Quick Model

<!-- pdf-page: 693 -->

A quick model provides exploratory feature feedback, not a production-model quality guarantee.

## Data Wrangler: Export Data Flow

<!-- pdf-page: 694 -->

Export a validated flow to a supported job or pipeline destination for repeatable execution.

## Data Wrangler Troubleshooting

<!-- pdf-page: 695 -->

Make sure your Studio user has appropriate IAM roles

- Make sure permissions on your data sources allow Data Wrangler access
  - Add AmazonSageMakerFullAccess policy
- EC2 instance limit
  - If you get “The following instance type is not available…” errors
  - May need to request a quota increase
  - Service Quotas / Amazon SageMaker / Studio KernelGateway Apps running on ml.m5.4xlarge instance

## Foundation Models

<!-- pdf-page: 696 -->

The giant, pre-trained transformer models we are fine tuning for specific tasks, or applying to new applications

- GPT-n (OpenAI)
- Claude (Anthropic)
- DALL-E (OpenAI, Microsoft)
- LLaMa (Meta)
- DeepSeek
- Nova

## AWS Foundation Models (Base Models)

<!-- pdf-page: 697 -->

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

<!-- pdf-page: 698 -->

An API for generative AI Foundation Models

  - Invoke chat, text, or image models
  - Pre-built, your own fine-tuned models, or your own models
  - Third-party models bill you through AWS via their own pricing
  - Support for RAG (Retrieval-Augmented Generation… we’ll get there)
  - Support for LLM agents
- Serverless
- Can integrate with SageMaker Canvas

## The Bedrock API Endpoints

<!-- pdf-page: 699 -->

bedrock: Manage, deploy, train models

- bedrock-runtime: Perform inference (execute prompts, generate embeddings) against these models
  - Converse, ConverseStream, InvokeModel, InvokeModelWithResponseStream
- bedrock-agent: Manage, deploy, train LLM agents and knowledge bases
- bedrock-agent-runtime: Perform inference against agents and knowledge bases
  - InvokeAgent, Retrieve, RetrieveAndGenerate

## Bedrock authorization

<!-- pdf-page: 700 -->

Use an authorized IAM principal, including a workload role with temporary credentials; an IAM user is not mandatory.

- Grant the model and API permissions required by the application. Broad AWS-managed policies are examples, not the least-privilege end state.
- Avoid root credentials for routine model invocation and development.

**Current reference (checked 2026-10-13):** [Bedrock identity and access management](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html).

## Amazon Bedrock: Model Access

<!-- pdf-page: 701 -->

Model access depends on the model/provider, account permissions and current Bedrock access workflow.

- Amazon is phasing out the need to request access to specific models
- Be sure to check pricing
  - aws.amazon.com/bedrock/pricing

## Let’s Play

<!-- pdf-page: 702 -->

Bedrock playgrounds let you explore supported model input/output and inference settings before building an application.

- Bedrock provides “playground” environments
  - Chat
  - Text
  - Images
- Must have model access first (you probably do)
- Also useful for evaluating your own custom or imported models
- Let’s go hands-on and get a feel for it.

## Fine-tuning

<!-- pdf-page: 703 -->

Adapt an existing large language model to your specific use case!

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

<!-- pdf-page: 704 -->

Titan, Cohere, and Meta models may be “fine-tuned”

- Text models: provide labeled training pairs of prompts and completions
  - Can be questions and answers
  - Upload training data into S3
- Image models: provide pairs of image S3 paths to image descriptions (prompts)
  - Used for text-to-image or image-to- embedding models
- Use a VPC and PrivateLink for sensitive training data
- This can get expensive
- Your resulting “custom model” may then be used like any other.

## “Continued Pre-Training”

<!-- pdf-page: 705 -->

Like fine-tuning, but with unlabeled data

- Just feed it text to familiarize the model with
  - Your own business documents
  - Whatever
- Basically including extra data into the model itself
  - So you don’t need to include it in the prompts

## Low-Rank Adaptation (LoRA)

<!-- pdf-page: 706 -->

LoRA freezes base-model weights while training smaller low-rank adapter parameters that modify the output.

- We don’t update the entire model, just slap on some “low-rank matrices” to the attention weights (usually), and train those.
  - “Low-rank” refers to the complexity of the underlying matrices in the model, but you don’t need that level of understanding for this exam.
- At inference, these fine-tuned weights get added into the base model
- Base model remains unchanged
- Very efficient for storage, training, and inference
- This is different from an “adapter layer” added to the top of a model

## Retrieval Augmented Generation (RAG)

<!-- pdf-page: 707 -->

RAG retrieves external evidence and places it in the prompt before generation; it does not retrain the model for every question.

- Like an open-book exam for LLM’s
- You query some external database for the answers instead of relying on the LLM
- Then, work those answers into the prompt for the LLM to work with
  - Or, use tools and functions to incorporate the search into the LLM in a slightly more principled way

## RAG: Pros and Cons

<!-- pdf-page: 708 -->

Faster & cheaper way to incorporate new or proprietary information into “GenAI” vs. fine- tuning

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

<!-- pdf-page: 709 -->

The research illustration encodes a question, retrieves relevant documents and conditions generation on that evidence.

## Choosing a Database (Knowledge Base Data Store) for RAG

<!-- pdf-page: 710 -->

You could just use whatever database is appropriate for the type of data you are retrieving

- Graph database (i.e., Neo4j) for retrieving product recommendations or relationships between items
- OpenSearch or something for traditional text search (TF/IDF)
- But almost every example you find of RAG uses a Vector database
- Note Elasticsearch / OpenSearch can function as a vector DB

## Embeddings

<!-- pdf-page: 711 -->

Embeddings place semantically similar content near each other; the slide's clusters are conceptual, not measured coordinates.

- An embedding is just a big vector associated with your data
- Think of it as a point in multi- dimensional space (typically 100’s or thousands of dimensions)
- Embeddings are computed such that items that are similar to each other are close to each other in that space
- We can use embedding base models (like Titan) to compute them en masse

## Embeddings are vectors, so store them in…

<!-- pdf-page: 712 -->

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

## RAG Example with a Vector Database: Making Data from Star Trek, by Cheating.

<!-- pdf-page: 713 -->

A retrieval-assisted persona example selects relevant source passages, then combines them with the question and instructions for generation.

## RAG in Bedrock: Knowledge Bases

<!-- pdf-page: 714 -->

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

## Using Knowledge Bases

<!-- pdf-page: 715 -->

A Bedrock RAG application retrieves relevant OpenSearch content and supplies that context with the question to a model.

- “Chat with your document”
  - Basically, automatic RAG
- Integrate it into an application directly
- Incorporate it into an agent
  - “Agentic RAG”

## Let’s Make a Knowledge Base

<!-- pdf-page: 716 -->

AKA a vector store

- Hands-on; let’s use the text of a book I wrote.

## Breaking up the R in RAG

<!-- pdf-page: 717 -->

RAG quality depends on indexing, query preparation, retrieval, post-retrieval processing and grounded generation.

- Pre-Retrieval
  - Indexing
    - Granularity / chunking
    - Data extraction
  - Query Rewriting
- Retrieval
- Post-Retrieval

## Pre-Retrieval

<!-- pdf-page: 718 -->

Chunk size trades local precision against sufficient context; splitting a text too finely can lose its meaning.

- What should you be storing in your database?
- Data granularity matters
- Example: Every set of lines Data had, or individual sentences? Or blocks of text of a fixed length? Why just Data’s lines?
  - Or maybe summaries of those lines?
  - You can use an LLM for this too…
- The process of splitting up your data prior to storage is referred to as CHUNKING.

## More on Chunking

<!-- pdf-page: 719 -->

Semantic chunking groups related sentences at meaningful boundaries rather than arbitrary character positions.

- Make sure we don’t end up feeding more info into the LLM than it can handle
- Stay within the limit of how many tokens can be used within a context
  - This limit is becoming larger and larger though.
- Semantic Chunking
  - Ensure each chunk contains semantically independent information
  - Embedding-based (LlamaIndex / Langchain)
  - Model-based (BERT)
  - LLM-based (Basically tell it to do semantic chunking)

## Chunking with Bedrock: Standard Chunking

<!-- pdf-page: 720 -->

Fixed-size chunks may overlap to retain boundary context; no chunking treats a supported document as one retrieval unit.

- Fixed Size
  - You specify tokens per chunk and overlap percentage
- Default
  - 300 tokens per chunk, while honoring sentence boundaries (complete sentences preserved within each chunk)
- No chunking
  - Every document is a chunk
  - You could pre-process your own data to “chunk” it however you want per document

## Chunking with Bedrock: Hierarchical Chunking

<!-- pdf-page: 721 -->

Hierarchical retrieval indexes smaller child chunks but can return a larger parent to restore context.

- Nested parent/child chunks
- Initial search hits the child chunks
  - But then replaces them with parent chunks to get more context when appropriate
- The idea is to get better precision in retrieval from the smaller embeddings
  - But then reclaim comprehensiveness from the parents

## Chunking with Bedrock: Semantic Chunking

<!-- pdf-page: 722 -->

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

## Optimizing your Embeddings

<!-- pdf-page: 723 -->

Smaller vector sizes are a good way to reduce cost

  - I’m talking vector size here, not chunk size
  - Smaller vectors = fewer dimensions per chunk = less cost
  - However there is a tradeoff with your retrieval performance
- Amazon Titan has a default of 1024+ dimensions
  - This might be more than you need!
  - Balance dimensionality with domain fit
    - Are the semantic concepts you are searching for really that complex?

## Sparse vs. Dense Embeddings

<!-- pdf-page: 724 -->

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

## Optimizing Retrieval with Metadata

<!-- pdf-page: 725 -->

Metadata filters constrain eligible documents alongside vector similarity, improving scope and access-aware retrieval.

- Your vector DB can store more than just vectors and the raw text of the chunk
  - Bedrock Knowledge Bases can treat certain columns as content vs. metadata
  - Pass in a metadata.json file to specify what’s what
  - This makes sure you aren’t chunking up metadata (like creation date) but can still retrieve it
- If you add metadata tags for things like topics, what section of the document we’re in, etc… you can use this for better retrieval too.
  - Relevance scoring against metadata can be used for ranking
- Other examples of metadata
  - Document ID, category, access control, data lineage, additional context }

## Keeping Your KB Up to Date

<!-- pdf-page: 726 -->

An S3-triggered ingestion function can update an embedding index; handle updates and deletes so retrieval does not become stale.

- New or changed content can trigger a Lambda function
- This Lambda function can then generate new embeddings
- Batch-generate them for greater efficiency
  - Instead of syncing on every change, maybe you can do so on a schedule

## OpenSearch as a Vector Store

<!-- pdf-page: 727 -->

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

## OpenSearch Vector Engines

<!-- pdf-page: 728 -->

Top-level engines are Facebook AI Similarity (FAISS,) Non-Metric Space Library (NMSLib) and Apache Lucene.

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

<!-- pdf-page: 729 -->

Vector compression

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

<!-- pdf-page: 730 -->

Sharding strategies

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

<!-- pdf-page: 731 -->

A PostgreSQL pgvector table stores vectors and metadata; the query chooses the distance operator and supported index strategy.

- pgvector extension
  - Creates a new “vector” column type
  - Can compute cosine, L2, or inner product distances
  - The source mentions IVF similarity search but leaves the alternative after "or" unfinished.
  - Also adds vector operators for SQL
    - This gives it an advantage over OpenSearch if you need complex filtering logic and stuff.
- Allows you to store structured and vector data in the same place
- Can be appropriate for small / medium RAG systems with mostly structured data

## Amazon Quick

<!-- pdf-page: 732 -->

The course's Quick example connects authenticated employees with permitted enterprise content and application capabilities; names reflect the PDF's date.

- Successor to Amazon Q Business
- Agentic AI assistant for your employees: answer, research, analyze, act
  - Connects to your company’s documents, apps, databases and the Internet
- Built on Amazon Bedrock, your data is never used to train models

## Amazon Quick – Capabilities

<!-- pdf-page: 733 -->

Quick's indexed knowledge supports research, flows and other workspace capabilities; the capability names are a course snapshot.

- Quick Index – unified, searchable knowledge base of your company data (fully managed RAG)
  - Knowledge bases from S3, SharePoint, OneDrive, Google Drive, Confluence, web pages…
- Quick Research – deep research agent, combines internal data and the Internet, cited reports
- Quick Flows – simple automations built with natural language (e.g., weekly report email)
- Quick Automate – multi-step agentic workflows across systems, with human approvals
- Quick Sight – AI-powered BI dashboards, ask questions about your data (formerly QuickSight)
- Spaces – shared workspace of documents, dashboards and agents for a team

## Amazon Quick + IAM Identity Center

<!-- pdf-page: 734 -->

Identity integration and source permissions determine which enterprise data an authenticated user can retrieve.

- Users can be authenticated through IAM Identity Center
- Users receive responses generated only from the documents they have access to
- IAM Identity Center can be configured with external Identity Providers
  - IdP: Google Login, Microsoft Active Directory…

## Amazon Quick – Integrations

<!-- pdf-page: 735 -->

Enterprise connectors index supported content; action connectors separately invoke permitted business operations.

- Knowledge Bases (fully managed RAG) – index your company data into Quick Index
  - Amazon S3, Google Drive, OneDrive, SharePoint, Confluence, Web Crawler…
  - 30+ structured data sources for Quick Sight: Redshift, Athena, RDS, Snowflake…
- Actions – allows agents to perform tasks in 3rd party services
  - Jira, ServiceNow, Zendesk, Salesforce, Slack, Outlook… (100+ pre-built connectors)
  - MCP & OpenAPI – connects to your own

## Apps in Amazon Quick

<!-- pdf-page: 736 -->

The application-building screen illustrates describing, previewing, refining and publishing an application.

- Build and publish web applications without coding by describing them in natural language
- Example: project tracker, customer dashboard, training portal, data entry form…
- Apps can embed Quick Sight visuals, use Actions (Salesforce, Jira…), Spaces as knowledge base, and call an FM for summaries or classification

## Amazon Quick Example

<!-- pdf-page: 737 -->

A visual flow represents ordered business steps with explicit inputs, transformations and outputs.

## Amazon Kendra

<!-- pdf-page: 738 -->

Kendra indexes supported enterprise sources and serves search queries. Its 2026 maintenance-mode status must be considered separately from the retrieval concept.

- Availability note: Kendra moved to maintenance and is no longer open to new customers from July 30, 2026; existing customers can continue. Retain the retrieval concept, but evaluate current alternatives for new systems.
- NOTE! In maintenance mode as of July 30 2026
- Fully managed document search service powered by Machine Learning
- Extract answers from within a document (text, pdf, HTML, PowerPoint, MS Word, FAQs…)
- Natural language search capabilities
- Learn from user interactions/feedback to promote preferred results (Incremental Learning)
- Ability to manually fine-tune search results (importance of data, freshness, custom, …)

**Current reference (checked 2026-10-13):** [Kendra availability](https://docs.aws.amazon.com/kendra/latest/dg/kendra-availability-change.html).

# Section Developer tools

## Console, CLI and SDK access

<!-- pdf-page: 740 -->

The console is interactive; the CLI and SDK call AWS APIs using a credential provider chain.

- Prefer federation, IAM Identity Center or assumed workload roles with temporary credentials where appropriate.
- Long-lived access keys are one credential option, not a requirement for every CLI or SDK user.
- Keep secret keys and session tokens out of code, shared notes and logs. An access key ID is an identifier, not a password.

**Current reference (checked 2026-10-13):** [AWS SDK credentials and providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html).

## Access key identifiers and secrets

<!-- pdf-page: 741 -->

The PDF uses fake examples to distinguish an access key identifier from the secret used to sign requests.

- Access key ID: identifies the credential; it does not authenticate a request by itself.
- Secret access key: confidential signing material. Temporary credentials also require a session token.
- The literal fake strings add no study value and are intentionally replaced by these descriptions.

## What’s the AWS CLI?

<!-- pdf-page: 742 -->

The AWS CLI invokes AWS service APIs from a shell with a configured credential provider and Region.

- A tool that enables you to interact with AWS services using commands in your command-line shell
- Direct access to the public APIs of AWS services
- You can develop scripts to manage your resources
- It’s open-source https://github.com/aws/aws-cli
- Alternative to using AWS Management Console

## What’s the AWS SDK?

<!-- pdf-page: 743 -->

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

<!-- pdf-page: 744 -->

CDK expresses infrastructure as code and synthesizes a CloudFormation template; CloudFormation performs the deployment.

- Define your cloud infrastructure using a familiar language:
  - JavaScript/TypeScript, Python, Java, and .NET
- Contains high level components called constructs
- The code is “compiled” into a CloudFormation template (JSON/YAML)
- You can therefore deploy infrastructure and application runtime code together
  - Great for Lambda functions
  - Great for Docker containers in ECS / EKS

## CDK in a diagram

<!-- pdf-page: 745 -->

CDK language code becomes a cloud assembly/template before CloudFormation creates or updates the stack.

## CDK vs SAM

<!-- pdf-page: 746 -->

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

<!-- pdf-page: 747 -->

After CDK synthesis, SAM CLI can locally invoke supported Lambda resources from the generated template for development testing.

- You can use SAM CLI to locally test your CDK apps
- You must first run cdk synth

## CDK Hands-On

<!-- pdf-page: 748 -->

An object event invokes an image-analysis function, which calls Rekognition and stores extracted results in DynamoDB.

## AWS CodeDeploy

<!-- pdf-page: 749 -->

CodeDeploy coordinates installation of an application revision on supported compute targets using a deployment configuration.

- We want to deploy our application automatically
- Works with EC2 Instances
- Works with On-Premises Servers
- Hybrid service
- Servers / Instances must be provisioned and configured ahead of time with the CodeDeploy Agent

## AWS CodeCommit

<!-- pdf-page: 750 -->

Before pushing the application code to servers, it needs to be stored somewhere

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

<!-- pdf-page: 751 -->

CodeBuild checks out source, runs configured build commands and publishes build artifacts and logs.

- Code building service in the cloud (name is obvious)
- Compiles source code, run tests, and produces packages that are ready to be deployed (by CodeDeploy for example)
- Benefits:
  - Fully managed, serverless
  - Continuously scalable & highly available
  - Secure
  - Pay-as-you-go pricing – only pay for the build time

## AWS CodePipeline

<!-- pdf-page: 752 -->

CodePipeline orchestrates source, build and deploy stages using configured providers; the pictured repository is one possible source.

- Orchestrate the different steps to have the code automatically pushed to production
  - Code => Build => Test => Provision => Deploy
  - Basis for CICD (Continuous Integration & Continuous Delivery)
- Benefits:
  - Fully managed, compatible with CodeCommit, CodeBuild, CodeDeploy, Elastic Beanstalk, CloudFormation, GitHub, 3rd-party services (GitHub…) & custom plugins…
  - Fast delivery & rapid updates

# Section Cost management and API Gateway

## AWS Budgets

<!-- pdf-page: 754 -->

Create budget and send alarms when costs exceeds the budget

- 4 types of budgets: Usage, Cost, Reservation, Savings Plans
- For Reserved Instances (RI)
  - Track utilization
  - Supports EC2, ElastiCache, RDS, Redshift
- Up to 5 SNS notifications per budget
- Can filter by: Service, Linked Account, Tag, Purchase Option, Instance Type, Region, Availability Zone, API Operation, etc…
- Same options as AWS Cost Explorer!
- 2 budgets are free, then $0.02/day/budget

## Cost Explorer

<!-- pdf-page: 755 -->

Visualize, understand, and manage your AWS costs and usage over time

- Create custom reports that analyze cost and usage data.
- Analyze your data at a high level: total costs and usage across all accounts
- Or Monthly, hourly, resource level granularity
- Choose an optimal Savings Plan (to lower prices on your bill)
- Forecast usage up to 18 months based on previous usage

## Cost Explorer – Monthly Cost by AWS Service

<!-- pdf-page: 756 -->

A cost breakdown groups spend by service and time period so the reader can identify contributors; no screenshot dollar amounts are reproduced.

## Cost Explorer– Hourly & Resource Level

<!-- pdf-page: 757 -->

Finer cost granularity exposes short-lived spending patterns at the expense of more detailed data.

## Cost Explorer – Savings Plan Alternative to Reserved Instances

<!-- pdf-page: 758 -->

Savings Plans recommendations use historical eligible usage and commitment assumptions; a recommendation is not a guaranteed saving.

## Cost Explorer – Forecast Usage

<!-- pdf-page: 759 -->

A cost forecast projects future spend with uncertainty; compare it with budgets and actual usage as conditions change.

## Example: Building a Serverless API

<!-- pdf-page: 760 -->

A REST API accepts a client request, invokes Lambda business logic and accesses DynamoDB with the function's permissions.

## AWS API Gateway

<!-- pdf-page: 761 -->

AWS Lambda + API Gateway: No infrastructure to manage

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

<!-- pdf-page: 762 -->

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

<!-- pdf-page: 763 -->

An API Gateway service integration can put records into Kinesis without an intervening Lambda function; Firehose delivers onward to S3.

## API Gateway - Endpoint Types

<!-- pdf-page: 764 -->

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

## API Gateway – Security

<!-- pdf-page: 765 -->

API authentication and custom-domain TLS are separate controls; edge-optimized custom-domain certificates use us-east-1 and Regional certificates use the API Region.

- User Authentication through
  - IAM Roles (useful for internal applications)
  - Cognito (identity for external users – example mobile users)
  - Custom Authorizer (your own logic)
- Custom Domain Name HTTPS security through integration with AWS Certificate Manager (ACM)
  - If using Edge-Optimized endpoint, then the certificate must be in us- east-1
  - If using Regional endpoint, the certificate must be in the API Gateway region
  - Must setup CNAME or A-alias record in Route 53

# Section Personal working notes

<!-- collection: personal -->

Preserved pre-existing personal notes and headings. These remain working study material; unfinished areas are prompts, and source-linked corrections above take precedence where the course or older notes differ. Search this collection separately in the presentation.

# Section Fundamentals

# Types of Data

First step for data engineering is categorise data according to Unestructure vs. structured data

Structured: Data that is organised in a defined manner or schema, typically found on relation databases

Characteristics: Easily Queriable, Organised in rows and columns, has consistent structure

MySQL, CSV files, Excel Spreadsheets that makes logical sense

Unstructured : Doesn't have a predefined structure or schema. No easily queriable may have differents formats

Text files without fixed format, videos, audios,
images, emails, word processing documents


Semi-Structured Data: It's not organised as structure manner but has some level of strucuture in the forms of tags, hierarchies. More flexible than structure but no chaotic as unstructured data

XML, JSON, Log Files, e-mail Headers


# Properties of Data

3v's - Velocity, Volume, Variety

Volume: Amount or size of data that organizations are dealing with at any given time.
(How this is translated in real world companies how data engineers should seek answers about the volume of data dealt.)

May range from gigabytes to petabytes, challanges in storing, processing, and analysing data.

Velocity: Speed on which data is generated and collected, and processed.

It relates to real-time, near-real-time processing depending on the velocity requirements.

Rapid Ingestion and processing can be critical for certain applications.

e.g: Sensors data from IoT generate data each miliseconds

Variety: Refers to the different types, structures, and sources.

Can be structured, semi-structured, or unstructured data can come from multiple sources and in various formats.

E.g Business analysing data from clinical system that could be a database, or unstructured json from an API

# Data Warehouse

Data warehouse is a centralized repository optimized for analysis where data from different sources is stored in a structured format

Optimized for read-heavy operations
Typically uses star or snowflake schema
Data is cleaned, transformed, loaded ETL into these repositories

E.g Amazon redshift, google bigquery

# Data Lake

A storage repository that holds vast amounts of raw data in its native format, including structured, semi-structured, and unstructured data.

Can store large volumes of raw data without predefined schema
Data is loaded as-is no need for preprocessing
supports batch, real-time, and stream processing
can be queried fro data transformation or exploration purposes

s3, Azure datalake, HDFS

## Comparisons

Data Warehouse: Schema-on-write (ETL) (predefined schema before writing data)

Data Lake Schema-on-read (schema is defined at the time of reading data) typically uses ELT

Data Types:

Agility: data warehouse is less agile due to requirement of data predefined structure

Cost: Data warehouses typically more expensive because of optimizations for complex query, cost-effective storage solution, but can rise over time and when processing large amounts of data

## When to use datawarehouse:
- Normally companies uses both, ingest raw data into datalakes and data warehouses in sequence 

# Data Lakehouses

A hybrid data

# Data Mesh

It's more related to organisation and governance. Individual teams own data products within a given domain. These products serve various use cases around the organisation. It's a self-service tooling and infrastructure, federated governance acts as centralised organisation

# ETL Pipelines

It's used to move data across systems into a data warehouse. 

## Extract
- Retrieve raw data from source systems: databases, crms, flatfiles, apis, etc
- Ensure data integrity during extraction phase
- can be done in real-time or in batches, depending on the requirements

# Transform
Convert extracted data into a format suitable for the target data warehouse
- Data Cleasing
- Data Enrichment
- Format changes, date formatting, string manipulation
- Aggregations or computations (calculating totals and averages)
- Handling missing values
- encoding and decoding data

# Load

Move the transformed data into the target data warehouse or another data repository

- Can be done in batchs or in a streaming manner
- Ensure to maintain integrity of data once the load is happening

# Managing ETL pipelines

This process must be automated in some reliable way
- AWS Glue and associated orchestration services like stepfunctions, eventbridge

# Data sources

## JDBC 
- Java database connectivity
- platform-independent
- language-dependent

If you are not on java, an alternative can be use
## ODBC
- Open Database Connectivity
- Platform-dependent (drivers needed)
- Language-independent

## OTher data sources
- Raw Logs
-  API's 
-  Streams of Data


# Data Formats

## CSV : Text based format that represents data in tabular form where each line corresponds to a row and values are separeted by comma or similar separator
- for small to medium datasets (around few gigabytes)
- for data interchange between systems with different technologies
- for human readable and editable
- importing and exporting data from databases

## Json

lightweight, text-based, semi-structured and human-readable. based on key-value pairs.
- Data interchange between webserve and web client
- Configurations and settings for softwares apps
- NoSQL databases like mongoDB, Programming Languages

## AVRO
binary format that store both the data and its schema allowing to be procesed later with different systems
When to use:
- Big dfata and real-time processing systems
- When schema evolution is needed
- Efficient serialization for data transport between systems
- Push high throughtput data between systems
e.g: Apache Kafka, Spark, Flink, Hadoop

## Parquet
Stored data in columnar format instead of rows, optimized for analytics allows efficient compression and encoding schemes.
- Analysing large datasets with analytics engines 
- Use cases where reading specific columns instead of entire records is beneficial
- Storing data on distributed systerms where IO operations need optimization
- Hadoop, Spark, Hive, Impala, Redshift Spectrum.
Use when big columnar archive needs processing and analysing

# Data Modelling

## Star Schema
## Snowflake

# Data Lineage
- A visual representation that traces the flow and transformation of data through its lifecycle from its source to its final destination.
- Help tracks errors
- Ensures compliance with regulations
- Provides a clear understanding on how data is moved, transformed, loaded

Obs: Example of capturing data lineage: Uses Spline agent (for spark) attached to glue, to dump lineage data into a Amazon Neptune via lambda. And by using Lineage API you can query this Lineage data generated by the agent.

(I need to see more examples or lineage in aws)

# schema evolution
 The ability to adapt and change the schema of a dataset over time without disrupting existing processes or systems.
 - Ensure data systems can adapt to changing business requirements
 - Allows for the addtion removal or modification of columns fields in a dataset

(How to implement this into pipelines) very desirable skill for production pipelines

# Database Performance Optimization
- Indexing: Avoid full table scans, eforce data uniqueness and integrity
- Partitioning: Reduce amount of data scanned, Helps with a data lifecycle management, Enables parallel processing
- Compression: Speed up data transfer, reduce Storage & Disk reads (Gzip, Lzop, BZIP2, ZSTD (Redshift Examples))
- Columnar Compression

# Data Sampling Techniques

- Random Sampling - Everything has an equal chance
- Stratified Sampling - Divide the population into subgroups (strata) random sample within each stratum, ensures representation
- Systemic Sampling - Have a specific rule for sampling the population for e.g odds samples, or 1 for each 10 samples
- Others: Systemic Sampling, Cluster, Convenience, Judgmental

# Data Skew mechanisms
- Data skew refers to unequal distribution or imbalance of data across various nodes or partitions in distributed computer systems
The celebrity Problem: Popular partitions receives more traffic and could overload the partition access, write
Causes: Non uniform distribution of data, Inadequate partitioning strategy. Or could be caused by temporal skew more recent partitions in a growing dataset can be more used than older ones.

* Important to monitor data distribution and alert when skew issues arise *
## Solutions 
- Adaptive Partitioning: Dynamically adjust partitioning based on data characteristics to ensure a more balanced distribution
- Salting: introduce a random factor or "salt" to the data to distribute it more uniformly ( Dont know a real example)
- Repartitioning: Regularly redistribute the data based on its current distribution characteristics
- Sampling: Use a sample of the data to determine the distribution and adjust the processing strategy accordingly.
- Custom Partitioning: Define custom rules or functions for partitioning data based on domain knowledge ( Need real scenario)

# Data Validation and Profiling

1. Completeness : Ensures all requried data is present and no essential parts are missing
    - Missing values, null counts, percentage of populated fields
    - Can lead to inaccurate analyses
2. Consistency : ensures data values are consistent across datasets and do not contradict each other.
    - Cross-field validation, comparing data from different sources or periods
    - Inconsistent data can cause confusion and incorrect conclusions
3. Accuracy: Ensures data is correct, reliable, and represents what it is supposed to.
    - Comparing with trusted soruces, validation against known standards or rules.
    - Inaccurate data can lead to false insights and poor decsion making
4. Integrity: Ensures data maintains its correctness and consistency over its lifecycle and across systems
    - referential integrity (e.g. Foreign Key checks in databases), relationship validations
    - Ensures relationships between data elements are preserved, and data remains trustworthy over time.

# SQL Pivoting
- Pivoting is the act of turning row-level data into columnar data. for example, sales table contains sales amounts and the sales person in each row but we want a report by salesperson.

```sql
    SELECT 
        salesperson,
        SUM(CASE WHEN month = 'Jan' THEN sales ELSE 0 END) as JAN_Sales,
        SUM(CASE WHEN month = 'Feb' THEN sales ELSE 0 END) as FEB_Sales
    FROM sales
    GROUP BY salesperson;
```

# Add a topic about Data Cardinality

# Section Storage

It's advertised as infinitely scaling storage, many websites uses as backbone
- Backup and storage
- Disaster Recory
- Archive
- Hybrid Cloud Storage
- App Hosting
- Media Hosting
- Datalakes, Big data analytics
- Software delivery (Software updates)
- Static websites

Nasdaq uses for backuping 7 years of data in S3 glacier
Many companies uses to produce analytics reports

## Buckets
- In March of 2026, AWS relaxed the requirement of S3 bucket names being globally unique. Account regional namespaces now allow you to create buckets within your own reserved namespace.

### Security

- User-based: IAM Policies
- Resource-based: Bucket Policies, Object ACL, Bucket ACL (less common)
- objects can be Encripted by security keys

Note: an IAM principal can access an s3 Object 
IF the user IAM permissions ALLOW It (e.g aws user)
OR the resource policy ALLOWS It (e.g external user)
AND theres no explicit DENY

- Bucket settings for Block Public Access is an extra layer to prevent data leaks

### Replication 
- CRR - cross region replication, used for compliance and low latency
- SRR - Same region replication, used for live replication between environments
- After you enable replication, only new objects are replicated
- You can replicate existing objectsd using s3 Batch Replication
- Amazon s3 Replication Time Control: extra cost per gigabyte, 99.99% of replicated obj are gonna be there within 15min

### s3 Classes

General Access
Infrequent Access
Standard
Standard IA
One Zone IA
Intelligent Tiering
Glacier Storage Classes - Low-cost for archiving/backup
GLacier Instant Retrieval
Glacier Flexible Retrieval

s3 Express One Zone - High performance, single availability zone, very high performance, 10x better than s3 standard, 50% less costs e.g data-intensive apps, training ml, financial data, etc

- LIfecycle rules, transiction actions, expiration actions


### s3 Event Notifications

s3:objectcreated, s3:objectrestored, etc
- as target, sns, sqs, lambda and eventbridge can be used with resource policies  

### s3 Performance

- baseline performance: scales to high request rates, latency 100-200ms
- 3500 PUT/COPY/POST/DELETE and 5500 GET/HEAD requests per second per prefix
- Multi-part Upload - Parellize the upload
- s3 transfer acceleration - Increase transfer speed by transferring file to an aws edge location in order to forward to s3 bucket target region. e.g file in us --> us edge location --AWS private network --> s3 Australia
- S3 byte-range fetchs - GET Requests are made in parallel parts of a file or certain amount of bytes e.g the header only

### Encryption

- SSE-S3 handled, managed, owned by aws, AES-256, server-side, default
- SSE-KMS handled, managed by AWS KMS, user control + audit key usage with cloud trail, server-side. Downside is needs access to AWS-KMS service everytime requesting or uploading a file inccour in extra costs and limits
- DSSE-KMS dual layer, 1st layer KMS key, 2nd layer S3 Managed Key, higher cost than KMS
- SSE-C handled by customer outside aws, HTTPS must be used, aws do not store the key, 
- Client side Encryption - Use client libraries such Amazon s3 Client-sideEncryption Library, Customer fully manages the keys and encryption cycle
- Encryption in transit (SSL/TLS) - HTTPS endpoint encryption in flight
- Force Encryption in transit aws:SecureTransport in bucket policy


### Access Points
- Enables access across users and teams
- Each access point have it own security level
- Simple way to manage security by access point policies
- can have own dns
- we can define access point to be accesible only in the vpc

### S3 Tables

- Purpose-built for tabular data, better than just storing data in s3
- 3x times faster, 10x more transaction rates
- Table Buckets concepts
- offers replication across region and accounts
- centralize analytics by replicating into a single region
- test/dev environments
- intelligent tiering can apply to automate costs
- Security: IAM Identity based policies, resource-based policies and SCP- service control policies
- Other access management tools : SQL Commands and Lake formation
- VPC endpoints via Private Link
- Public access and http are not allowed

### Storage Lens

- Understand analyze and optimze storage across entire aws organisation
- discover anomalies, identify cost efficiencies,
- Data protection Metrics
- Acess Management Metrics
- Event metrics
- Performance Metrics
- Acitivty Metrics
- Status code Metrics

Free Metrics - Available for all customers, 28 usage metrics, available for 14 days queries
- Addtional paid metrics, available for 15 months, new features like:

## EBS Elastic Block Store
- Network drive attached to your instances while they run.
- Allows instances persist data even after termination
- mounted at one instance at time
- can be swapable between EC2 instances one at time per instance
- It's locked to an AZ
- Has a provisioned capacity (GBS and IOPS)
- DELETE on termination attribute - The rrot ebs volume is deleted when instance is terminated
- By default is not deleted when instance terminated is an add-on
 

## EFS Elastic file system
- Managed Network file system that can be mounted on many EC2
- EFS works with instances in multi-AZ
- 3x times more costly than gp2 EBS
- Pay per usage
- Uses security group to control acess to EFS
- Compatible with linux based AMI (not windows)
- Encryption at rest using kms
- use cases: content management, webserving, data sharing
- Performance: Performance Mode, Throughput Mode: bursting, provisioned, elastic
- Storage Classes ( lifecycle management feature after N days, Standar, EFS-IA infrequent, archive)
- Availability and durability - Standard: Multi-AZ great for Prod, One Zone: great for Dev, hml

## AWS Backup

- Fully managed service
- Centrally manage and automate backups across AWS services
- No need to create custom scripts and manual processess
- Supported by: EC2, EBS, S3, RDS, DocumentDb, Neptune, EFS, FSx (windows file server), AWS storage gateway
- Supports cross-region backups
- Supports cross-account backups
- PITR - point in time recovery
- On demand and scheduled backups
- backup policies known as Backup Plans
- Backup Vault Lock: Enform WORM (write Once Read Many), additional layer of defence agains updates and deletes, even the root cannot delete (for compliance purposes)
- 

# Section Databases

## DynamoDB (NoSQL DBs)

- do not support query joins or limited support, dont performs aggregations
- databases scale horizontally can perform more reading and writing
- fully managed in aws, highly available with replication
- non relation
- can deal with million of requests, fast and consistency (low latency)

### Basics
- is made of tables
- each table has a primary key (must be decided on creation)
- each table can have an infinite number of items (=rows)
- each item has attributed (can be added over time no problems - can be null)
- Maximum size of an item is 400KB
- Data types supported are: scalar types (string, number, binery, null, boolean), Document Types (list, map), Set Types (string set, number set, binary set)
- has classes like standard and Infrequent access on table level
- Read/Write capacity can be on-demand or provisioned with read and or write auto scaling or manual provisioned.
- Permit encriptation on rest

### Primary Keys
- Option 1: Partition Key (HASH): unique for each item, must be diverse, e.g user_id
- Option 2: partition Key + sort Key (Hash + Range) data is grouped by partition key e.g (users-games user_id for partition key and game_id for sort key)

### DynamoDB use cases

Whenever use when data is hot and small needs high throughput on read and write , low latency and small size since is limited to 400KB
- GAming
- Mobile Apps
- Live voting
- sensor networks
- log ingestion
- E-Commerce shopping carts
- Web session management

### DynamoDB Anti Pattern

- Prewritten application tied to traditional RDB
- Joins or complex transactions
- Binary Large Object (BLOB) data, then is better to store data in s3 and metadata in DynamoDB
- Large data with low i/O rate : use s3 instead

### Read Capacity Unit and Write Capacity Unit (RCU and WCU)

- RCU Throughput for reads - represents one strongly consistent read per second or two eventually consistent reads per secod for an item up to 4KB
- WCU throughput for writes - represents one write per second for an item up to 1KB
- Option auto scaling of throughput to meet demand
- THroughput can be exceeded temporarly using "burst capacity"
- If burst capacity has been consumed you'll get a ProvisionedThroughputExceedException
- It's then advised to retry via exponential backoff

### Strongly Consistent Read vs Eventually Conssistent read
- Eventually consistent read - if we read just after a write it's possible to read stale date due replication in progress across dynamoDb servers
- Strongly consistent read - If we read after a write it will always get the last correct data (Set ConsistentRead to true, inccour more RCU usage)

### Partitions Internal
- Data is stored in partition that goes to a hash function and it's unique
- WCU and RCU are divided and splitted equally against partititons

### Throttling 
- If we exceed provisioned RCUs or WCUs we get ProvisionedThroughputExceedException
Reasons:
- Hot Keys - a hot key (which leads to a hot partition) occurs when a disproportionate amount of read or write traffic targets a single partition key value
- Very Large Items - RCU and WCU depends on the size of items
- Each individual physical partition in DynamoDB has strict, hard throughput limits: 3,000 Read Capacity Units (RCUs) per second, 1,000 Write Capacity Units (WCUs) per second
Solutions:
- Exponential backoff
- Distribute partition keys as much as possible
- if its a read issue RCU, we can use DynamoDB accelarator DAX

### R/W Capacity Modes - On-Demanda
- Read/writes scale up/down with workloads
- no capacity planning
- unlimited WCU/RCU, no throttling
- 2.5x more expensive than provisioned
- E.g Unpredicted workload

### Basic APIs

### DynamoDB – PartiQL
- SQL compatible query language for DynamoDB
- Allows you to select, insert, update, and delete data in DynamoDB using SQL
- Run queries across multiple DynamoDB tables
- Run PartiQL queries from: AWS Management Console, NoSQL Workbench for DynamoDB, DynamoDB APIs, AWS CLI, AWS SDK

### DynamoDB - Local Secondary Index
Alternative Sort Key for your table (same Partition Key as that of base table)
- The Sort Key consists of one scalar attribute (String, Number, or Binary)
- Up to 5 Local Secondary Indexes per table
- Must be defined at table creation time

### DynamoDB - GLobal Secondary Indez

 Alternative Primary Key (HASH or HASH+RANGE) from the base table
- Speed up queries on non-key attributes
- The Index Key consists of scalar attributes (String, Number, or Binary)
- Attribute Projections – some or all the attributes of the base table (KEYS_ONLY,
INCLUDE, ALL)
- Must provision RCUs & WCUs for the index
- Can be added/modified after table creation

### DynamoDB Accelerator (DAX)
- Fully-managed, highly available, seamless inmemory cache for DynamoDB
- Microseconds latency for cached reads & queries
- Doesn’t require application logic modification (compatible with existing DynamoDB APIs)
- Solves the “Hot Key” problem (too many reads)
- 5 minutes TTL for cache (default)
- Up to 10 nodes in the cluster
- Multi-AZ (3 nodes minimum recommended for production)
- You need to create a DAX cluster, selecting family, size, instance type

### Dax vs Elasticache
- DAX useful for individual objects cache, for query and scan cache to much fast results
- Elasticache - Useful for store aggregation results that will be computed once and accessed many

### DynamoDB Streams
- Ordered stream of item-level modifications (create/update/delete) in
a table
- Stream records can be: sent to Kinesis Data Streams, Read by AWS Lambda, Read by Kinesis Client Library Applications (KCL)
- Data retention for up to 24hours
- use cases: react to changes in real-time (welcome e-mail to users), analytics, insert into derivative tables, insert into opensearch, implement cross-region replication

Ability to choose the information that will be written to the
stream:
- KEYS_ONLY – only the key attributes of the modified item
- NEW_IMAGE – the entire item, as it appears after it was modified
- OLD_IMAGE – the entire item, as it appeared before it was modified
- NEW_AND_OLD_IMAGES – both the new and the old images of the item
- Records are not retroactively populated in a stream after enablingit

### DynamoDB Streams & AWS Lambda

- You need to define an Event Source Mapping to read from a DynamoDB Streams
- You need to ensure the Lambda function has the appropriate permissions
- Your Lambda function is invoked synchronously

### DynamoDB – Time To Live (TTL)
- Automatically delete items after an expiry timestamp
- Doesn’t consume any WCUs (i.e., no extra cost)
- The TTL attribute must be a “Number” data type with “Unix Epoch timestamp” value
- Expired items deleted within few days of expiration
- Expired items, that haven’t been deleted, appears in reads/queries/scans (if you don’t want them, filter them out)
- Expired items are deleted from both LSIs and GSIs
- A delete operation for each expired item enters the DynamoDB Streams (can help recover expired items)
- Use cases: reduce stored data by keeping only currentitemsadheretoregulatoryobligations

### Use cases Large Objects Pattern / Indexing s3 Objects Metadata
- Storing image in s3 and metadata in dynamoDb

### DynamoDB security and other features
- VPC Endpoints available to access DynamoDB without using the internet
- IAM full control access
- Encryption at rest using AWS KMS and in-transist using ssl/tls
- PITR like RDS with no performance impact
- Global Tables : Multi region, fully replicated, multi-active
- DynamoDB Loca - for test and locally development
- Users can interact with dynamoDB directly via identity providers like cognito, google, facebook, etc
- Using Web Identity Federation or Cognito Identity Pools, each user gets AWS credentials
- You can assign IAM Role to these users with a condition to limit their API access to dynamoDB
- Access can be limited at row level by specifing LeadingKeys, so user can only view and modify own data
- Access can be limited at attribute level as well.

## Amazon RDS - Hosted relational Database
- Amazon Aurora, MySQL, PostgreSQL, MariaDB, Oracle, SQL Server
- Not for big data, might appear on exam as an example of what not to use
- Or in the context of migrating from RDS to Redshift
- All RDS databases are ACID compliant (Atomicity, Consistency, Isolation, Durability)
- Atomicity - Transaction is wholeness completed or if some part fail all transaction fail
- Consistency - Data writen must adhere to all constrains and data rules
- Isolation - Each transaction is independent itself 
- Durability - Information are retained properly after transaction 

### Lock command 
- rlational databases implicitly lock tables to prevent two things writing to it at the same time, or reading while a write is in process to be conformant with atomicity and isolation
- tables or rows can also be explicitly locked to ensure data integrity
- LOCK TABLES employees WRITE; -- Locks for write operations
- UNLOCK TABLES; to release the lock
- Redshit also has LOCK for same purpose
- Shared Lock: SELECT * FROM employees WHERE department = 'Finance' FOR SHARE; (FOR UPDATE -- prevent all reads and writes)
- Using locks might lead to DEADLOCKS when you do not have a way to UNLOCK the resources (dependent locks)


### RDS Operational guidelines
- Cloudwatch to monitor memory, cpu, storage, replica
- Set TTL on DNS for your db instances to 30 sec or less from your apps to prevent chaching DNS and never hitting the databases
- Provision enough RAM to include your entire working set
- Query Optimization in RDS (explain whenever is necessary)
- Avoid full table scans
- Use ANALYZE TABLE periodically to check table healths
- DB-specific tweaks: MariaDB, MySQL: keep tables well under 16TB, ideally under 100GB, try to have less than 10K tables, Use InnoDB fpr Storage
- PostgreSQL: When loading data disable DB backups and multi-AZ. check and tweak those param: maintenance_work_mem, max_wal_size, checkpoint_timeout. disable synchronous_commit, autovaccum (when loading data, otherwise on), and ensure tables are logged. 
- SQL Server: deploy into all AZs , use RDS DB Events to monitor DB

### Amazon Aurora
- MySQL and PostgreSQL - Compatible
- Up to 5x faster than MySQL, 3x faster than PostgreSQL
- 1/10 the cost of commercial databases
- Up to 256TB per database volume automatically grows in 10GB increments
- Up to 15 read replicas (faster than MySQL sub 10ms replica lag)
- Constinuous Backup to S3
- Replication Across regions and AZ
- Automatic scaling with aurora Serverless
- vpc network isolation, at-rest with kms (data, backup, snapshots, replicas)
- Costs 20% more on RDS (Cost efficient)
- Backtrack: restore data at any point of time without using backups
- Automated maintence

#### High Availability and Read Scaling
- Aurora by default: 6 copies of your data across 3AZ
- It need 4 copies out of 6 for writes, 3 copies out of 6 need for reads
- self healing with peer-to-peer replication
- Storage is striped across 1000s of volumes
- Shared Storage Volume (replication+self healing+auto expading)
- One Aurora instance takes writes (master)
- In case of failover for master another one assumes the position in less than 30 secs

#### Aurora DB Cluster
- 1. Writer Endpoint - Pointing to the master instance
- 2. Reader Endpoint - connection load balancing between read instances

## DocumentDB (MongoDB) NoSQL
- MongoDB is used to store, query, and index JSON data
- Similar ''deployment concepts as Aurorara
- Fully Managed Highly Available 3AZ
- Auto Scales to workloads with millions of requests per seconds

## MemoryDB for Redis
- Redis-comaptible, durable, in-memory database service
- Durable in-memory data storage
- mobile apps, online gamming, media streaming
-

## Amazon Keyspaces (For Apache Cassandra) NoSQL
- Apache Cassandra is an open-source NoSQL distributed database
- With keyspaces you get a managed Apacha Cassadra-compatible database service
- Using Cassandra Query Language
- use cases: IoT decvices info, time-series data

## Amazon Neptune

##

##

## Amazon Redshift

### Redshift Spectrum
- Columnar format

### Redshift Durability
- 

### Resource Scaling in Redshift Serverless
- Capacity Measured in Redshift processing Units (RPU's)
- You pay for RPU-hours (per second) plus storage

### Redshift Serverless

Does everything that Redshift can, except:
- Parameter Groups
- Workload Management
- AWS partner integration
- Maintenance windows / version tracks
- Must access within VPC (no public endpoints)

###  Serverless Monitoring
- Monitoring views: SYS_QUERY_HISTORY, SYS_LOAD_HISTORY, SYS_SERVERLESS_USAGE
- Cloudwatch Logs and Metrics

### Redshift Materialized Views

- Pre computed results based on SQL queries over one or more base tables. 
- Provide a way to speed up complex queries
- Query return results faster since they use precomputed results without accessing base tables
- CREATE A MATERIALIZED VIEW vw_name AS SELECT...
- You can either refresh by: REFRESH MATERIALIZED VIEW or AUTO REFRESH on creation
- Materialized views can be built from other materialized views

### Data Sharing
- Securely Share live data across redshift clusters for read purposes
- Why? Workload Isolation, cross-group collaboration, licessing data access in aws data exchange (marketplace), sharing between environments
- Can share DB's, schemas, tables, views and or UDF's
- Follows producer/consumer architecture (Producer controls security, isolation to producer and consumer performance)

### Redshift Lambda UDF

Use custom functions in AWS lambda inside SQL queries
- Use any language
- Do anything you want
- Register with CREATE EXTERNAL FUNCTION
- Must GRANT USAGE ON LANGUAGE EXFUNC for permissions
 
### Redshift Federated Queries
- Query and analyze across databases, warehouses, and lakes
- for example ties RDS and Amazon Aurora into redshift
- Incorporate live data into redshift queries and avoids the need for ETL pipelines
- Make sure connections are available between Redshift and Aurora, and RDS. Also include secrets in aws secrets manager
- Read only access to external data sources
- Costs will be incurred on external DB's
- You can query RDS/Aurora in Redshift but not the other way around

### Redshift System Tables and Views
- Contains Informartion about how redshift is functioning
- SYS views, STV tables (transient data containing snapshots of current system data), SVV views (metadata about DB objects for STV tables), STL views, SVL, 

### Redshift Data API
Secure HTTP endpoint for SQL Statements to redshift clusters 
- provisioned or serverless
- individual or batch
- assynchronous
- Application integration (REST endpoints)
- It can also integrate with a variety of other services
- ETL orchestration with StepFunctions, Sagemaker notebooks, Eventbridge, Event Stream with lambda

### Maximum for Data API: 
- Query duration 24hours
- Active queries: 500
- Query result size (gziped): 100MB
- Result retention time 24hours
- API Calls: ExecuteStatement, BatchExecuteStatement, ...
- Cluster must be in a VPC
 
# Migration And Transfer

## AWS Database Migration Service
- Sources: On-premises, EC2 Instances Database (Oracle, MariaDB, PostgreSQL, MongoDB), Azure SQL Database, 
- Amazon s3
- Amazon RDS (Aurora Including)
- DocumentDB

Tagerts: On-premises
- RDS
- Redshift
- DynamoDB
- OpenSearch Service
- Kinesis Data Streams
- Apache Kafka, etc

### AWS Schema Conversion Tool (SCT)
- Convert your Database Schema from one engine to another
- Source DB --> DMS + SCT --> Target DB (different engine)
- No need to use SCT for same engine on-premises PostgreSQL to RDS PostgreSQL
- For DMS continuous Replication (Build the Diagram:) oracleDB (source) --> AWS SCT --> Amazon RDS (MySQL)
and oracleDB (source) --data migration--> AWS DMS Replication Instance (Full load + CDC) --> Amazon RDS (MySQL)

## AWS DataSync
- Move large amount of data to and from 
- On premises / Other cloud to AWS
- AWS to AWS

## AWS Snow Family
- Currently being phased out from the exam, but let's keep for context
- Highly-secure, portable devices to collect and process data at the edge, and migrate data into AWS and out of AWS
- A physical device shipped to your location and shipped back to aws to transfer data to cloud
- Useful for edge computing: Process data while its being created on an edge location: mining site, on the road, ship, etc

## AWS Data Exchange
- Find, subscribe to, and use third-party data in the cloud
- Reuters, who curate data from over 2.2 million unique news stories
- Change Healthcare, who process and anonymize more than 14 billion healthcare transactions
Dun & Bradstreet, who maintain a databse of more than 330 million global business records
- Data Exchange for Redshift
- Data exchange for APIs (find and subscribe to third-party APIs with a consistent access using AWS SDKs)

after subscribe you can use data exchange api to load data into s3 an then analyze it with the AWS analytics tools

## AWS Transfer Family
- Fully managed service for file transfers into and out of Amazon s3 or Amazon EFS using the FTP protocol
- AWS Transfer for FTP (File Transfer Protocol)
- FTPS File Transfer Protocol over SSL (encrypted)
- SFTP (Secure File Transfer Protocol) (encrypted)
- INtegrate with authetication providers
- Manages user credentials otherwise
- 

# Computing

## EC2
-

## AWS Graviton
- Amazon's own family of processors
- Offers best price performance
- Option for many data engineering services: MSK, RDS, MemoryDB, ElasticCache

## AWS Lambda
- Serveless Continuous Scaling
- Often used to process data as it's moved around
- Serverless Website (Amazon API Gateway, DynamoDB, Amazon cognito)
- e.g Order History app (Server logs--> Kinesis Data Streams --> Lambda --> DynamoDB --> ClientApp)
- Lambda can act as a glue between services that do not natively speak
- • Synchronous Invocations: Capped at a maximum of 15 minutes (900 seconds).
• Asynchronous and Event Source Mapping (ESM): Up to 90 minutes (5,400 seconds) when running on AWS Lambda Managed Instances.

Why not just run a server?
- Server management
- Servers can be cheap but scaling gets expensive really fast
- You don't pay for processing time you don't use in lambda

Main use cases of Lambda
- Real-time file processing
- Real time stream processing
- ETL
- Cron Replacement
- Process AWS Events
- Lambda Triggers has an extensive liste of services that can trigger lambda functions.

### Lambda Architectures
- Lambda and Amazon OpenSearch Architecture: build your version of google analytics
- amazon s3 --> AWS lambda triggered --> Amazon Elastic Service (visualize & query)
- Lambda and data pipeline triggered by s3
- Lambda and Redshift: Best practice is trhough COPY command but you can use lambda if you need to respond to new data that shows up at any time, can also use Amazon dynamoDb to keep track of what's been loaded.
- Lambda and Kinesis: Lambda receives an event with a batch of stream records, you specify

### Lambda - File Systems Mounting
- Lambda can access EFS file systems if they are running in a vpc
- Storage options: Ephemeral /tmp , Lambda Layers, Amazon s3, Amazon EFS

### Lambda - SAM
- Serverless Application Model
- Framework for developing and deploying serverless application
- All config is handled in Yaml
- Generate complex cloud formation templates and deploy implementations
- SAM - Recipe: Transform: 'AWS::Serverless-2016-10-31', AWS::Serverless::Function, AWS::Serverless::Api
- SAM Accelerate (SAM sync)
- SAM Accelerate is a set of features to reduce latency while deploying resources to AWS
- can be used to deploy lambda easily and quicker: `sam sync`, `sam sync --code`, etc.

 ## AWS BATCH
 - Run batch jobs as docker images
 - dynamic provisioning of the instances
 - No need to manage clusters, fully serverless
 - You just pay for the underlying EC2 instance
 - Orchestrate or Invoke in Stepfunction

### AWS BATCH vs Glue
- Glue: Run Apache Spark code, Scala or Python focus on ETL, Do not worry about configuring or managin the resources, Needs Data catalog to make data available to athena or Redshift
- Batch: For any computing job regardless of the job (Docker Image), Resources are created in your account, managed by batch.

# Containers

## Docker
- Docker is a software development platform to deploy apps
- Apps are packaged in containers that can be run on any OS
- Any machine, No compatibility issues, predicatable behavior, less work, easier to maintain
- Server --> Docker --> Containers (Java, Node, MySQL) on same server
- Docker Images are stored in Docker Repositories
- Docker Hub: Public Repository, ECR: Private/Public repository
- Resources are shared with the host -> Many Containers one Server
- Starting with docker: Build file, Docker daemon to build, Run on Server

## AWS ECS
- Elastic container Service
- Launch docker containers on AWS means Launch ECS Tasks on ECS Cluster
- Launch Type: EC2, each instance is an EC2 server running the docker agent
- Fargate Launch Type: You don't provision the infrastrutucre, just create task definitions, AWS runs ECS tasks based on the CPU/RAM you need, Serverless

### ECS - IAM roles

- EC2 instance profile (EC2 launch type), pull image from ECR, send logs to Cloudwatch, Makes API calls to ECS service
- ECS Task Role: Allows each task to have specific role. Defined in task definition
- ECS Data volumes can use EFS, compatible with both EC2 and Fargate
- Fargate + EFS = Serverless
- Tasks running in any AZ will sahre same data

### ECR
- Elastic Container Registry
- Store and manage docker images on AWS
- Fully integrated with ECS backed by Amazon s3
- 

### EKS
- Amazon Elastic Kubernetes Service
- It is a way to launch managed Kubernetes clusters on AWS
- Kubernetes is a nopen-source system for automatic deployment, scaling and management of containerized (usually docker) application
- It's an alternative to ECS, similar goal but different API
- EKS supports EC2 and Fargate
- If your company is already using kubernetes on premises or in another cloud
- Cloud Agnostic
- Managed Node groups
- Self managed Nodes
- AWS Fargate, no maintaince or nodes

# Analytics

## AWS Glue
- Managed service for serverless discovery and definition of table definitions and schema
- S3 "data lakes", RDS, Redshift, Other SQL databases
- CUstom eTL Jobs like: trigger-diven, schedule, or on demand
- GLue + Hive = Hive lets you run SQL-like queries from EMR
- glue data catalog can serve as hive metastore and you can also import a hive metastore into glue
- Glue ETL: (add definitions)
- Uses DPU's (data processing units) to process data, and you can check in glue metrics monitor
- Glue Scheduler, Glue triggers
- A DynamicFrame is a collection fo DynamicRecords
- have a schema, much alike a spark dataframe but with more ETL stuff

## AWS Glue Transformations
- DropFields, DropNullFields
- Filter - Specify a function to filter records
- Join - to enrich data
- Map - add fields, delete fields, perform external lookups
- FindMatches ML: Identify duplicate or matching records in your dataset, even when the records do not have a common unique identifier and no fields match exactly.
- Format conversions: CSV, JSON, AVRO, PARQUET
- Apache Spark Transformations (K-means)
- ResolveChoice - Deals with ambiguities in dynamicFrame and returns a new one (e.g "price":"100.00", price":"$100.00") 

## AWS Glue Modifying Data Catalog
- ETL scrips can update your schema and partitions
- Addning new partitions
- updating table schema
- Creating new tables (enableU)
- S3 Only, 

## AWS Running Glue Jobs
- Time-based Schedules
- Job Bookmarks (persists state from the job run, allows you to process new data only when re-running on a schedule))
- Cloudwatch Events (Fire off a lambda function or SNS notification when ETL Succeeds or fails)

## AWS Glue Cost Model
- Billed by the second for crawler and ETL Jobs
- First millions objects stored and accesses are free for the glue data catalog
- Development endpoints for developing ETL code charged by the minute
- Anti patterns: Multiple ETL engines, if you want to use other engines (HIVE, pig, etc)
try to go for DATA pipeline or EM
- Glue ETL supports serverless streaming ETL (Consumes from kinesis or kafka)
- Clean and transform in-flight
- Store results into s3 or other data stores
- Run on APAche Spark Structure Streaming

## AWS Glue Flex Jobs
- Execution class ("FLEX") for non-urgent ETL Workload
- Uses spare compute capacity instead of dedicated workers
- Might have to wait for capacity to become available
- Not supported: Python shell jobs, stramining jobs, glue ML Jobs

## AWS Glue Studio
- Visual interface for ETL workflows
- Creat DAG's for complex workflows,
- Sources can include s4, Kinesis, Kafka, JDBC
- Transforms sample and join date
- Visual job dashboard

## AWS Glue Data Quality
- Data quality rules may be created manually or recommended automatically
- Integrates into Glue Jobs
- Uses the Data quality definition language DQDL which consists of a ruleset
- Rules = [isComplete "order-id", IsUnique "order-id"]
- Lots of build in rules types (Mean, Sum, CustomSQL)
- Compositive rules (and,or)

```
Rules = [
    RowCount >= 100,
    IsComplete "customer_id",
    IsUnique "order_id",
]
```
## AWS Glue DataBrew
- a visual data preparation tool
- UI for pre-processing large data sets
- input from S3, data warehouse, or database
- Output to s3
- Over 250 ready-made transformations
- You create "recipes" of transformations that can be saved as jobs within a larger project
- May define data quality rules
- May create datasets with custom SQL from Redshift and snowflakes

## Handling PII in DataBRew Transformations
- Substitution (REPLACE_WITH_RANDOM)
- Shuffling (SHUFFLE_ROWS)
- Deterministic Encryption (DETERMINISTIC_ENCRYPT)
- Probabilistic Encryption (ENCRYPT)
- Decryption (DECRYPT)

## Glue Workflows
- Design multi-job, Multi-crawler ETL processes run together
- Create from AWS Glue blueprint, from the console or API
- This is only for orchestrating complex ETL workflows
- Triggers within workflows can: start jobs, crawlers, schedule, on demand, evenbridge events

## AWS Lake Formation
- Makes it easy to setup a secure datalake in days
- Loading data and monitoring data flows
- Setting up partitions
- Encryption and managign Keys
- Defining transformations jobs and monitoring them
- access control
- auditing
- built on top of glue
- Theres no cost on lake formation but the underlying services costs

## Data Permissions in Lake formation

- Cross-account Lake Formation permissions> Recipient must be setup as datalake administrator
- Can use AWS Resource Manager, IAM Permissions for cross-account access
- Lake formation does not support manifests in athena
- IAM Permissions needed to create blueprints and workflows
- Can tie to IAM users/roles or SAML or external aws accounts
- Can use policy tags
- can select specific permissions for tables or columns

## Data filters in Lake Formation
- Column, row or cell-level security
- Apply when granting select permission on tables
- all columns + row filter = row-level security
- all rows + specific columns = column-level security
- Creates filter over UI or API

## Amazon Athena
- Serverless interactive query service for s3
- Presto Under the hood
- Supports main data formats and compressions 
- Unstructured, Semi-structured or structured
- e.g: Ad-hoc queries of weblogs, querying stagin data before loading to redshift, integration with quicksight, integration with ODBC/JDBC, Analyze Cloudtrail/Cloudfront
- Pay as you go: $5 per TB scanned
- Save LOTS of money by using columnar formats (money and performance)
- Glue and s3 have their own charges
- No charge for DDL
- Successful or Cancelled queries counts, failed queries do not
- Small number of large files performs better than large number of small files
- Partitions use improves performance
- Able to use CTAS table creation ( can be used to convert data stored in s3)
- 

## Athena + Glue
-   amazon s3 --> glue --> athena --> quicksight

### Athena Workgroups
- Organise users/teams/apps workloads into workgroups
- Can control query access and track costs by workgroup-
- Each workgroup can have its own: Query history, Data Limits, IAM policies, Encryption Settings

## Athena Security
- Access control
- Encrypt Results at rest in s3 staging directory (SSE-s3, SSE-KMS, CSE-KMS)
- cross-account access in s3 bucket policy possible
- transport layer security (TLS) encrypts in-transit (between athena and s3)
- Athena Anti-patterns : Highly formatted reports/visualisations, ETL use glue Instead
- You can have IAM policies to restrict access to alter, create, drop, repair, show databses, show tables. It's necessary to mapa each operations to their IAM Actions


## Athena ACID transactions
- Powered by Apache Iceberg only for iceberg tables
- Concurrent users can safely make row-level modifications
- Removes need for custom record locking
- Compatible with EMR, Spark, anything that supports iceberg
- Time travel operations
- Periodic compaction to preserve performance

## Apache Spark
- Distributed processing framework for big data
- in-memory caching, optimised query execution
- supports java, scala, python and r
- supports code reuse across: batch processing, interactive queries, real-time analytics, machine learning, graph processing
- Spark streaming: integrated with kinesis, kafka, on EMR
- Spark is not meant for OLTP
- Spark apps are run as independent processes on a cluster
- the SparkContext (driver program) coordinates them
- SparkContext Works through a cluster Manager 
Make a diagram here about spark
- Executors run computations and store data

### Spark Structured Streaming
- It's a constantly geowing DataSet
- Data stream --> Unbounded table (new data in stream = new rows appended to input table)
```python
spark.readstream.json ("s3://logs")
inputDF.groupBy($"action", window($"time", "1 hour")).count())
    .writeStream.format("jdbc").start("jdbc:mysql//...")
```
- Spark Streaming + Kinesis (Kinesis Producer --> Amazon Kinesis data Streams <-- Spark Dataset implemented from KCL)
- Spark + Redshift : Allows spark datasets from Redshift, useful for ETL using Spark

### Spark + Athena
- Can run jupyter notebooks with Spark within athena console (Notebooks may be encrypted auto or with KMS)
- Uses firecracker for quickly spinning up spark resources
- Programmatic API /CLI access as well (create-work-group, create-notebook,...)
- Can adjust DPU's for coordinatior and executor

### Athena Federated Queries
- Query data from sources other than s3
- Data source connectors translate between source and athena 
- Connectors: Cloudwatch, DynamoDB, DocumentDB, OpenSearch, RDS
- Support for views on federated data sources
- Can use with AWS Secrets Manager
- Some connectors may be integrated with AWS Glue
- Cross-account federated queries are possible
- Passthrough Queries allow you to use the native query language of the data source

## AWS EMR
- Elastic Mapreduce
- Managed Hadoop framework on EC2
- Includes Spark, HBase, Presto, Flink
- EMR Notebooks
- Several integration points with AWS
- Master Node: manages the cluster, track status of tasks
- Core Node: Hosts HDFS data and runs tasks, can be scaled up and down but with some risks
- Task Node: Runs tasks, does not host data, No risk of data loss when removing, good use of spot instances
- ENR Charges by the hour plus EC2 Charges
- Provisions new nodes if a core node fails
- cAN ADD AND REMOVe tasks nodes on the fly (Increase process capacity but not HDFS)
- Can resize a running cluster's core nodes (Increase both processing and HDFS capacity)
- Core nodes can also be aadded or remoted (Leads to risk of data loss)

### EMR Usage
- Transisent: clusters terminate once all steps are complete. Loading data, processing, storing and then shutdown
- Long running clusters must be manually terminated: Basically a data warehouse with periodic processing on large datasets, auto-termination off.
- Frameworks and applications are specified at cluster launch
- connect directly to master to run jobs directly
- Or, submit ordered steps via the console, process data in s3 or HDFS, output data to X, can be invoked via the console
- Integration with Amazon EC2 : for instances that compromise the nodes in the cluster
- Integration with Amazon VPC : 
- Amaozn S3 : To store input and output data
- Amazon Cloudwatch to monitor cluster performance

### EMR Storage
- HDFS (Distributed file System, Multiple coies stored across cluster instances for redundancy, files stored as blocks, 128MB is the default, Ephemeral - HDFS data is lost when cluster is terminated, but useful for caching intermediate results)
- EMRFS : Access s3 as if it were HDFS, allows persistent storage after cluster termination, EMRFS Consistent View: Optional for s3 consistency, Uses dynamoDB to track consistency (since 2021 s3 guarantees consistent)
- Local File system: suitable only for temporary data (Buffers, cache, etc)
- EBS for HDFS --> Allows use of emr on EBS-pnly types (M4-C4)

### AWS EMR Managed Scaling
- EMR Automatic Scaling (Old way of doing, custom scaling rules, supports instance groups only)
- EMR Managed Scaling (Introduced in 2020, supports groups and instance fleets, scales spot, on-demand, and instances in savings plan)
- Scale-up Strategy first adds core nodes then task nodes
- Scale-down Strategy (first removes task-nodes then core-nodes, spot nodes always removed before on-demand instnaces)

### Hadoop
- Mapreduce: Framework for distributed data processing maps data to key/value pairs, reduces intermediate results to final output, largely supplanted by spark these days
- YARN : tet another resource Negotiator: Manages cluster resources for multiple data processing frameworks
- HDFS : Hadoop distributed file systems, distributes data blocks across cluster in a redundant manner, data lost on termination

### EMR Serverless
- do not need to provision clusters, and provision resources
- Put diagram to initialize
- Put diagram to Lifecycle (Must call API's such as createApplication, StartApplication, StopApplication to avoid excess charges)
- Spark adds 10% overhead to memory requested for drivers and executors
- Be sure initial capacity is at least 10% more than requested by the job.
- EMRFS (s3 encryption SSE or CSE at rest)
- TLS in transit between EMR nodes and s3
- Local disk encryption
- Spark communication between drivers and executors is encrypted

### EMR On EKS
- Allows submitting spark job on Elastic kubernetes service without provisioning clusters
- fully managed
- share resources between spark and other apps on kubernets

## Amazon Kinesis Data Streams
- Made by multiple shards 1... shard N
- Producers: Send data to kinesis data streams (apps, client, sdk, kinesis agent). produce records
- Records are partition key and data Blob (up to 1MB)
- Producers can send 1MB/sec or 1000msgs/sec per shard
- Consumers: Apps, Lambda, Kinesis Data firehose, Kinesis data analytics
- Receive Records: Partition key, sequence no., Data blob (2MB/sec shared all consumers, or 2MB/sec (enhanced per shard per consumers))
- Retention between 1 day to 365 days
- Ability to reprocess (replay) data
- Once data is inserted in kinesis it cant be deleted (Immutability)
- Data that shares the same partition goes to the same shard (ordering)
- Provisioned Mode: Choose the number of shards provisioned, scale manually or API, Each shard gets 1MB/s IN, 2MB/s OUT, you pay pershard per hour
- On-demand Mode: No need to provision or manage the capacity, default capacity provisioned (4MB/s in or 4000 Records/s), Scales automatically based on observed throughput peak during last 30 days, pay per stream per hour and data in/out per gb
- Encryption in flight using HTTPS
- Encryption in rest using KMS
- VPC endpoints available for Kinesiss to access within VPC
- Client Side encryption must be manually implemented

## Kinesis data streams security
- Control acces/authorization using IAM policies
- Encryption in flight using HTTPS
- Encryption at rest using KMS

## Kinesis Producers
- SDK (allow to write code or use the CLI to directly send data to Kinesis data streams)
- KPL: Advanced (ability to write custom codes, better code and enhanced features)
- Kinesis Agent: Linux server (get a log file and send reliable to kinesis data streams )
- Kafka Connect and Spark: Using custom library ommands to send data

### SDK 
- PutRecord - Put one record
- PutRecords - Put many records
- ProvisionedThroughputExceeded if we go over limits (Happens when sending more data exceeding MB/s or TPS for any shard)
- To solve: make sure you don't have hot shard (Bad partition key and too much data goes there), Retries with backoff, increase shards (scaling), Ensure your partition key is a good one
- Use case: low throughput, higher latency, simple API, AWS Lambda
- Managed AWS sources for Kinesis Data Streams: AWS Iot, Cloudwatch Logs

### KPL (Kinesis Producer Library)
- Easy to use and highly config (C++ and JAVA)
- Used for bulding high performance, long-running producers
- automated and config retry mechanism
- synchronous (Same as SDK) or asynchronous API (Better performance for async)
- able to submits metrics to cloudWatch for monitoring
- Batching mechanism - Increase throughput, decrease cost:
    - Collect - Records and write to multiple shards in the same PutRecords API call
    - Aggregate - Ability to store multiple records in one record ( go over 1000 records per second limit), Increase payload size and improve throughput
- Compression might be implemented by the user 
- KPL records must be decoded using KCL or special helper library
- 1. 2KB to kinesis --> wait --> 40KB --> 500KB --> aggregate into One record < 1MB
- 2. Instead of sending this big record waits a little bit more and aggregate again to send via Collection (PutRecords) using only 1 api call
Put the diagram here
- We can influence the batching efficiency by introducing some delay with RecordMaxBufferedTime (default 100ms) adds latency to processing

### Anti pattern:
- KPL can incur an additional processing delay of up to RecordMaxBufferedTime
- Larger values of RecordMaxBufferedTime results in higher packing efficiencies and better perfomance
- Application that cannot torelate this additional delay mayu need to use the AWS SDK directly
-

### Kinesis Agent
- Monitor log files and sends them to kinesis data streams
- Java based agent, bult on top of KPL
- Install in linux based server environments
- Write from multiple directiores and wreite to multiple strams
- routing feature based on directory/log file
- Pre-process data before sending to streams
- the agend handles file rotation, checkpointing, and retry uplon failures
- emits metrics to cloudwatch for monitoring

## Kinesis Consumers - Classic
### Kinesis SDK
- Classic Kinesis - records are polled by consumers from a shard
- Each shard has 2MB total aggregate throughput
- GetRecords returns up to 10MB of data (then throttle for 5 seconds or up to 10000 records)
- Maximum of 5 GetRecords API calls per shard per second = 200ms latency
- if 5 consumers application consume from the same shard means every consumer can poll once a second and receive less than 400KB/s

### Kinesis Client Library (KCL)
- Java first library but exists for other languages: python, go rube, node
- Read records from Kinesis produced with the KPL (de-aggregation)
- Share multiple shards with multiple consumers in one group, shard discovery
- checkpointing feature to resume progress
- Leverages DynamoDB for coordination and checkpointings (One row per shard)
    - Make sure you provision enough WCU/RCU
    - Or use on-demand for dynamo
    - Otherwise DynamoDB may slow down KCL
- Record processors will process the data
- ExpiredIteratorException => Needs increase on the WCU

### Kinesis Connector Library
- Older Java library (2016) leverages the KCL library
- Write data to : S3, DynamoDB, Redshift, Opensearch
- Kinesis firehose replaces the connector library for a few of these targets, lambda for others

### Kinesis Firehose
- 

### AWS Lambda
- Read records from Kinesis data streams

### Kinesis Enhanced Fan out
- Each consumer get 2MB/s of provisioned througput per shard
- No more 2MB/s limit pershard per consumer
- ables multiple consumers
- Enhanced fan out pushs data to consumers over HTTP/S
- Reduced latency (70ms)
- use cases: Multiple consumer applications for sma stream
- Low latency req, higher costs, default limit of 20 consumers using enhanced fade out per shard

### Kinesis Operations - Adding Sharts
-  Also called Shard Splitting
- Can be used to increase the Stream Capacity (1MB data in per shard)
- Can be uysed to divide a "hot shard"
- the old shard is closed and will be deleted once the data is expired

### Merging Sharts
- Decrease the stream capacity and save costs
- Opposite to adding sharts
- can be used to group two shards with low traffic
- Old shards are closed and deleted based on data expiration

### Out of order records after resahrding
- When you are creating new shards the data from the child shard can be consumed before the original data on a new consumer
- e.g if you start reading the child before completing reading the parent shard, you could read data for a particular hash key out of order
- In order to prevent data: after a reshard read entirely from the parent until you dont have new records
- Note: KCL has this logic already built-in even after resharding operations

### Kinesis Operations - Auto Scaling
- Auto scaling is not a native feature
- the API ...
- ...
- ..
- Kinesis Scaling Limititions: Resharding cannot be done in parallel. Plan capacity in advance
- Other limitations: 

### Kinesis Handling duplicates for Producers
- Producer retires can create duplicates due to network timeouts on sending ACK back to producer
- In order to fix: embed unique record ID in the data to de-duplicate on the consumer side

### Kinesis Handling duplicates for consumers
- Consumers retries can make your application read the same data twice
- Can happen when record processors restart: 1 Worker terminates unexepctedly, Worker instances are added or removed, shards are merged or split, the application is destroyed
- Fixes: Make your consumer app idempotent
- If the final destination can handle duplicates, it's recommended to do it there

## Kinesis Data Firehose
- Can read records from producers and transform using lambda, and output batch writes to s3, redshift, or opensearch
- Also to 3rd party: splunk, datadog, new relic and custom http endpoint
- All or failed data can be sent to a s3 bucket
- Fully managed service
- Near real time (buffer based on time and size)
- Load data into Redshift / Amazon s3 / Opensearch / Splunk
- Automatic Scaling
- Can compress data when s3 is the target
- Pay for the amount of data going through Firehose
- Spark and KCL do not read from KDF

### Kinesis Firehose Buffer Sizing
- Firehose accumulates records in a buffer
- the buffer is flushed based on time and size rules
- Buffer Size: if that buffer size is reached is flushed
- Buffer time: if that time is reached is flushed
- Fire hose can auto increase the buffer size to icrease throughput

### Kinesis Data Streams vs Firehose

### Troubleshooting Kinesis data stream producers
- Performance: writing is too slow
- 

### Troubleshooting Kinesis data stream Consumers
