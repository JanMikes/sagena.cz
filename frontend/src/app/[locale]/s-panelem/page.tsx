import { locales, getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import SPanelemContent from './Content';

interface SPanelemPageProps {
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

export default async function SPanelemPage({ params }: SPanelemPageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/s-panelem/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <SPanelemContent />
    </>
  );
}
