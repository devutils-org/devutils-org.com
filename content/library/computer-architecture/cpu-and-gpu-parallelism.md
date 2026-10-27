---
id: concept.cpu-and-gpu-parallelism
type: concept
locale: en
slug: cpu-and-gpu-parallelism
area: computer-architecture
title: CPU and GPU parallelism — useful work, bandwidth and overhead
summary: Compare data-parallel execution, lane utilization and scoped scaling
  limits using end-to-end work and traffic.
status: published
updated: 2026-10-26
prerequisites:
  - concept.pipelines-and-hazards
  - concept.caches-and-memory-hierarchy
  - concept.buses-and-io
related:
  - path.computer-architecture
sources:
  - title: NVIDIA CUDA Programming Guide — Programming Model, blocks, grids, warps
      and SIMT
    url: https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html
---
## Match parallel work to the machine

A CPU is commonly organized to execute general-purpose instruction streams with strong single-thread responsiveness and complex control handling. A GPU provides many execution resources aimed at high throughput across parallel work. These are broad design tendencies, not guarantees that every CPU is sequential or every GPU wins every computation.

CPUs can have multiple cores and vector instructions. GPUs also execute instructions, access memory and manage dependencies. Compare a workload's parallelism, data layout, transfer costs and latency requirements instead of counting “cores” across unlike organizations.

The [pipeline](/library/computer-architecture/pipelines-and-hazards/) and [cache](/library/computer-architecture/caches-and-memory-hierarchy/) lessons explain why available arithmetic units can sit idle while waiting for operands or control decisions.

## Separate tasks, data parallelism and dependencies

Task parallelism runs different pieces of work concurrently. Data parallelism applies similar operations to many data elements. A vector addition has obvious independent output elements; a linked traversal in which every next address depends on the previous load exposes less independent work.

In CUDA, threads are organized into blocks and grids. A thread block is assigned to a streaming multiprocessor, subject to available resources. The programming model provides ways for threads within a block to cooperate; block execution order must not be assumed unless an appropriate mechanism explicitly guarantees it.

A CUDA warp groups 32 threads. In SIMT execution, lanes may follow different control paths, with subsets active for different instructions. Branch divergence can reduce useful lane utilization. It does not mean every thread on a GPU always executes a different instruction simultaneously, or that every processor family uses CUDA's exact group size.

## Count useful lane work

Use an abstract eight-lane execution group to make a smaller example. Four lanes take branch A and four take branch B. Suppose both branch bodies contain ten lane-instructions and the model serially issues each body with only its participating lanes active.

The group issues 20 instruction steps with eight lane positions each, giving 160 available lane-step positions. Useful work is 4 × 10 + 4 × 10 = 80 lane-steps. Utilization in this stipulated branch-body model is 80/160 = 50%.

This is not a GPU timing prediction: it excludes branch handling, scheduling, memory stalls and other instructions. Its purpose is to distinguish issued group work from useful work by active lanes. If all eight lanes take the same ten-step body, useful work is 80 out of 80 lane-step positions, or 100% for that body.

## Include serial work and overhead

If a fraction s of a workload cannot be parallelized and the rest scales perfectly over p workers, the normalized time model is s + (1 − s)/p. Speedup is the reciprocal, assuming no added overhead.

For s = 0.1 and p = 4, normalized time is 0.1 + 0.9/4 = 0.325 and ideal speedup is approximately 3.077. As p grows without bound, the serial fraction leaves a speedup ceiling of 10 in this model.

| Workers | Serial fraction | Normalized time | Ideal speedup |
| --- | --- | --- | --- |
| 1 | 0.1 | 1 | 1 |
| 2 | 0.1 | 0.55 | 1.818182 |
| 4 | 0.1 | 0.325 | 3.076923 |
| 8 | 0.1 | 0.2125 | 4.705882 |

Add transfer or launch overhead before comparing a CPU and accelerator. If a CPU task takes 10 ms, a hypothetical accelerator kernel takes 2 ms and transfer/setup takes 3 ms, end-to-end time is 5 ms and speedup is 2, not 5. Small tasks may spend most of their time outside the kernel.

## Relate arithmetic to memory traffic

Arithmetic intensity is useful operations divided by bytes transferred at a stated level of the memory system. If a model performs two operations for every eight bytes moved, intensity is 0.25 operations/byte.

At an available bandwidth of 100 GB/s, that traffic requirement supports at most 25 billion operations/s under the model. A nominal arithmetic capacity of 100 billion operations/s cannot be sustained unless data reuse or traffic changes, even before other bottlenecks are considered.

Be explicit about which operations and transfers are counted. Bytes fetched from device memory differ from bytes crossing a CPU-to-device link, and cached reuse changes those counts. Floating-point operation conventions also matter. The arithmetic is a throughput bound, not an assurance that the bound is reached.

## Exercises and explained answers

1. With serial fraction 0.2 and four ideal workers, what speedup results? Normalized time is 0.2 + 0.8/4 = 0.4, so speedup is 2.5.
2. A kernel takes 1 ms but requires 5 ms of additional serialized setup and transfer. Compare with a 12 ms CPU task. Total is 6 ms and end-to-end speedup is 2.
3. A workload uses 16 bytes for four useful operations at a 40 GB/s traffic limit. What is the traffic-based throughput ceiling? Intensity is 0.25 operations/byte, giving 10 billion operations/s.
4. Does twice as many named execution units imply twice the task speed? No. Serial work, active lanes, memory bandwidth, synchronization and overhead can limit scaling.

Architecture connects the instruction contract to implementation and workload. Firmware now brings these ideas to peripherals, startup sequences and time-sensitive interaction with a physical system.
