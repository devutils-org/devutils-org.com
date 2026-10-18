// pkgx's landing page. Facts and commands from the pkgx README and
// docs/manifest.md; it shows no command output, so neither does this page.

export default {
  id: 'pkgx',
  shape: 'pkgx',
  nav: [['Inventory', '#inventory'], ['Commands', '#commands'], ['Terminal', '#terminal'], ['Status', '#status']],
  hero: {
    pill: { href: '#inventory', left: 'APT · PACMAN · RPM/DNF · FLATPAK · HOMEBREW', right: 'ONE INVENTORY →' },
    title: ['Every package.', 'Every reason.'],
    copy: 'Know what is installed and why.<br />Change packages and dotfiles only through a plan you have read.',
    product: 'Native package inventory, provenance, conservative plans and declarative TOML reconciliation.<br />Inspection needs no root and never refreshes repositories.',
    primary: 'Build pkgx',
    hud: [['PKGX.INVENTORY', 'FIVE PROVIDERS / ONE VIEW'], ['PLAN · REVIEW · CONFIRM', 'NOTHING IMPLICIT']],
    caption: ['INSPECT WITHOUT ROOT', 'PLAN BEFORE YOU ACT', 'NO IMPLICIT FALLBACK'],
  },
  sections: [
    {
      type: 'intro',
      id: 'inventory',
      scene: 'inventory',
      eyebrow: 'ONE INVENTORY / FIVE PACKAGE MANAGERS',
      title: ['Read the system.', 'Then decide.'],
      text: 'Identities keep their provider, architecture and scope: <code>apt:curl:amd64</code> is not just “curl”.',
      axes: [['LIST', 'What is installed?'], ['WHY', 'Who asked for it?'], ['DEPS', 'What does it need?'], ['PLAN', 'What would change?'], ['APPLY', 'Only what you approved.']],
      columns: [
        ['Native, not guessed.', 'Consultation is implemented for APT, Pacman, RPM/DNF, Flatpak (default user and system) and Homebrew formulae and casks. There is no implicit fallback from one provider to another.'],
        ['Plans that expire.', 'A saved plan expires, and must match a fresh native plan before it runs — so you never apply a plan the system has moved past.'],
        ['Declarative, additive.', 'TOML manifests with profiles and platform layers that compose deterministically, for packages and home configuration files. Unknown fields fail before execution; additive mode keeps software you didn’t declare.'],
      ],
    },
    {
      type: 'cards',
      id: 'commands',
      scene: 'commands',
      eyebrow: 'COMMANDS / INSPECT FIRST',
      title: ['Most of it', 'only reads.'],
      text: 'Inventory, provenance, dependencies and audit are read-only. Package changes and cache/orphan cleanup require an explicit preview and confirmation.',
      cards: [
        { glyph: '▤', label: 'INVENTORY', title: 'Inventory', text: 'What is installed, per provider, with identities that keep architecture and scope.', cmd: 'pkgx list --provider apt --json' },
        { glyph: '?', label: 'PROVENANCE', title: 'Why it’s there', text: 'The installation reason behind a package: explicit, dependency, or unknown.', cmd: 'pkgx why apt:curl:amd64' },
        { glyph: '⑂', label: 'DEPS', title: 'Dependencies', text: 'Installed native expressions for APT, Pacman, RPM and Homebrew formulae, alternatives and constraints kept. Metadata, not a cross-provider graph.', cmd: 'pkgx deps apt:curl:amd64' },
        { glyph: '⇥', label: 'EXPORT', title: 'Export & diff', text: 'Write the inventory as TOML, atomically, and compare a machine to a manifest. An exported inventory is not a lockfile.', cmd: 'pkgx diff -f examples/profiles.toml --profile dev' },
        { glyph: '◇', label: 'PLAN', title: 'Plans', text: 'What applying a manifest or an install would change — saved, reviewed, and set to expire.', cmd: 'pkgx plan -f system.toml' },
        { glyph: '▶', label: 'APPLY', title: 'Apply', text: 'APT, Pacman, DNF5, Flatpak and Homebrew formulae, after a preview and an interactive yes or an explicit <code>--yes</code>. Non-interactive without <code>--yes</code> is refused.', cmd: 'pkgx apply --plan preview.json --dry-run' },
        { glyph: '⌕', label: 'AUDIT', title: 'Audit & clean', text: 'Audit and dry-runs classify caches and orphans. Explicit cache cleanup and reviewed orphan removal are available for APT and Pacman; pkgx never deletes configuration, home data or unmanaged paths itself.', cmd: 'pkgx audit --provider apt' },
        { glyph: '▥', label: 'TUI', title: 'Terminal UI', text: 'Two panes after atfq, confidence cues after Omniscient. Read-only by default; <code>--allow-apply</code> enables experimental APT operations.', cmd: 'pkgx tui --provider apt' },
        { glyph: '◎', label: 'FILES · EXPERIMENTAL', title: 'Configuration files', text: 'Declare dotfiles under your home next to your packages. An existing file is never overwritten until you adopt it, with a private backup; local edits are reported as drift and refused. pkgx never deletes them.', cmd: 'pkgx file adopt ~/.tmux.conf --dry-run' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'FROM A MANIFEST TO A MACHINE',
      title: ['Nothing changes', 'without a plan.'],
      text: 'Reconciling a machine with a TOML manifest is a sequence of checks, each of which can stop it.',
      steps: [
        { glyph: '▤', label: 'DECLARE', title: 'Declare.', code: 'system.toml', text: 'Describe the packages and home configuration files a machine should have, with profiles and platform layers. Unknown fields and incompatible operations fail before anything runs.' },
        { glyph: '⇄', label: 'COMPARE', title: 'Compare.', code: 'pkgx diff -f', text: 'See how the machine differs from the manifest, read-only, without refreshing repositories. Each file is reported as missing, in sync, outdated or drifted.' },
        { glyph: '◇', label: 'PLAN', title: 'Plan.', code: '--save preview.json', text: 'Save the native plan with an expiry. Before it runs, it must still match a fresh native plan.' },
        { glyph: '✓', label: 'CONFIRM', title: 'Confirm.', code: 'yes / --yes', text: 'A preview and an interactive yes, or an explicit --yes. The plan is revalidated after confirmation; privileges only with an explicit --sudo.' },
        { glyph: '▣', label: 'RECORD', title: 'Record.', code: 'journal', text: 'A private transaction journal records intent and verified results, and each written file gets a receipt. A partial failure is reported as such — never as an implied rollback.' },
      ],
    },
    {
      type: 'terminal',
      id: 'terminal',
      scene: 'terminal',
      eyebrow: 'IN THE TERMINAL',
      title: ['Inspect.', 'Then reconcile.'],
      text: 'The commands as the README gives them. JSON goes to stdout with <code>schema_version 1</code>; previews and prompts go to stderr.',
      tabs: [
        {
          name: 'Inspect',
          label: 'pkgx · read-only',
          caption: 'Inventory, search, information, provenance and dependencies — no root needed, no repository refresh.',
          text: `$ pkgx providers
$ pkgx list --provider apt --json
$ pkgx search curl --provider dnf --installed
$ pkgx info apt:curl
$ pkgx why apt:curl:amd64
$ pkgx deps apt:curl:amd64`,
        },
        {
          name: 'Reconcile',
          label: 'pkgx · plans',
          caption: 'Export, compare, plan with an expiry, then apply — dry-run first.',
          text: `$ pkgx export --provider apt -o system.toml
$ pkgx diff -f examples/profiles.toml --profile dev
$ pkgx plan -f system.toml
$ pkgx plan apt:curl --save preview.json --expires-in 300
$ pkgx apply --plan preview.json --dry-run
$ pkgx install apt:hello --sudo --dry-run   # privileges only when asked`,
        },
        {
          name: 'Files',
          label: 'system.toml · experimental',
          caption: 'A dotfile declared beside its packages, adopted once, then written on apply with its own confirmation.',
          text: `[packages.apt]
install = ["tmux"]

[files."~/.tmux.conf"]
source = "dotfiles/tmux.conf"   # relative to the manifest
mode = "0644"

$ pkgx file adopt ~/.tmux.conf --dry-run
$ pkgx file adopt ~/.tmux.conf      # keeps a private backup
$ pkgx apply -f system.toml
$ pkgx file forget ~/.tmux.conf     # drops the receipt, keeps the file`,
        },
        {
          name: 'Demo',
          label: 'pkgx demo',
          caption: 'Five synthetic packages, on Linux or macOS, without a native package manager.',
          text: `$ pkgx demo                     # the TUI on synthetic data
$ pkgx demo --snapshot --json   # the same, non-interactive

# in the TUI: /curl, Enter, i, Esc, Tab to change provider, q to quit`,
        },
      ],
      fine: 'Shown as commands only: the README doesn’t publish their output, and this page doesn’t invent it.',
    },
    {
      type: 'receipts',
      id: 'status',
      scene: 'status',
      eyebrow: 'WHERE IT STANDS',
      title: ['Proof of concept,', 'validation ongoing.'],
      text: 'pkgx changes packages, so it is explicit about what has been checked and what hasn’t.',
      cards: [
        { label: 'EXPERIMENTAL EXECUTION', title: 'Five native executors.', text: 'Reviewed execution is implemented for APT, Pacman, DNF5, Flatpak and Homebrew formulae. Provider-specific previews and revalidation remain explicit; other native executors are unsupported.' },
        { label: 'DISPOSABLE VALIDATION', title: 'Tested in isolated roots.', text: 'APT, Pacman and DNF5 transactions have run in disposable roots. Flatpak and Linux Homebrew also have isolated native evidence. Configuration files are tested only against temporary home directories. Host package transactions remain untested; configured CI runs and native macOS validation are pending.' },
        { label: 'PRIVILEGES ONLY WHEN ASKED', title: 'sudo is explicit.', text: 'Inspection never elevates. <code>--sudo</code> delegates only the reviewed APT or Pacman transaction; pkgx never reads a password from stdin, and dry-runs never authenticate.', pre: '$ pkgx install apt:hello --sudo --dry-run\n$ pkgx install apt:hello --sudo' },
        { label: 'NO ROLLBACK PROMISED', title: 'Failures stay visible.', text: 'Partial failures never imply rollback. The journal records what was intended and what was verified, so you can see exactly where it stopped.' },
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / LINUX AND MACOS',
      title: ['Know your packages', 'before you touch them.'],
      text: 'Build it, then start with the demo — no native package manager needed.',
      installLabel: 'BUILD · FROM SOURCE',
      install: `cargo build --release --locked -p pkgx-cli

# then
pkgx demo
pkgx list --provider apt --json`,
      small: 'Try real transactions only in disposable environments · MIT / Apache-2.0',
    },
  ],
}
