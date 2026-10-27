import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadEntries } from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const entry=(id:string)=>{const e=entries.find(e=>e.id===id && e.locale==='en');assert.ok(e,`Missing ${id}`);return e}
function table(id:string,header:string){
 const body=entry(id).body
 const start=body.indexOf(header)
 assert.ok(start>=0,`Missing ${header}`)
 return body.slice(start).split('\n').slice(2).filter((line,i,lines)=>line.startsWith('|')&&lines.slice(0,i).every(l=>l.startsWith('|'))).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()))
}
test('foundation examples match their stated units, encodings, thresholds and prerequisite order',()=>{
 const path=entry('path.computing-foundations')
 const completed=new Set<string>()
 assert.equal(path.steps?.length,5)
 for(const id of path.steps??[]){const e=entry(id);assert.equal(e.status,'published');for(const p of e.prerequisites)assert.ok(completed.has(p),`${id} requires ${p}`);completed.add(id)}
 const binary=table('concept.information-and-representation','| Pattern | Calculation |')
 assert.equal(binary.length,5)
 for(const [bits,calculation,result] of binary){assert.equal(parseInt(bits,2),Number(result));assert.equal(calculation.split('+').map(Number).reduce((a,b)=>a+b,0),Number(result))}
 const indicator=table('concept.models-and-abstraction','| Enabled | Ready |')
 assert.equal(indicator.length,4)
 indicator.forEach(([e,r,on],i)=>{assert.equal(Number(e)*2+Number(r),i);assert.equal(Number(on),Number(e)*Number(r))})
 const interpret=(v:number)=>v>=0&&v<=0.8?'0':v>=2&&v<=3?'1':'Not guaranteed'
 const trace=table('concept.signals-and-states','| Time (ms) |')
 assert.equal(trace.length,5)
 for(const [,v,result] of trace)assert.equal(interpret(Number(v)),result)
 assert.deepEqual([0.8,1,2].map(interpret),['0','Not guaranteed','1'])
 const prefix=table('concept.units-and-scale','| Prefix |')
 assert.deepEqual(prefix.map(([,symbol,power])=>[symbol,power]),[['k','10^3'],['M','10^6'],['m','10^-3'],['μ','10^-6'],['n','10^-9']])
 // Read published operands and answers so an article edit cannot silently retain a passing example record.
 const units=entry('concept.units-and-scale').body
 const sum=units.match(/(\d+) ms \+ (\d+) μs = ([\d.]+) ms/)
 assert.ok(sum);assert.equal(Number(sum[1])+Number(sum[2])/1000,Number(sum[3]))
 const rate=units.match(/1 item \/ ([\d.]+) s = (\d+) items\/s/)
 assert.ok(rate);assert.equal(1/Number(rate[1]),Number(rate[2]))
 assert.match(units,/0.006 s and 6000 μs/);assert.equal(6/1000,0.006);assert.equal(6*1000,6000)
 assert.match(entry('concept.mathematical-reasoning').body,/cards\(3\) = 4 × 3 = 12/);assert.equal(4*3,12)
 assert.equal(2%2,0);assert.notEqual(2%4,0);assert.equal(3%3,0);assert.notEqual(3%2,0)
 const information=entry('concept.information-and-representation').body
 assert.match(information,/1101/);assert.match(information,/8 \+ 4 \+ 1 = 13/);assert.equal(parseInt('1101',2),13)
 assert.equal(2**5,32);assert.ok(2**3<9&&2**4>=9)
 assert.match(path.body,/5.5 ms/);assert.match(path.body,/Nine messages require four bits/)
 // Recompute the expanded worked tables from their published values.
 const packing=table('concept.mathematical-reasoning','| Boxes n |')
 assert.equal(packing.length,5)
 for(const [boxes,substitution,cards] of packing){assert.equal(4*Number(boxes),Number(cards));assert.equal(substitution,`4 × ${boxes}`)}
 const conversions=table('concept.units-and-scale','| Seconds | Milliseconds |')
 assert.equal(conversions.length,3)
 for(const [seconds,ms,us] of conversions){assert.ok(Math.abs(Number(seconds)*1000-Number(ms))<1e-10);assert.equal(Number(ms)*1000,Number(us))}
 const capacity=table('concept.information-and-representation','| Width (bits) |')
 assert.equal(capacity.length,5)
 for(const [width,patterns,max] of capacity){assert.equal(2**Number(width),Number(patterns));assert.equal(Number(max)+1,Number(patterns))}
 // Exhaustive round trips check the method used for the 4-bit encoding exercises.
 for(let value=0;value<16;value++){
   let remaining=value
   const bits=[8,4,2,1].map(weight=>{const bit=Number(remaining>=weight);remaining-=bit*weight;return bit}).join('')
   assert.equal(remaining,0);assert.equal(parseInt(bits,2),value)
 }
 const pulse=table('concept.signals-and-states','| Time within interval (ms) |')
 assert.equal(pulse.length,3)
 assert.deepEqual(pulse.map(([time,v,decoded])=>{assert.equal(interpret(Number(v)),decoded);return [Number(time),decoded]}),[[0,'0'],[0.5,'1'],[1,'0']])
 const handoff=table('concept.models-and-abstraction',"| Sender's intended bit |")
 assert.equal(handoff.length,2)
 for(const [,v,decoded] of handoff)assert.equal(interpret(Number(v)),decoded)
 const models=entry('concept.models-and-abstraction').body
 const delays=models.match(/total delay bound = (\d+) μs \+ (\d+) μs = (\d+) μs/)
 assert.ok(delays);assert.equal(Number(delays[1])+Number(delays[2]),Number(delays[3]))
 const capstone=path.body
 const samples=capstone.match(/uses ([\d.]+) V for the intended first bit and ([\d.]+) V for the second/)
 assert.ok(samples);assert.deepEqual([interpret(Number(samples[1])),interpret(Number(samples[2]))],['Not guaranteed','0'])
 assert.match(capstone,/assigns 10 to Finished/)
 assert.equal(interpret(2.4)+interpret(0.4),'10')

})
