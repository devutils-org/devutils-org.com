import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const entry=(id:string)=>{const value=entries.find(e=>e.id===id);assert.ok(value,`Missing ${id}`);return value}
function table(id:string,header:string){
 const body=entry(id).body;const start=body.indexOf(header);assert.ok(start>=0,`Missing table ${id}: ${header}`)
 return body.slice(start).split('\n').slice(2).filter((line,i,lines)=>line.startsWith('|')&&lines.slice(0,i).every(l=>l.startsWith('|'))).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()))
}
function near(a:number,b:number){assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`)}
test('physics examples respect circuit, field, quantum, energy and lattice models and reading prerequisites',()=>{
 const path=entry('path.physics-for-computing')
 assert.deepEqual(path.prerequisites,['path.computing-foundations'])
 const completed=new Set<string>(['path.computing-foundations',...entry('path.computing-foundations').steps??[]])
 assert.equal(path.steps?.length,5)
 for(const id of path.steps??[]){const step=entry(id);assert.equal(step.status,'published');for(const p of step.prerequisites)assert.ok(completed.has(p),`${id} needs ${p} first`);completed.add(id)}
 const resistor=table('concept.electricity-basics','| Voltage (V) | Resistance')
 assert.equal(resistor.length,3)
 for(const cells of resistor){const [v,r,ma,mw]=cells.map(Number);near(v/r*1000,ma);near(v*ma,mw)}
 const electricity=entry('concept.electricity-basics').body
 const duration=electricity.match(/energy in (\d+) s = ([\d.]+) W × (\d+) s = ([\d.]+) J/)
 assert.ok(duration);assert.equal(duration[1],duration[3]);near(Number(duration[2])*Number(duration[3]),Number(duration[4]))
 const charge=electricity.match(/charge in (\d+) s = ([\d.]+) A × (\d+) s = ([\d.]+) C/)
 assert.ok(charge);assert.equal(charge[1],charge[3]);near(Number(charge[2])*Number(charge[3]),Number(charge[4]))
 assert.match(electricity,/4 V source and ideal 2000 Ω resistor/);assert.match(electricity,/current is 2 mA, power is 8 mW and energy is 0.024 J/)
 near(4/2000,0.002);near(4*0.002*3,0.024)
 const forces=table('concept.fields-and-induction','| Test charge (μC) |')
 assert.equal(forces.length,3)
 for(const row of forces){const [q,e,f]=row.map(Number);near(q*e,f)}
 const field=entry('concept.fields-and-induction').body
 const flux=field.match(/from ([\d.]+) Wb to ([\d.]+) Wb in ([\d.]+) s/)
 const emf=field.match(/emf = -([\d.]+) Wb \/ ([\d.]+) s = (-?[\d.]+) V/)
 assert.ok(flux&&emf);near(Number(flux[2])-Number(flux[1]),Number(emf[1]));near(Number(flux[3]),Number(emf[2]));near(-Number(emf[1])/Number(emf[2]),Number(emf[3]))
 assert.match(field,/force is -300 μN. The emf is -2 V/);near(1*-300,-300);near(-0.006/0.003,-2)
 const probabilities=table('concept.quantum-basics','| Outcome | Real amplitude')
 assert.equal(probabilities.length,2);let sum=0
 for(const [,amplitude,probability] of probabilities){near(Number(amplitude)**2,Number(probability));sum+=Number(probability)}near(sum,1)
 const transitions=table('concept.quantum-basics','| Initial energy (units) |')
 assert.equal(transitions.length,3)
 for(const row of transitions){const [initial,final,emitted]=row.map(Number);assert.equal(initial-final,emitted);assert.ok(emitted>0)}
 const quantum=entry('concept.quantum-basics').body;assert.match(quantum,/probability is 0.25/);near(0.5**2,0.25)
 const energy=table('concept.heat-and-energy','| Interval | Electrical energy')
 assert.equal(energy.length,3);let cumulative=0
 for(const row of energy){const [,input,output,stored,total]=row.map(Number);assert.equal(input-output,stored);cumulative+=stored;assert.equal(cumulative,total)}
 const heat=entry('concept.heat-and-energy').body
 const rise=heat.match(/temperature rise = ([\d.]+) J \/ \(([\d.]+) J\/K\) = ([\d.]+) K/)
 assert.ok(rise);assert.equal(Number(rise[1]),cumulative);near(Number(rise[1])/Number(rise[2]),Number(rise[3]))
 assert.match(heat,/For 2 s/);assert.match(heat,/power of 5 W and loses heat at 2 W/);assert.match(heat,/increase is 6 J and the temperature rise is 2 K/);near((5-2)*2,6);near(6/3,2)
 const sites=table('concept.solids-and-energy-bands','| Site index |')
 assert.equal(sites.length,4)
 sites.forEach(([i,x],index)=>{assert.equal(Number(i),index);near(Number(x),index*0.4)})
 const bands=table('concept.solids-and-energy-bands','| Energy (units) |')
 assert.equal(bands.length,5)
 for(const [energy,meaning] of bands){const e=Number(energy);assert.equal(meaning,e===1?'Lower band edge':e===3?'Upper band edge':e>=0&&e<1?'Lower allowed band':e>3&&e<=5?'Upper allowed band':'Gap')}
 const solid=entry('concept.solids-and-energy-bands').body
 assert.match(solid,/lower allowed band from 0 through 1/);assert.match(solid,/upper allowed band from 3 through 5/);assert.match(solid,/span is 1.6 nm/);near((5-1)*0.4,1.6)
 assert.match(path.body,/current is 3 mA/);assert.match(path.body,/probability is 0.36/);assert.match(path.body,/internal-energy increase is 3 J/)
})
