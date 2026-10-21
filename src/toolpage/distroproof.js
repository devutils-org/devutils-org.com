// Facts: distroproof REFERENCE.md and omniscient/docs/distroproof.md (October 2026);
// the verdict example is translated into English for this site.

export default {
  id: 'distroproof',
  shape: 'distroproof',
  nav: [['Why', '#why'], ['envprobe', '#envprobe'], ['Terminal', '#terminal'], ['Case study', '#case-study'], ['Targets', '#targets']],
  hero: {
    pill: { href: '#targets', left: '20 DISTRO IMAGES', right: 'THEIR REAL KERNELS →' },
    title: ['Works on my machine.', 'Proven on theirs.'],
    copy: 'Test your binary on real distro kernels.<br />See why it fails elsewhere.',
    product: 'Real QEMU/KVM VMs on official cloud images: the distro’s kernel, not the host’s.<br />Each result carries the environment facts; failing targets are compared with passing ones.',
    primary: 'Build distroproof',
    hud: [['DISTRO.PROOF', 'ONE PROGRAM / EVERY KERNEL'], ['KERNELS 4.15 → 7.2 · GLIBC · MUSL', 'TARGET MATRIX / VM']],
    caption: ['THE DISTRO’S OWN KERNEL', 'PROBED, NEVER INFERRED', 'FACTS BESIDE EACH FAILURE'],
  },
  sections: [
    {
      type: 'intro',
      id: 'why',
      scene: 'why',
      eyebrow: 'WHY IT BREAKS ELSEWHERE',
      title: ['Same binary.', 'Different machine.'],
      text: 'A program that works on your machine can break elsewhere: musl instead of glibc, a RHEL 4.18 kernel, no BTF, <code>perf_event_paranoid</code> at 3, lockdown on…',
      axes: [['ENVPROBE', 'Describe it.'], ['VM', 'Boot the real kernel.'], ['RUN', 'Run your program.'], ['DIFF', 'Compare.'], ['CAUSE', 'Name the difference.']],
      columns: [
        ['Probed, never inferred.', 'Features are tested directly — BPF with real <code>bpf()</code> calls — never deduced from a version number, because RHEL kernels backport a lot.'],
        ['Throwaway by default.', 'Images are downloaded once, checked against the distro’s published checksum and cached. Each run works on a disposable qcow2 overlay, deleted at the end — even after a timeout or Ctrl+C.'],
        ['Reports that fit CI.', 'A table of targets × results in the terminal, and on request <code>--json</code>, <code>--junit</code> for CI and <code>--markdown</code> for a pull-request comment.'],
      ],
    },
    {
      type: 'cards',
      id: 'envprobe',
      scene: 'envprobe',
      eyebrow: 'ENVPROBE / THE PROBE UNDERNEATH',
      title: ['Everything that can', 'change a program.'],
      text: '<code>envprobe</code> lists what can change how a userspace or kernel-facing program behaves. It works on its own, read-only, and reports missing or refused values with their reasons.',
      cards: [
        { glyph: '◎', label: 'IDENTITY', title: 'Identity and machine', text: 'Distro, family, architecture, virtualisation, container; the hardware (CPU, cores, memory, GPUs, disks) and the toolchain (gcc, clang, rustc, go, python…).' },
        { glyph: '⌘', label: 'KERNEL', title: 'Kernel', text: 'Release, command line, config (<code>CONFIG_BPF*</code>, <code>KPROBES</code>, <code>DEBUG_INFO_BTF</code>, <code>FUNCTION_TRACER</code> and dynamic ftrace…), modules.' },
        { glyph: '⛉', label: 'SECURITY', title: 'Security & privileges', text: 'sysctls, LSM, SELinux, AppArmor, lockdown, Secure Boot, capabilities, seccomp, user namespaces and soft/hard <code>RLIMIT_MEMLOCK</code>.' },
        { glyph: '◇', label: 'BPF · PERF', title: 'BPF & perf', text: 'Program types, map types and helpers probed with real <code>bpf()</code> calls; software and hardware <code>perf_event_open</code>, PMU; tracefs, kallsyms, BTF.' },
        { glyph: '▤', label: 'USERSPACE', title: 'Userspace', text: 'libc and its version, common libraries, FHS (merged-usr, multiarch), <code>/bin/sh</code>, coreutils, init, package manager, cgroups, XDG.' },
        { glyph: '✓', label: 'STATUS', title: 'A status per entry', text: '<code>ok</code> with the value, <code>unavailable</code> with the reason, <code>denied</code> when access was refused — and <code>privileged</code> marks what changes with the process’s rights.' },
        { glyph: '{ }', label: 'SCHEMA', title: 'A versioned report', text: 'JSON with a <code>schema_version</code>, and its schema published with the code.', cmd: 'envprobe schema' },
        { glyph: '⧉', label: 'NO VM', title: 'Another distro, without a VM', text: 'Compare another distro’s userspace from its extracted rootfs, in user, mount and pid namespaces, without root. The kernel stays the host’s.', cmd: 'scripts/probe-rootfs.sh <rootfs> <envprobe> --json' },
        { glyph: '▣', label: 'STATIC', title: 'Static binaries', text: 'Built against musl: <code>envprobe</code> runs as is in any x86_64 VM or container.' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'FROM A TOML FILE TO A VERDICT',
      title: ['One matrix.', 'Every target explained.'],
      text: 'Describe the targets once; <code>distroproof up</code> boots them in parallel and tells you what differs where it fails.',
      steps: [
        { glyph: '▤', label: 'DECLARE', title: 'Declare.', code: 'distroproof.toml', text: 'List the targets: an image, plus sysctls, a kernel command line, PMU off or capabilities for the test user. Errors come with line and column, before any VM starts.' },
        { glyph: '⏻', label: 'BOOT', title: 'Boot.', code: 'qemu -S · QMP', text: 'QEMU starts paused, cloud-init unpacks the agent and envprobe. After the first boot, the kernel is extracted and later runs boot directly, in 6 to 13 s.' },
        { glyph: '◉', label: 'PROBE', title: 'Probe.', code: 'envprobe', text: 'The agent applies the sysctls, creates the test user and runs envprobe just before your command, so every result carries its environment.' },
        { glyph: '▶', label: 'RUN', title: 'Run.', code: 'your command', text: 'stdout and stderr are relayed line by line; full outputs, exit codes and the report go to an output disk, then the VM powers off.' },
        { glyph: '⇄', label: 'EXPLAIN', title: 'Explain.', code: 'distroproof up', text: 'Each failing target is compared to the closest passing one, and the suspect difference is named — missing BTF, paranoid at 3, musl…' },
      ],
    },
    {
      type: 'terminal',
      id: 'terminal',
      scene: 'terminal',
      eyebrow: 'IN THE TERMINAL',
      title: ['A failure,', 'with its cause.'],
      text: 'Not “it broke on Ubuntu 18.04” — which difference, out of all of them, is the likely reason.',
      tabs: [
        {
          name: 'Verdict',
          label: 'distroproof up',
          caption: 'A failing target compared to the closest passing one. Example translated into English.',
          text: `[ubuntu-18.04] failed (exit code 1)
  compared with ubuntu-22.04: 65 significant differences
  likely cause: btf.vmlinux: present, 5286152 bytes → unavailable (/sys/kernel/btf/vmlinux missing)
  also: kernel.CONFIG_DEBUG_INFO_BTF: y → missing from config`,
        },
        {
          name: 'Diff',
          label: 'envprobe diff arch.json alpine.json',
          caption: 'An Arch host against an Alpine rootfs on the same kernel. Exit code 1 when they differ.',
          text: `[libc]
- interpreter  /lib/ld-linux-aarch64.so.1
+ interpreter  /lib/ld-musl-aarch64.so.1
- kind         glibc
+ kind         musl

[shell]
- sh         /usr/bin/bash
+ sh         /bin/busybox

[packages]
- managers  pacman
+ managers  apk`,
        },
        {
          name: 'Matrix',
          label: 'distroproof.toml',
          caption: 'Targets, their tweaks, and the command to run on each. Checked without a VM by distroproof check.',
          text: `[[target]]
name = "rhel8"
image = "rocky-8"

[[target]]
name = "ubuntu-paranoid"
image = "ubuntu-22.04"
sysctl = { "kernel.perf_event_paranoid" = 3 }

[[target]]
name = "fedora-lockdown"
image = "fedora-latest"
kernel_cmdline = "lockdown=confidentiality"

[run]
setup = "./scripts/install-deps.sh"   # as root, before the probe
command = "./target/release/mytool --selftest"
as_user = "test"
file_caps = { "target/release/mytool" = ["bpf", "perfmon"] }
collect = ["results/*.json"]`,
        },
      ],
      fine: 'Examples adapted from the distroproof reference, with the verdict translated into English. <code>file_caps</code> grants capabilities to the installed binary after setup; <code>collect</code> brings result files back per target. Setup and command receive <code>DP_TARGET</code> and <code>DP_IMAGE</code>. The TUI adds live logs, report diffs and a console.',
    },
    {
      type: 'table',
      id: 'targets',
      scene: 'targets',
      eyebrow: 'TARGETS / THE KERNELS IT BOOTS',
      title: ['Twenty images.', 'Their own kernels.'],
      text: 'Official cloud images on their own kernels. Versions below were observed in the October 2026 case study; rolling and daily images change.',
      head: ['Image', 'Kernel observed', 'Note'],
      rows: [
        ['debian-10 · 11 · 12 · 13', '4.19 · 5.10 · 6.1 · 6.12', '4.19 without BTF; 13 boots in UEFI'],
        ['ubuntu-18.04 · 20.04 · 22.04 · 24.04', '4.15 · 5.4 · 5.15 · 6.8', '4.15 without BTF'],
        ['rocky-8 · 9', '4.18 · 5.14', 'RHEL kernels with backports; 9 boots in UEFI'],
        ['debian-sid', '7.2.11', 'daily image; UEFI'],
        ['fedora-previous · fedora-latest', '6.17 · 6.19 (Fedora 43 · 44)', 'releases resolved online'],
        ['arch', '7.2.9 in the case study', 'rolling'],
        ['gentoo', '6.18 dist-kernel', 'OpenRC; UEFI'],
        ['alpine', '6.18 virt', 'musl, busybox'],
        ['nixos', '6.12 (NixOS 25.05)', 'Hydra’s Proxmox image; no FHS paths'],
        ['aarch64: debian-13 · ubuntu-24.04 · fedora-latest', 'their own arm64 kernels', 'emulated on an x86_64 host'],
      ],
      fine: 'Host needs <code>qemu-system-x86_64</code>, <code>qemu-img</code>, <code>curl</code>, KVM (falls back to TCG without <code>/dev/kvm</code>) and OVMF for the UEFI-only images.',
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / BUILT FOR LINUX',
      title: ['Prove it holds', 'before they find out.'],
      text: 'Download the static binaries, then run your first target.',
      installLabel: 'DOWNLOAD · STATIC X86_64 BINARIES',
      install: `v=v0.1.0 t=x86_64-unknown-linux-musl
curl -LO https://github.com/devutils-org/distroproof/releases/download/$v/distroproof-$v-$t.tar.gz
gh attestation verify distroproof-$v-$t.tar.gz --repo devutils-org/distroproof
tar xzf distroproof-$v-$t.tar.gz && export PATH="$PWD/distroproof-$v-$t:$PATH"

# then
distroproof run --target rocky-8 -- envprobe --json > rocky8.json
distroproof up       # the matrix in distroproof.toml`,
      small: 'v0.1: probe, VM matrix, reports and TUI · signed x86_64 and aarch64 releases · MIT / Apache-2.0',
    },
  ],
}
