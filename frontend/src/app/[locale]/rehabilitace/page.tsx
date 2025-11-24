import { getAlternateLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import RehabilitaceContent from './Content';

interface RehabilitacePageProps {
  params: Promise<{
    locale: string;
  }>;
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
