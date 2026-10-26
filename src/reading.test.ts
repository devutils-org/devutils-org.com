import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toolReadingHtml, articleToolsHtml } from './reading.ts'
import { loadEntries } from './knowledge/load.ts'
import { documentHtml, knowledgePages } from './knowledge/render.ts'

test('curated tool links resolve to translated lessons and do not spill into unrelated subjects', () => {
  const pages = knowledgePages(loadEntries())
  for (const locale of ['en', 'fr'] as const) {
    for (const tool of ['omn', 'atfq', 'distroproof', 'xpac', 'vmanyware']) {
      const html = toolReadingHtml(tool, locale)
      assert.ok(html.includes('related-reading'))
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) assert.ok(pages.some(p => p.route === href && p.locale === locale), `${tool}: ${href}`)
    }
    for (const entity of ['concept.units-and-scale', 'concept.models-and-abstraction']) {
      const page = pages.find(p => p.entity === entity && p.locale === locale)!
      assert.match(documentHtml(page, pages), /id="in-practice-tools"/)
      assert.match(articleToolsHtml(entity, locale), new RegExp(`href="${locale === 'fr' ? '/fr' : ''}/tools/omn/"`))
    }
  }
  assert.equal(articleToolsHtml('concept.atoms-and-bonding', 'en'), '')
  assert.equal(toolReadingHtml('about'), '')
})
