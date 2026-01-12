/**
 * Strapi Client-Safe Utilities
 *
 * This module contains pure functions that are safe to use in client components.
 * These functions do NOT import Redis or any server-only modules.
 */

import { ElementsTextLink } from '@/types/strapi';

/**
 * Resolve ElementsTextLink to href and disabled state
 * Priority: page > url > file > anchor
 *
 * @param link - The text link element from Strapi
 * @param locale - Current locale for prefixing internal page links (default: 'cs')
 */
export function resolveTextLink(link: ElementsTextLink, locale: string = 'cs'): {
  url: string;
  external: boolean;
  disabled: boolean;
  disabledReason?: string;
} {
  // Check if link is explicitly disabled
  if (link.disabled) {
    return {
      url: '#',
      external: false,
      disabled: true,
      disabledReason: 'Tento odkaz je momentálně nedostupný',
    };
  }

  // Priority 1: Internal page
  if (link.page?.slug) {
    return {
      url: `/${locale}/${link.page.slug}/`,
      external: false,
      disabled: false,
    };
  }

  // Priority 2: External URL
  if (link.url) {
    return {
      url: link.url,
      external: link.url.startsWith('http'),
      disabled: false,
    };
  }

  // Priority 3: File
  // Strapi v5 returns file relation directly (no .data or .attributes wrapper)
  if (link.file) {
    return {
      url: getStrapiMediaURL(link.file.url),
      external: false,
      disabled: false,
    };
  }

  // Priority 4: Anchor only
  if (link.anchor) {
    return {
      url: `#${link.anchor}`,
      external: false,
      disabled: false,
    };
  }

  // Fallback: disabled if no valid target
  return {
    url: '#',
    external: false,
    disabled: true,
    disabledReason: 'Odkaz nemá nastavenou cílovou stránku',
  };
}

/**
 * Check if an ElementsTextLink has a valid destination (page, url, file, or anchor)
 * Used to determine if a link should auto-generate to /aktuality with tags
 *
 * @param link - The text link element from Strapi
 * @returns true if link has page, url, file, or anchor set
 */
export function hasLinkDestination(
  link: ElementsTextLink | null | undefined
): boolean {
  if (!link) return false;
  return !!(link.page?.slug || link.url || link.file || link.anchor);
}

/**
 * Get the public URL for media files served via nginx
 *
 * Uses PUBLIC_UPLOADS_URL environment variable to serve uploads
 * through nginx instead of Next.js to avoid caching issues with
 * dynamically added files.
 */
export function getStrapiMediaURL(url: string): string {
  if (!url) return '';
  // If already absolute URL, return as-is
  if (url.startsWith('http')) return url;
  // Prepend PUBLIC_UPLOADS_URL for upload paths
  const uploadsUrl = process.env.PUBLIC_UPLOADS_URL || '';
  if (url.startsWith('/uploads/') && uploadsUrl) {
    return `${uploadsUrl}${url}`;
  }
  return url;
}
