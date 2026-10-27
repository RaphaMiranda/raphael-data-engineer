"use strict";

const { Client } = require("pg");
const { parse, toSql } = require("pgsql-ast-parser");
const catalog = require("../assets/data/ucla-catalog.json");
const ROW_LIMIT = 200;
const SCHEMAS = ["ucla_raw", "ucla_core", "ucla_mart"];
const relations = new Set(catalog.relations.map((row) => row.name));
const selectTypes = new Set(["select", "with", "with recursive", "union", "union all"]);
const expressionTypes = new Set([
  ...selectTypes, "ref", "list", "array", "array select", "arrayIndex", "null", "extract",
  "integer", "numeric", "string", "boolean", "case", "binary", "unary", "cast", "call",
  "constant", "ternary", "member", "keyword", "substring", "overlay", "table", "statement",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN",
]);
const functions = new Set([
  "count", "sum", "avg", "min", "max", "round", "abs", "ceil", "ceiling", "floor",
  "coalesce", "nullif", "greatest", "least", "lower", "upper", "length", "char_length",
  "trim", "btrim", "ltrim", "rtrim", "substring", "substr", "concat", "concat_ws",
  "date_trunc", "date_part", "to_char", "row_number", "rank", "dense_rank",
]);

class QueryError extends Error {
  constructor(message, status = 400, code = "QUERY_REJECTED") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function validateSql(sql) {
  if (typeof sql !== "string" || !sql.trim() || sql.length > 8000) {
    throw new QueryError("Enter a query of up to 8,000 characters.");
  }
  let statements;
  try { statements = parse(sql); }
  catch { throw new QueryError("This SQL syntax is unsupported. Use a SELECT query or a read-only CTE."); }
  if (statements.length !== 1 || !selectTypes.has(statements[0].type)) {
    throw new QueryError("Run one SELECT query at a time.");
  }
  let nodes = 0;
  function walk(node, ctes) {
    if (!node || typeof node !== "object") return;
    if (++nodes > 2000) throw new QueryError("Simplify the query before running it.");
    if (node.type && !expressionTypes.has(node.type)) {
      throw new QueryError("Only read-only SELECT expressions are supported.");
    }
    if (node.type === "with") {
      const visible = new Set(ctes);
      for (const binding of node.bind) {
        walk(binding.statement, visible);
        visible.add(binding.alias.name);
      }
      walk(node.in, visible);
      return;
    }
    if (node.type === "with recursive") {
      const visible = new Set([...ctes, node.alias.name]);
      walk(node.bind, visible);
      walk(node.in, visible);
      return;
    }
    if (node.type === "select" && (node.for || node.skip)) {
      throw new QueryError("Row locking is unavailable in the public playground.");
    }
    if (node.type === "table") {
      const name = node.name;
      if (!(name.schema && relations.has(name.schema + "." + name.name))
          && !(name.schema === undefined && ctes.has(name.name))) {
        throw new QueryError("Choose a published table or view using its schema-qualified name.");
      }
    }
    if (node.type === "call") {
      const fn = node.function;
      if ((fn.schema && fn.schema !== "pg_catalog") || !functions.has(fn.name.toLowerCase())) {
        throw new QueryError("That function is unavailable in this educational playground.");
      }
    }
    if (node.opSchema) throw new QueryError("Custom operators are unavailable.");
    const cast = node.type === "cast" ? node.to : node.type === "constant" ? node.dataType : null;
    if (cast?.schema && cast.schema !== "pg_catalog") throw new QueryError("Use built-in PostgreSQL types.");
    Object.values(node).forEach((value) => {
      if (Array.isArray(value)) value.forEach((child) => walk(child, ctes));
      else if (value && typeof value === "object") walk(value, ctes);
    });
  }
  walk(statements[0], new Set());
  // Serialize the parsed statement so comments cannot alter the result-limit wrapper.
  return toSql.statement(statements[0]);
}

async function withReader(callback, connectionString = process.env.UCLA_DATABASE_URL) {
  if (!connectionString) throw new QueryError("Live queries are not connected yet.", 503, "DATABASE_NOT_CONFIGURED");
  const client = new Client({
    connectionString, connectionTimeoutMillis: 4000, query_timeout: 5000,
    statement_timeout: 2500, application_name: "ucla-public-playground",
  });
  try {
    await client.connect();
    await client.query("BEGIN READ ONLY");
    await client.query("SET LOCAL statement_timeout = '2500ms'");
    await client.query("SET LOCAL lock_timeout = '250ms'");
    await client.query("SET LOCAL search_path = pg_catalog");
    const { rows: [role] } = await client.query(`
      SELECT current_user = 'ucla_reader' AND NOT r.rolsuper AND NOT r.rolcreatedb
        AND NOT r.rolcreaterole AND NOT r.rolbypassrls AND NOT r.rolreplication
        AND NOT EXISTS (SELECT 1 FROM pg_auth_members WHERE member = r.oid)
        AND NOT has_database_privilege(current_user, current_database(), 'CREATE')
        AND NOT EXISTS (
          SELECT 1 FROM pg_namespace n
          WHERE n.nspname = ANY($1::text[])
            AND has_schema_privilege(current_user, n.oid, 'CREATE'))
        AND NOT EXISTS (
          SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE n.nspname = ANY($1::text[]) AND c.relkind IN ('r','p','v','m','f')
            AND (c.relowner = r.oid OR has_table_privilege(current_user, c.oid,
                'INSERT,UPDATE,DELETE,TRUNCATE,TRIGGER,REFERENCES')))
        AS safe FROM pg_roles r WHERE r.rolname = current_user
    `, [SCHEMAS]);
    if (!role?.safe) throw new QueryError("The database reader is not configured correctly.", 503, "DATABASE_ROLE_INVALID");
    return await callback(client);
  } finally {
    // A fresh connection per request prevents visitor-controlled session state from surviving.
    await client.end().catch(() => {});
  }
}

async function runQuery(sql, connectionString) {
  const normalized = validateSql(sql);
  const started = performance.now();
  return withReader(async (client) => {
    const result = await client.query({
      text: "SELECT * FROM (" + normalized + ") AS ucla_result LIMIT " + (ROW_LIMIT + 1),
      rowMode: "array",
    });
    const response = {
      columns: result.fields.map((field) => ({ name: field.name, type_oid: field.dataTypeID })),
      rows: result.rows.slice(0, ROW_LIMIT), row_count: Math.min(result.rows.length, ROW_LIMIT),
      truncated: result.rows.length > ROW_LIMIT, limit: ROW_LIMIT,
      elapsed_ms: Math.round(performance.now() - started),
    };
    if (Buffer.byteLength(JSON.stringify(response)) > 1_000_000) {
      throw new QueryError("The result is too large. Select fewer columns or rows.", 413, "RESULT_TOO_LARGE");
    }
    return response;
  }, connectionString);
}

async function liveCatalog(connectionString) {
  return withReader(async (client) => {
    const columns = await client.query(`
      SELECT n.nspname AS schema, c.relname AS table, c.relkind,
        a.attname AS name, format_type(a.atttypid, a.atttypmod) AS type,
        NOT a.attnotnull AS nullable,
        EXISTS (SELECT 1 FROM pg_constraint k WHERE k.conrelid = c.oid
          AND k.contype = 'p' AND a.attnum = ANY(k.conkey)) AS primary_key
      FROM pg_namespace n JOIN pg_class c ON c.relnamespace = n.oid
      JOIN pg_attribute a ON a.attrelid = c.oid
      WHERE n.nspname = ANY($1::text[]) AND c.relkind IN ('r','v','m')
        AND a.attnum > 0 AND NOT a.attisdropped
      ORDER BY n.nspname, c.relname, a.attnum
    `, [SCHEMAS]);
    const live = new Map();
    for (const column of columns.rows) {
      const name = column.schema + "." + column.table;
      if (!relations.has(name)) continue;
      if (!live.has(name)) live.set(name, { name, kind: column.relkind === "r" ? "table" : "view",
        columns: [], foreign_keys: [] });
      live.get(name).columns.push({ name: column.name, type: column.type,
        nullable: column.nullable, primary_key: column.primary_key });
    }
    const keys = await client.query(`
      SELECT n.nspname || '.' || c.relname AS name,
        rn.nspname || '.' || rc.relname AS referenced_table,
        ARRAY(SELECT a.attname::text FROM unnest(k.conkey) WITH ORDINALITY u(attnum,ord)
          JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=u.attnum ORDER BY ord) AS columns,
        ARRAY(SELECT a.attname::text FROM unnest(k.confkey) WITH ORDINALITY u(attnum,ord)
          JOIN pg_attribute a ON a.attrelid=rc.oid AND a.attnum=u.attnum ORDER BY ord) AS referenced_columns
      FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid
      JOIN pg_namespace n ON n.oid=c.relnamespace
      JOIN pg_class rc ON rc.oid=k.confrelid JOIN pg_namespace rn ON rn.oid=rc.relnamespace
      WHERE k.contype='f' AND n.nspname=ANY($1::text[]) ORDER BY name
    `, [SCHEMAS]);
    for (const key of keys.rows) live.get(key.name)?.foreign_keys.push({
      columns: key.columns, table: key.referenced_table, referenced_columns: key.referenced_columns,
    });
    if (live.size !== relations.size) {
      throw new QueryError("The database schema differs from the published model.", 503, "DATABASE_SCHEMA_INVALID");
    }
    return { ...catalog, live: true, relations: [...live.values()] };
  }, connectionString);
}

module.exports = { validateSql, runQuery, liveCatalog, QueryError, ROW_LIMIT };
