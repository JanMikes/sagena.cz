# Component System Architecture

**Purpose:** Technical guide to the component architecture, organization patterns, and Strapi integration mapping.

## Table of Contents

- [Philosophy](#philosophy)
- [Organization Structure](#organization-structure)
- [Component Patterns](#component-patterns)
- [Strapi Integration](#strapi-integration)
- [Styling System](#styling-system)
- [Component Reference](#component-reference)

---

## Philosophy

### Domain-Driven Organization

**Core Principle:** Group components by **what they do**, not **what they are**.

#### Why Domain-Based?

```
❌ Type-Based (Bad):
/cards/
  - DoctorCard.tsx
  - ServiceCard.tsx
  - InfoCard.tsx
  - ContactCard.tsx

Problem: As project grows, "cards" becomes a dumping ground.
Hard to find specific components. No semantic meaning.

✓ Domain-Based (Good):
/people/
  - Doctor.tsx
/content/
  - ServiceCard.tsx
/layout/
  - HowToFindUs.tsx

Benefit: Clear purpose. Easy to locate. Scales better.
```

#### Decision Framework

```
When creating a new component, ask:

1. What is its PRIMARY purpose?
   - User interaction → /interactive/
   - Display data → /content/
   - Structure page → /layout/
   - Collect input → /forms/

2. What domain does it serve?
   - People-related → /people/
   - Navigation → /navigation/
   - Marketing → /marketing/
   - Media display → /media/

3. Is it a primitive building block?
   - Yes → /ui/
   - No → Domain-specific folder
```

---

## Organization Structure

### Directory Layout

```
frontend/src/components/
├── ui/                    # Base primitives (Button, Card, Badge, Input)
├── layout/                # Page structure (Header, Footer, SidePanel)
├── forms/                 # Form elements (ContactForm, Select, Checkbox, Radio)
├── navigation/            # Navigation (Breadcrumb, LinksList)
├── interactive/           # Interactive UI (Modal, Alert, Collapse)
├── typography/            # Text rendering (Heading, RichText)
├── people/                # People-related (Doctor, Contact)
├── content/               # Content blocks (Actuality, CardsWithDescription, Video)
├── marketing/             # Marketing (Slider, Timeline, MarketingArguments)
├── media/                 # Media display (PhotoGallery, GallerySlider)
├── intranet/              # Intranet-specific (LoginPage, IntranetNav)
└── strapi/                # Strapi integration (DynamicZone)
```

### Category Guidelines

#### /ui/ - Base Primitives

**Purpose:** Building blocks with no business logic

**Characteristics:**
- Highly reusable
- No domain-specific logic
- Configurable via props
- Design system foundation

**Examples:**
- `Button.tsx` - Button variants (primary, secondary, outline, ghost)
- `Card.tsx` - Container with optional hover, padding
- `Badge.tsx` - Status/category indicators
- `Input.tsx` - Form input with validation states

**When to add here:**
```typescript
// ✓ Add to /ui/ if:
- Used in multiple domains
- No healthcare-specific logic
- Pure UI presentation
- Part of design system

// ✗ Don't add to /ui/ if:
- Contains business logic
- Fetches data
- Domain-specific
```

#### /layout/ - Page Structure

**Purpose:** Components that define page structure, not content

**Characteristics:**
- Structural positioning
- Container components
- May contain slots/children
- No data fetching

**Examples:**
- `Header.tsx` - Top navigation bar
- `Footer.tsx` - Bottom site footer
- `SidePanel.tsx` - Sidebar layout container
- `Breaker.tsx` - Visual section separator
- `ButtonRow.tsx` - Horizontal button layout

#### /forms/ - Form Components

**Purpose:** User input collection and validation

**Characteristics:**
- Handle user input
- Validation logic
- State management
- Accessibility features

**Examples:**
- `ContactForm.tsx` - Complete contact form
- `Select.tsx` - Dropdown selection
- `Checkbox.tsx` - Checkbox input
- `Radio.tsx` - Radio button input

#### /navigation/ - Navigation Components

**Purpose:** Help users move through the site

**Examples:**
- `Breadcrumb.tsx` - Hierarchical trail
- `LinksList.tsx` - Vertical list of links

#### /interactive/ - Interactive UI

**Purpose:** Components with user interaction states

**Characteristics:**
- Requires 'use client' directive
- Uses React hooks (useState, useEffect)
- Manages internal state
- Event handlers

**Examples:**
- `Modal.tsx` - Popup dialog
- `Alert.tsx` - Notification/message box
- `Collapse.tsx` - Collapsible content

#### /typography/ - Text Rendering

**Purpose:** Text display and formatting

**Examples:**
- `Heading.tsx` - Semantic headings (h2-h6) with anchors
- `RichText.tsx` - HTML content rendering

#### /people/ - People-Related

**Purpose:** Display information about people

**Examples:**
- `Doctor.tsx` - Doctor profile card
- `Contact.tsx` - Contact information display

#### /content/ - Content Blocks

**Purpose:** Display structured content

**Characteristics:**
- Data presentation
- May accept Strapi data
- Domain-agnostic content display

**Examples:**
- `Video.tsx` - YouTube embed
- `Actuality.tsx` - News/article card
- `CardsWithDescription.tsx` - Card grid with descriptions
- `FullWidthCards.tsx` - Full-width card layout
- `WorkOpportunity.tsx` - Job posting card
- `PartnerLogos.tsx` - Logo grid
- `Documents.tsx` - Document list

#### /marketing/ - Marketing Components

**Purpose:** Promotional and marketing content

**Examples:**
- `Slider.tsx` - Image carousel
- `Timeline.tsx` - Timeline visualization
- `MarketingArguments.tsx` - Value propositions

#### /media/ - Media Display

**Purpose:** Image and media galleries

**Examples:**
- `PhotoGallery.tsx` - Image grid with lightbox
- `GallerySlider.tsx` - Slideshow gallery

#### /intranet/ - Intranet-Specific

**Purpose:** Internal system components

**Examples:**
- `LoginPage.tsx` - Login interface
- `IntranetNav.tsx` - Internal navigation

#### /strapi/ - Strapi Integration

**Purpose:** Strapi CMS integration components

**Examples:**
- `DynamicZone.tsx` - Dynamic zone renderer

---

## Component Patterns

### Standard Component Structure

```typescript
'use client';  // Only if using hooks or browser APIs

import React from 'react';
import { IconName } from 'lucide-react';

interface ComponentNameProps {
  children?: React.ReactNode;
  className?: string;        // For Tailwind overrides
  variant?: 'primary' | 'secondary';  // Style variations
  size?: 'sm' | 'md' | 'lg'; // Size options
  href?: string;             // Optional link behavior
  onClick?: () => void;      // Event handlers
}

const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  // State (if 'use client')
  const [isOpen, setIsOpen] = React.useState(false);

  // Variant styling
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
  };

  // Size styling
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <div
      className={`
        base-classes
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ComponentName;
```

### Component Patterns

#### Pattern 1: Variant System

```typescript
// Define variants with Tailwind classes
const variantClasses = {
  primary: 'bg-primary-600 text-white',
  secondary: 'bg-neutral-200 text-neutral-900',
  outline: 'border-2 border-primary-600 text-primary-600 bg-transparent',
  ghost: 'text-primary-600 hover:bg-primary-50',
};

// Apply variant
<button className={variantClasses[variant]} />
```

#### Pattern 2: Size System

```typescript
const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

#### Pattern 3: Link/Button Hybrid

```typescript
// Support both button and link behavior
if (href) {
  return <Link href={href} className={classes}>{children}</Link>;
}
return <button className={classes} onClick={onClick}>{children}</button>;
```

#### Pattern 4: Conditional Rendering

```typescript
// Only render if has content
if (!items || items.length === 0) return null;
```

### Client vs Server Components

**Server Components (Default):**
```typescript
// No 'use client' directive
// Can be pre-rendered at build time
// Cannot use hooks or browser APIs
// Better performance

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="...">{children}</div>;
};
```

**Client Components:**
```typescript
'use client';  // Required

// Use when component needs:
// - React hooks (useState, useEffect, useContext)
// - Browser APIs (window, document, localStorage)
// - Event handlers (onClick, onChange, onSubmit)
// - Client-side interactivity

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Browser API usage
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  return /* ... */;
};
```

**Decision Matrix:**

| Feature | Needs 'use client' |
|---------|-------------------|
| useState, useEffect, useContext | ✓ |
| Event handlers (onClick, etc.) | ✓ |
| Browser APIs (window, document) | ✓ |
| Tailwind styling | ✗ |
| Props | ✗ |
| children | ✗ |
| Conditional rendering | ✗ |
| Map over arrays | ✗ |

---

## Strapi Integration

### Component Lifecycle

```
1. Create Component in Strapi
   ↓
2. Add to Dynamic Zone (content/sidebar)
   ↓
3. Define TypeScript Interface (frontend/src/types/strapi.ts)
   ↓
4. Add to Union Type (PageContentComponent / PageSidebarComponent)
   ↓
5. Update Population Query (frontend/src/lib/strapi.ts)
   ↓
6. Add Case to DynamicZone (frontend/src/components/strapi/DynamicZone.tsx)
   ↓
7. Create/Adapt React Component (frontend/src/components/)
```

### Strapi → React Mapping

| Strapi Component | React Component | Location | Props Transformation |
|-----------------|-----------------|----------|---------------------|
| `components.heading` | `Heading` | typography/ | `text` → children, `type` → level, `anchor` → id |
| `components.text` | `RichText` | typography/ | `text` → content |
| `components.alert` | `Alert` | interactive/ | Direct mapping |
| `components.video` | `Video` | content/ | `youtube_id` → youtubeId, `aspect_ratio` → aspectRatio |
| `components.links-list` | `LinksList` | navigation/ | `links[]` → transform with resolveTextLink() |

### Props Transformation Pattern

**Strapi Component:**
```typescript
interface ComponentsVideo {
  id: number;
  __component: 'components.video';
  youtube_id: string;
  aspect_ratio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}
```

**React Component:**
```typescript
interface VideoProps {
  youtubeId: string;  // Camel case
  aspectRatio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}
```

**Transformation in DynamicZone:**
```typescript
case 'components.video': {
  const videoComponent = component as ComponentsVideo;
  return (
    <Video
      youtubeId={videoComponent.youtube_id}  // Snake to camel
      aspectRatio={videoComponent.aspect_ratio}
    />
  );
}
```

### Link Resolution Pattern

**Strapi Element:**
```typescript
interface ElementsTextLink {
  id: number;
  text: string;
  page?: Page;    // Internal page
  url?: string;   // External URL
  file?: StrapiMedia;  // File download
  anchor?: string;
  disabled?: boolean;
}
```

**Resolution Priority:**
1. page (internal page)
2. url (external URL)
3. file (download)
4. anchor (hash only)

**Implementation:**
```typescript
function resolveTextLink(link: ElementsTextLink) {
  // Priority 1: Internal page
  if (link.page?.slug) {
    return {
      url: `/${link.page.slug}`,
      external: false,
      disabled: false,
    };
  }

  // Priority 2: External URL
  if (link.url) {
    return {
      url: link.url,
      external: link.url.startsWith('http'),
      disabled: false,
    };
  }

  // Priority 3: File
  if (link.file) {
    return {
      url: link.file.attributes.url,
      external: false,
      disabled: false,
    };
  }

  // Priority 4: Anchor
  if (link.anchor) {
    return {
      url: `#${link.anchor}`,
      external: false,
      disabled: false,
    };
  }

  // Fallback: disabled
  return {
    url: '#',
    external: false,
    disabled: true,
  };
}
```

---

## Styling System

### Tailwind Configuration

**Custom Theme (tailwind.config.ts):**

```typescript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... full scale
    600: '#2563eb',  // Core primary
    700: '#1d4ed8',
    // ...
  },
  medical: {
    50: '#f0fdf4',
    // ... green accent scale
    500: '#10b981',  // Core medical green
  },
  neutral: {
    50: '#fafafa',
    // ... gray scale
    900: '#171717',
  }
},
boxShadow: {
  'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
  'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
}
```

### Custom Utility Classes

**Defined in `frontend/src/app/globals.css`:**

```css
/* Layout */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-padding {
  @apply py-16 md:py-24;
}

/* Typography */
.heading-1 {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight;
}

.heading-2 {
  @apply text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight;
}

.heading-3 {
  @apply text-2xl md:text-3xl lg:text-4xl font-semibold;
}

.heading-4 {
  @apply text-xl md:text-2xl lg:text-3xl font-semibold;
}

.body-large {
  @apply text-lg leading-relaxed;
}

.body {
  @apply text-base leading-relaxed;
}

.body-small {
  @apply text-sm leading-relaxed;
}
```

### Standard Page Wrapper

```typescript
<div className="container-custom section-padding">
  <h1 className="heading-1 text-primary-700 mb-6">Title</h1>
  <p className="body text-neutral-600">Content</p>
</div>
```

### Component Styling Pattern

```typescript
// Base classes (always applied)
const baseClasses = 'rounded-lg transition-all duration-200';

// Variant classes (conditional)
const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
};

