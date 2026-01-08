'use client';

import React from 'react';
import { SearchX } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
}

/**
 * Empty state displayed when search returns no results
 * Shows helpful tips for refining the search
 */
const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => {
  return (
    <div className="py-12 text-center">
      <SearchX className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nic jsme nenašli
      </h3>
      <p className="text-gray-500 mb-6">
        Pro &ldquo;{query}&rdquo; neexistují žádné výsledky.
      </p>
      <ul className="text-sm text-gray-500 space-y-1">
        <li>Zkontrolujte pravopis</li>
        <li>Zkuste jiné klíčové slovo</li>
        <li>Použijte obecnější výraz</li>
      </ul>
    </div>
  );
};

export default SearchEmptyState;
