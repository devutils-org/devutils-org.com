import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadEntries } from './load.ts'
import { contentHash, checkHash, validateReview } from './review.ts'
import { verificationHtml } from './verification.ts'
const entries=loadEntries(),entry=entries.find(e=>e.id==='concept.logic-gates')!
const review=()=>structuredClone(entry.verification!)
test('an article, source or example change invalidates its source assessment',()=>{
  const record=review()
  for(const changed of [{...entry,body:entry.body+'\nNew assertion.'},{...entry,title:'New title'},{...entry,sources:[{title:'Changed',url:'https://example.org'}]}]) {
    assert.notEqual(contentHash(changed),record.contentHash)
    assert.throws(()=>validateReview(record,changed,'review.json'),/stale content/)
    assert.throws(()=>validateReview(record,changed,'review.json',true),/stale content/)
  }
})
test('review validation rejects unsupported citations, stale checks and fictitious human approval',()=>{
  const blocked=review();blocked.claims[0].citations.forEach(c=>c.access='blocked')
  assert.throws(()=>validateReview(blocked,entry,'review.json'),/no source read/)
  const missing=review();missing.claims[0].citations[0].source=999
  assert.throws(()=>validateReview(missing,entry,'review.json'),/invalid citation/)
  const anchor=review();anchor.claims[0].section='article-absent'
  assert.throws(()=>validateReview(anchor,entry,'review.json'),/missing article section/)
  const stale=review();stale.examples[0]={...stale.examples[0],result:'passed',checkedAt:'2026-10-24',evidenceHash:'bad'}
  assert.throws(()=>validateReview(stale,entry,'review.json'),/stale or undated/)
  assert.doesNotThrow(()=>validateReview(stale,entry,'review.json',true))
  const fake=review();fake.humanReview={status:'completed',reviewer:'Codex',reviewedAt:'2026-10-24',scope:'Everything',record:'docs/reviews/signoffs/fake.md'}
  assert.throws(()=>validateReview(fake,entry,'review.json'),/named reviewer/)
  fake.humanReview={...fake.humanReview,reviewer:'Example human'}
  assert.throws(()=>validateReview(fake,entry,'review.json'),/missing or empty/)
})
test('every published record exposes scoped evidence and keeps human approval pending',()=>{
  assert.equal(entries.filter(e=>e.status==='published').length,58)
  for(const e of entries) {
    const record=e.verification!
    assert.ok(record.claims.length>0)
    assert.equal(record.humanReview.status,'pending')
    for(const result of record.examples) if(result.result==='passed') assert.equal(result.evidenceHash,checkHash(result.check))
    const html=verificationHtml(e)
    assert.match(html,/Independent human review pending/)
    assert.match(html,/does not certify every sentence/)
    assert.doesNotMatch(html,/100% correct|Human review recorded:/)
  }
})
