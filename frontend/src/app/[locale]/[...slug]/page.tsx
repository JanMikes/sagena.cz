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
import { fetchPageBySlug, hasSidebar, getPageHierarchy } from '@/lib/strapi';
import DynamicZone from '@/components/strapi/DynamicZone';
import SidePanel from '@/components/layout/SidePanel';
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

  // Get hierarchy info (cached) and page content in parallel
  const [hierarchy, page] = await Promise.all([
    getPageHierarchy(leafSlug, effectiveLocale),
    fetchPageBySlug(leafSlug, effectiveLocale),
  ]);

  // Show 404 if page not found
  if (!page || !hierarchy) {
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

  return (
    <>
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Page Content Layout */}
        {showSidebar ? (
          /* Two-column layout with sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Breadcrumb Navigation */}
              <Breadcrumb items={breadcrumbItems} />

              <DynamicZone components={page.content} locale={locale} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SidePanel>
                <DynamicZone components={page.sidebar || []} locale={locale} compact />
              </SidePanel>
            </div>
          </div>
        ) : (
          /* Full-width layout without sidebar */
          <div className="space-y-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={breadcrumbItems} />

            <DynamicZone components={page.content} locale={locale} />
          </div>
        )}
      </div>
    </>
  );
}
