import { test } from 'node:test'
import assert from 'node:assert/strict'
import { head } from './shell.ts'
import { pages, route } from './pages.ts'
import { SITE } from './site.ts'

test('all translations share reciprocal alternate URLs and the English default', () => {
  for (const page of pages) {
    const html = head(page)
    const english = pages.find(p => p.key === page.key && p.lang === 'en')!
    for (const lang of ['en', 'fr']) {
      const alternate = pages.find(p => p.key === page.key && p.lang === lang)!
      assert.ok(html.includes(`hreflang="${lang}" href="${SITE}${route(alternate)}"`))
    }
    assert.ok(html.includes(`hreflang="x-default" href="${SITE}${route(english)}"`))
  }
})

test('JSON-LD cannot close its containing script, and preserves source text', () => {
  const title = '</script><script>alert("test")</script>'
  const html = head({ ...pages[0], title })
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]
  assert.ok(!json.includes('<'))
  const entities = JSON.parse(json)
  assert.equal(entities.find((entity: { '@type': string }) => entity['@type'] === 'WebPage').name, title)
})
