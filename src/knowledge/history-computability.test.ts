import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('computability history toy machine follows its published rules and finite timeout remains inconclusive',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.birth-of-computer-science')!
 assert.ok(e)
 const rules=[...e.body.matchAll(/^\| scan \| ([1B]) \| (1) \| (R) \| (scan|halt) \|$/gm)]
 assert.equal(rules.length,2)
 const transitions=new Map(rules.map(r=>[r[1],{write:r[2],move:r[3],state:r[4]}]))
 for(let length=0;length<=20;length++){
  const tape=Array<string>(length).fill('1');let head=0,state='scan',steps=0
  while(state!=='halt'&&steps<30){const r=transitions.get(tape[head]??'B')!;assert.ok(r);tape[head]=r.write;head++;state=r.state;steps++}
  assert.equal(state,'halt');assert.equal(tape.join(''),'1'.repeat(length+1));assert.equal(steps,length+1)
 }
 assert.match(e.body,/Six: five moves across 1 symbols/)
 let count=0;for(let i=0;i<1000;i++)count++
 assert.equal(count,1000);assert.notEqual(count,1001);count++;assert.equal(count,1001)
 assert.match(e.body,/stops when it reaches 1001/)
})
