// La page de xpac en français : la même que xpac.ts, section pour section
// (src/site.test.ts le vérifie). Les commandes restent celles du programme.

import type { Page } from './types.ts'

export default {
  id: 'xpac',
  lang: 'fr',
  nav: [['Inventaire', '#inventory'], ['Commandes', '#commands'], ['Terminal', '#terminal'], ['État', '#status']],
  hero: {
    title: ['Chaque paquet.', 'Chaque raison.'],
    copy: 'Sachez ce qui est installé, et pourquoi.<br />Ne changez paquets et fichiers de configuration qu’à travers un plan que vous avez lu.',
    primary: 'Installer xpac',
  },
  sections: [
    {
      type: 'intro',
      id: 'inventory',
      scene: 'inventory',
      eyebrow: 'UN INVENTAIRE / CINQ GESTIONNAIRES DE PAQUETS',
      title: ['Lire le système.', 'Puis décider.'],
      text: 'Chaque paquet garde son gestionnaire, son architecture et sa portée : <code>apt:curl:amd64</code>, ce n’est pas juste « curl ».',
      columns: [
        ['Natif, pas deviné.', 'La consultation est prise en charge pour APT, Pacman, RPM/DNF, Flatpak (utilisateur par défaut et système), les formules et casks Homebrew, apk et Portage. Aucun gestionnaire n’en remplace un autre en douce.'],
        ['Des plans qui expirent.', 'Un plan enregistré expire, et doit encore correspondre à un plan natif tout frais avant de s’exécuter — pour ne jamais appliquer un plan que le système a dépassé.'],
        ['Déclaratif, additif.', 'Des manifestes TOML avec des profils et des couches par plateforme qui se combinent de façon prévisible, pour les paquets et les fichiers de configuration de votre dossier personnel. Les champs inconnus échouent avant l’exécution ; le mode additif garde les logiciels que vous n’avez pas déclarés.'],
      ],
    },
    {
      type: 'cards',
      id: 'commands',
      scene: 'commands',
      eyebrow: 'COMMANDES / D’ABORD INSPECTER',
      title: ['La plupart des commandes', 'ne font que lire.'],
      text: 'L’inventaire, la provenance, les dépendances et l’audit sont en lecture seule. Les changements de paquets et le nettoyage des caches et des orphelins demandent un aperçu et une confirmation explicites.',
      cards: [
        { glyph: '▤', label: 'INVENTAIRE', title: 'Inventaire', text: 'Ce qui est installé, par gestionnaire, avec des identités qui gardent l’architecture et la portée.', cmd: 'xpac list --provider apt --json' },
        { glyph: '?', label: 'PROVENANCE', title: 'Pourquoi il est là', text: 'La raison de l’installation d’un paquet : demandé explicitement, dépendance, ou inconnue.', cmd: 'xpac why apt:curl:amd64' },
        { glyph: '⑂', label: 'DÉPENDANCES', title: 'Dépendances', text: 'Les dépendances installées telles que les décrivent APT, Pacman, RPM et les formules Homebrew, alternatives et contraintes comprises. Des métadonnées, pas un graphe entre gestionnaires.', cmd: 'xpac deps apt:curl:amd64' },
        { glyph: '⇥', label: 'EXPORT', title: 'Export et comparaison', text: 'Écrire l’inventaire en TOML, d’un seul coup, et comparer une machine à un manifeste. Un inventaire exporté n’est pas un fichier de verrouillage.', cmd: 'xpac diff -f examples/profiles.toml --profile dev' },
        { glyph: '◇', label: 'PLAN', title: 'Plans', text: 'Ce que changerait l’application d’un manifeste ou une installation — enregistré, relu, et avec une date d’expiration.', cmd: 'xpac plan -f system.toml' },
        { glyph: '▶', label: 'APPLIQUER', title: 'Appliquer', text: 'APT, Pacman, DNF5 et DNF4, les applications Flatpak, les formules Homebrew, apk et Portage, après un aperçu et un oui en direct ou un <code>--yes</code> explicite. Sans interaction et sans <code>--yes</code>, c’est refusé.', cmd: 'xpac apply --plan preview.json --dry-run' },
        { glyph: '⌕', label: 'AUDIT', title: 'Audit et nettoyage', text: 'L’audit et les simulations trient caches et paquets orphelins. Le nettoyage explicite des caches et la suppression relue des orphelins existent pour APT et Pacman ; xpac ne supprime jamais lui-même de configuration, de données personnelles ou de chemins qu’il ne gère pas.', cmd: 'xpac audit --provider apt' },
        { glyph: '▥', label: 'TUI', title: 'Interface du terminal', text: 'Deux panneaux comme atfq, des indices de confiance comme Omniscient. En lecture seule par défaut ; <code>--allow-apply</code> active des opérations APT expérimentales.', cmd: 'xpac tui --provider apt' },
        { glyph: '◎', label: 'FICHIERS · EXPÉRIMENTAL', title: 'Fichiers de configuration', text: 'Déclarez vos fichiers de configuration personnels à côté de vos paquets. Un fichier existant n’est jamais écrasé avant que vous l’adoptiez, avec une sauvegarde privée ; les modifications locales sont signalées comme des écarts et refusées. xpac ne les supprime jamais.', cmd: 'xpac file adopt ~/.tmux.conf --dry-run' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'D’UN MANIFESTE À UNE MACHINE',
      title: ['Rien ne change', 'sans plan.'],
      text: 'Aligner une machine sur un manifeste TOML, c’est une suite de vérifications, et chacune peut tout arrêter.',
      steps: [
        { glyph: '▤', label: 'DÉCLARER', title: 'Déclarer.', code: 'system.toml', text: 'Décrivez les paquets et les fichiers de configuration qu’une machine doit avoir, avec des profils et des couches par plateforme. Les champs inconnus et les opérations incompatibles échouent avant que quoi que ce soit ne s’exécute.' },
        { glyph: '⇄', label: 'COMPARER', title: 'Comparer.', code: 'xpac diff -f', text: 'Voyez en quoi la machine diffère du manifeste, en lecture seule, sans rafraîchir les dépôts. Chaque fichier est signalé comme absent, à jour, dépassé ou modifié.' },
        { glyph: '◇', label: 'PLANIFIER', title: 'Planifier.', code: '--save preview.json', text: 'Enregistrez le plan natif avec une date d’expiration. Avant de s’exécuter, il doit encore correspondre à un plan natif tout frais.' },
        { glyph: '✓', label: 'CONFIRMER', title: 'Confirmer.', code: 'yes / --yes', text: 'Un aperçu et un oui en direct, ou un --yes explicite. Le plan est revérifié après la confirmation ; les droits d’administration seulement avec un --sudo explicite.' },
        { glyph: '▣', label: 'CONSIGNER', title: 'Consigner.', code: 'journal', text: 'Un journal privé des transactions consigne l’intention et les résultats vérifiés, et chaque fichier écrit reçoit un reçu. Un échec partiel est signalé comme tel — jamais comme un retour en arrière implicite.' },
      ],
    },
    {
      type: 'terminal',
      id: 'terminal',
      scene: 'terminal',
      eyebrow: 'DANS LE TERMINAL',
      title: ['Inspecter.', 'Puis aligner.'],
      text: 'Les commandes telles que les donne le README. Le JSON va sur stdout avec <code>schema_version 1</code> ; les aperçus et les questions vont sur stderr.',
      tabs: [
        {
          name: 'Inspecter',
          label: 'xpac · read-only',
          caption: 'Inventaire, recherche, informations, provenance et dépendances — sans root, sans rafraîchir les dépôts.',
          text: `$ xpac providers
$ xpac list --provider apt --json
$ xpac search curl --provider dnf --installed
$ xpac info apt:curl
$ xpac why apt:curl:amd64
$ xpac deps apt:curl:amd64`,
        },
        {
          name: 'Aligner',
          label: 'xpac · plans',
          caption: 'Exporter, comparer, planifier avec une date d’expiration, puis appliquer — en simulant d’abord.',
          text: `$ xpac export --provider apt -o system.toml
$ xpac diff -f examples/profiles.toml --profile dev
$ xpac plan -f system.toml
$ xpac plan apt:curl --save preview.json --expires-in 300
$ xpac apply --plan preview.json --dry-run
$ xpac install apt:hello --sudo --dry-run   # privileges only when asked`,
        },
        {
          name: 'Fichiers',
          label: 'system.toml · experimental',
          caption: 'Un fichier de configuration déclaré à côté de ses paquets, adopté une fois, puis écrit lors de l’application avec sa propre confirmation.',
          text: `[packages.apt]
install = ["tmux"]

[files."~/.tmux.conf"]
source = "dotfiles/tmux.conf"   # relative to the manifest
mode = "0644"

$ xpac file adopt ~/.tmux.conf --dry-run
$ xpac file adopt ~/.tmux.conf      # keeps a private backup
$ xpac apply -f system.toml
$ xpac file forget ~/.tmux.conf     # drops the receipt, keeps the file`,
        },
        {
          name: 'Démo',
          label: 'xpac demo',
          caption: 'Cinq paquets fictifs, sous Linux ou macOS, sans gestionnaire de paquets natif.',
          text: `$ xpac demo                     # the TUI on synthetic data
$ xpac demo --snapshot --json   # the same, non-interactive

# in the TUI: /curl, Enter, i, Esc, Tab to change provider, q to quit`,
        },
      ],
      fine: 'Seules les commandes sont montrées : le README ne publie pas leur sortie, et cette page ne l’invente pas.',
    },
    {
      type: 'receipts',
      id: 'status',
      scene: 'status',
      eyebrow: 'OÙ EN EST LE PROJET',
      title: ['Preuve de concept,', 'validation en cours.'],
      text: 'xpac modifie des paquets : il dit donc clairement ce qui a été vérifié et ce qui ne l’a pas été.',
      cards: [
        { label: 'EXÉCUTION EXPÉRIMENTALE', title: 'Sept exécuteurs natifs.', text: 'L’exécution relue est prise en charge pour APT, Pacman, DNF5 et DNF4, les applications Flatpak, les formules Homebrew, apk et Portage. Les aperçus propres à chaque gestionnaire et la revérification restent explicites.' },
        { label: 'VALIDATION JETABLE', title: 'Testé dans des environnements isolés.', text: 'Des transactions APT, Pacman, DNF5 et DNF4 (Rocky 8 et 9) ont tourné dans des environnements jetables. Flatpak et Homebrew sous Linux ont aussi des preuves natives isolées. Les fichiers de configuration ne sont testés que dans des dossiers personnels temporaires. Les transactions sur la machine hôte restent non testées ; les exécutions en CI configurées et la validation native sous macOS sont à venir.' },
        { label: 'DES DROITS SEULEMENT SUR DEMANDE', title: 'sudo est explicite.', text: 'L’inspection ne demande jamais de droits. <code>--sudo</code> ne délègue que la transaction APT ou Pacman relue ; xpac ne lit jamais un mot de passe sur stdin, et les simulations ne s’authentifient jamais.', pre: '$ xpac install apt:hello --sudo --dry-run\n$ xpac install apt:hello --sudo' },
        { label: 'PAS DE RETOUR EN ARRIÈRE PROMIS', title: 'Les échecs restent visibles.', text: 'Un échec partiel n’implique jamais de retour en arrière. Le journal consigne ce qui était prévu et ce qui a été vérifié, pour voir exactement où ça s’est arrêté.' },
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / LINUX ET MACOS',
      title: ['Connaissez vos paquets', 'avant d’y toucher.'],
      text: 'Téléchargez-le, puis commencez par la démo — pas besoin de gestionnaire de paquets natif.',
      installLabel: 'TÉLÉCHARGER · BINAIRE STATIQUE LINUX X86_64',
      install: `v=v0.1.0 t=x86_64-unknown-linux-musl
curl -fLO https://github.com/devutils-org/xpac/releases/download/$v/xpac-$v-$t.tar.gz
gh attestation verify xpac-$v-$t.tar.gz --repo devutils-org/xpac
tar xzf xpac-$v-$t.tar.gz && mkdir -p ~/.local/bin && install -m 755 xpac-$v-$t/xpac ~/.local/bin/

# then
xpac demo
xpac list --provider apt --json`,
      small: 'N’essayez de vraies transactions que dans des environnements jetables · MIT / Apache-2.0',
    },
  ],
} satisfies Page
