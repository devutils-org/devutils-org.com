# Deux parsers imparfaits, une vraie démarche d'ingénieur

Retour sur un projet réalisé à mes débuts à 42, avant l’ère de l’IA, sans aller regarder de solution de parsing existante. Une relecture avec le recul d’aujourd’hui.

### Le contexte : apprendre à raisonner sans solution

Quand j'ai commencé Minishell à 42, je débutais encore en programmation. J'entrais dans ce que j'appelle ma phase de « déblocage mental » : le moment où l'on cesse de voir chaque problème difficile comme quelque chose que seuls d'autres savent résoudre.

Je m'étais fixé une contrainte : ne pas chercher une implémentation existante du parsing. Avec le recul, cette contrainte n'était pas forcément la méthode la plus efficace. Le développement des compilateurs s'appuie sur des décennies de théorie : grammaires, automates, recursive descent, algorithmes de précédence, analyse ascendante… Étudier ces travaux n'est pas copier une réponse sur Stack Overflow. C'est acquérir des outils intellectuels.

Mais cette contrainte m'a obligé à poser mes propres questions : que représente un opérateur ? Quand devient-il la racine d'un arbre ? Comment garder une expression entre parenthèses à part, puis la rattacher ? Faut-il représenter chaque `|` comme un nœud, alors que sa sémantique est différente de celle de `&&` et `||` ?

Ce document revient sur deux solutions successives. Elles ne sont ni universelles ni exemptes de défauts. Leur intérêt est de montrer le raisonnement qui les a produites.

## 1. Le problème de départ : une ligne de commande n'est pas une liste plate

Prenons :

```sh
cat file | grep error && echo found || echo missing
```

Les tokens forment une séquence, mais l'exécution obéit à plusieurs logiques : les commandes reliées par `|` partagent un pipeline ; `&&` conditionne l'exécution de sa droite au succès de sa gauche ; `||` fait l'inverse. Les parenthèses ajoutent des sous-expressions et une portée d'exécution en subshell.

Le lexer reconnaît des catégories de tokens. Le parser doit ensuite organiser ces tokens en une structure qui exprime le comportement attendu. C'est le même problème fondamental que dans le frontend d'un compilateur, même si les sorties et la sémantique d'un shell sont différentes.

## 2. Première stratégie : construire l'arbre itérativement, avec une pile de contextes

**Version historique : commit `99c91b3`, `src/tree/_tree_process.c`.**

La première version parcourt les tokens avec une boucle `while`. Elle s'appuie sur trois opérations structurelles :

- `_op_bt_push_root` : lorsqu'un `&&` ou un `||` arrive, le nouvel opérateur devient la racine et l'arbre précédent devient son enfant gauche.
- `_op_bt_push_right` : insère un nœud sur la droite de l'arbre courant.
- `_scp_push_back` et `_ptr_recovery` : conservent puis restaurent un contexte extérieur autour d'une parenthèse.

Le cœur du mécanisme est visible dans ces extraits :

```c
if (tok->type == _AND || tok->type == _OR)
    data->tree = _op_bt_push_root(data->tree,
        _op_bt_create(tok->type, tok));

if (tok->type == _OPEN_PAR)
{
    data->scop = _scp_push_back(data->scop, data->tree);
    data->tree = NULL;
}
else if (tok->type == _CLOSE_PAR)
    data->tree = _ptr_recovery(data->tree, &data->scop);
```

Pour `A && B || C`, promouvoir chaque opérateur en racine construit naturellement `((A && B) || C)` : une association à gauche, adaptée ici à ces deux opérateurs de même précédence.

Pour les parenthèses, le programme empile **un pointeur sur l'arbre extérieur**, repart avec `data->tree = NULL`, puis reconnecte le sous-arbre intérieur à la fermeture. Il n'utilise donc pas la pile d'appels C pour cette étape : l'état imbriqué est géré explicitement.

### Ce que cette stratégie invente, et ce qu'elle n'est pas

