---
id: history.mathematics-of-computation
type: history
history_kind: chapter
locale: en
slug: mathematics-of-computation
category: mathematics-of-computation
title: Mathematics of computation — procedures, notation and proof
summary: Follow calculation procedures, al-Khwarizmi's transmitted arithmetic, binary representation, Boole's algebra and the distinction between testing and proving a program.
status: published
updated: 2026-10-26
prerequisites: [history.origins-of-information, history.origins-of-logic]
related: [concept.boolean-algebra, concept.mathematical-reasoning, history.switching-circuit-logic]
sources:
  - title: Euclid, Elements VII.2 — translation and guide by David E. Joyce, Clark University
    url: https://mathcs.clarku.edu/~djoyce/elements/bookVII/propVII2.html
  - title: MacTutor, Al-Khwarizmi — University of St Andrews
    url: https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/
  - title: MacTutor, Gottfried Leibniz — University of St Andrews
    url: https://mathshistory.st-andrews.ac.uk/Biographies/Leibniz/
  - title: George Boole — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/boole/
  - title: The Philosophy of Computer Science — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/computer-science/
---
## A result is not yet a procedure

Someone can know an answer without giving another person a repeatable way to obtain it. A procedure explains what to do with an input. A correctness argument explains why following the procedure produces the promised result. A representation determines how the quantities and intermediate results are written.

Those distinctions connect the previous chapters on records and logic. They also prevent a misleading story in which the invention of a particular symbol instantly creates modern programming. People performed systematic calculation long before electronic computers or a modern definition of an algorithm.

## Historical procedures before the modern word

Euclid's Elements, Book VII, Proposition 2 describes finding a greatest common measure of numbers not relatively prime. Joyce's translation and guide explain the repeated-subtraction process and its relation to remainders. The purpose is a mathematical construction and justification, not an instruction listing for a stored-program computer.

Use an original numerical example in modern remainder notation. The greatest common divisor of positive integers a and b is the largest positive integer dividing both without a remainder. Start with 84 and 30:

| a | b | Quotient | Remainder |
|---|---|---|---|
| 84 | 30 | 2 | 24 |
| 30 | 24 | 1 | 6 |
| 24 | 6 | 4 | 0 |

Each row means a = quotient × b + remainder. Replace (a, b) with (b, remainder) until the remainder is zero. The last nonzero divisor is 6. Every common divisor of a and b divides a - quotient × b, and the converse follows by reconstructing a from b and the remainder. Thus a step preserves the common divisors. The nonzero remainder is smaller than b, so the positive-integer sequence cannot keep decreasing forever.

This is a modern explanation of the remainder-based version, not Euclid's symbols or a claim that he handled zero and units exactly as a modern program does.

## Al-Khwarizmi and transmitted arithmetic

In ninth-century Baghdad, al-Khwarizmi wrote on algebra and on calculation with Indian numerals. MacTutor connects the later word algorithm to Latin forms of his name in the arithmetic tradition. It also cautions that the original Arabic arithmetic text is lost and that surviving Latin material is altered.

This is more informative than saying he “invented algorithms.” It identifies writings, numerical practices and transmission. His algebraic work organized ways to solve classes of problems; his arithmetic work helped transmit positional calculation. A word's etymology and the origin of every procedure later described by that word are different historical questions.

The missing original matters. A modern reader must distinguish what the surviving witnesses show from a confident reconstruction of the precise original wording. This chapter therefore makes no claim that our GCD trace came from al-Khwarizmi or that the Latin witness is an unchanged copy.

## Binary is a representation, not a complete machine

MacTutor describes Leibniz's development of binary arithmetic in the late seventeenth century and his later communication of work to the Paris Academy. This documents a contribution to binary arithmetic; it does not make every earlier two-way distinction a computer or establish that notation alone produced digital hardware.

In ordinary base two, each position has twice the weight of the one to its right. An original conversion is:

```text
11010 in base two = 1×16 + 1×8 + 0×4 + 1×2 + 0×1 = 26
```

Repeatedly divide 26 by 2 and keep the remainders: 0, 1, 0, 1, 1. Read them in reverse to obtain 11010. The reverse order matters because the first division extracts the least significant bit.

The same quantity can be represented in decimal or binary. Binary's usefulness for a physical circuit additionally depends on how reliable distinguishable states are made, connected and interpreted. That engineering problem belongs to later chapters.

## Boole makes logical problems algebraic

George Boole's Mathematical Analysis of Logic appeared in 1847 and Laws of Thought in 1854. The Stanford account describes his application of symbolic algebra to logic and distinguishes his original system from later reconstructions.

A small modern Boolean example illustrates the attraction of algebraic reasoning. Let x and y each be either 0 or 1, with multiplication representing conjunction. Then x × (1 - x) is always zero: an input cannot be both selected and not selected. For x = 0 the product is 0 × 1; for x = 1 it is 1 × 0.

The rule x × x = x also holds for these values. It does not hold for arbitrary integers: 2 × 2 is 4. Importing ordinary algebraic intuitions without the domain restrictions can therefore produce errors. Conversely, the modern OR operation is not ordinary unrestricted addition: 1 OR 1 is 1, while 1 + 1 is 2.

These are present-day teaching conventions, not a transcription of all of Boole's methods. The [Boolean-algebra article](/library/digital-logic/boolean-algebra/) develops a circuit-oriented model. The later [switching-circuit event](/history/birth-of-computer-science/switching-circuit-logic/) documents a specific connection between mathematical logic and relay design.

## From running examples to formal methods

Modern formal methods use precise specifications and mathematical reasoning to study implementations. The Stanford philosophy survey discusses Hoare's 1969 axiomatic approach and later debate about verification, proof complexity and the relation between formal correctness and physical systems.

For an original miniature example, assume x is an unbounded nonnegative integer. The operation x := x + 1 guarantees that the new x is positive. A mathematical proof covers every input satisfying that assumption; trying the inputs 0, 1 and 10 merely checks three cases.

Now change the model to a four-bit unsigned register. Input 15 wraps to 0 when the carry is discarded, so the same claimed postcondition fails. A proof under the first model did not become worthless: its assumptions no longer describe the implementation. Correctness is always relative to a specification and interpretation. It does not prove that the specification expresses the right human requirement or that physical hardware cannot fail.

## Reading checks and answers

1. Compute the GCD of 99 and 27. The remainders are 18, 9 and 0, so the answer is 9. Check that 9 divides both original inputs.
2. Convert 19 to binary. It is 10011 because 16 + 2 + 1 = 19.
3. Does x × x = x hold at x = 2? No. The Boolean identity requires its restricted interpretation.
4. Why does testing increment at 0 not establish its four-bit positive-result claim? Input 15 is a counterexample, even though input 0 passes.
5. Does the name algorithm imply that no systematic procedure existed before al-Khwarizmi? No. The textual and etymological transmission must be separated from the older history of calculation.

The next chapter turns to mechanical devices: how can a physical arrangement carry out or assist a procedure, and how do we distinguish a designed machine from one actually constructed?
