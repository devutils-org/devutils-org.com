import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('FSM detector matches suffix oracle for every stream through ten bits and reset overrides each transition',()=>{
 const entry=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='concept.finite-state-machines')
 assert.ok(entry)
 const rows=[...entry.body.matchAll(/^\| ([ABCD]) \| ([ABCD]) \| ([ABCD]) \|$/gm)]
 assert.equal(rows.length,4)
 const transitions=new Map(rows.map(r=>[r[1],[r[2],r[3]]]))
 const step=(s:string,b:number,reset=false)=>reset?'A':transitions.get(s)![b]
 let count=0
 for(let length=0;length<=10;length++)for(let n=0;n<2**length;n++){
  const bits=length?n.toString(2).padStart(length,'0'):''
  let state='A',history=''
  for(const bit of bits){history+=bit;state=step(state,Number(bit));assert.equal(state==='D',history.endsWith('101'),history)}
  count++
 }
 assert.equal(count,2047)
 for(const state of transitions.keys())for(const bit of [0,1])assert.equal(step(state,bit,true),'A')
 const traces=[...entry.body.matchAll(/^\| (\d) \| ([01]) \| ([ABCD]) \| ([ABCD]) \| ([01]) \|$/gm)]
 assert.equal(traces.length,5)
 let state='A'
 for(const [, ,bit,before,after,output] of traces){assert.equal(before,state);state=step(state,Number(bit));assert.equal(after,state);assert.equal(Number(output),Number(state==='D'))}
 state='A';const states=[],outputs=[]
 for(const bit of '110101'){state=step(state,Number(bit));states.push(state);outputs.push(Number(state==='D'))}
 assert.deepEqual(states,['B','B','C','D','C','D']);assert.deepEqual(outputs,[0,0,0,1,0,1])
 assert.match(entry.body,/B, B, C, D, C, D/)
})
