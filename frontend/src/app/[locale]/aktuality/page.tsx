import React from 'react';
import { Metadata } from 'next';
import { fetchNewsArticles, getStrapiMediaURL } from '@/lib/strapi';
import NewsArticles from '@/components/content/NewsArticles';
import { locales, getAlternateLocale, type Locale } from '@/i18n/config';

interface NewsListingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generate metadata based on locale
 */
export async function generateMetadata({ params }: NewsListingPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    cs: 'Aktuality | Sagena',
    en: 'News | Sagena',
  };

  const descriptions: Record<Locale, string> = {
    cs: 'Všechny novinky a aktuality z naší zdravotnické ordinace.',
    en: 'All news and updates from our medical practice.',
  };

  const alternateLocale = getAlternateLocale(locale as Locale);

  return {
    title: titles[locale as Locale] || titles.cs,
    description: descriptions[locale as Locale] || descriptions.cs,
    alternates: {
      languages: {
        cs: '/cs/aktuality/',
        en: '/en/aktuality/',
      },
    },
  };
}

/**
 * News Listing Page
 * Displays all news articles from the news-articles collection
 */
export default async function NewsListingPage({ params }: NewsListingPageProps) {
  const { locale } = await params;

  const articles = await fetchNewsArticles(locale, undefined, undefined, 'date:desc');

  // Transform articles to component props
  const articlesData = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    date: article.date || new Date().toISOString(),
    text: article.text || '',
    image: article.image?.attributes?.url
      ? getStrapiMediaURL(article.image.attributes.url)
      : undefined,
    imageAlt: article.image?.attributes?.alternativeText || article.title,
    tags: article.tags?.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    locale,
  }));

  const pageTitle = locale === 'en' ? 'News' : 'Aktuality';
  const pageDescription = locale === 'en'
    ? 'All news and updates from our medical practice'
    : 'Všechny novinky a aktuality z naší zdravotnické ordinace';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          <p className="text-lg text-gray-600">{pageDescription}</p>
        </div>

        {/* News articles grid */}
        <NewsArticles articles={articlesData} locale={locale} />
      </div>
    </main>
  );
}
