// Inlines the built JS and CSS into index.html so the page runs from file://.
// Browsers refuse to load external module scripts from a file:// origin.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = fileURLToPath(new URL('../dist-static', import.meta.url))
const htmlPath = join(outDir, 'index.html')
let html = readFileSync(htmlPath, 'utf8')

const read = (href) => readFileSync(join(outDir, href.replace(/^\.\//, '')), 'utf8')

html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (match, href) =>
  href.startsWith('./assets/') ? `<style>\n${read(href)}\n</style>` : match,
)

html = html.replace(/<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>/g, (match, src) =>
  src.startsWith('./assets/')
    ? `<script type="module">\n${read(src).replace(/<\/script/gi, '<\/script')}\n</script>`
    : match,
)

// Public assets are written as root-relative paths; make them relative too.
html = html.replace(/(href|src)="\/(?!\/)/g, '$1="./')

writeFileSync(htmlPath, html)

if (existsSync(join(outDir, 'assets'))) rmSync(join(outDir, 'assets'), { recursive: true, force: true })
console.log(`inlined ${htmlPath} (${Math.round(html.length / 1024)} kB)`)
