import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const entry=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e,`Missing ${id}`);return e}
function table(id:string,header:string){const b=entry(id).body,start=b.indexOf(header);assert.ok(start>=0,`Missing ${id}: ${header}`);return b.slice(start).split('\n').slice(2).filter((line,i,lines)=>line.startsWith('|')&&lines.slice(0,i).every(l=>l.startsWith('|'))).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()))}
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-12,`${a} != ${b}`)
test('manufacturing examples preserve pattern polarity, process accounting, geometry and conditional yield with ordered prerequisites',()=>{
 const path=entry('path.semiconductor-manufacturing')
 assert.deepEqual(path.prerequisites,['path.chemistry-and-materials'])
 const complete=new Set<string>()
 for(const id of ['path.computing-foundations','path.physics-for-computing','path.chemistry-and-materials']){complete.add(id);for(const step of entry(id).steps??[])complete.add(step)}
 assert.equal(path.steps?.length,6)
 for(const id of path.steps??[]){const e=entry(id);assert.equal(e.status,'published');assert.equal(e.area,'semiconductor-manufacturing');for(const p of e.prerequisites)assert.ok(complete.has(p),`${id} needs ${p}`);complete.add(id)}
 const wafer=entry('concept.wafers-and-process-flow').body
 const area=wafer.match(/retained area fraction = \((\d+) \/ (\d+)\)\^2 = ([\d.]+)/)
 assert.ok(area);near((Number(area[1])/Number(area[2]))**2,Number(area[3]));near((1-Number(area[3]))*100,7.84)
 assert.match(wafer,/81% remains and 19% is excluded/);near((45/50)**2,0.81);assert.equal((98+100+102)/3,100);assert.equal(102-98,4)
 const polarity=table('concept.photolithography-and-alignment','| Exposed | Positive resist')
 assert.equal(polarity.length,2)
 for(const [e,p,n] of polarity){assert.equal(Number(p),1-Number(e));assert.equal(Number(n),Number(e))}
 const pattern=table('concept.photolithography-and-alignment','| Region | Exposed |')
 assert.equal(pattern.length,4)
 for(const [,e,r,o] of pattern){assert.equal(Number(r),1-Number(e));assert.equal(Number(o),Number(e))}
 assert.deepEqual(pattern.filter(([, , ,o])=>o==='1').map(([region])=>region),['B','C'])
 const overlay=table('concept.photolithography-and-alignment','| Rightward shift (nm) |')
 assert.equal(overlay.length,4)
 for(const row of overlay){const [shift,start,end,margin]=row.map(Number);assert.equal(start,20+shift);assert.equal(end,80+shift);assert.equal(end-start,60);assert.equal(margin,Math.min(start,100-end))}
 const litho=entry('concept.photolithography-and-alignment').body;assert.match(litho,/\[32, 92\] nm/);assert.equal(Math.min(32,100-92),8)
 const growth=table('concept.deposition-and-etching','| Cycles | Growth per cycle')
 assert.equal(growth.length,4)
 for(const row of growth){const [cycles,rate,thickness]=row.map(Number);near(cycles*rate,thickness)}
 const removal=table('concept.deposition-and-etching','| Total time (min) |')
 assert.equal(removal.length,3)
 for(const row of removal){const [t,target,exposure,loss]=row.map(Number);assert.equal(target,Math.min(100,t*20));assert.equal(exposure,Math.max(0,t-5));assert.equal(loss,exposure*4)}
 const film=entry('concept.deposition-and-etching').body;assert.match(film,/retains 74 nm/);assert.equal(80-6,74);assert.match(film,/73 nm/);assert.equal(80-7,73);assert.match(film,/300 cycles/);assert.equal(24/0.08,300)
 const implant=entry('concept.implantation-and-annealing').body
 assert.match(implant,/2e12 ions\/cm\^2 × 0.02 cm\^2 = 4e10 ions/);assert.equal(2e12*0.02,4e10)
 const profiles=table('concept.implantation-and-annealing','| Dose (ions/cm^2) |')
 assert.equal(profiles.length,3)
 for(const row of profiles){const [dose,depth,concentration]=row.map(Number);near(dose/depth,concentration)}
 assert.match(implant,/0.8 × 1e17 cm\^-3 = 8e16 cm\^-3/);assert.equal(0.8*1e17,8e16);near(0.2*1e-4,2e-5);assert.equal(3e12*0.01,3e10);assert.equal(3e12/1e-5,3e17);assert.match(implant,/1.5e17 cm\^-3/);assert.equal(0.5*3e17,1.5e17)
 const line=table('concept.interconnects-and-planarization','| Length (μm) |')
 assert.equal(line.length,4)
 for(const row of line){const [l,w,t,r]=row.map(Number);near(1e-7*l*1e-6/(w*t*1e-12),r)}
 const wire=entry('concept.interconnects-and-planarization').body
 assert.match(wire,/10 Ω \+ 2 Ω \+ 10 Ω = 22 Ω/);assert.equal(10+2+10,22);assert.match(wire,/0.022 V/);near(0.001*22,0.022);assert.match(wire,/5 \+ 2 \+ 5 = 12 Ω/);assert.equal(5+2+5,12)
 const yieldRows=table('concept.testing-yield-and-packaging','| Stage | Entering units |')
 assert.equal(yieldRows.length,3)
 let previous=1000,product=1,rejected=0
 for(const [,enter,pass,fraction] of yieldRows){const input=Number(enter),output=Number(pass);assert.equal(input,previous);near(output/input,Number(fraction));product*=Number(fraction);rejected+=input-output;previous=output}
 near(product,previous/1000);assert.equal(previous,722);assert.equal(rejected,278);assert.equal(rejected+previous,1000)
 const testing=entry('concept.testing-yield-and-packaging').body
 assert.match(testing,/0.9 × 0.9 = 0.81/);near(0.9**2,0.81);assert.match(testing,/812.25/);near(900*0.95*0.95,812.25);assert.match(testing,/0.8 × 0.8 = 0.64/);near(0.8**2,0.64)
 assert.match(path.body,/B and C are open/);assert.match(path.body,/4 nm of modeled loss/);assert.match(path.body,/8e16 cm\^-3 active dopants/);assert.match(path.body,/72.2%/)
})
