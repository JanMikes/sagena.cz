/**
 * Intranet News Listing Page
 *
 * Displays all intranet news articles from the intranet-news-articles collection.
 * Protected by authentication middleware.
 */

import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { fetchIntranetNewsArticles, fetchIntranetMenu, getStrapiMediaURL } from '@/lib/strapi';
import { getSession } from '@/lib/auth';
import NewsArticles from '@/components/content/NewsArticles';
import IntranetNav from '@/components/intranet/IntranetNav';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getAlternateLocale, isValidLocale, type Locale } from '@/i18n/config';

interface IntranetNewsListingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

const translations = {
  cs: {
    title: 'Aktuality',
    description: 'Interní novinky a aktuality.',
    intranetHome: 'Intranet',
  },
  en: {
    title: 'News',
    description: 'Internal news and updates.',
    intranetHome: 'Intranet',
  },
} as const;

/**
 * Generate metadata based on locale
 */
export async function generateMetadata({
  params,
}: IntranetNewsListingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = translations[locale as Locale] || translations.cs;
  const alternateLocale = getAlternateLocale(locale as Locale);

  return {
    title: `${t.title} | Sagena Intranet`,
    description: t.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      languages: {
        cs: '/cs/intranet/aktuality/',
        en: '/en/intranet/aktuality/',
      },
    },
  };
}

/**
 * Generate static params for both locales
 */
export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}

/**
 * Intranet News Listing Page
 * Displays all intranet news articles
 */
export default async function IntranetNewsListingPage({ params }: IntranetNewsListingPageProps) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    redirect(`/cs/intranet/aktuality/`);
  }

  // Double-check authentication (middleware should have caught this)
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/intranet/login/`);
  }

  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/intranet/aktuality/`;
  const t = translations[locale as Locale] || translations.cs;

  // Fetch intranet navigation and articles
  const [navigation, articles] = await Promise.all([
    fetchIntranetMenu(locale),
    fetchIntranetNewsArticles(locale, undefined, undefined, 'date:desc'),
  ]);

  const userName = session.user.username || session.user.email.split('@')[0];

  // Transform articles to component props
  const articlesData = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    date: article.date || new Date().toISOString(),
    text: article.text || '',
    image: article.image?.url
      ? getStrapiMediaURL(article.image.url)
      : undefined,
    imageAlt: article.image?.alternativeText || article.title,
    tags: article.tags?.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    locale,
  }));

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: t.intranetHome, href: `/${locale}/intranet/` },
    { label: t.title, href: `/${locale}/intranet/aktuality/` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Set alternate URL for language switcher */}
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />

      {/* Intranet Navigation */}
      <IntranetNav userName={userName} locale={locale as Locale} navigation={navigation} />

      <div className="container-custom pt-6 pb-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} locale={locale} />

        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary-600 mt-6 mb-8">{t.title}</h1>

        {/* News articles grid */}
        <NewsArticles
          articles={articlesData}
          locale={locale}
          basePath={`/${locale}/intranet/aktuality`}
        />
      </div>
    </div>
  );
}
