/**
 * Strapi CMS Client
 *
 * Centralized client for fetching data from Strapi API with:
 * - Authentication header injection
 * - Type-safe query building
 * - Deep population for nested relations
 */

import {
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiMedia,
  Navigation,
  Page,
  NavigationItem,
  ElementsLink,
  ElementsIntranetLink,
  ElementsTextLink,
  ResolvedLink,
  Icon,
  NewsArticle,
  IntranetNewsArticle,
  IntranetPage,
  Tag,
  Footer,
  Homepage,
  Search,
  SearchableItem,
} from '@/types/strapi';
import {
  cacheGet,
  cacheSet,
  cacheDeletePattern,
  cacheClearAll,
  cacheStats,
} from '@/lib/redis';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Get Strapi URL based on environment
 *
 * Server-side: Use STRAPI_URL (e.g., http://strapi:1337 in Docker)
 * Client-side: Use NEXT_PUBLIC_STRAPI_URL (e.g., http://localhost:1337)
 */
const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Get full Strapi API URL
 */
function getStrapiURL(path: string = ''): string {
  return `${STRAPI_URL}${path}`;
}

// ============================================================================
// Core Fetch Function
// ============================================================================

/**
 * Convert object to query string using qs-style nested format
 * Strapi uses the `qs` library for parsing nested objects
 * We need to replicate its bracket notation for nested params
 */
function buildQueryString(params: Record<string, any>): string {
  const parts: string[] = [];

  function encodeParam(key: string, value: any): void {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        encodeParam(`${key}[${index}]`, item);
      });
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((subKey) => {
        encodeParam(`${key}[${subKey}]`, value[subKey]);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  Object.keys(params).forEach((key) => {
    encodeParam(key, params[key]);
  });

  return parts.join('&');
}

/**
 * Fetch data from Strapi API with authentication
 */
async function fetchAPI<T>(
  path: string,
  urlParamsObject: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> {
  const mergedOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    },
    // No caching - always fetch fresh data from Strapi on every request
    cache: 'no-store',
    ...options,
  };

  // Build query string using qs-style bracket notation
  const queryString = buildQueryString(urlParamsObject);

  const fullUrl = `${getStrapiURL(`/api${path}`)}${
    queryString ? `?${queryString}` : ''
  }`;

  try {
    const response = await fetch(fullUrl, mergedOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Strapi API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        error: errorData,
      });
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Failed to fetch from Strapi:', error);
    throw error;
  }
}

// ============================================================================
// Query Builder Helpers
// ============================================================================

/**
 * STRAPI POPULATION STRATEGY
 *
 * Understanding Strapi Population Depth:
 * - populate=* only goes ONE level deep (Level 1)
 * - Nested relations require explicit population (Level 2+)
 *
 * Our Data Structure:
 * 1. Navigation
 *    - link (component) → Level 1
 *      - page (relation) → Level 2 ⚠️ Must explicitly populate
 *      - file (relation) → Level 2 ⚠️ Must explicitly populate
 *
 * 2. Page
 *    - content (dynamic zone) → Level 1
 *      - components (heading, text) → Level 2 ⚠️ Use populate: '*'
 *    - sidebar (dynamic zone) → Level 1
 *      - components (heading, text) → Level 2 ⚠️ Use populate: '*'
 *    - parent (relation) → Level 1 ✓ Can use populate: true
 *
 * Population Rules:
 * - Components with nested relations: populate: { component: { populate: ['relation'] } }
 * - Dynamic zones: populate: { zone: { populate: '*' } }
 * - Simple relations: populate: 'field' or populate: true
 *
 * Always verify in Strapi response that data is populated!
 * Missing population = null data = broken links/content
 */

// ============================================================================
// Page Hierarchy Cache (Sitemap)
// ============================================================================

interface PageHierarchyEntry {
  id: number;
  slug: string;
  title: string;
  parentSlug: string | null;
  canonicalPath: string;
  breadcrumbs: Array<{ label: string; slug: string }>;
}

type PageHierarchyMap = Map<string, PageHierarchyEntry>;

// Cache configuration - 24 hour TTL with instant webhook-based invalidation
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours TTL

// Redis cache key prefixes for different data types
const CACHE_KEYS = {
  pageHierarchy: 'hierarchy:page:',
  intranetPageHierarchy: 'hierarchy:intranet:',
  pageContent: 'page:',
  intranetPageContent: 'intranet-page:',
  navigation: 'navigation:',
  intranetMenu: 'intranet-menu:',
  footer: 'footer:',
  intranetFooter: 'intranet-footer:',
  homepage: 'homepage:',
  search: 'search:',
  searchableContent: 'searchable:',
  newsArticles: 'news:',
  tags: 'tags:',
  icons: 'icons',
} as const;

/**
 * Invalidate caches based on Strapi webhook payload
 * Called when content changes in Strapi
 */
export async function invalidateCache(model: string, slug?: string, locale?: string) {
  console.log(`[Cache] Invalidating: model=${model}, slug=${slug || 'all'}, locale=${locale || 'all'}`);

  switch (model) {
    case 'page':
      if (slug && locale) {
        await cacheDeletePattern(`${CACHE_KEYS.pageContent}${locale}:${slug}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.pageContent}*`);
      }
      // Page changes affect hierarchy (breadcrumbs, URLs) and navigation (page anchors in menu links)
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.pageHierarchy}${locale}`);
        await cacheDeletePattern(`${CACHE_KEYS.searchableContent}${locale}`);
        await cacheDeletePattern(`${CACHE_KEYS.navigation}${locale}:*`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.pageHierarchy}*`);
        await cacheDeletePattern(`${CACHE_KEYS.searchableContent}*`);
        await cacheDeletePattern(`${CACHE_KEYS.navigation}*`);
      }
      break;

    case 'intranet-page':
      if (slug && locale) {
        await cacheDeletePattern(`${CACHE_KEYS.intranetPageContent}${locale}:${slug}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.intranetPageContent}*`);
      }
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.intranetPageHierarchy}${locale}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.intranetPageHierarchy}*`);
      }
      break;

    case 'navigation':
      await cacheDeletePattern(`${CACHE_KEYS.navigation}*`);
      await cacheDeletePattern(`${CACHE_KEYS.searchableContent}*`);
      break;

    case 'intranet-menu':
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.intranetMenu}${locale}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.intranetMenu}*`);
      }
      break;

    case 'icon':
      await cacheDeletePattern(CACHE_KEYS.icons);
      break;

    case 'footer':
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.footer}${locale}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.footer}*`);
      }
      break;

    case 'intranet-footer':
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.intranetFooter}${locale}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.intranetFooter}*`);
      }
      break;

    case 'homepage':
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.homepage}${locale}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.homepage}*`);
      }
      break;

    case 'search':
      if (locale) {
        await cacheDeletePattern(`${CACHE_KEYS.search}${locale}`);
      } else {
        await cacheDeletePattern(`${CACHE_KEYS.search}*`);
      }
      break;

    // Content types embedded in pages - clear page caches when they change
    case 'doctor':
    case 'ambulance':
    case 'person':
    case 'nurse':
      console.log(`[Cache] ${model} changed - clearing page content caches`);
      await cacheDeletePattern(`${CACHE_KEYS.pageContent}*`);
      await cacheDeletePattern(`${CACHE_KEYS.pageHierarchy}*`);
      break;

    case 'news-article':
      console.log(`[Cache] News article changed - clearing news and search caches`);
      await cacheDeletePattern(`${CACHE_KEYS.newsArticles}*`);
      await cacheDeletePattern(`${CACHE_KEYS.searchableContent}*`);
      await cacheDeletePattern(`${CACHE_KEYS.pageContent}*`);
      break;

    case 'intranet-news-article':
      console.log(`[Cache] Intranet news changed - clearing intranet caches`);
      await cacheDeletePattern(`${CACHE_KEYS.intranetPageContent}*`);
      break;

    case 'tag':
      console.log(`[Cache] Tag changed - clearing tags and news caches`);
      await cacheDeletePattern(`${CACHE_KEYS.tags}*`);
      await cacheDeletePattern(`${CACHE_KEYS.newsArticles}*`);
      await cacheDeletePattern(`${CACHE_KEYS.searchableContent}*`);
      break;

    default:
      // Unknown model - clear all caches to be safe
      console.log(`[Cache] Unknown model "${model}" - clearing all caches`);
      await cacheClearAll();
  }
}

/**
 * Clear all caches - useful for manual invalidation or debugging
 */
export async function clearAllCaches() {
  console.log('[Cache] Clearing ALL caches');
  await cacheClearAll();
}

/**
 * Get cache status for debugging
 */
export async function getCacheStatus() {
  const stats = await cacheStats();
  return {
    ttlSeconds: CACHE_TTL_SECONDS,
    redis: stats,
  };
}

/**
 * Fetch all pages with shallow parent info and build hierarchy map
 * This is more efficient than deep population on each page fetch
 */
async function fetchPageHierarchy(locale: string): Promise<PageHierarchyMap> {
  const response = await fetchAPI<StrapiCollectionResponse<{
    id: number;
    slug: string;
    title: string;
    parent?: { id: number; slug: string; title: string } | null;
  }>>('/pages', {
    locale,
    fields: ['id', 'slug', 'title'],
    populate: {
      parent: {
        fields: ['id', 'slug', 'title'],
      },
    },
    pagination: { pageSize: 500 },
  });

  const pages = response.data || [];
  const slugToPage = new Map<string, typeof pages[0]>();

  // First pass: index by slug
  for (const page of pages) {
    slugToPage.set(page.slug, page);
  }

  // Second pass: build hierarchy
  const hierarchy: PageHierarchyMap = new Map();

  for (const page of pages) {
    const breadcrumbs: Array<{ label: string; slug: string }> = [];
    const pathSegments: string[] = [];

    // Walk up the parent chain
    let current: typeof pages[0] | undefined = page;
    const visited = new Set<string>();

    while (current && !visited.has(current.slug)) {
      visited.add(current.slug);
      pathSegments.unshift(current.slug);
      breadcrumbs.unshift({ label: current.title, slug: current.slug });

      if (current.parent?.slug) {
        current = slugToPage.get(current.parent.slug);
      } else {
        current = undefined;
      }
    }

    hierarchy.set(page.slug, {
      id: page.id,
      slug: page.slug,
      title: page.title,
      parentSlug: page.parent?.slug || null,
      canonicalPath: pathSegments.join('/'),
      breadcrumbs,
    });
  }

  return hierarchy;
}

/**
 * Fetch all intranet pages with shallow parent info and build hierarchy map
 */
async function fetchIntranetPageHierarchy(locale: string): Promise<PageHierarchyMap> {
  const response = await fetchAPI<StrapiCollectionResponse<{
    id: number;
    slug: string;
    title: string;
    parent?: { id: number; slug: string; title: string } | null;
  }>>('/intranet-pages', {
    locale,
    fields: ['id', 'slug', 'title'],
    populate: {
      parent: {
        fields: ['id', 'slug', 'title'],
      },
    },
    pagination: { pageSize: 500 },
  });

  const pages = response.data || [];
  const slugToPage = new Map<string, typeof pages[0]>();

  for (const page of pages) {
    slugToPage.set(page.slug, page);
  }

  const hierarchy: PageHierarchyMap = new Map();

  for (const page of pages) {
    const breadcrumbs: Array<{ label: string; slug: string }> = [];
    const pathSegments: string[] = [];

    let current: typeof pages[0] | undefined = page;
    const visited = new Set<string>();

    while (current && !visited.has(current.slug)) {
      visited.add(current.slug);
      pathSegments.unshift(current.slug);
      breadcrumbs.unshift({ label: current.title, slug: current.slug });

      if (current.parent?.slug) {
        current = slugToPage.get(current.parent.slug);
      } else {
        current = undefined;
      }
    }

    hierarchy.set(page.slug, {
      id: page.id,
      slug: page.slug,
      title: page.title,
      parentSlug: page.parent?.slug || null,
      canonicalPath: pathSegments.join('/'),
      breadcrumbs,
    });
  }

  return hierarchy;
}

/**
 * Helper: Convert Map to object for Redis storage
 */
function mapToObject<T>(map: Map<string, T>): Record<string, T> {
  const obj: Record<string, T> = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Helper: Convert object back to Map from Redis storage
 */
function objectToMap<T>(obj: Record<string, T>): Map<string, T> {
  return new Map(Object.entries(obj));
}

/**
 * Get page hierarchy entry by slug (with caching)
 */
export async function getPageHierarchy(slug: string, locale: string): Promise<PageHierarchyEntry | null> {
  const cacheKey = `${CACHE_KEYS.pageHierarchy}${locale}`;
  const cached = await cacheGet<Record<string, PageHierarchyEntry>>(cacheKey);

  if (cached) {
    return cached[slug] || null;
  }

  const data = await fetchPageHierarchy(locale);
  await cacheSet(cacheKey, mapToObject(data), CACHE_TTL_SECONDS);
  return data.get(slug) || null;
}

/**
 * Get full page hierarchy map for a locale (with TTL caching)
 * Useful for resolving multiple links at once
 * Cache invalidates after 60 seconds
 */
export async function getFullPageHierarchy(locale: string): Promise<PageHierarchyMap> {
  const cacheKey = `${CACHE_KEYS.pageHierarchy}${locale}`;
  const cached = await cacheGet<Record<string, PageHierarchyEntry>>(cacheKey);

  if (cached) {
    return objectToMap(cached);
  }

  const data = await fetchPageHierarchy(locale);
  await cacheSet(cacheKey, mapToObject(data), CACHE_TTL_SECONDS);
  return data;
}

/**
 * Get intranet page hierarchy entry by slug (with TTL caching)
 */
export async function getIntranetPageHierarchy(slug: string, locale: string): Promise<PageHierarchyEntry | null> {
  const cacheKey = `${CACHE_KEYS.intranetPageHierarchy}${locale}`;
  const cached = await cacheGet<Record<string, PageHierarchyEntry>>(cacheKey);

  if (cached) {
    return cached[slug] || null;
  }

  const data = await fetchIntranetPageHierarchy(locale);
  await cacheSet(cacheKey, mapToObject(data), CACHE_TTL_SECONDS);
  return data.get(slug) || null;
}

/**
 * Get full intranet page hierarchy map for a locale (with TTL caching)
 */
export async function getFullIntranetPageHierarchy(locale: string): Promise<PageHierarchyMap> {
  const cacheKey = `${CACHE_KEYS.intranetPageHierarchy}${locale}`;
  const cached = await cacheGet<Record<string, PageHierarchyEntry>>(cacheKey);

  if (cached) {
    return objectToMap(cached);
  }

  const data = await fetchIntranetPageHierarchy(locale);
  await cacheSet(cacheKey, mapToObject(data), CACHE_TTL_SECONDS);
  return data;
}

// ============================================================================
// Icon Cache Management
// ============================================================================

/**
 * Fetch all icons from Strapi and cache them in Redis
 * This is called once per request to avoid multiple API calls
 */
async function fetchAndCacheIcons(): Promise<Map<number, Icon>> {
  // Check Redis cache first
  const cached = await cacheGet<Record<string, Icon>>(CACHE_KEYS.icons);
  if (cached) {
    // Convert back to Map<number, Icon>
    const iconMap = new Map<number, Icon>();
    for (const [key, value] of Object.entries(cached)) {
      iconMap.set(Number(key), value);
    }
    return iconMap;
  }

  try {
    const response = await fetchAPI<StrapiCollectionResponse<Icon>>('/icons', {
      populate: {
        image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
      },
      pagination: {
        pageSize: 100, // Adjust based on expected icon count
      },
    });

    const iconMap = new Map<number, Icon>();
    const iconRecord: Record<string, Icon> = {};
    for (const icon of response.data) {
      iconMap.set(icon.id, icon);
      iconRecord[String(icon.id)] = icon;
    }

    // Store in Redis
    await cacheSet(CACHE_KEYS.icons, iconRecord, CACHE_TTL_SECONDS);

    return iconMap;
  } catch (error) {
    console.error('Failed to fetch icons:', error);
    return new Map();
  }
}

/**
 * Get icon by ID from cache
 * If cache is not loaded, fetch all icons first
 */
export async function getIconById(id: number): Promise<Icon | null> {
  const cache = await fetchAndCacheIcons();
  return cache.get(id) || null;
}

/**
 * Get icon URL by ID
 * Returns the image URL or null if not found
 */
export async function getIconUrlById(id: number): Promise<string | null> {
  const icon = await getIconById(id);
  if (!icon?.image?.url) {
    return null;
  }
  return getStrapiMediaURL(icon.image.url);
}

// ============================================================================
// Link Resolution
// ============================================================================

/**
 * Resolve ElementsLink to usable href and target
 * Priority: page > url > file > anchor
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper, no .attributes)
 * @param link - The link component from Strapi
 * @param locale - Current locale for prefixing internal page links (default: 'cs')
 * @param hierarchy - Optional page hierarchy map for resolving canonical paths
 */
export function resolveLink(
  link: ElementsLink,
  locale: string = 'cs',
  hierarchy?: PageHierarchyMap
): ResolvedLink | null {
  if (!link) return null;

  // Internal page link
  // Strapi returns page relation directly (not wrapped in .data)
  if (link.page) {
    const pageSlug = link.page.slug;
    // Use canonical path from hierarchy if available, otherwise fall back to slug
    const canonicalPath = hierarchy?.get(pageSlug)?.canonicalPath || pageSlug;
    // Add locale prefix and trailing slash for consistency with Next.js trailingSlash: true
    const href = `/${locale}/${canonicalPath}/${link.anchor ? `#${link.anchor}` : ''}`;
    return { href, target: '_self' };
  }

  // External URL
  if (link.url) {
    const href = link.anchor ? `${link.url}#${link.anchor}` : link.url;
    const isExternal = link.url.startsWith('http');
    return {
      href,
      target: isExternal ? '_blank' : '_self',
    };
  }

  // File download
  // Strapi v5 returns file relation directly (no .data or .attributes wrapper)
  if (link.file) {
    return {
      href: getStrapiMediaURL(link.file.url),
      target: '_blank',
      download: true,
    };
  }

  // Anchor only
  if (link.anchor) {
    return { href: `#${link.anchor}`, target: '_self' };
  }

  return null;
}

