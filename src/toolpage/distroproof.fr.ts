// La page de distroproof en français : la même que distroproof.ts, section
// pour section (src/site.test.ts le vérifie). Les sorties du terminal et les
// fichiers de configuration restent ceux du programme, en anglais.

import type { Page } from './types.ts'

export default {
  id: 'distroproof',
  lang: 'fr',
  nav: [['Pourquoi', '#why'], ['envprobe', '#envprobe'], ['Terminal', '#terminal'], ['Étude de cas', '#case-study'], ['Cibles', '#targets']],
  hero: {
    title: ['Ça marche chez moi.', 'Prouvé chez eux.'],
    copy: 'Testez votre programme sur les vrais noyaux des distributions.<br />Voyez pourquoi il échoue ailleurs.',
    primary: 'Installer distroproof',
  },
  sections: [
    {
      type: 'intro',
      id: 'why',
      scene: 'why',
      eyebrow: 'POURQUOI ÇA CASSE AILLEURS',
      title: ['Le même programme.', 'Une autre machine.'],
      text: 'Un programme qui marche sur votre machine peut casser ailleurs : musl au lieu de glibc, un noyau RHEL 4.18, pas de BTF, <code>perf_event_paranoid</code> à 3, le lockdown activé…',
      columns: [
        ['Testé, jamais deviné.', 'Les fonctionnalités sont testées directement — BPF avec de vrais appels <code>bpf()</code> — et jamais déduites d’un numéro de version, car les noyaux RHEL reçoivent beaucoup de rétroportages.'],
        ['Jetable par défaut.', 'Les images sont téléchargées une fois, vérifiées avec la somme de contrôle publiée par la distribution, puis mises en cache. Chaque exécution travaille sur une copie qcow2 jetable, supprimée à la fin — même après un délai dépassé ou un Ctrl+C.'],
        ['Des rapports prêts pour la CI.', 'Un tableau cibles × résultats dans le terminal et, sur demande, <code>--json</code>, <code>--junit</code> pour la CI et <code>--markdown</code> pour un commentaire de pull request.'],
      ],
    },
    {
      type: 'cards',
      id: 'envprobe',
      scene: 'envprobe',
      eyebrow: 'ENVPROBE / LA SONDE EN DESSOUS',
      title: ['Tout ce qui peut', 'changer un programme.'],
      text: '<code>envprobe</code> recense ce qui peut changer le comportement d’un programme, côté utilisateur comme côté noyau. Il fonctionne seul, en lecture seule, et signale les valeurs absentes ou refusées avec leur raison.',
      cards: [
        { glyph: '◎', label: 'IDENTITÉ', title: 'Identité et machine', text: 'Distribution, famille, architecture, virtualisation, conteneur ; le matériel (processeur, cœurs, mémoire, cartes graphiques, disques) et les outils de compilation (gcc, clang, rustc, go, python…).' },
        { glyph: '⌘', label: 'NOYAU', title: 'Noyau', text: 'Version, ligne de commande, configuration (<code>CONFIG_BPF*</code>, <code>KPROBES</code>, <code>DEBUG_INFO_BTF</code>, <code>FUNCTION_TRACER</code> et ftrace dynamique…), modules.' },
        { glyph: '⛉', label: 'SÉCURITÉ', title: 'Sécurité et droits', text: 'sysctls, LSM, SELinux, AppArmor, lockdown, Secure Boot, capacités, seccomp, espaces de noms utilisateur et <code>RLIMIT_MEMLOCK</code> souple et stricte.' },
        { glyph: '◇', label: 'BPF · PERF', title: 'BPF et perf', text: 'Types de programmes, types de tables et helpers testés avec de vrais appels <code>bpf()</code> ; <code>perf_event_open</code> logiciel et matériel, PMU ; tracefs, kallsyms, BTF.' },
        { glyph: '▤', label: 'ESPACE UTILISATEUR', title: 'Espace utilisateur', text: 'La libc et sa version, les bibliothèques courantes, l’arborescence FHS (merged-usr, multiarch), <code>/bin/sh</code>, coreutils, init, gestionnaire de paquets, cgroups, XDG.' },
        { glyph: '✓', label: 'STATUT', title: 'Un statut pour chaque entrée', text: '<code>ok</code> avec la valeur, <code>unavailable</code> avec la raison, <code>denied</code> quand l’accès a été refusé — et <code>privileged</code> signale ce qui change selon les droits du processus.' },
        { glyph: '{ }', label: 'SCHÉMA', title: 'Un rapport versionné', text: 'Du JSON avec un <code>schema_version</code>, et son schéma publié avec le code.', cmd: 'envprobe schema' },
        { glyph: '⧉', label: 'SANS VM', title: 'Une autre distribution, sans machine virtuelle', text: 'Comparez l’espace utilisateur d’une autre distribution à partir de son système de fichiers extrait, dans des espaces de noms utilisateur, montage et pid, sans root. Le noyau reste celui de la machine hôte.', cmd: 'scripts/probe-rootfs.sh <rootfs> <envprobe> --json' },
        { glyph: '▣', label: 'STATIQUE', title: 'Des binaires statiques', text: 'Compilé avec musl : <code>envprobe</code> tourne tel quel dans n’importe quelle machine virtuelle ou conteneur x86_64.' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'D’UN FICHIER TOML À UN VERDICT',
      title: ['Une matrice.', 'Chaque cible expliquée.'],
      text: 'Décrivez les cibles une fois ; <code>distroproof up</code> les démarre en parallèle et vous dit ce qui diffère là où ça échoue.',
      steps: [
        { glyph: '▤', label: 'DÉCLARER', title: 'Déclarer.', code: 'distroproof.toml', text: 'Listez les cibles : une image, plus des sysctls, une ligne de commande du noyau, la PMU désactivée ou des capacités pour l’utilisateur de test. Les erreurs sont signalées avec ligne et colonne, avant le démarrage de la moindre machine.' },
        { glyph: '⏻', label: 'DÉMARRER', title: 'Démarrer.', code: 'qemu -S · QMP', text: 'QEMU démarre en pause, cloud-init installe l’agent et envprobe. Après le premier démarrage, le noyau est extrait et les exécutions suivantes démarrent directement, en 6 à 13 s.' },
        { glyph: '◉', label: 'SONDER', title: 'Sonder.', code: 'envprobe', text: 'L’agent applique les sysctls, crée l’utilisateur de test et lance envprobe juste avant votre commande : chaque résultat est accompagné de son environnement.' },
        { glyph: '▶', label: 'EXÉCUTER', title: 'Exécuter.', code: 'your command', text: 'stdout et stderr sont relayés ligne par ligne ; les sorties complètes, les codes de sortie et le rapport vont sur un disque de sortie, puis la machine s’éteint.' },
        { glyph: '⇄', label: 'EXPLIQUER', title: 'Expliquer.', code: 'distroproof up', text: 'Chaque cible en échec est comparée à la plus proche qui réussit, et la différence suspecte est nommée — BTF absent, paranoid à 3, musl…' },
      ],
    },
    {
      type: 'terminal',
      id: 'terminal',
      scene: 'terminal',
      eyebrow: 'DANS LE TERMINAL',
      title: ['Un échec,', 'avec sa cause.'],
      text: 'Pas « ça a cassé sur Ubuntu 18.04 » — mais quelle différence, parmi toutes, en est la cause probable.',
      tabs: [
        {
          name: 'Verdict',
          label: 'distroproof up',
          caption: 'Une cible en échec comparée à la plus proche qui réussit. Sortie du programme, en anglais.',
          text: `[ubuntu-18.04] failed (exit code 1)
  compared with ubuntu-22.04: 65 significant differences
  likely cause: btf.vmlinux: present, 5286152 bytes → unavailable (/sys/kernel/btf/vmlinux missing)
  also: kernel.CONFIG_DEBUG_INFO_BTF: y → missing from config`,
        },
        {
          name: 'Différences',
          label: 'envprobe diff arch.json alpine.json',
          caption: 'Une machine Arch face au système de fichiers d’une Alpine, sur le même noyau. Code de sortie 1 quand ils diffèrent.',
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
          name: 'Matrice',
          label: 'distroproof.toml',
          caption: 'Les cibles, leurs réglages, et la commande à lancer sur chacune. Vérifié sans machine virtuelle par distroproof check.',
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
      fine: 'Exemples tirés de la référence de distroproof. <code>file_caps</code> donne des capacités au binaire installé après la préparation ; <code>collect</code> rapporte des fichiers de résultats pour chaque cible. La préparation et la commande reçoivent <code>DP_TARGET</code> et <code>DP_IMAGE</code>. L’interface du terminal ajoute les journaux en direct, les différences entre rapports et une console.',
    },
    {
      type: 'table',
      id: 'targets',
      scene: 'targets',
      eyebrow: 'CIBLES / LES NOYAUX QU’IL DÉMARRE',
      title: ['Vingt images.', 'Leurs propres noyaux.'],
      text: 'Les images cloud officielles, sur leurs propres noyaux. Les versions ci-dessous ont été observées lors de l’étude de cas d’octobre 2026 ; les images en continu et quotidiennes changent.',
      head: ['Image', 'Noyau observé', 'Remarque'],
      rows: [
        ['debian-10 · 11 · 12 · 13', '4.19 · 5.10 · 6.1 · 6.12', '4.19 sans BTF ; 13 démarre en UEFI'],
        ['ubuntu-18.04 · 20.04 · 22.04 · 24.04', '4.15 · 5.4 · 5.15 · 6.8', '4.15 sans BTF'],
        ['rocky-8 · 9', '4.18 · 5.14', 'noyaux RHEL avec rétroportages ; 9 démarre en UEFI'],
        ['debian-sid', '7.2.11', 'image quotidienne ; UEFI'],
        ['fedora-previous · fedora-latest', '6.17 · 6.19 (Fedora 43 · 44)', 'versions résolues en ligne'],
        ['arch', '7.2.9 lors de l’étude de cas', 'en continu'],
        ['gentoo', '6.18 dist-kernel', 'OpenRC ; UEFI'],
        ['alpine', '6.18 virt', 'musl, busybox'],
        ['nixos', '6.12 (NixOS 25.05)', 'l’image Proxmox de Hydra ; pas de chemins FHS'],
        ['aarch64 : debian-13 · ubuntu-24.04 · fedora-latest', 'leurs propres noyaux arm64', 'émulés sur une machine x86_64'],
      ],
      fine: 'La machine hôte a besoin de <code>qemu-system-x86_64</code>, <code>qemu-img</code>, <code>curl</code>, de KVM (sinon TCG, sans <code>/dev/kvm</code>) et d’OVMF pour les images uniquement UEFI.',
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / CONÇU POUR LINUX',
      title: ['Prouvez que ça tient', 'avant qu’ils ne le découvrent.'],
      text: 'Téléchargez les binaires statiques, puis lancez votre première cible.',
      installLabel: 'TÉLÉCHARGER · BINAIRES STATIQUES X86_64',
      install: `v=v0.1.0 t=x86_64-unknown-linux-musl
curl -LO https://github.com/devutils-org/distroproof/releases/download/$v/distroproof-$v-$t.tar.gz
gh attestation verify distroproof-$v-$t.tar.gz --repo devutils-org/distroproof
tar xzf distroproof-$v-$t.tar.gz && export PATH="$PWD/distroproof-$v-$t:$PATH"

# then
distroproof run --target rocky-8 -- envprobe --json > rocky8.json
distroproof up       # the matrix in distroproof.toml`,
      small: 'v0.1 : sonde, matrice de machines virtuelles, rapports et interface terminal · versions x86_64 et aarch64 signées · MIT / Apache-2.0',
    },
  ],
} satisfies Page
