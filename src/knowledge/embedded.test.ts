import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const get=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e,`Missing ${id}`);return e}
const body=(slug:string)=>get('concept.'+slug).body
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`)
function table(slug:string,header:string){const b=body(slug),start=b.indexOf(header);assert.ok(start>=0);const out=[];for(const line of b.slice(start).split('\n').slice(2)){if(!line.startsWith('|'))break;out.push(line.split('|').slice(1,-1).map(c=>c.trim()))}return out}
function response(c:number,blocking:number,hc:number,hp:number){let r=c+blocking;for(let i=0;i<100;i++){const next=c+blocking+Math.ceil(r/hp)*hc;if(next===r)return r;r=next}throw Error('No fixed point')}
test('embedded examples preserve MMIO semantics, boot budgets, event timelines, DMA ownership and bounded schedules with ordered prerequisites',()=>{
 const path=get('path.firmware-and-embedded'),complete=new Set<string>(),visiting=new Set<string>()
 function teach(id:string){if(complete.has(id))return;assert.ok(!visiting.has(id));visiting.add(id);const e=get(id);for(const p of e.prerequisites)teach(p);if(e.type==='path')for(const step of e.steps??[])teach(step);complete.add(id);visiting.delete(id)}
 for(const id of path.prerequisites)teach(id);assert.equal(path.steps?.length,6)
 for(const id of path.steps??[]){const e=get(id);assert.equal(e.area,'firmware-embedded');for(const p of e.prerequisites)assert.ok(complete.has(p),`${id} needs ${p}`);complete.add(id)}
 const mmio=table('microcontrollers-and-mmio','| Register |');assert.equal(mmio.length,3);for(const [,offset,address] of mmio)assert.equal(parseInt(address,16),0x40002000+parseInt(offset,16))
 assert.match(body('microcontrollers-and-mmio'),/result is 00010101, decimal 21/);assert.equal(5|(1<<4),21)
 assert.match(body('microcontrollers-and-mmio'),/result is 1000/);assert.equal(0b1010&~0b0010,0b1000)
 // W1C preserves every flag outside the acknowledgement mask, including when several are pending.
 for(let flags=0;flags<16;flags++)for(let mask=0;mask<16;mask++){const result=flags&~mask;assert.equal(result&mask,0);assert.equal(result&(~mask&15),flags&(~mask&15))}
 const ram=table('reset-and-boot','| Region |');assert.equal(ram.length,4);assert.equal(ram.reduce((sum,r)=>sum+Number(r[1]),0),16)
 assert.match(body('reset-and-boot'),/0x08000014/);assert.equal(0x08000000+5*4,0x08000014)
 assert.match(body('reset-and-boot'),/0x08000024/);assert.equal(0x08000000+9*4,0x08000024)
 const times=table('interrupts-and-drivers','| Event |').map(r=>+r[1]);assert.deepEqual(times,[10,14,15,17,22]);assert.equal(times[2]-times[0],5);assert.equal(times[4]-times[0],12)
 assert.match(body('interrupts-and-drivers'),/deferred work ends at 26 μs/);assert.equal(18+1+2+5,26)
 const buffers=table('dma-and-buffer-ownership','| Samples per buffer |');assert.equal(buffers.length,3);for(const row of buffers){const [samples,width,bytes,ms]=row.map(Number);assert.equal(samples*width,bytes);near(samples/1000*1000,ms)}
 const fifo:number[]=[];for(const n of [10,11,12])fifo.push(n);assert.equal(fifo.shift(),10);fifo.push(13,14);assert.deepEqual(fifo,[11,12,13,14]);assert.equal(fifo.length,4)
 assert.match(body('dma-and-buffer-ownership'),/70 ms exceeds 64 ms by 6 ms/);near(128/2000*1000,64);assert.equal(50+20-64,6)
 const schedule=table('real-time-scheduling','| Interval (ms) |');assert.equal(schedule.length,5)
 // Simulate actual release/priority rules independently of response-time recurrence.
 const jobs=[{name:'A',period:5,cost:1,left:0},{name:'B',period:10,cost:2,left:0}],observed:string[]=[]
 for(let t=0;t<10;t++){for(const j of jobs)if(t%j.period===0){assert.equal(j.left,0);j.left=j.cost}const j=jobs.find(j=>j.left>0);if(j){j.left--;observed.push(j.name)}else observed.push('idle')}
 const expanded=schedule.flatMap(([interval,name])=>{const [start,end]=interval.split('–').map(Number);assert.ok(end>start);return Array<string>(end-start).fill(name==='idle'?'idle':name.slice(0,1))});assert.deepEqual(observed,expanded)
 near(1/5+2/10,0.4);assert.equal(response(2,0,1,5),3);assert.equal(response(2,4,1,5),8);assert.equal(response(3,1,1,5),5)
 const storage=table('embedded-linux','| Storage region |');assert.equal(storage.length,5);assert.equal(storage.reduce((sum,r)=>sum+Number(r[1]),0),128)
 assert.match(body('embedded-linux'),/remaining 24 MiB/);assert.equal(64-12-20-8,24);assert.equal(64-12-28-8,16)
 assert.match(path.body,/512 bytes/);assert.equal(128*4,512);assert.match(path.body,/missing the modeled reuse interval by 6 ms/);assert.equal(50+20-128/2000*1000,6)
})
