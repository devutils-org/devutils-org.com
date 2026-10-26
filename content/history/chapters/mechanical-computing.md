---
id: history.mechanical-computing
type: history
history_kind: chapter
locale: en
slug: mechanical-computting
category: mechanical-computing
title: Mechanical computing — carrying, sequencing and designing engines
summary: Compare hand-operated calculators, Jacquard control cards, Babbage's difference and analytical engines, and Lovelace's account of a machine that remained unbuilt.
status: published
updated: 2026-10-26
prerequisites: [history.mathematics-of-computation]
related: [concept.binary-adders, concept.memory-and-registers]
sources:
  - title: Schickard's Calculator and The Pascaline — Computer History Museum
    url: https://www.computerhistory.org/revolution/calculators/1/47
  - title: The Leibniz Step Reckoner and Curta Calculators — Computer History Museum
    url: https://www.computerhistory.org/revolution/calculators/1/49
  - title: Punched cards control Jacquard loom — Computer History Museum
    url: https://www.computerhistory.org/storageengine/punched-cards-control-jacquard-loom/
  - title: Principle of the Difference Engines — Computer History Museum
    url: https://www.computerhistory.org/babbage/howitworks/
  - title: Imagining AI, Babbage and Lovelace — Oxford History of Science Museum
    url: https://www.hsm.ox.ac.uk/imagining-ai
---
## What part of the procedure does the device perform?

The previous chapter separated a procedure from its notation and its justification. A mechanical device adds another question: which operations are performed by the physical arrangement, and which remain the operator's responsibility?

A person can move counters according to a learned procedure. A calculator can mechanically enforce part of an arithmetic operation. A sequence-controlled mechanism can select successive actions from an external record. These are different allocations of work, not interchangeable claims to be “the first computer.” A machine may be digital because it represents discrete values without being electronic or binary.

Our examples concern selected European devices and designs. They are not an exhaustive history of calculating instruments. Surviving originals, later replicas, drawings and descriptions are different kinds of evidence and should be identified accordingly.

## Pascal and the problem of carrying

The Computer History Museum describes Pascal's adding machines of the 1640s, their stylus-operated input wheels and their internal carry mechanism. Its account also discusses fragility: a convincing idea for numerical representation does not guarantee reliable mechanical operation. The same collection distinguishes Schickard's earlier calculator, known through letters and sketches, from surviving later replicas.

Why is carry important? Consider an invented three-position decimal register holding 099. Adding one requires the units position to change 9 to 0, a carry to change the tens position 9 to 0, and another carry to change the hundreds position 0 to 1. The result is 100. Merely rotating the units wheel without a transfer mechanism would give the wrong result.

This is a place-value model, not a diagram of Pascal's particular mechanism. Real mechanisms must manage forces, motion and sequencing so a cascade of carries works. These physical responsibilities are absent from an arithmetic equation, just as the electrical timing of an adder is absent from its truth table.

If the same three-position model starts at 999, adding one needs a fourth digit. A design must specify whether overflow is displayed, blocked or lost. Our toy model discards it and displays 000. We do not attribute that chosen behavior to every historical calculator.

## Leibniz and repeated arithmetic

Leibniz's stepped-reckoner work in the later seventeenth century used a stepped-drum mechanism. The Computer History Museum describes how a drum could represent digits and how the approach continued in later calculator designs. Its account also records multiple versions, so a single dated demonstration should not stand for a completed, uniformly reliable product lineage.

Multiplication illustrates a possible division of labor. To obtain 23 × 4, a person could ask a mechanism to add 23 four times, producing 23, 46, 69 and 92. A more capable arrangement could assist the repetitions and decimal positioning. How much is automatic depends on the particular machine and operating procedure.

The numerical sequence is an original illustration, not an operating manual for Leibniz's surviving instrument. Calling a machine “four-function” does not by itself say how many turns, settings or human decisions a division requires. Mechanism, interface and practical use all matter.

