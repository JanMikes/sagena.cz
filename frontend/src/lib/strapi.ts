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
  ElementsTextLink,
  ResolvedLink,
  Icon,
  NewsArticle,
  IntranetNewsArticle,
  IntranetPage,
  Tag,
  Footer,
  Homepage,
} from '@/types/strapi';

// ============================================================================
// In-Memory Icon Cache (per-request for SSG)
// ============================================================================

let iconsCache: Map<number, Icon> | null = null;

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

// Cache configuration
const HIERARCHY_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory cache for page hierarchy - keyed by locale, with TTL
const pageHierarchyCache: Map<string, CacheEntry<PageHierarchyMap>> = new Map();
const intranetPageHierarchyCache: Map<string, CacheEntry<PageHierarchyMap>> = new Map();

// Page content cache - keyed by "locale:slug"
const pageContentCache: Map<string, CacheEntry<Page>> = new Map();
const intranetPageContentCache: Map<string, CacheEntry<IntranetPage>> = new Map();

// Navigation cache - keyed by locale
const navigationCache: Map<string, CacheEntry<Navigation>> = new Map();
const intranetMenuCache: Map<string, CacheEntry<Navigation>> = new Map();

// Footer cache - keyed by locale
const footerCache: Map<string, CacheEntry<Footer>> = new Map();

// Homepage cache - keyed by locale
const homepageCache: Map<string, CacheEntry<Homepage>> = new Map();

function isCacheValid<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.timestamp < HIERARCHY_CACHE_TTL_MS;
}

/**
 * Invalidate caches based on Strapi webhook payload
 * Called when content changes in Strapi
 */
export function invalidateCache(model: string, slug?: string, locale?: string) {
  console.log(`[Cache] Invalidating: model=${model}, slug=${slug || 'all'}, locale=${locale || 'all'}`);

  switch (model) {
    case 'page':
      if (slug && locale) {
        pageContentCache.delete(`${locale}:${slug}`);
      } else {
        pageContentCache.clear();
      }
      // Page changes affect hierarchy (breadcrumbs, URLs)
      if (locale) {
        pageHierarchyCache.delete(locale);
      } else {
        pageHierarchyCache.clear();
      }
      break;

    case 'intranet-page':
      if (slug && locale) {
        intranetPageContentCache.delete(`${locale}:${slug}`);
      } else {
        intranetPageContentCache.clear();
      }
      if (locale) {
        intranetPageHierarchyCache.delete(locale);
      } else {
        intranetPageHierarchyCache.clear();
      }
      break;

    case 'navigation':
      // Always clear all navigation cache entries since they use complex keys
      // like "${locale}:navbar=${navbar}:footer=${footer}"
      navigationCache.clear();
      break;

    case 'intranet-menu':
      if (locale) {
        intranetMenuCache.delete(locale);
      } else {
        intranetMenuCache.clear();
      }
      break;

    case 'icon':
      iconsCache = null;
      break;

    case 'footer':
      if (locale) {
        footerCache.delete(locale);
      } else {
        footerCache.clear();
      }
      break;

    case 'homepage':
      if (locale) {
        homepageCache.delete(locale);
      } else {
        homepageCache.clear();
      }
      break;

    default:
      // Unknown model - clear all caches to be safe
      console.log(`[Cache] Unknown model "${model}" - clearing all caches`);
      pageContentCache.clear();
      intranetPageContentCache.clear();
      navigationCache.clear();
      intranetMenuCache.clear();
      pageHierarchyCache.clear();
      intranetPageHierarchyCache.clear();
      footerCache.clear();
      homepageCache.clear();
      iconsCache = null;
  }
}

/**
 * Clear all caches - useful for manual invalidation or debugging
 */
