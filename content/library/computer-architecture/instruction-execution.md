---
id: concept.instruction-execution
type: concept
locale: en
slug: instruction-execution
area: computer-architecture
title: Instruction execution — fetch, operands and architectural updates
summary: Execute a complete eight-bit teaching program, trace wraparound and
  branches and connect state changes to a datapath.
status: published
updated: 2026-10-26
prerequisites:
  - concept.isa-and-microarchitecture
related:
  - path.computer-architecture
sources:
  - title: MIT Computation Structures — 13.1, Building the Beta, datapath and
      instruction execution
    url: https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/c13s1/
  - title: RISC-V ratified specification — RV32I base integer ISA, version 2.1
    url: https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html
---
## Turn instructions into state changes

An instruction-driven processor selects operations using code stored in memory. A simple implementation fetches the instruction at its PC, decodes its fields, reads operands, performs arithmetic or memory access, and updates architectural state.

These responsibilities need not occupy one cycle each. A single-cycle teaching processor can combine them within a long cycle; a multicycle processor can reuse hardware across several cycles; a pipeline overlaps responsibilities for multiple instructions. First establish the behavior independently of those implementation choices.

This lesson defines a deliberately small teaching machine. It is not a RISC-V or x86 instruction encoding. Using a separate toy contract lets us show the complete trace without implying that simplified exception, alignment or memory rules describe a real architecture.

## Specify the teaching machine

The machine has four unsigned 8-bit registers R0 through R3, with R0 fixed at zero. Addition retains the low eight bits. Data memory contains 256 addressable bytes. Instructions occupy a separate listing indexed by PC = 0, 1, 2 and so on. Thus PC counts instruction slots, not byte addresses.

The instruction forms are:

~~~text
MOVI Rd, k       Rd := k, then PC := PC + 1
ADD Rd, Ra, Rb   Rd := (Ra + Rb) modulo 256, then PC := PC + 1
LOAD Rd, a      Rd := memory[a], then PC := PC + 1
STORE Rs, a     memory[a] := Rs, then PC := PC + 1
BNZ Rs, target  if Rs != 0: PC := target; else PC := PC + 1
HALT            stop, leaving PC at the HALT slot
~~~

Only R1 through R3 may be destinations in this listing. Literal values and addresses must be in 0 through 255. Branch targets are absolute instruction indices within the listing. Assume memory accesses complete successfully; no interrupts or concurrent writers occur.

## Trace operands before updating state

Initialize writable registers to zero and memory[20] to 7. Execute:

~~~text
0: MOVI R1, 250
1: LOAD R2, 20
2: ADD R3, R1, R2
3: STORE R3, 21
4: BNZ R3, 6
5: MOVI R1, 99
6: HALT
~~~

| Executed PC | Instruction | R1 after | R2 after | R3 after | memory[21] after | Next PC |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | MOVI R1, 250 | 250 | 0 | 0 | 0 | 1 |
| 1 | LOAD R2, 20 | 250 | 7 | 0 | 0 | 2 |
| 2 | ADD R3, R1, R2 | 250 | 7 | 1 | 0 | 3 |
| 3 | STORE R3, 21 | 250 | 7 | 1 | 1 | 4 |
| 4 | BNZ R3, 6 | 250 | 7 | 1 | 1 | 6 |
| 6 | HALT | 250 | 7 | 1 | 1 | 6 |

For completeness, memory[21] starts at zero. The ADD computes 257, but only its low eight bits, 1, are retained. STORE copies that bit pattern to memory. Since R3 is nonzero, the branch skips slot 5, leaving R1 at 250.

There are six executed instructions including HALT, despite seven instruction slots in the listing. Counting source lines is not always the same as counting executed instructions.

## Connect the trace to a datapath

The register file supplies operands, an ALU computes results or addresses, and control signals select which register or memory location is written. A PC-selection function chooses between sequential execution and a branch target. Write enables prevent unrelated state from changing.

At a state-update boundary, all required values come from the current architectural state. If destination and source register names coincide, the arithmetic still uses the old source value. This is the same old-state reasoning used for clocked RTL.

A store is not a register write; a branch is not merely an ALU result. Different instruction classes select different state updates. A useful implementation review asks which state is allowed to change for each class and whether every other architectural value is preserved.

Real processors add behavior omitted here: faults, precise exceptions, privilege, address translation, memory ordering and implementation-specific timing. Fetching from an invalid address cannot be ignored in a complete architecture. The toy's separate code and data memories also avoid self-modifying-code issues by definition.

## Check a changed input rather than memorizing the trace

If memory[20] starts at 6 instead of 7, the ADD computes 256 and retains zero. STORE writes zero. BNZ is not taken, so slot 5 executes and R1 becomes 99 before HALT. This one-value change tests whether the branch decision follows the retained register value rather than the unbounded mathematical sum.

Similarly, starting with memory[20] = 0 gives retained R3 = 250, so the branch is taken. A good model checks boundaries around wraparound and both branch outcomes, not only the original example.

## Exercises and explained answers

1. With memory[20] = 5, what is stored at address 21? The sum is 255, so 255 is retained and stored. The branch is taken.
2. With memory[20] = 6, how many instructions execute including HALT? Seven, because slot 5 is no longer skipped.
3. Does the trace's Next PC of 6 mean byte address 6 in a real RISC-V machine? No. This contract indexes instruction slots; actual architectures define byte-addressing and instruction lengths separately.
4. If ADD writes R1 while reading R1, which value supplies the input? The value before the update, followed by one architectural write of the result.

The purpose of the trace is to establish a reference behavior. A faster microarchitecture must preserve that behavior while reorganizing when and where the work is performed.
