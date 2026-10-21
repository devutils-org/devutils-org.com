// Every page of the site, in one place. The build takes its entries from here
// (vite.config.js), the content it writes into each page is checked against
// it (src/prerender.js), and so are the link previews (scripts/prerender.mjs)
// and the social visuals (scripts/social-pages.mjs). Plain data: Node reads it
// without Vite.
//
// name: the build entry, and the page's content in src/prerender.js.
// file: the HTML page. preview: its image, public/og/<preview>.png, 1200 ×
// 627, and its folder of social visuals, assets/pages/<preview>/ (the org's
// when there is none). social: the brand and glass shape of those visuals.

export const pages = [
  { name: 'main', file: 'index.html', preview: 'main', social: { brand: 'devutils', shape: 'mark' } },
  { name: 'omn', file: 'tools/omn/index.html', preview: 'omniscient', social: { brand: 'Omniscient', shape: 'omn' } },
  { name: 'atfq', file: 'tools/atfq/index.html', preview: 'atfq', social: { brand: 'ATFQ', shape: 'mark' } },
  { name: 'distroproof', file: 'tools/distroproof/index.html', preview: 'distroproof', social: { brand: 'distroproof', shape: 'distroproof' } },
  { name: 'xpac', file: 'tools/xpac/index.html', preview: 'xpac', social: { brand: 'xpac', shape: 'xpac' } },
  { name: 'vmanyware', file: 'tools/vmanyware/index.html', preview: 'vmanyware', social: { brand: 'VMAnyware', shape: 'vmanyware' } },
  { name: 'together', file: 'together/index.html' },
  { name: 'design', file: 'design/index.html' },
]

// the address a page is served at: tools/atfq/index.html → /tools/atfq/
export const route = (page) => `/${page.file.replace(/index\.html$/, '')}`
