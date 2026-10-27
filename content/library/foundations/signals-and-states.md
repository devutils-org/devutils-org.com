---
id: concept.signals-and-states
type: concept
locale: en
slug: signals-and-states
area: foundations
title: Signals and states
summary: Separate a physical signal from the discrete state it represents, then
  read a simple time trace.
status: published
updated: 2026-10-25
prerequisites:
  - concept.units-and-scale
related:
  - path.computing-foundations
  - concept.information-and-representation
sources:
  - title: Steve Ward, Computation Structures — The Digital Abstraction, sections
      5.1–5.3
    url: https://computationstructures.org/notes/digitalabstraction/notes.html
---
## Separate a signal from its interpretation

Suppose a machine must communicate whether a job is finished. The message has two possibilities: unfinished or finished. To transmit it physically, the machine needs something another component can observe. A voltage on a wire is one possible signal.

A signal is a physical quantity considered as it varies, often over time. Voltage measures an electrical potential difference; you will study its physics later. Here, treat a value in volts as the receiver's observed input. A digital design interprets specified voltage ranges as discrete symbols such as 0 and 1.

Keep three descriptions separate: the voltage is the physical observation, the bit is its decoded symbol, and “finished” is the meaning assigned to that symbol. There is no universal rule that a logical 1 must mean finished, true or enabled. The agreement between components chooses the interpretation.

## Define a fictional receiver

For this exercise, suppose a receiver accepts voltages from 0 V to 3 V and interprets them as follows:

| Voltage range | Interpretation |
|---|---|
| 0 V through 0.8 V | 0 |
| Above 0.8 V and below 2.0 V | No guaranteed logic value |
| 2.0 V through 3.0 V | 1 |

These chosen thresholds define the example, not a particular logic family. Other voltages are outside its specified range.

To classify an observation, compare it with the endpoints. A reading of 0.4 V lies between 0 V and 0.8 V, so it represents 0. A reading of 2.4 V lies between 2.0 V and 3.0 V, so it represents 1. A reading of 1.4 V lies in neither valid range.

Pay attention to boundary words. “Through 0.8 V” includes 0.8 V. “Above 0.8 V” excludes it. Likewise, 2.0 V belongs to the range for 1. Small differences in a specification's inequalities change which cases it covers.

## Understand an unspecified value

“No guaranteed logic value” is not a third data symbol. It means this specification does not promise whether a receiver will interpret that voltage as 0 or 1. You cannot infer a useful message from it using this contract.

Why leave a gap? Our example can tolerate some variation while an input remains inside its assigned range. Starting at 0.4 V, an increase of 0.2 V still leaves 0.6 V in the 0 range. Starting at 2.4 V, a decrease of 0.2 V leaves 2.2 V in the 1 range. Different physical voltages can therefore carry the same symbol.

The gap does not make a transition instantaneous. A voltage changing continuously from 0.4 V to 2.4 V must pass through the intermediate range. A useful system needs rules about when inputs must be valid and when outputs may be observed. Correct symbols alone do not supply those timing rules.

## Read a time trace

A time trace records observations in order. Each row below is an isolated sample from the example receiver.

| Time (ms) | Voltage (V) | Interpretation |
|---|---|---|
| 0 | 0.4 | 0 |
| 1 | 0.6 | 0 |
| 2 | 1.4 | Not guaranteed |
| 3 | 2.4 | 1 |
| 4 | 2.6 | 1 |

Read the first column as “when,” the second as “what was observed,” and the third as “what the rule lets us conclude.” At 1 ms, the physical value differs from the value at 0 ms, but both samples decode to 0. At 2 ms the sample has no promised interpretation. At 3 ms the sample decodes to 1.

We cannot recover the exact waveform between these observations. The samples do not establish when a transition started, how long it took, or whether an extra pulse occurred in between.

For example, the following observations could belong to a signal with an intervening pulse:

| Time within interval (ms) | Voltage (V) | Decoded sample |
|---|---|---|
| 0 | 0.4 | 0 |
| 0.5 | 2.4 | 1 |
| 1 | 0.6 | 0 |

A reader who sees only the first and last rows would miss the middle 1. This is a counterexample to “two successive 0 samples prove the signal remained 0.” It does not reconstruct what actually happened in the earlier trace; it demonstrates what those sparse observations cannot rule out.

## Include time in the contract

A component that computes an output from its current inputs needs both a functional rule and a timing rule. The functional rule answers which output should result. The timing rule says when the output is guaranteed after valid inputs have settled.

For a small timing exercise, suppose a component promises its output within 2 μs after its inputs become stable and valid. If that condition begins at 10 μs and remains true, the deadline is 12 μs. The contract does not promise that the output is already correct at 11 μs. These are chosen values for understanding a deadline.

Later chapters on gates and sequential logic add concrete functional rules and clock-related timing. For now, the key distinction is between observing a voltage and having enough conditions to interpret it reliably.

## Try it yourself

1. Classify 0.8 V, 1.0 V and 2.0 V using the receiver rule.
2. Does a sample at 0 ms determine the voltage at 0.5 ms?
3. Does “not guaranteed” mean the receiver supplies a third logical symbol?
4. With the 2 μs timing promise, what deadline follows if valid inputs settle at 15 μs and stay stable?

## Answers and limits

For the first, 0.8 V is included in the 0 range, 1.0 V is between the valid ranges, and 2.0 V is included in the 1 range. The results are 0, not guaranteed and 1.

For the second, a single sample does not determine the intervening waveform. Even equal decoded values at both endpoints do not exclude a pulse between them; the three-row example shows why.

For the third, the specification makes no logical promise for that input. It has not defined a third message or a reliable way to use the intermediate voltage.

For the fourth, add the allowed delay to the start of valid inputs: 15 μs + 2 μs = 17 μs. The guarantee relies on those inputs staying valid and stable.

This chapter concerns interpretation and timing. Current, loading, detailed noise analysis and sampling theory need further study.

Next: [information and representation](/library/foundations/information-and-representation/).
