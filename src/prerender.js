// What the build writes into each page before it ships (scripts/prerender.mjs):
// per page of src/pages.js, the HTML of each element to fill, by id. Built for
// Node with `vite build --ssr`.

import { pages as registry } from './pages.js'
import { homeHtml } from './home.js'
import { toolPageHtml } from './toolpage/render.js'
import omn from './omn/page.js'
import atfq from './toolpage/atfq.js'
import distroproof from './toolpage/distroproof.js'
import xpac from './toolpage/xpac.js'
import vmanyware from './toolpage/vmanyware.js'
import together from './toolpage/together.js'
import design from './toolpage/design.js'

const content = {
  main: homeHtml(),
  omn: toolPageHtml(omn),
  atfq: toolPageHtml(atfq),
  distroproof: toolPageHtml(distroproof),
  xpac: toolPageHtml(xpac),
  vmanyware: toolPageHtml(vmanyware),
  together: toolPageHtml(together),
  design: toolPageHtml(design),
}

for (const name of Object.keys(content)) {
  if (!registry.some((page) => page.name === name)) throw new Error(`src/prerender.js: ${name} is not in src/pages.js`)
}
export const pages = registry.map((page) => {
  if (!content[page.name]) throw new Error(`src/prerender.js: no content for ${page.name} (src/pages.js)`)
  return { ...page, fill: content[page.name] }
})
