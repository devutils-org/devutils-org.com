# Campagne SEO — 26 octobre 2026

Cette campagne améliore le code et le contenu du site. Les résultats ci-dessous
portent sur le build local ; ils ne constituent pas une mesure du classement ou
du trafic Google. La publication et le suivi Search Console restent distincts.

## État initial observé en production

- Accueil, Library EN/FR, article Binary adders, page Omniscient, robots.txt et
  sitemap.xml accessibles en HTTP 200.
- Sitemap : 268 URL. Contenus publiés : 75 en anglais, aucun en français.
- HTML lisible sans JavaScript, canonical et hreflang déjà présents sur les pages
  échantillonnées. Pas de blocage général identifié dans robots.txt.
- Titres de plusieurs outils principalement constitués de slogans.
- Pages de recherche interne présentes dans le sitemap.
- Livre ATFQ : descriptions répétant principalement les titres ; pas de JSON-LD.
- Pas de connexion Search Console disponible dans cette session : impressions,
  clics, positions, choix des canoniques par Google et indexation non mesurés.

Le contrôle ajouté dans cette campagne signalait initialement 153 absences de
données structurées dans le livre. C’est une exigence de complétude du projet,
pas la preuve que Google ne pouvait pas indexer ces pages.

## Changements réalisés

| Axe | Résultat |
|---|---|
| Titres et descriptions | Accueil et cinq outils décrivent leurs usages en EN/FR ; descriptions trop longues de pages principales raccourcies. |
| Library | Titre et description du hub plus explicites. Les longs titres de leçons gardent leur sujet dans les métadonnées et leur titre complet dans le H1. |
| Liens internes | Deux leçons pertinentes, unités et abstraction, liées depuis les cinq outils ; liens retour vers des outils d’investigation dans les deux langues. |
| Français | Un parcours et cinq chapitres des fondements, avec explications, exercices, réponses, sources, fiches de vérification et liens de langue réciproques. |
| Recherche | Les deux pages de recherche sont en noindex,follow et retirées du sitemap ; elles restent utilisables et liées dans la navigation. |
| Livre ATFQ | 153 pages décrites en JSON-LD ; 122 descriptions tirées du premier point visible de leur résumé, avec repli sur le titre pour les autres pages. |
| Métadonnées d’articles | TechArticle/Article, headline, image, éditeur, date réelle de modification et métadonnées Open Graph cohérentes. Aucun auteur humain, résultat de revue ou date de publication inventé. |
| Extraits | La provenance IA et les fiches de vérification restent visibles ; leur texte répétitif est exclu de Pagefind et des extraits Google avec data-nosnippet. Cela ne désindexe pas les articles. |
| Contrôles | Audit intégré au build : titres et descriptions uniques, H1, canonical, Open Graph, JSON-LD, langues réciproques et correspondance sitemap/pages indexables. |

Le corpus compte maintenant **81 contenus : 75 EN et 6 FR**. Les six adaptations
françaises sont des versions localisées des fondements, avec des évaluations
limitées par un assistant et des vérifications arithmétiques dédiées. Les
passages MIT, NIST et Computation Structures cités ont été consultés. La revue
humaine indépendante reste en attente et est signalée comme telle.

Les routes existantes sont conservées. Les nouveaux liens français pointent
vers les articles français réellement disponibles ; la suite en anglais est
explicitement indiquée. Les liens vers les outils distinguent les modèles
pédagogiques des observations d’une machine réelle.

## Validation

- `npm run verify:content` : 30 groupes de vérifications reproductibles.
- `npm test` : vérification TypeScript et **71 tests réussis**.
- `npm run build` : génération statique, recherche, contrôle des liens et audit SEO.
- Audit du build : **276 documents HTML**, **272 URL indexables**, **4 exclusions
  intentionnelles** (2 alias, 2 recherches), **0 erreur**.
- Aucun titre ni description identique sur les pages indexables ; aucune page
  orpheline trouvée par le contrôle des liens HTML entrants.
- Deux notices éditoriales conservées après examen : titre historique ImageNet
  de 71 caractères et description du chapitre Modern computing de 184 caractères.
  Ces seuils sont des heuristiques de lisibilité, pas des limites Google ; la
  précision de ces formulations justifie leur conservation.
- Navigateur : 24 vues desktop/mobile sans JavaScript ; navigation outil →
  article → traduction → outil ; recherche réelle dans l’index français.
- Axe : aucun problème sérieux ou critique détecté sur les six nouvelles pages,
  avec les fiches de vérification développées. Ce contrôle ne remplace pas un
  audit manuel d’accessibilité.
