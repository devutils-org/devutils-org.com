// La page d'ATFQ en français : la même que atfq.ts, section pour section
// (src/site.test.ts le vérifie). Les captures du terminal sont celles du
// programme, en anglais, et le livre n'existe qu'en anglais : les liens y
// mènent en le disant.

import { icon } from '../html.ts'
import { cli, tui, mcp } from './atfq.ts'
import type { Page } from './types.ts'

export default {
  id: 'atfq',
  lang: 'fr',
  nav: [['Livre (EN)', '/tools/atfq/book/'], ['Fiches', '#cards'], ['Touches', '#keys'], ['Installer', '#start']],
  hero: {
    title: ['Posez la question.', 'Votre machine répond.'],
    copy: 'Comprenez les chiffres de Linux.<br />Des réponses liées à votre machine.',
    primary: 'Installer ATFQ',
  },
  sections: [
    {
      type: 'intro',
      id: 'overview',
      scene: 'overview',
      eyebrow: 'UN COMPAGNON LINUX / DANS VOTRE TERMINAL',
      title: ['Comprendre le chiffre.', 'Sans perdre le fil.'],
      text: 'Obtenez une réponse concrète sans quitter le terminal. Lisez une courte explication, comparez-la avec votre machine, puis allez plus loin quand vous en avez besoin.',
      columns: [
        ['Commencer par la réponse.', 'Des explications simples sur les chiffres de Linux et les questions de tous les jours, avec les pièges et le pourquoi détaillé à côté de chaque fiche.'],
        ['Lire votre machine.', 'Les explications sont posées à côté des faits réels du système, de la mémoire disponible à l’état des processus. Pas besoin de root, et rien n’est modifié.'],
        ['Toujours sous la main.', 'Utilisez la ligne de commande, parcourez l’interface du terminal ou lisez le livre dans votre navigateur. Le programme contient tout son contenu et fonctionne hors ligne.'],
      ],
    },
    {
      type: 'terminal',
      id: 'terminal',
      scene: 'terminal',
      eyebrow: 'UN COMPAGNON LINUX POUR LE TERMINAL',
      title: ['Une fiche,', 'trois façons d’y accéder.'],
      text: 'La même fiche en ligne de commande, en mode interactif, et pour un agent IA via MCP. Le contenu des fiches est en anglais.',
      tabs: [
        { name: 'CLI', label: 'alice@laptop ~ · atfq free', caption: 'La réponse courte, les chiffres de votre machine, les pièges — et l’explication détaillée à une option près.', html: cli },
        { name: 'TUI', label: 'alice@laptop ~ · atfq tui', caption: 'Le sommaire à gauche, la page à droite, avec les touches de vim et la souris.', html: tui },
        { name: 'MCP', label: 'alice@laptop ~ · atfq mcp', caption: 'Cinq outils en lecture seule sur stdio pour les agents IA ; chacun porte readOnlyHint: true.', html: mcp },
      ],
    },
    {
      type: 'layers',
      id: 'cards',
      scene: 'cards',
      eyebrow: '$ ATFQ 17.1 --WHY',
      title: ['Chaque fiche répond', 'dans le même ordre.'],
      text: 'Les fiches sont rangées comme un livre, avec un sommaire numéroté sur un seul niveau. Tapez un nom, un synonyme, un numéro de chapitre, ou le message d’erreur que vous venez de recevoir. Le premier écran résout le problème.',
      layers: [
        {
          label: 'TL;DR',
          title: 'En bref',
          text: 'Trois lignes, en langage simple. Si une phrase avait sa place dans une page de manuel, elle a été réécrite.',
          html: `<span class="b">17.4  The page cache</span>
  - Keeps file data in RAM after
    it has been read or written.
  - Shrinks by itself when apps
    need more: nothing to free.`,
        },
        {
          label: 'SUR VOTRE MACHINE',
          title: 'Sur votre machine',
          text: 'Des sondes lisent directement <code>/proc</code>, <code>/sys</code> et <code>/etc</code>. Ce qui est vrai ici, pas en général.',
          html: `<span class="b">On your machine</span>
  Arch   <span class="c">x86_64</span>, made by Intel
  Level  <span class="c">x86-64-v4</span>: programs
         built for this level or
         below run here`,
        },
        {
          label: 'POUR ALLER PLUS LOIN',
          title: 'Pour aller plus loin',
          text: 'Le « pourquoi », replié tant que vous ne le demandez pas. Des questions à ouvrir une par une dans l’interface du terminal.',
          html: `  <span class="c">▾</span> <span class="b">Why do zombies exist at all?</span>
  <span class="c">▸</span> How is "available" calculated?
  <span class="c">▸</span> What is swappiness and when
    should I change it?`,
        },
      ],
      stats: [['9', 'thèmes'], ['122', 'fiches'], ['30', 'chapitres'], ['50', 'sondes en direct']],
      link: ['Lire la fiche 17.1 dans le livre (en anglais) →', '/tools/atfq/book/17.1.html'],
    },
    {
      type: 'split',
      scene: 'safe',
      left: {
        eyebrow: '$ ATFQ PROBE',
        title: 'Il regarde.<br />Il ne touche jamais.',
        text: '<code>atfq</code> montre des commandes et lit l’état du système. Il n’exécute jamais vos commandes et ne modifie jamais le système : vous pouvez l’utiliser sur un serveur de production.',
        facts: [
          ['Lit', '<code>/proc</code>, <code>/sys</code>, <code>/etc</code>', 'Plus les noms des clés dans <code>~/.ssh</code>, jamais une clé privée.'],
          ['Lance', '<code>systemctl</code>, et rien d’autre', 'Avec des arguments fixes et un délai de 500 ms.'],
          ['Réseau', 'Jamais', 'Le contenu est intégré au programme.'],
          ['Root', 'Inutile', 'Une sonde qui ne peut pas répondre affiche « needs root ».'],
        ],
      },
      right: {
        eyebrow: '$ ATFQ "EXEC FORMAT ERROR"',
        title: 'Collez l’erreur,<br />obtenez la fiche.',
        text: 'Les fautes de frappe sont pardonnées, et les messages d’erreur servent de recherche.',
        queries: [
          ['"exec format error"', '23.2 ELF et « command not found »'],
          ['memroy', 'Pas de correspondance exacte : affiche Memory'],
          ['degraded', 'les services systemd en échec'],
          ['5.1', 'une fiche, par numéro de chapitre'],
          ['ask disk --redact', 'une question à coller dans une IA, sans le nom de votre machine'],
        ],
      },
    },
    {
      type: 'keys',
      id: 'keys',
      scene: 'keys',
      eyebrow: '$ ATFQ TUI',
      title: ['Vos doigts connaissent', 'déjà les touches.'],
      text: 'Le sommaire à gauche, la page à droite. Les touches de vim, avec les répétitions, et la souris si vous préférez.',
      keys: [
        [['j', 'k'], 'se déplacer, défiler (<kbd>5j</kbd> pour cinq)'],
        [['h', 'l'], 'changer de panneau'],
        [['gg', 'G'], 'début, fin'],
        [['^d', '^u'], 'une demi-page'],
        [['Tab'], 'lien ou question suivante'],
        [['⏎'], 'ouvrir, déplier'],
        [['^o', '⌫'], 'retour'],
        [['/'], 'chercher dans toutes les fiches'],
        [['?'], 'la question pour une IA sur cette page'],
        [['r'], 'relancer les sondes'],
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: '$ ATFQ --VERSION',
      title: ['Posez la question', 'à votre machine.'],
      text: 'Linux uniquement. Les binaires prêts à l’emploi sont statiques : aucune libc particulière n’est requise, Alpine compris. Chaque archive est signée et publie sa somme SHA-256.',
      installs: [
        {
          label: 'PRÊT À L’EMPLOI',
          note: 'Exemple pour x86-64 ; utilisez <code>aarch64</code> sur ARM.',
          code: `curl -fLO https://github.com/devutils-org/atfq/releases/latest/download/atfq-x86_64-linux.tar.gz
gh attestation verify atfq-x86_64-linux.tar.gz --repo devutils-org/atfq
tar xzf atfq-x86_64-linux.tar.gz
mkdir -p ~/.local/bin
install -m 755 atfq-x86_64-linux/atfq ~/.local/bin/`,
        },
        { label: 'DEPUIS LES SOURCES', note: 'Avec une chaîne de compilation Rust.', code: 'git clone https://github.com/devutils-org/atfq\ncd atfq\ncargo install --path .' },
        { label: 'POUR VOTRE AGENT IA', note: 'Cinq outils MCP en lecture seule sur stdio.', code: 'claude mcp add atfq -- atfq mcp' },
      ],
      actions: `<a class="primary" href="/tools/atfq/book/" hreflang="en">Lire le livre (en anglais) <span>${icon('arrow-right')}</span></a>\n        <a class="secondary" href="https://github.com/devutils-org/atfq">Lire le code source <span>${icon('arrow-up-right')}</span></a>`,
      small: 'atfq signifie « Ask The F*cking Question » · MIT OR Apache-2.0, code et contenu',
    },
  ],
} satisfies Page
