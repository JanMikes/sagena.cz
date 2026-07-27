'use client';

import React from 'react';
import { SearchX } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
  locale?: string;
}

const translations = {
  cs: {
    title: 'Nic jsme nenašli',
    description: (query: string) => `Pro „${query}" neexistují žádné výsledky.`,
    tips: ['Zkontrolujte pravopis', 'Zkuste jiné klíčové slovo', 'Použijte obecnější výraz'],
  },
  en: {
    title: 'No results found',
    description: (query: string) => `There are no results for "${query}".`,
    tips: ['Check the spelling', 'Try a different keyword', 'Use a more general term'],
  },
} as const;

/**
 * Empty state displayed when search returns no results
 * Shows helpful tips for refining the search
 */
const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query, locale = 'cs' }) => {
  const t = translations[locale as keyof typeof translations] || translations.cs;

  return (
    <div className="py-12 text-center">
      <SearchX className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {t.title}
      </h3>
      <p className="text-gray-500 mb-6">
        {t.description(query)}
      </p>
      <ul className="text-sm text-gray-500 space-y-1">
        {t.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchEmptyState;
