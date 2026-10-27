---
id: concept.information-and-representation
type: concept
locale: fr
slug: information-et-representation
area: foundations
title: "Information et représentation binaire : comprendre les bits"
summary: Compter les combinaisons de bits, convertir un entier non signé et
  distinguer un motif binaire du message qu’il représente.
status: published
updated: 2026-10-26
prerequisites:
  - concept.signals-and-states
related:
  - path.computing-foundations
  - concept.models-and-abstraction
sources:
  - title: Steve Ward, Computation Structures — Information, sections 3.1–3.2.1.1
    url: https://computationstructures.org/notes/information/notes.html
steps: []
requirements: []
expected_results: []
contributions: []
aliases: []
---
## Compter les possibilités

Le chapitre précédent distinguait un signal physique du symbole qu’il représente. Que peut-on décrire avec plusieurs symboles ? Un chiffre binaire, ou **bit**, peut valoir 0 ou 1. Une suite de n bits possède 2^n motifs possibles.

Un bit donne deux choix. Pour chacun, le deuxième bit donne encore deux choix : 00, 01, 10 et 11. Le troisième double à nouveau l’ensemble et produit huit motifs. L’exposant compte les facteurs de deux.

| Largeur (bits) | Motifs possibles | Plus grand entier non signé |
|---|---|---|
| 1 | 2 | 1 |
| 2 | 4 | 3 |
| 3 | 8 | 7 |
| 4 | 16 | 15 |
| 5 | 32 | 31 |

La dernière colonne suppose l’interprétation numérique expliquée plus bas. Le nombre de motifs diffère de la plus grande valeur, car zéro fait partie des valeurs comptées.

## Donner un sens aux motifs

Un code de longueur fixe utilise le même nombre de bits pour chaque message. Pour retrouver un message sans ambiguïté, attribuons un motif différent à chaque possibilité :

| Motif | Message |
|---|---|
| 00 | Au repos |
| 01 | En cours |
| 10 | Terminé |
| 11 | Défaut |

Sous cette convention, 10 signifie « Terminé ». Cela ne veut pas dire deux travaux terminés. Si deux messages partageaient 10, le récepteur ne pourrait pas les distinguer.

Deux bits fournissent exactement quatre motifs. Un cinquième message exige au moins trois bits dans un code binaire de longueur fixe : trois bits offrent huit motifs. Certains peuvent rester sans attribution ; il faut assez de motifs distincts, sans obligation de tous les utiliser.

## Lire un entier binaire non signé

En décimal, 305 signifie trois centaines, zéro dizaine et cinq unités. Chaque déplacement vers la gauche multiplie le poids par dix. En binaire, le facteur est deux.

Sur quatre bits non signés, les poids de gauche à droite sont 8, 4, 2 et 1. Chaque bit indique si l’on ajoute son poids. « Non signé » signifie ici que l’on représente des entiers positifs ou nuls, sans réserver un bit au signe négatif.

~~~text
bits :    1  0  1  0
poids :   8  4  2  1
valeur = 1 × 8 + 0 × 4 + 1 × 2 + 0 × 1 = 10
~~~

Le bit de droite porte le poids des unités ; inverser les bits peut changer la valeur. Le motif binaire 1010 ne désigne pas le nombre décimal mille dix. Précisez la base lorsque le contexte est ambigu.

| Motif | Calcul | Valeur non signée |
|---|---|---|
| 0000 | 0 | 0 |
| 0011 | 2 + 1 | 3 |
| 0101 | 4 + 1 | 5 |
| 1010 | 8 + 2 | 10 |
| 1111 | 8 + 4 + 2 + 1 | 15 |

Quatre bits représentent les valeurs de 0 à 15 inclus : seize valeurs. Les zéros initiaux conservent la largeur demandée sans changer la valeur non signée ; 0011 et 11 valent trois.

## Encoder un nombre

Pour écrire treize sur quatre bits, examinez les poids du plus grand au plus petit :

1. Huit tient dans treize : écrire 1, puis garder cinq.
2. Quatre tient dans cinq : écrire 1, puis garder un.
3. Deux ne tient pas dans un : écrire 0.
4. Un tient dans un : écrire 1, puis garder zéro.

Le motif est 1101. Décoder donne 8 + 4 + 1 = 13, ce qui vérifie l’encodage. Seize ne tient pas dans quatre bits non signés : même 1111 ne vaut que quinze. Il faut élargir la représentation ou définir un autre comportement. Conserver seulement les quatre bits bas ne préserverait pas seize.

## Conserver la convention avec les bits

Le motif 10 signifie « Terminé » dans notre code de messages et deux sous l’interprétation numérique non signée. Les bits seuls ne choisissent pas entre ces conventions. La largeur, le contexte et le code partagé donnent le sens.

Un bit peut aussi représenter une valeur de vérité dans un modèle logique. Cela ne rend pas automatiquement pertinente l’addition de deux codes de messages.

Ne confondez pas capacité de représentation et information effectivement apportée. Recevoir un état déjà connu peut ne réduire aucune incertitude. Les mesures formelles d’information dépendent aussi des issues possibles et de leurs probabilités ; elles ne sont pas développées ici.

## Exercices corrigés

1. Combien de motifs distincts peut-on écrire sur cinq bits ?
2. Décoder 1101 comme entier non signé.
3. Combien de bits faut-il pour neuf messages dans un code de longueur fixe ?
4. Encoder six sur quatre bits, puis vérifier.
5. Sans convention, 10 signifie-t-il « Terminé » ou deux ?

**Réponses.** Cinq facteurs de deux donnent 32 motifs, soit les entiers de 0 à 31 sous l’interprétation non signée. Pour 1101, les poids retenus sont 8, 4 et 1 : la valeur est 13. Trois bits donnent seulement huit motifs ; neuf messages exigent donc quatre bits, dont sept motifs peuvent rester inutilisés. Six s’écrit 0110 : 4 + 2 = 6. Enfin, il faut connaître la convention pour interpréter 10.

Nous supposons des symboles convenus et transmis sans erreur. Les entiers signés, la compression et la correction d’erreurs demandent d’autres modèles.

Suite : [modèles et abstraction](/fr/library/foundations/modeles-et-abstraction/).
