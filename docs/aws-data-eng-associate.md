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