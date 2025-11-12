/**
 * Strapi TypeScript Type Definitions
 * Generated based on Strapi schema definitions
 */

// ============================================================================
// Base Strapi Response Types
// ============================================================================

/**
 * Strapi API response wrapper for single entries
 * Note: Strapi returns data directly, NOT wrapped in attributes
 */
export interface StrapiResponse<T> {
  data: T | null;
  meta: Record<string, any>;
}

/**
 * Strapi API response wrapper for collections
 * Note: Strapi returns data directly in array, NOT wrapped in attributes
 * The "attributes" key in schema.json is Strapi internal - API returns properties directly
 */
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi media/file type
 */
export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: Record<string, StrapiMediaFormat>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

// Removed StrapiRelation - Strapi returns relations directly without wrapper

// ============================================================================
// Strapi Components (standalone UI components in dynamic zones)
// ============================================================================

/**
 * Components: Heading
 * Location: strapi/src/components/components/heading.json
 * Usage: Standalone heading component with anchor support
 */
export interface ComponentsHeading {
  id: number;
  __component: 'components.heading';
  text: string;
  type: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  anchor?: string;
}

/**
 * Components: Text
 * Location: strapi/src/components/components/text.json
 * Usage: Rich text content block
 */
export interface ComponentsText {
  id: number;
  __component: 'components.text';
  text: string; // Rich text HTML content
}

// ============================================================================
// Strapi Elements (embedded in other components, never standalone)
// ============================================================================

/**
 * Elements: Link
 * Location: strapi/src/components/elements/link.json
 * Usage: Flexible link component supporting internal pages, external URLs, anchors, and files
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsLink {
  id: number;
  __component?: 'elements.link';
  page?: Page;         // Internal page reference (returned directly, not wrapped)
  anchor?: string | null;  // Anchor/hash for URL (#section)
  url?: string | null;     // External URL
  file?: StrapiMedia;  // File download (returned directly, not wrapped)
}

// ============================================================================
// Dynamic Zone Union Types
// ============================================================================

/**
 * Page content dynamic zone - all components that can appear in page content area
 */
export type PageContentComponent = ComponentsHeading | ComponentsText;

/**
 * Page sidebar dynamic zone - all components that can appear in page sidebar
 */
export type PageSidebarComponent = ComponentsHeading | ComponentsText;

// ============================================================================
// Content Types
// ============================================================================

/**
 * Navigation (Menu)
 * Location: strapi/src/api/navigation/content-types/navigation/schema.json
 * Usage: Navigation items for navbar and footer
 */
export interface Navigation {
  title: string;
  navbar: boolean;  // Show in navbar
  footer: boolean;  // Show in footer
  link: ElementsLink;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Page (Stránka)
 * Location: strapi/src/api/page/content-types/page/schema.json
 * Usage: Core content pages with dynamic zones for content and sidebar
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface Page {
  id?: number;
  documentId?: string;
  title: string;
  slug: string;
  meta_description?: string | null;
  parent?: Page | null; // Parent page for hierarchy (returned directly)
  content: PageContentComponent[]; // Main content area (dynamic zone)
  sidebar?: PageSidebarComponent[]; // Optional sidebar area (dynamic zone)
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// ============================================================================
// Helper Types for Frontend Components
// ============================================================================

/**
 * Resolved link data for frontend use
 * Converts ElementsLink to usable href and target
 */
export interface ResolvedLink {
  href: string;
  target?: '_blank' | '_self';
  download?: boolean;
}

/**
 * Navigation item formatted for frontend Header/Footer
 */
export interface NavigationItem {
  name: string;
  href: string;
  target?: '_blank' | '_self';
}
