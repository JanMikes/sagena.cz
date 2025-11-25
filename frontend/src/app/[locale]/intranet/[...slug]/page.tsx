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
  const slug = slugArray.join('/');

  const page = await fetchIntranetPageBySlug(slug, locale);

  if (!page) {
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
      languages: {
        [locale]: `/${locale}/intranet/${slug}/`,
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
  const slug = slugArray.join('/');

  // Validate locale
  if (!isValidLocale(locale)) {
    redirect(`/cs/intranet/`);
  }

  // Double-check authentication (middleware should have caught this)
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/intranet/login/`);
  }

  const page = await fetchIntranetPageBySlug(slug, locale);

  // Show 404 if page not found
  if (!page) {
    notFound();
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

  // Build breadcrumb items starting from intranet home
  const breadcrumbItems = [
    { label: t.intranetHome, href: `/${locale}/intranet/` },
    { label: page.title, href: `/${locale}/intranet/${slug}/` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Intranet Navigation */}
      <IntranetNav userName={userName} locale={locale as Locale} navigation={navigation} />

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

            <div className="max-w-4xl">
              <DynamicZone components={page.content} locale={locale} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
