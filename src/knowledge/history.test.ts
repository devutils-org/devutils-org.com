import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries,parseEntry} from './load.ts'
import {knowledgePages} from './render.ts'
test('history distinguishes undated chapters from dated events in both indexes and timelines',()=>{
 const entries=loadEntries(undefined,{allowStaleChecks:true})
 const chapter=entries.find(e=>e.id==='history.origins-of-information')!
 assert.ok(chapter);assert.equal(chapter.history_kind,'chapter');assert.equal(chapter.date_start,undefined)
 const pages=knowledgePages(entries)
 for(const prefix of ['', '/fr']){
  const index=pages.find(p=>p.route===prefix+'/history/')!
  assert.ok(index.body.includes('href="/history/origins-of-information/"'))
  const timeline=pages.find(p=>p.route===prefix+'/history/timeline/')!
  assert.ok(!timeline.body.includes('href="/history/origins-of-information/"'))
  assert.ok(timeline.body.includes('href="/history/birth-of-computer-science/switching-circuit-logic/"'))
  assert.ok(timeline.body.includes('data-start="1937" data-end="1938"'))
 }
 const metadata=`id: history.fixture\ntype: history\nlocale: en\nslug: fixture\ntitle: Test\nsummary: Test\nstatus: draft\nupdated: 2026-10-26\nsources: []\n`
 const fixture=(extra:string,base=metadata)=>`---\n${base}${extra}\n---\n## Example\nTest.`
 assert.doesNotThrow(()=>parseEntry(fixture('history_kind: chapter'),'chapter.md'))
 assert.throws(()=>parseEntry(fixture('history_kind: chapter\ndate_start: "1937"'),'chapter.md'),/must not carry event dates/)
 assert.throws(()=>parseEntry(fixture('history_kind: event'),'event.md'),/requires date_start/)
 assert.throws(()=>parseEntry(fixture('history_kind: other'),'bad.md'),/invalid history_kind/)
 assert.throws(()=>parseEntry(fixture('history_kind: chapter',metadata.replace('type: history','type: concept')),'bad.md'),/invalid history_kind/)
})
test('origins of information examples preserve quantities, positional values and codebook distinctions',()=>{
 const chapter=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.origins-of-information')!
 assert.match(chapter.body,/205 = 2 × 100 \+ 0 × 10 \+ 5 × 1/)
 assert.equal(2*100+0*10+5,205);assert.equal(2*10+5,25);assert.equal(2*60+5,125)
 assert.equal(3*100+4,304);assert.equal(3*60+4,184)
 assert.match(chapter.body,/3 × 60 \+ 4 = 184/)
 const record='G:3;S:2'.split(';').map(v=>v.split(':'))
 assert.deepEqual(Object.fromEntries(record.map(([category,count])=>[category,Number(count)])),{G:3,S:2})
 assert.equal(record.reduce((sum,[,count])=>sum+Number(count),0),5)
 assert.match(chapter.body,/G:3;S:2/)
})
