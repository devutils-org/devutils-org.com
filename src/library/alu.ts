// Four-bit teaching interface, not an ISA's flag convention.
export type AluOperation = 'ADD'|'SUB'|'AND'|'XOR'
export function alu(a:number,b:number,operation:AluOperation) {
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>15||b>15)throw Error('Operands must be four-bit unsigned integers')
 const arithmetic=operation==='ADD'||operation==='SUB'
 const wide=operation==='ADD'?a+b:operation==='SUB'?a+(b^15)+1:operation==='AND'?a&b:a^b
 const r=wide&15
 const v=operation==='ADD'?((~(a^b)&(a^r)&8)!==0):operation==='SUB'?(((a^b)&(a^r)&8)!==0):false
 return {r,c:Number(arithmetic&&wide>=16),v:Number(v),z:Number(r===0),n:(r>>3)&1}
}
