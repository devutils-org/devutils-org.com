// What the build writes into each page before it ships (scripts/prerender.mjs):
// per output file, the HTML of each element to fill, by id, and HTML to insert
// before a given marker. Built for Node with `vite build --ssr`.

import { homeHtml } from './home.js'
import { omnHtml } from './omn/html.js'
import { toolPageHtml } from './toolpage/render.js'
import atfq from './toolpage/atfq.js'
import distroproof from './toolpage/distroproof.js'
import xpac from './toolpage/xpac.js'
import vmanyware from './toolpage/vmanyware.js'
import together from './toolpage/together.js'
import design from './toolpage/design.js'

const omn = omnHtml()

export const pages = {
  'index.html': { fill: homeHtml() },
  'tools/omn/index.html': { fill: omn.fill, before: { '<section class="section" id="portability"': omn.practice } },
  'tools/atfq/index.html': { fill: toolPageHtml(atfq) },
  'tools/distroproof/index.html': { fill: toolPageHtml(distroproof) },
  'tools/xpac/index.html': { fill: toolPageHtml(xpac) },
  'tools/vmanyware/index.html': { fill: toolPageHtml(vmanyware) },
  'together/index.html': { fill: toolPageHtml(together) },
  'design/index.html': { fill: toolPageHtml(design) },
}
