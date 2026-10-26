import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const near=(x:number,y:number)=>assert.ok(Math.abs(x-y)<1e-10,`${x} != ${y}`)
test('timing examples derive setup and hold slack from explicit launch and capture edges',()=>{
 const entry=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='concept.static-timing-analysis')!
 assert.ok(entry)
 const rows=[...entry.body.matchAll(/^\| ([\d.]+) \| (-?[\d.]+) \| ([\d.]+) \| (-?[\d.]+) \| (-?[\d.]+) \|$/gm)]
 assert.equal(rows.length,4)
 for(const [,period,skew,delay,setup,hold] of rows){
  const latest=0.4+2.8+ +delay,earliest=0.1+0.05+ +delay
  near(+setup,+period+ +skew-0.3-latest)
  near(+hold,earliest-(+skew+0.2))
 }
 near(0.4+2.8+0.3,3.5)
 near(4-0.1-0.3-(0.4+2.8+0.1),0.3)
 near(0.1+0.05+0.1-(-0.1+0.2),0.15)
 assert.match(entry.body,/setup slack is 0.3 ns and hold slack is 0.15 ns/)
})
