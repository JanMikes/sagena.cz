# Strapi Integration Guide

**Purpose:** Complete technical guide for integrating Strapi CMS with Next.js frontend.

## Table of Contents

- [Mental Model](#mental-model)
- [Core Concepts](#core-concepts)
- [Population Strategy](#population-strategy)
- [Response Structure](#response-structure)
- [Type System](#type-system)
- [Adding Components](#adding-components)
- [Debugging](#debugging)
- [Best Practices](#best-practices)

---

## Mental Model

### Integration Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Strapi    │───>│  Population  │───>│  API        │───>│  TypeScript  │───>│  React      │
│   Schema    │    │  Query       │    │  Response   │    │  Types       │    │  Component  │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
      │                   │                   │                   │                   │
schema.json        strapi.ts          JSON (direct)      types/strapi.ts    DynamicZone.tsx
                 fetchPageBySlug()     no .attributes       interfaces        switch cases
```

### **Critical Understanding:**

1. **Build Time vs Runtime**
   - All data fetching happens at **BUILD TIME** (SSG)
   - No data fetching in browser (static export)
   - Missing data at build = missing forever

2. **Population is Explicit**
   - Strapi doesn't auto-populate relations
   - `populate=*` only goes ONE level deep
   - Deep relations need explicit config

3. **Direct Data Access**
   - Strapi returns properties directly
   - NO `.data.attributes` wrapper in API response
   - `schema.json` structure ≠ API response structure

---

## Core Concepts

### Components vs Elements

**Components** (`strapi/src/components/components/`)
- Standalone UI components
- Can be added directly to dynamic zones via Strapi admin
- Examples: `components.heading`, `components.text`, `components.alert`
- Rendered by DynamicZone.tsx

**Elements** (`strapi/src/components/elements/`)
- Never standalone
- Always embedded within other components
- Examples: `elements.link`, `elements.text-link`
- Never added to dynamic zones directly

```
✓ Correct:
Page → content (dynamic zone) → components.heading

✗ Wrong:
Page → content (dynamic zone) → elements.link
(elements cannot be added to dynamic zones)
```

### Dynamic Zones

**What is a Dynamic Zone?**
- Polymorphic structure that can contain multiple component types
- Order is preserved
- Each component has `__component` field identifying its type

**Page Structure:**
```typescript
interface Page {
  title: string;
  slug: string;
  content: PageContentComponent[];   // Dynamic zone (REQUIRED)
  sidebar?: PageSidebarComponent[];  // Dynamic zone (OPTIONAL)
}

type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | ComponentsAlert
  | ComponentsLinksList
  | ComponentsVideo;
```

**How It Works:**
1. Content editor adds components in Strapi admin
2. Each component has `__component: 'components.xxx'`
3. DynamicZone.tsx switches on `__component` field
4. Renders appropriate React component

---

## Population Strategy

### Understanding Depth Levels

**Level 0:** Just the entity
```typescript
// Request
{ }

// Response
{ id: 1, title: "Page", slug: "test" }
// Relations are null/undefined
```

**Level 1:** `populate=*` (immediate relations/components)
```typescript
// Request
{ populate: '*' }

// Response
{
  id: 1,
  title: "Page",
  slug: "test",
  content: [ /* components populated */ ],
  parent: { id: 2, title: "Parent" } // Only ID + basic fields
}
// Nested relations inside components are NOT populated!
```

**Level 2+:** Explicit nested population
```typescript
// Request
{
  populate: {
    content: { populate: '*' },
    parent: { populate: ['slug', 'title'] }
  }
}

// Response - Nested relations are now included
```

### Population Rules

**Simple Relation (One Level):**
```typescript
{
  populate: 'fieldName'  // or
  populate: true
}
```

**Component with Relations:**
```typescript
{
  populate: {
    componentName: {
      populate: ['relation1', 'relation2']
    }
  }
}

// Example: Navigation with link component
{
  populate: {
    link: {
      populate: ['page', 'file']  // page and file are nested relations
    }
  }
}
```

**Dynamic Zone (Shallow):**
```typescript
{
  populate: {
    content: { populate: '*' }
  }
}
// Only populates immediate fields, NOT nested relations within components
```

**Dynamic Zone (Deep) - RECOMMENDED:**
```typescript
{
  populate: {
    content: {
      on: {  // Use 'on' to target each component type
        'components.heading': { populate: '*' },
        'components.text': { populate: '*' },
        'components.links-list': {
          populate: {
            links: {  // Deep populate nested elements
              populate: ['page', 'file']
            }
          }
        }
      }
    }
  }
}
```

### Why `on` Syntax for Dynamic Zones

**Problem:**
```typescript
// ❌ THIS FAILS
{
  populate: {
    content: {
      populate: {
        links: { populate: ['page', 'file'] }  // Cannot target specific field
      }
    }
  }
}
// Error: "Invalid nested population query detected"
```

**Why?**
Dynamic zones are polymorphic - they contain different component types. Strapi doesn't know which components have a `links` field. Using `populate: { specificField }` tries to populate a field that might not exist in all components.

**Solution - Use `on`:**
```typescript
// ✓ CORRECT
{
  populate: {
    content: {
      on: {  // Target each component type explicitly
        'components.heading': { populate: '*' },
        'components.links-list': {
          populate: {
            links: { populate: ['page', 'file'] }
          }
        }
      }
    }
  }
}
```

**When to use `on`:**
- Components have nested relations (e.g., links with page/file references)
- Need different population strategies per component type
- Deep nesting (3+ levels)

### Decision Tree

```
Is it a field with no relations?
  └─> No populate needed

Is it a simple relation (one level)?
  └─> populate: 'fieldName' or populate: true

Is it a component with nested relations?
  └─> populate: { component: { populate: ['rel1', 'rel2'] } }

Is it a dynamic zone (all components same structure)?
  └─> populate: { zone: { populate: '*' } }

Is it a dynamic zone (components have different nested relations)?
  └─> populate: { zone: { on: { 'components.x': { populate: ... } } } }
```

### Real Examples from Codebase

**Navigation (Component with Nested Relations):**
```typescript
// strapi.ts - fetchNavigation()
{
  locale: 'cs-CZ',
  populate: {
    link: {  // link is a component
      populate: ['page', 'file']  // page and file are nested relations
    }
  }
}
```

**Page (Dynamic Zone with Deep Relations):**
```typescript
// strapi.ts - fetchPageBySlug()
{
  locale: 'cs-CZ',
  populate: {
    content: {
      on: {
        'components.heading': { populate: '*' },
        'components.text': { populate: '*' },
        'components.alert': { populate: '*' },
        'components.video': { populate: '*' },
        'components.links-list': {
          populate: {
            links: {  // links is array of elements.text-link
              populate: ['page', 'file']  // Each link has page/file relations
            }
          }
        }
      }
    },
    sidebar: {
      on: {
        'components.heading': { populate: '*' },
        'components.text': { populate: '*' },
        'components.alert': { populate: '*' },
        'components.links-list': {
          populate: {
            links: { populate: ['page', 'file'] }
          }
        }
      }
    },
    parent: true  // Simple relation
  }
}
```

---

## Response Structure

### The `.attributes` Myth

**CRITICAL:** `schema.json` structure ≠ API response structure!

**Schema Definition (Internal Strapi):**
```json
// strapi/src/api/page/content-types/page/schema.json
{
  "attributes": {
    "title": { "type": "string" },
    "slug": { "type": "string" }
  }
}
```

**API Response (What You Actually Get):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Home",      // ← Direct property, NOT in "attributes"
      "slug": "homepage"    // ← Direct property, NOT in "attributes"
    }
  ]
}
```

### Access Patterns

**✓ CORRECT:**
```typescript
nav.title
nav.navbar
page.slug
link.page.slug        // Relations are direct too!
link.file.url
```

**✗ WRONG:**
```typescript
nav.attributes.title
page.attributes.slug
link.page.data.attributes.slug
```

### Relations are Direct

**Example from API:**
```json
{
  "link": {
    "id": 5,
    "page": {              // ← Direct, no "data" wrapper
      "id": 1,
      "slug": "about",     // ← Direct property
      "title": "About Us"
    },
    "file": {              // ← Direct, no "data" wrapper
      "id": 3,
      "attributes": {      // ← Files DO have attributes (exception!)
        "url": "/uploads/document.pdf",
        "name": "document.pdf"
      }
    }
  }
}
```

**Why Files Have `.attributes`:**
Files/media are handled differently by Strapi - they're a special system type that retains the attributes wrapper. This is a Strapi quirk, not a pattern.

### Collection vs Single Response

**Collection Response:**
```typescript
interface StrapiCollectionResponse<T> {
  data: T[];  // Array of items
  meta: {
    pagination?: { ... }
  };
}

// Usage
const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages');
const pages = response.data;  // Array
```

**Single Response:**
```typescript
interface StrapiResponse<T> {
  data: T | null;  // Single item or null
  meta: {};
}

// Usage
const response = await fetchAPI<StrapiResponse<Page>>('/pages/1');
const page = response.data;  // Single object or null
```

---

## Type System

### Type Definition Locations

**Strapi Generated Types:**
```
strapi/types/generated/components.d.ts
```
- Auto-generated by Strapi
- Based on schema.json files
- Regenerate with: cd strapi && npm run build

**Frontend Types:**
```
frontend/src/types/strapi.ts
```
- Manually maintained
- Must match Strapi schema structure
- Includes helper types (ResolvedLink, NavigationItem)

### Creating Component Interface

**Pattern:**
```typescript
// frontend/src/types/strapi.ts

export interface ComponentsXxx {
  id: number;
  __component: 'components.xxx';  // REQUIRED - identifies component type
  // ... your fields
}

// Add to union type
export type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | ComponentsXxx;  // ← Add new component here
```

**Example:**
```typescript
export interface ComponentsVideo {
  id: number;
  __component: 'components.video';
  youtube_id: string;
  aspect_ratio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}

export type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | ComponentsAlert
  | ComponentsLinksList
  | ComponentsVideo;  // ← Added
```

### Type Safety Best Practices

**Use Type Guards:**
```typescript
function renderComponent(component: PageContentComponent) {
  const { __component } = component;

  switch (__component) {
    case 'components.heading': {
      const headingComponent = component as ComponentsHeading;
      // TypeScript now knows exact shape
      return <Heading text={headingComponent.text} />;
    }
  }
}
```

**Avoid `any`:**
```typescript
// ❌ Bad
const links: any[] = component.links;

// ✓ Good
const links: ElementsTextLink[] = component.links;
```

---

## Adding Components

### The Three Mandatory Steps

**CRITICAL:** Forgetting ANY of these causes silent failures!

#### Step 1: Create Component in Strapi

**Via Strapi Admin:**
1. Content-Type Builder → Components
2. Create new component
3. Add fields
4. Save

**Via Code:**
```
strapi/src/components/components/video.json
```

#### Step 2: Add TypeScript Interface (Frontend)

**File:** `frontend/src/types/strapi.ts`

```typescript
// 1. Create interface
export interface ComponentsVideo {
  id: number;
  __component: 'components.video';  // MUST match Strapi name
  youtube_id: string;
  aspect_ratio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}

// 2. Add to union type
export type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | ComponentsAlert
  | ComponentsLinksList
  | ComponentsVideo;  // ← Add here
```

#### Step 3: Update Population Query (CRITICAL!)

**File:** `frontend/src/lib/strapi.ts`

**Function:** `fetchPageBySlug()`

```typescript
const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
  locale,
  populate: {
    content: {
      on: {
        'components.heading': { populate: '*' },
        'components.text': { populate: '*' },
        'components.alert': { populate: '*' },
        'components.video': { populate: '*' },  // ← ADD THIS!
        'components.links-list': {
          populate: {
            links: { populate: ['page', 'file'] },
          },
        },
      },
    },
    sidebar: {
      on: {
        // Add here too if component should appear in sidebar
      },
    },
    parent: true,
  },
});
```

**WHY THIS IS CRITICAL:**
Without this, Strapi **will not return the component data** in the API response. The component will exist in the CMS, but the API response will have an empty array. This is a **silent failure** - no errors, just missing content.

#### Step 4: Update DynamicZone Renderer

**File:** `frontend/src/components/strapi/DynamicZone.tsx`

```typescript
// 1. Import React component
import Video from '@/components/content/Video';

// 2. Import TypeScript type
import { ComponentsVideo } from '@/types/strapi';

// 3. Add case to switch statement
switch (__component) {
  // ... existing cases

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
}
```

#### Step 5: Create React Component

**File:** `frontend/src/components/content/Video.tsx`

```typescript
interface VideoProps {
  youtubeId: string;
  aspectRatio: 'Ratio 16/9' | 'Ratio 4/3' | 'Ratio 1/1';
}

const Video: React.FC<VideoProps> = ({ youtubeId, aspectRatio }) => {
  // Component implementation
};

export default Video;
```

### Verification Checklist

After adding a component, verify:

- [ ] Component appears in Strapi admin Content-Type Builder
- [ ] Can add component to page in Strapi admin
- [ ] TypeScript interface added to `types/strapi.ts`
- [ ] Added to `PageContentComponent` or `PageSidebarComponent` union type
- [ ] **Population query updated in `strapi.ts` (DON'T FORGET!)**
- [ ] Case added to DynamicZone.tsx switch statement
- [ ] React component created and imported
- [ ] Build succeeds: `cd frontend && npm run build`
- [ ] Component renders on page

### Test Workflow

```bash
# 1. Add component to page in Strapi admin
# 2. Check network tab - does API response include component?
# 3. If NO → Check population query (step 3)
# 4. If YES → Check DynamicZone.tsx (step 4)
# 5. Build and verify
cd frontend && npm run build
```

---

## Debugging

### Component Not Appearing (Silent Failure)

**Symptoms:**
- Component added in Strapi admin ✓
- No console errors ✓
- No TypeScript errors ✓
- Component just doesn't render ✗

**Diagnosis:**

1. **Check API Response**
   - Open browser DevTools → Network tab
   - Find request to `/api/pages?...`
   - Check response JSON
   - Search for `__component": "components.your-component"`

2. **If NOT in response → Missing Population**
   ```typescript
   // Fix: Add to fetchPageBySlug() in strapi.ts
   'components.your-component': { populate: '*' }
   ```

3. **If IN response → Check DynamicZone**
   ```typescript
   // Fix: Add case to DynamicZone.tsx
   case 'components.your-component': {
     // Render logic
   }
   ```

### Common Errors

#### Error: "Failed to fetch: connect ECONNREFUSED 127.0.0.1:1337"

**Cause:** Using `localhost:1337` in Docker build

**Fix:** Use correct environment variable
```bash
# In compose.override.yaml or .env
STRAPI_URL=http://strapi:1337  # NOT localhost!
```

**See:** `.claude/docker-networking.md` for details

#### Error: "Cannot read property 'X' of undefined"

**Cause:** Missing population - relation is null/undefined

**Diagnosis:**
```typescript
// Check API response
{
  "link": {
    "id": 5,
    "page": null  // ← Should be object, but is null!
  }
}
```

**Fix:** Add nested population
```typescript
populate: {
  link: {
    populate: ['page', 'file']  // ← Add this
  }
}
```

#### Error: "Invalid nested population query detected"

**Cause:** Using `populate: { field }` in dynamic zone

**Fix:** Use `on` syntax
```typescript
// ❌ Wrong
populate: {
  content: {
    populate: {
      links: { populate: ['page'] }
    }
  }
}

// ✓ Correct
populate: {
  content: {
    on: {
      'components.links-list': {
        populate: {
          links: { populate: ['page'] }
        }
      }
    }
  }
}
```

### Debugging Workflow

```
1. Check Strapi Admin
   - Can you add component to page? → YES: Continue
   - NO: Check component is in dynamic zone config

2. Check API Response (Network Tab)
   - Is component in response? → YES: Go to step 4
   - NO: Continue

3. Check Population Query
   - Is component added to fetchPageBySlug()? → NO: Add it
   - YES: Check syntax (use 'on' for dynamic zones)

4. Check DynamicZone.tsx
   - Is case added for __component? → NO: Add it
   - YES: Check props mapping

5. Check React Component
   - Does component exist? → NO: Create it
   - YES: Check props match interface

6. Check Console
   - Any warnings? → Fix warnings
   - "Unknown component type"? → Case not added or wrong name

7. Build Test
   - Run: cd frontend && npm run build
   - Errors? → Fix TypeScript errors
   - Success? → Component should render
```

---

## Best Practices

### Population Strategy

**1. Populate Only What You Need**
```typescript
// ❌ Over-population
populate: '*'  // Populates everything, slow

// ✓ Specific population
populate: ['title', 'slug', 'content']
```

**2. Use `on` for Dynamic Zones with Relations**
```typescript
// Always use 'on' when components have nested relations
populate: {
  content: {
    on: {
      'components.x': { populate: '*' },
      'components.y': { populate: { field: { populate: ['rel'] } } }
    }
  }
}
```

**3. Document Your Population Strategy**
```typescript
/**
 * POPULATION STRATEGY:
 * - content: All components (3 levels deep)
 * - sidebar: All components (3 levels deep)
 * - parent: Basic fields only (1 level)
 *
 * Uses 'on' syntax for deep population of links within components.
 */
```

### Type Safety

**1. Always Add to Union Types**
```typescript
export type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | YourNewComponent;  // ← Don't forget!
```

**2. Use Type Guards in Renderers**
```typescript
case 'components.video': {
  const videoComponent = component as ComponentsVideo;
  // TypeScript knows exact shape
}
```

**3. Keep Types Synchronized**
- Change Strapi schema → Update frontend types
- Use same field names
- Match enum values exactly

### Error Prevention

**1. Always Test Build**
```bash
cd frontend && npm run build
```

**2. Verify in Network Tab**
- Check API response includes your data
- Check nested relations are populated

**3. Use TypeScript Strict Mode**
```json
// tsconfig.json
{
  "strict": true,
  "noImplicitAny": true
}
```

### Performance

**1. Build-Time Caching**
```typescript
// Strapi.ts already configured for build caching
cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store'
```

**2. Pagination for Large Collections**
```typescript
pagination: {
  pageSize: 100  // Adjust based on needs
}
```

**3. Field Selection**
```typescript
// Only fetch fields you need
fields: ['title', 'slug']  // Don't fetch unused fields
```

---

## Quick Reference

### Population Patterns

```typescript
// Simple relation
populate: 'fieldName'

// Component with relations
populate: { component: { populate: ['rel1', 'rel2'] } }

// Dynamic zone (shallow)
populate: { zone: { populate: '*' } }

// Dynamic zone (deep - RECOMMENDED)
populate: {
  zone: {
    on: {
      'components.x': { populate: '*' },
      'components.y': { populate: { nested: { populate: ['rel'] } } }
    }
  }
}
```

### Access Patterns

```typescript
// Direct property access (Strapi returns direct data)
page.title
page.slug
link.page.slug

// File attributes (exception - files keep .attributes)
link.file.attributes.url

// NO .data wrapper
// NO .attributes wrapper (except files)
```

### File Locations

```
Strapi Client:           frontend/src/lib/strapi.ts
TypeScript Types:        frontend/src/types/strapi.ts
Component Renderer:      frontend/src/components/strapi/DynamicZone.tsx
Strapi Generated Types:  strapi/types/generated/components.d.ts
Component Schemas:       strapi/src/components/
Content Type Schemas:    strapi/src/api/*/content-types/
```

### Common Commands

```bash
# Start Strapi (Docker)
docker compose up strapi

# Build frontend
cd frontend && npm run build

# Check Strapi logs
docker compose logs -f strapi

# Restart after changes
docker compose restart frontend
```
