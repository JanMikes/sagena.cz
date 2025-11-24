import { getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import OrdinaceContent from './Content';

interface OrdinacePageProps {
  params: Promise<{
    locale: string;
  }>;
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
