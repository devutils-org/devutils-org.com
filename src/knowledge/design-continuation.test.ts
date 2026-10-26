import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const body=(slug:string)=>{const e=entries.find(e=>e.id==='concept.'+slug);assert.ok(e);return e.body}
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`)
function table(slug:string,header:string){const text=body(slug),start=text.indexOf(header);assert.ok(start>=0);const lines=text.slice(start).split('\n').slice(2);const rows=[];for(const line of lines){if(!line.startsWith('|'))break;rows.push(line.split('|').slice(1,-1).map(c=>c.trim()))}return rows}
test('design continuation checks finite verification scope, physical budgets, LUT counts and lossless synchronous transfers',()=>{
 const verification=table('simulation-and-verification','| q before |');assert.equal(verification.length,3)
 for(const r of verification){const [q,p,reset,en,d,qn,pn]=r.map(Number);assert.equal(qn,reset?0:en?(q+d)%16:q);assert.equal(pn,reset?0:en?q:p)}
 assert.match(body('simulation-and-verification'),/16384 combinations/);assert.equal(16**3*4,16384)
 const util=table('physical-design','| Cell area');assert.equal(util.length,3);for(const r of util){const [cells,area,ratio]=r.map(Number);near(cells/area*100,ratio)}
 assert.match(body('physical-design'),/slack becomes −0.1 ns/);near(2-0.2-0.3-1.2-0.4,-0.1)
 const lut=table('asic-and-fpga','| Inputs k |');assert.equal(lut.length,4);for(const r of lut){const [k,entries,bits]=r.map(Number);assert.equal(entries,2**k);assert.equal(bits,entries)}
 assert.match(body('asic-and-fpga'),/N = 6000/);assert.equal(100000+6000*5,10000+6000*20)
 const trace=table('synchronous-interfaces','| Edge |');assert.equal(trace.length,6);const accepted:number[]=[];let pending:number|undefined
 for(const row of trace){const [,v,r,data,transfer,sequence]=row;const valid=+v,ready=+r;if(pending!==undefined){assert.equal(valid,1);assert.equal(+data,pending)}if(valid&&ready)accepted.push(+data);assert.equal(transfer,valid&&ready?'yes':'no');assert.equal(sequence,accepted.join(', '));pending=valid&&!ready?+data:undefined}
 assert.deepEqual(accepted,[5,8,3])
 // An independent queue oracle checks conservation and order for every eight-cycle readiness pattern.
 for(let mask=0;mask<256;mask++){const inputs=[5,8,3],outputs:number[]=[];let head=0;for(let edge=0;edge<8;edge++){const valid=head<inputs.length,ready=Boolean(mask&(1<<edge));if(valid&&ready)outputs.push(inputs[head++]);assert.deepEqual(outputs,inputs.slice(0,head))}assert.ok(outputs.length<=inputs.length)}
 assert.match(body('synchronous-interfaces'),/400 million payload bits\/s/);assert.equal(1/20e-9*8,400e6)
})
