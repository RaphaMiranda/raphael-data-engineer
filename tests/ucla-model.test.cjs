const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { uclaErDefinition } = require("../assets/js/ucla-warehouse-model.js");
const catalog = require("../assets/data/ucla-catalog.json");

test("core ER diagram includes every declared foreign key and table", () => {
  const er = uclaErDefinition(catalog, "ucla_core");
  const tables = catalog.relations.filter((table) => table.name.startsWith("ucla_core.") && table.kind === "table");
  const ddl = fs.readFileSync(path.join(__dirname, "../projects/ucla/postgres/schema.sql"), "utf8");
  assert.equal(tables.length, 9);
  let edges = 0;
  for (const table of tables) {
    const name = table.name.split(".")[1];
    assert.ok(ddl.includes("CREATE TABLE " + table.name));
    assert.ok(er.includes("  " + name + " {"));
    for (const key of table.foreign_keys) {
      assert.ok(er.includes(' ' + name + ' : "' + key.columns.join(", ") + '"'));
      edges++;
    }
  }
  assert.equal(edges, 9);
  assert.equal(er.split("\n").filter((line) => line.includes(' : "')).length, edges);
  assert.ok(er.includes("dim_scanner |o..o{ fact_scan_availability"));
  assert.ok(er.includes("dim_participant ||--o{ fact_phenotype_response"));
  assert.ok(er.includes("participant_key PK,FK"));
});

test("raw lineage preserves the document one-to-one and record one-to-many grains", () => {
  const er = uclaErDefinition(catalog, "ucla_raw");
  assert.ok(er.includes("source_file ||--o| document"));
  assert.ok(er.includes("source_file ||--o{ record"));
  assert.ok(!er.includes("dim_participant"));
  assert.throws(() => uclaErDefinition(catalog, "ucla_mart"), /modeled schema/);
});

test("fact views include their dimensions and ancestor keys without unrelated facts", () => {
  const phenotype = uclaErDefinition(catalog, "ucla_core", "fact_phenotype_response");
  assert.ok(phenotype.includes("dim_dataset {"));
  assert.ok(phenotype.includes("dim_instrument {"));
  assert.ok(phenotype.includes("dim_measure {"));
  assert.ok(!phenotype.includes("fact_scan_availability"));
  const scans = uclaErDefinition(catalog, "ucla_core", "fact_scan_availability");
  assert.ok(scans.includes("dim_scanner |o..o{ fact_scan_availability"));
  assert.ok(scans.includes("dim_dataset {"));
  assert.ok(!scans.includes("dim_instrument"));
  assert.throws(() => uclaErDefinition(catalog, "ucla_core", "missing"), /Unknown fact/);
});
