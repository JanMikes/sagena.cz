'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Search as SearchIcon, Home } from 'lucide-react';
import Button from '@/components/ui/Button';
import SearchModal from '@/components/search/SearchModal';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';
import { NavigationItem, Search, SearchableItem } from '@/types/strapi';
import { type Locale } from '@/i18n/config';
import { useLocaleContext } from '@/contexts/LocaleContext';
import { useReservationModal } from '@/contexts/ReservationModalContext';

interface HeaderProps {
  navigation?: NavigationItem[];
  currentLocale?: Locale;
  alternateLocale?: Locale;
  searchData?: Search | null;
  searchableContent?: SearchableItem[];
  hideNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  navigation = [],
  currentLocale = 'cs',
  alternateLocale = 'en',
  searchData,
  searchableContent = [],
  hideNavigation = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const { alternateLocaleUrl } = useLocaleContext();
  const { openModal: openReservationModal } = useReservationModal();

  // Global keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute alternate URL: use context URL or swap locale in current path
  const computedAlternateUrl = alternateLocaleUrl || pathname.replace(`/${currentLocale}`, `/${alternateLocale}`);

  // Normalize path for comparison (remove trailing slash for consistency)
  const normalizePath = (path: string) => {
    if (path === '/') return path;
    return path.endsWith('/') ? path.slice(0, -1) : path;
  };

  // Use IntersectionObserver instead of scroll events for better performance
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting (scrolled out of expanded zone), header is scrolled
        setIsScrolled(!entry.isIntersecting);
      },
      {
        // Expand observation zone by 200px above viewport - sentinel exits when scrolled 200px
        rootMargin: '200px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel must be OUTSIDE sticky header to scroll with page content */}
      <div ref={sentinelRef} aria-hidden="true" className="h-0 w-0 overflow-hidden" />
      <header
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isScrolled ? 'lg:-translate-y-[60px]' : 'translate-y-0'
        }`}
      >
      {/* Animated Logo Container - spans both rows (Desktop only) */}
      <div className="hidden lg:block absolute inset-x-0 top-0 bottom-0 pointer-events-none z-10">
        <div className="container-custom relative h-full">
          <Link
            href={`/${currentLocale}/`}
            className={`pointer-events-auto flex items-center absolute left-0 bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isScrolled
                ? 'top-[68px] h-[48px] py-1 px-2'
                : 'top-2 h-[116px] py-3 px-3'
            }`}
          >
            <img
              src="/logo-color.svg"
              alt="Sagena"
              className="h-full w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Row 1: Phone, CTA, Search, Language - Slides up on scroll via transform (Desktop only) */}
      <div
        className={`hidden lg:block h-[60px] border-b border-gray-100 transition-[opacity,visibility] duration-200 ${
          isScrolled ? 'opacity-0 invisible' : 'opacity-100 visible'
        }`}
      >
        <div className="container-custom flex items-center justify-end h-full">
          {/* Phone & CTA - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+420553030800"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+420 553 030 800</span>
            </a>
            <Button onClick={openReservationModal} size="sm">
              Objednat se
            </Button>
            {/* Search & Language Switcher */}
            {!hideNavigation && (
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                aria-label="Vyhledávání"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            )}
            <LocaleSwitcher
              currentLocale={currentLocale}
              alternateLocale={alternateLocale}
              alternateUrl={computedAlternateUrl}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Navigation - Always visible */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Mobile: Logo + Phone (always visible) */}
          <div className="lg:hidden flex items-center space-x-3">
            <Link href={`/${currentLocale}/`} className="flex items-center">
              <img
                src="/logo-color.svg"
                alt="Sagena"
                className="h-8 w-auto"
              />
            </Link>
            <a
              href="tel:+420553030800"
              className="flex items-center space-x-1.5 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">553 030 800</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-end">
            <Link
              href={`/${currentLocale}/`}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                normalizePath(pathname) === `/${currentLocale}` || normalizePath(pathname) === `/${currentLocale}/`
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
              }`}
              aria-label={currentLocale === 'cs' ? 'Domů' : 'Home'}
            >
              <Home className="w-5 h-5" />
            </Link>
            {!hideNavigation && navigation.map((item) => {
              const isActive = normalizePath(pathname) === normalizePath(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - CSS Grid for GPU-accelerated animation */}
        <div
          className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
            mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col space-y-2 py-4 border-t border-gray-200">
              <Link
                href={`/${currentLocale}/`}
                className={`flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  normalizePath(pathname) === `/${currentLocale}` || normalizePath(pathname) === `/${currentLocale}/`
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>{currentLocale === 'cs' ? 'Domů' : 'Home'}</span>
              </Link>
              {!hideNavigation && navigation.map((item) => {
                const isActive = normalizePath(pathname) === normalizePath(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {!hideNavigation && (
                <button
                  onClick={() => {
                    setSearchModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-left"
                  aria-label="Vyhledávání"
                >
                  <SearchIcon className="w-5 h-5" />
                  <span className="font-medium">Vyhledávání</span>
                </button>
              )}
              {/* Mobile Language Switcher */}
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {currentLocale === 'cs' ? 'Jazyk' : 'Language'}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                    <span>{currentLocale === 'cs' ? '🇨🇿' : '🇬🇧'}</span>
                    <span>{currentLocale === 'cs' ? 'Čeština' : 'English'}</span>
                  </span>
                  <a
                    href={computedAlternateUrl}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{alternateLocale === 'cs' ? '🇨🇿' : '🇬🇧'}</span>
                    <span>{alternateLocale === 'cs' ? 'Čeština' : 'English'}</span>
                  </a>
                </div>
              </div>
              <div className="px-4 pt-2">
                <Button onClick={() => { openReservationModal(); setMobileMenuOpen(false); }} className="w-full">
                  Objednat se
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      </header>

      {/* Search Modal - Must be outside header to avoid transform issues */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        locale={currentLocale}
        searchData={searchData}
        searchableContent={searchableContent}
      />
    </>
  );
};

export default Header;
