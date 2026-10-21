// Every page of the site, in one place. The build takes its entries from here
// and writes each page's <head> (vite.config.ts, src/shell.ts); a tool page's
// whole HTML comes from here, its file being a placeholder. The content the
// build writes into each page is checked against this list
// (src/prerender.ts), and so are the social visuals
// (scripts/social-pages.ts). Plain data: Node reads it without Vite.

import type { ShapeName } from './shapes.ts'

export interface SitePage {
  // the build entry, and the page's content in src/prerender.ts
  name: string
  // the HTML file
  file: string
  title: string
  description: string
  // for link previews, when it is not the description
  ogDescription?: string
  // the glass shape the page shows (src/shapes.ts)
  shape: ShapeName
  // the stylesheets after src/style.css
  css: string[]
  // a tool page's content module (src/toolpage/render.ts renders it); the
  // home page, without one, writes its own body
  content?: string
  // public/og/<preview>.png, 1200 × 627, and the folder of its social visuals,
  // assets/pages/<preview>/; the org's when there is none
  preview?: string
  // the brand on its social visuals
  brand?: string
}

const toolCss = ['/src/toolpage/components.css', '/src/toolpage/toolpage.css']

export const pages: SitePage[] = [
  {
    name: 'main',
    file: 'index.html',
    title: 'devutils — Small tools. Honest answers.',
    description: 'devutils — small Linux tools that show their work: observability, explanations, distro checks, packages and homelabs.',
    ogDescription: 'Small Linux tools that show their work.',
    shape: 'mark',
    css: [],
    preview: 'main',
    brand: 'devutils',
  },
  {
    name: 'omn',
    file: 'tools/omn/index.html',
    title: 'Omniscient — See beyond the surface.',
    description: 'Observe Linux workloads across CPU, GPU, memory, network and disk, with the evidence beside every number.',
    ogDescription: 'Linux observability, direct from the kernel, with the evidence beside every number.',
    shape: 'omn',
    css: ['/src/toolpage/components.css', '/src/omn/omn.css'],
    content: '/src/omn/page.ts',
    preview: 'omniscient',
    brand: 'Omniscient',
  },
  {
    name: 'atfq',
    file: 'tools/atfq/index.html',
    title: 'ATFQ — Ask the question. Read your machine.',
    description: 'A Linux companion for the terminal: short answers first, your machine’s real state second, the deep why only if you want it. Read-only.',
    shape: 'mark',
    css: toolCss,
    content: '/src/toolpage/atfq.ts',
    preview: 'atfq',
    brand: 'ATFQ',
  },
  {
    name: 'distroproof',
    file: 'tools/distroproof/index.html',
    title: 'distroproof — Works on my machine. Proven on theirs.',
    description: 'Test your program on 20 distro images with their own kernels. Compare failures using environment facts, as demonstrated by the Omniscient case study.',
    shape: 'distroproof',
    css: toolCss,
    content: '/src/toolpage/distroproof.ts',
    preview: 'distroproof',
    brand: 'distroproof',
  },
  {
    name: 'xpac',
    file: 'tools/xpac/index.html',
    title: 'xpac — Every package. Every reason.',
    description: 'Native package inventory, provenance, conservative plans and declarative TOML reconciliation across APT, Pacman, RPM/DNF, Flatpak, Homebrew, apk and Portage.',
    shape: 'xpac',
    css: toolCss,
    content: '/src/toolpage/xpac.ts',
    preview: 'xpac',
    brand: 'xpac',
  },
  {
    name: 'vmanyware',
    file: 'tools/vmanyware/index.html',
    title: 'VMAnyware — Your homelab. From anywhere.',
    description: 'Define a Linux environment once, provision it on your own Proxmox, and reach it from desktop or phone. In development. Local lifecycle validated; provisioning in progress.',
    shape: 'vmanyware',
    css: toolCss,
    content: '/src/toolpage/vmanyware.ts',
    preview: 'vmanyware',
    brand: 'VMAnyware',
  },
  {
    name: 'together',
    file: 'together/index.html',
    title: 'Together — How the devutils tools check each other',
    description: 'Five independent Linux tools that test each other: distroproof proves Omniscient and xpac on real kernels, xpac installs reference tools, Omniscient measures VMAnyware, atfq is held to procfs.',
    shape: 'mark',
    css: toolCss,
    content: '/src/toolpage/together.ts',
  },
  {
    name: 'design',
    file: 'design/index.html',
    title: 'Design — The devutils mark and art direction',
    description: 'The devutils mark, a Q turned into a graph node, rendered as glass in a shader: its origin in ATFQ, its anatomy, the tool shapes, colours and type.',
    shape: 'mark',
    css: toolCss,
    content: '/src/toolpage/design.ts',
  },
]

// the address a page is served at: tools/atfq/index.html → /tools/atfq/
export const route = (page: SitePage) => `/${page.file.replace(/index\.html$/, '')}`

// the page of that name (a tool's id, or together, design…)
export function page(name: string): SitePage {
  const found = pages.find((p) => p.name === name)
  if (!found) throw new Error(`no page ${name} in src/pages.ts`)
  return found
}
