import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import { fetchNavigation } from '@/lib/strapi';
import { isValidLocale, getAlternateLocale, type Locale } from '@/i18n/config';
import { LocaleProvider } from '@/contexts/LocaleContext';
import type { NavigationItem } from '@/types/strapi';

// Force all pages under [locale] to be dynamically rendered (SSR)
// This prevents static generation at build time, allowing build to succeed without Strapi
export const dynamic = 'force-dynamic';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
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
    <LocaleProvider>
      <Header
        navigation={navbarItems}
        currentLocale={locale as Locale}
        alternateLocale={alternateLocale}
      />
      <main>{children}</main>
    </LocaleProvider>
  );
}
