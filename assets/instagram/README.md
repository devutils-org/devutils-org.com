# Instagram visuals

Rendered by `scripts/instagram.mjs` from `social/instagram.html`, with the
site's own glass shader. Two concepts, two formats:

| Folder | What |
|---|---|
| `lineup-grid/` | the five instruments from the front, 3 × 3 tiles |
| `lineup-triptych/` | the same, 3 × 1 |
| `contrail-grid/` | one app's path through the five, like a contrail, 3 × 3 |
| `contrail-triptych/` | the same, 3 × 1 |

Each folder has `full.png` (the whole picture) and one 1080 × 1440 tile per
post, the 3:4 shape of Instagram's profile grid. Tiles are numbered in
posting order: Instagram shows the newest post first, top left, so post
`post-01` first (bottom right) and the highest number last (top left).
