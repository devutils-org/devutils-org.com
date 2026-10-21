// A row of tabs: a click, the arrow keys, Home or End select one. `show(i)`
// puts tab i's content in place; the tabs' own state (aria-selected, which one
// takes the focus) is kept here. Returns `select`, to choose a tab from code.
export function initTabs(tabs, show) {
  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index))
      tab.tabIndex = i === index ? 0 : -1
    })
    show(index)
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index))
    tab.addEventListener('keydown', (event) => {
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : null
      if (next === null) return
      event.preventDefault()
      select(next)
      tabs[next].focus()
    })
  })
  return select
}
