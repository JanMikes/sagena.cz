# Strapi Dynamic Zone Components - Implementation TODO

**Purpose:** Checklist for defining missing components in Strapi admin panel to integrate with the dynamic zone system.

## Legend

- ✅ **Already Integrated** - Component is in DynamicZone.tsx
- 🎯 **Priority** - Should be added to dynamic zone
- ⚠️ **Client Component** - Uses React hooks, requires 'use client'
- 📦 **Repeatable** - Field that contains array of items (use Strapi repeatable component)
- 🔗 **Relation** - Field that links to another content type
- 🎨 **Enum** - Field with predefined options

---

## ✅ Currently Integrated Components (7)

These components are already implemented in the dynamic zone:

1. **components.heading** → Heading
2. **components.text** → RichText
3. **components.alert** → Alert
4. **components.links-list** → LinksList
5. **components.video** → Video
6. **components.service-cards** → ServiceCards (uses `elements.service-card`)
7. **components.full-width-cards** → FullWidthCards (uses `elements.full-width-card`)

---

## 🎯 Priority Components to Add (18)

### 📄 CONTENT COMPONENTS (4)

---

#### 1. Documents (components.documents)

**Location:** `/frontend/src/components/content/Documents.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `documents` | Component (repeatable) 📦 | ✓ | ✗ | Array of document items |

**Repeatable Component: `elements.document-item`**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `name` | Text (short) | ✓ | ✗ | Display name |
| `file` | Media (single) | ✓ | ✗ | The actual file |
| `size` | Text (short) | ✗ | ✓ | e.g., "245 KB" (can be auto-calculated) |
| `extension` | Text (short) | ✓ | ✗ | e.g., "pdf", "docx", "xlsx" |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `columns` | Enumeration 🎨 | ✗ | ✗ | Single column, Two columns, Three columns (default: Three columns) |

---

#### 2. News Article (components.news-article)

**Component name:** NewsArticle ✅ RENAMED
**Location:** `/frontend/src/components/content/NewsArticle.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✓ | ✗ | Article headline |
| `date` | Date | ✓ | ✗ | Publication date |
| `text` | Text (long) | ✓ | ✗ | Article excerpt/preview |
| `image` | Media (single) | ✗ | ✓ | Featured image |
| `read_more_link` | Component (single) | ✓ | ✗ | Use `elements.text-link` (includes text + target, default text: "Číst více") |

---

#### 3. Job Posting (components.job-posting)

**Component name:** JobPosting ✅ RENAMED
**Location:** `/frontend/src/components/content/JobPosting.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✓ | ✗ | Position title |
| `description` | Text (long) | ✓ | ✗ | Job description |
| `department` | Text (short) | ✓ | ✗ | e.g., "Kardiologie" |
| `employment_type` | Text (short) | ✓ | ✗ | e.g., "Plný úvazek", "Částečný úvazek" |
| `location` | Text (short) | ✓ | ✗ | e.g., "Frýdek-Místek" |
| `cta_link` | Component (single) | ✓ | ✗ | Use `elements.text-link` (includes text + target, default text: "Zobrazit pozici") |

---

#### 4. Partner Logos (components.partner-logos)

**Location:** `/frontend/src/components/content/PartnerLogos.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `partners` | Component (repeatable) 📦 | ✓ | ✗ | Array of partner items |

**Repeatable Component: `elements.partner-logo`**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `name` | Text (short) | ✓ | ✗ | Partner name |
| `logo` | Media (single) | ✓ | ✗ | Logo image |
| `url` | Text (short) | ✓ | ✗ | Partner website |
| `alt_text` | Text (short) | ✗ | ✓ | Alt text for accessibility |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `grayscale` | Boolean | ✗ | ✗ | Default: false (Color / Grayscale) |
| `columns` | Enumeration 🎨 | ✗ | ✗ | Two columns, Three columns, Four columns, Five columns, Six columns (default: Six columns) |
| `gap` | Enumeration 🎨 | ✗ | ✗ | Small spacing, Medium spacing, Large spacing (default: Medium spacing) |

---

### 🎯 MARKETING COMPONENTS (3)

---

#### 5. Marketing Arguments (components.marketing-arguments)

