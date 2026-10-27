"use strict";

const sqlById = (id) => document.getElementById(id);
const sqlExamples = {
  cohort: "SELECT diagnosis, COUNT(*) AS participants\nFROM ucla_core.dim_participant\nGROUP BY diagnosis\nORDER BY participants DESC;",
  join: "SELECT p.diagnosis, t.task_code,\n       COUNT(*) FILTER (WHERE f.dataset_listed) AS listed_scans\nFROM ucla_core.fact_scan_availability f\nJOIN ucla_core.dim_participant p USING (participant_key)\nJOIN ucla_core.dim_task t USING (task_key)\nGROUP BY p.diagnosis, t.task_code\nORDER BY p.diagnosis, t.task_code;",
  raw: "SELECT source_path, file_kind, byte_count, row_count\nFROM ucla_raw.source_file\nORDER BY byte_count DESC\nLIMIT 25;",
  cte: "WITH completeness AS (\n  SELECT diagnosis, SUM(observed_responses) AS observed,\n         SUM(expected_responses) AS expected\n  FROM ucla_mart.assessment_coverage\n  GROUP BY diagnosis\n)\nSELECT diagnosis, observed, expected,\n       ROUND(100.0 * observed / expected, 1) AS observed_percent\nFROM completeness\nORDER BY diagnosis;",
};
let sqlCatalog;
let sqlSelected;
let sqlConnected = false;
let sqlBusy = false;

function sqlElement(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function sqlButtons() {
  sqlById("run-query").disabled = !sqlConnected || sqlBusy;
  sqlById("preview-table").disabled = !sqlConnected || sqlBusy || !sqlSelected;
  sqlById("run-query").firstChild.textContent = sqlBusy ? "Running… " : "Run query ";
}

function sqlTables() {
  const search = sqlById("table-search").value.trim().toLowerCase();
  const visible = sqlCatalog.relations.filter((relation) => relation.name.toLowerCase().includes(search));
  const groups = new Map();
  visible.forEach((relation) => {
    const schema = relation.name.split(".")[0];
    if (!groups.has(schema)) groups.set(schema, []);
    groups.get(schema).push(relation);
  });
  const sections = [...groups].map(([schema, rows]) => {
    const details = sqlElement("details");
    details.open = true;
    details.append(sqlElement("summary", schema + " / " + rows.length));
    rows.forEach((relation) => {
      const button = sqlElement("button", relation.name.split(".")[1], "sql-table-button");
      button.type = "button";
      button.setAttribute("aria-pressed", String(relation.name === sqlSelected?.name));
      button.setAttribute("aria-label", relation.name + " (" + relation.kind + ")");
      button.addEventListener("click", () => sqlSelectTable(relation.name));
      details.append(button);
    });
    return details;
  });
  sqlById("schema-tables").replaceChildren(...sections);
  sqlById("table-search-status").textContent = visible.length + " of " + sqlCatalog.relations.length + " relations shown.";
}

function sqlSelectTable(name) {
  sqlSelected = sqlCatalog.relations.find((relation) => relation.name === name);
  if (!sqlSelected) return;
  sqlById("selected-table").textContent = sqlSelected.name;
  sqlById("selected-table-note").textContent = sqlSelected.kind + " · " + sqlSelected.columns.length + " columns" +
    (sqlSelected.row_count !== undefined ? " · " + new Intl.NumberFormat("en-AU").format(sqlSelected.row_count) + " rows at import" : "");
  sqlById("column-rows").replaceChildren(...sqlSelected.columns.map((column) => {
    const row = sqlElement("tr");
    const fk = sqlSelected.foreign_keys.some((key) => key.columns.includes(column.name));
    [column.name, column.type, [column.primary_key ? "PK" : "", fk ? "FK" : ""].filter(Boolean).join(" / "), column.nullable ? "Yes" : "No"].forEach((value, index) => {
      const cell = sqlElement(index === 0 ? "th" : "td", value, index === 2 ? "sql-key" : "");
      if (index === 0) cell.scope = "row";
      row.append(cell);
    });
    return row;
  }));
  const connections = [];
  sqlSelected.foreign_keys.forEach((key) => connections.push({
    table: key.table, text: sqlSelected.name + "." + key.columns.join(", ") + " → " + key.referenced_columns.join(", "),
  }));
  sqlCatalog.relations.forEach((relation) => relation.foreign_keys.forEach((key) => {
    if (key.table === name) connections.push({
      table: relation.name, text: relation.name + "." + key.columns.join(", ") + " → " + key.referenced_columns.join(", "),
    });
  }));
  sqlById("relationships").replaceChildren(...(connections.length ? connections.map((connection) => {
    const row = sqlElement("div", undefined, "sql-reference");
    const button = sqlElement("button", connection.table);
    button.type = "button";
    button.addEventListener("click", () => sqlSelectTable(connection.table));
    row.append(button, sqlElement("span", connection.text, "sql-muted"));
    return row;
  }) : [sqlElement("p", sqlSelected.kind === "view" ? "This analytical view has no declared foreign keys." : "No declared foreign keys for this table.", "sql-muted")]));
  sqlTables();
  sqlButtons();
}

async function sqlRun(query = sqlById("sql-editor").value) {
  if (!sqlConnected || sqlBusy) return;
  sqlBusy = true;
  sqlButtons();
  sqlById("query-error").hidden = true;
  sqlById("results-scroll").hidden = true;
  sqlById("result-status").textContent = "Running query…";
  try {
    const response = await fetch("/api/ucla", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: query }), signal: AbortSignal.timeout(12_000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "The query could not be completed.");
    const header = sqlElement("tr");
    result.columns.forEach((column) => {
      const cell = sqlElement("th", column.name);
      cell.scope = "col";
      header.append(cell);
    });
    sqlById("query-results").querySelector("thead").replaceChildren(header);
    sqlById("query-results").querySelector("tbody").replaceChildren(...result.rows.map((values) => {
      const row = sqlElement("tr");
      values.forEach((value) => row.append(sqlElement("td",
        value === null ? "NULL" : typeof value === "object" ? JSON.stringify(value) : String(value),
        value === null ? "sql-null" : "")));
      return row;
    }));
    sqlById("results-scroll").hidden = false;
    sqlById("result-status").textContent = result.row_count + " rows · " + result.elapsed_ms + " ms" +
      (result.truncated ? " · Result capped at " + result.limit + " rows. Add filters to narrow it." : "");
  } catch (error) {
    sqlById("query-error").textContent = error.name === "TimeoutError" ? "The request timed out. Try a smaller query." : error.message;
    sqlById("query-error").hidden = false;
    sqlById("result-status").textContent = "No result returned.";
  } finally {
    sqlBusy = false;
    sqlButtons();
  }
}

