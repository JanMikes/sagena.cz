'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Newspaper, Menu } from 'lucide-react';
import { SearchResultGroup, SearchableItem } from '@/types/strapi';
import { normalizeForSearch } from '@/lib/search';

interface SearchResultsProps {
  results: SearchResultGroup[];
  selectedIndex: number;
  onResultClick: () => void;
  query: string;
}

/**
 * Icon component for each result type
 */
const TypeIcon: React.FC<{ type: 'page' | 'news' | 'navigation' }> = ({ type }) => {
  const icons = {
    page: FileText,
    news: Newspaper,
    navigation: Menu,
  };
  const Icon = icons[type];
  return <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />;
};

/**
 * Highlights matching parts of text based on the search query
 * Uses diacritics-insensitive matching to find what to highlight
 */
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim() || !text) {
    return <>{text}</>;
  }

  const normalizedText = normalizeForSearch(text);
  const queryWords = normalizeForSearch(query).split(/\s+/).filter(Boolean);

  // Find all match positions in the original text
  const matches: Array<{ start: number; end: number }> = [];

  for (const word of queryWords) {
    let searchPos = 0;
    while (searchPos < normalizedText.length) {
      const matchIndex = normalizedText.indexOf(word, searchPos);
      if (matchIndex === -1) break;

      matches.push({
        start: matchIndex,
        end: matchIndex + word.length,
      });
      searchPos = matchIndex + 1;
    }
  }

  if (matches.length === 0) {
    return <>{text}</>;
  }

  // Sort and merge overlapping matches
  matches.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const match of matches) {
    if (merged.length === 0 || merged[merged.length - 1].end < match.start) {
      merged.push({ ...match });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, match.end);
    }
  }

  // Build highlighted result
  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const match of merged) {
    // Add non-matching text before this match
    if (match.start > lastEnd) {
      parts.push(text.slice(lastEnd, match.start));
    }
    // Add highlighted match (use original text positions)
    parts.push(
      <mark key={match.start} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {text.slice(match.start, match.end)}
      </mark>
    );
    lastEnd = match.end;
  }

  // Add remaining text after last match
  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd));
  }

  return <>{parts}</>;
};

/**
 * Single search result item
 */
const SearchResultItem: React.FC<{
  item: SearchableItem;
  isSelected: boolean;
  onClick: () => void;
  query: string;
}> = ({ item, isSelected, onClick, query }) => {
  return (
    <Link
      href={item.url}
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-primary-50 text-primary-700'
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      <TypeIcon type={item.type} />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          <HighlightedText text={item.title} query={query} />
        </div>
        {item.description && (
          <div className="text-sm text-gray-500 truncate mt-0.5">
            <HighlightedText text={item.description} query={query} />
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
              >
                <HighlightedText text={tag} query={query} />
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

/**
 * Displays grouped search results
 * Results are grouped by type (pages, news, navigation)
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedIndex,
  onResultClick,
  query,
}) => {
  // Calculate flat index for keyboard navigation
  let currentIndex = 0;

  return (
    <div className="space-y-6">
      {results.map((group) => {
        return (
          <div key={group.type}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.results.map((item) => {
                const itemIndex = currentIndex;
                currentIndex++;

                return (
                  <SearchResultItem
                    key={`${item.type}-${item.id}`}
                    item={item}
                    isSelected={selectedIndex === itemIndex}
                    onClick={onResultClick}
                    query={query}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;

/**
 * Get total number of results across all groups
 */
export function getTotalResultCount(results: SearchResultGroup[]): number {
  return results.reduce((sum, group) => sum + group.results.length, 0);
}

/**
 * Get item at a specific flat index across all groups
 */
export function getResultAtIndex(
  results: SearchResultGroup[],
  index: number
): SearchableItem | null {
  let currentIndex = 0;

  for (const group of results) {
    for (const item of group.results) {
      if (currentIndex === index) {
        return item;
      }
      currentIndex++;
    }
  }

  return null;
}
