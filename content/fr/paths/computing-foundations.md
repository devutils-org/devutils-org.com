---
id: path.computing-foundations
type: path
locale: fr
slug: fondements-informatique
title: "Fondements de l’informatique : débuter pas à pas"
summary: "Un parcours en français de cinq chapitres avec exercices corrigés :
  raisonnement, unités, signaux, représentation binaire et abstraction."
status: published
updated: 2026-10-26
prerequisites: []
related:
  - path.physics-for-computing
  - path.digital-logic-foundations
steps:
  - concept.mathematical-reasoning
  - concept.units-and-scale
  - concept.signals-and-states
  - concept.information-and-representation
  - concept.models-and-abstraction
sources:
  - title: "MIT Mathematics for Computer Science — sections 1.1–1.4: propositions,
      predicates and proof"
    url: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session1.pdf
  - title: NIST Guide to the SI — chapter 7, expressing values of quantities
    url: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values
  - title: Steve Ward, Computation Structures — The Digital Abstraction, sections
      5.1–5.3
    url: https://computationstructures.org/notes/digitalabstraction/notes.html
  - title: Steve Ward, Computation Structures — Information, sections 3.1–3.2.1.1
    url: https://computationstructures.org/notes/information/notes.html
requirements: []
expected_results: []
contributions: []
aliases: []
---
## Commencer ici

Ce parcours commence avant les circuits et la programmation. Il demande de savoir additionner, multiplier et diviser. Aucun éditeur de code, matériel électronique ou cours préalable n’est nécessaire. Les cinq chapitres de ce parcours sont disponibles en français.

Prenez le temps de poser les calculs et de prédire les réponses avant de lire les corrections. L’ordre proposé est un choix éditorial de devutils, sans certification externe. Les sources appuient les notions individuelles ; elles ne valident pas ce programme particulier.

## Suivre cinq chapitres

1. **Raisonnement mathématique** : lire une variable, respecter l’ordre des opérations, définir un domaine et distinguer exemples et preuve.
2. **Unités et ordres de grandeur** : convertir avec des rapports d’unités, estimer un résultat et distinguer durée et débit.
3. **Signaux et états** : interpréter des plages de tension, traiter leurs limites et comprendre une impulsion manquée entre deux échantillons.
4. **Information et représentation binaire** : compter les motifs possibles, lire les poids et encoder comme décoder un entier non signé.
5. **Modèles et abstraction** : séparer hypothèses et conclusions, repérer une interface incompatible et composer des bornes de délai.

Les liens des étapes de lecture ouvrent les chapitres dans cet ordre. Chacun contient des exemples expliqués et des exercices corrigés.

## Vérifier sa compréhension

Sans consulter les réponses :

1. Réfuter « tout entier pair positif ou nul est un multiple de quatre ».
2. Additionner 3 ms et 2500 μs.
3. Dans notre récepteur fictif, 1,4 V garantit-il 0 ou 1 ?
4. Combien de bits de longueur fixe distinguent neuf messages ?
5. Une table logique correcte établit-elle le délai de propagation d’un circuit réel ?

## Réponses et portée

Le nombre 2 est un contre-exemple à la première affirmation. La somme vaut 5,5 ms. Le récepteur ne garantit aucun des deux symboles à 1,4 V. Neuf messages exigent quatre bits, car trois n’offrent que huit motifs. Enfin, une table logique ne spécifie pas à elle seule un délai physique.

Terminer le parcours signifie savoir expliquer ces résultats et leurs hypothèses. Reconnaître les nombres sans pouvoir justifier les étapes ne suffit pas.

## Combiner les notions

Le code de l’indicateur associe 10 au message « Terminé ». Un émetteur envoie deux bits à deux instants convenus, avec un signal stable à chaque échantillon. Il utilise 1,8 V pour le premier bit voulu et 0,4 V pour le second.

Le récepteur décode 0 de 0 V à 0,8 V inclus et 1 de 2,0 V à 3,0 V inclus. Peut-on garantir que « Terminé » a été reçu ? Que change une première mesure de 2,4 V ?

## Expliquer la réponse combinée

Appliquez la règle aux observations avant de supposer les intentions réalisées. À 1,8 V, le premier symbole n’est pas garanti. À 0,4 V, le second vaut 0. Le motif complet 10 n’est donc pas établi, et le message « Terminé » n’est pas garanti.

Avec 2,4 V au premier échantillon, les deux tensions sont dans des plages valides et donnent 1 puis 0. La convention partagée interprète alors 10 comme « Terminé », sous les hypothèses de stabilité et d’échantillonnage annoncées.

Cet exercice relie un énoncé précis, des quantités avec unités, une règle de décodage et un accord de représentation. Un code correct ne compense pas une interface physique incompatible.

## Continuer le parcours

Le [sommaire de la bibliothèque](/fr/knowledge/computing-stack/) distingue les articles disponibles des domaines prévus. Pour continuer après ces fondements, les parcours de [physique pour l’informatique](/learn/physics-for-computing/) et de [logique numérique](/learn/digital-logic-foundations/) sont actuellement en anglais.
