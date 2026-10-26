// Single source of truth for the tools: the home page, the 3D scene and each
// tool's landing page read from here (where that page is: src/pages.ts).
// Statuses are copied from each repo's README and current-state documents;
// keep validation limits explicit.

import type { Lang } from './i18n.ts'

export interface Tool {
  id: string
  name: string
  glyph: string
  verb: string
  color: string
  line: string
  body: string
  step: string
  flowDetail: string
  status: string
  statusNote: string
  license: string
  command: string | null
  repo: string
  repoPrivate?: boolean
  // the same words in French
  fr: Translated
}

// what a tool says about itself, which the French site says in French
type Translated = Pick<Tool, 'verb' | 'line' | 'body' | 'step' | 'flowDetail' | 'status' | 'statusNote'>

export const ORG = 'devutils-org'
export const ORG_URL = `https://github.com/${ORG}`

export const tools: Tool[] = [
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
    status: 'Linux observability',
    statusNote: '9 families · tested on 17 distro images + 5 variants, arm64 and containers',
    license: 'MIT / Apache-2.0',
    command: 'omn top -- ./your-program',
    repo: 'omniscient',
    fr: {
      verb: 'Observer',
      line: 'L’observation de Linux, directement depuis le noyau.',
      body:
        'perf_event_open, eBPF, procfs, sysfs et netlink — sans perf, bpftrace ni bcc en dessous. ' +
        'Chaque chiffre dit ce qu’il a perdu, comment il a été obtenu et jusqu’où on peut s’y fier.',
      step: 'Mesurer un programme ou une machine entière, du processeur à la carte graphique, la mémoire, le réseau et le disque — avec la preuve à côté de chaque chiffre.',
      flowDetail: 'Suivre un programme en direct ou rejouer un enregistrement. Voir où passe le temps, ce qui a été capté et quelles mesures sont hors de portée.',
      status: 'Observabilité Linux',
      statusNote: '9 familles · testé sur 17 images de distributions + 5 variantes, arm64 et conteneurs',
    },
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
    fr: {
      verb: 'Expliquer',
      line: 'Un compagnon Linux pour le terminal.',
      body:
        'La réponse courte d’abord, l’état réel de votre machine ensuite, le « pourquoi » détaillé seulement si vous le voulez. ' +
        'Il n’exécute jamais vos commandes, ne modifie jamais le système et ne touche jamais au réseau.',
      step: 'Demander ce que veut dire un chiffre — mémoire libre ou disponible, un processus zombie, une tempête de swap — et le lire face à l’état de votre machine.',
      flowDetail: 'Une réponse courte d’abord, puis l’explication approfondie. Le compagnon Linux intégré fonctionne hors ligne et ne modifie jamais votre système.',
      status: 'v0.1',
      statusNote: 'binaires x86_64 + aarch64',
    },
  },
  {
    id: 'distroproof',
    name: 'distroproof',
    glyph: '⧉',
    verb: 'Verify',
    color: '#96b9ff',
    line: 'Check that your program holds on every distro.',
    body:
      'Boots VMs on the real kernel of each target distro, runs your program there, and compares failing targets ' +
      'with passing ones using environment facts — libc, BTF, perf policy, lockdown and memlock limits.',
    step: 'Run the same binary on the real kernel of every target distro, and investigate failures with a report of the environment beside each result.',
    flowDetail: 'Compare kernels, libraries and permissions across a VM matrix. Read the environment differences alongside the test results instead of debugging a bare failure.',
    status: 'v0.1',
    statusNote: '20 distro images · Omniscient case study: 27 defects found',
    license: 'MIT / Apache-2.0',
    command: 'distroproof run --target rocky-8 -- envprobe --json',
    repo: 'distroproof',
    fr: {
      verb: 'Vérifier',
      line: 'Vérifier que votre programme tient sur chaque distribution.',
      body:
        'Démarre des machines virtuelles sur le vrai noyau de chaque distribution visée, y lance votre programme, et compare les cibles en échec ' +
        'à celles qui réussissent grâce aux faits de l’environnement — libc, BTF, politique perf, lockdown et limites memlock.',
      step: 'Lancer le même binaire sur le vrai noyau de chaque distribution visée, et comprendre les échecs grâce à un rapport sur l’environnement à côté de chaque résultat.',
      flowDetail: 'Comparer noyaux, bibliothèques et permissions sur une matrice de machines virtuelles. Lire les différences d’environnement à côté des résultats, au lieu de déboguer un échec sans contexte.',
      status: 'v0.1',
      statusNote: '20 images de distributions · étude de cas Omniscient : 27 défauts trouvés',
    },
  },
  {
    id: 'xpac',
    name: 'xpac',
    glyph: '▥',
    verb: 'Reconcile',
    color: '#aea0ff',
    line: 'Package inventory, provenance and conservative plans.',
    body:
      'Lists what is installed and why, explains dependencies, and reconciles packages and dotfiles against a ' +
      'declarative TOML profile — through a plan you can read, save and dry-run first.',
    step: 'Know why each package is there, then converge the machine to a TOML profile through a plan you read before it runs.',
    flowDetail: 'Inspect inventory and dependencies across seven package providers. Save or dry-run the plan, then explicitly confirm changes before execution.',
    status: 'v0.1',
    statusNote: 'seven native executors · signed release binaries',
    license: 'MIT / Apache-2.0',
    command: 'xpac plan -f system.toml',
    repo: 'xpac',
    fr: {
      verb: 'Mettre en ordre',
      line: 'L’inventaire des paquets, leur provenance et des plans prudents.',
      body:
        'Liste ce qui est installé et pourquoi, explique les dépendances, et aligne paquets et fichiers de configuration sur un ' +
        'profil TOML déclaratif — par un plan que vous pouvez lire, enregistrer et simuler d’abord.',
      step: 'Savoir pourquoi chaque paquet est là, puis amener la machine à un profil TOML par un plan que vous lisez avant qu’il s’exécute.',
      flowDetail: 'Inspecter l’inventaire et les dépendances de sept gestionnaires de paquets. Enregistrer ou simuler le plan, puis confirmer explicitement les changements avant leur exécution.',
      status: 'v0.1',
      statusNote: 'sept exécuteurs natifs · binaires de release signés',
    },
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
    flowDetail: 'Native/generated-provider checks cover provisioning, lifecycle, SSH and recovery. Declared packages/final snapshots and recorded stage views pass joined Linux native journeys with explicit review. Current Android runtime and real homelab acceptance remain open.',
    status: 'In development',
    statusNote: 'native/API workflows tested · real homelab acceptance pending',
    license: 'MIT / Apache-2.0',
    command: null,
    repo: 'VMAnyware',
    fr: {
      verb: 'Déployer',
      line: 'Des environnements reproductibles sur votre propre homelab Proxmox.',
      body:
        'Décrivez un environnement une fois, créez-le sur Proxmox, puis gérez-le et accédez-y depuis votre ordinateur ou votre téléphone. ' +
        'Une application native et un serveur de contrôle hébergé chez vous.',
      step: 'Décrire un environnement une fois, le créer sur votre propre serveur Proxmox, et s’y connecter en SSH depuis l’ordinateur ou le téléphone.',
      flowDetail: 'Les parcours natifs et les tests avec fournisseur simulé couvrent création, cycle de vie, SSH et reprise. Paquets, snapshot final et lecture des étapes passent les parcours Linux natifs avec revue explicite. L’APK actuel et le homelab réel restent à valider.',
      status: 'En développement',
      statusNote: 'parcours natifs/API testés · validation réelle en attente',
    },
  },
]

export const repoUrl = (t: Tool) => `${ORG_URL}/${t.repo}`

// the tool as a page in that language describes it
export const inLang = (t: Tool, lang: Lang): Tool => (lang === 'fr' ? { ...t, ...t.fr } : t)
