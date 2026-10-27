---
id: concept.mathematical-reasoning
type: concept
locale: fr
slug: raisonnement-mathematique
area: foundations
title: "Raisonnement mathématique : variables, exemples et preuves"
summary: Lire une formule, définir ses entrées et distinguer un exemple, un
  contre-exemple et une preuve, avec exercices corrigés.
status: published
updated: 2026-10-26
prerequisites: []
related:
  - path.computing-foundations
  - concept.units-and-scale
sources:
  - title: "MIT Mathematics for Computer Science — sections 1.1–1.4: propositions,
      predicates and proof"
    url: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session1.pdf
steps: []
requirements: []
expected_results: []
contributions: []
aliases: []
---
## Poser une question précise

« Ce rangement fonctionne pour toutes les entrées. » Quelles entrées ? Quel résultat est attendu ? Qu’est-ce qui constituerait un échec ? Le raisonnement mathématique permet de formuler ces questions assez précisément pour y répondre.

Une **proposition** est un énoncé vrai ou faux : « douze est pair » est vrai ; « douze est impair » est faux. Une question n’est pas une proposition. Un **prédicat** dépend d’une valeur : « n est pair » devient une proposition lorsque n est fixé. Une **preuve** établit une conclusion à partir d’hypothèses et de déductions valides.

Ce chapitre demande seulement de savoir additionner, multiplier et diviser. Les boîtes de cartes servent de modèle pédagogique avant de parler d’ordinateurs.

## Lire une variable et une règle

Une variable nomme une valeur. Notons n le nombre de boîtes, chacune contenant quatre cartes. Les valeurs autorisées sont les entiers 0, 1, 2, etc. Cet ensemble est le **domaine** de la règle. Une demi-boîte ou un nombre négatif de boîtes sort de cet exemple.

~~~text
cartes(n) = 4 × n
cartes(3) = 4 × 3 = 12
~~~

Les parenthèses donnent l’entrée de la règle ; elles ne signifient pas « cartes multiplié par n ». Pour évaluer cartes(3), on remplace n par 3. Le signe égal exprime une égalité, sans modifier la valeur de n.

| Boîtes n | Calcul | Cartes |
|---|---|---|
| 0 | 4 × 0 | 0 |
| 1 | 4 × 1 | 4 |
| 2 | 4 × 2 | 8 |
| 3 | 4 × 3 | 12 |
| 5 | 4 × 5 | 20 |

Le cas zéro vérifie une limite simple : aucune boîte donne aucune carte. Avec trois cartes séparées en plus, la règle devient total(n) = 4 × n + 3. Pour deux boîtes, cela donne 8 + 3 = 11 cartes.

## Respecter les opérations

La multiplication précède l’addition, sauf si les parenthèses changent le regroupement :

~~~text
4 × n + 3 = (4 × 2) + 3 = 11
4 × (n + 3) = 4 × (2 + 3) = 20
~~~

La première expression ajoute trois cartes ; la seconde ajoute trois boîtes. Écrire une étape intermédiaire permet de repérer la différence.

Une puissance compte des facteurs répétés. Ainsi 2^3 = 2 × 2 × 2 = 8, alors que 2 × 3 = 6. De même, 10^2 = 100 et 10^3 = 1000. Pour une base non nulle, la puissance zéro vaut 1. Le prochain chapitre introduira les puissances négatives pour les petites unités.

## Distinguer exemple et preuve

Affirmation : « Pour tout entier n positif ou nul, 4 × n est pair. » Un entier est pair s’il vaut deux fois un entier.

1. Par hypothèse, n est un entier positif ou nul.
2. Donc 2 × n est aussi un entier.
3. On peut écrire 4 × n = 2 × (2 × n).
4. Le résultat est deux fois un entier : il est donc pair.

Cet argument concerne toutes les entrées autorisées, sans les essayer une par une.

L’affirmation inverse, « tout entier pair positif ou nul est un multiple de quatre », est fausse. Le nombre 2 est pair, mais n’est pas un multiple de quatre. Ce **contre-exemple** suffit à réfuter le mot « tout ». Inverser une implication vraie ne garantit pas une nouvelle implication vraie.

Un exemple réussi montre qu’un cas fonctionne. Une preuve explique pourquoi tous les cas annoncés fonctionnent. Tester n de 0 à 100 laisse une infinité d’entiers sans examen.

Si un sélecteur n’accepte que 0, 1, 2 ou 3, tester ces quatre entrées couvre son domaine fini, à condition de considérer tous les modes et états pertinents. Un état mémorisé oublié peut élargir ce domaine. Pour un système informatique, commencez donc par définir les entrées et le résultat promis.

## Exercices corrigés

Essayez avant de lire les réponses :

1. Calculer cartes(0) et cartes(5).
2. Réfuter « tout multiple de trois est pair ».
3. Pourquoi vérifier les entiers de 0 à 100 ne suffit-il pas pour tous les entiers positifs ou nuls ?
4. Pour deux boîtes et trois cartes séparées, choisir entre 4 × n + 3 et 4 × (n + 3).
5. Comparer 2^3 et 2 × 3.

**Réponses.** On obtient 4 × 0 = 0 et 4 × 5 = 20 cartes. Le nombre 3 réfute la deuxième affirmation : 3 = 3 × 1, mais il est impair. Un test qui s’arrête à 100 ne traite pas les cas suivants. La règle du quatrième exercice est 4 × n + 3 = 11 ; l’autre expression compterait cinq boîtes, soit 20 cartes. Enfin, trois facteurs de deux donnent 8, tandis que deux multiplié par trois donne 6.

Vous pouvez poursuivre lorsque vous savez nommer un domaine, remplacer une variable et expliquer ce qui réfuterait une affirmation. Les ensembles, les algorithmes et d’autres techniques de preuve demandent des chapitres supplémentaires.

Suite : [unités et ordres de grandeur](/fr/library/foundations/unites-et-ordres-de-grandeur/).
