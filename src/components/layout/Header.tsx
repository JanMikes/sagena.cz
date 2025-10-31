'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Search, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/interactive/Modal';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<'cs' | 'en'>('cs');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const navigation = [
    { name: 'Komponenty', href: '/' },
    { name: 'S panelem', href: '/s-panelem/' },
    { name: 'Intranet', href: '/intranet/' },
  ];

  // Handle scroll to collapse first row
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'cs' ? 'en' : 'cs');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <nav className="container-custom">
        {/* Row 1: Logo, Phone, CTA - Collapses on scroll */}
        <div
          className={`flex items-center justify-between border-b border-gray-100 transition-all duration-300 overflow-hidden ${
            isScrolled ? 'max-h-0 py-0' : 'max-h-24 py-3'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/logo-color.svg"
              alt="Sagena"
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-gray-900">Sagena</span>
          </Link>

          {/* Phone & CTA */}
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

          {/* Mobile logo only */}
          <div className="lg:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo-color.svg"
                alt="Sagena"
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Row 2: Navigation, Search, Language Switcher - Always visible */}
        <div className="flex items-center justify-between h-16">
          {/* Logo (visible when scrolled) */}
          <Link
            href="/"
            className={`flex items-center space-x-2 transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } hidden lg:flex`}
          >
            <img
              src="/logo-color.svg"
              alt="Sagena"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">Sagena</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
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
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Přepnout jazyk"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{currentLang}</span>
            </button>
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
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
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-left"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium uppercase">{currentLang} / {currentLang === 'cs' ? 'en' : 'cs'}</span>
              </button>
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
        )}
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
  );
};

export default Header;
