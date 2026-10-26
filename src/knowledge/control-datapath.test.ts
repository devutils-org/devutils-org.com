import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
import {alu} from './alu.ts'
test('control and datapath path respects prerequisite order and simultaneous register capture',()=>{
 const entries=loadEntries(undefined,{allowStaleChecks:true})
 const get=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e);return e}
 const path=get('path.digital-control-and-datapaths')
 assert.deepEqual(path.prerequisites,['path.digital-logic-foundations'])
 const completed=new Set(['path.digital-logic-foundations',...get('path.digital-logic-foundations').steps!])
 assert.equal(path.steps!.length,2)
 for(const id of path.steps!){const e=get(id);assert.equal(e.status,'published');for(const p of e.prerequisites)assert.ok(completed.has(p));completed.add(id)}
 const transitions=new Map([...get('concept.finite-state-machines').body.matchAll(/^\| ([ABCD]) \| ([ABCD]) \| ([ABCD]) \|$/gm)].map(r=>[r[1],[r[2],r[3]]]))
 const rows=[...path.body.matchAll(/^\| (\d) \| ([01]) \| ([ABCD]) \| ([ABCD]) \| ([01]) \| ([01]{4}) \|$/gm)]
 assert.equal(rows.length,5)
 let state='A',t=0
 for(const [i,row] of rows.entries()){
  const [,edge,bit,before,after,write,stored]=row
  assert.equal(+edge,i+1);assert.equal(before,state)
  const enabled=state==='D'
  if(enabled)t=alu(7,1,'ADD').r
  state=transitions.get(state)![+bit]
  assert.equal(after,state);assert.equal(+write,Number(enabled));assert.equal(parseInt(stored,2),t)
 }
 assert.equal(state,'D');assert.equal(t,8)
 assert.match(path.body,/capture again at edge 6/)
 assert.deepEqual(alu(7,1,'ADD'),{r:8,c:0,v:1,z:0,n:1})
})
