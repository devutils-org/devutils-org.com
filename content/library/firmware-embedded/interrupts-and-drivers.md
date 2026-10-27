---
id: concept.interrupts-and-drivers
type: concept
locale: en
slug: interrupts-and-drivers
area: firmware-embedded
title: Interrupts and drivers — response, context and shared state
summary: Budget event-to-handler latency, separate device flags from controller
  state and preserve driver lifetime across concurrent completion paths.
status: published
updated: 2026-10-26
prerequisites:
  - concept.reset-and-boot
  - concept.microcontrollers-and-mmio
related:
  - path.firmware-and-embedded
sources:
  - title: Arm CMSIS-Core — NVIC, enabling, pending state and interrupt priority
    url: https://arm-software.github.io/CMSIS_6/latest/Core/group__NVIC__gr.html
  - title: Zephyr — Interrupts, handler context and offloading work
    url: https://docs.zephyrproject.org/latest/kernel/services/interrupts.html
---
## Let hardware request attention

An interrupt allows an event to request processor attention without requiring continuous application polling. The processor's exception mechanism transfers control to a handler under defined rules, then returns to interrupted execution or a scheduler-selected context.

An event becoming pending is not the same as its handler starting immediately. Masking, priority, higher-priority work, entry overhead and memory behavior can delay service. Disabling interrupts does not necessarily stop a peripheral from producing data or setting flags.

A driver turns a device's register protocol into an interface used by the rest of the program. It must handle initialization, normal operations, completion, error paths and shutdown under the actual peripheral and concurrency rules. A handler is often part of a driver, not the whole driver.

## Distinguish the peripheral and interrupt controller

A peripheral status flag records a device condition. An interrupt controller tracks pending and enabled interrupt requests and selects service according to its configuration. Clearing one layer does not automatically acknowledge the other.

For a level-triggered condition, returning without removing or handling the underlying cause can immediately request service again. For an event counter or FIFO, acknowledging one event may leave more work pending. The correct sequence comes from the peripheral documentation, not a universal “clear every flag first” recipe.

CMSIS NVIC functions illustrate distinct actions such as enabling an IRQ, checking pending state and setting priority. On Cortex-M, smaller numerical priority values represent higher urgency, with the implemented bits and grouping depending on the target. That numeric convention must not be assumed for every RTOS task or interrupt architecture.

## Budget latency and service separately

Use a serialized teaching timeline: an event occurs at 10 μs, interrupts are masked until 14 μs, entry consumes 1 μs, the handler's urgent work takes 2 μs, and deferred processing takes a further 5 μs with no interference.

| Event | Time (μs) |
| --- | --- |
| Hardware event | 10 |
| Masking ends | 14 |
| Handler starts | 15 |
| Urgent handler work ends | 17 |
| Deferred work ends | 22 |

Event-to-handler-start latency is 5 μs. Event-to-urgent-completion is 7 μs. Full completion is 12 μs after the event. Each number answers a different question. Calling the 2 μs handler duration “interrupt latency” would hide most of the response delay.

Real worst-case analysis must include every relevant interference source and execution bound. A measured average from a quiet run cannot establish the maximum under all supported loads.

## Keep the handler bounded

A short handler can capture minimal status, acknowledge correctly and wake a task or main-loop worker. Deferred work can then perform slower processing in a context that allows it. This separation reduces the time during which urgent work blocks other activity.

Do not call an operation that may sleep from a context where sleeping is forbidden. Interrupt-safe APIs are different from ordinary task APIs, and even an ISR-safe function can have restrictions on interrupt priority or configuration. Use the selected runtime's rules rather than guessing from a similar function name.

A shared variable also needs a synchronization contract. Suppose main code reads counter = 4, an interrupt increments it to 5, then main writes its own computed 5. Two increments have occurred but the retained value is only 5 instead of 6. Declaring the counter volatile does not make the read-add-write sequence indivisible.

Solutions can include appropriate atomic operations, a short critical section, or single-writer ownership with a queue. The correct mechanism depends on the architecture, data width, number of writers and execution contexts. A global interrupt mask on one CPU does not protect against another CPU or a DMA engine.

## Preserve driver state and lifetime

A driver must know whether a request is idle, active, completed or failed. A completion event should refer to the correct outstanding request. Reusing a buffer before a transfer ends can corrupt data even if every register write is individually valid.

Timeout and cancellation also need explicit transitions. If software declares a timeout while hardware later completes, which side owns the buffer and may the late interrupt still access its state? Cleaning up the software object without stopping or synchronizing hardware can leave a stale access.

Initialization order matters: configure state and handler-visible data before exposing an enabled interrupt path. Shutdown reverses ownership carefully, preventing new work and ensuring in-flight activity is finished or safely cancelled before releasing resources.

## Exercises and explained answers

1. In the timeline, what is the delay from event to the end of urgent work? 17 − 10 = 7 μs. Handler execution alone accounts for only 2 μs.
2. If masking ends at 18 μs instead, with all later durations unchanged, when does full completion occur? Handler begins at 19, urgent work ends at 21 and deferred work ends at 26 μs.
3. Can clearing the NVIC pending bit prove a peripheral condition disappeared? No. The peripheral can still assert the condition or have unread data.
4. Why does volatile fail to protect the counter example? It does not join separate read and write operations into one atomic update or provide mutual exclusion.

Interrupts reduce the need to poll, but do not eliminate deadlines, buffering or ownership. DMA makes those same responsibilities more visible by allowing another hardware agent to access memory directly.