- Le script de contrôle après publication a aussi été exécuté sur un serveur
  local du build, avec origine réécrite pour le test : **274 pages récupérées,
  0 erreur**. Cela valide ce contrôle ; la vérification de la production après
  publication reste à faire.

Lighthouse 13.5.0, mode mobile par défaut, Chrome headless, build servi par Vite
Preview sur localhost, une exécution par page :

| Page | Performance | Accessibilité | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Accueil EN | 100 | 100 | 100 | 1,1 s | 0 ms | 0 |
| Omniscient EN | 100 | 100 | 100 | 1,4 s | 0 ms | 0 |
| Unités et ordres de grandeur FR | 100 | 100 | 100 | 0,9 s | 0 ms | 0 |

Ce sont des résultats de laboratoire locaux, pas des Core Web Vitals de terrain.
Des pistes non bloquantes demeurent sur les feuilles CSS et les chaînes de
requêtes. Aucune réécriture de rendu n’a été engagée sur la seule base de ces
suggestions : le contenu est déjà rapide dans les mesures réalisées.

Preuves de travail locales : `/tmp/devutils-seo-before.json`,
`/tmp/devutils-seo-after.json`, `/tmp/devutils-seo-browser/checks.json`, captures
dans ce même dossier, rapports Lighthouse `/tmp/devutils-lighthouse-*.json`.
Ces fichiers temporaires ne sont pas des archives persistantes du dépôt.

## Publication et suivi

Après publication du build par le workflow GitHub Pages existant :

1. Exécuter `npm run check:seo:live`. Le contrôle récupère le sitemap et ses pages
   avec quatre requêtes simultanées au maximum, vérifie les réponses HTTP, les
   métadonnées et les exclusions des pages de recherche. Il ne modifie pas le site.
2. Dans Search Console, soumettre `https://devutils-org.com/sitemap.xml` et
   inspecter l’accueil, un outil, une leçon EN, sa traduction FR et un chapitre
   ATFQ. Vérifier canonical sélectionnée, exploration et absence de blocage.
3. Exporter une référence sur 28 jours, si disponible : date, page, requête,
   pays, appareil, clics, impressions, CTR et position moyenne. Si le site est
   trop récent, conserver cette limite et constituer la référence progressivement.
4. Refaire les mesures Lighthouse sur la production et consulter les Core Web
   Vitals de terrain lorsqu’un volume suffisant les rend disponibles.

Ne pas interpréter un sitemap soumis, un score Lighthouse de 100 ou une requête
`site:` comme une garantie d’indexation ou de positionnement.

## Programme de suivi sur quatre semaines

Les semaines sont relatives à la publication ; ce programme n’est pas une
automatisation et aucune modification future n’est déjà effectuée.

| Échéance | Travail | Critère d’observation |
|---|---|---|
| Publication | Contrôle en ligne, sitemap et inspections Search Console. | URL accessibles ; éventuels écarts expliqués. |
| Semaine 1 | Examiner les exclusions et les premières requêtes par groupe : outils, livre, Library EN, Library FR. | Distinguer pages découvertes, explorées et indexées. |
| Semaine 2 | Revoir les pages avec impressions et peu de clics, selon la requête et la position ; comparer leurs extraits aux intentions réelles. | Choisir quelques révisions ciblées, sans remplacer toutes les métadonnées sur un faible échantillon. |
| Semaine 3 | Choisir un sujet d’investigation Linux reliant apprentissage et outil : durées/débits ou hypothèses d’un diagnostic. | Exemple reproductible, commandes réelles, résultats observés et limites ; revue avant publication. |
| Semaine 4 | Comparer une période disponible équivalente et décider des prochaines traductions selon les requêtes. | Clics et impressions par groupe/langue, avec prudence sur les faibles volumes et la saisonnalité. |

Le prochain investissement éditorial doit rapprocher la Library des questions
réelles des utilisateurs Linux. Les sujets déjà envisagés incluent la lecture
des mesures CPU/mémoire et la distinction entre latence et débit. Ils ne sont
pas présentés comme des articles déjà écrits ou relus. Une traduction massive
sans révision, des pages créées seulement pour des mots-clés et des liens externes
achetés ne font pas partie de cette campagne.

## Références consultées

- [Titres Google](https://developers.google.com/search/docs/appearance/title-link)
- [Descriptions et extraits](https://developers.google.com/search/docs/appearance/snippet)
- [Articles et données structurées](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Versions localisées](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Directives robots](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Contenu généré par IA](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)

La qualité, la relecture et l’utilité restent des travaux éditoriaux continus.
La campagne ne prétend pas établir le trafic gagné avant déploiement et mesure.
