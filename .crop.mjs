import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'
const [dir, name, y0, h] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: process.env.CHROME, headless: true })
const p = await browser.newPage()
const a = readFileSync(`${dir}/before-${name}.png`).toString('base64'), b = readFileSync(`${dir}/after-${name}.png`).toString('base64')
const url = await p.evaluate(async ([a, b, y0, h]) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + s })
  const [A, B] = await Promise.all([load(a), load(b)])
  const c = document.createElement('canvas'); c.width = A.width * 2 + 20; c.height = h
  const g = c.getContext('2d'); g.fillStyle = 'red'; g.fillRect(0, 0, c.width, h)
  g.drawImage(A, 0, y0, A.width, h, 0, 0, A.width, h); g.drawImage(B, 0, y0, B.width, h, A.width + 20, 0, B.width, h)
  return c.toDataURL('image/png')
}, [a, b, +y0, +h])
writeFileSync(`${dir}/crop-${name}-${y0}.png`, Buffer.from(url.split(',')[1], 'base64'))
await browser.close()
