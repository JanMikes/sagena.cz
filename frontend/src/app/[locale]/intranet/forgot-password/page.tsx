import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ForgotPasswordForm from '@/components/intranet/ForgotPasswordForm';

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const { session } = await getSession();
  if (session) {
    redirect(`/${locale}/intranet/`);
  }

  return <ForgotPasswordForm locale={locale as Locale} />;
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
