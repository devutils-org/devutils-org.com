// One origin for canonical URLs, previews, structured data and discovery files.
// GitHub Pages' confirmed custom domain; override for a different deployment.
const configured = new URL(process.env.SITE_URL ?? 'https://devutils-org.com')
if (!['https:', 'http:'].includes(configured.protocol) || configured.username || configured.password || configured.search || configured.hash || configured.pathname !== '/') {
  throw new Error('SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment')
}
export const SITE = configured.origin
