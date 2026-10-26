# Full computing stack — remaining implementation

Scope: complete every topic in the thirteen-domain map in CONTENT-MAP.md,
with progressive canonical chapters, worked examples, exercises, source
assessments and executable checks where appropriate. Existing published
chapters are the starting point, not a reduced definition of completion.

As of 2026-10-26 the first six domains have dedicated published paths.
Digital logic has Boolean algebra, gates, combinational logic, adders,
registers/memory, sequential logic, finite-state machines and an ALU. A continuation path combines the controller
and datapath with a checked simultaneous-register exercise. Integrated circuit
design now has RTL/HDL, synthesis/technology-mapping and static timing
chapters connected by `/learn/integrated-circuit-design/`.

Still to implement and verify:

- Integrated circuit design: simulation, verification, physical design,
  ASIC versus FPGA; expand the introductory path as those chapters become available.
- Computer architecture: ISA versus microarchitecture, instruction execution,
  pipelines, caches, CPU/GPU, buses, RISC-V and x86-64, with a reading path.
- Firmware and embedded: bare metal, boot, microcontrollers, interrupts, DMA,
  drivers, RTOS and embedded Linux, with a reading path.
- Operating systems: kernel, processes, scheduling, virtual memory,
  filesystems, syscalls, drivers and virtualization, with a reading path.
- Programming and toolchains: assembly, C/C++/Rust, compilers, linkers,
  ELF, ABI, algorithms and debugging, with a reading path.
- Applications and systems: UI, APIs, networking, databases, concurrency,
  distributed systems and operations, with a reading path.

Each block requires actual source inspection, honest audit records, checked
examples and useful chapter connections. Run verify:content, tests and the
production build before claiming completion. Audit map topic coverage against
published content at the end; empty headings and roadmap labels do not count.

The original seven-step digital-logic foundations path remains introductory;
`/learn/digital-control-and-datapaths/` explicitly continues it with the FSM and
ALU lessons. HDL examples currently have mathematical model checks only: no
HDL simulation or synthesis run is claimed.
