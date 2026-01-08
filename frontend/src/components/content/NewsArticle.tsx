import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Tag as TagIcon } from 'lucide-react';
import Image from 'next/image';

/**
 * News Article Props
 * Supports both legacy format and Strapi format
 */
interface NewsArticleProps {
  title: string;
  date: string;
  text?: string; // Optional plain text excerpt or rich HTML
  image?: string; // Image URL
  imageAlt?: string; // Optional alt text for image
  tags?: Array<{ name: string; slug: string }>; // Optional tags
  readMoreUrl: string;
  readMoreText?: string;
  compact?: boolean; // Compact mode for sidebar (smaller, horizontal layout)
}

const NewsArticle: React.FC<NewsArticleProps> = ({
  title,
  date,
  text,
  image,
  imageAlt,
  tags,
  readMoreUrl,
  readMoreText = 'Číst více',
  compact = false,
}) => {
  // Strip HTML tags from rich text for excerpt if needed
  const getPlainTextExcerpt = (html: string): string => {
    // Simple HTML tag stripping for excerpt display
    return html.replace(/<[^>]*>/g, '').substring(0, 200);
  };

  const excerpt = text ? (text.includes('<') ? getPlainTextExcerpt(text) : text) : null;

  // Compact layout for sidebar - vertical card matching standard layout style
  if (compact) {
    return (
      <article className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {image && (
          <Link href={readMoreUrl} className="block relative h-32 bg-gray-200 overflow-hidden">
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </Link>
        )}
        <div className="p-4 pb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={date}>{new Date(date).toLocaleDateString('cs')}</time>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {tags.slice(0, 1).map((tag) => (
                  <span
                    key={tag.slug}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-full"
                  >
                    <TagIcon className="w-2.5 h-2.5" />
                    {tag.name}
                  </span>
                ))}
                {tags.length > 1 && (
                  <span className="text-xs text-gray-500">+{tags.length - 1}</span>
                )}
              </div>
            )}
          </div>
          <Link href={readMoreUrl}>
            <h3 className="text-base font-bold text-primary-600 mb-2 leading-tight hover:text-primary-700 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          {excerpt && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          )}
          <div className="absolute bottom-0 right-0">
            <Link
              href={readMoreUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-tl-lg rounded-br-xl hover:brightness-95 transition-all group"
              style={{ backgroundColor: '#a0bfdf' }}
            >
              <span className="text-white font-medium text-sm">{readMoreText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Standard layout
  return (
    <article className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <Link href={readMoreUrl} className="block relative h-48 bg-gray-200 overflow-hidden">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      <div className="p-6 pb-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <time dateTime={date}>{new Date(date).toLocaleDateString('cs')}</time>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.slug}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-xs text-gray-500">+{tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
        <Link href={readMoreUrl}>
          <h3 className="text-lg font-bold text-primary-600 mb-4 leading-tight hover:text-primary-700 transition-colors">
            {title}
          </h3>
        </Link>
        {excerpt && (
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="absolute bottom-0 right-0">
          <Link
            href={readMoreUrl}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-tl-lg rounded-br-xl hover:brightness-95 transition-all group"
            style={{ backgroundColor: '#a0bfdf' }}
          >
            <span className="text-white font-medium text-sm">{readMoreText}</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsArticle;
