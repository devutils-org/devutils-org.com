// La page d'Omniscient en français : la même que page.ts, section pour section
// (src/site.test.ts le vérifie). Les commandes, les sorties du terminal et les
// noms des sources restent ceux du programme.

import { icon } from '../html.ts'
import { repoLink, toolOf } from '../toolpage/render.ts'
import { captures, familiesBody, wireFamilies } from './parts.ts'
import { chainResults } from '../toolpage/chain-results.ts'
import runs from '../toolpage/chain-runs.json' with { type: 'json' }
import type { Page } from '../toolpage/types.ts'

const omn = toolOf('omn', 'fr')
const chain = chainResults(runs, { lang: 'fr' })
const more = (path: string, label: string) => repoLink(omn, path, label, 'inline-link')

export default {
  id: 'omn',
  lang: 'fr',
  footer: 'directement depuis le noyau, ouvert à l’examen.',
  licensePath: '#license',
  nav: [['Familles', '#families'], ['Déroulé', '#workflow'], ['Vues', '#interface'], ['En pratique', '#in-practice'], ['Portabilité', '#portability'], ['Docs', { repo: '/tree/main/docs' }]],
  hero: {
    title: ['Voir au-delà', 'de la surface.'],
    copy: 'Observez ce que font vos programmes sous Linux, du processeur au disque.<br />Gardez la preuve à côté de chaque chiffre.',
    primary: `Commencer à observer <span>${icon('arrow-right')}</span>`,
  },
  sections: [
    {
      type: 'intro',
      id: 'overview',
      scene: 'intro',
      mark: { opacity: 0.65 },
      eyebrow: 'UN SEUL OUTIL / UN VOCABULAIRE COMMUN',
      title: ['Mesurer le système.', 'Garder le sens.'],
      text: 'Suivez un programme depuis l’activité du noyau jusqu’au temps qu’il passe à attendre. Profils, compteurs et événements partagent un même modèle, et leurs limites restent visibles.',
      columns: [
        ['Partir d’une question.', 'Lancez une enquête avec <code>omn cpu</code>, <code>omn mem</code> ou <code>omn latency</code>. Nommez une source quand vous voulez un contrôle précis.'],
        ['Voir ce qui est disponible ici.', '<code>omn list</code> sonde cette machine. Droits manquants, matériel non pris en charge et collecteurs absents sont expliqués clairement.'],
        ['Emporter la preuve.', 'Exportez résultats et profils. Gardez la méthode utilisée, l’état de la machine et le coût de l’observation à côté des chiffres.'],
      ],
    },
    {
      type: 'html',
      id: 'families',
      scene: 'families',
      eyebrow: 'NEUF FAMILLES / DES QUESTIONS LIÉES',
      title: ['Chaque couche a', 'une histoire à raconter.'],
      text: 'Choisissez la partie du système que vous voulez comprendre. Ouvrez une famille pour lire son histoire : la question, ses sources, une vraie exécution et ses limites.',
      body: familiesBody('fr'),
      wire: wireFamilies,
    },
    {
      type: 'flow',
      id: 'workflow',
      scene: 'workflow',
      mark: { opacity: 0.8 },
      eyebrow: 'SUIVRE LE SIGNAL / LE SCÉNARIO SUZANNE',
      title: ['Une requête.', 'Chaque couche en vue.'],
      text: 'Demandez à un moteur de dessiner Suzanne en 3D et d’enregistrer l’image. Suivez chaque passage de relais à travers la machine.',
      steps: [
        { glyph: '↙', label: 'RÉSEAU', title: 'Recevoir.', code: 'HTTP → render request', text: 'Marquer le début de la requête et transmettre son identité au travail qui en découle.' },
        { glyph: '⌘', label: 'PROCESSEUR', title: 'Préparer.', code: 'Suzanne → draw commands', text: 'Examiner l’exécution, les retards de l’ordonnanceur et les threads qui préparent Suzanne.' },
        { glyph: '◇', label: 'CARTE GRAPHIQUE', title: 'Dessiner.', code: 'geometry → frame', text: 'Examiner le rendu à travers ce que la carte et le moteur exposent.' },
        { glyph: '▱', label: 'DISQUE', title: 'Enregistrer.', code: 'frame → suzanne.png', text: 'Suivre suzanne.png jusqu’à write() ; l’écriture effective sur le disque est une mesure à part.' },
      ],
      fine: 'Scénario de capture prévu sous Linux · cette séquence est une illustration. Une seule machine ; l’attribution côté carte graphique dépend du moteur et du pilote. L’écriture d’un fichier et son enregistrement durable sur le disque sont deux choses distinctes.',
    },
    {
      type: 'html',
      class: 'evidence',
      scene: 'evidence',
      eyebrow: 'CONÇU POUR LA PREUVE',
      title: ['Voir, c’est bien.', 'Savoir pourquoi, c’est mieux.'],
      text: 'Un chiffre plausible ne suffit pas. Sachez ce qui l’a produit, ce qui a été perdu et ce qui justifie son attribution.',
      body: `<div class="bento">
      <article class="bento-big">
        <div class="evidence-scale"><span>IDENTITÉ</span><i></i><span>CLÉ</span><i></i><span>RÉVEIL</span><i></i><span>TEMPS</span></div>
        <h3>Des liens, avec leurs preuves.</h3>
        <p>Une identité transmise et deux événements proches dans le temps ne sont pas le même genre de preuve. Omniscient vous dit lequel justifie le lien.</p>
        ${more('#the-number-no-single-source-can-give', `Comprendre les preuves ${icon('arrow-up-right')}`)}
      </article>
      <article>
        <div class="mini-symbol">[ kernel ]<br /><span>↓</span><br />[ omn ]</div>
        <h3>Direct par principe.</h3>
        <p>eBPF, perf_event_open, procfs, sysfs et netlink. Sans perf, bpftrace ni bcc en dessous.</p>
      </article>
      <article>
        <div class="mini-symbol">◴ <span>→</span> ◷</div>
        <h3>Enregistrer. Revoir.</h3>
        <p>Enregistrez une exécution et rejouez-la dans le terminal. Changez de vue, gardez le contexte.</p>
      </article>
      <article class="refusal">
        <code>scope: package<br /><span>target: process</span><br />↳ request refused</code>
        <h3>Des limites honnêtes.</h3>
        <p>Si une source ne peut pas répondre à une question, le validateur explique pourquoi — au lieu de répondre à une autre question.</p>
      </article>
    </div>`,
    },
    {
      type: 'terminal',
      id: 'interface',
      class: 'interface',
      scene: 'interface',
      mark: { opacity: 0.55 },
      eyebrow: 'VOTRE TERMINAL / PLUS DE DIMENSIONS',
      title: ['La même exécution.', 'Un autre point de vue.'],
      text: 'Choisissez une requête et gardez-la en vue d’une vue à l’autre. Examinez les fils d’exécution ou les piles d’appels du processeur — le tout tiré d’une seule exécution enregistrée.',
      pre: 'tui',
      size: '120 × 40',
      tabs: [
        { name: 'Requête', label: 'omn top / request', html: captures.request, caption: 'Une requête au premier plan — ce qu’elle coûte, de son arrivée à la réponse. Gardez son contexte dans les autres vues.' },
        { name: 'Fils', label: 'omn top / lanes', html: captures.lanes, caption: 'Le travail réparti sur les fils d’exécution — threads et périphériques côte à côte, dans la même exécution.' },
        { name: 'Flamme', label: 'omn top / flame', html: captures.flame, caption: 'Trouver la pile la plus occupée — quelles piles d’appels ont pris le temps, sur le processeur et en dehors.' },
      ],
      fine: 'Captures du jeu de test <code>many-requests</code> de la galerie des vues, dessinées en 120×40 et vérifiées par <code>tests/view_snapshots.rs</code>. Couleurs adaptées à la palette de cette page. Les écrans du programme restent en anglais.',
      after: `<div class="session-example">
      <div>
        <p class="eyebrow">DES ENQUÊTES REPRODUCTIBLES</p>
        <h3>La mesure, écrite comme du code.</h3>
        <p>Essayez une mesure dans le terminal, puis gardez-la dans un fichier de session. YAML, JSON et TOML décrivent les mêmes requêtes. Le programme fait partie de la requête : le lancer en fait à la fois la cible et l’horloge.</p>
        ${more('/tree/main/examples', `Parcourir les sessions ${icon('arrow-up-right')}`)}
      </div>
      <pre class="glass"><code><i># omn -f examples/mem-rss-run.yml</i>
name: resident memory of a launched program
requests:
  - label: rss
    source: mem.rss
    target:
      launch: [python3, -c, "..."]
    mode: poll@100ms
    emit: [timeline, summary]
    keys: [task, cgroup]</code></pre>
    </div>`,
    },
    { type: 'practice' },
    {
      type: 'html',
      id: 'portability',
      scene: 'portability',
      mark: { opacity: 0.6 },
      eyebrow: 'TESTÉ AVEC DISTROPROOF / OCTOBRE 2026',
      title: ['Des noyaux différents.', 'Des limites explicites.'],
      text: 'Les versions installées ont été testées sur 17 images de distributions et 5 variantes, 3 images arm64 et 8 conteneurs sans root, de Linux 4.15 à 7.2, avec glibc et musl. Le même binaire a trouvé 36 sources utilisables sur Ubuntu 18.04 et 96 sur Fedora — avec une raison pour chaque refus.',
      body: `<div class="bento">
      <article class="bento-big">
        <h3>La disponibilité confrontée à la réalité.</h3>
        <p>La campagne a trouvé 27 défauts : 13 dans l’outil et 14 dans ses tests. Au départ, 158 exécutions de sources étaient annoncées utilisables mais refusées au démarrage. Après les corrections, plus aucune. Chaque raison de refus concordait avec la lecture indépendante d’envprobe sur la même machine, sur les 21 cibles.</p>
        <a class="inline-link" href="/fr/tools/distroproof/#case-study">Voir l’étude de cas de distroproof →</a>
      </article>
      <article>
        <h3>Des fonctionnalités, pas des numéros de version.</h3>
        <p>De vraies sondes repèrent la politique perf de Debian, les tables BPF comptées dans memlock sur 5.10, les restrictions du lockdown et l’absence de traceur de fonctions sur Alpine. Les rétroportages de RHEL sont détectés comme des fonctionnalités au lieu d’être écartés à cause de l’âge du noyau.</p>
      </article>
      <article>
        <h3>Deux archives publiées.</h3>
        <p>L’archive glibc vise glibc 2.17 et plus. Alpine a une archive musl native, avec un moteur statique et un petit module de préchargement musl. Les sources NVIDIA ne sont pas disponibles dans la version statique, car elles ont besoin de charger des bibliothèques dynamiques.</p>
      </article>
      <article class="refusal">
        <h3>Ce qui reste ouvert.</h3>
        <p>Les paires de référence face à perf, bpftrace, bcc et aux autres outils témoins des distributions tournent sur la chaîne devutils : ${chain.summary.toLowerCase()} dans les dernières exécutions. Une paire est ignorée, avec sa raison, quand une distribution n’a pas l’outil témoin ou que celui-ci ne se charge pas. Les images arm64 sont émulées sur une machine x86_64.</p>
        <a class="inline-link" href="/fr/together/#results">Voir les dernières exécutions de la chaîne →</a>
        ${more('/blob/main/docs/distroproof.md', 'Lire les constats et les preuves →')}
      </article>
    </div>`,
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / CONÇU POUR LINUX',
      title: ['Posez à votre machine', 'une meilleure question.'],
      text: 'Choisissez l’archive adaptée à votre bibliothèque C, ou compilez depuis les sources. Lancez <code>omn list</code> pour voir ce que cette machine peut fournir ; les sources eBPF demandent des droits et des réglages du noyau adaptés.',
      command: omn.command ?? undefined,
      actions: `${repoLink(omn, '/blob/main/docs/install.md', `Installer Omniscient <span>${icon('arrow-up-right')}</span>`, 'primary')}
        <a class="secondary" href="#start">Commencer à observer</a>`,
      small: 'Archives x86_64 : glibc 2.17+ ou musl · Rust 1.82+ pour compiler · la disponibilité est sondée source par source',
    },
  ],
} satisfies Page
