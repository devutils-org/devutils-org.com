---
id: concept.sequential-logic
type: concept
locale: en
slug: sequential-logic
area: digital-logic
title: Sequential logic
summary: Combine stored state with a next-state function, trace a counter, and account for the time between clock edges.
status: published
updated: 2026-10-24
prerequisites: [concept.memory-and-registers, concept.binary-adders]
related: [concept.combinational-logic]
sources:
  - title: Cornell CS 3410, Stateful Logic — composition of registers and combinational logic
    url: https://www.cs.cornell.edu/courses/cs3410/2026sp/notes/state.html
  - title: MIT OpenCourseWare, Computation Structures — synchronous circuits and timing constraints
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/c5s1/
---
## Behavior with a past

A sequential system has stored state. Its next action can depend on both that state and present inputs. Our model uses [registers](/library/digital-logic/memory-and-registers/) with a shared rising-edge clock and [combinational logic](/library/digital-logic/combinational-logic/) to calculate the next state.

The equations separate the roles:

```text
next_state = F(current_state, inputs)
outputs    = G(current_state, inputs)
```

Some output functions use only current state. Here, the distinction is explicit in the chosen specification rather than hidden in a drawing.

## Place a register in the feedback path

The circuit structure can be read as follows:

```text
inputs ──────────────┐
                     v
current Q ─────> [next-state logic] ─────> next D
    ^                                       |
    |                                       v
    └────────── [state register] <───────────┘
                       ^
                       |
                     clock
```

The register breaks the immediate dependency around the loop: the logic works from the old stored Q, and the register accepts the resulting D at an appropriate later edge. Simply feeding an adder’s output back to its input without a defined storage boundary is not this model.

## Specify a three-bit counter

Our counter stores Q from 000 through 111. It has enable and synchronous reset inputs. At each rising edge:

```text
if reset = 1:
    next Q = 000
else if enable = 1:
    next Q = (Q + 1) modulo 8
else:
    next Q = Q
```

Reset has priority over enable. “Synchronous” means this reset takes effect at the specified edge; changing reset between edges does not immediately clear Q in this contract. The visible output is the current Q.

## Trace edges instead of guessing

Start with Q = 000 and hold the listed inputs stable around each rising edge:

| Edge | Reset | Enable | Q before | Q after |
|---|---|---|---|---|
| 1 | 1 | 1 | 000 | 000 |
| 2 | 0 | 1 | 000 | 001 |
| 3 | 0 | 1 | 001 | 010 |
| 4 | 0 | 0 | 010 | 010 |
| 5 | 1 | 1 | 010 | 000 |

At edge 3, the incrementer consumes the old value 001. It does not repeatedly increment while the clock remains high. At edge 4, holding enable low preserves the state. At edge 5, reset wins even though enable is high.

A separate boundary case starts at 111 with reset = 0 and enable = 1. The next stored value is 000 because this three-bit counter intentionally wraps modulo 8. The [binary-adder article](/library/digital-logic/binary-adders/) explains the discarded carry.

## Leave time for the next state

A register’s output changes after an edge, the combinational path takes time to settle, and the receiving register requires stable data before the next edge. Ignoring clock skew and uncertainty, a setup-time condition is:

```text
clock period >= clock-to-Q delay + logic propagation delay + setup time
```

For a fictional timing budget of 0.7 ns, 3.4 ns and 0.5 ns respectively, the sum is 4.6 ns. A proposed 4.0 ns period fails that setup budget. A 5.0 ns period passes this one inequality, but that alone does not establish a working implementation: minimum-delay hold constraints and clock uncertainty still need checking. These are illustrative numbers, not component measurements.

## Exercise and answer

From Q = 101, apply three rising edges with reset always 0 and enable values 1, 0, 1. The stored values become 110, 110 and 111. Explain the held middle value before checking the table-based reasoning again.

The counter, traces and timing numbers are original examples. Together with the preceding articles, they provide the building blocks for a later finite-state-machine or processor lesson; they do not yet specify a CPU.
