# RUG — Analyse et contributions open source

Contribution indépendante de moha-bekh ; aucune approbation du mainteneur n’est sous-entendue.
Statut des PR vérifié le 2026-10-23T23:28:23.858943+00:00.

## Projet et périmètre

[RUG](https://github.com/roman-starcevic/RUG) est un générateur de parseurs ABNF C++98 sous Apache-2.0 et un runtime LALR(1) orienté octets.
Révision de référence : `fe40fab82c61a6fdd95fa49162a289e703644f1c`.
L’audit et les deux candidats de performance utilisent cette révision non modifiée ; les changements de performance sont mesurés indépendamment.

## Audit et problème de diagnostic confirmé

La référence passe les builds GCC/Clang et les exemples calculator/ticket sur Debian 12, Ubuntu 24.04, Fedora 44 et Alpine 3.24 via des VM distroproof utilisant leurs propres noyaux. Dix configurations locales et 60 contrôles déterministes sous sanitizers passent. Les campagnes bornées de fuzzing grammaire/runtime réalisent 44 476 et 48 605 exécutions sans défaut sanitizer confirmé ; ces campagnes ne prouvent pas la sûreté.

Les grammaires vides ou composées uniquement de commentaires lèvent std::logic_error au lieu du RugBuildError documenté. Le contrôle proposé dans le validateur fournit un diagnostic structuré. L’arrêt initial du harness de fuzzing venait de cette exception C++ non interceptée : un défaut du harness, pas un crash de corruption mémoire confirmé.

## Changements proposés en amont

- [PR #1: Report empty ABNF grammars through structured build diagnostics](https://github.com/roman-starcevic/RUG/pull/1) — ouverte.
- [PR #2: Resolve packed table section addresses once per lookup](https://github.com/roman-starcevic/RUG/pull/2) — ouverte.
- [PR #3: Count default action frequencies once per row](https://github.com/roman-starcevic/RUG/pull/3) — ouverte.

La PR #1 corrige la cohérence des diagnostics. La PR #2 résout les adresses ACTION/GOTO/règles une fois par recherche au lieu d’appeler les accesseurs de façon répétée. La PR #3 remplace le recomptage quadratique des fréquences sur 257 actions par un histogramme puis une sélection ordonnée, conservant le départage par premier terminal.

Soumis ne signifie pas accepté ou fusionné. Consulter les liens des PR pour le statut actuel.

## Méthode et résultats mesurés

Environnement : AMD Ryzen 9 3900X, GCC 16.2.1, Arch Linux, 7.2.9-arch1-1.
Options : `-Wall -Wextra -Werror -std=c++98 -O2 -g -fno-omit-frame-pointer`, sans LTO.
Six charges, trois tailles de blocs de parsing, deux échauffements par variante, dix paires avec ordres équilibrés par cas, graine 5234, médianes/MAD et 5 000 rééchantillonnages bootstrap appariés. Les durées profilées sont exclues des statistiques A/B. Le parsing exclut la construction et l’allocation de session, mais inclut reset/push/finish. La construction mesure les builds/destructions complets et répétés.

| Charge | Baisse du temps de parsing, blocs de 4 096 octets | Build de référence | Build optimisé | Facteur de construction |
|---|---:|---:|---:|---:|
| tiny | 23,6 % | 0,944 ms | 0,033 ms | 28,53× |
| medium | 25,9 % | 15,726 ms | 0,506 ms | 31,05× |
| large | 25,9 % | 61,787 ms | 2,242 ms | 27,57× |
| binary | 21,1 % | 61,323 ms | 2,535 ms | 24,13× |
| calculator | 37,0 % | 21,855 ms | 1,372 ms | 15,87× |
| ticket | 33,0 % | 31,989 ms | 1,390 ms | 22,92× |

Sur les 18 cas de parsing, la baisse médiane appariée du temps est de 20,6 à 37,0 % ; la construction à chaud est 15,9 à 31,1 fois plus rapide sur les six grammaires. Ce sont des changements indépendants : les gains ne sont pas multipliés ni revendiqués pour un binaire combiné.

## Le rôle d’Omniscient

Un profil CPU-clock d’omn 0.1.0 local a identifié le coût des recherches/accesseurs et de construction des tables. L’analyse du code a conduit aux changements ; Omniscient n’a pas optimisé le code automatiquement. Cinq paires PMU en mode utilisateur sur charges fixes observent 26,5 % d’instructions retirées en moins pour le parsing et 96,8 % pour la construction. Les comptes finaux ne sont pas multiplexés ; les profils conservés ne signalent pas de perte d’échantillons. Le premier essai exploratoire multiplexé est exclu.

Le backend de profil CPU est pmu:sw (du temps, pas des cycles matériels), avec unwinding fp+leaf en espace utilisateur. Les modes USE/latence complets refusent les permissions BPF/tracefs manquantes ; aucun privilège n’a été changé. ATFQ a fourni du contexte mémoire, xpac a lu l’inventaire des paquets et VMAnyware n’a pas été utilisé.

La démarche s’inspire des [méthodes publiques de performance de Brendan Gregg](https://www.brendangregg.com/methodology.html) et de la présentation de Systems Performance, seconde édition ; aucune lecture du livre intégral n’est revendiquée.

## Validation et limites

Les deux candidats passent les builds GCC et Clang ASan/UBSan, les exemples calculator/ticket, l’erreur sémantique et les traces différentielles de callbacks/erreurs/reset incrémentaux. L’oracle de recherche couvre 4 626 résultats ; l’oracle des actions par défaut couvre 300 lignes dont les égalités. Les images runtime complètes sont identiques octet par octet pour six grammaires après le changement de construction.

Le code optimisé n’a pas été réexécuté sur la matrice des quatre distributions. L’affinité cible était fixée ; fréquence, température et activité des autres cœurs n’étaient pas verrouillées. Les résultats n’établissent pas de gain avec LTO, sur un autre matériel, pour toute grammaire ou pour des sessions concurrentes. Le coût CPU du collecteur exclut une partie de sa perturbation dans la cible. La map de fréquences ajoute des allocations temporaires, bornées par 257 clés par ligne ; aucun gain mémoire n’est revendiqué. Aucune garantie de sécurité ni approbation du mainteneur n’est sous-entendue.

## Données et reproduction

- [Environnement et instantané des PR](method.json)
- [Synthèses, MAD et intervalles de parsing](parsing.json)
- [Synthèses, MAD et intervalles de construction](construction.json)
- [Synthèse des compteurs](counters.json)
- [Paires brutes de parsing](parsing-measured-pairs.csv)
- [Paires brutes de construction](construction-measured-pairs.csv)
- [Paires PMU de parsing](parsing-measured-pmu.csv)
- [Paires PMU de construction](construction-measured-pmu.csv)

- [Reproduction pour PR #2](https://github.com/moha-bekh/RUG/blob/ebaf1c0bef6762a5d7db88680c8dd452b9d0e770/bench/table-lookup/README.md)
- [Reproduction pour PR #3](https://github.com/moha-bekh/RUG/blob/49aabc5596b9898aeed42d59e964d354fc3cf835/bench/default-action/README.md)

Les constats de portabilité/fuzzing de référence résument l’audit local. Les preuves publiques téléchargeables ici couvrent les comparaisons de performance et l’instantané des PR, pas les journaux complets de la campagne de référence initiale.
