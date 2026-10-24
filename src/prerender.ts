// What the build writes into each page before it ships (scripts/prerender.ts):
// per page of src/pages.ts, the HTML of each element to fill, by id. Built for
// Node with `vite build --ssr`.

import { pages as registry } from './pages.ts'
import { homeHtml } from './home.ts'
import { toolPageHtml } from './toolpage/render.ts'
import omn from './omn/page.ts'
import atfq from './toolpage/atfq.ts'
import distroproof from './toolpage/distroproof.ts'
import xpac from './toolpage/xpac.ts'
import vmanyware from './toolpage/vmanyware.ts'
import together from './toolpage/together.ts'
import design from './toolpage/design.ts'
import omnFr from './omn/page.fr.ts'
import atfqFr from './toolpage/atfq.fr.ts'
import distroproofFr from './toolpage/distroproof.fr.ts'
import xpacFr from './toolpage/xpac.fr.ts'
import vmanywareFr from './toolpage/vmanyware.fr.ts'
import togetherFr from './toolpage/together.fr.ts'
import designFr from './toolpage/design.fr.ts'

import toolsHub from './toolpage/tools.ts'
import toolsHubFr from './toolpage/tools.fr.ts'
import about from './toolpage/about.ts'
import aboutFr from './toolpage/about.fr.ts'

import contributions from './contributions/index.ts'
import contributionsFr from './contributions/index.fr.ts'
import rug from './contributions/rug.ts'
import rugFr from './contributions/rug.fr.ts'

const content: Record<string, Record<string, string>> = {
  tools: toolPageHtml(toolsHub),
  'tools-fr': toolPageHtml(toolsHubFr),
  about: toolPageHtml(about),
  'about-fr': toolPageHtml(aboutFr),
  main: homeHtml(),
  contributions: toolPageHtml(contributions),
  'contributions-fr': toolPageHtml(contributionsFr),
  'contributions-rug': toolPageHtml(rug),
  'contributions-rug-fr': toolPageHtml(rugFr),
  omn: toolPageHtml(omn),
  atfq: toolPageHtml(atfq),
  distroproof: toolPageHtml(distroproof),
  xpac: toolPageHtml(xpac),
  vmanyware: toolPageHtml(vmanyware),
  together: toolPageHtml(together),
  design: toolPageHtml(design),
  'main-fr': homeHtml('fr'),
  'omn-fr': toolPageHtml(omnFr),
  'atfq-fr': toolPageHtml(atfqFr),
  'distroproof-fr': toolPageHtml(distroproofFr),
  'xpac-fr': toolPageHtml(xpacFr),
  'vmanyware-fr': toolPageHtml(vmanywareFr),
  'together-fr': toolPageHtml(togetherFr),
  'design-fr': toolPageHtml(designFr),
}

for (const name of Object.keys(content)) {
  if (!registry.some((page) => page.name === name)) throw new Error(`src/prerender.ts: ${name} is not in src/pages.ts`)
}
export const pages = registry.map((page) => {
  const parts = content[page.name]
  if (!parts) throw new Error(`src/prerender.ts: no content for ${page.name} (src/pages.ts)`)
  return { file: page.file, parts }
})
