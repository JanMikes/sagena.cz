# Creating New Strapi Components - Complete Guide

**Purpose:** Step-by-step guide for Claude Code to add new components to both Strapi CMS and Next.js frontend, integrating them into the dynamic zone system.

---

## 📚 Component vs Element

| Aspect | Component | Element |
|--------|-----------|---------|
| **Location** | `strapi/src/components/components/` | `strapi/src/components/elements/` |
| **Usage** | Standalone in dynamic zones | Nested within components |
| **Example** | `components.full-width-cards` | `elements.full-width-card` |
| **Naming** | Plural (cards, arguments, items) | Singular (card, argument, item) |
| **Repeatable** | Not applicable | Usually `"repeatable": true` |

**Rule of thumb:** If it contains an array of items, you need BOTH a component (container) and an element (item).

---

## 🚀 Step-by-Step Process

### Phase 1: Strapi Backend

#### Step 1.1: Create Strapi Element (if needed)

**Location:** `strapi/src/components/elements/YOUR-ELEMENT-NAME.json`

**When needed:** Component contains repeatable items (arrays)

**Example:** `elements/full-width-card.json`
```json
{
  "collectionName": "components_elements_full_width_cards",
  "info": {
    "displayName": "full-width-card",
    "icon": "apps"
  },
  "options": {},
  "attributes": {
    "icon": {
      "type": "enumeration",
      "required": true,
      "enum": [
        "Calendar",
        "FileText",
        "Users",
        "Phone",
        "Mail",
        "MapPin",
        "Briefcase",
        "Heart",
        "Activity",
        "Stethoscope",
        "Building"
      ]
    },
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text",
      "required": true
    },
    "link": {
      "type": "component",
      "component": "elements.text-link",
      "repeatable": false,
      "required": true
    }
  },
  "config": {}
}
```

**Field type reference:**
| Strapi Type | TypeScript Type | Example Usage |
|-------------|----------------|---------------|
| `string` | `string` | Short text (titles, names) |
| `text` | `string` | Long text (descriptions) |
| `richtext` | `string` | HTML content |
| `enumeration` | `'option1' \| 'option2'` | Variants, options (not for icons) |
| `boolean` | `boolean` | Flags (disabled, visible) |
| `date` | `string` | ISO date strings |
| `media` | `StrapiMedia` | Images, files |
| `component` | `Elements*` | Nested components |
| `relation` | `Page \| Icon` | Links to other content |

**Icon field structure:**
For icon fields, use a **oneToOne relation** to `api::icon.icon`:
```json
{
  "icon": {
    "type": "relation",
    "relation": "oneToOne",
    "target": "api::icon.icon"
  }
}
```

The Icon content type (`api::icon.icon`) has:
- `name` (string, required) - Icon identifier
- `image` (media, required) - Icon image file (SVG/PNG recommended)

**Naming rules:**
- **Collection name:** `components_elements_YOUR_NAME_plural`
- **Display name:** `your-element-name` (kebab-case, singular)
- **Icon:** Choose from Strapi's icon set (apps, bulletList, dashboard, etc.)

---

#### Step 1.2: Create Strapi Component

**Location:** `strapi/src/components/components/YOUR-COMPONENT-NAME.json`

**Example:** `components/full-width-cards.json`
```json
{
  "collectionName": "components_components_full_width_cards",
  "info": {
    "displayName": "full-width-cards",
    "icon": "apps"
  },
  "options": {},
  "attributes": {
    "cards": {
      "type": "component",
      "component": "elements.full-width-card",
      "repeatable": true,
      "required": true
    }
  },
  "config": {}
}
```

**Component patterns:**

**Pattern 1: Simple component (no repeatable items)**
```json
{
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "text", "required": true },
    "image": { "type": "media", "multiple": false }
  }
}
```

**Pattern 2: Component with repeatable items**
```json
{
  "attributes": {
    "items": {
      "type": "component",
      "component": "elements.your-item",
      "repeatable": true,
      "required": true
    },
    "columns": {
      "type": "enumeration",
      "enum": ["Two columns", "Three columns", "Four columns"],
      "default": "Three columns"
    }
  }
}
```

**Pattern 3: Component with settings/configuration**
```json
{
  "attributes": {
    "content": { "type": "text", "required": true },
    "autoplay": { "type": "boolean", "default": false },
    "interval": { "type": "integer", "default": 5000 }
  }
}
```