**Location:** `/frontend/src/components/marketing/MarketingArguments.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `arguments` | Component (repeatable) 📦 | ✓ | ✗ | Array of argument items |

**Repeatable Component: `elements.marketing-argument`**

| Field Name | Type | Required | Nullable | Options/Notes |
|------------|------|----------|----------|---------------|
| `display_type` | Enumeration 🎨 | ✓ | ✗ | Icon, Number |
| `icon` | Relation 🔗 | ✗ | ✓ | oneToOne to api::icon.icon (required if display_type = Icon) |
| `number` | Text (short) | ✗ | ✓ | e.g., "15+", "100%" (required if display_type = Number) |
| `title` | Text (short) | ✓ | ✗ | |
| `description` | Text (long) | ✓ | ✗ | |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `columns` | Enumeration 🎨 | ✗ | ✗ | Two columns, Three columns, Four columns (default: Three columns) |

**Note:** Either `icon` OR `number` should be provided based on `display_type`, not both.

---

#### 6. Timeline (components.timeline)

**Location:** `/frontend/src/components/marketing/Timeline.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `items` | Component (repeatable) 📦 | ✓ | ✗ | Array of timeline steps |

**Repeatable Component: `elements.timeline-item`**

| Field Name | Type | Required | Nullable | Options/Notes |
|------------|------|----------|----------|---------------|
| `display_type` | Enumeration 🎨 | ✓ | ✗ | Icon, Number |
| `icon` | Relation 🔗 | ✗ | ✓ | oneToOne to api::icon.icon (required if display_type = Icon) |
| `number` | Text (short) | ✗ | ✓ | e.g., "1", "2", "3" (required if display_type = Number) |
| `title` | Text (short) | ✓ | ✗ | |
| `description` | Text (long) | ✓ | ✗ | |

**Note:** Either `icon` OR `number` should be provided based on `display_type`, not both.

---

#### 7. Slider (components.slider) ⚠️

**Client Component:** Uses React hooks for navigation
**Location:** `/frontend/src/components/marketing/Slider.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `slides` | Component (repeatable) 📦 | ✓ | ✗ | Array of slide items |

**Repeatable Component: `elements.slide`**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✓ | ✗ | Slide headline |
| `description` | Text (long) | ✓ | ✗ | Slide content |
| `link` | Component (single) | ✗ | ✓ | Use `elements.text-link` (includes text + target) |
| `image` | Media (single) | ✗ | ✓ | Foreground image |
| `background_image` | Media (single) | ✗ | ✓ | Background image |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `autoplay` | Boolean | ✗ | ✗ | Default: false (Autoplay enabled / Autoplay disabled) |
| `autoplay_interval` | Number | ✗ | ✓ | Default: 5000 (milliseconds) |

---

### 📸 MEDIA COMPONENTS (2)

---

#### 8. Photo Gallery (components.photo-gallery) ⚠️

**Client Component:** Uses React hooks for lightbox
**Location:** `/frontend/src/components/media/PhotoGallery.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `photos` | Component (repeatable) 📦 | ✓ | ✗ | Array of photo items |

**Repeatable Component: `elements.photo`**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `image` | Media (single) | ✓ | ✗ | Photo file |
| `alt_text` | Text (short) | ✗ | ✓ | Alt text for accessibility |
| `caption` | Text (short) | ✗ | ✓ | Photo caption |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `columns` | Enumeration 🎨 | ✗ | ✗ | Two columns, Three columns, Four columns (default: Three columns) |

---

#### 9. Gallery Slider (components.gallery-slider) ⚠️

**Client Component:** Uses React hooks for navigation
**Location:** `/frontend/src/components/media/GallerySlider.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `photos` | Component (repeatable) 📦 | ✓ | ✗ | Array of photo items |

**Repeatable Component: `elements.photo`** (reuse from Photo Gallery)

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `image` | Media (single) | ✓ | ✗ | Photo file |
| `alt_text` | Text (short) | ✗ | ✓ | Alt text for accessibility |

---

### 👥 PEOPLE COMPONENTS (2)

---

#### 10. Doctor Profile (components.doctor-profile) ⚠️

**Component name:** DoctorProfile ✅ RENAMED
**Client Component:** Uses React hooks for collapsible sections
**Location:** `/frontend/src/components/people/DoctorProfile.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `ambulance_title` | Text (short) | ✗ | ✓ | Alternative title |
| `photo` | Media (single) | ✗ | ✓ | Doctor photo |
| `name` | Text (short) | ✓ | ✗ | Doctor name |
| `department` | Text (short) | ✓ | ✗ | e.g., "Kardiologie" |
| `positions` | Text (long) | ✓ | ✗ | Comma-separated or line-separated positions |
| `phones` | Text (long) | ✗ | ✓ | Comma-separated phone numbers |
| `emails` | Text (long) | ✗ | ✓ | Comma-separated emails |
| `opening_hours` | Component (repeatable) 📦 | ✗ | ✓ | Array of opening hour entries |
| `holiday_from` | Date | ✗ | ✓ | Holiday start date |
| `holiday_to` | Date | ✗ | ✓ | Holiday end date |

