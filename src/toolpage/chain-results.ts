// The chain's results as the Together page states them, from the latest run
// on each target (chain-runs.json, written by scripts/chain-runs.ts). The
// table and every sentence that sums it up come from the same runs, so a
// headline cannot claim more than the rows show: "every check holds" only
// once every target has run every check without a failure.
//
// chainResults(runs, { order, newest, lang }) → { eyebrow, title, text, head,
// rows, summary, run(target) }. order: the targets, in the table's order.
// newest: what the chain's latest check asks, for the sentence that introduces
// it, in the page's language. lang: English or French; the facts are the same.

import type { Lang } from '../i18n.ts'

// the latest run of the chain on one target, as scripts/chain-runs.ts writes it
export interface Run {
  target: string
  // YYYY-MM-DD
  date: string
  kernel: string
  checks: { total: number; failed: string[] }
  packages: { engine: string; provider: string; installed: number }
  pairs: { held: number; skipped: number; gaps: number; known: number; failed: number }
}

const providers: Record<string, string> = { apt: 'APT', dnf: 'DNF', pacman: 'Pacman', apk: 'apk', portage: 'Portage' }
const cap = (s: string) => s.replace(/^./, (c) => c.toUpperCase())
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

// how each language says the same facts
const voices = {
  en: {
    words: ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    and: 'and',
    // a run whose reference tools another engine installed: why xpac did not
    otherEngines: { 'dnf4-bootstrap': 'none: DNF4, which xpac does not drive, installs them' } as Record<string, string>,
    installedBy: (engine: string) => `none: installed by ${engine}`,
    packages: (n: number, provider: string) => `${n} packages, ${provider}`,
    checks: (n: number, failed: number) => `${n} checks${failed ? `, ${failed} failed` : ''}`,
    pairs: (p: Run['pairs']) => [`${p.held} held`, `${p.skipped} skipped`, p.gaps && plural(p.gaps, 'gap'), p.known && plural(p.known, 'known defect'), p.failed && `${p.failed} failed`],
    targets: (n: string, count: number) => `${cap(n)} target${count === 1 ? '' : 's'}`,
    failing: (all: string, n: string): [[string, string], string] => [[`${all}.`, `${cap(n)} with a failure.`], `${all}, ${n} with a failure`],
    older: (all: string, n: string): [[string, string], string] => [[`${all}, no pair failed.`, `${cap(n)} rerun with every check.`], `${all}, no pair failed`],
    holds: (all: string): [[string, string], string] => [[`${all}.`, 'Every check holds.'], `${all}, every check holds`],
    intro: (n: string, day: string, newest?: string) => `The chain now has ${n} checks, the last one first run on ${day}${newest ? `: ${newest}` : ''}.`,
    allRan: (n: string, pairs: number | null) => ` Every target has run all ${n} checks${pairs ? `, with ${pairs} pairs` : ''}.`,
    rerun: (who: string, count: number, n: string, pairs: number | null) => ` Only ${who} ${count === 1 ? 'has' : 'have'} been rerun since, with all ${n} checks${pairs ? ` and ${pairs} pairs` : ''};`,
    predate: (count: number, n: string, checks: string | null, pairs: number | null) => ` the other ${n} latest ${count === 1 ? 'run predates' : 'runs predate'} it${checks ? `, with ${checks} checks` : ''}${pairs ? ` and ${pairs} pairs` : ''}.`,
    eyebrow: 'LATEST RUNS',
    lead: 'The latest run on each target: the checks of the chain, the packages xpac installed for the reference tools, and Omniscient’s reference pairs.',
    head: ['Target', 'Run', 'Kernel', 'Installed by xpac', 'Reference pairs'],
  },
  fr: {
    // feminine, as cible, vérification and paire are
    words: ['aucune', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'],
    months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    short: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    and: 'et',
    otherEngines: { 'dnf4-bootstrap': 'aucun : DNF4, que xpac ne pilote pas, les installe' } as Record<string, string>,
    installedBy: (engine: string) => `aucun : installés par ${engine}`,
    packages: (n: number, provider: string) => `${n} paquets, ${provider}`,
    checks: (n: number, failed: number) => `${n} vérifications${failed ? `, ${failed} en échec` : ''}`,
    pairs: (p: Run['pairs']) => [plural(p.held, 'tenue'), plural(p.skipped, 'ignorée'), p.gaps && plural(p.gaps, 'écart', 'écarts'), p.known && plural(p.known, 'défaut connu', 'défauts connus'), p.failed && `${p.failed} en échec`],
    targets: (n: string, count: number) => `${cap(n)} cible${count === 1 ? '' : 's'}`,
    failing: (all: string, n: string): [[string, string], string] => [[`${all}.`, `${cap(n)} avec un échec.`], `${all}, ${n} avec un échec`],
    older: (all: string, n: string): [[string, string], string] => [[`${all}, aucune paire en échec.`, `${cap(n)} relancée${n === 'une' ? '' : 's'} avec toutes les vérifications.`], `${all}, aucune paire en échec`],
    holds: (all: string): [[string, string], string] => [[`${all}.`, 'Toutes les vérifications tiennent.'], `${all}, toutes les vérifications tiennent`],
    intro: (n: string, day: string, newest?: string) => `La chaîne compte désormais ${n} vérifications, la dernière exécutée pour la première fois le ${day}${newest ? ` : ${newest}` : ''}.`,
    allRan: (n: string, pairs: number | null) => ` Toutes les cibles ont passé les ${n} vérifications${pairs ? `, avec ${pairs} paires` : ''}.`,
    rerun: (who: string, count: number, n: string, pairs: number | null) => ` ${count === 1 ? 'Seule' : 'Seules'} ${who} ${count === 1 ? 'a été relancée' : 'ont été relancées'} depuis, avec les ${n} vérifications${pairs ? ` et ${pairs} paires` : ''} ;`,
    predate: (count: number, n: string, checks: string | null, pairs: number | null) => ` ${count === 1 ? 'la dernière exécution de l’autre cible lui est antérieure' : `les dernières exécutions des ${n} autres lui sont antérieures`}${checks ? `, avec ${checks} vérifications` : ''}${pairs ? ` et ${pairs} paires` : ''}.`,
    eyebrow: 'DERNIÈRES EXÉCUTIONS',
    lead: 'La dernière exécution sur chaque cible : les vérifications de la chaîne, les paquets que xpac a installés pour les outils de référence, et les paires de référence d’Omniscient.',
    head: ['Cible', 'Exécution', 'Noyau', 'Installés par xpac', 'Paires de référence'],
  },
}

const parse = (date: string) => {
  const [y = 0, m = 1, d = 0] = date.split('-').map(Number)
  return { y, m: m - 1, d }
}
// chain-debian-13 → Debian 13, chain-fedora-latest → Fedora
const distro = (target: string) => {
  const [name = '', ...version] = target.replace(/^chain-/, '').split('-')
  return [cap(name), ...version.filter((v) => v !== 'latest')].join(' ')
}
const pairCount = (r: Run) => r.pairs.held + r.pairs.skipped + r.pairs.gaps + r.pairs.known + r.pairs.failed
const failing = (r: Run) => r.checks.failed.length > 0 || r.pairs.failed > 0
const same = <T,>(values: T[]) => (new Set(values).size === 1 ? values[0]! : null)

export function chainResults(runs: Run[], { order = runs.map((r) => r.target), newest, lang = 'en' }: { order?: string[]; newest?: string; lang?: Lang }) {
  const v = voices[lang]
  const word = (n: number) => v.words[n] ?? String(n)
  const month = (m: number) => v.months[m] ?? ''
  const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${v.and} ${items.at(-1)}`)

  const byTarget = new Map(runs.map((r) => [r.target, r]))
  const sorted = order.map((t) => {
    const run = byTarget.get(t)
    if (!run) throw new Error(`chain-results: no run for ${t}`)
    return run
  })
  if (sorted.length !== runs.length) throw new Error('chain-results: a run is missing from the order')

  const latest = Math.max(...sorted.map((r) => r.checks.total))
  const complete = sorted.filter((r) => r.checks.total === latest)
  const older = sorted.filter((r) => r.checks.total < latest)
  const failed = sorted.filter(failing)
  const all = v.targets(word(sorted.length), sorted.length)

  const [title, summary] = failed.length ? v.failing(all, word(failed.length)) : older.length ? v.older(all, word(complete.length)) : v.holds(all)

  const first = parse(complete.map((r) => r.date).sort()[0] ?? '')
  // the day the newest check first ran: the runs show that, not the day it was written
  const intro = v.intro(word(latest), `${first.d} ${month(first.m)}`, newest)
  const pairsOf = (group: Run[]) => same(group.map(pairCount))
  let since
  if (!older.length) {
    since = v.allRan(word(latest), pairsOf(complete))
  } else {
    const olderChecks = same(older.map((r) => r.checks.total))
    since = v.rerun(list(complete.map((r) => distro(r.target))), complete.length, word(latest), pairsOf(complete)) +
      v.predate(older.length, word(older.length), olderChecks === null ? null : word(olderChecks), pairsOf(older))
  }

  const dates = sorted.map((r) => parse(r.date)).sort((a, b) => a.y - b.y || a.m - b.m || a.d - b.d)
  const [lo, hi] = [dates[0]!, dates[dates.length - 1]!]
  const span = lo.m === hi.m && lo.y === hi.y
    ? `${lo.d === hi.d ? '' : `${lo.d}–`}${hi.d} ${month(hi.m)} ${hi.y}`
    : `${lo.d} ${month(lo.m)}${lo.y === hi.y ? '' : ` ${lo.y}`} – ${hi.d} ${month(hi.m)} ${hi.y}`

  const row = (r: Run) => {
    const { d, m } = parse(r.date)
    const installed = r.packages.engine === 'xpac'
      ? v.packages(r.packages.installed, providers[r.packages.provider] ?? r.packages.provider)
      : v.otherEngines[r.packages.engine] ?? v.installedBy(r.packages.engine)
    return [r.target, `${d} ${v.short[m]} · ${v.checks(r.checks.total, r.checks.failed.length)}`, r.kernel.match(/^\d+\.\d+/)?.[0] ?? r.kernel, installed, v.pairs(r.pairs).filter(Boolean).join(' · ')]
  }

  return {
    eyebrow: `${v.eyebrow} / ${span.toUpperCase()}`,
    title,
    text: `${v.lead} ${intro}${since}`,
    head: v.head,
    rows: sorted.map(row),
    summary,
    run: (target: string) => {
      const run = byTarget.get(target)
      if (!run) throw new Error(`chain-results: no run for ${target}`)
      return run
    },
  }
}
