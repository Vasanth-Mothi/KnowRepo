const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const Portal = require("./agents/Agent_Portal");
const RSSNews = require("./agents/Agent_RSSNews");
const InternalStore = require("./agents/Agent_InternalStore");

const root = __dirname;
const contentTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };

function sendJson(response, status, payload) { response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }); response.end(JSON.stringify(payload)); }
function readBody(request) { return new Promise(resolve => { let body = ""; request.on("data", chunk => body += chunk); request.on("end", () => { try { resolve(JSON.parse(body || "{}")); } catch { resolve({}); } }); }); }

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) {
    if (request.method === "GET" && url.pathname === "/api/portal") return sendJson(response, 200, Portal.getPortal());
    if (request.method === "GET" && url.pathname === "/api/profile") return sendJson(response, 200, require("./agents/Agent_Login").getProfile());
    if (request.method === "GET" && url.pathname === "/api/news") return sendJson(response, 200, { items: RSSNews.getItems(), status: RSSNews.getStatus() });
    if (request.method === "GET" && url.pathname === "/api/artifacts") return sendJson(response, 200, { items: InternalStore.getArtifacts() });
    if (request.method === "GET" && url.pathname === "/api/saved") return sendJson(response, 200, { saved: InternalStore.getSaved() });
    if (request.method === "PUT" && url.pathname.startsWith("/api/saved/")) { const id = decodeURIComponent(url.pathname.split("/").pop()); const body = await readBody(request); return sendJson(response, InternalStore.setSaved(id, Boolean(body.saved)) ? 200 : 404, { saved: InternalStore.getSaved() }); }
    if (request.method === "POST" && url.pathname === "/api/events") { const body = await readBody(request); InternalStore.recordEvent(body.id, body.type); return sendJson(response, 202, { accepted: true }); }
    if (request.method === "POST" && url.pathname === "/api/refresh") return sendJson(response, 200, await RSSNews.refresh());
    if (request.method === "POST" && url.pathname === "/api/digests") return sendJson(response, 202, { status: "preparing", requestedAt: new Date().toISOString() });
    return sendJson(response, 404, { error: "API route not found" });
  }
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.resolve(root, `.${requested}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) return sendJson(response, 404, { error: "File not found" });
  response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(response);
});

if (require.main === module) server.listen(process.env.PORT || 3000, () => console.log(`Know portal running at http://localhost:${process.env.PORT || 3000}`));
module.exports = server;