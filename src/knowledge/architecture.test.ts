import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const get=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e);return e}
const body=(slug:string)=>get('concept.'+slug).body
const near=(a:number,b:number,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`)
function table(slug:string,header:string){const b=body(slug),start=b.indexOf(header);assert.ok(start>=0);const out=[];for(const line of b.slice(start).split('\n').slice(2)){if(!line.startsWith('|'))break;out.push(line.split('|').slice(1,-1).map(c=>c.trim()))}return out}
const program=[...body('instruction-execution').matchAll(/^(\d): (MOVI|LOAD|ADD|STORE|BNZ|HALT)(.*)$/gm)].map(m=>({pc:+m[1],op:m[2],args:m[3].trim().split(/,\s*/).filter(Boolean)}))
function execute(sample:number){const r=[0,0,0,0],mem=new Uint8Array(256),trace:string[][]=[];mem[20]=sample;let pc=0;for(let steps=0;steps<20;steps++){const p=program[pc];assert.ok(p);const args=p.args;const reg=(s:string)=>{assert.match(s,/^R[0-3]$/);return Number(s.slice(1))};const before=pc;let halt=false
 switch(p.op){case 'MOVI':r[reg(args[0])]=Number(args[1]);pc++;break;case 'LOAD':r[reg(args[0])]=mem[Number(args[1])];pc++;break;case 'ADD':r[reg(args[0])]=(r[reg(args[1])]+r[reg(args[2])])&255;pc++;break;case 'STORE':mem[Number(args[1])]=r[reg(args[0])];pc++;break;case 'BNZ':pc=r[reg(args[0])]!==0?Number(args[1]):pc+1;break;case 'HALT':halt=true;break;default:assert.fail('Unknown opcode')}
 trace.push([String(before),String(r[1]),String(r[2]),String(r[3]),String(mem[21]),String(pc)]);if(halt)return {r,mem,trace}}
 assert.fail('Toy program failed to halt within its contract')}
test('architecture examples execute printed instructions, preserve cache mappings, pipeline accounting and scoped throughput with ordered prerequisites',()=>{
 const path=get('path.computer-architecture'),done=new Set<string>()
 for(const id of path.prerequisites){const p=get(id);for(const pre of p.prerequisites)assert.ok(done.has(pre));done.add(id);for(const step of p.steps??[])done.add(step)}
 assert.equal(path.steps?.length,6);for(const id of path.steps??[]){const e=get(id);assert.equal(e.area,'computer-architecture');for(const p of e.prerequisites)assert.ok(done.has(p),`${id} needs ${p}`);done.add(id)}
 const registers=table('isa-and-microarchitecture','| Register group |');assert.equal(registers.length,2);assert.equal(Number(registers[1][1])*Number(registers[1][2]),Number(registers[1][3]));assert.equal(31*32/8,124)
 assert.match(body('isa-and-microarchitecture'),/giving 15 ms/);near(1e6*1.5/100e6*1000,15)
 assert.equal(program.length,7);const printed=table('instruction-execution','| Executed PC |');assert.equal(printed.length,6)
 assert.deepEqual(execute(7).trace,printed.map(row=>[row[0],...row.slice(2)]))
 for(let sample=0;sample<256;sample++){const result=execute(sample),sum=(250+sample)%256;assert.equal(result.mem[21],sum);assert.equal(result.r[3],sum);assert.equal(result.r[1],sum===0?99:250);assert.equal(result.r[0],0);assert.equal(result.trace.length,sum===0?7:6)}
 const pipe=table('pipelines-and-hazards','| Cycle |');assert.equal(pipe.length,6);for(const [cycle,f,e,w] of pipe){const n=+cycle;assert.equal(f,n<=4?'I'+n:'empty');assert.equal(e,n>=2&&n<=5?'I'+(n-1):'empty');assert.equal(w,n>=3?'I'+(n-2):'empty')}
 assert.match(body('pipelines-and-hazards'),/Total cycles are .*112/);assert.equal(100+2+5*2,112)
 const addresses=table('caches-and-memory-hierarchy','| Byte address |');for(const row of addresses){const [a,b,i,t,o]=row.map(Number);assert.equal(b,Math.floor(a/4));assert.equal(i,b%4);assert.equal(t,Math.floor(b/4));assert.equal(o,a%4)}
 const cacheTrace=table('caches-and-memory-hierarchy','| Access |');assert.equal(cacheTrace.length,6);const tags:(number|undefined)[]=Array(4).fill(undefined);let misses=0
 for(const [,a,index,tag,outcome] of cacheTrace){const address=+a,line=Math.floor(address/4)%4,t=Math.floor(address/16),hit=tags[line]===t;assert.equal(+index,line);assert.equal(+tag,t);assert.equal(outcome,hit?'hit':'miss');if(!hit)misses++;tags[line]=t}
 assert.equal(misses,4);assert.equal(cacheTrace.length+misses*20,86);assert.match(body('caches-and-memory-hierarchy'),/86 ns/)
 const io=table('buses-and-io','| Register |');for(const [,offset,address] of io)assert.equal(parseInt(address,16),0x40001000+parseInt(offset,16))
 assert.match(body('buses-and-io'),/355.556 MB\/s/);near(32/(9/100e6)/1e6,355.556,0.00051)
 const scaling=table('cpu-and-gpu-parallelism','| Workers |');for(const row of scaling){const [p,s,t,speed]=row.map(Number);near(s+(1-s)/p,t);near(1/t,speed,0.00000051)}
 assert.match(body('cpu-and-gpu-parallelism'),/80\/160 = 50%/);assert.equal((4*10+4*10)/(20*8),0.5)
 assert.match(body('cpu-and-gpu-parallelism'),/25 billion operations\/s/);assert.equal(2/8*100e9,25e9)
 assert.match(path.body,/slot 5 sets R1 to 99/);assert.equal(execute(6).r[1],99);assert.match(path.body,/22 cycles, or 220 ns/);assert.equal((20+3-1)*10,220)
})
