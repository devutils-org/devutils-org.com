import { writeFile, readFile, access, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pages, route, translation } from '../src/pages.ts'
import { SITE } from '../src/site.ts'
import { esc } from '../src/html.ts'
import { seoDocument, bookDescription } from '../src/seo-audit.ts'

import { loadEntries } from '../src/library/load.ts'
import { libraryPages, libraryTitle } from '../src/library/render.ts'

const dist = resolve(import.meta.dirname, '../dist')
const urls = new Set<string>()
const titles = new Set<string>()
for (const page of pages) {
  const url = `${SITE}${route(page)}`
  if (urls.has(url) || titles.has(page.title)) throw new Error(`Duplicate SEO entry: ${page.file}`)
  urls.add(url)
  titles.add(page.title)
  const html = await readFile(resolve(dist, page.file), 'utf8')
  if (!html.includes(`<link rel="canonical" href="${esc(url)}"`) || !html.includes('<h1') || !html.includes(esc(page.description))) {
    throw new Error(`Missing built content or metadata: ${page.file}`)
  }
  await access(resolve(dist, `og/${page.preview ?? 'main'}.png`))
}
// Preserve the existing static book URLs and discover every exported chapter.
const bookEntries: string[] = []
const bookDir = resolve(dist, 'tools/atfq/book')
for (const file of (await readdir(bookDir)).filter(file => file.endsWith('.html')).sort()) {
  const path = resolve(bookDir, file)
  let html = await readFile(path, 'utf8')
  const title = seoDocument(html).title
  if (!title) throw new Error(`Book page has no title: ${file}`)
  const url = `${SITE}/tools/atfq/book/${file === 'index.html' ? '' : file}`
  const attributeTitle = esc(title)
  const description = bookDescription(html) ?? `${title} — ATFQ Linux reference book.`
  const structured = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url, inLanguage: 'en', isPartOf: { '@type': 'Book', name: 'The atfq book', url: `${SITE}/tools/atfq/book/` }, publisher: { '@type': 'Organization', name: 'devutils', url: `${SITE}/` } }).replace(/</g, '\\u003c')
  html = html.replace(/<!-- generated-seo:start -->[\s\S]*?<!-- generated-seo:end -->\n?/g, '')
  html = html.replace('</head>', `<!-- generated-seo:start -->
<link rel="canonical" href="${esc(url)}" />
<meta name="description" content="${esc(description)}" />
<meta property="og:title" content="${attributeTitle}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${SITE}/og/atfq.png" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${structured}</script>
<!-- generated-seo:end -->
</head>`)
  await writeFile(path, html)
  bookEntries.push(`  <url><loc>${esc(url)}</loc></url>`)
}
const library = libraryPages(loadEntries())
const libraryEntries = []
for (const page of library) {
  const url = `${SITE}${page.route}`
  if (urls.has(url)) throw new Error(`Duplicate generated route: ${page.route}`)
  urls.add(url)
  const html = await readFile(resolve(dist, `${page.route.slice(1)}index.html`), 'utf8')
  if (!html.includes(`<link rel="canonical" href="${esc(url)}"`) || !html.includes('<h1')) throw new Error(`Missing generated content: ${page.route}`)
  if (titles.has(libraryTitle(page))) throw new Error(`Duplicate library title: ${page.title}`)
  titles.add(libraryTitle(page))
  const counterpart = page.entity ? library.find(p=>p.entity === page.entity && p.locale !== page.locale) : library.find(p=>p.route === (page.locale === 'fr' ? page.route.slice(3) : `/fr${page.route}`))
  const alternates = counterpart ? [page,counterpart] : [page]
  const english = alternates.find(p=>p.locale === 'en') ?? page
  for (const p of alternates) if (!html.includes(`hreflang="${p.locale}" href="${SITE}${p.route}"`)) throw new Error(`Missing alternate for ${page.route}`)
  if (!html.includes('application/ld+json') || !html.includes(`property="og:url" content="${url}"`)) throw new Error(`Missing discovery metadata: ${page.route}`)
  if (!page.noindex) libraryEntries.push(`  <url><loc>${esc(url)}</loc>${page.updated ? `<lastmod>${page.updated}</lastmod>` : ''}${alternates.map(p=>`<xhtml:link rel="alternate" hreflang="${p.locale}" href="${SITE}${p.route}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${english.route}"/></url>`)
}
const entries = pages.map(page => {
  const other = translation(page)
  const english = page.lang === 'en' ? page : other
  return `  <url><loc>${esc(`${SITE}${route(page)}`)}</loc>${[page, other].map(p => `<xhtml:link rel="alternate" hreflang="${p.lang}" href="${esc(`${SITE}${route(p)}`)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${SITE}${route(english)}`)}"/></url>`
})
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...entries, ...libraryEntries, ...bookEntries].join('\n')}\n</urlset>\n`)
await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`SEO: verified ${pages.length} existing pages, ${library.length} library pages and enriched ${bookEntries.length} book pages; generated sitemap.xml and robots.txt for ${SITE}`)
