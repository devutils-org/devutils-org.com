// The nine families and the story each one tells. Source names and summaries
// from omniscient's catalog/*.yaml; the stories, commands and outputs from its
// docs/families/*.md and examples/. Nothing here is paraphrased into a claim
// the repository does not make.

export interface Family {
  glyph: string
  id: string
  name: string
  sources: number
  // the card's line
  text: string
  // the story: its title, paragraphs (HTML), the sources it names, a real run and its limit
  title: string
  story: string[]
  highlights: [string, string][]
  example: string
  limit: string
}

export const families: Family[] = [
  {
    glyph: '⌘', id: 'cpu', name: 'CPU', sources: 15,
    text: 'Go from a busy core to the call stacks, instructions and counter evidence behind it.',
    title: 'Busy is not the same as productive.',
    story: [
      'Cycles, instructions, branch and cache misses, top-down slots and an on-CPU profile with call stacks — beside the time the machine spent by state, its pressure and a cgroup’s throttling.',
      'The counters of one source are opened as a group, so the kernel schedules them together: <code>cpu.ipc</code> is a ratio of one window, not two. Counts are inherited, so a program that works in a thread pool is counted rather than reported as idle.',
    ],
    highlights: [
      ['cpu.ipc', 'Instructions per cycle (derived)'],
      ['cpu.topdown', 'Front-end / back-end / bad-spec / retiring'],
      ['cpu.profile', 'On-CPU profile with call stacks'],
      ['cpu.throttle', 'CFS cgroup throttling'],
    ],
    example: `$ omn cpu.ipc -m count -e summary -- ./prog
work per cycle  via pmu  (cpu.ipc)
  1 events over 814.76ms, stopped because the launched program exited with exit status 0
  no loss: every read succeeded and no tick ran late`,
    limit: 'When more counters are open than the hardware has, the kernel time-shares them. The scaled value is an extrapolation, so the raw count travels beside it and the run says so.',
  },
  {
    glyph: '▥', id: 'mem', name: 'Memory', sources: 26,
    text: 'Separate resident pages, allocator activity, shared memory and the working set.',
    title: 'Which memory is really yours?',
    story: [
      'Three footprints, one file read three ways: <code>mem.rss</code> counts shared pages in full, <code>mem.pss</code> divides them by their mappers, <code>mem.uss</code> keeps only what dies with the process — and every event says which lines of <code>smaps_rollup</code> it added up.',
      'Around them: page faults, kernel and userspace allocations by call site, memory the allocator retains, caches and TLB, false sharing, reclaim, compaction, swap and pressure.',
    ],
    highlights: [
      ['mem.uss', 'Private footprint (what dies with the process)'],
      ['mem.heap.alloc', 'Userspace allocations by call site'],
      ['mem.heap.retained', 'Retained by the allocator but no longer live'],
      ['mem.wss', 'Real working set (pages actually touched)'],
    ],
    example: `$ omn -f examples/mem-footprints.yml`,
    limit: 'A working set cannot be measured without perturbing the thing measured. The cost is part of the result.',
  },
  {
    glyph: '⇄', id: 'sched', name: 'Scheduler', sources: 14,
    text: 'Distinguish runnable time, blocked time, wakeups and lock contention.',
    title: 'The time a program spends not running.',
    story: [
      'A thread blocked on a lock, on a disk or on another thread costs nothing in a CPU profile and everything in latency. That is why this family is the one most often missing from an investigation that went nowhere.',
      'Off-CPU time with the blocking stack, run-queue wait, who wakes whom, kernel locks, futexes and pthread mutexes with their wait and their hold.',
    ],
    highlights: [
      ['sched.offcpu', 'Blocked time with the blocking stack'],
      ['sched.runqlat', 'Run queue wait: wakeup → on-CPU'],
      ['sched.wakeup', 'Wakeup chain: who unblocks whom'],
      ['sched.mutex', 'pthread mutex contention'],
    ],
    example: `$ omn -f examples/sched-blocking-stack.yml`,
    limit: '<code>sched.irq</code> measures the hard half of interrupts only, and <code>sched.numa_balance</code> cannot fire on a machine with a single NUMA node.',
  },
  {
    glyph: '▱', id: 'io', name: 'Storage & I/O', sources: 16,
    text: 'Separate syscall time, filesystem activity, queueing, device latency and durability.',
    title: 'Slow at the syscall, fast at the disk.',
    story: [
      'Three layers that are never reported as one another: what the application asked for, what the filesystem did with it, and what the device actually performed.',
      'A read that takes 40 ms at the syscall and 2 ms at the device was not slow because of the disk — the gap between the layers is the diagnosis, not an error to smooth over.',
    ],
    highlights: [
      ['io.syscall', 'I/O latency as the application sees it'],
      ['io.fs', 'VFS and filesystem latency'],
      ['io.latency', 'Block request latency, submit → completion'],
      ['io.fsync', 'Synchronization latency'],
    ],
    example: `$ omn io.bytes --system -m poll@300ms -e timeline,summary -d 2s --backend force:fs:proc
io.bytes  via fs:proc  (io.bytes)
  8 events over 2.10s, stopped because the requested duration elapsed
  no loss: every read succeeded and no tick ran late
  degraded: fs:proc: system-wide, per device`,
    limit: 'A backend that sees less says so: <code>degraded</code> states that <code>fs:proc</code> answers system-wide, per device.',
  },
  {
    glyph: '↙', id: 'net', name: 'Network', sources: 20,
    text: 'Inspect connection setup, socket waits, traffic, retransmissions and declared request boundaries.',
    title: 'From the handshake to the drop reason.',
    story: [
      'Connection setup and lifetime, socket read and write latency, transmit queueing, retransmissions and dropped packets with the kernel’s reason — and one request’s life across all of it.',
      'Each collector is checked against a scenario it caused: 50 ms injected by <code>netem</code> recovered as 50.0018 ms, 512 datagrams to a closed port matched against <code>Udp: NoPorts</code>.',
    ],
    highlights: [
      ['net.tcp.connect', 'TCP connection setup latency'],
      ['net.socket', 'Socket read and write latency'],
      ['net.qdisc', 'Transmit scheduling latency'],
      ['net.drops', 'Dropped packets with drop reason'],
    ],
    example: `$ omn -f examples/net-queue-delay.yml`,
    limit: 'Raw capture needs <code>CAP_NET_RAW</code>. Without a ground truth to check it against, no collector was written for it.',
  },
  {
    glyph: '◇', id: 'gpu', name: 'GPU', sources: 13,
    text: 'Read device gauges and inspect program activity with the backend your hardware exposes.',
    title: 'The asymmetry is the design.',
    story: [
      'AMD and Intel expose a DRM scheduler, kernel PMUs and hwmon: their GPU numbers come from the kernel like every other family’s. NVIDIA’s proprietary driver exposes none of that, so it is read through NVML and CUPTI.',
      'What each path costs is measured and stated: compute kernels through CUPTI add 67 % to the run’s time against the control.',
    ],
    highlights: [
      ['gpu.job', 'DRM job latency, submit → fence'],
      ['gpu.engine_busy', 'Per-engine occupancy'],
      ['gpu.kernel', 'GPU time per compute kernel'],
      ['gpu.api', 'Host-side submission latency (CUDA / Vulkan)'],
    ],
    example: `$ omn gpu.job --system -m trace -e hist -d 1s
error: \`gpu.job\` has no viable backend on this machine:
  bpf:tp: tracepoint:gpu_scheduler:drm_run_job: missing: tracefs is mounted but
  not readable by uid 1000, ...
  hint: the request is valid; it is this machine that cannot serve it.`,
    limit: 'A valid request on a machine that cannot serve it is refused with the reason — never answered with a different number.',
  },
  {
    glyph: '⑂', id: 'proc', name: 'Processes', sources: 8,
    text: 'Inspect syscalls, execs, descriptors, threads and signals around a workload.',
    title: 'Counts that can be checked exactly.',
    story: [
      'Descriptors and threads, execs and exits, signals and every syscall with its latency. These are the only counts in the catalog that can be checked exactly, and they are: a thousand <code>getppid</code> calls, counted to the call.',
      'Send <code>SIGUSR1</code> five times to a process that has not handled the first: five signals generated, one queued, four already pending — and each event says which.',
    ],
    highlights: [
      ['proc.syscall', 'Per-syscall latency and count'],
      ['proc.exec', 'Process execution events'],
      ['proc.exit', 'Process exit events with exit code'],
      ['proc.fd', 'Open file descriptors against the limit'],
    ],
    example: `$ omn -f examples/proc-syscall.yml`,
    limit: 'A count without its limit is not a measurement: open descriptors are reported against the process’s limit.',
  },
  {
    glyph: 'ϟ', id: 'power', name: 'Power', sources: 7,
    text: 'Measure package energy, frequency, idle residency, temperatures and throttling.',
    title: 'The confounder behind every number.',
    story: [
      'A processor that throttled, or ran at a lower frequency under one instruction mix than another, moves a CPU, a memory and a GPU measurement at once — for a reason that appears in none of them.',
      'A run that throttled is not a slower run. It is a different run.',
    ],
    highlights: [
      ['power.energy', 'Energy per RAPL domain (pkg / cores / dram / gpu)'],
      ['power.freq', 'Effective CPU frequency'],
      ['power.cstate', 'Idle state residency'],
      ['power.throttle', 'Thermal and power-limit throttling'],
    ],
    example: `$ omn power.temp --system -m poll@300ms -e timeline -d 1s
  timeline
    system
      +0ns        59 celsius
      +305ms      56 celsius
      ...
  unverified requirement: hwmon`,
    limit: 'What could not be verified is printed with the result: here, the hwmon requirement.',
  },
  {
    glyph: '{ }', id: 'runtime', name: 'Runtimes', sources: 4,
    text: 'Read GC, JIT and custom runtime probes alongside system measurements.',
    title: 'Inside the runtime, at a stated price.',
    story: [
      'Garbage-collection pauses, JIT events, runtime-level allocations and your own USDT markers, read beside the system measurements.',
      'USDT is not the cheap path: a probe site is a <code>nop</code>, and attaching turns it into a breakpoint. Streamed to userspace, a hit costs about 700 ns, against 2 ns for the loop without a probe.',
    ],
    highlights: [
      ['runtime.gc', 'Garbage collection pauses'],
      ['runtime.jit', 'JIT compilation and deoptimization events'],
      ['runtime.alloc', 'Runtime-level allocation activity'],
      ['runtime.custom', 'User-declared probe on a symbol or USDT marker'],
    ],
    example: `$ omn list runtime
runtime.gc      trace         low    low     yes   all
runtime.jit     trace         free   low     yes   1 of 2
runtime.alloc   trace, poll   med    high    yes   all
runtime.custom  trace, count  med    low     yes   1 of 2`,
    limit: 'A probe on an arbitrary symbol is not built yet: it needs a symbol declaration and <code>CAP_SYS_ADMIN</code>.',
  },
]
