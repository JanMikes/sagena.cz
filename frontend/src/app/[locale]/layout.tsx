import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import { fetchNavigation } from '@/lib/strapi';
import { locales, isValidLocale, getAlternateLocale, type Locale } from '@/i18n/config';
import type { NavigationItem } from '@/types/strapi';

interface LocaleLayoutProps {
  children: React.ReactNode;
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
 * Locale-aware layout
 * Handles navigation fetching and locale validation
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Fetch navigation for current locale
  let navbarItems: NavigationItem[] = [];
  try {
    navbarItems = await fetchNavigation(true, undefined, locale);
  } catch (error) {
    console.error('Failed to fetch navigation from Strapi:', error);
  }

  const alternateLocale = getAlternateLocale(locale as Locale);

  return (
    <>
      <Header
        navigation={navbarItems}
        currentLocale={locale as Locale}
        alternateLocale={alternateLocale}
      />
      <main>{children}</main>
    </>
  );
}
