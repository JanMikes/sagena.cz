'use client';

import * as Sentry from "@sentry/nextjs";
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Chyba</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Něco se pokazilo
        </h2>
        <p className="text-gray-600 mb-8">
          Omlouváme se, došlo k neočekávané chybě.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Zkusit znovu
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}
