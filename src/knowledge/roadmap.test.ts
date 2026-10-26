import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gate, truthTable, operations } from './lab.ts'
import { loadEntries } from './load.ts'
import { aliasPages, aliasHtml, documentHtml, knowledgePages } from './render.ts'
import { checkReferences } from './links.ts'

test('gate model covers every binary combination and NOT ignores B', () => {
  const expected = {AND:[0,0,0,1], OR:[0,1,1,1], XOR:[0,1,1,0], NOT:[1,0]}
  for (const operation of operations) assert.deepEqual(truthTable(operation).map(row=>Number(row.result)),expected[operation])
  for (const a of [false,true]) assert.equal(gate('NOT',a,false),gate('NOT',a,true))
  assert.throws(()=>gate('INVALID' as 'AND',false,false),/Unknown gate/)
})
test('aliases are non-indexable and cannot shadow real routes or each other', () => {
  const entries = loadEntries(), pages = knowledgePages(entries), aliases = aliasPages(entries,pages)
  assert.equal(aliases.length,2)
  for(const alias of aliases) {
    assert.match(aliasHtml(alias),/name="robots" content="noindex"/)
    assert.match(aliasHtml(alias),/http-equiv="refresh"/)
  }
  const concept = entries.find(e=>e.id === 'concept.boolean-algebra')!
  assert.throws(()=>aliasPages([{...concept,aliases:['/knowledge/']}],pages),/Conflicting alias/)
  assert.throws(()=>aliasPages([{...concept,aliases:['/tools/omn/']}],pages),/Conflicting alias/)
  assert.throws(()=>aliasPages([{...concept,aliases:['/old/','/old/']}],pages),/Conflicting alias/)
})
test('published translations have reciprocal metadata and structured data escapes script closers', () => {
  const entries = loadEntries(), concept = entries.find(e=>e.id === 'concept.boolean-algebra')!
  const translated = {...concept,locale:'fr' as const,slug:'algebre',title:'Algèbre',aliases:[]}
  const pages = knowledgePages([...entries,translated])
  const english = pages.find(p=>p.entity === concept.id && p.locale === 'en')!
  const french = pages.find(p=>p.entity === concept.id && p.locale === 'fr')!
  for (const page of [english,french]) {
    const html = documentHtml(page,pages)
    assert.match(html,/hreflang="en"/);assert.match(html,/hreflang="fr"/)
    assert.match(html,/hreflang="x-default"/)
    const structured = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1])
    assert.equal(structured[0].dateModified,concept.updated)
    assert.equal(structured[0].inLanguage,page.locale)
  }
  const hostile = documentHtml({...english,title:'</script><script>bad</script>'},pages)
  assert.ok(!hostile.includes('</script><script>bad'))
})
test('link checker detects relative links, directory anchors, same-origin URLs and missing assets', () => {
  const docs = new Map([['/index.html','<a href="/article/#example">Good</a><a href="missing/">Bad</a><img src="/lost.png">'],['/article/index.html','<h1 id="example">Example</h1><a href="https://example.org/#absent">Bad anchor</a>']])
  const errors = checkReferences(docs,new Set(docs.keys()),'https://example.org')
  assert.equal(errors.length,3)
  assert.ok(errors.some(e=>e.includes('missing/')))
  assert.ok(errors.some(e=>e.includes('lost.png')))
  assert.ok(errors.some(e=>e.includes('missing anchor')))
})
test('paths resolve all steps, lab publishes a no-JS experiment, normal articles have no JS module', () => {
  const pages=knowledgePages(loadEntries())
  const path=pages.find(p=>p.entity === 'path.logic-to-circuits')!,lab=pages.find(p=>p.kind === 'lab')!,concept=pages.find(p=>p.kind === 'concept')!
  assert.match(path.body,/<ol><li><a href="\/knowledge\/digital-logic\/boolean-algebra\//)
  assert.match(lab.body,/XOR truth table/)
  assert.match(documentHtml(lab,pages),/<script type="module"/)
  assert.doesNotMatch(documentHtml(concept,pages),/<script type="module"/)
})
