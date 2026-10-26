---
id: concept.analog-and-digital-interfaces
type: concept
locale: en
slug: analog-and-digital-interfaces
area: electronics-pcb
title: Analog and digital interfaces — margins and settling
summary: Compare logic-level guarantees, calculate RC settling and distinguish
  physical waveforms from logical interpretations.
status: published
updated: 2026-10-26
prerequisites:
  - concept.circuit-analysis
  - concept.cmos
  - concept.signals-and-states
related:
  - path.electronics-and-pcb
  - concept.schematics-and-connectivity
sources:
  - title: NI — Digital States, Voltage Levels, and Logic Families
    url: https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/digital-states-voltage-levels-logic-families.html
  - title: OpenStax University Physics, volume 2 — 10.5, RC circuits
    url: https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits
---
## Keep the voltage and its interpretation separate

An analog signal uses a continuously varying quantity to represent information. A digital receiver assigns discrete symbols to ranges of its input waveform. Both travel through physical circuits with continuous voltages, finite currents and finite transition times. “Digital” does not make resistance, capacitance or interference disappear.

The [signals and states lesson](/knowledge/foundations/signals-and-states/) introduced this distinction. Here we connect it to two practical questions: will one device's output be recognized by another, and will a changing input reach its required level in time?

Begin with single-ended signals measured relative to a shared reference. Even then, a stated supply voltage does not completely specify the interface. You need output guarantees, input requirements and permitted pin voltages under the relevant conditions.

## Read four logic-level specifications

VIH(min) is the minimum input voltage guaranteed to be recognized as high. VIL(max) is the maximum input voltage guaranteed to be recognized as low. The interval between them lacks a guaranteed logical interpretation; it is not a guaranteed third state.

VOH(min) is a driver's guaranteed minimum high output, and VOL(max) its guaranteed maximum low output, under stated loading and supply conditions. For a DC compatibility check, compare the driver's output guarantees with the receiver's input requirements:

~~~text
High margin = VOH(min) − VIH(min)
Low margin = VIL(max) − VOL(max)
~~~

Use a stipulated driver with VOH(min) = 2.9 V and VOL(max) = 0.3 V. A receiver requiring VIH(min) = 2.0 V and VIL(max) = 0.8 V gives margins 0.9 V and 0.5 V. Those are budgets for unfavorable voltage shifts in this static model, not permission to ignore timing or pin ratings.

| Received voltage (V) | Guaranteed interpretation |
| --- | --- |
| 0.3 | low |
| 0.8 | low |
| 1.4 | unspecified |
| 2.0 | high |
| 2.9 | high |

The table uses only the stated receiver thresholds. A high may be logically recognizable yet exceed an input's permitted voltage. Conversely, a voltage can remain within pin limits while lying in the unspecified logical interval. Functional thresholds and electrical limits answer different questions.

If driver and receiver reference potentials differ, include that difference in the voltage seen by the receiver. A 0.2 V unfavorable shift consumes part of a margin; it is not cancelled merely because both drawings use a ground symbol.

## Follow a capacitor through a resistor

Consider a resistor R feeding a node with capacitance C to ground. Assume an ideal input source steps from 0 to VF, the capacitor starts uncharged, and no other load draws current. The output rises according to:

~~~text
tau = R × C
Vout(t) = VF × (1 − exp(−t / tau))
~~~

The time constant tau has units of seconds. Initially the capacitor voltage is zero; after a long time it approaches VF. At one time constant it has completed about 63.2% of the rise, not the entire transition.

Choose R = 1000 Ω, C = 100 nF and VF = 3 V. Since 100 nF = 1e-7 F, tau = 100 μs.

| Time (μs) | Time / tau | Vout (V) |
| --- | --- | --- |
| 0 | 0 | 0 |
| 100 | 1 | 1.896362 |
| 200 | 2 | 2.593994 |
| 300 | 3 | 2.850639 |

For a receiver whose high requirement is 2 V, solve 2 = 3(1 − exp(−t/tau)). Rearranging gives exp(−t/tau) = 1/3 and t = tau × ln(3), approximately 109.861 μs. That is a modeled voltage crossing, not a complete digital timing guarantee: the input may impose maximum transition-time requirements or need hysteresis for slow noisy signals.

## Recognize what a filter trades away

The same RC network smooths a varying analog input. Very slow changes can largely pass through, while sufficiently rapid variations are attenuated. For the ideal unloaded low-pass network, the sinusoidal cutoff frequency is fc = 1/(2πRC), approximately 1591.55 Hz for the example.

At cutoff, output amplitude is 1/√2 of input amplitude, about 0.707. Cutoff is not a brick wall that removes every higher frequency and passes every lower frequency unchanged. The network changes phase as well as amplitude.

Adding resistance and capacitance to reduce noise also changes settling time. An analog measurement taken before settling can be wrong even when its eventual DC value is right. A digital edge slowed by the same network can violate an interface condition even if its final high and low levels are acceptable.

A buffer can reduce loading on a source, but its own output limits and dynamics remain. A comparator makes a decision about an analog voltage; an analog-to-digital converter assigns numerical codes. Neither should be assumed to behave like an ideal wire or an infinitely fast threshold detector.

## Work through the questions

1. A driver guarantees high at 2.4 V and low at 0.4 V. Use the same receiver thresholds to find both margins.
2. Double R in the RC example, retaining C and VF. Find tau and the time to reach 2 V.
3. What does a 1.4 V input mean for the stipulated receiver?
4. Does a positive high margin prove that a pin tolerates every voltage the driver might produce?

## Explain the answers

The margins are 2.4 − 2.0 = 0.4 V high and 0.8 − 0.4 = 0.4 V low. They describe this DC comparison under the stated guarantees.

Doubling R doubles tau to 200 μs and the crossing time to approximately 219.722 μs. The cutoff frequency halves to about 795.77 Hz. The final unloaded voltage remains 3 V.

At 1.4 V, the receiver has no guaranteed interpretation from these thresholds. It might resolve either way, and noise or device variation can matter. Finally, a logic-level check is separate from maximum pin voltage, input current, timing and power-state compatibility. Check each requirement rather than treating one successful subtraction as a complete interface design.
