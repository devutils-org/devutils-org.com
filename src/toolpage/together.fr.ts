// La page Ensemble (Together) en français : la même que together.ts, section
// pour section (src/site.test.ts le vérifie). Le tableau des résultats vient
// des mêmes exécutions (chain-runs.json), dit en français.

import { icon } from '../html.ts'
import { chainResults } from './chain-results.ts'
import runs from './chain-runs.json' with { type: 'json' }
import type { Page } from './types.ts'

const arrow = icon('arrow-up-right')

const { summary, run, ...results } = chainResults(runs, {
  order: ['chain-debian-12', 'chain-debian-13', 'chain-ubuntu-24.04', 'chain-ubuntu-18.04', 'chain-fedora-latest', 'chain-rocky-9', 'chain-arch', 'chain-alpine', 'chain-gentoo'],
  newest: 'atfq et envprobe doivent décrire la machine de la même façon',
  lang: 'fr',
})

export default {
  lang: 'fr',
  meta: {
    id: 'together',
    name: 'Ensemble',
    line: 'Comment les outils se vérifient entre eux.',
    color: '#9cc8ff',
    repoUrl: 'https://github.com/devutils-org',
    license: 'MIT / Apache-2.0',
  },
  nav: [['Le principe', '#principle'], ['Croisements', '#crossings'], ['Ce site', '#site'], ['La chaîne', '#chain'], ['Résultats', '#results'], ['Le contrat', '#contract']],
  hero: {
    title: ['Cinq outils.', 'Qui se vérifient.'],
    copy: 'distroproof éprouve Omniscient et xpac sur de vrais noyaux. xpac installe ce à quoi Omniscient se compare.<br />Omniscient mesure VMAnyware, et atfq est confronté à procfs.',
    primary: 'Lancer la chaîne',
  },
  sections: [
    {
      type: 'intro',
      id: 'principle',
      scene: 'principle',
      eyebrow: 'LE PRINCIPE',
      title: ['Aucun outil ne dépend d’un autre.', 'Ils se rencontrent par des fichiers.'],
      text: 'Aucun des cinq n’inclut le code d’un autre. Ils se croisent là où la sortie d’un outil devient l’entrée d’un autre : un rapport JSON, une matrice TOML, un code de sortie, une réponse MCP. Chaque croisement est un test qui peut échouer.',
      columns: [
        ['Un outil en teste un autre.', 'distroproof démarre les distributions ; Omniscient et xpac sont ce qu’il y fait tourner. Chaque campagne a trouvé des défauts que la machine de développement n’avait jamais montrés, et a renvoyé des corrections à distroproof.'],
        ['Seulement des machines jetables.', 'Chaque croisement tourne dans une machine virtuelle QEMU jetable, avec un utilisateur ordinaire. Rien n’installe de paquets sur la machine hôte, et la chaîne ne touche pas à Proxmox.'],
        ['Des preuves, pas des promesses.', 'Chaque croisement compare la réponse d’un outil à une lecture indépendante : envprobe face aux refus d’Omniscient, <code>/proc/meminfo</code> face à atfq, un second serveur face au verrou de VMAnyware.'],
      ],
    },
    {
      type: 'receipts',
      id: 'crossings',
      scene: 'crossings',
      eyebrow: 'LES CROISEMENTS / DÉJÀ EN SERVICE',
      title: ['Ce qui se croise déjà,', 'et ce que ça a trouvé.'],
      text: 'Huit croisements sont déjà en service. Chacun nomme les outils qu’il relie et ce qui en est sorti.',
      cards: [
        {
          label: 'DISTROPROOF → OMNISCIENT',
          title: 'Un outil du noyau éprouvé sur 33 cibles.',
          text: 'Les versions installées d’Omniscient ont tourné sur 17 images de distributions avec leurs propres noyaux, 5 variantes, 3 images arm64 et 8 conteneurs sans root. distroproof a trouvé 27 défauts : 13 dans l’outil, 14 dans ses tests. Lors de la première exécution, le noyau a refusé au démarrage 158 exécutions de sources qu’Omniscient disait utilisables ; après les corrections, plus aucune. La dernière exécution a réussi sur les 25 cibles (33 cellules), et chaque raison de refus concordait avec la lecture d’envprobe sur la même machine.',
          pre: '$ distroproof up --no-tui --jobs 4 --json target/matrix/distroproof.json\n$ cargo test --test portability   # the judges, over every cell',
        },
        {
          label: 'OMNISCIENT → DISTROPROOF',
          title: 'L’outil testé a amélioré le testeur.',
          text: 'La campagne a profité aux deux. distroproof a gagné 3 images (Gentoo, Debian sid, Fedora 43), 2 corrections de démarrage et 3 options <code>[run]</code>, dont <code>file_caps</code> et <code>collect</code>. envprobe a gagné 2 faits, les limites memlock et la configuration du traceur de fonctions, parce que deux échecs d’Omniscient en avaient besoin pour être expliqués.',
          pre: '[run]\nfile_caps = { "/opt/omn/bin/omn" = ["bpf", "perfmon", "net_raw"] }\ncollect = ["cross-tools.json", "witnesses.json"]',
        },
        {
          label: 'DISTROPROOF → XPAC',
          title: 'Un gestionnaire de paquets testé sur 16 images.',
          text: 'xpac suit la matrice des versions installées d’Omniscient. Ses versions GNU et musl sont installées sur 16 images de distributions, plus des variantes root et lockdown. Chaque machine renvoie un <code>cell.json</code> que la machine hôte vérifie. Les vraies installations et suppressions ne tournent que dans de nouvelles copies jetables.',
          pre: '$ distroproof up --no-tui --jobs 4 --json dist/matrix/inspection.json\n$ python3 scripts/distroproof/check.py dist/matrix/inspection.json',
        },
        {
          label: 'XPAC → OMNISCIENT',
          title: 'xpac installe les outils de référence.',
          text: 'Omniscient compare ses chiffres à ceux de perf, bpftrace, bcc, strace, sysstat et valgrind. Dans chaque machine de la chaîne, xpac installe ces outils de référence avec le propre gestionnaire de paquets de la distribution : APT, DNF, Pacman, apk ou Portage. Chaque installation est consignée dans <code>xpac-history.json</code>.',
        },
        {
          label: 'OMNISCIENT → VMANYWARE',
          title: 'Un vrai serveur, mesuré en direct.',
          text: 'La chaîne démarre le serveur de VMAnyware, enregistre une définition, reçoit un refus 403 pour une écriture venue d’un navigateur, et vérifie qu’un second serveur refuse la base de données verrouillée. Omniscient s’attache au serveur en marche et relève <code>mem.rss</code> toutes les 100 ms, sans droits supplémentaires.',
          pre: '$ omn mem.rss --pid $SERVER -m poll@100ms -e timeline,summary -d 1s --format json',
        },
        {
          label: 'ATFQ ↔ PROCFS · MCP',
          title: 'Une explication confrontée à la machine.',
          text: 'Dans chaque machine, <code>atfq probe mem.summary</code> doit correspondre à <code>/proc/meminfo</code> à l’octet près. La chaîne lance aussi <code>atfq mcp</code> et vérifie que ses cinq outils sont là et déclarent toujours <code>readOnlyHint</code>.',
          pre: '$ atfq probe mem.summary --json\n$ atfq mcp   # lookup, search, toc, run_probe, list_probes',
        },
        {
          label: 'OMNISCIENT → ATFQ, XPAC, ENVPROBE',
          title: 'Les promesses de lecture seule, confrontées au noyau.',
          text: 'Omniscient lance chaque outil et suit, depuis le noyau, chaque processus qu’il démarre. Les neuf thèmes d’atfq, l’inventaire et le plan de xpac face à Pacman, et <code>envprobe --json</code> n’ont chacun créé, renommé, supprimé ni synchronisé aucun fichier. Aucun n’a ouvert de connexion TCP, et aucun n’a lancé d’autre programme que les siens. atfq n’a ouvert aucune socket IPv4 ou IPv6 : seulement netlink, pour lire les interfaces. Les onze vérifications sont passées le 21 octobre 2026.',
          pre: '$ python3 scripts/devutils/promises.py\natfq      PASS  no file changed        1464 opens, 8084 reads\natfq      PASS  no IPv4/IPv6 socket    netlink only\nxpac      PASS  only its own programs  xpac, pacman, pacman-conf\nenvprobe  PASS  no TCP connection      19 ms of cpu',
        },
        {
          label: 'OMNISCIENT → CE SITE',
          title: 'Le site, mesuré avant et après.',
          text: 'La même visite de 28 secondes de la page Design, trois fois sur la version d’avant le travail sur le site et trois fois sur celle d’après, pendant qu’Omniscient comptait le temps processeur du navigateur et l’énergie de la carte graphique. Il a refusé de tracer le temps processeur sur cette machine en disant pourquoi (tracefs demande <code>CAP_SYS_ADMIN</code>) ; l’exécution le compte donc à la place. Les résultats sont juste en dessous.',
          pre: '$ omn -f bench/site.yml --format json --program-stderr visit.err > visit.json',
        },
      ],
    },
    {
      type: 'table',
      id: 'site',
      scene: 'site',
      eyebrow: 'CE SITE, MESURÉ / 20 OCTOBRE 2026',
      title: ['Sans accélération graphique,', 'de 10 à 60 images par seconde.'],
      text: 'La version d’avant le travail sur le site (<code>2e965bc</code>) face à celle d’après (<code>3e96fca</code>), sur la même machine. Sans accélération graphique, l’ancienne 3D tournait en logiciel et ralentissait toute la page. Sur une carte graphique rapide, on ne peut pas distinguer les deux versions.',
      head: ['Mesure', 'Avant', 'Après', 'Mesuré par'],
      rows: [
        ['sans GPU · images', '9 à 10 par seconde, une image toutes les 100 ms', '60 par seconde, une image toutes les 16,7 ms', 'l’horloge d’images de la page elle-même, 3 visites chacune'],
        ['sans GPU · temps processeur', '262 à 268 s pour une visite de 28 s', '64 à 164 s', 'omn <code>cpu.oncpu_time</code>, en mode comptage : le navigateur et tous ses processus'],
        ['RTX 2080 Ti · images', '60 par seconde', '60 par seconde', 'l’horloge d’images de la page elle-même'],
        ['RTX 2080 Ti · énergie', '33–34 W en 1080p, 40–42 W en 2560×1440 ×2', '33–34 W, 43–44 W', 'omn <code>gpu.power</code> : dans le bruit, des exécutions isolées ont atteint 60 W dans les deux cas'],
        ['chargement · Lighthouse', 'performance 66–70, 1,6 à 6,2 s bloqué', '98–100, 0 à 40 ms bloqué', 'Lighthouse, profil mobile'],
        ['chargement · décalage de mise en page', '0,096 sur les pages des outils', '0', 'Lighthouse'],
      ],
      fine: 'Chromium piloté par Playwright, sans fenêtre, en 1920×1080 sauf indication contraire ; les visites alternaient entre les deux versions. L’énergie est celle de toute la carte, et la carte change de fréquence d’une exécution à l’autre : l’énergie ne permet donc pas de distinguer les deux versions ici. La fluidité ressentie dans Firefox n’a pas été mesurée ici. Pour reproduire : <code>bench/browse.ts</code> et <code>bench/site.yml</code> dans le dépôt du site.',
    },
    {
      type: 'flow',
      id: 'chain',
      scene: 'chain',
      eyebrow: 'LA CHAÎNE / UNE MACHINE, QUATRE OUTILS',
      title: ['Un seul fichier de matrice.', 'Chaque outil installé comme le ferait un utilisateur.'],
      text: 'La chaîne est une seule matrice distroproof, <code>distroproof-devutils.toml</code>, rangée dans le dépôt d’Omniscient. Chaque machine reçoit des versions figées des outils et les lance avec un utilisateur ordinaire.',
      steps: [
        { glyph: '▣', label: 'COMPILER', title: 'Figer.', code: 'devutils-build.sh', text: 'xpac, atfq et le serveur de VMAnyware sont compilés pour glibc 2.17 et musl, à côté de la version publiée d’Omniscient. Chaque fichier envoyé reçoit une somme de contrôle.' },
        { glyph: '⧉', label: 'DISTROPROOF', title: 'Démarrer.', code: 'distroproof up', text: 'Une cible à la fois, sur son propre noyau. Faire tourner trois machines en même temps poussait les mesures du cache et de l’ordonnanceur hors de leurs marges.' },
        { glyph: '▥', label: 'XPAC', title: 'Préparer.', code: 'witnesses.sh', text: 'La machine vérifie les sommes de contrôle, installe les archives, puis laisse xpac installer les outils de référence avec le gestionnaire de paquets natif.' },
        { glyph: '◎', label: 'VÉRIFIER', title: 'Croiser.', code: 'chain.py', text: 'Les gestionnaires de xpac, atfq face à procfs et via MCP, le serveur de VMAnyware observé par Omniscient, puis les paires de référence d’Omniscient.' },
        { glyph: '⇄', label: 'COLLECTER', title: 'Juger.', code: 'cross-tools.json', text: 'Chaque vérification réussit ou échoue, avec son erreur. Le rapport, l’historique de xpac et le journal des références reviennent sur la machine hôte.' },
      ],
    },
    {
      type: 'table',
      id: 'results',
      scene: 'results',
      ...results,
      fine: `Une paire tient quand Omniscient et l’outil de référence concordent dans la tolérance annoncée. Une paire est ignorée quand la machine ne peut pas la servir, et l’ignorer en donne la raison : les noyaux et les outils empaquetés diffèrent d’une distribution à l’autre. L’écart, le même sur chaque cible, est une différence connue et non un échec : memleak compte la mémoire allouée avec <code>mmap</code>, et la mesure du tas d’Omniscient non. La chaîne a trouvé un défaut de xpac sur Gentoo, corrigé depuis : deux exécutions d’<code>emerge --pretend</code> listent le même plan dans un ordre différent, et xpac refusait bpftrace comme un plan périmé. Deux problèmes restent en dehors des outils. Le dépôt binaire de Gentoo a compilé bcc et bpftrace avec un autre LLVM, si bien qu’aucun des deux ne se charge ; sur Debian 13, bcc ne compile pas ses programmes. Les paires d’Omniscient comptaient un tel outil comme un désaccord ; elles l’ignorent désormais avec sa raison, ce qui explique que Gentoo ignore ${run('chain-gentoo').pairs.skipped} paires, dont toutes celles de bpftrace. Sur Debian 13, une médiane de <code>biolatency</code> sortie d’un cran de sa marge lors de l’exécution précédente a tenu à la relance.`,
    },
    {
      type: 'cards',
      id: 'contract',
      scene: 'contract',
      eyebrow: 'LE CONTRAT COMMUN',
      title: ['Ce qui les rend', 'combinables.'],
      text: 'Les croisements fonctionnent parce que les outils suivent les mêmes règles : la sortie de l’un peut être vérifiée par un autre.',
      cards: [
        { glyph: '{ }', label: 'JSON', title: 'Une sortie structurée', text: 'Chaque outil a une sortie <code>--json</code>. envprobe et le rapport de la chaîne portent un <code>schema_version</code>.', cmd: 'envprobe --json' },
        { glyph: '⊘', label: 'REFUS', title: 'Un refus donne sa raison', text: 'Une source d’Omniscient indisponible, une sonde atfq absente, une valeur envprobe <code>denied</code> : chacune dit pourquoi, pour qu’un autre outil puisse vérifier cette raison.' },
        { glyph: '✓', label: 'RELECTURE', title: 'Les changements sont explicites', text: 'xpac montre un plan avant d’agir. VMAnyware montre un aperçu avant de créer quoi que ce soit. atfq et envprobe ne font que lire.' },
        { glyph: '◇', label: 'MCP', title: 'Les agents aussi', text: '<code>atfq mcp</code> et <code>omn-mcp</code> d’Omniscient fournissent des outils en lecture seule sur stdio. Un agent peut demander à atfq ce que veut dire un chiffre, et à Omniscient ce qu’il a mesuré.' },
        { glyph: '▥', label: 'APPARENCE', title: 'Une même famille d’interfaces', text: 'L’interface terminal de xpac reprend les deux panneaux d’atfq et les indices de confiance d’Omniscient. Le script de démo d’atfq suit le format de celui d’Omniscient.' },
        { glyph: '⧉', label: 'JETABLE', title: 'Testé là où ça peut casser', text: 'Les transactions de paquets, les capacités et les sondes du noyau tournent dans des machines virtuelles jetables, sur le propre noyau de la distribution, jamais sur la machine du développeur.' },
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'LANCER LA CHAÎNE',
      title: ['Quatre outils,', 'une commande.'],
      text: 'La chaîne se trouve dans le dépôt d’Omniscient, privé pour l’instant. Voici les commandes qu’elle lance.',
      installLabel: 'DEPUIS UNE COPIE D’OMNISCIENT, AVEC XPAC, ATFQ ET VMANYWARE À CÔTÉ',
      install: `sh scripts/distroproof/reference-build.sh
sh scripts/distroproof/devutils-build.sh
distroproof up -f distroproof-devutils.toml --no-tui --jobs 1 \\
  --json target/matrix/devutils.json`,
      actions: `<a class="primary" href="/fr/tools/distroproof/">Commencer par distroproof <span>${arrow}</span></a>
        <a class="secondary" href="/fr/">Tous les outils devutils</a>`,
      small: `${summary} · Omniscient est privé pour l’instant · MIT / Apache-2.0`,
    },
  ],
} satisfies Page
