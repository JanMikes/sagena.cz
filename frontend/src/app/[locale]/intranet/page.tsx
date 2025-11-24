import { getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import IntranetContent from './Content';

interface IntranetPageProps {
  params: Promise<{
    locale: string;
  }>;
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
