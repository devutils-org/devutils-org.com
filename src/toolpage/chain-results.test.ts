import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { chainResults, type Run } from './chain-results.ts'

const snapshot: Run[] = JSON.parse(readFileSync(new URL('./chain-runs.json', import.meta.url), 'utf8'))

const run = (target: string, date: string, checks: number, pairs: Partial<Run['pairs']> = {}, failed: string[] = []): Run => ({
  target, date, kernel: '6.12.113+deb13-amd64',
  checks: { total: checks, failed },
  packages: { engine: 'xpac', provider: 'apt', installed: 19 },
  pairs: { held: 72, skipped: 59, gaps: 1, known: 0, failed: 0, ...pairs },
})

test('every check holds only when every target ran every check', () => {
  const all = chainResults([run('chain-debian-13', '2026-10-21', 11), run('chain-gentoo', '2026-10-21', 11)], {})
  assert.deepEqual(all.title, ['Two targets.', 'Every check holds.'])
  assert.equal(all.summary, 'Two targets, every check holds')
  assert.match(all.text, /Every target has run all eleven checks, with 132 pairs\./)

  const mixed = chainResults([run('chain-debian-12', '2026-10-19', 10, { skipped: 56 }), run('chain-debian-13', '2026-10-21', 11)], {})
  assert.deepEqual(mixed.title, ['Two targets, no pair failed.', 'One rerun with every check.'])
  assert.match(mixed.text, /Only Debian 13 has been rerun since, with all eleven checks and 132 pairs; the other one latest run predates it, with ten checks and 129 pairs\./)
})

test('a failed pair or check is in the headline', () => {
  const pair = chainResults([run('chain-arch', '2026-10-19', 11, { failed: 2 }), run('chain-gentoo', '2026-10-21', 11)], {})
  assert.deepEqual(pair.title, ['Two targets.', 'One with a failure.'])
  assert.equal(pair.rows[0][4], '72 held · 59 skipped · 1 gap · 2 failed')

  const check = chainResults([run('chain-arch', '2026-10-19', 11, {}, ['atfq-mcp'])], {})
  assert.equal(check.summary, 'One target, one with a failure')
  assert.equal(check.rows[0][1], '19 Oct · 11 checks, 1 failed')
})

test('rows follow the given order and name what installed the packages', () => {
  const rocky: Run = { ...run('chain-rocky-9', '2026-10-19', 10), packages: { engine: 'dnf4-bootstrap', provider: 'dnf', installed: 15 } }
  const r = chainResults([run('chain-arch', '2026-10-19', 10), rocky], { order: ['chain-rocky-9', 'chain-arch'] })
  assert.deepEqual(r.rows.map((row) => row[0]), ['chain-rocky-9', 'chain-arch'])
  assert.equal(r.rows[0][3], 'none: DNF4, which xpac does not drive, installs them')
  assert.equal(r.rows[1][3], '19 packages, APT')
  assert.equal(r.rows[1][2], '6.12')
  assert.throws(() => chainResults([rocky], { order: ['chain-arch'] }), /no run for chain-arch/)
})

test('the published snapshot: two targets rerun, no failure', () => {
  const r = chainResults(snapshot, { newest: 'atfq and envprobe must describe the machine the same way' })
  assert.deepEqual(r.title, ['Nine targets, no pair failed.', 'Two rerun with every check.'])
  assert.equal(r.eyebrow, 'LATEST RUNS / 19–21 OCTOBER 2026')
  assert.match(r.text, /Only Debian 13 and Gentoo have been rerun since, with all eleven checks and 132 pairs; the other seven latest runs predate it, with ten checks and 129 pairs\./)
})
