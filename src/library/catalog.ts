// Editorial navigation: planned topics are labels, never empty article routes.
export const areas = [
  ['Foundations', 'Mathematical reasoning, units, signals, information, modeling'],
  ['Physics', 'Electricity, electromagnetism, quantum basics, thermodynamics, solid-state physics'],
  ['Chemistry & materials', 'Atomic bonding, crystal lattices, silicon, doping, material properties'],
  ['Semiconductor manufacturing', 'Wafers, photolithography, deposition, etching, implantation, metallization, packaging, testing'],
  ['Semiconductor devices', 'PN junctions, diodes, MOSFETs, CMOS, scaling, leakage'],
  ['Electronics & PCB', 'Circuit theory, analog and digital electronics, schematics, layout, power, signal integrity, measurement'],
  ['Integrated circuit design', 'RTL, HDL, simulation, verification, synthesis, physical design, timing, ASIC vs FPGA'],
  ['Digital logic', 'Boolean algebra, combinational and sequential logic, FSMs, arithmetic, registers, memory'],
  ['Computer architecture', 'ISA, microarchitecture, pipelines, caches, CPU/GPU, buses, RISC-V, x86-64'],
  ['Firmware & embedded', 'Bare metal, boot, MCUs, interrupts, DMA, drivers, RTOS, embedded Linux'],
  ['Operating systems', 'Kernel, processes, scheduling, memory, filesystems, syscalls, device drivers, virtualization'],
  ['Programming & toolchains', 'Assembly, C/C++/Rust, compilers, linkers, ELF, ABI, algorithms, debugging'],
  ['Applications & systems', 'UI, APIs, networking, databases, concurrency, distributed systems, operations'],
] as const
export const eras = ['Origins of information', 'Origins of logic', 'Mathematics of computation', 'Mechanical computing', 'Birth of computer science', 'Information revolution', 'Electronic computing', 'Software revolution', 'Connected world', 'Modern computing']
export const paths = [
  ['Build a computer from scratch', 'Boolean logic → ALU → registers → CPU → memory → FPGA → firmware → simple OS'],
  ['From silicon to a working chip', 'Materials → MOSFET → CMOS → RTL → synthesis → physical design → fabrication'],
  ['From source to execution', 'C → compiler → linker → ELF → loader → syscalls → CPU'],
  ['How Linux really works', 'Boot → kernel → scheduling → virtual memory → I/O → observability'],
]
export const labs = ['Logic gate simulator', '8-bit ALU in Verilog', 'RISC-V emulator', 'Cache visualizer', 'Virtual memory walkthrough', 'CMOS inverter simulation']
