import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * robots.txt (served at /robots.txt)
 *
 * Allows crawling of public content, blocks the intranet, API routes and the
 * internal demo pages, and points crawlers to the sitemap.
 *
 * Rendered at request time (like the sitemap and metadataBase) so the absolute
 * URL comes from the runtime `SITE_URL` env var — a single config surface
 * instead of baking the value in at build time.
 */
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cs/intranet',
          '/en/intranet',
          '/cs/komponenty',
          '/en/komponenty',
          '/cs/s-panelem',
          '/en/s-panelem',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
