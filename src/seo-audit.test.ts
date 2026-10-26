import { test } from 'node:test'
import assert from 'node:assert/strict'
import { auditSeo, seoDocument, bookDescription } from './seo-audit.ts'

const origin = 'https://example.org'
test('book descriptions use the visible summary, preserve code and escape on serialization', () => {
  const summary = bookDescription('<p>Navigation text</p><section class="tldr"><ul><li>A <code>kernel</code> &amp; its "interfaces".</li><li>Another idea.</li></ul></section>')
  assert.equal(summary, 'A kernel & its "interfaces".')
  assert.equal(bookDescription('<h1>A chapter hub</h1>'), undefined)
  const long = bookDescription(`<section class="tldr"><ul><li>${'A useful explanation. '.repeat(30)}</li></ul></section>`)!
  assert.ok(long.length <= 180)
  assert.ok(long.endsWith('…'))
})
function page(route: string, lang = 'en', alternate?: string) {
  return `<!doctype html><html lang="${lang}"><head><title>${lang} &amp; ${route}</title><meta name="description" content="A useful description for ${lang} ${route}"><link rel="canonical" href="${origin}${route}">${alternate ? `<link rel="alternate" hreflang="${lang === 'en' ? 'fr' : 'en'}" href="${origin}${alternate}">` : ''}<meta property="og:url" content="${origin}${route}"><meta property="og:title" content="Title"><meta property="og:description" content="Description"><meta property="og:image" content="${origin}/image.png"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script></head><body><h1>Useful title</h1><a href="/">Home</a><a href="/fr/">Français</a></body></html>`
}

test('SEO audit reads HTML entities and validates reciprocal translated canonical pages', () => {
  const en = page('/', 'en', '/fr/'), fr = page('/fr/', 'fr', '/')
  assert.equal(seoDocument(en).title, 'en & /')
  const report = auditSeo(new Map([['/', en], ['/fr/', fr]]), [`${origin}/`, `${origin}/fr/`], origin)
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.warnings, [])
})

test('SEO audit catches broken canonicals, duplicate titles, malformed data and missing language reciprocity', () => {
  const broken = page('/fr/', 'fr').replace('<title>fr &amp; /fr/</title>', '<title>en &amp; /</title>').replace(`href="${origin}/fr/"`, 'href="https://wrong.example/"').replace('{"@context":"https://schema.org","@type":"WebPage"}', '{bad}')
  const report = auditSeo(new Map([['/', page('/', 'en', '/fr/')], ['/fr/', broken]]), [`${origin}/`, `${origin}/fr/`], origin)
  for (const message of ['canonical must equal', 'title duplicates', 'Invalid JSON-LD', 'nonreciprocal language alternate']) assert.ok(report.errors.some(error => error.includes(message)), message)
})

test('SEO audit excludes noindex utility pages and rejects sitemap-only or duplicate URLs', () => {
  const search = page('/search/').replace('</head>', '<meta name="robots" content="noindex,follow"></head>')
  const docs = new Map([['/', page('/')], ['/search/', search]])
  const valid = auditSeo(docs, [`${origin}/`], origin)
  assert.deepEqual(valid.errors, [])
  assert.equal(valid.excluded, 1)
  const invalid = auditSeo(docs, [`${origin}/`, `${origin}/`, `${origin}/search/`, `${origin}/missing/`], origin)
  for (const message of ['noindex URL in sitemap', 'duplicate URLs', 'not an indexable canonical page']) assert.ok(invalid.errors.some(error => error.includes(message)))
})
