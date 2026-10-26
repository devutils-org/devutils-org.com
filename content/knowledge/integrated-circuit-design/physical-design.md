---
id: concept.physical-design
type: concept
locale: en
slug: physical-design
area: integrated-circuit-design
title: Physical design — placement, clocks, routing and extraction
summary: Turn a netlist into geometry, calculate utilization and wiring effects,
  and distinguish connectivity, geometry and timing checks.
status: published
updated: 2026-10-26
prerequisites:
  - concept.static-timing-analysis
related:
  - path.integrated-circuit-design
sources:
  - title: OpenROAD — physical-design flow, placement, clock tree, routing and
      extraction
    url: https://openroad.readthedocs.io/en/latest/main/README.html
---
## Give the netlist a physical home

[Synthesis](/knowledge/integrated-circuit-design/synthesis-and-technology-mapping/) produces connected implementation elements. Physical design decides where they sit, how they receive power and clocks, and how their connections become metal geometry. The resulting delays and constraints depend on that geometry.

A standard cell is a library component with characterized behavior and a physical layout. A macro is a larger predesigned block, such as a memory. A process design kit, or PDK, supplies process-specific information used by the implementation tools. A netlist alone does not contain a complete manufacturable chip.

The flow below describes common responsibilities rather than one mandatory tool command sequence. Stages interact: routing congestion can require placement changes, and timing repair can add cells that alter area and power.

## Allocate area before placing cells

Floorplanning establishes the die/core geometry, macro positions, interfaces and space for power distribution and routing. Core area is not simply the sum of standard-cell areas. Cells need legal sites and usable connections, and other structures consume or block space.

Define standard-cell utilization for this exercise as total standard-cell area divided by available placement area, excluding macro blockages. If cells occupy 6000 μm² and available area is 10000 μm², utilization is 0.6, or 60%. The remaining 4000 μm² is placement whitespace in this definition, not a guarantee that any routing demand will fit.

| Cell area (μm²) | Available placement area (μm²) | Utilization (%) |
| --- | --- | --- |
| 6000 | 10000 | 60 |
| 6000 | 8000 | 75 |
| 7000 | 10000 | 70 |

Increasing utilization can reduce area but makes placement and routing more constrained. Two layouts with the same area ratio can have different congestion because connectivity and macro locations differ. Always state which area is the denominator when comparing reports.

## Place, legalize and distribute the clock

Global placement seeks suitable locations while optimizing objectives such as estimated wire length and timing. Detailed placement legalizes the result against rows, sites and overlap rules. Legal placement is necessary, but does not establish a good clock or completed wiring.

Clock-tree synthesis inserts and sizes distribution elements so that many sequential endpoints receive the clock under specified constraints. Clock latency is the delay from a reference point to an endpoint. Skew is a difference between endpoint arrival times. They are related but distinct: two equally delayed clocks have zero relative skew despite nonzero latency.

The [timing lesson](/knowledge/integrated-circuit-design/static-timing-analysis/) shows why skew signs matter. A later capture edge can help a setup check while making a same-edge hold check harder. “Minimize all delay” is therefore not a sufficient implementation strategy.

## Route and extract the connections

Global routing assigns approximate routing resources and paths. Detailed routing produces legal wire and via geometry. Extraction estimates parasitic resistance and capacitance from that implementation so that timing analysis can use a more realistic interconnect model.

For an independent timing budget, stipulate clock-to-q maximum 0.3 ns, logic maximum 1.2 ns, setup 0.2 ns, period 2.0 ns and zero skew. Before adding wire delay, setup slack is 2.0 − 0.2 − 0.3 − 1.2 = 0.3 ns.

If extracted wiring adds 0.4 ns to the data path, slack becomes −0.1 ns. The logic function is unchanged, but the path no longer meets this setup requirement. At period 2.2 ns the same path has 0.1 ns setup slack. That does not prove hold timing or every other path passes.

Optimization might buffer a long connection, change cell sizes or alter placement. Each action has tradeoffs and must be rechecked. A larger driver can reduce one delay while adding input capacitance to its predecessor.

## Separate different completion checks

Design-rule checking, DRC, compares physical geometry with process rules. Layout-versus-schematic checking, LVS, compares extracted electrical connectivity with the intended circuit. Timing analysis checks temporal constraints using libraries, clocks and interconnect models.

Power distribution needs its own analysis. If an abstract supply path has 0.1 Ω resistance and carries 0.2 A, its DC drop is 0.02 V. That arithmetic is one element of a power-integrity problem, not an assessment of an actual chip's grid. Current distribution, switching demand and reliability constraints need appropriate models.

Passing one check does not imply the others. Correct connectivity can still violate spacing. DRC-clean wiring can still miss timing. A functional simulation can still omit uninitialized behavior or an incorrect interface assumption. Final verification combines evidence with explicit scope rather than treating a generated layout file as automatic signoff.

## Exercises and explained answers

1. Cells occupy 4500 μm² at a target utilization of 75%. What available area does that imply? Divide 4500 by 0.75 to obtain 6000 μm². This excludes whatever the utilization definition excluded.
2. With the stated 2 ns timing budget, what wire delay leaves exactly zero setup slack? The initial 0.3 ns slack permits 0.3 ns of added wire delay under these assumptions.
3. Does increasing period repair a same-edge hold failure? No: the hold check depends on the early-data path and relative clock arrivals, not the next full period.
4. Does LVS prove that the placed implementation reaches a requested frequency? No. It checks correspondence of connectivity; timing requires additional models and constraints.

Physical design connects the electrical structures from the manufacturing chapters to the logical behaviors introduced by RTL. It explains why an implementation can preserve a function while changing its speed, area and power substantially.
