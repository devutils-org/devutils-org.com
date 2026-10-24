export const operations = ['AND', 'OR', 'NOT', 'XOR'] as const
export type Operation = typeof operations[number]
export function gate(operation: Operation, a: boolean, b: boolean): boolean {
  switch (operation) {
    case 'AND': return a && b
    case 'OR': return a || b
    case 'NOT': return !a
    case 'XOR': return a !== b
    default: throw new Error('Unknown gate')
  }
}
export function truthTable(operation: Operation) {
  return (operation === 'NOT' ? [[false, false], [true, false]] : [[false,false],[false,true],[true,false],[true,true]])
    .map(([a,b]) => ({a,b,result:gate(operation,a,b)}))
}
export function labHtml() {
  return `<section class="gate-lab glass" aria-labelledby="gate-title"><h2 id="gate-title">Boolean gate workbench</h2><p>Choose an operation and toggle the inputs. NOT uses only A. This is a logical simulation, not an electrical measurement.</p><form data-gate hidden><label>Operation <select name="operation">${operations.map(op => `<option>${op}</option>`).join('')}</select></label><label><input type="checkbox" name="a"> Input A = 1</label><label data-input-b><input type="checkbox" name="b"> Input B = 1</label><p>Output: <output name="result" aria-live="polite">0</output></p><p data-equation></p><button type="reset" class="secondary">Reset inputs</button></form><p data-gate-fallback>The full truth tables below work without JavaScript. Read an input row to find its output.</p>${operations.map(op => `<h3>${op}</h3><table><caption>${op} truth table</caption><thead><tr><th scope="col">A</th>${op === 'NOT' ? '' : '<th scope="col">B</th>'}<th scope="col">Output</th></tr></thead><tbody>${truthTable(op).map(row => `<tr><td>${Number(row.a)}</td>${op === 'NOT' ? '' : `<td>${Number(row.b)}</td>`}<td>${Number(row.result)}</td></tr>`).join('')}</tbody></table>`).join('')}</section>`
}
