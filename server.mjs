import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
};

createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relativePath = requestPath.replace(/^[/\\]+/, "") || "index.html";
    let filePath = resolve(root, relativePath);
    if (relative(root, filePath).startsWith("..")) throw new Error("Invalid path");
    if ((await stat(filePath)).isDirectory()) filePath = resolve(filePath, "index.html");
    const data = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Westmore Beauty prototype running at http://127.0.0.1:${port}`);
});
