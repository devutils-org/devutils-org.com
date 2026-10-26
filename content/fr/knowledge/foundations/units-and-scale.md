---
id: concept.units-and-scale
type: concept
locale: fr
slug: unites-et-ordres-de-grandeur
area: foundations
title: "Unités et ordres de grandeur : durées et débits"
summary: Convertir secondes, millisecondes et microsecondes, additionner des
  durées et distinguer temps écoulé et débit avec des exercices corrigés.
status: published
updated: 2026-10-26
prerequisites:
  - concept.mathematical-reasoning
related:
  - path.computing-foundations
  - concept.signals-and-states
sources:
  - title: NIST Guide to the SI — chapter 7, expressing values of quantities
    url: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values
  - title: NIST — Metric (SI) Prefixes
    url: https://www.nist.gov/pml/owm/metric-si-prefixes
steps: []
requirements: []
expected_results: []
contributions: []
aliases: []
---
## Donner un sens au nombre

Un délai de 5 est incomplet : cinq secondes et cinq millisecondes ne décrivent pas la même durée. La valeur d’une grandeur associe une valeur numérique à une unité. Écrivez 5 ms avec un espace entre le nombre et le symbole.

La durée est la grandeur ; la seconde ou la milliseconde est l’unité choisie pour l’exprimer. Convertir une durée change sa représentation numérique, pas le temps qui passe. Ce chapitre reprend les variables et l’ordre des opérations du [raisonnement mathématique](/fr/knowledge/foundations/raisonnement-mathematique/).

## Changer d’échelle

Un préfixe multiplie l’unité. Le symbole s désigne la seconde et le préfixe m un millième. Une milliseconde vaut donc un millième de seconde.

| Préfixe | Symbole | Multiplicateur |
|---|---|---|
| kilo | k | 10^3 |
| méga | M | 10^6 |
| milli | m | 10^-3 |
| micro | μ | 10^-6 |
| nano | n | 10^-9 |

Une puissance négative désigne un inverse : 10^-3 = 1/1000. Elle ne rend pas la durée négative. La casse compte : m et M ne sont pas interchangeables.

On a 1 s = 1000 ms et 1 ms = 1000 μs. Une unité plus petite exige un nombre plus grand pour exprimer la même durée. Passer des secondes aux millisecondes doit donc augmenter le nombre.

## Convertir sans changer la grandeur

Le rapport de deux quantités égales vaut un. Multiplier par ce rapport conserve la grandeur et permet de simplifier les unités :

~~~text
3 ms × (1 s / 1000 ms)
= (3 / 1000) s
= 0.003 s

2500 μs × (1 ms / 1000 μs) = 2.5 ms
~~~

Le symbole ms disparaît du premier calcul, car il figure au numérateur et au dénominateur. Un facteur placé dans l’autre sens ne le simplifierait pas : c’est un indice d’erreur. Les blocs de calcul utilisent ici le point décimal pour faciliter leur comparaison aux exemples anglais.

| Secondes | Millisecondes | Microsecondes |
|---|---|---|
| 0.001 | 1 | 1000 |
| 0.003 | 3 | 3000 |
| 0.0025 | 2.5 | 2500 |

Chaque ligne exprime une seule durée sous trois formes.

## Additionner dans une unité commune

Il faut d’abord convertir les entrées :

~~~text
3 ms + 2500 μs = 3 ms + 2.5 ms = 5.5 ms
~~~

Le résultat vaut aussi 0,0055 s. Écrire 2503 ms traiterait des microsecondes comme des millisecondes. Les grandeurs doivent également être compatibles : additionner une durée à une distance ne donne pas un total cohérent.

## Calculer un débit

Supposons qu’une machine termine un élément toutes les 4 ms, sans pause et sans chevauchement. Une seconde contient 1000 ms ; 1000 / 4 = 250 éléments sont donc terminés par seconde.

~~~text
débit = 1 élément / 0.004 s = 250 éléments/s
~~~

Dans ce modèle, durée par élément et débit sont inverses. Doubler la durée à 8 ms réduit le débit à 125 éléments/s. Avec une pause de 1 ms après chaque élément de 4 ms, le cycle dure 5 ms et le débit soutenu devient 200 éléments/s.

Si plusieurs éléments sont traités en même temps, le débit n’est pas nécessairement l’inverse du temps écoulé pour un seul élément. Indiquez les hypothèses avant d’interpréter les nombres affichés par un outil.

## Estimer et vérifier

Deux tâches durent 2 ms et 700 μs. Comme 700 μs est inférieur à 1 ms, leur somme doit être entre 2 ms et 3 ms. Le calcul donne 2 ms + 0,7 ms = 2,7 ms. Cette estimation détecte un facteur mille mal placé.

Vérifiez les unités, l’ordre de grandeur et l’opération inverse : 2,7 ms − 2 ms = 0,7 ms = 700 μs.

## Exercices corrigés

1. Convertir 6 ms en secondes et en microsecondes.
2. Additionner 500 μs et 1,5 ms.
3. Sans pause ni chevauchement, calculer le débit d’un élément toutes les 2 ms.
4. Ajouter une pause de 3 ms après chaque élément de 2 ms : quel débit soutenu ?
5. Corriger 3 ms + 2500 μs = 2503 ms.

**Réponses.** 6 ms = 0,006 s = 6000 μs. Ensuite, 500 μs = 0,5 ms, donc la somme vaut 2 ms. Un élément en 0,002 s donne 1 / 0,002 = 500 éléments/s. Avec la pause, le cycle dure 2 + 3 = 5 ms et donne 200 éléments/s. Enfin, 2500 μs = 2,5 ms ; la somme correcte vaut 5,5 ms.

Les durées sont des données pédagogiques choisies. L’incertitude de mesure et les préfixes binaires de stockage nécessitent une étude distincte.

Suite : [signaux et états](/fr/knowledge/foundations/signaux-et-etats/).
