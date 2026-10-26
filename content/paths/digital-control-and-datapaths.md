---
id: path.digital-control-and-datapaths
type: path
locale: en
slug: digital-control-and-datapaths
title: Digital control and datapaths
summary: Extend digital logic with a pattern-detecting controller and a four-bit ALU, then reason about a registered computation.
status: published
updated: 2026-10-26
prerequisites: [path.digital-logic-foundations]
steps: [concept.finite-state-machines, concept.arithmetic-logic-unit]
related: [path.digital-logic-foundations]
sources:
  - title: MIT Computation Structures — Building the Beta, ALU Op Datapath
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/c13s1/
---
## Move from components to coordinated work

Complete [digital logic foundations](/learn/digital-logic-foundations/) first. Its adders, selectors, registers and synchronous counter supply the prerequisites for this continuation. No hardware kit or HDL tool is required: first reproduce the examples on paper.

A controller remembers which stage of work is active and selects actions. A datapath carries and transforms the values used by those actions. These chapters introduce each responsibility with a small explicit contract. They prepare for processor organization without assuming an instruction set already exists.

## Follow the two chapters

1. **Finite-state machines:** choose states by the history that matters; derive a complete transition table and preserve overlapping matches. Predict the output before following the trace.
2. **Arithmetic logic unit:** select arithmetic or Boolean operations, reuse addition for subtraction, distinguish carry from signed overflow and connect results to an enabled register.

The linked chapters provide the canonical explanations. The examples are original teaching designs. The source demonstrates a larger instruction-driven datapath; this path does not reproduce its processor or claim hardware construction is complete.

## Synthesis exercise

Connect the pattern detector's Moore match output to the write enable of a result register T. Connect the four-bit ALU to T's data input. Hold A = 0111, B = 0001 and operation = ADD throughout. Start the detector in A and T = 0000 after a synchronous reset; hold reset low while sampling the bit stream 10101.

Both the state register and T use the same rising edge. T samples the write enable from the detector's state **before** that edge. Ignore propagation details beyond assuming all setup and hold constraints are satisfied. Determine the detector state and T immediately after each of the five edges. On which edges is T written? What are the ALU flags, and why is the signed result misleading if V is ignored?

## Answer with edge ordering

| Edge | Input | Detector before | Detector after | Write T | T after |
|---|---|---|---|---|---|
| 1 | 1 | A | B | 0 | 0000 |
| 2 | 0 | B | C | 0 | 0000 |
| 3 | 1 | C | D | 0 | 0000 |
| 4 | 0 | D | C | 1 | 1000 |
| 5 | 1 | C | D | 0 | 1000 |

A match becomes visible after edge 3, enabling T to capture the ALU result at edge 4. A second match appears after edge 5; T would capture again at edge 6 if another valid clock edge occurs with reset low. The two registers do not update in an order that lets T observe the detector's newly stored state at the same edge.

The ALU produces R = 1000, C = 0, V = 1, Z = 0, N = 1. As unsigned arithmetic this is 8. Interpreting 1000 as signed yields -8, while the exact signed computation 7 + 1 is +8 and cannot fit. V warns that the retained signed interpretation does not represent the exact sum.

The wiring is a teaching composition, not a recommended handshake protocol. Real systems must specify operand stability, backpressure, reset behavior and the timing of capture. Next, processor architecture adds an instruction contract to organize such state changes.
