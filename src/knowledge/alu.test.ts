import {test} from 'node:test'
import assert from 'node:assert/strict'
import {alu,type AluOperation} from './alu.ts'
import {loadEntries} from './load.ts'
const signed=(n:number)=>n<8?n:n-16
const mod=(n:number)=>((n%16)+16)%16
test('four-bit ALU exhaustively matches exact arithmetic, bitwise reference, flags and printed examples',()=>{
 for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(const op of ['ADD','SUB','AND','XOR'] as const){
  const signedResult=op==='ADD'?signed(a)+signed(b):signed(a)-signed(b)
  const arithmetic=op==='ADD'||op==='SUB'
  const bits=Array.from({length:4},(_,i)=>{const x=Math.floor(a/2**i)%2,y=Math.floor(b/2**i)%2;return (op==='AND'?x*y:(x+y)%2)*2**i}).reduce((x,y)=>x+y,0)
  const r=arithmetic?mod(op==='ADD'?a+b:a-b):bits
  const result=alu(a,b,op)
  assert.deepEqual(result,{r,c:Number(op==='ADD'?a+b>=16:op==='SUB'?a>=b:false),v:Number(arithmetic&&(signedResult< -8||signedResult>7)),z:Number(r===0),n:Number(r>=8)})
  if(op==='SUB')assert.equal(Boolean(result.n^result.v),signed(a)<signed(b))
 }
 const entries=loadEntries(undefined,{allowStaleChecks:true})
 const entry=entries.find(e=>e.id==='concept.arithmetic-logic-unit')!
 assert.ok(entry)
 const rows=[...entry.body.matchAll(/^\| (ADD|SUB|AND|XOR) \| ([01]{4}) \| ([01]{4}) \| ([01]{4}) \| ([01]) \| ([01]) \| ([01]) \| ([01]) \|$/gm)]
 assert.equal(rows.length,6)
 for(const [,op,a,b,r,c,v,z,n] of rows)assert.deepEqual(alu(parseInt(a,2),parseInt(b,2),op as AluOperation),{r:parseInt(r,2),c:+c,v:+v,z:+z,n:+n})
 assert.deepEqual(alu(0,0,'SUB'),{r:0,c:1,v:0,z:1,n:0})
 assert.deepEqual(alu(8,8,'ADD'),{r:0,c:1,v:1,z:1,n:0})
 for(const n of [-1,16,1.5,NaN])assert.throws(()=>alu(n,0,'ADD'))
})