/**
 * Resolve ElementsIntranetLink to href and target
 * Priority: intranetPage > url > file > anchor
 *
 * @param link - The intranet link element from Strapi
 * @param locale - Current locale for prefixing internal page links (default: 'cs')
 * @param hierarchy - Optional intranet page hierarchy map for canonical path resolution
 *
 * IMPORTANT: This is similar to resolveLink but uses intranetPage instead of page,
 * and automatically adds the /intranet/ prefix for intranet pages.
 */
export function resolveIntranetLink(
  link: ElementsIntranetLink,
  locale: string = 'cs',
  hierarchy?: PageHierarchyMap
): ResolvedLink | null {
  if (!link) return null;

  // Internal intranet page
  if (link.intranetPage) {
    const pageSlug = link.intranetPage.slug;
    // Use canonical path from hierarchy if available, otherwise fall back to slug
    const canonicalPath = hierarchy?.get(pageSlug)?.canonicalPath || pageSlug;
    // Add locale prefix and /intranet/ for intranet pages
    const href = `/${locale}/intranet/${canonicalPath}/${link.anchor ? `#${link.anchor}` : ''}`;
    return { href, target: '_self' };
  }

  // External URL
  if (link.url) {
    const href = link.anchor ? `${link.url}#${link.anchor}` : link.url;
    const isExternal = link.url.startsWith('http');
    return {
      href,
      target: isExternal ? '_blank' : '_self',
    };
  }

  // File download
  if (link.file) {
    return {
      href: getStrapiMediaURL(link.file.url),
      target: '_blank',
      download: true,
    };
  }

  // Anchor only
  if (link.anchor) {
    return { href: `#${link.anchor}`, target: '_self' };
  }

  return null;
}

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

