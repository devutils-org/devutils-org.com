import type { Lang } from '../i18n.ts'
import { evidence, parsing, construction } from './projects.ts'

export function reportMarkdown(lang: Lang) {
  const t = (en: string, fr: string) => lang === 'fr' ? fr : en
  const fmt = (n: number, digits = 1) => n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  const contributions = evidence.pullRequests.map(pr => `- [PR #${pr.number}: ${pr.title}](${pr.url}) — ${pr.mergedAt ? t('merged', 'fusionnée') : pr.state === 'OPEN' ? t('open', 'ouverte') : t('closed', 'fermée')}.`).join('\n')
  const table = construction.map(r => {
    const p = parsing.find(p => p.dataset === r.dataset && p.chunk === 4096)!
    return `| ${r.dataset} | ${fmt((1 - p.ratio_candidate_over_baseline) * 100)} % | ${fmt(r.baseline.seconds_per_build_median * 1000, 3)} ms | ${fmt(r.construction.seconds_per_build_median * 1000, 3)} ms | ${fmt(1 / r.ratio, 2)}× |`
  }).join('\n')
  return `# ${t('RUG — Analysis and open-source contributions', 'RUG — Analyse et contributions open source')}

${t('Independent contribution by moha-bekh; no maintainer endorsement is implied.', 'Contribution indépendante de moha-bekh ; aucune approbation du mainteneur n’est sous-entendue.')}
${t('PR status checked at', 'Statut des PR vérifié le')} ${evidence.checkedAt}.

## ${t('Project and scope', 'Projet et périmètre')}

[RUG](${evidence.repository}) ${t('is an Apache-2.0 C++98 ABNF parser generator and byte-oriented LALR(1) runtime.', 'est un générateur de parseurs ABNF C++98 sous Apache-2.0 et un runtime LALR(1) orienté octets.')}
${t('Baseline revision', 'Révision de référence')} : \`${evidence.baseline}\`.
${t('The audit and the two performance candidates use that unchanged revision; performance changes were measured independently.', 'L’audit et les deux candidats de performance utilisent cette révision non modifiée ; les changements de performance sont mesurés indépendamment.')}

## ${t('Audit and confirmed diagnostic issue', 'Audit et problème de diagnostic confirmé')}

${t('The baseline passed GCC/Clang builds and calculator/ticket examples on Debian 12, Ubuntu 24.04, Fedora 44 and Alpine 3.24 through distroproof VMs on their own kernels. Ten host build configurations and 60 deterministic sanitizer workload checks passed. Bounded grammar/runtime fuzzing completed 44,476 and 48,605 executions without a confirmed sanitizer finding; these runs do not prove safety.', 'La référence passe les builds GCC/Clang et les exemples calculator/ticket sur Debian 12, Ubuntu 24.04, Fedora 44 et Alpine 3.24 via des VM distroproof utilisant leurs propres noyaux. Dix configurations locales et 60 contrôles déterministes sous sanitizers passent. Les campagnes bornées de fuzzing grammaire/runtime réalisent 44 476 et 48 605 exécutions sans défaut sanitizer confirmé ; ces campagnes ne prouvent pas la sûreté.')}

${t('Empty and comment-only grammars threw std::logic_error rather than the documented RugBuildError. The proposed validator guard reports structured diagnostics. The initial fuzz-harness abort came from failing to catch the ordinary C++ exception; it was a harness defect, not a confirmed memory-corruption crash.', 'Les grammaires vides ou composées uniquement de commentaires lèvent std::logic_error au lieu du RugBuildError documenté. Le contrôle proposé dans le validateur fournit un diagnostic structuré. L’arrêt initial du harness de fuzzing venait de cette exception C++ non interceptée : un défaut du harness, pas un crash de corruption mémoire confirmé.')}

## ${t('Proposed upstream changes', 'Changements proposés en amont')}

${contributions}

${t('PR #1 fixes diagnostic consistency. PR #2 resolves ACTION/GOTO/rule section addresses once per lookup instead of repeated out-of-line accessor calls. PR #3 replaces quadratic frequency recounting over 257 actions with a histogram and ordered selection, preserving earliest-terminal tie-breaking.', 'La PR #1 corrige la cohérence des diagnostics. La PR #2 résout les adresses ACTION/GOTO/règles une fois par recherche au lieu d’appeler les accesseurs de façon répétée. La PR #3 remplace le recomptage quadratique des fréquences sur 257 actions par un histogramme puis une sélection ordonnée, conservant le départage par premier terminal.')}

${t('Submitted is not accepted or merged. Follow the PR links for current status.', 'Soumis ne signifie pas accepté ou fusionné. Consulter les liens des PR pour le statut actuel.')}

## ${t('Method and measured results', 'Méthode et résultats mesurés')}

${t('Environment', 'Environnement')} : ${evidence.environment.cpu}, ${evidence.environment.compiler}, ${evidence.environment.os}, ${evidence.environment.kernel}.
${t('Flags', 'Options')} : \`${evidence.environment.flags}\`, ${t('without LTO', 'sans LTO')}.
${t('Six workloads, three parsing chunk sizes, two warmup processes per variant, ten balanced-order paired trials per case, seed 5234, medians/MAD and 5,000 paired bootstrap resamples. Profiled timings are excluded from A/B timing statistics. Parsing excludes construction and session allocation, but includes reset/push/finish. Construction measures full repeated build/destruction.', 'Six charges, trois tailles de blocs de parsing, deux échauffements par variante, dix paires avec ordres équilibrés par cas, graine 5234, médianes/MAD et 5 000 rééchantillonnages bootstrap appariés. Les durées profilées sont exclues des statistiques A/B. Le parsing exclut la construction et l’allocation de session, mais inclut reset/push/finish. La construction mesure les builds/destructions complets et répétés.')}

| ${t('Workload', 'Charge')} | ${t('Parse-time reduction, 4096-byte chunks', 'Baisse du temps de parsing, blocs de 4 096 octets')} | ${t('Baseline build', 'Build de référence')} | ${t('Optimized build', 'Build optimisé')} | ${t('Build speedup', 'Facteur de construction')} |
|---|---:|---:|---:|---:|
${table}

${t('Across all 18 parsing shapes the paired median time reduction was 20.6–37.0%; warm construction was 15.9–31.1x faster across six grammars. These are independent code changes: the gains are not multiplied or claimed for a combined binary.', 'Sur les 18 cas de parsing, la baisse médiane appariée du temps est de 20,6 à 37,0 % ; la construction à chaud est 15,9 à 31,1 fois plus rapide sur les six grammaires. Ce sont des changements indépendants : les gains ne sont pas multipliés ni revendiqués pour un binaire combiné.')}

## ${t('What Omniscient contributed', 'Le rôle d’Omniscient')}

${t('A local omn 0.1.0 CPU-clock profile identified lookup/accessor costs and table-construction hotspots. Source analysis led to the changes; Omniscient did not optimize the code automatically. Five paired fixed-work user-mode PMU observations recorded 26.5% fewer median retired instructions for parsing and 96.8% for construction. Final counts were not multiplexed; retained profiles reported no sample losses. The initial exploratory multiplexed counter run was excluded.', 'Un profil CPU-clock d’omn 0.1.0 local a identifié le coût des recherches/accesseurs et de construction des tables. L’analyse du code a conduit aux changements ; Omniscient n’a pas optimisé le code automatiquement. Cinq paires PMU en mode utilisateur sur charges fixes observent 26,5 % d’instructions retirées en moins pour le parsing et 96,8 % pour la construction. Les comptes finaux ne sont pas multiplexés ; les profils conservés ne signalent pas de perte d’échantillons. Le premier essai exploratoire multiplexé est exclu.')}

${t('The CPU profile backend was pmu:sw (time, not hardware cycles), with user-space fp+leaf unwinding. Complete USE/latency modes refused missing BPF/tracefs permissions; no privileges were changed. ATFQ supplied memory context, xpac read package inventory, and VMAnyware was not used.', 'Le backend de profil CPU est pmu:sw (du temps, pas des cycles matériels), avec unwinding fp+leaf en espace utilisateur. Les modes USE/latence complets refusent les permissions BPF/tracefs manquantes ; aucun privilège n’a été changé. ATFQ a fourni du contexte mémoire, xpac a lu l’inventaire des paquets et VMAnyware n’a pas été utilisé.')}

${t('The approach draws on', 'La démarche s’inspire des')} [${t('Brendan Gregg’s public performance methods', 'méthodes publiques de performance de Brendan Gregg')}](https://www.brendangregg.com/methodology.html) ${t('and the presentation of Systems Performance, Second Edition; no reading of the complete book is claimed.', 'et de la présentation de Systems Performance, seconde édition ; aucune lecture du livre intégral n’est revendiquée.')}

## ${t('Validation and limitations', 'Validation et limites')}

${t('Both candidates passed GCC and Clang ASan/UBSan builds, calculator/ticket examples, semantic-error handling and differential incremental callback/error/reset traces. The lookup oracle covers 4,626 results; the default-action oracle covers 300 rows including ties. Complete runtime images matched byte for byte for six grammars after the construction change.', 'Les deux candidats passent les builds GCC et Clang ASan/UBSan, les exemples calculator/ticket, l’erreur sémantique et les traces différentielles de callbacks/erreurs/reset incrémentaux. L’oracle de recherche couvre 4 626 résultats ; l’oracle des actions par défaut couvre 300 lignes dont les égalités. Les images runtime complètes sont identiques octet par octet pour six grammaires après le changement de construction.')}

${t('The optimized code was not re-run across the four-distro matrix. Target affinity was fixed; frequency, thermals and other-core activity were not locked. Results do not establish gains with LTO, other hardware, arbitrary grammars or concurrent sessions. Collector CPU cost excludes some in-target perturbation. The frequency map adds temporary allocations, bounded by 257 keys per row; no memory reduction is claimed. No security assurance or maintainer endorsement is implied.', 'Le code optimisé n’a pas été réexécuté sur la matrice des quatre distributions. L’affinité cible était fixée ; fréquence, température et activité des autres cœurs n’étaient pas verrouillées. Les résultats n’établissent pas de gain avec LTO, sur un autre matériel, pour toute grammaire ou pour des sessions concurrentes. Le coût CPU du collecteur exclut une partie de sa perturbation dans la cible. La map de fréquences ajoute des allocations temporaires, bornées par 257 clés par ligne ; aucun gain mémoire n’est revendiqué. Aucune garantie de sécurité ni approbation du mainteneur n’est sous-entendue.')}

## ${t('Data and reproduction', 'Données et reproduction')}

- [${t('Environment and PR snapshot', 'Environnement et instantané des PR')}](method.json)
- [${t('Parsing summaries, MAD and intervals', 'Synthèses, MAD et intervalles de parsing')}](parsing.json)
- [${t('Construction summaries, MAD and intervals', 'Synthèses, MAD et intervalles de construction')}](construction.json)
- [${t('Counter summary', 'Synthèse des compteurs')}](counters.json)
- [${t('Raw parsing pairs', 'Paires brutes de parsing')}](parsing-measured-pairs.csv)
- [${t('Raw construction pairs', 'Paires brutes de construction')}](construction-measured-pairs.csv)
- [${t('Parsing PMU pairs', 'Paires PMU de parsing')}](parsing-measured-pmu.csv)
- [${t('Construction PMU pairs', 'Paires PMU de construction')}](construction-measured-pmu.csv)

${evidence.pullRequests.filter(pr => pr.kind !== 'fix').map(pr => `- [${t('Reproduction for', 'Reproduction pour')} PR #${pr.number}](https://github.com/moha-bekh/RUG/blob/${pr.headRefOid}/bench/${pr.kind === 'parsing' ? 'table-lookup' : 'default-action'}/README.md)`).join('\n')}

${t('Baseline portability/fuzzing statements summarize the local audit. The downloadable public evidence here covers the performance comparisons and the PR snapshot, not the complete original baseline campaign logs.', 'Les constats de portabilité/fuzzing de référence résument l’audit local. Les preuves publiques téléchargeables ici couvrent les comparaisons de performance et l’instantané des PR, pas les journaux complets de la campagne de référence initiale.')}
`
}
