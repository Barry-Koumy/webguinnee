import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, extname } from 'path'
import { existsSync, statSync, createReadStream } from 'fs'

const FUTTA_SITE = resolve(__dirname, '..', 'futta', 'webfuuta.site')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
}

function futtaAssetsPlugin() {
  return {
    name: 'futta-assets',
    configureServer(server) {
      server.middlewares.use('/futta-src', (req, res, next) => {
        const relPath  = decodeURIComponent(req.url || '/').split('?')[0]
        const filePath = resolve(FUTTA_SITE, '.' + relPath)
        try {
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream'
            res.setHeader('Content-Type', type)
            res.setHeader('Cache-Control', 'public, max-age=3600')
            createReadStream(filePath).pipe(res)
            return
          }
        } catch { /* fall through */ }
        next()
      })
    },
  }
}

export default defineConfig({
  // Servi sous https://barry-koumy.github.io/webguinnee/ (GitHub Pages, site de projet)
  base: '/webguinnee/',
  plugins: [react(), futtaAssetsPlugin()],
  server: {
    fs: { allow: ['..'] },
  },
})
