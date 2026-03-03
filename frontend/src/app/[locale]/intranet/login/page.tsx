import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/intranet/LoginForm';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Redirect confirmed users to dashboard
  const session = await getSession();
  if (session) {
    redirect(`/${locale}/intranet/`);
  }

  return <LoginForm locale={locale as Locale} />;
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
