---
id: concept.synchronous-interfaces
type: concept
locale: en
slug: synchronous-interfaces
area: digital-logic
title: Synchronous interfaces — valid, ready and backpressure
summary: Trace accepted values, preserve pending data and separate interface
  throughput, latency, buffering and clock-domain assumptions.
status: published
updated: 2026-10-26
prerequisites:
  - concept.finite-state-machines
  - concept.arithmetic-logic-unit
related:
  - path.digital-control-and-datapaths
sources:
  - title: Charles Eric LaForest — Rules for Ready/Valid Handshakes and
      Synchronization
    url: https://fpgacpu.ca/fpga/handshake.html
---
## Specify when a value is accepted

A datapath computes values, while a controller decides when state changes. Between modules, an interface must specify which clock edge accepts a value and what happens if the receiver cannot accept it yet. Without that contract, two individually correct components can duplicate, drop or overwrite data.

This lesson extends [sequential logic](/library/digital-logic/sequential-logic/) and [finite-state machines](/library/digital-logic/finite-state-machines/). We use one shared rising-edge clock and assume timing requirements are met. Signals crossing unrelated clocks require a different treatment; a synchronous handshake is not automatically a clock-domain-crossing solution.

Our source presents a value and valid. Our destination presents ready. A transfer occurs at a rising edge exactly when valid and ready are both one immediately before that edge. The value sampled is the pre-edge data, just as simultaneous registers sample old state.

## Follow a backpressured stream

When valid is one but ready is zero, the source must retain valid and the pending data until a later accepting edge. This rule prevents an offered item from disappearing while the receiver is busy. Once a transfer occurs, the source may present the next item for the following edge.

| Edge | Valid | Ready | Data before edge | Transfer | Accepted sequence after edge |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 5 | yes | 5 |
| 2 | 1 | 0 | 8 | no | 5 |
| 3 | 1 | 0 | 8 | no | 5 |
| 4 | 1 | 1 | 8 | yes | 5, 8 |
| 5 | 0 | 1 | irrelevant | no | 5, 8 |
| 6 | 1 | 1 | 3 | yes | 5, 8, 3 |

Data 8 is offered over three edges but accepted only once. Counting every valid edge as a transfer would incorrectly report five accepted values. Conversely, a destination that accepts a value when ready is zero violates its own contract.

The source must not wait for ready before it ever asserts valid in this contract. If the destination also waits for valid before asserting ready, both sides could otherwise wait forever. A destination may advertise readiness before data arrives, allowing a transfer as soon as the source has a value.

## Separate rate from latency

In the six-edge trace, three values are accepted, giving an observed average of 0.5 values per cycle over that window. That is not a universal maximum. With valid and ready continuously asserted, the interface can transfer one value per cycle.

At a 10 ns clock period, that ceiling is 100 million values per second. If each value contains 16 payload bits, the payload rate is 1.6 billion bits per second. The calculation assumes every edge transfers and excludes other protocol overhead. It does not imply the combinational path meets a 10 ns period.

Latency asks how long one item takes to become available or be consumed. A pipeline may deliver one item per cycle after filling while each item spends several cycles inside it. Throughput and individual latency are separate measures.

## Add a one-item buffer

A buffer stores data so the source and destination do not need to progress at exactly the same time. For a one-item buffer, empty and full are state meanings, not vague descriptions of whether the current data bits happen to be zero.

A simple design can accept into an empty buffer and hold while full. A more capable design can consume its stored item and accept a replacement at the same edge. In that case, the old item goes to the destination and the new item becomes the next stored value. Both actions must be defined together.

If occupancy before an edge is n, enqueue count is e and dequeue count is d, the count update is n_next = n + e − d. The logic must ensure the allowed capacity is never exceeded and data ordering is preserved. Count balance alone cannot detect swapping two values, so verification should also compare the sequence of accepted and emitted items.

## Keep reset and timing explicit

Specify whether reset discards buffered values, how valid behaves during reset and when normal transfers resume. A receiver expecting an old pending item cannot infer that the source silently forgot it. Reset is part of the communication contract.

Combinational paths through ready or valid can create long timing chains or loops when modules are composed. Adding a register can improve timing but changes backpressure behavior and may require more buffering to avoid losing an in-flight item. Function, capacity and timing must be considered together.

Metastability is another boundary. A signal from an unrelated clock can change near a receiving edge and violate the synchronous sampling assumption. A synchronizer can reduce the probability that metastability propagates, but does not make an arbitrary multi-bit bus safe or guarantee a one-cycle latency. Asynchronous FIFOs and coordinated transfer protocols exist for that different problem.

## Exercises and explained answers

1. With valid = 1 on four edges and ready = 0, 1, 0, 1, how many items transfer? Two. The pending value must remain stable across each wait, and the source advances only after acceptance.
2. A two-item queue starts with one item, then enqueues and dequeues at the same edge. What is its next occupancy? 1 + 1 − 1 = 1. The output item is the old head, while the new value joins the queue.
3. At period 20 ns with one accepted 8-bit item every cycle, what is payload throughput? 50 million items/s, or 400 million payload bits/s.
4. Does matching valid and ready values across unrelated clocks establish a synchronous transfer? No. The signals must be safely communicated under a clock-domain-crossing design rather than interpreted as if the same edge sampled them.

These rules are a foundation for pipelines, buses and peripheral queues. They turn “the data is there” into a precise statement about ownership and accepted state changes.
