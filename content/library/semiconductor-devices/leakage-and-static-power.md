---
id: concept.leakage-and-static-power
type: concept
locale: en
slug: leakage-and-static-power
area: semiconductor-devices
title: Leakage and static power — energy while idle
summary: Distinguish leakage paths, compute standby energy and compare clock
  gating, sleep and task energy.
status: published
updated: 2026-10-26
prerequisites:
  - concept.device-scaling
related:
  - path.semiconductor-devices
sources:
  - title: Texas Instruments — Estimating Leakage Currents of Power MOSFETs, SBAA753
    url: https://www.ti.com/document-viewer/lit/html/SBAA753/GUID-D7D35C31-2F71-4BB6-8959-9B4A80000371
  - title: Texas Instruments — Design Considerations for Logic Products, CMOS Power
      Consumption and Cpd Calculation
    url: https://www.ti.com/lit/an/sdya018/sdya018.pdf
  - title: Computation Structures — CMOS, sections 6.1–6.5
    url: https://computationstructures.org/notes/cmos/notes.html
  - title: "Chenming Hu — Modern Semiconductor Devices, chapter 7, sections 7.2 and
      7.4: subthreshold current and gate tunneling"
    url: https://www.chu.berkeley.edu/wp-content/uploads/2020/01/Chenming-Hu_ch7.pdf
---
## Replace the perfectly open switch

The ideal MOSFET switch makes circuit reasoning manageable: below threshold, no source–drain current; an insulated gate, no steady gate current. Actual devices depart from both statements. Small currents can persist when a circuit has stopped switching, creating static power consumption.

Leakage does not mean every off device carries the same current, or that one physical mechanism explains every path. It depends on device structure, voltage, temperature and circuit state. The goal here is to distinguish mechanisms and account for supplied current values, rather than derive a universal leakage number.

This completes the device route by reconnecting [PN junctions](/library/semiconductor-devices/pn-junctions/), [MOSFETs](/library/semiconductor-devices/mosfets/) and [CMOS](/library/semiconductor-devices/cmos/) with the energy budget of a whole block.

## Distinguish the current paths

**Subthreshold conduction** is source–drain current when gate bias is below the threshold used in the strong-channel model. The physical current does not fall discontinuously to zero at that threshold. In a useful weak-inversion approximation it varies roughly exponentially with gate bias, with additional dependence on device conditions.

**Gate leakage** passes through the gate dielectric. Quantum tunneling can contribute through a sufficiently thin barrier. This is different from the temporary current needed to charge an ideal gate capacitance: capacitive charging can finish, while a leakage path can continue to draw current at a constant voltage.

**Junction leakage** is associated with reverse-biased semiconductor junctions, including junctions involving source/drain regions and the body. Recall that reverse bias did not make even the simple diode law predict exactly zero current.

Which mechanism dominates depends on the technology and operating point. A list of mechanisms is not a rule that their contributions are equal. Nor should currents through internal paths be blindly added if that counts the same supply current twice. For a supply-power budget, use distinct contributions or the total measured current at each supply.

## Convert a standby current into power and energy

For a constant supply, Pstatic = VDD × Istandby. Stipulate 1000 independent blocks connected to a 1 V rail, each drawing a total standby current of 2 μA under the same stated conditions. Their currents add at that rail:

~~~text
Itotal = 1000 × 2 μA = 2000 μA = 2 mA
Pstatic = 1 V × 2 mA = 2 mW
Estandby over 5 s = 2 mW × 5 s = 10 mJ
~~~

The block current is already a total supply current, so do not multiply it again by the number of internal transistors. If it includes bias circuits as well as leakage, call the resulting power standby power rather than attributing every microwatt to transistor leakage.

For different rails, compute each rail's voltage times its current and add powers. A 1 V rail drawing 2 mA and a 0.5 V rail drawing 1 mA consume 2 + 0.5 = 2.5 mW together. Multiplying their combined current by just one of the voltages would use the wrong energy per charge for part of the system.

## Separate clock gating from power gating

Suppose a block has capacitive switching power 4 mW and static power 2 mW while active, giving 6 mW total in this two-term model. Halving its frequency at fixed activity per cycle, capacitance, voltage and static current reduces the dynamic term to 2 mW. Total power becomes 4 mW, not 3 mW.

For a fixed number of cycles, the modeled execution takes twice as long. If the original task lasts 1 ms, its energy is 6 mW × 1 ms = 6 μJ. The slower version consumes 4 mW × 2 ms = 8 μJ. Lower instantaneous power has increased task energy because leakage runs longer. These assumptions exclude changes in voltage, memory waiting and useful work per cycle.

Clock gating prevents selected clock-driven transitions and can reduce dynamic power. It leaves the supply connected, so it does not inherently remove leakage. Power gating disconnects a block's supply path, but introduces its own switches, residual currents, wake-up work and state-retention questions. Retaining information through sleep is a separate requirement from stopping transitions.

## Average power over a duty cycle

Let the original block be active 10% of the time at 6 mW, then remain powered but idle at 2 mW for the other 90%. Its average is a time-weighted sum:

~~~text
Paverage = 0.1 × 6 + 0.9 × 2 = 2.4 mW
~~~

If a different sleep arrangement consumes 0.2 mW during the same idle fraction, the corresponding average becomes 0.1 × 6 + 0.9 × 0.2 = 0.78 mW, before transition costs. The saving is not a claim that every brief pause should trigger sleep. Entering and leaving sleep consumes energy and time, and useful state may need preservation.

For example, if combined entry/exit energy were stipulated as 18 μJ, reducing idle power from 2 to 0.2 mW saves 1.8 mW while asleep. The energy-only break-even idle duration would be 18 μJ / 1.8 mW = 10 ms. Wake-up latency and other constraints still require separate checks.

## Work through the questions

1. At a 0.8 V rail, 500 independent blocks each draw 3 μA total standby current. Find total current, power and energy over 2 s.
2. An active state consumes 8 mW for 25% of time, and sleep consumes 1 mW for the rest. Find average power, ignoring transitions.
3. Why does stopping a clock fail to establish zero supply current?
4. Can a room-temperature typical leakage value be treated as a worst-case value at every temperature and bias?

## Explain the answers

For question 1, total current is 1500 μA = 1.5 mA. Power is 0.8 × 1.5 = 1.2 mW, and energy over 2 s is 2.4 mJ. The conversion from microamperes to milliamperes matters as much as the multiplication.

For question 2, average power is 0.25 × 8 + 0.75 × 1 = 2.75 mW. Averaging the two powers equally would implicitly assume equal durations.

For question 3, the supply still biases physical devices and any remaining bias circuits. Eliminating transitions addresses dynamic current, while static paths remain.

For question 4, no. Check stated voltage, temperature, device state and whether the value is typical or a specified bound. A model becomes useful by matching its conditions to the question being asked, not by carrying a plausible number into every calculation.