**Repeatable Component: `elements.opening-hours`**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `day` | Text (short) | ✓ | ✗ | e.g., "Pondělí" |
| `time` | Text (short) | ✓ | ✗ | e.g., "8:00 - 16:00" |

**Note:** Consider splitting `positions`, `phones`, `emails` into repeatable components for better structure in Strapi.

---

#### 11. Contact Card (components.contact-card)

**Component name:** ContactCard ✅ RENAMED
**Location:** `/frontend/src/components/people/ContactCard.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `name` | Text (short) | ✓ | ✗ | Contact person name |
| `email` | Email | ✗ | ✓ | Email address |
| `phone` | Text (short) | ✗ | ✓ | Phone number |
| `photo` | Media (single) | ✗ | ✓ | Contact photo |

---

### 🏗️ LAYOUT COMPONENTS (4)

---

#### 12. Directions (components.directions)

**Component name:** Directions ✅ RENAMED
**Location:** `/frontend/src/components/layout/Directions.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✗ | ✓ | Default: "Jak nás najít" |
| `instructions` | Component (repeatable) 📦 | ✓ | ✗ | Array of instruction steps |

**Repeatable Component: `elements.direction-step`**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `icon` | Relation 🔗 | ✗ | ✓ | oneToOne to api::icon.icon |
| `floor` | Text (short) | ✗ | ✓ | e.g., "1. patro", "2. patro, č. 215" |
| `text` | Text (long) | ✓ | ✗ | Instruction text |

---

#### 13. Section Divider (components.section-divider)

**Component name:** SectionDivider ✅ RENAMED
**Location:** `/frontend/src/components/layout/SectionDivider.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `spacing` | Enumeration 🎨 | ✗ | ✗ | Small spacing, Medium spacing, Large spacing (default: Medium spacing) |
| `style` | Enumeration 🎨 | ✗ | ✗ | Solid line, Dashed line, Dotted line, Double line, Gradient line (default: Solid line) |
| `color` | Enumeration 🎨 | ✗ | ✗ | Gray, Primary blue (default: Gray) |

---

#### 14. Button Group (components.button-group)

**Component name:** ButtonGroup ✅ RENAMED
**Location:** `/frontend/src/components/layout/ButtonGroup.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `buttons` | Component (repeatable) 📦 | ✓ | ✗ | Array of button items |

**Repeatable Component: `elements.button`**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `link` | Component (single) | ✓ | ✗ | Use `elements.text-link` (includes text + target) |
| `variant` | Enumeration 🎨 | ✗ | ✗ | Primary, Secondary, Outline, Ghost (default: Primary) |
| `size` | Enumeration 🎨 | ✗ | ✗ | Small, Medium, Large (default: Medium) |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `alignment` | Enumeration 🎨 | ✗ | ✗ | Left aligned, Center aligned, Right aligned (default: Left aligned) |
| `spacing` | Enumeration 🎨 | ✗ | ✗ | Small spacing, Medium spacing, Large spacing (default: Medium spacing) |

---

### 🎛️ INTERACTIVE COMPONENTS (1)

---

#### 15. Expandable Section (components.expandable-section) ⚠️

