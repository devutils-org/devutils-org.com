import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadEntries } from './load.ts'
const entries = loadEntries()
const entry = (id:string) => {
  const found = entries.find(e=>e.id === id)
  assert.ok(found,`Missing ${id}`)
  return found
}
function table(id:string, header:string) {
  const body=entry(id).body
  const start=body.indexOf(header)
  assert.notEqual(start,-1,`Missing table ${header}`)
  return body.slice(start).split('\n').slice(2).filter((line, index, lines)=>line.startsWith('|') && lines.slice(0,index).every(l=>l.startsWith('|'))).map(line=>line.split('|').slice(1,-1).map(cell=>cell.trim()))
}
test('published gate, selector and full-adder tables cover all inputs and match their specifications', () => {
  const gates=table('concept.logic-gates','| A | B | NAND')
  assert.equal(gates.length,4)
  gates.forEach((row,i)=>{
    const [a,b,nand,nor,xnor]=row.map(Number)
    assert.equal(a*2+b,i)
    assert.deepEqual([nand,nor,xnor],[Number(a+b!==2),Number(a+b===0),Number(a===b)])
  })
  const mux=table('concept.combinational-logic','| S | D0 | D1 | Y |')
  assert.equal(mux.length,8)
  mux.forEach((row,i)=>{
    const [s,d0,d1,y]=row.map(Number)
    assert.equal(s*4+d0*2+d1,i)
    assert.equal(y,s===0?d0:d1)
  })
  const adder=table('concept.binary-adders','| A | B | Cin | S | Cout |')
  assert.equal(adder.length,8)
  adder.forEach((row,i)=>{
    const [a,b,cin,sum,cout]=row.map(Number)
    assert.equal(a*4+b*2+cin,i)
    assert.ok([a,b,cin,sum,cout].every(bit=>bit===0||bit===1))
    assert.equal(sum+2*cout,a+b+cin)
  })
  const columns=table('concept.binary-adders','| Position, starting at 0 |')
  let carry=0,total=0,operandA=0,operandB=0
  assert.equal(columns.length,4)
  columns.forEach((row,i)=>{
    const [position,a,b,cin,sum,cout]=row.map(Number)
    assert.equal(position,i);assert.equal(cin,carry);assert.equal(sum+2*cout,a+b+cin)
    operandA+=a*2**i;operandB+=b*2**i;total+=sum*2**i;carry=cout
  })
  assert.deepEqual([operandA,operandB,total,carry],[13,6,3,1])
  assert.equal(total+carry*16,operandA+operandB)
})
test('published storage and counter traces follow the stated edge and enable contracts', () => {
  let q=0
  const register=table('concept.memory-and-registers','| Step | Clock event |')
  assert.equal(register.length,6)
  for(const [,event,d,e,after] of register) {
    if(event==='Rising edge' && e==='1') q=parseInt(d,2)
    assert.equal(parseInt(after,2),q)
  }
  q=0
  const counter=table('concept.sequential-logic','| Edge | Reset | Enable |')
  assert.equal(counter.length,5)
  for(const [,reset,enable,before,after] of counter) {
    assert.equal(parseInt(before,2),q)
    q=reset==='1'?0:enable==='1'?(q+1)%8:q
    assert.equal(parseInt(after,2),q)
  }
})
test('the digital-logic path teaches every prerequisite before a dependent step', () => {
  const path=entry('path.digital-logic-foundations')
  const completed=new Set<string>()
  assert.equal(path.steps?.length,7)
  for(const id of path.steps ?? []) {
    const step=entry(id)
    assert.equal(step.status,'published')
    for(const prerequisite of step.prerequisites) assert.ok(completed.has(prerequisite),`${id} needs ${prerequisite} first`)
    completed.add(id)
  }
  for(const id of ['concept.logic-gates','concept.combinational-logic','concept.binary-adders','concept.memory-and-registers','concept.sequential-logic']) assert.ok(completed.has(id))
})
