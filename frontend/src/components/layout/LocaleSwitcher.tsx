'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { type Locale } from '@/i18n/config';

interface LocaleSwitcherProps {
  currentLocale: Locale;
  alternateLocale: Locale;
  alternateUrl: string;
}

const localeConfig: Record<Locale, { label: string; flag: string }> = {
  cs: { label: 'Čeština', flag: '🇨🇿' },
  en: { label: 'English', flag: '🇬🇧' },
};

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({
  currentLocale,
  alternateLocale,
  alternateUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const current = localeConfig[currentLocale];
  const alternate = localeConfig[alternateLocale];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-base">{current.flag}</span>
        <span className="uppercase">{currentLocale}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          {/* Current locale (shown as active) */}
          <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 bg-gray-50">
            <span className="text-base">{current.flag}</span>
            <span>{current.label}</span>
          </div>

          {/* Alternate locale (clickable) */}
          <a
            href={alternateUrl}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-base">{alternate.flag}</span>
            <span>{alternate.label}</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;
