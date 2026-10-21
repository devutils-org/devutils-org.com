import { ORG_URL } from './tools.ts'
import { $, initPage } from './page.ts'
import { homeHtml } from './home.ts'

// ---------- content from tools.ts ----------

document.querySelectorAll<HTMLAnchorElement>('[data-org]').forEach((a) => (a.href = ORG_URL))

if (!$('#tool-grid').firstElementChild) {
  for (const [id, markup] of Object.entries(homeHtml())) $(`#${id}`).innerHTML = markup
}

await initPage({
  scenes: {
    hero: { opacity: 1 },
    flow: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.85 },
    tools: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.75 },
    start: { opacity: 1 },
  },
})
