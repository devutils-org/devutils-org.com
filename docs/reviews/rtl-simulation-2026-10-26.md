# Accumulator HDL simulation — 2026-10-26

Assessor: Codex (assistant). Independent human review remains pending.

Icarus Verilog 12.0 stable, tag v12_0, source commit
4fd5291632232fbe1ba49b2c26bb6b2bf1c6c9cf was built from the upstream
steveicarus/iverilog repository under /tmp. The compiler and runtime were
installed under /tmp/devutils-iverilog without changing system packages.
Building this checkout also required a local GNU gperf 3.1 build.

Executed command:

```sh
IVERILOG=/tmp/devutils-iverilog/bin/iverilog VVP=/tmp/devutils-iverilog/bin/vvp npm run verify:rtl
```

Observed result: Icarus Verilog version 12.0 (stable) (v12_0),
PASS 3083 clocked checks, exit code 0.

The checker extracts the exact Verilog module from the article. It validates
six printed trace edges, 1024 combinations of starting q/input/reset/enable
with reset and seed edges for each combination, and five exercise/hold edges:
6 + (16 × 16 × 2 × 2 × 3) + 5 = 3083.
Before each rising edge it also checks that state has not changed when inputs,
including reset, change while the clock is low. Observations after the rising
edge wait for nonblocking updates. Case inequality detects unexpected X bits.

Two temporary copies of the article were deliberately mutated and checked:

- Replace prior <= q with prior <= wide_sum[3:0]: rejected for an incorrect prior value.
- Add posedge reset to the sensitivity list: rejected for a state change before the clock edge.

Neither mutation changed the working article. These checks validate the stated
synchronous binary behavior; they do not establish synthesis, mapped area,
physical timing, metastability, manufacturing readiness or general simulator
correctness. The allowlisted rtl-exercises group remains a separate integer
model check. Optional HDL execution is not silently skipped when tools are absent:
verify:rtl exits with an error. Normal site tests and builds do not require Icarus.

Artifact SHA-256 values for this run:

- Extracted Verilog module (excluding Markdown fences): 74bb4925972af250f20378b9cdb3947b1b072f1e21236fc55e4f71a7200205af
- scripts/check-rtl.ts: 1eba33b196541938f2e67169bbb0d367831f320753a28c482c4cacf1028136b3
- Full Markdown article: b57b6bac88d3ad2b337ea6700fa56ba698a7ccbdd1772dac1438e3339be005f6

Changing these artifacts requires rerunning the check; this dated record is not
an automatic attestation for future revisions. With tools on PATH, use
npm run verify:rtl; otherwise supply IVERILOG and VVP explicitly.
