'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Tag {
  name: string;
  slug: string;
}

interface TagFilterProps {
  allTags: Tag[];
  selectedTagSlugs: string[];
  locale?: string;
}

/**
 * TagFilter Component
 * Client-side interactive tag filtering with URL state management
 *
 * Updates URL query params when tags are toggled:
 * - ?tags=tag1,tag2 when tags selected
 * - No params when no tags selected
 */
const TagFilter: React.FC<TagFilterProps> = ({
  allTags,
  selectedTagSlugs,
  locale = 'cs',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTagToggle = (tagSlug: string) => {
    const currentTags = new Set(selectedTagSlugs);

    if (currentTags.has(tagSlug)) {
      currentTags.delete(tagSlug);
    } else {
      currentTags.add(tagSlug);
    }

    // Build new URL with updated tags
    const params = new URLSearchParams(searchParams.toString());

    if (currentTags.size > 0) {
      params.set('tags', Array.from(currentTags).join(','));
    } else {
      params.delete('tags');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Use router.push for client-side navigation (preserves scroll position)
    router.push(newUrl, { scroll: false });
  };

  const clearAllTags = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tags');
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  if (allTags.length === 0) {
    return null;
  }

  const filterLabel = locale === 'en' ? 'Filter:' : 'Filtrovat:';
  const clearLabel = locale === 'en' ? 'Clear all' : 'Zrušit vše';

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">
          {filterLabel}
        </span>

        {allTags.map((tag) => {
          const isSelected = selectedTagSlugs.includes(tag.slug);
          return (
            <button
              key={tag.slug}
              onClick={() => handleTagToggle(tag.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={isSelected}
            >
              {tag.name}
            </button>
          );
        })}

        {selectedTagSlugs.length > 0 && (
          <button
            onClick={clearAllTags}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default TagFilter;
