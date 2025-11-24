import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Tag as TagIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  fetchNewsArticleBySlug,
  fetchAllNewsArticleSlugs,
  getStrapiMediaURL,
} from '@/lib/strapi';
import RichText from '@/components/typography/RichText';
import Video from '@/components/content/Video';
import PhotoGallery from '@/components/media/PhotoGallery';
import Documents from '@/components/content/Documents';
import { locales, type Locale } from '@/i18n/config';

interface NewsArticlePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate static params for all news articles and locales
 */
export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await fetchAllNewsArticleSlugs(locale);

    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

/**
 * Generate metadata for news article pages
 */
export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchNewsArticleBySlug(slug, locale);

  if (!article) {
    return {
      title: locale === 'en' ? 'Article not found' : 'Článek nenalezen',
    };
  }

  const imageUrl = article.image?.attributes?.url
    ? getStrapiMediaURL(article.image.attributes.url)
    : undefined;

  return {
    title: `${article.title} | Sagena`,
    description: article.text
      ? article.text.replace(/<[^>]*>/g, '').substring(0, 160)
      : undefined,
    openGraph: imageUrl
      ? {
          images: [imageUrl],
        }
      : undefined,
  };
}

/**
 * News Article Detail Page
 */
export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { locale, slug } = await params;
  const article = await fetchNewsArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const imageUrl = article.image?.attributes?.url
    ? getStrapiMediaURL(article.image.attributes.url)
    : undefined;

  const imageAlt = article.image?.attributes?.alternativeText || article.title;

  const backText = locale === 'en' ? 'Back to news' : 'Zpět na aktuality';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to news button */}
        <div className="mb-6">
          <Link
            href={`/${locale}/aktuality/`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backText}</span>
          </Link>
        </div>

        {/* Article hero */}
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {imageUrl && (
            <div className="relative h-96 bg-gray-200">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          )}

          <div className="p-8">
            {/* Article metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.date || undefined}>
                  {article.date
                    ? new Date(article.date).toLocaleDateString(locale === 'en' ? 'en' : 'cs', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : locale === 'en' ? 'Date not specified' : 'Datum neuvedeno'}
                </time>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full"
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Article content */}
            {article.text && (
              <div className="prose prose-lg max-w-none mb-8">
                <RichText content={article.text} />
              </div>
            )}

            {/* Video section */}
            {article.video && (
              <div className="mb-8">
                <Video
                  youtubeId={article.video.youtube_id}
                  aspectRatio={article.video.aspect_ratio}
                />
              </div>
            )}

            {/* Photo gallery section */}
            {article.gallery && article.gallery.photos && article.gallery.photos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'en' ? 'Photo Gallery' : 'Fotogalerie'}
                </h2>
                <PhotoGallery
                  photos={article.gallery.photos.map((photo) => ({
                    url: photo.image?.url ? getStrapiMediaURL(photo.image.url) : '',
                    alt: photo.image?.alternativeText || '',
                    caption: photo.image?.caption || undefined,
                  }))}
                  columns={
                    article.gallery.columns === 'Two columns' ? 2 :
                    article.gallery.columns === 'Four columns' ? 4 : 3
                  }
                />
              </div>
            )}

            {/* Documents section */}
            {article.documents && article.documents.documents && article.documents.documents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'en' ? 'Documents' : 'Dokumenty'}
                </h2>
                <Documents
                  documents={article.documents.documents.map((doc) => ({
                    name: doc.name,
                    file: doc.file?.url ? getStrapiMediaURL(doc.file.url) : '',
                    extension: doc.file?.ext?.replace('.', '') || '',
                    size: doc.file?.size
                      ? `${(doc.file.size / 1024).toFixed(2)} MB`
                      : undefined,
                  }))}
                  columns={
                    article.documents.columns === 'Single column' ? 1 :
                    article.documents.columns === 'Three columns' ? 3 : 2
                  }
                />
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
