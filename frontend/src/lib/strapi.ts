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
  Icon,
  NewsArticle,
  Tag,
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
 */
export function resolveLink(link: ElementsLink, locale: string = 'cs'): ResolvedLink | null {
  if (!link) return null;

  // Internal page link
  // Strapi returns page relation directly (not wrapped in .data)
  if (link.page) {
    const pageSlug = link.page.slug;
    // Add locale prefix and trailing slash for consistency with Next.js trailingSlash: true
    const href = `/${locale}/${pageSlug}/${link.anchor ? `#${link.anchor}` : ''}`;
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
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchNavigation(
  navbar?: boolean,
  footer?: boolean,
  locale: string = 'cs'
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

    const resolvedLink = resolveLink(link, locale);

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
 * @param locale - Locale for i18n (default: 'cs')
 */
export async function fetchPageBySlug(
  slug: string,
  locale: string = 'cs'
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
            'components.expandable-section': {
              populate: {
                files: {
                  populate: ['file'],
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
          },
        },
        parent: true, // Populate parent relation
        localizations: {
          fields: ['locale', 'slug'], // Fetch alternate locale versions for language switcher
        },
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
 * Get full URL for Strapi media
 * @param url - Relative or absolute URL from Strapi
 *
 * IMPORTANT: Media files are shared via Docker volume mount between Strapi and Frontend.
 * The uploads directory is mounted to frontend at /app/public/uploads, so we can
 * serve media directly from the frontend without proxying through Strapi.
 *
 * This is more efficient and avoids CORS issues.
 */
export function getStrapiMediaURL(url: string): string {
  if (!url) return '';
  // If already absolute URL, return as-is
  if (url.startsWith('http')) return url;
  // Return relative path for browser to fetch from frontend public directory
  // Strapi returns URLs like "/uploads/..." which map to /app/public/uploads in frontend
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
