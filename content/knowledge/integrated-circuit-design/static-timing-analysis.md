---
id: concept.static-timing-analysis
type: concept
locale: en
slug: static-timing-analysis
area: integrated-circuit-design
title: Static timing analysis
summary: Calculate setup and hold slack for a clocked path, derive the effect of skew and distinguish timing constraints from functional simulation.
status: published
updated: 2026-10-26
prerequisites: [concept.rtl-and-hardware-description, concept.synthesis-and-technology-mapping]
related: [concept.sequential-logic]
sources:
  - title: MIT Computation Structures — Timing in a Single-clock System
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/
  - title: OpenSTA — inputs, clock constraints and timing reports
    url: https://openroad.readthedocs.io/en/latest/main/src/sta/README.html
---
## Correct values must arrive at the right time

A combinational function can calculate the correct Boolean answer and still deliver it too late for a receiving register. Static timing analysis (STA) analyzes timing paths using a netlist, cell timing models, interconnect information and constraints. It does not need a particular sequence of functional test vectors to ask whether the modeled paths meet those constraints.

Begin with the clocked registers in [RTL](/knowledge/integrated-circuit-design/rtl-and-hardware-description/). One register launches data; logic and wires carry it to another register that captures it. We analyze a same-frequency, rising-edge, single-cycle path. Other clock relationships require their own constraints.

## Establish the edge references

Put the launch clock edge at time 0. Let T be the clock period. Define skew s as capture-clock arrival minus launch-clock arrival for corresponding edges. Thus the corresponding capture edge is at s, and its next edge is at T + s. Positive s means the capture clock arrives later.

Use separate maximum and minimum delays. Let tq_max and tq_min bound the launch register's clock-to-Q delay. Let d_max and d_min bound the combinational and wire delay. The receiving register requires setup time ts before capture and hold time th after capture. All quantities below use nanoseconds.

For the next edge's setup check:

```text
latest data arrival = tq_max + d_max
required arrival = T + s - ts
setup slack = required arrival - latest data arrival
```

For the same edge's hold check:

```text
earliest new data arrival = tq_min + d_min
required old-data stability = s + th
hold slack = earliest new data arrival - required old-data stability
```

Nonnegative slack satisfies that inequality in this simplified model. Positive skew helps setup by delaying the next capture edge, but hurts hold by demanding old data remain stable longer. These signs follow from our explicit edge references; never import a skew formula without its sign convention.

## Work both checks

Take fictional values tq_max = 0.4, d_max = 2.8, ts = 0.3, tq_min = 0.1, d_min = 0.05 and th = 0.2. First choose T = 4.0 and s = 0.

```text
latest arrival = 0.4 + 2.8 = 3.2 ns
setup required = 4.0 - 0.3 = 3.7 ns
setup slack = 3.7 - 3.2 = 0.5 ns

earliest arrival = 0.1 + 0.05 = 0.15 ns
hold required = 0.2 ns
hold slack = 0.15 - 0.2 = -0.05 ns
```

Setup passes while hold fails. Increasing T to 5.0 improves setup slack to 1.5 ns but leaves hold slack at -0.05 ns. Slowing the clock does not fix this same-edge hold problem.

Suppose a hypothetical delay element adds 0.1 ns to both minimum and maximum path delay. Then earliest arrival becomes 0.25 ns and latest arrival becomes 3.3 ns. At T = 4.0, s = 0, hold slack becomes 0.05 ns and setup slack becomes 0.4 ns. This repairs both inequalities for this one fictional path; an actual change requires recomputation across affected paths and corners.

| Period T (ns) | Skew s (ns) | Added delay (ns) | Setup slack (ns) | Hold slack (ns) |
|---|---|---|---|---|
| 4.0 | 0.0 | 0.0 | 0.50 | -0.05 |
| 5.0 | 0.0 | 0.0 | 1.50 | -0.05 |
| 4.0 | 0.0 | 0.1 | 0.40 | 0.05 |
| 4.0 | 0.1 | 0.1 | 0.50 | -0.05 |

The last row demonstrates why a previously repaired hold path must be checked again after clock-tree changes.

## Know what a report depends on

Real timing analysis includes input/output relationships, clock uncertainty, generated clocks, loading, slew, extracted parasitics and process/voltage/temperature models. The simplified arithmetic above omits these effects. An unmodeled or unconstrained path is not evidence of a passing path.

A false-path exception tells the analyzer to exclude a path under a functional justification. A multicycle exception changes which edges relate. Neither should be added merely to hide a violation. The design's behavior must justify the exception, and the corresponding minimum-delay requirements still need correct treatment.

OpenSTA accepts common design and timing formats and provides reports through Tcl. This chapter has not run OpenSTA or measured cells. Its executable evidence reproduces the timing arithmetic and sign convention only. Functional equivalence, metastability analysis and timing signoff are separate tasks.

## Exercises and answers

1. With no added delay and s = 0, what is the minimum period allowed by setup alone? T >= 0.4 + 2.8 + 0.3 = 3.5 ns. Hold still fails, so that is not a working-frequency guarantee.
2. With the added 0.1 ns and s = -0.1 ns, setup slack is 0.3 ns and hold slack is 0.15 ns at T = 4.0. Earlier capture hurts setup and helps hold under this convention.
3. Does a zero-delay HDL simulation passing every functional test establish these timing margins? No. It does not supply the modeled cell and wire delays or timing constraints used in these checks.

Placement, clock-tree construction and routing change the path delays and skew. Timing must therefore be revisited as the design becomes physically concrete.
