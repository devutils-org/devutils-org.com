// Every page's <head>, and a tool page's whole document, from its entry in
// src/pages.ts. vite.config.ts applies them to the HTML files, in the dev
// server and in the build alike.

import { route, translation, type SitePage } from './pages.ts'
import { esc } from './html.ts'
import { words } from './i18n.ts'

import { SITE } from './site.ts'

// Also on every page: the speculation rules that load a page the pointer
// rests on, and the style that shows the reveal-on-scroll content when
// scripts are off, with the still mark in place of the 3D (`:root`: it
// comes before the stylesheets, which Vite moves to the end of <head>).
export function head(page: SitePage) {
  const url = `${SITE}${route(page)}`
  const other = translation(page)
  const structured = [
    { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'devutils', url: `${SITE}/`, sameAs: ['https://github.com/devutils-org'] },
    { '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description, inLanguage: page.lang, publisher: { '@id': `${SITE}/#organization` } },
    ...(page.key === 'main' ? [] : [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'devutils', item: `${SITE}${page.lang === 'fr' ? '/fr/' : '/'}` },
      { '@type': 'ListItem', position: 2, name: page.brand ?? page.title, item: url },
    ] }]),
  ]
  return `<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="${esc(page.description)}" />
    <meta name="theme-color" content="#050507" />
    <title>${esc(page.title)}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>
    <meta property="og:site_name" content="devutils" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.ogDescription ?? page.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${page.lang === 'fr' ? 'fr_FR' : 'en_US'}" />
    <link rel="canonical" href="${esc(url)}" />
    <link rel="alternate" hreflang="${page.lang}" href="${esc(url)}" />
    <link rel="alternate" hreflang="${other.lang}" href="${SITE}${route(other)}" />
    <link rel="alternate" hreflang="x-default" href="${esc(`${SITE}${route(page.lang === 'en' ? page : other)}`)}" />
    <meta property="og:url" content="${esc(url)}" />
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
    <header class="nav site-nav" id="nav"></header>
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
