---
id: concept.rtl-and-hardware-description
type: concept
locale: en
slug: rtl-and-hardware-description
area: integrated-circuit-design
title: RTL and hardware description
summary: Describe a registered four-bit accumulator in Verilog, separate combinational wiring from clocked storage and trace simultaneous state updates.
status: published
updated: 2026-10-26
prerequisites: [concept.sequential-logic, concept.arithmetic-logic-unit]
related: [concept.finite-state-machines]
sources:
  - title: Yosys documentation — A primer on digital circuit synthesis
    url: https://yosyshq.readthedocs.io/projects/yosys/en/latest/appendix/primer.html
  - title: Icarus Verilog — compile and execute a simulation
    url: https://steveicarus.github.io/iverilog/usage/getting_started.html
---
## Describe a circuit across clock edges

Register-transfer level (RTL) describes registers and the combinational functions between them. A hardware description language (HDL), such as Verilog, gives that structure a textual form. The HDL is a language; RTL is an abstraction used to organize a design. Not every valid HDL program describes synthesizable hardware.

Read [sequential logic](/library/digital-logic/sequential-logic/) and the [ALU](/library/digital-logic/arithmetic-logic-unit/) first. Here the task is to turn a small state-transition contract into source text without losing its clock semantics.

Our original example is a four-bit accumulator. At each rising edge, synchronous reset clears its state; otherwise enable adds an input to the current state, retaining four bits. If neither is asserted, state holds. It is a teaching circuit, not a processor or a measurement device.

## Write the contract before the code

Let q be the stored value and d the four-bit input. Both are unsigned bit patterns 0 through 15. With reset priority, the next-state equation is:

```text
if reset: next_q = 0
else if enable: next_q = (q + d) modulo 16
else: next_q = q
```

Inputs must be valid and stable around the accepting edge. Changing d during a cycle may change the adder's combinational output, but q remains unchanged until an eligible edge. Reset asserted between edges does not immediately clear q under this synchronous contract.

We also store the previous accumulator value in a register named prior. On every enabled, non-reset edge, prior captures the old q while q captures the new sum. This makes the distinction between old and new state visible.

## Express storage and wiring separately

This Verilog module deliberately uses a small synthesizable subset:

```verilog
module accumulator (
    input wire clk,
    input wire reset,
    input wire enable,
    input wire [3:0] d,
    output reg [3:0] q,
    output reg [3:0] prior
);
    wire [4:0] wide_sum;
    assign wide_sum = {1'b0, q} + {1'b0, d};

    always @(posedge clk) begin
        if (reset) begin
            q <= 4'b0000;
            prior <= 4'b0000;
        end else if (enable) begin
            q <= wide_sum[3:0];
            prior <= q;
        end
    end
endmodule
```

The range [3:0] declares four bits, numbered 3 through 0. A literal such as 4'b0000 states its width and binary digits explicitly. Braces concatenate bit fields: {1'b0, q} extends q to five bits with a leading zero. The explicit five-bit operands keep the carry in wide_sum; selecting [3:0] intentionally drops it at storage.

The assign statement describes a continuously driven combinational signal. The always block responds to a rising clock edge. Nonblocking assignments written with <= let the clocked registers capture values computed from the old state. In this block, prior captures the old q, not the sum assigned to q at the same edge. The absence of an enable branch assignment means these clocked registers retain their previous contents.

Do not generalize that last rule to an incompletely assigned combinational process: such a process may infer a latch. A clocked hold and an unintended transparent latch are different storage contracts.

## Trace both registers together

Begin with unknown power-up contents; first apply reset at a rising edge. The following rows then determine both state registers. The sum column is the combinational value from q before that edge, even when reset or enable prevents it from being stored.

| Edge | Reset | Enable | d | q before | Wide sum | q after | prior after |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 0101 | unknown | unknown | 0000 | 0000 |
| 2 | 0 | 1 | 0011 | 0000 | 00011 | 0011 | 0000 |
| 3 | 0 | 1 | 0101 | 0011 | 01000 | 1000 | 0011 |
| 4 | 0 | 0 | 0111 | 1000 | 01111 | 1000 | 0011 |
| 5 | 0 | 1 | 1001 | 1000 | 10001 | 0001 | 1000 |
| 6 | 1 | 1 | 1111 | 0001 | 10000 | 0000 | 0000 |

At edge 5, 8 + 9 = 17, so the stored low four bits represent 1. prior becomes 8. At edge 6 reset wins, discarding both the computed sum and the previous-state capture.

A common mistake is to read q <= ... followed by prior <= q as an ordinary sequential update of software variables. Both right-hand sides describe the values captured for this edge. Swapping the order of these two nonblocking statements does not change this example's result.

## Understand what the tools must establish

Simulation evaluates the HDL model for a chosen stimulus. Synthesis converts a supported description into connected implementation elements. Neither a plausible waveform nor successful synthesis establishes that manufactured hardware meets its timing constraints. Physical design, libraries, clock constraints and implementation checks remain necessary.

For this example, expect eight state bits, an addition function and logic implementing reset and enable choices before optimization. This is a conceptual inventory, not a measured netlist: a tool may transform the logic or use cells with dedicated enable/reset features. The mathematical example check covers the integer transition model and printed trace. A separate HDL check was also executed with Icarus Verilog 12.0: it compiled the exact module printed above and passed 3083 clocked checks, including the six printed edges, every four-bit starting q and input d with both reset and enable values, and the exercises. Two deliberate faults—capturing the new sum in prior and making reset asynchronous—were rejected by that checker. No synthesis tool was run.

## Reproduce the HDL check

With Icarus Verilog installed, run this repository command:

```sh
npm run verify:rtl
```

The command uses iverilog to compile the module and vvp to execute a generated testbench. Set IVERILOG and VVP to executable paths if they are not on PATH. The checker extracts the module and trace from this page, drives inputs while the clock is low, confirms the registers hold before the rising edge, then samples after nonblocking updates settle. It exits with an error if a check fails or the tools are unavailable. It remains separate from the tool-independent mathematical checks. Simulation does not establish physical timing, synthesis or manufacturing readiness.

## Exercises and answers

1. After reset, accept d = 1111 twice with enable high. After the first edge q = 1111 and prior = 0000. After the second, 15 + 15 = 30 = 11110 in five bits, so q = 1110 and prior = 1111.
2. Now hold enable low for two edges while changing d. q remains 1110 and prior remains 1111. Combinational wide_sum can still change between edges.
3. Why not initialize the trace with assumed zero power-up contents? This module specifies zero through an accepted reset edge; it does not specify the power-up state of an implementation.

The next design task is verification: generate stimulus that exercises reset priority, holds and wraparound, then compare the implementation against an independently written contract.
