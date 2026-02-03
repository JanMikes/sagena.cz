import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchNavigation, fetchFooter, fetchSearch, fetchSearchableContent } from '@/lib/strapi';
import { isValidLocale, getAlternateLocale, type Locale } from '@/i18n/config';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { ReservationModalProvider } from '@/contexts/ReservationModalContext';
import RegistrationModal from '@/components/forms/RegistrationModal';
import type { NavigationItem, Footer as FooterType, Search, SearchableItem } from '@/types/strapi';

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

  // Detect if we're on an intranet page to hide main navigation
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  const isIntranet = pathname.includes('/intranet');

  // Fetch navigation, footer, search data and searchable content for current locale
  // For intranet pages, we still show the header but without navigation links
  let navbarItems: NavigationItem[] = [];
  let footerNavItems: NavigationItem[] = [];
  let footer: FooterType | null = null;
  let searchData: Search | null = null;
  let searchableContent: SearchableItem[] = [];

  try {
    if (isIntranet) {
      // For intranet, only fetch minimal data needed for header
      // Navigation links will be hidden, so no need to fetch them
    } else {
      [navbarItems, footer, footerNavItems, searchData, searchableContent] = await Promise.all([
        fetchNavigation(true, undefined, locale),
        fetchFooter(locale),
        fetchNavigation(undefined, true, locale),
        fetchSearch(locale),
        fetchSearchableContent(locale),
      ]);
    }
  } catch (error) {
    console.error('Failed to fetch layout data from Strapi:', error);
  }

  const alternateLocale = getAlternateLocale(locale as Locale);

  // Intranet pages have their own secondary navigation - show main Header without nav links, no Footer
  if (isIntranet) {
    return (
      <ReservationModalProvider>
        <LocaleProvider>
          <Header
            navigation={[]}
            currentLocale={locale as Locale}
            alternateLocale={alternateLocale}
            hideNavigation
          />
          <main>{children}</main>
        </LocaleProvider>
      </ReservationModalProvider>
    );
  }

  return (
    <ReservationModalProvider>
      <LocaleProvider>
        <Header
          navigation={navbarItems}
          currentLocale={locale as Locale}
          alternateLocale={alternateLocale}
          searchData={searchData}
          searchableContent={searchableContent}
        />
        <main>{children}</main>
        <Footer data={footer} locale={locale} footerNavigation={footerNavItems} />
        <RegistrationModal locale={locale as Locale} />
      </LocaleProvider>
    </ReservationModalProvider>
  );
}
