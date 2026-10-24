---
id: concept.combinational-logic
type: concept
locale: en
slug: combinational-logic
area: digital-logic
title: Combinational logic
summary: Specify a function, build it from gates, and verify a selector without confusing logic with timing.
status: published
updated: 2026-10-24
prerequisites: [concept.logic-gates]
related: [concept.binary-adders, concept.memory-and-registers]
sources:
  - title: MIT OpenCourseWare, Computation Structures — combinational logic and multiplexers
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c4/c4s1/
---
## A function of the present inputs

A combinational component computes outputs from its current inputs, with no stored history in its functional model. A gate is one example; a larger network can have the same kind of boundary. Read [logic gates](/knowledge/digital-logic/logic-gates/) first.

A complete specification names the inputs and outputs and gives a result for every allowed combination. In the usual acyclic composition, gates feed later gates without a feedback cycle. Physical outputs still need time to settle: “combinational” does not mean instantaneous.

## Specify a one-bit selector

Our example chooses one of two data bits. Call them D0 and D1, with a selection bit S. When S = 0 choose D0; when S = 1 choose D1. This is a two-input multiplexer, usually shortened to MUX.

| S | D0 | D1 | Y |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 |

The unselected input does not affect Y, but it still has a definite value in each row. Eight rows cover all combinations of three one-bit inputs.

## Build the expression

Split the rule into two mutually exclusive cases:

```text
choose0 = (NOT S) AND D0
choose1 = S AND D1
Y       = choose0 OR choose1
```

For S = 0, choose1 is 0 and choose0 equals D0. For S = 1, choose0 is 0 and choose1 equals D1. That proves the expression matches the selection rule without inspecting a particular transistor circuit.

Suppose D0 = 1, D1 = 0 and S = 1. The first branch is 0 AND 1 = 0. The second is 1 AND 0 = 0. OR combines them to give Y = 0. The tempting shortcut “one of the data bits is 1, so Y is 1” fails because selection is part of the specification.

## Scale the boundary

A four-bit selector can use the same S for four one-bit selectors. With D0 = 1010 and D1 = 0111, S = 0 selects 1010 and S = 1 selects 0111. Every output bit selects the corresponding input bit; there is no carry between positions.

This gives a way to reason hierarchically. Verify the one-bit component, then verify that the wider assembly connects each position correctly. Reusing a verified component does not verify the wiring around it.

## Check behavior and timing separately

An exhaustive truth table verifies the logical rule at stable inputs. It does not show transition behavior. Different paths can settle at different times, and a real output may briefly disagree with its eventual value. The downstream component must observe it under an appropriate timing contract.

Turning the MUX output back into an input changes the problem: the acyclic combinational model no longer applies automatically. We will introduce storage explicitly in [memory and registers](/knowledge/digital-logic/memory-and-registers/).

## Exercise and answer

Keep D0 = 0 and D1 = 1. What function of S does the selector compute? Y = S. Now reverse the data bits: Y = NOT S. These are two different uses of the same selection rule.

Next, [binary adders](/knowledge/digital-logic/binary-adders/) use combinational components to perform arithmetic. The tables, substitutions and four-bit values here are original worked examples. The cited lesson supplies the general combinational and MUX model.
