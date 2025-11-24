import { locales, getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import OrdinaceContent from './Content';

interface OrdinacePageProps {
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

export default async function OrdinacePage({ params }: OrdinacePageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/ordinace/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <OrdinaceContent />
    </>
  );
}
