// The chain's results as the Together page states them, from the latest run
// on each target (chain-runs.json, written by scripts/chain-runs.mjs). The
// table and every sentence that sums it up come from the same runs, so a
// headline cannot claim more than the rows show: "every check holds" only
// once every target has run every check without a failure.
//
// chainResults(runs, { order, newest }) → { eyebrow, title, text, head, rows,
// summary, run(target) }. order: the targets, in the table's order. newest:
// what the chain's latest check asks, for the sentence that introduces it.

const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const word = (n) => words[n] ?? String(n)
const Word = (n) => word(n).replace(/^./, (c) => c.toUpperCase())
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const providers = { apt: 'APT', dnf: 'DNF', pacman: 'Pacman', apk: 'apk', portage: 'Portage' }
// a run whose reference tools another engine installed: why xpac did not
const otherEngines = { 'dnf4-bootstrap': 'none: DNF4, which xpac does not drive, installs them' }

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
const list = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`)
const parse = (date) => {
  const [y, m, d] = date.split('-').map(Number)
  return { y, m: m - 1, d }
}
// chain-debian-13 → Debian 13, chain-fedora-latest → Fedora
const distro = (target) => {
  const [name, ...version] = target.replace(/^chain-/, '').split('-')
  return [name[0].toUpperCase() + name.slice(1), ...version.filter((v) => v !== 'latest')].join(' ')
}
const pairCount = (r) => r.pairs.held + r.pairs.skipped + r.pairs.gaps + r.pairs.known + r.pairs.failed
const failing = (r) => r.checks.failed.length > 0 || r.pairs.failed > 0
const same = (values) => (new Set(values).size === 1 ? values[0] : null)

function row(r) {
  const { d, m } = parse(r.date)
  const checks = `${d} ${months[m].slice(0, 3)} · ${r.checks.total} checks${r.checks.failed.length ? `, ${r.checks.failed.length} failed` : ''}`
  const installed = r.packages.engine === 'xpac' ? `${r.packages.installed} packages, ${providers[r.packages.provider] ?? r.packages.provider}` : otherEngines[r.packages.engine] ?? `none: installed by ${r.packages.engine}`
  const p = r.pairs
  const pairs = [`${p.held} held`, `${p.skipped} skipped`, p.gaps && plural(p.gaps, 'gap'), p.known && plural(p.known, 'known defect'), p.failed && `${p.failed} failed`].filter(Boolean).join(' · ')
  return [r.target, checks, r.kernel.match(/^\d+\.\d+/)[0], installed, pairs]
}

export function chainResults(runs, { order = runs.map((r) => r.target), newest }) {
  const byTarget = new Map(runs.map((r) => [r.target, r]))
  const sorted = order.map((t) => {
    if (!byTarget.has(t)) throw new Error(`chain-results: no run for ${t}`)
    return byTarget.get(t)
  })
  if (sorted.length !== runs.length) throw new Error('chain-results: a run is missing from the order')

  const latest = Math.max(...sorted.map((r) => r.checks.total))
  const complete = sorted.filter((r) => r.checks.total === latest)
  const older = sorted.filter((r) => r.checks.total < latest)
  const failed = sorted.filter(failing)
  const n = `${Word(sorted.length)} target${sorted.length === 1 ? '' : 's'}`

  let title, summary
  if (failed.length) {
    title = [`${n}.`, `${Word(failed.length)} with a failure.`]
    summary = `${n}, ${word(failed.length)} with a failure`
  } else if (older.length) {
    title = [`${n}, no pair failed.`, `${Word(complete.length)} rerun with every check.`]
    summary = `${n}, no pair failed`
  } else {
    title = [`${n}.`, 'Every check holds.']
    summary = `${n}, every check holds`
  }

  const first = parse(complete.map((r) => r.date).sort()[0])
  const intro = `The chain now has ${word(latest)} checks, the last one added on ${first.d} ${months[first.m]}${newest ? `: ${newest}` : ''}.`
  const pairsOf = (group) => same(group.map(pairCount))
  let since
  if (!older.length) {
    since = ` Every target has run all ${word(latest)} checks${pairsOf(complete) ? `, with ${pairsOf(complete)} pairs` : ''}.`
  } else {
    const olderChecks = same(older.map((r) => r.checks.total))
    since = ` Only ${list(complete.map((r) => distro(r.target)))} ${complete.length === 1 ? 'has' : 'have'} been rerun since, with all ${word(latest)} checks${pairsOf(complete) ? ` and ${pairsOf(complete)} pairs` : ''};` +
      ` the other ${word(older.length)} latest ${older.length === 1 ? 'run predates' : 'runs predate'} it${olderChecks ? `, with ${word(olderChecks)} checks` : ''}${pairsOf(older) ? ` and ${pairsOf(older)} pairs` : ''}.`
  }

  const dates = sorted.map((r) => parse(r.date)).sort((a, b) => a.y - b.y || a.m - b.m || a.d - b.d)
  const [lo, hi] = [dates[0], dates.at(-1)]
  const span = lo.m === hi.m && lo.y === hi.y
    ? `${lo.d === hi.d ? '' : `${lo.d}–`}${hi.d} ${months[hi.m]} ${hi.y}`
    : `${lo.d} ${months[lo.m]}${lo.y === hi.y ? '' : ` ${lo.y}`} – ${hi.d} ${months[hi.m]} ${hi.y}`

  return {
    eyebrow: `LATEST RUNS / ${span.toUpperCase()}`,
    title,
    text: `The latest run on each target: the checks of the chain, the packages xpac installed for the reference tools, and Omniscient’s reference pairs. ${intro}${since}`,
    head: ['Target', 'Run', 'Kernel', 'Installed by xpac', 'Reference pairs'],
    rows: sorted.map(row),
    summary,
    run: (target) => byTarget.get(target),
  }
}
