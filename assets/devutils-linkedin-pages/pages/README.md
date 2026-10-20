# Visuels LinkedIn par page

12 PNG issus des vrais modèles 3D du site, avec les slogans lus dans les pages actuelles. Les anciens assets sont conservés.

- **devutils** — Small tools. Honest answers. — `assets/pages/main/`
- **Omniscient** — See beyond the surface. — `assets/pages/omniscient/`
- **ATFQ** — Ask the question. Your machine answers. — `assets/pages/atfq/`
- **distroproof** — Works on my machine. Proven on theirs. — `assets/pages/distroproof/`
- **xpac** — Every package. Every reason. — `assets/pages/xpac/`
- **VMAnyware** — Your homelab. From anywhere. — `assets/pages/vmanyware/`

Chaque dossier contient `linkedin-post.png` (1200 × 627) et `social-square.png` (1080 × 1080).

Galerie : `out/output/social-pages/index.html`.

## Régénérer

Lancer Vite, installer `playwright-core` dans un environnement au choix, puis lancer `node scripts/social-pages.mjs`. Variables : `PLAYWRIGHT_MODULE` (module Playwright), `CHROME_PATH` (exécutable Chromium), `SOCIAL_BASE_URL` (par défaut http://127.0.0.1:5174). Le script lit les titres des pages, utilise `src/scene.js` et `src/shapes.js`, vérifie les débordements de texte et exporte les deux formats.

Les contenus plus anciens de `out` mentionnent pkgx ; la page actuelle et ces exports utilisent xpac.
