'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/interactive/Modal';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';
import { NavigationItem } from '@/types/strapi';
import { type Locale } from '@/i18n/config';
import { useLocaleContext } from '@/contexts/LocaleContext';

interface HeaderProps {
  navigation?: NavigationItem[];
  currentLocale?: Locale;
  alternateLocale?: Locale;
}

const Header: React.FC<HeaderProps> = ({
  navigation = [],
  currentLocale = 'cs',
  alternateLocale = 'en',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { alternateLocaleUrl } = useLocaleContext();

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
          isScrolled ? '-translate-y-[60px]' : 'translate-y-0'
        }`}
        style={{ contain: 'layout paint' }}
      >
      {/* Row 1: Logo, Phone, CTA - Slides up on scroll via transform */}
      <div
        className={`h-[60px] border-b border-gray-100 transition-[opacity,visibility] duration-200 ${
          isScrolled ? 'opacity-0 invisible' : 'opacity-100 visible'
        }`}
      >
        <div className="container-custom flex items-center justify-between h-full">
          {/* Logo */}
          <Link href={`/${currentLocale}/`} className="flex items-center">
            <img
              src="/logo-color.svg"
              alt="Sagena"
              className="h-12 w-auto"
            />
          </Link>

          {/* Phone & CTA - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+420553030800"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+420 553 030 800</span>
            </a>
            <Button href="#" size="sm">
              Objednat se
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation, Search, Language Switcher - Always visible */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Scaled logo - fades in when scrolled (Desktop) */}
          <Link
            href={`/${currentLocale}/`}
            className={`hidden lg:flex items-center transition-opacity duration-200 ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src="/logo-color.svg"
              alt="Sagena"
              className="h-8 w-auto"
            />
          </Link>

          {/* Scaled logo - fades in when scrolled (Mobile) */}
          <Link
            href={`/${currentLocale}/`}
            className={`lg:hidden flex items-center transition-opacity duration-200 ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src="/logo-color.svg"
              alt="Sagena"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navigation.map((item) => {
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

          {/* Search & Language Switcher */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Vyhledávání"
            >
              <Search className="w-5 h-5" />
            </button>
            <LocaleSwitcher
              currentLocale={currentLocale}
              alternateLocale={alternateLocale}
              alternateUrl={computedAlternateUrl}
            />
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
              {navigation.map((item) => {
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
              <button
                onClick={() => {
                  setSearchModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-left"
                aria-label="Vyhledávání"
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Vyhledávání</span>
              </button>
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
              <a
                href="tel:+420553030800"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">+420 553 030 800</span>
              </a>
              <div className="px-4 pt-2">
                <Button href="#" className="w-full">
                  Objednat se
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        size="lg"
      >
        <div className="py-4">
          {/* Large Search Input */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Co hledáte?"
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Common Searches */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Nejčastější vyhledávání
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group">
                <span className="font-medium">Kardiologie</span>
              </button>
              <button className="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group">
                <span className="font-medium">Neurologie</span>
              </button>
              <button className="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group">
                <span className="font-medium">Ortopedická ordinace</span>
              </button>
              <button className="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group">
                <span className="font-medium">MRI vyšetření</span>
              </button>
              <button className="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group">
                <span className="font-medium">Rehabilitace</span>
              </button>
              <button className="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group">
                <span className="font-medium">Lékárna</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Rychlé odkazy
            </h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Ordinační hodiny
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Objednání pacienta
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Kontakty
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      </header>
    </>
  );
};

export default Header;