Ce n'est pas un parser LR : pas de table d'états, pas d'automate LR, pas de règles de réduction générales. Ce n'est pas non plus le shunting-yard classique, avec ses piles d'opérateurs et d'opérandes. C'est plutôt un **parser itératif spécialisé**, mêlant construction ascendante des opérateurs logiques et pile de contextes pour les groupes.

### Son imperfection réelle

Cette simplicité repose sur des invariants implicites. `_ptr_recovery` suppose qu'un contexte empilé pointe vers un opérateur valide et que l'arbre intérieur doit être inséré à sa droite :

```c
(*scop)->s_bot->ptr_op->right = tree;
```

Un groupe placé au début de la ligne peut pourtant être ouvert alors que `data->tree == NULL`. Dans le code observé, cette situation expose un risque de déréférencement nul à la fermeture. Plus généralement, la stratégie de raccordement n'exprime pas toutes les positions possibles d'un groupe. Elle marche dans le cadre de ses hypothèses, mais ces hypothèses ne constituent pas une grammaire complète.

Cela ne rend pas l'idée sans valeur. Cela montre la frontière entre une solution locale ingénieuse et un algorithme de parsing suffisamment général, avec des invariants formalisés et testés.

## 3. Deuxième stratégie : simplifier l'arbre, puis traiter les pipelines à part

**Version plus récente : `src/tree/_tree_builder.c`, `src/parsing/_parsing.c`, `src/exec/_exec.c`.**

La deuxième version passe à une décomposition en fonctions : `_cmd_node` construit une unité de commande ou un groupe ; `_tree_builder` répète l'opération tant qu'il rencontre `&&` ou `||`. Le lien entre deux sous-arbres est rendu explicite :

```c
*node = _bt_join(*node, tmp_token, tmp_node);
```

`_bt_join` crée un nœud opérateur avec `left` et `right`. La boucle assure encore une association à gauche des opérateurs logiques. Cette fois, un groupe parenthésé est analysé par appel récursif à `_tree_builder` : la récursion remplace la pile de contextes explicite de l'ancienne version pour cette responsabilité.

La décision architecturale la plus singulière est ailleurs : **les pipelines ne deviennent pas une succession de nœuds binaires `PIPE` dans l'arbre logique**.

Dans `_cmd_node`, un segment non parenthésé est parcouru jusqu'au prochain `&&` ou `||`. Plus tard, `_pars_pipe_lines` construit une liste de commandes à partir des séparateurs `|` :

```c
_cmd_push_back(&(*node)->cmd_line, (*node)->token);
/* ... */
if (tmp->x == _PIPE)
    _cmd_push_back(&(*node)->cmd_line, tmp->next);
```

L'exécuteur parcourt ensuite cette liste dans `_exec_loop`, crée les pipes et lance les processus via `_exec_process`. Les `&&` et `||`, eux, sont pilotés au niveau de `_exec` avec le statut de sortie, afin d'assurer le court-circuit.

Une représentation conceptuelle du programme précédent est donc :

```text
             OR
           /    \
         AND    echo missing
        /   \
 PIPELINE   echo found
  [cat file]
  [grep error]
```

On a **deux niveaux de représentation** : un arbre des décisions logiques, puis une liste de commandes pour l'exécution des pipelines. La seconde représentation est plus proche de ce que l'exécuteur doit consommer.

### Est-ce une HIR ?

C'est une analogie intéressante, mais à manier précisément. Dans un compilateur, une HIR (*High-level Intermediate Representation*) est une représentation structurée du programme, après certains traitements syntaxiques, qui conserve encore des concepts de haut niveau. Ici, l'arbre des opérateurs logiques garde de la structure de haut niveau, tandis que la liste des commandes par pipeline ressemble à un **abaissement spécialisé vers une représentation orientée exécution**.

