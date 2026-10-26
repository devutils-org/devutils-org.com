// Stable evidence IDs: records store the digest of the tests and models actually run.
export const exampleChecks = {
  'timing-exercises': { file:'src/knowledge/timing.test.ts', name:'timing examples derive setup and hold slack from explicit launch and capture edges', dependencies:[] },
  'synthesis-exercises': { file:'src/knowledge/synthesis.test.ts', name:'synthesis examples preserve binary truth table and shared arithmetic for every operand and select', dependencies:[] },
  'rtl-exercises': { file:'src/knowledge/rtl.test.ts', name:'RTL accumulator model preserves reset priority, hold, modulo sum and simultaneous old-state capture', dependencies:[] },
  'alu-exercises': { file:'src/knowledge/alu.test.ts', name:'four-bit ALU exhaustively matches exact arithmetic, bitwise reference, flags and printed examples', dependencies:['src/knowledge/alu.ts'] },
  'control-datapath-exercises': { file:'src/knowledge/control-datapath.test.ts', name:'control and datapath path respects prerequisite order and simultaneous register capture', dependencies:['src/knowledge/alu.ts'] },
  'fsm-exercises': { file:'src/knowledge/fsm.test.ts', name:'FSM detector matches suffix oracle for every stream through ten bits and reset overrides each transition', dependencies:[] },
  'electronics-exercises': { file:'src/knowledge/electronics.test.ts', name:'electronics examples preserve network balance, interface and physical models, measurement loading and prerequisite order', dependencies:[] },
  'devices-exercises': { file:'src/knowledge/devices.test.ts', name:'device examples balance junction charge, terminal biases, complementary networks and energy with ordered prerequisites', dependencies:[] },
  'manufacturing-exercises': { file:'src/knowledge/manufacturing.test.ts', name:'manufacturing examples preserve pattern polarity, process accounting, geometry and conditional yield with ordered prerequisites', dependencies:[] },
  'materials-exercises': { file:'src/knowledge/materials.test.ts', name:'materials examples conserve charge, atoms and shared counts and respect sample geometry and prerequisites', dependencies:[] },
  'physics-exercises': { file:'src/knowledge/physics.test.ts', name:'physics examples respect circuit, field, quantum, energy and lattice models and reading prerequisites', dependencies:[] },
  'foundation-exercises': { file:'src/knowledge/foundations.test.ts', name:'foundation examples match their stated units, encodings, thresholds and prerequisite order', dependencies:[] },
  'digital-tables': { file:'src/knowledge/editorial.test.ts', name:'published gate, selector and full-adder tables cover all inputs and match their specifications', dependencies:[] },
  'state-traces': { file:'src/knowledge/editorial.test.ts', name:'published storage and counter traces follow the stated edge and enable contracts', dependencies:[] },
  'path-order': { file:'src/knowledge/editorial.test.ts', name:'the digital-logic path teaches every prerequisite before a dependent step', dependencies:[] },
  'gate-model': { file:'src/knowledge/roadmap.test.ts', name:'gate model covers every binary combination and NOT ignores B', dependencies:['src/knowledge/lab.ts'] },
  'worked-exercises': { file:'src/knowledge/exercises.test.ts', name:'article substitutions, capacities, signed sums and completion answers are reproducible', dependencies:[] },
  'short-path': { file:'src/knowledge/exercises.test.ts', name:'the introductory path references published content and its gate exercise is correct', dependencies:['src/knowledge/lab.ts'] },
} satisfies Record<string,{file:string; name:string; dependencies:string[]}>
export type CheckId = keyof typeof exampleChecks
