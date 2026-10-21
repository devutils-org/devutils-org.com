// Every page's <head>, and a tool page's whole document, from its entry in
// src/pages.ts. vite.config.ts applies them to the HTML files, in the dev
// server and in the build alike.

import { route, translation, type SitePage } from './pages.ts'
import { esc } from './html.ts'
import { words } from './i18n.ts'

// The site's address, for the link-preview tags, which must be absolute. If
// the site moves, this is the one line to change (or set SITE_URL).
const SITE = (process.env.SITE_URL ?? 'https://devutils-org.github.io').replace(/\/$/, '')

// Also on every page: the speculation rules that load a page the pointer
// rests on, and the style that shows the reveal-on-scroll content when
// scripts are off, with the still mark in place of the 3D (`:root`: it
// comes before the stylesheets, which Vite moves to the end of <head>).
export function head(page: SitePage) {
  const url = `${SITE}${route(page)}`
  const other = translation(page)
  return `<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="${esc(page.description)}" />
    <meta name="theme-color" content="#050507" />
    <title>${esc(page.title)}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.ogDescription ?? page.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${page.lang === 'fr' ? 'fr_FR' : 'en_US'}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="${page.lang}" href="${url}" />
    <link rel="alternate" hreflang="${other.lang}" href="${SITE}${route(other)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og/${page.preview ?? 'main'}.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="627" />
    <meta name="twitter:card" content="summary_large_image" />
    ${['/src/style.css', ...page.css].map((href) => `<link rel="stylesheet" href="${href}" />`).join('\n    ')}
    <script type="speculationrules">{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/tools/atfq/book/*"}}]},"eagerness":"moderate"}]}</script>
    <noscript><style>:root .reveal { opacity: 1; transform: none; } :root .stage-fallback { display: block; }</style></noscript>
  </head>`
}

// A tool page: the frame src/toolpage/render.ts fills from the page's content
// module, at build time (src/prerender.ts) or, failing that, in the browser.
export function toolPage(page: SitePage) {
  return `<!doctype html>
<html lang="${page.lang}">
  ${head(page)}
  <body class="tool-page">
    <a class="skip" href="#main">${words[page.lang].skip}</a>
    <canvas id="scene" aria-hidden="true"></canvas>
    <header class="nav" id="nav"></header>
    <main id="main"></main>
    <footer id="footer"></footer>
    <script type="module">
      import { renderToolPage } from '/src/toolpage/render.ts'
      import page from '${page.content}'
      renderToolPage(page)
    </script>
  </body>
</html>
`
}
