---
id: history.software-revolution
type: history
history_kind: chapter
locale: en
slug: software-revolution
category: software-revolution
title: Software revolution — languages, operating systems and interaction
summary: Follow symbolic assembly, compiler teams, operating-system services, Unix and graphical interfaces as changes in who manages the machine's details.
status: published
updated: 2026-10-26
prerequisites: [history.electronic-computing]
related: [history.mechanical-computing, history.mathematics-of-computation]
sources:
  - title: History of FORTRAN and FORTRAN II — Computer History Museum Software Preservation Group
    url: https://softwarepreservation.computerhistory.org/FORTRAN/
  - title: Dennis M. Ritchie, The Evolution of the Unix Time-sharing System — preserved author text
    url: https://cm-bell-labs.github.io/who/dmr/hist.html
  - title: Xerox Alto — Computer History Museum
    url: https://www.computerhistory.org/revolution/story/347
  - title: Software and Languages timeline — Computer History Museum
    url: https://www.computerhistory.org/timeline/software-languages/
---
## Move work into reusable descriptions

A stored program is not automatically easy to write, run or understand. Early software development had to address symbolic naming, translation, libraries, input/output and the management of shared machines. Later interactive environments changed how people could explore and edit a task.

These changes overlapped. Assembly did not disappear when higher-level languages arrived, and command interfaces did not disappear when graphics became common. The historical question is which responsibility a tool or convention moved away from the person doing the task, and which assumptions remained exposed.

## Assembly names operations and locations

Raw machine instructions encode operations and operands according to a machine's rules. Symbolic assembly lets a programmer use names for some of those encodings. Translating a name is less ambitious than understanding an arbitrary natural-language request: the instruction set and grammar must still be defined.

Here is an invented two-byte instruction format. The first byte is an opcode and the second an unsigned literal or address. LOAD loads an immediate literal; ADD adds one; STORE writes the accumulator to an address. STOP uses a zero second byte.

| Symbolic instruction | First byte | Second byte |
|---|---|---|
| LOAD 6 | 01 | 06 |
| ADD 9 | 02 | 09 |
| STORE 32 | 03 | 20 |
| STOP | FF | 00 |

Bytes are written in hexadecimal. The assembler's output is 01 06 02 09 03 20 FF 00. Execution leaves 15 at memory address 32. Hexadecimal 20 means decimal 32; mistaking the printed digits for decimal changes the destination. These encodings are ours, not instructions for a historical processor.

Symbolic labels can reduce the need to recalculate numeric destinations after editing a program. They do not remove hardware constraints or establish that the algorithm is correct. An assembler should reject an unknown operation rather than guess a plausible intent.

## Compilers make another level of expression practical

The Computer History Museum's preservation collection documents the IBM 704 FORTRAN project through proposals, manuals, source listings and a 1957 paper by Backus and colleagues. The multi-author record helps make compiler construction visible as team work. It also distinguishes a proposed language from manuals, a working implementation and later revisions.

The museum's broader software timeline places Hopper's A-0 in 1952 among early automatic-programming systems. Historical uses of “compiler” should not be assumed to mean precisely the same input language and translation responsibilities as a current compiler. There was no one-step transition from manual coding to all modern programming practice.

A compiler translates a defined source language into another representation. Consider the original expression result = (a + b) × 2. A possible accumulator sequence is LOAD a, ADD b, then ADD the saved sum to itself. This is a sketch, not the immediate-only instruction set above: the operand-access contract must be extended before it can execute such a sequence.

That caveat matters. A higher-level expression can hide decisions about storage, evaluation order, integer range and runtime support. For a = 7, b = 5, exact arithmetic gives 24. A four-bit unsigned result retaining low bits gives 8. Optimization is correct only under the language's actual rules, not under whichever arithmetic makes a transformation convenient.

Languages can emphasize numerical arrays, business records, symbolic structures or systems control. Those choices affect how a problem is expressed and checked. A language name alone does not determine portability: machine interfaces, libraries, data representations and undefined or implementation-specific behavior still matter.

## Operating systems organize shared work

Loading one program is a different task from supporting many programs and users. An operating system can provide services for files, device access, processes and resource coordination. An application can request a service without implementing the whole device-control mechanism itself. Which services exist depends on the particular system and era.

An original scheduling model has two ready jobs, A needing three one-unit CPU slices and B needing two. With strict alternating slices while both are ready, the execution order is A, B, A, B, A. B completes after slice 4 and A after slice 5. This is logical interleaving on one CPU, not evidence that both execute simultaneously.

The model ignores switching overhead, waiting for input/output, priorities and arrivals after time zero. It illustrates why visible progress by several programs does not imply several processors. A real operating system must specify and implement the additional cases.

## Unix grows through technical and social choices

Ritchie's participant account dates Unix's beginnings to 1969 and describes the loss of a Multics environment, Thompson's work on a PDP-7, filesystems, processes and the wish to preserve a collaborative computing community. It names colleagues and describes experiments and revisions, rather than presenting a finished design as inevitable.

The account discusses the separation of a user-level shell from the kernel, evolving process control and pipelines. It also dates the kernel's rewriting in C to 1973. Rewriting was a specific development, not proof that every implementation detail had become independent of hardware.

A pipeline illustrates composition. In an original data-flow exercise, take records red, blue, red, green. A filter that keeps only red records outputs two records. A following counter emits 2. The filter need not know who produced the input; the counter need not understand colors. The interface between stages makes this division possible, but compatible stream formats and error behavior must still be agreed.

This is an abstract composition example, not an exact historical shell transcript. It is also not a claim that Unix invented every component idea independently. Ritchie's account is a valuable participant source whose retrospective judgments remain distinguishable from the underlying technical sequence.

## Graphical interfaces change the interaction contract

The Alto work at Xerox PARC combined a graphical display, mouse, software tools and networking in a research environment. The museum describes contributions by groups associated with Kay, Goldberg and others, and applications such as Bravo and Gypsy. A graphical interface is therefore more than attaching a mouse to an unchanged textual program.

Selecting a visible document, editing a region and seeing a layout makes different actions discoverable. The system must keep a model of objects, selection and display state and map input events to operations. This does not make user errors impossible or eliminate the value of precise command languages.

A research demonstration, internal deployment and mass-market product are different milestones. It would be misleading to attribute all graphical interaction to one product launch or infer commercial availability from a museum photograph of a prototype. The chapter treats interface history as a collective design development, not an isolated invention that instantly replaced everything before it.

## Reading checks and answers

1. What does hexadecimal byte 20 represent in the toy program? Decimal 32, the destination address. The stored value is 15, not 32.
2. For a = 7 and b = 5, why might a tiny machine retain 8 rather than 24? Four-bit unsigned storage keeps the result modulo 16. The actual language and machine contract must specify that behavior.
3. Does the A, B, A, B, A schedule require two CPUs? No. It explicitly describes one CPU alternating work.
4. What does the filter/counter pipeline produce for blue, red, red, red? The filter passes three records and the counter returns 3.
5. Does a graphical interface remove the need for operating-system services and programming languages? No. It changes how operations are presented and invoked while depending on underlying software layers.

The next chapter connects machines through communication networks and distinguishes an internet's packet transport from the Web applications built on top of it.
