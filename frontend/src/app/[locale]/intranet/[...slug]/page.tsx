/**
 * Catch-all Dynamic Route for Strapi Intranet Pages
 *
 * This route handles all dynamic intranet pages from Strapi CMS.
 * It fetches page content by slug and renders it using DynamicZone components.
 * Protected by authentication middleware.
 *
 * Features:
 * - Locale-aware content fetching
 * - Authentication protection (middleware + session check)
 * - Support for nested page hierarchies
 * - Optional sidebar rendering
 * - Breadcrumb navigation starting from intranet home
 * - Intranet-specific navigation
 */

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import {
  fetchIntranetPageBySlug,
  fetchAllIntranetPageSlugs,
  fetchIntranetMenu,
  hasSidebar,
  getIntranetPageHierarchy,
} from '@/lib/strapi';
import { getSession } from '@/lib/auth';
import DynamicZone from '@/components/strapi/DynamicZone';
import SidePanel from '@/components/layout/SidePanel';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import IntranetNav from '@/components/intranet/IntranetNav';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getAlternateLocale, isValidLocale, type Locale } from '@/i18n/config';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

const translations = {
  cs: {
    intranetHome: 'Intranet',
  },
  en: {
    intranetHome: 'Intranet',
  },
} as const;

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug: slugArray } = await params;

  // Get the leaf slug (last segment) - this is the page's slug in Strapi
  const leafSlug = slugArray[slugArray.length - 1];

  // Get hierarchy info (cached) and page content in parallel
  const [hierarchy, page] = await Promise.all([
    getIntranetPageHierarchy(leafSlug, locale),
    fetchIntranetPageBySlug(leafSlug, locale),
  ]);

  if (!page || !hierarchy) {
    return {
      title: 'Stránka nenalezena',
    };
  }

  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateSlug = page.localizations?.find((l) => l.locale === alternateLocale)?.slug;

  return {
    title: `${page.title} | Sagena Intranet`,
    description: page.meta_description || page.title,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/${locale}/intranet/${hierarchy.canonicalPath}/`,
      languages: {
        [locale]: `/${locale}/intranet/${hierarchy.canonicalPath}/`,
        ...(alternateSlug && { [alternateLocale]: `/${alternateLocale}/intranet/${alternateSlug}/` }),
      },
    },
  };
}

/**
 * Generate static paths for all intranet pages
 */
export async function generateStaticParams() {
  const locales = ['cs', 'en'];
  const paths: { locale: string; slug: string[] }[] = [];

  for (const locale of locales) {
    const slugs = await fetchAllIntranetPageSlugs(locale);
    for (const slug of slugs) {
      paths.push({
        locale,
        slug: slug.split('/'),
      });
    }
  }

  return paths;
}

/**
 * Intranet Page component
 */
export default async function IntranetPage({ params }: PageProps) {
  const { locale, slug: slugArray } = await params;

  // Get the leaf slug (last segment) - this is the page's slug in Strapi
  const leafSlug = slugArray[slugArray.length - 1];

  // Validate locale
  if (!isValidLocale(locale)) {
    redirect(`/cs/intranet/`);
  }

  // Double-check authentication (middleware should have caught this)
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/intranet/login/`);
  }

  // Get hierarchy info (cached) and page content in parallel
  const [hierarchy, page] = await Promise.all([
    getIntranetPageHierarchy(leafSlug, locale),
    fetchIntranetPageBySlug(leafSlug, locale),
  ]);

  // Show 404 if page not found
  if (!page || !hierarchy) {
    notFound();
  }

  // Validate URL matches canonical path
  const requestedPath = slugArray.join('/');

  // Redirect to canonical URL if the requested path doesn't match
  // This handles cases like:
  // - /cs/intranet/child/ when it should be /cs/intranet/parent/child/
  // - /cs/intranet/wrong-parent/child/ when parent is different
  if (requestedPath !== hierarchy.canonicalPath) {
    redirect(`/${locale}/intranet/${hierarchy.canonicalPath}/`);
  }

  // Fetch intranet navigation
  const navigation = await fetchIntranetMenu(locale);
  const userName = session.user.username || session.user.email.split('@')[0];

  const showSidebar = hasSidebar(page.sidebar);
  const alternateLocale = getAlternateLocale(locale as Locale);
  const t = translations[locale as Locale];

  // Compute alternate locale URL from page localizations
  let alternateLocaleUrl: string | null = null;
  if (page.localizations) {
    const alternateVersion = page.localizations.find((l) => l.locale === alternateLocale);
    if (alternateVersion) {
      alternateLocaleUrl = `/${alternateLocale}/intranet/${alternateVersion.slug}/`;
    } else {
      // No alternate version exists, redirect to intranet homepage
      alternateLocaleUrl = `/${alternateLocale}/intranet/`;
    }
  } else {
    // No localizations data, fallback to intranet homepage
    alternateLocaleUrl = `/${alternateLocale}/intranet/`;
  }

  // Build breadcrumb items from hierarchy
  const breadcrumbItems = [
    { label: t.intranetHome, href: `/${locale}/intranet/` },
    ...hierarchy.breadcrumbs.map((crumb, index) => {
      // Build href incrementally from breadcrumb slugs
      const pathSegments = hierarchy.breadcrumbs.slice(0, index + 1).map(b => b.slug);
      return {
        label: crumb.label,
        href: `/${locale}/intranet/${pathSegments.join('/')}/`,
      };
    }),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Intranet Navigation */}
      <IntranetNav userName={userName} locale={locale as Locale} navigation={navigation} />

      {/* Page Content Layout */}
      {showSidebar ? (
        /* Two-column layout with sidebar - needs container around grid */
        <div className="container-custom pt-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Breadcrumb Navigation */}
              <Breadcrumb items={breadcrumbItems} locale={locale} />

              {/* Page Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-primary-600">{page.title}</h1>

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
            <Breadcrumb items={breadcrumbItems} locale={locale} />

            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary-600 mt-6">{page.title}</h1>
          </div>

          <DynamicZone components={page.content} locale={locale} />
        </div>
      )}
    </div>
  );
}
