/**
 * Catch-all Dynamic Route for Strapi Pages
 *
 * This route handles all dynamic pages from Strapi CMS.
 * It fetches page content by slug and renders it using DynamicZone components.
 *
 * Features:
 * - Locale-aware content fetching
 * - Static Czech pages always show Czech content
 * - Support for nested page hierarchies
 * - Optional sidebar rendering
 * - Breadcrumb navigation
 */

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { fetchPageBySlug, hasSidebar, getPageHierarchy } from '@/lib/strapi';
import DynamicZone from '@/components/strapi/DynamicZone';
import SidePanel from '@/components/layout/SidePanel';
import PageHeader from '@/components/layout/PageHeader';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { isStaticCzechPage, getAlternateLocale, type Locale } from '@/i18n/config';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { locale, slug: slugArray } = await params;

    // Get the leaf slug (last segment) - this is the page's slug in Strapi
    const leafSlug = slugArray[slugArray.length - 1];

    // Use Czech locale for static pages
    const effectiveLocale = isStaticCzechPage(leafSlug) ? 'cs' : locale;

    // Get hierarchy info (cached) and page content in parallel
    const [hierarchy, page] = await Promise.all([
      getPageHierarchy(leafSlug, effectiveLocale),
      fetchPageBySlug(leafSlug, effectiveLocale),
    ]);

    if (!page || !hierarchy) {
      return {
        title: 'Stránka nenalezena',
      };
    }

    const alternateLocale = getAlternateLocale(locale as Locale);
    const alternateSlug = page.localizations?.find(l => l.locale === alternateLocale)?.slug;

    return {
      title: `${page.title} | Sagena`,
      description: page.meta_description || page.title,
      alternates: {
        canonical: `/${locale}/${hierarchy.canonicalPath}/`,
        languages: {
          [locale]: `/${locale}/${hierarchy.canonicalPath}/`,
          ...(alternateSlug && { [alternateLocale]: `/${alternateLocale}/${alternateSlug}/` }),
        },
      },
    };
  } catch (error) {
    // Log metadata errors but don't let them break the page
    console.error('[generateMetadata] Error generating metadata:', error);
    try {
      Sentry.captureException(error, { extra: { context: 'generateMetadata' } });
    } catch {
      // Ignore Sentry errors
    }
    return {
      title: 'Sagena',
    };
  }
}

/**
 * Page component
 */
export default async function Page({ params }: PageProps) {
  const { locale, slug: slugArray } = await params;

  // Get the leaf slug (last segment) - this is the page's slug in Strapi
  const leafSlug = slugArray[slugArray.length - 1];

  // Use Czech locale for static demonstration pages
  const effectiveLocale = isStaticCzechPage(leafSlug) ? 'cs' : locale;

  let hierarchy;
  let page;

  try {
    // Get hierarchy info (cached) and page content in parallel
    [hierarchy, page] = await Promise.all([
      getPageHierarchy(leafSlug, effectiveLocale),
      fetchPageBySlug(leafSlug, effectiveLocale),
    ]);
  } catch (error) {
    // Log fetch errors - these should NOT result in 404
    console.error(`[Page] Error fetching page data for slug="${leafSlug}" locale="${effectiveLocale}":`, error);
    try {
      Sentry.captureException(error, {
        extra: { slug: leafSlug, locale: effectiveLocale, context: 'fetchPageData' }
      });
    } catch {
      // Ignore Sentry errors
    }
    // Re-throw to let error.tsx handle it (NOT 404)
    throw error;
  }

  // Show 404 only if page genuinely doesn't exist (not on errors)
  if (!page || !hierarchy) {
    console.warn(`[Page] Page not found: slug="${leafSlug}" locale="${effectiveLocale}" page=${!!page} hierarchy=${!!hierarchy}`);
    notFound();
  }

  // Validate URL matches canonical path
  const requestedPath = slugArray.join('/');

  // Redirect to canonical URL if the requested path doesn't match
  // This handles cases like:
  // - /cs/child/ when it should be /cs/parent/child/
  // - /cs/wrong-parent/child/ when parent is different
  if (requestedPath !== hierarchy.canonicalPath) {
    redirect(`/${locale}/${hierarchy.canonicalPath}/`);
  }

  const showSidebar = hasSidebar(page.sidebar);
  const alternateLocale = getAlternateLocale(locale as Locale);

  // Compute alternate locale URL from page localizations
  let alternateLocaleUrl: string | null = null;
  if (isStaticCzechPage(leafSlug)) {
    // Static Czech pages have the same slug in both locales
    alternateLocaleUrl = `/${alternateLocale}/${hierarchy.canonicalPath}/`;
  } else if (page.localizations) {
    const alternateVersion = page.localizations.find(l => l.locale === alternateLocale);
    if (alternateVersion) {
      alternateLocaleUrl = `/${alternateLocale}/${alternateVersion.slug}/`;
    } else {
      // No alternate version exists, redirect to homepage
      alternateLocaleUrl = `/${alternateLocale}/`;
    }
  } else {
    // No localizations data, fallback to homepage
    alternateLocaleUrl = `/${alternateLocale}/`;
  }

  // Build breadcrumb items from hierarchy
  const breadcrumbItems = hierarchy.breadcrumbs.map((crumb, index) => {
    // Build href incrementally from breadcrumb slugs
    const pathSegments = hierarchy.breadcrumbs.slice(0, index + 1).map(b => b.slug);
    return {
      label: crumb.label,
      href: `/${locale}/${pathSegments.join('/')}/`,
    };
  });

  // Check if page has a special header (PageHeader handles its own H1)
  const hasPageHeader = page.header && (page.header.slider || page.header.service_cards);

  return (
    <>
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Page Layout with gradient background starting from navbar */}
      <div
        style={{
          background: `
            linear-gradient(to bottom, transparent, #FFF 100vh),
            linear-gradient(to right, #E7EFF7, #F8F2FD)
          `,
        }}
      >
        {/* Header - dynamic from Strapi (only for pages with slider or service_cards) */}
        {hasPageHeader && (
          <>
            {/* Visually hidden but accessible title for SEO */}
            <h1 className="sr-only">{page.title}</h1>
            <PageHeader header={page.header!} locale={locale} />
          </>
        )}
        {showSidebar ? (
          /* Two-column layout with sidebar - breadcrumb above, sidebar starts at H1 level */
          <div className="container-custom pt-6 pb-12">
            {/* Breadcrumb Navigation - full width above the grid */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Grid starts at H1 level */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Page Title (when no PageHeader) */}
                {!hasPageHeader && (
                  <h1 className="text-4xl md:text-5xl font-bold text-primary-600">{page.title}</h1>
                )}

                <DynamicZone components={page.content} locale={locale} inContainer />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <SidePanel>
                  <DynamicZone components={page.sidebar || []} locale={locale} compact inContainer />
                </SidePanel>
              </div>
            </div>
          </div>
        ) : (
          /* Full-width layout - DynamicZone handles its own containers */
          <div className="pt-6 pb-12">
            {/* Breadcrumb and Title need their own container */}
            <div className="container-custom mb-8">
              <Breadcrumb items={breadcrumbItems} />

              {/* Page Title (when no PageHeader) */}
              {!hasPageHeader && (
                <h1 className="text-4xl md:text-5xl font-bold text-primary-600 mt-6">{page.title}</h1>
              )}
            </div>

            <DynamicZone components={page.content} locale={locale} />
          </div>
        )}
      </div>
    </>
  );
}
