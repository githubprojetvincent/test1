import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 8080);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
  const safePath = path.normalize(pathname).replace(/^([.][.][/\\])+/, "");
  let filePath = path.join(publicDir, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(publicDir + path.sep) && filePath !== path.join(publicDir, "index.html")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) filePath = path.join(publicDir, "index.html");
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400"
    });
    fs.createReadStream(filePath)
      .on("error", () => { if (!res.headersSent) res.writeHead(404); res.end("Not found"); })
      .pipe(res);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`NVTRACK website listening on port ${port}`);
});
