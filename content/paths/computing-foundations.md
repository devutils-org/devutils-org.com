---
id: path.computing-foundations
type: path
locale: en
slug: computing-foundations
title: Computing foundations — start from zero
summary: Five introductory chapters on reasoning, units, signals, information
  and models, before studying circuits or software.
status: published
updated: 2026-10-26
prerequisites: []
related:
  - path.physics-for-computing
  - path.digital-logic-foundations
steps:
  - concept.mathematical-reasoning
  - concept.units-and-scale
  - concept.signals-and-states
  - concept.information-and-representation
  - concept.models-and-abstraction
sources:
  - title: "MIT Mathematics for Computer Science — sections 1.1–1.4: propositions,
      predicates and proof"
    url: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session1.pdf
  - title: NIST Guide to the SI — chapter 7, expressing values of quantities
    url: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values
  - title: Steve Ward, Computation Structures — The Digital Abstraction, sections
      5.1–5.3
    url: https://computationstructures.org/notes/digitalabstraction/notes.html
  - title: Steve Ward, Computation Structures — Information, sections 3.1–3.2.1.1
    url: https://computationstructures.org/notes/information/notes.html
---
## Start here

This is the first reading route for someone beginning the computing stack from zero. You need basic addition, multiplication and division. No code editor, electronics kit or previous knowledge of circuits is required. All five chapters are available in English and French; use the language switch to follow the translated route.

Allow yourself to pause at each example. Write the calculation, predict an answer, then compare it with the explanation. The sequence below is an editorial choice, not an externally certified curriculum.

## Follow the five chapters

1. **Mathematical reasoning:** read a variable and formula, follow the operation order, state a domain and distinguish a proof from examples.
2. **Units and scale:** convert with unit-canceling ratios, estimate a result and distinguish a duration from a completion rate.
3. **Signals and states:** interpret voltage ranges, reason about their boundaries and see why sparse samples can miss a pulse.
4. **Information and representation:** derive pattern counts, read positional weights and encode as well as decode unsigned numbers.
5. **Models and abstraction:** separate assumptions from conclusions, diagnose an interface mismatch and combine simple timing guarantees.

Each chapter contains worked examples, exercises and step-by-step answers. The linked reading steps below open the canonical articles in order.

## Check your understanding

Try these without opening the answers:

1. Give a counterexample to “every even nonnegative integer is a multiple of four.”
2. Add 3 ms and 2500 μs.
3. In the fictional receiver, does 1.4 V guarantee 0 or 1?
4. How many fixed-width binary bits are needed to distinguish nine messages?
5. Does a correct logical table establish a real circuit's propagation delay?

## Answers and scope

The number 2 is a counterexample. The duration is 5.5 ms. The receiver guarantees neither value at 1.4 V. Nine messages require four bits. A logical table alone does not specify a physical propagation delay.

Completion means being able to explain these answers and name their assumptions, not simply recognizing the numbers. The references support the individual subjects: MIT's proof introduction, NIST's quantity conventions and the Computation Structures notes on digital abstraction and information. They do not endorse this particular reading route.

## Put the chapters together

Consider the four-message indicator from the representation chapter. Its codebook assigns 10 to Finished. A sender transmits the two bits at two agreed sampling times, with the signal settled at each sample. It uses 1.8 V for the intended first bit and 0.4 V for the second. The receiver uses the signal chapter's thresholds: 0 V through 0.8 V decodes to 0, and 2.0 V through 3.0 V decodes to 1.

Can you conclude that Finished was received? Explain the distinction between the intended message and the guaranteed decoded symbols. Then decide what changes if the first sample is 2.4 V instead.

## Work through the combined answer

First apply the receiver rule to the observations, rather than assuming the intended bits arrived. The first sample, 1.8 V, lies in the region with no guaranteed logic value. The second, 0.4 V, decodes to 0. You cannot establish the complete pattern 10, so you cannot guarantee the message Finished.

With the first sample changed to 2.4 V, both samples fall inside valid ranges. They decode to 1 and 0. The agreed codebook then interprets 10 as Finished. This conclusion still depends on the stated sampling and stability assumptions.

The exercise connects a precise claim, measured quantities with units, a decoding rule and a representation agreement. A correct codebook alone cannot compensate for an incompatible physical interface.

## Continue beyond foundations

Continue in the order of the editorial map with [physics for computing — from charge to solids](/learn/physics-for-computing/). Its five introductory chapters reuse the units, representations and modeling habits developed here.

You can also follow [digital logic — from decisions to state](/learn/digital-logic-foundations/) to work through Boolean operations, gates, arithmetic and storage. The [full computing stack](/library/computing-stack/) shows the available articles and the other planned domains.
