---
id: concept.signals-and-states
type: concept
locale: fr
slug: signaux-et-etats
area: foundations
title: "Signaux et états : interpréter un signal numérique"
summary: Distinguer tension, bit et message ; lire des seuils, des échantillons
  et une garantie de délai dans un modèle pédagogique corrigé.
status: published
updated: 2026-10-26
prerequisites:
  - concept.units-and-scale
related:
  - path.computing-foundations
  - concept.information-and-representation
sources:
  - title: Steve Ward, Computation Structures — The Digital Abstraction, sections
      5.1–5.3
    url: https://computationstructures.org/notes/digitalabstraction/notes.html
steps: []
requirements: []
expected_results: []
contributions: []
aliases: []
---
## Séparer signal et interprétation

Une machine veut indiquer si un travail est terminé. Le message a deux possibilités, mais sa transmission exige un phénomène observable. Une tension sur un fil est un signal possible.

Un **signal** est une grandeur physique considérée dans son évolution, souvent au cours du temps. La tension est une différence de potentiel électrique. Pour ce chapitre, une valeur en volts est simplement l’entrée observée par un récepteur. Le circuit numérique interprète des plages de tension comme des symboles discrets, par exemple 0 et 1.

Il faut distinguer la tension observée, le bit décodé et le sens du message. Aucune règle universelle ne donne à 1 le sens « terminé », « vrai » ou « activé » : les composants doivent partager une convention.

## Définir un récepteur fictif

Choisissons un récepteur acceptant de 0 V à 3 V avec les règles suivantes :

| Plage de tension | Interprétation |
|---|---|
| De 0 V à 0,8 V inclus | 0 |
| Au-dessus de 0,8 V et en dessous de 2,0 V | Non garanti |
| De 2,0 V à 3,0 V inclus | 1 |

Ces seuils définissent cet exercice ; ils ne décrivent pas une famille logique particulière. Les autres tensions sont hors du domaine spécifié.

Ainsi 0,4 V donne 0, 2,4 V donne 1, et 1,4 V ne permet aucune conclusion garantie. Les limites comptent : 0,8 V appartient à la plage de 0, et 2,0 V à celle de 1.

## Comprendre une valeur non garantie

« Non garanti » n’est pas un troisième symbole de données. La spécification ne promet simplement pas si cette entrée sera interprétée comme 0 ou 1.

Différentes tensions peuvent porter le même symbole : 0,4 V augmenté de 0,2 V reste à 0,6 V, dans la plage de 0. De même, 2,4 V diminué de 0,2 V reste à 2,2 V, dans celle de 1.

Lorsqu’une tension passe continûment de 0,4 V à 2,4 V, elle traverse la région intermédiaire. Le changement n’est pas instantané. Une interface utile précise donc aussi quand ses entrées doivent être valides et quand sa sortie peut être observée.

## Lire une trace temporelle

Les nombres des tableaux suivants utilisent le point décimal. Chaque ligne est un échantillon isolé :

| Temps (ms) | Tension (V) | Interprétation |
|---|---|---|
| 0 | 0.4 | 0 |
| 1 | 0.6 | 0 |
| 2 | 1.4 | Non garanti |
| 3 | 2.4 | 1 |
| 4 | 2.6 | 1 |

Les colonnes indiquent quand on observe, ce qu’on observe et ce que la règle permet de conclure. Entre 0 ms et 1 ms, la tension mesurée change mais le symbole reste 0. À 2 ms, il n’existe aucune interprétation promise.

Ces échantillons ne donnent pas la forme exacte du signal entre les observations. Considérez cette autre trace :

| Temps dans l’intervalle (ms) | Tension (V) | Symbole |
|---|---|---|
| 0 | 0.4 | 0 |
| 0.5 | 2.4 | 1 |
| 1 | 0.6 | 0 |

Un observateur ne voyant que la première et la dernière ligne manquerait l’impulsion centrale. Deux échantillons successifs valant 0 ne prouvent donc pas que le signal est resté à 0. Cet exemple montre une possibilité non exclue ; il ne reconstitue pas la forme réelle du premier signal.

## Ajouter une garantie de temps

Une règle fonctionnelle précise quelle sortie doit être produite. Une règle temporelle précise quand cette sortie est garantie après stabilisation des entrées valides.

Supposons un composant promettant sa sortie au plus tard 2 μs après cette stabilisation. Si les entrées deviennent valides et stables à 10 μs et le restent, l’échéance est 12 μs. Rien ne garantit le résultat dès 11 μs. Ces valeurs servent seulement à comprendre une échéance.

## Exercices corrigés

1. Classer 0,8 V, 1,0 V et 2,0 V.
2. Un échantillon à 0 ms détermine-t-il le signal à 0,5 ms ?
3. « Non garanti » est-il un troisième message ?
4. Avec le délai de 2 μs, quelle échéance suit une stabilisation à 15 μs ?

**Réponses.** On obtient 0, non garanti et 1. Un échantillon isolé ne détermine pas la forme entre deux observations ; même des extrémités identiques peuvent cacher une impulsion. La zone non garantie ne définit aucun symbole supplémentaire. Enfin, 15 μs + 2 μs = 17 μs, à condition que les entrées restent valides et stables.

Le courant, la charge électrique du récepteur, le bruit et la théorie de l’échantillonnage dépassent ce chapitre.

Suite : [information et représentation binaire](/fr/library/foundations/information-et-representation/).
