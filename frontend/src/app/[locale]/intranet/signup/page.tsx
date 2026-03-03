import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import SignupForm from '@/components/intranet/SignupForm';

interface SignupPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ secret?: string }>;
}

export default async function SignupPage({ params, searchParams }: SignupPageProps) {
  const { locale } = await params;
  const { secret } = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Verify secret server-side if provided via query param
  const signupSecret = process.env.SIGNUP_SECRET || '';
  const secretPreVerified = !!secret && secret === signupSecret;

  return (
    <SignupForm
      locale={locale as Locale}
      initialSecret={secretPreVerified ? secret : undefined}
      secretPreVerified={secretPreVerified}
    />
  );
}

export async function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'en' }];
}
