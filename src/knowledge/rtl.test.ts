import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('RTL accumulator model preserves reset priority, hold, modulo sum and simultaneous old-state capture',()=>{
 const entry=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='concept.rtl-and-hardware-description')!
 assert.ok(entry)
 const transition=(q:number,prior:number,d:number,reset:number,enable:number)=>reset?[0,0]:enable?[(q+d)%16,q]:[q,prior]
 for(let q=0;q<16;q++)for(let prior=0;prior<16;prior++)for(let d=0;d<16;d++){
  assert.deepEqual(transition(q,prior,d,1,1),[0,0])
  assert.deepEqual(transition(q,prior,d,1,0),[0,0])
  assert.deepEqual(transition(q,prior,d,0,0),[q,prior])
  const [next,old]=transition(q,prior,d,0,1)
  assert.equal(next,(q+d)&15);assert.equal(old,q)
 }
 const rows=[...entry.body.matchAll(/^\| (\d) \| ([01]) \| ([01]) \| ([01]{4}) \| ([01]{4}|unknown) \| ([01]{5}|unknown) \| ([01]{4}) \| ([01]{4}) \|$/gm)]
 assert.equal(rows.length,6)
 let q=NaN,prior=NaN
 for(const [index,row] of rows.entries()){
  const [,edge,reset,enable,d,before,sum,after,previous]=row
  assert.equal(+edge,index+1)
  if(index){assert.equal(parseInt(before,2),q);assert.equal(parseInt(sum,2),q+parseInt(d,2))}else{assert.equal(before,'unknown');assert.equal(sum,'unknown')}
  ;[q,prior]=transition(q,prior,parseInt(d,2),+reset,+enable)
  assert.equal(parseInt(after,2),q);assert.equal(parseInt(previous,2),prior)
 }
 let state=transition(0,0,15,0,1);assert.deepEqual(state,[15,0])
 state=transition(state[0],state[1],15,0,1);assert.deepEqual(state,[14,15])
 assert.match(entry.body,/q = 1110 and prior = 1111/)
 assert.match(entry.body,/No synthesis tool was run/)
})
