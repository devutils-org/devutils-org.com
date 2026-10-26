---
id: concept.dma-and-buffer-ownership
type: concept
locale: en
slug: dma-and-buffer-ownership
area: firmware-embedded
title: DMA and buffer ownership — addresses, visibility and reuse
summary: Follow device/CPU buffer ownership, calculate fill intervals and
  preserve FIFO capacity while separating coherence from ordering.
status: published
updated: 2026-10-26
prerequisites:
  - concept.interrupts-and-drivers
  - concept.caches-and-memory-hierarchy
related:
  - path.firmware-and-embedded
sources:
  - title: Linux kernel — Dynamic DMA mapping Guide, address spaces, coherence and
      transfer direction
    url: https://docs.kernel.org/core-api/dma-api-howto.html
---
## Move data without one CPU copy per element

Direct memory access, DMA, lets a device or controller transfer data between memory and a peripheral, or between supported memory locations, after software configures the operation. The CPU can perform other work while the transfer progresses.

DMA does not eliminate memory traffic, bus contention, setup or completion handling. It changes who performs the transfer. For a small operation, setup can cost more CPU time than a simple copy; for a large stream, amortizing setup can make DMA useful.

The important correctness question is ownership: who may read or write a buffer at each stage, and what proves that the other agent has finished? A valid address and correct byte count are not enough if the CPU changes the contents while hardware is still using them.

## Define a transfer lifecycle

For a simple transmit buffer, software allocates or reserves suitable memory, fills it, performs required mapping or synchronization, then submits it to the device. While the device owns it, software does not modify or free it. Completion returns ownership, after any required synchronization, so it can be reused.

A receive buffer reverses the data direction: the device writes data, then software consumes it after completion and required visibility operations. “Complete” must mean the relevant transfer has finished according to the device contract, not merely that a request entered a queue.

Descriptors commonly specify address, length, control and ownership information. A chain or ring can let hardware process multiple buffers. The exact descriptor layout, alignment and publication order are device-specific. Publishing an ownership flag before the address and length are visible can let hardware use incomplete metadata.

## Distinguish CPU and device addresses

A C pointer used by the CPU is not automatically a DMA address usable by a peripheral. Virtual memory, host bridges, IOMMUs and address-width limits can change the mapping. The Linux DMA API explicitly separates CPU virtual addresses, CPU physical addresses and DMA/bus addresses.

Even on a simple MCU where address values happen to match, buffer regions and alignment can be restricted. Some memories may be inaccessible to a particular DMA engine. A correct driver obtains addresses using the platform's documented method and checks mapping failures.

Cache visibility is another requirement. A CPU can have modified data in its cache while the device sees older memory contents. Conversely, after device writes, a CPU can retain stale cached data. Coherent systems solve some visibility problems in hardware; noncoherent systems need appropriate cache maintenance or DMA synchronization.

Coherence does not replace ordering. Even coherent memory can need barriers to publish descriptor fields before the device is notified. Volatile alone does not provide the buffer lifetime, ownership, cache management and ordering contract.

## Budget buffer time

Suppose samples arrive at 1000 samples/s and each sample occupies two payload bytes. Payload rate is 2000 bytes/s. A 100-sample buffer contains 200 bytes and fills in 0.1 s, or 100 ms.

For ping-pong buffering, the device fills A while software processes B, then swaps. Each completed buffer must be processed and released before hardware needs it again. Under an ideal immediate-swap model with identical buffers and no gaps, software has one other buffer-fill interval, 100 ms here, before the completed buffer is reused.

If processing takes 80 ms with negligible notification delay, there is 20 ms of headroom. If scheduling and notification add 30 ms, total 110 ms exceeds that interval. Average processing time below 100 ms is not a guarantee against a longer delayed episode.

| Samples per buffer | Bytes per sample | Payload bytes | Fill time at 1000 samples/s (ms) |
| --- | --- | --- | --- |
| 50 | 2 | 100 | 50 |
| 100 | 2 | 200 | 100 |
| 200 | 2 | 400 | 200 |

Larger buffers increase time between completions but also increase memory use and acquisition latency. They cannot fix an indefinitely slower consumer: if sustained processing consumes less than the input rate, any finite buffer eventually fills.

## Detect overflow and late completion

A circular ring needs a full/empty convention. One approach reserves a slot; another tracks occupancy or monotonic producer/consumer counts. Modulo indices alone can make equal head and tail ambiguous unless additional state or a convention resolves it.

For a capacity-four queue initially empty, enqueue values 10, 11 and 12, dequeue 10, then enqueue 13 and 14. Occupancy becomes four and retained order is 11, 12, 13, 14. Another enqueue must be rejected, delayed or handled under an explicit drop policy. Silently overwriting 11 would violate lossless FIFO behavior.

Cancellation also requires coordination. A timeout cannot return a buffer to the allocator while an active DMA engine may still write it. Stop or quiesce the transfer and synchronize with possible completion paths before releasing ownership.

## Exercises and explained answers

1. At 2000 samples/s with four bytes/sample and 128 samples/buffer, find size and fill time. Size is 512 bytes and time is 128/2000 = 64 ms. Payload rate is 8000 bytes/s.
2. With that ping-pong interval, processing takes 50 ms and scheduling delay takes 20 ms. Does the model meet reuse time? No: 70 ms exceeds 64 ms by 6 ms.
3. Why can a valid CPU pointer still be an invalid device address? Translation, device address width and reachable memory ranges can differ. Use the platform's DMA mapping contract.
4. Does receiving a timeout prove the device has stopped accessing memory? No. Timeout is a software observation; hardware cancellation and synchronization must establish that access is finished.

DMA changes the division of work, not the need for a complete data-transfer protocol. Real-time scheduling determines whether the software side services those buffers before their deadlines.
