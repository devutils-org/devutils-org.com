---
id: concept.isa-and-microarchitecture
type: concept
locale: en
slug: isa-and-microarchitecture
area: computer-architecture
title: ISA and microarchitecture — contract, implementation and performance
summary: Distinguish instruction semantics from hardware organization, read
  RV32I state and compare scoped execution-time models.
status: published
updated: 2026-10-26
prerequisites:
  - concept.arithmetic-logic-unit
  - concept.synchronous-interfaces
related:
  - path.computer-architecture
sources:
  - title: RISC-V ratified specification — RV32I base integer ISA, version 2.1
    url: https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html
  - title: Intel — Intel 64 and IA-32 architecture manuals, programming environment
      and instruction reference
    url: https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html
---
## Define the machine that software sees

An instruction set architecture, ISA, defines a software-visible machine: instructions, registers, data representations and rules for their effects. A microarchitecture implements that contract using datapaths, control logic, pipelines, caches and other structures.

Two processors can implement the same required ISA behavior while taking different numbers of cycles, using different clock rates or organizing execution differently. Software compatibility therefore does not imply identical performance. Conversely, two processors running at the same frequency can implement different instructions and execute different amounts of useful work.

Read the [digital control and datapaths route](/learn/digital-control-and-datapaths/) first. Its ALU and state machines provide the building blocks; the new step is to let a program select a sequence of architectural state changes.

## Name architectural state

Registers store values accessible to instructions. The program counter, PC, identifies the instruction location according to the architecture's rules. Memory holds addressable data and code. Status or control state can define privilege, exceptions and other behavior, although an introductory unprivileged model leaves much of that out.

In RISC-V RV32I, the base integer registers x0 through x31 are 32 bits wide, and x0 reads as zero. Writes targeting x0 do not change its zero value. The name RV32I refers to a particular base integer ISA, not to every possible RISC-V extension or system configuration.

Thirty-two 32-bit register names describe 1024 bits, or 128 bytes, of named register positions. Since x0 is fixed, the 31 writable general-purpose registers contain 992 writable bits, or 124 bytes. These are architectural counts, not the total number of physical storage bits inside an out-of-order processor.

| Register group | Positions | Bits per position | Writable payload bits |
| --- | --- | --- | --- |
| x0 | 1 | 32 | 0 |
| x1 through x31 | 31 | 32 | 992 |

Temporary physical registers, pipeline state and caches can make implementation storage much larger. Do not infer die area from the architectural register count alone.

## Read instruction effects before encodings

For RV32I, ADD computes the low 32 bits of a sum of two source registers. ADDI adds a sign-extended immediate. LW loads a 32-bit word into a register, while SW stores one from a register. Branch instructions select the next PC based on a condition.

A load/store architecture makes the distinction between memory transfer and register arithmetic explicit. To add a value from memory, first load it into a register, then use an arithmetic instruction. The instruction encoding defines fields such as opcode and register numbers; assembly syntax is a human-readable representation of that encoding.

A mnemonic is not a complete specification. Width, signed interpretation, address calculation, alignment and exception rules matter. Adding two 32-bit bit patterns modulo 2^32 is different from assuming unbounded integer arithmetic. Consult the relevant extension before assuming that a base ISA includes multiplication, floating point or atomic operations.

## Compare RISC-V and x86-64 carefully

RISC-V and x86-64 are distinct architecture families. Their register models, instruction encodings, execution modes and software conventions differ. They cannot be made equivalent by renaming mnemonics. Intel's architecture manuals separate the programming environment, instruction reference and system programming precisely because an ISA includes more than a list of arithmetic operations.

RV32I base instructions use a 32-bit encoding; other RISC-V extensions include shorter encodings. x86 uses variable-length encodings and supports multiple modes. Therefore, “RISC-V instructions are always four bytes” and “64-bit means every instruction is eight bytes” are both misleading generalizations.

The terms RISC and CISC provide historical context, but do not establish speed, energy efficiency or implementation simplicity for an arbitrary workload. Modern implementations may decode instructions into internal operations, speculate, overlap work and use complex memory hierarchies. These are implementation choices subject to architectural behavior.

## Measure work rather than just frequency

For a simple execution-time model:

~~~text
Time = instruction count × average cycles per instruction / clock frequency
~~~

Take one million instructions. Machine A averages 1.5 cycles/instruction at 100 MHz, giving 15 ms. Machine B averages 2 cycles/instruction at 200 MHz, giving 10 ms. B takes more cycles yet finishes sooner in this stipulated comparison.

The same high-level task can require different instruction counts on different ISAs or compiled programs. A cache miss or branch penalty changes average CPI. The equation is an accounting model, not a claim that CPI stays fixed under every input or clock setting.

## Exercises and explained answers

1. RV32I writes the value 7 to x0. What does a later read return? Zero; the architectural zero register does not retain the attempted write.
2. How many bytes represent the 31 writable 32-bit registers? 31 × 32 / 8 = 124 bytes. Physical implementation storage is a separate question.
3. A program retires two million instructions at average CPI 1.25 and 250 MHz. How long does it take in the simple model? 2e6 × 1.25 / 250e6 = 0.01 s, or 10 ms.
4. Does a faster clock guarantee that a task completes sooner? No. Instruction count, average CPI and the actual task must be included.

The next lesson gives a small instruction stream explicit state-transition semantics so that “execute a program” becomes a trace you can reproduce.
