---
id: concept.electricity-basics
type: concept
locale: en
slug: electricity-basics
area: physics
title: Electricity — charge, voltage and current
summary: Distinguish electrical quantities and calculate current, power and
  transferred energy in an ideal resistor circuit.
status: published
updated: 2026-10-25
prerequisites:
  - concept.units-and-scale
  - concept.models-and-abstraction
related:
  - path.physics-for-computing
  - concept.fields-and-induction
sources:
  - title: Steve Ward, Computation Structures — Circuits, sections 4.1–4.3
    url: https://computationstructures.org/notes/circuits/notes.html
  - title: "NIST Guide to the SI — chapter 4, tables 3–4: electrical, energy and
      thermal units"
    url: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes
  - title: "Feynman Lectures, volume II, chapter 1 — sections 1–1 and 1–2: forces
      and fields"
    url: https://www.feynmanlectures.caltech.edu/II_01.html
---
## Begin with charge

Electric charge can have positive or negative sign. Stationary charges of the same sign repel; opposite signs attract. A neutral object has zero net charge: its positive and negative charges balance.

For the arithmetic below, treat charge as an amount that can be counted across a chosen boundary. Keep the boundary and the time interval explicit.

## Name the quantities

Current is charge flow per time. Voltage is electric potential difference: energy difference per unit charge. Resistance relates voltage and current for an ohmic element. Power is energy transferred per time.

| Quantity | Symbol used here | Unit | Useful relationship |
|---|---|---|---|
| Charge | Q | coulomb (C) | 1 C = 1 A × 1 s |
| Current | I | ampere (A) | I = charge / time, for a constant rate |
| Voltage | V | volt (V) | 1 V = 1 J/C |
| Resistance | R | ohm (Ω) | 1 Ω = 1 V/A |
| Power | P | watt (W) | 1 W = 1 J/s |

Do not confuse the symbol V for a voltage variable with V as its unit. Context distinguishes them. “3 V across the resistor” specifies a difference between its terminals, not a quantity of current stored inside it.

## Solve an ideal circuit

Imagine an ideal 3 V source connected in a closed loop to one ideal 1000 Ω resistor. Ignore wire resistance and changes with temperature. For an ideal resistor, V = R × I. Rearranging gives I = V/R.

~~~text
I = 3 V / 1000 Ω = 0.003 A = 3 mA
P = V × I = 3 V × 0.003 A = 0.009 W
energy in 2 s = 0.009 W × 2 s = 0.018 J
charge in 2 s = 0.003 A × 2 s = 0.006 C
~~~

The power expression follows by multiplying energy per charge by charge per time. The source supplies the energy that the resistor absorbs. Charge transport and energy transfer are related quantities, not interchangeable ones.

## Change one assumption

Keep the voltage at 3 V and vary only the resistance in the same model:

| Voltage (V) | Resistance (Ω) | Current (mA) | Absorbed power (mW) |
|---|---|---|---|
| 3 | 500 | 6 | 18 |
| 3 | 1000 | 3 | 9 |
| 3 | 2000 | 1.5 | 4.5 |

Doubling the resistance halves the current under a fixed voltage. That conclusion depends on both the ideal resistor law and the unchanged source voltage.

## Try it yourself

For a 4 V source and ideal 2000 Ω resistor, calculate current, absorbed power and energy absorbed over 3 s. Then state which assumption lets you use V = R × I.

## Answers and limits

The current is 2 mA, power is 8 mW and energy is 0.024 J. We assumed a constant ohmic resistance. The calculation uses ideal components. A real circuit also needs source limits and component ratings.

Next: [fields and induction](/knowledge/physics/fields-and-induction/).
