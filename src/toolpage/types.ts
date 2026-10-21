// The content of a tool page (src/toolpage/<id>.ts, src/omn/page.ts), as
// src/toolpage/render.ts reads it. A field the renderer does not read is a
// type error here, so a page cannot carry content that never shows.

import type { Tool } from '../tools.ts'
import type { Lang } from '../i18n.ts'

// where the glass mark goes while a section holds the middle of the viewport
export interface SceneState {
  anchor?: Element | null
  fx?: number
  fy?: number
  size?: number
  opacity?: number
}

// A page that is not a tool's (the org's own pages) gives `meta` instead of
// an id, in the shape of a tools.ts entry.
export type PageMeta = Pick<Tool, 'id' | 'name' | 'line' | 'color' | 'license'> & { repoUrl: string }

// two lines, the second under the first
export type Lines = [string, string]

// [label, '#anchor'], or [label, { repo: path }] into the repository
export type NavEntry = [string, string | { repo: string }]

interface Base {
  id?: string
  scene: string
  // beside "section" in the section's class
  class?: string
  // over the default place of the glass mark
  mark?: SceneState
  // run once the page is on screen, with the section's element
  wire?: (root: HTMLElement) => void
}

interface Heading {
  eyebrow: string
  title: Lines
  text: string
}

export interface FlowStep {
  id?: string
  glyph: string
  label: string
  title: string
  text: string
  detail?: string
  code?: string
}

export interface TerminalTab {
  name: string
  label: string
  caption: string
  // a transcript, highlighted as a shell; or HTML as it is
  text?: string
  html?: string
}

export interface Install {
  label: string
  note?: string
  code: string
}

export type Section =
  | (Base & Heading & { type: 'intro'; columns: [string, string][] })
  | (Base & Heading & { type: 'cards'; cards: { glyph: string; label: string; title: string; text: string; status?: string; tone?: 'ok' | 'wip' | 'no'; cmd?: string }[] })
  | (Base & Heading & { type: 'flow'; steps: FlowStep[]; fine?: string })
  | (Base & Heading & { type: 'terminal'; tabs: TerminalTab[]; fine?: string; pre?: string; size?: string; after?: string })
  | (Base & Heading & { type: 'table'; head: string[]; rows: string[][]; fine?: string })
  | (Base & Heading & { type: 'receipts'; cards: { label: string; title: string; text: string; pre?: string }[] })
  | (Base & Heading & { type: 'logo'; src: string; alt: string; caption: string; parts: [string, string, string][] })
  | (Base & Heading & { type: 'palette'; groups: { label: string; colors: [string, string, string][] }[]; fine?: string })
  | (Base & Heading & { type: 'layers'; layers: { label: string; title: string; text: string; html: string }[]; stats?: [string, string][]; link?: [string, string] })
  | (Base & {
      type: 'split'
      left: { eyebrow: string; title: string; text: string; facts: [string, string, string][] }
      right: { eyebrow: string; title: string; text: string; queries: [string, string][] }
    })
  | (Base & Heading & { type: 'keys'; keys: [string[], string][] })
  // a heading over HTML of its own
  | (Base & Heading & { type: 'html'; body: string; fine?: string })
  // the tool's "In practice" stories (src/practice/cases.ts), here rather than before `start`
  | { type: 'practice'; scene?: undefined; wire?: undefined; mark?: undefined }
  | (Base &
      Heading & {
        type: 'start'
        small: string
        // the install blocks: several, or one from installLabel and install
        installs?: Install[]
        installLabel?: string
        install?: string
        // one command with a copy button, instead of install blocks
        command?: string
        // HTML of the buttons, instead of the repository's and the home page's
        actions?: string
      })

export interface Page {
  // the language it is written in; English when not said
  lang?: Lang
  // a tool of src/tools.ts, or `meta` for a page that is not a tool's
  id?: string
  meta?: PageMeta
  nav: NavEntry[]
  hero: {
    title: Lines
    // HTML
    copy: string
    // the second button's label, HTML
    primary: string
  }
  sections: Section[]
  // the footer's line after the name, instead of the tool's line
  footer?: string
  // where the footer's licence link points in the repository
  licensePath?: string
}
