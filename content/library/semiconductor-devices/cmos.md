---
id: concept.cmos
type: concept
locale: en
slug: cmos
area: semiconductor-devices
title: CMOS — complementary switches and charging energy
summary: Build an inverter and NAND, separate settled states from transitions
  and account for capacitive switching energy.
status: published
updated: 2026-10-26
prerequisites:
  - concept.mosfets
related:
  - path.semiconductor-devices
  - concept.device-scaling
sources:
  - title: Computation Structures — CMOS, sections 6.1–6.5
    url: https://computationstructures.org/notes/cmos/notes.html
  - title: Texas Instruments — Design Considerations for Logic Products, CMOS Power
      Consumption and Cpd Calculation
    url: https://www.ti.com/lit/an/sdya018/sdya018.pdf
---
## Build a path to each supply rail

CMOS means complementary metal–oxide–semiconductor. In static CMOS logic, complementary NMOS and PMOS networks connect an output to ground or to the positive supply VDD. The [MOSFET lesson](/library/semiconductor-devices/mosfets/) explained how source-relative gate voltage controls an individual device. Now combine devices to produce a reproducible output state.

Begin with an inverter. Connect a PMOS between VDD and the output, an NMOS between the output and ground, and both gates to the input. In the conventional bulk arrangement, the PMOS body connects to VDD and the NMOS body to ground. Assume input levels at the rails, sufficient supply voltage for the chosen devices and an unloaded output after settling.

| Input state | NMOS | PMOS | Output state |
| --- | --- | --- | --- |
| 0 | open | conducting | 1 |
| 1 | conducting | open | 0 |

At input zero, the PMOS has a large source-to-gate voltage while the NMOS has zero gate-to-source voltage. The output is pulled high. At input VDD, the NMOS pulls low and the PMOS opens. “Inverter” describes the resulting opposite logical state; it does not mean the output voltage is the negative of the input voltage.

## Distinguish settled states from transitions

In the ideal switch model, a settled valid input leaves one supply path open, preventing a direct VDD-to-ground current path. A charged output capacitance can maintain a voltage without continuous charging current. This explains the appeal of complementary logic, but real leakage remains.

During a transition, input voltages pass through a range where both devices may conduct. There can be a temporary current directly between the rails, in addition to current charging or discharging capacitance. An input held in that intermediate range can therefore consume sustained current and fail to represent a valid logic state.

The output also takes time to change. It drives gate capacitances of subsequent devices and capacitance associated with wiring and junctions. Finite current cannot move finite charge instantaneously. A static truth table describes the settled logical result; it is not a timing diagram.

## Account for charging energy

For a constant capacitance C, charge Q = CV and stored energy E = CV²/2. To charge it from zero to VDD through a resistive path from an ideal constant-voltage supply, the supply delivers Q × VDD = C VDD². Half ends up stored and half is dissipated during charging. When the capacitor discharges through the pull-down path to ground, the stored half is dissipated too.

For a full output cycle 0 → VDD → 0, the supply energy is thus C VDD². This counts the same energy that is eventually dissipated over that cycle. It is twice the energy stored at the high state; those quantities answer different questions.

Choose C = 10 fF and VDD = 1 V. Since a femtofarad is 1e-15 F, C = 1e-14 F. Charge at the high state is 10 fC, stored energy is 5 fJ, and supply energy for one full charge/discharge cycle is 10 fJ. The inputs are a lumped teaching model; capacitance in a real circuit can depend on bias.

If α is the average number of **0-to-1 output transitions per clock cycle**, and f is the clock frequency, the capacitive switching-power model is:

~~~text
Pdynamic = α × C × VDD² × f
~~~

With α = 0.25 and f = 1 GHz, the result is 0.25 × 1e-14 × 1 × 1e9 = 2.5 μW. Defining α using all rising and falling edges instead would change the factor in the equation. Always check the event being counted.

This term excludes direct-path transition current and static leakage. It also excludes other nodes unless their activity and capacitance are added. A load-capacitor calculation is not automatically the power of an entire chip.

## Combine switches into a NAND

Two NMOS devices in series pull down only when both inputs A and B are high. Two PMOS devices in parallel pull up when at least one input is low. Connect these complementary networks to one output:

| A | B | Pull-down conducting | Pull-up conducting | Output |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 |

This is NAND: the output is low only for two high inputs. Series and parallel are electrical connections; the table follows by asking whether a complete path exists, rather than memorizing a gate symbol. You will revisit the logical function in [digital logic](/learn/digital-logic-foundations/).

Swapping only one network's topology can leave both paths conducting or both open for some input. Both conducting creates unwanted rail current; both open leaves an output without a defined restoring path in static logic. Complementarity must hold for every valid input combination.

## Work through the questions

1. In the inverter, what does a settled high input do to each transistor and the output?
2. Double the modeled load to 20 fF, keeping 1 V, α = 0.25 and 1 GHz. Find full-cycle energy and capacitive power.
3. If A = 1 and B = 0 in the NAND, which network connects the output to a rail?
4. Is the 5 fJ stored in the original capacitor the complete energy drawn from the supply for a full cycle?

## Explain the answers

The high input turns the ideal NMOS on and PMOS off; the settled output is low.

Doubling capacitance doubles both results: full-cycle energy is 20 fJ and capacitive switching power is 5 μW. No claim about leakage follows from that calculation.

For the NAND, the NMOS controlled by B breaks the series pull-down path. Its PMOS counterpart conducts in the parallel pull-up network, so the output settles high.

Finally, 5 fJ is the high-state stored energy. The original supply delivers 10 fJ per full cycle, of which half is dissipated during charging and half during discharge. Keeping energy storage, supply energy and average power separate prevents a common factor-of-two error.
