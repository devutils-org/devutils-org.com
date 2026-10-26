// Takes the latest run of the chain on each target from an Omniscient checkout
// (.distroproof/collect/chain-*/, which each run overwrites) and writes the
// facts the Together page shows into src/toolpage/chain-runs.json:
//
//   node scripts/chain-runs.ts        # Omniscient beside devutils, or OMNISCIENT_DIR=...
//
// Per target: the day of the run, its kernel, the chain's checks, the reference
// tools' packages (witnesses.json) and the tally of Omniscient's reference
// pairs (reference.log). The collected runs are not in the repository, so the page reads this copy.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Run } from '../src/toolpage/chain-results.ts'

const root = resolve(process.env.OMNISCIENT_DIR ?? resolve(import.meta.dirname, '../../omniscient'), '.distroproof/collect')
const out = resolve(import.meta.dirname, '../src/toolpage/chain-runs.json')

const day = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const runs: Run[] = []
for (const target of (await readdir(root)).filter((d) => d.startsWith('chain-')).sort()) {
  const dir = resolve(root, target)
  const cross = JSON.parse(await readFile(resolve(dir, 'cross-tools.json'), 'utf8'))
  const witnesses = JSON.parse(await readFile(resolve(dir, 'witnesses.json'), 'utf8'))
  const pairs: Run['pairs'] = { held: 0, skipped: 0, gaps: 0, known: 0, failed: 0 }
  for (const line of (await readFile(resolve(dir, 'reference.log'), 'utf8')).split('\n')) {
    const m = line.match(/^tally: reference \S+: (\d+) held, (\d+) skipped, (\d+) gaps, (\d+) known defects, (\d+) failed$/)
    if (!m) continue
    for (const [i, key] of (['held', 'skipped', 'gaps', 'known', 'failed'] as const).entries()) pairs[key] += Number(m[i + 1])
  }
  runs.push({
    target,
    date: day((await stat(resolve(dir, 'cross-tools.json'))).mtime),
    kernel: cross.kernel,
    checks: { total: cross.checks.length, failed: cross.checks.filter((c: { status: string }) => c.status !== 'pass').map((c: { name: string }) => c.name) },
    packages: {
      engine: witnesses.engine,
      provider: witnesses.provider,
      installed: witnesses.packages.filter((p: { status: string }) => p.status === 'installed').length,
    },
    pairs,
  })
}
if (!runs.length) throw new Error(`no chain-* runs in ${root}`)
await writeFile(out, JSON.stringify(runs, null, 2) + '\n')
console.log(`${runs.length} runs → ${out}`)
