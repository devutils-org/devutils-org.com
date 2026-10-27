---
id: concept.finite-state-machines
type: concept
locale: en
slug: finite-state-machines
area: digital-logic
title: Finite-state machines
summary: Design a serial pattern detector, preserve overlapping matches, encode its states and verify every short input stream.
status: published
updated: 2026-10-26
prerequisites: [concept.sequential-logic]
related: [concept.combinational-logic, concept.memory-and-registers]
sources:
  - title: MIT Computation Structures — L06, Finite State Machines
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c6/c6s1/
---
## Remember only what matters

A finite-state machine (FSM) represents relevant history with a finite set of states. Combinational logic selects the next state; a clocked register stores it. Read [sequential logic](/library/digital-logic/sequential-logic/) first for the edge and timing model.

Consider an original teaching problem: a receiver samples one bit at each rising edge. It must announce when the last three sampled bits are 101. Matches may overlap: 10101 contains two matches. This is a pattern detector, not a secure lock or a complete communication protocol.

Storing every received bit would consume growing memory. Instead ask which suffix of the history could still become the start of 101. A suffix is the end of a sequence; a prefix is its beginning. For example, after 110, the useful suffix is 10. Earlier bits cannot affect whether the next bit completes the pattern.

## Give each state a meaning

Use four named states:

| State | Meaning after the most recent edge | Match output |
|---|---|---|
| A | No nonempty suffix matches a prefix of 101 | 0 |
| B | Longest matching suffix is 1 | 0 |
| C | Longest matching suffix is 10 | 0 |
| D | Last three sampled bits are 101 | 1 |

The match output depends only on stored state: this is a Moore machine. A Mealy machine also permits outputs to depend directly on current inputs. Our contract reports a match during the cycle following the edge that accepted its final bit. It does not wait for a fourth bit.

Reset is synchronous and has priority: at any rising edge with reset = 1, enter A and discard that edge's input. Otherwise accept exactly one bit. We assume stable, synchronous inputs; a physical asynchronous input needs a separate synchronization design.

## Derive all transitions

For each row, append the incoming bit to the remembered suffix, then retain the longest ending that is a prefix of 101. State D retains knowledge of a full match, but also ends in 1.

| Current state | Input 0 next state | Input 1 next state |
|---|---|---|
| A | A | B |
| B | C | B |
| C | A | D |
| D | C | B |

From C, input 0 produces 100: neither 1, 10 nor 101 ends that sequence, so return to A. From D, input 0 produces 1010, whose suffix 10 can start another match; go to C. Returning unconditionally to A after a match would lose this overlap.

Every state has exactly one next state for each input. A missing transition is an incomplete specification, even when the intended action is to stay put.

## Trace an overlapping match

Begin in A after reset. The output shown is the value after each accepting edge.

| Edge | Input | State before | State after | Match |
|---|---|---|---|---|
| 1 | 1 | A | B | 0 |
| 2 | 0 | B | C | 0 |
| 3 | 1 | C | D | 1 |
| 4 | 0 | D | C | 0 |
| 5 | 1 | C | D | 1 |

At edge 4 the machine remembers the last two bits, 10. At edge 5 those combine with the new 1 to report the second match. Holding a clock high does not accept additional bits.

## Encode the behavior in hardware

Choose A = 00, B = 01, C = 10, D = 11. Two state bits provide four encodings, so this design has no unused binary encoding. Match is 1 precisely when both stored bits are 1. This is a logical condition, not a guarantee that a physical decoder never glitches during transitions.

The transition table becomes a combinational function of two state bits and one input bit: eight rows, each producing two next-state bits. Two flip-flops store that result at the next rising edge. A reset selector chooses 00 instead of the table result when reset is asserted.

An alternative uses four state bits with one asserted bit per named state, called one-hot encoding. It uses more storage and may change the logic complexity. Which implementation meets an area or timing target requires synthesis and timing analysis; state count alone cannot decide it. Invalid encodings then need a specified recovery policy. Simulation of our binary model does not evaluate physical metastability or hardware faults.

## Check the specification independently

A useful reference keeps the entire sampled sequence and checks whether it ends in 101. Unlike the implementation, it does not use state transitions. For every binary sequence up to length 10, compare this reference with the FSM output after every bit. There are 1 + 2 + 4 + … + 1024 = 2047 such sequences, including the empty sequence. Also reset from every named state with each possible input to verify priority.

This bounded exhaustive check catches overlap and short-history mistakes. It is not a proof about all stream lengths or real hardware timing. The state meanings explain why the same transition reasoning continues for longer streams.

## Exercises and answers

1. Trace 110101 from A. The states after each edge are B, B, C, D, C, D; the outputs are 0, 0, 0, 1, 0, 1. The second 1 preserves a possible start instead of clearing it.
2. In C, apply input 1 with reset asserted. The next state is A and match is 0: reset discards the potential completing bit. Then accept 0, 1 with reset low. The states are A, B, with no match.
3. How many bits are needed to encode five named states? Two bits offer only four encodings; three offer eight. The three unused encodings require an explicit policy in the implementation.

This controller chooses actions from remembered history. A processor combines such control with registers, arithmetic and data movement. The next architectural step is to distinguish the controller from the datapath it directs.
