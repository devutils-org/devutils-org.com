// Every page of the site, in one place, in English and in French. The build
// takes its entries from here and writes each page's <head> (vite.config.ts,
// src/shell.ts); a tool page's whole HTML comes from here, its file being a
// placeholder. The content the build writes into each page is checked against
// this list (src/prerender.ts), and so are the social visuals
// (scripts/social-pages.ts). Plain data: Node reads it without Vite.
//
// Each page is written once below, in English, with its French title and
// descriptions beside it; the French page is the same page under /fr/, its
// content in the module of the same name ending in .fr.ts.

import type { Lang } from './i18n.ts'
import type { ShapeName } from './shapes.ts'

interface Words {
  title: string
  description: string
  // for link previews, when it is not the description
  ogDescription?: string
}

interface Page extends Words {
  // the same for a page and its translation: the tool's id, together, design…
  key: string
  // the HTML file, in English
  file: string
  // the glass shape the page shows (src/shapes.ts)
  shape: ShapeName
  // the stylesheets after src/style.css
  css: string[]
  // a tool page's content module (src/toolpage/render.ts renders it); the
  // home page, without one, writes its own body
  content?: string
  // public/og/<preview>.png, 1200 × 627, and the folder of its social visuals,
  // assets/devutils-linkedin-pages/pages/<preview>/; the org's when there is none
  preview?: string
  // the brand on its social visuals
  brand?: string
  fr: Words
}

export interface SitePage extends Omit<Page, 'fr'> {
  // the build entry, and the page's content in src/prerender.ts
  name: string
  lang: Lang
}

const toolCss = ['/src/toolpage/components.css', '/src/toolpage/toolpage.css']

