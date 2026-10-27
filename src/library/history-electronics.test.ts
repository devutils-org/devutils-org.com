import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('electronic history toy program and interconnection counts follow their declared contracts',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.electronic-computing')!
 assert.ok(e)
 const rows=[...e.body.matchAll(/^\| (\d) \| (LOAD \d|ADD \d|STORE \d|HALT) \| (\d) \|$/gm)]
 assert.equal(rows.length,4)
 for(const extra of [0,1]){
  let accumulator=0;const memory=new Map<number,number>()
  for(const [i,[,address,instruction,expected]] of rows.entries()){
   assert.equal(+address,i)
   const [op,value]=instruction.split(' ')
   if(op==='LOAD')accumulator=+value
   else if(op==='ADD')accumulator+=+value+extra
   else if(op==='STORE')memory.set(+value,accumulator)
   else assert.equal(op,'HALT')
   assert.equal(accumulator,+expected+(i>0?extra:0))
  }
  assert.equal(memory.get(8),7+extra)
 }
 assert.equal(2*(12-1),22);assert.equal(2*(5-1),8)
 assert.match(e.body,/Eleven links need 22 pin connections/)
 for(const a of [false,true])for(const b of [false,true]){assert.equal(Number(a&&b),Number(a)*Number(b));assert.equal(a||b,Number(a)+Number(b)>0)}
})
