import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound, redirect } from 'next/navigation';
import { getSession, type SessionRejectedReason } from '@/lib/auth';
import LoginForm from '@/components/intranet/LoginForm';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reason?: string }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { reason } = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Redirect confirmed users to dashboard
  const { session } = await getSession();
  if (session) {
    redirect(`/${locale}/intranet/`);
  }

  return <LoginForm locale={locale as Locale} rejectedReason={reason as SessionRejectedReason | undefined} />;
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
