# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sagena is a **monorepo healthcare platform** with:
- **Frontend** (`/frontend`): Next.js 15 static website built with TypeScript, Tailwind CSS, and Lucide React
- **Backend** (`/strapi`): Strapi 5.30.1 CMS with PostgreSQL database
- **Deployment**: Docker Compose orchestration with three services (frontend, strapi, postgres)

The frontend is configured for **static site generation (SSG)** and deploys to GitHub Pages. It contains a comprehensive component library with 36 reusable components organized by domain/function.

**Key Characteristics:**
- **Monorepo structure**: Two independent applications in `/frontend` and `/strapi`
- **Frontend**: Static export (`output: 'export'` in next.config.js), App Router, no SSR
- **Backend**: Strapi CMS with PostgreSQL, TypeScript, content management API
- **Orchestration**: Docker Compose with health checks and persistent volumes
- **Custom component library**: 36 components in frontend, not using Shadcn or MUI
- **Healthcare-focused design system**

## Development Commands

### Docker Commands (Recommended)
```bash
docker compose up           # Start all services (frontend:8080, strapi:1337, postgres:5432)
docker compose up -d        # Start in background
docker compose logs -f      # View logs
docker compose down         # Stop all services
docker compose build        # Rebuild after changes
```

### Frontend Commands (Local Development)
```bash
cd frontend
npm run dev          # Start development server on localhost:3000
npm run build        # Build static site (outputs to /out/ directory)
npm start            # Start production server (not used for static export)
npm run lint         # Run ESLint
```

### Strapi Commands (Local Development)
```bash
cd strapi
npm run develop      # Start Strapi in development mode on localhost:1337
npm run start        # Start Strapi in production mode
npm run build        # Build Strapi admin panel
```

### Testing Changes
Always build the frontend before pushing to verify it works correctly:
```bash
cd frontend
npm run build        # Should generate /out/ with 22 pages
```

The build must succeed without errors for deployment to work.

## Architecture

### Static Export Configuration

The project uses Next.js static export with specific configuration:

**next.config.js:**
```javascript
{
  output: 'export',              // Static site generation
  images: { unoptimized: true }, // Required for static export
  trailingSlash: true,           // Clean URLs for static hosting
}
```

**Important:** Cannot use:
- Server-side rendering (SSR)
- API routes
- Incremental static regeneration (ISR)
- Image optimization (images are unoptimized)
- Server actions

### Monorepo Structure

The repository contains two independent applications:

```
sagena/
├── frontend/                    # Next.js static website
│   ├── src/
│   │   ├── app/                 # Next.js pages (App Router)
│   │   └── components/          # 36 reusable components
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── Dockerfile               # Multi-stage build with Nginx
│   └── nginx.conf
├── strapi/                      # Strapi CMS
│   ├── config/                  # Strapi configuration
│   ├── src/                     # API and business logic
│   ├── public/                  # Uploaded media
│   ├── package.json
│   └── Dockerfile
├── compose.yaml                 # Docker Compose orchestration
└── .env.example                 # Environment variables template
```

### Component Organization (Frontend)

Components in `frontend/src/components/` are organized by **domain/function** (not by type):

```
frontend/src/components/
├── ui/              # Base primitives (Button, Card, Badge, Input)
├── layout/          # Layout structure (Header, Footer, SidePanel)
├── forms/           # Form components (ContactForm, Select, Checkbox, Radio)
├── navigation/      # Navigation (Breadcrumb, LinksList)
├── interactive/     # Interactive UI (Modal, Alert, Collapse)
├── typography/      # Text components (Heading, RichText)
├── people/          # People-related (Doctor, Contact)
├── content/         # Content blocks (Actuality, CardsWithDescription, etc.)
├── marketing/       # Marketing (Slider, Timeline, MarketingArguments)
├── media/           # Media components (PhotoGallery, GallerySlider)
└── intranet/        # Intranet-specific (LoginPage, IntranetNav)
```

**Pattern:** Group by what components do, not what they are. For example, `Doctor` is in `/people/`, not `/cards/`.

### Component Structure Pattern

All components follow this pattern:

