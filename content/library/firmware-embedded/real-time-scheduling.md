---
id: concept.real-time-scheduling
type: concept
locale: en
slug: real-time-scheduling
area: firmware-embedded
title: Real-time scheduling — ready tasks, deadlines and interference
summary: Trace a preemptive schedule, calculate scoped response times and
  distinguish utilization, blocking and synchronization.
status: published
updated: 2026-10-26
prerequisites:
  - concept.interrupts-and-drivers
  - concept.dma-and-buffer-ownership
related:
  - path.firmware-and-embedded
sources:
  - title: Zephyr — Scheduling, ready threads, preemption and context switches
    url: https://docs.zephyrproject.org/latest/kernel/services/scheduling/index.html
  - title: FreeRTOS/AWS documentation — Intertask coordination, queues, mutexes and
      inheritance
    url: https://docs.aws.amazon.com/freertos/latest/userguide/inter-task-coordination.html
---
## Define the deadline before saying fast

A real-time requirement ties correct behavior to time. A computation can produce the right value too late. Conversely, a system need not have high average throughput to meet a small set of bounded deadlines.

An RTOS provides scheduling, synchronization and other services useful for structuring concurrent embedded work. It does not automatically prove that an application meets its deadlines. Execution bounds, interrupt interference, blocking, release patterns and platform behavior must be considered together.

A task can be ready to run, running, or blocked waiting for an event or timeout. On one core, one ordinary task executes at a time. A blocked task does not keep consuming CPU merely to check its condition; a busy-polling task does.

## State the scheduler used by the example

Use a single-core, fully preemptive, fixed-priority teaching scheduler. Task A has higher priority than B. A releases every 5 ms and needs 1 ms execution per job. B releases every 10 ms and needs 2 ms. Both release at time zero, deadlines equal periods, and there is no blocking, interrupt work or switching overhead.

| Interval (ms) | Running work |
| --- | --- |
| 0–1 | A job 1 |
| 1–3 | B job 1 |
| 3–5 | idle |
| 5–6 | A job 2 |
| 6–10 | idle |

At 10 ms both tasks release again and this pattern repeats. A's response time is 1 ms; B's is 3 ms from its zero-time release to completion at 3 ms. Both meet their deadlines in this model.

Utilization is 1/5 + 2/10 = 0.4, or 40%. That leaves average capacity, but utilization below 100% alone does not prove every possible task set, priority assignment or deadline is feasible.

## Calculate interference explicitly

For a lower-priority task with execution C, blocking B and higher-priority periodic tasks i, a common fixed-priority response-time model iterates:

~~~text
Rnext = C + B + sum(ceil(R / Ti) × Ci)
~~~

This model assumes the stated independent periodic tasks, fixed priorities and suitable worst-case execution bounds, without unmodeled release jitter or overhead. The ceiling counts higher-priority jobs that can interfere in the response window. Do not use the formula blindly for a different scheduler or blocking scheme.

For task B above, with C = 2, blocking zero and task A's C = 1, T = 5, start R = 2. The next value is 2 + ceil(2/5) × 1 = 3. Repeating gives 3 again, a fixed point consistent with the trace.

Add 4 ms of bounded blocking to B. Start at 6 ms; the next value is 2 + 4 + ceil(6/5) × 1 = 8 ms. Repeating gives 8 ms, still within B's 10 ms deadline under this revised model. The original trace no longer describes this blocked case.

## Synchronize without unbounded surprises

A mutex protects a shared resource by ownership: a task takes it, uses the resource and releases it. Priority inversion occurs when a high-priority task waits for a resource held by a lower-priority one, possibly while unrelated medium-priority work delays the holder.

Priority inheritance can temporarily raise the holder's effective priority so it can finish the critical work and release the resource. It mitigates a particular interference pattern; it does not remove every blocking source, prevent all deadlocks or guarantee deadlines.

A classic deadlock has task X holding lock L1 while waiting for L2, and task Y holding L2 while waiting for L1. A consistent lock order can prevent that particular cycle. Timeouts can help recovery only if timeout paths correctly release resources and preserve state.

Queues and notifications can communicate work without sharing every mutable variable. Passing a pointer through a queue does not copy the pointed-to payload or extend its lifetime automatically. The buffer-ownership rules from DMA still apply.

## Keep interrupt context and task context distinct

An ordinary task mutex is not an ISR waiting mechanism. A handler cannot block waiting for another task to release a resource while preventing that task from running. Use permitted interrupt-safe operations and defer work to a task where appropriate.

A high-priority task that polls forever can starve lower-priority tasks. Raising priority is not a substitute for making work bounded and waiting efficiently. Task priority numbering also varies by runtime; state urgency in words before translating it into a configuration value.

An RTOS tick is a timekeeping and scheduling mechanism, not a guarantee that every event is handled exactly on a tick. Event-driven preemption, timer resolution and hardware interrupts need their documented semantics.

## Exercises and explained answers

1. A task uses 2 ms every 8 ms. What fraction of one CPU is that? 2/8 = 25%, before other work or overhead.
2. In the response model, let B need 3 ms, blocking be 1 ms, and higher-priority A need 1 ms every 5 ms. Starting R = 4 gives 5, and the next iteration remains 5. A 6 ms deadline is met under the supplied assumptions.
3. Does 40% utilization prove a 0.5 ms deadline for task A whose execution alone takes 1 ms? No. Its own execution exceeds the deadline even on an otherwise idle core.
4. Why not busy-poll a queue from the highest-priority task? Remaining runnable can prevent the lower-priority producer from ever running. Blocking on the event allows the producer to make progress.

Real-time engineering asks for justified bounds and a complete scheduling contract. Typical measurements are useful evidence, but cannot replace the assumptions needed for a worst-case claim.
