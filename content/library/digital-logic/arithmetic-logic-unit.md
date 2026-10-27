---
id: concept.arithmetic-logic-unit
type: concept
locale: en
slug: arithmetic-logic-unit
area: digital-logic
title: Arithmetic logic unit
summary: Combine a four-bit adder, Boolean functions and selection; distinguish unsigned carry from signed overflow and connect computation to storage.
status: published
updated: 2026-10-26
prerequisites: [concept.binary-adders, concept.combinational-logic]
related: [concept.finite-state-machines, concept.memory-and-registers]
sources:
  - title: MIT Computation Structures — Building the Beta, ALU operations and datapath
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/c13s1/
---
## Choose a computation

An arithmetic logic unit (ALU) computes a selected function of its operands. A control signal selects the operation; registers hold operands and results outside the combinational ALU. Read [binary adders](/library/digital-logic/binary-adders/) and [combinational logic](/library/digital-logic/combinational-logic/) first.

Imagine a four-bit calculator whose two inputs A and B are each integers from 0 to 15. We want the same interface to add, subtract, mask and combine bits. Building a separate external calculator for every function would complicate routing. Instead compute candidate results internally and select one output. This is an original teaching design, not an instruction set or a physical circuit specification.

## Define the entire interface

Our operation field has two bits. R is always four bits.

| Operation | Name | Result rule |
|---|---|---|
| 00 | ADD | Low four bits of A + B |
| 01 | SUB | Low four bits of A + NOT4(B) + 1 |
| 10 | AND | Bitwise A AND B |
| 11 | XOR | Bitwise A XOR B |

NOT4 complements exactly four bits: NOT4(B) = 15 - B. Each bit of AND or XOR is evaluated independently. There is no carry between adjacent bits for those operations.

The output flags follow a deliberately explicit contract. Z is 1 when R is zero. N copies R's most significant bit. For ADD and SUB, C is the carry beyond bit 3 of the internal addition. For AND and XOR, C and V are both zero. V indicates that the exact signed arithmetic result is outside -8 through 7. Flags are outputs of this combinational block; remembering them would require registers.

## Reuse the adder for subtraction

Modulo 16, adding 16 changes no retained bit. Since NOT4(B) + 1 = 16 - B, adding that value to A produces the retained bits of A - B. The addition can use the existing carry chain, with B complemented and initial carry set to 1 only for SUB.

For A = 0011 and B = 0101:

```text
NOT4(0101) = 1010
0011 + 1010 + 1 = 1110
R = 1110; C = 0
```

The exact unsigned subtraction is 3 - 5 = -2, outside the unsigned range. The retained result is 14. Interpreted as four-bit two's complement, 1110 means 14 - 16 = -2. Thus the same output bits have different interpretations.

Under this chosen carry convention, SUB has C = 1 when A >= B, meaning no unsigned borrow. For 5 - 3, the internal sum is 5 + 12 + 1 = 18, giving C = 1 and R = 2. Other interfaces may expose a borrow flag with opposite polarity: consult their contract.

## Separate carry from signed overflow

For four-bit two's complement, values 0000 through 0111 mean 0 through 7. Values 1000 through 1111 mean -8 through -1. Decode a pattern x >= 8 as x - 16.

For ADD, signed overflow occurs when equal-sign operands produce an opposite-sign result. For SUB, it occurs when opposite-sign operands produce a result whose sign differs from A. These rules apply to this fixed-width two's-complement model.

| Operation | A | B | R | C | V | Z | N |
|---|---|---|---|---|---|---|---|---|
| ADD | 0111 | 0001 | 1000 | 0 | 1 | 0 | 1 |
| ADD | 1111 | 0001 | 0000 | 1 | 0 | 1 | 0 |
| SUB | 0011 | 0101 | 1110 | 0 | 0 | 0 | 1 |
| SUB | 1000 | 0001 | 0111 | 1 | 1 | 0 | 0 |
| AND | 1100 | 1010 | 1000 | 0 | 0 | 0 | 1 |
| XOR | 1100 | 1010 | 0110 | 0 | 0 | 0 | 0 |

In the first row, 7 + 1 = 8 is valid unsigned arithmetic but exceeds the signed maximum 7. In the second, unsigned 15 + 1 needs a fifth bit, while signed -1 + 1 = 0 fits. Carry and overflow answer different questions. N alone is also insufficient for a signed comparison after an overflowing subtraction; for this model the signed less-than condition is N XOR V.

## Connect datapath and controller

A datapath contains the storage, computation and selection components through which values flow. A controller supplies choices such as operation and write enable. Consider two registers X and Y, this ALU and a result register T:

```text
X ----> A [ ALU ] R ----> T input
Y ----> B [     ]
            ^                ^
       operation         write enable
            |                |
            +-- controller --+
```

With X = 0111, Y = 0001 and operation ADD, the combinational output settles to 1000. T keeps its old value until a valid rising edge with write enable asserted. Changing the operation to XOR selects 0110, without changing X or Y. Timing still must allow the selected path to settle before T's setup boundary.

A [finite-state machine](/library/digital-logic/finite-state-machines/) can sequence these controls. For example, a compute state selects ADD and enables T; a following done state disables writes. The ALU does not fetch instructions, choose operands from memory or decide when a transaction has finished. Those are additional architectural responsibilities.

## Exercises and answers

1. Compute SUB for A = 0000, B = 0000. Internal sum 0 + 15 + 1 = 16 gives R = 0000, C = 1, V = 0, Z = 1, N = 0. Equality requires no borrow.
2. Compute ADD for A = 1000, B = 1000. Unsigned 8 + 8 = 16 gives R = 0000 and C = 1. Signed -8 + -8 = -16 does not fit: V = 1. Z = 1 and N = 0 describe the retained bits.
3. Compute signed A < B for A = 1000, B = 0001 using SUB. The table gives N = 0 and V = 1, so N XOR V = 1. Looking at N alone would incorrectly claim -8 is not less than 1.

The executable model checks all 256 operand pairs for each of four operations against exact arithmetic, including flags and signed comparisons. It checks the printed table too. This validates the functional example, not HDL synthesis, routing, clock frequency or energy consumption. The next step toward a computer is to define instructions and the state changes each instruction promises.
