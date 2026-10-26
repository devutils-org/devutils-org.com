# Computing-stack domains 7–10 — introductory coverage

This extension adds 16 English concepts and two learning paths to the existing
library. Work was prepared in an isolated worktree so the concurrent SEO,
reading-layout and French-foundations changes could be preserved. The combined
version includes commit 50bac55 and retains its six French foundation records.

## Coverage

| Domain | Published material after the extension |
| --- | --- |
| 7 — Integrated circuit design | RTL, simulation/verification, synthesis, static timing, physical design, ASIC/FPGA choices; six-step path |
| 8 — Digital logic | Existing Boolean/gate/combinational/arithmetic/storage/sequential/FSM/ALU lessons, plus ready/valid interfaces; both reading paths connected |
| 9 — Computer architecture | ISA/microarchitecture with RV32I/x86-64 context, a fully specified toy execution trace, pipelines, caches, buses/I/O, CPU/GPU parallelism; new six-step path |
| 10 — Firmware and embedded | MCU/MMIO and bare metal, reset/boot, interrupts/drivers, DMA ownership, RTOS scheduling, embedded Linux; new six-step path |

The extension uses primary teaching and project/manufacturer documentation:
YosysHQ, OpenROAD, AMD, the RISC-V specification, Intel's architecture manual
index, MIT Computation Structures, NVIDIA CUDA, Arm CMSIS, Linux, U-Boot,
Zephyr and FreeRTOS/AWS. Original numeric inputs and toy instructions are
identified as models. Each new record has selected source claims and a scoped
example assessment; independent human signoff remains pending.

The ISA lesson does not present its small toy as RISC-V or x86. Likewise the
fixed-priority response-time model states its scheduling assumptions, and the
DMA examples distinguish CPU/device addresses, visibility, ordering and ownership.
No new formal proof, synthesis run, place-and-route run, hardware boot or firmware
deployment is claimed. The existing accumulator HDL evidence is preserved.

## Verification of the combined version

- `npm run verify:content`: 33 check groups, 99 assessments. This is 93 English
  records plus six French foundation translations.
- `npm test`: TypeScript and 74 tests pass, including exact published count 99.
- New checks parse the published tables and toy instruction listing. They cover
  all 256 toy input bytes, cache hits/conflicts, handshake trace, timing/resource
  arithmetic, W1C masks, buffer budgets and a separately simulated priority schedule.
- `npm run build`: 294 HTML documents checked; sitemap and search generated.
- The integrated SEO audit reports 290 indexable pages, four excluded pages,
  zero errors and two pre-existing editorial notices on History metadata length.
- Chromium at 1440 and 390 pixels, JavaScript disabled: 42 layouts checked for
  HTTP 200, one title, no document overflow, expected font and valid article TOC
  targets. All 16 new concepts, four new/updated paths and the stack map are covered.
- Visual inspection of execution and scheduling examples confirms readable prose,
  tables and code blocks; wide technical blocks scroll within the article.
- `git diff --check` passes.

Checks ran with the available Node 26.12.1 runtime. This pass does not claim a new
Node 22 run. Browser reports and screenshots are ephemeral under
`/tmp/stack10-integrated-browser`; unit checks and assessment records are retained
in the repository. Remaining curriculum domains are operating systems,
programming/toolchains, and applications/systems, as listed in
`docs/planning/FULL-STACK-REMAINING.md`.
