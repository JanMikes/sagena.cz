/**
 * Next.js Middleware for Locale Handling
 *
 * Handles:
 * - Root URL redirect based on browser Accept-Language header
 * - Passing through requests that already have a locale prefix
 */

import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';

/**
 * Parse Accept-Language header and find the best matching locale
 */
function getPreferredLocale(acceptLanguage: string): Locale {
  // Parse Accept-Language header (e.g., "cs,en-US;q=0.9,en;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0].toLowerCase(), // Extract primary language code
        q: qValue ? parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  // Find the first matching locale
  for (const { code } of languages) {
    if (locales.includes(code as Locale)) {
      return code as Locale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect root to preferred locale
  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLocale = getPreferredLocale(acceptLanguage);
    return NextResponse.redirect(
      new URL(`/${preferredLocale}/`, request.url)
    );
  }

  // Redirect other paths without locale to default locale
  // This handles cases like /about -> /cs/about
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  );
}

export const config = {
  // Match all paths except:
  // - _next (Next.js internals)
  // - api routes
  // - static files (files with extensions)
  matcher: ['/((?!_next|api|favicon.ico|uploads|.*\\..*).*)'],
};
