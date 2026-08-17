import { mkdirSync, writeFileSync } from 'node:fs'

const pages = ['', '/nosotros', '/servicios', '/paquetes', '/contacto', '/agendar']
const domains = ['https://majosilvera.com', 'https://fisioesthetic.com']
const today = new Date().toISOString().slice(0, 10)
const entries = domains.flatMap((domain) => pages.map((path) => `  <url><loc>${domain}${path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${path === '' ? '1.0' : '0.8'}</priority></url>`))
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Keywords: majosilverafisio, majosilverafisioesthetic, fisioterapia, estética, Barranquilla -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
mkdirSync(new URL('../public/', import.meta.url), { recursive: true })
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
