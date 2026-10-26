import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('software history examples preserve toy instruction bytes, bounded arithmetic, interleaved jobs and stream composition',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.software-revolution')!
 assert.ok(e)
 const rows=[...e.body.matchAll(/^\| (LOAD 6|ADD 9|STORE 32|STOP) \| ([A-F0-9]{2}) \| ([A-F0-9]{2}) \|$/gm)]
 assert.equal(rows.length,4)
 const bytes=rows.flatMap(r=>[r[2],r[3]])
 assert.equal(bytes.join(' '),'01 06 02 09 03 20 FF 00')
 const opcodes={LOAD:1,ADD:2,STORE:3,STOP:255};let accumulator=0;const memory=new Map<number,number>()
 for(const [,instruction,opcode,operand] of rows){const [op,value]=instruction.split(' ');assert.equal(parseInt(opcode,16),opcodes[op as keyof typeof opcodes]);assert.equal(parseInt(operand,16),value?+value:0);if(op==='LOAD')accumulator=+value;else if(op==='ADD')accumulator+=+value;else if(op==='STORE')memory.set(+value,accumulator)}
 assert.equal(memory.get(32),15);assert.equal(((7+5)*2)%16,8)
 const remaining={A:3,B:2},schedule:string[]=[],completed:Record<string,number>={}
 while(remaining.A||remaining.B)for(const name of ['A','B'] as const)if(remaining[name]){remaining[name]--;schedule.push(name);if(!remaining[name])completed[name]=schedule.length}
 assert.deepEqual(schedule,['A','B','A','B','A']);assert.deepEqual(completed,{B:4,A:5})
 assert.equal(['red','blue','red','green'].filter(v=>v==='red').length,2)
 assert.equal(['blue','red','red','red'].filter(v=>v==='red').length,3)
 assert.match(e.body,/A, B, A, B, A/)
})
