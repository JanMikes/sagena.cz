import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchNavigation, fetchFooter, fetchSearch } from '@/lib/strapi';
import { isValidLocale, getAlternateLocale, type Locale } from '@/i18n/config';
import { LocaleProvider } from '@/contexts/LocaleContext';
import type { NavigationItem, Footer as FooterType, Search } from '@/types/strapi';

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

  // Fetch navigation, footer and search for current locale
  let navbarItems: NavigationItem[] = [];
  let footerNavItems: NavigationItem[] = [];
  let footer: FooterType | null = null;
  let searchData: Search | null = null;
  try {
    [navbarItems, footer, footerNavItems, searchData] = await Promise.all([
      fetchNavigation(true, undefined, locale),
      fetchFooter(locale),
      fetchNavigation(undefined, true, locale),
      fetchSearch(locale),
    ]);
  } catch (error) {
    console.error('Failed to fetch layout data from Strapi:', error);
  }

  const alternateLocale = getAlternateLocale(locale as Locale);

  return (
    <LocaleProvider>
      <Header
        navigation={navbarItems}
        currentLocale={locale as Locale}
        alternateLocale={alternateLocale}
        searchData={searchData}
      />
      <main>{children}</main>
      <Footer data={footer} locale={locale} footerNavigation={footerNavItems} />
    </LocaleProvider>
  );
}
