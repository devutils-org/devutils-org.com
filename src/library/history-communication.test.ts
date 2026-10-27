import {test} from 'node:test'
import assert from 'node:assert/strict'
import {loadEntries} from './load.ts'
test('information history examples match entropy, prefix decoding, independent bit errors and feedback assumptions',()=>{
 const e=loadEntries(undefined,{allowStaleChecks:true}).find(e=>e.id==='history.information-revolution')!
 assert.ok(e)
 const rows=[...e.body.matchAll(/^\| ([ABCD]) \| ([\d.]+) \| ([\d.]+) \| ([\d.]+) \|$/gm)]
 assert.equal(rows.length,4)
 let probability=0,entropy=0
 for(const [, ,p,information,contribution] of rows){probability+=+p;assert.equal(-Math.log2(+p),+information);assert.equal(+p*+information,+contribution);entropy+=+contribution}
 assert.equal(probability,1);assert.equal(entropy,1.75)
 const code={A:'0',B:'10',C:'110',D:'111'}
 for(const [a,x] of Object.entries(code))for(const [b,y] of Object.entries(code))if(a!==b)assert.equal(y.startsWith(x),false)
 const encode=(message:string)=>[...message].map(c=>code[c as keyof typeof code]).join('')
 const decode=(bits:string)=>{let prefix='',message='';for(const bit of bits){prefix+=bit;const word=Object.entries(code).find(([,value])=>value===prefix);if(word){message+=word[0];prefix=''}}assert.equal(prefix,'');return message}
 assert.equal(encode('ABD'),'010111');assert.equal(encode('CAB'),'110010')
 for(let n=0;n<4**4;n++){const message=n.toString(4).padStart(4,'0').replace(/[0-3]/g,c=>'ABCD'[+c]);assert.equal(decode(encode(message)),message)}
 let error=0;const p=0.1
 for(let mask=0;mask<8;mask++){const flips=mask.toString(2).replaceAll('0','').length;if(flips>=2)error+=p**flips*(1-p)**(3-flips)}
 assert.ok(Math.abs(error-0.028)<1e-12)
 let y=12;const values=[];for(let n=0;n<4;n++){y+=0.5*(20-y);values.push(y)}assert.deepEqual(values,[16,18,19,19.5])
 y=12;y+=2*(20-y);assert.equal(y,28);y+=2*(20-y);assert.equal(y,12)
 assert.equal(8**4,4096);assert.equal(Math.log2(4096),12)
 assert.match(e.body,/110 \| 0 \| 10 = 110010/)
})
