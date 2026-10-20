// Dependency-free, loopback-only preview. It also serves the GitHub Pages prefix.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.SHSM_PREVIEW_PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain' };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  pathname = pathname.replace(/^\/glen-reyes-shsm(?=\/|$)/, '') || '/';
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || relative.split(/[\\/]/).some((part) => part.startsWith('.')) || !types[path.extname(file)]) {
    response.writeHead(404).end('Not found'); return;
  }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404).end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' });
    response.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}/glen-reyes-shsm/`));
