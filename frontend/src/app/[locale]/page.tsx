import React from 'react';
import { Metadata } from 'next';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getAlternateLocale, type Locale } from '@/i18n/config';
import { fetchHomepage, fetchPageBySlug } from '@/lib/strapi';
import DynamicZone from '@/components/strapi/DynamicZone';
import PageHeader from '@/components/layout/PageHeader';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generate metadata based on locale
 */
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    cs: 'Sagena - Centrum Zdraví',
    en: 'Sagena - Health Center',
  };

  const descriptions: Record<Locale, string> = {
    cs: 'Sagena poskytuje komplexní zdravotní péči desítkám tisíc spokojených klientů. Moderní zdravotnické centrum s více než 20 odbornostmi.',
    en: 'Sagena provides comprehensive healthcare to tens of thousands of satisfied clients. Modern medical center with more than 20 specialties.',
  };

  return {
    title: titles[locale as Locale] || titles.cs,
    description: descriptions[locale as Locale] || descriptions.cs,
    alternates: {
      languages: {
        cs: '/cs/',
        en: '/en/',
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/`;

  // Fetch homepage to get page slug
  const homepage = await fetchHomepage(locale);

  // If no homepage configured, render empty page
  if (!homepage?.page?.slug) {
    return (
      <div className="min-h-screen">
        <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      </div>
    );
  }

  // Fetch page using existing function (utilizes cache)
  const page = await fetchPageBySlug(homepage.page.slug, locale);

  // If page not found, render empty page
  if (!page) {
    return (
      <div className="min-h-screen">
        <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      </div>
    );
  }

  // Check if page has a special header
  const hasPageHeader = page.header && (page.header.slider || page.header.service_cards);

  return (
    <>
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Page Layout with gradient background starting from navbar */}
      <div
        className="pb-16"
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

        {/* Render page content from Strapi */}
        <DynamicZone components={page.content || []} locale={locale} />
      </div>
    </>
  );
}