## Jacquard separates pattern from mechanism

The Computer History Museum describes Jacquard's 1801 demonstration and a chain of punched cards controlling which warp threads are raised. Changing cards changes a textile pattern without rebuilding the loom's entire mechanism. It also documents Babbage's later plans for punched-card input to the Analytical Engine.

An invented four-thread example makes selection visible. Read each position as one thread, with 1 meaning raise and 0 meaning leave down:

| Card | Toy selection |
|---|---|
| A | 1010 |
| B | 0101 |
| C | 1111 |

Running A, B, A repeats one choice around another. Running C, C raises all four selected threads twice. These strings model control choices; they do not reproduce a historical card layout, a complete weave or the actual hole-to-thread polarity of a particular loom.

Cards can preserve a sequence of control choices without constituting modern random-access memory or a general-purpose processor. The historical connection to Babbage is more specific than a visual resemblance between punched holes and binary digits: it concerns external control and input in a documented design tradition.

## Difference engines change the calculation

Babbage's difference engines use finite differences to generate table values through addition. The Computer History Museum explains how a constant higher-order difference lets lower-order values be extended. This changes the problem from repeatedly performing a full multiplication to updating a small set of quantities.

Use the original teaching polynomial f(n) = n² + 2:

| n | f(n) | Forward first difference | Second difference |
|---|---|---|---|
| 0 | 2 | 1 | 2 |
| 1 | 3 | 3 | 2 |
| 2 | 6 | 5 | 2 |
| 3 | 11 | 7 | 2 |

Here the forward difference at n means f(n + 1) - f(n). Start with value 2 and first difference 1. Add the first difference to the value, then add 2 to the first difference. Repeating yields values 3, 6, 11 and 18, with no multiplication during those update steps. Reversing the order would use the wrong difference and spoil the sequence.

The arithmetic does not prove that a particular design was built, manufactured reliably or deployed for useful tables. Oxford's museum distinguishes Babbage's prototypes from a full difference engine not completed in his lifetime and notes the Science Museum's later construction. A modern reconstruction is evidence about a design and its realization under documented conditions; it is not a machine secretly operating in the nineteenth century.

## Analytical Engine and Lovelace

The Analytical Engine was a different ambition from a fixed table-generating engine. Oxford's manuscript-based exhibit describes a proposed general-purpose mechanical engine and a list of operations from around 1837. It remained unbuilt as a complete engine. Its intended capabilities must be described as design capabilities rather than measured performance.

In 1843 Ada Lovelace collaborated with Babbage on an account of the Analytical Engine, extending a description by Luigi Menabrea with notes. Oxford displays a calculation diagram concerning Bernoulli numbers and discusses repeated operations. The exhibit explicitly cautions against a simple “first computer programme” label. It is more precise to identify the published explanatory work and the machine it concerned.

A table describing a computation can be historically important even when it was not run on a completed machine. Conversely, the absence of a completed engine does not turn every surviving plan into a demonstrated implementation. Documentation, design and execution are separate achievements.

## Reading checks and answers

1. Why does 099 + 1 require more than one position to change? The units and tens each cross their decimal boundary, propagating a carry to the hundreds position.
2. Continue the polynomial example to n = 4. From 11 add 7 to obtain 18; the next first difference becomes 9. Update value before advancing the difference.
3. Do two punched-card patterns make a loom a general-purpose arithmetic engine? No. A changeable control sequence does not establish that broader computational capability.
4. Is a later museum reconstruction evidence of a nineteenth-century production deployment? No. Identify its construction date and distinguish it from the original design.
5. Does the Bernoulli calculation diagram prove that the complete Analytical Engine executed it? No. It is evidence about a described computation for an unbuilt complete engine.

The next chapter shifts from mechanisms to foundational questions: what counts as a mechanical procedure in principle, and are there problems no such procedure can decide?
