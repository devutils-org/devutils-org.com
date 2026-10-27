import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadEntries, target } from './load.ts'

test('French foundation examples preserve binary values, units, receiver rules and prerequisite order', () => {
  const entries = loadEntries(undefined, { allowStaleChecks: true })
  const get = (id: string) => {
    const entry = target(entries, id, 'fr')!
    assert.equal(entry.locale, 'fr', `${id} must have a French version`)
    return entry
  }
  const table = (id: string, header: string) => {
    const body = get(id).body, start = body.indexOf(header)
    assert.ok(start >= 0, `Missing table ${header}`)
    const rows: string[][] = []
    for (const line of body.slice(start).split('\n').slice(2)) {
      if (!line.startsWith('|')) break
      rows.push(line.split('|').slice(1, -1).map(cell => cell.trim()))
    }
    return rows
  }
  const path = get('path.computing-foundations'), completed = new Set<string>()
  assert.equal(path.steps?.length, 5)
  for (const id of path.steps!) {
    const step = get(id)
    for (const prerequisite of step.prerequisites) assert.ok(completed.has(prerequisite))
    completed.add(id)
  }
  const cards = table('concept.mathematical-reasoning', '| Boîtes n |')
  assert.equal(cards.length, 5)
  for (const [boxes, , result] of cards) assert.equal(Number(boxes) * 4, Number(result))
  const units = table('concept.units-and-scale', '| Secondes |')
  assert.equal(units.length, 3)
  for (const [seconds, ms, us] of units) {
    assert.equal(Number(seconds) * 1000, Number(ms))
    assert.equal(Number(ms) * 1000, Number(us))
  }
  const sum = get('concept.units-and-scale').body.match(/(\d+) ms \+ (\d+) μs = (\d+) ms \+ ([\d.]+) ms = ([\d.]+) ms/)!
  assert.ok(sum)
  assert.equal(Number(sum[2]) / 1000, Number(sum[4]))
  assert.equal(Number(sum[1]) + Number(sum[4]), Number(sum[5]))
  const interpret = (v: number) => v >= 0 && v <= 0.8 ? '0' : v >= 2 && v <= 3 ? '1' : 'Non garanti'
  const trace = table('concept.signals-and-states', '| Temps (ms) |')
  assert.equal(trace.length, 5)
  for (const [, voltage, decoded] of trace) assert.equal(interpret(Number(voltage)), decoded)
  const pulse = table('concept.signals-and-states', '| Temps dans l’intervalle (ms) |')
  assert.deepEqual(pulse.map(([time, voltage]) => [Number(time), interpret(Number(voltage))]), [[0, '0'], [0.5, '1'], [1, '0']])
  const capacity = table('concept.information-and-representation', '| Largeur (bits) |')
  assert.equal(capacity.length, 5)
  for (const [bits, patterns, maximum] of capacity) {
    assert.equal(2 ** Number(bits), Number(patterns))
    assert.equal(Number(patterns) - 1, Number(maximum))
  }
  const binary = table('concept.information-and-representation', '| Motif | Calcul |')
  assert.equal(binary.length, 5)
  for (const [bits, calculation, result] of binary) {
    assert.equal(parseInt(bits, 2), Number(result))
    assert.equal(calculation.split('+').map(Number).reduce((a, b) => a + b), Number(result))
  }
  const logic = table('concept.models-and-abstraction', '| Activé |')
  assert.equal(logic.length, 4)
  logic.forEach(([enabled, ready, on], i) => {
    assert.equal(Number(enabled) * 2 + Number(ready), i)
    assert.equal(Number(enabled) * Number(ready), Number(on))
  })
  for (const [, voltage, decoded] of table('concept.models-and-abstraction', '| Bit voulu |')) assert.equal(interpret(Number(voltage)), decoded)
  const delay = get('concept.models-and-abstraction').body.match(/borne de délai totale = (\d+) μs \+ (\d+) μs = (\d+) μs/)!
  assert.ok(delay)
  assert.equal(Number(delay[1]) + Number(delay[2]), Number(delay[3]))
  assert.match(path.body, /1,8 V pour le premier bit voulu et 0,4 V pour le second/)
  assert.equal(interpret(1.8), 'Non garanti')
  assert.equal(interpret(2.4) + interpret(0.4), '10')
})
