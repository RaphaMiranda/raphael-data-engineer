const test = require("node:test");
const assert = require("node:assert/strict");
const { validateSql, runQuery, liveCatalog } = require("../server/ucla.cjs");
const readerUrl = process.env.UCLA_DATABASE_URL || process.env.DATABASE_URL;

test("accepts published data joins, aggregations, literals, CTEs and unions", () => {
  for (const sql of [
    "SELECT p.diagnosis, COUNT(*) FROM ucla_core.dim_participant p GROUP BY p.diagnosis",
    "SELECT p.diagnosis, COUNT(*) FROM ucla_core.fact_scan_availability f JOIN ucla_core.dim_participant p USING (participant_key) GROUP BY p.diagnosis",
    "WITH c AS (SELECT * FROM ucla_raw.source_file) SELECT COUNT(*) FROM c",
    "WITH c AS (SELECT * FROM ucla_raw.source_file), d AS (SELECT * FROM c) SELECT COUNT(*) FROM d",
    "SELECT 'delete; drop table' AS example",
    "SELECT * FROM ucla_mart.scan_coverage UNION ALL SELECT * FROM ucla_mart.scan_coverage",
    "SELECT * FROM ucla_core.dim_participant; -- a trailing comment",
  ]) assert.ok(validateSql(sql), sql);
});

test("rejects writes, multiple statements, writable CTEs, side-effect functions and catalogs", () => {
  for (const sql of [
    "DELETE FROM ucla_core.dim_participant",
    "SELECT 1; DROP TABLE ucla_core.dim_participant",
    "WITH changed AS (DELETE FROM ucla_core.dim_participant RETURNING *) SELECT * FROM changed",
    "SELECT * INTO copied FROM ucla_core.dim_participant",
    "SELECT * FROM ucla_core.dim_participant FOR UPDATE",
    "SELECT pg_sleep(3)", "SELECT set_config('default_transaction_read_only','off',false)",
    "SELECT * FROM pg_catalog.pg_roles", "SELECT * FROM public.secrets",
    "SELECT * FROM dim_participant", "SELECT public.count(1)", "COPY ucla_core.dim_participant TO STDOUT",
    "WITH pg_roles AS (SELECT * FROM pg_roles) SELECT * FROM pg_roles",
    "SELECT * FROM pg_roles WHERE EXISTS (WITH pg_roles AS (SELECT * FROM ucla_raw.source_file) SELECT * FROM pg_roles)",
    "", "SELECT " + "1,".repeat(4001),
  ]) assert.throws(() => validateSql(sql), undefined, sql);
});

test("live database queries reconcile counts, enforce row limits and refuse an owner account",
  { skip: !readerUrl }, async () => {
    const result = await runQuery("SELECT COUNT(*) AS people FROM ucla_core.dim_participant");
    assert.equal(result.rows[0][0], "272");
    const raw = await runQuery("SELECT * FROM ucla_raw.source_file");
    assert.equal(raw.row_count, 134);
    const truncated = await runQuery("SELECT * FROM ucla_core.fact_phenotype_response");
    assert.equal(truncated.row_count, 200);
    assert.equal(truncated.truncated, true);
    const catalog = await liveCatalog();
    assert.equal(catalog.live, true);
    assert.equal(catalog.relations.length, 17);
    assert.ok(catalog.relations.find((row) => row.name === "ucla_core.dim_participant").columns.find((column) => column.name === "participant_key").primary_key);
    const foreignKey = catalog.relations.find((row) => row.name === "ucla_core.dim_participant").foreign_keys[0];
    assert.deepEqual(foreignKey.columns, ["dataset_key"]);
    assert.deepEqual(foreignKey.referenced_columns, ["dataset_key"]);
    if (process.env.UCLA_ADMIN_DATABASE_URL) {
      await assert.rejects(runQuery("SELECT 1", process.env.UCLA_ADMIN_DATABASE_URL), { code: "DATABASE_ROLE_INVALID" });
    }
  });

test("PostgreSQL itself denies writes with the public credentials",
  { skip: !readerUrl }, async () => {
    const { Client } = require("pg");
    const client = new Client({ connectionString: readerUrl });
    await client.connect();
    try {
      await client.query("SET default_transaction_read_only = off");
      await assert.rejects(client.query("DELETE FROM ucla_core.dim_participant WHERE false"), { code: "42501" });
      await assert.rejects(client.query("DROP TABLE ucla_core.dim_participant"), { code: "42501" });
    } finally { await client.end(); }
  });

function apiRequest(method, body, headers = {}) {
  const handler = require("../api/ucla.js");
  return new Promise((resolve, reject) => {
    const res = { statusCode: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; },
      end(value) { resolve({ status: this.statusCode, body: JSON.parse(value), headers: this.headers }); } };
    handler({ method, body, headers, socket: { remoteAddress: "test-default" } }, res).catch(reject);
  });
}

test("API rejects unsupported methods and oversized requests, and enforces its request window", async () => {
  assert.equal((await apiRequest("DELETE")).status, 405);
  assert.equal((await apiRequest("POST", {}, { "content-length": "20000" })).status, 413);
  for (let i = 0; i < 30; i++) {
    assert.equal((await apiRequest("POST", { sql: "DELETE FROM ucla_core.dim_participant" },
      { "x-forwarded-for": "test-rate-window" })).status, 400);
  }
  assert.equal((await apiRequest("POST", { sql: "SELECT 1" },
    { "x-forwarded-for": "test-rate-window" })).status, 429);
});

test("an expensive public SELECT is canceled by PostgreSQL and reported as a timeout",
  { skip: !readerUrl }, async () => {
    const result = await apiRequest("POST", { sql: "SELECT COUNT(*) FROM ucla_core.fact_phenotype_response a CROSS JOIN ucla_core.fact_phenotype_response b" });
    assert.equal(result.status, 408);
    assert.equal(result.body.code, "QUERY_TIMEOUT");
    assert.equal((await runQuery("SELECT COUNT(*) FROM ucla_core.dim_participant")).rows[0][0], "272");
  });


test("accepts DATABASE_URL and preserves the explicit UCLA connection override", async (t) => {
  const { Client } = require("pg");
  const previous = { UCLA_DATABASE_URL: process.env.UCLA_DATABASE_URL, DATABASE_URL: process.env.DATABASE_URL };
  let user;
  const sentinel = new Error("No network connection in configuration test");
  t.mock.method(Client.prototype, "connect", async function () { user = this.connectionParameters.user; throw sentinel; });
  t.mock.method(Client.prototype, "end", async () => {});
  try {
    delete process.env.UCLA_DATABASE_URL;
    process.env.DATABASE_URL = "postgresql://standard_reader@localhost/test";
    await assert.rejects(runQuery("SELECT 1"), (error) => error === sentinel);
    assert.equal(user, "standard_reader");
    process.env.UCLA_DATABASE_URL = "postgresql://explicit_reader@localhost/test";
    await assert.rejects(runQuery("SELECT 1"), (error) => error === sentinel);
    assert.equal(user, "explicit_reader");
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
