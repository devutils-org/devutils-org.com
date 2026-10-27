---
id: concept.signal-integrity
type: concept
locale: en
slug: signal-integrity
area: electronics-pcb
title: Signal integrity — travel time, reflections and receiver behavior
summary: Compare propagation with edge time, calculate first load reflections
  and distinguish incident-wave amplitude from source voltage.
status: published
updated: 2026-10-26
prerequisites:
  - concept.pcb-layout-and-return-paths
  - concept.analog-and-digital-interfaces
related:
  - path.electronics-and-pcb
  - concept.measurement-and-debugging
sources:
  - title: "Tektronix — TDR Impedance Measurements: A Foundation for Signal
      Integrity, reflection coefficient"
    url: https://www.tek.com/en/documents/fact-sheet/tdr-impedance-measurements-foundation-signal-integrity
  - title: Analog Devices — Basic Guidelines for Layout Design of Mixed-Signal PCBs
    url: https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html
  - title: Tektronix — ABCs of Probes Primer, loading, capacitance and reference
      connections
    url: https://www.tek.com/en/documents/whitepaper/abcs-probes-primer
---
## Ask whether the receiver sees the intended waveform

Signal integrity concerns the voltage waveform that reaches a receiver: its level, timing and shape relative to what that receiver requires. A logical connection in a [schematic](/library/electronics-pcb/schematics-and-connectivity/) does not specify propagation delay, reflections or interference. Physical interconnect is part of the circuit.

For a slowly changing signal over a short connection, a lumped resistance-and-capacitance model may be adequate. When propagation time becomes significant relative to a transition's rise or fall time, a distributed transmission-line model can be necessary. Clock frequency alone cannot settle that question: a slowly repeated pulse can still have a very fast edge.

This lesson uses a lossless line with a purely resistive load to make the first reflection calculable. It does not prescribe a termination for an unspecified bus or PCB.

## Compare travel time with edge time

Stipulate propagation speed v = 150 mm/ns. For length L, the one-way delay is td = L/v. A 150 mm connection has td = 1 ns; a reflected wave travels back to the source in another 1 ns.

| Length (mm) | One-way delay (ns) | Round-trip delay (ns) |
| --- | --- | --- |
| 15 | 0.1 | 0.2 |
| 75 | 0.5 | 1 |
| 150 | 1 | 2 |
| 300 | 2 | 4 |

For a 1 ns rising edge, the 150 mm line's one-way travel time equals the entire rise time. Assuming that every point changes voltage simultaneously would hide the traveling-wave behavior. The chosen speed is a supplied model parameter; a real stackup or cable determines its propagation characteristics.

There is no single geometric length separating slow and fast circuits for every waveform. Compare the actual edge, line delay and permitted error, then choose an adequate model. A physical signal also has frequency content above its repetition rate, which helps explain why fast edges can be demanding even at a modest clock frequency.

## Distinguish impedance from DC resistance

A transmission line's characteristic impedance Z0 relates traveling-wave voltage to current. It depends on the conductor and surrounding structure. It is not the same as end-to-end DC resistance: a low-resistance trace can still form, for example, a 50 Ω transmission line with its reference conductor.

For a wave arriving at a resistive load ZL on a lossless line with real Z0, the load reflection coefficient is:

~~~text
Gamma = (ZL − Z0) / (ZL + Z0)
Vreflected = Gamma × Vincident
Vload at first arrival = Vincident × (1 + Gamma)
~~~

Gamma describes voltage amplitude and sign, not the fraction of power directly. A negative coefficient means the reflected voltage has opposite polarity. With a real lossless line and resistive termination, the reflected power fraction is Gamma².

Take Z0 = 50 Ω and an already-established incident step amplitude of 1 V:

| Load (Ω) | Gamma | First reflected step (V) | First load step (V) |
| --- | --- | --- | --- |
| 0 | -1 | -1 | 0 |
| 25 | -0.333333 | -0.333333 | 0.666667 |
| 50 | 0 | 0 | 1 |
| 100 | 0.333333 | 0.333333 | 1.333333 |
| open | 1 | 1 | 2 |

An open circuit has zero load current, but can show twice the incident voltage at first arrival. A short has zero voltage at the load while reflecting with the opposite sign. Matching the load to Z0 removes this ideal load reflection.

## Keep the launched wave distinct from the source voltage

The table assumes a 1 V incident wave; it does not assume a 1 V source always launches that wave. For an ideal source step VS with series resistance RS feeding the line, the initial launched amplitude is VS × Z0/(RS + Z0), before a load reflection returns.

For VS = 2 V, RS = 50 Ω and Z0 = 50 Ω, the incident amplitude is 1 V. An open load initially reaches 2 V after one line delay. The reflected wave returns to the matched source after the round trip and is absorbed there. Combining source conditions with load behavior makes this example consistent.

Different source and load conditions can produce further reflections, and real lines introduce loss and frequency dependence. Therefore, the first load step is not automatically the final settled voltage. Treating the open-load table's 2 V as the response to every 1 V source would confuse two different quantities.

## Preserve references and timing margins

A return-plane interruption changes the physical transmission structure. Neighboring traces can also exchange energy through electric and magnetic coupling, creating crosstalk. Spacing, reference geometry, transition speed and simultaneous switching all affect the result. A fixed clearance rule alone does not establish low interference.

Termination can reduce reflections, but it changes loading, power and possibly the waveform seen at intermediate points. A resistor value must follow the driver, receiver, topology and interface requirements rather than a universal rule to “add 50 Ω.”

Signal quality also includes arrival time. A waveform may settle to a valid high eventually but miss the receiver's sampling deadline. Conversely, a nominally timely edge may ring across a threshold more than once. Check level and timing together at the receiving pins, with the appropriate reference.

## Work through the questions

1. At the stipulated propagation speed, find one-way and round-trip delays for 225 mm.
2. For a 50 Ω line and a 150 Ω load, calculate Gamma and the first load voltage for a 1 V incident step.
3. A 3 V source with 100 Ω series resistance feeds a 50 Ω line. Find the initially launched step.
4. Does a 1 MHz pulse train automatically permit a lumped model when its edges rise in 1 ns?

## Explain the answers

The delays are 225/150 = 1.5 ns one way and 3 ns for the round trip. Load reflection does not return instantly.

Gamma = (150 − 50)/(150 + 50) = 0.5. The reflected step is 0.5 V, so the first load step is 1.5 V. The reflected power fraction in this ideal case is 0.25, not 0.5.

The launched step is 3 × 50/(100 + 50) = 1 V. Finally, repetition rate does not determine edge speed. Compare the 1 ns edge with propagation time and the receiver's requirements before selecting a model.
