---
id: lab.boolean-gates
type: lab
locale: en
slug: boolean-gates
title: Boolean gate workbench
summary: Predict and verify AND, OR, NOT and XOR with two inputs and complete truth tables.
status: published
updated: 2026-10-24
widget: boolean-gates
prerequisites: [concept.boolean-algebra]
related: [history.switching-circuit-logic, concept.logic-gates]
requirements: [A current browser; no installation or account, JavaScript for the interactive controls; static tables are always available]
steps: [Select AND and try all four input combinations, Repeat with OR and XOR; compare their outputs for A = 1 and B = 1, Select NOT and vary A; B has no effect, Use Reset inputs to return both inputs to 0]
expected_results: [AND produces 1 only for two inputs of 1, OR produces 0 only for two inputs of 0, XOR produces 1 only when the inputs differ, NOT produces the inverse of A]
sources:
  - title: Shannon, A Symbolic Analysis of Relay and Switching Circuits (1938) — switching logic context
    url: https://tubes.mit.edu/6S917/_static/2025/resources/shannon38.pdf
  - title: Cornell CS 3410, Gates and Logic — definitions and arithmetic
    url: https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/06-gates.pdf
---
## Predict before you toggle

Start with A = 0 and B = 0. Write down a prediction, then change an input and compare the output. The tables give every possible input combination, so you can reproduce the complete experiment without JavaScript.

## Understand the result

AND requires both inputs. OR accepts either input, including two inputs of 1. XOR accepts exactly one input of 1. NOT inverts A and does not use B. The workbench and tables implement these definitions; they are original educational examples.

## What this experiment does not measure

The model has no voltage, current, propagation delay, power use or component failure. It does not connect to hardware. Its output is a Boolean result, not evidence that a physical circuit will meet electrical or timing requirements.
