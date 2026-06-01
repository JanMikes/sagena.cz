import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { locales } from '@/i18n/config';
import {
  getFullPageHierarchy,
  fetchHomepage,
  fetchAllNewsArticleSlugs,
} from '@/lib/strapi';

/**
 * sitemap.xml (served at /sitemap.xml)
 *
 * Built at request time from live Strapi data (the rest of the site is
 * `force-dynamic` so it can build without Strapi available). Covers, per
 * locale: the homepage, every CMS page (with its full parent path), the news
 * listing and every news article. The intranet is intentionally excluded.
 */
export const dynamic = 'force-dynamic';

// Internal / demo pages that should not be indexed.
const EXCLUDED_TOP_SEGMENTS = new Set(['komponenty', 's-panelem']);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${SITE_URL}/${locale}/`,
      changeFrequency: 'weekly',
      priority: 1,
    });

    // The page that backs the homepage is also reachable via its own slug;
    // skip it here so we don't advertise a duplicate of the homepage.
    let homepageSlug: string | undefined;
    try {
      homepageSlug = (await fetchHomepage(locale))?.page?.slug;
    } catch (error) {
      console.error('[sitemap] Failed to resolve homepage slug:', error);
    }

    // CMS pages (with full parent hierarchy in the path)
    try {
      const hierarchy = await getFullPageHierarchy(locale);
      for (const entry of hierarchy.values()) {
        if (entry.slug === homepageSlug) continue;
        if (EXCLUDED_TOP_SEGMENTS.has(entry.canonicalPath.split('/')[0])) continue;

        entries.push({
          url: `${SITE_URL}/${locale}/${entry.canonicalPath}/`,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error('[sitemap] Failed to load page hierarchy:', error);
    }

    // News listing
    entries.push({
      url: `${SITE_URL}/${locale}/aktuality/`,
      changeFrequency: 'daily',
      priority: 0.6,
    });

    // News articles
    try {
      const slugs = await fetchAllNewsArticleSlugs(locale);
      for (const slug of slugs) {
        entries.push({
          url: `${SITE_URL}/${locale}/aktuality/${slug}/`,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    } catch (error) {
      console.error('[sitemap] Failed to load news article slugs:', error);
    }
  }

  return entries;
}
