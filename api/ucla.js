"use strict";
const { runQuery, liveCatalog, QueryError } = require("../server/ucla.cjs");
const requests = new Map();

function send(res, status, value) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(value));
}

async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Use GET or POST." });
  }
  // shortcut: per-instance rate limit; add a shared/WAF limit for heavy public traffic.
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0];
  const now = Date.now();
  for (const [key, value] of requests) if (value.until <= now) requests.delete(key);
  const window = requests.get(ip) || { count: 0, until: now + 60_000 };
  if (window.count >= 30 || (!requests.has(ip) && requests.size >= 2048)) {
    res.setHeader("Retry-After", "60");
    return send(res, 429, { error: "Query limit reached. Try again in a minute.", code: "RATE_LIMITED" });
  }
  window.count++;
  requests.set(ip, window);
  try {
    if (req.method === "GET") return send(res, 200, await liveCatalog());
    if (Number(req.headers["content-length"] || 0) > 16_384) throw new QueryError("The request is too large.", 413);
    let body = req.body;
    if (typeof body === "string") {
      if (Buffer.byteLength(body) > 16_384) throw new QueryError("The request is too large.", 413);
      try { body = JSON.parse(body); } catch { throw new QueryError("Send a JSON query request."); }
    }
    return send(res, 200, await runQuery(body?.sql));
  } catch (error) {
    if (error instanceof QueryError) return send(res, error.status, { error: error.message, code: error.code });
    if (error.code === "57014") return send(res, 408, { error: "Query exceeded 2.5 seconds. Add filters or simplify joins.", code: "QUERY_TIMEOUT" });
    if (["42601", "42703", "42P01", "42883", "42804", "22012", "22003", "42501"].includes(error.code)) {
      return send(res, 400, { error: error.message, code: "SQL_ERROR" });
    }
    console.error("UCLA query unavailable:", error.code || error.name);
    return send(res, 503, { error: "Live queries are temporarily unavailable.", code: "DATABASE_UNAVAILABLE" });
  }
}
module.exports = handler;
