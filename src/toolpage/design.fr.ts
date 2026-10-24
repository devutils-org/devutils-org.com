// La page Design en français : la même que design.ts, section pour section
// (src/site.test.ts le vérifie). Les noms de couleurs gardent leur valeur ;
// les noms d'éléments et de fichiers restent ceux du code.

import { icon } from '../html.ts'
import type { Page } from './types.ts'

const arrow = icon('arrow-up-right')

export default {
  lang: 'fr',
  meta: {
    id: 'design',
    name: 'Design',
    line: 'Le logo, le verre et la lumière.',
    color: '#c9d4ff',
    repoUrl: 'https://github.com/devutils-org/devutils-org.com',
    license: 'MIT / Apache-2.0',
  },
  nav: [['Origine', '#origin'], ['Le logo', '#mark'], ['Le verre', '#glass'], ['Formes', '#shapes'], ['Couleurs', '#colour'], ['Typographie', '#type']],
  hero: {
    title: ['Une question.', 'Taillée dans le verre.'],
    copy: 'Un Q devenu nœud de graphe.<br />Le logo devutils, rendu en verre.',
    primary: 'Utiliser le logo',
  },
  sections: [
    {
      type: 'intro',
      id: 'origin',
      scene: 'origin',
      eyebrow: 'D’OÙ IL VIENT',
      title: ['Né d’une question.', 'Gardé comme un instrument.'],
      text: 'Le logo a d’abord été dessiné pour ATFQ, « Ask The F*cking Question », une plateforme collaborative d’apprentissage de l’informatique construite autour des questions à se poser avant les réponses. Le concept de marque, le logo, l’ambiance de l’interface et le prototype Figma ont été faits en interne. atfq, le compagnon du terminal, a hérité du nom, et devutils du logo.',
      columns: [
        ['Une clarté géométrique.', 'Uniquement des cercles et des lignes tangentes : le logo passe d’une icône de 16 pixels à la 3D de l’accueil sans être redessiné.'],
        ['Un minimalisme open source.', 'Net et technique, dans le langage visuel des outils de développement qu’il côtoie.'],
        ['Une abstraction utile.', 'Il se lit toujours comme un Q, et évoque aussi un nœud de graphe, un schéma technique et un œil.'],
      ],
    },
    {
      type: 'logo',
      id: 'mark',
      scene: 'mark',
      eyebrow: 'LE LOGO / ANATOMIE',
      title: ['Un Q, un nœud,', 'un œil.'],
      text: 'Quatre parties, chacune avec un sens. La queue du Q n’est pas un trait : c’est un second cercle relié au premier, comme une arête dans un graphe.',
      src: '/mark.svg',
      alt: 'Le logo devutils : un anneau avec un cercle satellite en bas à droite, autour d’un grand disque',
      caption: 'public/mark.svg · 62 × 62 · dégradé de glace à violet',
      parts: [
        ['ANNEAU', 'La question.', 'Le cercle extérieur est la question au centre du logo : ouverte, universelle et accessible.'],
        ['SATELLITE', 'Un nœud dans un graphe.', 'Au lieu d’une queue classique, un petit cercle s’accroche à l’anneau. Une bonne question relie de nombreux domaines de l’informatique.'],
        ['DISQUE', 'Un œil.', 'Le grand cercle intérieur dessine un œil : la vision et la concentration, la capacité à voir à travers la complexité.'],
        ['ORBITE', 'Le mouvement.', 'Les cercles sont posés sur une orbite, qui évoque la découverte : apprendre comme un chemin qu’on suit, pas comme une pile qu’on accumule.'],
      ],
    },
    {
      type: 'receipts',
      id: 'glass',
      scene: 'glass',
      eyebrow: 'LE VERRE / CALCULÉ, PAS DESSINÉ',
      title: ['Un logo qu’on peut', 'bousculer.'],
      text: 'Sur le site, le logo n’est pas une image. C’est une plaque de verre calculée par lancer de rayons dans un simple shader WebGL, dessinée seulement dans le carré qui l’entoure, et qui réfracte les lumières derrière elle.',
      cards: [
        { label: 'SIX BLOCS', title: 'Découpé en morceaux.', text: 'Le shader construit le logo avec six blocs : la boule, l’anneau en quatre arcs, et le disque. La boule tourne autour de l’anneau, et l’anneau et le disque se déforment autour d’elle.' },
        { label: 'LE POINTEUR', title: 'Il ne répond que de près.', text: 'Chaque forme bouge lentement d’elle-même. Près du pointeur, les blocs se changent en bulles et s’en écartent, puis reviennent en place.' },
        { label: 'LE DÉFILEMENT', title: 'Il suit la page.', text: 'Il se tient sur l’accueil, glisse derrière les panneaux dépolis quand la page défile, et revient pour l’appel final.' },
        { label: 'SANS WEBGL', title: 'Il se replie sur le SVG.', text: 'Sans WebGL, le fichier statique <code>mark.svg</code> prend sa place. Avec les animations réduites, le verre reste immobile. La page ne dépend jamais de la 3D.' },
      ],
    },
    {
      type: 'cards',
      id: 'shapes',
      scene: 'shapes',
      eyebrow: 'UNE FORME PAR OUTIL',
      title: ['Le même verre.', 'Un autre instrument.'],
      text: 'Chaque page d’outil affiche sa propre forme de verre, avec les mêmes règles de matière, de lumière et de mouvement. La forme montre ce que fait l’outil.',
      cards: [
        { glyph: '?', label: 'ATFQ · ACCUEIL', title: 'Le logo', text: 'Le Q d’origine, pour l’organisation et pour atfq : boule, anneau et disque, repoussés par le pointeur.' },
        { glyph: '◎', label: 'OMNISCIENT', title: 'Une lentille', text: 'Une sphère dans trois anneaux, chacun tournant sur ses propres axes. Près du pointeur, ils s’alignent de face et concentriques, comme une lentille qui fait la mise au point.' },
        { glyph: '⧉', label: 'DISTROPROOF', title: 'Une matrice de cibles', text: 'Neuf cubes de verre, un par cible, et une perle (votre programme) qui saute de l’un à l’autre. Le pointeur écarte la grille et soulève le cube qui se trouve dessous.' },
        { glyph: '▥', label: 'XPAC', title: 'Un graphe qui devient un plan', text: 'Cinq paquets reliés par des tiges, qui dérivent. Près du pointeur, ils s’empilent en une colonne bien rangée et les tiges disparaissent.' },
        { glyph: '◰', label: 'VMANYWARE', title: 'Une définition et ses instances', text: 'Un cube de verre qui respire. Près du pointeur, des instances en bourgeonnent comme un liquide, s’éloignent, puis refondent dans l’unique définition.' },
      ],
    },
    {
      type: 'palette',
      id: 'colour',
      scene: 'colour',
      eyebrow: 'COULEURS / DE LA GLACE AU VIOLET',
      title: ['Un fond presque noir.', 'Une lumière du cyan au violet.'],
      text: 'La lumière vient d’une seule gamme, de la glace au violet, utilisée pour le dégradé du logo et les couleurs des outils. Les outils s’y placent dans l’ordre du parcours, d’Omniscient côté noyau jusqu’à VMAnyware côté homelab.',
      groups: [
        {
          label: 'Fond et texte',
          colors: [
            ['Fond', '#050507', 'Arrière-plan de la page et couleur du thème'],
            ['Texte', '#f0f0f5', 'Titres et texte courant'],
            ['Atténué', '#9696a5', 'Texte secondaire'],
            ['Cyan', '#82e9ff', 'Contours de focus, invites, accents'],
            ['Violet', '#b7a0ff', 'Second accent'],
          ],
        },
        {
          label: 'Le dégradé du logo',
          colors: [
            ['Glace', '#e6fbff', 'En haut à gauche du logo'],
            ['Brume', '#c9d4ff', 'Arrêt du milieu, à 55 %'],
            ['Lilas', '#c3a8ff', 'En bas à droite du logo'],
          ],
        },
        {
          label: 'Les outils, dans l’ordre du parcours',
          colors: [
            ['Omniscient', '#9cf5ff', 'Observer'],
            ['ATFQ', '#8fdcff', 'Expliquer'],
            ['distroproof', '#96b9ff', 'Vérifier'],
            ['xpac', '#aea0ff', 'Mettre en ordre'],
            ['VMAnyware', '#c38aff', 'Déployer'],
          ],
        },
      ],
      fine: 'Les variables sont dans <code>src/style.css</code> ; les couleurs des outils dans <code>src/tools.ts</code>, le fichier que lit chaque page.',
    },
    {
      type: 'table',
      id: 'type',
      scene: 'type',
      eyebrow: 'TYPOGRAPHIE ET SURFACES',
      title: ['Des titres serrés.', 'Des instruments en chasse fixe.'],
      text: 'La même direction artistique que le premier site d’Omniscient : une police sans empattement pour ce qu’on lit, et une police à chasse fixe pour ce que dit la machine.',
      head: ['Élément', 'Règle', 'Où'],
      rows: [
        ['h1, h2', 'Inter, interlettrage négatif serré : titres en semi-gras, titres de section en medium', 'Titres de l’accueil et des sections'],
        ['eyebrow', 'Chasse fixe, 10–11 px, majuscules, interlettrage large', 'Étiquettes de section, numéros de cartes (01 / LABEL), textes d’interface'],
        ['code', 'Chasse fixe du système, ui-monospace en premier', 'Commandes, captures du terminal, valeurs'],
        ['.glass', 'Panneau dépoli : flou de l’arrière-plan, bordure claire de 1 px, douce lumière qui suit le pointeur', 'Cartes, terminaux, tableaux, blocs d’installation'],
        ['radius', 'Panneaux 18 px · contrôles 12 px · pastilles 6 px', 'Chaque surface'],
        ['motion', 'Apparition au défilement, décalée de 80 ms ; aucune avec les animations réduites', 'Chaque section'],
      ],
      fine: 'Écrivez <code>backdrop-filter</code> sans son jumeau <code>-webkit-</code> : l’outil de minification du CSS ajoute le préfixe lui-même, et quand les deux sont présents il ne garde que la version préfixée, que Chrome ignore.',
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'UTILISER LE LOGO',
      title: ['Un seul fichier.', 'Chaque page.'],
      text: 'Utilisez le logo depuis une seule source, <code>public/mark.svg</code>, partout où il apparaît. Ne le copiez pas.',
      installLabel: 'DANS UNE PAGE',
      install: `<img class="logo-icon" src="/mark.svg" alt="" />`,
      actions: `<a class="primary" href="/mark.svg" download>Télécharger mark.svg <span>${arrow}</span></a>
        <a class="secondary" href="https://github.com/moha-bekh/atfq-poc">Là où tout a commencé : ATFQ</a>`,
      small: 'Logo et site sous MIT / Apache-2.0 · dessiné à l’origine pour ATFQ',
    },
  ],
} satisfies Page
