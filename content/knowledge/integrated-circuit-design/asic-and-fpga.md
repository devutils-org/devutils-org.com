---
id: concept.asic-and-fpga
type: concept
locale: en
slug: asic-and-fpga
area: integrated-circuit-design
title: ASIC and FPGA — target resources and implementation choices
summary: Understand LUTs, registers and dedicated resources, compare a scoped
  cost model and separate configuration from fabrication.
status: published
updated: 2026-10-26
prerequisites:
  - concept.physical-design
  - concept.synthesis-and-technology-mapping
related:
  - path.integrated-circuit-design
sources:
  - title: AMD UG474 — 7 Series configurable logic block overview
    url: https://docs.amd.com/r/en-US/ug474_7Series_CLB/CLB-Overview
  - title: OpenROAD — physical-design flow, placement, clock tree, routing and
      extraction
    url: https://openroad.readthedocs.io/en/latest/main/README.html
---
## Distinguish the function from its implementation fabric

An application-specific integrated circuit, ASIC, implements a chosen design using a fabrication flow and technology-specific cells or custom structures. A field-programmable gate array, FPGA, contains manufactured configurable resources whose connections and functions are selected after fabrication.

An FPGA is itself an integrated circuit manufactured in a semiconductor process. Configuring one does not fabricate new transistors. Conversely, calling a chip an ASIC does not mean it contains no programmable processors, firmware or configurable functions. The distinction concerns the implementation approach, not a rule that one system can never change behavior.

Both approaches can begin with an HDL description, undergo functional checks and require constraints and physical implementation. Their target resources and deliverables differ. An ASIC flow ultimately supports fabricated geometry; an FPGA flow produces device-specific configuration data for an already fabricated part.

## Understand what a lookup table does

A lookup table, LUT, can implement a Boolean function by storing its output for each input combination. A k-input, one-output LUT has 2^k truth-table entries. For two inputs A and B, order addresses as 00, 01, 10, 11. The function A XOR B stores 0, 1, 1, 0.

| Inputs k | Truth-table entries | Bits for one output |
| --- | --- | --- |
| 2 | 4 | 4 |
| 3 | 8 | 8 |
| 4 | 16 | 16 |
| 6 | 64 | 64 |

These counts describe the Boolean truth table, not a complete FPGA configuration bit count. Routing switches, operating modes and other resources also need configuration, and a physical LUT architecture can support multiple modes.

Registers provide state, carry structures accelerate common arithmetic patterns, and dedicated memory or arithmetic blocks can implement functions more efficiently than general LUT networks. Available resources depend on the chosen family. A vendor's six-input LUT description is an example, not a universal promise about every FPGA.

## Map a design instead of counting source operators

Suppose a contract requires 256 words of 16-bit storage. Payload capacity is 4096 bits, or 512 bytes. An FPGA implementation might use a dedicated memory block, distributed memory or registers, depending on port requirements, timing, initialization and available resources.

An ASIC implementation might use a memory macro rather than thousands of individually placed flip-flops. The abstract payload count is shared; physical area and power are not obtained by multiplying it by an arbitrary “bit cost.” A memory with two independently addressed ports can have different implementation requirements from one with a single port.

Likewise, one plus sign in HDL does not imply a particular physical adder. Synthesis can share arithmetic, use dedicated carry logic or optimize constant operations. The [synthesis lesson](/knowledge/integrated-circuit-design/synthesis-and-technology-mapping/) explains why an implementation graph, rather than source-line count, is the useful comparison.

## Compare economics with stated assumptions

A simple break-even model separates one-time engineering cost from per-unit cost. Let total cost equal fixed cost plus unit count N times unit cost. Use arbitrary teaching amounts: ASIC fixed cost 100000 and unit cost 5; FPGA fixed cost 10000 and unit cost 20.

Set the totals equal:

~~~text
100000 + 5N = 10000 + 20N
90000 = 15N
N = 6000
~~~

At 6000 units both modeled totals are 130000. Below that count the FPGA expression is cheaper; above it the ASIC expression is cheaper. These supplied numbers are not quotations, current market prices or a recommendation for a real project.

The model omits development time, validation, manufacturing risk, inventory, packaging, support, redesign and product requirements. A cost crossover cannot establish timing feasibility, available interfaces or a suitable power budget. It only answers the specific arithmetic comparison that was written down.

## Keep timing and reconfiguration concrete

An FPGA still has finite routing delay, clock distribution and electrical limits. Passing simulation does not establish that placement and routing meet the requested frequency. ASIC timing likewise depends on the implementation, process conditions and constraints.

Reconfiguration can be useful for development or field updates, but its exact availability, persistence, interruption and security properties are device-specific. Some systems must load configuration during startup; others store it differently. Avoid assuming every FPGA powers up immediately executing the same configured circuit without a documented boot arrangement.

An ASIC may offer better efficiency for a particular function, while an FPGA can offer flexibility and lower initial implementation commitment. Neither statement proves a winner for every workload. Compare a specified function, throughput, latency, interfaces, volume and lifecycle.

## Exercises and explained answers

1. How many truth-table bits implement an arbitrary five-input, one-output Boolean function? There are 2^5 = 32 input combinations, so 32 output bits.
2. What payload capacity is in 128 words of 32 bits? It is 4096 bits, again 512 bytes. Equal payload does not establish equal port behavior or layout.
3. With the cost model above, compare 1000 units. ASIC total is 105000 and FPGA total is 30000. This conclusion belongs to the supplied cost assumptions.
4. Does configuration change the underlying number of fabricated LUTs? No. It selects behavior and connectivity from the manufactured resource set.

The practical sequence is to specify behavior, choose an appropriate target, map the design, implement it and check the result. The target decision changes the available resources and constraints, not the need to establish correctness.
