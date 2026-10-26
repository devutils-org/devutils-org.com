import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('network history examples preserve serialization accounting, request identity and causal order',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.connected-world')!
 assert.ok(e)
 const packet=100+20,rate=1000
 assert.equal(packet/rate,0.12);assert.equal(4*packet/rate,0.48)
 assert.ok(Math.abs(100/packet*100-83.33333333333333)<1e-10)
 assert.match(e.body,/A1, B1, A2, B2/)
 const code={left:'00',right:'01',stop:'10',repeat:'11'}
 assert.equal(new Set(Object.values(code)).size,4);assert.equal(code.stop,'10')
 let naive=0;naive++;naive++;assert.equal(naive,2)
 let count=0;const completed=new Map<string,number>()
 const increment=(id:string)=>{if(!completed.has(id)){count++;completed.set(id,count)}return completed.get(id)}
 assert.equal(increment('R7'),1);assert.equal(increment('R7'),1);assert.equal(count,1)
 completed.clear();assert.equal(increment('R7'),2) // Losing the record loses this guarantee.
 const edges=[['a1','send'],['send','receive'],['receive','b1']]
 const precedes=(order:string[])=>edges.every(([a,b])=>order.indexOf(a)<order.indexOf(b))
 assert.ok(precedes(['a1','send','receive','b1']))
 assert.equal(precedes(['a1','receive','send','b1']),false)
 assert.match(e.body,/record is lost on a crash/)
})
