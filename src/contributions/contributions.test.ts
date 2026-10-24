import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { contributionsPage, rugPage } from './content.ts'
import { evidence, parsing, construction, projects } from './projects.ts'
import { reportMarkdown } from './reports.ts'
import { toolPageHtml } from '../toolpage/render.ts'
import { pageOf, route, translation } from '../pages.ts'

const root = resolve(import.meta.dirname, '../..')
test('contribution records have translated project routes and actual report downloads', () => {
  for (const lang of ['en', 'fr'] as const) {
    const index = toolPageHtml(contributionsPage(lang))
    const detail = toolPageHtml(rugPage(lang))
    assert.doesNotMatch(index.main + detail.main, /data-copy|id="install-/, 'report actions contain no copyable command')
    const path = route(pageOf('contributions-rug', lang))
    assert.match(index.main, new RegExp(`href="${path}"`))
    assert.equal(translation(pageOf('contributions-rug', lang)).lang, lang === 'en' ? 'fr' : 'en')
    for (const { nav, main } of [index, detail]) {
      const ids = new Set([...main.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))
      for (const [, id] of nav.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(id), `missing section ${id}`)
    }
    assert.match(detail.main, new RegExp(`href="/contributions/rug/report.${lang}.md" download`))
    assert.equal(readFileSync(resolve(root, `public/contributions/rug/report.${lang}.md`), 'utf8'), reportMarkdown(lang))
    for (const [, href] of detail.main.matchAll(/href="(\/contributions\/rug\/[^"#]+\.(?:json|csv|md))"/g)) {
      assert.ok(existsSync(resolve(root, 'public' + href)), href)
    }
  }
})

test('the RUG record distinguishes submitted PRs, independent results and measurement limits', () => {
  const en = toolPageHtml(rugPage('en')).main
  const fr = toolPageHtml(rugPage('fr')).main
  assert.ok(projects.some(project => project.slug === 'rug'))
  assert.deepEqual(evidence.pullRequests.map(p => p.number), [1, 2, 3])
  for (const pr of evidence.pullRequests) assert.ok(en.includes(pr.url) && fr.includes(pr.url))
  assert.equal((en.match(/contribution-status open/g) ?? []).length, evidence.pullRequests.filter(p => p.state === 'OPEN' && !p.mergedAt).length)
  assert.match(en, /not be multiplied/)
  assert.match(en, /without LTO|no LTO/)
  assert.match(en, /not re-tested on the four-distro matrix/)
  assert.match(en, /no RUG maintainer endorsement/)
  assert.match(fr, /aucune approbation du mainteneur/)
  assert.match(en, /missing permissions/)
  assert.doesNotMatch(en + fr, /\/home\/moha|file:\/\/|github\.com\/devutils-org\/omniscient/)
})

test('published summaries cover every benchmark shape and agree with measured raw pairs', () => {
  assert.equal(parsing.length, 18)
  assert.equal(construction.length, 6)
  for (const [kind, summary] of [['parsing', parsing], ['construction', construction]] as const) {
    const csv = readFileSync(resolve(root, `public/contributions/rug/${kind}-measured-pairs.csv`), 'utf8').trim().split('\n').slice(1).map(line => line.replace(/\r$/, '').split(','))
    assert.equal(csv.length, kind === 'parsing' ? 180 : 60)
    for (const row of summary) {
      const ratios = csv.filter(r => r[0] === row.dataset && (!('chunk' in row) || Number(r[1]) === row.chunk)).map(r => Number(r[6]) / Number(r[5])).sort((a, b) => a - b)
      assert.equal(ratios.length, 10)
      const median = (ratios[4] + ratios[5]) / 2
      const expected = 'ratio_candidate_over_baseline' in row ? row.ratio_candidate_over_baseline : row.ratio
      assert.ok(Math.abs(median - expected) < 1e-12, row.dataset)
    }
  }
  assert.deepEqual(JSON.parse(readFileSync(resolve(root, 'public/contributions/rug/method.json'), 'utf8')), evidence)
})
