import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('mechanical history teaching examples preserve decimal carries and finite-difference update ordering',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.mechanical-computing')!
 assert.ok(e)
 assert.equal((99+1)%1000,100);assert.equal((999+1)%1000,0)
 assert.match(e.body,/23, 46, 69 and 92/);assert.deepEqual([1,2,3,4].map(n=>23*n),[23,46,69,92])
 const rows=[...e.body.matchAll(/^\| (\d) \| (\d+) \| (\d+) \| (\d+) \|$/gm)]
 assert.equal(rows.length,4)
 let value=2,difference=1
 for(const [,n,f,d,second] of rows){assert.equal(+f,+n*+n+2);assert.equal(+f,value);assert.equal(+d,difference);assert.equal(+second,2);value+=difference;difference+=2}
 assert.deepEqual([value,difference],[18,9])
 assert.match(e.body,/next first difference becomes 9/)
 const selections=new Map([...e.body.matchAll(/^\| ([ABC]) \| ([01]{4}) \|$/gm)].map(r=>[r[1],r[2]]))
 assert.equal(selections.size,3)
 assert.deepEqual(['A','B','A'].map(c=>selections.get(c)),['1010','0101','1010'])
 assert.equal(selections.get('C'),'1111')
})
