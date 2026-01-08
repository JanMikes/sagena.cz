'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import type { Locale } from '@/i18n/config';
import type { NavigationItem } from '@/types/strapi';

interface IntranetNavProps {
  userName?: string;
  locale: Locale;
  navigation: NavigationItem[];
}

const translations = {
  cs: {
    logout: 'Odhlásit se',
    registrations: 'Registrace',
  },
  en: {
    logout: 'Sign out',
    registrations: 'Registrations',
  },
} as const;

const IntranetNav: React.FC<IntranetNavProps> = ({
  userName = 'User',
  locale,
  navigation,
}) => {
  const t = translations[locale];
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction(locale);
  };

  // Normalize path for comparison (remove trailing slash for consistency)
  const normalizePath = (path: string) => {
    if (path === '/') return path;
    return path.endsWith('/') ? path.slice(0, -1) : path;
  };

  // Static navigation items (always visible)
  const staticNavItems: NavigationItem[] = [
    {
      name: t.registrations,
      href: `/${locale}/intranet/registrace/`,
    },
  ];

  // Combine CMS navigation with static items
  const allNavItems = [...navigation, ...staticNavItems];

  return (
    <div className="bg-primary-700 text-white shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3 md:py-0 md:h-14">
          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {allNavItems.map((item) => {
              const isActive = normalizePath(pathname) === normalizePath(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.target}
                  className={`flex items-center px-3 lg:px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{userName}</p>
              </div>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xs md:text-sm font-semibold">
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-primary-100 hover:text-white hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50"
              aria-label={t.logout}
              title={t.logout}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-primary-600">
          <div className={`grid gap-1 ${allNavItems.length <= 4 ? `grid-cols-${allNavItems.length}` : 'grid-cols-4'}`}>
            {allNavItems.map((item) => {
              const isActive = normalizePath(pathname) === normalizePath(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.target}
                  className={`flex flex-col items-center justify-center py-3 transition-colors ${
                    isActive
                      ? 'text-white bg-primary-800'
                      : 'text-primary-200 hover:text-white hover:bg-primary-600'
                  }`}
                >
                  <span className="text-[10px] sm:text-xs text-center">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default IntranetNav;
