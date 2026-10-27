---
id: concept.caches-and-memory-hierarchy
type: concept
locale: en
slug: caches-and-memory-hierarchy
area: computer-architecture
title: Caches and memory hierarchy — locality, tags and misses
summary: Map byte addresses into a direct-mapped cache, reproduce a miss trace
  and calculate access-time and write-policy consequences.
status: published
updated: 2026-10-26
prerequisites:
  - concept.instruction-execution
  - concept.memory-and-registers
related:
  - path.computer-architecture
sources:
  - title: MIT Computation Structures — 14.1, Caches and the Memory Hierarchy
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/c14s1/
---
## Keep frequently used data closer

A memory hierarchy combines small, fast storage with larger, slower storage. Registers hold immediate operands; caches keep recently used blocks near the processor; main memory provides a larger working space. Persistent storage has a different role and access model again.

The usefulness of a cache comes from locality. Temporal locality means a recently used location may be used again. Spatial locality means nearby locations may soon be accessed. Neither is a law that every program obeys: an access pattern can defeat a particular cache organization.

A hit occurs when the requested block is present and valid. A miss requires obtaining it from a lower level. Cache contents normally change without altering the architectural value that a correct memory access returns. Timing and coherence, however, require careful rules.

## Split a byte address into fields

Consider a byte-addressed, direct-mapped cache with four lines, each storing four payload bytes. Total payload capacity is 16 bytes. Every memory block maps to exactly one cache line.

For address a, define block = floor(a/4), line index = block modulo 4, tag = floor(block/4), and byte offset = a modulo 4. Offset selects a byte within the block. Index selects a line. Tag distinguishes the many blocks that compete for that line.

| Byte address | Block number | Line index | Tag | Byte offset |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 | 3 |
| 4 | 1 | 1 | 0 | 0 |
| 16 | 4 | 0 | 1 | 0 |
| 20 | 5 | 1 | 1 | 0 |

A valid bit is necessary: an uninitialized tag value of zero does not prove that block zero is present. Payload capacity excludes tags, valid bits, dirty bits and implementation overhead.

## Trace conflict and reuse

Start with all lines invalid and read addresses 0, 1, 4, 0, 16, 0. On a miss, fill the entire containing block and replace the line's prior contents.

| Access | Address | Line | Tag requested | Result |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | 0 | miss |
| 2 | 1 | 0 | 0 | hit |
| 3 | 4 | 1 | 0 | miss |
| 4 | 0 | 0 | 0 | hit |
| 5 | 16 | 0 | 1 | miss |
| 6 | 0 | 0 | 0 | miss |

There are two hits and four misses, so hit rate is 2/6, or one third. Address 1 hits because the first fill brought bytes 0 through 3. Address 16 replaces block zero in line zero even though other lines remain unused. The final read of zero misses because those blocks conflict.

A set-associative cache offers multiple candidate lines within a set, which can reduce some conflicts. Replacement policy then selects a victim when the set is full. More associativity does not eliminate all misses; finite capacity and first accesses still matter.

## Calculate average access time with the right denominator

Use an independent timing model: each access takes a 1 ns lookup, and a miss adds a further 20 ns penalty. For the six-access trace, elapsed serialized lookup time is 6 × 1 + 4 × 20 = 86 ns, averaging approximately 14.333 ns per access.

The common expression is AMAT = hit time + miss rate × additional miss penalty. Here miss rate is 4/6 and the penalty is additional to the lookup. If a supplied miss time already includes lookup, use a weighted average of complete hit and miss times instead. Counting lookup twice gives the wrong answer.

Modern processors can overlap misses and computation, so this serialized AMAT is not automatically program execution time. A workload's dependencies and available parallelism determine how much memory delay becomes visible to instruction completion.

## Decide what writes mean

A write-through policy sends writes toward the lower level as well as updating the cache as required by the policy. A write-back policy can retain a modified block and write it back later, marking it dirty. Allocation on a write miss is another decision: whether the write causes a block to be fetched into the cache.

These policies affect bandwidth, latency and interactions with other agents. Another processor or DMA engine must not silently observe stale data when the system's contract requires new data. Cache coherence coordinates copies under a defined protocol; memory ordering determines permitted observation orders. They are related questions, but not synonyms.

A programmer also cannot assume every memory-mapped device register behaves like ordinary cacheable RAM. Accessing a device can have side effects, and its mapping attributes and I/O operations must follow the platform's rules. The buses and embedded chapters return to that distinction.

## Exercises and explained answers

1. For address 19 in this cache, find block, index, tag and offset. Block is 4, index 0, tag 1 and offset 3.
2. From an empty cache, read 0, 4, 0, 4. How many misses occur? Two initial fills followed by two hits; the blocks occupy different lines.
3. From empty, read 0, 16, 0, 16. How many misses occur? Four. The two blocks repeatedly evict one another from line zero.
4. With lookup 2 ns, miss rate 10% and additional penalty 30 ns, find AMAT. It is 2 + 0.1 × 30 = 5 ns. This is an access-time model, not an automatic end-to-end application benchmark.

Caches trade storage and policy complexity for faster access to useful working data. Understanding their address mapping makes both unexpectedly good reuse and unexpectedly poor performance explainable.
