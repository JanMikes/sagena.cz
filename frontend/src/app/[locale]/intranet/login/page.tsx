import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import LoginForm from '@/components/intranet/LoginForm';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <LoginForm locale={locale as Locale} />;
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
