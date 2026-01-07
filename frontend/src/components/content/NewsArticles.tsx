import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsArticle from './NewsArticle';

interface NewsArticleData {
  slug: string;
  title: string;
  date: string;
  image?: string;
  imageAlt?: string;
  tags?: Array<{ name: string; slug: string }>;
}

interface NewsArticlesProps {
  articles: NewsArticleData[];
  showAllLink?: {
    text: string;
    url: string;
  } | null;
  showAllButtonVisible?: boolean; // Whether to show the "show all" button
  locale?: string; // Current locale for URL generation
  basePath?: string; // Base path for article links (e.g., "/cs/intranet/aktuality" for intranet)
  compact?: boolean; // Compact mode for sidebar (single column, smaller cards)
}

/**
 * NewsArticles Component
 * Displays a list of news article cards with optional "show all" link
 *
 * Used in:
 * - Dynamic zone component (components.news-articles)
 * - News listing page (/aktuality)
 */
const NewsArticles: React.FC<NewsArticlesProps> = ({
  articles,
  showAllLink,
  showAllButtonVisible = false,
  locale = 'cs',
  basePath,
  compact = false,
}) => {
  if (!articles || articles.length === 0) {
    const emptyMessage = locale === 'en' ? 'No articles to display.' : 'Žádné články k zobrazení.';
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Use provided basePath or default to public aktuality route
  const articleBasePath = basePath || `/${locale}/aktuality`;

  // Grid classes: single column for compact/sidebar, responsive grid otherwise
  const gridClasses = compact
    ? 'flex flex-col gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div className={gridClasses}>
        {articles.map((article) => (
          <NewsArticle
            key={article.slug}
            title={article.title}
            date={article.date}
            image={article.image}
            imageAlt={article.imageAlt}
            tags={article.tags}
            readMoreUrl={`${articleBasePath}/${article.slug}/`}
            compact={compact}
          />
        ))}
      </div>

      {showAllButtonVisible && showAllLink && (
        <div className={compact ? 'flex justify-center mt-4' : 'flex justify-center mt-8'}>
          <Link
            href={showAllLink.url}
            className={compact
              ? 'inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors'
              : 'inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg'
            }
          >
            <span>{showAllLink.text}</span>
            <ArrowRight className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsArticles;
