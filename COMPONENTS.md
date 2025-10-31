# Sagena Website Component Analysis

This document contains a comprehensive analysis of the Sagena healthcare website (www.sagena.cz) to inform the design and development of the new website.

---

## Table of Contents

1. [Business Value & Content Analysis](#business-value--content-analysis)
2. [Design Direction & Tone](#design-direction--tone)
3. [Complete Component Inventory](#complete-component-inventory)
4. [Content Patterns & Structure](#content-patterns--structure)
5. [Technical Implementation Details](#technical-implementation-details)
6. [Recommended Component System Architecture](#recommended-component-system-architecture)
7. [Design System Recommendations](#design-system-recommendations)

---

## Business Value & Content Analysis

### Healthcare Services Provided

Sagena is a comprehensive multi-specialty healthcare center offering:

#### Medical Specialties (20+ departments)
- Allergology & Immunology
- Angiology & Vascular Surgery
- Cardiology
- Child Neurology
- Diabetology
- Gynecology & Obstetrics
- Internal Medicine
- Neurology & Neurosurgery
- Ophthalmology
- ENT (Otolaryngology)
- Orthopedics
- Pulmonary Function
- Rheumatology
- Urology
- Colorectal Surgery
- Ultrasound diagnostics

#### Rehabilitation Services (12+ types)
- Individual Physical Therapy
- Pediatric Rehabilitation
- Lymphatic Drainage
- Electrotherapy
- Hydrotherapy
- Massage Therapy
- Cryotherapy
- Shockwave Treatment
- Mechanotherapy
- Spa Care

#### Diagnostic Services
- MRI (Magnetic Resonance Imaging)
- Various diagnostic testing

#### Additional Services
- Pharmacy
- Infusion Center
- Preventive Health Programs

### Value Proposition

"Sagena has provided healthcare to tens of thousands of satisfied clients"

The center emphasizes:
- Modern equipment and facilities
- Comprehensive care under one roof
- Qualified medical professionals
- Appointment-based system for quality care
- Partnership with major Czech health insurance providers

---

## Design Direction & Tone

### Visual & Emotional Characteristics

**Professional yet Approachable**
- Serious medical credibility balanced with patient-friendly warmth
- Trust-building through established reputation

**Clean & Minimal**
- Spacious layouts with breathing room
- Limited color palette focused on blues and neutrals
- Content clarity prioritized over decorative elements

**Accessible & Clear**
- Straightforward language
- Clear navigation structure
- Appointment and contact information prominently displayed

**Trust-Building Elements**
- "Tens of thousands of satisfied clients" messaging
- Insurance partner logos displayed
- Modern equipment emphasized
- Professional credentials highlighted

### Color Philosophy

- **Primary**: Professional healthcare blue
- **Neutrals**: White backgrounds, dark gray text
- **Accent**: Standard link blue
- Clean, minimal color use throughout

### Typography Approach

- Sans-serif fonts for modern, accessible feel
- Clear heading hierarchy
- Readable body text sizing
- Professional credential formatting

---

## Complete Component Inventory

### 1. Navigation Components

#### Header Components
- **Main Logo**: SVG format with color and monochrome variants
- **Language Switcher**: Czech/English toggle
- **Top Utility Links**: Doctor registration, contact info
- **Primary Phone Number**: Prominent display (+420 553 030 800)

#### Menu Systems
- **Multi-Level Dropdown Menu**:
  - 8 main categories
  - 40+ subcategories
  - Nested structure for medical specialties
  - Collapsible/expandable on interaction
- **Sticky Secondary Header**: Appears/disappears on scroll (breakpoint: 767px)
- **Mobile Hamburger Menu**: Slide-toggle functionality
- **Breadcrumb Navigation**: Standard hierarchy trail (Homepage > Section > Page)
- **Footer Navigation**: Mirrors main menu structure

### 2. Hero/Banner Components

#### Video Hero
- **Full-Viewport Background Video**: MP4 format for desktop
- **Responsive Image Fallback**: Static image for mobile (breakpoint: 767px)
- **Dynamic Height Calculations**: JavaScript-driven viewport sizing
- **Text Overlay**:
  - Main tagline: "Center of health"
  - Descriptive subtitle: "Sagena has provided healthcare to tens of thousands of satisfied clients"

#### Quick Access Navigation
- **Four Primary Service Buttons** overlaid on hero:
  - Offices
  - Rehabilitation
  - Magnetic Resonance
  - Pharmacy

### 3. Content Display Components

#### Service Listing Components
- **Vertical List Format**: Text-based navigation links
- **Alphabetical Organization**: 24+ medical specialties listed A-Z
- **Hierarchical Categorization**: Services grouped by type
- **Clickable Service Links**: Direct to detail pages
- **Minimalist Approach**: Text-only on overview pages (no cards or heavy visuals)

#### Service Detail Page Structure
Each specialty/service page includes:

**Page Header**
- Page title (H2 heading)
- Breadcrumb navigation

**Service Description**
- Introductory paragraph
- Detailed procedure explanations
- Bulleted service lists: specific treatments/diagnostics offered

**Doctor Profiles Section**
- Doctor names with credentials (MUDr., Mgr., Bc., DiS.)
- Professional photos (on some pages)
- Vacation notices and availability updates
- Specialization information

**Location & Contact Block ("Kde nás najdete")**
- Building location (Sagena I, Sagena II)
- Floor number
- Full address: 8. pěšího pluku 2450/2380, Frýdek-Místek
- Department phone number
- Department email address

**Photo Galleries**
- Multiple images with lightGallery integration
- Thumbnail format (approximately 317x211px)
- Click to expand/lightbox functionality
- Equipment photos, facility images, procedure demonstrations

**Booking Instructions**
- Prominent appointment requirement notices
- "Před každou návštěvou se prosím objednejte emailem nebo telefonicky"
- Contact methods emphasized

**Collaboration Information**
- Partner facilities and external services
- Cross-referral information

#### Team Display Components
- **Simple List Format**: No visual cards
- **Professional Categorization**: Grouped by role/specialty
- **Name + Credentials Only**: Minimal information per person
- **No Individual Photos**: Text-only listings
- **Centralized Contact**: No per-person contact info

### 4. News/Blog Components

#### Article Listing Page
- **Vertical List Structure**: Chronological order
- **Article Preview Card**:
  - Clickable headline
  - Publication date + time (format: "25. října 2024, 09:04")
  - Optional thumbnail image (approximately 600x600px)
  - No body text excerpt shown
- **Traditional Pagination**: Numbered page links (1 2 3 4)
- **No Featured/Highlight Treatment**: All articles equal visual weight

#### Article Detail Page
- Article title as main heading
- Publication date and time
- Featured image (when present)
- Article body with formatted text
- Related content navigation
- Breadcrumb trail

### 5. Form Components

#### Newsletter Signup
- **Email Input Field**: With validation
- **Confirm Button**: Primary action button
- **Instructional Text**: "Be informed about the news and changes at Sagena"
- **Placement**: Footer area

#### Login Form
- **Username Field**
- **Password Field**
- **Login Button**
- **Modal/Dialog Presentation**

#### Cookie Consent Manager
- **Modal Dialog Interface**
- **Granular Category Settings**:
  - Technical cookies
  - Analytical cookies
  - Marketing cookies
  - Personalized cookies
  - Security cookies
- **Three Action Buttons**:
  - "Allow everything"
  - "Settings"
  - "Reject all"
- **Category Descriptions**: Expandable explanations per cookie type

#### Contact Methods
Note: No dedicated contact form visible on site. Booking emphasizes:
- Email addresses prominently displayed
- Phone numbers with department extensions
- Instructions to contact via email/phone for appointments

### 6. Button Components

Multiple button variants observed:
- **Primary Action Buttons**: Confirm, Allow, Login
- **Secondary Buttons**: Settings
- **Reject/Cancel Buttons**: Reject all
- **Navigation Buttons**: Quick access hero buttons
- **Consistent Styling**: Unified design language throughout

### 7. Modal/Dialog Components

- **Cookie Settings Panel**: Multi-option configuration dialog
- **Warning Popups**: Important notices (e.g., appointment cancellations)
- **Login Dialog**: Authentication modal
- **Animations**: fadeIn/fadeOut jQuery-based transitions

### 8. Media Components

#### Photo Gallery (lightGallery)
- **Thumbnail Grid**: Multiple images per page
- **Thumbnail Size**: Approximately 317x211px
- **Lightbox Expansion**: Click to enlarge
- **Usage**: Equipment photos, facility images, procedure demonstrations
- **Integration**: Throughout specialty and service pages

#### Image Formats
- **Doctor Photos**: Professional headshots on some specialty pages
- **Facility Photos**: Clinical spaces, equipment, waiting areas
- **News Thumbnails**: Square format for article previews (approximately 600x600px)
- **Logo Images**: SVG insurance provider logos

### 9. Footer Components

#### Multi-Section Footer Structure

**1. Newsletter Section**
- Heading + description
- Email input + confirm button

**2. Insurance Partner Logos**
- Horizontal grid of 6 logos
- VZP, ČPZP, RBP, ZPMV, OZP, VOZP

**3. Footer Navigation**
- Main service category links
- Mirrors primary navigation structure

**4. Legal/Compliance Links**
- "Podmínky používání" (Terms of Use)
- Accessibility Declaration
- Sitemap link

**5. Copyright Information**
- Year © Sagena
- CMS attribution (wmPUBLIC)
- Web development credit

### 10. Information Display Components

#### Opening Hours Display
**Weekly Schedule Format**:
- Monday-Thursday: 7.30 - 17.00
- Friday: 7.30 - 15.00
- Closed weekends
- Simple text presentation

#### Contact Information Blocks
- **Address Display**: Building name, street address, postal code, city
- **Phone Numbers**: Main number plus department extensions
- **Email Addresses**: Department-specific
  - ambulance@sagena.cz
  - praktiksestra@sagena.cz
  - gynekologie@sagena.cz
  - lekarna@sagena.cz

#### Important Notices/Alerts
- **Prominent Warning Boxes**: Appointment requirements
- **Doctor Availability Updates**: Vacation notices, schedule changes
- **Booking Reminders**: "Před každou návštěvou se prosím objednejte"

#### Pricing Information
- **PDF Download Links**: External documents for price lists
- **Service Categorization**: By treatment type
- **No Embedded Pricing Tables**: Relies on downloadable resources
- **Separate Pricing Pages**: Dedicated sections for rehabilitation, MRI, etc.

### 11. List/Accordion Components

- **Collapsible Navigation Menus**: Slide toggle functionality
- **Bulleted Service Lists**: Procedures and treatments enumerated
- **Enumerated Legal Text**: Lettered subsections (a, b, c...)
- **Hierarchical Information**: Nested menu structures

### 12. Interactive Elements

- **Hover States**: Links and buttons
- **Click-to-Expand**: Gallery images
- **Menu Toggles**: Mobile navigation
- **Scroll-Based Behaviors**: Sticky header activation
- **Form Validation**: Email input checking
- **Modal Triggers**: Login, cookie settings

---

## Content Patterns & Structure

### Information Hierarchy

**1. Homepage**
- Video/image hero with tagline
- Quick access to main service categories
- Newsletter signup
- Insurance partner display
- Minimal content, focused on navigation

**2. Category Pages** (e.g., Offices, Rehabilitation)
- Brief category overview
- List of services/specialties within category
- Links to detail pages
- Consistent booking reminders

**3. Detail Pages** (e.g., Cardiology, Physical Therapy)
- Comprehensive service information
- Doctor profiles and credentials
- Detailed procedure descriptions
- Photo galleries
- Contact and location information
- Booking instructions

### Consistent Page Elements

Present on most/all internal pages:
- Breadcrumb navigation
- "Kde nás najdete" (Where to Find Us) section
- Booking requirement notices
- Photo galleries (where applicable)
- Contact information blocks
- Footer with newsletter and insurance logos

### Content Types

**1. Descriptive Text**
- Service overviews
- Procedure explanations
- Treatment descriptions
- Medical specialty information

**2. Bulleted Lists**
- Treatments offered
- Diagnostic procedures available
- Equipment capabilities
- Service features

**3. Contact Information**
- Structured blocks with address, phone, email
- Department-specific contact details
- Reception and general inquiry information

**4. Professional Credentials**
- Doctor titles (MUDr., Mgr., Bc., DiS.)
- Names and specializations
- Team member qualifications

**5. News Articles**
- Headlines with publication dates
- News updates and announcements
- Healthcare information

**6. Legal Content**
- Terms of use
- Privacy policy
- Cookie policy
- Accessibility statements

**7. Notices/Alerts**
- Important patient information
- Appointment requirements
- Doctor availability updates
- Procedural requirements (e.g., MRI preparation)

### Content Tone & Language

- **Formal but Accessible**: Professional Czech language
- **Medical Terminology**: Balanced with patient-friendly explanations
- **Trust-Building**: Emphasis on modern equipment and qualified staff
- **Action-Oriented**: Clear booking instructions and contact methods
- **Informative**: Detailed procedure and service descriptions
- **Safety-Focused**: Clear contraindications and preparation instructions

---

## Technical Implementation Details

### Frontend Technology Stack

**JavaScript Framework**
- **jQuery-Based**: Extensive use of jQuery for interactions
- **No Modern Framework**: No React, Vue, or Angular detected
- **Custom JavaScript**: Resize calculations, toggle functions, fade animations

**CSS Architecture**
- **Custom CSS**: No Bootstrap or Tailwind detected
- **Proprietary Design System**: Custom-built stylesheets

**Third-Party Libraries**
- **lightGallery**: Photo gallery lightbox functionality
- **jQuery**: DOM manipulation and animations

### CSS Class Naming Patterns

**Semantic Naming**
- `photogallery`
- `intro-container`
- `slogan-menu`
- `headermenu`
- `shop-cart-vypis`

**Utility-Adjacent Classes**
- `full-width`
- `panel-shake`

**Component-Based Classes**
- `lg-image` (lightGallery)
- `c-lg-image`
- `apg-lg-image`
- `dialogBox`

**Not BEM Methodology**: Inconsistent naming conventions, no strict BEM pattern

### Responsive Design

**Primary Breakpoint**: 767px
- Desktop vs. mobile behavior switch
- `if (windowwidth > 767)` JavaScript conditional

**Responsive Strategies**
- Video background for desktop / static image for mobile
- Hamburger menu for mobile navigation
- Flexible layouts (likely flexbox/CSS Grid)
- Dynamic height calculations via JavaScript

### JavaScript Functionality

**jQuery Animations**
- `slideToggle()`
- `fadeToggle()`
- `fadeOut()`
- `fadeIn()`

**Custom Functions**
- `resizeImg()` - Dynamic viewport height calculations
- Menu toggle handlers
- Form validation
- Modal triggers

### CMS & Backend

- **CMS**: wmPUBLIC content management system
- **Web Development**: Web & Media a.s.

---

## Recommended Component System Architecture

For rebuilding Sagena with a modern component-based approach, the following component library is recommended:

### Layout Components

**1. Header**
- Logo
- Language switcher
- Utility navigation links
- Primary phone number display

**2. MainNav**
- Multi-level dropdown navigation
- Mobile responsive behavior
- Active state indicators

**3. StickyHeader**
- Scroll-responsive secondary header
- Smooth show/hide animations

**4. MobileMenu**
- Hamburger icon trigger
- Slide-out navigation panel
- Collapsible submenus

**5. Breadcrumb**
- Hierarchical navigation trail
- Current page indicator
- Semantic HTML structure

**6. Footer**
- Multi-section footer layout
- Newsletter integration
- Partner logos grid
- Navigation links
- Legal links
- Copyright information

**7. Container**
- Content width wrapper
- Responsive padding

**8. Section**
- Page section wrapper
- Consistent vertical spacing

### Hero Components

**1. VideoHero**
- Full-viewport video background
- Responsive image fallback
- Loading states
- Autoplay, loop, muted settings

**2. HeroContent**
- Text overlay with backdrop
- Tagline and subtitle
- Centered/flexible positioning

**3. QuickAccessNav**
- Service shortcut button grid
- Icon + label buttons
- Hover states

### Content Components

**1. ServiceList**
- Vertical list of services/specialties
- Alphabetical or categorical organization
- Clickable list items

**2. ServiceCard**
- Individual service preview
- Service title
- Brief description
- Icon or thumbnail
- Link to detail page

**3. DoctorProfile**
- Professional photo
- Name and credentials
- Specialization
- Availability information
- Contact options

**4. ContactBlock**
- Structured contact information
- Address display
- Phone number with extension
- Email with mailto link
- Building and floor information

**5. OpeningHours**
- Weekly schedule table/list
- Day and time formatting
- Special hours notation
- Closed days indication

**6. ImportantNotice**
- Alert/warning message box
- Icon indicator
- Prominent styling
- Dismissible option (if needed)

**7. ProcedureList**
- Bulleted treatment/diagnostic lists
- Expandable descriptions
- Categorized grouping

**8. PhotoGallery**
- Thumbnail grid layout
- Lightbox functionality
- Lazy loading
- Alt text for accessibility

**9. TeamList**
- Team member cards/list
- Photo + name + credentials
- Role categorization
- Contact information (optional)

**10. LocationInfo**
- "Where to Find Us" section
- Building name
- Floor information
- Full address
- Map integration (future enhancement)

**11. PartnerLogos**
- Partner/insurance provider logo grid
- Responsive column layout (2-6 columns)
- Configurable gap spacing (sm/md/lg)
- External link support for each logo
- Optional grayscale filter with hover effect
- Image height normalization
- Hover scale animation
- Accessible alt text support

### Article/News Components

**1. ArticleCard**
- Preview card with image
- Headline/title
- Publication date
- Excerpt (if desired)
- Read more link

**2. ArticleList**
- Vertical listing of article cards
- Pagination integration
- Load more functionality (optional)

**3. Pagination**
- Page number navigation
- Previous/Next buttons
- Current page indicator
- Ellipsis for many pages

**4. ArticleHeader**
- Article title (H1)
- Publication date and time
- Author information (if applicable)
- Category/tags

**5. ArticleBody**
- Formatted long-form content
- Image embedding
- Heading hierarchy
- List formatting
- Blockquote styling

### Form Components

**1. Input**
- Text input with validation
- Label and placeholder
- Error state display
- Helper text
- Multiple types (email, tel, text, etc.)

**2. Button**
- Multiple variants:
  - Primary (main actions)
  - Secondary (alternative actions)
  - Tertiary (subtle actions)
  - Danger (destructive actions)
- Multiple sizes
- Loading state
- Disabled state
- Icon support

**3. Form**
- Form wrapper with validation
- Error summary
- Success messaging
- Accessible form structure

**4. NewsletterSignup**
- Email input
- Submit button
- Success/error messaging
- GDPR compliance notice

**5. LoginForm**
- Username/email field
- Password field
- Remember me checkbox (optional)
- Submit button
- Forgot password link (optional)

**6. Select**
- Dropdown selection
- Searchable option (for long lists)
- Multi-select variant

**7. Checkbox & Radio**
- Single checkbox
- Checkbox group
- Radio group
- Custom styling

### Interactive Components

**1. Modal**
- Overlay backdrop
- Close button
- Scroll locking
- Focus trap
- Escape key handler
- Multiple sizes

**2. CookieConsent**
- Banner/modal presentation
- Granular category settings
- Accept all/Reject all buttons
- Manage preferences
- Persistent state

**3. Dropdown**
- Navigation dropdown menus
- Hover and click triggers
- Keyboard navigation
- Mobile-friendly

**4. Accordion**
- Collapsible content sections
- Single or multi-expand modes
- Smooth animations
- Icon indicators

**5. Tabs**
- Horizontal tab navigation
- Tab panel content
- Keyboard accessible

**6. Lightbox**
- Image expansion overlay
- Navigation between images
- Zoom functionality
- Caption display
- Close button

**7. Tooltip**
- Hover information display
- Positioned contextually
- Accessible alternative

### Media Components

**1. Image**
- Responsive image
- Lazy loading
- Alt text support
- Multiple formats (WebP fallback)
- Aspect ratio preservation

**2. Video**
- Background video
- Responsive behavior
- Autoplay controls
- Muted option
- Poster image

**3. Icon**
- SVG icon component
- Size variants
- Color variants
- Accessible labels

**4. Logo**
- Brand logo
- Color and monochrome variants
- Responsive sizing
- Link to homepage

**5. LogoGrid** (Implemented as `PartnerLogos` in `/components/content/`)
- Partner/insurance logo grid
- Responsive columns (2-6 configurable)
- Equal height/width treatment (max-height: 60px)
- Grayscale option with hover transition
- External link support

### Utility Components

**1. Link**
- Styled anchor links
- External link indicator
- Visited state
- Focus state

**2. Heading**
- Typography heading levels (H1-H6)
- Consistent sizing
- Font weight variants
- Color options

**3. TextBlock**
- Formatted body text
- Paragraph spacing
- Link styling
- List formatting

**4. List**
- Bulleted lists
- Numbered lists
- Unstyled lists
- Definition lists

**5. Spacer**
- Consistent spacing utility
- Vertical/horizontal spacing
- Multiple size options

**6. Divider**
- Horizontal rule
- Section separator
- Multiple styles

**7. Badge**
- Status indicators
- Category tags
- Notification counters

---

## Design System Recommendations

### Color Palette

**Primary Colors**
- **Primary Blue**: #[TBD] - Main brand color, buttons, links
- **Primary Blue Hover**: #[TBD] - Hover state for primary actions
- **Primary Blue Active**: #[TBD] - Active/pressed state

**Secondary Colors**
- **Secondary Blue**: #[TBD] - Accent, secondary actions
- **Medical Green**: #[TBD] - Success states, positive indicators (optional)

**Neutral Colors**
- **White**: #FFFFFF - Backgrounds, cards
- **Gray 50**: #[TBD] - Light backgrounds
- **Gray 100**: #[TBD] - Borders, dividers
- **Gray 300**: #[TBD] - Placeholder text
- **Gray 500**: #[TBD] - Secondary text
- **Gray 700**: #[TBD] - Body text
- **Gray 900**: #[TBD] - Headings

**Semantic Colors**
- **Success**: #[TBD] - Success messages, confirmations
- **Warning**: #[TBD] - Warnings, important notices
- **Error**: #[TBD] - Error states, validation messages
- **Info**: #[TBD] - Informational messages

**Background Colors**
- **Page Background**: White or very light gray
- **Card Background**: White
- **Section Background**: Light gray (alternating sections)

### Typography

**Font Families**
- **Primary**: Sans-serif system font stack or modern web font (e.g., Inter, Open Sans, Roboto)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Type Scale**
- **H1**: 2.5rem / 40px - Page titles
- **H2**: 2rem / 32px - Section headings
- **H3**: 1.5rem / 24px - Subsection headings
- **H4**: 1.25rem / 20px - Card titles
- **H5**: 1.125rem / 18px - Small headings
- **H6**: 1rem / 16px - Smallest headings
- **Body Large**: 1.125rem / 18px - Lead paragraphs
- **Body**: 1rem / 16px - Default body text
- **Body Small**: 0.875rem / 14px - Captions, helper text
- **Tiny**: 0.75rem / 12px - Meta information

**Font Weights**
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings

**Line Heights**
- **Tight**: 1.25 - Large headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

### Spacing System

**Base Unit**: 4px

**Spacing Scale**
- **xs**: 4px - Tight spacing
- **sm**: 8px - Small spacing
- **md**: 16px - Default spacing
- **lg**: 24px - Large spacing
- **xl**: 32px - Extra large spacing
- **2xl**: 48px - Section spacing
- **3xl**: 64px - Large section spacing
- **4xl**: 96px - Hero spacing

### Border Radius

- **None**: 0px - Sharp corners
- **sm**: 2px - Subtle rounding
- **md**: 4px - Default rounding
- **lg**: 8px - Cards, buttons
- **xl**: 12px - Large cards
- **2xl**: 16px - Prominent elements
- **full**: 9999px - Pills, circular elements

### Shadows

**Box Shadows**
- **sm**: Subtle shadow for slight elevation
- **md**: Default card shadow
- **lg**: Modal, dropdown shadow
- **xl**: Prominent elements
- **inner**: Inset shadow for inputs

**Example Values** (adjust based on brand):
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Breakpoints

**Responsive Breakpoints**
- **xs**: 0px - Mobile portrait
- **sm**: 640px - Mobile landscape
- **md**: 768px - Tablet
- **lg**: 1024px - Desktop
- **xl**: 1280px - Large desktop
- **2xl**: 1536px - Extra large screens

**Container Max Widths**
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Interactive States

**Transitions**
- **Fast**: 150ms - Small elements, subtle changes
- **Base**: 200ms - Default transitions
- **Slow**: 300ms - Complex animations

**Hover States**
- Darken primary color by 10%
- Lift elements with shadow increase
- Scale slightly (1.02-1.05)

**Focus States**
- Prominent outline ring
- High contrast for accessibility
- 2-3px offset

**Active States**
- Darken color further
- Scale down slightly (0.98)

**Disabled States**
- Reduced opacity (0.5-0.6)
- Cursor: not-allowed
- Grayscale filter (optional)

### Animation Guidelines

**Easing Functions**
- **Ease In**: Accelerating - use for elements exiting
- **Ease Out**: Decelerating - use for elements entering
- **Ease In Out**: Smooth - use for state changes

**Animation Principles**
- Subtle and purposeful
- No gratuitous motion
- Respect `prefers-reduced-motion`
- Fast enough to feel responsive (< 300ms for most)

### Accessibility

**Color Contrast**
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text
- Ensure all text meets WCAG AA minimum

**Focus Indicators**
- Always visible
- High contrast
- Minimum 2px outline

**Touch Targets**
- Minimum 44x44px for interactive elements
- Adequate spacing between clickable items

**Semantic HTML**
- Use proper heading hierarchy
- Meaningful link text
- Form labels and ARIA attributes
- Landmark regions

**Screen Reader Support**
- Alt text for images
- ARIA labels for icon buttons
- Skip links for navigation
- Live regions for dynamic content

---

## Implementation Notes

### Component Library Recommendations

For the new Sagena website, consider:

**Modern Frameworks**
- **React** with TypeScript for type safety
- **Next.js** for server-side rendering and SEO
- **Vue 3** with Composition API as alternative

**Component Libraries**
- **Headless UI** or **Radix UI** for accessible primitives
- **Build custom components** on top for Sagena branding

**Styling Approach**
- **Tailwind CSS** for utility-first styling
- **CSS Modules** or **Styled Components** for component-scoped styles
- **CSS Custom Properties** for design tokens

**Image Optimization**
- **Next.js Image** component or similar
- WebP format with fallbacks
- Lazy loading for performance

**Form Handling**
- **React Hook Form** or **Formik** for form state
- **Zod** or **Yup** for validation schemas

**State Management**
- **Context API** for simple global state
- **Zustand** or **Recoil** for complex state needs

### Performance Considerations

- Lazy load images and components
- Code splitting for routes
- Optimize video delivery (different formats, sizes)
- Minimize JavaScript bundle size
- Use CDN for static assets
- Implement caching strategies

### SEO Considerations

- Server-side rendering for content pages
- Semantic HTML structure
- Proper heading hierarchy
- Meta tags and Open Graph data
- Structured data for medical services
- XML sitemap
- Clean URLs

### Internationalization

- Support Czech and English languages
- Locale-specific formatting (dates, phone numbers)
- Language switcher in header
- Separate URLs or subdomains per language

---

## Content Strategy Notes

### Priority Pages

1. **Homepage** - Gateway to all services
2. **Medical Specialties** - Core service offerings
3. **Rehabilitation Services** - Key differentiator
4. **Contact/Booking** - Conversion critical
5. **About Us** - Trust building
6. **News/Updates** - Content marketing

### Content Hierarchy

- **Primary**: Service information, booking, contact
- **Secondary**: About, team, news
- **Tertiary**: Legal, policies, technical pages

### SEO Keywords

Focus on:
- Healthcare center + location
- Specific medical specialties + location
- Rehabilitation services + location
- MRI/diagnostic services + location
- Insurance provider partnerships

---

## Component Implementation Examples

### PartnerLogos Component

**Location:** `src/components/content/PartnerLogos.tsx`

**Purpose:** Displays a responsive grid of partner or insurance provider logos with external links.

#### Props Interface

```typescript
interface Partner {
  id: string;          // Unique identifier
  name: string;        // Partner name
  logo: string;        // Image URL or path
  url: string;         // External link URL
  alt?: string;        // Optional alt text (defaults to name)
}

interface PartnerLogosProps {
  partners: Partner[];          // Array of partner data
  className?: string;           // Additional CSS classes
  grayscale?: boolean;          // Apply grayscale filter (default: false)
  columns?: 2 | 3 | 4 | 5 | 6; // Number of columns (default: 6)
  gap?: 'sm' | 'md' | 'lg';    // Gap spacing (default: 'md')
}
```

#### Basic Usage

```typescript
import PartnerLogos from '@/components/content/PartnerLogos';
import { insuranceProviders } from '@/data/partners';

// Simple usage with defaults (6 columns, medium gap, color)
<PartnerLogos partners={insuranceProviders} />
```

#### Advanced Usage Examples

```typescript
// 1. Grayscale with hover effect (common for partner sections)
<PartnerLogos
  partners={insuranceProviders}
  grayscale={true}
  columns={6}
  gap="lg"
  className="py-12"
/>

// 2. Fewer columns for featured partners
<PartnerLogos
  partners={medicalPartners}
  columns={3}
  gap="lg"
/>

// 3. Compact layout with small gap
<PartnerLogos
  partners={insuranceProviders}
  columns={4}
  gap="sm"
  className="bg-gray-50 p-8 rounded-lg"
/>
```

#### Sample Data Structure

Sample partner data is available at `src/data/partners.ts`:

```typescript
import { insuranceProviders, medicalPartners } from '@/data/partners';

// Insurance providers (VZP, ČPZP, RBP, ZPMV, OZP, VOZP)
console.log(insuranceProviders); // 6 Czech health insurance providers

// Medical partners (placeholder examples)
console.log(medicalPartners); // 3 sample partners
```

**Note:** Demo images use [placehold.co](https://placehold.co) placeholder service.

#### Integration Example (Footer)

```typescript
import PartnerLogos from '@/components/content/PartnerLogos';
import { insuranceProviders } from '@/data/partners';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom section-padding">
        {/* Other footer content */}

        <div className="mt-12">
          <h3 className="heading-4 text-center mb-8">
            Spolupracujeme s pojišťovnami
          </h3>
          <PartnerLogos
            partners={insuranceProviders}
            grayscale={true}
            columns={6}
            gap="md"
          />
        </div>
      </div>
    </footer>
  );
};
```

#### Features

- **Responsive Grid:** Automatically adjusts columns for mobile (2 cols), tablet (3-5 cols), desktop (up to 6 cols)
- **Hover Effects:** Scale animation (1.05x) on hover, optional grayscale-to-color transition
- **Accessibility:** Opens external links in new tab with `rel="noopener noreferrer"`
- **Image Normalization:** Constrains logos to max-height: 60px while maintaining aspect ratio
- **Flexible Layout:** Configurable columns (2-6), gap spacing (sm/md/lg)
- **SEO Friendly:** Proper alt text support for all images

#### Styling Customization

```typescript
// Add custom styling via className
<PartnerLogos
  partners={insuranceProviders}
  className="bg-primary-50 p-8 rounded-xl border border-primary-100"
  grayscale={false}
/>
```

---

## Conclusion

This comprehensive analysis provides a blueprint for creating a modern, component-based Sagena website that maintains the professional, trustworthy character of the original while leveraging contemporary web development practices for improved maintainability, performance, and user experience.

The component system outlined here emphasizes:
- **Modularity**: Reusable components across pages
- **Consistency**: Unified design language
- **Accessibility**: WCAG compliance throughout
- **Scalability**: Easy to extend and maintain
- **Performance**: Optimized for fast load times
- **Professionalism**: Appropriate for healthcare industry

Use this document as a reference throughout the design and development process to ensure alignment with Sagena's brand, services, and user needs.