```typescript
'use client';  // Only if using hooks or browser APIs

import React from 'react';
import { IconName } from 'lucide-react';

interface ComponentNameProps {
  children?: React.ReactNode;
  className?: string;        // For Tailwind overrides
  variant?: string;          // Style variations
  size?: 'sm' | 'md' | 'lg'; // Size options
  href?: string;             // Optional link behavior
}

const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}) => {
  return (
    <div className={`base-classes ${variantClasses} ${sizeClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ComponentName;
```

### Styling System

**Tailwind CSS with custom utilities** (defined in `src/app/globals.css`):

```css
.container-custom    /* Max-width container with horizontal padding */
.section-padding     /* Vertical section spacing (py-16 md:py-24) */
.heading-1           /* 4xl/5xl/6xl responsive heading */
.heading-2           /* 3xl/4xl/5xl responsive heading */
.heading-3           /* 2xl/3xl/4xl responsive heading */
.heading-4           /* xl/2xl/3xl responsive heading */
.body-large          /* lg text size */
.body                /* base text size */
.body-small          /* sm text size */
```

**Custom Tailwind Theme** (`tailwind.config.ts`):

**Colors:**
- `primary`: Medical blue scale (50-950), core: #2563eb
- `medical`: Green accent #10b981
- `neutral`: Gray scale (50-900)

**Shadows:**
- `shadow-soft`: Subtle elevation
- `shadow-soft-lg`: Prominent elevation

**Usage Pattern:**
```typescript
// Standard page wrapper
<div className="container-custom section-padding">
  <h1 className="heading-1 text-primary-700">Title</h1>
  <p className="body text-neutral-600">Content</p>
</div>
```

### Strapi CMS Integration

The frontend is integrated with Strapi CMS for dynamic content management.

**Environment Configuration:**

CRITICAL: Docker networking requires different URLs for server-side and client-side communication.

```bash
# For Docker (compose.override.yaml) - not versioned
services:
  frontend:
    environment:
      # Server-side URL (build time, SSG) - uses Docker service name
      STRAPI_URL: http://strapi:1337
      # Client-side URL (browser) - uses localhost or production URL
      NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
      STRAPI_API_TOKEN: <your-api-token>

# For local development without Docker (.env.local) - not versioned
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<your-api-token>
```

**Why Two URLs?**
- **Static Site Generation (SSG)**: Next.js fetches data at BUILD TIME on the server
- **Docker networking**: Services communicate using service names (e.g., `strapi:1337`), not `localhost`
- **Browser access**: Browsers use `localhost:1337` to access Strapi from host machine
- `STRAPI_URL`: Server-side only, used during build/SSG
- `NEXT_PUBLIC_STRAPI_URL`: Exposed to browser, used for client-side requests (if any)

**Critical Concepts:**

1. **Components vs Elements**
   - **Components** (`strapi/src/components/components/`): Standalone UI components used in dynamic zones
     - Example: `components.heading`, `components.text`
     - Can be added directly to pages via Strapi admin
   - **Elements** (`strapi/src/components/elements/`): Never standalone, always embedded within other components
     - Example: `elements.link` (used within navigation, buttons, etc.)
     - Cannot be added directly to dynamic zones

2. **Page Structure**
   - Core content type: `Page` (`strapi/src/api/page/content-types/page/schema.json`)
   - Two dynamic zones:
     - `content`: Main content area (required)
     - `sidebar`: Optional sidebar content
   - If `sidebar` has components, layout renders with `<SidePanel>`
   - If `sidebar` is empty, layout renders full-width

3. **Strapi Population & Query Building (CRITICAL)**

   **Key Rule: `populate=*` only goes ONE level deep!**

   Read: https://docs.strapi.io/cms/api/rest/populate-select#population

   **Query String Format:**
   Strapi uses the `qs` library for parsing nested objects. Use bracket notation:
   ```
   // Correct format (qs-style)
   ?populate[link][populate][0]=page&populate[link][populate][1]=file&locale=cs-CZ

   // Wrong format (JSON.stringify)
   ?populate={"link":{"populate":["page","file"]}}&locale=cs-CZ
   ```

   Our `buildQueryString()` function in `strapi.ts` handles this conversion automatically.

   **Understanding Depth Levels:**
   - Level 0: Just the entity itself (no relations/components)
   - Level 1: `populate=*` - populates immediate relations/components
   - Level 2+: Must explicitly populate nested relations

   **Examples:**

   ```javascript
   // ❌ WRONG - This won't populate page/file inside link component
   { populate: '*' }

   // ✅ CORRECT - Navigation with nested link relations
   {
     populate: {
       link: {
         populate: ['page', 'file']  // Explicitly populate nested relations
       }
     }
   }

   // ❌ WRONG - Dynamic zones with nested targeting
   // This will fail with: "Invalid nested population query detected"
   {
     populate: {
       content: {
         populate: {
           links: { populate: ['page', 'file'] }  // Cannot target specific fields in polymorphic structures
         }
       }
     }
   }

   // ✅ CORRECT - Dynamic zones with 'on' syntax for deep population
   // Use 'on' to target specific component types within polymorphic dynamic zones
   {
     populate: {
       content: {
         on: {
           'components.heading': { populate: '*' },
           'components.text': { populate: '*' },
           'components.alert': { populate: '*' },
           'components.links-list': {
             populate: {
               links: {
                 populate: ['page', 'file'],  // Deep populate relations in nested elements
               },
             },
           },
         },
       },
       sidebar: {
         on: {
           'components.heading': { populate: '*' },
           'components.links-list': {
             populate: {
               links: { populate: ['page', 'file'] },
             },
           },
         },
       },
       parent: true,
     }
   }
   ```

   **When to use what:**
   - Simple relation (one level): `populate: 'fieldName'` or `populate: '*'`
   - Component with relations: `populate: { component: { populate: ['relation1', 'relation2'] } }`
   - Dynamic zone (shallow): `populate: { dynamicZone: { populate: '*' } }`
   - **Dynamic zone (deep - RECOMMENDED)**: Use `on` syntax to target each component type and deeply populate nested relations

   **Dynamic Zone Population (CRITICAL):**

   Dynamic zones are **polymorphic structures** in Strapi. When components within dynamic zones have nested relations, you MUST use the `on` syntax:

   1. **Why `on` is needed**: Dynamic zones can contain multiple component types. Using `populate: '*'` only goes one level deep and doesn't populate nested relations within components.

   2. **Using `on` syntax**:
      - Target each component type explicitly: `'components.component-name'`
      - Define population strategy per component type
      - Can deeply populate nested relations (e.g., `links.populate: ['page', 'file']`)

   3. **Common pitfall**: Trying to use `populate: { specificField: ... }` within a dynamic zone will fail with: *"Invalid nested population query detected. When using 'populate' within polymorphic structures, its value must be '*'"*

   4. **Solution**: Use `on` to specify per-component population strategies instead of trying to target fields directly

   **Always verify in Strapi response that nested relations are included!**

4. **Type Safety**
   - Strapi generates types in `strapi/types/generated/components.d.ts`
   - Frontend types in `frontend/src/types/strapi.ts` mirror Strapi structure
   - Always verify types match after Strapi schema changes

**Strapi Response Structure:**

**CRITICAL**: Strapi returns data directly, NOT wrapped in `attributes`!

The `attributes` key in `schema.json` is Strapi's internal structure definition.
The REST API returns properties directly:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Home",
      "navbar": true,
      "link": { ... }
    }
  ],
  "meta": { }
}
```

**Access patterns:**
- ✅ CORRECT: `nav.title`, `nav.navbar`, `page.slug`
- ❌ WRONG: `nav.attributes.title`, `page.attributes.slug`

**Relations (page, file, etc.):**
- ✅ CORRECT: `link.page.slug`, `link.file.url`
- ❌ WRONG: `link.page.data.attributes.slug`, `link.file.data.attributes.url`

**Key insight:** Relations are returned directly - no `.data` wrapper, no `.attributes`!

**Example from actual response:**
```json
{
  "link": {
    "id": 5,
    "page": {              // ← Direct, not "data": { "attributes": { ... } }
      "id": 1,
      "slug": "test"       // ← Direct property
    }
  }
}
```

**Integration Architecture:**

```
Strapi CMS (strapi:1337)
    ↓ API calls with auth token
Strapi Client (frontend/src/lib/strapi.ts)
    ↓ Typed responses
Page Components (frontend/src/app/)
    ↓ Dynamic zone data
DynamicZone Renderer (frontend/src/components/strapi/DynamicZone.tsx)
    ↓ Component switching
React Components (Heading, RichText, etc.)
```

**File Structure:**
```
frontend/src/
├── types/
│   └── strapi.ts              # TypeScript types for Strapi data
├── lib/
│   └── strapi.ts              # Strapi client with fetch functions
├── components/
│   └── strapi/
│       └── DynamicZone.tsx    # Dynamic zone component renderer
└── app/
    └── [...slug]/
        └── page.tsx           # Catch-all route for dynamic pages
```

**Component Mapping:**
```
Strapi Component          → Frontend Component
components.heading        → typography/Heading
components.text           → typography/RichText
elements.link             → (embedded, not rendered directly)
```

**Adding New Strapi Components:**

**CRITICAL**: Every new Strapi component requires THREE mandatory updates, or it will fail silently!

1. Create component in Strapi admin or `strapi/src/components/`
2. Add to dynamic zone in page content type
3. Check generated types in `strapi/types/generated/components.d.ts`
4. **Add TypeScript interface to `frontend/src/types/strapi.ts`**:
   - Create `ComponentsXxx` interface with `__component: 'components.xxx'`
   - Add to `PageContentComponent` and/or `PageSidebarComponent` union types
5. **Update `frontend/src/lib/strapi.ts` population (CRITICAL - NEVER FORGET THIS!)**:
   - In `fetchPageBySlug()` function, add component to populate configuration
   - For content zone: Add `'components.xxx': { populate: '*' }` to `content.on` object
   - For sidebar zone: Add `'components.xxx': { populate: '*' }` to `sidebar.on` object
   - **Without this step, Strapi will NOT return the component data!**
6. **Update `frontend/src/components/strapi/DynamicZone.tsx`** (CRITICAL):
   - Import the React component
   - Import the TypeScript type
   - Add `case 'components.xxx':` to the switch statement
   - Map Strapi props to React component props
7. Create or adapt React component in `frontend/src/components/`

**Example workflow for Video component:**
```typescript
// 1. frontend/src/types/strapi.ts - Add interface and union type
export interface ComponentsVideo {
  id: number;
  __component: 'components.video';
  youtube_id: string;
  aspect_ratio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}
export type PageContentComponent = ... | ComponentsVideo;

// 2. frontend/src/lib/strapi.ts - Update fetchPageBySlug population (CRITICAL!)
const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
  locale,
  populate: {
    content: {
      on: {
        'components.heading': { populate: '*' },
        'components.text': { populate: '*' },
        'components.alert': { populate: '*' },
        'components.video': { populate: '*' },  // ← ADD THIS LINE!
        'components.links-list': {
          populate: {
            links: { populate: ['page', 'file'] },
          },
        },
      },
    },
    sidebar: {
      on: {
        // Add here if component goes in sidebar too
      },
    },
    parent: true,
  },
});

// 3. frontend/src/components/strapi/DynamicZone.tsx - Add imports
import Video from '@/components/content/Video';
import { ComponentsVideo } from '@/types/strapi';

// 4. frontend/src/components/strapi/DynamicZone.tsx - Add case
case 'components.video': {
  const videoComponent = component as ComponentsVideo;
  return (
    <Video
      key={`${__component}-${component.id || index}`}
      youtubeId={videoComponent.youtube_id}
      aspectRatio={videoComponent.aspect_ratio}
    />
  );
}
```

**Common mistake:** Forgetting step 2 (population update) means Strapi returns empty array for that component type, causing silent failure with no error message!

**Navigation Integration:**
- Navbar items fetched from Strapi in root layout
- Filter by `navbar: true` for header navigation
- Filter by `footer: true` for footer navigation
- Links resolve: page relation > external URL > file > anchor

### Routing and Pages

Pages use **App Router** with file-based routing:

```
frontend/src/app/
├── layout.tsx           # Root layout (Header/Footer wrapper)
├── page.tsx             # Homepage (/)
├── komponenty/page.tsx  # Component showcase (/komponenty/)
├── s-panelem/page.tsx   # Sidebar layout demo (/s-panelem/)
└── intranet/page.tsx    # Intranet mockup (/intranet/)
```

**Creating a new page:**
1. Create directory: `frontend/src/app/new-route/`
2. Add `page.tsx` file
3. Build will automatically generate static route

**Layout hierarchy:**
- All pages are wrapped by `frontend/src/app/layout.tsx` (provides Header/Footer)
- Pages can define additional nested layouts

## Path Alias (Frontend)

Use `@/` for importing from `src/` within the frontend:

```typescript
import Button from '@/components/ui/Button';
import { Doctor } from '@/components/people/Doctor';
```

Configured in `frontend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Healthcare Domain Context

This is a medical facility website for **Sagena Healthcare Center** in Czech Republic.

**Services:**
- 20+ medical specialties (cardiology, neurology, orthopedics, etc.)
- 12+ rehabilitation services (physiotherapy, massage, electrotherapy, etc.)
- MRI diagnostics
- Pharmacy
- Infusion center

**Key Elements:**
- **Insurance logos**: VZP, ČPZP, RBP, ZPMV, OZP, VOZP (displayed in Footer)
- **Doctor credentials**: MUDr. (medical doctor), Mgr. (master's degree)
- **Opening hours**: Different hours for offices, rehab, pharmacy
- **Contact**: Phone +420 553 030 800, Email info@sagena.cz
- **Language**: Czech (primary), English support planned

**UX Priorities:**
- Professional appearance (trust-building)
- Prominent contact information
- Easy appointment booking
- Accessibility
- GDPR compliance

## Common Development Tasks

### Adding a New Component (Frontend)

1. **Choose category** based on function (e.g., `/forms/` for form component)
2. **Create file**: `frontend/src/components/[category]/ComponentName.tsx`
3. **Define TypeScript interface** for props
4. **Use Tailwind utilities** for styling
5. **Export default**
6. **Import using** `@/components/[category]/ComponentName`

Example:
```typescript
// frontend/src/components/ui/Alert.tsx
interface AlertProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ variant = 'info', children }) => {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};

