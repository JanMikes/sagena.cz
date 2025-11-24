import { locales, getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import IntranetContent from './Content';

interface IntranetPageProps {
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

export default async function IntranetPage({ params }: IntranetPageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/intranet/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <IntranetContent />
    </>
  );
}
