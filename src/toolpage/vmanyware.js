// VMAnyware's landing page. Current progress from STATE.md and README;
// distinguish local validation from real infrastructure evidence.

export default {
  id: 'vmanyware',
  shape: 'vmanyware',
  nav: [['Idea', '#idea'], ['Today', '#today'], ['Definition', '#definition'], ['Status', '#status']],
  hero: {
    pill: { href: '#status', left: 'IN DEVELOPMENT', right: 'PROVISIONING IN PROGRESS →' },
    title: ['Your homelab.', 'From anywhere.'],
    copy: 'Define a Linux environment once, provision it on your own Proxmox,<br />and reach it from your desktop or your phone.',
    product: 'A native client and a self-hosted control plane for reproducible environments.<br />Proxmox credentials stay on the control plane; SSH stays on your clients.',
    primary: 'Run it locally',
    hud: [['VM.ANYWARE', 'ONE DEFINITION / ANY DEVICE'], ['PROXMOX · TAURI · SSH', 'CONTROL PLANE / CLIENT']],
    caption: ['DEFINE ONCE', 'PROVISION ON YOUR HARDWARE', 'REACH IT ANYWHERE'],
  },
  sections: [
    {
      type: 'intro',
      id: 'idea',
      scene: 'idea',
      eyebrow: 'THE IDEA / DEFINITION ≠ INSTANCE',
      title: ['Define once.', 'Recreate anytime.'],
      text: 'The environment outlives the VM: delete an instance, keep its definition, recreate it when you need it again.',
      axes: [['DEFINE', 'A YAML definition.'], ['PROVISION', 'On your Proxmox.'], ['START', 'When you need it.'], ['CONNECT', 'Over SSH.'], ['SNAPSHOT', 'Keep a state.']],
      columns: [
        ['Self-hosted first.', 'Your own Proxmox VE host or cluster, and no mandatory vendor cloud or account service. Proxmox is the first provider, behind an adapter — not the domain model.'],
        ['Reproducible, not magic.', 'Inputs, image and template versions, provisioning steps and limitations are explicit. Definitions are validated strictly and never executed implicitly.'],
        ['Secure by default.', 'Least-privilege Proxmox credentials, verified TLS and SSH host keys, and no Proxmox admin API exposed. Clients connect over your LAN or VPN.'],
      ],
    },
    {
      type: 'cards',
      id: 'today',
      scene: 'today',
      eyebrow: 'WHAT RUNS TODAY',
      title: ['Early pieces,', 'labelled as such.'],
      text: 'Each piece with what it is today — working locally, a prototype, or not built yet.',
      cards: [
        { glyph: '▤', label: 'DEFINITIONS', status: 'WORKS LOCALLY', tone: 'ok', title: 'YAML definitions', text: 'Edit, validate, save and reload reusable definitions without Proxmox. The server checks the schema and stores them in SQLite, without creating VMs.' },
        { glyph: '◎', label: 'INVENTORY', status: 'READ-ONLY', tone: 'wip', title: 'Proxmox inventory', text: 'The native client lists Proxmox nodes and templates through the control plane. A read-only Rust probe has been verified against a disposable Proxmox lab; automated provider tests use localhost TLS fixtures.' },
        { glyph: '◇', label: 'PREVIEW', status: 'PREVIEW ONLY', tone: 'wip', title: 'Provisioning preview', text: 'An offline plan from your image-to-template catalog that never reserves or creates a VM, plus read-only preflight checks against Proxmox.' },
        { glyph: '⟳', label: 'OPERATIONS', status: 'WORKS LOCALLY', tone: 'ok', title: 'Background operations', text: 'Inventory refreshes run as persisted background operations, with status polling, idempotent requests and recovery after a restart.' },
        { glyph: '▥', label: 'SSH', status: 'PROTOTYPE · MACOS', tone: 'wip', title: 'SSH terminal', text: 'A graphical terminal on a bounded native PTY transport, with a persistent host-trust policy and an agent authentication check.' },
        { glyph: '⏻', label: 'LIFECYCLE', status: 'LOCALLY VALIDATED', tone: 'wip', title: 'Start and stop', text: 'Explicit confirmation, durable actions and monitoring for start and graceful shutdown pass an isolated Linux native UI/IPC walkthrough. Real VM lifecycle writes and snapshot/restore remain unverified; provisioning is in progress.' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'THE MVP / AS THE ROADMAP STATES IT',
      title: ['From a definition', 'to a running VM.'],
      text: 'The end-to-end target: definitions and previews work locally, start/stop has isolated native validation, and provisioning and snapshots remain in development.',
      steps: [
        { glyph: '⇄', label: 'CONNECT', title: 'Connect.', code: 'control plane', text: 'Connect the app to your self-hosted control plane, and the control plane to one Proxmox VE host or cluster.' },
        { glyph: '▤', label: 'DEFINE', title: 'Define.', code: 'Environment', text: 'Create a Debian-based environment from a prepared Proxmox template, with its CPU, memory, disk and SSH public key.' },
        { glyph: '◇', label: 'PROVISION', title: 'Provision.', code: 'cloud-init', text: 'Follow provisioning as a tracked job until the VM is ready — no long blocking request.' },
        { glyph: '▶', label: 'USE', title: 'Use.', code: 'ssh', text: 'Start and stop the VM, and connect over SSH from desktop and mobile where the network allows.' },
        { glyph: '▣', label: 'KEEP', title: 'Keep.', code: 'snapshot', text: 'Create and restore snapshots; delete the instance while keeping its definition, then recreate it.' },
      ],
      fine: 'The MVP outcome from VMAnyware.md; current implementation and validation boundaries are tracked in STATE.md.',
    },
    {
      type: 'terminal',
      id: 'definition',
      scene: 'definition',
      eyebrow: 'A DEFINITION',
      title: ['An environment', 'is a file.'],
      text: 'Versioned YAML, validated strictly by the control plane, stored independently of any VM.',
      tabs: [
        {
          name: 'Environment',
          label: 'examples/kernel-lab.yaml',
          caption: 'A Linux development environment: image, resources, cloud-init, packages and lifecycle.',
          text: `apiVersion: vmanyware.dev/v1
kind: Environment
metadata:
  name: kernel-lab
  description: Linux development environment
spec:
  image: debian-13
  resources:
    cpu: 4
    memoryMiB: 8192
    diskGiB: 40
  provisioning:
    cloudInit: true
    sshAuthorizedKeys:
      - ssh-ed25519 AAAAC3Nz… vmanyware-example
    packages:
      - build-essential
      - git
  lifecycle:
    snapshotAfterProvisioning: false`,
        },
        {
          name: 'Templates',
          label: 'examples/templates.yaml',
          caption: 'The explicit image-to-template catalog the provisioning preview reads. Example values, not verified against a real homelab.',
          text: `apiVersion: vmanyware.dev/v1
kind: TemplateCatalog
images:
  - image: debian-13
    node: pve-test
    templateVmid: 9000
    templateVersion: debian-13-cloud-20261016
    storage: local-lvm
    bridge: vmbr0
    diskDevice: scsi0
    sourceDiskGiB: 8
    guestUser: debian`,
        },
        {
          name: 'Develop',
          label: 'make',
          caption: 'The local demo: the API in one terminal, the native window in another.',
          text: `$ make doctor           # local tool availability, no credentials or network
$ make install-client
$ make server           # local Axum API on 127.0.0.1:8080
$ make dev              # native Tauri window
$ make check            # frontend build/tests, Rust fmt/clippy/tests`,
        },
      ],
      fine: 'From the repository’s examples/ and README; the public demonstration key is shortened here.',
    },
    {
      type: 'receipts',
      id: 'status',
      scene: 'status',
      eyebrow: 'STATUS / IN DEVELOPMENT',
      title: ['Early,', 'and honest about it.'],
      text: 'What has been verified, what is pending, and what isn’t built — kept apart.',
      cards: [
        { label: 'VERIFIED', title: 'Builds and passes locally.', text: 'Frontend and Rust checks have local evidence on macOS and Linux. An isolated Linux walkthrough exercises the real Tauri UI, IPC, Axum service and generated-HTTPS provider for start and graceful shutdown.' },
        { label: 'PENDING', title: 'Real Proxmox, real guests.', text: 'Read-only lab probing is verified. Actual provisioning, real VM lifecycle writes, snapshot/restore and normal packaged startup remain unverified.' },
        { label: 'IN PROGRESS', title: 'Provisioning and distribution.', text: 'Full-clone transport, durable provisioning intents and a journal have local test evidence. End-to-end VM creation is unfinished; signing, installers and mobile projects remain pending.' },
        { label: 'BY APPROVAL', title: 'Nothing changes on its own.', text: 'Further VM or credential changes on the lab require approval of their concrete target and operation. Tests never run destructively against an unconfirmed host.' },
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / IN DEVELOPMENT',
      title: ['Try the local demo', 'without Proxmox.'],
      text: 'Run the API and the native window side by side, then check the local service.',
      installLabel: 'RUN LOCALLY · FROM THE REPOSITORY ROOT',
      install: `make doctor
make install-client
make server      # in one terminal
make dev         # in another, then click "Check local service"`,
      small: 'Node.js 22.12+, Rust 1.99.1 and the Tauri prerequisites · iOS needs Xcode, Android its SDK/NDK',
    },
  ],
}
