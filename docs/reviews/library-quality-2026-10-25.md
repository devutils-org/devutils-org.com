# Library quality follow-up — 2026-10-25

Assessor: Codex (assistant). This is a follow-up to the supplied review, not an
independent human signoff. The corpus contains 24 published records, including
16 concepts. The review below covers the reported issues and scoped checks; it
does not certify every sentence or every historical attribution in the library.

## Corrections

- Binary adders: removed the unavailable `6191.mit.edu` student-notes reference.
  The retained [MIT annotated lesson](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c8/c8s1/)
  and [Cornell slides](https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/06-gates.pdf)
  were inspected for carry propagation and adder construction. Citation indices
  now match the two remaining sources. The `1111 + 0001` exercise explicitly
  separates the carry generated at position 0 from propagation at higher positions.
- Electricity: a neutral object now explicitly has **zero net charge**.
- Quantum basics: the discrete energies are attributed to an atom's bound
  electronic states; photon emission explicitly goes to a lower-energy state.
- Solids: occupation refers explicitly to states in the allowed bands, not to
  states in the gap. The prose now refers to the displayed energy table rather
  than a nonexistent band sketch.
- In the affected physics chapters, removed repeated audit narration and
  redundant fictional-example labels. Kept the numerical assumptions and limits
  that a reader needs to interpret the examples. Sources and scoped assessments
  remain available in the existing verification and source sections.
- The publication-count test now requires exactly 24 published records, replacing
  the permissive `>= 18` assertion. Intentional future additions must update it.

## Thermodynamic sign convention

Directly inspected [Feynman I, section 44–1](https://www.feynmanlectures.caltech.edu/I_44.html),
equations 44.1–44.2. The source counts heat put into a system and work done on it
positively, giving an internal-energy change of Q + W. The library's convention
is consistent. Its electrical-input-minus-heat-output balance uses positive
magnitudes for those named transfers. The passage was accessible through the web
reader in this follow-up; the earlier reported access failure is not evidence of
a physics error. The per-article assessment records the actual passage inspected.

## Evidence and limits

Re-ran the eight declared content-check groups, covering the published logic,
foundation and physics examples and reading prerequisites. They test defined
models, not physical hardware. Updated the five edited article fingerprints only
after reviewing the revised prose and source mapping. Independent human review
remains pending.

These chapters are short introductions with worked exercises. They supply a
starting vocabulary and models, not a complete physics or computing course.
Further expansion should add conceptual depth and exercises with explained
solutions, rather than treating a passing arithmetic check or a reachable source
URL as proof of overall accuracy.

## Subsequent foundations expansion

The five foundations chapters were subsequently expanded to introduce notation,
show intermediate calculations, explain counterexamples and common mistakes,
and give worked exercise solutions. The path now includes a combined
voltage-decoding and message-codebook exercise. New example checks cover packing,
unit conversion, binary capacity and encoding, a pulse missed between samples,
incompatible signal levels and composed delay bounds. Source assessments and
fingerprints were updated for the six revised records. The content checks, full
test suite and build passed; the six pages also passed desktop/mobile layout and
TOC-anchor checks without JavaScript. Physics and digital-logic depth remain
separate editorial work.
