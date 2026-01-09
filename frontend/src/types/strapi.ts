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
 * NOTE: Strapi v5 returns media directly without .attributes wrapper for populated relations
 */
export interface StrapiMedia {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, StrapiMediaFormat>;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url: string;
  previewUrl?: string;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
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
// Registration Content Type
// ============================================================================

/**
 * Registration content type
 * Location: strapi/src/api/registration/content-types/registration/schema.json
 * Usage: Patient registration submissions from the public form
 */
export interface Registration {
  id: number;
  documentId?: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string | null;
  submittedAt?: string | null; // ISO datetime string
  createdAt?: string;
  updatedAt?: string;
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
  text?: string | null;
  type?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | null;
  anchor?: string | null;
}

/**
 * Components: Text
 * Location: strapi/src/components/components/text.json
 * Usage: Rich text content block
 */
export interface ComponentsText {
  id: number;
  __component: 'components.text';
  text?: string | null; // Rich text HTML content
}

/**
 * Components: Alert
 * Location: strapi/src/components/components/alert.json
 * Usage: Alert/notification box with type, title, and optional description
 */
export interface ComponentsAlert {
  id: number;
  __component: 'components.alert';
  type?: 'info' | 'success' | 'warning' | 'error' | null;
  title?: string | null;
  text?: string | null;
}

/**
 * Components: Popup
 * Location: strapi/src/components/components/popup.json
 * Usage: Page load popup/modal with optional title, description, and CTA link
 */
export interface ComponentsPopup {
  id: number;
  __component: 'components.popup';
  title?: string | null;
  description?: string | null;
  link?: ElementsTextLink | null;
  rememberDismissal?: boolean | null;
}

/**
 * Components: Image
 * Location: strapi/src/components/components/image.json
 * Usage: Simple image component with media from library
 */
export interface ComponentsImage {
  id: number;
  __component: 'components.image';
  image?: StrapiMedia | null;
}

/**
 * Components: Links List
 * Location: strapi/src/components/components/links-list.json
 * Usage: List of text links (navigation, quick links, etc.)
 */
export interface ComponentsLinksList {
  id: number;
  __component: 'components.links-list';
  links?: ElementsTextLink[] | null;
  layout?: 'Grid' | 'Rows' | null;
}

/**
 * Components: Video
 * Location: strapi/src/components/components/video.json
 * Usage: YouTube video embed with configurable aspect ratio
 */
export interface ComponentsVideo {
  id: number;
  __component: 'components.video';
  youtube_id?: string | null;
  aspect_ratio?: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1' | null;
}

/**
 * Components: Service Cards
 * Location: strapi/src/components/components/service-cards.json
 * Usage: Grid of service cards with icons, titles, descriptions, and optional links
 */
export interface ComponentsServiceCards {
  id: number;
  __component: 'components.service-cards';
  cards?: ElementsServiceCard[] | null;
  columns?: 'Two columns' | 'Three columns' | 'Four columns' | 'Five columns' | null;
  text_align?: 'Left aligned' | 'Center aligned' | null;
  card_clickable?: boolean | null;
  background?: 'None' | 'Primary light' | 'Neutral light' | null;
}

/**
 * Components: Full Width Cards
 * Location: strapi/src/components/components/full-width-cards.json
 * Usage: Vertical list of full-width cards with icons, titles, descriptions, and links
 */
export interface ComponentsFullWidthCards {
  id: number;
  __component: 'components.full-width-cards';
  cards?: ElementsFullWidthCard[] | null;
  background?: 'None' | 'Primary light' | 'Neutral light' | null;
}

/**
 * Components: Documents
 * Location: strapi/src/components/components/documents.json
 * Usage: Grid of downloadable documents with configurable column layout
 */
export interface ComponentsDocuments {
  id: number;
  __component: 'components.documents';
  documents?: ElementsDocumentItem[] | null;
  columns?: 'Single column' | 'Two columns' | 'Three columns' | null;
}

/**
 * Components: Job Posting
 * Location: strapi/src/components/components/job-posting.json
 * Usage: Job posting card with title, description, department, employment type, location, and CTA link
 */
export interface ComponentsJobPosting {
  id: number;
  __component: 'components.job-posting';
  title?: string | null;
  description?: string | null;
  department?: string | null;
  employment_type?: string | null;
  location?: string | null;
  cta_link?: ElementsTextLink | null;
}

/**
 * Components: Partner Logos
 * Location: strapi/src/components/components/partner-logos.json
 * Usage: Grid of partner/client logos with configurable columns, spacing, and grayscale option
 */
export interface ComponentsPartnerLogos {
  id: number;
  __component: 'components.partner-logos';
  partners?: ElementsPartnerLogo[] | null;
  grayscale?: boolean | null;
  columns?: 'Two columns' | 'Three columns' | 'Four columns' | 'Five columns' | 'Six columns' | null;
  gap?: 'Small spacing' | 'Medium spacing' | 'Large spacing' | null;
}

/**
 * Components: Marketing Arguments
 * Location: strapi/src/components/components/marketing-arguments.json
 * Usage: Grid of marketing arguments with icons or numbers, titles, and descriptions
 */
export interface ComponentsMarketingArguments {
  id: number;
  __component: 'components.marketing-arguments';
  arguments?: ElementsMarketingArgument[] | null;
  columns?: 'Two columns' | 'Three columns' | 'Four columns' | null;
  background?: 'None' | 'Primary light' | 'Neutral light' | null;
}

/**
 * Components: Timeline
 * Location: strapi/src/components/components/timeline.json
 * Usage: Vertical timeline with steps showing icons or numbers, titles, and descriptions
 */
export interface ComponentsTimeline {
  id: number;
  __component: 'components.timeline';
  items?: ElementsTimelineItem[] | null;
}

/**
 * Components: Section Divider
 * Location: strapi/src/components/components/section-divider.json
 * Usage: Visual separator between sections with customizable spacing, style, and color
 */
export interface ComponentsSectionDivider {
  id: number;
  __component: 'components.section-divider';
  spacing?: 'Small spacing' | 'Medium spacing' | 'Large spacing' | null;
  style?: 'Solid line' | 'Dashed line' | 'Dotted line' | 'Double line' | 'Gradient line' | null;
  color?: 'Gray' | 'Primary blue' | null;
}

/**
 * Components: Slider
 * Location: strapi/src/components/components/slider.json
 * Usage: Slider/carousel component with multiple slides, autoplay settings
 */
export interface ComponentsSlider {
  id: number;
  __component: 'components.slider';
  slides?: ElementsSlide[] | null;
  autoplay?: boolean | null;
  autoplay_interval?: number | null;
}

/**
 * Components: Page Header
 * Location: strapi/src/components/components/page-header.json
 * Usage: Optional page header with slider and/or service cards
 *
 * Layout: Slider renders first (100% width), service-cards overlaps below
 * with negative margin-top when both are present.
 */
export interface ComponentsPageHeader {
  id: number;
  __component?: 'components.page-header';
  slider?: ComponentsSlider | null;
  service_cards?: ComponentsServiceCards | null;
}

/**
 * Components: Gallery Slider
 * Location: strapi/src/components/components/gallery-slider.json
 * Usage: Photo gallery slider with horizontal scrolling navigation
 */
export interface ComponentsGallerySlider {
  id: number;
  __component: 'components.gallery-slider';
  photos?: ElementsPhoto[] | null;
}

/**
 * Components: Photo Gallery
 * Location: strapi/src/components/components/photo-gallery.json
 * Usage: Photo gallery grid with lightbox functionality and configurable columns
 */
export interface ComponentsPhotoGallery {
  id: number;
  __component: 'components.photo-gallery';
  photos?: ElementsPhoto[] | null;
  columns?: 'Two columns' | 'Three columns' | 'Four columns' | null;
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
  instructions?: ElementsDirectionStep[] | null;  // Array of direction steps
  description?: string | null;  // Optional markdown description shown below steps
  style?: 'Style 1' | 'Style 2' | null;  // Style variant (Style 1 = white bg, Style 2 = primary gradient)
}

/**
 * Components: Accordion Sections (wrapper)
 * Location: strapi/src/components/components/accordion-sections.json
 * Usage: Wrapper component containing multiple expandable section items
 */
export interface ComponentsAccordionSections {
  id: number;
  __component: 'components.accordion-sections';
  sections?: ElementsExpandableSection[] | null;  // Array of expandable section items
}

/**
 * Elements: Expandable Section
 * Location: strapi/src/components/elements/expandable-section.json
 * Usage: Individual expandable section with title, description, contacts, and file attachments
 */
export interface ElementsExpandableSection {
  id: number;
  __component?: 'elements.expandable-section';
  title?: string | null;  // Section title
  description?: string | null;  // Optional section content
  default_open?: boolean | null;  // Default: false (Initially collapsed)
  files?: ElementsDocumentItem[] | null;  // Optional array of file attachments
  contacts?: ComponentsContactCards | null;  // Optional contact cards component
  photos?: ElementsPhoto[] | null;  // Optional array of photos for gallery
  gallery_columns?: 'Two columns' | 'Three columns' | 'Four columns' | null;  // Gallery column configuration
}

/**
 * Components: Button Group
 * Location: strapi/src/components/components/button-group.json
 * Usage: Group of buttons with configurable alignment and spacing
 */
export interface ComponentsButtonGroup {
  id: number;
  __component: 'components.button-group';
  buttons?: ElementsButton[] | null;  // Array of button items
  alignment?: 'Left aligned' | 'Center aligned' | 'Right aligned' | null;
  spacing?: 'Small spacing' | 'Medium spacing' | 'Large spacing' | null;
}

/**
 * Components: Contact Cards
 * Location: strapi/src/components/components/contact-cards.json
 * Usage: Grid of contact cards displaying person information from Person content type
 */
export interface ComponentsContactCards {
  id: number;
  __component: 'components.contact-cards';
  cards?: ElementsContactCard[] | null;  // Array of contact card items
}


/**
 * Elements: Ambulance Doctor
 * Location: strapi/src/components/elements/ambulance-doctor.json
 * Usage: Doctor wrapper with optional function override for ambulance-item
 */
export interface ElementsAmbulanceDoctor {
  id: number;
  __component?: 'elements.ambulance-doctor';
  doctor?: Doctor | null;  // oneToOne relation to Doctor
  function_override?: string | null;  // Optional override for doctor's function
}

/**
 * Elements: Ambulance Item
 * Location: strapi/src/components/elements/ambulance-item.json
 * Usage: Individual ambulance item referencing an Ambulance collection with optional overrides
 */
export interface ElementsAmbulanceItem {
  id: number;
  __component?: 'elements.ambulance-item';
  ambulance?: Ambulance | null;  // oneToOne relation to Ambulance collection
  description?: string | null;  // Rich text override (use ambulance description if not set)
  doctors?: ElementsAmbulanceDoctor[] | null;  // Optional doctors with function overrides
  documents?: ElementsDocumentItem[] | null;  // Repeatable document items
  button?: ElementsTextLink | null;  // Optional CTA button
}

/**
 * Components: Ambulances
 * Location: strapi/src/components/components/ambulances.json
 * Usage: Grid of ambulance cards with flip animation for opening hours
 */
export interface ComponentsAmbulances {
  id: number;
  __component: 'components.ambulances';
  items?: ElementsAmbulanceItem[] | null;  // Multiple ambulance items
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
  tags?: Tag[] | null;  // Optional tags filter (OR logic)
  limit?: number | null;  // Number of articles to display (default: 3)
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
  tags?: Tag[] | null;  // Optional tags filter (OR logic)
  limit?: number | null;  // Number of articles to display (default: 3)
  show_all_link?: ElementsTextLink | null;  // Optional "show all" link
}

/**
 * Components: Location Cards
 * Location: strapi/src/components/components/location-cards.json
 * Usage: Grid of location cards with contact info, configurable columns and background
 */
export interface ComponentsLocationCards {
  id: number;
  __component: 'components.location-cards';
  cards?: ElementsLocationCard[] | null;
  columns?: 'Two columns' | 'Three columns' | 'Four columns' | null;
  background?: 'None' | 'Primary light' | 'Neutral light' | null;
}

/**
 * Components: Badges
 * Location: strapi/src/components/components/badges.json
 * Usage: Collection of badge items with configurable alignment
 */
export interface ComponentsBadges {
  id: number;
  __component: 'components.badges';
  badges?: ElementsBadge[] | null;
  alignment?: 'Left aligned' | 'Center aligned' | 'Right aligned' | null;
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
  text?: string | null;        // Display text for the link
  page?: Page | null;         // Internal page reference (returned directly, not wrapped)
  anchor?: string | null;  // Anchor/hash for URL (#section)
  url?: string | null;     // External URL
  file?: StrapiMedia | null;  // File download (returned directly, not wrapped)
  disabled?: boolean | null;  // Whether link is disabled
}

/**
 * Elements: Links Section
 * Location: strapi/src/components/elements/links-section.json
 * Usage: Grouped links with a heading (used in footer)
 */
export interface ElementsLinksSection {
  id: number;
  __component?: 'elements.links-section';
  heading?: string | null;
  links?: ElementsTextLink[] | null;
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
  icon?: ElementsIcon | null;  // Optional icon component (elements.icon)
  title?: string | null;
  description?: string | null;
  link?: ElementsTextLink | null;  // Optional link (not required)
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
  icon?: ElementsIcon | null;  // Optional icon component (elements.icon)
  title?: string | null;
  description?: string | null;
  link?: ElementsTextLink | null;
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
  name?: string | null;
  file?: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    ext: string;  // e.g., ".pdf", ".svg"
    size: number; // Size in KB (e.g., 1.27)
  } | null;
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
  name?: string | null;
  logo?: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  } | null;
  url?: string | null;
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
  display_type?: 'Icon' | 'Number' | null;
  icon?: ElementsIcon | null;  // Optional icon component (elements.icon) - required if display_type = Icon
  number?: string | null;  // e.g., "15+", "100%" - required if display_type = Number
  title?: string | null;
  description?: string | null;
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
  display_type?: 'Icon' | 'Number' | null;
  icon?: Icon | null;  // Optional icon relation (oneToOne to api::icon.icon) - required if display_type = Icon
  number?: string | null;  // e.g., "1", "2", "3" - required if display_type = Number
  title?: string | null;
  description?: string | null;
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
  title?: string | null;
  description?: string | null;
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
  image_position?: 'left' | 'right' | null;
  text_position?: 'top' | 'middle' | 'bottom' | null;
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
  image?: {
    id: number;
    documentId: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number;
    height?: number;
  } | null;
}

