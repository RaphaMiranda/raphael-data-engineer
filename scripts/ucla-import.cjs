"use strict";

const { Client } = require("pg");
const { from: copyFrom } = require("pg-copy-streams");
const { pipeline } = require("node:stream/promises");
const { createReadStream } = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash, randomBytes } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function importWarehouse(handoff, readerEnv = path.join(root, "build/ucla/reader.env")) {
  handoff = path.resolve(handoff);
  const manifest = JSON.parse(await fs.readFile(path.join(handoff, "manifest.json"), "utf8"));
  const profile = JSON.parse(await fs.readFile(path.join(handoff, "profile.json"), "utf8"));
  if (manifest.format_version !== 1) throw new Error("Unsupported handoff format");
  const sqlRoot = path.join(root, "projects/ucla/postgres");
  const schemaSql = await fs.readFile(path.join(sqlRoot, "schema.sql"), "utf8");
  const expected = [...schemaSql.matchAll(/CREATE TABLE (ucla_\w+\.\w+)/g)].map((match) => match[1]);
  const tables = manifest.relations.filter((relation) => relation.kind === "table");
  if (JSON.stringify(tables.map((table) => table.name)) !== JSON.stringify(expected)) {
    throw new Error("The handoff table contract differs from the final PostgreSQL schema");
  }
  for (const table of tables) {
    if (table.file !== table.name + ".csv") throw new Error("Unexpected CSV filename");
    if (hash(await fs.readFile(path.join(handoff, table.file))) !== table.sha256) {
      throw new Error("CSV checksum differs for " + table.name);
    }
  }
  readerEnv = path.resolve(readerEnv);
  try { await fs.access(readerEnv); throw new Error("Reader env already exists; preserve it and use a fresh setup"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (!process.env.UCLA_ADMIN_DATABASE_URL) throw new Error("Set UCLA_ADMIN_DATABASE_URL privately before importing");
  const client = new Client({ connectionString: process.env.UCLA_ADMIN_DATABASE_URL, connectionTimeoutMillis: 8000 });
  const password = randomBytes(32).toString("hex");
  try {
    await client.connect();
    await client.query("BEGIN");
    await client.query(schemaSql);
    for (const table of tables) {
      const [schema, name] = table.name.split(".");
      const { rows } = await client.query(
        "SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position",
        [schema, name]);
      if (JSON.stringify(rows.map((row) => row.column_name)) !== JSON.stringify(table.columns.map((column) => column.name))) {
        throw new Error("Column contract differs for " + table.name);
      }
      await pipeline(createReadStream(path.join(handoff, table.file)),
        client.query(copyFrom("COPY " + table.name + " FROM STDIN WITH (FORMAT CSV, HEADER true, NULL '\\N')")));
      const { rows: [count] } = await client.query("SELECT COUNT(*) AS n FROM " + table.name);
      if (Number(count.n) !== table.row_count) throw new Error("Row count differs for " + table.name);
      console.log("Loaded " + table.name + ": " + count.n);
    }
    await client.query(await fs.readFile(path.join(sqlRoot, "marts.sql"), "utf8"));
    await client.query(await fs.readFile(path.join(sqlRoot, "reader.sql"), "utf8"));
    const { rows: [quoted] } = await client.query("SELECT quote_literal($1) AS password", [password]);
    await client.query("ALTER ROLE ucla_reader PASSWORD " + quoted.password);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
  const readerUrl = new URL(process.env.UCLA_ADMIN_DATABASE_URL);
  readerUrl.username = "ucla_reader";
  readerUrl.password = password;
  await fs.mkdir(path.dirname(readerEnv), { recursive: true });
  await fs.writeFile(readerEnv, "DATABASE_READER_URL=" + readerUrl.href + "\n", { flag: "wx" });
  const catalog = { format_version: 1, generated_at: manifest.generated_at, dataset: manifest.dataset,
    counts: manifest.counts, quality: manifest.quality, live: false,
    relations: manifest.relations.map(({ file, sha256, ...relation }) => relation) };
  const snapshot = Object.fromEntries(["generated_at", "dataset", "counts", "quality", "marts"].map((key) => [key, profile[key]]));
  await fs.writeFile(path.join(root, "assets/data/ucla-catalog.json"), JSON.stringify(catalog) + "\n");
  await fs.writeFile(path.join(root, "assets/data/ucla-warehouse.json"), JSON.stringify(snapshot) + "\n");
  console.log("Import reconciled. The private reader connection was written to the selected output file.");
}

if (require.main === module) {
  const handoff = process.argv[2];
  if (!handoff) { console.error("Usage: npm run ucla:import -- <handoff-folder> [reader-env-output]"); process.exitCode = 1; }
  else importWarehouse(handoff, process.argv[3]).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { importWarehouse };
