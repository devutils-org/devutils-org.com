import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'

const out = resolve('assets/wallpapers')
await mkdir(out, { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  // A still render can use software WebGL on servers without a GPU.
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const formats = [
  ['iphone-15', 1179, 2556],
  ['macbook-air-13', 2560, 1664],
  ['macbook-air-15', 2880, 1864],
  ['desktop-24-fhd', 1920, 1080],
  ['4k', 3840, 2160],
] as const
const files: { file: string; width: number; height: number; variant: string }[] = []
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  page.on('pageerror', error => console.error(error))
  for (const [name, width, height] of formats) {
    await page.setViewportSize({ width, height })
    for (const variant of ['centre', 'ensemble']) {
      await page.goto(`${process.env.WALLPAPER_BASE_URL || 'http://127.0.0.1:5173'}/social/wallpapers.html?variant=${variant}`)
      await page.waitForFunction(() => 'wallpaperReady' in window, null, { timeout: 120000 })
      const file = `${name}-${variant}.png`
      await page.screenshot({ path: resolve(out, file), timeout: 120000 })
      files.push({ file, width, height, variant })
      console.log(`${file}: ${width} × ${height}`)
    }
  }
} finally { await browser.close() }
await writeFile(resolve(out, 'manifest.json'), JSON.stringify({ renderer: 'src/scene.ts + src/shapes.ts / Chromium WebGL SwiftShader', files }, null, 2) + '\n')
await writeFile(resolve(out, 'index.html'), `<!doctype html><html lang="fr"><meta charset="utf-8"><title>devutils — fonds d’écran</title><style>body{background:#050507;color:#eee;font:16px system-ui;max-width:1200px;margin:40px auto;padding:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}a{color:#b8a1ff}img{display:block;width:100%;height:260px;object-fit:contain;background:#09090d}p{line-height:1.6}</style><h1>devutils — fonds d’écran</h1><p>Captures des shaders du site. Verre cyan et violet, sans texte. Logo central ou constellation des cinq symboles ; devutils et ATFQ partagent le symbole central.</p><p><a href="devutils-wallpapers.zip">Télécharger les 10 PNG</a></p><main>${files.map(f => `<a href="${f.file}" download><img src="${f.file}" alt="${f.file}" loading="lazy"><p>${f.file}<br>${f.width} × ${f.height}</p></a>`).join('')}</main></html>`)
