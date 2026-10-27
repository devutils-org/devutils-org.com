import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
const entries=loadEntries(undefined,{allowStaleChecks:true})
const entry=(id:string)=>{const e=entries.find(e=>e.id===id);assert.ok(e,`Missing ${id}`);return e}
function table(id:string,header:string){
 const body=entry(id).body;const start=body.indexOf(header)
 assert.ok(start>=0,`Missing ${id}: ${header}`)
 return body.slice(start).split('\n').slice(2).filter((line,i,lines)=>line.startsWith('|')&&lines.slice(0,i).every(l=>l.startsWith('|'))).map(line=>line.split('|').slice(1,-1).map(c=>c.trim()))
}
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-12,`${a} != ${b}`)
test('materials examples conserve charge, atoms and shared counts and respect sample geometry and prerequisites',()=>{
 const path=entry('path.chemistry-and-materials')
 assert.deepEqual(path.prerequisites,['path.physics-for-computing'])
 const completed=new Set<string>()
 for(const id of ['path.computing-foundations','path.physics-for-computing']){completed.add(id);for(const step of entry(id).steps??[])completed.add(step)}
 assert.equal(path.steps?.length,5)
 for(const id of path.steps??[]){const e=entry(id);assert.equal(e.status,'published');assert.equal(e.area,'chemistry-materials');for(const pre of e.prerequisites)assert.ok(completed.has(pre),`${id} needs ${pre}`);completed.add(id)}
 const atomic=table('concept.atoms-and-bonding','| Protons | Neutrons |')
 assert.equal(atomic.length,3)
 for(const row of atomic){const [p,n,e,a,q]=row.map(Number);assert.equal(p,14);assert.equal(p+n,a);assert.equal(p-e,q)}
 const energy=table('concept.atoms-and-bonding','| Initial energy (units) |')
 assert.equal(energy.length,2)
 for(const row of energy){const [initial,final,change]=row.map(Number);assert.equal(final-initial,change)}
 const atoms=entry('concept.atoms-and-bonding').body
 assert.match(atoms,/30 - 14 = 16 neutrons/);assert.match(atoms,/14 - 13 = \+1/)
 const cells=table('concept.crystal-structures','| Structure | Corners |')
 assert.equal(cells.length,3)
 for(const [,corners,faces,inside,total] of cells)assert.equal(Number(corners)/8+Number(faces)/2+Number(inside),Number(total))
 const crystal=entry('concept.crystal-structures').body
 assert.match(crystal,/2 × 3 × 4 = 24 cells/);assert.equal(2*3*4*2,48)
 assert.match(crystal,/100 - 2 - 3 = 95/);assert.equal(100-2-3+3,98);assert.equal(98+1,99)
 const volume=crystal.match(/cell volume = ([\d.]+) nm × ([\d.]+) nm × ([\d.]+) nm = ([\d.]+) nm\^3/)
 assert.ok(volume);near(Number(volume[1])*Number(volume[2])*Number(volume[3]),Number(volume[4]));near(0.2**3,0.008)
 const oxide=entry('concept.silicon-and-oxide').body
 const bonds=oxide.match(/distinct bonds = (\d+) × (\d+) \/ (\d+) = (\d+)/)
 assert.ok(bonds);assert.equal(Number(bonds[1])*Number(bonds[2])/Number(bonds[3]),Number(bonds[4]))
 const silica=table('concept.silicon-and-oxide','| Silicon atoms | Oxygen atoms |')
 assert.equal(silica.length,3)
 for(const row of silica){const [si,o,total,links]=row.map(Number);assert.equal(o,2*si);assert.equal(total,si+o);assert.equal(links,4*si);assert.equal(links,2*o)}
 assert.match(oxide,/20 × 4 \/ 2 = 40/);assert.match(oxide,/six silicon atoms/);assert.match(oxide,/12 oxygen atoms/);assert.match(oxide,/24 links/)
 // Balance each element independently in the oxidation bookkeeping model.
 for(const si of [4,10]){const oxygenMolecules=si;const oxideSilicon=si,oxideOxygen=2*si;assert.equal(oxygenMolecules*2,oxideOxygen);assert.equal(si+2*oxygenMolecules,oxideSilicon+oxideOxygen)}
 const doped=table('concept.semiconductor-doping','| ND (cm^-3) | NA (cm^-3) |')
 assert.equal(doped.length,4)
 for(const [nd,na,majority,concentration] of doped){const excess=Number(nd)-Number(na);assert.equal(majority,excess>0?'Electrons':'Holes');assert.equal(Math.abs(excess),Number(concentration));const n=excess>0?excess:0,p=excess<0?-excess:0;assert.equal(p+Number(nd),n+Number(na))}
 const doping=entry('concept.semiconductor-doping').body
 assert.match(doping,/10\^16 cm\^-3 × 10\^-12 cm\^3 = 10\^4 = 10000/);assert.equal(1e16*1e-12,10000)
 assert.match(doping,/2 ppm/);assert.match(doping,/0.0002%/);near(2/1e6*1e6,2);near(2/1e6*100,0.0002)
 assert.match(doping,/2e16 × 5e-13 = 10e3 = 10000/);assert.equal(2e16*5e-13,10000)
 assert.match(doping,/0.000005/);assert.match(doping,/0.0005%/);near(5/1e6,0.000005);near(5/1e6*100,0.0005)
 const samples=table('concept.material-properties','| Resistivity (Ω m) |')
 assert.equal(samples.length,4)
 for(const row of samples){const [rho,l,a,r]=row.map(Number);near(rho*l/a,r)}
 const material=entry('concept.material-properties').body
 assert.match(material,/0.1 mm wide and 0.2 mm thick/);near(0.1*0.2*1e-6,2e-8)
 assert.match(material,/0.00000003 m\^2/);near(0.03*1e-6,3e-8)
 assert.match(material,/conductivity is 10000 S\/m/);assert.equal(1/0.0001,10000)
 const candidates=table('concept.material-properties','| Candidate | Resistance (Ω) |')
 assert.equal(candidates.length,3)
 for(const [,r,t,passes] of candidates)assert.equal(passes,Number(r)<=15&&Number(t)>=600?'Yes':'No')
 assert.match(material,/10 × 3\/2 = 15 Ω/);near(1e-4*0.003/2e-8,15)
 assert.match(path.body,/ND = 8e15 cm\^-3 and acceptors NA = 3e15 cm\^-3/);assert.equal(8e15-3e15,5e15)
 assert.match(path.body,/gives 10 Ω/);near(1e-4*0.001/1e-8,10);assert.match(path.body,/resistance to 20 Ω/)
})
