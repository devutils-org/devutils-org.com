---
id: concept.buses-and-io
type: concept
locale: en
slug: buses-and-io
area: computer-architecture
title: Buses and I/O — transactions, addresses and shared service
summary: Distinguish MMIO from RAM, calculate burst payload rate and reason
  about arbitration, ordering and completion.
status: published
updated: 2026-10-26
prerequisites:
  - concept.caches-and-memory-hierarchy
  - concept.synchronous-interfaces
related:
  - path.computer-architecture
sources:
  - title: Linux kernel documentation — Bus-Independent Device Accesses
    url: https://docs.kernel.org/driver-api/device-io.html
  - title: Charles Eric LaForest — Rules for Ready/Valid Handshakes
    url: https://fpgacpu.ca/fpga/handshake.html
---
## Connect the processor to other agents

A bus or interconnect transports transactions between components such as processors, memories and peripherals. A transaction has meaning beyond a changing wire value: it identifies an operation, an address or destination, data and a completion or response rule.

A simple shared bus serves one transfer at a time. More complex interconnects can support multiple channels or outstanding operations. Do not assume every bus has the same arbitration, ordering or electrical organization. The [synchronous ready/valid lesson](/library/digital-logic/synchronous-interfaces/) describes one useful acceptance pattern, not an entire universal bus protocol.

Distinguish transfer acceptance from operation completion. A peripheral may accept a command now and finish it later. Likewise, a write can be posted into an intermediate queue without its final device side effect having happened yet.

## Address memory and devices differently

Memory-mapped I/O assigns some addresses to device registers rather than ordinary RAM. A read may retrieve status, consume a FIFO entry or clear an event. A write may enable a channel or acknowledge an interrupt. The address alone does not tell you which semantics apply.

Use an abstract peripheral whose base address is 0x40001000. Offsets are byte offsets, and its registers require aligned 32-bit accesses:

| Register | Offset (hex) | Address (hex) | Stated role |
| --- | --- | --- | --- |
| CONTROL | 0x00 | 0x40001000 | configuration |
| STATUS | 0x04 | 0x40001004 | event flags |
| DATA | 0x08 | 0x40001008 | transfer payload |

These are teaching addresses, not an actual device map. Adding an offset is integer address arithmetic. It is different from indexing a typed pointer, where the language may scale an index by the pointed-to element size.

The firmware chapter will define flag semantics explicitly. In a real system, discover or obtain the device's address and use the platform's I/O access rules. A normal pointer, memcpy or cacheable load cannot be assumed equivalent to a correctly ordered device transaction.

## Count payload and overhead separately

Suppose an abstract shared link moves one 32-bit word per cycle at 100 MHz. Its raw word payload ceiling is 4 bytes × 100 million cycles/s = 400 MB/s, using decimal megabytes.

Now stipulate one setup cycle per burst followed by eight payload cycles. Each burst transfers 32 payload bytes in nine cycles, or 90 ns. Sustained payload rate for back-to-back such bursts is 32/90e-9, approximately 355.556 MB/s.

This model excludes arbitration delays, response traffic, idle periods and other overhead. A peak data-path width multiplied by clock frequency is therefore not automatically achievable application throughput. Full-duplex and half-duplex links also count traffic differently.

If an additional two idle cycles occur between bursts, each 32-byte burst occupies eleven cycles of the schedule, reducing payload rate to approximately 290.909 MB/s. The bytes per burst have not changed; the denominator has.

## Arbitrate shared resources

If two requesters need one resource simultaneously, an arbiter decides which proceeds. Fixed priority can favor urgent traffic but starve a lower-priority requester. Round-robin can improve sharing among continuously requesting agents under stated assumptions, but it does not create extra bandwidth.

For a toy schedule, assume each grant occupies exactly three cycles, there are two continuously requesting agents A and B, and grants alternate A, B, A, B without gaps. A receives six cycles after its preceding grant began. Each agent obtains half the service capacity over a long interval.

That bound depends on a maximum grant duration, two requesters, no higher-priority interruptions and immediate progress. Allowing unbounded bursts destroys the same waiting-time claim. Average bandwidth and worst-case response time are distinct requirements, especially for real-time peripherals.

## Coordinate multiple outstanding operations

A request identifier can associate a response with its original operation when several requests are outstanding. Completion order might differ from issue order if the protocol permits it. Software and hardware must follow the relevant ordering and dependency rules.

A read-after-write dependency may need a synchronization operation, an ordered accessor or a readback under a documented device/platform contract. “The CPU executed the store instruction” is not always the same as “the peripheral has applied the change.” The Linux I/O documentation, for example, explicitly discusses posted writes and device readback requirements.

DMA adds another bus agent that moves data without a CPU instruction for each element. This can reduce CPU overhead while increasing interconnect traffic. Buffer ownership and cache visibility then become part of correctness, not merely performance tuning.

## Exercises and explained answers

1. A register is at byte offset 0x0C from the stated base. What is its address? 0x4000100C. Check alignment and width against the actual peripheral specification.
2. With two setup cycles and four 32-bit payload cycles at 100 MHz, what payload rate does this serialized model provide? It transfers 16 bytes in 60 ns, approximately 266.667 MB/s.
3. Does round-robin arbitration double a shared link's bandwidth when a second requester appears? No. It distributes the existing service capacity.
4. If a write is accepted into a queue, is its physical device action necessarily complete? No. Completion, ordering and any required flush/readback must follow the interface contract.

An interconnect joins computing and physical peripherals through explicit transactions. The next lesson compares how processors and accelerators exploit available computation and data movement rather than assuming every operation costs the same.
