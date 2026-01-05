/**
 * Next.js Middleware for Locale Handling and Authentication
 *
 * Handles:
 * - Root URL redirect based on browser Accept-Language header
 * - Passing through requests that already have a locale prefix
 * - Authentication check for intranet routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';

const COOKIE_NAME = 'intranet-session';

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
    // Extract locale from pathname
    const locale = pathname.split('/')[1] as Locale;

    // Check if this is a protected intranet route (not the login page)
    const isIntranetRoute = pathname.includes('/intranet');
    const isLoginPage = pathname.includes('/intranet/login');

    if (isIntranetRoute && !isLoginPage) {
      // Check for authentication cookie
      const sessionCookie = request.cookies.get(COOKIE_NAME);

      if (!sessionCookie?.value) {
        // Redirect to login page with the same locale
        return NextResponse.redirect(
          new URL(`/${locale}/intranet/login/`, request.url)
        );
      }
    }

    // If on login page but already authenticated, redirect to dashboard
    if (isLoginPage) {
      const sessionCookie = request.cookies.get(COOKIE_NAME);

      if (sessionCookie?.value) {
        return NextResponse.redirect(
          new URL(`/${locale}/intranet/`, request.url)
        );
      }
    }

    // Set x-pathname header on request for the layout to read
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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
  // - static files (common extensions)
  // - common auto-requested files
  matcher: [
    '/((?!_next|api|uploads|favicon\\.ico|apple-touch-icon.*|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot|json|xml|txt|map)$).*)',
  ],
};
