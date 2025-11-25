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
// Icon Content Type
// ============================================================================

/**
 * Icon content type
 * Location: strapi/src/api/icon/content-types/icon/schema.json
 * Usage: Reusable icon images for components
 *
 * NOTE: Strapi returns media directly without .attributes wrapper for populated relations
 */
export interface Icon {
  id: number;
  name: string;
  image: {
    id: number;
    name: string;
    alternativeText?: string | null;
    url: string;
    width?: number;
    height?: number;
    mime: string;
  };
}

// ============================================================================
// Tag Content Type
// ============================================================================

/**
 * Tag content type
 * Location: strapi/src/api/tag/content-types/tag/schema.json
 * Usage: Taxonomy tags for news articles and other content
 */
export interface Tag {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// ============================================================================
// News Article Content Type
// ============================================================================

/**
 * News Article content type
 * Location: strapi/src/api/news-article/content-types/news-article/schema.json
 * Usage: News articles collection with rich content (text, video, gallery, documents)
 */
export interface NewsArticle {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  date?: string | null; // ISO date string
  image?: StrapiMedia | null; // Featured image
  text?: string | null; // Rich text HTML
  tags?: Tag[]; // Array of populated tags
  video?: ComponentsVideo | null; // Optional video component
  gallery?: ComponentsPhotoGallery | null; // Optional gallery component
  documents?: ComponentsDocuments | null; // Optional documents component
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Intranet News Article content type
 * Location: strapi/src/api/intranet-news-article/content-types/intranet-news-article/schema.json
 * Usage: Protected intranet news articles collection (same structure as NewsArticle)
 */
export interface IntranetNewsArticle {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  date?: string | null; // ISO date string
  image?: StrapiMedia | null; // Featured image
  text?: string | null; // Rich text HTML
  tags?: Tag[]; // Array of populated tags
  video?: ComponentsVideo | null; // Optional video component
  gallery?: ComponentsPhotoGallery | null; // Optional gallery component
  documents?: ComponentsDocuments | null; // Optional documents component
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

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

/**
 * Components: Alert
 * Location: strapi/src/components/components/alert.json
 * Usage: Alert/notification box with type, title, and optional description
 */
export interface ComponentsAlert {
  id: number;
  __component: 'components.alert';
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  text?: string;
}

/**
 * Components: Links List
 * Location: strapi/src/components/components/links-list.json
 * Usage: List of text links (navigation, quick links, etc.)
 */
export interface ComponentsLinksList {
  id: number;
  __component: 'components.links-list';
  links: ElementsTextLink[];
}

/**
 * Components: Video
 * Location: strapi/src/components/components/video.json
 * Usage: YouTube video embed with configurable aspect ratio
 */
export interface ComponentsVideo {
  id: number;
  __component: 'components.video';
  youtube_id: string;
  aspect_ratio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}

/**
 * Components: Service Cards
 * Location: strapi/src/components/components/service-cards.json
 * Usage: Grid of service cards with icons, titles, descriptions, and optional links
 */
export interface ComponentsServiceCards {
  id: number;
  __component: 'components.service-cards';
  cards: ElementsServiceCard[];
  columns: 'Two columns' | 'Three columns' | 'Four columns';
}

/**
 * Components: Full Width Cards
 * Location: strapi/src/components/components/full-width-cards.json
 * Usage: Vertical list of full-width cards with icons, titles, descriptions, and links
 */
export interface ComponentsFullWidthCards {
  id: number;
  __component: 'components.full-width-cards';
  cards: ElementsFullWidthCard[];
}

/**
 * Components: Documents
 * Location: strapi/src/components/components/documents.json
 * Usage: Grid of downloadable documents with configurable column layout
 */
export interface ComponentsDocuments {
  id: number;
  __component: 'components.documents';
  documents: ElementsDocumentItem[];
  columns: 'Single column' | 'Two columns' | 'Three columns';
}

/**
 * Components: Job Posting
 * Location: strapi/src/components/components/job-posting.json
 * Usage: Job posting card with title, description, department, employment type, location, and CTA link
 */
export interface ComponentsJobPosting {
  id: number;
  __component: 'components.job-posting';
  title: string;
  description: string;
  department: string;
  employment_type: string;
  location: string;
  cta_link: ElementsTextLink;
}

/**
 * Components: Partner Logos
 * Location: strapi/src/components/components/partner-logos.json
 * Usage: Grid of partner/client logos with configurable columns, spacing, and grayscale option
 */
export interface ComponentsPartnerLogos {
  id: number;
  __component: 'components.partner-logos';
  partners: ElementsPartnerLogo[];
  grayscale: boolean;
  columns: 'Two columns' | 'Three columns' | 'Four columns' | 'Five columns' | 'Six columns';
  gap: 'Small spacing' | 'Medium spacing' | 'Large spacing';
}

/**
 * Components: Marketing Arguments
 * Location: strapi/src/components/components/marketing-arguments.json
 * Usage: Grid of marketing arguments with icons or numbers, titles, and descriptions
 */
export interface ComponentsMarketingArguments {
  id: number;
  __component: 'components.marketing-arguments';
  arguments: ElementsMarketingArgument[];
  columns: 'Two columns' | 'Three columns' | 'Four columns';
}

/**
 * Components: Timeline
 * Location: strapi/src/components/components/timeline.json
 * Usage: Vertical timeline with steps showing icons or numbers, titles, and descriptions
 */
export interface ComponentsTimeline {
  id: number;
  __component: 'components.timeline';
  items: ElementsTimelineItem[];
}

/**
 * Components: Section Divider
 * Location: strapi/src/components/components/section-divider.json
 * Usage: Visual separator between sections with customizable spacing, style, and color
 */
export interface ComponentsSectionDivider {
  id: number;
  __component: 'components.section-divider';
  spacing: 'Small spacing' | 'Medium spacing' | 'Large spacing';
  style: 'Solid line' | 'Dashed line' | 'Dotted line' | 'Double line' | 'Gradient line';
  color: 'Gray' | 'Primary blue';
}

/**
 * Components: Slider
 * Location: strapi/src/components/components/slider.json
 * Usage: Slider/carousel component with multiple slides, autoplay settings
 */
export interface ComponentsSlider {
  id: number;
  __component: 'components.slider';
  slides: ElementsSlide[];
  autoplay: boolean;
  autoplay_interval?: number | null;
}

/**
 * Components: Gallery Slider
 * Location: strapi/src/components/components/gallery-slider.json
 * Usage: Photo gallery slider with horizontal scrolling navigation
 */
export interface ComponentsGallerySlider {
  id: number;
  __component: 'components.gallery-slider';
  photos: ElementsPhoto[];
}

/**
 * Components: Photo Gallery
 * Location: strapi/src/components/components/photo-gallery.json
 * Usage: Photo gallery grid with lightbox functionality and configurable columns
 */
export interface ComponentsPhotoGallery {
  id: number;
  __component: 'components.photo-gallery';
  photos: ElementsPhoto[];
  columns: 'Two columns' | 'Three columns' | 'Four columns';
}

/**
 * Components: Directions
 * Location: strapi/src/components/components/directions.json
 * Usage: Navigation directions component with repeatable direction steps
 */
export interface ComponentsDirections {
  id: number;
  __component: 'components.directions';
  title?: string | null;  // Optional title (default: "Jak nás najít")
  instructions: ElementsDirectionStep[];  // Required array of direction steps
  description?: string | null;  // Optional markdown description shown below steps
  style?: 'Style 1' | 'Style 2';  // Style variant (Style 1 = white bg, Style 2 = primary gradient)
}

/**
 * Components: Accordion Sections (wrapper)
 * Location: strapi/src/components/components/accordion-sections.json
 * Usage: Wrapper component containing multiple expandable section items
 */
export interface ComponentsAccordionSections {
  id: number;
  __component: 'components.accordion-sections';
  sections: ElementsExpandableSection[];  // Array of expandable section items
}

/**
 * Elements: Expandable Section
 * Location: strapi/src/components/elements/expandable-section.json
 * Usage: Individual expandable section with title, description, contacts, and file attachments
 */
export interface ElementsExpandableSection {
  id: number;
  __component?: 'elements.expandable-section';
  title: string;  // Required section title
  description?: string | null;  // Optional section content
  default_open?: boolean;  // Default: false (Initially collapsed)
  files?: ElementsFileAttachment[];  // Optional array of file attachments
  contacts?: ComponentsContactCards | null;  // Optional contact cards component
}

/**
 * Components: Button Group
 * Location: strapi/src/components/components/button-group.json
 * Usage: Group of buttons with configurable alignment and spacing
 */
export interface ComponentsButtonGroup {
  id: number;
  __component: 'components.button-group';
  buttons: ElementsButton[];  // Array of button items
  alignment: 'Left aligned' | 'Center aligned' | 'Right aligned';
  spacing: 'Small spacing' | 'Medium spacing' | 'Large spacing';
}

/**
 * Components: Contact Cards
 * Location: strapi/src/components/components/contact-cards.json
 * Usage: Grid of contact cards displaying person information from Person content type
 */
export interface ComponentsContactCards {
  id: number;
  __component: 'components.contact-cards';
  cards: ElementsContactCard[];  // Array of contact card items
}

/**
 * Components: Doctor Profile
 * Location: strapi/src/components/components/doctor-profile.json
 * Usage: Doctor profile card with flip animation, person info, opening hours, and holiday notice
 */
export interface ComponentsDoctorProfile {
  id: number;
  __component: 'components.doctor-profile';
  profile: ElementsDoctorProfile;  // Single doctor profile
}

/**
 * Components: News Articles
 * Location: strapi/src/components/components/news-articles.json
 * Usage: Display filtered list of news articles from news-articles collection
 *
 * Filtering logic:
 * - If tags are selected: show articles that have ANY of the selected tags (OR logic)
 * - If no tags selected: show all articles
 * - Limit+1 articles are queried to detect if "show all" button should appear
 */
export interface ComponentsNewsArticles {
  id: number;
  __component: 'components.news-articles';
  tags?: Tag[];  // Optional tags filter (OR logic)
  limit: number;  // Number of articles to display (default: 3)
  show_all_link?: ElementsTextLink | null;  // Optional "show all" link
}

/**
 * Components: Intranet News Articles
 * Location: strapi/src/components/components/intranet-news-articles.json
 * Usage: Display filtered list of intranet news articles (protected content)
 *
 * Filtering logic:
 * - If tags are selected: show articles that have ANY of the selected tags (OR logic)
 * - If no tags selected: show all articles
 * - Limit+1 articles are queried to detect if "show all" button should appear
 */
export interface ComponentsIntranetNewsArticles {
  id: number;
  __component: 'components.intranet-news-articles';
  tags?: Tag[];  // Optional tags filter (OR logic)
  limit: number;  // Number of articles to display (default: 3)
  show_all_link?: ElementsTextLink | null;  // Optional "show all" link
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

/**
 * Elements: Text Link
 * Location: strapi/src/components/elements/text-link.json
 * Usage: Link with display text, supporting internal pages, external URLs, anchors, files, and disabled state
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsTextLink {
  id: number;
  __component?: 'elements.text-link';
  text: string;        // Display text for the link
  page?: Page;         // Internal page reference (returned directly, not wrapped)
  anchor?: string | null;  // Anchor/hash for URL (#section)
  url?: string | null;     // External URL
  file?: StrapiMedia;  // File download (returned directly, not wrapped)
  disabled?: boolean;  // Whether link is disabled
}

/**
 * Elements: Icon Component
 * Location: strapi/src/components/elements/icon.json
 * Usage: Icon component wrapper containing a relation to Icon content type
 */
export interface ElementsIcon {
  id: number;
  __component?: 'elements.icon';
  icon: Icon;  // Relation to api::icon.icon
}

/**
 * Elements: Service Card
 * Location: strapi/src/components/elements/service-card.json
 * Usage: Individual service card with icon, title, description, and optional link
 *
 * IMPORTANT: Icon is now a component (elements.icon) containing a relation to Icon content type
 */
export interface ElementsServiceCard {
  id: number;
  __component?: 'elements.service-card';
  icon?: ElementsIcon;  // Optional icon component (elements.icon)
  title: string;
  description?: string;
  link?: ElementsTextLink;  // Optional link (not required)
}

/**
 * Elements: Full Width Card
 * Location: strapi/src/components/elements/full-width-card.json
 * Usage: Individual full-width card with icon, title, description, and required link
 *
 * IMPORTANT: Icon is now a component (elements.icon) containing a relation to Icon content type
 */
export interface ElementsFullWidthCard {
  id: number;
  __component?: 'elements.full-width-card';
  icon?: ElementsIcon;  // Optional icon component (elements.icon)
  title: string;
  description: string;
  link: ElementsTextLink;  // Required link
}

/**
 * Elements: Document Item
 * Location: strapi/src/components/elements/document-item.json
 * Usage: Individual document item with human-friendly name and file
 * Note: Strapi v5 returns media directly without .attributes wrapper
 */
export interface ElementsDocumentItem {
  id: number;
  __component?: 'elements.document-item';
  name: string;
  file: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    ext: string;  // e.g., ".pdf", ".svg"
    size: number; // Size in KB (e.g., 1.27)
  };
}

/**
 * Elements: Partner Logo
 * Location: strapi/src/components/elements/partner-logo.json
 * Usage: Individual partner logo with name, logo image, and website URL
 *
 * IMPORTANT: Strapi returns media directly (no .data wrapper)
 */
export interface ElementsPartnerLogo {
  id: number;
  __component?: 'elements.partner-logo';
  name: string;
  logo: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
  url: string;
}

/**
 * Elements: Marketing Argument
 * Location: strapi/src/components/elements/marketing-argument.json
 * Usage: Individual marketing argument with icon or number, title, and description
 *
 * IMPORTANT: Either icon OR number should be provided based on display_type
 */
export interface ElementsMarketingArgument {
  id: number;
  __component?: 'elements.marketing-argument';
  display_type: 'Icon' | 'Number';
  icon?: ElementsIcon;  // Optional icon component (elements.icon) - required if display_type = Icon
  number?: string | null;  // e.g., "15+", "100%" - required if display_type = Number
  title: string;
  description: string;
}

/**
 * Elements: Timeline Item
 * Location: strapi/src/components/elements/timeline-item.json
 * Usage: Individual timeline step with icon or number, title, and description
 *
 * IMPORTANT: Either icon OR number should be provided based on display_type
 */
export interface ElementsTimelineItem {
  id: number;
  __component?: 'elements.timeline-item';
  display_type: 'Icon' | 'Number';
  icon?: Icon;  // Optional icon relation (oneToOne to api::icon.icon) - required if display_type = Icon
  number?: string | null;  // e.g., "1", "2", "3" - required if display_type = Number
  title: string;
  description: string;
}

/**
 * Elements: Slide
 * Location: strapi/src/components/elements/slide.json
 * Usage: Individual slide with title, description, optional link, and images
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsSlide {
  id: number;
  __component?: 'elements.slide';
  title: string;
  description: string;
  link?: ElementsTextLink | null;  // Optional link
  image?: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  } | null;
  background_image?: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  } | null;
}

/**
 * Elements: Photo
 * Location: strapi/src/components/elements/photo.json
 * Usage: Individual photo for photo gallery and gallery slider components
 *
 * IMPORTANT: Strapi returns media directly (no .data wrapper)
 */
export interface ElementsPhoto {
  id: number;
  __component?: 'elements.photo';
  image: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number;
    height?: number;
  };
}

/**
 * Elements: Direction Step
 * Location: strapi/src/components/elements/direction-step.json
 * Usage: Individual direction step with optional icon, floor info, and instruction text
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsDirectionStep {
  id: number;
  __component?: 'elements.direction-step';
  icon?: Icon;  // Optional icon relation (oneToOne to api::icon.icon)
  floor?: string | null;  // Floor information (e.g., "1. patro", "2. patro, č. 215")
  text?: string | null;  // Markdown instruction text (richtext)
}

/**
 * Elements: File Attachment
 * Location: strapi/src/components/elements/file-attachment.json
 * Usage: Individual file attachment with name and file
 *
 * IMPORTANT: Strapi returns media directly (no .data wrapper)
 */
export interface ElementsFileAttachment {
  id: number;
  __component?: 'elements.file-attachment';
  name: string;  // Human-friendly display name
  file: StrapiMedia;  // The actual file (Strapi provides ext, size, url)
}

/**
 * Elements: Button
 * Location: strapi/src/components/elements/button.json
 * Usage: Individual button with link, variant, and size
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsButton {
  id: number;
  __component?: 'elements.button';
  link: ElementsTextLink;  // Required link
  variant: 'Primary' | 'Secondary' | 'Outline' | 'Ghost';
  size: 'Small' | 'Medium' | 'Large';
}

/**
 * Elements: Person
 * Location: strapi/src/components/elements/person.json
 * Usage: Wrapper element that references a Person content type
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsPerson {
  id: number;
  __component?: 'elements.person';
  person?: Person;  // Relation to api::person.person content type
}

/**
 * Elements: Opening Hours
 * Location: strapi/src/components/elements/opening-hours.json
 * Usage: Single day opening hours entry (day + time)
 */
export interface ElementsOpeningHours {
  id: number;
  __component?: 'elements.opening-hours';
  day: string;  // Day name (e.g., "Pondělí")
  time: string;  // Time range (e.g., "8:00 - 16:00")
}

/**
 * Elements: Holiday
 * Location: strapi/src/components/elements/holiday.json
 * Usage: Holiday/vacation period with start and end dates
 */
export interface ElementsHoliday {
  id: number;
  __component?: 'elements.holiday';
  from: string;  // Start date (ISO format)
  to: string;    // End date (ISO format)
}

/**
 * Elements: Contact Card
 * Location: strapi/src/components/elements/contact-card.json
 * Usage: Single contact card referencing a person
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsContactCard {
  id: number;
  __component?: 'elements.contact-card';
  person: ElementsPerson;  // Required person reference
}

/**
 * Elements: Position
 * Location: strapi/src/components/elements/position.json
 * Usage: Single position/title item for doctor profiles
 */
export interface ElementsPosition {
  id: number;
  __component?: 'elements.position';
  title: string;
}

/**
 * Elements: Doctor Profile
 * Location: strapi/src/components/elements/doctor-profile.json
 * Usage: Complete doctor profile with person info, department, positions, contact details, and hours
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsDoctorProfile {
  id: number;
  __component?: 'elements.doctor-profile';
  person: ElementsPerson;  // Required person reference
  ambulanceTitle?: string | null;  // Optional ambulance title
  department: string;  // Required department name
  positions?: ElementsPosition[] | null;  // Optional array of position components
  openingHours?: ElementsOpeningHours[];  // Optional array of opening hours
  holiday?: ElementsHoliday | null;  // Optional holiday period
}

// ============================================================================
// Dynamic Zone Union Types
// ============================================================================

/**
 * Page content dynamic zone - all components that can appear in page content area
 */
export type PageContentComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsLinksList | ComponentsVideo | ComponentsServiceCards | ComponentsFullWidthCards | ComponentsDocuments | ComponentsJobPosting | ComponentsPartnerLogos | ComponentsMarketingArguments | ComponentsTimeline | ComponentsSectionDivider | ComponentsSlider | ComponentsGallerySlider | ComponentsPhotoGallery | ComponentsDirections | ComponentsAccordionSections | ComponentsButtonGroup | ComponentsContactCards | ComponentsDoctorProfile | ComponentsNewsArticles;

/**
 * Page sidebar dynamic zone - all components that can appear in page sidebar
 */
export type PageSidebarComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsLinksList | ComponentsServiceCards;

/**
 * Intranet page content dynamic zone - all components that can appear in intranet page content area
 * Same as PageContentComponent but includes ComponentsIntranetNewsArticles
 */
export type IntranetPageContentComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsLinksList | ComponentsVideo | ComponentsServiceCards | ComponentsFullWidthCards | ComponentsDocuments | ComponentsJobPosting | ComponentsPartnerLogos | ComponentsMarketingArguments | ComponentsTimeline | ComponentsSectionDivider | ComponentsSlider | ComponentsGallerySlider | ComponentsPhotoGallery | ComponentsDirections | ComponentsAccordionSections | ComponentsButtonGroup | ComponentsContactCards | ComponentsDoctorProfile | ComponentsNewsArticles | ComponentsIntranetNewsArticles;

/**
 * Intranet page sidebar dynamic zone - all components that can appear in intranet page sidebar
 */
export type IntranetPageSidebarComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsLinksList;

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
 * Person photo type when populated with specific fields
 * Strapi v5 returns media directly without .attributes wrapper when using populate with fields
 */
export interface PersonPhoto {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

/**
 * Person
 * Location: strapi/src/api/person/content-types/person/schema.json
 * Usage: Person information (doctors, staff, contacts)
 *
 * IMPORTANT: Strapi returns media directly (no .data wrapper)
 * When photo is populated with specific fields, it returns PersonPhoto (direct url access)
 */
export interface Person {
  id: number;
  documentId?: string;
  name: string;  // Required full name
  email?: string | null;  // Optional email address
  phone?: string | null;  // Optional phone number
  photo?: PersonPhoto | null;  // Optional photo (images only) - direct url access when populated
  gender?: 'man' | 'woman' | null;  // Optional gender
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Page Localization reference
 * Used in the localizations field to reference other locale versions
 */
export interface PageLocalization {
  id: number;
  documentId?: string;
  locale: string;
  slug: string;
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
  localizations?: PageLocalization[]; // Other locale versions of this page
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Intranet Page Localization reference
 * Used in the localizations field to reference other locale versions
 */
export interface IntranetPageLocalization {
  id: number;
  documentId?: string;
  locale: string;
  slug: string;
}

/**
 * Intranet Page
 * Location: strapi/src/api/intranet-page/content-types/intranet-page/schema.json
 * Usage: Protected intranet pages with dynamic zones for content and sidebar
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface IntranetPage {
  id?: number;
  documentId?: string;
  title: string;
  slug: string;
  meta_description?: string | null;
  parent?: IntranetPage | null; // Parent page for hierarchy (returned directly)
  content: IntranetPageContentComponent[]; // Main content area (dynamic zone)
  sidebar?: IntranetPageSidebarComponent[]; // Optional sidebar area (dynamic zone)
  locale?: string;
  localizations?: IntranetPageLocalization[]; // Other locale versions of this page
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
