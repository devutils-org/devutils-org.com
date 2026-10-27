---
id: path.electronics-and-pcb
type: path
locale: en
slug: electronics-and-pcb
title: Electronics and PCB — from circuit model to measured board
summary: "The sixth computing-stack domain: seven lessons on circuits,
  analog/digital interfaces, schematics, layout, power, signal integrity and
  measurement, with worked exercises."
status: published
updated: 2026-10-26
prerequisites:
  - path.semiconductor-devices
related:
  - path.semiconductor-devices
  - path.digital-logic-foundations
steps:
  - concept.circuit-analysis
  - concept.analog-and-digital-interfaces
  - concept.schematics-and-connectivity
  - concept.pcb-layout-and-return-paths
  - concept.power-and-decoupling
  - concept.signal-integrity
  - concept.measurement-and-debugging
sources:
  - title: OpenStax University Physics, volume 2 — 10.3, Kirchhoff’s rules
    url: https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules
  - title: OpenStax University Physics, volume 2 — 10.5, RC circuits
    url: https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits
  - title: KiCad 9.0 documentation — Getting Started, PCB workflow, footprints, ERC
      and DRC
    url: https://docs.kicad.org/9.0/en/getting_started_in_kicad/getting_started_in_kicad.html
  - title: Analog Devices MT-101 — Decoupling Techniques
    url: https://www.analog.com/media/en/training-seminars/tutorials/mt-101.pdf
  - title: "Tektronix — TDR Impedance Measurements: A Foundation for Signal
      Integrity, reflection coefficient"
    url: https://www.tek.com/en/documents/fact-sheet/tdr-impedance-measurements-foundation-signal-integrity
  - title: Tektronix — ABCs of Probes Primer, loading, capacitance and reference
      connections
    url: https://www.tek.com/en/documents/whitepaper/abcs-probes-primer
---
## Connect components into a system

This sixth domain follows [semiconductor devices](/learn/semiconductor-devices/). You already know voltage, current, charge, capacitance and the basic behavior of diodes and MOSFETs. Now connect those components through a schematic and a physical board, then ask what a receiver or measuring instrument actually sees.

The seven English lessons use progressive models and explained exercises. Read them in order, writing down reference nodes and units before calculating. A correct ideal result is a starting prediction; physical connections, loading and measurement determine whether it answers the real question.

## Follow the seven lessons

1. **Circuit analysis:** apply current and voltage balance, load a divider and reconcile power.
2. **Analog and digital interfaces:** compare driver and receiver guarantees, then calculate a changing node's RC settling.
3. **Schematics:** distinguish symbols, nets and footprints; trace pin-to-pad mappings and understand ERC.
4. **PCB layout:** give connections geometry, calculate resistance and clearance, and follow return currents.
5. **Power:** account for regulation losses and local transient charge without treating a capacitor as a permanent supply.
6. **Signal integrity:** compare edge time with travel time, calculate a first reflection and separate source voltage from the launched wave.
7. **Measurement:** include instrument resistance and capacitance, check physical references and use observations to test a hypothesis.

The examples are independent scoped models. They do not collectively specify a board ready for manufacture. Their purpose is to develop the questions you need to ask before choosing components, connecting instruments or trusting a waveform.

## Check the key distinctions

Explain why a loaded divider differs from an unloaded one, why a valid logical high can still violate a pin-voltage limit, and why a schematic symbol does not determine the package pad numbering.

Then explain why a continuous signal trace can have a disrupted return path, why decoupling placement matters, why repetition rate alone does not define a fast interconnect, and why a stable measured voltage can still be wrong for the unprobed circuit.

If an answer is uncertain, revisit that lesson's model and worked calculation. You should be able to name both what the model predicts and what it leaves out.

## Solve a circuit and measurement synthesis

An ideal 6 V source feeds R1 = 1000 Ω into a node, with R2 = 2000 Ω from that node to ground. Find the unloaded node voltage. Then connect a 2000 Ω instrument input from the same node to ground and find the loaded voltage and source current. Treat this instrument as a supplied simple resistance, without additional capacitance.

Separately, a driver guarantees VOH(min) = 2.9 V and VOL(max) = 0.3 V. Its receiver requires VIH(min) = 2 V and VIL(max) = 0.8 V. Calculate the static high and low margins, assuming shared references and compatible permitted pin voltages.

For a local supply transient, an ideal effective 2 μF capacitor alone supplies an additional 20 mA for 2 μs. Find its voltage reduction, ignoring ESR, ESL and regulator response.

Finally, a 150 mm ideal line has propagation speed 150 mm/ns and Z0 = 50 Ω. A 2 V source with RS = 50 Ω drives it into an open load. Find the one-way delay, launched amplitude and first load step. These are separate models, not one interconnected circuit.

## Explain the combined answer

The unloaded divider gives 6 × 2000/3000 = 4 V. Connecting the instrument places two 2000 Ω branches in parallel, equivalent to 1000 Ω. The loaded node is 3 V and source current is 3 mA. Each lower branch takes 1.5 mA. The instrument has changed the circuit rather than merely observing its previous state.

High margin is 2.9 − 2 = 0.9 V. Low margin is 0.8 − 0.3 = 0.5 V. These checks do not establish propagation timing, acceptable rise time or behavior when one device is unpowered.

The capacitor supplies charge 0.02 A × 2e-6 s = 40 nC. Dividing by 2e-6 F gives a 0.02 V reduction. Repeating that calculation with nominal rather than effective capacitance could give the wrong result for the actual operating conditions.

The line delay is 150/150 = 1 ns. Its initially launched step is 2 × 50/(50 + 50) = 1 V. The open-load reflection coefficient is +1, producing a first load step of 2 V after the one-way delay. That doubling applies to the incident wave, not arbitrarily to the source voltage.

## Continue through the stack

The next planned domain is integrated circuit design: hardware description, simulation, verification, synthesis, physical design and timing. The already available [digital-logic route](/learn/digital-logic-foundations/) develops Boolean functions, arithmetic and state, providing useful preparation. Use the [computing stack](/library/computing-stack/) to distinguish published lessons from planned topics.
