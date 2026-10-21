// Writes generated HTML into a page: each element of `parts`' ids, empty in
// the page, gets its markup. Throws when an id has no empty element to fill,
// so a page and its content cannot drift apart unnoticed.
export function fill(html: string, parts: Record<string, string>, file = 'page') {
  for (const [id, markup] of Object.entries(parts)) {
    const empty = new RegExp(`(<(\\w+)\\b[^>]*\\bid="${id}"[^>]*>)\\s*(</\\2>)`)
    if (!empty.test(html)) throw new Error(`${file}: no empty element with id="${id}"`)
    html = html.replace(empty, (_, open: string, _tag: string, close: string) => open + markup + close)
  }
  return html
}
