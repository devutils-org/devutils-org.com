---
id: concept.memory-and-registers
type: concept
locale: en
slug: memory-and-registers
area: digital-logic
title: Memory and registers
summary: Separate holding a value from computing one, then organize stored bits into registers and addressed words.
status: published
updated: 2026-10-24
prerequisites: [concept.combinational-logic]
related: [concept.binary-adders, concept.sequential-logic]
sources:
  - title: MIT OpenCourseWare, Computation Structures — latches and edge-triggered storage
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/
  - title: MIT OpenCourseWare, Computation Structures — SRAM and DRAM organization
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c14/c14s1/
---
## Keep something after the input changes

[Combinational logic](/library/digital-logic/combinational-logic/) computes a result from present inputs. Storage adds a different ability: a value can remain available after the input that produced it changes. The retained value is part of the system’s state.

A latch can follow its data input while enabled and hold a value when disabled. An edge-triggered flip-flop samples around a specified clock transition. A register groups stored bits into a wider value. These names describe different interfaces; a latch is not interchangeable with an edge-triggered register.

## Define a small register

Our example has a four-bit data input D, a four-bit stored output Q and an enable signal E. On a rising clock edge, it copies D into Q only when E = 1. Without an enabled rising edge it holds its value. We choose Q = 0000 as the initial state of this example, not as a promise about power-up hardware.

| Step | Clock event | D | E | Q after event |
|---|---|---|---|---|
| 0 | No edge | 0110 | 1 | 0000 |
| 1 | Rising edge | 0110 | 1 | 0110 |
| 2 | No edge | 1001 | 1 | 0110 |
| 3 | Rising edge | 1001 | 0 | 0110 |
| 4 | Rising edge | 1001 | 1 | 1001 |
| 5 | Falling edge | 0011 | 1 | 1001 |

Step 2 distinguishes storage from a wire: D changes while Q remains 0110. Step 3 shows that a clock edge alone need not cause a new value to load. Step 5 matters because this contract specifies rising edges, not both edges.

The table assumes inputs meet the register’s timing requirements. It does not describe what happens if D changes too close to an edge. We examine that constraint in [sequential logic](/library/digital-logic/sequential-logic/).

## Give words addresses

Suppose we want four independently selected four-bit values. A conceptual memory can use two address bits to identify one word:

| Address | Stored four-bit word |
|---|---|
| 00 | 1010 |
| 01 | 0011 |
| 10 | 1110 |
| 11 | 0100 |

The data capacity is 4 words × 4 bits = 16 bits, or 2 bytes of payload. The two-bit address identifies a word; it is not the width of that word. Interface wiring and control circuitry are not included in this payload calculation.

In this example, reading address 10 returns 1110. A write of 1001 to address 10 replaces that word. Reading address 01 still returns 0011. A memory’s full contract must also specify when a write occurs, when read data becomes valid, and what simultaneous reads and writes mean. The address table alone does not supply those rules.

## The interface does not name the technology

A bank of registers is one way to model a tiny memory, but larger arrays use specialized storage cells and selection circuits. SRAM retains state while powered without a DRAM-style refresh cycle. DRAM uses charge-based storage that needs refresh. Both are volatile; neither is a promise to retain data after power is removed.

Those implementation choices affect density, access timing and supporting circuitry. This introductory model does not provide measured latency numbers or imply that all memory interfaces behave like the four-bit register above.

## Exercise and answer

How many address bits identify eight words, each sixteen bits wide? Three bits identify eight word positions. The payload capacity is 8 × 16 = 128 bits, or 16 bytes. The word width and address width answer different questions.

The register trace and memory contents are original examples. Next, [sequential logic](/library/digital-logic/sequential-logic/) combines stored state with a next-state function to make behavior unfold over time.