// ============================================================================
// Navigation API
// ============================================================================

/**
 * Fetch navigation items
 * @param navbar - Filter for navbar items (navbar: true)
 * @param footer - Filter for footer items (footer: true)
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchNavigation(
  navbar?: boolean,
  footer?: boolean,
  locale: string = 'cs'
): Promise<NavigationItem[]> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.navigation}${locale}:navbar=${navbar}:footer=${footer}`;
  const cached = await cacheGet<NavigationItem[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Build query params
  // IMPORTANT: populate=* only goes ONE level deep
  // Since 'link' is a component with nested relations (page, file),
  // we must explicitly populate those nested relations
  const params: Record<string, any> = {
    locale,
    sort: 'sortOrder:asc',
    populate: {
      link: {
        populate: ['page', 'file'],
      },
    },
  };

  // Fetch navigation and page hierarchy in parallel
  const [response, hierarchy] = await Promise.all([
    fetchAPI<any>('/navigations', params),
    getFullPageHierarchy(locale),
  ]);

  // Filter by navbar/footer in code
  // Strapi returns data directly in array, NOT wrapped in attributes
  let filteredData = response.data;

  if (navbar !== undefined) {
    filteredData = filteredData.filter((nav: any) => nav.navbar === navbar);
  }

  if (footer !== undefined) {
    filteredData = filteredData.filter((nav: any) => nav.footer === footer);
  }

  // Transform to NavigationItem format
  const items: NavigationItem[] = [];

  for (const nav of filteredData) {
    const link = nav.link;

    // Pass hierarchy to resolve canonical paths for internal page links
    const resolvedLink = resolveLink(link, locale, hierarchy);

    // Show menu items even without a link configured (use empty href as fallback)
    items.push({
      name: nav.title,
      href: resolvedLink?.href || '',
      target: resolvedLink?.target,
    });
  }

  // Cache the result in Redis
  await cacheSet(cacheKey, items, CACHE_TTL_SECONDS);

  return items;
}

/**
 * Fetch footer data
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchFooter(locale: string = 'cs'): Promise<Footer | null> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.footer}${locale}`;
  const cached = await cacheGet<Footer>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch footer with nested population for links and insurance logos
    const response = await fetchAPI<StrapiResponse<Footer>>('/footer', {
      locale,
      populate: {
        links: {
          populate: {
            links: {
              populate: ['page', 'file'],
            },
          },
        },
        insurance_logos: {
          populate: {
            partners: {
              populate: ['logo'],
            },
          },
        },
      },
    });

    const footer = response.data;

    if (footer) {
      // Cache the result in Redis
      await cacheSet(cacheKey, footer, CACHE_TTL_SECONDS);
    }

    return footer || null;
  } catch (error) {
    console.error(`Failed to fetch footer for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Fetch intranet footer data (single type)
 * Used for intranet pages - separate from main site footer
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchIntranetFooter(locale: string = 'cs'): Promise<Footer | null> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.intranetFooter}${locale}`;
  const cached = await cacheGet<Footer>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch intranet footer with nested population for links and insurance logos
    const response = await fetchAPI<StrapiResponse<Footer>>('/intranet-footer', {
      locale,
      populate: {
        links: {
          populate: {
            links: {
              populate: ['page', 'file'],
            },
          },
        },
        insurance_logos: {
          populate: {
            partners: {
              populate: ['logo'],
            },
          },
        },
      },
    });

    const footer = response.data;

    if (footer) {
      // Cache the result in Redis
      await cacheSet(cacheKey, footer, CACHE_TTL_SECONDS);
    }

    return footer || null;
  } catch (error) {
    // 404 is expected when intranet-footer collection doesn't exist - silently return null
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    // Log other unexpected errors
    console.error(`Failed to fetch intranet footer for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Fetch homepage data (single type with page relation)
 * Returns only the page slug - use fetchPageBySlug for full page content
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchHomepage(locale: string = 'cs'): Promise<Homepage | null> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.homepage}${locale}`;
  const cached = await cacheGet<Homepage>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch homepage with minimal population - only page slug
    const response = await fetchAPI<StrapiResponse<Homepage>>('/homepage', {
      locale,
      populate: {
        page: {
          fields: ['slug'],
        },
      },
    });

    const homepage = response.data;

    if (homepage) {
      // Cache the result in Redis
      await cacheSet(cacheKey, homepage, CACHE_TTL_SECONDS);
    }

    return homepage || null;
  } catch (error) {
    console.error(`Failed to fetch homepage for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Fetch search configuration (single type with quick links)
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchSearch(locale: string = 'cs'): Promise<Search | null> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.search}${locale}`;
  const cached = await cacheGet<Search>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Fetch search with nested population for quick links
    const response = await fetchAPI<StrapiResponse<Search>>('/search', {
      locale,
      populate: {
        quick_links: {
          populate: {
            page: true,
            file: true,
          },
        },
      },
    });

    const search = response.data;

    if (search) {
      // Cache the result in Redis
      await cacheSet(cacheKey, search, CACHE_TTL_SECONDS);
    }

    return search || null;
  } catch (error) {
    console.error(`Failed to fetch search for locale ${locale}:`, error);
    return null;
  }
}

// ============================================================================
// Page API
// ============================================================================

/**
 * Fetch single page by slug with full content population
 * @param slug - Page slug (e.g., "o-nas" or "sluzby/kardiologie")
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchPageBySlug(
  slug: string,
  locale: string = 'cs'
): Promise<Page | null> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.pageContent}${locale}:${slug}`;
  const cached = await cacheGet<Page>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // IMPORTANT: Dynamic zones are polymorphic structures
    // We use the 'on' syntax to target specific components within dynamic zones
    // This allows us to deeply populate relations within each component type
    const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
      locale,
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        header: {
          populate: {
            slider: {
              populate: {
                slides: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                    image: true,
                    background_image: true,
                  },
                },
              },
            },
            service_cards: {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
          },
        },
        content: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
            'components.popup': {
              populate: {
                link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.video': { populate: '*' },
            'components.links-list': {
              populate: {
                links: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.service-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.full-width-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.documents': {
              populate: {
                documents: {
                  populate: {
                    file: {
                      fields: ['url', 'name', 'caption', 'ext', 'size'],
                    },
                  },
                },
              },
            },
            'components.job-posting': {
              populate: {
                cta_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.partner-logos': {
              populate: {
                partners: {
                  populate: ['logo'],
                },
              },
            },
            'components.marketing-arguments': {
              populate: {
                arguments: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.timeline': {
              populate: {
                items: {
                  populate: {
                    icon: {
                      populate: {
                        image: {
                          fields: ['url', 'alternativeText'],
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.section-divider': { populate: '*' },
            'components.slider': {
              populate: {
                slides: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                    image: true,
                    background_image: true,
                  },
                },
              },
            },
            'components.gallery-slider': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.photo-gallery': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.directions': {
              populate: {
                instructions: {
                  populate: {
                    icon: {
                      populate: ['image'],
                    },
                  },
                },
              },
            },
            'components.accordion-sections': {
              populate: {
                sections: {
                  populate: {
                    files: {
                      populate: ['file'],
                    },
                    contacts: {
                      populate: {
                        cards: {
                          populate: {
                            person: {
                              populate: {
                                person: {
                                  populate: {
                                    photo: {
                                      fields: ['url', 'alternativeText', 'width', 'height'],
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    photos: {
                      populate: {
                        image: {
                          fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.button-group': {
              populate: {
                buttons: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.contact-cards': {
              populate: {
                cards: {
                  populate: {
                    person: {
                      populate: {
                        person: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.ambulances': {
              populate: {
                items: {
                  populate: {
                    ambulance: {
                      populate: {
                        doctors: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        nurses: {
                          populate: {
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        opening_hours: {
                          populate: {
                            hours: {
                              populate: '*',
                            },
                          },
                        },
                        nurses_phones: {
                          populate: '*',
                        },
                      },
                    },
                    documents: {
                      populate: {
                        file: {
                          fields: ['url', 'name', 'ext'],
                        },
                      },
                    },
                    button: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.news-articles': {
              populate: {
                tags: true,
                show_all_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.location-cards': {
              populate: {
                cards: {
                  populate: {
                    photo: {
                      fields: ['url', 'alternativeText', 'width', 'height'],
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                    opening_hours: true,
                  },
                },
              },
            },
            'components.badges': { populate: '*' },
            'components.tarify': {
              populate: {
                tarify: {
                  populate: {
                    items: true,
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.image': {
              populate: {
                image: {
                  fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                },
              },
            },
          },
        },
        sidebar: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
            'components.badges': { populate: '*' },
            'components.image': {
              populate: {
                image: {
                  fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                },
              },
            },
            'components.links-list': {
              populate: {
                links: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.service-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.full-width-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.button-group': {
              populate: {
                buttons: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.contact-cards': {
              populate: {
                cards: {
                  populate: {
                    person: {
                      populate: {
                        person: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.documents': {
              populate: {
                documents: {
                  populate: {
                    file: {
                      fields: ['url', 'name', 'caption', 'ext', 'size'],
                    },
                  },
                },
              },
            },
            'components.ambulances': {
              populate: {
                items: {
                  populate: {
                    ambulance: {
                      populate: {
                        doctors: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        nurses: {
                          populate: {
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        opening_hours: {
                          populate: {
                            hours: {
                              populate: '*',
                            },
                          },
                        },
                        nurses_phones: {
                          populate: '*',
                        },
                      },
                    },
                    documents: {
                      populate: {
                        file: {
                          fields: ['url', 'name', 'ext'],
                        },
                      },
                    },
                    button: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.section-divider': { populate: '*' },
            'components.timeline': {
              populate: {
                items: {
                  populate: {
                    icon: {
                      populate: {
                        image: {
                          fields: ['url', 'alternativeText'],
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.slider': {
              populate: {
                slides: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                    image: true,
                    background_image: true,
                  },
                },
              },
            },
            'components.gallery-slider': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.photo-gallery': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.news-articles': {
              populate: {
                tags: true,
                show_all_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.job-posting': {
              populate: {
                cta_link: {
                  populate: ['page', 'file'],
                },
              },
            },
          },
        },
        parent: true, // Shallow parent for basic info (hierarchy built via getPageHierarchy)
        localizations: {
          fields: ['locale', 'slug'], // Fetch alternate locale versions for language switcher
        },
      },
    });

    // With slug filter, we expect at most one result
    if (!response.data || response.data.length === 0) {
      return null;
    }

    const page = response.data[0];

    // Cache the result in Redis
    await cacheSet(cacheKey, page, CACHE_TTL_SECONDS);

    return page;
  } catch (error) {
    console.error(`Failed to fetch page: ${slug}`, error);
    // Re-throw to distinguish between "page not found" (null) and "fetch error" (throws)
    // This allows page.tsx to show error page instead of 404 for connection issues
    throw error;
  }
}

/**
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchAllPageSlugs(
  locale: string = 'cs'
): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
      locale,
      fields: ['slug'],
      pagination: {
        pageSize: 100, // Adjust based on expected page count
      },
    });

    // Strapi returns data directly, not wrapped in attributes
    return response.data.map((page) => page.slug);
  } catch (error) {
    console.error('Failed to fetch page slugs', error);
    return [];
  }
}

/**
 * Fetch all pages with full content
 * Useful for build-time static generation
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchAllPages(locale: string = 'cs'): Promise<Page[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
      locale,
      populate: {
        content: {
          populate: '*', // Populate all fields in content dynamic zone components
        },
        sidebar: {
          populate: '*', // Populate all fields in sidebar dynamic zone components
        },
        parent: true, // Populate parent relation
      },
      pagination: {
        pageSize: 100,
      },
    });

    // Strapi returns data directly, not wrapped in attributes
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all pages', error);
    return [];
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

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

/**
 * Check if sidebar should be displayed
 * @param sidebar - Sidebar components array from page
 */
