---
id: path.computer-architecture
type: path
locale: en
slug: computer-architecture
title: Computer architecture — from instructions to parallel systems
summary: "The ninth computing-stack domain: six lessons on ISA, execution,
  pipelines, caches, buses and CPU/GPU parallelism with traced programs and
  worked exercises."
status: published
updated: 2026-10-26
prerequisites:
  - path.digital-logic-foundations
  - path.digital-control-and-datapaths
related:
  - path.integrated-circuit-design
steps:
  - concept.isa-and-microarchitecture
  - concept.instruction-execution
  - concept.pipelines-and-hazards
  - concept.caches-and-memory-hierarchy
  - concept.buses-and-io
  - concept.cpu-and-gpu-parallelism
sources:
  - title: RISC-V ratified specification — RV32I base integer ISA, version 2.1
    url: https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html
  - title: MIT Computation Structures — 13.1, Building the Beta, datapath and
      instruction execution
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/c13s1/
  - title: MIT Computation Structures — 14.1, Caches and the Memory Hierarchy
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/c14s1/
  - title: MIT Computation Structures — 15.1, Pipelining the Beta, data and control
      hazards
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c15/c15s1/
  - title: NVIDIA CUDA Programming Guide — Programming Model, blocks, grids, warps
      and SIMT
    url: https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html
---
## Give the datapath an instruction contract

This ninth domain follows [digital logic foundations](/learn/digital-logic-foundations/) and [digital control and datapaths](/learn/digital-control-and-datapaths/). Those lessons establish arithmetic, storage, state machines and accepted transfers. The [IC-design route](/learn/integrated-circuit-design/) explains implementation; it is useful context rather than a requirement to run a synthesis tool before understanding an instruction.

The architecture lessons are in English and can be followed on paper. Start from what the software-visible machine must do, then explore how implementation choices change time, resource use and data movement.

## Follow the six lessons

1. **ISA and microarchitecture:** distinguish the architectural contract from the implementation, introduce RV32I and x86-64 context, and calculate instruction-count/CPI/frequency time.
2. **Instruction execution:** run a fully specified eight-bit teaching machine through loads, arithmetic, a store and a branch.
3. **Pipelines:** overlap stages while preserving dependencies, and count fill, drain and lost cycles.
4. **Caches:** split addresses, trace hits and conflict misses, and keep additional miss penalty distinct from complete miss time.
5. **Buses and I/O:** distinguish memory and device operations, calculate burst payload and reason about completion and shared access.
6. **CPU and GPU parallelism:** account for serial work, active lanes, memory traffic and transfer overhead.

These lessons use original teaching values and a toy instruction listing whose semantics are explicitly separate from real ISA encodings. A mathematical processor trace is not a fabricated core or an execution benchmark.

## Combine execution and a memory trace

Run the instruction-execution listing with memory[20] = 6 and memory[21] = 0. What is stored, is the branch taken and what is R1 when execution halts?

Independently, use the four-line, four-byte direct-mapped cache from the cache lesson. Start empty and read byte addresses 0, 1, 4, 0, 16, 0. Count misses and total serialized time with 1 ns lookup plus 20 ns additional miss penalty.

For a separate ideal three-stage pipeline, count cycles for 20 independent instructions with no stalls. At 10 ns per cycle, find elapsed time. Finally, compare a 10 ms CPU task with an accelerator whose kernel takes 2 ms and serialized transfer/setup takes 3 ms.

## Explain the combined answer

The toy ADD retains (250 + 6) modulo 256 = 0. STORE writes zero, BNZ is not taken and slot 5 sets R1 to 99 before HALT. Seven instructions execute including HALT. A branch tests the stored bit pattern rather than the unbounded mathematical sum.

The cache trace has four misses and two hits. Serialized time is 6 × 1 + 4 × 20 = 86 ns. Address 16 and address 0 compete for line zero, so the last access misses even though the cache has unused lines.

The ideal pipeline takes 20 + 3 − 1 = 22 cycles, or 220 ns. The separate accelerator comparison totals 2 + 3 = 5 ms, so end-to-end speedup is 10/5 = 2. Kernel-only speedup would answer a different question.

## Continue toward firmware

Continue with [firmware and embedded](/learn/firmware-and-embedded/) to apply these instruction, memory and I/O contracts to startup and peripherals. You should now be able to explain why a faster clock does not guarantee a faster task, why a cache hit rate does not describe every workload and why an accepted I/O write may still await its physical effect. The [computing stack](/knowledge/computing-stack/) links the next available route.