/**
 * Elements: Location Card
 * Location: strapi/src/components/elements/location-card.json
 * Usage: Individual location card with contact info and optional link
 *
 * IMPORTANT: Strapi returns media directly (no .data wrapper)
 */
export interface ElementsLocationCard {
  id: number;
  __component?: 'elements.location-card';
  title?: string | null;
  photo?: {
    id: number;
    documentId?: string;
    url: string;
    name: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  } | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  link?: ElementsTextLink | null;
  map_link?: string | null;
  opening_hours?: ElementsOpeningHours[] | null;
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
 * Elements: Button
 * Location: strapi/src/components/elements/button.json
 * Usage: Individual button with link, variant, and size
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsButton {
  id: number;
  __component?: 'elements.button';
  link?: ElementsTextLink | null;
  variant?: 'Primary' | 'Secondary' | 'Outline' | 'Ghost' | null;
  size?: 'Small' | 'Medium' | 'Large' | null;
}

/**
 * Elements: Badge
 * Location: strapi/src/components/elements/badge.json
 * Usage: Single badge with label, variant, and size
 */
export interface ElementsBadge {
  id: number;
  __component?: 'elements.badge';
  label?: string | null;
  variant?: 'Primary' | 'Secondary' | 'Success' | 'Info' | 'Warning' | 'Danger' | null;
  size?: 'Small' | 'Medium' | null;
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
  day?: string | null;  // Day name (e.g., "Pondělí")
  time?: string | null;  // Time range (e.g., "8:00 - 16:00")
}

/**
 * Elements: Ambulance Opening Hours Entry
 * Location: strapi/src/components/elements/ambulance-opening-hours-entry.json
 * Usage: Single day entry with morning and afternoon times for ambulance
 */
export interface ElementsAmbulanceOpeningHoursEntry {
  id: number;
  __component?: 'elements.ambulance-opening-hours-entry';
  day?: string | null;  // Day name (e.g., "Pondělí")
  time?: string | null;  // Morning time (e.g., "8:00 - 12:00")
  time_afternoon?: string | null;  // Afternoon time (e.g., "13:00 - 16:00")
}

/**
 * Elements: Ambulance Opening Hours
 * Location: strapi/src/components/elements/ambulance-opening-hours.json
 * Usage: Titled group of opening hours for ambulance
 */
export interface ElementsAmbulanceOpeningHours {
  id: number;
  __component?: 'elements.ambulance-opening-hours';
  title?: string | null;  // Group title (e.g., "Vyšetření", "Konzultace")
  hours?: ElementsAmbulanceOpeningHoursEntry[] | null;  // Day entries
}

/**
 * Elements: Holiday
 * Location: strapi/src/components/elements/holiday.json
 * Usage: Holiday/vacation period with start and end dates
 */
export interface ElementsHoliday {
  id: number;
  __component?: 'elements.holiday';
  from?: string | null;  // Start date (ISO format)
  to?: string | null;    // End date (ISO format)
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
  person?: ElementsPerson | null;  // Person reference
  funkce?: string | null;  // Optional role/function
}


// ============================================================================
// Dynamic Zone Union Types
// ============================================================================

/**
 * Page content dynamic zone - all components that can appear in page content area
 */
export type PageContentComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsPopup | ComponentsLinksList | ComponentsVideo | ComponentsServiceCards | ComponentsFullWidthCards | ComponentsDocuments | ComponentsJobPosting | ComponentsPartnerLogos | ComponentsMarketingArguments | ComponentsTimeline | ComponentsSectionDivider | ComponentsSlider | ComponentsGallerySlider | ComponentsPhotoGallery | ComponentsDirections | ComponentsAccordionSections | ComponentsButtonGroup | ComponentsContactCards | ComponentsNewsArticles | ComponentsLocationCards | ComponentsBadges | ComponentsImage | ComponentsAmbulances;

/**
 * Page sidebar dynamic zone - all components that can appear in page sidebar
 */
export type PageSidebarComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsLinksList | ComponentsServiceCards | ComponentsButtonGroup | ComponentsContactCards | ComponentsDocuments | ComponentsSectionDivider | ComponentsTimeline | ComponentsSlider | ComponentsPhotoGallery | ComponentsBadges | ComponentsNewsArticles | ComponentsImage;

/**
 * Intranet page content dynamic zone - all components that can appear in intranet page content area
 * Same as PageContentComponent but includes ComponentsIntranetNewsArticles
 */
export type IntranetPageContentComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsPopup | ComponentsLinksList | ComponentsVideo | ComponentsServiceCards | ComponentsFullWidthCards | ComponentsDocuments | ComponentsJobPosting | ComponentsPartnerLogos | ComponentsMarketingArguments | ComponentsTimeline | ComponentsSectionDivider | ComponentsSlider | ComponentsGallerySlider | ComponentsPhotoGallery | ComponentsDirections | ComponentsAccordionSections | ComponentsButtonGroup | ComponentsContactCards | ComponentsNewsArticles | ComponentsIntranetNewsArticles | ComponentsLocationCards | ComponentsBadges | ComponentsImage;

/**
 * Intranet page sidebar dynamic zone - all components that can appear in intranet page sidebar
 */
export type IntranetPageSidebarComponent = ComponentsHeading | ComponentsText | ComponentsAlert | ComponentsLinksList | ComponentsButtonGroup | ComponentsContactCards | ComponentsDocuments | ComponentsSectionDivider | ComponentsServiceCards | ComponentsTimeline | ComponentsSlider | ComponentsPhotoGallery | ComponentsBadges | ComponentsNewsArticles | ComponentsIntranetNewsArticles | ComponentsImage;

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
 * Footer (single type)
 * Location: strapi/src/api/footer/content-types/footer/schema.json
 * Usage: Global footer content with contact info, links sections, and insurance logos
 */
export interface Footer {
  id?: number;
  documentId?: string;
  text?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  contact_address?: string | null;
  links?: ElementsLinksSection[];
  insurance_logos?: ComponentsPartnerLogos | null;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Homepage (single type)
 * Location: strapi/src/api/homepage/content-types/homepage/schema.json
 * Usage: Homepage configuration with relation to a Page for content
 */
export interface Homepage {
  id: number;
  documentId?: string;
  page?: {
    id: number;
    slug: string;
  } | null;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Search (single type)
 * Location: strapi/src/api/search/content-types/search/schema.json
 * Usage: Search modal quick links configuration
 */
export interface Search {
  id?: number;
  documentId?: string;
  quick_links?: ElementsTextLink[];
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
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
 * Doctor
 * Location: strapi/src/api/doctor/content-types/doctor/schema.json
 * Usage: Doctor information for ambulances
 */
export interface Doctor {
  id: number;
  documentId?: string;
  name: string;  // Required full name
  email?: string | null;
  phone?: string | null;
  photo?: PersonPhoto | null;
  gender?: 'man' | 'woman' | null;
  function?: string | null;  // Position, role, or specialization
  holidays?: ElementsHoliday[] | null;  // Multiple holiday periods
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Nurse
 * Location: strapi/src/api/nurse/content-types/nurse/schema.json
 * Usage: Nurse information for ambulances
 */
export interface Nurse {
  id: number;
  documentId?: string;
  name: string;  // Required full name
  photo?: PersonPhoto | null;
  gender?: 'man' | 'woman' | null;
  holidays?: ElementsHoliday[] | null;  // Multiple holiday periods
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Elements: Phone
 * Location: strapi/src/components/elements/phone.json
 * Usage: Single phone number for repeatable phone lists
 */
export interface ElementsPhone {
  id: number;
  __component?: 'elements.phone';
  phone?: string | null;
}

/**
 * Ambulance
 * Location: strapi/src/api/ambulance/content-types/ambulance/schema.json
 * Usage: Ambulance/clinic information with doctors, nurses, and opening hours
 */
export interface Ambulance {
  id: number;
  documentId?: string;
  name: string;  // Required ambulance name
  phone?: string | null;
  email?: string | null;
  doctors?: Doctor[] | null;  // oneToMany relation
  nurses?: Nurse[] | null;  // oneToMany relation
  opening_hours?: ElementsAmbulanceOpeningHours[] | null;  // Grouped opening hours with title
  description?: string | null;  // Rich text
  nurses_email?: string | null;
  nurses_phones?: ElementsPhone[] | null;
  createdAt?: string;
  updatedAt?: string;
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
  header?: ComponentsPageHeader | null; // Optional page header with slider and/or service cards
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

// ============================================================================
// Search Types
// ============================================================================

/**
 * Searchable item for client-side search
 * Pre-normalized text allows fast filtering without repeated normalization
 */
export interface SearchableItem {
  id: number;
  type: 'page' | 'news' | 'navigation';
  title: string;
  slug: string;
  url: string;
  description?: string;
  tags?: string[];
  normalizedText: string; // Pre-normalized searchable text
}

/**
 * Grouped search results by content type
 */
export interface SearchResultGroup {
  type: 'page' | 'news' | 'navigation';
  label: string;
  results: SearchableItem[];
}
