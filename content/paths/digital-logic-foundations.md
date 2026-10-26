---
id: path.digital-logic-foundations
type: path
locale: en
slug: digital-logic-foundations
title: Digital logic — from decisions to state
summary: A seven-step route through Boolean rules, gates, selection, arithmetic, storage and a clocked counter.
status: published
updated: 2026-10-24
steps: [concept.boolean-algebra, concept.logic-gates, lab.boolean-gates, concept.combinational-logic, concept.binary-adders, concept.memory-and-registers, concept.sequential-logic]
related: [path.logic-to-circuits]
sources:
  - title: MIT OpenCourseWare, Computation Structures — course structure and reference lessons
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/
---
## Start with a question

How can a machine make a decision, add a value and remember the result for the next operation? This path answers that question at the digital-logic level. It builds from a two-valued rule to a small clocked system, with no programming environment or electronics kit required.

The articles and exercises are in English. You need basic arithmetic and the ability to read a table. Binary place values are introduced in the adder lesson. Study at your own pace; a useful pattern is to read one article, reproduce its example, then follow the next linked step.

## Follow the seven steps

1. **Boolean algebra:** evaluate AND, OR and NOT and list every combination of inputs.
2. **Logic gates:** treat those rules as components; derive NAND and distinguish a truth table from an electrical specification.
3. **Gate workbench:** predict the outputs of AND, OR, NOT and XOR, then check them interactively or against the static tables.
4. **Combinational logic:** derive a selector expression and prove that it chooses the requested input.
5. **Binary adders:** follow a carry through four positions and explain why a result may need an extra bit.
6. **Memory and registers:** distinguish a stored value from its changing input; calculate the capacity and addressing of a small memory.
7. **Sequential logic:** combine arithmetic and storage, trace a counter and identify the time available between edges.

The linked reading steps below use the canonical articles rather than duplicate their explanations. The older [logic-to-circuits path](/learn/logic-to-circuits/) remains a shorter introduction with historical context.

## Check your understanding

Before considering the path complete, solve these without looking at the answers:

- Which of OR and XOR returns 0 for inputs 11?
- With D0 = 1010 and D1 = 0111, what does a four-bit selector return for S = 1?
- What are the complete unsigned result and retained four-bit result of 1111 + 0001?
- How many payload bytes are in eight words of sixteen bits each?
- Starting at counter state 101, what happens over enable values 1, 0, 1 with reset held at 0?

## Answers and scope

The distinguishing gate is XOR: its result for 11 is 0. The selector returns 0111. The unsigned sum is 10000 and the retained four-bit value is 0000. The memory holds sixteen payload bytes. The counter visits 110, 110 and 111.

You should also be able to name a limit of each model: a gate table omits electrical behavior, a combinational equation omits settling time, a register trace assumes valid timing, and a synchronous counter needs a clocking contract.

This completes the first digital-logic block, not the full planned “Build a computer from scratch” curriculum. Continue with [digital control and datapaths](/learn/digital-control-and-datapaths/) for finite-state machines, an ALU and synchronous interfaces. Processor organization builds on those contracts; hardware construction requires additional implementation work. The source course is a reference for the subject progression; these articles, worked values and completion exercises are original.
