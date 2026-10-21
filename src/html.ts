// The small pieces every page's HTML is written with, in the browser and in
// the build alike: escaping, card numbers and the link icons.

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)
export const pad = (i: number) => String(i + 1).padStart(2, '0')

// an icon from public/icons.svg, sized like the text beside it
export const icon = (name: string) => `<svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#${name}"></use></svg>`
