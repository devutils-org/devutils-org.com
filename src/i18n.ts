// The site in English and in French: the words the pages share (buttons,
// labels, what screen readers hear). A page's own text lives in its content
// file, the French one beside the English (src/toolpage/<id>.fr.ts).

export type Lang = 'en' | 'fr'

const en = {
  skip: 'Skip to content',
  home: 'devutils home',
  sections: 'Sections',
  openNav: 'Open navigation',
  closeNav: 'Close navigation',
  // the link to the other language, in that language
  other: { label: 'FR', title: 'Version française' },
  discover: (name: string) => `Discover ${name}`,
  openRepo: 'Open the repository',
  allTools: 'All devutils tools',
  repository: 'Repository',
  repoPrivate: 'The repository is currently private',
  copy: 'Copy',
  copyCommand: 'Copy command',
  copied: 'Copied',
  selectIt: 'Select it',
  terminalCaptures: 'Terminal captures',
  practice: {
    nav: 'In practice',
    eyebrow: 'IN PRACTICE / THE EVIDENCE',
    title: ['A problem.', 'What changed.'],
    text: 'Choose a target to read what happened: the problem, the finding and the result. Each story names its evidence and the scope of its validation.',
    targets: 'Projects and validation targets',
    problem: 'Problem',
    finding: 'Finding',
    result: 'Result',
  },
  card: {
    landing: 'Landing page',
    soon: 'Landing page · soon',
    repoPrivate: 'Repository · private',
  },
  family: {
    story: 'Read the story',
    sources: 'sources',
    limit: 'HONEST BOUNDARY',
    close: 'Close',
    guide: (id: string) => `Read the full ${id} guide`,
    guidePrivate: (id: string) => `Full ${id} guide · private repository`,
  },
}

export type Words = typeof en

const fr: Words = {
  skip: 'Aller au contenu',
  home: 'Accueil devutils',
  sections: 'Sections',
  openNav: 'Ouvrir la navigation',
  closeNav: 'Fermer la navigation',
  other: { label: 'EN', title: 'English version' },
  discover: (name) => `Découvrir ${name}`,
  openRepo: 'Ouvrir le dépôt',
  allTools: 'Tous les outils devutils',
  repository: 'Dépôt',
  repoPrivate: 'Le dépôt est privé pour l’instant',
  copy: 'Copier',
  copyCommand: 'Copier la commande',
  copied: 'Copié',
  selectIt: 'Sélectionnez-la',
  terminalCaptures: 'Captures du terminal',
  practice: {
    nav: 'En pratique',
    eyebrow: 'EN PRATIQUE / LES PREUVES',
    title: ['Un problème.', 'Ce qui a changé.'],
    text: 'Choisissez une cible pour lire ce qui s’est passé : le problème, la découverte et le résultat. Chaque histoire cite ses preuves et l’étendue de sa validation.',
    targets: 'Projets et cibles de validation',
    problem: 'Problème',
    finding: 'Découverte',
    result: 'Résultat',
  },
  card: {
    landing: 'Page de l’outil',
    soon: 'Page de l’outil · bientôt',
    repoPrivate: 'Dépôt · privé',
  },
  family: {
    story: 'Lire l’histoire',
    sources: 'sources',
    limit: 'LIMITE ASSUMÉE',
    close: 'Fermer',
    guide: (id) => `Lire le guide ${id} complet`,
    guidePrivate: (id) => `Guide ${id} complet · dépôt privé`,
  },
}

export const words: Record<Lang, Words> = { en, fr }

// the language of the page the script runs in
export const pageLang = (): Lang => (document.documentElement.lang === 'fr' ? 'fr' : 'en')
