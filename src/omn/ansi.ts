// ANSI SGR → HTML, for the omn TUI snapshots (docs/view/gallery/*.ansi).
// They use bold, dim, italic, reverse, the 16 colours and a few 256-colour
// greys; the colours are mapped onto the site's palette.

const PALETTE: Record<number, string> = {
  30: '#5c6070', 31: '#ff8fa3', 32: '#8fe3b0', 33: '#f2d58a', 34: '#8fb0ff', 35: '#c7a6ff', 36: '#82e9ff', 37: '#c9ccd8',
  90: '#6d7184', 91: '#ffb0bf', 92: '#b0f0c8', 93: '#f8e4a8', 94: '#b0c8ff', 95: '#dcc4ff', 96: '#b6f3ff', 97: '#f0f0f5',
}

function xterm256(n: number): string {
  if (n < 16) return PALETTE[n < 8 ? 30 + n : 82 + n]
  if (n >= 232) {
    const v = 8 + (n - 232) * 10
    return `rgb(${v},${v},${v})`
  }
  const c = n - 16
  const k = (x: number) => (x ? 55 + x * 40 : 0)
  return `rgb(${k(Math.floor(c / 36))},${k(Math.floor(c / 6) % 6)},${k(c % 6)})`
}

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c)

interface Style {
  bold?: boolean
  dim?: boolean
  italic?: boolean
  rev?: boolean
  fg?: string | null
}

export function ansiToHtml(text: string) {
  let st: Style = {}
  let out = ''
  for (const part of text.split(/(\x1b\[[0-9;]*m)/)) {
    const m = part.match(/^\x1b\[([0-9;]*)m$/)
    if (!m) {
      if (!part) continue
      const cls = [st.bold && 'b', st.dim && 'd', st.italic && 'i', st.rev && 'r'].filter(Boolean).join(' ')
      const style = st.fg ? ` style="--c:${st.fg}"` : ''
      out += cls || style ? `<span${cls ? ` class="${cls}"` : ''}${style}>${esc(part)}</span>` : esc(part)
      continue
    }
    const codes = (m[1] || '0').split(';').map(Number)
    for (let i = 0; i < codes.length; i++) {
      const c = codes[i]
      if (c === 0) st = {}
      else if (c === 1) st.bold = true
      else if (c === 2) st.dim = true
      else if (c === 3) st.italic = true
      else if (c === 7) st.rev = true
      else if (c === 22) st.bold = st.dim = false
      else if (c === 39) st.fg = null
      else if (PALETTE[c]) st.fg = PALETTE[c]
      else if (c === 38 && codes[i + 1] === 5) (st.fg = xterm256(codes[i + 2])), (i += 2)
    }
  }
  return out
}
