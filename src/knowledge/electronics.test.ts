import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const entry=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e,`Missing ${id}`);return e}
const body=(slug:string)=>entry('concept.'+slug).body
function table(slug:string,header:string){const b=body(slug),start=b.indexOf(header);assert.ok(start>=0,`Missing ${slug}: ${header}`);return b.slice(start).split('\n').slice(2).filter((line,i,lines)=>line.startsWith('|')&&lines.slice(0,i).every(l=>l.startsWith('|'))).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()))}
const near=(a:number,b:number,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`)
test('electronics examples preserve network balance, interface and physical models, measurement loading and prerequisite order',()=>{
 const path=entry('path.electronics-and-pcb'),complete=new Set<string>()
 assert.deepEqual(path.prerequisites,['path.semiconductor-devices'])
 for(const id of ['path.computing-foundations','path.physics-for-computing','path.chemistry-and-materials','path.semiconductor-manufacturing','path.semiconductor-devices']){complete.add(id);for(const step of entry(id).steps??[])complete.add(step)}
 assert.equal(path.steps?.length,7)
 for(const id of path.steps??[]){const e=entry(id);assert.equal(e.area,'electronics-pcb');assert.equal(e.status,'published');for(const p of e.prerequisites)assert.ok(complete.has(p),`${id} needs ${p}`);complete.add(id)}
 const dividers=table('circuit-analysis','| RL (Ω) |');assert.equal(dividers.length,3)
 for(const [rl,lower,v,i] of dividers){const expected=rl==='unloaded'?2000:1/(1/2000+1/Number(rl));near(Number(lower),expected,0.000001);near(Number(v),6*expected/(1000+expected));near(Number(i),(6-Number(v))/1000*1000);near((6-Number(v))/1000,Number(v)/2000+(rl==='unloaded'?0:Number(v)/Number(rl)))}
 assert.match(body('circuit-analysis'),/Their sum is 18 mW/);near(6*0.003,0.003**2*1000+2*3*0.0015)
 assert.match(body('circuit-analysis'),/output is 4.8 V/);near(8*(1/(2/3000))/(1000+1/(2/3000)),4.8)
 const levels=table('analog-and-digital-interfaces','| Received voltage (V) |');assert.equal(levels.length,5)
 for(const [v,state] of levels){const value=Number(v);assert.equal(state,value<=0.8?'low':value>=2?'high':'unspecified')}
 const rc=table('analog-and-digital-interfaces','| Time (μs) |');assert.equal(rc.length,4)
 for(const row of rc){const [t,ratio,v]=row.map(Number);near(t/100,ratio);near(3*(1-Math.exp(-ratio)),v,0.00000051)}
 const analog=body('analog-and-digital-interfaces')
 assert.match(analog,/margins 0.9 V and 0.5 V/);near(2.9-2,0.9);near(0.8-0.3,0.5)
 assert.match(analog,/109.861 μs/);near(100*Math.log(3),109.861,0.00051)
 assert.match(analog,/1591.55 Hz/);near(1/(2*Math.PI*1000*100e-9),1591.55,0.0051)
 assert.match(analog,/219.722 μs/);near(200*Math.log(3),219.722,0.00051)
 const pins=table('schematics-and-connectivity','| Symbol pin |');assert.deepEqual(pins,[['3','supply','3'],['1','reference','1'],['2','output','2']]);assert.equal(new Set(pins.map(r=>r[2])).size,3)
 const nets=table('schematics-and-connectivity','| Net |');assert.equal(nets.length,3)
 const map=new Map(nets.map(([net,pins])=>[net,pins.split(', ')]));assert.deepEqual(map.get('SENSE'),['R1.2','R2.1','C1.1']);assert.deepEqual(map.get('GND'),['J1.2','R2.2','C1.2'])
 const terminals=nets.flatMap(([,pins])=>pins.split(', '));assert.equal(terminals.length,8);assert.equal(new Set(terminals).size,8)
 const conductors=table('pcb-layout-and-return-paths','| Length (mm) |');assert.equal(conductors.length,4)
 for(const row of conductors){const [l,w,t,r]=row.map(Number);near(2e-8*l*1e-3/(w*t*1e-6),r,0.00000051)}
 const pcb=body('pcb-layout-and-return-paths');assert.match(pcb,/0.045714 V/);near(2*0.2*2e-8*0.05/(0.25e-3*0.035e-3),0.045714,0.00000051)
 assert.match(pcb,/0.8 − 0.3\/2 − 0.5\/2 = 0.4 mm/);near(0.8-0.3/2-0.5/2,0.4);near(0.4-0.25,0.15);near(0.6-0.3/2-0.5/2,0.2)
 const droop=table('power-and-decoupling','| Additional current (mA) |');assert.equal(droop.length,4)
 for(const row of droop){const [i,t,c,v]=row.map(Number);near(i*1e-3*t*1e-6/(c*1e-6)*1000,v)}
 const power=body('power-and-decoupling');assert.match(power,/0.51 W loss/);near((5-3.3)*0.3,0.51);assert.match(power,/Efficiency is 66%/);near(3.3/5*100,66)
 assert.match(power,/input power is 0.99\/0.9 = 1.1 W/);near(0.99/0.9,1.1);assert.match(power,/approximate 22 mV/);near(20+20e-3*0.1*1000,22)
 assert.match(power,/2 μF effective capacitance/);near(0.01*2e-6/0.01/1e-6,2)
 const delays=table('signal-integrity','| Length (mm) |');assert.equal(delays.length,4)
 for(const row of delays){const [l,one,two]=row.map(Number);near(l/150,one);near(2*one,two)}
 const reflections=table('signal-integrity','| Load (Ω) |');assert.equal(reflections.length,5)
 for(const [load,gamma,reflected,voltage] of reflections){const g=load==='open'?1:(Number(load)-50)/(Number(load)+50);near(Number(gamma),g,0.00000051);near(Number(reflected),g,0.00000051);near(Number(voltage),1+g,0.00000051)}
 const si=body('signal-integrity');assert.match(si,/first load step is 1.5 V/);near(1+(150-50)/(150+50),1.5)
 assert.match(si,/3 × 50\/\(100 \+ 50\) = 1 V/);near(3*50/150,1)
 const measurements=table('measurement-and-debugging','| Input resistance (MΩ) |');assert.equal(measurements.length,3)
 for(const row of measurements){const [rm,v,error]=row.map(Number);const expected=2*rm/(0.1+rm);near(v,expected,0.00000051);near(error,(2-expected)/2*100,0.00000051)}
 const measure=body('measurement-and-debugging');assert.match(measure,/219.7 ns/);near(Math.log(9)*100,219.7,0.05)
 assert.match(measure,/approximately 87.89 ns/);near(Math.log(9)*2000*20e-12/1e-9,87.89,0.0051)
 assert.match(measure,/±12 mV/);near(0.005*2+0.002,0.012);assert.match(measure,/±7 mV/);near(0.005+0.002,0.007)
 assert.match(path.body,/loaded node is 3 V and source current is 3 mA/);assert.match(path.body,/0.02 V reduction/);near(0.02*2e-6/2e-6,0.02)
 assert.match(path.body,/first load step of 2 V/);near(2*50/(50+50)*2,2)
})
