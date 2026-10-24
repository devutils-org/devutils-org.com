import { writeFile, readFile, access, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pages, route, translation } from '../src/pages.ts'
import { SITE } from '../src/site.ts'
import { esc } from '../src/html.ts'

import { loadEntries } from '../src/knowledge/load.ts'
import { knowledgePages } from '../src/knowledge/render.ts'

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
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]
  if (!title) throw new Error(`Book page has no title: ${file}`)
  const url = `${SITE}/tools/atfq/book/${file === 'index.html' ? '' : file}`
  const attributeTitle = title.replace(/"/g, '&quot;')
  html = html.replace(/<!-- generated-seo:start -->[\s\S]*?<!-- generated-seo:end -->\n?/g, '')
  html = html.replace('</head>', `<!-- generated-seo:start -->
<link rel="canonical" href="${esc(url)}" />
<meta name="description" content="${attributeTitle} — ATFQ Linux reference book." />
<meta property="og:title" content="${attributeTitle}" />
<meta property="og:description" content="${attributeTitle} — ATFQ Linux reference book." />
<meta property="og:type" content="website" />
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="${SITE}/og/atfq.png" />
<meta name="twitter:card" content="summary_large_image" />
<!-- generated-seo:end -->
</head>`)
  await writeFile(path, html)
  bookEntries.push(`  <url><loc>${esc(url)}</loc></url>`)
}
const knowledge = knowledgePages(loadEntries())
const knowledgeEntries = []
for (const page of knowledge) {
  const url = `${SITE}${page.route}`
  if (urls.has(url)) throw new Error(`Duplicate generated route: ${page.route}`)
  urls.add(url)
  const html = await readFile(resolve(dist, `${page.route.slice(1)}index.html`), 'utf8')
  if (!html.includes(`<link rel="canonical" href="${esc(url)}"`) || !html.includes('<h1')) throw new Error(`Missing generated content: ${page.route}`)
  if (titles.has(`${page.title} — devutils`)) throw new Error(`Duplicate knowledge title: ${page.title}`)
  titles.add(`${page.title} — devutils`)
  const counterpart = page.entity ? knowledge.find(p=>p.entity === page.entity && p.locale !== page.locale) : knowledge.find(p=>p.route === (page.locale === 'fr' ? page.route.slice(3) : `/fr${page.route}`))
  const alternates = counterpart ? [page,counterpart] : [page]
  const english = alternates.find(p=>p.locale === 'en') ?? page
  for (const p of alternates) if (!html.includes(`hreflang="${p.locale}" href="${SITE}${p.route}"`)) throw new Error(`Missing alternate for ${page.route}`)
  if (!html.includes('application/ld+json') || !html.includes(`property="og:url" content="${url}"`)) throw new Error(`Missing discovery metadata: ${page.route}`)
  knowledgeEntries.push(`  <url><loc>${esc(url)}</loc>${page.updated ? `<lastmod>${page.updated}</lastmod>` : ''}${alternates.map(p=>`<xhtml:link rel="alternate" hreflang="${p.locale}" href="${SITE}${p.route}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${english.route}"/></url>`)
}
const entries = pages.map(page => {
  const other = translation(page)
  const english = page.lang === 'en' ? page : other
  return `  <url><loc>${esc(`${SITE}${route(page)}`)}</loc>${[page, other].map(p => `<xhtml:link rel="alternate" hreflang="${p.lang}" href="${esc(`${SITE}${route(p)}`)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${SITE}${route(english)}`)}"/></url>`
})
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...entries, ...knowledgeEntries, ...bookEntries].join('\n')}\n</urlset>\n`)
await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`SEO: verified ${pages.length} existing pages, ${knowledge.length} knowledge pages and enriched ${bookEntries.length} book pages; generated sitemap.xml and robots.txt for ${SITE}`)