**Component name:** ExpandableSection ✅ RENAMED
**Client Component:** Uses React hooks for expand/collapse
**Location:** `/frontend/src/components/interactive/ExpandableSection.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✓ | ✗ | Section title |
| `description` | Text (long) | ✗ | ✓ | Section content |
| `contact_name` | Text (short) | ✗ | ✓ | Contact person name |
| `contact_email` | Email | ✗ | ✓ | Contact email |
| `contact_phone` | Text (short) | ✗ | ✓ | Contact phone |
| `files` | Component (repeatable) 📦 | ✗ | ✓ | Array of file attachments |
| `default_open` | Boolean | ✗ | ✗ | Default: false (Initially expanded / Initially collapsed) |

**Repeatable Component: `elements.file-attachment`**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `name` | Text (short) | ✓ | ✗ | File display name |
| `file` | Media (single) | ✓ | ✗ | The actual file |
| `size` | Text (short) | ✗ | ✓ | e.g., "245 KB" |

**Note:** Consider splitting contact info into a separate component for reusability.

---

## ❌ Components NOT Recommended for Dynamic Zone (11)

### UI Primitives (4)
- **Button** - Building block used within other components
- **Card** - Container component, not standalone content
- **Badge** - Small UI element, typically used within other components
- **Input** - Form element, not suitable for dynamic zones

### Forms (4)
- **ContactForm** - Complex form with state management, requires custom integration
- **Select** - Form element, not standalone content
- **Checkbox** - Form element, not standalone content
- **Radio** - Form element, not standalone content

### Global Layout (2)
- **Header** - Global navigation component, not page-specific content
- **Footer** - Global footer component, not page-specific content

### Other (1)
- **Modal** - Requires complex state management and triggers, not suitable for CMS-driven content
- **SidePanel** - Layout wrapper for page structure, not dynamic content

---

## 📝 Implementation Notes

### Text Link Element Structure

**`elements.text-link`** is a reusable component that combines clickable text with a link target. It includes:

**Fields:**
- `text` (string, required) - The clickable text displayed to user
- `page` (relation, optional) - Link to internal page (priority 1)
- `url` (string, optional) - External URL (priority 2)
- `file` (media, optional) - File download (priority 3)
- `anchor` (string, optional) - Anchor/hash only (priority 4)
- `disabled` (boolean, default: false) - Disable the link

**Usage:** Whenever a component needs a clickable link with text, use `elements.text-link` instead of separate `text` + `link` fields. This provides consistent link handling across all components.

---

### Media Field Implementation

**IMPORTANT:** All file and image uploads should use Strapi's native **Media (single)** or **Media (multiple)** field types directly. DO NOT create custom elements or components for file handling.

**Examples:**
- ✅ `image` field → Media (single)
- ✅ `file` field → Media (single)
- ✅ `logo` field → Media (single)
- ✅ `photo` field → Media (single)
- ✅ `background_image` field → Media (single)
- ❌ DO NOT create `elements.file` component
- ❌ DO NOT create `elements.image` component

**Why:** Strapi's Media library provides built-in file management, metadata extraction, and URL generation. Custom components would duplicate this functionality unnecessarily.

---

### Icon Field Implementation in Strapi

For icon fields, use a **oneToOne relation** to the `api::icon.icon` content type:

```json
{
  "icon": {
    "type": "relation",
    "relation": "oneToOne",
    "target": "api::icon.icon"
  }
}
```

**Icon Content Type Structure** (`api::icon.icon`):
- `name` (string, required) - Icon identifier for CMS management
- `image` (media, required) - Icon image file (SVG/PNG recommended)

**Why this approach:**
- ✅ Allows custom icon uploads without code changes
- ✅ Full control over icon design and branding
- ✅ Better performance with optimized image formats
- ✅ No dependency on external icon libraries
- ✅ Supports SVG, PNG, and other image formats

**Frontend handling:**
Icons are rendered as `<Image>` components using Next.js Image optimization, with the URL extracted from `icon.image.attributes.url`.

---

### Reusable Elements (Create These First)

Before creating the main components, define these reusable elements:

1. **elements.text-link** - Already exists ✅ (text + link target: page/url/file/anchor + disabled flag)
2. **elements.service-card** - Already exists ✅ (icon, title, description, link)
3. **elements.full-width-card** - Already exists ✅ (icon, title, description, link - required)
4. **elements.document-item** - For documents component
5. **elements.partner-logo** - For partner logos
6. **elements.marketing-argument** - For marketing arguments
7. **elements.timeline-item** - For timeline
8. **elements.slide** - For slider
9. **elements.photo** - For photo gallery and gallery slider
10. **elements.opening-hours** - For doctor profile
11. **elements.direction-step** - For directions component
12. **elements.button** - For button group
13. **elements.file-attachment** - For expandable section

---

### Priority Order Recommendation

**Phase 1 - Essential Content (Quick Wins):**
1. ✅ Full Width Cards (COMPLETED)
2. Section Divider (simplest)
3. Documents
4. Contact Card
5. News Article
6. Marketing Arguments
7. Partner Logos
8. Button Group
9. Photo Gallery
10. Gallery Slider
11. Slider
12. Timeline
13. Directions
14. Doctor Profile
15. Job Posting
16. Expandable Section

---

## ✅ Checklist Template

For each component you implement, verify:

- [ ] Component created in Strapi admin under "Components"
- [ ] All fields defined with correct types
- [ ] Required/optional settings configured
- [ ] Enum values use business-friendly names
- [ ] Repeatable components created first
- [ ] Component added to Content Type (page.content or page.sidebar)
- [ ] TypeScript interface added to `frontend/src/types/strapi.ts`
- [ ] Union type updated (`PageContentComponent` or `PageSidebarComponent`)
- [ ] Population query updated in `frontend/src/lib/strapi.ts`
- [ ] Case added to DynamicZone switch statement in `frontend/src/components/strapi/DynamicZone.tsx`
- [ ] Component tested on a page in Strapi admin
- [ ] Frontend build successful (`npm run build`)
- [ ] Component renders correctly on frontend

