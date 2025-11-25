import { getAlternateLocale, isValidLocale, type Locale } from '@/i18n/config';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getSession } from '@/lib/auth';
import { fetchIntranetMenu } from '@/lib/strapi';
import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';

interface IntranetPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function IntranetPage({ params }: IntranetPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect(`/cs/intranet/`);
  }

  const session = await getSession();

  // Double-check authentication (middleware should have caught this)
  if (!session) {
    redirect(`/${locale}/intranet/login/`);
  }

  // Fetch intranet navigation menu
  const navigation = await fetchIntranetMenu(locale);

  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLocaleUrl = `/${alternateLocale}/intranet/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateLocaleUrl} />
      <Dashboard locale={locale as Locale} user={session.user} navigation={navigation} />
    </>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
