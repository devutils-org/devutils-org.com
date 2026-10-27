---
id: concept.units-and-scale
type: concept
locale: en
slug: units-and-scale
area: foundations
title: Units and scale
summary: Keep units in a calculation, convert powers of ten and distinguish a
  duration from a rate.
status: published
updated: 2026-10-25
prerequisites:
  - concept.mathematical-reasoning
related:
  - path.computing-foundations
  - concept.signals-and-states
sources:
  - title: NIST Guide to the SI — chapter 7, expressing values of quantities
    url: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values
  - title: NIST — Metric (SI) Prefixes
    url: https://www.nist.gov/pml/owm/metric-si-prefixes
---
## A number needs a meaning

A delay of 5 is incomplete: five seconds and five milliseconds describe different durations. A quantity value combines a numerical value with a unit. Write 5 ms with a space between the number and unit symbol.

The quantity is the duration; the unit is how we express it. A distance can be described in meters or centimeters without changing the distance. Likewise, changing a duration from seconds to milliseconds changes its numerical representation, not the time that passes.

For this chapter, use the variables and operation order from [mathematical reasoning](/library/foundations/mathematical-reasoning/). The new habit is to carry units through every step instead of attaching them after the calculation.

## Move between scales

A prefix multiplies a unit. The symbol s means second; the prefix m means one thousandth, so one millisecond is one thousandth of a second.

The SI prefixes below use powers of ten. A positive power counts repeated factors of ten. A negative exponent denotes the reciprocal: 10^-3 = 1/1000. The minus sign in an exponent does not make the duration negative.

| Prefix | Symbol | Multiplier |
|---|---|---|
| kilo | k | 10^3 |
| mega | M | 10^6 |
| milli | m | 10^-3 |
| micro | μ | 10^-6 |
| nano | n | 10^-9 |

Unit symbols are case sensitive. The table's m and M have different meanings. Always read a prefix together with the unit that follows it.

For the units we use here, 1 s = 1000 ms and 1 ms = 1000 μs. A smaller unit requires more of those units to express the same duration. That gives a useful check before doing arithmetic: converting seconds to milliseconds increases the numerical value; converting back decreases it.

## Convert by multiplying by one

A conversion factor is a ratio of equal quantities. Because 1 s and 1000 ms are the same duration, the ratio 1 s / 1000 ms equals one. Multiplying by it preserves the quantity while changing its written unit.

Convert 3 ms to seconds:

~~~text
3 ms × (1 s / 1000 ms)
= (3 / 1000) s
= 0.003 s
~~~

The ms unit appears in both numerator and denominator and cancels. If instead you multiply by 1000 ms / 1 s, the ms units do not cancel; that is a signal that the ratio is facing the wrong way for this conversion.

Now convert 2500 μs to milliseconds:

~~~text
2500 μs × (1 ms / 1000 μs) = 2.5 ms
~~~

Here are equivalent representations to compare:

| Seconds | Milliseconds | Microseconds |
|---|---|---|
| 0.001 | 1 | 1000 |
| 0.003 | 3 | 3000 |
| 0.0025 | 2.5 | 2500 |

The units belong to the column headings. Every row describes one duration in three forms.

## Add quantities in a common unit

You cannot add the raw numbers 3 and 2500 and then choose a unit. First make the units agree:

~~~text
3 ms + 2.5 ms = 5.5 ms
3 ms + 2500 μs = 5.5 ms
~~~

The result is also 0.0055 s. The wrong shortcut, 2503 ms, treated microseconds as if they were milliseconds.

Quantities must also describe compatible things. Two durations can be added; a duration and a distance cannot be added into a meaningful total. An equation with incompatible units needs repairing before numerical calculation.

## Derive a rate

Consider a machine that finishes one item every 4 ms, with no gaps and no overlapping work. One second contains 1000 ms. Dividing 1000 ms by 4 ms per item gives 250 items in a second:

~~~text
rate = 1 item / 0.004 s = 250 items/s
~~~

The duration per item and the number of items per second are reciprocals under these assumptions. They answer different questions. A larger duration per item gives a smaller rate: doubling the duration to 8 ms reduces the rate to 125 items/s.

The reciprocal shortcut depends on the machine's schedule. If there is a 1 ms pause after every 4 ms item, one cycle takes 5 ms and the sustained rate becomes 200 items/s. If work overlaps, completion rate need not equal the reciprocal of one item's elapsed time. Keep the model visible when interpreting a rate.

## Estimate before calculating

One task lasts 2 ms and another 700 μs. Seven hundred microseconds is less than one millisecond, so their sum should fall between 2 ms and 3 ms. Converting gives 2 ms + 0.7 ms = 2.7 ms. The estimate catches a misplaced factor of a thousand.

You can check a result in three ways: inspect the units, ask whether the magnitude is plausible, and reverse the operation. For 2.7 ms, subtracting the first task's 2 ms leaves 0.7 ms, which converts back to 700 μs.

## Try it yourself

1. Convert 6 ms to seconds and microseconds.
2. Add 500 μs and 1.5 ms.
3. Under the no-gap, no-overlap model, find the rate for one item every 2 ms.
4. Find the sustained rate if each 2 ms item is followed by a 3 ms pause.
5. Someone reports 3 ms + 2500 μs = 2503 ms. Explain the error before recalculating.

## Answers and limits

For the first, divide by 1000 to reach seconds and multiply by 1000 to reach microseconds. The conversions are 0.006 s and 6000 μs.

For the second, 500 μs = 0.5 ms. Add 0.5 ms + 1.5 ms; the sum is 2 ms.

For the third, 2 ms = 0.002 s and 1 / 0.002 = 500. The modeled rate is 500 items/s.

For the fourth, count the entire cycle: 2 ms + 3 ms = 5 ms. One thousand milliseconds divided by five gives 200 items/s.

For the fifth, the two input numbers were expressed in different units. Convert 2500 μs to 2.5 ms, then add to obtain 5.5 ms. The sum should be a little larger than each input duration, which the erroneous answer fails by a large margin.

These calculations use stipulated durations. Measurement uncertainty and binary storage prefixes need separate lessons.

Next: [signals and states](/library/foundations/signals-and-states/).
