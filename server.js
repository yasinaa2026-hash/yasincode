import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 4173;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
    const requestedPath = decodeURIComponent(requestUrl.pathname === "/" ? "/playground/index.html" : requestUrl.pathname);
    const filePath = path.resolve(projectRoot, `.${requestedPath}`);
    const relativePath = path.relative(projectRoot, filePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const file = await readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath)] ?? "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("File not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`YasinCode Playground is ready: http://127.0.0.1:${port}`);
  console.log("Keep this terminal open while using the playground. Press Ctrl+C to stop.");
});
