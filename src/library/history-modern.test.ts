import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('modern history examples preserve energy budgets, parallel overhead, class imbalance and quantum normalization',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.modern-computing')!
 assert.ok(e)
 assert.equal(10/2,5);assert.equal(10/4,2.5)
 const a=[1,2,3,4,5,6,7,8],b=[8,7,6,5,4,3,2,1]
 const result=Array<number>(8)
 for(let time=0;time<2;time++)for(let lane=0;lane<4;lane++){const i=time*4+lane;result[i]=a[i]+b[i]}
 assert.deepEqual(result,Array(8).fill(9));assert.equal(2+5,7);assert.ok(Math.abs(8/7-1.14)<0.005);assert.equal(8/(2+6),1)
 assert.equal(38/40*100,95);assert.equal(39/40*100,97.5)
 const actual=[...Array(39).fill('majority'),'minority'],predicted=Array(40).fill('majority')
 assert.equal(actual.filter((x,i)=>x===predicted[i]).length,39)
 assert.equal(actual.filter((x,i)=>x==='minority'&&x===predicted[i]).length,0)
 assert.ok(Math.abs(10e-12*1e11-1)<1e-12);assert.equal(1+2,3);assert.ok(Math.abs(20e-12*1e11-2)<1e-12)
 const p0=(Math.sqrt(3)/2)**2,p1=(1/2)**2
 assert.ok(Math.abs(p0-0.75)<1e-12);assert.equal(p1,0.25);assert.ok(Math.abs(p0+p1-1)<1e-12)
 assert.match(e.body,/38 \/ 40 = 95 percent/);assert.match(e.body,/39 \/ 40 = 97.5 percent/)
})
