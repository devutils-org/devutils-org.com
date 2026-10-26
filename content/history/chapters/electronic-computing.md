---
id: history.electronic-computing
type: history
history_kind: chapter
locale: en
slug: electronic-computing
category: electronic-computing
title: Electronic computing — from relays to integrated processors
summary: Separate switching devices, stored-program organization, integrated circuits and microprocessors while following the teams and engineering problems behind them.
status: published
updated: 2026-10-26
prerequisites: [history.mechanical-computing, history.birth-of-computer-science]
related: [concept.cmos, concept.memory-and-registers, path.semiconductor-manufacturing]
sources:
  - title: Konrad Zuse — IEEE Computer Society, including autobiographical account
    url: https://history.computer.org/pioneers/zuse.html
  - title: ENIAC — Computer History Museum
    url: https://www.computerhistory.org/revolution/birth-of-the-computer/4/78
  - title: University celebrates Baby's 65th birthday — University of Manchester
    url: https://www.manchester.ac.uk/about/news/university-celebrates-babys-65th-birthday/
  - title: Invention of the Point-Contact Transistor — Computer History Museum
    url: https://www.computerhistory.org/siliconengine/invention-of-the-point-contact-transistor/
  - title: All Semiconductor Solid Circuit is Demonstrated — Computer History Museum
    url: https://www.computerhistory.org/siliconengine/all-semiconductor-solid-circuit-is-demonstrated/
  - title: Practical Monolithic Integrated Circuit Concept Patented — Computer History Museum
    url: https://www.computerhistory.org/siliconengine/practical-monolithic-integrated-circuit-concept-patented/
  - title: Microprocessor Integrates CPU Function onto a Single Chip — Computer History Museum
    url: https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/
---
## Components and organization are different axes

A machine can be programmable without using electronic switches. It can use electronic switches without storing its instructions in the same writable memory as its data. It can contain integrated circuits without having its entire processor on one chip. These distinctions prevent a sequence of component labels from standing in for the whole history of computer organization.

A switching component controls a signal. A logical circuit combines components into a function. A processor organizes functions and storage to execute instructions. A usable system adds input, output, software and operational support. Changes at one level affect the others without making them identical.

## Relays make the electrical and mechanical meet

An electromagnetic relay uses an electrical control signal to move contacts. That movement changes which electrical paths are connected. Logic can therefore be implemented electrically while its switching action remains mechanical.

The IEEE Computer Society's Zuse entry includes a retrospective account of moving from mechanical elements toward relays, testing a smaller Z2 and developing the Z3. The source is valuable testimony, but an inventor's own claim to priority is not neutral adjudication of every competing machine. We use it here to document design choices and development rather than repeat an unrestricted first-computer claim.

In an original two-switch teaching model, a conducting path through two series contacts exists only when both are closed. Two parallel contacts permit a path when either is closed. Physical contact behavior, timing and load still matter: this abstract AND/OR comparison does not reproduce a particular Zuse circuit.

## Vacuum tubes change the switching technology

Vacuum tubes allow electronic control without mechanically moving relay contacts. ENIAC illustrates the engineering consequences of building a large electronic machine, including configuration, maintenance and the labor of programmers and operators.

The Computer History Museum's ENIAC exhibit identifies Frances Bilas, later Frances Spence, and Betty Jean Jennings, later Jean Bartik, among the people who programmed it. Its configuration photograph and discussion of accumulators make clear that useful computation required understanding how units were connected, not merely having many tubes. Treating the machine as the work of two named designers alone would erase essential technical work.

Replacing moving contacts does not eliminate physical limitations. A device must still be powered, cooled, interconnected and maintained. An arithmetic table cannot determine which technology was cheaper or more reliable in a particular installation without evidence about that installation. No speed ratio between relays, tubes and transistors is asserted here.

## Stored programs change how work is specified

Manchester's Baby, or Small-Scale Experimental Machine, successfully ran an electronically stored program on 21 June 1948. The university identifies Williams, Kilburn and Tootill and describes its role as a test bed for the Williams-Kilburn storage tube. This is a specific documented milestone, not a claim that all prior machines were equivalent or that the whole idea belongs to one person.

