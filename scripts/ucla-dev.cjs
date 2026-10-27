"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const handler = require("../api/ucla.js");
const root = path.resolve(__dirname, "..");
const mime = { ".md": "text/markdown", ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2" };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/ucla") {
      if (req.method === "POST") {
        let size = 0;
        const chunks = [];
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 16_384) { res.writeHead(413); res.end("Request too large"); return; }
          chunks.push(chunk);
        }
        req.body = Buffer.concat(chunks).toString("utf8");
      }
      return await handler(req, res);
    }
    if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); res.end(); return; }
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    if (!path.extname(pathname)) pathname += ".html";
    const file = path.resolve(root, "." + pathname);
    const publicPath = /^\/(?:assets\/|case-studies\/|aws-study-guide\/|index\.html$|aws-study-guide\.html$|docs\/aws-data-eng-associate\.md$)/.test(pathname);
    if (!file.startsWith(root + path.sep) || !publicPath || pathname.split("/").some((part) => part.startsWith(".")) || !mime[path.extname(file)]) {
      res.writeHead(404); res.end("Not found"); return;
    }
    const stat = await fs.promises.stat(file);
    if (!stat.isFile()) throw new Error("Not a file");
    res.writeHead(200, { "Content-Type": mime[path.extname(file)], "Cache-Control": "no-store" });
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(file).pipe(res);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end("Not found");
  }
});
server.listen(Number(process.env.PORT || 8002), "127.0.0.1", () => {
  console.log("UCLA playground: http://127.0.0.1:" + server.address().port + "/case-studies/ucla-playground.html");
});
