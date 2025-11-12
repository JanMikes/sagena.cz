/**
 * Catch-all Dynamic Route for Strapi Pages
 *
 * This route handles all dynamic pages from Strapi CMS.
 * It fetches page content by slug and renders it using DynamicZone components.
 *
 * Features:
 * - Static generation at build time
 * - Support for nested page hierarchies
 * - Optional sidebar rendering
 * - Breadcrumb navigation
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPageBySlug, fetchAllPageSlugs, hasSidebar } from '@/lib/strapi';
import DynamicZone from '@/components/strapi/DynamicZone';
import SidePanel from '@/components/layout/SidePanel';
import Breadcrumb from '@/components/navigation/Breadcrumb';

interface PageProps {
  params: {
    slug: string[];
  };
}

/**
 * Generate static params for all Strapi pages at build time
 */
export async function generateStaticParams() {
  try {
    const slugs = await fetchAllPageSlugs();

    return slugs.map((slug) => ({
      slug: slug.split('/').filter(Boolean), // Convert "parent/child" to ["parent", "child"]
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.slug.join('/');
  const page = await fetchPageBySlug(slug);

  if (!page) {
    return {
      title: 'Stránka nenalezena',
    };
  }

  return {
    title: `${page.title} | Sagena`,
    description: page.meta_description || page.title,
  };
}

/**
 * Page component
 */
export default async function Page({ params }: PageProps) {
  const slug = params.slug.join('/');
  const page = await fetchPageBySlug(slug);

  // Show 404 if page not found
  if (!page) {
    notFound();
  }

  const showSidebar = hasSidebar(page.sidebar);

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Úvod', href: '/' },
    { label: page.title, href: `/${slug}` },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Page Content Layout */}
        {showSidebar ? (
          /* Two-column layout with sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Breadcrumb Navigation */}
              <Breadcrumb items={breadcrumbItems} />

              <DynamicZone components={page.content} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SidePanel>
                <DynamicZone components={page.sidebar || []} />
              </SidePanel>
            </div>
          </div>
        ) : (
          /* Full-width layout without sidebar */
          <div className="space-y-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={breadcrumbItems} />

            <div className="max-w-4xl">
              <DynamicZone components={page.content} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
