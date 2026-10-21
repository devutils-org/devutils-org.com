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

const content: Record<string, Record<string, string>> = {
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
  if (!registry.some((page) => page.name === name)) throw new Error(`src/prerender.ts: ${name} is not in src/pages.ts`)
}
export const pages = registry.map((page) => {
  const parts = content[page.name]
  if (!parts) throw new Error(`src/prerender.ts: no content for ${page.name} (src/pages.ts)`)
  return { file: page.file, parts }
})