export default Alert;
```

### Using Existing Components

**Button with variants:**
```typescript
import Button from '@/components/ui/Button';

<Button variant="primary" size="lg" href="/objednat">
  Objednat se
</Button>
```

**Card with hover effect:**
```typescript
import Card from '@/components/ui/Card';

<Card hover padding="lg" className="h-full">
  <h3 className="heading-3">Title</h3>
  <p className="body text-neutral-600">Description</p>
</Card>
```

**Doctor profile card:**
```typescript
import Doctor from '@/components/people/Doctor';

<Doctor
  name="MUDr. Jan Novák"
  specialization="Kardiologie"
  email="novak@sagena.cz"
  phone="+420 553 030 810"
  openingHours="Po-Pá 8:00-16:00"
/>
```

### Modifying Styles (Frontend)

**Global styles**: Edit `frontend/src/app/globals.css`
**Theme colors**: Edit `frontend/tailwind.config.ts`
**Component styles**: Use Tailwind classes in component files

### Client vs Server Components

By default, components are **Server Components** (can be pre-rendered).

Use `'use client'` directive when component needs:
- React hooks (useState, useEffect, etc.)
- Browser APIs (window, document, etc.)
- Event handlers (onClick, onChange, etc.)

**Example - Modal needs client-side state:**
```typescript
'use client';

