---
id: concept.simulation-and-verification
type: concept
locale: en
slug: simulation-and-verification
area: integrated-circuit-design
title: Simulation and verification — contracts, checks and coverage
summary: Build an independent oracle, distinguish exhaustive scope from coverage
  and understand bounded formal and equivalence checks.
status: published
updated: 2026-10-26
prerequisites:
  - concept.rtl-and-hardware-description
related:
  - path.integrated-circuit-design
sources:
  - title: YosysHQ SBY — formal verification tasks and getting started
    url: https://yosyshq.readthedocs.io/projects/sby/en/latest/quickstart.html
  - title: YosysHQ EQY — equivalence checking
    url: https://yosyshq.readthedocs.io/projects/eqy/en/latest/
  - title: YosysHQ SBY — Formal extensions to Verilog, assume/assert/cover semantics
    url: https://yosyshq.readthedocs.io/projects/sby/en/latest/verilog.html
---
## Start with a behavior you can check

A simulator evaluates a hardware description under chosen inputs. Verification asks whether the implementation satisfies its intended contract. These overlap, but a simulator reporting no errors is not enough if the testbench never checks the result.

The [RTL accumulator](/library/integrated-circuit-design/rtl-and-hardware-description/) gives a concrete contract. At each rising edge, reset clears q and prior. Otherwise, enable stores the low four bits of q + d in q and the old q in prior. Without reset or enable, both registers hold. Inputs are assumed stable around the edge. This contract says what to compare, when to compare it and which conditions are outside the model.

A testbench supplies a clock and inputs, observes outputs and decides whether the observations agree with that contract. Keep the reference model simple and independently expressed. Copying the implementation into the checker can reproduce the same mistake twice.

## Separate stimulus, oracle and observation

Stimulus determines the inputs: reset, enable and d in this example. An oracle calculates the expected outputs. Observation samples the implementation after the simulator has applied the edge-triggered updates.

With nonblocking assignments, checking in the same scheduling region as the clock event can observe the previous value. A correct checker must allow the modeled updates to settle before comparing. Conversely, changing data at exactly the sampling edge can introduce a testbench race rather than a meaningful hardware test.

Use explicit cases before relying on random stimulus. Check reset with enable both low and high, disabled holds with changing d, ordinary addition, wraparound and consecutive enabled cycles. Those cases probe different clauses of the contract.

| q before | prior before | Reset | Enable | d | q after | prior after |
| --- | --- | --- | --- | --- | --- | --- |
| 14 | 7 | 0 | 1 | 3 | 1 | 14 |
| 14 | 7 | 0 | 0 | 3 | 14 | 7 |
| 14 | 7 | 1 | 1 | 3 | 0 | 0 |

The first row distinguishes modulo arithmetic from an unbounded sum. The second checks both registers, not only q. The third establishes reset priority.

## Count what exhaustive testing actually covers

For the accumulator's next-state arithmetic, q has 16 possibilities, d has 16, reset has two and enable has two. That gives 16 × 16 × 2 × 2 = 1024 combinations. Testing every combination can exhaust that finite input/current-q space.

It does not exhaust every possible prior value unless the checker also varies prior. Since prior has 16 values, a full enumeration of both state registers and these controls contains 16384 combinations. Nor does a single-step enumeration automatically check every long sequence or simulator scheduling behavior.

This distinction matters when describing results. “Every four-bit operand and control combination” is a precise scope; “the hardware is fully verified” is a much larger claim. The repository's existing HDL checker for the accumulator has its own documented stimulus and actual simulation evidence. The additional exercises here check the mathematical model rather than claim another simulator run.

## Write properties and assumptions separately

A property states something the design must satisfy. For example: after an accepted reset edge, q and prior are zero. A hold property says that if reset and enable are both low at an edge, next state equals previous state. An update property compares enabled arithmetic with the modulo rule.

An assumption restricts the environment, such as stable synchronous inputs or a reset sequence. If an assumption accidentally forbids every enabled cycle, an addition property may pass without testing addition. This is called vacuous success: the interesting condition never occurs.

Coverage asks whether relevant situations were reached. A coverage hit does not prove correct behavior, and a passing assertion does not prove that every interesting situation was reached. Use both questions. Functional coverage might count reset while enabled, wraparound and back-to-back accepted updates.

## Understand formal and equivalence checks

Bounded formal checking searches for violations within a stated number of steps. Passing that bound does not by itself prove arbitrarily long behavior. An unbounded proof needs an appropriate proof method and assumptions. A counterexample is a trace that shows how a property fails under the checked model.

Equivalence checking compares two descriptions, such as RTL and a synthesized netlist, under a defined correspondence. It can establish that a transformation preserves behavior. It cannot make an incorrect specification correct merely because both versions share it.

Try a deliberate fault: let prior capture the new sum instead of old q. In the first table row, q still becomes 1, but prior incorrectly becomes 1 instead of 14. A checker that observes only q misses this fault. Deliberate mutation is useful evidence that a test can detect the error it claims to guard against.

## Exercises and explained answers

1. Starting with q = 15 and prior = 2, reset = 0, enable = 1 and d = 2, find both next values. The sum is 17, so q becomes 1 and prior becomes 15.
2. How many cases enumerate q, prior, d and both controls? The count is 16³ × 2² = 16384. Omitting prior reduces the count but also narrows the claim.
3. Does passing a 20-edge formal bound prove there is no failure at edge 21? No; that requires a further argument or proof result beyond the bound.
4. Why check a fault deliberately? If changing old-q capture to new-sum capture produces no test failure, the claimed check is incomplete or its observation is wrong.

Verification reports should identify the model, properties, assumptions, explored scope and unresolved boundaries. Physical timing and electrical behavior remain separate checks, even after functional verification succeeds.
