/*
 * Optional visuals for Markdown-backed study slides.
 * Add a title-keyed entry here rather than putting presentational data in the notes.
 */
window.studyVisuals = {
  "Data Lakehouses": {
    type: "image",
    src: "/assets/images/lakehouse-databricks.png",
    alt: "A case-study image showing a medallion lakehouse with bronze, silver, and gold layers.",
    caption: "Illustrative reference: a medallion-style lakehouse flow."
  },
  "DynamoDB Streams": {
    type: "diagram",
    id: "dynamodb-streams-flow",
    label: "DynamoDB Streams processing flow",
    caption: "A DynamoDB change record flows through DynamoDB Streams to Lambda, which can route it to analytics, search, or derived data stores.",
    nodes: [
      { key: "table", text: "DynamoDB table", detail: "Create · update · delete", fill: "#2d3449" },
      { key: "stream", text: "DynamoDB Streams", detail: "Ordered change records", fill: "#173947" },
      { key: "lambda", text: "AWS Lambda", detail: "Event source mapping", fill: "#242d52" },
      { key: "analytics", text: "Analytics", detail: "Kinesis or data lake", fill: "#173b34" },
      { key: "search", text: "Search index", detail: "OpenSearch", fill: "#173b34" }
    ],
    links: [
      { from: "table", to: "stream", label: "item changes" },
      { from: "stream", to: "lambda", label: "read batches" },
      { from: "lambda", to: "analytics", label: "process" },
      { from: "lambda", to: "search", label: "index" }
    ]
  }
};
