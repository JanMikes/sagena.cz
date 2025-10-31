'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Search, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<'cs' | 'en'>('cs');

  const navigation = [
    { name: 'Komponenty', href: '/komponenty' },
    { name: 'S panelem', href: '/s-panelem' },
    { name: 'Intranet', href: '/intranet' },
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
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
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
            <Button href="/objednat" size="sm">
              Objednat se
            </Button>
          </div>

          {/* Mobile logo only */}
          <div className="lg:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg">
                <span className="text-lg font-bold text-white">S</span>
              </div>
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
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Sagena</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search & Language Switcher */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
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
                <Button href="/objednat" className="w-full">
                  Objednat se
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
