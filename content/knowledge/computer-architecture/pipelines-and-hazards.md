---
id: concept.pipelines-and-hazards
type: concept
locale: en
slug: pipelines-and-hazards
area: computer-architecture
title: Pipelines and hazards — overlap, dependencies and penalties
summary: Trace pipeline stages, distinguish latency from throughput and budget
  stalls without changing architectural behavior.
status: published
updated: 2026-10-26
prerequisites:
  - concept.instruction-execution
  - concept.synchronous-interfaces
related:
  - path.computer-architecture
sources:
  - title: MIT Computation Structures — 15.1, Pipelining the Beta, data and control
      hazards
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c15/c15s1/
---
## Overlap work without changing the program

Pipelining divides instruction processing into stages separated by registers. Different instructions occupy different stages simultaneously. The goal is often to increase throughput, the rate of completed instructions, while preserving the ISA's required behavior.

Imagine three stages: fetch F, execute E and commit W. W is the stage that makes the instruction's architectural result visible in this toy model. Assume each stage takes one cycle and all instructions in the first example are independent, with no stalls or resource conflicts.

| Cycle | F | E | W |
| --- | --- | --- | --- |
| 1 | I1 | empty | empty |
| 2 | I2 | I1 | empty |
| 3 | I3 | I2 | I1 |
| 4 | I4 | I3 | I2 |
| 5 | empty | I4 | I3 |
| 6 | empty | empty | I4 |

Four instructions complete in six cycles. The first takes three cycles to traverse the pipeline, while subsequent instructions complete one cycle apart. Individual latency and steady-state throughput are not the same quantity.

## Count fill and drain time

For N independent instructions in an ideal k-stage, one-instruction-per-cycle pipeline, the cycle count is N + k − 1. With N = 20 and k = 3, it is 22 cycles. A nonoverlapped implementation using the same three one-cycle steps per instruction would take 60 cycles.

At a stipulated 10 ns cycle, those totals are 220 ns and 600 ns, yielding speedup 60/22, approximately 2.727. The three-stage ratio is approached for a long stream; it is not reached for every finite sequence.

This comparison assumes the same cycle duration and comparable work. Real stage partitioning includes register overhead, unbalanced stage delays and different clock constraints. Adding stages does not automatically divide the cycle time by their count.

## Preserve data dependencies

Suppose I1 computes R1 = R2 + R3, while I2 computes R4 = R1 + R5. I2 needs the new R1 produced by I1. If I2 reads an old register value before I1 commits, the resulting execution is incorrect.

A data dependency is a fact about the program. A data hazard occurs when the implementation's overlap makes that dependency unsafe. Solutions include stalling until the needed value is available or forwarding it from an earlier pipeline stage.

Forwarding does not make an unavailable value appear. A load whose memory result arrives late may still require a stall before an immediate consumer can use it. Exact stall counts depend on the stage organization and where operands are required. Avoid applying one processor's “one bubble” rule to every pipeline.

A stall holds relevant work while older work progresses. A bubble represents an empty or harmless operation in a stage. Control logic must prevent a stalled instruction from accidentally writing its result twice or a bubble from changing architectural state. The [synchronous interface lesson](/knowledge/digital-logic/synchronous-interfaces/) supplies the same accepted-transfer reasoning for elastic pipelines.

## Resolve control hazards

A branch may change which instruction should be fetched next. If its outcome is not yet known, the processor can wait or predict a path. When a prediction is wrong, younger work from the wrong path must not commit architectural effects.

In a deliberately simple performance model, take 100 instructions, a three-stage ideal pipeline and five independent branch mispredictions, each adding two lost cycles. Total cycles are 100 + 2 + 5 × 2 = 112. Effective CPI over this finite run is 1.12, including fill and drain.

This arithmetic assumes penalties do not overlap and that there are no other stalls. A measured CPI could include cache misses, data hazards, resource conflicts and many additional effects. A branch-misprediction rate alone is therefore insufficient to predict execution time without its penalty and other conditions.

Speculative execution raises a correctness requirement: work can begin before its outcome is certain, but irreversible architectural changes must respect the machine's rules. Full exception recovery and speculative side effects require more detail than this introductory pipeline.

## Recognize structural conflicts

A structural hazard occurs when simultaneous operations need a resource that cannot serve them all. For example, one memory port might not support both instruction fetch and a data access in the same cycle. The design can stall, add ports, separate resources or otherwise schedule access.

Hardware replication can improve overlap but costs area and power. Sharing a resource can reduce hardware while limiting throughput. This is the same resource-versus-latency tradeoff introduced during synthesis, now applied to instruction execution.

Frequency, CPI and instruction count must all be considered. A pipeline running twice as fast but requiring more than twice the cycles for a workload can be slower overall. Compare completed work rather than counting stages or quoting a clock alone.

## Exercises and explained answers

1. How many cycles complete eight independent instructions in the ideal three-stage model? 8 + 3 − 1 = 10 cycles, including filling and draining.
2. For 50 instructions, add four nonoverlapping three-cycle penalties. What total results? 50 + 2 + 12 = 64 cycles, or finite-run CPI 1.28.
3. Does forwarding remove the program's dependency? No. It supplies the required new value sooner through another path; the consumer still depends on that value.
4. Why flush a wrong-path store before it commits? Otherwise the implementation changes memory for an instruction that should not execute, violating the architectural program order and branch behavior.

A pipeline is an organization of work, not a new meaning for each instruction. The next layer, the memory hierarchy, changes how quickly operands arrive and therefore how often a pipeline can actually progress.