async function sqlLoad() {
  sqlById("sql-editor").value = sqlExamples.cohort;
  sqlById("query-example").addEventListener("change", (event) => { sqlById("sql-editor").value = sqlExamples[event.target.value]; });
  sqlById("run-query").addEventListener("click", () => sqlRun());
  sqlById("preview-table").addEventListener("click", () => {
    const query = "SELECT *\nFROM " + sqlSelected.name + "\nLIMIT 50;";
    sqlById("sql-editor").value = query;
    sqlRun(query);
  });
  sqlById("sql-editor").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); sqlRun(); }
  });
  sqlById("table-search").addEventListener("input", () => { if (sqlCatalog) sqlTables(); });
  try {
    const response = await fetch("/assets/data/ucla-catalog.json");
    if (!response.ok) throw new Error("Schema snapshot unavailable.");
    sqlCatalog = await response.json();
    sqlById("catalog-count").textContent = sqlCatalog.relations.length + " tables and views";
    sqlById("catalog-date").textContent = "Data handoff built " + new Date(sqlCatalog.generated_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney", timeZoneName: "short" }) + ".";
    sqlWarehouseOverview(sqlCatalog);
    sqlSelectTable("ucla_core.dim_participant");
    sqlById("connection-status").textContent = "Schema snapshot · Connecting to PostgreSQL…";
    try {
      const live = await fetch("/api/ucla", { signal: AbortSignal.timeout(10_000) });
      if (!live.ok) throw new Error("Live queries unavailable");
      sqlCatalog = await live.json();
      sqlConnected = true;
      sqlById("connection-status").textContent = "PostgreSQL connected · Read-only";
      sqlById("connection-status").dataset.live = "true";
      sqlSelectTable(sqlSelected.name);
    } catch {
      sqlConnected = false;
      sqlById("connection-status").dataset.live = "false";
      sqlById("connection-status").textContent = "Schema snapshot · Live queries are unavailable";
    }
    sqlButtons();
  } catch {
    sqlById("connection-status").textContent = "The schema could not be loaded. Please try again later.";
  }
}
sqlLoad();
