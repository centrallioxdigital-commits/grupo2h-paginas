// Servidor local que imita o GitHub Pages: serve a raiz do repositório,
// abre index.html das pastas e devolve /404.html para caminho inexistente.
//   node site/serve.mjs          -> http://localhost:8792/novo/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORTA = Number(process.env.PORT) || 8792;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let arquivo = normalize(join(RAIZ, caminho));
  if (!arquivo.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
  try {
    let s = await stat(arquivo);
    if (s.isDirectory()) {
      if (!caminho.endsWith('/')) { res.writeHead(301, { Location: caminho + '/' }).end(); return; }
      arquivo = join(arquivo, 'index.html'); s = await stat(arquivo);
    }
    res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(arquivo));
  } catch {
    res.writeHead(404, { 'Content-Type': TIPOS['.html'] });
    res.end(await readFile(join(RAIZ, '404.html')).catch(() => 'Não encontrado'));
  }
}).listen(PORTA, () => console.log(`Site em http://localhost:${PORTA}/novo/`));
