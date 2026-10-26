# Full computing stack — remaining implementation

Scope: complete every topic in the thirteen-domain map in CONTENT-MAP.md,
with progressive canonical chapters, worked examples, exercises, source
assessments and executable checks where appropriate. Existing published
chapters are the starting point, not a reduced definition of completion.

As of 2026-10-26, domains 1–10 have introductory published coverage and
connected reading routes. The latest extension adds three IC-design lessons,
one digital-interface lesson, six architecture lessons and six embedded lessons:
16 concepts and two paths, bringing the published-record total to 93.

- Integrated circuit design: RTL, simulation/verification, synthesis, timing,
  physical design and ASIC/FPGA target choices (six lessons).
- Digital logic: Boolean rules, gates, selection, arithmetic, storage, sequential
  logic, FSMs, an ALU and synchronous ready/valid interfaces (nine concepts plus lab).
- Computer architecture: ISA/microarchitecture including RV32I and x86-64 context,
  instruction execution, pipelines, caches, buses/I/O and CPU/GPU parallelism (six lessons).
- Firmware and embedded: MCU/MMIO and bare metal, reset/boot, interrupts/drivers,
  DMA ownership, RTOS scheduling and embedded Linux (six lessons).

Still to implement and verify:

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
`/learn/digital-control-and-datapaths/` explicitly continues it with the FSM, ALU and synchronous-interface
lessons. The RTL accumulator now has a separately reproducible Icarus Verilog 12.0
simulation check (`npm run verify:rtl`), covering the published module and trace.
No synthesis or tool-based static timing run is claimed.
