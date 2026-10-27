import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('history mathematics examples preserve remainder invariants, binary values and explicitly scoped algebra',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.mathematics-of-computation')!
 assert.ok(e)
 const rows=[...e.body.matchAll(/^\| (\d+) \| (\d+) \| (\d+) \| (\d+) \|$/gm)]
 assert.equal(rows.length,3)
 let pair=[84,30]
 for(const [,a,b,q,r] of rows){assert.deepEqual([+a,+b],pair);assert.equal(+a,+q*+b+ +r);assert.ok(+r>=0&&+r<+b);pair=[+b,+r]}
 assert.deepEqual(pair,[6,0])
 const gcd=(a:number,b:number)=>{while(b){const r=a%b;a=b;b=r}return a}
 const brute=(a:number,b:number)=>Array.from({length:Math.min(a,b)},(_,i)=>i+1).filter(n=>a%n===0&&b%n===0).at(-1)
 for(let a=1;a<100;a++)for(let b=1;b<100;b++)assert.equal(gcd(a,b),brute(a,b))
 assert.equal(gcd(99,27),9)
 assert.equal(parseInt('11010',2),26);assert.equal(parseInt('10011',2),19)
 assert.match(e.body,/0, 1, 0, 1, 1/)
 assert.deepEqual([26%2,13%2,6%2,3%2,1%2],[0,1,0,1,1])
 for(const x of [0,1]){assert.equal(x*(1-x),0);assert.equal(x*x,x)}
 assert.notEqual(2*2,2);assert.equal((15+1)%16,0)
 assert.match(e.body,/remainders are 18, 9 and 0/)
})