import React, { useState, useEffect } from 'react';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Uses useState and useEffect
  // ...
};
```

**Example - Card doesn't need client-side:**
```typescript
// No 'use client' directive needed

const Card: React.FC<CardProps> = ({ children, hover }) => {
  return <div className="...">{children}</div>;
};
```

## Deployment

### GitHub Actions Workflow

Automatic deployment configured in `.github/workflows/deploy.yml`:

**Trigger:** Push to `main` branch or manual dispatch

**Process:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Build (`npm run build`)
5. Upload `/out/` directory
6. Deploy to GitHub Pages

**Requirements:**
- Repository Settings → Pages → Source: "GitHub Actions"
- Build must complete without errors

### Manual Deployment

**Build output:**
- Directory: `out/`
- Size: ~3.4 MB
- Pages: 22 static HTML files

## TypeScript Configuration

**Strict mode enabled:**
- All components must have typed props
- No implicit `any`
- Null checks enforced

**Module resolution:** Bundler (modern)
**Target:** ES2017
**JSX:** preserve (handled by Next.js)

## Important Constraints

### What NOT to Do

**Don't use server-side features:**
- No `getServerSideProps`
- No API routes (`/api/*`)
- No server actions
- No ISR (Incremental Static Regeneration)

**Don't use Image Optimization:**
```typescript
// Images are unoptimized in next.config.js
// Use <Image unoptimized /> or just <img>
```

**Don't create inline styles:**
```typescript
// Bad
<div style={{ color: 'blue' }}>

// Good
<div className="text-blue-600">
```

**Don't use CSS-in-JS libraries:**
- Project uses Tailwind CSS only
- No styled-components, emotion, etc.

### What TO Do

**Use Tailwind utilities:**
```typescript
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-soft">
```

**Use custom utility classes:**
```typescript
<section className="container-custom section-padding">
```

**Use Lucide icons:**
```typescript
import { Heart, Calendar, Phone } from 'lucide-react';

<Heart className="w-6 h-6 text-primary-600" />
```

**Use semantic HTML:**
```typescript
<article>
  <header>
    <h2 className="heading-2">Title</h2>
  </header>
  <p className="body">Content</p>
</article>
```

## Component Reference

For detailed component documentation including props, variants, and usage examples, see `COMPONENTS.md` (1153 lines of comprehensive component analysis).

**Quick component finder:**
- Buttons/Forms: `/ui/`, `/forms/`
- Layout structure: `/layout/`
- Navigation: `/navigation/`
- Modals/Alerts: `/interactive/`
- Doctor cards: `/people/`
- Content blocks: `/content/`
- Image galleries: `/media/`

## Additional Documentation

- **README.md**: Project overview, features, setup instructions
- **COMPONENTS.md**: Exhaustive component analysis with examples
