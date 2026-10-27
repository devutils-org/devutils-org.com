---
id: concept.mosfets
type: concept
locale: en
slug: mosfets
area: semiconductor-devices
title: MOSFETs — gate control, terminal voltages and operating regions
summary: Use source-relative gate voltages, distinguish threshold from low
  resistance and solve a scoped switch circuit.
status: published
updated: 2026-10-26
prerequisites:
  - concept.diode-models
  - concept.silicon-and-oxide
related:
  - path.semiconductor-devices
  - concept.cmos
sources:
  - title: Toshiba — MOSFET operation, regions and body terminal
    url: https://toshiba.semicon-storage.com/us/semiconductor/knowledge/faq/mosfet/how-do-n-channel-mosfets-work.html
  - title: Computation Structures — CMOS, sections 6.1–6.5
    url: https://computationstructures.org/notes/cmos/notes.html
  - title: Texas Instruments — Estimating Leakage Currents of Power MOSFETs, SBAA753
    url: https://www.ti.com/document-viewer/lit/html/SBAA753/GUID-D7D35C31-2F71-4BB6-8959-9B4A80000371
---
## Control a channel with an electric field

A metal–oxide–semiconductor field-effect transistor, or MOSFET, uses a gate electric field to control conduction between source and drain. Its fourth terminal is the body, also called bulk. The familiar three-terminal drawing often hides a body connection rather than eliminating it.

An enhancement-mode n-channel MOSFET has n-type source and drain regions adjacent to a p-type body. An insulated gate can attract electrons near the semiconductor surface, forming a conducting channel between them. The gate electrode is separated from the semiconductor by a dielectric. This connects [silicon and oxide](/library/chemistry-materials/silicon-and-oxide/) and [manufacturing](/learn/semiconductor-manufacturing/) to electrical behavior: materials and geometry establish a structure whose charge distribution changes with applied voltage.

The gate does not supply the channel's steady conduction current in the ideal insulated-gate picture. A separate circuit supplies current through source and drain. Changing the gate voltage still requires moving charge onto or off gate capacitances. Real devices also have leakage, so an insulated gate is not a promise of zero current under every condition.

## Subtract terminal potentials

For an NMOS, define VGS = VG − VS and VDS = VD − VS. A gate voltage quoted relative to ground does not, by itself, determine VGS.

Use an ideal switch approximation with threshold VTH = 0.4 V, source/body conditions held within the model's assumptions, and normal drain polarity. Below threshold the switch is open; above it the channel can conduct. These supplied values illustrate terminal subtraction rather than specify a real transistor.

| VG (V) | VS (V) | VGS (V) | Ideal state |
| --- | --- | --- | --- |
| 0 | 0 | 0 | open |
| 1.2 | 0 | 1.2 | conducting |
| 1.2 | 1 | 0.2 | open |
| 1.5 | 1 | 0.5 | conducting |

The second and third rows have the same gate potential but different states because the source potential changes. Avoid the shortcut “high gate means on” until the source reference is fixed.

A p-channel enhancement MOSFET uses the complementary polarity. It is often clearer to write VSG = VS − VG and compare it with the positive magnitude of the PMOS threshold. If VS = 1.2 V, VG = 0 V and |VTP| = 0.4 V, then VSG = 1.2 V and the ideal PMOS conducts. Raising VG to 1.2 V makes VSG zero and turns this ideal switch off.

## Separate threshold from strong conduction

A real threshold is defined through a model or a stated measurement criterion. Reaching it does not establish a low on-resistance at an arbitrary load current. A datasheet may specify threshold at a small test current and on-resistance at a different, larger gate drive. Read those conditions together.

For an introductory long-channel NMOS model, define overdrive as VGS − VTH. With positive overdrive and normal positive VDS, a small VDS gives the linear or triode region. Increasing VDS to the overdrive reaches the boundary to the saturation region. Here saturation means drain current becomes less sensitive to additional VDS in that simplified model. It does not mean the transistor is the best possible closed switch.

For VGS = 1.0 V and VTH = 0.4 V, the overdrive is 0.6 V. A VDS of 0.1 V lies in the linear region; 0.8 V lies in saturation under these assumptions. This classification does not calculate the current magnitude. That needs additional parameters and an adequate device model, especially for short-channel structures.

## Solve a switch circuit consistently

Consider a 1 V supply, a 1000 Ω load resistor and an NMOS to ground. For one specified conducting state, approximate the transistor by Ron = 100 Ω. The gate drive is supplied separately and is assumed adequate for that resistance approximation.

~~~text
I = 1 / (1000 + 100) = 0.909091 mA
VDS = I × 100 = 0.090909 V
Vload = I × 1000 = 0.909091 V
~~~

The transistor's drain is therefore close to ground but not exactly at ground. Calling a conducting device a switch is a useful abstraction; treating its finite voltage drop as zero can hide load-dependent output errors and dissipation.

The resistor approximation belongs to this stated operating condition. It is not a universal current law above threshold. If the solved biases leave the region where Ron is adequate, the calculation must be revisited with a better model.

When the ideal transistor is open, the load pulls its drain to 1 V and the modeled current is zero. A real off transistor can still leak. Body junctions also constrain allowed terminal voltages: source and drain are not freely interchangeable in every physical or packaged device. In the CMOS circuits studied next, NMOS bodies are tied to ground and PMOS bodies to the positive rail in the conventional bulk implementation.

## Work through the questions

1. An NMOS has gate 1.1 V and source 0.8 V. Is it conducting in the 0.4 V threshold switch model?
2. A PMOS has source 1 V, gate 0.3 V and threshold magnitude 0.4 V. Find VSG and its ideal state.
3. Keep the 1 V supply and 100 Ω Ron, but change the load to 900 Ω. Find current and drain voltage.
4. If a datasheet gives threshold at a small drain current, does that prove the same gate voltage will support a large load with low resistance?

## Explain the answers

For question 1, VGS = 1.1 − 0.8 = 0.3 V, below the stipulated threshold, so the ideal switch is open. The gate's voltage above ground was not the relevant comparison.

For question 2, VSG = 1 − 0.3 = 0.7 V. It exceeds the threshold magnitude, so the ideal PMOS conducts.

For question 3, total resistance is 1000 Ω and current is 1 mA. The drain voltage is 0.1 V and the load receives 0.9 V. Their sum recovers the supply voltage.

For question 4, no. Threshold and low-resistance operation answer different questions. Use the specified bias, current and temperature conditions to decide whether a model supports the intended calculation.
