"use strict";

const uclaModelAttributes = {
  dim_dataset: ["accession"],
  dim_participant: ["participant_id", "diagnosis"],
  dim_instrument: ["instrument_code"],
  dim_measure: ["variable_name"],
  dim_task: ["task_code", "modality"],
  dim_scanner: ["serial_number"],
  fact_phenotype_response: ["value_numeric", "is_missing"],
  fact_scan_availability: ["dataset_listed", "local_file_present"],
  fact_task_event: ["onset_seconds"],
  source_file: ["file_kind", "sha256"],
  document: ["payload"],
  record: ["payload"],
};

function uclaModelTables(catalog, schema, fact = "") {
  if (!["ucla_core", "ucla_raw"].includes(schema)) throw new Error("Choose a modeled schema");
  let tables = catalog.relations.filter((table) => table.kind === "table" && table.name.startsWith(schema + "."));
  if (fact) {
    const pending = [schema + "." + fact];
    const included = new Set();
    while (pending.length) {
      const name = pending.pop();
      if (included.has(name)) continue;
      const table = tables.find((table) => table.name === name);
      if (!table) throw new Error("Unknown fact in the model");
      included.add(name);
      table.foreign_keys.forEach((key) => pending.push(key.table));
    }
    tables = tables.filter((table) => included.has(table.name));
  }
  return tables;
}

function uclaErDefinition(catalog, schema, fact = "") {
  const tables = uclaModelTables(catalog, schema, fact);
  const names = new Set(tables.map((table) => table.name));
  const definition = ["erDiagram", "  direction LR"];
  for (const table of tables) {
    const name = table.name.split(".")[1];
    if (!/^[a-z_][a-z0-9_]*$/.test(name)) throw new Error("Invalid entity name");
    const foreign = new Set(table.foreign_keys.flatMap((key) => key.columns));
    definition.push("  " + name + " {");
    for (const column of table.columns) {
      if (!column.primary_key && !foreign.has(column.name) && !uclaModelAttributes[name]?.includes(column.name)) continue;
      if (!/^[a-z_][a-z0-9_]*$/.test(column.name)) throw new Error("Invalid column name");
      const type = column.type.toLowerCase().replaceAll("character varying", "varchar")
        .replaceAll("double precision", "double").replace(/[^a-z0-9_]/g, "_");
      const keys = [column.primary_key ? "PK" : "", foreign.has(column.name) ? "FK" : ""].filter(Boolean);
      definition.push("    " + type + " " + column.name + (keys.length ? " " + keys.join(",") : ""));
    }
    definition.push("  }");
    for (const key of table.foreign_keys) {
      if (!names.has(key.table)) continue;
      const columns = key.columns.map((name) => table.columns.find((column) => column.name === name));
      const parent = columns.every((column) => !column.nullable) ? "||" : "|o";
      const primary = table.columns.filter((column) => column.primary_key).map((column) => column.name);
      const unique = primary.length === key.columns.length && primary.every((name) => key.columns.includes(name));
      const line = columns.every((column) => column.primary_key) ? "--" : "..";
      definition.push("  " + key.table.split(".")[1] + " " + parent + line + (unique ? "o|" : "o{") +
        " " + name + ' : "' + key.columns.join(", ") + '"');
    }
  }
  return definition.join("\n");
}

function sqlWarehouseOverview(catalog) {
  const byId = (id) => document.getElementById(id);
  const canvas = byId("er-canvas");
  const status = byId("er-status");
  const controls = ["er-fit", "er-actual", "er-out", "er-in"];
  let sequence = 0;
  let bounds;
  let scale = 1;
  let renderer;
  function fitScale() {
    return Math.min((canvas.clientWidth - 32) / bounds.width, (canvas.clientHeight - 32) / bounds.height, 1);
  }
  function zoom(value) {
    if (!bounds) return;
    scale = Math.max(.15, Math.min(2.5, value));
    const svg = canvas.querySelector("svg");
    svg.style.width = Math.round(bounds.width * scale) + "px";
    svg.style.height = Math.round(bounds.height * scale) + "px";
    status.textContent = byId("er-schema").value + " · " + Math.round(scale * 100) + "%";
  }
  async function render() {
    const version = ++sequence;
    const selected = byId("er-schema").value;
    const schema = selected.startsWith("fact_") ? "ucla_core" : selected;
    const fact = selected.startsWith("fact_") ? selected : "";
    controls.forEach((id) => { byId(id).disabled = true; });
    canvas.replaceChildren();
    bounds = null;
    status.textContent = "Drawing " + schema + "…";
    const rows = [];
    uclaModelTables(catalog, schema, fact).forEach((table) => {
      table.foreign_keys.forEach((key) => {
        const row = document.createElement("tr");
        for (const text of [table.name + " / " + key.columns.join(", "), key.table + " / " + key.referenced_columns.join(", ")]) {
          const cell = document.createElement("td");
          cell.textContent = text;
          row.append(cell);
        }
        rows.push(row);
      });
    });
    byId("er-relationship-rows").replaceChildren(...rows);
    try {
      if (!renderer) renderer = import("https://cdn.jsdelivr.net/npm/mermaid@11.17.0/dist/mermaid.esm.min.mjs")
        .then(({ default: mermaid }) => {
          mermaid.initialize({ startOnLoad: false, securityLevel: "strict", suppressErrorRendering: true,
            theme: "base", fontFamily: "Space Grotesk, Inter, sans-serif",
            themeVariables: { primaryColor: "#131b2e", primaryTextColor: "#dae2fd", primaryBorderColor: "#5de6ff",
              lineColor: "#5de6ff", secondaryColor: "#222a3d", tertiaryColor: "#060e20",
              background: "#060e20", mainBkg: "#131b2e", textColor: "#dae2fd", fontSize: "16px",
              attributeBackgroundColorOdd: "#131b2e", attributeBackgroundColorEven: "#222a3d",
              entityBkg: "#131b2e", entityTextColor: "#dae2fd", entityBorder: "#5de6ff",
              relationColor: "#5de6ff", relationLabelBackground: "#060e20" } });
          return mermaid;
        });
      const mermaid = await renderer;
      const result = await mermaid.render("ucla-er-" + version, uclaErDefinition(catalog, schema, fact));
      if (version !== sequence) return;
      canvas.innerHTML = result.svg;
      const svg = canvas.querySelector("svg");
      svg.style.maxWidth = "none";
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", schema + " entity relationship model with primary and foreign keys");
      bounds = svg.viewBox.baseVal;
      zoom(Math.min((canvas.clientWidth - 32) / bounds.width, 1));
      controls.forEach((id) => { byId(id).disabled = false; });
    } catch {
      if (version !== sequence) return;
      status.textContent = "Visual diagram unavailable. The relationship table is available below.";
      byId("warehouse-model").querySelector(".sql-er-fallback").open = true;
    }
  }
  byId("er-fit").addEventListener("click", () => zoom(fitScale()));
  byId("er-actual").addEventListener("click", () => zoom(1));
  byId("er-in").addEventListener("click", () => zoom(scale * 1.25));
  byId("er-out").addEventListener("click", () => zoom(scale / 1.25));
  byId("er-schema").addEventListener("change", render);
  render();
}

if (typeof module !== "undefined") module.exports = { uclaErDefinition };
