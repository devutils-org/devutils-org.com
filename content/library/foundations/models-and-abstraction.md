---
id: concept.models-and-abstraction
type: concept
locale: en
slug: models-and-abstraction
area: foundations
title: Models and abstraction
summary: State what a model promises, trace its predictions and identify where
  its assumptions stop applying.
status: published
updated: 2026-10-25
prerequisites:
  - concept.information-and-representation
related:
  - path.computing-foundations
  - concept.boolean-algebra
sources:
  - title: Steve Ward, Computation Structures — The Digital Abstraction, sections
      5.1–5.3
    url: https://computationstructures.org/notes/digitalabstraction/notes.html
  - title: "MIT Mathematics for Computer Science — sections 1.1–1.4: propositions,
      predicates and proof"
    url: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session1.pdf
---
## Choose a question before choosing a model

A model selects the details needed to answer a question. A specification states the behavior a component promises under stated conditions. An abstraction lets you work with that interface while leaving some implementation details aside.

Think of the indicator used in the previous chapter. To decide whether it should be on, a two-state rule may be enough. To calculate its electrical power, you need more detail. Neither question is answered simply by drawing a more complicated picture; you need the particular quantities and relationships that the question involves.

The earlier chapters supplied complementary tools: precise claims, consistent units, signal interpretation and agreed representations. Here we use them together and check where one description stops supporting the next.

## Write a small contract

Our indicator has two binary inputs: enabled and ready. Assume both are valid and stable. The output is on exactly when both inputs are 1. This is a functional contract: it tells us which result is promised for each permitted input pair.

| Enabled | Ready | On |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

You can construct the table from the sentence. With enabled = 0, the condition “both” fails for either value of ready. With enabled = 1, the output follows ready. That covers the four combinations of two binary inputs.

For enabled = 1 and ready = 0, the table predicts on = 0. For enabled = 0 and ready = 1, the output is also 0. The rule cares about the pair of inputs, not merely whether one input happens to be 1.

The table does not specify a physical voltage, a delay or what happens when an input has no valid logical interpretation. Those are additional questions with additional contracts.

## Distinguish assumptions from conclusions

For this example, the binary input domain and the “both inputs” rule are assumptions. The four output values follow from those assumptions. A successful table calculation cannot establish that a real receiver actually supplies valid binary inputs at the time they are observed.

To apply the model to a device, identify the chain of reasoning: what was measured, what rule decodes it, and which functional rule consumes the decoded symbols? If an assumption in that chain is missing, the later conclusion may not apply even though the arithmetic is correct.

This is why it helps to write assumptions before trying a calculation. You can then ask which change would require a different model. An input with three possible messages, a rule that remembers an earlier value, or a receiver with different thresholds would each change this example in a different way.

## Test the boundary of a promise

Suppose someone observes an output voltage of 1.4 V and asks whether the logical table is correct. The table alone cannot answer. We need the voltage interpretation and the measurement time. In the earlier receiver model, 1.4 V had no guaranteed logic value.

Now suppose a sender uses 0.4 V for 0 and 1.8 V for 1. A receiver uses the earlier contract: 0 V through 0.8 V means 0, and 2.0 V through 3.0 V means 1. Compare their agreements:

| Sender's intended bit | Sent voltage (V) | Receiver interpretation |
|---|---|---|
| 0 | 0.4 | 0 |
| 1 | 1.8 | Not guaranteed |

Both components use the words “0” and “1,” but their physical interfaces do not agree for the second row. The receiver has made no promise for 1.8 V. Rechecking the indicator's truth table cannot repair that mismatch; the electrical interfaces must be made compatible.

Timing can create another mismatch. If an output is promised only after a delay, observing it sooner is outside the promise even if its eventual value is correct. Check both what the interface means and when its conditions hold.

## Compose two small rules

To practice using an interface, feed the indicator output into a second component that copies its binary input. Suppose the first component guarantees its output within 2 μs after its inputs settle, and the second guarantees its copy within a further 3 μs after its input settles. Assume compatible signal levels and that the original inputs stay fixed.

A conservative end-to-end bound is the sum: the first output is valid within 2 μs, then the second has at most 3 μs more. The final output is guaranteed within 5 μs of the original inputs settling. It may settle earlier; the bound is a deadline, not an exact completion time.

~~~text
total delay bound = 2 μs + 3 μs = 5 μs
~~~

The logical rule and timing assumptions each contribute something. The table gives the value. The delay bounds give when you can rely on it. Interface compatibility lets you connect one component's guarantee to the next one's assumptions.

## Connect levels of description

Follow the same indicator through four levels:

1. The message is whether the indicator should be on.
2. The representation assigns 0 or 1 to that message.
3. The logical rule computes the bit from enabled and ready.
4. The physical interface carries that bit with a specified signal and timing.

When debugging, locate the failed agreement. If the codebook swaps on and off, a correct voltage may still communicate the wrong meaning. If the voltage is outside the receiver's valid ranges, the intended message is not guaranteed to arrive. If you observe too early, the value may not yet have settled.

Testing all four binary input cases covers the functional rule's finite domain. It does not prove every statement about a real implementation. The useful question is what the test actually exercised and which assumptions it left unchecked.

## Try it yourself

1. For enabled = 0 and ready = 1, predict the output and explain the relevant row.
2. Name two questions the logical table cannot answer.
3. Why is a sender's intended 1 at 1.8 V not guaranteed to be read as 1 by the example receiver?
4. With delay bounds of 2 μs and 3 μs, can you promise the final output at exactly 4 μs?
5. Explain why a complete truth table does not establish compatible physical interfaces.

## Answers and next steps

For the first, the output is 0 because the rule requires both inputs to be 1. The ready input alone cannot enable it.

For the second, power consumption and propagation delay require information absent from the table. Naming an input/output rule does not supply those quantities.

For the third, 1.8 V lies above 0.8 V and below 2.0 V. It is in the receiver's unspecified region even though the sender intends 1. The problem is an interface mismatch.

For the fourth, the guarantees give a bound of 5 μs. Four microseconds may be enough in a particular case, but it does not follow from these bounds. Wait until the guaranteed deadline while maintaining the input assumptions.

For the fifth, the table contains symbols and output values. It does not contain the sender's output voltage ranges or receiver's accepted input ranges. Those must be checked separately.

Continue through the editorial map with [physics for computing](/learn/physics-for-computing/), or study the symbolic rules in [Boolean algebra](/library/digital-logic/boolean-algebra/). You can return to the [foundations path](/learn/computing-foundations/) for a check across all five chapters.
