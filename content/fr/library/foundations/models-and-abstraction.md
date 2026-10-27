---
id: concept.models-and-abstraction
type: concept
locale: fr
slug: modeles-et-abstraction
area: foundations
title: "Modèles et abstraction : hypothèses, tests et limites"
summary: Définir ce qu’un modèle garantit, vérifier ses hypothèses et comprendre
  pourquoi une table logique ne suffit pas à valider un circuit réel.
status: published
updated: 2026-10-26
prerequisites:
  - concept.information-and-representation
related:
  - path.computing-foundations
  - concept.boolean-algebra
sources:
  - title: Steve Ward, Computation Structures — The Digital Abstraction, sections
      5.1–5.3
    url: https://computationstructures.org/notes/digitalabstraction/notes.html
  - title: "MIT Mathematics for Computer Science — sections 1.1–1.4: propositions,
      predicates and proof"
    url: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session1.pdf
steps: []
requirements: []
expected_results: []
contributions: []
aliases: []
---
## Choisir la question et le modèle

Un **modèle** sélectionne les détails nécessaires à une question. Une **spécification** décrit ce qu’un composant promet dans certaines conditions. Une **abstraction** permet de travailler avec cette interface en laissant de côté des détails de réalisation.

Pour décider si un voyant doit être allumé, une règle à deux états peut suffire. Pour calculer sa puissance électrique, il faut d’autres quantités et relations. Ajouter des détails sans rapport avec la question n’améliore pas nécessairement le modèle.

Les chapitres précédents apportent des outils complémentaires : énoncés précis, unités cohérentes, interprétation des signaux et conventions de représentation. Nous allons les combiner en vérifiant les limites de chaque description.

## Écrire un contrat fonctionnel

Notre voyant possède deux entrées binaires, « activé » et « prêt », supposées valides et stables. Il s’allume exactement lorsque les deux valent 1.

| Activé | Prêt | Allumé |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

Quand « activé » vaut 0, la condition échoue quelle que soit l’autre entrée. Quand il vaut 1, la sortie suit « prêt ». Cela couvre les quatre combinaisons de deux entrées binaires.

Cette table ne précise ni tension, ni délai, ni comportement pour une entrée sans interprétation logique valide. Ces questions nécessitent des garanties supplémentaires.

## Distinguer hypothèses et conclusions

Le domaine binaire et la règle « les deux entrées » sont des hypothèses. Les quatre sorties en découlent. Une table correctement calculée ne prouve pas qu’un récepteur réel fournit des entrées binaires valides au moment observé.

Pour appliquer le modèle à un appareil, précisez ce qui a été mesuré, la règle de décodage et la fonction utilisant les symboles obtenus. Une hypothèse manquante peut invalider la conclusion même lorsque l’arithmétique est correcte.

Un troisième message possible, une règle mémorisant le passé ou des seuils différents changeraient chacun le modèle. Écrire les hypothèses permet de repérer ce qui doit être réexaminé.

## Vérifier la frontière des interfaces

Une sortie observée à 1,4 V ne suffit pas à juger la table : il faut une règle de décodage et un instant d’observation. Dans le [récepteur du chapitre précédent](/fr/library/foundations/signaux-et-etats/), cette tension n’a aucune valeur logique garantie.

Supposons un émetteur utilisant 0,4 V pour 0 et 1,8 V pour 1. Le récepteur reconnaît 0 de 0 V à 0,8 V inclus, et 1 de 2,0 V à 3,0 V inclus. Les tableaux utilisent le point décimal :

| Bit voulu | Tension envoyée (V) | Interprétation reçue |
|---|---|---|
| 0 | 0.4 | 0 |
| 1 | 1.8 | Non garanti |

Les deux composants parlent de 0 et de 1, mais leurs interfaces physiques ne concordent pas pour la deuxième ligne. Le récepteur ne promet rien pour 1,8 V. Recalculer la table logique ne répare pas cette incompatibilité.

Le temps crée une autre frontière : observer une sortie avant l’échéance annoncée sort de la garantie, même si la valeur finale est correcte.

## Composer deux garanties

Relions le voyant à un second composant qui recopie son entrée binaire. Le premier garantit sa sortie sous 2 μs après stabilisation de ses entrées ; le second garantit la copie sous 3 μs après stabilisation de la sienne. Supposons les niveaux compatibles et les entrées initiales maintenues fixes.

~~~text
borne de délai totale = 2 μs + 3 μs = 5 μs
~~~

La première sortie est valide au plus tard après 2 μs, puis la copie dispose au plus de 3 μs supplémentaires. La sortie finale est donc garantie sous 5 μs. Elle peut se stabiliser avant : la borne est une échéance, pas une durée exacte.

La table fournit la valeur ; les délais indiquent quand s’y fier ; la compatibilité des interfaces permet de relier les garanties aux hypothèses suivantes.

## Relier les descriptions

Pour notre voyant : le message indique s’il doit être allumé ; la représentation lui attribue 0 ou 1 ; la règle logique calcule ce bit ; l’interface physique le transporte avec des niveaux et des délais définis.

Lors d’un diagnostic, cherchez la convention qui échoue. Une tension correcte peut transmettre le mauvais sens si le code est inversé. Un niveau hors plage ne garantit pas le symbole voulu. Une observation trop précoce peut précéder la stabilisation.

Tester les quatre paires binaires couvre la fonction sur son domaine fini. Cela ne démontre pas toutes les propriétés d’une réalisation réelle. Il faut préciser ce que le test a effectivement exercé.

## Exercices corrigés

1. Pour activé = 0 et prêt = 1, quelle sortie ?
2. Citer deux questions auxquelles la table ne répond pas.
3. Pourquoi un 1 envoyé à 1,8 V n’est-il pas garanti reçu comme 1 ?
4. Avec les bornes de 2 μs et 3 μs, peut-on promettre la sortie à 4 μs ?
5. Une table exhaustive établit-elle la compatibilité électrique ?

**Réponses.** La sortie est 0 : les deux entrées doivent valoir 1. La puissance et le délai demandent des informations absentes de la table. La tension de 1,8 V se trouve entre les plages garanties du récepteur : c’est une incompatibilité d’interface. Les bornes donnent 5 μs ; un résultat à 4 μs est possible mais ne découle pas de ces garanties. Enfin, une table de symboles ne contient pas les plages de tension nécessaires pour établir la compatibilité physique.

Revenir au [parcours des fondements](/fr/learn/fondements-informatique/) permet de réunir ces notions. Les parcours de [physique](/learn/physics-for-computing/) et de [logique numérique](/learn/digital-logic-foundations/) sont disponibles en anglais.
