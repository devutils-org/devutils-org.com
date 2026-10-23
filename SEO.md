# SEO audit and publishing

## Audit (24 October 2026)

GitHub Pages API confirms https://devutils-org.com/ as the production domain.
The existing site already provides prerendered HTML, unique bilingual page
metadata, semantic headings, internal navigation and social images. Its default
canonical and Open Graph origin was still github.io. It had no robots.txt or
sitemap. The static ATFQ book was outside the page registry and had no canonical
or description metadata.

## Implementation

`src/site.ts` is the single deployment origin, optionally overridden with
`SITE_URL=https://example.org npm run build`. Only origins are accepted because
the site uses root-relative navigation. DNS and hosting settings stay as configured.

`src/shell.ts` emits canonical and bilingual hreflang links (including x-default),
Open Graph metadata, and Organization, WebPage and breadcrumb JSON-LD.
No review scores, pricing, article dates or product capabilities are invented.

After prerendering, `scripts/seo.ts` verifies registered pages and social images,
enriches exported ATFQ book pages, and generates `dist/sitemap.xml` and
`dist/robots.txt`. Existing .html book URLs remain unchanged. New registered pages
and exported book chapters enter the sitemap automatically. No speculative
lastmod dates or priority values are emitted.

Run `npm test` and `npm run build`. Publish `dist/` through the existing Pages
workflow. Check production `/robots.txt`, `/sitemap.xml`, and canonical tags after
deployment; production is not changed by building this isolated checkout.

## Search Console (account access required)

1. Open https://search.google.com/search-console and add the domain property
   `devutils-org.com` (or use an existing verified property).
2. Complete Google's ownership verification if needed; keep its verification
   record. The website DNS configuration itself does not prove Search Console
   ownership.
3. After deployment, submit `https://devutils-org.com/sitemap.xml` in Sitemaps.
4. Inspect the homepage, a tool page, its French translation and a book chapter.
   Use the live test to check fetchability and request indexing where appropriate.
5. Monitor indexing exclusions, canonical selection and performance. Submission
   helps discovery but does not guarantee indexing or a ranking.

References:
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/monitor-debug/search-console-start

## Content and performance follow-up

Preserve the current static rendering and lightweight dependency set. Check Core
Web Vitals on production with real traffic; local builds do not prove performance
scores. Continue linking tools to their actual documentation and reports.

The broader writing brief describes a future blog and reusable authoring layouts.
There are no genuine blog articles in the current site, so this SEO change creates
neither fabricated articles nor an empty RSS feed. When real articles are added,
register their canonical routes, include author/date metadata from their source,
use Article/TechArticle data and generate RSS from that same content registry.
