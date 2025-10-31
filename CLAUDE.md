# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sagena is a **Next.js 15 static healthcare website** built with TypeScript, Tailwind CSS, and Lucide React. The project is configured for **static site generation (SSG)** and deploys to GitHub Pages. It contains a comprehensive component library with 36 reusable components organized by domain/function.

**Key Characteristics:**
- Static export (`output: 'export'` in next.config.js)
- App Router (not Pages Router)
- No server-side runtime or API routes
- Custom component library (not using Shadcn, MUI, etc.)
- Healthcare-focused design system

## Development Commands

### Common Commands
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build static site (outputs to /out/ directory)
npm start            # Start production server (not used for static export)
npm run lint         # Run ESLint
```

### Testing Changes
Always build the static site before pushing to verify it works correctly:
```bash
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

### Component Organization

Components are organized by **domain/function** (not by type):

```
src/components/
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

### Routing and Pages

Pages use **App Router** with file-based routing:

```
src/app/
├── layout.tsx           # Root layout (Header/Footer wrapper)
├── page.tsx             # Homepage (/)
├── komponenty/page.tsx  # Component showcase (/komponenty/)
├── s-panelem/page.tsx   # Sidebar layout demo (/s-panelem/)
└── intranet/page.tsx    # Intranet mockup (/intranet/)
```

**Creating a new page:**
1. Create directory: `src/app/new-route/`
2. Add `page.tsx` file
3. Build will automatically generate static route

**Layout hierarchy:**
- All pages are wrapped by `src/app/layout.tsx` (provides Header/Footer)
- Pages can define additional nested layouts

## Path Alias

Use `@/` for importing from `src/`:

```typescript
import Button from '@/components/ui/Button';
import { Doctor } from '@/components/people/Doctor';
```

Configured in `tsconfig.json`:
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

### Adding a New Component

1. **Choose category** based on function (e.g., `/forms/` for form component)
2. **Create file**: `src/components/[category]/ComponentName.tsx`
3. **Define TypeScript interface** for props
4. **Use Tailwind utilities** for styling
5. **Export default**
6. **Import using** `@/components/[category]/ComponentName`

Example:
```typescript
// src/components/ui/Alert.tsx
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

### Modifying Styles

**Global styles**: Edit `src/app/globals.css`
**Theme colors**: Edit `tailwind.config.ts`
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

If deploying elsewhere (Vercel, Netlify, etc.), see `DEPLOYMENT.md` for platform-specific instructions.

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
- **DEPLOYMENT.md**: Comprehensive deployment guide for 7+ platforms
- **COMPONENTS.md**: Exhaustive component analysis with examples
