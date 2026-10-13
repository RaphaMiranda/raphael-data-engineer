/* Source-backed study data, separate from rendering.
 * Components belong to their named service; integrations retain whole
 * participant sets. Exam task mappings are editorial study guidance.
 * After editing, read current official sources and update verification dates.
 */
(function (root) {
  'use strict';
  const data = {
  "version": 1,
  "verified": "2026-10-08",
  "scope": "https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/dea-01-in-scope-services.html",
  "scopeNote": "All distinct entries in the retrieved AWS list. AWS states that its list is non-exhaustive and subject to change.",
  "scopeDuplicates": [
    "Amazon SageMaker AI",
    "Amazon S3 Tables"
  ],
  "domains": [
    {
      "id": "1",
      "name": "Data Ingestion and Transformation",
      "weight": "34%",
      "tasks": {
        "1.1": "Perform data ingestion",
        "1.2": "Transform and process data",
        "1.3": "Orchestrate data pipelines",
        "1.4": "Apply programming concepts"
      },
      "source": "https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01-domain1.html"
    },
    {
      "id": "2",
      "name": "Data Store Management",
      "weight": "26%",
      "tasks": {
        "2.1": "Choose a data store",
        "2.2": "Understand data cataloging systems",
        "2.3": "Manage the lifecycle of data",
        "2.4": "Design data models and schema evolution"
      },
      "source": "https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01-domain2.html"
    },
    {
      "id": "3",
      "name": "Data Operations and Support",
      "weight": "22%",
      "tasks": {
        "3.1": "Automate data processing by using AWS services",
        "3.2": "Analyze data by using AWS services",
        "3.3": "Maintain and monitor data pipelines",
        "3.4": "Ensure data quality"
      },
      "source": "https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01-domain3.html"
    },
    {
      "id": "4",
      "name": "Data Security and Governance",
      "weight": "18%",
      "tasks": {
        "4.1": "Apply authentication mechanisms",
        "4.2": "Apply authorization mechanisms",
        "4.3": "Ensure data encryption and masking",
        "4.4": "Prepare logs for audit",
        "4.5": "Understand data privacy and governance"
      },
      "source": "https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01-domain4.html"
    }
  ],
  "services": [
    {
      "id": "athena",
      "name": "Amazon Athena",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Athena"
      ],
      "description": "Serverless interactive SQL over data, commonly an S3 data lake.",
      "useCases": "Ad hoc exploration, validation and lake reporting.",
      "components": "Workgroups; query editor; engine versions; CTAS; federated connectors.",
      "technical": "S3 queries use catalog metadata and format-specific SerDes; Parquet and ORC reduce scanning. SQL and Spark are distinct execution options.",
      "considerations": "Use workgroups, encryption and least privilege. Partition and compress data; scanned bytes affect SQL query cost.",
      "choose": "You need SQL over lake files without maintaining a warehouse.",
      "alternatives": "Redshift for warehouse workloads; EMR for custom distributed processing.",
      "recall": {
        "question": "Does Athena require loading S3 files into a warehouse?",
        "answer": "No. It queries supported files using table metadata."
      },
      "tasks": [
        "2.1",
        "2.2",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/athena/latest/ug/what-is.html",
        "https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Athena"
    },
    {
      "id": "emr",
      "name": "Amazon EMR",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "EMR"
      ],
      "description": "Managed platform for distributed data processing frameworks.",
      "useCases": "Large batch ETL, Spark transformations and custom analytics.",
      "components": "EMR on EC2; EMR on EKS; EMR Serverless; Spark; Hive.",
      "technical": "Framework and connector availability depend on release and deployment model. S3 can hold persistent data independently of compute.",
      "considerations": "Tune partitioning, shuffle and compute sizing; use IAM roles and encryption. EC2 clusters require capacity and lifecycle choices.",
      "choose": "You need control over big-data frameworks and runtime tuning.",
      "alternatives": "Glue for managed ETL; Athena for interactive SQL.",
      "recall": {
        "question": "Is EMR limited to long-running EC2 clusters?",
        "answer": "No. EMR also offers EKS and Serverless deployment options."
      },
      "tasks": [
        "1.2",
        "2.1",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon EMR"
    },
    {
      "id": "glue",
      "name": "AWS Glue",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Glue",
        "Glue Data Catalog"
      ],
      "description": "Serverless data integration and metadata services.",
      "useCases": "Discover schemas, transform batch/stream data and evaluate data quality.",
      "components": "Data Catalog; crawlers; ETL jobs; workflows; triggers; bookmarks; Data Quality rules.",
      "technical": "Spark jobs and Python shell jobs have different runtimes. JDBC connects databases; catalog tables describe data rather than storing it.",
      "considerations": "IAM and KMS protect access. Tune workers, partitions and small files. Bookmarks track supported inputs, not arbitrary output deduplication.",
      "choose": "You need managed ETL plus shared technical metadata.",
      "alternatives": "EMR for framework control; DataBrew for visual preparation.",
      "recall": {
        "question": "Does the Glue Data Catalog contain the actual S3 dataset?",
        "answer": "No. It stores metadata describing the dataset."
      },
      "tasks": [
        "1.1",
        "1.2",
        "1.3",
        "2.2",
        "3.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html",
        "https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html",
        "https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Glue"
    },
    {
      "id": "databrew",
      "name": "AWS Glue DataBrew",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "DataBrew"
      ],
      "description": "Visual data preparation without writing transformation code.",
      "useCases": "Profile datasets and apply repeatable cleaning steps.",
      "components": "Datasets; projects; recipes; recipe jobs; profile jobs.",
      "technical": "Recipes record preparation steps; jobs execute them against supported sources and destinations.",
      "considerations": "Grant source/output access; review sensitive fields. Profile and recipe jobs have separate processing costs.",
      "choose": "Analysts need visual profiling and reusable cleaning recipes.",
      "alternatives": "Glue ETL for code-driven pipelines; Athena for SQL checks.",
      "recall": {
        "question": "What makes DataBrew preparation repeatable?",
        "answer": "A saved recipe applied by recipe jobs."
      },
      "tasks": [
        "1.2",
        "3.1",
        "3.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Glue DataBrew"
    },
    {
      "id": "lakeformation",
      "name": "AWS Lake Formation",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Lake Formation"
      ],
      "description": "Central permissions and governance for data lakes.",
      "useCases": "Govern cataloged lake data and share authorized datasets.",
      "components": "LF-Tags; grants; registered locations; data filters; resource links.",
      "technical": "Works with the Glue Data Catalog and supported analytics engines; IAM and Lake Formation permissions both matter.",
      "considerations": "Use least privilege and audit access. Fine-grained enforcement depends on the consuming engine and integration.",
      "choose": "You need centralized lake permissions across analytics users.",
      "alternatives": "IAM for AWS API permissions; Macie for sensitive-data discovery.",
      "recall": {
        "question": "Does a Lake Formation grant replace every IAM permission?",
        "answer": "No. IAM permissions and supported service integration are still required."
      },
      "tasks": [
        "2.2",
        "4.2",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "https://docs.aws.amazon.com/lake-formation/latest/dg/service-integrations.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Lake Formation"
    },
    {
      "id": "firehose",
      "name": "Amazon Data Firehose",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Amazon Kinesis Data Firehose",
        "Kinesis Data Firehose",
        "Firehose"
      ],
      "description": "Managed delivery of streaming data to supported destinations.",
      "useCases": "Land streams in S3 or deliver to analytics stores.",
      "components": "Delivery streams; buffering; Lambda transformation; format conversion; backup.",
      "technical": "Delivery is buffered rather than a general replayable stream. Redshift delivery stages through S3 before COPY.",
      "considerations": "Allow destination and KMS access. Balance buffering latency against object sizes and ingestion costs; handle duplicates.",
      "choose": "You want managed delivery with little consumer code.",
      "alternatives": "Kinesis Data Streams for custom/replayable consumers; Flink for stateful processing.",
      "recall": {
        "question": "Does Firehose deliver directly into Redshift without S3?",
        "answer": "No. Its Redshift destination uses S3 staging and COPY."
      },
      "tasks": [
        "1.1",
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html",
        "https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Kinesis Data Firehose"
    },
    {
      "id": "kinesis",
      "name": "Amazon Kinesis Data Streams",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Kinesis",
        "KDS"
      ],
      "description": "Managed ordered record streams for real-time applications.",
      "useCases": "Ingest events for multiple independent consumers and replay.",
      "components": "Streams; shards; partition keys; enhanced fan-out; on-demand and provisioned capacity.",
      "technical": "Ordering is within a shard, not global. Consumers track positions; retention and capacity are configurable.",
      "considerations": "Distribute partition keys to avoid hot shards; monitor lag, use encryption and budget for capacity/fan-out.",
      "choose": "You need stream replay and custom low-latency consumers.",
      "alternatives": "Firehose for managed delivery; MSK for Kafka compatibility.",
      "recall": {
        "question": "Does Kinesis provide global ordering across every shard?",
        "answer": "No. Ordering is scoped to a shard."
      },
      "tasks": [
        "1.1",
        "2.1",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/streams/latest/dev/introduction.html",
        "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Kinesis Data Streams"
    },
    {
      "id": "flink",
      "name": "Amazon Managed Service for Apache Flink",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Kinesis Data Analytics",
        "Managed Flink"
      ],
      "description": "Managed runtime for Apache Flink streaming applications.",
      "useCases": "Stateful event-time transformations, windows and aggregates.",
      "components": "Applications; checkpoints; snapshots; parallelism; Flink connectors.",
      "technical": "Flink manages state and event-time processing; connector and version choices determine delivery semantics.",
      "considerations": "Checkpoint and scale deliberately; monitor backpressure. Grant source/sink access and plan recovery from saved state.",
      "choose": "You need continuous stateful processing rather than simple delivery.",
      "alternatives": "Lambda for short stateless transforms; Firehose for buffered delivery.",
      "recall": {
        "question": "Why choose Flink for windowed stream aggregation?",
        "answer": "It supports managed state and event-time processing."
      },
      "tasks": [
        "1.1",
        "1.2",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html",
        "https://docs.aws.amazon.com/managed-flink/latest/java/how-sources.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Managed Service for Apache Flink"
    },
    {
      "id": "msk",
      "name": "Amazon Managed Streaming for Apache Kafka",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Amazon MSK",
        "MSK",
        "Kafka"
      ],
      "description": "Managed Apache Kafka infrastructure.",
      "useCases": "Kafka-compatible event ingestion and stream integration.",
      "components": "Topics; partitions; brokers; MSK Connect; provisioned and serverless clusters.",
      "technical": "Kafka producer/consumer APIs and partition ordering; MSK Connect runs supported Kafka Connect connectors.",
      "considerations": "Choose authentication, broker/network access and encryption; monitor lag and partition distribution. Compatibility varies by cluster model.",
      "choose": "Existing tooling or protocols require Kafka.",
      "alternatives": "Kinesis for AWS-native streams; Firehose for delivery.",
      "recall": {
        "question": "Does MSK Connect replace every application consumer?",
        "answer": "No. It runs connectors; custom consumers still use Kafka APIs."
      },
      "tasks": [
        "1.1",
        "2.1",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html",
        "https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Managed Streaming for Apache Kafka (Amazon MSK)"
    },
    {
      "id": "opensearch",
      "name": "Amazon OpenSearch Service",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "OpenSearch",
        "Elasticsearch"
      ],
      "description": "Managed search and analytics engines.",
      "useCases": "Index logs and events for search and operational analytics.",
      "components": "Domains; indexes; shards; Dashboards; OpenSearch Serverless collections.",
      "technical": "Index documents via APIs; domain and serverless features differ. Search indexes are not relational warehouse tables.",
      "considerations": "Use fine-grained access, encryption and network controls. Shards, mappings and storage affect indexing/search performance and cost.",
      "choose": "You need document search or near-real-time log analytics.",
      "alternatives": "Redshift for relational analytics; S3 for inexpensive raw retention.",
      "recall": {
        "question": "What is an OpenSearch index optimized for?",
        "answer": "Searching and analyzing indexed documents."
      },
      "tasks": [
        "2.1",
        "3.2",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon OpenSearch Service"
    },
    {
      "id": "quick",
      "name": "Amazon Quick",
      "categories": [
        "Analytics"
      ],
      "aliases": [
        "Amazon QuickSight",
        "QuickSight",
        "Quick Suite"
      ],
      "description": "AWS workspace encompassing business intelligence and related capabilities.",
      "useCases": "Visualize analytics datasets and distribute dashboards.",
      "components": "QuickSight dashboards; datasets; analyses; SPICE; direct query.",
      "technical": "The official scope says Amazon Quick. QuickSight BI capabilities use SPICE imports or supported direct queries.",
      "considerations": "Apply dataset permissions and row-level security; refresh imported datasets. Capacity/licensing and source-query costs differ.",
      "choose": "You need BI dashboards on lake or warehouse results.",
      "alternatives": "Athena and Redshift execute queries; they do not replace dashboard authoring.",
      "recall": {
        "question": "How does SPICE differ from direct query?",
        "answer": "SPICE stores an imported analytical dataset; direct query accesses the source."
      },
      "tasks": [
        "3.2",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/quick/latest/userguide/what-is.html",
        "https://docs.aws.amazon.com/quick/latest/userguide/managing-spice-capacity.html",
        "https://docs.aws.amazon.com/quick/latest/userguide/prepare-database-data.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Quick"
    },
    {
      "id": "sagemaker",
      "name": "Amazon SageMaker AI",
      "categories": [
        "Analytics",
        "Machine Learning"
      ],
      "aliases": [
        "SageMaker",
        "SageMaker AI"
      ],
      "description": "Managed tools for the machine learning lifecycle.",
      "useCases": "Prepare and process data, maintain features and track ML lineage.",
      "components": "Processing jobs; Feature Store; pipelines; lineage tracking.",
      "technical": "Processing jobs run managed workloads. Model training/inference is outside the stated target tasks of this exam.",
      "considerations": "Control roles and private access; manage compute/storage lifecycle. Feature freshness and lineage matter for reproducibility.",
      "choose": "You need data preparation within an ML workflow.",
      "alternatives": "Glue for general ETL; Bedrock for managed foundation-model APIs.",
      "recall": {
        "question": "Which SageMaker activity is relevant to data engineering preparation?",
        "answer": "Processing and preparing datasets, features and lineage."
      },
      "tasks": [
        "1.2",
        "2.4",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html",
        "https://docs.aws.amazon.com/sagemaker/latest/dg/processing-job.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon SageMaker AI"
    },
    {
      "id": "appflow",
      "name": "Amazon AppFlow",
      "categories": [
        "Application Integration"
      ],
      "aliases": [
        "AppFlow"
      ],
      "description": "Managed flows between supported SaaS applications and AWS services.",
      "useCases": "Ingest business application data into analytics storage.",
      "components": "Flows; connectors; field mappings; filters; scheduled/event/on-demand triggers.",
      "technical": "Source/destination combinations and trigger support are connector-specific.",
      "considerations": "Authorize connectors and encrypt data; consider transfer volume and frequency. It does not connect every SaaS system.",
      "choose": "You need a supported SaaS connector with minimal ingestion code.",
      "alternatives": "DMS for database replication; DataSync for file/object transfers.",
      "recall": {
        "question": "Can any arbitrary SaaS API be used without a supported connector?",
        "answer": "No. Confirm a supported connector or implement a custom connector."
      },
      "tasks": [
        "1.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/appflow/latest/userguide/what-is-appflow.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon AppFlow"
    },
    {
      "id": "eventbridge",
      "name": "Amazon EventBridge",
      "categories": [
        "Application Integration"
      ],
      "aliases": [
        "EventBridge"
      ],
      "description": "Managed event routing and scheduling.",
      "useCases": "Trigger pipelines on events and schedules.",
      "components": "Event buses; rules; Scheduler; Pipes; event patterns.",
      "technical": "Events are routed to configured targets; it is not a bulk dataset transport. Delivery/retry behavior depends on the capability.",
      "considerations": "Restrict event bus and target roles; configure retries and dead-letter handling. Avoid assuming event order.",
      "choose": "You need event-driven control flow or scheduled tasks.",
      "alternatives": "SQS for work queues; Step Functions for stateful workflows.",
      "recall": {
        "question": "Does an EventBridge event carry an entire S3 dataset?",
        "answer": "No. It normally carries event metadata used to trigger processing."
      },
      "tasks": [
        "1.1",
        "1.3",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon EventBridge"
    },
    {
      "id": "mwaa",
      "name": "Amazon Managed Workflows for Apache Airflow",
      "categories": [
        "Application Integration"
      ],
      "aliases": [
        "Amazon MWAA",
        "MWAA",
        "Airflow"
      ],
      "description": "Managed Apache Airflow environments.",
      "useCases": "Schedule and monitor DAG-based data pipelines.",
      "components": "DAGs; tasks; operators; scheduler; workers; environment.",
      "technical": "Python DAGs define dependencies. DAG files and plugins are stored in an S3 bucket; AWS operators need appropriate roles.",
      "considerations": "Secure VPC access and execution roles; tune workers/scheduling. Managed environment costs continue while provisioned.",
      "choose": "Your team uses Airflow DAGs and ecosystem operators.",
      "alternatives": "Step Functions for managed state machines; Glue workflows for Glue-centric pipelines.",
      "recall": {
        "question": "Does Airflow execute all ETL itself?",
        "answer": "No. Operators can orchestrate external AWS processing jobs."
      },
      "tasks": [
        "1.3",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html",
        "https://docs.aws.amazon.com/mwaa/latest/mwaa-serverless-userguide/operators.html",
        "https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Managed Workflows for Apache Airflow (Amazon MWAA)"
    },
    {
      "id": "sns",
      "name": "Amazon SNS",
      "categories": [
        "Application Integration"
      ],
      "aliases": [
        "Simple Notification Service",
        "SNS"
      ],
      "description": "Managed publish/subscribe notifications.",
      "useCases": "Fan out pipeline notifications to subscribers.",
      "components": "Topics; subscriptions; message filtering; standard and FIFO topics.",
      "technical": "Pushes notifications; subscriber protocols and ordering/deduplication depend on topic type.",
      "considerations": "Use topic/subscription policies and encryption; plan delivery retries. Notifications are not a replayable analytical stream.",
      "choose": "You need notification fan-out.",
      "alternatives": "SQS for buffered pull-based work; Kinesis for stream consumers.",
      "recall": {
        "question": "How does SNS differ from SQS?",
        "answer": "SNS publishes to subscribers; SQS stores messages for consumers to poll."
      },
      "tasks": [
        "1.3",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/sns/latest/dg/welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon SNS"
    },
    {
      "id": "sqs",
      "name": "Amazon SQS",
      "categories": [
        "Application Integration"
      ],
      "aliases": [
        "Simple Queue Service",
        "SQS"
      ],
      "description": "Managed message queues that decouple producers and consumers.",
      "useCases": "Buffer processing work and isolate downstream failures.",
      "components": "Standard/FIFO queues; visibility timeout; long polling; dead-letter queues.",
      "technical": "Consumers poll and delete messages after processing. Standard queues can deliver duplicates and out of order.",
      "considerations": "Design idempotent consumers; align visibility with processing. Use policies, encryption and DLQs; watch backlog and request costs.",
      "choose": "You need durable work buffering between components.",
      "alternatives": "SNS for push fan-out; Kinesis for retained ordered streams.",
      "recall": {
        "question": "What happens if a consumer does not delete a received message?",
        "answer": "After its visibility timeout it can become available again."
      },
      "tasks": [
        "1.1",
        "1.3",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
        "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon SQS"
    },
    {
      "id": "stepfunctions",
      "name": "AWS Step Functions",
      "categories": [
        "Application Integration"
      ],
      "aliases": [
        "Step Functions"
      ],
      "description": "Managed state-machine workflow orchestration.",
      "useCases": "Coordinate ETL tasks, retries, branching and parallel steps.",
      "components": "States; executions; Amazon States Language; Standard/Express workflows; service integrations.",
      "technical": "Integration patterns include request/response, job completion and callbacks where supported. Standard and Express have different semantics.",
      "considerations": "Use execution roles and explicit retry/catch. Do not put bulk datasets in state payloads; keep references to storage.",
      "choose": "You need managed workflow state without running a scheduler.",
      "alternatives": "MWAA for Airflow DAGs; EventBridge for event routing.",
      "recall": {
        "question": "Where should a large ETL dataset live during a workflow?",
        "answer": "In storage such as S3; pass references between workflow steps."
      },
      "tasks": [
        "1.3",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
        "https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Step Functions"
    },
    {
      "id": "budgets",
      "name": "AWS Budgets",
      "categories": [
        "Cloud Financial Management"
      ],
      "aliases": [
        "Budgets"
      ],
      "description": "Cost and usage budgets with notifications and optional actions.",
      "useCases": "Alert when pipeline spend approaches a planned budget.",
      "components": "Cost/usage budgets; forecasts; notifications; budget actions.",
      "technical": "Budget monitoring is not real-time hard spend enforcement.",
      "considerations": "Scope budgets with filters; authorize actions carefully. Reporting delays mean alerts cannot guarantee zero overspend.",
      "choose": "You need spending thresholds and alerts.",
      "alternatives": "Cost Explorer for investigating historical cost; CloudWatch for operational metrics.",
      "recall": {
        "question": "Is a budget a guaranteed immediate spending cap?",
        "answer": "No. Alerts and actions depend on delayed billing data and configuration."
      },
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Budgets"
    },
    {
      "id": "costexplorer",
      "name": "AWS Cost Explorer",
      "categories": [
        "Cloud Financial Management"
      ],
      "aliases": [
        "Cost Explorer"
      ],
      "description": "Visual analysis of AWS costs and usage.",
      "useCases": "Investigate ingestion, storage and processing spend.",
      "components": "Filters; grouping; forecasts; reports; Cost Explorer API.",
      "technical": "Analyzes billing data rather than per-record application telemetry.",
      "considerations": "Use allocation tags and billing permissions. Data is updated on a billing cadence; API requests can incur charges.",
      "choose": "You need to explain cost trends and identify spend drivers.",
      "alternatives": "Budgets for thresholds; CloudWatch for runtime signals.",
      "recall": {
        "question": "Which tool investigates a monthly service cost trend?",
        "answer": "Cost Explorer."
      },
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Cost Explorer"
    },
    {
      "id": "batch",
      "name": "AWS Batch",
      "categories": [
        "Compute"
      ],
      "aliases": [
        "Batch"
      ],
      "description": "Managed scheduling and provisioning for batch computing jobs.",
      "useCases": "Run containerized batch transformations at scale.",
      "components": "Job definitions; job queues; compute environments; array jobs; dependencies.",
      "technical": "Schedules jobs on supported EC2, Fargate or EKS compute configurations.",
      "considerations": "Set job roles and resource requests; manage retry/idempotency. Capacity and Spot interruptions influence completion time and cost.",
      "choose": "You have independent containerized batch jobs.",
      "alternatives": "Glue for managed ETL; Lambda for brief event functions.",
      "recall": {
        "question": "Which Batch resource holds waiting work?",
        "answer": "A job queue."
      },
      "tasks": [
        "1.2",
        "1.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Batch"
    },
    {
      "id": "ec2",
      "name": "Amazon EC2",
      "categories": [
        "Compute"
      ],
      "aliases": [
        "EC2",
        "Elastic Compute Cloud"
      ],
      "description": "Virtual machines with configurable compute and networking.",
      "useCases": "Host custom data tooling and processing workers.",
      "components": "Instances; AMIs; launch templates; instance types; Auto Scaling integration.",
      "technical": "You manage OS/runtime configuration; persistent block data commonly uses EBS.",
      "considerations": "Patch systems, restrict security groups and use instance roles. Right-size compute and plan purchase/interruption tradeoffs.",
      "choose": "You need OS control or software unsupported by managed runtimes.",
      "alternatives": "Lambda for event functions; EMR for managed big-data frameworks.",
      "recall": {
        "question": "Who manages the operating system on a normal EC2 instance?",
        "answer": "You manage guest OS configuration and maintenance."
      },
      "tasks": [
        "1.2",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon EC2"
    },
    {
      "id": "lambda",
      "name": "AWS Lambda",
      "categories": [
        "Compute"
      ],
      "aliases": [
        "Lambda"
      ],
      "description": "Event-driven functions on managed compute.",
      "useCases": "Validate incoming objects, transform records and automate pipeline steps.",
      "components": "Functions; versions; aliases; layers; event source mappings; concurrency controls.",
      "technical": "Synchronous, asynchronous and polling invocation models differ. It is designed for bounded function execution, not long-running distributed ETL.",
      "considerations": "Scope execution roles; monitor retries and idempotency. Memory/concurrency tuning affects performance and cost.",
      "choose": "You need short event-driven processing without managing servers.",
      "alternatives": "Glue or EMR for large distributed jobs; Batch for container batch compute.",
      "recall": {
        "question": "Why must a stream-processing Lambda be idempotent?",
        "answer": "Retries can process records more than once."
      },
      "tasks": [
        "1.1",
        "1.2",
        "1.4",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Lambda"
    },
    {
      "id": "sam",
      "name": "AWS SAM",
      "categories": [
        "Compute"
      ],
      "aliases": [
        "Serverless Application Model",
        "SAM"
      ],
      "description": "Framework and CLI for serverless infrastructure and development.",
      "useCases": "Package, locally test and deploy serverless pipelines.",
      "components": "SAM templates; transform; SAM CLI; build; deploy; local invoke.",
      "technical": "SAM templates extend CloudFormation; SAM itself is not the runtime executing your data jobs.",
      "considerations": "Review generated IAM permissions and artifact access; manage deployment stages. Runtime resource charges belong to deployed services.",
      "choose": "You need concise infrastructure for a serverless application.",
      "alternatives": "CDK for code-defined infrastructure; CloudFormation for base templates.",
      "recall": {
        "question": "Which service deploys resources transformed from a SAM template?",
        "answer": "CloudFormation."
      },
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS SAM"
    },
    {
      "id": "ecr",
      "name": "Amazon ECR",
      "categories": [
        "Containers"
      ],
      "aliases": [
        "Elastic Container Registry",
        "ECR"
      ],
      "description": "Managed registry for container images.",
      "useCases": "Store versioned images for data processing workloads.",
      "components": "Repositories; image tags/digests; scanning; lifecycle policies.",
      "technical": "Supports OCI/container image workflows; storing an image does not execute it.",
      "considerations": "Limit repository access and scan images; lifecycle cleanup reduces storage costs. Pin digests for reproducibility.",
      "choose": "You need an AWS-integrated container image registry.",
      "alternatives": "ECS/EKS/Batch execute workloads; S3 stores general objects.",
      "recall": {
        "question": "Does pushing an image to ECR run the container?",
        "answer": "No. A compute service must pull and execute it."
      },
      "tasks": [
        "1.2",
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon ECR"
    },
    {
      "id": "ecs",
      "name": "Amazon ECS",
      "categories": [
        "Containers"
      ],
      "aliases": [
        "Elastic Container Service",
        "ECS"
      ],
      "description": "Managed container orchestration.",
      "useCases": "Run containerized ingestion and transformation services.",
      "components": "Task definitions; tasks; services; clusters; capacity providers.",
      "technical": "Runs on EC2 or Fargate and other supported capacity; ECS APIs differ from Kubernetes APIs.",
      "considerations": "Separate execution and task roles. Tune resource requests and scaling; compute/storage charges depend on capacity.",
      "choose": "You want AWS-native orchestration without Kubernetes management.",
      "alternatives": "EKS for Kubernetes; Batch for queued batch jobs.",
      "recall": {
        "question": "What declares an ECS container workload configuration?",
        "answer": "A task definition."
      },
      "tasks": [
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon ECS"
    },
    {
      "id": "eks",
      "name": "Amazon EKS",
      "categories": [
        "Containers"
      ],
      "aliases": [
        "Elastic Kubernetes Service",
        "EKS"
      ],
      "description": "Managed Kubernetes control plane and supporting capabilities.",
      "useCases": "Run Kubernetes-based data processing applications.",
      "components": "Clusters; managed node groups; pods; add-ons; access entries.",
      "technical": "Uses Kubernetes APIs; compute responsibility varies with node and managed compute options.",
      "considerations": "Combine Kubernetes authorization with AWS identities; tune pods and nodes. Control-plane and workload charges are distinct.",
      "choose": "Your workloads require Kubernetes compatibility.",
      "alternatives": "ECS for AWS-native tasks; EMR for managed data frameworks.",
      "recall": {
        "question": "Does a managed control plane remove every workload maintenance task?",
        "answer": "No. You still manage application configuration and applicable compute/add-ons."
      },
      "tasks": [
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon EKS"
    },
    {
      "id": "documentdb",
      "name": "Amazon DocumentDB",
      "categories": [
        "Database"
      ],
      "aliases": [
        "DocumentDB"
      ],
      "description": "Managed document database with MongoDB compatibility.",
      "useCases": "Store and query JSON-like application documents.",
      "components": "Clusters; instances; document collections; indexes; change streams.",
      "technical": "MongoDB-compatible APIs do not guarantee support for all MongoDB features or versions.",
      "considerations": "Use TLS, roles and network controls; tune indexes and instance/storage usage. Check compatibility before migration.",
      "choose": "You need a managed compatible document database.",
      "alternatives": "DynamoDB for key/document access; RDS for relational models.",
      "recall": {
        "question": "Does MongoDB compatibility mean every MongoDB feature is supported?",
        "answer": "No. Check the documented compatibility matrix."
      },
      "tasks": [
        "2.1",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/documentdb/latest/devguide/what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon DocumentDB"
    },
    {
      "id": "dynamodb",
      "name": "Amazon DynamoDB",
      "categories": [
        "Database"
      ],
      "aliases": [
        "DynamoDB",
        "DynamoDB Streams"
      ],
      "description": "Serverless key-value and document database.",
      "useCases": "Serve operational access patterns and capture item changes.",
      "components": "Tables; partition/sort keys; GSIs/LSIs; Streams; TTL; transactions; backups.",
      "technical": "Partition-key design determines distribution. Streams capture item changes; TTL expiration is asynchronous.",
      "considerations": "Avoid hot keys; use conditional writes and suitable consistency. On-demand and provisioned capacity have different cost models.",
      "choose": "You need predictable key-based access at scale.",
      "alternatives": "RDS for relational joins; Redshift for analytical scans.",
      "recall": {
        "question": "Is TTL a precise-time deletion scheduler?",
        "answer": "No. Expired items are removed asynchronously."
      },
      "tasks": [
        "1.1",
        "2.1",
        "2.3",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html",
        "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon DynamoDB"
    },
    {
      "id": "keyspaces",
      "name": "Amazon Keyspaces",
      "categories": [
        "Database"
      ],
      "aliases": [
        "Keyspaces",
        "Apache Cassandra"
      ],
      "description": "Managed Apache Cassandra-compatible wide-column database.",
      "useCases": "Store high-scale workloads using Cassandra-compatible tools.",
      "components": "Keyspaces; tables; partition/clustering keys; capacity modes.",
      "technical": "Supports a documented subset of Cassandra Query Language; it does not require managing Cassandra servers.",
      "considerations": "Design partition keys and choose capacity; use TLS and IAM credentials. Check unsupported Cassandra operations before migration.",
      "choose": "You require managed Cassandra compatibility.",
      "alternatives": "DynamoDB for AWS-native key/value access; RDS for SQL joins.",
      "recall": {
        "question": "Which query language family is used by Keyspaces?",
        "answer": "Cassandra Query Language (CQL), with documented compatibility limits."
      },
      "tasks": [
        "2.1",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Keyspaces"
    },
    {
      "id": "memorydb",
      "name": "Amazon MemoryDB",
      "categories": [
        "Database"
      ],
      "aliases": [
        "Amazon MemoryDB for Redis",
        "MemoryDB for Redis",
        "Redis",
        "Valkey"
      ],
      "description": "Durable in-memory database compatible with supported Redis OSS/Valkey APIs.",
      "useCases": "Serve low-latency operational data with durable storage.",
      "components": "Clusters; shards; replicas; multi-AZ transaction log; ACLs.",
      "technical": "Stores data in memory with a durable transaction log; engine compatibility and features depend on chosen version.",
      "considerations": "Use TLS, ACLs and subnet controls; size memory/shards carefully. It is not a warehouse for large analytical scans.",
      "choose": "You need durable low-latency key/value data.",
      "alternatives": "DynamoDB for managed key/value at scale; Redshift for analytics.",
      "recall": {
        "question": "What distinguishes MemoryDB from a disposable cache?",
        "answer": "Its durable multi-AZ transaction log supports database durability."
      },
      "tasks": [
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/memorydb/latest/devguide/what-is-memorydb.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon MemoryDB for Redis"
    },
    {
      "id": "neptune",
      "name": "Amazon Neptune",
      "categories": [
        "Database"
      ],
      "aliases": [
        "Neptune"
      ],
      "description": "Managed graph database for connected data.",
      "useCases": "Query entity relationships, knowledge graphs and lineage models.",
      "components": "Graph clusters; replicas; property graphs; RDF graphs.",
      "technical": "Supports Gremlin/openCypher for property graphs and SPARQL for RDF; these are different graph models.",
      "considerations": "Use IAM/TLS and VPC controls; index/access-pattern and instance choices affect performance. It is not a relational warehouse.",
      "choose": "Traversals and relationships are central to your data model.",
      "alternatives": "RDS for relational tables; OpenSearch for document search.",
      "recall": {
        "question": "Which Neptune model uses SPARQL?",
        "answer": "RDF graphs."
      },
      "tasks": [
        "2.1",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/neptune/latest/userguide/intro.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Neptune"
    },
    {
      "id": "rds",
      "name": "Amazon RDS",
      "categories": [
        "Database"
      ],
      "aliases": [
        "RDS",
        "Relational Database Service"
      ],
      "description": "Managed relational databases with engine-specific capabilities.",
      "useCases": "Store transactional source data for analytics and CDC.",
      "components": "DB instances; backups; Multi-AZ deployments; read replicas; parameter groups.",
      "technical": "SQL and interfaces depend on engine. Redshift federation supports RDS PostgreSQL and MySQL, not every RDS engine.",
      "considerations": "Secure credentials/network paths; choose replicas vs availability deployments deliberately. Source analytics can add transactional load.",
      "choose": "You need a managed relational operational database.",
      "alternatives": "Redshift for OLAP; Aurora for compatible cloud-native relational clusters.",
      "recall": {
        "question": "Does Redshift federation work with every RDS engine?",
        "answer": "No. The documented RDS engines are PostgreSQL and MySQL."
      },
      "tasks": [
        "1.1",
        "2.1",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon RDS"
    },
    {
      "id": "aurora",
      "name": "Amazon Aurora",
      "categories": [
        "Database"
      ],
      "aliases": [
        "Aurora",
        "Aurora PostgreSQL",
        "Aurora MySQL"
      ],
      "description": "Managed relational cluster with MySQL/PostgreSQL-compatible editions.",
      "useCases": "Operate transactional sources and integrate with analytics.",
      "components": "Cluster storage; writer/reader endpoints; replicas; Serverless capacity options.",
      "technical": "Compatibility, version and feature availability vary by engine and Region. Aurora is distinct from a generic RDS DB instance.",
      "considerations": "Manage endpoints, credentials and query load. Consider capacity and I/O pricing; test supported versions before selecting an integration.",
      "choose": "You need compatible relational workloads with Aurora cluster features.",
      "alternatives": "RDS for other engines; Redshift for analytics.",
      "recall": {
        "question": "Which Aurora editions support Redshift federated queries?",
        "answer": "Aurora PostgreSQL-Compatible and Aurora MySQL-Compatible editions."
      },
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Aurora"
    },
    {
      "id": "redshift",
      "name": "Amazon Redshift",
      "categories": [
        "Database"
      ],
      "aliases": [
        "Redshift",
        "Redshift Spectrum"
      ],
      "description": "Managed analytical SQL warehouse.",
      "useCases": "Run warehouse analytics, lake queries and supported operational federation.",
      "components": "Provisioned clusters; Serverless workgroups; distribution/sort keys; materialized views; Spectrum; COPY; UNLOAD; federated queries.",
      "technical": "Spectrum reads S3 external tables. COPY loads warehouse tables; UNLOAD writes query results to S3. Federation reads supported PostgreSQL/MySQL sources.",
      "considerations": "Use roles and encryption; tune data layout and workload management. External scans and remote database load have separate tradeoffs.",
      "choose": "You need analytical SQL joins across warehouse and external datasets.",
      "alternatives": "Athena for lake SQL; RDS for transactional writes.",
      "recall": {
        "question": "Which mechanism queries S3 without loading Redshift tables?",
        "answer": "Redshift Spectrum. COPY loads tables; UNLOAD exports results."
      },
      "tasks": [
        "1.1",
        "1.2",
        "2.1",
        "2.3",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-external-tables.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Redshift"
    },
    {
      "id": "cli",
      "name": "AWS CLI",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "Command Line Interface",
        "CLI"
      ],
      "description": "Command-line interface for AWS service APIs.",
      "useCases": "Script deployments, transfers and operational checks.",
      "components": "Profiles; commands; pagination; output formatting; credential provider chain.",
      "technical": "CLI commands invoke service APIs; shell scripts must handle failures, pagination and retries.",
      "considerations": "Prefer temporary role credentials; do not embed secrets. API and resource charges apply to invoked operations.",
      "choose": "You need repeatable service operations from a shell.",
      "alternatives": "SDKs for application code; CloudFormation/CDK for declarative infrastructure.",
      "recall": {
        "question": "Is AWS CLI a separate data processing runtime?",
        "answer": "No. It calls AWS service APIs."
      },
      "tasks": [
        "1.4",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CLI"
    },
    {
      "id": "cloudformation",
      "name": "AWS CloudFormation",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "CloudFormation",
        "CFN"
      ],
      "description": "Declarative infrastructure provisioning using templates.",
      "useCases": "Deploy repeatable data platform infrastructure.",
      "components": "Stacks; templates; change sets; drift detection; StackSets.",
      "technical": "JSON/YAML templates describe resources; updates follow dependency and replacement rules.",
      "considerations": "Review change sets and IAM; replacement can affect stateful stores. Templates do not execute ETL transformations.",
      "choose": "You need reproducible infrastructure with managed stack state.",
      "alternatives": "CDK generates templates; SAM adds serverless abstractions.",
      "recall": {
        "question": "What previews changes before a stack update?",
        "answer": "A change set."
      },
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CloudFormation"
    },
    {
      "id": "cdk",
      "name": "AWS CDK",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "Cloud Development Kit",
        "CDK"
      ],
      "description": "Define cloud infrastructure using programming languages.",
      "useCases": "Reuse constructs to deploy data platforms.",
      "components": "Apps; stacks; constructs; synthesis; bootstrap resources.",
      "technical": "Synthesizes CloudFormation templates; application-language code describes infrastructure rather than processing data at deployment time.",
      "considerations": "Review synthesized resources and permissions; protect bootstrap assets. Runtime costs belong to provisioned services.",
      "choose": "You want code-based reusable infrastructure abstractions.",
      "alternatives": "CloudFormation for direct templates; SAM for serverless specialization.",
      "recall": {
        "question": "What does CDK synthesize for deployment?",
        "answer": "CloudFormation templates."
      },
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/cdk/v2/guide/home.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CDK"
    },
    {
      "id": "codebuild",
      "name": "AWS CodeBuild",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "CodeBuild"
      ],
      "description": "Managed build and test execution.",
      "useCases": "Validate and package pipeline code and containers.",
      "components": "Build projects; buildspec; build environments; artifacts; caches.",
      "technical": "Buildspec commands execute in a configured environment; artifacts can be passed to delivery pipelines.",
      "considerations": "Limit build roles and secret exposure; cache carefully. Compute duration and environment choice affect costs.",
      "choose": "You need managed CI builds without operating build servers.",
      "alternatives": "CodePipeline coordinates stages; CodeDeploy deploys applications.",
      "recall": {
        "question": "What file defines CodeBuild build commands?",
        "answer": "A buildspec file."
      },
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CodeBuild"
    },
    {
      "id": "codedeploy",
      "name": "AWS CodeDeploy",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "CodeDeploy"
      ],
      "description": "Managed application deployment automation.",
      "useCases": "Release processing applications onto supported compute.",
      "components": "Applications; deployment groups; AppSpec; deployment configurations.",
      "technical": "Deployment workflows differ for EC2/on-premises, Lambda and ECS. It does not define every infrastructure resource.",
      "considerations": "Use service roles and rollback/health checks; release strategy affects availability. Target compute costs still apply.",
      "choose": "You need controlled application deployments and rollback.",
      "alternatives": "CloudFormation for infrastructure; CodeBuild for packaging.",
      "recall": {
        "question": "Does CodeDeploy replace infrastructure templates?",
        "answer": "No. It automates supported application deployments."
      },
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CodeDeploy"
    },
    {
      "id": "codepipeline",
      "name": "AWS CodePipeline",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "CodePipeline"
      ],
      "description": "Managed continuous delivery stage orchestration.",
      "useCases": "Connect source, build, test and deployment steps.",
      "components": "Pipelines; stages; actions; artifacts; approvals.",
      "technical": "Actions invoke integrated tools; CodePipeline is distinct from a data ETL workflow runtime.",
      "considerations": "Secure artifact stores and action roles. Trigger/stage design and pipeline type affect release behavior and cost.",
      "choose": "You need CI/CD coordination for data platform code.",
      "alternatives": "Step Functions/MWAA for runtime data workflows; CodeBuild for builds.",
      "recall": {
        "question": "Is CodePipeline the same as a production ETL scheduler?",
        "answer": "No. It primarily orchestrates software delivery."
      },
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CodePipeline"
    },
    {
      "id": "q",
      "name": "Amazon Q",
      "categories": [
        "Developer Tools"
      ],
      "aliases": [
        "Amazon Q Developer",
        "Amazon Q Business"
      ],
      "description": "AWS generative assistants with product-specific capabilities.",
      "useCases": "Assist development and answer questions over configured business content.",
      "components": "Q Developer assistance; Q Business applications; connectors; retrievers.",
      "technical": "The scope uses umbrella name Amazon Q; Developer and Business have different setup, data access and purposes.",
      "considerations": "Review generated code and enforce identity/access for indexed content. Q Business is closed to new customers; Q Developer IDE plugins have a published support-end notice. Check current product availability.",
      "choose": "You need an assistant for supported developer or business workflows.",
      "alternatives": "Bedrock for building custom foundation-model applications; Kendra for enterprise retrieval.",
      "recall": {
        "question": "Are Q Developer and Q Business interchangeable configurations?",
        "answer": "No. They are distinct products under the Amazon Q name."
      },
      "tasks": [
        "1.4",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html",
        "https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Q"
    },
    {
      "id": "apigateway",
      "name": "Amazon API Gateway",
      "categories": [
        "Web and Mobile"
      ],
      "aliases": [
        "API Gateway"
      ],
      "description": "Managed frontend for APIs.",
      "useCases": "Expose ingestion endpoints and data APIs.",
      "components": "REST APIs; HTTP APIs; WebSocket APIs; integrations; authorizers.",
      "technical": "Features and authorization differ by API type; requests are routed to configured backends.",
      "considerations": "Authenticate callers, throttle and validate where supported. Payload and timeout constraints require careful API design.",
      "choose": "You need managed API access to processing services.",
      "alternatives": "AppFlow for supported SaaS ingestion; direct service SDKs for internal access.",
      "recall": {
        "question": "Does API Gateway store the complete analytics dataset?",
        "answer": "No. Backends handle processing and persistence."
      },
      "tasks": [
        "1.1",
        "1.2",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon API Gateway"
    },
    {
      "id": "bedrock",
      "name": "Amazon Bedrock",
      "categories": [
        "Machine Learning"
      ],
      "aliases": [
        "Bedrock"
      ],
      "description": "Managed foundation-model APIs and application capabilities.",
      "useCases": "Enrich data with model outputs and build retrieval workflows.",
      "components": "Models; inference APIs; Knowledge Bases; Agents; Guardrails.",
      "technical": "Knowledge Bases retrieve from configured sources/vector stores; model/Region support varies.",
      "considerations": "Protect source data and validate generated output; inference/token costs matter. Model output is not guaranteed factual.",
      "choose": "You need managed foundation-model access for a data application.",
      "alternatives": "SageMaker for customizable ML workflows; Kendra for enterprise search.",
      "recall": {
        "question": "Should model-generated data be accepted without validation?",
        "answer": "No. Apply data quality and grounded-source checks."
      },
      "tasks": [
        "1.2",
        "2.4",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
        "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Bedrock"
    },
    {
      "id": "kendra",
      "name": "Amazon Kendra",
      "categories": [
        "Machine Learning"
      ],
      "aliases": [
        "Kendra"
      ],
      "description": "Managed enterprise search and retrieval.",
      "useCases": "Index supported enterprise sources for natural-language search.",
      "components": "Indexes; data sources; connectors; relevance tuning; access control.",
      "technical": "Connectors ingest documents and supported permissions; it is a search service rather than SQL analytics.",
      "considerations": "Preserve document ACLs and monitor syncs; indexing/query capacity affects cost. Kendra is closed to new customers; existing customers should verify connector support.",
      "choose": "You need enterprise document retrieval.",
      "alternatives": "OpenSearch for configurable search engines; Bedrock for model application building.",
      "recall": {
        "question": "What must be preserved when indexing private enterprise documents?",
        "answer": "Document-level access permissions."
      },
      "tasks": [
        "3.2",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Kendra"
    },
    {
      "id": "cloudtrail",
      "name": "AWS CloudTrail",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "CloudTrail"
      ],
      "description": "Records AWS account activity and API events.",
      "useCases": "Audit changes and data access where event recording is enabled.",
      "components": "Event history; trails; data events; CloudTrail Lake.",
      "technical": "Management and data events are distinct; data events require appropriate configuration and incur charges.",
      "considerations": "Protect log buckets and keys; choose selectors deliberately. It is not a replacement for application performance metrics.",
      "choose": "You need an audit trail of AWS actions.",
      "alternatives": "CloudWatch for operational metrics/logs; Config for resource configuration history.",
      "recall": {
        "question": "Are all S3 object-level events recorded by default event history?",
        "answer": "No. Configure relevant data event recording."
      },
      "tasks": [
        "4.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
        "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS CloudTrail"
    },
    {
      "id": "cloudwatch",
      "name": "Amazon CloudWatch",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "CloudWatch"
      ],
      "description": "Monitoring and observability for AWS resources and applications.",
      "useCases": "Track pipeline health, latency, errors and resource usage.",
      "components": "Metrics; alarms; dashboards; anomaly detection.",
      "technical": "Alarms evaluate configured metrics, periods and missing-data behavior; logging is a separately listed scope feature.",
      "considerations": "Choose actionable thresholds and least privilege. Custom metrics and high-volume telemetry add costs.",
      "choose": "You need operational signals and alerts.",
      "alternatives": "CloudTrail for API auditing; Cost Explorer for billing analysis.",
      "recall": {
        "question": "What should a pipeline alarm detect?",
        "answer": "A useful operational condition such as errors or consumer lag."
      },
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon CloudWatch"
    },
    {
      "id": "logs",
      "name": "Amazon CloudWatch Logs",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "CloudWatch Logs",
        "Logs Insights"
      ],
      "description": "Managed collection, retention and query of logs.",
      "useCases": "Investigate ETL failures and search runtime logs.",
      "components": "Log groups; streams; retention; Logs Insights; subscription filters; metric filters.",
      "technical": "Logs can be queried or streamed to supported destinations; logs and metrics are different data types.",
      "considerations": "Set retention and protect sensitive fields; ingestion, retention and query scanning drive costs.",
      "choose": "You need searchable runtime logs and forwarding.",
      "alternatives": "CloudTrail for AWS API audit events; S3 for long-term log archives.",
      "recall": {
        "question": "What prevents logs from accumulating indefinitely?",
        "answer": "An appropriate log-group retention policy."
      },
      "tasks": [
        "3.3",
        "4.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html",
        "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon CloudWatch Logs"
    },
    {
      "id": "config",
      "name": "AWS Config",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "Config"
      ],
      "description": "Records resource configurations and evaluates compliance rules.",
      "useCases": "Detect configuration drift and governance violations.",
      "components": "Configuration recorder; configuration items; rules; aggregators; remediation.",
      "technical": "Evaluates supported resource configuration; it does not inspect every dataset row for quality.",
      "considerations": "Scope recording and rules; secure delivery access. Resource/rule evaluations incur charges.",
      "choose": "You need configuration history and compliance evaluation.",
      "alternatives": "CloudTrail for action history; Glue Data Quality for dataset rules.",
      "recall": {
        "question": "Can a Config rule replace data-quality checks on table rows?",
        "answer": "No. Config focuses on resource configuration."
      },
      "tasks": [
        "3.3",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Config"
    },
    {
      "id": "grafana",
      "name": "Amazon Managed Grafana",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "Managed Grafana",
        "Grafana"
      ],
      "description": "Managed Grafana workspaces for visualization.",
      "useCases": "Display operational telemetry across supported sources.",
      "components": "Workspaces; dashboards; data sources; user roles.",
      "technical": "Queries configured data sources rather than storing all source telemetry itself.",
      "considerations": "Control workspace users and data-source roles. Licensing and source queries affect cost.",
      "choose": "You need Grafana dashboards for operational observability.",
      "alternatives": "QuickSight for business BI; CloudWatch for native alarms.",
      "recall": {
        "question": "Does a Grafana dashboard replace its underlying metrics store?",
        "answer": "No. It queries configured data sources."
      },
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Managed Grafana"
    },
    {
      "id": "systemsmanager",
      "name": "AWS Systems Manager",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "Systems Manager",
        "SSM"
      ],
      "description": "Operations management for resources and applications.",
      "useCases": "Automate maintenance and manage pipeline configuration.",
      "components": "Parameter Store; Run Command; Automation; Session Manager; Patch Manager.",
      "technical": "Capabilities have different resource/agent prerequisites; Parameter Store supports configuration and secure strings.",
      "considerations": "Limit command/session permissions and use KMS where relevant. Agent coverage and parameter tiers affect operations/cost.",
      "choose": "You need managed operations or configuration parameters.",
      "alternatives": "Secrets Manager for secret rotation; Step Functions for data workflows.",
      "recall": {
        "question": "Which Systems Manager capability stores configuration parameters?",
        "answer": "Parameter Store."
      },
      "tasks": [
        "3.1",
        "3.3",
        "4.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Systems Manager"
    },
    {
      "id": "wellarchitected",
      "name": "AWS Well-Architected Tool",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "Well-Architected Tool"
      ],
      "description": "Tool to review workloads against architectural best practices.",
      "useCases": "Assess reliability, security, cost and operational tradeoffs.",
      "components": "Workloads; lenses; questions; milestones; improvement plans.",
      "technical": "A review records design decisions; it does not automatically change every resource or validate every dataset.",
      "considerations": "Limit workload-sharing access. Prioritize improvements using evidence from the actual architecture.",
      "choose": "You need structured architecture assessment.",
      "alternatives": "Config for automated resource rules; CloudWatch for runtime evidence.",
      "recall": {
        "question": "Does completing a review automatically fix workload risks?",
        "answer": "No. Teams implement the identified improvements."
      },
      "tasks": [
        "3.3",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/wellarchitected/latest/userguide/tool.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Well-Architected Tool"
    },
    {
      "id": "dataexchange",
      "name": "AWS Data Exchange",
      "categories": [
        "Management and Governance"
      ],
      "aliases": [
        "Data Exchange"
      ],
      "description": "Service for subscribing to and distributing third-party data.",
      "useCases": "Consume licensed external datasets in analytics workflows.",
      "components": "Products; subscriptions; datasets; revisions; assets; entitlement.",
      "technical": "Delivery modes include file assets and supported API, S3 and Redshift data products.",
      "considerations": "Respect licenses and entitlement periods; validate provenance/quality. Provider pricing and downstream processing costs are distinct.",
      "choose": "You need governed access to third-party data products.",
      "alternatives": "AppFlow for your SaaS data; S3 for your own objects.",
      "recall": {
        "question": "What must be checked before using a subscribed dataset?",
        "answer": "Its license, entitlements and data quality."
      },
      "tasks": [
        "1.1",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Data Exchange"
    },
    {
      "id": "discovery",
      "name": "AWS Application Discovery Service",
      "categories": [
        "Migration and Transfer"
      ],
      "aliases": [
        "Application Discovery Service"
      ],
      "description": "Collects information about on-premises applications for migration planning.",
      "useCases": "Assess server dependencies before moving data workloads.",
      "components": "Discovery agents; agentless discovery; configuration/dependency data.",
      "technical": "Discovery gathers planning metadata rather than replicating database tables.",
      "considerations": "Secure collected infrastructure details; Application Discovery Service is closed to new customers; AWS points new customers to AWS Transform. Discovery is not the data-transfer mechanism.",
      "choose": "You need inventory and dependencies for migration planning.",
      "alternatives": "Application Migration Service for server replication; DMS for databases.",
      "recall": {
        "question": "Does discovery perform database CDC?",
        "answer": "No. It collects migration planning information."
      },
      "tasks": [
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/application-discovery/latest/userguide/what-is-appdiscovery.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Application Discovery Service"
    },
    {
      "id": "mgn",
      "name": "AWS Application Migration Service",
      "categories": [
        "Migration and Transfer"
      ],
      "aliases": [
        "Application Migration Service",
        "MGN",
        "AWS Transform MGN"
      ],
      "description": "Lift-and-shift migration of servers to AWS; current documentation calls this AWS Transform MGN.",
      "useCases": "Move existing servers hosting data applications.",
      "components": "Replication agent; staging area; test launches; cutover.",
      "technical": "Replicates server disks for migration; it is distinct from table-level database CDC.",
      "considerations": "Authorize replication and secure staging networks; test before cutover. Replication and target infrastructure incur costs.",
      "choose": "You need server migration with limited application redesign.",
      "alternatives": "DMS for database-level migration; DataSync for files.",
      "recall": {
        "question": "Does MGN transform relational schemas into a warehouse model?",
        "answer": "No. It migrates servers rather than redesigning database schemas."
      },
      "tasks": [
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Application Migration Service"
    },
    {
      "id": "dms",
      "name": "AWS DMS",
      "categories": [
        "Migration and Transfer"
      ],
      "aliases": [
        "Database Migration Service",
        "DMS"
      ],
      "description": "Managed database migration and ongoing replication.",
      "useCases": "Full-load source data and capture ongoing changes.",
      "components": "Replication tasks; endpoints; replication instances/serverless; schema conversion.",
      "technical": "Source/target support and CDC prerequisites are engine-specific. S3 targets support CSV/Parquet with configuration restrictions.",
      "considerations": "Enable required source logs and permissions; monitor replication lag. DMS does not replace all schema or business transformations.",
      "choose": "You need database migration or CDC into analytics storage.",
      "alternatives": "DataSync for files; Glue for broader transformations.",
      "recall": {
        "question": "What must be verified before enabling CDC?",
        "answer": "Source-engine logging, privileges and supported endpoint configuration."
      },
      "tasks": [
        "1.1",
        "2.1",
        "2.4",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
        "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html",
        "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redshift.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS DMS"
    },
    {
      "id": "datasync",
      "name": "AWS DataSync",
      "categories": [
        "Migration and Transfer"
      ],
      "aliases": [
        "DataSync"
      ],
      "description": "Managed online file and object transfer.",
      "useCases": "Move data between supported storage locations.",
      "components": "Agents where required; locations; tasks; verification; scheduling.",
      "technical": "Supports configured storage protocols and destinations; it is not transaction-log database CDC.",
      "considerations": "Control location roles/network paths; select verification and overwrite behavior. Transfer and storage requests affect cost.",
      "choose": "You need accelerated scheduled file/object copying.",
      "alternatives": "DMS for database CDC; Transfer Family for client protocols.",
      "recall": {
        "question": "Does DataSync understand each relational transaction?",
        "answer": "No. It transfers files and objects rather than database change logs."
      },
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS DataSync"
    },
    {
      "id": "snow",
      "name": "AWS Snow Family",
      "categories": [
        "Migration and Transfer"
      ],
      "aliases": [
        "Snowball",
        "Snowball Edge",
        "Snowcone",
        "Snowmobile"
      ],
      "description": "Physical-device family historically used for offline data transfer and edge processing.",
      "useCases": "Recognize offline migration scenarios in the listed exam scope.",
      "components": "Snow device jobs; local interfaces; storage/compute device capabilities.",
      "technical": "The scope retains Snow Family. Current documentation restricts availability; Snowball Edge is limited to existing customers.",
      "considerations": "Physical custody and encryption matter. Verify ordering eligibility and current alternatives rather than assuming new jobs are available.",
      "choose": "An eligible existing workflow requires offline device transfer.",
      "alternatives": "DataSync for online transfer; current migration alternatives for new customers.",
      "recall": {
        "question": "Should a new customer assume Snowball Edge can be ordered?",
        "answer": "No. Check current availability; documentation restricts it to existing customers."
      },
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/snowball/latest/developer-guide/doc-history.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Snow Family"
    },
    {
      "id": "transfer",
      "name": "AWS Transfer Family",
      "categories": [
        "Migration and Transfer"
      ],
      "aliases": [
        "Transfer Family",
        "SFTP"
      ],
      "description": "Managed file transfer interfaces.",
      "useCases": "Receive partner files into AWS storage.",
      "components": "SFTP/FTPS/FTP servers; AS2; connectors; managed workflows.",
      "technical": "Storage backend and features depend on protocol; S3/EFS are supported for appropriate server configurations.",
      "considerations": "Manage identities, SSH keys and least-privilege paths; protocol/server and transfer charges apply.",
      "choose": "Partners require established file-transfer protocols.",
      "alternatives": "DataSync for storage-to-storage copying; AppFlow for SaaS connectors.",
      "recall": {
        "question": "Which choice fits a partner that uploads files using SFTP?",
        "answer": "An appropriately configured AWS Transfer Family server."
      },
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Transfer Family"
    },
    {
      "id": "cloudfront",
      "name": "Amazon CloudFront",
      "categories": [
        "Networking and Content Delivery"
      ],
      "aliases": [
        "CloudFront"
      ],
      "description": "Content delivery network with edge caching.",
      "useCases": "Distribute data applications and static outputs.",
      "components": "Distributions; origins; cache behaviors; invalidations; signed URLs/cookies.",
      "technical": "Caches origin responses; it is not an ETL engine or lake catalog.",
      "considerations": "Protect origins and authorize private content; cache keys and TTL affect correctness, latency and transfer cost.",
      "choose": "You need low-latency delivery of web content.",
      "alternatives": "S3 for origin object storage; API Gateway for API frontend.",
      "recall": {
        "question": "Can caching be ignored for frequently changing results?",
        "answer": "No. Choose cache policy and invalidation behavior to avoid stale responses."
      },
      "tasks": [
        "3.1",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon CloudFront"
    },
    {
      "id": "privatelink",
      "name": "AWS PrivateLink",
      "categories": [
        "Networking and Content Delivery"
      ],
      "aliases": [
        "PrivateLink",
        "VPC endpoint service"
      ],
      "description": "Private connectivity to supported services without public internet paths.",
      "useCases": "Reach supported data APIs privately from a VPC.",
      "components": "Interface endpoints; endpoint services; endpoint policies where supported.",
      "technical": "PrivateLink is not a universal replacement for all VPC routing; S3 gateway endpoints are a separate endpoint type.",
      "considerations": "Check service/Region and DNS support. Endpoint hours and data processing affect costs; IAM still controls authorization.",
      "choose": "You need private access to a supported service endpoint.",
      "alternatives": "Gateway endpoints for supported S3/DynamoDB access; peering for VPC routing needs.",
      "recall": {
        "question": "Does private connectivity automatically authorize API calls?",
        "answer": "No. Authentication and authorization are still required."
      },
      "tasks": [
        "4.1",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS PrivateLink"
    },
    {
      "id": "route53",
      "name": "Amazon Route 53",
      "categories": [
        "Networking and Content Delivery"
      ],
      "aliases": [
        "Route 53",
        "DNS"
      ],
      "description": "Managed DNS and routing capabilities.",
      "useCases": "Resolve data application endpoints and route clients.",
      "components": "Hosted zones; records; routing policies; health checks; Resolver.",
      "technical": "DNS resolution maps names to destinations; it does not move ETL records itself.",
      "considerations": "Protect zone changes and choose TTL/routing policies; query/zone/resolver costs differ.",
      "choose": "You need DNS naming and routing for endpoints.",
      "alternatives": "VPC for network isolation; CloudFront for content caching.",
      "recall": {
        "question": "Does Route 53 transform a dataset?",
        "answer": "No. It provides DNS and related routing capabilities."
      },
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Route 53"
    },
    {
      "id": "vpc",
      "name": "Amazon VPC",
      "categories": [
        "Networking and Content Delivery"
      ],
      "aliases": [
        "Virtual Private Cloud",
        "VPC"
      ],
      "description": "Logically isolated AWS networking.",
      "useCases": "Control connectivity for databases and processing runtimes.",
      "components": "Subnets; route tables; security groups; network ACLs; endpoints; NAT gateways.",
      "technical": "Security groups are stateful; network ACLs are stateless. Private subnets need an appropriate route/endpoint to reach services.",
      "considerations": "Use least-open network rules; evaluate NAT and transfer costs. Network permission does not replace IAM or database authorization.",
      "choose": "You need defined network boundaries and paths.",
      "alternatives": "PrivateLink for supported private service access; IAM for identity authorization.",
      "recall": {
        "question": "Does a security group grant database SQL privileges?",
        "answer": "No. Database authentication and grants remain separate."
      },
      "tasks": [
        "1.1",
        "4.1",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon VPC"
    },
    {
      "id": "iam",
      "name": "AWS Identity and Access Management",
      "categories": [
        "Security, Identity, and Compliance"
      ],
      "aliases": [
        "IAM",
        "Identity and Access Management"
      ],
      "description": "Identity and permission controls for AWS APIs and resources.",
      "useCases": "Authorize pipeline roles and dataset access.",
      "components": "Users; roles; policies; trust policies; temporary sessions; conditions.",
      "technical": "Identity/resource policies and explicit denies determine access; assuming a role requires an appropriate trust relationship.",
      "considerations": "Prefer temporary roles and least privilege. IAM permissions do not replace network connectivity or database grants.",
      "choose": "You need AWS identity-based authorization.",
      "alternatives": "Lake Formation for lake grants; Secrets Manager for credential storage.",
      "recall": {
        "question": "What is the difference between a role trust policy and permission policy?",
        "answer": "Trust defines who can assume the role; permissions define allowed actions."
      },
      "tasks": [
        "4.1",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "IAM"
    },
    {
      "id": "kms",
      "name": "AWS KMS",
      "categories": [
        "Security, Identity, and Compliance"
      ],
      "aliases": [
        "Key Management Service",
        "KMS"
      ],
      "description": "Managed cryptographic keys and encryption operations.",
      "useCases": "Protect stored datasets and control key use.",
      "components": "KMS keys; key policies; grants; aliases; rotation.",
      "technical": "Services commonly use envelope encryption; data access and permission to use the key are separate checks.",
      "considerations": "Scope key policy and IAM; plan rotation and recovery. Key and API charges apply; encryption does not mask query results.",
      "choose": "You need managed keys integrated with storage/processing services.",
      "alternatives": "Macie for discovery; application/Lake Formation controls for masking/filtering.",
      "recall": {
        "question": "Is S3 read permission always enough to read SSE-KMS data?",
        "answer": "No. Required KMS decrypt permissions must also be granted."
      },
      "tasks": [
        "4.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS KMS"
    },
    {
      "id": "macie",
      "name": "Amazon Macie",
      "categories": [
        "Security, Identity, and Compliance"
      ],
      "aliases": [
        "Macie"
      ],
      "description": "Discovers sensitive data and assesses security posture in S3.",
      "useCases": "Identify exposed buckets and sensitive data in supported objects.",
      "components": "Discovery jobs; managed/custom data identifiers; findings; automated discovery.",
      "technical": "Inspects supported S3 data formats; findings do not themselves rewrite or remove sensitive data.",
      "considerations": "Authorize inspection and review findings; scanned data volume affects cost. Unsupported/encrypted access conditions can prevent analysis.",
      "choose": "You need sensitive-data discovery in S3.",
      "alternatives": "Glue Data Quality for dataset rules; KMS for encryption.",
      "recall": {
        "question": "Does a Macie finding automatically redact the source file?",
        "answer": "No. Remediation must be designed separately."
      },
      "tasks": [
        "4.3",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon Macie"
    },
    {
      "id": "secrets",
      "name": "AWS Secrets Manager",
      "categories": [
        "Security, Identity, and Compliance"
      ],
      "aliases": [
        "Secrets Manager"
      ],
      "description": "Managed storage and rotation of secrets.",
      "useCases": "Supply database credentials to pipelines and federation.",
      "components": "Secrets; versions; staging labels; rotation workflows.",
      "technical": "Applications retrieve secrets via APIs; rotation support/configuration depends on the target system.",
      "considerations": "Use least privilege and KMS; avoid logging secret values. Storage and retrieval have costs; rotation must be tested.",
      "choose": "You need secure credential retrieval and rotation.",
      "alternatives": "Systems Manager Parameter Store for configuration; IAM roles for AWS API identity.",
      "recall": {
        "question": "Where should database passwords used by federation be stored?",
        "answer": "In Secrets Manager with restricted access."
      },
      "tasks": [
        "4.1",
        "4.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Secrets Manager"
    },
    {
      "id": "shield",
      "name": "AWS Shield",
      "categories": [
        "Security, Identity, and Compliance"
      ],
      "aliases": [
        "Shield"
      ],
      "description": "Managed protection against distributed denial-of-service attacks.",
      "useCases": "Protect externally reachable data applications.",
      "components": "Shield Standard; Shield Advanced; protected resources.",
      "technical": "DDoS protection is distinct from SQL authorization or sensitive-data classification.",
      "considerations": "Review protected resource eligibility and Advanced pricing/support requirements. It does not replace IAM or application controls.",
      "choose": "You need DDoS protection for eligible endpoints.",
      "alternatives": "WAF for application request rules; IAM for API permissions.",
      "recall": {
        "question": "Does Shield grant access to an S3 dataset?",
        "answer": "No. It protects against DDoS; authorization is separate."
      },
      "tasks": [
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Shield"
    },
    {
      "id": "waf",
      "name": "AWS WAF",
      "categories": [
        "Security, Identity, and Compliance"
      ],
      "aliases": [
        "Web Application Firewall",
        "WAF"
      ],
      "description": "Filters web requests on supported application endpoints.",
      "useCases": "Protect ingestion APIs and data web applications.",
      "components": "Web ACLs; rules; rule groups; managed rules; rate-based rules.",
      "technical": "Evaluates HTTP requests on supported resources; feature availability differs by endpoint type.",
      "considerations": "Tune rules to avoid blocking valid ingestion; request/rule charges apply. WAF is not row-level database access control.",
      "choose": "You need web request filtering.",
      "alternatives": "Shield for DDoS protection; IAM for AWS API authorization.",
      "recall": {
        "question": "Does WAF mask sensitive columns in Athena results?",
        "answer": "No. It filters web requests rather than dataset columns."
      },
      "tasks": [
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS WAF"
    },
    {
      "id": "backup",
      "name": "AWS Backup",
      "categories": [
        "Storage"
      ],
      "aliases": [
        "Backup"
      ],
      "description": "Central backup management across supported AWS resources.",
      "useCases": "Apply recovery policies to data stores.",
      "components": "Backup plans; vaults; recovery points; restore jobs; Vault Lock.",
      "technical": "Resource support and restore behavior vary; a backup is distinct from continuous replication.",
      "considerations": "Restrict vault access and test restores. Retention, cross-Region copies and storage tiers affect costs.",
      "choose": "You need centrally managed recovery policies.",
      "alternatives": "S3 versioning for object history; DMS for ongoing replication.",
      "recall": {
        "question": "Why must restore tests accompany a backup plan?",
        "answer": "To verify recoverability and required restore procedures."
      },
      "tasks": [
        "2.3",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "AWS Backup"
    },
    {
      "id": "ebs",
      "name": "Amazon EBS",
      "categories": [
        "Storage"
      ],
      "aliases": [
        "Elastic Block Store",
        "EBS"
      ],
      "description": "Persistent block storage for EC2 workloads.",
      "useCases": "Store filesystem/database data for processing instances.",
      "components": "Volumes; volume types; snapshots; provisioned IOPS.",
      "technical": "Volumes attach to compatible EC2 configurations in an Availability Zone; block storage is not an S3 object interface.",
      "considerations": "Encrypt and protect snapshots; choose IOPS/throughput/size deliberately. Attached capacity is charged even when underused.",
      "choose": "An EC2 workload needs persistent block storage.",
      "alternatives": "EFS for shared files; S3 for objects.",
      "recall": {
        "question": "Which storage model does EBS expose?",
        "answer": "Block storage, typically used by an instance filesystem."
      },
      "tasks": [
        "2.1",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon EBS"
    },
    {
      "id": "efs",
      "name": "Amazon EFS",
      "categories": [
        "Storage"
      ],
      "aliases": [
        "Elastic File System",
        "EFS"
      ],
      "description": "Managed elastic shared file storage.",
      "useCases": "Share POSIX files across supported compute clients.",
      "components": "File systems; mount targets; access points; lifecycle storage classes.",
      "technical": "Uses NFS interfaces; networking and mount permissions are required. It is distinct from block/object storage.",
      "considerations": "Use encryption/access points and suitable throughput mode. File access patterns and tiers affect cost/performance.",
      "choose": "Multiple compute clients need shared file semantics.",
      "alternatives": "EBS for block devices; S3 for object lakes.",
      "recall": {
        "question": "Why use EFS rather than S3 for a shared POSIX filesystem?",
        "answer": "EFS provides file/NFS semantics while S3 exposes object APIs."
      },
      "tasks": [
        "2.1",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon EFS"
    },
    {
      "id": "s3",
      "name": "Amazon S3",
      "categories": [
        "Storage"
      ],
      "aliases": [
        "Simple Storage Service",
        "S3"
      ],
      "description": "Object storage used as a durable foundation for data lakes.",
      "useCases": "Land raw data, store curated columnar files and exchange batch datasets.",
      "components": "Buckets; objects; keys; versioning; Lifecycle; storage classes; events; access points.",
      "technical": "Access through object APIs; it is not a POSIX filesystem. Analytics table metadata is provided separately by catalogs/table formats.",
      "considerations": "Use Block Public Access, policies and encryption. Partitioning, compression, requests and storage tiers influence cost.",
      "choose": "You need scalable lake/object storage separate from compute.",
      "alternatives": "EFS for shared files; EBS for blocks; S3 Tables for managed Iceberg table storage.",
      "recall": {
        "question": "Does placing Parquet in S3 automatically create a catalog table?",
        "answer": "No. Define or discover table metadata separately."
      },
      "tasks": [
        "1.1",
        "2.1",
        "2.3",
        "4.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon S3"
    },
    {
      "id": "s3tables",
      "name": "Amazon S3 Tables",
      "categories": [
        "Storage"
      ],
      "aliases": [
        "S3 Tables",
        "Iceberg table buckets"
      ],
      "description": "S3 storage optimized for managed Apache Iceberg tables.",
      "useCases": "Maintain analytical tables with managed table maintenance.",
      "components": "Table buckets; namespaces; tables; compaction; snapshot management.",
      "technical": "Table buckets differ from general-purpose buckets. Analytics access uses supported Iceberg clients and integrations.",
      "considerations": "Manage table permissions and integration setup. Compaction, storage and requests have costs; verify current engine/Region support.",
      "choose": "You want managed Iceberg table storage and maintenance.",
      "alternatives": "General-purpose S3 for arbitrary objects; Redshift for warehouse-managed tables.",
      "recall": {
        "question": "Are S3 table buckets the same as ordinary object buckets?",
        "answer": "No. They are a distinct bucket type for managed tables."
      },
      "tasks": [
        "2.1",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integrating-aws.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon S3 Tables"
    },
    {
      "id": "glacier",
      "name": "Amazon S3 Glacier",
      "categories": [
        "Storage"
      ],
      "aliases": [
        "S3 Glacier",
        "Glacier",
        "Glacier Flexible Retrieval",
        "Glacier Deep Archive"
      ],
      "description": "Archive storage offerings for infrequently accessed data.",
      "useCases": "Retain cold datasets with retrieval-aware lifecycle policies.",
      "components": "S3 Glacier storage classes; restore requests; archive retrieval tiers.",
      "technical": "Instant Retrieval differs from Flexible Retrieval and Deep Archive, which require restores before ordinary reads. Legacy Glacier vaults are a separate API model.",
      "considerations": "Balance retention and minimum-duration/retrieval charges against access needs; encrypt and test restore plans.",
      "choose": "You need cold retention with acceptable retrieval tradeoffs.",
      "alternatives": "S3 Standard for frequent access; Instant Retrieval for immediate archive access.",
      "recall": {
        "question": "Can Spectrum immediately query a Deep Archive object without restoration?",
        "answer": "No. Restore archived objects to an accessible state first."
      },
      "tasks": [
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html"
      ],
      "verified": "2026-10-08",
      "scopeName": "Amazon S3 Glacier"
    }
  ],
  "relationships": [
    {
      "id": "spectrum",
      "name": "Redshift Spectrum",
      "kind": "Feature",
      "roles": {
        "s3": "Stores external data files",
        "redshift": "Executes SQL using external tables"
      },
      "participants": [
        "s3",
        "redshift"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "redshift",
          "label": "External table scan",
          "type": "data"
        }
      ],
      "why": "Query lake data without loading Redshift tables; tests external access and cost/performance choices.",
      "prerequisites": "External schema/table metadata in Glue Data Catalog or a supported metastore; IAM role with S3/catalog access; same-Region S3 data for traditional RA3/DC2 Spectrum; newer integrated lake engines have different cross-Region support; KMS permission if encrypted.",
      "tradeoffs": "Parquet/ORC, compression and partition pruning reduce scanning. Spectrum does not support UPDATE/DELETE on external tables; supported INSERT/CTAS paths have separate constraints. Restore archive objects before reads.",
      "tasks": [
        "2.1",
        "2.2",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-external-tables.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-considerations.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "copy",
      "name": "COPY from S3",
      "kind": "Feature",
      "roles": {
        "s3": "Holds load files",
        "redshift": "Loads files into warehouse tables"
      },
      "participants": [
        "s3",
        "redshift"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "redshift",
          "label": "COPY load",
          "type": "data"
        }
      ],
      "why": "Persist data in warehouse tables for repeated analytical workloads; tests batch ingestion and lifecycle.",
      "prerequisites": "Target table; IAM authorization for source files and applicable KMS keys; compatible file format and load configuration.",
      "tradeoffs": "Load schema/type errors must be handled. Distribute files for parallel loading; warehouse storage and ingestion compute are used.",
      "tasks": [
        "1.1",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "unload",
      "name": "UNLOAD to S3",
      "kind": "Feature",
      "roles": {
        "redshift": "Runs a query and exports results",
        "s3": "Receives output objects"
      },
      "participants": [
        "redshift",
        "s3"
      ],
      "flow": [
        {
          "from": "redshift",
          "to": "s3",
          "label": "UNLOAD export",
          "type": "data"
        }
      ],
      "why": "Export transformed query results for lake consumers or downstream exchange; tests load versus unload.",
      "prerequisites": "IAM write authorization for destination prefix and encryption key where used; destination naming and supported format options.",
      "tradeoffs": "UNLOAD writes files rather than creating an operational database. Parallel output needs downstream file management; default text and optional Parquet serve different needs.",
      "tasks": [
        "2.3",
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "federation",
      "name": "Redshift federated queries",
      "kind": "Feature",
      "roles": {
        "rds": "Serves live PostgreSQL or MySQL tables",
        "redshift": "Reads remote data through a federated external schema"
      },
      "participants": [
        "rds",
        "redshift"
      ],
      "flow": [
        {
          "from": "rds",
          "to": "redshift",
          "label": "Federated read",
          "type": "data"
        }
      ],
      "why": "Read supported operational data without first building a full-load pipeline; tests remote data access.",
      "prerequisites": "Supported engines: RDS for PostgreSQL, RDS for MySQL; Aurora PostgreSQL/MySQL editions also supported. Secrets Manager credentials, IAM permission to read the secret and network reachability are required. S3 is not required.",
      "tradeoffs": "Read-only remote access; no external writes or object creation. Pushdown can reduce transfer, but source load and network latency remain. Check supported engine versions.",
      "tasks": [
        "2.1",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-limitations.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-create-secret-iam-role.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "federation-spectrum",
      "name": "Join operational and lake data in Redshift",
      "kind": "Architecture pattern",
      "roles": {
        "rds": "Provides live supported PostgreSQL/MySQL data",
        "s3": "Holds external lake files",
        "redshift": "Joins federated and Spectrum tables in one query"
      },
      "participants": [
        "rds",
        "s3",
        "redshift"
      ],
      "flow": [
        {
          "from": "rds",
          "to": "redshift",
          "label": "Federated read",
          "type": "data"
        },
        {
          "from": "s3",
          "to": "redshift",
          "label": "Spectrum scan",
          "type": "data"
        }
      ],
      "why": "Combine current operational rows with lake history in one SQL query. This composition uses two separate features, not a single named AWS integration.",
      "prerequisites": "Create a federated external schema for supported RDS PostgreSQL/MySQL (or Aurora PostgreSQL/MySQL), plus a separate Spectrum schema with catalog metadata. Requires Secrets Manager, IAM, reachable database and Spectrum Region constraints for the chosen deployment model. S3 is needed for the Spectrum branch only, not for federation itself.",
      "tradeoffs": "Remote query load, lake scan volume and schema/type alignment matter. Federation is read-only; this query does not guarantee synchronized snapshots across lake and operational sources.",
      "tasks": [
        "1.2",
        "2.1",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated_query_example.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-external-tables.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-limitations.html"
      ],
      "verified": "2026-10-08",
      "example": {
        "note": "Illustrative SQL after separately configuring operational as a federated schema and lake as a Spectrum schema. Table/column names are placeholders.",
        "sql": "SELECT o.customer_id, SUM(h.amount) AS historical_amount\nFROM operational.customers AS o\nJOIN lake.sales AS h ON h.customer_id = o.customer_id\nGROUP BY o.customer_id;"
      }
    },
    {
      "id": "aurora-federation",
      "name": "Federated queries to Aurora",
      "kind": "Feature",
      "roles": {
        "aurora": "Provides compatible operational tables",
        "redshift": "Reads through a federated schema"
      },
      "participants": [
        "aurora",
        "redshift"
      ],
      "flow": [
        {
          "from": "aurora",
          "to": "redshift",
          "label": "Federated read",
          "type": "data"
        }
      ],
      "why": "Access Aurora operational data from analytical SQL without requiring S3.",
      "prerequisites": "Aurora PostgreSQL-Compatible or MySQL-Compatible edition at a supported version; Secrets Manager, IAM and network connectivity.",
      "tradeoffs": "Read-only; remote I/O and transactional load matter. PostgreSQL endpoint/transaction choices can affect snapshot behavior.",
      "tasks": [
        "2.1",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-limitations.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "athena-lake",
      "name": "Cataloged lake SQL",
      "kind": "Architecture pattern",
      "roles": {
        "s3": "Stores files",
        "glue": "Supplies Data Catalog tables and partitions",
        "athena": "Executes SQL over files"
      },
      "participants": [
        "s3",
        "glue",
        "athena"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "athena",
          "label": "Read files",
          "type": "data"
        },
        {
          "from": "glue",
          "to": "athena",
          "label": "Table metadata",
          "type": "control"
        }
      ],
      "why": "Query a shared lake dataset using schema metadata; tests catalog discovery and scan optimization.",
      "prerequisites": "Matching table schema/SerDe, permissions to files/catalog and an appropriate query-result location or supported managed-results configuration.",
      "tradeoffs": "Stale partitions and incompatible file schemas can cause missing rows/errors. Prune partitions and use columnar files; catalog entries do not copy data.",
      "tasks": [
        "2.2",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/athena/latest/ug/data-sources-glue.html",
        "https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "glue-lake",
      "name": "S3 ETL with Glue",
      "kind": "Architecture pattern",
      "roles": {
        "s3": "Stores input and curated output",
        "glue": "Reads, transforms and writes datasets"
      },
      "participants": [
        "s3",
        "glue"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "glue",
          "label": "Input objects",
          "type": "data"
        },
        {
          "from": "glue",
          "to": "s3",
          "label": "Curated output",
          "type": "data"
        }
      ],
      "why": "Convert raw datasets into partitioned analytical files; tests ETL, format conversion and incremental processing.",
      "prerequisites": "Glue job/crawler as appropriate; IAM read/write access and KMS permissions; explicit output paths/schema.",
      "tradeoffs": "Bookmarks apply only to supported sources and do not track target cleanup. Avoid many small files; reruns need an idempotency strategy.",
      "tasks": [
        "1.2",
        "2.2",
        "3.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html",
        "https://docs.aws.amazon.com/glue/latest/dg/monitor-continuations.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "glue-jdbc",
      "name": "JDBC ingestion from RDS",
      "kind": "Architecture pattern",
      "roles": {
        "rds": "Provides relational rows",
        "glue": "Connects and transforms",
        "s3": "Receives curated files"
      },
      "participants": [
        "rds",
        "glue",
        "s3"
      ],
      "flow": [
        {
          "from": "rds",
          "to": "glue",
          "label": "JDBC reads",
          "type": "data"
        },
        {
          "from": "glue",
          "to": "s3",
          "label": "Write transformed files",
          "type": "data"
        }
      ],
      "why": "Move relational data into a lake for batch analytics; tests connections and transformations.",
      "prerequisites": "Supported JDBC engine/driver, Glue connection, source credentials, VPC subnet/security groups with reachable source; IAM for S3 output. Secrets Manager is a supported credential option.",
      "tradeoffs": "Parallel JDBC reads can load the source. Batch extracts are distinct from transaction-log CDC; plan incremental keys and schema evolution.",
      "tasks": [
        "1.1",
        "1.2",
        "2.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/glue/latest/dg/connection-properties.html",
        "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect-jdbc-home.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "glue-redshift",
      "name": "Glue Redshift connector",
      "kind": "Integration",
      "roles": {
        "glue": "Performs ETL",
        "redshift": "Supplies/receives warehouse tables",
        "s3": "Stages connector data"
      },
      "participants": [
        "glue",
        "redshift",
        "s3"
      ],
      "flow": [
        {
          "from": "redshift",
          "to": "s3",
          "label": "UNLOAD staging",
          "type": "data"
        },
        {
          "from": "s3",
          "to": "glue",
          "label": "Read staged data",
          "type": "data"
        },
        {
          "from": "glue",
          "to": "s3",
          "label": "Stage writes",
          "type": "data"
        },
        {
          "from": "s3",
          "to": "redshift",
          "label": "COPY staging",
          "type": "data"
        }
      ],
      "why": "Transform data between Glue and warehouse tables; tests connector staging versus direct federation.",
      "prerequisites": "Redshift connection and credentials; temporary S3 directory; source/target IAM and KMS permissions; appropriate network path.",
      "tradeoffs": "Temporary storage needs lifecycle/security controls. COPY and UNLOAD incur work; connector/runtime versions determine options.",
      "tasks": [
        "1.2",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect-redshift-home.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "lake-governance",
      "name": "Governed Athena lake",
      "kind": "Architecture pattern",
      "roles": {
        "s3": "Stores registered lake data",
        "glue": "Holds catalog metadata",
        "lakeformation": "Governs authorized data access",
        "athena": "Queries permitted tables"
      },
      "participants": [
        "s3",
        "glue",
        "lakeformation",
        "athena"
      ],
      "flow": [
        {
          "from": "glue",
          "to": "athena",
          "label": "Catalog metadata",
          "type": "control"
        },
        {
          "from": "lakeformation",
          "to": "athena",
          "label": "Permission checks",
          "type": "control"
        },
        {
          "from": "s3",
          "to": "athena",
          "label": "Authorized file reads",
          "type": "data"
        }
      ],
      "why": "Centralize lake permissions and query authorized datasets; tests IAM versus lake grants.",
      "prerequisites": "Register applicable data locations; catalog tables; Lake Formation grants and IAM permissions for the integration.",
      "tradeoffs": "Fine-grained behavior depends on engine/table support. Review hybrid access and cross-account configuration rather than assuming all APIs enforce identical rules.",
      "tasks": [
        "2.2",
        "4.2",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lake-formation/latest/dg/service-integrations.html",
        "https://docs.aws.amazon.com/athena/latest/ug/security-athena-lake-formation.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "tables-athena",
      "name": "Athena over S3 Tables",
      "kind": "Integration",
      "roles": {
        "s3tables": "Stores managed Iceberg tables",
        "glue": "Exposes integrated table metadata",
        "athena": "Queries tables"
      },
      "participants": [
        "s3tables",
        "glue",
        "athena"
      ],
      "flow": [
        {
          "from": "s3tables",
          "to": "athena",
          "label": "Iceberg data",
          "type": "data"
        },
        {
          "from": "glue",
          "to": "athena",
          "label": "Integrated catalog",
          "type": "control"
        }
      ],
      "why": "Use managed table maintenance with lake SQL; tests open table formats.",
      "prerequisites": "Enable S3 Tables analytics integration and required Glue/IAM permissions; supported Region and Athena engine configuration; Lake Formation configuration where applicable.",
      "tradeoffs": "Table bucket permissions differ from general-purpose buckets. Maintenance, catalog and query charges are separate; check current feature support.",
      "tasks": [
        "2.1",
        "2.2",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integrating-aws.html",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integration-overview.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "firehose-s3",
      "name": "Buffered stream delivery to S3",
      "kind": "Integration",
      "roles": {
        "firehose": "Buffers and delivers records",
        "s3": "Stores delivered objects"
      },
      "participants": [
        "firehose",
        "s3"
      ],
      "flow": [
        {
          "from": "firehose",
          "to": "s3",
          "label": "Buffered objects",
          "type": "data"
        }
      ],
      "why": "Land streaming events without writing a custom delivery consumer.",
      "prerequisites": "Firehose delivery stream; destination role, bucket and encryption configuration.",
      "tradeoffs": "Buffering trades latency for file size. Handle retries/duplicates and partition layout; this is delivery rather than general consumer replay.",
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html",
        "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "kinesis-firehose",
      "name": "Stream capture and lake delivery",
      "kind": "Architecture pattern",
      "roles": {
        "kinesis": "Retains incoming records",
        "firehose": "Consumes and buffers the stream",
        "s3": "Stores delivery output"
      },
      "participants": [
        "kinesis",
        "firehose",
        "s3"
      ],
      "flow": [
        {
          "from": "kinesis",
          "to": "firehose",
          "label": "Stream source",
          "type": "data"
        },
        {
          "from": "firehose",
          "to": "s3",
          "label": "Lake delivery",
          "type": "data"
        }
      ],
      "why": "Separate replayable ingestion from managed lake landing.",
      "prerequisites": "Kinesis-source Firehose stream, permissions for stream/bucket and supported configuration.",
      "tradeoffs": "Kinesis capacity/retention and Firehose buffering solve different problems; monitor consumer lag and delivery failures.",
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/firehose/latest/dev/writing-with-kinesis-streams.html",
        "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "firehose-redshift",
      "name": "Firehose Redshift delivery",
      "kind": "Integration",
      "roles": {
        "firehose": "Buffers records and coordinates delivery",
        "s3": "Stages data files",
        "redshift": "Loads staged files with COPY"
      },
      "participants": [
        "firehose",
        "s3",
        "redshift"
      ],
      "flow": [
        {
          "from": "firehose",
          "to": "s3",
          "label": "Stage buffered files",
          "type": "data"
        },
        {
          "from": "s3",
          "to": "redshift",
          "label": "COPY load",
          "type": "data"
        }
      ],
      "why": "Continuously land events in warehouse tables using managed delivery.",
      "prerequisites": "Configured Redshift destination/table/credentials and reachable endpoint; required S3 staging bucket and IAM access.",
      "tradeoffs": "S3 is required for this delivery path. Provisioned targets must meet documented public-access/IP requirements; enhanced VPC routing is unsupported for Firehose Redshift delivery. Buffering and load cadence affect freshness; retry/duplicate handling and schema compatibility matter.",
      "tasks": [
        "1.1",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "firehose-transform",
      "name": "Lambda transforms Firehose records",
      "kind": "Integration",
      "roles": {
        "firehose": "Buffers records and invokes transformation",
        "lambda": "Transforms batches",
        "s3": "Receives delivered output"
      },
      "participants": [
        "firehose",
        "lambda",
        "s3"
      ],
      "flow": [
        {
          "from": "firehose",
          "to": "lambda",
          "label": "Transform invocation",
          "type": "data"
        },
        {
          "from": "lambda",
          "to": "firehose",
          "label": "Transformed records",
          "type": "data"
        },
        {
          "from": "firehose",
          "to": "s3",
          "label": "Destination delivery",
          "type": "data"
        }
      ],
      "why": "Apply small per-record transformations before managed delivery.",
      "prerequisites": "Enabled transformation with a compatible function response contract, invocation role and S3 destination; failure backup configuration.",
      "tradeoffs": "Function payload/duration and Firehose buffering constraints apply; transformation is not stateful stream-window processing.",
      "tasks": [
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "firehose-opensearch",
      "name": "Firehose to OpenSearch",
      "kind": "Integration",
      "roles": {
        "firehose": "Delivers records",
        "opensearch": "Indexes searchable documents",
        "s3": "Stores configured backup/failed documents"
      },
      "participants": [
        "firehose",
        "opensearch",
        "s3"
      ],
      "flow": [
        {
          "from": "firehose",
          "to": "opensearch",
          "label": "Index documents",
          "type": "data"
        },
        {
          "from": "firehose",
          "to": "s3",
          "label": "Backup/failures",
          "type": "data"
        }
      ],
      "why": "Create searchable streaming event indexes without a custom writer.",
      "prerequisites": "Supported OpenSearch destination and network/access configuration; S3 backup location and destination role.",
      "tradeoffs": "Mapping errors and indexing backpressure require monitoring; configure backup and retry behavior. Search and archive storage have distinct costs.",
      "tasks": [
        "1.1",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "kinesis-lambda",
      "name": "Lambda Kinesis event source",
      "kind": "Integration",
      "roles": {
        "kinesis": "Retains ordered shard records",
        "lambda": "Polls/processes record batches"
      },
      "participants": [
        "kinesis",
        "lambda"
      ],
      "flow": [
        {
          "from": "kinesis",
          "to": "lambda",
          "label": "Event source batches",
          "type": "data"
        }
      ],
      "why": "Implement event-driven stream transformations; tests batching and retry semantics.",
      "prerequisites": "Event source mapping, stream read permissions and suitable starting position; enhanced fan-out if configured.",
      "tradeoffs": "At-least-once processing needs idempotency. Failed batches can impede shard progress; tune retry/partial-batch and concurrency settings.",
      "tasks": [
        "1.1",
        "1.4",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "dynamo-lambda",
      "name": "DynamoDB Streams processing",
      "kind": "Integration",
      "roles": {
        "dynamodb": "Emits item-level changes through Streams",
        "lambda": "Consumes stream events"
      },
      "participants": [
        "dynamodb",
        "lambda"
      ],
      "flow": [
        {
          "from": "dynamodb",
          "to": "lambda",
          "label": "Item change records",
          "type": "data"
        }
      ],
      "why": "React to operational writes for derived data and change processing.",
      "prerequisites": "Enable Streams with a suitable view type and configure a Lambda event source mapping/permissions.",
      "tradeoffs": "Stream records have finite retention; ordering applies per item. Retries require idempotency; Lambda is separate from the Streams feature.",
      "tasks": [
        "1.1",
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html",
        "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "flink-kinesis",
      "name": "Flink stateful stream processing",
      "kind": "Integration",
      "roles": {
        "kinesis": "Supplies event records",
        "flink": "Runs stateful transformations"
      },
      "participants": [
        "kinesis",
        "flink"
      ],
      "flow": [
        {
          "from": "kinesis",
          "to": "flink",
          "label": "Kinesis source connector",
          "type": "data"
        }
      ],
      "why": "Compute event-time windows and continuous aggregates.",
      "prerequisites": "Compatible Kinesis source connector and application role; configure checkpointing and source offsets.",
      "tradeoffs": "Parallelism, key skew and backpressure affect throughput. Check connector semantics rather than assuming end-to-end exactly-once.",
      "tasks": [
        "1.1",
        "1.2",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/managed-flink/latest/java/how-sources.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "flink-msk",
      "name": "Flink Kafka source",
      "kind": "Integration",
      "roles": {
        "msk": "Hosts Kafka topics",
        "flink": "Consumes and processes topic records"
      },
      "participants": [
        "msk",
        "flink"
      ],
      "flow": [
        {
          "from": "msk",
          "to": "flink",
          "label": "Kafka connector",
          "type": "data"
        }
      ],
      "why": "Apply stateful analytics to Kafka-based ingestion.",
      "prerequisites": "Compatible Kafka connector, broker network reachability and supported authentication; application role/configuration.",
      "tradeoffs": "Manage topic partitions, state and offsets; source/sink connectors determine recovery guarantees.",
      "tasks": [
        "1.1",
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/managed-flink/latest/java/how-sources.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "dms-s3",
      "name": "Database CDC into a lake",
      "kind": "Architecture pattern",
      "roles": {
        "rds": "Supplies database changes",
        "dms": "Performs full load and supported CDC",
        "s3": "Receives files"
      },
      "participants": [
        "rds",
        "dms",
        "s3"
      ],
      "flow": [
        {
          "from": "rds",
          "to": "dms",
          "label": "Full load / source logs",
          "type": "data"
        },
        {
          "from": "dms",
          "to": "s3",
          "label": "CSV / Parquet output",
          "type": "data"
        }
      ],
      "why": "Separate operational sources from analytical storage; tests CDC prerequisites and formats.",
      "prerequisites": "Supported RDS engine, source log/privilege configuration, replication task/endpoints, S3 target role. CDC/format options must be checked together.",
      "tradeoffs": "CDC output needs downstream interpretation, ordering and schema handling. Some S3 endpoint options cannot be combined; monitor lag.",
      "tasks": [
        "1.1",
        "2.4",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html",
        "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "dms-redshift",
      "name": "DMS migration to Redshift",
      "kind": "Integration",
      "roles": {
        "dms": "Reads supported source and replicates changes",
        "s3": "Stages target load files",
        "redshift": "Loads analytical target tables"
      },
      "participants": [
        "dms",
        "s3",
        "redshift"
      ],
      "flow": [
        {
          "from": "dms",
          "to": "s3",
          "label": "Stage replication data",
          "type": "data"
        },
        {
          "from": "s3",
          "to": "redshift",
          "label": "Load target",
          "type": "data"
        }
      ],
      "why": "Move supported databases into an analytical warehouse.",
      "prerequisites": "A separately configured supported source database is required; DMS replication task, S3 staging access, Redshift target credentials/permissions and networking.",
      "tradeoffs": "DMS replication is not full business ETL. Source/target type conversion and supported DDL must be validated; lag and staging costs remain.",
      "tasks": [
        "1.1",
        "2.1",
        "2.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redshift.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "s3-event",
      "name": "Object arrival invokes Lambda",
      "kind": "Integration",
      "roles": {
        "s3": "Emits configured object events",
        "lambda": "Processes event metadata and object data"
      },
      "participants": [
        "s3",
        "lambda"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "lambda",
          "label": "Object notification",
          "type": "control"
        }
      ],
      "why": "Start validation or lightweight processing when files arrive.",
      "prerequisites": "Bucket notification and Lambda resource permission; compatible Region and event filter configuration.",
      "tradeoffs": "Events can repeat and arrive out of order. Avoid recursive invocation by separating input/output prefixes or buckets.",
      "tasks": [
        "1.1",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "s3-eventbridge",
      "name": "S3 events to EventBridge",
      "kind": "Integration",
      "roles": {
        "s3": "Produces object event metadata",
        "eventbridge": "Matches rules and routes events"
      },
      "participants": [
        "s3",
        "eventbridge"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "eventbridge",
          "label": "Object events",
          "type": "control"
        }
      ],
      "why": "Route lake arrival events to configured pipeline targets.",
      "prerequisites": "Enable EventBridge delivery on the bucket; rule pattern and a separately configured supported target with permissions.",
      "tradeoffs": "Events represent object changes, not bulk file transfer. Configure retries/targets and avoid assuming global ordering.",
      "tasks": [
        "1.1",
        "1.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "step-glue",
      "name": "Step Functions runs Glue ETL",
      "kind": "Integration",
      "roles": {
        "stepfunctions": "Coordinates execution/retries",
        "glue": "Executes ETL job"
      },
      "participants": [
        "stepfunctions",
        "glue"
      ],
      "flow": [
        {
          "from": "stepfunctions",
          "to": "glue",
          "label": "StartJobRun .sync",
          "type": "control"
        }
      ],
      "why": "Wait for ETL completion and branch on success/failure.",
      "prerequisites": "Configured Glue job and state-machine execution role. The optimized .sync pattern requires a compatible workflow type.",
      "tradeoffs": "Orchestration does not make job side effects idempotent. Handle job failures and keep large data outside execution payloads.",
      "tasks": [
        "1.3",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "mwaa-glue",
      "name": "Airflow orchestrates Glue",
      "kind": "Architecture pattern",
      "roles": {
        "mwaa": "Schedules a DAG and monitors tasks",
        "glue": "Runs managed ETL"
      },
      "participants": [
        "mwaa",
        "glue"
      ],
      "flow": [
        {
          "from": "mwaa",
          "to": "glue",
          "label": "Glue operator / API",
          "type": "control"
        }
      ],
      "why": "Use Airflow dependencies with managed data transformation.",
      "prerequisites": "Compatible Amazon provider/operator, MWAA execution role with Glue permissions, DAG bucket and environment networking.",
      "tradeoffs": "Airflow task retries can restart work; coordinate with job behavior and tune scheduler/worker capacity.",
      "tasks": [
        "1.3",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/mwaa/latest/mwaa-serverless-userguide/operators.html",
        "https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "emr-s3",
      "name": "EMR processing with S3 storage",
      "kind": "Integration",
      "roles": {
        "s3": "Stores persistent input/output data",
        "emr": "Runs distributed processing"
      },
      "participants": [
        "s3",
        "emr"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "emr",
          "label": "Read lake data",
          "type": "data"
        },
        {
          "from": "emr",
          "to": "s3",
          "label": "Write results",
          "type": "data"
        }
      ],
      "why": "Separate durable lake storage from processing-cluster lifecycle.",
      "prerequisites": "Supported S3 connector for chosen EMR release/model, job IAM role and encryption permissions.",
      "tradeoffs": "Shuffle/data skew and small files affect runtime. Persistent S3 outputs survive cluster shutdown; local intermediates may not.",
      "tasks": [
        "1.2",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html",
        "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-file-systems.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "databrew-s3",
      "name": "DataBrew preparation into S3",
      "kind": "Integration",
      "roles": {
        "s3": "Provides source and output objects",
        "databrew": "Profiles and applies recipes"
      },
      "participants": [
        "s3",
        "databrew"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "databrew",
          "label": "Dataset read",
          "type": "data"
        },
        {
          "from": "databrew",
          "to": "s3",
          "label": "Recipe output",
          "type": "data"
        }
      ],
      "why": "Clean datasets visually before analytical use.",
      "prerequisites": "Dataset, recipe/profile job, supported file formats and IAM source/output access.",
      "tradeoffs": "Recipe output differs from profiling metrics; review sampling and job behavior. DataBrew does not replace catalog governance.",
      "tasks": [
        "1.2",
        "3.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/databrew/latest/dg/what-is.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "quality-monitor",
      "name": "Glue Data Quality monitoring",
      "kind": "Integration",
      "roles": {
        "glue": "Evaluates DQDL rules",
        "cloudwatch": "Receives configured quality metrics",
        "eventbridge": "Receives supported quality events",
        "s3": "Stores evaluation results"
      },
      "participants": [
        "glue",
        "cloudwatch",
        "eventbridge",
        "s3"
      ],
      "flow": [
        {
          "from": "glue",
          "to": "cloudwatch",
          "label": "Quality metrics",
          "type": "control"
        },
        {
          "from": "glue",
          "to": "eventbridge",
          "label": "Evaluation events",
          "type": "control"
        },
        {
          "from": "glue",
          "to": "s3",
          "label": "Rule results",
          "type": "data"
        }
      ],
      "why": "Detect quality regressions and automate responses; tests data quality versus infrastructure monitoring.",
      "prerequisites": "Ruleset, supported source and evaluation role; enable metric/result publication and configure EventBridge targets separately.",
      "tradeoffs": "Rules need meaningful business thresholds. Catalog and ETL entry points have different features; alerts do not automatically repair records.",
      "tasks": [
        "3.4",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "sns-sqs",
      "name": "Notification fan-out into queues",
      "kind": "Integration",
      "roles": {
        "sns": "Publishes topic messages",
        "sqs": "Buffers messages for consumers"
      },
      "participants": [
        "sns",
        "sqs"
      ],
      "flow": [
        {
          "from": "sns",
          "to": "sqs",
          "label": "Topic subscription",
          "type": "data"
        }
      ],
      "why": "Decouple multiple processing consumers with independent queues.",
      "prerequisites": "SQS subscription and queue policy permitting the topic; compatible standard/FIFO configurations.",
      "tradeoffs": "Configure raw delivery and message filtering deliberately. Downstream consumers still need retry/idempotency and dead-letter handling.",
      "tasks": [
        "1.3",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "sqs-lambda",
      "name": "Lambda queue consumers",
      "kind": "Integration",
      "roles": {
        "sqs": "Buffers work",
        "lambda": "Polls and processes batches"
      },
      "participants": [
        "sqs",
        "lambda"
      ],
      "flow": [
        {
          "from": "sqs",
          "to": "lambda",
          "label": "Event source mapping",
          "type": "data"
        }
      ],
      "why": "Scale event-driven workers while absorbing producer bursts.",
      "prerequisites": "Event source mapping, queue access and compatible queue/function Region; suitable visibility timeout.",
      "tradeoffs": "At-least-once delivery needs idempotency. Partial batch responses reduce reprocessing; concurrency affects downstream load.",
      "tasks": [
        "1.1",
        "1.4",
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "api-lambda",
      "name": "Serverless data API",
      "kind": "Architecture pattern",
      "roles": {
        "apigateway": "Receives API requests",
        "lambda": "Validates/processes requests"
      },
      "participants": [
        "apigateway",
        "lambda"
      ],
      "flow": [
        {
          "from": "apigateway",
          "to": "lambda",
          "label": "API invocation",
          "type": "control"
        }
      ],
      "why": "Expose a supported ingestion or query API with managed compute.",
      "prerequisites": "Configured integration, invocation permission, selected API type and authorization; storage is a separate backend decision.",
      "tradeoffs": "Validate input and handle throttling/errors. API payload/timeout limits differ from function limits; large files should use a storage path.",
      "tasks": [
        "1.1",
        "1.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-integrations.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "appflow-s3",
      "name": "SaaS data landing",
      "kind": "Integration",
      "roles": {
        "appflow": "Extracts supported SaaS source data",
        "s3": "Stores destination objects"
      },
      "participants": [
        "appflow",
        "s3"
      ],
      "flow": [
        {
          "from": "appflow",
          "to": "s3",
          "label": "Flow output",
          "type": "data"
        }
      ],
      "why": "Ingest application data for batch lake analytics.",
      "prerequisites": "Supported source connector/account authorization, field mappings, S3 destination policy and schedule/trigger.",
      "tradeoffs": "Incremental behavior and supported events vary by connector. Monitor failed records and costs from flow frequency/data volume.",
      "tasks": [
        "1.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/appflow/latest/userguide/s3.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "datasync-s3",
      "name": "Online migration into S3",
      "kind": "Integration",
      "roles": {
        "datasync": "Copies supported source data",
        "s3": "Receives destination objects"
      },
      "participants": [
        "datasync",
        "s3"
      ],
      "flow": [
        {
          "from": "datasync",
          "to": "s3",
          "label": "Transfer objects",
          "type": "data"
        }
      ],
      "why": "Migrate file/object datasets online into a lake.",
      "prerequisites": "Supported source location and agent where required; S3 location role and connectivity.",
      "tradeoffs": "Transfer verification/overwrite options need planning. Database transaction semantics are not preserved as CDC.",
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "transfer-s3",
      "name": "Partner SFTP landing in S3",
      "kind": "Integration",
      "roles": {
        "transfer": "Provides managed transfer endpoint",
        "s3": "Stores uploaded objects"
      },
      "participants": [
        "transfer",
        "s3"
      ],
      "flow": [
        {
          "from": "transfer",
          "to": "s3",
          "label": "Partner files",
          "type": "data"
        }
      ],
      "why": "Keep partner file interfaces while using object storage.",
      "prerequisites": "SFTP server, identity provider, user role and allowed bucket/prefix; optional managed workflow configured separately.",
      "tradeoffs": "Object storage has different directory/rename behavior from traditional filesystems. Server and storage operations have separate costs.",
      "tasks": [
        "1.1",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "s3-kms",
      "name": "S3 server-side KMS encryption",
      "kind": "Integration",
      "roles": {
        "s3": "Stores encrypted objects",
        "kms": "Controls key operations"
      },
      "participants": [
        "s3",
        "kms"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "kms",
          "label": "GenerateDataKey / Decrypt",
          "type": "control"
        }
      ],
      "why": "Protect lake data with controlled encryption keys.",
      "prerequisites": "SSE-KMS bucket/object configuration and applicable IAM/key policies; cross-account access requires appropriate key configuration.",
      "tradeoffs": "Read permission alone may be insufficient. Key API activity and throttling/cost deserve attention; encryption is distinct from masking.",
      "tasks": [
        "4.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "macie-s3",
      "name": "Sensitive-data discovery in S3",
      "kind": "Integration",
      "roles": {
        "s3": "Holds discoverable objects",
        "macie": "Analyzes supported data and produces findings"
      },
      "participants": [
        "s3",
        "macie"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "macie",
          "label": "Sensitive-data analysis",
          "type": "data"
        }
      ],
      "why": "Identify PII and exposure risk before designing governance controls.",
      "prerequisites": "Macie enabled with permissions to relevant supported S3 objects and encryption keys where required.",
      "tradeoffs": "Findings do not automatically redact data; unsupported formats/access restrictions affect coverage. Discovery volume influences cost.",
      "tasks": [
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "cloudtrail-s3",
      "name": "Audit trails stored in S3",
      "kind": "Integration",
      "roles": {
        "cloudtrail": "Records configured AWS events",
        "s3": "Stores delivered audit logs"
      },
      "participants": [
        "cloudtrail",
        "s3"
      ],
      "flow": [
        {
          "from": "cloudtrail",
          "to": "s3",
          "label": "Trail log delivery",
          "type": "data"
        }
      ],
      "why": "Retain AWS action evidence for audits.",
      "prerequisites": "Trail/event selectors and appropriate log bucket policy; configure data events explicitly when needed.",
      "tradeoffs": "Management events differ from data events. Protect logs with retention/encryption and restrict deletion; event coverage is configuration-dependent.",
      "tasks": [
        "4.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/create-s3-bucket-policy-for-cloudtrail.html",
        "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "logs-kinesis",
      "name": "CloudWatch log subscription stream",
      "kind": "Integration",
      "roles": {
        "logs": "Publishes matching log events",
        "kinesis": "Buffers the subscription stream"
      },
      "participants": [
        "logs",
        "kinesis"
      ],
      "flow": [
        {
          "from": "logs",
          "to": "kinesis",
          "label": "gzip/base64 log events",
          "type": "data"
        }
      ],
      "why": "Stream runtime logs into custom operational processing.",
      "prerequisites": "Subscription filter, destination stream and authorized delivery role; a downstream consumer is separately required.",
      "tradeoffs": "Decode/decompress the subscription envelope. Destination throttling and volume can affect delivery; avoid recursive logging.",
      "tasks": [
        "3.3",
        "4.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "alarm-sns",
      "name": "Operational alarm notifications",
      "kind": "Integration",
      "roles": {
        "cloudwatch": "Evaluates an alarm",
        "sns": "Delivers configured alarm actions"
      },
      "participants": [
        "cloudwatch",
        "sns"
      ],
      "flow": [
        {
          "from": "cloudwatch",
          "to": "sns",
          "label": "Alarm notification",
          "type": "control"
        }
      ],
      "why": "Notify operators when pipeline metrics breach thresholds.",
      "prerequisites": "Alarm action topic, topic permissions and subscriptions; applicable KMS policies for encrypted topics.",
      "tradeoffs": "Missing-data treatment and evaluation periods affect alerts. Notifications alone do not remediate pipeline failure.",
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Notify_Users_Alarm_Changes.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "grafana-cloudwatch",
      "name": "Grafana CloudWatch dashboards",
      "kind": "Integration",
      "roles": {
        "cloudwatch": "Supplies operational metrics/logs",
        "grafana": "Queries and visualizes telemetry"
      },
      "participants": [
        "cloudwatch",
        "grafana"
      ],
      "flow": [
        {
          "from": "cloudwatch",
          "to": "grafana",
          "label": "Data-source queries",
          "type": "data"
        }
      ],
      "why": "Compare pipeline health across operational dashboards.",
      "prerequisites": "Workspace and CloudWatch data source with appropriate IAM access and user authentication.",
      "tradeoffs": "Workspace access and underlying data permissions differ. Query choices and active-user licensing affect cost.",
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/grafana/latest/userguide/adding-CloudWatch-AWS-config.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "ecr-ecs",
      "name": "Container images for ECS",
      "kind": "Integration",
      "roles": {
        "ecr": "Stores workload image",
        "ecs": "Pulls and executes container tasks"
      },
      "participants": [
        "ecr",
        "ecs"
      ],
      "flow": [
        {
          "from": "ecr",
          "to": "ecs",
          "label": "Image pull",
          "type": "data"
        }
      ],
      "why": "Deploy reproducible container-based data workers.",
      "prerequisites": "Repository image, task definition, task execution-role pull permissions and network access; task role for workload APIs.",
      "tradeoffs": "Image registry is separate from compute. Pin digests and scan dependencies; scaling/resource choices affect runtime costs.",
      "tasks": [
        "1.2",
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "ec2-ebs",
      "name": "Block storage for processing instances",
      "kind": "Integration",
      "roles": {
        "ebs": "Provides persistent block volume",
        "ec2": "Mounts and uses volume"
      },
      "participants": [
        "ebs",
        "ec2"
      ],
      "flow": [
        {
          "from": "ebs",
          "to": "ec2",
          "label": "Block I/O",
          "type": "data"
        }
      ],
      "why": "Run tools requiring a local filesystem or database block device.",
      "prerequisites": "Compatible attachment in the same Availability Zone, filesystem/mount setup and encryption key access.",
      "tradeoffs": "Choose IOPS/throughput and snapshot recovery. An attached block volume is not a universally shared file store.",
      "tasks": [
        "2.1",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "lambda-efs",
      "name": "Shared filesystem for Lambda",
      "kind": "Integration",
      "roles": {
        "efs": "Stores shared files",
        "lambda": "Mounts an access point"
      },
      "participants": [
        "efs",
        "lambda"
      ],
      "flow": [
        {
          "from": "efs",
          "to": "lambda",
          "label": "NFS file access",
          "type": "data"
        }
      ],
      "why": "Use shared file data or dependencies in supported functions.",
      "prerequisites": "VPC configuration, EFS mount targets/access point and network/IAM permissions.",
      "tradeoffs": "Network/storage latency and throughput affect execution; shared files need concurrency discipline. This is separate from function ephemeral storage.",
      "tasks": [
        "1.4",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/configuration-filesystem.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "cdk-cfn",
      "name": "CDK infrastructure deployment",
      "kind": "Integration",
      "roles": {
        "cdk": "Synthesizes infrastructure definitions",
        "cloudformation": "Creates/updates stacks"
      },
      "participants": [
        "cdk",
        "cloudformation"
      ],
      "flow": [
        {
          "from": "cdk",
          "to": "cloudformation",
          "label": "Synthesized template",
          "type": "control"
        }
      ],
      "why": "Deploy repeatable data infrastructure using code.",
      "prerequisites": "Supported CDK environment/bootstrap and deployment credentials; review resulting templates.",
      "tradeoffs": "Construct defaults may create broad permissions/resources; stateful resource replacement needs review.",
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/cdk/v2/guide/home.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "sam-cfn",
      "name": "SAM template deployment",
      "kind": "Integration",
      "roles": {
        "sam": "Defines serverless abstractions",
        "cloudformation": "Transforms/deploys stack resources"
      },
      "participants": [
        "sam",
        "cloudformation"
      ],
      "flow": [
        {
          "from": "sam",
          "to": "cloudformation",
          "label": "SAM transform",
          "type": "control"
        }
      ],
      "why": "Package and deploy serverless pipeline infrastructure.",
      "prerequisites": "SAM template/CLI as appropriate, deployment role and artifact location.",
      "tradeoffs": "Generated roles and stateful replacements need review. Local testing is not proof of production integration permissions.",
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "ci-build",
      "name": "Data-code build pipeline",
      "kind": "Architecture pattern",
      "roles": {
        "codepipeline": "Coordinates delivery stages",
        "codebuild": "Runs tests/builds",
        "s3": "Stores supported pipeline artifacts"
      },
      "participants": [
        "codepipeline",
        "codebuild",
        "s3"
      ],
      "flow": [
        {
          "from": "codepipeline",
          "to": "codebuild",
          "label": "Build action",
          "type": "control"
        },
        {
          "from": "codebuild",
          "to": "s3",
          "label": "Build artifacts",
          "type": "data"
        }
      ],
      "why": "Test and package data platform software before release.",
      "prerequisites": "Source action, build project/buildspec, artifact store and pipeline/action permissions; deployment stage is configured separately.",
      "tradeoffs": "CI/CD flow differs from production data orchestration. Protect artifacts/secrets and verify tests are meaningful.",
      "tasks": [
        "1.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodeBuild.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "sagemaker-s3",
      "name": "SageMaker Processing datasets",
      "kind": "Integration",
      "roles": {
        "s3": "Stores processing inputs/outputs",
        "sagemaker": "Runs data processing jobs"
      },
      "participants": [
        "s3",
        "sagemaker"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "sagemaker",
          "label": "Processing input",
          "type": "data"
        },
        {
          "from": "sagemaker",
          "to": "s3",
          "label": "Processing output",
          "type": "data"
        }
      ],
      "why": "Prepare ML datasets and features with a managed processing job.",
      "prerequisites": "Processing container/job, execution role, accessible input/output locations and selected compute.",
      "tradeoffs": "Processing charges and data movement matter; this is a data preparation workflow rather than an exam requirement to train models.",
      "tasks": [
        "1.2",
        "3.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/sagemaker/latest/dg/processing-job.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "glacier-lifecycle",
      "name": "Archive object lifecycle",
      "kind": "Feature",
      "roles": {
        "s3": "Applies object lifecycle configuration",
        "glacier": "Provides archive storage classes"
      },
      "participants": [
        "s3",
        "glacier"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "glacier",
          "label": "Lifecycle transition",
          "type": "data"
        }
      ],
      "why": "Reduce cold-data retention costs while preserving a retrieval plan.",
      "prerequisites": "Eligible objects, lifecycle rules and supported transitions; restore before querying Flexible Retrieval/Deep Archive objects.",
      "tradeoffs": "Minimum storage duration, retrieval and transition charges apply. Instant Retrieval has different access behavior; versioned delete semantics require care.",
      "tasks": [
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "quick-athena",
      "name": "Lake BI with Amazon Quick",
      "kind": "Integration",
      "roles": {
        "athena": "Queries lake datasets",
        "quick": "Builds BI datasets and dashboards"
      },
      "participants": [
        "athena",
        "quick"
      ],
      "flow": [
        {
          "from": "athena",
          "to": "quick",
          "label": "SQL results",
          "type": "data"
        }
      ],
      "why": "Visualize analytical data using direct query or SPICE ingestion.",
      "prerequisites": "Supported Athena connection, query/catalog/S3 permissions and result access; underlying S3 data and catalog are additional supporting resources.",
      "tradeoffs": "SPICE refresh cadence affects freshness; direct queries use source compute. Dataset access and row-level security need explicit configuration.",
      "tasks": [
        "3.2",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/quick/latest/userguide/prepare-database-data.html",
        "https://docs.aws.amazon.com/quick/latest/userguide/managing-spice-capacity.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "quick-redshift",
      "name": "Warehouse BI with Amazon Quick",
      "kind": "Integration",
      "roles": {
        "redshift": "Runs analytical SQL",
        "quick": "Visualizes query results"
      },
      "participants": [
        "redshift",
        "quick"
      ],
      "flow": [
        {
          "from": "redshift",
          "to": "quick",
          "label": "BI dataset queries",
          "type": "data"
        }
      ],
      "why": "Publish warehouse dashboards with supported direct-query/SPICE choices.",
      "prerequisites": "Supported Redshift data source, credentials and network path; authorized dataset and warehouse permissions.",
      "tradeoffs": "Direct query increases warehouse workload; SPICE requires refresh and capacity. Dashboard authorization is separate from database authorization.",
      "tasks": [
        "3.2",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/quick/latest/userguide/prepare-database-data.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "bedrock-s3",
      "name": "S3 sources for Bedrock Knowledge Bases",
      "kind": "Integration",
      "roles": {
        "s3": "Stores supported source documents",
        "bedrock": "Ingests and retrieves grounded content"
      },
      "participants": [
        "s3",
        "bedrock"
      ],
      "flow": [
        {
          "from": "s3",
          "to": "bedrock",
          "label": "Knowledge Base source",
          "type": "data"
        }
      ],
      "why": "Prepare governed data for retrieval-augmented model applications.",
      "prerequisites": "Supported S3 source setup, service role and Knowledge Base storage/retriever configuration. A supported vector store is required for a vector Knowledge Base; model availability depends on Region.",
      "tradeoffs": "Chunking, sync freshness and permissions affect retrieval. Generated answers still require validation; embedding/storage/model costs are separate.",
      "tasks": [
        "1.2",
        "2.4",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-ds.html",
        "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "spectrum-catalog",
      "name": "Shared catalog for Spectrum",
      "kind": "Integration",
      "roles": {
        "s3": "Stores external files",
        "glue": "Provides Data Catalog table definitions",
        "redshift": "Queries external tables through Spectrum"
      },
      "participants": [
        "s3",
        "glue",
        "redshift"
      ],
      "flow": [
        {
          "from": "glue",
          "to": "redshift",
          "label": "Catalog metadata",
          "type": "control"
        },
        {
          "from": "s3",
          "to": "redshift",
          "label": "Spectrum scan",
          "type": "data"
        }
      ],
      "why": "Reuse lake schema definitions across analytics engines.",
      "prerequisites": "External schema referencing a Glue database, compatible table formats and IAM access to S3/Glue; KMS permissions if applicable.",
      "tradeoffs": "Catalog entries describe data without loading it. Keep schema/partitions synchronized and use partition pruning.",
      "tasks": [
        "2.2",
        "3.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/c-spectrum-external-tables.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "spectrum-governance",
      "name": "Lake Formation grants for Spectrum",
      "kind": "Integration",
      "roles": {
        "lakeformation": "Governs cataloged lake permissions",
        "redshift": "Queries permitted external data"
      },
      "participants": [
        "lakeformation",
        "redshift"
      ],
      "flow": [
        {
          "from": "lakeformation",
          "to": "redshift",
          "label": "Spectrum permissions",
          "type": "control"
        }
      ],
      "why": "Apply centrally managed table access to supported lake queries.",
      "prerequisites": "Registered S3 data and Glue catalog metadata are supporting resources; required Lake Formation grants and IAM permissions.",
      "tradeoffs": "Supported table/engine permissions vary. This does not govern every Redshift internal-table operation.",
      "tasks": [
        "4.2",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lake-formation/latest/dg/service-integrations.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "federation-credentials",
      "name": "Secrets for Redshift federation",
      "kind": "Integration",
      "roles": {
        "rds": "Authenticates remote database access",
        "secrets": "Stores supported source credentials",
        "redshift": "Reads secret and queries source"
      },
      "participants": [
        "rds",
        "secrets",
        "redshift"
      ],
      "flow": [
        {
          "from": "secrets",
          "to": "redshift",
          "label": "Credential retrieval",
          "type": "control"
        },
        {
          "from": "rds",
          "to": "redshift",
          "label": "Federated rows",
          "type": "data"
        }
      ],
      "why": "Keep credentials out of SQL/scripts while reading supported operational databases.",
      "prerequisites": "Supported PostgreSQL/MySQL source; secret, IAM role permitting retrieval and network reachability. S3 is not required.",
      "tradeoffs": "Grant only required secret/key access; rotation and database account changes must preserve the integration.",
      "tasks": [
        "4.1",
        "4.3",
        "2.1"
      ],
      "sources": [
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-create-secret-iam-role.html",
        "https://docs.aws.amazon.com/redshift/latest/dg/federated-overview.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "s3-iam",
      "name": "Policy-based lake access",
      "kind": "Integration",
      "roles": {
        "iam": "Defines role/identity permissions",
        "s3": "Evaluates authorized object requests"
      },
      "participants": [
        "iam",
        "s3"
      ],
      "flow": [
        {
          "from": "iam",
          "to": "s3",
          "label": "Access policies",
          "type": "control"
        }
      ],
      "why": "Apply least privilege to lake read/write paths.",
      "prerequisites": "Applicable identity/bucket/access-point policies, correct role trust and required encryption key permissions.",
      "tradeoffs": "Explicit denies override allows; cross-account access needs appropriate policies on both sides. Network access is a separate requirement.",
      "tasks": [
        "4.1",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-management.html",
        "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "s3-vpc",
      "name": "S3 gateway endpoint access",
      "kind": "Integration",
      "roles": {
        "vpc": "Provides a gateway endpoint and route",
        "s3": "Serves object API requests"
      },
      "participants": [
        "vpc",
        "s3"
      ],
      "flow": [
        {
          "from": "vpc",
          "to": "s3",
          "label": "Gateway endpoint route",
          "type": "control"
        }
      ],
      "why": "Access S3 from a VPC without routing through a NAT gateway.",
      "prerequisites": "Supported same-Region S3 gateway endpoint, route-table associations, endpoint policy and S3/IAM permissions.",
      "tradeoffs": "Gateway endpoints differ from PrivateLink interface endpoints. Endpoint policy does not grant access by itself; routing restrictions apply.",
      "tasks": [
        "4.1",
        "4.2"
      ],
      "sources": [
        "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "lambda-logs",
      "name": "Function execution logs",
      "kind": "Integration",
      "roles": {
        "lambda": "Produces runtime logs",
        "logs": "Stores searchable log events"
      },
      "participants": [
        "lambda",
        "logs"
      ],
      "flow": [
        {
          "from": "lambda",
          "to": "logs",
          "label": "Execution logs",
          "type": "data"
        }
      ],
      "why": "Investigate processing failures and execution behavior.",
      "prerequisites": "Function execution role with required logging permissions and configured log destination.",
      "tradeoffs": "Set retention and avoid secrets in logs. Logging volume incurs costs; log output does not establish data correctness.",
      "tasks": [
        "3.3",
        "4.4"
      ],
      "sources": [
        "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "kinesis-metrics",
      "name": "Stream operational monitoring",
      "kind": "Integration",
      "roles": {
        "kinesis": "Publishes stream metrics",
        "cloudwatch": "Displays metrics and evaluates configured alarms"
      },
      "participants": [
        "kinesis",
        "cloudwatch"
      ],
      "flow": [
        {
          "from": "kinesis",
          "to": "cloudwatch",
          "label": "Stream metrics",
          "type": "control"
        }
      ],
      "why": "Detect throttling and consumer lag before data freshness degrades.",
      "prerequisites": "Use relevant metrics and configure alarms/dimensions; enhanced metrics are optional and have costs.",
      "tradeoffs": "Metric aggregation can hide hot shards; distinguish producer failures from consumer lag. Notifications/actions are separately configured.",
      "tasks": [
        "3.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "dynamodb-s3",
      "name": "DynamoDB export to S3",
      "kind": "Feature",
      "roles": {
        "dynamodb": "Exports point-in-time or supported incremental table data",
        "s3": "Stores exported objects"
      },
      "participants": [
        "dynamodb",
        "s3"
      ],
      "flow": [
        {
          "from": "dynamodb",
          "to": "s3",
          "label": "Table export",
          "type": "data"
        }
      ],
      "why": "Analyze operational data outside the serving table without a table scan.",
      "prerequisites": "Point-in-time recovery enabled and a point within the recovery window; export/S3 permissions. Full versus incremental configuration differs.",
      "tradeoffs": "Asynchronous export is not a live continuous stream consumer. Supported output formats include DynamoDB JSON and Amazon Ion; downstream tools must interpret them.",
      "tasks": [
        "1.1",
        "2.3"
      ],
      "sources": [
        "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/S3DataExport.HowItWorks.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "dataexchange-redshift",
      "name": "Licensed Redshift data products",
      "kind": "Integration",
      "roles": {
        "dataexchange": "Manages product subscription entitlement",
        "redshift": "Queries provider shared data"
      },
      "participants": [
        "dataexchange",
        "redshift"
      ],
      "flow": [
        {
          "from": "dataexchange",
          "to": "redshift",
          "label": "Data-product entitlement",
          "type": "control"
        }
      ],
      "why": "Consume licensed external analytical datasets without a custom ETL copy.",
      "prerequisites": "A supported Redshift data product/subscription and authorized consumer configuration.",
      "tradeoffs": "Access is read-only and entitlement-dependent. Source quality, licensing and query costs need separate review.",
      "tasks": [
        "1.1",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html"
      ],
      "verified": "2026-10-08"
    },
    {
      "id": "backup-rds",
      "name": "Managed database recovery policies",
      "kind": "Integration",
      "roles": {
        "rds": "Provides a supported database resource",
        "backup": "Manages backup/recovery points"
      },
      "participants": [
        "rds",
        "backup"
      ],
      "flow": [
        {
          "from": "rds",
          "to": "backup",
          "label": "Database backup",
          "type": "data"
        }
      ],
      "why": "Centralize database recovery and retention.",
      "prerequisites": "Supported RDS configuration, backup plan/resource assignment and service role; validate chosen Region/features.",
      "tradeoffs": "Backups are not CDC analytics feeds. Test restore procedures; resource coverage and copy/restore restrictions vary.",
      "tasks": [
        "2.3",
        "4.5"
      ],
      "sources": [
        "https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html",
        "https://docs.aws.amazon.com/aws-backup/latest/devguide/backup-feature-availability.html"
      ],
      "verified": "2026-10-08"
    }
  ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.awsExplorerData = data;
})(typeof window !== 'undefined' ? window : globalThis);