// Combine with user className
<div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
```

### Responsive Patterns

```typescript
// Mobile-first approach
className="
  text-base      // Mobile (default)
  md:text-lg     // Tablet (768px+)
  lg:text-xl     // Desktop (1024px+)

  px-4           // Mobile padding
  md:px-6        // Tablet padding
  lg:px-8        // Desktop padding

  grid-cols-1    // Mobile (1 column)
  md:grid-cols-2 // Tablet (2 columns)
  lg:grid-cols-3 // Desktop (3 columns)
"
```

---

## Component Reference

### Complete Component List

**UI Primitives (4):**
- Button - Multi-variant button component
- Card - Container with hover effects
- Badge - Status/category indicators
- Input - Form input with validation

**Layout (6):**
- Header - Top navigation bar with sticky behavior
- Footer - Multi-section footer
- SidePanel - Two-column layout with sidebar
- Breaker - Visual section separator
- ButtonRow - Horizontal button layout
- HowToFindUs - Location information block

**Forms (4):**
- ContactForm - Complete contact form with GDPR
- Select - Dropdown selection
- Checkbox - Checkbox input
- Radio - Radio button input

**Navigation (2):**
- Breadcrumb - Hierarchical trail
- LinksList - Vertical list of links

**Interactive (3):**
- Modal - Popup dialog with backdrop
- Alert - Notification/message box
- Collapse - Collapsible content

**Typography (2):**
- Heading - Semantic headings (h2-h6) with anchors
- RichText - HTML content rendering

**People (2):**
- Doctor - Doctor profile card
- Contact - Contact information display

**Content (8):**
- Video - YouTube embed with aspect ratios
- Actuality - News/article card
- CardsWithDescription - Card grid
- FullWidthCards - Full-width cards
- WorkOpportunity - Job posting card
- PartnerLogos - Logo grid
- Documents - Document list

**Marketing (3):**
- Slider - Image carousel
- Timeline - Timeline visualization
- MarketingArguments - Value propositions

**Media (2):**
- PhotoGallery - Image grid with lightbox
- GallerySlider - Slideshow gallery

**Intranet (2):**
- LoginPage - Login interface
- IntranetNav - Internal navigation

**Strapi (1):**
- DynamicZone - Dynamic zone component renderer

**Total:** 36 components

---

## Quick Reference

### Adding a Component

```bash
# 1. Decide category based on purpose
# 2. Create file: frontend/src/components/[category]/ComponentName.tsx
# 3. Follow standard structure pattern
# 4. Export default
# 5. Import with: import ComponentName from '@/components/[category]/ComponentName'
```

### Strapi Component Integration

```bash
# 1. Create in Strapi admin
# 2. Add interface to frontend/src/types/strapi.ts
# 3. Update fetchPageBySlug() in frontend/src/lib/strapi.ts
# 4. Add case to DynamicZone.tsx
# 5. Create/adapt React component
```

### Component Checklist

- [ ] Proper category placement
- [ ] TypeScript interface for props
- [ ] Default prop values
- [ ] Variant system (if applicable)
- [ ] Tailwind styling (no inline styles)
- [ ] 'use client' only if needed
- [ ] Semantic HTML
- [ ] Accessible (ARIA labels if needed)
- [ ] Responsive design
- [ ] Exported as default

### File Locations

```
Component definitions:   frontend/src/components/
Strapi types:            frontend/src/types/strapi.ts
Strapi client:           frontend/src/lib/strapi.ts
Dynamic renderer:        frontend/src/components/strapi/DynamicZone.tsx
Global styles:           frontend/src/app/globals.css
Tailwind config:         frontend/tailwind.config.ts
```
