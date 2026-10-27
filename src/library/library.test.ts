import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEntries, parseEntry, validateEntries, entryRoute, target, validDate } from './load.ts'
import { markdown } from './markdown.ts'
import { documentHtml, libraryPages } from './render.ts'
import { pages as existing, route } from '../pages.ts'
const entries = loadEntries()
const concept = entries.find(e => e.id === 'concept.boolean-algebra')!

test('ingestion rejects malformed metadata with a source filename', () => {
  for (const text of ['nothing', '---\ntitle: Incomplete\n---\nText', '---\ninvalid: [\n---\nText']) assert.throws(() => parseEntry(text, 'bad.md'), /bad.md:/)
  assert.equal(validDate('2026-02-30'), false)
  assert.equal(validDate('1937'), true)
  assert.equal(validDate('2026-13'), false)
})
test('identity supports translations and rejects collisions and dangling references', () => {
  const french = { ...concept, locale: 'fr' as const, slug: 'algebre-booleenne' }
  assert.doesNotThrow(() => validateEntries([...entries, french]))
  assert.equal(target([...entries, french], concept.id, 'fr'), french)
  assert.equal(target(entries, concept.id, 'fr'), concept)
  assert.throws(() => validateEntries([...entries, concept]), /duplicate record/)
  assert.throws(() => validateEntries([...entries, { ...concept, id: 'concept.other' }]), /duplicate route/)
  assert.throws(() => validateEntries([...entries, { ...french, type: 'figure' }]), /conflicting type/)
  assert.throws(() => validateEntries([{...concept, related:['concept.missing']}]), /unknown relation/)
  assert.throws(() => validateEntries(entries.map(e => e.id === concept.id ? {...e, prerequisites:[e.id]} : e)), /prerequisite cycle/)
  assert.throws(() => validateEntries(entries.map(e => e.type === 'figure' ? {...e, status:'draft'} : e)), /unpublished target/)
})
test('Markdown escapes HTML and rejects executable URLs while giving headings stable unique anchors', () => {
  const parsed = markdown('## Example\n<script>alert(1)</script>\n\n## Example\n\n```js\n<script>\n```')
  assert.doesNotMatch(parsed.html, /<script>/)
  assert.match(parsed.html, /&lt;script&gt;/)
  assert.deepEqual(parsed.toc.map(t => t.id), ['article-example','article-example-2'])
  for (const url of ['javascript:alert(1)', '//evil.example', 'data:text/html,x']) assert.throws(() => markdown(`[bad](${url})`), /Unsafe content URL/)
})
test('published manifest is deterministic, preserves English-only articles and omits drafts', () => {
  const pages = libraryPages(entries)
  assert.equal(pages.length, 16 + entries.filter(e => e.status === 'published').length)
  assert.deepEqual(pages, libraryPages([...entries].reverse()))
  assert.ok(pages.some(p => p.route === '/library/computing-stack/'))
  assert.ok(!pages.some(p => p.route === `/fr${entryRoute(concept)}`))
  const extra = {...concept, id:'concept.draft', slug:'draft', status:'draft' as const}
  assert.deepEqual(libraryPages([...entries, extra]), pages)
  const html = documentHtml(pages.find(p => p.entity === concept.id)!, pages)
  assert.doesNotMatch(html, /<canvas|<script type="module"|hreflang="fr"/)
  assert.match(html, /article non traduit/)
})
test('generated documents have unique IDs, working internal links and real no-JS article content', () => {
  const pages = libraryPages(entries)
  const docs = new Map(pages.map(p => [p.route, documentHtml(p, pages)]))
  const old = new Set(existing.map(route))
  for (const [path, html] of docs) {
    assert.equal((html.match(/<h1>/g) ?? []).length, 1, path)
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])
    assert.equal(new Set(ids).size, ids.length, path)
    assert.ok(!old.has(path), `overwrites existing route ${path}`)
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (/^https?:/.test(href)) continue
      const url = new URL(href, `https://test.local${path}`)
      const dest = docs.get(url.pathname)
      if (url.hash) assert.ok(dest?.includes(`id="${url.hash.slice(1)}"`), `${path}: missing anchor ${href}`)
      else assert.ok(dest || old.has(url.pathname) || existsSync(resolve('public', url.pathname.slice(1))) || existsSync(resolve(url.pathname.slice(1))), `${path}: missing ${href}`)
    }
  }
})


test('all five content contracts validate dates, sources and required type-specific fields', () => {
  const base = `id: concept.fixture
type: concept
locale: en
slug: fixture
title: Fixture
summary: Fixture summary
status: draft
updated: 2026-10-24
sources: []`
  const fixture = (metadata: string) => `---\n${metadata}\n---\n## Example\nOriginal text.`
  for (const [before, after, error] of [
    ['type: concept', 'type: invalid', /invalid type/],
    ['locale: en', 'locale: es', /invalid locale/],
    ['slug: fixture', 'slug: ../escape', /invalid slug/],
    ['status: draft', 'status: unknown', /invalid status/],
    ['updated: 2026-10-24', 'updated: 2026-02-30', /updated/],
    ['status: draft', 'status: published', /need sources/],
    ['sources: []', 'sources: [{title: Test, url: "javascript:bad"}]', /invalid source URL/],
  ] as const) assert.throws(() => parseEntry(fixture(base.replace(before, after)), 'fixture.md'), error)
  assert.throws(() => parseEntry(fixture(base + '\nunknown: value'), 'fixture.md'), /unknown field/)
  const history = base.replace('type: concept', 'type: history')
  assert.throws(() => parseEntry(fixture(history), 'event.md'), /date_start/)
  assert.throws(() => parseEntry(fixture(history + '\ndate_start: "1937"\ndate_precision: day'), 'event.md'), /precision mismatch/)
  assert.doesNotThrow(() => parseEntry(fixture(history + '\ndate_start: "1937"\ndate_precision: year'), 'event.md'))
  assert.doesNotThrow(() => parseEntry(fixture(base.replace('type: concept','type: figure') + '\nborn: "1916"'), 'figure.md'))
  for (const type of ['path','lab']) assert.throws(() => parseEntry(fixture(base.replace('type: concept',`type: ${type}`)), `${type}.md`), /requires/)
  assert.doesNotThrow(() => parseEntry(fixture(base.replace('type: concept','type: path') + '\nsteps: [concept.fixture]'), 'path.md'))
  assert.doesNotThrow(() => parseEntry(fixture(base.replace('type: concept','type: lab') + '\nsteps: [Evaluate]\nrequirements: [Browser]\nexpected_results: [Expected output]'), 'lab.md'))
})
