---
id: path.integrated-circuit-design
type: path
locale: en
slug: integrated-circuit-design
title: Integrated circuit design — from RTL to timing
summary: Six lessons connect RTL, verification, synthesis, timing, physical design and ASIC/FPGA targets, with scoped exercises.
status: published
updated: 2026-10-26
prerequisites: [path.digital-logic-foundations, path.digital-control-and-datapaths]
steps: [concept.rtl-and-hardware-description, concept.simulation-and-verification, concept.synthesis-and-technology-mapping, concept.static-timing-analysis, concept.physical-design, concept.asic-and-fpga]
related: [path.electronics-and-pcb, path.semiconductor-manufacturing]
sources:
  - title: Yosys documentation — abstraction levels and synthesis flow
    url: https://yosyshq.readthedocs.io/projects/yosys/en/latest/appendix/primer.html
---
## Start with digital behavior

Complete [digital logic foundations](/learn/digital-logic-foundations/) and [digital control and datapaths](/learn/digital-control-and-datapaths/) first. Those routes teach the registers, selectors, arithmetic and clock semantics reused here. This route starts from an accumulator contract and asks how a hardware description, an implementation graph and timing constraints describe different aspects of the same design.

You can follow the reasoning on paper. Executing HDL examples additionally requires a simulator. A source listing, a simulation result, a mapped netlist and a timing report answer different questions; keep that distinction while reading.

## Follow the six lessons

1. **RTL and hardware description:** express a four-bit accumulator in Verilog, distinguish continuous computation from clocked storage and trace two registers that capture old-state values together.
2. **Simulation and verification:** compare against an independent contract, check coverage and distinguish bounded checks from proof.
3. **Synthesis and technology mapping:** understand connected implementation elements, simplify a Boolean expression and compare shared versus duplicated arithmetic without changing the cycle contract.
4. **Static timing analysis:** calculate setup and hold slack from explicit clock edges, including the sign of skew, and explain why reducing frequency does not repair a same-edge hold violation.

5. **Physical design:** place cells, distribute clocks, route connections and revisit timing using extracted wiring.
6. **ASIC and FPGA:** compare implementation resources and calculate a deliberately simplified cost crossover.

The source provides context for moving between representations. The chapters' accumulator, resource costs and timing values are original teaching examples. The lessons teach the complete introductory flow; physical implementation and formal-tool execution are not claimed for the teaching examples.

## Combine behavior and timing

After reset, the RTL accumulator has q = 0000 and prior = 0000. Accept d = 1001 at one enabled edge, then d = 1000 at the next enabled edge, with reset low. Determine q and prior after each edge. Explain why the carry is absent from q and whether this changes if the implementation uses different gates.

Now use an independent fictional register-to-register path with tq_max = 0.4 ns, d_max = 2.8 ns, setup = 0.3 ns, tq_min = 0.1 ns, d_min = 0.05 ns and hold = 0.2 ns. Take zero skew and a 4.0 ns clock period. Calculate setup and hold slack. Does passing the accumulator's functional trace prove this path can operate reliably? Would increasing the period to 5.0 ns fix both checks?

## Answers and boundaries

After the first edge, q = 1001 and prior = 0000. After the second, the full sum is 9 + 8 = 17 = 10001 in binary; q = 0001 and prior = 1001. The contract retains four bits. A functionally equivalent implementation must preserve those externally visible updates, regardless of its internal gate choices.

Latest arrival is 0.4 + 2.8 = 3.2 ns and setup requires arrival by 4.0 - 0.3 = 3.7 ns, giving 0.5 ns setup slack. Earliest new data arrives at 0.1 + 0.05 = 0.15 ns, giving 0.15 - 0.2 = -0.05 ns hold slack. At a 5.0 ns period setup slack becomes 1.5 ns, while hold slack remains -0.05 ns. The functional trace does not establish physical delays or margins.

These timing values are not measurements of the accumulator. Simulation and the integer model also do not establish a mapped implementation, extracted wiring or manufacturing readiness.

## Continue from implementation to architecture

Complete the additional [synchronous interface lesson](/knowledge/digital-logic/synchronous-interfaces/) in the digital-logic continuation, then explore processor architecture. The six IC lessons explain implementation responsibilities; they do not represent a fabricated chip or a completed FPGA deployment. Use the [full computing stack](/knowledge/computing-stack/) to find the published routes.

Continue with [computer architecture](/learn/computer-architecture/) to connect these components and implementation choices to instruction execution, memory and I/O.
