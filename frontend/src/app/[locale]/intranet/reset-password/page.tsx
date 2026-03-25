import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ResetPasswordForm from '@/components/intranet/ResetPasswordForm';

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}

export default async function ResetPasswordPage({ params, searchParams }: ResetPasswordPageProps) {
  const { locale } = await params;
  const { code } = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const { session } = await getSession();
  if (session) {
    redirect(`/${locale}/intranet/`);
  }

  return <ResetPasswordForm locale={locale as Locale} code={code || ''} />;
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
