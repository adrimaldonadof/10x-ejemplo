const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0].replace(/^\/+/, "");
  const rel = pathname === "" ? "index.html" : path.normalize(pathname);
  const filePath = path.resolve(publicDir, rel);
  const base = path.resolve(publicDir);
  const outside = path.relative(base, filePath).startsWith("..") || path.isAbsolute(path.relative(base, filePath));

  if (outside) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("No encontrado");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