**Naming rules:**
- **Collection name:** `components_components_YOUR_NAME_plural`
- **Display name:** `your-component-name` (kebab-case, plural for containers)
- **Icon:** Choose descriptive icon (apps for cards, dashboard for grids, etc.)

---

#### Step 1.3: Add Component to Dynamic Zone

**Location:** `strapi/src/api/page/content-types/page/schema.json`

**Find the `content` or `sidebar` dynamic zone and add your component:**

```json
{
  "content": {
    "type": "dynamiczone",
    "pluginOptions": {
      "i18n": {
        "localized": true
      }
    },
    "components": [
      "components.text",
      "components.heading",
      "components.alert",
      "components.links-list",
      "components.video",
      "components.service-cards",
      "components.full-width-cards"  // ← ADD YOUR COMPONENT HERE
    ],
    "required": true
  }
}
```

**Which dynamic zone?**
- **`content`:** Main page content area (most components go here)
- **`sidebar`:** Sidebar components only (limited subset)

**Check sidebar restrictions in STRAPI_COMPONENTS_TODO.md** - not all components are suitable for sidebars.

---

#### Step 1.4: Restart Strapi

```bash
docker compose restart strapi
```

**Wait for:** Strapi auto-generates TypeScript types in `strapi/types/generated/components.d.ts`

**Verify generation:**
```bash
cat strapi/types/generated/components.d.ts | grep -A 10 "YourComponentName"
```

You should see your component's TypeScript interface.

---

### Phase 2: Frontend Implementation

#### Step 2.1: Implement React Component

**Location:** `frontend/src/components/[domain]/YourComponent.tsx`

**Domain categories:**
- `content/` - Content display (cards, articles, galleries)
- `marketing/` - Marketing elements (arguments, timelines, sliders)
- `people/` - People-related (doctor profiles, contact cards)
- `layout/` - Layout utilities (dividers, button groups, directions)
- `interactive/` - Interactive UI (expandable sections, forms)
- `media/` - Media components (photo galleries, videos)
- `navigation/` - Navigation elements (menus, breadcrumbs, links)
- `typography/` - Text elements (headings, rich text)

**Example:** `frontend/src/components/content/FullWidthCards.tsx`
```tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Card item from Strapi (for CMS-driven pages)
 */
interface StrapiCardItem {
  icon?: string | null;  // Icon image URL from Strapi
  title: string;
  description: string;
  link: {
    text: string;
    url: string;
  };
}

interface FullWidthCardsProps {
  cards: StrapiCardItem[];
}

const FullWidthCards: React.FC<FullWidthCardsProps> = ({ cards }) => {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => {
        const url = card.link.url;

        return (
          <Link
            key={index}
            href={url}
            className="flex items-center space-x-4 p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md hover:bg-primary-50/30 transition-all duration-300 group w-full"
          >
            {card.icon && (
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                <Image
                  src={card.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{card.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FullWidthCards;
```

**Component best practices:**
- ✅ Use TypeScript interfaces for all props
- ✅ Use Tailwind CSS classes (NO inline `style={{}}`)
- ✅ Follow existing design patterns (colors, spacing, hover states)
- ✅ Use semantic HTML (`<article>`, `<section>`, `<nav>`)
- ✅ Add ARIA labels for accessibility
- ⚠️ Only use `'use client'` if component uses React hooks (useState, useEffect)
- ⚠️ Prefer server components (static export compatible)

**Icon handling:**
Icons are stored as Strapi media (images) using the `api::icon.icon` content type. Each icon has a `name` field and an `image` field. Components reference icons via a oneToOne relation, and the frontend renders them as `<img>` tags using the Strapi media URL.

---

#### Step 2.2: Update TypeScript Types

**Location:** `frontend/src/types/strapi.ts`

**Add two interfaces:**

1. **Element interface** (if you created an element):
```typescript
/**
 * Elements: Full Width Card
 * Location: strapi/src/components/elements/full-width-card.json
 * Usage: Individual full-width card with icon, title, description, and required link
 *
 * IMPORTANT: Strapi returns relations directly (no .data wrapper)
 */
export interface ElementsFullWidthCard {
  id: number;
  __component?: 'elements.full-width-card';
  icon?: Icon;  // Optional icon relation (oneToOne to api::icon.icon)
  title: string;
  description: string;
  link: ElementsTextLink;  // Required link
}
```

2. **Component interface**:
```typescript
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
```

