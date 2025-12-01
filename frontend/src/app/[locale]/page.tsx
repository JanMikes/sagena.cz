import React from 'react';
import { Metadata } from 'next';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getAlternateLocale, type Locale } from '@/i18n/config';
import { fetchHomepage, fetchPageBySlug } from '@/lib/strapi';
import DynamicZone from '@/components/strapi/DynamicZone';

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

  return (
    <div className="min-h-screen">
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Render page content from Strapi */}
      <DynamicZone components={page.content || []} locale={locale} />
    </div>
  );
}
