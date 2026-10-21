// La page de VMAnyware en français : la même que vmanyware.ts, section pour
// section (src/site.test.ts le vérifie). Les fichiers d'exemple et les
// commandes restent ceux du dépôt.

import type { Page } from './types.ts'

export default {
  id: 'vmanyware',
  lang: 'fr',
  nav: [['L’idée', '#idea'], ['Aujourd’hui', '#today'], ['Définition', '#definition'], ['État', '#status']],
  hero: {
    title: ['Votre homelab.', 'De partout.'],
    copy: 'Votre homelab Proxmox, depuis l’ordinateur ou le téléphone.<br />Décrivez un environnement Linux une fois. Recréez-le quand il le faut.',
    primary: 'L’essayer en local',
  },
  sections: [
    {
      type: 'intro',
      id: 'idea',
      scene: 'idea',
      eyebrow: 'L’IDÉE / DÉFINITION ≠ INSTANCE',
      title: ['Décrire une fois.', 'Recréer à volonté.'],
      text: 'L’environnement survit à la machine virtuelle : supprimez une instance, gardez sa définition, recréez-la quand vous en avez de nouveau besoin.',
      columns: [
        ['Hébergé chez vous d’abord.', 'Votre propre serveur ou cluster Proxmox VE, sans cloud ni compte obligatoire chez un fournisseur. Proxmox est le premier fournisseur, derrière un adaptateur — pas le cœur du modèle.'],
        ['Reproductible, pas magique.', 'Les entrées, les versions d’images et de modèles, les étapes de création et les limites sont explicites. Les définitions sont validées strictement et jamais exécutées implicitement.'],
        ['Sûr par défaut.', 'Des identifiants Proxmox aux droits minimaux, des certificats TLS et des clés d’hôte SSH vérifiés, et aucune API d’administration Proxmox exposée. Les applications se connectent par votre réseau local ou votre VPN.'],
      ],
    },
    {
      type: 'cards',
      id: 'today',
      scene: 'today',
      eyebrow: 'CE QUI FONCTIONNE AUJOURD’HUI',
      title: ['Les premières pièces,', 'présentées comme telles.'],
      text: 'Chaque pièce avec ce qu’elle est aujourd’hui — fonctionnelle en local, prototype, ou pas encore construite.',
      cards: [
        { glyph: '▤', label: 'DÉFINITIONS', status: 'MARCHE EN LOCAL', tone: 'ok', title: 'Définitions YAML', text: 'Modifier, valider, enregistrer et recharger des définitions réutilisables sans Proxmox. Le serveur vérifie le schéma et les range dans SQLite, sans créer de machine virtuelle.' },
        { glyph: '◎', label: 'INVENTAIRE', status: 'LECTURE SEULE', tone: 'wip', title: 'Inventaire Proxmox', text: 'L’application native liste les nœuds et les modèles Proxmox à travers le serveur de contrôle. Une sonde Rust en lecture seule a été vérifiée sur un labo Proxmox jetable ; les tests automatiques du fournisseur utilisent des certificats TLS locaux.' },
        { glyph: '◇', label: 'APERÇU', status: 'APERÇU SEULEMENT', tone: 'wip', title: 'Aperçu de création', text: 'Un plan hors ligne tiré de votre catalogue images → modèles, qui ne réserve ni ne crée jamais de machine, plus des vérifications préalables en lecture seule sur Proxmox.' },
        { glyph: '⟳', label: 'OPÉRATIONS', status: 'MARCHE EN LOCAL', tone: 'ok', title: 'Opérations en arrière-plan', text: 'Les rafraîchissements de l’inventaire tournent comme des opérations en arrière-plan enregistrées, avec suivi de l’état, demandes sans effet si répétées et reprise après un redémarrage.' },
        { glyph: '▥', label: 'SSH', status: 'PROTOTYPE · MACOS', tone: 'wip', title: 'Terminal SSH', text: 'Un terminal graphique sur un transport PTY natif et borné, avec une politique de confiance des hôtes persistante et une vérification de l’authentification par agent.' },
        { glyph: '⏻', label: 'CYCLE DE VIE', status: 'VALIDÉ EN LOCAL', tone: 'wip', title: 'Démarrer et arrêter', text: 'La confirmation explicite, les actions durables et le suivi du démarrage et de l’arrêt propre passent un parcours isolé de l’interface native et de l’IPC sous Linux. Les vraies actions sur les machines et les instantanés restent à vérifier ; la création est en cours.' },
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'LA PREMIÈRE VERSION / TELLE QUE LA FEUILLE DE ROUTE LA DÉCRIT',
      title: ['D’une définition', 'à une machine qui tourne.'],
      text: 'L’objectif de bout en bout : les définitions et les aperçus fonctionnent en local, le démarrage et l’arrêt ont une validation native isolée, et la création et les instantanés sont encore en développement.',
      steps: [
        { glyph: '⇄', label: 'CONNECTER', title: 'Connecter.', code: 'control plane', text: 'Reliez l’application à votre serveur de contrôle hébergé chez vous, et celui-ci à un serveur ou cluster Proxmox VE.' },
        { glyph: '▤', label: 'DÉCRIRE', title: 'Décrire.', code: 'Environment', text: 'Créez un environnement basé sur Debian à partir d’un modèle Proxmox préparé, avec son processeur, sa mémoire, son disque et une clé publique SSH.' },
        { glyph: '◇', label: 'CRÉER', title: 'Créer.', code: 'cloud-init', text: 'Suivez la création comme une tâche jusqu’à ce que la machine soit prête — sans longue requête bloquante.' },
        { glyph: '▶', label: 'UTILISER', title: 'Utiliser.', code: 'ssh', text: 'Démarrez et arrêtez la machine, et connectez-vous en SSH depuis l’ordinateur ou le téléphone quand le réseau le permet.' },
        { glyph: '▣', label: 'GARDER', title: 'Garder.', code: 'snapshot', text: 'Créez et restaurez des instantanés ; supprimez l’instance en gardant sa définition, puis recréez-la.' },
      ],
      fine: 'Le résultat visé par la première version, d’après VMAnyware.md ; l’état actuel de la réalisation et de la validation est suivi dans STATE.md.',
    },
    {
      type: 'terminal',
      id: 'definition',
      scene: 'definition',
      eyebrow: 'UNE DÉFINITION',
      title: ['Un environnement', 'est un fichier.'],
      text: 'Du YAML versionné, validé strictement par le serveur de contrôle, rangé indépendamment de toute machine virtuelle.',
      tabs: [
        {
          name: 'Environnement',
          label: 'examples/kernel-lab.yaml',
          caption: 'Un environnement de développement Linux : image, ressources, cloud-init, paquets et cycle de vie.',
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
          name: 'Modèles',
          label: 'examples/templates.yaml',
          caption: 'Le catalogue explicite images → modèles que lit l’aperçu de création. Des valeurs d’exemple, non vérifiées sur un vrai homelab.',
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
          name: 'Développer',
          label: 'make',
          caption: 'La démo locale : l’API dans un terminal, la fenêtre native dans un autre.',
          text: `$ make doctor           # local tool availability, no credentials or network
$ make install-client
$ make server           # local Axum API on 127.0.0.1:8080
$ make dev              # native Tauri window
$ make check            # frontend build/tests, Rust fmt/clippy/tests`,
        },
      ],
      fine: 'Tiré des exemples (examples/) et du README du dépôt ; la clé publique de démonstration est raccourcie ici.',
    },
    {
      type: 'receipts',
      id: 'status',
      scene: 'status',
      eyebrow: 'ÉTAT / EN DÉVELOPPEMENT',
      title: ['Tôt,', 'et honnête là-dessus.'],
      text: 'Ce qui a été vérifié, ce qui reste à faire, et ce qui n’est pas construit — chacun à sa place.',
      cards: [
        { label: 'VÉRIFIÉ', title: 'Compile et passe en local.', text: 'Les vérifications de l’interface et de Rust ont des preuves en local sous macOS et Linux. Un parcours isolé sous Linux fait tourner la vraie interface Tauri, l’IPC, le service Axum et un fournisseur HTTPS généré pour le démarrage et l’arrêt propre.' },
        { label: 'À VENIR', title: 'Un vrai Proxmox, de vraies machines.', text: 'L’exploration en lecture seule du labo est vérifiée. La création réelle, les vraies actions sur les machines, les instantanés et le démarrage normal de l’application empaquetée restent à vérifier.' },
        { label: 'EN COURS', title: 'Création et distribution.', text: 'Le transport des clones complets, les intentions de création durables et un journal ont des preuves de tests en local. La création complète des machines n’est pas terminée ; la signature, les installateurs et les projets mobiles sont à venir.' },
        { label: 'SUR ACCORD', title: 'Rien ne change tout seul.', text: 'Toute autre modification de machines ou d’identifiants sur le labo demande un accord sur la cible et l’opération précises. Les tests ne tournent jamais de façon destructrice sur un hôte non confirmé.' },
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / EN DÉVELOPPEMENT',
      title: ['Essayez la démo locale', 'sans Proxmox.'],
      text: 'Lancez l’API et la fenêtre native côte à côte, puis vérifiez le service local.',
      installLabel: 'EN LOCAL · DEPUIS LA RACINE DU DÉPÔT',
      install: `make doctor
make install-client
make server      # in one terminal
make dev         # in another, then click "Check local service"`,
      small: 'Node.js 22.12+, Rust 1.99.1 et les prérequis de Tauri · iOS demande Xcode, Android son SDK/NDK',
    },
  ],
} satisfies Page