On peut donc parler d'**une séparation de niveaux d'abstraction** ou d'**une IR propre au shell** au sens large, pas affirmer que Minishell implémente une HIR normalisée comparable à celle de `rustc`. Et contrairement à un pipeline de compilation à phases strictement séparées, une partie de la préparation des pipelines dans cette version intervient au moment de l'exécution.

### Ses imperfections

La structure est adaptée au périmètre de Minishell, mais n'est pas une représentation grammaticale universelle du shell. Certaines constructions, combinaisons de groupes et redirections demandent des règles supplémentaires. Le code de `_exec` fait un parcours récursif de l'arbre ; il ne suffit pas à lui seul de rendre la sémantique de Bash complète. Le couplage entre la représentation logique et la préparation tardive des pipelines mérite aussi d'être explicité.

## 4. Ce que les deux stratégies racontent

| Dimension | Première version | Deuxième version |
|---|---|---|
| Construction | Boucle sur les tokens | Fonctions `_cmd_node` / `_tree_builder` |
| Parenthèses | Pile explicite `scop` | Récursion |
| `&&` / `||` | Promotion d'un opérateur en racine | Fusion de deux sous-arbres par `_bt_join` |
| Pipelines | Déjà traités séparément au parsing | Listes `cmd_line`, exploitées plus tard par l'exécuteur |
| Point fort | Gestion volontaire de l'état et des sous-arbres | Structure de code plus lisible et séparation des responsabilités |
| Limite | Invariants de raccordement fragiles | Grammaire spécialisée et phases parfois entremêlées |

La deuxième stratégie n'est donc pas une rupture totale. Elle **conserve l'intuition initiale** — séparer le contrôle logique des pipelines — tout en changeant la façon de gérer l'imbrication et l'assemblage des arbres.

## 5. Ce que j'en retiens aujourd'hui, à l'ère de l'IA

Avec le recul, je ne pense pas que « ne jamais regarder de solution » soit une règle à recommander. Il y a une différence entre recopier sans comprendre et apprendre la théorie qui explique un problème. Les algorithmes de parsing existent justement pour éviter de redécouvrir chaque piège à partir de zéro.

Mais je ne regrette pas cette expérience. Elle m'a obligé à produire mes propres abstractions, à me tromper, à faire des hypothèses, à rencontrer leurs limites et à réviser mon architecture. J'étais fier non pas d'avoir inventé un meilleur parser que ceux de la littérature, mais de m'être prouvé que je pouvais **raisonner sur un problème qui me dépassait initialement**.

À l'ère de l'IA, je ne crois pas que la différence entre un développeur et un outil se résume à « l'humain est imparfait » : une IA peut aussi faire des erreurs, et un programme humain peut être excellent. La différence que je veux défendre est celle de la **responsabilité intellectuelle** : être capable d'expliquer ses choix, d'identifier les hypothèses de son code, de comprendre ses échecs et de savoir pourquoi une autre approche serait meilleure.

Ces deux versions imparfaites de Minishell ont de la valeur précisément parce qu'on peut y lire mes décisions, mes raccourcis et ma progression. La théorie m'aurait peut-être fait gagner du temps ; cette recherche personnelle m'a donné confiance dans ma capacité à résoudre des problèmes. Aujourd'hui, l'enjeu est de réunir les deux : **la curiosité de construire par soi-même, et l'humilité d'étudier ce que d'autres ont déjà compris**.

---

### Note méthodologique

Cette relecture s’appuie sur deux archives du projet : une version historique contenant notamment `src/tree/_tree_process.c`, `_op_bt_push_root.c`, `_op_bt_push_right.c`, `_scp_push_back.c` et `src/parsing/_parsing.c` ; et une version plus récente contenant `src/tree/_tree_builder.c`, `src/parsing/_parsing.c`, `src/exec/_exec.c`, ainsi que `_bt_join.c` dans `libft`. Les arbres illustrés sont conceptuels. Il s'agit d'une revue statique, pas d'une campagne de tests exhaustifs ni d'une preuve de conformité à Bash.