3. **Add to union type:**
```typescript
/**
 * Page content dynamic zone - all components that can appear in page content area
 */
export type PageContentComponent =
  | ComponentsHeading
  | ComponentsText
  | ComponentsAlert
  | ComponentsLinksList
  | ComponentsVideo
  | ComponentsServiceCards
  | ComponentsFullWidthCards;  // ← ADD HERE
```

**Type naming conventions:**
- Component interfaces: `Components{PascalCase}` (e.g., `ComponentsFullWidthCards`)
- Element interfaces: `Elements{PascalCase}` (e.g., `ElementsFullWidthCard`)
- Enum types: Union of string literals (e.g., `'Two columns' | 'Three columns'`)

**IMPORTANT: Strapi returns data directly, NOT wrapped in `.data.attributes`**
```typescript
// ✅ CORRECT
link: ElementsTextLink;
page?: Page;

// ❌ WRONG
link: { data: { attributes: ElementsTextLink } };
page?: { data: { attributes: Page } };
```

---

#### Step 2.3: Update DynamicZone Renderer

**Location:** `frontend/src/components/strapi/DynamicZone.tsx`

**Add import:**
```typescript
import FullWidthCards from '@/components/content/FullWidthCards';
import {
  // ... existing imports
  ComponentsFullWidthCards,
} from '@/types/strapi';
```

**Add case to switch statement:**
```typescript
function renderComponent(
  component: PageContentComponent | PageSidebarComponent,
  index: number
): React.ReactNode {
  const { __component } = component;

  switch (__component) {
    // ... existing cases

    case 'components.full-width-cards': {
      const fullWidthCardsComponent = component as ComponentsFullWidthCards;

      // Transform Strapi data to component props
      const cards = fullWidthCardsComponent.cards.map((card) => {
        // Extract icon URL from Strapi media relation
        const iconUrl = card.icon?.image?.attributes?.url
          ? getStrapiMediaURL(card.icon.image.attributes.url)
          : null;

        // Resolve link (required for full-width cards)
        const resolved = resolveTextLink(card.link);

        return {
          icon: iconUrl,
          title: card.title,
          description: card.description,
          link: {
            text: card.link.text,
            url: resolved.url,
          },
        };
      });

      return (
        <FullWidthCards
          key={`${__component}-${component.id || index}`}
          cards={cards}
        />
      );
    }

    default:
      console.warn(`Unknown component type: ${__component}`);
      return null;
  }
}
```

**Key patterns:**

**Pattern 1: Simple component (no transformation)**
```typescript
case 'components.simple': {
  const simpleComponent = component as ComponentsSimple;
  return (
    <SimpleComponent
      key={`${__component}-${component.id || index}`}
      title={simpleComponent.title}
      description={simpleComponent.description}
    />
  );
}
```

**Pattern 2: Component with icon mapping**
```typescript
case 'components.with-icons': {
  const withIconsComponent = component as ComponentsWithIcons;

  const items = withIconsComponent.items.map((item) => {
    // Extract icon URL from Strapi media relation
    const iconUrl = item.icon?.image?.attributes?.url
      ? getStrapiMediaURL(item.icon.image.attributes.url)
      : null;

    return {
      icon: iconUrl,
      title: item.title,
      description: item.description,
    };
  });

  return (
    <WithIconsComponent
      key={`${__component}-${component.id || index}`}
      items={items}
    />
  );
}
```

**Pattern 3: Component with link resolution**
```typescript
case 'components.with-links': {
  const withLinksComponent = component as ComponentsWithLinks;

  const links = withLinksComponent.links.map((link) => {
    const resolved = resolveTextLink(link);

    return {
      title: link.text,
      url: resolved.url,
      external: resolved.external,
      disabled: resolved.disabled,
    };
  });

  return (
    <WithLinksComponent
      key={`${__component}-${component.id || index}`}
      links={links}
    />
  );
}
```

**Pattern 4: Component with column mapping**
```typescript
case 'components.with-columns': {
  const withColumnsComponent = component as ComponentsWithColumns;

  // Convert column enum to number
  const columnMap: Record<string, 2 | 3 | 4> = {
    'Two columns': 2,
    'Three columns': 3,
    'Four columns': 4,
  };
  const columns = columnMap[withColumnsComponent.columns] || 3;

  return (
    <WithColumnsComponent
      key={`${__component}-${component.id || index}`}
      items={withColumnsComponent.items}
      columns={columns}
    />
  );
}
```

---

#### Step 2.4: Update API Population Query

**Location:** `frontend/src/lib/strapi.ts`

**Find `fetchPageBySlug()` function and update the `populate` parameter:**

