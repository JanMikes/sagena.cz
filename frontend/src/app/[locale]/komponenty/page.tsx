import { locales, getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import KomponentyContent from './KomponentyContent';

interface KomponentyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generate static params for all supported locales
 * This page always shows Czech content regardless of locale
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function KomponentyPage({ params }: KomponentyPageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/komponenty/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <KomponentyContent />
    </>
  );
}
