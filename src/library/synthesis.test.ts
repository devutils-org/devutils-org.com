import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('synthesis examples preserve binary truth table and shared arithmetic for every operand and select',()=>{
 const entry=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='concept.synthesis-and-technology-mapping')!
 assert.ok(entry)
 const rows=[...entry.body.matchAll(/^\| ([01]) \| ([01]) \| ([01]) \| ([01]) \|$/gm)]
 assert.equal(rows.length,4)
 const seen=new Set<string>()
 for(const [,a,b,original,simple] of rows){seen.add(a+b);assert.equal(+original,(+a&+b)|(+a&(1-+b)));assert.equal(+simple,+a);assert.equal(original,simple)}
 assert.equal(seen.size,4)
 let count=0
 for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let c=0;c<16;c++)for(let d=0;d<16;d++)for(const s of [0,1]){
  const parallel=s?((c+d)&15):((a+b)&15)
  const x=s?c:a,y=s?d:b
  assert.equal((x+y)%16,parallel);count++
 }
 assert.equal(count,131072)
 const costs=entry.body.match(/costs 2 × (\d+) \+ (\d+) = (\d+) units/)
 assert.ok(costs);assert.equal(2*+costs[1]+ +costs[2],+costs[3])
 assert.match(entry.body,/20 \+ 2 × 6 = 32/);assert.equal(20+2*6,32);assert.equal(46-32,14)
 assert.equal(2*12+6,30);assert.equal(12+2*6,24)
})