const written: Page[] = [
  {
    key: 'main',
    file: 'index.html',
    title: 'devutils — Small tools. Honest answers.',
    description: 'devutils — small Linux tools that show their work: observability, explanations, distro checks, packages and homelabs.',
    ogDescription: 'Small Linux tools that show their work.',
    shape: 'mark',
    css: [],
    preview: 'main',
    brand: 'devutils',
    fr: {
      title: 'devutils — Petits outils. Réponses honnêtes.',
      description: 'devutils — de petits outils Linux qui montrent leur travail : observation, explications, vérifications sur chaque distribution, paquets et homelabs.',
      ogDescription: 'De petits outils Linux qui montrent leur travail.',
    },
  },
  {
    key: 'omn',
    file: 'tools/omn/index.html',
    title: 'Omniscient — See beyond the surface.',
    description: 'Observe Linux workloads across CPU, GPU, memory, network and disk, with the evidence beside every number.',
    ogDescription: 'Linux observability, direct from the kernel, with the evidence beside every number.',
    shape: 'omn',
    css: ['/src/toolpage/components.css', '/src/omn/omn.css'],
    content: '/src/omn/page.ts',
    preview: 'omniscient',
    brand: 'Omniscient',
    fr: {
      title: 'Omniscient — Voir au-delà de la surface.',
      description: 'Observer ce que font les programmes sous Linux, du processeur au disque, avec la preuve à côté de chaque chiffre.',
      ogDescription: 'L’observation de Linux, directement depuis le noyau, avec la preuve à côté de chaque chiffre.',
    },
  },
  {
    key: 'atfq',
    file: 'tools/atfq/index.html',
    title: 'ATFQ — Ask the question. Read your machine.',
    description: 'A Linux companion for the terminal: short answers first, your machine’s real state second, the deep why only if you want it. Read-only.',
    shape: 'mark',
    css: toolCss,
    content: '/src/toolpage/atfq.ts',
    preview: 'atfq',
    brand: 'ATFQ',
    fr: {
      title: 'ATFQ — Posez la question. Lisez votre machine.',
      description: 'Un compagnon Linux pour le terminal : la réponse courte d’abord, l’état réel de votre machine ensuite, le pourquoi détaillé seulement si vous le voulez. En lecture seule.',
    },
  },
  {
    key: 'distroproof',
    file: 'tools/distroproof/index.html',
    title: 'distroproof — Works on my machine. Proven on theirs.',
    description: 'Test your program on 20 distro images with their own kernels. Compare failures using environment facts, as demonstrated by the Omniscient case study.',
    shape: 'distroproof',
    css: toolCss,
    content: '/src/toolpage/distroproof.ts',
    preview: 'distroproof',
    brand: 'distroproof',
    fr: {
      title: 'distroproof — Ça marche chez moi. Prouvé chez eux.',
      description: 'Testez votre programme sur 20 images de distributions, chacune avec son propre noyau. Comparez les échecs grâce aux faits de l’environnement, comme l’a montré l’étude de cas d’Omniscient.',
    },
  },
  {
    key: 'xpac',
    file: 'tools/xpac/index.html',
    title: 'xpac — Every package. Every reason.',
    description: 'Native package inventory, provenance, conservative plans and declarative TOML reconciliation across APT, Pacman, RPM/DNF, Flatpak, Homebrew, apk and Portage.',
    shape: 'xpac',
    css: toolCss,
    content: '/src/toolpage/xpac.ts',
    preview: 'xpac',
    brand: 'xpac',
    fr: {
      title: 'xpac — Chaque paquet. Chaque raison.',
      description: 'L’inventaire des paquets installés, leur provenance, des plans prudents et une mise en conformité déclarative en TOML, pour APT, Pacman, RPM/DNF, Flatpak, Homebrew, apk et Portage.',
    },
  },
  {
    key: 'vmanyware',
    file: 'tools/vmanyware/index.html',
    title: 'VMAnyware — Your homelab. From anywhere.',
    description: 'Define a Linux environment once, provision it on your own Proxmox, and reach it from desktop or phone. In development. Local lifecycle validated; provisioning in progress.',
    shape: 'vmanyware',
    css: toolCss,
    content: '/src/toolpage/vmanyware.ts',
    preview: 'vmanyware',
    brand: 'VMAnyware',
    fr: {
      title: 'VMAnyware — Votre homelab. De partout.',
      description: 'Décrivez un environnement Linux une fois, créez-le sur votre propre serveur Proxmox, et accédez-y depuis votre ordinateur ou votre téléphone. En développement : cycle de vie validé en local, création des machines en cours.',
    },
  },
  {
    key: 'together',
    file: 'together/index.html',
    title: 'Together — How the devutils tools check each other',
    description: 'Five independent Linux tools that test each other: distroproof proves Omniscient and xpac on real kernels, xpac installs reference tools, Omniscient measures VMAnyware, atfq is held to procfs.',
    shape: 'mark',
    css: toolCss,
    content: '/src/toolpage/together.ts',
    fr: {
      title: 'Ensemble — Comment les outils devutils se vérifient entre eux',
      description: 'Cinq outils Linux indépendants qui se testent les uns les autres : distroproof éprouve Omniscient et xpac sur de vrais noyaux, xpac installe les outils de référence, Omniscient mesure VMAnyware, atfq est confronté à procfs.',
    },
  },
  {
    key: 'contributions',
    file: 'contributions/index.html',
    title: 'Open-source contributions — devutils',
    description: 'Projects investigated with devutils: reproducible analysis, diagnostic fixes, measured optimizations and the status of upstream contributions.',
    shape: 'mark',
    css: [...toolCss, '/src/contributions/contributions.css'],
    content: '/src/contributions/index.ts',
    fr: {
      title: 'Contributions open source — devutils',
      description: 'Les projets analysés avec devutils : analyses reproductibles, correctifs de diagnostic, optimisations mesurées et statut des contributions en amont.',
    },
  },
  {
    key: 'contributions-rug',
    file: 'contributions/rug/index.html',
    title: 'RUG — Analysis, fixes and optimizations · devutils',
    description: 'The RUG contribution record: a C++98 parser audit, one diagnostic fix and two independently measured optimization proposals, with reports and raw evidence.',
    shape: 'mark',
    css: [...toolCss, '/src/contributions/contributions.css'],
    content: '/src/contributions/rug.ts',
    fr: {
      title: 'RUG — Analyse, correctifs et optimisations · devutils',
      description: 'Le dossier RUG : audit d’un parseur C++98, un correctif de diagnostic et deux propositions d’optimisation mesurées séparément, avec rapports et données brutes.',
    },
  },
  {
    key: 'design',
    file: 'design/index.html',
    title: 'Design — The devutils mark and art direction',
    description: 'The devutils mark, a Q turned into a graph node, rendered as glass in a shader: its origin in ATFQ, its anatomy, the tool shapes, colours and type.',
    shape: 'mark',
    css: toolCss,
    content: '/src/toolpage/design.ts',
    fr: {
      title: 'Design — Le logo devutils et sa direction artistique',
      description: 'Le logo devutils, un Q devenu nœud de graphe, rendu en verre dans un shader : son origine dans ATFQ, son anatomie, les formes des outils, les couleurs et la typographie.',
    },
  },
]

export const pages: SitePage[] = [
  ...written.map(({ fr, ...page }): SitePage => ({ ...page, name: page.key, lang: 'en' })),
  ...written.map(({ fr, brand, ...page }): SitePage => ({
    ...page,
    ...fr,
    ogDescription: fr.ogDescription,
    name: `${page.key}-fr`,
    lang: 'fr',
    file: `fr/${page.file}`,
    content: page.content?.replace(/\.ts$/, '.fr.ts'),
  })),
]

// the address a page is served at: fr/tools/atfq/index.html → /fr/tools/atfq/
export const route = (page: SitePage) => `/${page.file.replace(/index\.html$/, '')}`

// the page of that key in that language
export function pageOf(key: string, lang: Lang = 'en'): SitePage {
  const found = pages.find((p) => p.key === key && p.lang === lang)
  if (!found) throw new Error(`no page ${key} (${lang}) in src/pages.ts`)
  return found
}

// the same page in the other language
export const translation = (page: SitePage) => pageOf(page.key, page.lang === 'en' ? 'fr' : 'en')
