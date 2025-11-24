import { getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import KomponentyContent from './KomponentyContent';

interface KomponentyPageProps {
  params: Promise<{
    locale: string;
  }>;
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
