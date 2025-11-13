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

## ✅ Currently Integrated Components (5)

These components are already implemented in the dynamic zone:

1. **components.heading** → Heading
2. **components.text** → RichText
3. **components.alert** → Alert
4. **components.links-list** → LinksList
5. **components.video** → Video

---

## 🎯 Priority Components to Add (20)

### 📄 CONTENT COMPONENTS (6)

---

#### 1. Service Cards (components.service-cards)

**Component name:** ServiceCards ✅ RENAMED
**Location:** `/frontend/src/components/content/ServiceCards.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `cards` | Component (repeatable) 📦 | ✓ | ✗ | Array of card items |

**Repeatable Component: `elements.service-card`**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `icon` | Enumeration 🎨 | ✓ | ✗ | Heart, Activity, Stethoscope, Users, Calendar, FileText, Building, Shield, Clock, CheckCircle, Phone, Mail, MapPin, Briefcase |
| `title` | Text (short) | ✓ | ✗ | |
| `description` | Text (long) | ✗ | ✓ | |
| `link_text` | Text (short) | ✓ | ✗ | e.g., "Zjistit více" |
| `link` | Component (single) | ✓ | ✗ | Use `elements.text-link` |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `columns` | Enumeration 🎨 | ✗ | ✗ | Two columns, Three columns, Four columns (default: Three columns) |

---

#### 2. Full Width Cards (components.full-width-cards)

**Location:** `/frontend/src/components/content/FullWidthCards.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `cards` | Component (repeatable) 📦 | ✓ | ✗ | Array of full-width card items |

**Repeatable Component: `elements.full-width-card`**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `icon` | Enumeration 🎨 | ✓ | ✗ | Calendar, FileText, Users, Phone, Mail, MapPin, Briefcase, Heart, Activity, Stethoscope, Building |
| `title` | Text (short) | ✓ | ✗ | |
| `description` | Text (long) | ✓ | ✗ | |
| `link` | Component (single) | ✓ | ✗ | Use `elements.text-link` |

---

#### 3. Documents (components.documents)

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

#### 4. News Article (components.news-article)

**Component name:** NewsArticle ✅ RENAMED
**Location:** `/frontend/src/components/content/NewsArticle.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `title` | Text (short) | ✓ | ✗ | Article headline |
| `date` | Date | ✓ | ✗ | Publication date |
| `text` | Text (long) | ✓ | ✗ | Article excerpt/preview |
| `image` | Media (single) | ✗ | ✓ | Featured image |
| `read_more_link` | Component (single) | ✓ | ✗ | Use `elements.text-link` |
| `read_more_text` | Text (short) | ✗ | ✓ | Default: "Číst více" |

---

#### 5. Job Posting (components.job-posting)

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
| `cta_text` | Text (short) | ✗ | ✓ | Default: "Zobrazit pozici" |
| `cta_link` | Component (single) | ✓ | ✗ | Use `elements.text-link` |

---

#### 6. Partner Logos (components.partner-logos)

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

#### 7. Marketing Arguments (components.marketing-arguments)

**Location:** `/frontend/src/components/marketing/MarketingArguments.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `arguments` | Component (repeatable) 📦 | ✓ | ✗ | Array of argument items |

**Repeatable Component: `elements.marketing-argument`**

| Field Name | Type | Required | Nullable | Options/Notes |
|------------|------|----------|----------|---------------|
| `display_type` | Enumeration 🎨 | ✓ | ✗ | Icon, Number |
| `icon` | Enumeration 🎨 | ✗ | ✓ | Users, Heart, Activity, Shield, Award, TrendingUp, Target, Clock, CheckCircle (required if display_type = Icon) |
| `number` | Text (short) | ✗ | ✓ | e.g., "15+", "100%" (required if display_type = Number) |
| `title` | Text (short) | ✓ | ✗ | |
| `description` | Text (long) | ✓ | ✗ | |

**Settings:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `columns` | Enumeration 🎨 | ✗ | ✗ | Two columns, Three columns, Four columns (default: Three columns) |

**Note:** Either `icon` OR `number` should be provided based on `display_type`, not both.

---

#### 8. Timeline (components.timeline)

