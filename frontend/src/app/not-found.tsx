import Link from 'next/link';
import Header from '@/components/layout/Header';
import { LocaleProvider } from '@/contexts/LocaleContext';

export default function NotFound() {
  return (
    <LocaleProvider>
      <Header
        navigation={[]}
        currentLocale="cs"
        alternateLocale="en"
      />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Stránka nenalezena
          </h2>
          <p className="text-gray-600 mb-8">
            Omlouváme se, ale stránka, kterou hledáte, neexistuje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cs/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Česky – Hlavní stránka
            </Link>
            <Link
              href="/en/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              English – Homepage
            </Link>
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
}
