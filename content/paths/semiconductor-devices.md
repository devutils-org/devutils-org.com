---
id: path.semiconductor-devices
type: path
locale: en
slug: semiconductor-devices
title: Semiconductor devices — from junctions to CMOS power
summary: "The fifth computing-stack domain: six progressive lessons on PN
  junctions, diode models, MOSFETs, CMOS, scaling and leakage, with worked
  exercises."
status: published
updated: 2026-10-26
prerequisites:
  - path.semiconductor-manufacturing
related:
  - path.semiconductor-manufacturing
  - path.digital-logic-foundations
steps:
  - concept.pn-junctions
  - concept.diode-models
  - concept.mosfets
  - concept.cmos
  - concept.device-scaling
  - concept.leakage-and-static-power
sources:
  - title: MIT 3.15.1x — PN junctions, depletion and equilibrium
    url: https://openlearninglibrary.mit.edu/assets/courseware/v1/65a20d724951d24189c63bace338984a/asset-v1%3AMITX%2B3.15.1x%2B2T2017%2Btype%40asset%2Bblock/315pnJunction_final.pdf
  - title: Computation Structures — CMOS, sections 6.1–6.5
    url: https://computationstructures.org/notes/cmos/notes.html
  - title: Texas Instruments — Design Considerations for Logic Products, CMOS Power
      Consumption and Cpd Calculation
    url: https://www.ti.com/lit/an/sdya018/sdya018.pdf
  - title: Texas Instruments — Estimating Leakage Currents of Power MOSFETs, SBAA753
    url: https://www.ti.com/document-viewer/lit/html/SBAA753/GUID-D7D35C31-2F71-4BB6-8959-9B4A80000371
---
## Connect structures to electrical behavior

This fifth domain follows [semiconductor manufacturing](/learn/semiconductor-manufacturing/). You should already distinguish dopant concentration from mobile carriers, voltage from current, and energy from power. The earlier [physics](/learn/physics-for-computing/) and [materials](/learn/chemistry-and-materials/) routes supply those foundations.

The six English lessons explain how semiconductor structures become useful electrical components. Each introduces its notation and assumptions before calculations, then provides questions and explained answers. Work through the reasoning rather than memorizing a voltage or formula without its conditions.

## Follow the six lessons

1. **PN junctions:** follow diffusion, fixed space charge and the opposing field; balance depleted widths on the two sides.
2. **Diode models:** define forward bias, calculate an exponential current and distinguish that model from a chosen constant voltage drop.
3. **MOSFETs:** subtract terminal voltages, compare NMOS and PMOS control, and distinguish threshold from a low-resistance conducting state.
4. **CMOS:** construct an inverter and NAND, then account for charge, stored energy and supply energy during switching.
5. **Scaling:** square a geometric ratio, multiply power ratios and separate density from useful performance.
6. **Leakage:** distinguish static current paths, calculate idle energy and compare lower switching frequency with genuine sleep.

Use the ordered article links below. The sequence adds a model at a time: charge balance, diode current, controlled switch, complementary network and finally a power budget. The numbers are supplied exercise inputs rather than a specification for one fabricated device.

## Check the distinctions

Explain why a depletion region still contains charge, why a diode has no universal forward-voltage step and why the gate voltage relative to ground does not by itself tell you whether a MOSFET conducts.

Then explain why an inverter truth table does not specify propagation time, why stored capacitor energy differs from full-cycle supply energy, and why stopping transitions leaves possible leakage paths. If one answer is unclear, return to the relevant lesson before the synthesis.

## Solve a combined example

For an abrupt junction, assume NA = 2e16 cm^-3, ND = 1e16 cm^-3 and p-side depleted width 0.1 μm. What n-side width balances the exposed charge?

Separately, a conventional CMOS inverter has VDD = 1 V and a settled rail-high input. Which device conducts in the ideal switch picture, and what output state results?

For a lumped switched node with C = 20 fF, α = 0.25 rising transitions per clock and f = 1 GHz, find stored energy at the high state, supply energy per full cycle and capacitive switching power. Suppose total standby current for the modeled block is 2 μA at that same 1 V rail. Add its static power to the capacitive term, neglecting other currents.

Finally, halve frequency while holding capacitance, activity per cycle, voltage and standby current fixed. Find the new total power. Do not infer task energy until you specify the task duration.

## Explain the combined answer

The charge condition gives xn = (NA/ND)xp = 0.2 μm. Total depletion width is 0.3 μm. That balances charge for the supplied geometry without independently deriving the absolute electrostatic width.

The high inverter input turns the ideal NMOS on and PMOS off, pulling the settled output low. This describes the static result, after charging currents have settled.

The 20 fF capacitance stores CV²/2 = 10 fJ at 1 V. Its full-cycle supply energy is CV² = 20 fJ. Switching power is 0.25 × 20e-15 × 1² × 1e9 = 5 μW. Static power is 1 V × 2 μA = 2 μW, giving 7 μW total in this two-term model.

At half frequency, the capacitive term becomes 2.5 μW while the stipulated static term stays 2 μW. Total power becomes 4.5 μW. It has not halved, and a task that now lasts longer may accumulate more static energy. The three calculations are separate models; their numerical agreement does not establish the behavior of a particular manufactured transistor.

## Continue through the stack

Continue with [electronics and PCB](/learn/electronics-and-pcb/): circuits, interfaces, supplies and physical connections around components. You can also explore the already available [digital-logic route](/learn/digital-logic-foundations/) to develop the logical functions introduced by CMOS gates. The [computing stack](/knowledge/computing-stack/) shows which domains have published articles.
