---
id: concept.device-scaling
type: concept
locale: en
slug: device-scaling
area: semiconductor-devices
title: Device scaling — density, energy and performance tradeoffs
summary: Calculate geometric density and dynamic-power ratios without equating
  transistor count with speed or efficiency.
status: published
updated: 2026-10-26
prerequisites:
  - concept.cmos
related:
  - path.semiconductor-devices
  - concept.leakage-and-static-power
sources:
  - title: Texas Instruments — Design Considerations for Logic Products, CMOS Power
      Consumption and Cpd Calculation
    url: https://www.ti.com/lit/an/sdya018/sdya018.pdf
  - title: Computation Structures — CMOS, sections 6.1–6.5
    url: https://computationstructures.org/notes/cmos/notes.html
---
## Ask what is being scaled

Miniaturization can put more devices in a given area, but transistor count, switching speed, energy per operation and total power are different quantities. To reason about scaling, name the dimension or electrical variable that changes, then state which other quantities are held fixed.

The [manufacturing route](/learn/semiconductor-manufacturing/) explained that feature width, alignment, film thickness and process integration impose separate constraints. A smaller drawn shape does not automatically establish a working smaller device. Here we use explicit geometry and power models to understand why a density improvement cannot by itself predict a processor's performance.

Begin with a hypothetical square placement cell of pitch p. One cell occupies p² area. Ignoring edges, routing, unused regions and all other structures, a fixed area fits a count proportional to 1/p². Pitch is a stated spacing in this model, not a technology-node label or the physical length of every transistor.

## Calculate an ideal area ratio

Reduce pitch from 10 arbitrary length units to 7. The linear scale factor is 7/10 = 0.7. Cell area changes by 0.7² = 0.49, so the ideal cell count per area changes by 1/0.49, approximately 2.040816.

| Pitch | Relative cell area | Relative ideal density |
| --- | --- | --- |
| 10 | 1 | 1 |
| 8 | 0.64 | 1.5625 |
| 7 | 0.49 | 2.040816 |
| 5 | 0.25 | 4 |

The comparison is against pitch 10 in every row. A 30% reduction in each linear dimension produces a 51% area reduction, not a 30% area reduction. Conversely, doubling ideal density requires dividing pitch by the square root of two, giving about 7.071 units from the original 10.

This exercise counts hypothetical cells. It does not promise that a whole chip shrinks by the same fraction: interconnects, memories, power distribution, I/O structures and placement constraints need their own models. Some resources may scale differently or occupy a relatively larger share afterward.

## Separate density from switching power

Reuse the capacitive model from [CMOS](/library/semiconductor-devices/cmos/): P = α C V² f. When comparing two states, divide the new expression by the old:

~~~text
Pnew / Pold = (αnew / αold) × (Cnew / Cold)
              × (Vnew / Vold)² × (fnew / fold)
~~~

Each ratio is dimensionless. This form makes assumptions visible: keeping activity and capacitance fixed lets their ratios cancel, but does not assert that they would remain fixed in a redesigned chip.

At unchanged activity, capacitance and frequency, lowering voltage from 1 V to 0.8 V produces a power ratio of 0.64. If frequency is simultaneously doubled, the ratio becomes 0.64 × 2 = 1.28. The lower voltage does not prevent a 28% power increase in that stipulated comparison.

At unchanged voltage and activity, a capacitance ratio of 0.7 combined with frequency ratio 1.5 gives power ratio 1.05. Smaller capacitance has helped, yet the higher switching rate more than consumes that saving. In each case, this is only the capacitive term, not static leakage or complete system power.

A device may also switch more slowly at a lower supply, so a proposed voltage and frequency pair must be checked for timing feasibility. The power equation describes energy accounting for activity that actually occurs; it does not establish that arbitrary settings will function.

## Keep energy and power density distinct

At fixed capacitance and voltage, each full charge/discharge cycle still draws CV², even if cycles occur less often. Reducing frequency lowers power by spreading those cycles over more time; it does not reduce this particular energy per cycle.

Now suppose a fixed area holds twice as many identical active cells, each consuming the same power as before. Total power and average power per area both double. If each new cell instead consumes 0.6 times the old cell power, the area still dissipates 2 × 0.6 = 1.2 times as much. More efficient individual cells can coexist with greater heat generation per area.

Temperature rise does not follow from that ratio alone. It also depends on heat paths, package and cooling conditions, as explained in [heat and energy](/library/physics/heat-and-energy/). Keeping die area fixed is different from keeping total transistor count fixed; specify which comparison you mean.

## Read performance claims with a workload

More transistors can support more storage, parallel execution or additional functions. Whether a task finishes sooner depends on how the architecture and software use them. A workload limited by data movement may gain little from a larger arithmetic unit.

Likewise, a faster individual transition does not establish the frequency of a complete system. A critical path crosses multiple gates and wires. Connections have resistance and capacitance, and devices must drive their actual loads. Density is a physical opportunity whose useful result depends on the rest of the design.

Treat claims about “twice as much” as incomplete until their denominator is clear: twice the devices per area, twice the completed work per second, or half the energy per completed task? Those are separately measurable outcomes.

## Work through the questions

1. A placement pitch falls from 12 to 9 units. Find the area and ideal-density ratios.
2. With activity unchanged, take capacitance ratio 0.8, voltage ratio 0.9 and frequency ratio 1.25. Find the dynamic-power ratio.
3. If cell density doubles while per-cell power falls to 40%, what happens to power per fixed area?
4. Does halving frequency at fixed voltage and capacitance halve CV² per cycle?

## Explain the answers

The pitch ratio is 9/12 = 0.75. Area ratio is 0.5625 and ideal density ratio is 1/0.5625, approximately 1.777778. The square appears because both planar dimensions change.

For question 2, multiply the independent factors: 0.8 × 0.9² × 1.25 = 0.81. The modeled dynamic term falls by 19%, assuming the proposed operation is feasible.

For question 3, 2 × 0.4 = 0.8, so modeled power per area falls by 20%. The outcome differs from the earlier 0.6 case because both density and per-cell power matter.

For question 4, no. Each full cycle still draws the same capacitive energy. Half as many cycles per second halve that dynamic power contribution, while longer execution can leave more time for leakage energy to accumulate. That tradeoff leads directly to the next lesson.
