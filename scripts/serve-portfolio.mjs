import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "../artifacts/samiam3d/dist/public");
const port = Number(process.env.PORT || 5000);
const contentTypes = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json", ".ttf": "font/ttf", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
};

createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }); res.end(); return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = resolve(publicDir, `.${pathname}`);
    if (file !== publicDir && !file.startsWith(publicDir + sep)) {
      res.writeHead(403); res.end(); return;
    }
    try {
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith("/")) {
          const search = new URL(req.url, "http://localhost").search;
          res.writeHead(308, { Location: pathname + "/" + search }); res.end(); return;
        }
        file = resolve(file, "index.html");
      }
      await stat(file);
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      // Only extensionless portfolio URLs use SPA fallback. Missing game
      // files and assets must return 404 instead of silently showing the site.
      if (extname(pathname) || /^\/(games|silverback-dead-circuit)(\/|$)/.test(pathname)) {
        res.writeHead(404); res.end("Not found"); return;
      }
      file = resolve(publicDir, "index.html");
    }
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": contentTypes[extname(file)] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": (extname(file) === ".html" || file.endsWith("/sw.js")) ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 500);
    res.end(error instanceof URIError ? "Bad request" : "Unable to serve page");
  }
}).listen(port, "0.0.0.0", () => console.log(`Portfolio listening on port ${port}`));
