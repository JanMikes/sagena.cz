import { locales, getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import RehabilitaceContent from './Content';

interface RehabilitacePageProps {
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

export default async function RehabilitacePage({ params }: RehabilitacePageProps) {
  const { locale } = await params;
  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/rehabilitace/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <RehabilitaceContent />
    </>
  );
}
