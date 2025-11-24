import { getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import SPanelemContent from './Content';

interface SPanelemPageProps {
  params: Promise<{
    locale: string;
  }>;
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
