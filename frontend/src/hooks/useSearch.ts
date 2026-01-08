'use client';

import { useMemo } from 'react';
import { SearchableItem, SearchResultGroup } from '@/types/strapi';
import { normalizeForSearch, matchesSearch } from '@/lib/search';

interface UseSearchResult {
  results: SearchResultGroup[];
  totalCount: number;
}

/**
 * Custom hook for client-side search functionality
 *
 * Features:
 * - Filters pre-fetched searchable content (no API calls)
 * - Uses diacritics-insensitive matching
 * - Groups results by content type
 *
 * @param query - Search query (should be debounced)
 * @param searchIndex - Pre-fetched searchable items from server
 */
export function useSearch(
  query: string,
  searchIndex: SearchableItem[]
): UseSearchResult {
  // Filter and group results (minimum 2 characters required)
  const { results, totalCount } = useMemo(() => {
    if (!query.trim() || query.trim().length < 2 || searchIndex.length === 0) {
      return { results: [], totalCount: 0 };
    }

    const normalizedQuery = normalizeForSearch(query);

    // Filter matching items
    const matched = searchIndex.filter((item) =>
      matchesSearch(item.normalizedText, normalizedQuery)
    );

    // Group by type
    const groups: Record<string, SearchableItem[]> = {
      page: [],
      news: [],
      navigation: [],
    };

    for (const item of matched) {
      groups[item.type].push(item);
    }

    // Create result groups with labels (only non-empty groups)
    const groupLabels: Record<string, string> = {
      page: 'Stránky',
      news: 'Aktuality',
      navigation: 'Menu',
    };

    const resultGroups: SearchResultGroup[] = [];

    for (const type of ['page', 'news', 'navigation'] as const) {
      if (groups[type].length > 0) {
        resultGroups.push({
          type,
          label: groupLabels[type],
          results: groups[type],
        });
      }
    }

    return {
      results: resultGroups,
      totalCount: matched.length,
    };
  }, [query, searchIndex]);

  return {
    results,
    totalCount,
  };
}