To see the organizational distinction, consider an invented machine with an accumulator A and memory cells containing instructions. An instruction pointer selects the next instruction:

| Address | Instruction | A after execution |
|---|---|---|
| 0 | LOAD 3 | 3 |
| 1 | ADD 4 | 7 |
| 2 | STORE 8 | 7 |
| 3 | HALT | 7 |

In this toy instruction set LOAD takes a literal, ADD adds a literal and STORE writes A to a data address. Address 8 ends with 7. Changing the instruction at address 1 to ADD 5 changes the result to 8 without rewiring the arithmetic circuit. The instruction encoding and trace are ours; they are not the Baby's real instruction set.

Program storage introduces other questions: which locations can be executed, whether code can be modified, and how instructions are decoded. “Stored program” names an organizational property, not a synonym for “uses transistors.” The Baby's tube-based memory and logic make that distinction concrete.

## Transistors emerge from research and fabrication

The Computer History Museum documents Bardeen and Brattain's point-contact transistor work at Bell Labs in December 1947, within the solid-state research group organized by Shockley. It distinguishes the experimental device, internal demonstration and later public announcement. Device invention, theoretical explanation, packaging and mass production are separate activities.

A transistor can control current using a semiconductor structure. Making that useful in a computer additionally requires suitable characteristics, reproducible fabrication and circuit designs. The [semiconductor-device lessons](/learn/semiconductor-devices/) explain the physical models; this historical chapter does not treat the point-contact device as identical to a modern CMOS gate.

The transistor's appearance also did not instantly remove tubes from every application. A component demonstration alone cannot establish the cost, yield or practical success of every later system.

## Integrated circuits include the interconnections

Kilby's 1958 semiconductor circuit work at Texas Instruments and Noyce's subsequent planar monolithic approach at Fairchild addressed related but distinguishable integration problems. The museum describes Kilby's fine connecting wires and Noyce's metal-over-oxide interconnection scheme, building on Hoerni's planar process. It also identifies other contributors to isolation and manufacturing.

Putting active and passive elements into semiconductor material is not the whole manufacturing problem. Elements must be isolated where necessary and connected where intended. Designs, patent filings, working specimens and commercial offerings therefore need separate dates. The museum's account distinguishes Noyce's 1959 patent application from later working monolithic devices; those are not interchangeable milestones.

An original accounting model imagines 12 logic elements, each needing two package pins for a dedicated external link to its successor. Eleven links need 22 pin connections. Integrating those eleven links inside one package can remove those particular external connections, while still requiring power and the system's real external signals. This simplified count illustrates an interconnection motivation; it is not an IC pin-count formula or a measurement of a historical device.

## Microprocessors integrate CPU functions

The museum places the 4004 in the MCS-4 chipset and describes contributions by Hoff, Mazor, Faggin and Shima. Its account also discusses processor slices and multi-chip approaches, so the history cannot be reduced to one engineer suddenly putting an entire computer in one package.

A microprocessor integrates CPU functions; it may still require external memory, interfaces and support chips. A microcontroller can integrate additional functions for a particular system role. The distinctions depend on the device architecture, not a universal rule that every small chip is a complete independent computer.

Integration changes the economics of building systems, but more components alone do not specify what software can do or how people interact with it. The next chapter follows those software and interface developments.

## Reading checks and answers

1. Is a relay computer necessarily electronic? Its control is electrical, but the relay contacts move mechanically; state the intended distinction rather than equating all electrical devices with electronic switching.
2. In the toy program, change ADD 4 to ADD 5. A and memory cell 8 end at 8. The physical adder need not be rewired.
3. Does the appearance of a point-contact transistor prove that a later CMOS chip could immediately be manufactured? No. Device structures, processes, integration and yield require further developments.
4. For five elements in the toy interconnection model, how many dedicated external pin connections serve the chain? Four links require eight pin connections. Other signal and power pins are outside the count.
5. Does a CPU on one chip imply a complete computer on that chip? No. Inspect its memory, interfaces and required supporting components.
