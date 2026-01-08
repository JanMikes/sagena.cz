'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import Modal from '@/components/interactive/Modal';
import SearchResults, { getTotalResultCount, getResultAtIndex } from './SearchResults';
import SearchEmptyState from './SearchEmptyState';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { Search, SearchableItem } from '@/types/strapi';
import { resolveTextLink } from '@/lib/strapi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  searchData?: Search | null;
  searchableContent?: SearchableItem[];
}

/**
 * Search modal with live search functionality
 *
 * Features:
 * - Diacritics-insensitive search (Czech language support)
 * - 300ms debouncing to prevent excessive filtering
 * - Loading spinner during data fetch
 * - Grouped results (Pages, News, Navigation)
 * - Keyboard navigation (arrows, enter, escape)
 * - Quick links when no query
 */
const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  locale,
  searchData,
  searchableContent = [],
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounce the query
  const debouncedQuery = useDebounce(query, 300);

  // Use the search hook with pre-fetched data (no API calls)
  const { results, totalCount } = useSearch(debouncedQuery, searchableContent);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const total = getTotalResultCount(results);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(total, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + Math.max(total, 1)) % Math.max(total, 1));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedItem = getResultAtIndex(results, selectedIndex);
          if (selectedItem) {
            router.push(selectedItem.url);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, selectedIndex, router, onClose]
  );

  // Handle result click
  const handleResultClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Minimum 2 characters required for search
  const hasMinimumChars = debouncedQuery.trim().length >= 2;

  // Determine what to show (data is pre-fetched, so no loading state)
  const showResults = hasMinimumChars && results.length > 0;
  const showEmpty = hasMinimumChars && results.length === 0;
  const showQuickLinks = !hasMinimumChars;

  // Show debounce indicator (query changed but debounced hasn't caught up, min 2 chars)
  const isDebouncing = query !== debouncedQuery && query.trim().length >= 2;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="py-4" onKeyDown={handleKeyDown}>
        {/* Search Input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Co hledáte?"
            className="w-full pl-14 pr-12 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
            autoComplete="off"
          />
          {/* Debounce indicator */}
          {isDebouncing && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="max-h-[50vh] overflow-y-auto -mx-2 px-2">
            <SearchResults
              results={results}
              selectedIndex={selectedIndex}
              onResultClick={handleResultClick}
              query={debouncedQuery}
            />
          </div>
        )}

        {/* Empty state */}
        {showEmpty && <SearchEmptyState query={debouncedQuery} />}

        {/* Quick Links (when no query) */}
        {showQuickLinks && searchData?.quick_links && searchData.quick_links.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Rychlé odkazy
            </h3>
            <div className="space-y-1">
              {searchData.quick_links.map((link, index) => {
                const resolved = resolveTextLink(link, locale);
                if (resolved.disabled) return null;
                return resolved.external ? (
                  <a
                    key={link.id || index}
                    href={resolved.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    {link.text}
                  </a>
                ) : (
                  <Link
                    key={link.id || index}
                    href={resolved.url}
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Keyboard hints */}
        {showResults && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">↑↓</kbd> navigace
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">Enter</kbd> otevřít
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">Esc</kbd> zavřít
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
