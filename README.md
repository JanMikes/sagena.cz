# Sagena - Modern Healthcare Website

A modern, beautiful, and responsive healthcare website built with Next.js 14, TypeScript, Tailwind CSS, and Lucide icons.

## Overview

Sagena is a comprehensive healthcare center website featuring a clean, professional design appropriate for the medical industry. The site showcases medical services, doctors, and provides an intuitive user experience for patients seeking healthcare information and appointments.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom healthcare design system
- **Icons**: Lucide React
- **Deployment Ready**: Optimized for Vercel or any Node.js hosting

## Features

### Design System
- Custom healthcare-focused color palette (professional blues and greens)
- Responsive typography scale
- Consistent spacing and shadows
- Smooth animations and transitions
- Mobile-first responsive design

### Components

#### UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost) with sizes
- **Input**: Form input with validation states and labels
- **Card**: Reusable card component with hover effects
- **Badge**: Status and category badges

#### Layout Components
- **Header**: Sticky navigation with mobile menu
- **Footer**: Multi-section footer with newsletter, links, and insurance logos
- **Navigation**: Responsive menu system

#### Section Components
- **Hero**: Eye-catching hero section with gradient and animations
- **ServiceCard**: Hover-enabled service cards with icons
- **DoctorCard**: Professional doctor profile cards
- **ContactBlock**: Structured contact information display
- **FeatureGrid**: Grid layout for feature highlights
- **StatsSection**: Statistics display component

### Pages

#### Homepage (`/`)
- Hero section with call-to-actions
- Feature highlights (team, equipment, hours, insurance)
- Services grid showcasing 4 main categories
- Statistics section (20+ offices, 50+ doctors, etc.)
- Doctor profiles preview
- Contact information and map placeholder

#### Ordinace (Medical Offices) (`/ordinace`)
- Comprehensive list of 12+ medical specialties
- Cardiology, Neurology, Ophthalmology, ORL, Orthopedics, Gynecology, etc.
- Each specialty with icon, description, and link to detail page
- Appointment booking information

#### Kontakt (Contact) (`/kontakt`)
- Contact information with opening hours
- Department-specific contacts (offices, rehabilitation, pharmacy)
- Contact form with GDPR compliance
- Map placeholder for Google Maps integration
- Emergency contact section (155, 112)

## Project Structure

```
sagena/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles with Tailwind
│   │   ├── layout.tsx           # Root layout with Header/Footer
│   │   ├── page.tsx             # Homepage
│   │   ├── ordinace/
│   │   │   └── page.tsx         # Medical offices listing
│   │   └── kontakt/
│   │       └── page.tsx         # Contact page
│   └── components/
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Card.tsx
│       │   └── Badge.tsx
│       ├── layout/
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       └── sections/
│           ├── Hero.tsx
│           ├── ServiceCard.tsx
│           ├── DoctorCard.tsx
│           ├── ContactBlock.tsx
│           ├── FeatureGrid.tsx
│           └── StatsSection.tsx
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── package.json
├── COMPONENTS.md                # Detailed component analysis
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Design Philosophy

### Healthcare-Appropriate Design
- **Professional**: Clean, minimal design that inspires trust
- **Accessible**: High contrast, readable fonts, clear navigation
- **Friendly**: Warm colors and welcoming imagery
- **Modern**: Contemporary design patterns and smooth interactions

### Color Palette

**Primary (Medical Blue)**
- Used for primary actions, links, and key UI elements
- Conveys professionalism and trust

**Medical Green**
- Secondary actions and success states
- Represents health and wellness

**Neutrals**
- Grayscale palette for text, backgrounds, and borders
- Ensures readability and hierarchy

### Typography
- **Inter font family**: Modern, readable sans-serif
- **Heading scale**: 6 levels with consistent sizing
- **Body text**: Optimized line height for readability

### Spacing
- **Base unit**: 4px
- **Consistent scale**: xs (4px) to 4xl (96px)
- **Section padding**: 64px-96px vertical

## Component Usage Examples

### Button
```tsx
<Button variant="primary" size="lg" href="/objednat">
  Objednat se
</Button>
```

### Service Card
```tsx
<ServiceCard
  title="Kardiologie"
  description="Komplexní diagnostika a léčba srdečních onemocnění"
  icon={Heart}
  href="/ordinace/kardiologie"
  badge="20+ specializací"
/>
```

### Doctor Card
```tsx
<DoctorCard
  name="Jan Novák"
  title="MUDr."
  specialization="Kardiologie"
  email="novak@sagena.cz"
  phone="+420 553 030 810"
  badges={['Kardiolog', 'Interní lékařství']}
/>
```

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette:
```typescript
colors: {
  primary: { /* your colors */ },
  medical: { /* your colors */ },
}
```

### Typography
Adjust font sizes in `src/app/globals.css`:
```css
.heading-1 {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold;
}
```

### Content
Update content in page files (`src/app/*/page.tsx`)

## Future Enhancements

- [ ] Google Maps integration
- [ ] Online appointment booking system
- [ ] Patient portal/login
- [ ] News/blog functionality
- [ ] Image gallery with actual photos
- [ ] Multi-language support (Czech/English)
- [ ] Search functionality
- [ ] Cookie consent manager
- [ ] Analytics integration
- [ ] Performance optimization (Image optimization, lazy loading)

## SEO Optimization

The site is built with SEO in mind:
- Semantic HTML structure
- Meta tags in layout.tsx
- Server-side rendering with Next.js
- Clean URLs
- Fast loading times
- Mobile-responsive

## Accessibility

- WCAG 2.1 compliant color contrasts
- Keyboard navigation support
- Screen reader friendly
- Focus states on interactive elements
- Proper heading hierarchy
- Alt text for images (to be added with real content)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Sagena Healthcare Center

## Contact

For questions or support regarding this website:
- Email: info@sagena.cz
- Phone: +420 553 030 800

---

Built with ❤️ for Sagena Healthcare Center
