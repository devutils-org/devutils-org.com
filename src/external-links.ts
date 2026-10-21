// Run after page content and repository destinations have been rendered.
export function initExternalLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const url = new URL(link.href, document.baseURI)
    if (!['http:', 'https:'].includes(url.protocol) || url.origin === location.origin) return
    link.target = '_blank'
    link.relList.add('noopener', 'noreferrer')
  })
}
