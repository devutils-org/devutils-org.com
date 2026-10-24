# Editorial Structure — From Matter to Software

## Editorial mission
Explain **what a concept is, why it exists, how it works, how it emerged, who contributed to it, and what it enables**. The central spine is a learning map, not a claim that every field belongs to one strict linear hierarchy. Electronics, IC design, networking, security, mathematics and distributed systems intersect multiple layers.

## A. Knowledge — main computing stack
Every area begins with an overview, prerequisites, connections and a progressively expanding article index.

| Area | Initial topics |
|---|---|
| Foundations | Mathematical reasoning, units, signals, information, modeling |
| Physics | Electricity, electromagnetism, quantum basics, thermodynamics, solid-state physics |
| Chemistry & Materials | Atomic bonding, crystal lattices, silicon, doping, material properties |
| Semiconductor Manufacturing | Wafers, photolithography, deposition, etching, implantation, metallization, packaging, testing |
| Semiconductor Devices | PN junctions, diodes, MOSFETs, CMOS, scaling, leakage |
| Electronics & PCB | Circuit theory, analog and digital electronics, schematics, layout, power, signal integrity, measurement |
| Integrated Circuit Design | RTL, HDL, simulation, verification, synthesis, physical design, timing, ASIC vs FPGA |
| Digital Logic | Boolean algebra, combinational/sequential logic, FSMs, arithmetic, registers and memory |
| Computer Architecture | ISA, microarchitecture, pipelines, caches, CPU/GPU, buses, RISC-V, x86-64 |
| Firmware & Embedded | Bare metal, boot, MCUs, interrupts, DMA, drivers, RTOS, embedded Linux |
| Operating Systems | Kernel, processes, scheduling, memory, filesystems, syscalls, device drivers, virtualization |
| Programming & Toolchains | Assembly, C/C++/Rust, compilers, linkers, ELF, ABI, algorithms, debugging |
| Applications & Systems | UI, APIs, networking, databases, concurrency, distributed systems, operations |

The landing page `/knowledge/computing-stack/` visualizes the full map and provides meaningful entry points for beginners and advanced readers.

## B. History — ideas before machines
The story starts before modern computing. Carefully distinguish **historical precursors** from direct technological ancestors.

1. **Origins of Information** — language, symbols, writing, number systems, zero, records, encoding and communication.
2. **Origins of Logic** — Aristotle, Stoic logic, medieval traditions, Leibniz, formal reasoning.
3. **Mathematics of Computation** — historical algorithms, al-Khwarizmi, binary notation, Boolean algebra, formal methods.
4. **Mechanical Computing** — calculating devices, Pascal, Leibniz, Jacquard, Babbage, Lovelace.
5. **Birth of Computer Science** — Hilbert, Gödel, Church, Turing, Shannon's switching-circuit work.
6. **Information Revolution** — Hartley, Shannon, entropy, coding, channels, noise, Wiener and cybernetics.
7. **Electronic Computing** — relays, vacuum tubes, stored programs, transistor, IC, microprocessor.
8. **Software Revolution** — assembly, compilers, programming languages, OS, Unix, GUIs.
9. **Connected World** — telegraphy, packet switching, ARPANET, TCP/IP, Web, distributed computing.
10. **Modern Computing** — mobile, open source, GPU, AI, semiconductor constraints, quantum computing.

Create a single **event dataset** powering chronology and links to articles/figures. Support approximate dates and date ranges; label competing historical claims and parallel inventions.

## C. Figures — profiles and discovery
The attached `history-of-computing-figures.md` is a user-provided *candidate inventory*. Import or transcribe its entries only after reviewing accuracy and licensing; do not treat it as a fact-checked database. It includes Pascal, Leibniz, Jacquard, Babbage, Lovelace, Boole, Hollerith, Turing, Shannon, von Neumann, Hopper, Ritchie, Thompson, Torvalds and many others.

Categories: logic & mathematics; information theory; mechanical computing; semiconductor devices; architecture; languages & compilers; operating systems; networking & web; HCI; algorithms & databases; AI; software engineering.

Additional candidates to research: Aristotle, al-Khwarizmi, Gottlob Frege, Kurt Gödel, Alonzo Church, Ralph Hartley, Augustus De Morgan, Charles Sanders Peirce, David Hilbert, Giuseppe Peano, George Cantor. This list is a research queue, not a claim of direct influence on every later development.

Profile structure:
- Name, life dates with precision, disciplines, short biography.
- Contributions with dates, historical context and **verified sources**.
- Associated concepts, events, institutions, collaborators and competing/parallel contributions.
- Primary works, further reading, image attribution and licensing.
- Clear separation of documented fact, attribution debates and interpretation.

## D. Learning Paths
Initial paths:
- **Build a Computer from Scratch:** Boolean logic -> ALU -> registers -> CPU -> memory -> FPGA -> firmware -> simple OS.
- **From Silicon to a Working Chip:** materials -> MOSFET -> CMOS -> RTL -> synthesis -> physical design -> fabrication.
- **From Source to Execution:** C -> compiler -> linker -> ELF -> loader -> syscalls -> CPU.
- **How Linux Really Works:** boot -> kernel -> scheduling -> virtual memory -> I/O -> observability.

Paths reference existing canonical articles, never duplicate full explanations.

## E. Labs
Candidate labs: logic gate simulator, 8-bit ALU in Verilog, RISC-V emulator, cache visualizer, virtual memory walkthrough, CMOS inverter simulation. Labs must be reproducible, include expected output and clearly separate simulations from physical measurements.

## F. Concept Graph (later)
Represent `concept`, `figure`, `event`, `path`, `lab` as typed nodes and semantic links as edges. Provide simple related-links first; add interactive graph visualization only after data quality and navigation justify it. Graph should be usable without canvas/WebGL as a fallback.

## G. Editorial article template
1. Overview — plain-language definition.
2. Why it exists — problem and motivation.
3. Prerequisites — what to read first.
4. How it works — progressively technical.
5. Under the hood — deeper mechanism.
6. Example / diagram / code — reproducible where possible.
7. Trade-offs and limitations.
8. History and figures — sourced links.
9. Connections — up/down/across the stack.
10. References — credible sources, with revision date.

Classify pages as `concept`, `deep-dive` or `hands-on` when useful. Never manufacture filler content to satisfy a sitemap or article count. English-first authoring is acceptable if untranslated pages are handled honestly.

## H. Initial editorial slice
Publish high-quality, cross-linked content for: `computing-stack` overview, `boolean-algebra` concept, `claude-shannon` figure, `switching-circuit-logic` historical event, plus section overview pages. Add the timeline only with verified entries. These are starting points, not fixed editorial priorities if stronger sources are available.

## I. Historical fact-check flags in supplied inventory
Review at least: Jacquard's mechanism vs modern programmable memory; Bush's *As We May Think* publication year (1945); claims about the 'first programmers' and ENIAC; precise chronology of transistor, IC and microprocessor contributions; collective/parallel work in AI; first-ever claims in computing. Distinguish a person's birth/death dates from contribution dates. Cite primary or institutional sources wherever possible.
