import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const TYPES = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async (req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
  try {
    const s = await stat(f);
    if (s.isDirectory()) throw new Error('dir');
    const body = await readFile(f);
    res.writeHead(200, {'Content-Type': TYPES[extname(f)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain'}); res.end('404 ' + p);
  }
}).listen(4173, () => console.log('serving on http://localhost:4173'));
