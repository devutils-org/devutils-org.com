---
id: concept.logic-gates
type: concept
locale: en
slug: logic-gates
area: digital-logic
title: Logic gates
summary: Turn Boolean operations into connected components, and distinguish a logical result from an electrical implementation.
status: published
updated: 2026-10-24
prerequisites: [concept.boolean-algebra]
related: [lab.boolean-gates, concept.combinational-logic]
sources:
  - title: MIT OpenCourseWare, Computation Structures — CMOS, logic-gate construction
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/
  - title: Cornell CS 3410, Gates and Logic — gate notation and Boolean operations
    url: https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/06-gates.pdf
---
## From an operation to a component

A logic gate is a component described by a Boolean input/output rule. AND, OR and NOT are familiar rules; a gate gives us a boundary around one of them so that its output can feed another component. Begin with [Boolean algebra](/library/digital-logic/boolean-algebra/) if truth tables are new to you.

Two useful questions are different: what result does the component promise, and how is it implemented? A truth table answers the first. A transistor circuit and its electrical specifications answer the second. MIT’s CMOS lesson develops that implementation connection; this page stays mainly at the logical boundary.

## Read the gate families

AND produces 1 when both inputs are 1. OR produces 1 when either input is 1, including when both are 1. NOT reverses one input. XOR produces 1 when the two inputs differ.

Negating an output produces another useful family. NAND means NOT AND; NOR means NOT OR; XNOR negates XOR. For two inputs:

| A | B | NAND | NOR | XNOR |
|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 1 |

NAND is not XOR: their outputs disagree for inputs 0 and 0. Naming the rule precisely matters more than recognizing the shape of a symbol.

## Connect two stages

Consider a fictional indicator that lights only when the system is enabled and no fault is present. Define E as enabled and F as fault:

```text
F ──[NOT]── clear ──┐
                   [AND]── indicator
E ─────────────────┘

clear     = NOT F
indicator = E AND clear
```

The drawing shows the fault signal passing through NOT before meeting E at AND. With E = 1 and F = 0, clear = 1 and indicator = 1. With E = 1 and F = 1, clear = 0 and indicator = 0. With E = 0, the output is 0 for either fault value. These four cases fully specify this teaching example; it is not a fault-tolerant control design.

## Rebuild a rule using NAND

Tie the two logical inputs of a NAND operation to the same variable A:

```text
NAND(A, A) = NOT A
```

To reconstruct AND, negate a NAND result:

```text
T = NAND(A, B)
Y = NAND(T, T)
```

For A = B = 1, T = 0 and Y = 1. For the other three pairs, T = 1 and Y = 0. The two-stage expression therefore has the AND truth table. This is a logical equivalence, not a promise of identical delay, power or transistor count.

## Where the abstraction stops

Real inputs and outputs are voltages. A technology assigns valid voltage ranges to logical values, and a component takes time to respond. Intermediate voltages, loading and transitions need electrical analysis. Counting the gates in a drawing alone does not establish a usable clock frequency.

## Try it and check yourself

In the [gate workbench](/labs/boolean-gates/), predict the result before selecting each AND, OR, NOT or XOR combination. Then derive NAND on paper by inverting AND. Why does NAND(0, 0) equal 1? Because AND(0, 0) is 0 and negation reverses that result.

Continue with [combinational logic](/library/digital-logic/combinational-logic/) to turn several gate rules into a complete function. The worked indicator and NAND reconstruction above are original examples; the references provide the gate and implementation foundations.