```typescript
export async function fetchPageBySlug(
  slug: string,
  locale: string = 'cs-CZ'
): Promise<Page | null> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Page>>('/pages', {
      locale,
      populate: {
        content: {
          on: {
            'components.heading': { populate: '*' },
            'components.text': { populate: '*' },
            'components.alert': { populate: '*' },
            'components.video': { populate: '*' },
            'components.links-list': {
              populate: {
                links: {
                  populate: ['page', 'file'],
                },
              },
            },
            'components.service-cards': {
              populate: {
                cards: {
                  populate: {
                    icon: {
                      populate: ['image'],
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
            'components.full-width-cards': {  // ← ADD YOUR COMPONENT HERE
              populate: {
                cards: {
                  populate: {
                    icon: {
                      populate: ['image'],
                    },
                    link: {
                      populate: ['page', 'file'],
                    },
                  },
                },
              },
            },
          },
        },
        sidebar: {
          // ... same pattern for sidebar if applicable
        },
        parent: true,
      },
    });
    // ... rest of function
  }
}
```

**Population depth rules:**

| Component Structure | Population Strategy | Example |
|---------------------|---------------------|---------|
| **Simple fields only** | `populate: '*'` | Heading, Text, Alert |
| **Repeatable component (no nested relations)** | `populate: { cards: { populate: '*' } }` | Simple card list |
| **Repeatable with nested relations** | `populate: { cards: { populate: { link: { populate: ['page', 'file'] } } } }` | Cards with links |
| **Multiple nested levels** | Explicit nesting for each level | Complex structures |

**CRITICAL: Strapi's `populate=*` only goes ONE level deep!**

```typescript
// ❌ WRONG - Won't populate nested relations
'components.full-width-cards': { populate: '*' }

// ✅ CORRECT - Explicitly populate nested relations
'components.full-width-cards': {
  populate: {
    cards: {
      populate: {
        link: {
          populate: ['page', 'file'],
        },
      },
    },
  },
}
```

**How to determine correct population:**

1. **Check component structure:**
   - Does it have repeatable items? → Need `populate: { items: { ... } }`
   - Do items have relations? → Need nested `populate: ['relation1', 'relation2']`

2. **Test in Strapi API:**
```bash
# Test your population query
curl "http://localhost:1337/api/pages?populate[content][on][components.your-component][populate][items][populate][link][populate][0]=page&populate[content][on][components.your-component][populate][items][populate][link][populate][1]=file"
```

3. **Verify in response:**
   - Check that all nested data is present (not `null`)
   - Verify relations are populated (page, file)

---

#### Step 2.5: Update Existing Page Usages (if applicable)

**If component was previously hardcoded on pages:**

1. **Search for component usage:**
```bash
cd frontend
grep -r "YourComponent" src/app/
```

2. **Check if data structure changed:**
   - Compare old props vs new Strapi structure
   - Update any hardcoded data to match new interface

3. **Example migration:**
```typescript
// OLD (hardcoded)
<FullWidthCards cards={[
  { icon: Calendar, title: 'Title', url: '/url', linkText: 'Link' }
]} />

// NEW (from Strapi)
<FullWidthCards cards={[
  { icon: Calendar, title: 'Title', description: 'Desc', link: { text: 'Link', url: '/url' } }
]} />
```

**If migration is complex:**
- Consider keeping backward compatibility
- Use type guards (see FullWidthCards.tsx example)
- Add deprecation warnings for old format

---

### Phase 3: Testing & Validation

#### Step 3.1: Run Frontend Linter

**Inside Docker container:**
```bash
docker compose exec frontend npm run lint
```

**Fix common errors:**
```bash
# Auto-fix formatting
docker compose exec frontend npm run lint:fix

# Check TypeScript errors
docker compose exec frontend npx tsc --noEmit
```

**Common lint errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `'Component' is defined but never used` | Unused import | Remove import |
| `Type 'X' is not assignable to type 'Y'` | Type mismatch | Check TypeScript interface |
| `Missing key prop` | Map without key | Add `key={index}` or `key={item.id}` |
| `Unexpected any` | Missing type annotation | Add explicit type |

---

#### Step 3.2: Build Frontend

```bash
docker compose exec frontend npm run build
```

---

#### Step 3.3: Update TODO Documentation

Update `STRAPI_COMPONENTS_TODO.md` - move the implemented component from "Priority Components to Add" to "Currently Integrated Components"

---

**Last Updated:** 2025-11-13
