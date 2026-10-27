---
id: concept.boolean-algebra
type: concept
locale: en
slug: boolean-algebra
area: digital-logic
aliases: [/knowledge/boolean-algebra/]
title: Boolean algebra
summary: Describe two-state decisions with AND, OR and NOT, then connect the expressions to switching circuits.
status: published
updated: 2026-10-24
related: [figure.claude-shannon, history.switching-circuit-logic, concept.logic-gates]
sources:
  - title: Shannon, A Symbolic Analysis of Relay and Switching Circuits (1938), introductory sections
    url: https://tubes.mit.edu/6S917/_static/2025/resources/shannon38.pdf
  - title: Cornell CS 3410, Gates and Logic — definitions and arithmetic
    url: https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/06-gates.pdf
---
## A language for two-state decisions

In this introductory model, a Boolean variable has one of two values: 0 or 1. We interpret them as false and true. The same symbols can describe whether an ideal switch allows a path to conduct. The interpretation matters: a number in an expression is a model of a state, not a measurement of voltage.

You need no electronics background for this page. Familiarity with tables and parentheses is enough.

## Three operations

AND is true when both inputs are true. OR is true when at least one input is true. NOT reverses a value. Here, OR includes the case where both inputs are true; exclusive OR is a different operation.

| A | B | A AND B | A OR B |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 |

NOT 0 = 1 and NOT 1 = 0. A truth table lists every possible input combination, so it lets us check an expression without relying on a few examples.

## Work through a decision

Imagine a fictional access rule: a door may open when a badge is valid and either the room is staffed or a supervisor has approved access. This is a teaching example, not a security design.

```text
open = badge AND (staffed OR approved)
```

For badge = 1, staffed = 0 and approved = 1, evaluate the parentheses first: 0 OR 1 = 1. Then 1 AND 1 = 1. Changing badge to 0 makes the result 0 regardless of the other two inputs. Three inputs have eight combinations; checking all eight would fully specify this Boolean rule.

## From expressions to paths

Under a convention where 1 means a conducting switch, two switches in series model AND: both must conduct. Two branches in parallel model OR: either branch provides a path. This page uses 1 for conduction. Shannon’s original paper instead defines a hindrance variable with 1 for an open circuit (printed p. 472); do not transfer its notation directly into this convention. This interpretation connects symbolic reasoning to [switching-circuit analysis](/history/birth-of-computer-science/switching-circuit-logic/).

An expression can have several equivalent forms. For example, A AND (B OR C) equals (A AND B) OR (A AND C). Enumerating the eight combinations of A, B and C verifies that they agree. Algebraic transformations can therefore help compare alternative circuit structures.

## What the model leaves out

A Boolean expression does not specify propagation delay, power consumption, noise tolerance or what happens while an input changes. A real circuit needs a physical implementation and timing analysis. Sequential systems also need a representation of stored state; a combinational expression alone does not describe their full behavior.

## Historical connection

[Claude Shannon](/figures/claude-shannon/) connected symbolic logic with relay-network analysis in the work discussed in our [historical entry](/history/birth-of-computer-science/switching-circuit-logic/). The cited paper explains the algebraic treatment; the truth table and access-rule example here are original teaching examples.

## Continue learning

Read [logic gates](/library/digital-logic/logic-gates/) next, or follow the complete
[digital-logic path](/learn/digital-logic-foundations/) through selection, addition,
storage and a clocked counter.
