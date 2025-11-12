/**
 * Strapi CMS Client
 *
 * Centralized client for fetching data from Strapi API with:
 * - Authentication header injection
 * - Type-safe query building
 * - Deep population for nested relations
 * - Build-time caching (for static export)
 */

import {
  StrapiResponse,
  StrapiCollectionResponse,
  Navigation,
  Page,
  NavigationItem,
  ElementsLink,
  ResolvedLink,
} from '@/types/strapi';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Get Strapi URL based on environment
 *
 * IMPORTANT: Docker networking consideration
 * - Server-side (build time/SSG): Use STRAPI_URL (http://strapi:1337 in Docker)
 * - Client-side (browser): Use NEXT_PUBLIC_STRAPI_URL (http://localhost:1337 or production URL)
 *
 * For SSG (Static Site Generation), all fetching happens at BUILD TIME on the server,
 * so we need to use the server-side URL (Docker service name: "strapi:1337")
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
    // For static export, we need to fetch data at build time
    // Disable cache during development, enable for production builds
    cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
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
// Link Resolution
// ============================================================================

/**
 * Resolve ElementsLink to usable href and target
 * Priority: page > url > file > anchor
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper, no .attributes)
 */
export function resolveLink(link: ElementsLink): ResolvedLink | null {
  if (!link) return null;

  // Internal page link
  // Strapi returns page relation directly (not wrapped in .data)
  if (link.page) {
    const pageSlug = link.page.slug;
    // Add trailing slash for consistency with Next.js trailingSlash: true
    const href = `/${pageSlug}/${link.anchor ? `#${link.anchor}` : ''}`;
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
  // Strapi returns file relation directly (not wrapped in .data)
  if (link.file) {
    const fileUrl = link.file.attributes.url;
    return {
      href: getStrapiURL(fileUrl),
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

// ============================================================================
// Navigation API
// ============================================================================

/**
 * Fetch navigation items
 * @param navbar - Filter for navbar items (navbar: true)
 * @param footer - Filter for footer items (footer: true)
 * @param locale - Locale for i18n (default: 'cs-CZ')
 */
export async function fetchNavigation(
  navbar?: boolean,
  footer?: boolean,
  locale: string = 'cs-CZ'
): Promise<NavigationItem[]> {
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

  const response = await fetchAPI<any>('/navigations', params);

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

    const resolvedLink = resolveLink(link);

    if (resolvedLink) {
      items.push({
        name: nav.title,
        href: resolvedLink.href,
        target: resolvedLink.target,
      });
    }
  }

  return items;
}

// ============================================================================
// Page API
// ============================================================================

/**
 * Fetch single page by slug with full content population
 * @param slug - Page slug (e.g., "o-nas" or "sluzby/kardiologie")
 * @param locale - Locale for i18n (default: 'cs-CZ')
 */
export async function fetchPageBySlug(
  slug: string,
  locale: string = 'cs-CZ'
): Promise<Page | null> {
  try {
    // IMPORTANT: Dynamic zones are polymorphic structures
    // We use the 'on' syntax to target specific components within dynamic zones
    // This allows us to deeply populate relations within each component type
    const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
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
          },
        },
        parent: true, // Populate parent relation
      },
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    // Filter by slug client-side
    // Strapi returns data directly, not wrapped in attributes
    const page = response.data.find(p => p.slug === slug);

    if (!page) {
      return null;
    }

    return page;
  } catch (error) {
    console.error(`Failed to fetch page: ${slug}`, error);
    return null;
  }
}

/**
 * Fetch all page slugs for static generation
 * Used in generateStaticParams() for catch-all routes
 * @param locale - Locale for i18n (default: 'cs-CZ')
 */
export async function fetchAllPageSlugs(
  locale: string = 'cs-CZ'
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
 * @param locale - Locale for i18n (default: 'cs-CZ')
 */
export async function fetchAllPages(locale: string = 'cs-CZ'): Promise<Page[]> {
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
 * Get full URL for Strapi media
 * @param url - Relative or absolute URL from Strapi
 */
export function getStrapiMediaURL(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return getStrapiURL(url);
}

/**
 * Check if sidebar should be displayed
 * @param sidebar - Sidebar components array from page
 */
export function hasSidebar(sidebar?: any[]): boolean {
  return !!sidebar && sidebar.length > 0;
}
