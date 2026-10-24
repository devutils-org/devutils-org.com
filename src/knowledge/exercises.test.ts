import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadEntries } from './load.ts'
import { gate } from './lab.ts'
const entries=loadEntries()
const body=(id:string)=>entries.find(e=>e.id===id)!.body

test('article substitutions, capacities, signed sums and completion answers are reproducible',()=>{
  const boolean=body('concept.boolean-algebra')
  const rows=boolean.slice(boolean.indexOf('| A | B | A AND B')).split('\n').slice(2,6)
  assert.equal(rows.length,4)
  rows.forEach((line,i)=>{
    const [a,b,and,or]=line.split('|').slice(1,-1).map(v=>Number(v.trim()))
    assert.equal(a*2+b,i);assert.equal(and,a*b);assert.equal(or,Math.min(a+b,1))
  })
  for(const a of [false,true])for(const b of [false,true])for(const c of [false,true]) {
    assert.equal(a&&(b||c),(a&&b)||(a&&c))
    if(!a)assert.equal(a&&(b||c),false)
  }
  assert.equal(true&&(false||true),true)
  const nand=(a:boolean,b:boolean)=>!gate('AND',a,b)
  for(const a of [false,true])for(const b of [false,true]) {
    const t=nand(a,b);assert.equal(nand(t,t),gate('AND',a,b))
    assert.equal(nand(a,a),!a)
  }
  assert.match(body('concept.logic-gates'),/indicator = E AND clear/)
  const mux=body('concept.combinational-logic')
  assert.ok(mux.includes('D0 = 1010 and D1 = 0111'))
  const choose=(s:number,a:string,b:string)=>s===0?a:b
  assert.equal(choose(0,'1010','0111'),'1010');assert.equal(choose(1,'1010','0111'),'0111')
  const add=body('concept.binary-adders')
  assert.ok(add.includes('1111 and 0001'));assert.equal(0b1111+1,0b10000)
  const signed=(n:number)=>n>=8?n-16:n
  assert.equal(signed(0b0111),7);assert.equal(signed((0b0111+1)&15),-8)
  assert.ok(add.includes('−8 through 7'))
  assert.match(body('concept.memory-and-registers'),/4 words × 4 bits = 16 bits/)
  assert.equal(4*4/8,2);assert.equal(8*16/8,16);assert.equal(2**3,8)
  let q=0b101
  const trace=[1,0,1].map(e=>{q=e?(q+1)%8:q;return q.toString(2).padStart(3,'0')})
  assert.deepEqual(trace,['110','110','111'])
  assert.ok(body('concept.sequential-logic').includes('110, 110 and 111'))
  assert.equal((0b111+1)%8,0)
  assert.equal(Math.round((0.7+3.4+0.5)*10)/10,4.6)
  assert.ok(4<4.6 && 5>4.6)
  assert.ok(body('path.digital-logic-foundations').includes('1111 + 0001'))
})
test('the introductory path references published content and its gate exercise is correct',()=>{
  const path=entries.find(e=>e.id==='path.logic-to-circuits')!
  for(const id of path.steps??[])assert.ok(entries.some(e=>e.id===id&&e.status==='published'))
  assert.equal(gate('OR',true,true),true);assert.equal(gate('XOR',true,true),false)
  assert.ok(path.body.includes('both inputs are 1'))
})
