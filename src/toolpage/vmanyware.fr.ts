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
      title: ['Parcours implémentés,', 'limites visibles.'],
      text: 'Les preuves natives et simulées restent distinctes de la validation d’un vrai homelab.',
      cards: [
        {"glyph": "▤", "label": "DÉFINITIONS", "status": "VALIDÉ EN LOCAL", "tone": "ok", "title": "Définitions et inspection", "text": "YAML strict, empreintes déterministes et SQLite. Inspection des définitions et lecture explicite de l’état distant, distincte de la disponibilité SSH."},
        {"glyph": "◇", "label": "CRÉATION", "status": "FOURNISSEUR SIMULÉ", "tone": "ok", "title": "Créer et recréer", "text": "Clone, ressources, Cloud-Init, disponibilité et recréation passent les tests API/worker et natifs. Vrais templates et guests Proxmox restent à valider."},
        {"glyph": "▥", "label": "SSH", "status": "INTÉGRATION NATIVE", "tone": "ok", "title": "Terminal interactif", "text": "Empreinte confirmée, identité chiffrée et terminal. Le parcours Linux vérifie commande, redimensionnement, déconnexion et refus de clé modifiée contre un serveur SSH local dédié."},
        {"glyph": "⏻", "label": "CYCLE DE VIE", "status": "INTÉGRATION NATIVE", "tone": "ok", "title": "Contrôle et reprise", "text": "Démarrage/arrêt distant, snapshots/restauration, suppression et reprise après redémarrage passent les tests avec fournisseur simulé, sans rejouer les mutations incertaines."},
        {"glyph": "▣", "label": "ÉTAPES DÉCLARÉES", "status": "INTÉGRATION NATIVE", "tone": "ok", "title": "Paquets et snapshot final", "text": "Revue explicite des paquets et du snapshot final validée sur les parcours Linux natifs de création/recréation, y compris la reprise après réponse perdue. Messages d’erreur et lecture explicite des étapes validés en intégration native ; installation dans un vrai guest non validée."},
        {"glyph": "⇄", "label": "LIVRAISON", "status": "ARTEFACTS DE TEST", "tone": "wip", "title": "Serveur Linux et Android", "text": "Archives serveur Linux et APK Android debug signés ARM64/x86_64 sont compilables. APK actuel, déploiement réel et plateformes restent à valider ; ce n’est pas une release candidate."},
      ],
    },
    {
      type: 'flow',
      scene: 'flow',
      eyebrow: 'LA PREMIÈRE VERSION / TELLE QUE LA FEUILLE DE ROUTE LA DÉCRIT',
      title: ['D’une définition', 'à une machine qui tourne.'],
      text: 'Les parcours natifs et simulés ont leurs preuves. Le guest réel approuvé et l’APK Android actuel restent à valider.',
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
      title: ['Implémenté,', 'encore en validation.'],
      text: 'Ce qui a été vérifié, ce qui reste à faire, et ce qui n’est pas construit — chacun à sa place.',
      cards: [
        { label: 'VÉRIFIÉ', title: 'API, worker et parcours natifs.', text: 'Les tests dédiés couvrent création/recréation, cycle de vie, snapshots, suppression et reprise. Le SSH Linux natif utilise un serveur local généré ; cela ne prouve pas le comportement d’un vrai guest.' },
        { label: 'EN ATTENTE', title: 'Le parcours Proxmox à la maison.', text: 'Template réel, ressources, Cloud-Init, paquets, SSH et restauration de l’état du guest nécessitent une cible Proxmox jetable disponible et explicitement approuvée.' },
        { label: 'ENSUITE', title: 'Plateformes et stockage des clés.', text: 'La lecture des étapes passe les tests natifs Linux, y compris avec le serveur extrait de son archive. Les APK actualisés passent les contrôles de paquet ; exécution Android, stockage système des clés, iOS/Windows, déploiement et release restent à valider.' },
        { label: 'SUR APPROBATION', title: 'Des cibles concrètes.', text: 'Les changements de VM réelle, de production ou d’identifiants demandent l’approbation de la cible et de l’opération. Les tests par défaut utilisent des fixtures locales sans identifiants Proxmox.' },
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
