import { gate, type Operation } from './lab.ts'

const french = document.documentElement.lang === 'fr'
for (const form of document.querySelectorAll<HTMLFormElement>('form[data-discovery]')) {
  const records = [...document.querySelectorAll<HTMLElement>('[data-record]')]
  const status = form.querySelector<HTMLElement>('[data-filter-status]')!
  const update = () => {
    const data = new FormData(form)
    const query = String(data.get('query') ?? '').toLowerCase().trim()
    const category = String(data.get('category') ?? '')
    const from = String(data.get('from') ?? ''), to = String(data.get('to') ?? '')
    if (from && to && +from > +to) {
      status.textContent = french ? 'La date de début doit précéder la date de fin.' : 'From year must not exceed To year.'
      return
    }
    let count = 0
    for (const record of records) {
      const show = (!query || record.dataset.text?.includes(query)) && (!category || record.dataset.category === category) && (!from || +(record.dataset.end ?? 9999) >= +from) && (!to || +(record.dataset.start ?? 0) <= +to)
      record.hidden = !show
      if (show) count++
    }
    for (const section of document.querySelectorAll<HTMLElement>('[data-figure-period]')) {
      section.hidden = !section.querySelector('[data-record]:not([hidden])')
    }
    status.textContent = french ? `${count} résultat(s)` : `${count} result(s)`
  }
  form.hidden = false; form.addEventListener('input',update); form.addEventListener('submit',e=>e.preventDefault()); form.addEventListener('reset',()=>setTimeout(update)); update()
}
for (const form of document.querySelectorAll<HTMLFormElement>('form[data-gate]')) {
  const operation = form.elements.namedItem('operation') as HTMLSelectElement
  const a = form.elements.namedItem('a') as HTMLInputElement, b = form.elements.namedItem('b') as HTMLInputElement
  const output = form.elements.namedItem('result') as HTMLOutputElement
  const update = () => {
    const op = operation.value as Operation
    b.disabled = op === 'NOT'
    form.querySelector<HTMLElement>('[data-input-b]')!.hidden = op === 'NOT'
    output.value = String(Number(gate(op,a.checked,b.checked)))
    form.querySelector<HTMLElement>('[data-equation]')!.textContent = `${op === 'NOT' ? `NOT ${Number(a.checked)}` : `${Number(a.checked)} ${op} ${Number(b.checked)}`} = ${output.value}`
  }
  form.hidden = false
  form.addEventListener('input',update); form.addEventListener('submit',e=>e.preventDefault()); form.addEventListener('reset',()=>setTimeout(update))
  update()
}
interface SearchResult { url:string; meta:{title?:string}; excerpt:string; filters?:Record<string,string[]> }
interface Pagefind { options(options: Record<string,unknown>):Promise<void>; search(query:string,options:unknown):Promise<{results:{data():Promise<SearchResult>}[]}> }
const searchForm = document.querySelector<HTMLFormElement>('[data-search]')
if (searchForm) {
  const form = searchForm
  const results = document.querySelector<HTMLElement>('[data-search-results]')!
  const status = document.querySelector<HTMLElement>('[data-search-status]')!
  const query = form.elements.namedItem('query') as HTMLInputElement
  const engines = new Map<string,Promise<Pagefind>>()
  let request = 0
  form.hidden = false
  const run = async () => {
    const current = ++request
    results.replaceChildren()
    if (!query.value.trim()) { status.textContent = french ? 'Saisissez un mot à rechercher.' : 'Enter a search term.'; return }
    status.textContent = french ? 'Recherche…' : 'Searching…'
    try {
      const data = new FormData(form), locale = String(data.get('locale'))
      const modulePath = `/pagefind/${locale}/pagefind.js`
      if (!engines.has(locale)) engines.set(locale, import(/* @vite-ignore */ modulePath) as Promise<Pagefind>)
      const api = await engines.get(locale)!
      const section = String(data.get('section') ?? '')
      const response = await api.search(query.value.trim(),{filters:section ? {section} : {}})
      const matches = await Promise.all(response.results.slice(0,20).map(r=>r.data()))
      if (current !== request) return
      for (const match of matches) {
        const card = document.createElement('article'); card.className = 'glass'
        const anchor = document.createElement('a'); anchor.href = match.url; anchor.textContent = match.meta.title ?? match.url
        const snippet = document.createElement('p')
        // Extract text rather than inserting HTML from the search engine.
        const template = document.createElement('template'); template.innerHTML = match.excerpt
        snippet.textContent = template.content.textContent
        const sectionLabel = document.createElement('small'); sectionLabel.textContent = `${match.filters?.section?.join(', ') ?? ''} · ${locale}`
        card.append(anchor,sectionLabel,snippet); results.append(card)
      }
      status.textContent = french ? `${response.results.length} résultat(s)${response.results.length > 20 ? ' · 20 affichés' : ''}` : `${response.results.length} result(s)${response.results.length > 20 ? ' · showing 20' : ''}`
      history.replaceState(null,'',`${location.pathname}?${new URLSearchParams({q:query.value,locale,section})}`)
    } catch {
      if (current === request) status.textContent = french ? 'Recherche indisponible. Utilisez l’index ci-dessous.' : 'Search unavailable. Use the index below.'
    }
  }
  form.addEventListener('submit',e=>{e.preventDefault(); void run()})
  form.addEventListener('change',()=>{if(query.value.trim()) void run()})
  const params = new URLSearchParams(location.search)
  if (params.has('q')) {
    query.value = params.get('q')!
    for (const name of ['locale','section']) {
      const select = form.elements.namedItem(name) as HTMLSelectElement
      const value = params.get(name)
      if ([...select.options].some(o=>o.value === value)) select.value = value!
    }
    void run()
  }
}
