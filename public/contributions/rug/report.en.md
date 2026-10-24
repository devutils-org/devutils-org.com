# RUG — Analysis and open-source contributions

Independent contribution by moha-bekh; no maintainer endorsement is implied.
PR status checked at 2026-10-23T23:28:23.858943+00:00.

## Project and scope

[RUG](https://github.com/roman-starcevic/RUG) is an Apache-2.0 C++98 ABNF parser generator and byte-oriented LALR(1) runtime.
Baseline revision : `fe40fab82c61a6fdd95fa49162a289e703644f1c`.
The audit and the two performance candidates use that unchanged revision; performance changes were measured independently.

## Audit and confirmed diagnostic issue

The baseline passed GCC/Clang builds and calculator/ticket examples on Debian 12, Ubuntu 24.04, Fedora 44 and Alpine 3.24 through distroproof VMs on their own kernels. Ten host build configurations and 60 deterministic sanitizer workload checks passed. Bounded grammar/runtime fuzzing completed 44,476 and 48,605 executions without a confirmed sanitizer finding; these runs do not prove safety.

Empty and comment-only grammars threw std::logic_error rather than the documented RugBuildError. The proposed validator guard reports structured diagnostics. The initial fuzz-harness abort came from failing to catch the ordinary C++ exception; it was a harness defect, not a confirmed memory-corruption crash.

## Proposed upstream changes

- [PR #1: Report empty ABNF grammars through structured build diagnostics](https://github.com/roman-starcevic/RUG/pull/1) — open.
- [PR #2: Resolve packed table section addresses once per lookup](https://github.com/roman-starcevic/RUG/pull/2) — open.
- [PR #3: Count default action frequencies once per row](https://github.com/roman-starcevic/RUG/pull/3) — open.

PR #1 fixes diagnostic consistency. PR #2 resolves ACTION/GOTO/rule section addresses once per lookup instead of repeated out-of-line accessor calls. PR #3 replaces quadratic frequency recounting over 257 actions with a histogram and ordered selection, preserving earliest-terminal tie-breaking.

Submitted is not accepted or merged. Follow the PR links for current status.

## Method and measured results

Environment : AMD Ryzen 9 3900X, GCC 16.2.1, Arch Linux, 7.2.9-arch1-1.
Flags : `-Wall -Wextra -Werror -std=c++98 -O2 -g -fno-omit-frame-pointer`, without LTO.
Six workloads, three parsing chunk sizes, two warmup processes per variant, ten balanced-order paired trials per case, seed 5234, medians/MAD and 5,000 paired bootstrap resamples. Profiled timings are excluded from A/B timing statistics. Parsing excludes construction and session allocation, but includes reset/push/finish. Construction measures full repeated build/destruction.

| Workload | Parse-time reduction, 4096-byte chunks | Baseline build | Optimized build | Build speedup |
|---|---:|---:|---:|---:|
| tiny | 23.6 % | 0.944 ms | 0.033 ms | 28.53× |
| medium | 25.9 % | 15.726 ms | 0.506 ms | 31.05× |
| large | 25.9 % | 61.787 ms | 2.242 ms | 27.57× |
| binary | 21.1 % | 61.323 ms | 2.535 ms | 24.13× |
| calculator | 37.0 % | 21.855 ms | 1.372 ms | 15.87× |
| ticket | 33.0 % | 31.989 ms | 1.390 ms | 22.92× |

Across all 18 parsing shapes the paired median time reduction was 20.6–37.0%; warm construction was 15.9–31.1x faster across six grammars. These are independent code changes: the gains are not multiplied or claimed for a combined binary.

## What Omniscient contributed

A local omn 0.1.0 CPU-clock profile identified lookup/accessor costs and table-construction hotspots. Source analysis led to the changes; Omniscient did not optimize the code automatically. Five paired fixed-work user-mode PMU observations recorded 26.5% fewer median retired instructions for parsing and 96.8% for construction. Final counts were not multiplexed; retained profiles reported no sample losses. The initial exploratory multiplexed counter run was excluded.

The CPU profile backend was pmu:sw (time, not hardware cycles), with user-space fp+leaf unwinding. Complete USE/latency modes refused missing BPF/tracefs permissions; no privileges were changed. ATFQ supplied memory context, xpac read package inventory, and VMAnyware was not used.

The approach draws on [Brendan Gregg’s public performance methods](https://www.brendangregg.com/methodology.html) and the presentation of Systems Performance, Second Edition; no reading of the complete book is claimed.

## Validation and limitations

Both candidates passed GCC and Clang ASan/UBSan builds, calculator/ticket examples, semantic-error handling and differential incremental callback/error/reset traces. The lookup oracle covers 4,626 results; the default-action oracle covers 300 rows including ties. Complete runtime images matched byte for byte for six grammars after the construction change.

The optimized code was not re-run across the four-distro matrix. Target affinity was fixed; frequency, thermals and other-core activity were not locked. Results do not establish gains with LTO, other hardware, arbitrary grammars or concurrent sessions. Collector CPU cost excludes some in-target perturbation. The frequency map adds temporary allocations, bounded by 257 keys per row; no memory reduction is claimed. No security assurance or maintainer endorsement is implied.

## Data and reproduction

- [Environment and PR snapshot](method.json)
- [Parsing summaries, MAD and intervals](parsing.json)
- [Construction summaries, MAD and intervals](construction.json)
- [Counter summary](counters.json)
- [Raw parsing pairs](parsing-measured-pairs.csv)
- [Raw construction pairs](construction-measured-pairs.csv)
- [Parsing PMU pairs](parsing-measured-pmu.csv)
- [Construction PMU pairs](construction-measured-pmu.csv)

- [Reproduction for PR #2](https://github.com/moha-bekh/RUG/blob/ebaf1c0bef6762a5d7db88680c8dd452b9d0e770/bench/table-lookup/README.md)
- [Reproduction for PR #3](https://github.com/moha-bekh/RUG/blob/49aabc5596b9898aeed42d59e964d354fc3cf835/bench/default-action/README.md)

Baseline portability/fuzzing statements summarize the local audit. The downloadable public evidence here covers the performance comparisons and the PR snapshot, not the complete original baseline campaign logs.
