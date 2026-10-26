import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const entry=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e,`Missing ${id}`);return e}
function table(id:string,header:string){const b=entry('concept.'+id).body,start=b.indexOf(header);assert.ok(start>=0,`Missing ${id}: ${header}`);return b.slice(start).split('\n').slice(2).filter((line,i,lines)=>line.startsWith('|')&&lines.slice(0,i).every(l=>l.startsWith('|'))).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()))}
const near=(a:number,b:number,tolerance=1e-10)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`)
test('device examples balance junction charge, terminal biases, complementary networks and energy with ordered prerequisites',()=>{
 const path=entry('path.semiconductor-devices'),complete=new Set<string>()
 assert.deepEqual(path.prerequisites,['path.semiconductor-manufacturing'])
 for(const id of ['path.computing-foundations','path.physics-for-computing','path.chemistry-and-materials','path.semiconductor-manufacturing']){complete.add(id);for(const step of entry(id).steps??[])complete.add(step)}
 assert.equal(path.steps?.length,6)
 for(const id of path.steps??[]){const e=entry(id);assert.equal(e.area,'semiconductor-devices');assert.equal(e.status,'published');for(const p of e.prerequisites)assert.ok(complete.has(p),`${id} needs ${p}`);complete.add(id)}
 const depletion=table('pn-junctions','| NA (cm^-3) |');assert.equal(depletion.length,3)
 for(const row of depletion){const [na,nd,xp,xn,w]=row.map(Number);near(na*xp*1e-4/(nd*xn*1e-4),1);near(xp+xn,w)}
 assert.match(entry('concept.pn-junctions').body,/equal sheet counts of 1.5e11 cm\^-2/);near(3e16*0.05e-4/1.5e11,1)
 const diode=table('diode-models','| V (V) |');assert.equal(diode.length,4)
 for(const row of diode){const [v,x,i]=row.map(Number);near(v/0.025,x);near(Math.expm1(x),i,0.00000051)}
 const d=entry('concept.diode-models').body
 assert.match(d,/approximately 0.05756 V/);near(0.025*Math.log(10),0.05756,0.000005)
 assert.match(d,/2.64 \+ 19.36 = 22 mW/);near(0.6*4.4,2.64);near(4.4**2,19.36);near(5*4.4,22)
 assert.match(d,/−0.981684 nA/);near(Math.expm1(-4),-0.981684,0.00000051)
 assert.match(d,/1.32 mW, resistor power is 9.68 mW/);near(0.6*2.2,1.32);near(4.4*2.2,9.68)
 const gate=table('mosfets','| VG (V) |');assert.equal(gate.length,4)
 for(const [vg,vs,vgs,state] of gate){near(Number(vg)-Number(vs),Number(vgs));assert.equal(state,Number(vgs)>0.4?'conducting':'open')}
 const m=entry('concept.mosfets').body
 assert.match(m,/0.909091 mA/);near(1000/1100,0.909091,0.00000051)
 assert.match(m,/VDS = I × 100 = 0.090909 V/);near(100/1100,0.090909,0.00000051)
 assert.match(m,/overdrive is 0.6 V/);near(1-0.4,0.6)
 const inverter=table('cmos','| Input state |');assert.equal(inverter.length,2)
 for(const [input,n,p,out] of inverter){assert.equal(n,Number(input)?'conducting':'open');assert.equal(p,Number(input)?'open':'conducting');assert.equal(Number(out),1-Number(input))}
 const nand=table('cmos','| A | B |');assert.equal(nand.length,4);assert.equal(new Set(nand.map(r=>r[0]+r[1])).size,4)
 for(const row of nand){const [a,b,down,up,out]=row.map(Number);assert.equal(down,a&b);assert.equal(up,1-down);assert.equal(out,up)}
 const c=entry('concept.cmos').body
 assert.match(c,/stored energy is 5 fJ/);near(0.5*10e-15/1e-15,5)
 assert.match(c,/result is .*2.5 μW/);near(0.25*10e-15*1e9/1e-6,2.5)
 assert.match(c,/full-cycle energy is 20 fJ and capacitive switching power is 5 μW/);near(0.25*20e-15*1e9/1e-6,5)
 const density=table('device-scaling','| Pitch |');assert.equal(density.length,4)
 for(const row of density){const [pitch,area,count]=row.map(Number);near((pitch/10)**2,area);near(1/area,count,0.00000051)}
 const s=entry('concept.device-scaling').body
 assert.match(s,/0.64 × 2 = 1.28/);near(0.8**2*2,1.28)
 assert.match(s,/0.8 × 0.9² × 1.25 = 0.81/);near(0.8*0.9**2*1.25,0.81)
 assert.match(s,/approximately 1.777778/);near(1/(9/12)**2,1.777778,0.00000051)
 const l=entry('concept.leakage-and-static-power').body
 assert.match(l,/Estandby over 5 s = 2 mW × 5 s = 10 mJ/);near(1000*2e-6*1*5/1e-3,10)
 assert.match(l,/4 mW × 2 ms = 8 μJ/);near(4e-3*2e-3/1e-6,8)
 assert.match(l,/0.1 × 6 \+ 0.9 × 2 = 2.4 mW/);near(0.1*6+0.9*2,2.4)
 assert.match(l,/average becomes .*0.78 mW/);near(0.1*6+0.9*0.2,0.78)
 assert.match(l,/18 μJ \/ 1.8 mW = 10 ms/);near(18e-6/1.8e-3/1e-3,10)
 assert.match(l,/energy over 2 s is 2.4 mJ/);near(0.8*500*3e-6*2/1e-3,2.4)
 assert.match(l,/2.75 mW/);near(0.25*8+0.75*1,2.75)
 assert.match(path.body,/giving 7 μW total/);near(0.25*20e-15*1e9/1e-6+2,7)
 assert.match(path.body,/Total power becomes 4.5 μW/);near(0.25*20e-15*0.5e9/1e-6+2,4.5)
})
