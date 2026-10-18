// Single source of truth for the tools: the home page, the 3D scene and each
// tool's landing page read from here. Statuses are copied from each repo's
// README and current-state documents; keep validation limits explicit.

export const ORG = 'devutils-org'
export const ORG_URL = `https://github.com/${ORG}`

export const tools = [
  {
    id: 'omn',
    name: 'Omniscient',
    glyph: '◎',
    verb: 'Observe',
    color: '#9cf5ff',
    line: 'Linux observability, straight from the kernel.',
    body:
      'perf_event_open, eBPF, procfs, sysfs and netlink — no perf, bpftrace or bcc underneath. ' +
      'Every number says what it lost, how it was obtained and how far it can be trusted.',
    step: 'Measure a program or a whole machine across CPU, GPU, memory, network and disk — with the evidence beside every number.',
    flowDetail: 'Follow a workload live or replay a recording. See where time goes, what was captured and which measurements are out of reach.',
    status: 'In development',
    statusNote: '9 families · Linux 5.15+ · repository not public yet',
    license: 'MIT / Apache-2.0',
    command: 'omn top -- ./your-program',
    repo: 'omniscient',
    repoPrivate: true,
    site: '/tools/omn/',
  },
  {
    id: 'atfq',
    name: 'ATFQ',
    glyph: '?',
    verb: 'Explain',
    color: '#8fdcff',
    line: 'A Linux companion for the terminal.',
    body:
      'Short answers first, your machine’s real state second, the deep “why” only if you want it. ' +
      'Never runs your commands, never changes the system, never touches the network.',
    step: 'Ask what a number means — free vs available, a zombie, a swap storm — and read it against your machine’s live state.',
    flowDetail: 'Get a short answer first, then explore the deeper explanation. The embedded Linux companion works offline and never changes your system.',
    status: 'v0.1',
    statusNote: 'x86_64 + aarch64 binaries',
    license: 'MIT / Apache-2.0',
    command: 'atfq free --why',
    repo: 'atfq',
    site: '/tools/atfq/',
  },
  {
    id: 'distroproof',
    name: 'distroproof',
    glyph: '⧉',
    verb: 'Verify',
    color: '#96b9ff',
    line: 'Check that your program holds on every distro.',
    body:
      'Boots VMs on the real kernel of each target distro, runs your program there, and ties every failure ' +
      'to the environment difference that explains it — musl, an old kernel, missing BTF, lockdown.',
    step: 'Run the same binary on the real kernel of every target distro, and trace each failure back to the difference that caused it.',
    flowDetail: 'Compare kernels, libraries and permissions across a VM matrix. Read the environment differences alongside the test results instead of debugging a bare failure.',
    status: 'POC',
    statusNote: 'probe, VM matrix, reports and TUI implemented',
    license: 'MIT / Apache-2.0',
    command: 'distroproof run --target rocky-8 -- envprobe --json',
    repo: 'distroproof',
    site: '/tools/distroproof/',
  },
  {
    id: 'pkgx',
    name: 'pkgx',
    glyph: '▥',
    verb: 'Reconcile',
    color: '#aea0ff',
    line: 'Package inventory, provenance and conservative plans.',
    body:
      'Lists what is installed and why, explains dependencies, and reconciles packages and dotfiles against a ' +
      'declarative TOML profile — through a plan you can read, save and dry-run first.',
    step: 'Know why each package is there, then converge the machine to a TOML profile through a plan you read before it runs.',
    flowDetail: 'Inspect inventory and dependencies across five package providers. Save or dry-run the plan, then explicitly confirm changes before execution.',
    status: 'POC',
    statusNote: 'five native executors · platform validation ongoing',
    license: 'MIT / Apache-2.0',
    command: 'pkgx plan -f system.toml',
    repo: 'pkgx',
    site: '/tools/pkgx/',
  },
  {
    id: 'vmanyware',
    name: 'VMAnyware',
    glyph: '◰',
    verb: 'Provision',
    color: '#c38aff',
    line: 'Reproducible environments on your own Proxmox homelab.',
    body:
      'Define an environment once, provision it on Proxmox, then manage and reach it from desktop or mobile. ' +
      'A native client and a self-hosted control plane.',
    step: 'Describe an environment once, provision it on your own Proxmox host, and reach it over SSH from desktop or phone.',
    flowDetail: 'In development: definitions and previews work locally, with isolated start/stop validation. End-to-end provisioning and real VM lifecycle validation are still in progress.',
    status: 'In development',
    statusNote: 'local lifecycle validated · provisioning in progress',
    license: 'MIT / Apache-2.0',
    command: null,
    repo: 'VMAnyware',
    site: '/tools/vmanyware/',
  },
]

export const repoUrl = (t) => `${ORG_URL}/${t.repo}`
