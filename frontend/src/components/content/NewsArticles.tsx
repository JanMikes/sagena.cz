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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsArticle
            key={article.slug}
            title={article.title}
            date={article.date}
            image={article.image}
            imageAlt={article.imageAlt}
            tags={article.tags}
            readMoreUrl={`${articleBasePath}/${article.slug}/`}
          />
        ))}
      </div>

      {showAllButtonVisible && showAllLink && (
        <div className="flex justify-center mt-8">
          <Link
            href={showAllLink.url}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            <span>{showAllLink.text}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsArticles;