export function hasSidebar(sidebar?: any[]): boolean {
  return !!sidebar && sidebar.length > 0;
}

// ============================================================================
// News Articles API
// ============================================================================

/**
 * Fetch news articles with optional filtering and pagination
 * @param locale - Language code (default: 'cs')
 * @param tags - Optional array of tag IDs or slugs for filtering (OR logic)
 * @param limit - Number of articles to fetch (optional, no limit if not provided)
 * @param sort - Sort order (default: 'date:desc')
 */
export async function fetchNewsArticles(
  locale: string = 'cs',
  tags?: string[],
  limit?: number,
  sort: string = 'date:desc'
): Promise<NewsArticle[]> {
  // Build cache key from all parameters
  const tagKey = tags?.slice().sort().join(',') || '';
  const cacheKey = `${CACHE_KEYS.newsArticles}${locale}:${tagKey}:${limit || 'all'}:${sort}`;

  // Check Redis cache first
  const cached = await cacheGet<NewsArticle[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const filters: Record<string, any> = {};

    // Add tag filtering if tags are provided
    if (tags && tags.length > 0) {
      filters.tags = {
        slug: {
          $in: tags, // OR logic: article has ANY of the selected tags
        },
      };
    }

    const params: Record<string, any> = {
      locale,
      sort: [sort],
      populate: {
        image: true,
        tags: true,
      },
    };

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    if (limit) {
      params.pagination = {
        limit,
      };
    }

    const response = await fetchAPI<StrapiCollectionResponse<NewsArticle>>(
      '/news-articles',
      params
    );

    const articles = response.data || [];

    // Cache the result in Redis
    await cacheSet(cacheKey, articles, CACHE_TTL_SECONDS);

    return articles;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
}

/**
 * Fetch single news article by slug with full population (for detail page)
 * @param slug - Article slug
 * @param locale - Language code (default: 'cs')
 */
export async function fetchNewsArticleBySlug(
  slug: string,
  locale: string = 'cs'
): Promise<NewsArticle | null> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<NewsArticle>>(
      '/news-articles',
      {
        locale,
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: {
          image: true,
          tags: true,
          video: true,
          gallery: {
            populate: {
              photos: {
                populate: ['image'],
              },
            },
          },
          documents: {
            populate: {
              documents: {
                populate: ['file'],
              },
            },
          },
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return null;
    }

    return response.data[0];
  } catch (error) {
    console.error(`Error fetching news article with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all news article slugs for static path generation
 * @param locale - Language code (default: 'cs')
 */
export async function fetchAllNewsArticleSlugs(
  locale: string = 'cs'
): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<NewsArticle>>(
      '/news-articles',
      {
        locale,
        fields: ['slug'], // Only fetch slugs for performance
      }
    );

    return response.data?.map((article) => article.slug) || [];
  } catch (error) {
    console.error('Error fetching news article slugs:', error);
    return [];
  }
}

/**
 * Fetch all tags
 * @param locale - Language code (default: 'cs')
 */
export async function fetchTags(locale: string = 'cs'): Promise<Tag[]> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.tags}${locale}`;
  const cached = await cacheGet<Tag[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetchAPI<StrapiCollectionResponse<Tag>>('/tags', {
      locale,
      sort: ['name:asc'],
      pagination: {
        pageSize: 100,
      },
    });

    const tags = response.data || [];

    // Cache the result in Redis
    await cacheSet(cacheKey, tags, CACHE_TTL_SECONDS);

    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// ============================================================================
// Intranet Menu API
// ============================================================================

/**
 * Fetch intranet menu items
 * Falls back to fetching all locales if no items found for requested locale
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchIntranetMenu(
  locale: string = 'cs'
): Promise<NavigationItem[]> {
  // Check Redis cache first
  // Only use cache if it contains items - don't cache empty results
  const cacheKey = `${CACHE_KEYS.intranetMenu}${locale}`;
  const cached = await cacheGet<NavigationItem[]>(cacheKey);
  if (cached && cached.length > 0) {
    return cached;
  }

  try {
    // Fetch menu and intranet page hierarchy in parallel
    const [response, hierarchy] = await Promise.all([
      fetchAPI<StrapiCollectionResponse<any>>('/intranet-menus', {
        locale,
        sort: 'sortOrder:asc',
        populate: {
          link: {
            populate: ['intranetPage', 'file'],
          },
        },
      }),
      getFullIntranetPageHierarchy(locale),
    ]);

    const menuData = response.data || [];
    const items: NavigationItem[] = [];

    for (const item of menuData) {
      const link = item.link;
      // Use resolveIntranetLink which handles intranet page references directly
      const resolvedLink = resolveIntranetLink(link, locale, hierarchy);

      // Show menu items even without a link configured (use # as fallback)
      items.push({
        name: item.title,
        href: resolvedLink?.href || '#',
        target: resolvedLink?.target || '_self',
      });
    }

    // Only cache non-empty results to avoid persisting missing data
    if (items.length > 0) {
      await cacheSet(cacheKey, items, CACHE_TTL_SECONDS);
    }

    return items;
  } catch (error) {
    console.error('Error fetching intranet menu:', error);
    return [];
  }
}

// ============================================================================
// Intranet Page API
// ============================================================================

/**
 * Fetch single intranet page by slug with full content population
 * @param slug - Page slug (e.g., "dokumenty" or "novinky/detail")
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchIntranetPageBySlug(
  slug: string,
  locale: string = 'cs'
): Promise<IntranetPage | null> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.intranetPageContent}${locale}:${slug}`;
  const cached = await cacheGet<IntranetPage>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // IMPORTANT: Dynamic zones are polymorphic structures
    // We use the 'on' syntax to target specific components within dynamic zones
    const response = await fetchAPI<StrapiCollectionResponse<IntranetPage>>('/intranet-pages', {
      locale,
      populate: {
        content: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
            'components.popup': {
              populate: {
                link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.video': { populate: '*' },
            'components.links-list': {
              populate: {
                links: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.service-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.full-width-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.documents': {
              populate: {
                documents: {
                  populate: {
                    file: {
                      fields: ['url', 'name', 'caption', 'ext', 'size'],
                    },
                  },
                },
              },
            },
            'components.job-posting': {
              populate: {
                cta_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.partner-logos': {
              populate: {
                partners: {
                  populate: ['logo'],
                },
              },
            },
            'components.marketing-arguments': {
              populate: {
                arguments: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.timeline': {
              populate: {
                items: {
                  populate: {
                    icon: {
                      populate: {
                        image: {
                          fields: ['url', 'alternativeText'],
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.section-divider': { populate: '*' },
            'components.slider': {
              populate: {
                slides: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                    image: true,
                    background_image: true,
                  },
                },
              },
            },
            'components.gallery-slider': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.photo-gallery': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.directions': {
              populate: {
                instructions: {
                  populate: {
                    icon: {
                      populate: ['image'],
                    },
                  },
                },
              },
            },
            'components.accordion-sections': {
              populate: {
                sections: {
                  populate: {
                    files: {
                      populate: ['file'],
                    },
                    contacts: {
                      populate: {
                        cards: {
                          populate: {
                            person: {
                              populate: {
                                person: {
                                  populate: {
                                    photo: {
                                      fields: ['url', 'alternativeText', 'width', 'height'],
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    photos: {
                      populate: {
                        image: {
                          fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.button-group': {
              populate: {
                buttons: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.contact-cards': {
              populate: {
                cards: {
                  populate: {
                    person: {
                      populate: {
                        person: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.news-articles': {
              populate: {
                tags: true,
                show_all_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.intranet-news-articles': {
              populate: {
                tags: true,
                show_all_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.ambulances': {
              populate: {
                items: {
                  populate: {
                    ambulance: {
                      populate: {
                        doctors: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        nurses: {
                          populate: {
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        opening_hours: {
                          populate: {
                            hours: {
                              populate: '*',
                            },
                          },
                        },
                        nurses_phones: {
                          populate: '*',
                        },
                      },
                    },
                    documents: {
                      populate: {
                        file: {
                          fields: ['url', 'name', 'ext'],
                        },
                      },
                    },
                    button: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.location-cards': {
              populate: {
                cards: {
                  populate: {
                    photo: {
                      fields: ['url', 'alternativeText', 'width', 'height'],
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                    opening_hours: true,
                  },
                },
              },
            },
            'components.badges': { populate: '*' },
            'components.tarify': {
              populate: {
                tarify: {
                  populate: {
                    items: true,
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.image': {
              populate: {
                image: {
                  fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                },
              },
            },
          },
        },
        sidebar: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
            'components.badges': { populate: '*' },
            'components.image': {
              populate: {
                image: {
                  fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                },
              },
            },
            'components.links-list': {
              populate: {
                links: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.button-group': {
              populate: {
                buttons: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.contact-cards': {
              populate: {
                cards: {
                  populate: {
                    person: {
                      populate: {
                        person: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.documents': {
              populate: {
                documents: {
                  populate: {
                    file: {
                      fields: ['url', 'name', 'caption', 'ext', 'size'],
                    },
                  },
                },
              },
            },
            'components.ambulances': {
              populate: {
                items: {
                  populate: {
                    ambulance: {
                      populate: {
                        doctors: {
                          populate: {
                            photo: {
                              fields: ['url', 'alternativeText', 'width', 'height'],
                            },
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        nurses: {
                          populate: {
                            holidays: {
                              fields: ['from', 'to'],
                            },
                          },
                        },
                        opening_hours: {
                          populate: {
                            hours: {
                              populate: '*',
                            },
                          },
                        },
                        nurses_phones: {
                          populate: '*',
                        },
                      },
                    },
                    documents: {
                      populate: {
                        file: {
                          fields: ['url', 'name', 'ext'],
                        },
                      },
                    },
                    button: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.section-divider': { populate: '*' },
            'components.service-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                                            populate: {
                        icon: {
                          fields: ['name'],
                          populate: {
                            image: {
                              fields: ['url', 'alternativeText'],
                            },
                          },
                        },
                      },
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.timeline': {
              populate: {
                items: {
                  populate: {
                    icon: {
                      populate: {
                        image: {
                          fields: ['url', 'alternativeText'],
                        },
                      },
                    },
                  },
                },
              },
            },
            'components.slider': {
              populate: {
                slides: {
                  populate: {
                    link: {
                      populate: ['page', 'file'],
                    },
                    image: true,
                    background_image: true,
                  },
                },
              },
            },
            'components.gallery-slider': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.photo-gallery': {
              populate: {
                photos: {
                  populate: {
                    image: {
                      fields: ['url', 'alternativeText', 'caption', 'width', 'height'],
                    },
                  },
                },
              },
            },
            'components.news-articles': {
              populate: {
                tags: true,
                show_all_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.intranet-news-articles': {
              populate: {
                tags: true,
                show_all_link: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.job-posting': {
              populate: {
                cta_link: {
                  populate: ['page', 'file'],
                },
              },
            },
          },
        },
        parent: true, // Shallow parent for basic info (hierarchy built via getIntranetPageHierarchy)
        localizations: {
          fields: ['locale', 'slug'],
        },
      },
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    const page = response.data.find(p => p.slug === slug);

    if (page) {
      // Cache the result in Redis
      await cacheSet(cacheKey, page, CACHE_TTL_SECONDS);
    }

    return page || null;
  } catch (error) {
    console.error(`Failed to fetch intranet page: ${slug}`, error);
    return null;
  }
}

/**
 * Fetch all intranet page slugs for static path generation
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchAllIntranetPageSlugs(
  locale: string = 'cs'
): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<IntranetPage>>(
      '/intranet-pages',
      {
        locale,
        fields: ['slug'],
      }
    );

    return response.data?.map((page) => page.slug) || [];
  } catch (error) {
    console.error('Error fetching intranet page slugs:', error);
    return [];
  }
}

// ============================================================================
// Intranet News Article API
// ============================================================================

/**
 * Fetch intranet news articles with optional tag filtering
 * @param locale - Language code (default: 'cs')
 * @param tags - Optional array of tag slugs to filter by (OR logic)
 * @param limit - Optional limit on number of articles
 * @param sort - Sort order (default: 'date:desc')
 */
export async function fetchIntranetNewsArticles(
  locale: string = 'cs',
  tags?: string[],
  limit?: number,
  sort: string = 'date:desc'
): Promise<IntranetNewsArticle[]> {
  try {
    const filters: Record<string, any> = {};

    if (tags && tags.length > 0) {
      filters.tags = {
        slug: {
          $in: tags,
        },
      };
    }

    const params: Record<string, any> = {
      locale,
      sort: [sort],
      populate: {
        image: true,
        tags: true,
      },
    };

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    if (limit) {
      params.pagination = {
        limit,
      };
    }

    const response = await fetchAPI<StrapiCollectionResponse<IntranetNewsArticle>>(
      '/intranet-news-articles',
      params
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching intranet news articles:', error);
    return [];
  }
}

/**
 * Fetch single intranet news article by slug with full population (for detail page)
 * @param slug - Article slug
 * @param locale - Language code (default: 'cs')
 */
export async function fetchIntranetNewsArticleBySlug(
  slug: string,
  locale: string = 'cs'
): Promise<IntranetNewsArticle | null> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<IntranetNewsArticle>>(
      '/intranet-news-articles',
      {
        locale,
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: {
          image: true,
          tags: true,
          video: true,
          gallery: {
            populate: {
              photos: {
                populate: ['image'],
              },
            },
          },
          documents: {
            populate: {
              documents: {
                populate: ['file'],
              },
            },
          },
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return null;
    }

    return response.data[0];
  } catch (error) {
    console.error(`Error fetching intranet news article with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all intranet news article slugs for static path generation
 * @param locale - Language code (default: 'cs')
 */
export async function fetchAllIntranetNewsArticleSlugs(
  locale: string = 'cs'
): Promise<string[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<IntranetNewsArticle>>(
      '/intranet-news-articles',
      {
        locale,
        fields: ['slug'],
      }
    );

    return response.data?.map((article) => article.slug) || [];
  } catch (error) {
    console.error('Error fetching intranet news article slugs:', error);
    return [];
  }
}

// ============================================================================
// Registration API (Intranet only)
// ============================================================================

import { Registration } from '@/types/strapi';

/**
 * Fetch all patient registrations for intranet display
 * @param sort - Sort order (default: 'submittedAt:desc')
 * @param limit - Number of registrations to fetch (default: 100)
 * @returns Array of Registration objects
 */
export async function fetchRegistrations(
  sort: string = 'submittedAt:desc',
  limit: number = 100
): Promise<Registration[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Registration>>(
      '/registrations',
      {
        sort,
        'pagination[pageSize]': limit.toString(),
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

// ============================================================================
// Client-Side Search API
// ============================================================================

import { buildSearchableText } from '@/lib/search';

/**
 * Fetch all searchable content for client-side search
 *
 * This function is designed to be called from client components.
 * It fetches pages, news articles, and navigation items with only the
 * fields needed for search, then pre-normalizes text for fast filtering.
 *
 * @param locale - Current locale (default: 'cs')
 * @returns Array of SearchableItem with pre-normalized text
 */
export async function fetchSearchableContent(
  locale: string = 'cs'
): Promise<SearchableItem[]> {
  // Check Redis cache first
  const cacheKey = `${CACHE_KEYS.searchableContent}${locale}`;
  const cached = await cacheGet<SearchableItem[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Use server-side URL and token (NOT exposed to browser)
  const baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
  const token = process.env.STRAPI_API_TOKEN || '';

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Fetch pages, news, and navigation in parallel
  const [pages, news, navigation] = await Promise.all([
    fetchPagesForSearch(baseUrl, locale, headers),
    fetchNewsForSearch(baseUrl, locale, headers),
    fetchNavigationForSearch(baseUrl, locale, headers),
  ]);

  const result = [...pages, ...news, ...navigation];

  // Cache the result in Redis
  await cacheSet(cacheKey, result, CACHE_TTL_SECONDS);

  return result;
}

/**
 * Fetch pages with only fields needed for search
 */
async function fetchPagesForSearch(
  baseUrl: string,
  locale: string,
  headers: HeadersInit
): Promise<SearchableItem[]> {
  try {
    const params = new URLSearchParams({
      locale,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'meta_description',
      'pagination[pageSize]': '100',
    });

    const response = await fetch(`${baseUrl}/api/pages?${params}`, { headers });

    if (!response.ok) {
      console.error('Error fetching pages for search:', response.status);
      return [];
    }

    const data = await response.json();

    return (data.data || []).map((page: any) => ({
      id: page.id,
      type: 'page' as const,
      title: page.title,
      slug: page.slug,
      url: `/${locale}/${page.slug}/`,
      description: page.meta_description || undefined,
      normalizedText: buildSearchableText(page.title, page.meta_description),
    }));
  } catch (error) {
    console.error('Error fetching pages for search:', error);
    return [];
  }
}

/**
 * Fetch news articles with only fields needed for search
 */
async function fetchNewsForSearch(
  baseUrl: string,
  locale: string,
  headers: HeadersInit
): Promise<SearchableItem[]> {
  try {
    const params = new URLSearchParams({
      locale,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'populate[tags][fields][0]': 'name',
      'pagination[pageSize]': '100',
    });

    const response = await fetch(`${baseUrl}/api/news-articles?${params}`, { headers });

    if (!response.ok) {
      console.error('Error fetching news for search:', response.status);
      return [];
    }

    const data = await response.json();

    return (data.data || []).map((article: any) => {
      const tagNames = (article.tags || []).map((t: any) => t.name);
      return {
        id: article.id,
        type: 'news' as const,
        title: article.title,
        slug: article.slug,
        url: `/${locale}/aktuality/${article.slug}/`,
        tags: tagNames.length > 0 ? tagNames : undefined,
        normalizedText: buildSearchableText(article.title, ...tagNames),
      };
    });
  } catch (error) {
    console.error('Error fetching news for search:', error);
    return [];
  }
}

/**
 * Fetch navigation items with only fields needed for search
 */
async function fetchNavigationForSearch(
  baseUrl: string,
  locale: string,
  headers: HeadersInit
): Promise<SearchableItem[]> {
  try {
    const params = new URLSearchParams({
      locale,
      'fields[0]': 'title',
      'filters[navbar]': 'true',
      'populate[link][populate][0]': 'page',
    });

    const response = await fetch(`${baseUrl}/api/navigations?${params}`, { headers });

    if (!response.ok) {
      console.error('Error fetching navigation for search:', response.status);
      return [];
    }

    const data = await response.json();

    return (data.data || []).map((nav: any) => {
      const pageSlug = nav.link?.page?.slug || '';
      return {
        id: nav.id,
        type: 'navigation' as const,
        title: nav.title,
        slug: pageSlug,
        url: pageSlug ? `/${locale}/${pageSlug}/` : '#',
        normalizedText: buildSearchableText(nav.title),
      };
    });
  } catch (error) {
    console.error('Error fetching navigation for search:', error);
    return [];
  }
}