export function clearAllCaches() {
  console.log('[Cache] Clearing ALL caches');
  pageContentCache.clear();
  intranetPageContentCache.clear();
  navigationCache.clear();
  intranetMenuCache.clear();
  pageHierarchyCache.clear();
  intranetPageHierarchyCache.clear();
  footerCache.clear();
  homepageCache.clear();
  iconsCache = null;
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus() {
  const now = Date.now();
  const ttl = HIERARCHY_CACHE_TTL_MS;

  const getCacheInfo = <T>(cache: Map<string, CacheEntry<T>>) => {
    const entries: Record<string, { age: number; valid: boolean }> = {};
    cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      entries[key] = {
        age: Math.round(age / 1000),
        valid: age < ttl,
      };
    });
    return { size: cache.size, entries };
  };

  return {
    ttlSeconds: ttl / 1000,
    caches: {
      pageContent: getCacheInfo(pageContentCache),
      intranetPageContent: getCacheInfo(intranetPageContentCache),
      navigation: getCacheInfo(navigationCache),
      intranetMenu: getCacheInfo(intranetMenuCache),
      pageHierarchy: getCacheInfo(pageHierarchyCache),
      intranetPageHierarchy: getCacheInfo(intranetPageHierarchyCache),
      footer: getCacheInfo(footerCache),
      homepage: getCacheInfo(homepageCache),
      icons: { hasData: iconsCache !== null },
    },
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
 * Get page hierarchy entry by slug (with caching)
 */
export async function getPageHierarchy(slug: string, locale: string): Promise<PageHierarchyEntry | null> {
  const cached = pageHierarchyCache.get(locale);
  if (!isCacheValid(cached)) {
    const data = await fetchPageHierarchy(locale);
    pageHierarchyCache.set(locale, { data, timestamp: Date.now() });
    return data.get(slug) || null;
  }
  return cached.data.get(slug) || null;
}

/**
 * Get full page hierarchy map for a locale (with TTL caching)
 * Useful for resolving multiple links at once
 * Cache invalidates after 60 seconds
 */
export async function getFullPageHierarchy(locale: string): Promise<PageHierarchyMap> {
  const cached = pageHierarchyCache.get(locale);
  if (!isCacheValid(cached)) {
    const data = await fetchPageHierarchy(locale);
    pageHierarchyCache.set(locale, { data, timestamp: Date.now() });
    return data;
  }
  return cached.data;
}

/**
 * Get intranet page hierarchy entry by slug (with TTL caching)
 */
export async function getIntranetPageHierarchy(slug: string, locale: string): Promise<PageHierarchyEntry | null> {
  const cached = intranetPageHierarchyCache.get(locale);
  if (!isCacheValid(cached)) {
    const data = await fetchIntranetPageHierarchy(locale);
    intranetPageHierarchyCache.set(locale, { data, timestamp: Date.now() });
    return data.get(slug) || null;
  }
  return cached.data.get(slug) || null;
}

/**
 * Get full intranet page hierarchy map for a locale (with TTL caching)
 * Cache invalidates after 60 seconds
 */
export async function getFullIntranetPageHierarchy(locale: string): Promise<PageHierarchyMap> {
  const cached = intranetPageHierarchyCache.get(locale);
  if (!isCacheValid(cached)) {
    const data = await fetchIntranetPageHierarchy(locale);
    intranetPageHierarchyCache.set(locale, { data, timestamp: Date.now() });
    return data;
  }
  return cached.data;
}

// ============================================================================
// Icon Cache Management
// ============================================================================

/**
 * Fetch all icons from Strapi and cache them in memory
 * This is called once per request to avoid multiple API calls
 */
async function fetchAndCacheIcons(): Promise<Map<number, Icon>> {
  if (iconsCache) {
    return iconsCache;
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

    iconsCache = new Map();
    for (const icon of response.data) {
      iconsCache.set(icon.id, icon);
    }

    return iconsCache;
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
      href: getStrapiURL(link.file.url),
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
      url: link.file.url,
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
  // Check cache first
  const cacheKey = `${locale}:navbar=${navbar}:footer=${footer}`;
  const cached = navigationCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached.data as unknown as NavigationItem[];
  }

  // Build query params
  // IMPORTANT: populate=* only goes ONE level deep
  // Since 'link' is a component with nested relations (page, file),
  // we must explicitly populate those nested relations
  const params: Record<string, any> = {
    locale,
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

    if (resolvedLink) {
      items.push({
        name: nav.title,
        href: resolvedLink.href,
        target: resolvedLink.target,
      });
    }
  }

  // Cache the result
  navigationCache.set(cacheKey, { data: items as unknown as Navigation, timestamp: Date.now() });

  return items;
}

/**
 * Fetch footer data
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchFooter(locale: string = 'cs'): Promise<Footer | null> {
  // Check cache first
  const cached = footerCache.get(locale);
  if (isCacheValid(cached)) {
    return cached.data;
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
      // Cache the result
      footerCache.set(locale, { data: footer, timestamp: Date.now() });
    }

    return footer || null;
  } catch (error) {
    console.error(`Failed to fetch footer for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Fetch homepage data (single type with page relation)
 * Returns only the page slug - use fetchPageBySlug for full page content
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchHomepage(locale: string = 'cs'): Promise<Homepage | null> {
  // Check cache first
  const cached = homepageCache.get(locale);
  if (isCacheValid(cached)) {
    return cached.data;
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
      // Cache the result
      homepageCache.set(locale, { data: homepage, timestamp: Date.now() });
    }

    return homepage || null;
  } catch (error) {
    console.error(`Failed to fetch homepage for locale ${locale}:`, error);
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
  // Check cache first
  const cacheKey = `${locale}:${slug}`;
  const cached = pageContentCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached.data;
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
        content: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
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
                      fields: ['id'],
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
                      fields: ['id'],
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
                      fields: ['url', 'name', 'ext', 'size'],
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
                      fields: ['id'],
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
            'components.doctor-profile': {
              populate: {
                profile: {
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
                    openingHours: {
                      populate: '*',
                    },
                    holiday: {
                      populate: '*',
                    },
                    positions: {
                      populate: '*',
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
          },
        },
        sidebar: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
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
                      fields: ['id'],
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
                      fields: ['id'],
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
            'components.doctor-profile': {
              populate: {
                profile: {
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
                    openingHours: {
                      populate: '*',
                    },
                    holiday: {
                      populate: '*',
                    },
                    positions: {
                      populate: '*',
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
                      fields: ['url', 'name', 'ext', 'size'],
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

    // Cache the result
    pageContentCache.set(cacheKey, { data: page, timestamp: Date.now() });

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

    return response.data || [];
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

// ============================================================================
// Intranet Menu API
// ============================================================================

/**
 * Fetch intranet menu items
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchIntranetMenu(
  locale: string = 'cs'
): Promise<NavigationItem[]> {
  // Check cache first
  const cached = intranetMenuCache.get(locale);
  if (isCacheValid(cached)) {
    return cached.data as unknown as NavigationItem[];
  }

  try {
    // Fetch menu and intranet page hierarchy in parallel
    const [response, hierarchy] = await Promise.all([
      fetchAPI<StrapiCollectionResponse<any>>('/intranet-menus', {
        locale,
        populate: {
          link: {
            populate: ['page', 'file'],
          },
        },
      }),
      getFullIntranetPageHierarchy(locale),
    ]);

    const items: NavigationItem[] = [];

    for (const item of response.data || []) {
      const link = item.link;
      // Pass hierarchy for canonical path resolution
      const resolvedLink = resolveLink(link, locale, hierarchy);

      if (resolvedLink) {
        // For intranet pages, we need to prefix with /intranet/
        let href = resolvedLink.href;
        if (link.page && !href.includes('/intranet/')) {
          // Transform /{locale}/{path}/ to /{locale}/intranet/{path}/
          href = href.replace(`/${locale}/`, `/${locale}/intranet/`);
        }

        items.push({
          name: item.title,
          href,
          target: resolvedLink.target,
        });
      }
    }

    // Cache the result
    intranetMenuCache.set(locale, { data: items as unknown as Navigation, timestamp: Date.now() });

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
  // Check cache first
  const cacheKey = `${locale}:${slug}`;
  const cached = intranetPageContentCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached.data;
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
                      fields: ['id'],
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
                      fields: ['id'],
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
                      fields: ['url', 'name', 'ext', 'size'],
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
                      fields: ['id'],
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
            'components.doctor-profile': {
              populate: {
                profile: {
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
                    openingHours: {
                      populate: '*',
                    },
                    holiday: {
                      populate: '*',
                    },
                    positions: {
                      populate: '*',
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
          },
        },
        sidebar: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
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
            'components.doctor-profile': {
              populate: {
                profile: {
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
                    openingHours: {
                      populate: '*',
                    },
                    holiday: {
                      populate: '*',
                    },
                    positions: {
                      populate: '*',
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
                      fields: ['url', 'name', 'ext', 'size'],
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
                      fields: ['id'],
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
      // Cache the result
      intranetPageContentCache.set(cacheKey, { data: page, timestamp: Date.now() });
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
