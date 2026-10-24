---
id: concept.binary-adders
type: concept
locale: en
slug: binary-adders
area: digital-logic
title: Binary adders
summary: Derive a full adder, follow carries through four bits, and distinguish unsigned carry from signed overflow.
status: published
updated: 2026-10-24
prerequisites: [concept.combinational-logic]
related: [concept.sequential-logic]
sources:
  - title: MIT Computation Structures, student notes — full adders and ripple carry
    url: https://6191.mit.edu/_static/fall24/resources/references/6004_student_notes_FA20.pdf
  - title: MIT OpenCourseWare, Computation Structures — adder design tradeoffs
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c8/c8s1/
  - title: Cornell CS 3410, Gates and Logic — definitions and arithmetic
    url: https://www.cs.cornell.edu/courses/cs3410/2025sp/lectures/06-gates.pdf
---
## Add one column at a time

An adder computes a binary sum. For an unsigned bit vector, each position has twice the weight of the position to its right: the four bits 1101 represent 8 + 4 + 1 = 13. Read [combinational logic](/knowledge/digital-logic/combinational-logic/) first; the adder in this page has no stored state.

Start with two bits A and B. Their total ranges from 0 to 2, so one result bit is insufficient. A half adder produces a low bit S and a carry C:

```text
S = A XOR B
C = A AND B
```

For 1 + 1, S = 0 and C = 1: together the two bits are 10, representing 2.

## Include an incoming carry

A full adder adds A, B and an incoming carry Cin. Its outputs must satisfy this arithmetic invariant:

```text
A + B + Cin = S + 2 * Cout
```

Here the additions and multiplication in the invariant are ordinary integer arithmetic. The equivalent Boolean rules are:

```text
S    = A XOR B XOR Cin
Cout = (A AND B) OR (A AND Cin) OR (B AND Cin)
```

| A | B | Cin | S | Cout |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Check the last row: 1 + 1 + 1 = 3, and S + 2 × Cout = 1 + 2 = 3.

## Follow a four-bit sum

Take A = 1101 (13) and B = 0110 (6). Start with carry 0 at the least significant position and work toward the left:

| Position, starting at 0 | A bit | B bit | Carry in | Sum bit | Carry out |
|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 |
| 2 | 1 | 1 | 0 | 0 | 1 |
| 3 | 1 | 0 | 1 | 0 | 1 |

Read the sum bits in the reverse order from the table rows: 0011. The final carry adds a fifth bit, making 10011 = 19. If the destination stores only four bits, it keeps 0011, which is 3: addition modulo 16. Keeping the final carry preserves the complete unsigned result.

## Carry is not signed overflow

The same bits can encode different meanings. In four-bit two’s-complement arithmetic, 0111 represents 7. Adding 0001 produces 1000, which represents −8. No fifth-bit carry is required for this result, yet the mathematical sum 8 is outside the signed range −8 through 7.

That is signed overflow. It differs from losing an unsigned carry. Always state the width and interpretation before judging whether a result fits.

## Delay and alternatives

A ripple-carry design connects each stage’s carry to the next stage. The logical composition is simple, but the carry dependency can limit settling speed. Carry-select and carry-lookahead designs reorganize work to trade more structure for different timing. Gate counts alone do not establish the speed of a real implementation.

## Exercise and answer

Add four-bit 1111 and 0001 with an initial carry of 0. Every position produces sum 0 and passes carry 1 to the next position after the first stage. The complete unsigned result is 10000; the retained four-bit result is 0000.

The column traces and numeric examples are original. The references explain the full-adder construction and alternative carry organizations. Continue with [memory and registers](/knowledge/digital-logic/memory-and-registers/) to preserve a computed result between operations.
