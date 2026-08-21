import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

const root = join(process.cwd(), 'public')
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml'
}

createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  const path = pathname === '/health' ? null : join(root, pathname === '/' ? 'index.html' : pathname)
  if (pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify({ ok: true, service: 'propuesta-serana-clases-operativas' }))
  }
  if (!path || !path.startsWith(root) || !existsSync(path)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    return res.end('Not found')
  }
  res.writeHead(200, { 'content-type': mime[extname(path)] || 'application/octet-stream' })
  createReadStream(path).pipe(res)
}).listen(Number(process.env.PORT || 3000), '0.0.0.0')
