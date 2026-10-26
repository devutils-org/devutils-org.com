import { auditSeo, seoDocument } from '../src/seo-audit.ts'
import { SITE } from '../src/site.ts'

// Read-only post-deployment check. Limit concurrency and require same-origin
// URLs before fetching entries from the public sitemap.
async function get(path: string) {
  const url = new URL(path, SITE)
  if (url.origin !== SITE) throw Error(`Unexpected sitemap origin: ${url}`)
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000), redirect: 'error' })
  if (response.status !== 200) throw Error(`${url}: HTTP ${response.status}`)
  return { response, body: await response.text() }
}
const robots = await get('/robots.txt')
if (!robots.body.includes(`Sitemap: ${SITE}/sitemap.xml`) || /^Disallow:\s*\/\s*$/mi.test(robots.body)) throw Error('Unexpected robots.txt directives')
const sitemap = await get('/sitemap.xml')
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'))
if (!urls.length) throw Error('Empty sitemap')
const documents = new Map<string, string>()
let next = 0
await Promise.all(Array.from({ length: Math.min(4, urls.length) }, async () => {
  while (next < urls.length) {
    const url = urls[next++]
    const { response, body } = await get(url)
    if (!response.headers.get('content-type')?.includes('text/html')) throw Error(`${url}: expected HTML`)
    if (/noindex|none/i.test(response.headers.get('x-robots-tag') ?? '')) throw Error(`${url}: X-Robots-Tag blocks indexing`)
    documents.set(new URL(url).pathname, body)
  }
}))
for (const path of ['/knowledge/search/', '/fr/knowledge/search/']) {
  const { body } = await get(path)
  if (!seoDocument(body).noindex) throw Error(`${path}: search page must be noindex`)
  documents.set(path, body)
}
const report = auditSeo(documents, urls, SITE)
console.log(`Live SEO: ${SITE}, ${report.documents} pages fetched, ${report.errors.length} errors`)
if (report.warnings.length) console.log(report.warnings.join('\n'))
if (report.errors.length) throw Error(report.errors.join('\n'))