**Location:** `/frontend/src/components/marketing/Timeline.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `items` | Component (repeatable) 📦 | ✓ | ✗ | Array of timeline steps |

**Repeatable Component: `elements.timeline-item`**

| Field Name | Type | Required | Nullable | Options/Notes |
|------------|------|----------|----------|---------------|
| `display_type` | Enumeration 🎨 | ✓ | ✗ | Icon, Number |
| `icon` | Enumeration 🎨 | ✗ | ✓ | Calendar, CheckCircle, ClipboardCheck, FileText, UserCheck, Phone, Mail, Activity (required if display_type = Icon) |
| `number` | Text (short) | ✗ | ✓ | e.g., "1", "2", "3" (required if display_type = Number) |
| `title` | Text (short) | ✓ | ✗ | |
| `description` | Text (long) | ✓ | ✗ | |

**Note:** Either `icon` OR `number` should be provided based on `display_type`, not both.

---

#### 9. Slider (components.slider) ⚠️

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
| `link_text` | Text (short) | ✗ | ✓ | Button text |
| `link` | Component (single) | ✗ | ✓ | Use `elements.text-link` |
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

#### 10. Photo Gallery (components.photo-gallery) ⚠️

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

#### 11. Gallery Slider (components.gallery-slider) ⚠️

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

#### 12. Doctor Profile (components.doctor-profile) ⚠️

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

#### 13. Contact Card (components.contact-card)

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

#### 14. Directions (components.directions)

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
| `icon` | Enumeration 🎨 | ✓ | ✗ | DoorOpen, ArrowUp, ArrowDown, MapPin, Building, Stairs, Elevator, ArrowRight |
| `floor` | Text (short) | ✗ | ✓ | e.g., "1. patro", "2. patro, č. 215" |
| `text` | Text (long) | ✓ | ✗ | Instruction text |

---

#### 15. Section Divider (components.section-divider)

**Component name:** SectionDivider ✅ RENAMED
**Location:** `/frontend/src/components/layout/SectionDivider.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `spacing` | Enumeration 🎨 | ✗ | ✗ | Small spacing, Medium spacing, Large spacing (default: Medium spacing) |
| `style` | Enumeration 🎨 | ✗ | ✗ | Solid line, Dashed line, Dotted line, Double line, Gradient line (default: Solid line) |
| `color` | Enumeration 🎨 | ✗ | ✗ | Gray, Primary blue (default: Gray) |

---

#### 16. Button Group (components.button-group)

**Component name:** ButtonGroup ✅ RENAMED
**Location:** `/frontend/src/components/layout/ButtonGroup.tsx`

**Fields:**

| Field Name | Type | Required | Nullable | Notes |
|------------|------|----------|----------|-------|
| `buttons` | Component (repeatable) 📦 | ✓ | ✗ | Array of button items |

**Repeatable Component: `elements.button`**

| Field Name | Type | Required | Nullable | Options |
|------------|------|----------|----------|---------|
| `text` | Text (short) | ✓ | ✗ | Button label |
| `link` | Component (single) | ✗ | ✓ | Use `elements.text-link` |
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

#### 17. Expandable Section (components.expandable-section) ⚠️

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

### Icon Field Implementation in Strapi

For icon fields, create an **Enumeration** type with the following values:

**Healthcare/General Icons:**
- Heart
- Activity
- Stethoscope
- Users
- Calendar
- FileText
- Building
- Shield
- Clock
- CheckCircle
- Phone
- Mail
- MapPin
- Briefcase
- Award
- TrendingUp
- Target
- UserCheck
- ClipboardCheck

**Navigation Icons:**
- DoorOpen
- ArrowUp
- ArrowDown
- ArrowRight
- Stairs
- Elevator

These map to `lucide-react` icon components in the frontend.

---

### Reusable Elements (Create These First)

Before creating the main components, define these reusable elements:

1. **elements.text-link** - Already exists (used by links-list)
2. **elements.service-card** - For service cards component
3. **elements.full-width-card** - For full-width cards
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
1. Section Divider (simplest)
2. Documents
3. Contact Card
4. News Article
5. Service Cards
6. Full Width Cards
7. Marketing Arguments
8. Partner Logos
9. Button Group
10. Photo Gallery
11. Gallery Slider
12. Slider
13. Timeline
14. Directions
16. Doctor Profile
17. Job Posting
18. Expandable Section

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

