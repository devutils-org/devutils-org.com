// VMAnyware's landing page. Current progress from STATE.md and README;
// distinguish local validation from real infrastructure evidence.

import type { Page } from './types.ts'

export default {
  id: 'vmanyware',
  nav: [['Idea', '#idea'], ['Today', '#today'], ['Definition', '#definition'], ['Status', '#status']],
  hero: {
    title: ['Your homelab.', 'From anywhere.'],
    copy: 'Your Proxmox homelab, from desktop or mobile.<br />Define a Linux environment once. Recreate it when needed.',
    primary: 'Run it locally',
  },
  sections: [
    {
      type: 'intro',
      id: 'idea',
      scene: 'idea',
      eyebrow: 'THE IDEA / DEFINITION ≠ INSTANCE',
      title: ['Define once.', 'Recreate anytime.'],
      text: 'The environment outlives the VM: delete an instance, keep its definition, recreate it when you need it again.',
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
      title: ['Implemented paths,', 'visible limits.'],
      text: 'Local native and generated-provider evidence, kept separate from real homelab acceptance.',
      cards: [
        { glyph: '▤', label: 'DEFINITIONS', status: 'LOCALLY VALIDATED', tone: 'ok', title: 'Definitions and inspection', text: 'Strict YAML, deterministic hashes and SQLite storage. Inspect saved definitions and explicitly refresh remote VM power state without confusing it with guest readiness.' },
        { glyph: '◇', label: 'PROVISIONING', status: 'GENERATED-PROVIDER TESTS', tone: 'ok', title: 'Create and recreate', text: 'Confirmed clone, resources, Cloud-Init, readiness and retained-definition recreation pass API/worker and native integration checks. Actual Proxmox template and guest acceptance remain open.' },
        { glyph: '▥', label: 'SSH', status: 'NATIVE INTEGRATION', tone: 'ok', title: 'Interactive SSH', text: 'Explicit host-key trust, encrypted application identity and an interactive terminal. Linux terminal checks pass against an owned SSH peer; optional Secret Service unlock-secret controls now pass isolated backend/SSH and browser checks.' },
        { glyph: '⏻', label: 'LIFECYCLE', status: 'NATIVE INTEGRATION', tone: 'ok', title: 'Control and recovery', text: 'Remote start/shutdown, snapshot creation/restore and deletion have generated-provider integration evidence. Durable operation history survives restart without replaying uncertain mutations.' },
        { glyph: '▣', label: 'DECLARED STEPS', status: 'NATIVE INTEGRATION', tone: 'ok', title: 'Packages and final snapshot', text: 'Explicit package and final-snapshot review now passes joined Linux native creation/recreation checks, including lost-reply recovery. Safe failure messages and explicit recorded stage views pass native integration; actual guest installation remains unverified.' },
        { glyph: '⇄', label: 'DELIVERY', status: 'TEST ARTIFACTS', tone: 'wip', title: 'Linux server and Android', text: 'Linux server archives and signed ARM64/x86_64 Android debug APKs are buildable. Current APK execution, real deployment and full platform acceptance remain open; this is not a release candidate.' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'THE MVP / AS THE ROADMAP STATES IT',
      title: ['From a definition', 'to a running VM.'],
      text: 'The main workflows have native/generated-provider evidence. Completing this journey on an approved real guest and the current Android artifact remains the acceptance target.',
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
      title: ['Implemented,', 'still being validated.'],
      text: 'What has been verified, what is pending, and what isn’t built — kept apart.',
      cards: [
        { label: 'VERIFIED', title: 'API, worker and native paths.', text: 'Owned generated-provider checks cover creation/recreation, lifecycle, snapshots, deletion and restart recovery. Linux native SSH uses a generated local peer; these checks do not establish real guest behavior.' },
        { label: 'PENDING', title: 'The home Proxmox journey.', text: 'Actual template/resources, Cloud-Init, package installation, SSH and snapshot guest-state restoration still need an available, explicitly approved disposable Proxmox target.' },
        { label: 'NEXT', title: 'Platform acceptance and key storage.', text: 'Recorded stage views now pass Linux native checks, including the extracted server archive. Refreshed Android APKs have packaging evidence; exact APK execution, joined Linux vault/WebView acceptance, other OS credential stores, iOS/Windows parity and production deployment/release acceptance remain open.' },
        { label: 'BY APPROVAL', title: 'Concrete infrastructure targets.', text: 'Real VM, production or credential changes require approval of their concrete target and operation. Default checks use owned local fixtures without Proxmox credentials.' },
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
} satisfies Page
