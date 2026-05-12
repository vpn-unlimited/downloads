const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4177);
const host = "127.0.0.1";
const basePath = normalizeBasePath(process.env.BASE_PATH || "");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  const rawPath = decodeURIComponent((request.url || "/").split("?")[0] || "/");
  const strippedPath = stripBasePath(rawPath);
  const safePath = strippedPath.endsWith("/") ? `${strippedPath}index.html` : strippedPath;
  const filePath = path.resolve(rootDir, `.${safePath}`);

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(content);
  });
});

server.listen(port, host, () => {
  const previewPath = `${basePath || ""}/downloads/windows/`.replace(/\/{2,}/g, "/");
  console.log(`Downloads static server: http://${host}:${port}${previewPath}`);
});

function normalizeBasePath(value) {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

function stripBasePath(requestPath) {
  if (!basePath) {
    return requestPath;
  }

  if (requestPath === basePath) {
    return "/";
  }

  if (requestPath.startsWith(`${basePath}/`)) {
    return requestPath.slice(basePath.length) || "/";
  }

  return requestPath;
}
