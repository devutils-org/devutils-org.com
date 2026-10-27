---
id: concept.information-and-representation
type: concept
locale: en
slug: information-and-representation
area: foundations
title: Information and representation
summary: Count binary possibilities, decode a small unsigned number and separate
  a bit pattern from its meaning.
status: published
updated: 2026-10-25
prerequisites:
  - concept.signals-and-states
related:
  - path.computing-foundations
  - concept.models-and-abstraction
sources:
  - title: Steve Ward, Computation Structures — Information, sections 3.1–3.2.1.1
    url: https://computationstructures.org/notes/information/notes.html
---
## Count distinguishable possibilities

The preceding chapter explained how a physical signal can represent a discrete symbol. Now ask what several such symbols can describe. A binary digit, or bit, has two possible values. A string of n bits has 2^n possible patterns.

You can derive the count by building strings. One bit gives 0 or 1. For each of those choices, a second bit gives another two choices: 00, 01, 10 and 11. Adding a third bit doubles that collection again, producing eight patterns. The exponent counts repeated factors of two.

| Width (bits) | Number of patterns | Largest unsigned value |
|---|---|---|
| 1 | 2 | 1 |
| 2 | 4 | 3 |
| 3 | 8 | 7 |
| 4 | 16 | 15 |
| 5 | 32 | 31 |

The last column assumes the unsigned-number interpretation developed below. Pattern count and largest numerical value differ because counting the values includes zero.

## Give patterns a meaning

A fixed-width code gives every message the same number of bits. To recover a message unambiguously, assign different patterns to different messages. For a four-message indicator, choose this codebook:

| Pattern | Message |
|---|---|
| 00 | Idle |
| 01 | Working |
| 10 | Finished |
| 11 | Fault |

Sending 10 then means finished under this agreement. It does not mean two completed jobs unless another part of the specification gives it that meaning. If two messages both used 10, the receiver could not tell which was intended.

Two bits provide exactly four patterns. Adding a fifth message requires at least three bits in a fixed-width binary code: two bits still provide four patterns, while three provide eight. Some patterns may remain unassigned. The criterion is enough distinct patterns, not a need to use every pattern.

## Read an unsigned binary number

Decimal notation uses place values: 305 means three hundreds, zero tens and five ones. Moving one position left multiplies the weight by ten. Binary positional notation uses the same idea with a factor of two.

For a four-bit unsigned number, the weights from left to right are 8, 4, 2 and 1. Each bit tells whether to include its position's weight. “Unsigned” means this interpretation represents nonnegative integers; it does not reserve a bit for a negative sign.

Read 1010 one position at a time:

~~~text
bits:     1  0  1  0
weights:  8  4  2  1
value = 1 × 8 + 0 × 4 + 1 × 2 + 0 × 1 = 10
~~~

The rightmost digit is the ones position, so reversing the order changes the value. Also, the written pattern 1010 is not the decimal number one thousand and ten. State the base or context when the notation could be ambiguous.

| Pattern | Calculation | Unsigned value |
|---|---|---|
| 0000 | 0 | 0 |
| 0011 | 2 + 1 | 3 |
| 0101 | 4 + 1 | 5 |
| 1010 | 8 + 2 | 10 |
| 1111 | 8 + 4 + 2 + 1 | 15 |

Four unsigned bits represent 0 through 15. There are sixteen values, not fifteen. Leading zeroes preserve a specified width without changing the unsigned value: 0011 and 11 both represent three, but their written widths differ.

## Encode a number yourself

To encode thirteen in four unsigned bits, start with the largest weight and ask whether it fits in the remaining value:

1. Eight fits in thirteen. Write 1 and subtract eight, leaving five.
2. Four fits in five. Write 1 and subtract four, leaving one.
3. Two does not fit in one. Write 0 and leave the remainder unchanged.
4. One fits in one. Write 1 and subtract one, leaving zero.

The resulting pattern is 1101. Decode it to check: 8 + 4 + 1 = 13. Encoding and decoding in opposite directions helps detect a misplaced bit.

Sixteen cannot fit in four unsigned bits: even 1111 reaches only fifteen. You must choose a wider representation or define another behavior. Silently keeping only four low bits would change the represented value, not preserve sixteen.

## Keep the codebook with the bits

The pattern 10 means “Finished” in our indicator code and the number two under an unsigned binary interpretation. The bits alone do not tell the receiver which interpretation to use. The codebook, width and context provide that agreement.

A bit can also represent a Boolean truth value in a later chapter. That is another interpretation of the same two symbols. Arithmetic and logical operations need their own rules; a two-bit message code is not automatically a number on which addition makes sense.

Do not confuse code length with the information gained from a message. If the indicator's state is already known, receiving its code may resolve no uncertainty. Available patterns concern representational capacity; formal information measures also depend on what outcomes were possible and their probabilities.

## Try it yourself

1. How many distinct patterns can five bits hold?
2. Decode 1101 as an unsigned binary number.
3. How many bits are needed for nine messages in a fixed-width binary code?
4. Encode six in four unsigned bits, then decode it to check your work.
5. Can you tell whether 10 means “Finished” or the number two without knowing the codebook?

## Answers and limits

For the first, double five times: 2 × 2 × 2 × 2 × 2 = 32. Five bits provide 32 patterns, with unsigned values zero through thirty-one.

For the second, align 1101 with weights 8, 4, 2 and 1. Include the first, second and fourth weights. The unsigned value is 8 + 4 + 1 = 13.

For the third, three bits provide only eight patterns, fewer than nine messages. Four provide sixteen. Nine messages need four bits; seven of their patterns may remain unassigned.

For the fourth, skip eight, include four, include two and skip one: 0110. Decoding gives 4 + 2 = 6. Keeping the leading zero respects the requested four-bit width.

For the fifth, you need the interpretation agreement. Seeing the same pattern does not establish the same meaning.

The exercises assume agreed, error-free symbols. Signed arithmetic, compression and error correction build on these ideas later.

Next: [models and abstraction](/library/foundations/models-and-abstraction/).
