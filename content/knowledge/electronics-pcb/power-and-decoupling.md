---
id: concept.power-and-decoupling
type: concept
locale: en
slug: power-and-decoupling
area: electronics-pcb
title: Power and decoupling — regulation, loss and transient charge
summary: Reconcile regulator power, calculate capacitor droop and explain why
  effective capacitance and connection impedance matter.
status: published
updated: 2026-10-26
prerequisites:
  - concept.pcb-layout-and-return-paths
  - concept.circuit-analysis
related:
  - path.electronics-and-pcb
  - concept.signal-integrity
sources:
  - title: Analog Devices — Understand Low-Dropout Regulator Concepts, efficiency
      and dropout
    url: https://www.analog.com/en/resources/analog-dialogue/articles/understand-ldo-concepts.html
  - title: Analog Devices MT-101 — Decoupling Techniques
    url: https://www.analog.com/media/en/training-seminars/tutorials/mt-101.pdf
---
## Deliver a voltage at the load

A supply marked 3.3 V does not guarantee that every load pin sees exactly 3.3 V at every instant. Wiring and PCB paths have impedance, regulators have finite response, and loads change their current. The useful question is the voltage at the component relative to its own return connection under the required conditions.

The [PCB lesson](/knowledge/electronics-pcb/pcb-layout-and-return-paths/) showed how a conductor drops voltage at DC. If a complete supply-and-return path has 0.2 Ω resistance and carries 0.3 A, the load loses 0.06 V relative to the source-terminal voltage. The drop belongs to the whole loop, not only the positive track.

Start a power budget by listing rails, load currents and permitted voltage ranges. Distinguish average current, steady worst-case current and transient current requirements. Each describes a different part of the problem.

## Account for a linear regulator

A linear regulator controls a pass element to maintain an output voltage while dissipating part of the input power. For a simple model that neglects regulator ground current:

~~~text
Pin = Vin × Iout
Pout = Vout × Iout
Ploss = (Vin − Vout) × Iout
Efficiency = Pout / Pin = Vout / Vin
~~~

Choose Vin = 5 V, Vout = 3.3 V and Iout = 0.1 A. Input power is 0.5 W, delivered load power is 0.33 W and regulator loss is 0.17 W. Efficiency is 66%. Raising load current to 0.3 A triples the powers: 1.5 W input, 0.99 W output and 0.51 W loss.

These results assume the device can maintain regulation at the supplied voltage and load. An LDO, or low-dropout regulator, still needs some input-to-output headroom. Dropout, output-capacitor requirements, current limit, thermal behavior and startup must come from the selected device's specifications.

A switching converter transfers energy through switching elements and reactive components, often achieving a different loss tradeoff. It does not make loss, ripple or layout constraints disappear. If an abstract converter delivers 0.99 W at 90% efficiency, input power is 0.99/0.9 = 1.1 W and loss is 0.11 W. That stated efficiency is an exercise input, not a promise for an unspecified converter.

## Supply charge during a short current step

A decoupling capacitor provides a local path for changing current, reducing the demand that a distant supply must meet instantly. For an ideal capacitor supplying a constant additional current I over duration delta-t:

~~~text
delta-Q = I × delta-t
delta-V = delta-Q / C = I × delta-t / C
~~~

Suppose a capacitor alone supplies an additional 20 mA for 1 μs. The removed charge is 20 nC. With effective C = 1 μF, the ideal voltage reduction is 0.02 V.

| Additional current (mA) | Duration (μs) | Effective C (μF) | Ideal droop (mV) |
| --- | --- | --- | --- |
| 20 | 1 | 1 | 20 |
| 20 | 2 | 1 | 40 |
| 20 | 1 | 2 | 10 |
| 40 | 1 | 1 | 40 |

The current in this model is the part not supplied through other paths during the interval. It is not necessarily the component's complete operating current. As the upstream supply responds, the sharing changes. A capacitor can support a transient, but cannot provide an indefinite DC load without its voltage continuing to fall.

## Add resistance and inductance

A real capacitor and its connections have equivalent series resistance, ESR, and equivalent series inductance, ESL. ESR contributes an immediate current-dependent voltage change; inductance resists rapid changes in current. Placement and return geometry therefore matter alongside the capacitance printed on the package.

For a separate simplified estimate, let the transient current change by 20 mA and ESR be 0.1 Ω. The resistive step is 0.002 V, or 2 mV. Adding that to the 20 mV ideal capacitive reduction gives an approximate 22 mV budget, while still neglecting inductance and regulator response.

The effective capacitance can differ from nominal under operating bias, temperature and tolerance. If the original nominal 1 μF acts as only 0.5 μF under the stipulated conditions, the same charge removes 40 mV instead of 20 mV. Use the effective value required by the model.

A short physical distance is useful because it can reduce connection impedance, but proximity alone does not guarantee a compact loop. Follow the entire path from supply pin through capacitor and reference connection. Multiple capacitors and interconnects can also form resonances; simply adding capacitance is not a complete analysis of the supply network.

## Keep distinct power questions separate

DC regulation asks whether the average or steady voltage is maintained. Transient response asks how much it moves after a load change and how it recovers. Ripple and noise describe variations whose frequency content and measurement method matter. Thermal analysis asks whether losses produce acceptable temperatures.

A circuit may pass one requirement and fail another. A regulator with enough output current can still overheat. A large capacitor can reduce one transient yet conflict with stability or startup requirements. Start with the actual load specification, then check each requirement under its own conditions.

## Work through the questions

1. In the zero-ground-current linear model, convert 5 V to 2.5 V at 0.2 A. Find input power, output power, loss and efficiency.
2. An ideal capacitor supplies 10 mA for 2 μs with a maximum allowed change of 0.01 V. What minimum capacitance does the model require?
3. If effective capacitance is half the value used in a droop calculation, what happens to that droop?
4. Does a decoupling capacitor replace the DC supply?

## Explain the answers

Input power is 1 W; output power is 0.5 W; loss is 0.5 W; efficiency is 50%. This does not establish whether a particular regulator can dissipate that loss acceptably.

Rearrange C = I delta-t / delta-V. The result is 0.01 × 2e-6 / 0.01 = 2e-6 F, or 2 μF effective capacitance. ESR, ESL and other requirements remain separate.

Halving capacitance doubles the ideal voltage change for the same removed charge. Finally, a capacitor only stores finite charge and energy. The supply must replenish it and support the sustained load; local decoupling handles part of the changing demand.
