// Site-owned adaptation of the exported ATFQ book. Applied at build time so
// code blocks also remain keyboard-scrollable with JavaScript disabled.
export function focusableBookCode(html: string) {
  return html.replace(/<pre\b([^>]*)>/gi, (tag, attributes: string) => /\btabindex\s*=/i.test(attributes) ? tag : `<pre${attributes} tabindex="0">`)
}

// Kept self-contained: the build appends this function to the book's script.
export function initBookAccessibility() {
  const root = document.documentElement
  const sidebar = document.getElementById('sidebar')
  const sidebarButton = document.getElementById('toggle-sidebar')
  const search = document.getElementById('search')
  const searchButton = document.getElementById('toggle-search')
  if (!sidebar || !sidebarButton || !search || !searchButton) return
  const narrow = matchMedia('(max-width: 900px)')
  const syncSidebar = () => {
    const visible = narrow.matches ? root.classList.contains('sidebar-open') : !root.classList.contains('sidebar-hidden')
    sidebar.inert = !visible
    sidebarButton.setAttribute('aria-expanded', String(visible))
    if (!visible && sidebar.contains(document.activeElement)) sidebarButton.focus()
  }
  new MutationObserver(syncSidebar).observe(root, { attributes: true, attributeFilter: ['class'] })
  narrow.addEventListener('change', syncSidebar)
  syncSidebar()
  search.setAttribute('role', 'search')
  search.setAttribute('aria-label', 'Search the book')
  let searchWasOpen = !search.hidden
  const syncSearch = () => {
    searchButton.setAttribute('aria-expanded', String(!search.hidden))
    if (searchWasOpen && search.hidden) searchButton.focus()
    searchWasOpen = !search.hidden
  }
  new MutationObserver(syncSearch).observe(search, { attributes: true, attributeFilter: ['hidden'] })
  syncSearch()
  document.addEventListener('keydown', event => {
    // Let native arrow-key scrolling work inside code; do not turn the page
    // through the book's document-level navigation shortcuts.
    if (event.target instanceof Element && event.target.closest('pre') && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'h', 'j', 'k', 'l'].includes(event.key)) event.stopPropagation()
    if (event.key === 'Escape' && narrow.matches && root.classList.contains('sidebar-open')) {
      root.classList.remove('sidebar-open')
      syncSidebar()
      sidebarButton.focus()
    }
  }, true)
}
