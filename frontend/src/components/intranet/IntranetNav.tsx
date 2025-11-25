'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  LogOut,
  Loader2,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import type { Locale } from '@/i18n/config';

interface IntranetNavProps {
  userName?: string;
  activeItem?: string;
  locale: Locale;
}

const translations = {
  cs: {
    news: 'Aktuality',
    calendar: 'Kalendář',
    documents: 'Dokumenty',
    colleagues: 'Kolegové',
    logout: 'Odhlásit se',
  },
  en: {
    news: 'News',
    calendar: 'Calendar',
    documents: 'Documents',
    colleagues: 'Colleagues',
    logout: 'Sign out',
  },
} as const;

const IntranetNav: React.FC<IntranetNavProps> = ({
  userName = 'User',
  activeItem = 'dashboard',
  locale,
}) => {
  const t = translations[locale];
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: t.news, icon: LayoutDashboard, href: `/${locale}/intranet/` },
    { id: 'calendar', label: t.calendar, icon: Calendar, href: '#' },
    { id: 'documents', label: t.documents, icon: FileText, href: '#' },
    { id: 'colleagues', label: t.colleagues, icon: Users, href: '#' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction(locale);
  };

  return (
    <div className="bg-primary-700 text-white shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3 md:py-0 md:h-14">
          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.id === activeItem;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
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
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.id === activeItem;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-3 transition-colors ${
                    isActive
                      ? 'text-white bg-primary-800'
                      : 'text-primary-200 hover:text-white hover:bg-primary-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-[10px] sm:text-xs mt-1">{item.label}</span>
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
