---
id: concept.measurement-and-debugging
type: concept
locale: en
slug: measurement-and-debugging
area: electronics-pcb
title: Measurement and debugging — loading, references and evidence
summary: Include the probe in the circuit, estimate measurement loading and
  separate resolution, accuracy and repeatability.
status: published
updated: 2026-10-26
prerequisites:
  - concept.signal-integrity
  - concept.power-and-decoupling
related:
  - path.electronics-and-pcb
sources:
  - title: Tektronix — ABCs of Probes Primer, loading, capacitance and reference
      connections
    url: https://www.tek.com/en/documents/whitepaper/abcs-probes-primer
  - title: OpenStax University Physics, volume 2 — 10.5, RC circuits
    url: https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits
---
## Decide what question the measurement answers

A meter can report a DC voltage, an oscilloscope can show a voltage waveform, and a logic analyzer can report interpreted states and timing. They do not answer identical questions. A logic analyzer's clean decoded bit does not establish that the original waveform had no overshoot; a meter's stable average does not establish a noise-free supply.

State the expected observation before connecting an instrument. Name the two points defining the voltage, the operating state, the required time scale and the error you can tolerate. This turns debugging into a comparison between a model and evidence rather than an exercise in collecting screenshots.

The preceding lessons already supplied useful checks: node current balance, divider loading, interface margins, supply droop and line delay. Measurements can test those predictions, provided the instrument's effect is included.

## Include the instrument in the circuit

A voltmeter or probe has finite input impedance. In a simple DC model, represent a source by an ideal voltage VS in series with source resistance RS, then connect the instrument's input resistance RM to the reference node. The indicated voltage is:

~~~text
Vmeasured = VS × RM / (RS + RM)
~~~

Take VS = 2 V and RS = 100 kΩ. A 1 MΩ instrument reads 2 × 1000/(100 + 1000), approximately 1.818182 V. A 10 MΩ input reads approximately 1.980198 V. Both readings can be correct for the loaded circuit even though neither equals the unconnected source voltage.

| Input resistance (MΩ) | Measured voltage (V) | Reduction from 2 V (%) |
| --- | --- | --- |
| 1 | 1.818182 | 9.090909 |
| 10 | 1.980198 | 0.990099 |
| 100 | 1.998002 | 0.099900 |

The table holds the same source model fixed. A less disruptive instrument improves this example, but instrument specifications also include accuracy, bandwidth and operating limits. A high DC resistance alone does not establish negligible loading for fast signals.

For current measurement, the instrument must be included in the current path, with its own burden voltage or resistance. Putting an ammeter across a voltage source as though it were a voltmeter creates a different circuit, potentially a low-resistance path. Know which quantity and input configuration you are using.

## Account for probe capacitance

At changing voltages, probe capacitance also draws current. Representing the input solely by a large resistance misses that behavior. For a stipulated source resistance 10 kΩ and added probe capacitance 10 pF, the additional RC time constant is 100 ns.

In a simple first-order step response, the 10%-to-90% rise time is approximately 2.197 × tau, or 219.7 ns here. This follows by subtracting the times at 10% and 90% of the final voltage: tau × ln(9).

If capacitance were 1 pF instead, the same model gives tau = 10 ns and rise time approximately 21.97 ns. These are isolated model comparisons, not a complete prediction of a selected probe and circuit. The source can have its own dynamics, and the measurement system can have additional limitations.

A probe ground lead also has inductance. Long loops can introduce ringing that belongs partly to the probing arrangement. If a suspicious oscillation changes dramatically with a shorter return connection or another appropriate probe, investigate the measurement path before declaring that the circuit itself oscillates.

## Respect the physical reference connection

On a conventional Earth-referenced bench oscilloscope, probe ground clips connect to the instrument's reference and typically to protective Earth. They are actual electrical connections. Attaching one to an arbitrary non-ground node can short that node through the instrument and other grounded equipment.

These lessons concern low-voltage conceptual circuits. For an actual measurement, determine the instrument's reference arrangement, permitted input voltage and common-mode limits first. Use a properly rated differential or isolated measurement arrangement when the required voltage is not compatible with a grounded single-ended probe. Do not defeat the instrument's protective Earth connection to make a measurement.

Even within a low-voltage circuit, two ground clips on different potential nodes can join those nodes together. The fact that the oscilloscope displays two channels does not imply independent isolated references.

## Separate resolution from accuracy

A display with many decimal places has fine resolution, but that does not establish accuracy. Suppose a hypothetical meter's specified bound is ±(0.5% of reading + 2 mV). At a 2 V reading, 0.5% is 10 mV; adding 2 mV gives a stated bound of ±12 mV under the specified conditions.

A reading of 2.000 V therefore does not justify claiming the voltage is within 1 mV of 2 V. Nor should this instrument bound be confused with variation in the circuit, which can introduce a separate uncertainty or changing signal.

Repeated measurements can reveal instability and repeatability. They cannot automatically remove a systematic loading error: repeatedly measuring 1.818 V in the divider example does not make it the unconnected voltage.

## Debug one hypothesis at a time

Begin with supply and reference conditions, then compare upstream and downstream observations. If a signal is wrong at a receiver, ask whether it was launched correctly, survived the interconnect and arrived while the receiver was ready. Change one meaningful condition so that the result distinguishes hypotheses.

Record the setup with the waveform: probe type, attenuation, connection points, bandwidth setting, time scale and operating condition. A trace detached from its setup can be hard to interpret or reproduce.

Finally, compare with the model's scope. A DC divider model cannot predict reflection ringing; a first-order RC model cannot explain every multi-resonant supply network. A discrepancy can reveal a faulty circuit, a mistaken measurement or an inadequate model. Good debugging keeps all three possibilities testable.

## Work through the questions

1. A 3 V source with RS = 200 kΩ is measured by RM = 1 MΩ. Find the loaded reading.
2. Calculate tau and approximate 10%-to-90% rise time for 2000 Ω and 20 pF.
3. Apply the hypothetical meter bound to a 1 V reading.
4. Does a stable reading prove that probe loading is negligible?

## Explain the answers

The reading is 3 × 1000/(200 + 1000) = 2.5 V. The 0.5 V reduction is caused by the modeled load, not random measurement noise.

The time constant is 2000 × 20e-12 = 40 ns. Rise time is ln(9) × 40 ns, approximately 87.89 ns. The meter bound at 1 V is ±(5 + 2) mV, or ±7 mV.

A stable reading establishes repeatability under the setup, not absence of disturbance. Compare loading models or suitable measurement arrangements to test that assumption. Return to the [electronics and PCB path](/learn/electronics-and-pcb/) for a synthesis that joins circuit, interface, supply and measurement reasoning.
