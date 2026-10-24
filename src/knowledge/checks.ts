// Stable evidence IDs: records store the digest of the tests and models actually run.
export const exampleChecks = {
  'digital-tables': { file:'src/knowledge/editorial.test.ts', name:'published gate, selector and full-adder tables cover all inputs and match their specifications', dependencies:[] },
  'state-traces': { file:'src/knowledge/editorial.test.ts', name:'published storage and counter traces follow the stated edge and enable contracts', dependencies:[] },
  'path-order': { file:'src/knowledge/editorial.test.ts', name:'the digital-logic path teaches every prerequisite before a dependent step', dependencies:[] },
  'gate-model': { file:'src/knowledge/roadmap.test.ts', name:'gate model covers every binary combination and NOT ignores B', dependencies:['src/knowledge/lab.ts'] },
  'worked-exercises': { file:'src/knowledge/exercises.test.ts', name:'article substitutions, capacities, signed sums and completion answers are reproducible', dependencies:[] },
  'short-path': { file:'src/knowledge/exercises.test.ts', name:'the introductory path references published content and its gate exercise is correct', dependencies:['src/knowledge/lab.ts'] },
} satisfies Record<string,{file:string; name:string; dependencies:string[]}>
export type CheckId = keyof typeof exampleChecks
