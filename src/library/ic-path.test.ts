import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('IC reading route teaches prerequisites and reproduces its combined accumulator and timing exercise',()=>{
 const entries=loadEntries(undefined,{allowStaleChecks:true})
 const get=(id:string)=>{const entry=entries.find(e=>e.id===id);assert.ok(entry);return entry}
 const path=get('path.integrated-circuit-design')
 assert.deepEqual(path.steps,['concept.rtl-and-hardware-description','concept.simulation-and-verification','concept.synthesis-and-technology-mapping','concept.static-timing-analysis','concept.physical-design','concept.asic-and-fpga'])
 const completed=new Set<string>()
 for(const id of path.prerequisites){const prerequisite=get(id);for(const p of prerequisite.prerequisites)assert.ok(completed.has(p));for(const step of prerequisite.steps??[])completed.add(step);completed.add(id)}
 for(const id of path.steps!){const chapter=get(id);assert.equal(chapter.status,'published');for(const p of chapter.prerequisites)assert.ok(completed.has(p),`${id} needs ${p}`);completed.add(id)}
 let q=0,prior=0
 for(const d of [9,8]){const old=q;q=(q+d)%16;prior=old}
 assert.deepEqual([q,prior],[1,9])
 assert.match(path.body,/q = 0001 and prior = 1001/)
 const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-10)
 near(4-0.3-(0.4+2.8),0.5);near(5-0.3-(0.4+2.8),1.5);near(0.1+0.05-0.2,-0.05)
 assert.match(path.body,/1.5 ns, while hold slack remains -0.05 ns/)
})
