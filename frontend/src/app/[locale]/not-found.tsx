'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SetAlternateLocaleUrl } from '@/contexts/LocaleContext';
import { getAlternateLocale, type Locale } from '@/i18n/config';

const translations = {
  cs: {
    title: 'Stránka nenalezena',
    description: 'Omlouváme se, ale stránka, kterou hledáte, neexistuje.',
    backButton: 'Zpět na hlavní stránku',
  },
  en: {
    title: 'Page not found',
    description: 'We are sorry, but the page you are looking for does not exist.',
    backButton: 'Back to homepage',
  },
};

export default function NotFound() {
  const pathname = usePathname();

  // Extract locale from pathname (e.g., /cs/some-page -> cs)
  const locale = (pathname.split('/')[1] || 'cs') as Locale;
  const validLocale = locale === 'en' ? 'en' : 'cs';
  const t = translations[validLocale];

  const alternateLocale = getAlternateLocale(validLocale);
  const alternateUrl = `/${alternateLocale}/`;

  return (
    <>
      <SetAlternateLocaleUrl url={alternateUrl} />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {t.description}
          </p>
          <Link
            href={`/${validLocale}/`}
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t.backButton}
          </Link>
        </div>
      </div>
    </>
  );
}
