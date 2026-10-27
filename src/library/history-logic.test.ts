import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('history logic examples distinguish valid inference from counterexamples under their modern interpretations',()=>{
 const entry=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.origins-of-logic')!
 assert.ok(entry)
 const subset=(a:Set<number>,b:Set<number>)=>[...a].every(x=>b.has(x))
 const sets=Array.from({length:8},(_,mask)=>new Set([0,1,2].filter(x=>mask&(1<<x))))
 for(const a of sets)for(const b of sets)for(const c of sets)if(subset(a,b)&&subset(b,c))assert.ok(subset(a,c))
 const a=new Set([1]),b=new Set([1,2]),c=new Set([1,2,3])
 assert.ok(subset(a,b)&&subset(b,c));assert.equal(subset(c,a),false);assert.ok(c.has(3)&&!a.has(3))
 let reversedCounterexample=false
 for(const p of [false,true])for(const q of [false,true]){
  const implies=!p||q
  if(implies&&p)assert.ok(q)
  if(implies&&q&&!p)reversedCounterexample=true
 }
 assert.ok(reversedCounterexample)
 assert.match(entry.body,/A = \{1\}, B = \{1, 2\}, C = \{1, 2, 3\}/)
 assert.match(entry.body,/Set P false and Q true/)
 assert.deepEqual(entry.prerequisites,['history.origins-of-information'])
})
