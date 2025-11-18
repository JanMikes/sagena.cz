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

## ✅ Currently Integrated Components (21)

These components are already implemented in the dynamic zone:

1. **components.heading** → Heading
2. **components.text** → RichText
3. **components.alert** → Alert
4. **components.links-list** → LinksList
5. **components.video** → Video
6. **components.service-cards** → ServiceCards (uses `elements.service-card`)
7. **components.full-width-cards** → FullWidthCards (uses `elements.full-width-card`)
8. **components.documents** → Documents (uses `elements.document-item`)
9. **components.job-posting** → JobPosting
10. **components.partner-logos** → PartnerLogos (uses `elements.partner-logo`)
11. **components.marketing-arguments** → MarketingArguments (uses `elements.marketing-argument`)
12. **components.timeline** → Timeline (uses `elements.timeline-item`)
13. **components.section-divider** → SectionDivider
14. **components.slider** → Slider (uses `elements.slide`)
15. **components.gallery-slider** → GallerySlider (uses `elements.photo`)
16. **components.photo-gallery** → PhotoGallery (uses `elements.photo`)
17. **components.directions** → Directions (uses `elements.direction-step`)
18. **components.expandable-section** → ExpandableSection (uses `elements.file-attachment`)
19. **components.button-group** → ButtonGroup (uses `elements.button`)
20. **components.contact-cards** → ContactCards (uses `elements.contact-card`, `elements.person`)
21. **components.doctor-profile** → DoctorProfile (uses `elements.doctor-profile`, `elements.person`, `elements.opening-hours`, `elements.holiday`)

---

## 🎯 Priority Components to Add (1)

### 📄 CONTENT COMPONENTS (1)

---

#### 1. News Article (components.news-article)

**Component name:** NewsArticle ✅ RENAMED
**Location:** `/frontend/src/components/content/NewsArticle.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✓ | ✗ | Article headline |
| `date` | Date | ✓ | ✗ | Publication date |
| `text` | Text (long) | ✓ | ✗ | Article excerpt/preview |
| `image` | Media (single) | ✗ | ✓ | Featured image (Strapi provides alt text, dimensions, url) |
| `read_more_link` | Component (single) | ✓ | ✗ | Use `elements.text-link` (includes text + target, default text: "Číst více") |

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

**Strapi v5 Media Structure (No `attributes` wrapper):**
```json
{
  "id": 1,
  "documentId": "abc123",
  "url": "/uploads/file.pdf",
  "name": "file.pdf",
  "ext": ".pdf",
  "size": 1.27,          // In KB
  "mime": "application/pdf",
  "width": null,         // For images only
  "height": null,        // For images only
  "alternativeText": "", // Optional, from Strapi upload
  "caption": ""          // Optional, from Strapi upload
}
```

**DO NOT create redundant fields:**
- ❌ `alt_text` - Already in media.alternativeText
- ❌ `caption` - Already in media.caption
- ❌ `size` - Already in media.size
- ❌ `extension` - Already in media.ext
- ❌ `width` / `height` - Already in media.width / media.height

**Only create additional fields when:**
- ✅ Human-friendly display name differs from filename (e.g., `name` field for documents)
- ✅ Business-specific metadata not in Strapi media (e.g., `grayscale` boolean for logos)

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

### Reusable Elements (All Created ✅)

All reusable elements have been created:

1. **elements.text-link** ✅ (text + link target: page/url/file/anchor + disabled flag)
2. **elements.service-card** ✅ (icon, title, description, link)
3. **elements.full-width-card** ✅ (icon, title, description, link - required)
4. **elements.document-item** ✅ (name, file [media - ext & size auto-extracted])
5. **elements.partner-logo** ✅ (name, logo [media], url)
6. **elements.marketing-argument** ✅ (display_type, icon/number, title, description)
7. **elements.timeline-item** ✅ (display_type, icon/number, title, description)
8. **elements.slide** ✅ (title, description, link, image [media], background_image [media])
9. **elements.photo** ✅ (image [media only])
10. **elements.direction-step** ✅ (icon, floor, text)
11. **elements.file-attachment** ✅ (name, file [media - ext & size auto-extracted])
12. **elements.button** ✅ (link, variant, size)
13. **elements.contact-card** ✅ (person relation via elements.person)
14. **elements.person** ✅ (relation to api::person.person content type)
15. **elements.doctor-profile** ✅ (person, ambulanceTitle, department, positions, phones, emails, openingHours, holiday)
16. **elements.opening-hours** ✅ (day, time)
17. **elements.holiday** ✅ (from, to)

---

### Priority Order Recommendation

**Phase 1 - Essential Content (Quick Wins):**
1. ✅ Full Width Cards (COMPLETED)
2. ✅ Documents (COMPLETED)
3. ✅ Job Posting (COMPLETED)
4. ✅ Partner Logos (COMPLETED)
5. ✅ Marketing Arguments (COMPLETED)
6. ✅ Timeline (COMPLETED)
7. ✅ Section Divider (COMPLETED)
8. ✅ Slider (COMPLETED)
9. ✅ Gallery Slider (COMPLETED)
10. ✅ Photo Gallery (COMPLETED)
11. ✅ Directions (COMPLETED)
12. ✅ Expandable Section (COMPLETED)
13. ✅ Button Group (COMPLETED)
14. ✅ Contact Cards (COMPLETED)
15. ✅ Doctor Profile (COMPLETED)
16. News Article

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

