---
id: concept.synthesis-and-technology-mapping
type: concept
locale: en
slug: synthesis-and-technology-mapping
area: integrated-circuit-design
title: Synthesis and technology mapping
summary: Lower a circuit description into connected implementation cells, reason about Boolean equivalence and account for resource sharing without changing cycle behavior.
status: published
updated: 2026-10-26
prerequisites: [concept.rtl-and-hardware-description]
related: [concept.combinational-logic]
sources:
  - title: Yosys documentation — A primer on digital circuit synthesis
    url: https://yosyshq.readthedocs.io/projects/yosys/en/latest/appendix/primer.html
---
## Turn a description into connected elements

Synthesis translates a supported circuit description into a lower-level implementation. Technology mapping chooses elements available in the target architecture. A netlist records instances and their connections. This is different from a physical layout specifying where cells and wires go.

Read [RTL and hardware description](/knowledge/integrated-circuit-design/rtl-and-hardware-description/) first. Its accumulator specifies what happens at each clock edge. Any acceptable implementation must preserve that externally visible contract under the assumptions used for synthesis and verification.

A source line is not a reliable count of physical gates. Some expressions simplify; some require many cells; unused results may disappear. Conversely a short arithmetic expression can create a substantial carry path. Actual area and delay require a target library, constraints and reports.

## Check equivalence on a tiny expression

Suppose a one-bit result is defined by:

```text
y = (a AND b) OR (a AND NOT b)
```

Distribute a to obtain a AND (b OR NOT b). For binary b, one of b and NOT b is 1, so their OR is 1. Therefore y = a. The complete two-state truth table confirms the simplification:

| a | b | Original y | Simplified y |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 |

A designer might draw two AND gates, an inverter and an OR gate from the first expression. In this binary model the implementation only needs a connection carrying a. Counting operators in the original text would overestimate the work.

The binary assumption matters. An unknown simulation value is not a third physical voltage level in this proof. Four-state HDL evaluation with X values can behave differently from Boolean simplification. Define the legal state/input space and initialization assumptions before using simulation differences to judge a transformation.

## Share a resource without adding a cycle

Consider a second original design with four-bit operands a, b, c and d and a select bit s:

```text
if s = 0: y = (a + b) modulo 16
if s = 1: y = (c + d) modulo 16
```

One architecture has two adders feeding a result selector. Another has two operand selectors feeding one adder. In the latter, s selects a or c for the first input and b or d for the second. Both express the same combinational function, as long as the selector chooses the pair consistently.

Assume fictional cell costs: one four-bit adder costs 20 units and one four-bit two-input selector costs 6 units. The parallel architecture costs 2 × 20 + 6 = 46 units. The shared architecture costs 20 + 2 × 6 = 32 units, a reduction of 14 units. These are an accounting exercise, not library measurements or a prediction of synthesis output.

Do not conclude that sharing always makes the circuit faster. The positions of the selectors, operand arrival times, fanout and wiring can change the critical path. Nor does this transformation authorize serializing two required outputs across two cycles: that would change a contract that requires both sums simultaneously.

## Follow the implementation evidence

For a reproducible synthesis experiment, retain the HDL, top-module name, tool version, target libraries, constraints and script. Inspect warnings for unresolved modules, inferred storage, removed logic and width changes. Compare the generated behavior against the reference contract, rather than accepting a small cell count as proof of correctness.

A mapped report should identify what cells were selected. An unmapped arithmetic operator is evidence of an intermediate representation, not proof that a final target implementation exists. Subsequent physical design must place instances, connect them and check implementation constraints.

No synthesis tool was run for the examples here. The executable check validates the binary simplification, all 131072 input/select combinations for the sharing identity, and the fictional resource arithmetic. It does not attest to an emitted netlist, tool optimization or layout.

## Exercises and answers

1. If the adder cost becomes 12 units while a selector still costs 6, the parallel design costs 30 and the shared design 24. The saving is 6 units, not the previous 14.
2. If both sums are required at once on separate outputs, can this single-adder arrangement satisfy that interface? No: the selector discards one operand pair. Adding storage and another cycle would require a different temporal contract.
3. What must be checked if a design only works after reset? Verify the reset and reachable-state assumptions used by equivalence checking. An optimization justified only for reachable states need not preserve arbitrary uninitialized simulations.

The next step after choosing implementation cells is physical design: a logically correct connection graph still needs legal placement, wiring, power and timing.
