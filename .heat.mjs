import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'
const [dir, name] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: process.env.CHROME, headless: true })
const p = await browser.newPage()
const a = readFileSync(`${dir}/before-${name}.png`).toString('base64'), b = readFileSync(`${dir}/after-${name}.png`).toString('base64')
const url = await p.evaluate(async ([a, b]) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + s })
  const [A, B] = await Promise.all([load(a), load(b)])
  const W = A.width, H = Math.min(A.height, B.height, 3200)
  const get = (img) => { const c = new OffscreenCanvas(W, H); const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, W, H) }
  const da = get(A), db = get(B)
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d')
  const out = g.createImageData(W, H)
  let maxd = 0
  for (let i = 0; i < da.data.length; i += 4) {
    const d = Math.abs(da.data[i] - db.data[i]) + Math.abs(da.data[i + 1] - db.data[i + 1]) + Math.abs(da.data[i + 2] - db.data[i + 2])
    maxd = Math.max(maxd, d)
    out.data[i] = d > 24 ? 255 : db.data[i] * 0.4; out.data[i + 1] = db.data[i + 1] * 0.4; out.data[i + 2] = db.data[i + 2] * 0.4; out.data[i + 3] = 255
  }
  g.putImageData(out, 0, 0)
  document.title = String(maxd)
  return c.toDataURL('image/png')
}, [a, b])
console.log('max channel diff', await p.title())
writeFileSync(`${dir}/heat-${name}.png`, Buffer.from(url.split(',')[1], 'base64'))
await browser.close()
